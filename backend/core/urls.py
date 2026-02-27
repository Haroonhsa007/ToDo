"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django Control Room dashboard and panels
    path("admin/dj-redis-panel/", include("dj_redis_panel.urls")),
    path("admin/dj-cache-panel/", include("dj_cache_panel.urls")),
    path("admin/dj-urls-panel/", include("dj_urls_panel.urls")),
    path("admin/dj-celery-panel/", include("dj_celery_panel.urls")),
    path("admin/dj-control-room/", include("dj_control_room.urls")),

    # Django admin
    path("admin/", admin.site.urls),

    # API versioning
    path("api/v1/", include("accounts.api.v1.urls")),
    path("api/v1/", include("todos.api.v1.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
