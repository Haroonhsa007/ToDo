"""
Bolt request/response schemas for accounts API v2.
"""
from typing import Annotated

from msgspec import Meta

from django_bolt.serializers import Serializer


class LoginRequest(Serializer):
    """Credentials for login."""

    username: str
    password: str


class RegisterRequest(Serializer):
    """Payload for user registration."""

    username: Annotated[str, Meta(min_length=1, max_length=150)]
    email: Annotated[str, Meta(min_length=1)]
    name: Annotated[str, Meta(max_length=255)] = ""
    first_name: Annotated[str, Meta(max_length=150)] = ""
    last_name: Annotated[str, Meta(max_length=150)] = ""
    password: Annotated[str, Meta(min_length=8)]
    password_confirm: Annotated[str, Meta(min_length=8)]


class UpdateProfileRequest(Serializer):
    """Partial profile update (all optional)."""

    name: Annotated[str, Meta(max_length=255)] | None = None
    first_name: Annotated[str, Meta(max_length=150)] | None = None
    last_name: Annotated[str, Meta(max_length=150)] | None = None
    email: Annotated[str, Meta(min_length=1)] | None = None


class PasswordChangeRequest(Serializer):
    """Payload for password change."""

    old_password: str
    new_password: Annotated[str, Meta(min_length=8)]
    confirm_password: Annotated[str, Meta(min_length=8)]
