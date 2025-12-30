from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

from .view import (
    LoginView,
    RegisterView,
    RefreshTokenView,
    MeView,
    UpdateProfileView,
    ChangePasswordView,
)

urlpatterns = [
    # Authentication endpoints
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("auth/verify/", TokenVerifyView.as_view(), name="token_verify"),
    
    # User endpoints
    path("users/me/", MeView.as_view(), name="me"),
    path("users/profile/", UpdateProfileView.as_view(), name="update_profile"),
    path("users/change-password/", ChangePasswordView.as_view(), name="change_password"),
]
