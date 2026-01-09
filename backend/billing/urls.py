"""
URL configuration for billing app
"""

from django.urls import path, include
from .webhooks import polar_webhook_view

app_name = 'billing'

urlpatterns = [
    # Webhook endpoint for Polar.sh
    path('webhooks/polar/', polar_webhook_view, name='polar-webhook'),

    # API endpoints
    path('api/v1/', include('billing.api.v1.urls')),
]
