from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin  # Optional: Use Unfold's ModelAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):  # Keep BaseUserAdmin or use ModelAdmin
    """
    Use Django's built-in UserAdmin so that:
    - the password is treated as a hashed value (not a plain editable field)
    - the standard "change password" form is available in the admin
    """
    model = User

    # Keep your custom list view configuration
    list_display = [
        "name",
        "email",
        "is_superuser",
    ]
    list_filter = ["is_superuser"]
    search_fields = ["name", "email"]

    # Reuse the default fieldsets from BaseUserAdmin and add your extra fields
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Additional info",
            {
                "fields": (
                    "name",
                    "is_deleted",
                )
            },
        ),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (
            "Additional info",
            {
                "classes": ("wide",),
                "fields": (
                    "name",
                ),
            },
        ),
    )