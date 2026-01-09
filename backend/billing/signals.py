"""
Django signals for automatic Polar.sh synchronization
"""

import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import PolarProduct, PolarPrice, Subscription
from .services import PolarSyncService

logger = logging.getLogger(__name__)


@receiver(post_save, sender=PolarProduct)
def sync_product_to_polar(sender, instance, created, **kwargs):
    """
    Automatically sync product to Polar when saved in admin
    """
    # Skip if this is a sync operation itself (to prevent infinite loop)
    if kwargs.get('update_fields') and 'sync_status' in kwargs.get('update_fields'):
        return

    # Only sync if not already syncing
    if instance.sync_status != 'draft' and not created:
        # If product was updated, mark it as needs_update
        if instance.sync_status == 'synced':
            instance.sync_status = 'needs_update'
            instance.save(update_fields=['sync_status'])

    try:
        logger.info(f"Auto-syncing product {instance.name} to Polar")
        sync_service = PolarSyncService()

        # Check if service is properly configured
        if not sync_service.client:
            logger.warning(f"Skipping auto-sync for product {instance.name}: Polar SDK not configured")
            return

        sync_service.sync_product(instance)

    except Exception as e:
        logger.error(f"Failed to auto-sync product {instance.name}: {str(e)}")


@receiver(post_save, sender=PolarPrice)
def sync_price_to_polar(sender, instance, created, **kwargs):
    """
    Automatically sync price to Polar when saved in admin
    """
    # Skip if this is a sync operation itself (to prevent infinite loop)
    if kwargs.get('update_fields') and 'sync_status' in kwargs.get('update_fields'):
        return

    # Only sync if not already syncing
    if instance.sync_status != 'draft' and not created:
        # If price was updated, mark it as needs_update
        if instance.sync_status == 'synced':
            instance.sync_status = 'needs_update'
            instance.save(update_fields=['sync_status'])

    try:
        logger.info(f"Auto-syncing price for product {instance.product.name} to Polar")
        sync_service = PolarSyncService()

        # Check if service is properly configured
        if not sync_service.client:
            logger.warning(f"Skipping auto-sync for price: Polar SDK not configured")
            return

        # Ensure product is synced first
        if not instance.product.polar_id or instance.product.sync_status != 'synced':
            logger.info(f"Syncing product {instance.product.name} first")
            sync_service.sync_product(instance.product)

        # Then sync the price
        sync_service.sync_price(instance)

    except Exception as e:
        logger.error(f"Failed to auto-sync price: {str(e)}")


@receiver(post_save, sender=Subscription)
def sync_subscription_to_polar(sender, instance, created, **kwargs):
    """
    Automatically sync subscription to Polar when saved in admin
    """
    # Skip if this is a sync operation itself (to prevent infinite loop)
    if kwargs.get('update_fields') and 'sync_status' in kwargs.get('update_fields'):
        return

    # Only sync new subscriptions or those marked as draft
    if not created and instance.sync_status != 'draft':
        return

    try:
        logger.info(f"Auto-syncing subscription for {instance.customer.user.username} to Polar")
        sync_service = PolarSyncService()

        # Check if service is properly configured
        if not sync_service.client:
            logger.warning(f"Skipping auto-sync for subscription: Polar SDK not configured")
            return

        # Ensure product is synced first
        if not instance.product.polar_id or instance.product.sync_status != 'synced':
            logger.info(f"Syncing product {instance.product.name} first")
            sync_service.sync_product(instance.product)

        # Ensure price is synced
        if not instance.price.polar_id or instance.price.sync_status != 'synced':
            logger.info(f"Syncing price first")
            sync_service.sync_price(instance.price)

        # Then sync the subscription (creates checkout)
        sync_service.sync_subscription(instance)

    except Exception as e:
        logger.error(f"Failed to auto-sync subscription: {str(e)}")
