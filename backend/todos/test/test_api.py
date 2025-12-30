import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from todos.models import Task, Category
from io import BytesIO
from PIL import Image

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        name='Test User',
        password='testpass123',
    )


@pytest.fixture
def other_user():
    return User.objects.create_user(
        username='otheruser',
        email='other@example.com',
        name='Other User',
        password='pass123',
    )


@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def category(user):
    return Category.objects.create(name='Work', color='#FF6767', user=user)


@pytest.fixture
def task(user, category):
    return Task.objects.create(
        title='Test Task',
        description='Test Description',
        priority='Moderate',
        status='Not Started',
        user=user,
        category=category,
    )


def create_test_image():
    """Create a test image file."""
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes


@pytest.mark.django_db
class TestTaskCRUD:
    """Test Task CRUD operations."""
    
    def test_create_task(self, authenticated_client, category):
        """Test creating a task."""
        url = reverse('task-list')
        data = {
            'title': 'New Task',
            'description': 'Task description',
            'priority': 'Extreme',
            'status': 'Not Started',
            'category': category.id,
        }
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == data['title']
        assert response.data['priority'] == data['priority']
        assert Task.objects.filter(title=data['title']).exists()
    
    def test_create_task_with_image(self, authenticated_client, category):
        """Test creating a task with an image."""
        url = reverse('task-list')
        image = create_test_image()
        data = {
            'title': 'Task with Image',
            'description': 'Description',
            'priority': 'Moderate',
            'status': 'Not Started',
            'category': category.id,
            'image': image,
        }
        response = authenticated_client.post(url, data, format='multipart')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'image_url' in response.data
    
    def test_list_tasks(self, authenticated_client, task):
        """Test listing tasks."""
        url = reverse('task-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == task.title
    
    def test_retrieve_task(self, authenticated_client, task):
        """Test retrieving a single task."""
        url = reverse('task-detail', kwargs={'pk': task.pk})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == task.title
        assert response.data['description'] == task.description
    
    def test_update_task(self, authenticated_client, task):
        """Test updating a task."""
        url = reverse('task-detail', kwargs={'pk': task.pk})
        data = {
            'title': 'Updated Task',
            'description': 'Updated description',
            'priority': 'Extreme',
            'status': 'In Progress',
        }
        response = authenticated_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == data['title']
        assert response.data['status'] == data['status']
        
        task.refresh_from_db()
        assert task.title == data['title']
    
    def test_delete_task(self, authenticated_client, task):
        """Test deleting a task."""
        url = reverse('task-detail', kwargs={'pk': task.pk})
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Task.objects.filter(pk=task.pk).exists()
    
    def test_create_task_unauthenticated(self, api_client):
        """Test creating task without authentication fails."""
        url = reverse('task-list')
        response = api_client.post(url, {'title': 'Test'}, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestTaskFiltering:
    """Test task filtering."""
    
    def test_filter_by_status(self, authenticated_client, user):
        """Test filtering tasks by status."""
        Task.objects.create(
            title='Task 1',
            description='Desc',
            status='Completed',
            user=user,
        )
        Task.objects.create(
            title='Task 2',
            description='Desc',
            status='Not Started',
            user=user,
        )
        
        url = reverse('task-list')
        response = authenticated_client.get(url, {'status': 'Completed'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['status'] == 'Completed'
    
    def test_filter_by_priority(self, authenticated_client, user):
        """Test filtering tasks by priority."""
        Task.objects.create(
            title='Task 1',
            description='Desc',
            priority='Extreme',
            user=user,
        )
        Task.objects.create(
            title='Task 2',
            description='Desc',
            priority='Low',
            user=user,
        )
        
        url = reverse('task-list')
        response = authenticated_client.get(url, {'priority': 'Extreme'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['priority'] == 'Extreme'
    
    def test_search_tasks(self, authenticated_client, user):
        """Test searching tasks."""
        Task.objects.create(
            title='Python Task',
            description='Learn Python',
            user=user,
        )
        Task.objects.create(
            title='Django Task',
            description='Learn Django',
            user=user,
        )
        
        url = reverse('task-list')
        response = authenticated_client.get(url, {'search': 'Python'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert 'Python' in response.data['results'][0]['title']


@pytest.mark.django_db
class TestTaskStatistics:
    """Test task statistics endpoint."""
    
    def test_get_statistics(self, authenticated_client, user):
        """Test getting task statistics."""
        Task.objects.create(title='Task 1', description='Desc', status='Completed', user=user)
        Task.objects.create(title='Task 2', description='Desc', status='Completed', user=user)
        Task.objects.create(title='Task 3', description='Desc', status='In Progress', user=user)
        Task.objects.create(title='Task 4', description='Desc', status='Not Started', user=user)
        
        url = reverse('task-statistics')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['total'] == 4
        assert response.data['completed'] == 2
        assert response.data['in_progress'] == 1
        assert response.data['not_started'] == 1
        assert response.data['completed_percentage'] == 50.0


@pytest.mark.django_db
class TestUserIsolation:
    """Test that users can only access their own tasks."""
    
    def test_user_cannot_access_other_user_task(self, authenticated_client, other_user):
        """Test that a user cannot access another user's task."""
        other_task = Task.objects.create(
            title='Other User Task',
            description='Description',
            user=other_user,
        )
        
        url = reverse('task-detail', kwargs={'pk': other_task.pk})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_user_only_sees_own_tasks(self, authenticated_client, user, other_user):
        """Test that a user only sees their own tasks in list."""
        Task.objects.create(title='My Task', description='Desc', user=user)
        Task.objects.create(title='Other Task', description='Desc', user=other_user)
        
        url = reverse('task-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == 'My Task'


@pytest.mark.django_db
class TestCategoryCRUD:
    """Test Category CRUD operations."""
    
    def test_create_category(self, authenticated_client):
        """Test creating a category."""
        url = reverse('category-list')
        data = {
            'name': 'Personal',
            'color': '#42ADE2',
        }
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == data['name']
        assert Category.objects.filter(name=data['name']).exists()
    
    def test_list_categories(self, authenticated_client, category):
        """Test listing categories."""
        url = reverse('category-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == category.name
    
    def test_update_category(self, authenticated_client, category):
        """Test updating a category."""
        url = reverse('category-detail', kwargs={'pk': category.pk})
        data = {
            'name': 'Updated Category',
            'color': '#000000',
        }
        response = authenticated_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == data['name']
        
        category.refresh_from_db()
        assert category.name == data['name']
    
    def test_delete_category(self, authenticated_client, category):
        """Test deleting a category."""
        url = reverse('category-detail', kwargs={'pk': category.pk})
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Category.objects.filter(pk=category.pk).exists()
    
    def test_category_unique_per_user(self, authenticated_client, category):
        """Test that category names are unique per user."""
        url = reverse('category-list')
        data = {
            'name': category.name,  # Same name
            'color': '#FF0000',
        }
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestCategoryUserIsolation:
    """Test that users can only access their own categories."""
    
    def test_user_cannot_access_other_user_category(self, authenticated_client, other_user):
        """Test that a user cannot access another user's category."""
        other_category = Category.objects.create(
            name='Other Category',
            color='#FF0000',
            user=other_user,
        )
        
        url = reverse('category-detail', kwargs={'pk': other_category.pk})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_user_only_sees_own_categories(self, authenticated_client, user, other_user):
        """Test that a user only sees their own categories."""
        Category.objects.create(name='My Category', color='#FF0000', user=user)
        Category.objects.create(name='Other Category', color='#00FF00', user=other_user)
        
        url = reverse('category-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == 'My Category'

