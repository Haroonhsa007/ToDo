from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import TimestampedModel

User = get_user_model()


class Category(TimestampedModel):
    """Category model for organizing tasks."""
    
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#FF6767', help_text='Hex color code')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']
        unique_together = ['name', 'user']  # Each user can have unique category names
    
    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Task(TimestampedModel):
    """Task/Todo model."""
    
    PRIORITY_CHOICES = [
        ('Extreme', 'Extreme'),
        ('Moderate', 'Moderate'),
        ('Low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Moderate')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Not Started')
    image = models.ImageField(upload_to='tasks/', blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.user.username})"

