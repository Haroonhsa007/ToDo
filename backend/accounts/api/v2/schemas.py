"""
Bolt request/response schemas for accounts API v2.
Uses Serializer + Meta constraints + model_validator for cross-field validation.
"""
from typing import Annotated

from msgspec import Meta

from django_bolt.serializers import Serializer, model_validator


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

    @model_validator
    def passwords_match(self):
        if self.password != self.password_confirm:
            raise ValueError("Passwords do not match.")

    class Config:
        write_only = {"password", "password_confirm"}


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

    @model_validator
    def new_passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("New passwords do not match.")

    class Config:
        write_only = {"old_password", "new_password", "confirm_password"}
