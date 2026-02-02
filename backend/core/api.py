from django_bolt import BoltAPI
from django_bolt.auth import AllowAny
from django_bolt.openapi import OpenAPIConfig

api = BoltAPI(
    prefix="/api/v2",
    trailing_slash="keep",
    openapi_config=OpenAPIConfig(
        title="ToDo API",
        description="Accounts and Todos API v2 (Django Bolt).",
        version="2.0",
    ),
)


@api.get(
    "/health/",
    guards=[AllowAny()],
    summary="Health check",
    tags=["system"],
)
async def health():
    """Liveness/readiness for load balancers and orchestration."""
    return {"status": "ok"}


from accounts.api.v2 import views as accounts_views
from todos.api.v2 import views as todos_views
