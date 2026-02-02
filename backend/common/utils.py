"""
Common utility functions for the backend.
"""
from django.core.exceptions import ValidationError
from django.conf import settings


def validate_image_file(file):
    """
    Validate that uploaded file is an image.
    
    Args:
        file: Uploaded file object
        
    Raises:
        ValidationError: If file is not a valid image
    """
    # Check file size (5MB max)
    max_size = getattr(settings, 'FILE_UPLOAD_MAX_MEMORY_SIZE', 5242880)
    if file.size > max_size:
        raise ValidationError(
            f'File size exceeds maximum allowed size of {max_size / 1024 / 1024}MB'
        )
    
    # Check file type
    allowed_types = getattr(settings, 'ALLOWED_IMAGE_TYPES', [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ])
    
    if file.content_type not in allowed_types:
        raise ValidationError(
            f'File type not allowed. Allowed types: {", ".join(allowed_types)}'
        )
    
    return True


def get_image_url(request, image_field):
    """
    Get full URL for an image field.

    Args:
        request: HTTP request object
        image_field: ImageField instance

    Returns:
        str: Full URL to the image or None
    """
    if image_field and hasattr(image_field, 'url'):
        return request.build_absolute_uri(image_field.url)
    return None


def get_bolt_base_url(request) -> str | None:
    """
    Build base URL (scheme + host + port) from a Django-Bolt Request scope.
    Use for absolute URIs (e.g. media URLs) in Bolt handlers.
    """
    try:
        scope = getattr(request, "scope", None)
        if not scope:
            return None
        scheme = scope.get("scheme", "http")
        server = scope.get("server")
        if not server:
            return None
        host, port = server[0], server[1]
        if port and (scheme == "https" and port != 443 or scheme == "http" and port != 80):
            return f"{scheme}://{host}:{port}"
        return f"{scheme}://{host}"
    except Exception:
        return None

