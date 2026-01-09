"""
Serializers for billing API
"""

from rest_framework import serializers
from billing.models import PolarProduct, PolarPrice, Subscription, PolarCustomer


class PolarPriceSerializer(serializers.ModelSerializer):
    """Serializer for Polar prices"""

    price_display = serializers.SerializerMethodField()
    interval_display = serializers.SerializerMethodField()

    class Meta:
        model = PolarPrice
        fields = [
            'id',
            'price_amount',
            'price_currency',
            'type',
            'recurring_interval',
            'price_display',
            'interval_display',
            'polar_id',
        ]

    def get_price_display(self, obj):
        """Get formatted price"""
        return f"${obj.price_amount / 100:.2f}"

    def get_interval_display(self, obj):
        """Get billing interval display"""
        if obj.type == 'recurring' and obj.recurring_interval:
            return f"per {obj.recurring_interval}"
        return "one-time"


class PolarProductSerializer(serializers.ModelSerializer):
    """Serializer for Polar products"""

    prices = PolarPriceSerializer(many=True, read_only=True)

    class Meta:
        model = PolarProduct
        fields = [
            'id',
            'name',
            'description',
            'is_recurring',
            'product_type',
            'polar_id',
            'prices',
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for subscriptions"""

    product = PolarProductSerializer(read_only=True)
    price = PolarPriceSerializer(read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    checkout_url = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            'id',
            'product',
            'price',
            'customer_email',
            'status',
            'current_period_start',
            'current_period_end',
            'cancel_at_period_end',
            'canceled_at',
            'ended_at',
            'checkout_url',
            'is_active',
            'created_at',
        ]

    def get_checkout_url(self, obj):
        """Get checkout URL if available"""
        return obj.metadata.get('checkout_url')

    def get_is_active(self, obj):
        """Check if subscription is active"""
        return obj.is_active()


class PolarCustomerSerializer(serializers.ModelSerializer):
    """Serializer for Polar customers"""

    username = serializers.CharField(source='user.username', read_only=True)
    subscriptions = SubscriptionSerializer(many=True, read_only=True)

    class Meta:
        model = PolarCustomer
        fields = [
            'id',
            'username',
            'email',
            'name',
            'polar_customer_id',
            'external_customer_id',
            'subscriptions',
            'created_at',
        ]


class CreateCheckoutSerializer(serializers.Serializer):
    """Serializer for creating a checkout session"""

    product_id = serializers.IntegerField(required=True)
    price_id = serializers.IntegerField(required=True)
    success_url = serializers.URLField(required=False, allow_blank=True)

    def validate_product_id(self, value):
        """Validate that product exists and is synced"""
        try:
            product = PolarProduct.objects.get(id=value)
            if not product.polar_id:
                raise serializers.ValidationError("Product is not synced to Polar yet")
            return value
        except PolarProduct.DoesNotExist:
            raise serializers.ValidationError("Product not found")

    def validate_price_id(self, value):
        """Validate that price exists and is synced"""
        try:
            price = PolarPrice.objects.get(id=value)
            if not price.polar_id:
                raise serializers.ValidationError("Price is not synced to Polar yet")
            return value
        except PolarPrice.DoesNotExist:
            raise serializers.ValidationError("Price not found")

    def validate(self, attrs):
        """Validate that price belongs to product"""
        product_id = attrs.get('product_id')
        price_id = attrs.get('price_id')

        price = PolarPrice.objects.get(id=price_id)
        if price.product_id != product_id:
            raise serializers.ValidationError("Price does not belong to the specified product")

        return attrs
