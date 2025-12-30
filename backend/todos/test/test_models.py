import pytest
from django.contrib.auth import get_user_model
from todos.models import Task, Category

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        name='Test User',
        password='testpass123',
    )


@pytest.fixture
def category(user):
    return Category.objects.create(
        name='Work',
        color='#FF6767',
        user=user,
    )


@pytest.mark.django_db
class TestCategoryModel:
    """Test Category model."""
    
    def test_create_category(self, user):
        """Test creating a category."""
        category = Category.objects.create(
            name='Personal',
            color='#42ADE2',
            user=user,
        )
        
        assert category.name == 'Personal'
        assert category.color == '#42ADE2'
        assert category.user == user
        assert category.created_at is not None
        assert category.updated_at is not None
    
    def test_category_str(self, category):
        """Test category string representation."""
        assert str(category) == f"Work ({category.user.username})"
    
    def test_category_unique_per_user(self, user):
        """Test that category names are unique per user."""
        Category.objects.create(name='Work', user=user)
        
        # Same user cannot have duplicate category name
        with pytest.raises(Exception):
            Category.objects.create(name='Work', user=user)
        
        # Different user can have same category name
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            name='Other User',
            password='pass123',
        )
        Category.objects.create(name='Work', user=other_user)


@pytest.mark.django_db
class TestTaskModel:
    """Test Task model."""
    
    def test_create_task(self, user):
        """Test creating a task."""
        task = Task.objects.create(
            title='Test Task',
            description='This is a test task',
            priority='Moderate',
            status='Not Started',
            user=user,
        )
        
        assert task.title == 'Test Task'
        assert task.description == 'This is a test task'
        assert task.priority == 'Moderate'
        assert task.status == 'Not Started'
        assert task.user == user
        assert task.created_at is not None
        assert task.updated_at is not None
    
    def test_create_task_with_category(self, user, category):
        """Test creating a task with a category."""
        task = Task.objects.create(
            title='Task with Category',
            description='Description',
            priority='Extreme',
            status='In Progress',
            user=user,
            category=category,
        )
        
        assert task.category == category
        assert task in category.tasks.all()
    
    def test_task_str(self, user):
        """Test task string representation."""
        task = Task.objects.create(
            title='Test Task',
            description='Description',
            user=user,
        )
        assert str(task) == f"Test Task ({user.username})"
    
    def test_task_default_values(self, user):
        """Test task default values."""
        task = Task.objects.create(
            title='Test Task',
            description='Description',
            user=user,
        )
        
        assert task.priority == 'Moderate'
        assert task.status == 'Not Started'
        assert task.category is None


@pytest.mark.django_db
class TestModelRelationships:
    """Test relationships between models."""
    
    def test_user_category_relationship(self, user):
        """Test user-category relationship."""
        category = Category.objects.create(name='Work', user=user)
        assert category in user.categories.all()
    
    def test_user_task_relationship(self, user):
        """Test user-task relationship."""
        task = Task.objects.create(
            title='Test Task',
            description='Description',
            user=user,
        )
        assert task in user.tasks.all()
    
    def test_category_task_relationship(self, user, category):
        """Test category-task relationship."""
        task = Task.objects.create(
            title='Test Task',
            description='Description',
            user=user,
            category=category,
        )
        assert task in category.tasks.all()
    
    def test_delete_category_sets_task_category_to_null(self, user, category):
        """Test that deleting a category sets task category to null."""
        task = Task.objects.create(
            title='Test Task',
            description='Description',
            user=user,
            category=category,
        )
        category_id = category.id
        category.delete()
        
        task.refresh_from_db()
        assert task.category is None

