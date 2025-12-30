from rest_framework import serializers
from todos.models import Task, Category
from common.utils import get_image_url


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        """Ensure category name is unique for the user."""
        user = self.context['request'].user
        if self.instance:
            # Update: exclude current instance
            if Category.objects.filter(user=user, name=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("You already have a category with this name.")
        else:
            # Create: check if exists
            if Category.objects.filter(user=user, name=value).exists():
                raise serializers.ValidationError("You already have a category with this name.")
        return value


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model."""
    
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'priority',
            'status',
            'image',
            'image_url',
            'due_date',
            'created_at',
            'updated_at',
            'user',
            'category',
            'category_name',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'image_url', 'category_name']
    
    def get_image_url(self, obj):
        """Get full URL for task image."""
        request = self.context.get('request')
        if obj.image and request:
            return get_image_url(request, obj.image)
        return None
    
    def create(self, validated_data):
        """Create a new task, automatically assigning the current user."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate_category(self, value):
        """Ensure category belongs to the current user."""
        if value:
            user = self.context['request'].user
            if value.user != user:
                raise serializers.ValidationError("You can only use your own categories.")
        return value


class TaskListSerializer(serializers.ModelSerializer):
    """Optimized serializer for task list views."""
    
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'priority',
            'status',
            'image_url',
            'due_date',
            'created_at',
            'updated_at',
            'category',
            'category_name',
        ]
    
    def get_image_url(self, obj):
        """Get full URL for task image."""
        request = self.context.get('request')
        if obj.image and request:
            return get_image_url(request, obj.image)
        return None


class TaskStatisticsSerializer(serializers.Serializer):
    """Serializer for task statistics."""
    
    total = serializers.IntegerField()
    completed = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    not_started = serializers.IntegerField()
    completed_percentage = serializers.FloatField()
    in_progress_percentage = serializers.FloatField()
    not_started_percentage = serializers.FloatField()

