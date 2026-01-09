from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils import timezone
from unfold.admin import ModelAdmin

from .models import PolarProduct, PolarPrice, PolarCustomer, Subscription, WebhookEvent
from .services import PolarSyncService


class PolarPriceInline(admin.TabularInline):
    """Inline admin for managing prices within product admin"""
    model = PolarPrice
    extra = 1
    fields = (
        'price_amount',
        'price_currency',
        'type',
        'recurring_interval',
        'is_archived',
        'sync_status',
        'polar_id',
    )
    readonly_fields = ('polar_id', 'sync_status')

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of synced prices
        if obj and obj.polar_id:
            return False
        return super().has_delete_permission(request, obj)


@admin.register(PolarProduct)
class PolarProductAdmin(ModelAdmin):
    """Admin interface for Polar products"""

    list_display = (
        'name',
        'product_type',
        'is_recurring',
        'sync_status_badge',
        'polar_id_link',
        'last_synced_at',
        'created_at',
    )
    list_filter = ('sync_status', 'is_recurring', 'is_archived', 'product_type')
    search_fields = ('name', 'description', 'polar_id')
    readonly_fields = (
        'polar_id',
        'sync_status',
        'last_synced_at',
        'sync_error',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'description', 'product_type', 'is_recurring', 'is_archived')
        }),
        ('Polar Sync Status', {
            'fields': ('polar_id', 'sync_status', 'last_synced_at', 'sync_error'),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    inlines = [PolarPriceInline]
    actions = ['sync_to_polar']

    def sync_status_badge(self, obj):
        """Display sync status as colored badge"""
        colors = {
            'draft': 'gray',
            'synced': 'green',
            'sync_failed': 'red',
            'needs_update': 'orange',
        }
        color = colors.get(obj.sync_status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_sync_status_display()
        )
    sync_status_badge.short_description = 'Sync Status'

    def polar_id_link(self, obj):
        """Display Polar ID as clickable link"""
        if obj.polar_id:
            # Link to Polar dashboard (adjust URL based on environment)
            polar_url = f"https://polar.sh/dashboard/products/{obj.polar_id}"
            return format_html(
                '<a href="{}" target="_blank">{}</a>',
                polar_url,
                obj.polar_id[:12] + '...'
            )
        return '-'
    polar_id_link.short_description = 'Polar ID'

    def sync_to_polar(self, request, queryset):
        """Admin action to manually sync selected products to Polar"""
        try:
            sync_service = PolarSyncService()

            if not sync_service.client:
                self.message_user(
                    request,
                    "Polar SDK is not configured. Please check your settings.",
                    level='error'
                )
                return

            success_count = 0
            error_count = 0

            for product in queryset:
                if sync_service.sync_product(product):
                    success_count += 1
                else:
                    error_count += 1

            self.message_user(
                request,
                f"Synced {success_count} product(s) to Polar. {error_count} error(s)."
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error syncing products: {str(e)}",
                level='error'
            )
    sync_to_polar.short_description = "Sync selected products to Polar"


@admin.register(PolarPrice)
class PolarPriceAdmin(ModelAdmin):
    """Admin interface for Polar prices"""

    list_display = (
        'product',
        'price_display',
        'type',
        'recurring_interval',
        'sync_status_badge',
        'last_synced_at',
    )
    list_filter = ('sync_status', 'type', 'recurring_interval', 'is_archived')
    search_fields = ('product__name', 'polar_id')
    readonly_fields = (
        'polar_id',
        'sync_status',
        'last_synced_at',
        'sync_error',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        ('Price Information', {
            'fields': ('product', 'price_amount', 'price_currency', 'type', 'recurring_interval', 'is_archived')
        }),
        ('Polar Sync Status', {
            'fields': ('polar_id', 'sync_status', 'last_synced_at', 'sync_error'),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    actions = ['sync_to_polar']

    def price_display(self, obj):
        """Display price in human-readable format"""
        return f"${obj.price_amount / 100:.2f}"
    price_display.short_description = 'Price'

    def sync_status_badge(self, obj):
        """Display sync status as colored badge"""
        colors = {
            'draft': 'gray',
            'synced': 'green',
            'sync_failed': 'red',
            'needs_update': 'orange',
        }
        color = colors.get(obj.sync_status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_sync_status_display()
        )
    sync_status_badge.short_description = 'Sync Status'

    def sync_to_polar(self, request, queryset):
        """Admin action to manually sync selected prices to Polar"""
        try:
            sync_service = PolarSyncService()

            if not sync_service.client:
                self.message_user(
                    request,
                    "Polar SDK is not configured. Please check your settings.",
                    level='error'
                )
                return

            success_count = 0
            error_count = 0

            for price in queryset:
                # Ensure product is synced first
                if not price.product.polar_id:
                    sync_service.sync_product(price.product)

                if sync_service.sync_price(price):
                    success_count += 1
                else:
                    error_count += 1

            self.message_user(
                request,
                f"Synced {success_count} price(s) to Polar. {error_count} error(s)."
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error syncing prices: {str(e)}",
                level='error'
            )
    sync_to_polar.short_description = "Sync selected prices to Polar"


@admin.register(PolarCustomer)
class PolarCustomerAdmin(ModelAdmin):
    """Admin interface for Polar customers"""

    list_display = (
        'user',
        'email',
        'name',
        'polar_customer_id',
        'external_customer_id',
        'created_at',
    )
    search_fields = ('user__username', 'email', 'name', 'polar_customer_id', 'external_customer_id')
    readonly_fields = (
        'polar_customer_id',
        'external_customer_id',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        ('Customer Information', {
            'fields': ('user', 'email', 'name')
        }),
        ('Polar Integration', {
            'fields': ('polar_customer_id', 'external_customer_id'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )


@admin.register(Subscription)
class SubscriptionAdmin(ModelAdmin):
    """Admin interface for subscriptions"""

    list_display = (
        'customer_display',
        'product',
        'price_display',
        'status_badge',
        'sync_status_badge',
        'current_period_end',
        'created_at',
    )
    list_filter = ('status', 'sync_status', 'cancel_at_period_end')
    search_fields = (
        'customer__user__username',
        'customer__email',
        'product__name',
        'polar_subscription_id',
    )
    readonly_fields = (
        'polar_subscription_id',
        'sync_status',
        'last_synced_at',
        'sync_error',
        'checkout_url_display',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        ('Subscription Details', {
            'fields': (
                'customer',
                'product',
                'price',
                'status',
                'current_period_start',
                'current_period_end',
                'cancel_at_period_end',
            )
        }),
        ('Cancellation', {
            'fields': ('canceled_at', 'ended_at'),
            'classes': ('collapse',),
        }),
        ('Polar Sync Status', {
            'fields': (
                'polar_subscription_id',
                'sync_status',
                'last_synced_at',
                'sync_error',
                'checkout_url_display',
            ),
        }),
        ('Metadata', {
            'fields': ('metadata',),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    actions = ['sync_to_polar', 'cancel_subscriptions']

    def customer_display(self, obj):
        """Display customer username and email"""
        return f"{obj.customer.user.username} ({obj.customer.email})"
    customer_display.short_description = 'Customer'

    def price_display(self, obj):
        """Display price in human-readable format"""
        return f"${obj.price.price_amount / 100:.2f}/{obj.price.recurring_interval or 'once'}"
    price_display.short_description = 'Price'

    def status_badge(self, obj):
        """Display subscription status as colored badge"""
        colors = {
            'incomplete': 'gray',
            'incomplete_expired': 'red',
            'trialing': 'blue',
            'active': 'green',
            'past_due': 'orange',
            'canceled': 'yellow',
            'unpaid': 'red',
            'revoked': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def sync_status_badge(self, obj):
        """Display sync status as colored badge"""
        colors = {
            'draft': 'gray',
            'synced': 'green',
            'sync_failed': 'red',
            'needs_update': 'orange',
        }
        color = colors.get(obj.sync_status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_sync_status_display()
        )
    sync_status_badge.short_description = 'Sync Status'

    def checkout_url_display(self, obj):
        """Display checkout URL if available"""
        checkout_url = obj.metadata.get('checkout_url')
        if checkout_url:
            return format_html(
                '<a href="{}" target="_blank">Open Checkout Page</a>',
                checkout_url
            )
        return '-'
    checkout_url_display.short_description = 'Checkout URL'

    def sync_to_polar(self, request, queryset):
        """Admin action to manually sync selected subscriptions to Polar"""
        try:
            sync_service = PolarSyncService()

            if not sync_service.client:
                self.message_user(
                    request,
                    "Polar SDK is not configured. Please check your settings.",
                    level='error'
                )
                return

            success_count = 0
            error_count = 0

            for subscription in queryset:
                if sync_service.sync_subscription(subscription):
                    success_count += 1
                else:
                    error_count += 1

            self.message_user(
                request,
                f"Synced {success_count} subscription(s) to Polar. {error_count} error(s)."
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error syncing subscriptions: {str(e)}",
                level='error'
            )
    sync_to_polar.short_description = "Sync selected subscriptions to Polar"

    def cancel_subscriptions(self, request, queryset):
        """Admin action to cancel selected subscriptions"""
        canceled_count = 0
        for subscription in queryset:
            if subscription.is_active():
                subscription.status = 'canceled'
                subscription.cancel_at_period_end = True
                subscription.canceled_at = timezone.now()
                subscription.save()
                canceled_count += 1

        self.message_user(
            request,
            f"Canceled {canceled_count} subscription(s)."
        )
    cancel_subscriptions.short_description = "Cancel selected subscriptions"


@admin.register(WebhookEvent)
class WebhookEventAdmin(ModelAdmin):
    """Admin interface for webhook events"""

    list_display = (
        'event_id',
        'event_type',
        'processed_badge',
        'received_at',
        'processed_at',
    )
    list_filter = ('processed', 'event_type', 'received_at')
    search_fields = ('event_id', 'event_type')
    readonly_fields = (
        'event_id',
        'event_type',
        'payload',
        'processed',
        'processed_at',
        'processing_error',
        'received_at',
    )
    fieldsets = (
        ('Event Information', {
            'fields': ('event_id', 'event_type', 'received_at')
        }),
        ('Processing Status', {
            'fields': ('processed', 'processed_at', 'processing_error'),
        }),
        ('Payload', {
            'fields': ('payload',),
            'classes': ('collapse',),
        }),
    )

    def processed_badge(self, obj):
        """Display processed status as colored badge"""
        if obj.processed:
            return format_html(
                '<span style="background-color: green; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-size: 11px;">Processed</span>'
            )
        return format_html(
            '<span style="background-color: orange; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">Pending</span>'
        )
    processed_badge.short_description = 'Status'

    def has_add_permission(self, request):
        # Webhook events are created automatically, not manually
        return False

    def has_delete_permission(self, request, obj=None):
        # Allow deletion of old webhook events for cleanup
        return True
