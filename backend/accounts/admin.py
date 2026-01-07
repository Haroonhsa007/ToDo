from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    """
    Use Django's built-in UserAdmin so that:
    - the password is treated as a hashed value (not a plain editable field)
    - the standard "change password" form is available in the admin
    """
    model = User

    # Unfold forms for better styling
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

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