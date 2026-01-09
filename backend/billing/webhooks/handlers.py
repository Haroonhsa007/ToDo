"""
Webhook endpoint handlers for Polar.sh
"""

import logging
import json
import base64
import hmac
import hashlib
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone

from ..models import WebhookEvent
from .processors import process_webhook_event

logger = logging.getLogger(__name__)


def verify_webhook_signature(payload_body, signature_header, timestamp_header):
    """
    Verify webhook signature using Standard Webhooks specification

    Args:
        payload_body: Raw webhook payload bytes
        signature_header: Signature from webhook header (whsig_...)
        timestamp_header: Timestamp from webhook header

    Returns:
        bool: True if signature is valid, False otherwise
    """
    try:
        webhook_secret = settings.POLAR_WEBHOOK_SECRET

        if not webhook_secret or webhook_secret == 'whsec_...':
            logger.warning("POLAR_WEBHOOK_SECRET not configured, skipping verification")
            return True  # Allow in development mode

        # Decode the base64 secret
        secret_bytes = base64.b64decode(webhook_secret.replace('whsec_', ''))

        # Create signed content: timestamp.payload
        signed_content = f"{timestamp_header}.{payload_body.decode('utf-8')}"

        # Compute HMAC-SHA256
        expected_signature = hmac.new(
            secret_bytes,
            signed_content.encode('utf-8'),
            hashlib.sha256
        ).digest()

        # Encode to base64
        expected_signature_b64 = base64.b64encode(expected_signature).decode('utf-8')

        # Parse signature header (format: "v1,signature1 v1,signature2")
        signatures = signature_header.split(' ')
        for sig in signatures:
            if ',' in sig:
                version, sig_value = sig.split(',', 1)
                if version == 'v1' and hmac.compare_digest(sig_value, expected_signature_b64):
                    return True

        logger.warning("Webhook signature verification failed")
        return False

    except Exception as e:
        logger.error(f"Error verifying webhook signature: {str(e)}")
        return False


@csrf_exempt
@require_http_methods(["GET", "POST"])
def polar_webhook_view(request):
    """
    Handle incoming webhooks from Polar.sh

    Expected headers:
    - webhook-id: Unique webhook event ID
    - webhook-timestamp: Timestamp of the webhook
    - webhook-signature: HMAC signature for verification

    Returns:
        JsonResponse: Success or error response
    """
    try:
        # Get headers
        webhook_id = request.headers.get('webhook-id')
        webhook_timestamp = request.headers.get('webhook-timestamp')
        webhook_signature = request.headers.get('webhook-signature')

        if not all([webhook_id, webhook_timestamp, webhook_signature]):
            logger.warning("Missing required webhook headers")
            return JsonResponse(
                {'error': 'Missing required webhook headers'},
                status=400
            )

        # Get raw body
        payload_body = request.body

        # Verify signature
        if not verify_webhook_signature(payload_body, webhook_signature, webhook_timestamp):
            logger.warning(f"Webhook signature verification failed for event {webhook_id}")
            return JsonResponse(
                {'error': 'Invalid webhook signature'},
                status=401
            )

        # Parse JSON payload
        try:
            payload = json.loads(payload_body)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse webhook JSON: {str(e)}")
            return JsonResponse(
                {'error': 'Invalid JSON payload'},
                status=400
            )

        # Get event type
        event_type = payload.get('type')
        if not event_type:
            logger.warning("Webhook payload missing 'type' field")
            return JsonResponse(
                {'error': 'Missing event type'},
                status=400
            )

        logger.info(f"Received webhook: {event_type} (ID: {webhook_id})")

        # Check if we've already processed this event (idempotency)
        if WebhookEvent.objects.filter(event_id=webhook_id).exists():
            logger.info(f"Webhook {webhook_id} already processed, skipping")
            return JsonResponse({'status': 'already_processed'})

        # Store webhook event
        webhook_event = WebhookEvent.objects.create(
            event_id=webhook_id,
            event_type=event_type,
            payload=payload,
            processed=False,
        )

        # Process the webhook event asynchronously (or synchronously for now)
        try:
            process_webhook_event(webhook_event)
            webhook_event.processed = True
            webhook_event.processed_at = timezone.now()
            webhook_event.save(update_fields=['processed', 'processed_at'])

            logger.info(f"Successfully processed webhook {webhook_id}")
            return JsonResponse({'status': 'success', 'event_id': webhook_id})

        except Exception as e:
            error_message = f"Error processing webhook: {str(e)}"
            logger.error(error_message)
            webhook_event.processing_error = error_message
            webhook_event.save(update_fields=['processing_error'])

            # Return 200 even on processing errors to prevent Polar retries
            # We can manually retry from the admin panel
            return JsonResponse({
                'status': 'error',
                'error': error_message,
                'event_id': webhook_id
            })

    except Exception as e:
        logger.error(f"Unexpected error in webhook handler: {str(e)}")
        return JsonResponse(
            {'error': 'Internal server error'},
            status=500
        )
