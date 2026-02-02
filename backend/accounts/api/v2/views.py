"""
Accounts API v2 – Django Bolt endpoints.
Replica of v1 auth and user endpoints using Bolt.
"""

from asgiref.sync import sync_to_async

from django.contrib.auth import aauthenticate, get_user_model

from django_bolt import BoltAPI, Request
from django_bolt.auth import (
    AllowAny,
    IsAuthenticated,
    JWTAuthentication,
    create_jwt_for_user,
)
from django_bolt.exceptions import BadRequest, Unauthorized

from core.api import api

from .schemas import (
    LoginRequest,
    PasswordChangeRequest,
    RegisterRequest,
    UpdateProfileRequest,
)

User = get_user_model()

JWT_EXPIRY = 3600


def _user_payload(user, base_url: str | None = None):
    """Build API user dict; base_url used for profile_picture_url when available."""
    data = {
        "id": user.id,
        "username": user.username,
        "name": getattr(user, "name", "") or "",
        "email": user.email or "",
        "first_name": user.first_name or "",
        "last_name": user.last_name or "",
        "profile_picture": str(user.profile_picture) if user.profile_picture else None,
        "profile_picture_url": None,
        "is_active": user.is_active,
        "is_superuser": getattr(user, "is_superuser", False),
        "created_at": user.created_at.isoformat() if hasattr(user, "created_at") and user.created_at else None,
        "updated_at": user.updated_at.isoformat() if hasattr(user, "updated_at") and user.updated_at else None,
    }
    if base_url and user.profile_picture:
        data["profile_picture_url"] = base_url + user.profile_picture.url
    return data


def _get_base_url(request: Request) -> str | None:
    """Build base URL from Bolt request for absolute URIs."""
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


# ---- Auth (public) ----


@api.post(
    "/auth/login/",
    guards=[AllowAny()],
    summary="JWT login",
    tags=["accounts", "auth"],
)
async def login(body: LoginRequest):
    user = await aauthenticate(
        username=body.username,
        password=body.password,
    )
    if user is None:
        raise Unauthorized(detail="Invalid credentials.")
    token = create_jwt_for_user(user, expires_in=JWT_EXPIRY)
    payload = _user_payload(user)
    return {
        "access": token,
        "refresh": token,
        "user": payload,
    }


@api.post(
    "/auth/register/",
    guards=[AllowAny()],
    summary="Register and get JWT",
    tags=["accounts", "auth"],
    status_code=201,
)
async def register(body: RegisterRequest):
    if body.password != body.password_confirm:
        raise BadRequest(detail="Passwords do not match.")
    exists = await User.objects.filter(username=body.username).aexists()
    if exists:
        raise BadRequest(detail="Username already exists.")
    exists = await User.objects.filter(email=body.email).aexists()
    if exists:
        raise BadRequest(detail="Email already exists.")
    user = await sync_to_async(User.objects.create_user)(
        username=body.username,
        email=body.email,
        password=body.password,
        name=getattr(body, "name", "") or "",
        first_name=getattr(body, "first_name", "") or "",
        last_name=getattr(body, "last_name", "") or "",
    )
    token = create_jwt_for_user(user, expires_in=JWT_EXPIRY)
    payload = _user_payload(user)
    return {"access": token, "refresh": token, "user": payload}


@api.post(
    "/auth/refresh/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Refresh access token",
    tags=["accounts", "auth"],
)
async def refresh(request: Request):
    """Re-issue a new access token from current valid token."""
    user = request.user
    token = create_jwt_for_user(user, expires_in=JWT_EXPIRY)
    return {"access": token, "refresh": token}


@api.post(
    "/auth/verify/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Verify token",
    tags=["accounts", "auth"],
)
async def verify(request: Request):
    return {"detail": "Token is valid."}


# ---- Users (authenticated) ----


@api.get(
    "users/me/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Current user profile",
    tags=["accounts", "users"],
)
async def me(request: Request):
    user = request.user
    base_url = _get_base_url(request)
    return _user_payload(user, base_url=base_url)


@api.put(
    "users/profile/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Update profile",
    tags=["accounts", "users"],
)
async def update_profile(request: Request, body: UpdateProfileRequest):
    user = request.user
    if body.name is not None:
        user.name = body.name
    if body.first_name is not None:
        user.first_name = body.first_name
    if body.last_name is not None:
        user.last_name = body.last_name
    if body.email is not None:
        exists = await User.objects.filter(email=body.email).exclude(pk=user.pk).aexists()
        if exists:
            raise BadRequest(detail="Email already exists.")
        user.email = body.email
    await sync_to_async(user.save)()
    base_url = _get_base_url(request)
    return _user_payload(user, base_url=base_url)


@api.post(
    "users/change-password/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Change password",
    tags=["accounts", "users"],
)
async def change_password(request: Request, body: PasswordChangeRequest):
    if body.new_password != body.confirm_password:
        raise BadRequest(detail="New passwords do not match.")
    user = request.user
    ok = await sync_to_async(user.check_password)(body.old_password)
    if not ok:
        raise BadRequest(detail="Old password is incorrect.")
    await sync_to_async(user.set_password)(body.new_password)
    await sync_to_async(user.save)()
    return {"message": "Password changed successfully."}

