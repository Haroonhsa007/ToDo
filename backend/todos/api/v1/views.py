from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone

from todos.models import Task, Category
from .serializers import (
    TaskSerializer,
    TaskListSerializer,
    TaskStatisticsSerializer,
    CategorySerializer,
)


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task CRUD operations.
    Users can only access their own tasks.
    """
    
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'priority', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Return only tasks belonging to the current user."""
        queryset = Task.objects.filter(user=self.request.user)
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by priority
        priority_param = self.request.query_params.get('priority', None)
        if priority_param:
            queryset = queryset.filter(priority=priority_param)
        
        # Filter by category
        category_param = self.request.query_params.get('category', None)
        if category_param:
            queryset = queryset.filter(category_id=category_param)
        
        return queryset.select_related('category', 'user')
    
    def get_serializer_class(self):
        """Use different serializers for list vs detail views."""
        if self.action == 'list':
            return TaskListSerializer
        return TaskSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a task."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get task statistics for the current user."""
        queryset = self.get_queryset()
        
        total = queryset.count()
        completed = queryset.filter(status='Completed').count()
        in_progress = queryset.filter(status='In Progress').count()
        not_started = queryset.filter(status='Not Started').count()
        
        completed_percentage = (completed / total * 100) if total > 0 else 0
        in_progress_percentage = (in_progress / total * 100) if total > 0 else 0
        not_started_percentage = (not_started / total * 100) if total > 0 else 0
        
        data = {
            'total': total,
            'completed': completed,
            'in_progress': in_progress,
            'not_started': not_started,
            'completed_percentage': round(completed_percentage, 2),
            'in_progress_percentage': round(in_progress_percentage, 2),
            'not_started_percentage': round(not_started_percentage, 2),
        }
        
        serializer = TaskStatisticsSerializer(data)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category CRUD operations.
    Users can only access their own categories.
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    
    def get_queryset(self):
        """Return only categories belonging to the current user."""
        return Category.objects.filter(user=self.request.user).order_by('name')
    
    def perform_create(self, serializer):
        """Set the user when creating a category."""
        serializer.save(user=self.request.user)

