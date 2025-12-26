# from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

# from .view import (
#     CompanyUserCreateView,
#     CompanyWithAdminCreateView,
#     LoginView,
#     MeView,
# )


# urlpatterns = [
#     # JWT auth endpoints (login / refresh / verify)
#     path("login/", LoginView.as_view(), name="login"),
#     path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
#     path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),

#     # Registration & role-based user creation
#     path(
#         "companies/",
#         CompanyWithAdminCreateView.as_view(),
#         name="company_with_admin_create",
#     ),
#     path(
#         "company-users/",
#         CompanyUserCreateView.as_view(),
#         name="company_user_create",
#     ),

#     # Simple protected endpoint to test JWT auth
#     path("me/", MeView.as_view(), name="me"),
# ]