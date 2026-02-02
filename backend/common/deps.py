"""
Async dependencies for Django Bolt handlers.
Use these instead of django_bolt.auth.get_current_user to avoid SynchronousOnlyOperation
(Bolt's get_current_user uses sync ORM; our async version uses User.objects.aget).
"""

from django.contrib.auth import get_user_model

from django_bolt.exceptions import Unauthorized


async def get_current_user_async(request):
    """
    Async dependency: load current user from JWT context using async ORM.
    Use with Depends(get_current_user_async) in Bolt handlers.
    """
    context = getattr(request, "context", None)
    if context is None and callable(getattr(request, "get", None)):
        context = request.get("context", {})
    if not context:
        raise Unauthorized(detail="Authentication required.")
    user_id = context.get("user_id") or context.get("sub")
    if user_id is None:
        raise Unauthorized(detail="Authentication required.")
    User = get_user_model()
    try:
        return await User.objects.aget(pk=user_id)
    except User.DoesNotExist:
        raise Unauthorized(detail="User not found.")
