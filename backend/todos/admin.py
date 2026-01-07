from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Task, Category


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ['name', 'color', 'user', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['name', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Task)
class TaskAdmin(ModelAdmin):
    list_display = ['title', 'status', 'priority', 'user', 'category', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'created_at', 'user']
    search_fields = ['title', 'description', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'

