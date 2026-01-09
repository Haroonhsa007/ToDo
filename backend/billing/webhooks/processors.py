"""
Webhook event processors for different Polar.sh event types
"""

import logging
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from ..models import Subscription, PolarCustomer, WebhookEvent

logger = logging.getLogger(__name__)


def process_webhook_event(webhook_event: WebhookEvent):
    """
    Process a webhook event based on its type

    Args:
        webhook_event: WebhookEvent instance to process
    """
    event_type = webhook_event.event_type
    payload = webhook_event.payload

    # Route to appropriate handler based on event type
    handlers = {
        'subscription.created': handle_subscription_created,
        'subscription.updated': handle_subscription_updated,
        'subscription.active': handle_subscription_active,
        'subscription.canceled': handle_subscription_canceled,
        'subscription.revoked': handle_subscription_revoked,
        'order.created': handle_order_created,
        'checkout.created': handle_checkout_created,
        'checkout.updated': handle_checkout_updated,
    }

    handler = handlers.get(event_type)
    if handler:
        logger.info(f"Processing {event_type} event")
        handler(payload)
    else:
        logger.warning(f"No handler for event type: {event_type}")


def handle_subscription_created(payload):
    """Handle subscription.created event"""
    try:
        data = payload.get('data', {})
        subscription_id = data.get('id')
        customer_id = data.get('customer_id')
        product_id = data.get('product_id')
        price_id = data.get('price_id')
        status = data.get('status', 'incomplete')

        logger.info(f"Processing subscription.created: {subscription_id}")

        # Find or create customer
        customer = _get_or_create_customer(data.get('customer', {}))

        # Find subscription by polar_subscription_id
        subscription = Subscription.objects.filter(
            polar_subscription_id=subscription_id
        ).first()

        if subscription:
            # Update existing subscription
            subscription.status = status
            subscription.current_period_start = parse_datetime(data.get('current_period_start'))
            subscription.current_period_end = parse_datetime(data.get('current_period_end'))
            subscription.save()
            logger.info(f"Updated subscription {subscription_id}")
        else:
            logger.info(f"Subscription {subscription_id} not found locally (may be created via checkout)")

    except Exception as e:
        logger.error(f"Error handling subscription.created: {str(e)}")
        raise


def handle_subscription_updated(payload):
    """Handle subscription.updated event"""
    try:
        data = payload.get('data', {})
        subscription_id = data.get('id')
        status = data.get('status')

        logger.info(f"Processing subscription.updated: {subscription_id}")

        subscription = Subscription.objects.filter(
            polar_subscription_id=subscription_id
        ).first()

        if subscription:
            subscription.status = status
            subscription.current_period_start = parse_datetime(data.get('current_period_start'))
            subscription.current_period_end = parse_datetime(data.get('current_period_end'))
            subscription.cancel_at_period_end = data.get('cancel_at_period_end', False)

            if data.get('canceled_at'):
                subscription.canceled_at = parse_datetime(data['canceled_at'])

            if data.get('ended_at'):
                subscription.ended_at = parse_datetime(data['ended_at'])

            subscription.save()
            logger.info(f"Updated subscription {subscription_id} to status {status}")
        else:
            logger.warning(f"Subscription {subscription_id} not found")

    except Exception as e:
        logger.error(f"Error handling subscription.updated: {str(e)}")
        raise


def handle_subscription_active(payload):
    """Handle subscription.active event - Grant access"""
    try:
        data = payload.get('data', {})
        subscription_id = data.get('id')

        logger.info(f"Processing subscription.active: {subscription_id}")

        subscription = Subscription.objects.filter(
            polar_subscription_id=subscription_id
        ).first()

        if subscription:
            subscription.status = 'active'
            subscription.current_period_start = parse_datetime(data.get('current_period_start'))
            subscription.current_period_end = parse_datetime(data.get('current_period_end'))
            subscription.save()
            logger.info(f"Subscription {subscription_id} is now active - Grant access")

            # TODO: Implement access granting logic here
            # For example, update user permissions, send welcome email, etc.

        else:
            logger.warning(f"Subscription {subscription_id} not found")

    except Exception as e:
        logger.error(f"Error handling subscription.active: {str(e)}")
        raise


def handle_subscription_canceled(payload):
    """Handle subscription.canceled event - Grace period"""
    try:
        data = payload.get('data', {})
        subscription_id = data.get('id')

        logger.info(f"Processing subscription.canceled: {subscription_id}")

        subscription = Subscription.objects.filter(
            polar_subscription_id=subscription_id
        ).first()

        if subscription:
            subscription.status = 'canceled'
            subscription.canceled_at = parse_datetime(data.get('canceled_at')) or timezone.now()
            subscription.cancel_at_period_end = True
            subscription.save()
            logger.info(f"Subscription {subscription_id} canceled - Grace period until {subscription.current_period_end}")

            # TODO: Implement cancellation notification logic
            # User still has access until current_period_end

        else:
            logger.warning(f"Subscription {subscription_id} not found")

    except Exception as e:
        logger.error(f"Error handling subscription.canceled: {str(e)}")
        raise


def handle_subscription_revoked(payload):
    """Handle subscription.revoked event - Revoke access immediately"""
    try:
        data = payload.get('data', {})
        subscription_id = data.get('id')

        logger.info(f"Processing subscription.revoked: {subscription_id}")

        subscription = Subscription.objects.filter(
            polar_subscription_id=subscription_id
        ).first()

        if subscription:
            subscription.status = 'revoked'
            subscription.ended_at = parse_datetime(data.get('ended_at')) or timezone.now()
            subscription.save()
            logger.info(f"Subscription {subscription_id} revoked - Access removed immediately")

            # TODO: Implement access revocation logic here
            # Immediately revoke user permissions, disable features, etc.

        else:
            logger.warning(f"Subscription {subscription_id} not found")

    except Exception as e:
        logger.error(f"Error handling subscription.revoked: {str(e)}")
        raise


def handle_order_created(payload):
    """Handle order.created event"""
    try:
        data = payload.get('data', {})
        order_id = data.get('id')

        logger.info(f"Processing order.created: {order_id}")

        # TODO: Implement order tracking if needed
        # For subscriptions, this is usually followed by subscription.created

    except Exception as e:
        logger.error(f"Error handling order.created: {str(e)}")
        raise


def handle_checkout_created(payload):
    """Handle checkout.created event"""
    try:
        data = payload.get('data', {})
        checkout_id = data.get('id')

        logger.info(f"Processing checkout.created: {checkout_id}")

        # Checkout created, waiting for customer to complete payment
        # No action needed here, subscription will be created after payment

    except Exception as e:
        logger.error(f"Error handling checkout.created: {str(e)}")
        raise


def handle_checkout_updated(payload):
    """Handle checkout.updated event"""
    try:
        data = payload.get('data', {})
        checkout_id = data.get('id')
        status = data.get('status')

        logger.info(f"Processing checkout.updated: {checkout_id} - Status: {status}")

        # Checkout status changed
        # If status is 'succeeded', subscription should be created via subscription.created event

    except Exception as e:
        logger.error(f"Error handling checkout.updated: {str(e)}")
        raise


def _get_or_create_customer(customer_data):
    """
    Get or create a PolarCustomer from webhook data

    Args:
        customer_data: Customer data from webhook payload

    Returns:
        PolarCustomer instance
    """
    try:
        polar_customer_id = customer_data.get('id')
        external_customer_id = customer_data.get('external_customer_id')
        email = customer_data.get('email')
        name = customer_data.get('name', '')

        if not polar_customer_id:
            logger.warning("Customer data missing 'id'")
            return None

        # Try to find customer by polar_customer_id
        customer = PolarCustomer.objects.filter(
            polar_customer_id=polar_customer_id
        ).first()

        if customer:
            return customer

        # Try to find by external_customer_id
        if external_customer_id:
            customer = PolarCustomer.objects.filter(
                external_customer_id=external_customer_id
            ).first()

            if customer:
                # Update polar_customer_id
                customer.polar_customer_id = polar_customer_id
                customer.save(update_fields=['polar_customer_id'])
                return customer

        logger.warning(f"Customer {polar_customer_id} not found in local database")
        return None

    except Exception as e:
        logger.error(f"Error getting/creating customer: {str(e)}")
        return None
