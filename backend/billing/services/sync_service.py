"""
Service for syncing billing data between Django and Polar.sh
"""

import logging
from django.conf import settings
from django.utils import timezone
from polar_sdk import Polar

from .polar_client import get_polar_client
from ..models import PolarProduct, PolarPrice, Subscription, PolarCustomer

logger = logging.getLogger(__name__)


class PolarSyncService:
    """
    Service to sync products, prices, and subscriptions between Django and Polar.sh
    """

    def __init__(self):
        try:
            self.client = get_polar_client()
            self.organization_id = settings.POLAR_ORGANIZATION_ID
        except ValueError as e:
            logger.warning(f"Polar client not configured: {str(e)}")
            self.client = None
            self.organization_id = None

    def sync_product(self, product: PolarProduct) -> bool:
        """
        Sync a PolarProduct instance to Polar.sh

        Args:
            product: PolarProduct instance to sync

        Returns:
            bool: True if sync was successful, False otherwise
        """
        try:
            # Check if client is configured
            if not self.client:
                raise ValueError("Polar SDK is not configured. Please check your settings.")

            # Check if organization ID is configured
            if not self.organization_id:
                raise ValueError("POLAR_ORGANIZATION_ID is not configured in settings")

            # Prepare product data
            product_data = {
                "name": product.name,
                "description": product.description or "",
                "is_recurring": product.is_recurring,
                "is_archived": product.is_archived,
                "organization_id": self.organization_id,
            }

            # If product already has a polar_id, update it; otherwise create new
            if product.polar_id:
                # Update existing product
                logger.info(f"Updating Polar product {product.polar_id}")
                polar_product = self.client.products.update(
                    id=product.polar_id,
                    **product_data
                )
            else:
                # Create new product
                logger.info(f"Creating new Polar product: {product.name}")
                polar_product = self.client.products.create(**product_data)

            # Mark product as synced
            product.mark_synced(polar_product.id)
            logger.info(f"Successfully synced product {product.name} (Polar ID: {polar_product.id})")
            return True

        except Exception as e:
            error_message = f"Failed to sync product: {str(e)}"
            logger.error(error_message)
            product.mark_sync_failed(error_message)
            return False

    def sync_price(self, price: PolarPrice) -> bool:
        """
        Sync a PolarPrice instance to Polar.sh

        Args:
            price: PolarPrice instance to sync

        Returns:
            bool: True if sync was successful, False otherwise
        """
        try:
            # Check if client is configured
            if not self.client:
                raise ValueError("Polar SDK is not configured. Please check your settings.")

            # Product must be synced first
            if not price.product.polar_id:
                raise ValueError(
                    f"Product {price.product.name} must be synced to Polar before syncing price"
                )

            # Prepare price data
            price_data = {
                "product_id": price.product.polar_id,
                "price_amount": price.price_amount,
                "price_currency": price.price_currency,
                "type": price.type,
                "is_archived": price.is_archived,
            }

            # Add recurring interval if it's a recurring price
            if price.type == 'recurring' and price.recurring_interval:
                price_data["recurring_interval"] = price.recurring_interval

            # If price already has a polar_id, update it; otherwise create new
            if price.polar_id:
                # Update existing price
                logger.info(f"Updating Polar price {price.polar_id}")
                polar_price = self.client.products.prices.update(
                    id=price.polar_id,
                    **price_data
                )
            else:
                # Create new price
                logger.info(f"Creating new Polar price for product {price.product.name}")
                polar_price = self.client.products.prices.create(**price_data)

            # Mark price as synced
            price.mark_synced(polar_price.id)
            logger.info(f"Successfully synced price (Polar ID: {polar_price.id})")
            return True

        except Exception as e:
            error_message = f"Failed to sync price: {str(e)}"
            logger.error(error_message)
            price.mark_sync_failed(error_message)
            return False

    def sync_subscription(self, subscription: Subscription) -> bool:
        """
        Sync a Subscription instance to Polar.sh
        Note: This creates a checkout session for the customer to complete payment

        Args:
            subscription: Subscription instance to sync

        Returns:
            bool: True if sync was successful, False otherwise
        """
        try:
            # Check if client is configured
            if not self.client:
                raise ValueError("Polar SDK is not configured. Please check your settings.")

            # Validate that product and price are synced
            if not subscription.product.polar_id:
                raise ValueError(
                    f"Product {subscription.product.name} must be synced to Polar before creating subscription"
                )

            if not subscription.price.polar_id:
                raise ValueError(
                    f"Price for {subscription.product.name} must be synced to Polar before creating subscription"
                )

            # Ensure customer exists in Polar
            customer = subscription.customer
            if not customer.polar_customer_id:
                # Create customer in Polar
                polar_customer = self._create_or_get_polar_customer(customer)
                customer.polar_customer_id = polar_customer.id
                customer.save(update_fields=['polar_customer_id'])

            # Create checkout session for the subscription
            logger.info(f"Creating Polar checkout session for subscription")

            checkout_data = {
                "product_price_id": subscription.price.polar_id,
                "customer_id": customer.polar_customer_id,
            }

            # Add metadata if available
            if subscription.metadata:
                checkout_data["metadata"] = subscription.metadata

            checkout = self.client.checkouts.create(**checkout_data)

            # Store checkout URL in metadata
            subscription.metadata['checkout_url'] = checkout.url
            subscription.metadata['checkout_id'] = checkout.id

            # Mark subscription as pending (waiting for payment)
            # The subscription will be updated via webhooks once payment is completed
            subscription.sync_status = 'synced'
            subscription.last_synced_at = timezone.now()
            subscription.sync_error = ''
            subscription.save(update_fields=['metadata', 'sync_status', 'last_synced_at', 'sync_error'])

            logger.info(f"Successfully created checkout session for subscription: {checkout.url}")
            return True

        except Exception as e:
            error_message = f"Failed to sync subscription: {str(e)}"
            logger.error(error_message)
            subscription.mark_sync_failed(error_message)
            return False

    def _create_or_get_polar_customer(self, customer: PolarCustomer):
        """
        Create or retrieve a Polar customer using external_customer_id

        Args:
            customer: PolarCustomer instance

        Returns:
            Polar customer object
        """
        try:
            # Try to find existing customer by external_customer_id
            customers = self.client.customers.list(
                external_customer_id=customer.external_customer_id
            )

            if customers.items:
                logger.info(f"Found existing Polar customer: {customers.items[0].id}")
                return customers.items[0]

            # Create new customer
            logger.info(f"Creating new Polar customer for user {customer.user.username}")
            polar_customer = self.client.customers.create(
                email=customer.email,
                name=customer.name,
                external_customer_id=customer.external_customer_id,
            )

            logger.info(f"Created Polar customer: {polar_customer.id}")
            return polar_customer

        except Exception as e:
            logger.error(f"Failed to create/get Polar customer: {str(e)}")
            raise

    def get_customer_state(self, customer: PolarCustomer):
        """
        Get customer state from Polar including active subscriptions and benefits

        Args:
            customer: PolarCustomer instance

        Returns:
            dict: Customer state including subscriptions and benefits
        """
        try:
            if not customer.polar_customer_id:
                return {
                    'subscriptions': [],
                    'benefits': [],
                    'error': 'Customer not synced to Polar'
                }

            # Get customer state from Polar
            state = self.client.customers.get_state(
                customer_id=customer.polar_customer_id
            )

            return {
                'subscriptions': state.subscriptions if hasattr(state, 'subscriptions') else [],
                'benefits': state.benefits if hasattr(state, 'benefits') else [],
            }

        except Exception as e:
            logger.error(f"Failed to get customer state: {str(e)}")
            return {
                'subscriptions': [],
                'benefits': [],
                'error': str(e)
            }
