"""
URL patterns for billing API v1
"""

from django.urls import path
from .views import (
    ProductListView,
    MySubscriptionsView,
    CreateCheckoutView,
    CancelSubscriptionView,
    SubscriptionStatusView,
)

app_name = 'billing_api_v1'

urlpatterns = [
    # Products
    path('billing/products/', ProductListView.as_view(), name='product-list'),

    # Subscriptions
    path('billing/subscriptions/', MySubscriptionsView.as_view(), name='my-subscriptions'),
    path('billing/subscriptions/status/', SubscriptionStatusView.as_view(), name='subscription-status'),
    path('billing/subscriptions/<int:subscription_id>/cancel/', CancelSubscriptionView.as_view(), name='cancel-subscription'),

    # Checkout
    path('billing/checkout/', CreateCheckoutView.as_view(), name='create-checkout'),
]
