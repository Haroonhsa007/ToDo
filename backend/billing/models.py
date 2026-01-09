from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone

User = get_user_model()


class PolarProduct(models.Model):
    """
    Represents a product that can be sold via Polar.sh
    Products are created in Django admin and synced to Polar.
    """

    PRODUCT_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('business', 'Business'),
    ]

    # Local fields
    name = models.CharField(max_length=255, help_text="Product name")
    description = models.TextField(blank=True, help_text="Product description")
    is_recurring = models.BooleanField(default=True, help_text="Is this a subscription product?")
    is_archived = models.BooleanField(default=False, help_text="Archive this product")
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPE_CHOICES,
        default='individual',
        help_text="Product type"
    )

    # Polar sync fields
    polar_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        help_text="Polar product ID (populated after sync)"
    )
    sync_status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft - Not synced'),
            ('synced', 'Synced to Polar'),
            ('sync_failed', 'Sync Failed'),
            ('needs_update', 'Needs Update'),
        ],
        default='draft',
        help_text="Sync status with Polar"
    )
    last_synced_at = models.DateTimeField(null=True, blank=True, help_text="Last sync time")
    sync_error = models.TextField(blank=True, help_text="Last sync error message")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Polar Product'
        verbose_name_plural = 'Polar Products'

    def __str__(self):
        return f"{self.name} ({self.get_sync_status_display()})"

    def mark_synced(self, polar_id):
        """Mark product as successfully synced to Polar"""
        self.polar_id = polar_id
        self.sync_status = 'synced'
        self.last_synced_at = timezone.now()
        self.sync_error = ''
        self.save(update_fields=['polar_id', 'sync_status', 'last_synced_at', 'sync_error'])

    def mark_sync_failed(self, error_message):
        """Mark product sync as failed"""
        self.sync_status = 'sync_failed'
        self.sync_error = error_message
        self.save(update_fields=['sync_status', 'sync_error'])


class PolarPrice(models.Model):
    """
    Represents pricing for a Polar product
    Prices are created in Django admin and synced to Polar.
    """

    PRICE_TYPE_CHOICES = [
        ('one_time', 'One-time'),
        ('recurring', 'Recurring'),
    ]

    RECURRING_INTERVAL_CHOICES = [
        ('month', 'Monthly'),
        ('year', 'Yearly'),
    ]

    # Relationships
    product = models.ForeignKey(
        PolarProduct,
        on_delete=models.CASCADE,
        related_name='prices',
        help_text="Product this price belongs to"
    )

    # Local fields
    price_amount = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text="Price in cents (e.g., 1000 = $10.00)"
    )
    price_currency = models.CharField(max_length=3, default='USD', help_text="Currency code")
    type = models.CharField(
        max_length=20,
        choices=PRICE_TYPE_CHOICES,
        default='recurring',
        help_text="Price type"
    )
    recurring_interval = models.CharField(
        max_length=20,
        choices=RECURRING_INTERVAL_CHOICES,
        default='month',
        blank=True,
        null=True,
        help_text="Billing interval for recurring prices"
    )
    is_archived = models.BooleanField(default=False, help_text="Archive this price")

    # Polar sync fields
    polar_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        help_text="Polar price ID (populated after sync)"
    )
    sync_status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft - Not synced'),
            ('synced', 'Synced to Polar'),
            ('sync_failed', 'Sync Failed'),
            ('needs_update', 'Needs Update'),
        ],
        default='draft',
        help_text="Sync status with Polar"
    )
    last_synced_at = models.DateTimeField(null=True, blank=True, help_text="Last sync time")
    sync_error = models.TextField(blank=True, help_text="Last sync error message")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Polar Price'
        verbose_name_plural = 'Polar Prices'

    def __str__(self):
        amount_display = f"${self.price_amount / 100:.2f}"
        if self.type == 'recurring' and self.recurring_interval:
            return f"{self.product.name} - {amount_display}/{self.recurring_interval}"
        return f"{self.product.name} - {amount_display}"

    def mark_synced(self, polar_id):
        """Mark price as successfully synced to Polar"""
        self.polar_id = polar_id
        self.sync_status = 'synced'
        self.last_synced_at = timezone.now()
        self.sync_error = ''
        self.save(update_fields=['polar_id', 'sync_status', 'last_synced_at', 'sync_error'])

    def mark_sync_failed(self, error_message):
        """Mark price sync as failed"""
        self.sync_status = 'sync_failed'
        self.sync_error = error_message
        self.save(update_fields=['sync_status', 'sync_error'])


class PolarCustomer(models.Model):
    """
    Links Django users to Polar customers
    Uses external_customer_id pattern for linking
    """

    # Relationships
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='polar_customer',
        help_text="Django user"
    )

    # Polar fields
    polar_customer_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        help_text="Polar customer ID"
    )
    external_customer_id = models.CharField(
        max_length=255,
        unique=True,
        help_text="External customer ID (Django user ID)"
    )

    # Customer data
    email = models.EmailField(help_text="Customer email")
    name = models.CharField(max_length=255, blank=True, help_text="Customer name")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Polar Customer'
        verbose_name_plural = 'Polar Customers'

    def __str__(self):
        return f"{self.user.username} - {self.email}"

    def save(self, *args, **kwargs):
        # Automatically set external_customer_id to user.id
        if not self.external_customer_id:
            self.external_customer_id = str(self.user.id)
        if not self.email:
            self.email = self.user.email
        if not self.name:
            self.name = self.user.name or self.user.username
        super().save(*args, **kwargs)


class Subscription(models.Model):
    """
    Represents a subscription to a product
    Can be created in Django admin and synced to Polar
    """

    STATUS_CHOICES = [
        ('incomplete', 'Incomplete'),
        ('incomplete_expired', 'Incomplete Expired'),
        ('trialing', 'Trialing'),
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('unpaid', 'Unpaid'),
        ('revoked', 'Revoked'),
    ]

    # Relationships
    customer = models.ForeignKey(
        PolarCustomer,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        help_text="Customer who owns this subscription"
    )
    product = models.ForeignKey(
        PolarProduct,
        on_delete=models.PROTECT,
        related_name='subscriptions',
        help_text="Product being subscribed to"
    )
    price = models.ForeignKey(
        PolarPrice,
        on_delete=models.PROTECT,
        related_name='subscriptions',
        help_text="Price plan for this subscription"
    )

    # Subscription details
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='incomplete',
        help_text="Subscription status"
    )
    current_period_start = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Start of current billing period"
    )
    current_period_end = models.DateTimeField(
        null=True,
        blank=True,
        help_text="End of current billing period"
    )
    cancel_at_period_end = models.BooleanField(
        default=False,
        help_text="Cancel at end of current period"
    )
    canceled_at = models.DateTimeField(null=True, blank=True, help_text="When subscription was canceled")
    ended_at = models.DateTimeField(null=True, blank=True, help_text="When subscription ended")

    # Polar sync fields
    polar_subscription_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        help_text="Polar subscription ID (populated after sync)"
    )
    sync_status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft - Not synced'),
            ('synced', 'Synced to Polar'),
            ('sync_failed', 'Sync Failed'),
            ('needs_update', 'Needs Update'),
        ],
        default='draft',
        help_text="Sync status with Polar"
    )
    last_synced_at = models.DateTimeField(null=True, blank=True, help_text="Last sync time")
    sync_error = models.TextField(blank=True, help_text="Last sync error message")

    # Metadata
    metadata = models.JSONField(default=dict, blank=True, help_text="Additional metadata")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        indexes = [
            models.Index(fields=['status', 'current_period_end']),
            models.Index(fields=['customer', 'status']),
        ]

    def __str__(self):
        return f"{self.customer.user.username} - {self.product.name} ({self.get_status_display()})"

    def is_active(self):
        """Check if subscription is currently active"""
        return self.status in ['active', 'trialing']

    def mark_synced(self, polar_subscription_id):
        """Mark subscription as successfully synced to Polar"""
        self.polar_subscription_id = polar_subscription_id
        self.sync_status = 'synced'
        self.last_synced_at = timezone.now()
        self.sync_error = ''
        self.save(update_fields=['polar_subscription_id', 'sync_status', 'last_synced_at', 'sync_error'])

    def mark_sync_failed(self, error_message):
        """Mark subscription sync as failed"""
        self.sync_status = 'sync_failed'
        self.sync_error = error_message
        self.save(update_fields=['sync_status', 'sync_error'])


class WebhookEvent(models.Model):
    """
    Store incoming webhook events from Polar for debugging and audit
    """

    # Event data
    event_id = models.CharField(max_length=255, unique=True, help_text="Polar event ID")
    event_type = models.CharField(max_length=100, help_text="Event type (e.g., order.paid)")
    payload = models.JSONField(help_text="Full event payload")

    # Processing status
    processed = models.BooleanField(default=False, help_text="Has this event been processed?")
    processed_at = models.DateTimeField(null=True, blank=True, help_text="When was it processed?")
    processing_error = models.TextField(blank=True, help_text="Error during processing")

    # Timestamps
    received_at = models.DateTimeField(auto_now_add=True, help_text="When webhook was received")

    class Meta:
        ordering = ['-received_at']
        verbose_name = 'Webhook Event'
        verbose_name_plural = 'Webhook Events'
        indexes = [
            models.Index(fields=['event_type', 'processed']),
            models.Index(fields=['received_at']),
        ]

    def __str__(self):
        return f"{self.event_type} - {self.event_id} ({'processed' if self.processed else 'pending'})"
