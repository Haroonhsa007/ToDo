from django.contrib.auth import get_user_model
from rest_framework import serializers
from common.utils import get_image_url

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Public representation of the user used in API responses."""

    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "name",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
            "profile_picture_url",
            "is_active",
            "is_superuser",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "username", "is_active", "is_superuser", "created_at", "updated_at", "profile_picture_url"]
        extra_kwargs = {
            'profile_picture': {'required': False, 'allow_null': True}
        }

    def get_profile_picture_url(self, obj):
        """Get full URL for profile picture."""
        request = self.context.get('request')
        if obj.profile_picture and request:
            return get_image_url(request, obj.profile_picture)
        return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "name",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        ]
    
    def validate(self, attrs):
        """Validate that passwords match."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Passwords do not match."
            })
        return attrs
    
    def validate_username(self, value):
        """Validate username uniqueness."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_email(self, value):
        """Validate email uniqueness."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value
    
    def create(self, validated_data):
        """Create a new user."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    confirm_password = serializers.CharField(required=True, write_only=True, min_length=8)
    
    def validate(self, attrs):
        """Validate that new passwords match."""
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "new_password": "New passwords do not match."
            })
        return attrs
    
    def validate_old_password(self, value):
        """Validate old password."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
