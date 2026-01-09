"""
API views for billing
"""

import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from billing.models import PolarProduct, PolarPrice, Subscription, PolarCustomer
from billing.services import PolarSyncService
from .serializers import (
    PolarProductSerializer,
    PolarPriceSerializer,
    SubscriptionSerializer,
    PolarCustomerSerializer,
    CreateCheckoutSerializer,
)

logger = logging.getLogger(__name__)


class ProductListView(APIView):
    """
    List all available products and their prices
    """

    permission_classes = []  # Public endpoint

    def get(self, request):
        """Get all non-archived products with synced prices"""
        products = PolarProduct.objects.filter(
            is_archived=False,
            sync_status='synced'
        ).prefetch_related('prices')

        serializer = PolarProductSerializer(products, many=True)
        return Response(serializer.data)


class MySubscriptionsView(APIView):
    """
    Get current user's subscriptions
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all subscriptions for the current user"""
        try:
            # Get or create Polar customer for the user
            customer, created = PolarCustomer.objects.get_or_create(
                user=request.user,
                defaults={
                    'email': request.user.email,
                    'name': request.user.name or request.user.username,
                }
            )

            # Get all subscriptions
            subscriptions = Subscription.objects.filter(
                customer=customer
            ).select_related('product', 'price')

            serializer = SubscriptionSerializer(subscriptions, many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error fetching subscriptions: {str(e)}")
            return Response(
                {'error': 'Failed to fetch subscriptions'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateCheckoutView(APIView):
    """
    Create a checkout session for a product
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create a checkout session"""
        serializer = CreateCheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            product_id = serializer.validated_data['product_id']
            price_id = serializer.validated_data['price_id']

            # Get product and price
            product = PolarProduct.objects.get(id=product_id)
            price = PolarPrice.objects.get(id=price_id)

            # Get or create Polar customer for the user
            customer, created = PolarCustomer.objects.get_or_create(
                user=request.user,
                defaults={
                    'email': request.user.email,
                    'name': request.user.name or request.user.username,
                }
            )

            # Create subscription record
            subscription = Subscription.objects.create(
                customer=customer,
                product=product,
                price=price,
                status='incomplete',
            )

            # Sync to Polar (creates checkout session)
            sync_service = PolarSyncService()
            success = sync_service.sync_subscription(subscription)

            if success:
                # Get checkout URL from metadata
                checkout_url = subscription.metadata.get('checkout_url')

                if checkout_url:
                    return Response({
                        'checkout_url': checkout_url,
                        'subscription_id': subscription.id,
                    })
                else:
                    return Response(
                        {'error': 'Failed to create checkout session'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                # Sync failed
                return Response(
                    {
                        'error': 'Failed to create checkout session',
                        'details': subscription.sync_error
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            logger.error(f"Error creating checkout: {str(e)}")
            return Response(
                {'error': f'Failed to create checkout: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CancelSubscriptionView(APIView):
    """
    Cancel a subscription
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, subscription_id):
        """Cancel a subscription"""
        try:
            # Get subscription
            subscription = Subscription.objects.get(
                id=subscription_id,
                customer__user=request.user
            )

            # Check if subscription is active
            if not subscription.is_active():
                return Response(
                    {'error': 'Subscription is not active'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Mark for cancellation at period end
            subscription.cancel_at_period_end = True
            subscription.status = 'canceled'
            subscription.save()

            # TODO: Call Polar API to cancel subscription on Polar side

            return Response({
                'message': 'Subscription will be canceled at the end of the billing period',
                'current_period_end': subscription.current_period_end,
            })

        except Subscription.DoesNotExist:
            return Response(
                {'error': 'Subscription not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error canceling subscription: {str(e)}")
            return Response(
                {'error': 'Failed to cancel subscription'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubscriptionStatusView(APIView):
    """
    Check if user has an active subscription
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Check if user has any active subscriptions"""
        try:
            customer = PolarCustomer.objects.filter(user=request.user).first()

            if not customer:
                return Response({
                    'has_active_subscription': False,
                    'subscriptions': []
                })

            # Get active subscriptions
            active_subscriptions = Subscription.objects.filter(
                customer=customer,
                status__in=['active', 'trialing']
            ).select_related('product', 'price')

            has_active = active_subscriptions.exists()

            serializer = SubscriptionSerializer(active_subscriptions, many=True)

            return Response({
                'has_active_subscription': has_active,
                'subscriptions': serializer.data
            })

        except Exception as e:
            logger.error(f"Error checking subscription status: {str(e)}")
            return Response(
                {'error': 'Failed to check subscription status'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
