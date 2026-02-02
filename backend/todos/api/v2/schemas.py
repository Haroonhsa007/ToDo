"""
Bolt request/response schemas for todos API v2.
"""
from datetime import datetime
from typing import Annotated, Literal

from msgspec import Meta

from django_bolt.serializers import Serializer

PRIORITY_CHOICES = ("Extreme", "Moderate", "Low")
STATUS_CHOICES = ("Not Started", "In Progress", "Completed")


class CategoryCreate(Serializer):
    """Create category."""

    name: Annotated[str, Meta(min_length=1, max_length=100)]
    color: Annotated[str, Meta(max_length=7)] = "#FF6767"


class CategoryUpdate(Serializer):
    """Partial category update."""

    name: Annotated[str, Meta(min_length=1, max_length=100)] | None = None
    color: Annotated[str, Meta(max_length=7)] | None = None


class TaskCreate(Serializer):
    """Create task."""

    title: Annotated[str, Meta(min_length=1, max_length=200)]
    description: str = ""
    priority: Literal["Extreme", "Moderate", "Low"] = "Moderate"
    status: Literal["Not Started", "In Progress", "Completed"] = "Not Started"
    due_date: datetime | None = None
    category_id: int | None = None


class TaskUpdate(Serializer):
    """Partial task update."""

    title: Annotated[str, Meta(min_length=1, max_length=200)] | None = None
    description: str | None = None
    priority: Literal["Extreme", "Moderate", "Low"] | None = None
    status: Literal["Not Started", "In Progress", "Completed"] | None = None
    due_date: datetime | None = None
    category_id: int | None = None


class TaskFilters(Serializer):
    """Query params for task list."""

    status: Literal["Not Started", "In Progress", "Completed"] | None = None
    priority: Literal["Extreme", "Moderate", "Low"] | None = None
    category: int | None = None
    search: str | None = None
    ordering: str | None = "-created_at"
