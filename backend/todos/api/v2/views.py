"""
Todos API v2 – Django Bolt endpoints.
Replica of v1 Task and Category CRUD + statistics using Bolt.
Uses Depends(get_current_user_async), common.get_bolt_base_url, Conflict for duplicates.
"""
from typing import Annotated

from asgiref.sync import sync_to_async
from django.db.models import Q

from django_bolt import Depends, Request
from django_bolt.auth import IsAuthenticated, JWTAuthentication
from django_bolt.exceptions import BadRequest, Conflict, NotFound
from django_bolt.param_functions import Query

from common.deps import get_current_user_async
from common.utils import get_bolt_base_url
from core.api import api
from todos.models import Category, Task

from .schemas import (
    ALLOWED_ORDERING,
    CategoryCreate,
    CategoryUpdate,
    TaskCreate,
    TaskFilters,
    TaskUpdate,
)

# ---- Payload helpers ----


def _category_payload(cat: Category) -> dict:
    return {
        "id": cat.id,
        "name": cat.name,
        "color": cat.color,
        "created_at": cat.created_at.isoformat() if cat.created_at else None,
        "updated_at": cat.updated_at.isoformat() if cat.updated_at else None,
    }


def _task_payload(task: Task, base_url: str | None = None) -> dict:
    data = {
        "id": task.id,
        "title": task.title,
        "description": task.description or "",
        "priority": task.priority,
        "status": task.status,
        "image": str(task.image) if task.image else None,
        "image_url": None,
        "due_date": task.due_date.isoformat() if task.due_date else None,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
        "user": task.user_id,
        "category": task.category_id,
        "category_name": task.category.name if task.category_id else None,
    }
    if base_url and task.image:
        data["image_url"] = base_url + ("/" + task.image.url.lstrip("/") if task.image.url else "")
    return data


# ---- Categories ----


@api.get(
    "/categories/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="List categories",
    tags=["todos", "categories"],
)
async def category_list(user=Depends(get_current_user_async)):
    qs = Category.objects.filter(user=user).order_by("name")[:200]
    out = []
    async for cat in qs:
        out.append(await sync_to_async(_category_payload)(cat))
    return out


@api.post(
    "/categories/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Create category",
    tags=["todos", "categories"],
    status_code=201,
)
async def category_create(body: CategoryCreate, user=Depends(get_current_user_async)):
    if await Category.objects.filter(user=user, name=body.name).aexists():
        raise Conflict(detail="You already have a category with this name.")
    cat = await Category.objects.acreate(
        user=user,
        name=body.name,
        color=body.color,
    )
    return await sync_to_async(_category_payload)(cat)


@api.get(
    "/categories/{category_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Get category",
    tags=["todos", "categories"],
)
async def category_detail(category_id: int, user=Depends(get_current_user_async)):
    try:
        cat = await Category.objects.aget(id=category_id, user=user)
    except Category.DoesNotExist:
        raise NotFound(detail="Category not found.")
    return await sync_to_async(_category_payload)(cat)


async def _category_update_impl(category_id: int, body: CategoryUpdate, user):
    try:
        cat = await Category.objects.aget(id=category_id, user=user)
    except Category.DoesNotExist:
        raise NotFound(detail="Category not found.")
    if body.name is not None:
        if await Category.objects.filter(user=user, name=body.name).exclude(pk=cat.pk).aexists():
            raise Conflict(detail="You already have a category with this name.")
        cat.name = body.name
    if body.color is not None:
        cat.color = body.color
    await sync_to_async(cat.save)()
    return await sync_to_async(_category_payload)(cat)


@api.put(
    "/categories/{category_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Update category",
    tags=["todos", "categories"],
)
async def category_update(category_id: int, body: CategoryUpdate, user=Depends(get_current_user_async)):
    return await _category_update_impl(category_id, body, user)


@api.patch(
    "/categories/{category_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Partial update category",
    tags=["todos", "categories"],
)
async def category_partial_update(category_id: int, body: CategoryUpdate, user=Depends(get_current_user_async)):
    return await _category_update_impl(category_id, body, user)


@api.delete(
    "/categories/{category_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Delete category",
    tags=["todos", "categories"],
    status_code=204,
)
async def category_delete(category_id: int, user=Depends(get_current_user_async)):
    try:
        cat = await Category.objects.aget(id=category_id, user=user)
    except Category.DoesNotExist:
        raise NotFound(detail="Category not found.")
    await cat.adelete()


# ---- Tasks ----


@api.get(
    "/todos/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="List tasks",
    tags=["todos", "tasks"],
)
async def task_list(
    request: Request,
    filters: Annotated[TaskFilters, Query()],
    user=Depends(get_current_user_async),
):
    qs = Task.objects.filter(user=user).select_related("category")
    if filters.status:
        qs = qs.filter(status=filters.status)
    if filters.priority:
        qs = qs.filter(priority=filters.priority)
    if filters.category is not None:
        qs = qs.filter(category_id=filters.category)
    if filters.search:
        qs = qs.filter(
            Q(title__icontains=filters.search) | Q(description__icontains=filters.search)
        )
    ordering = (filters.ordering or "-created_at").strip()
    if ordering and ordering in ALLOWED_ORDERING:
        qs = qs.order_by(ordering)
    else:
        qs = qs.order_by("-created_at")
    base_url = get_bolt_base_url(request)
    limit = min(filters.limit, 100)
    offset = max(0, filters.offset)
    out = []
    async for task in qs[offset : offset + limit]:
        out.append(await sync_to_async(_task_payload)(task, base_url))
    return out


@api.post(
    "/todos/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Create task",
    tags=["todos", "tasks"],
    status_code=201,
)
async def task_create(request: Request, body: TaskCreate, user=Depends(get_current_user_async)):
    category = None
    if body.category_id is not None:
        try:
            category = await Category.objects.aget(id=body.category_id, user=user)
        except Category.DoesNotExist:
            raise BadRequest(detail="Category not found or not yours.")
    task = await Task.objects.acreate(
        user=user,
        title=body.title,
        description=body.description,
        priority=body.priority,
        status=body.status,
        due_date=body.due_date,
        category=category,
    )
    base_url = get_bolt_base_url(request)
    return await sync_to_async(_task_payload)(task, base_url)


@api.get(
    "/todos/statistics/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Task statistics",
    tags=["todos", "tasks"],
)
async def task_statistics(user=Depends(get_current_user_async)):
    from django.db.models import Count, Q

    def _aggregate():
        return Task.objects.filter(user=user).aggregate(
            total=Count("id"),
            completed=Count("id", filter=Q(status="Completed")),
            in_progress=Count("id", filter=Q(status="In Progress")),
            not_started=Count("id", filter=Q(status="Not Started")),
        )

    stats = await sync_to_async(_aggregate)()
    total = stats["total"] or 0
    completed = stats["completed"] or 0
    in_progress = stats["in_progress"] or 0
    not_started = stats["not_started"] or 0
    return {
        "total": total,
        "completed": completed,
        "in_progress": in_progress,
        "not_started": not_started,
        "completed_percentage": round((completed / total * 100), 2) if total else 0,
        "in_progress_percentage": round((in_progress / total * 100), 2) if total else 0,
        "not_started_percentage": round((not_started / total * 100), 2) if total else 0,
    }


@api.get(
    "/todos/{task_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Get task",
    tags=["todos", "tasks"],
)
async def task_detail(request: Request, task_id: int, user=Depends(get_current_user_async)):
    try:
        task = await Task.objects.select_related("category").aget(id=task_id, user=user)
    except Task.DoesNotExist:
        raise NotFound(detail="Task not found.")
    return await sync_to_async(_task_payload)(task, get_bolt_base_url(request))


@api.put(
    "/todos/{task_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Update task",
    tags=["todos", "tasks"],
)
async def task_update(
    request: Request,
    task_id: int,
    body: TaskUpdate,
    user=Depends(get_current_user_async),
):
    return await _task_update_impl(request, task_id, body, user)


@api.patch(
    "/todos/{task_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Partial update task",
    tags=["todos", "tasks"],
)
async def task_partial_update(
    request: Request,
    task_id: int,
    body: TaskUpdate,
    user=Depends(get_current_user_async),
):
    return await _task_update_impl(request, task_id, body, user)


async def _task_update_impl(
    request: Request, task_id: int, body: TaskUpdate, user
):
    try:
        task = await Task.objects.select_related("category").aget(id=task_id, user=user)
    except Task.DoesNotExist:
        raise NotFound(detail="Task not found.")
    update_fields = []
    if body.title is not None:
        task.title = body.title
        update_fields.append("title")
    if body.description is not None:
        task.description = body.description
        update_fields.append("description")
    if body.priority is not None:
        task.priority = body.priority
        update_fields.append("priority")
    if body.status is not None:
        task.status = body.status
        update_fields.append("status")
    if body.due_date is not None:
        task.due_date = body.due_date
        update_fields.append("due_date")
    if body.category_id is not None:
        if body.category_id == 0:
            task.category_id = None
        else:
            try:
                cat = await Category.objects.aget(id=body.category_id, user=user)
                task.category = cat
            except Category.DoesNotExist:
                raise BadRequest(detail="Category not found or not yours.")
        update_fields.append("category_id")
    if update_fields:
        await sync_to_async(task.save)(update_fields=update_fields)
    return await sync_to_async(_task_payload)(task, get_bolt_base_url(request))


@api.delete(
    "/todos/{task_id}/",
    auth=[JWTAuthentication()],
    guards=[IsAuthenticated()],
    summary="Delete task",
    tags=["todos", "tasks"],
    status_code=204,
)
async def task_delete(task_id: int, user=Depends(get_current_user_async)):
    try:
        task = await Task.objects.aget(id=task_id, user=user)
    except Task.DoesNotExist:
        raise NotFound(detail="Task not found.")
    await task.adelete()
