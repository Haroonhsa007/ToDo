"""
Polar SDK client initialization
"""

from django.conf import settings
from polar_sdk import Polar


def get_polar_client():
    """
    Initialize and return a Polar SDK client instance

    Returns:
        Polar: Configured Polar SDK client

    Raises:
        ValueError: If POLAR_ACCESS_TOKEN is not configured
    """
    access_token = settings.POLAR_ACCESS_TOKEN

    if not access_token or access_token == 'polar_sandbox_...':
        raise ValueError(
            "POLAR_ACCESS_TOKEN is not configured. "
            "Please set it in your dev.json or environment variables."
        )

    # Initialize Polar client with access token
    # The server URL is automatically determined by the token prefix
    # (polar_sandbox_* uses sandbox, polar_* uses production)
    client = Polar(access_token=access_token)

    return client
