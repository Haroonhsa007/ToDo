import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_data():
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'name': 'Test User',
        'password': 'testpass123',
        'password_confirm': 'testpass123',
    }


@pytest.fixture
def created_user(user_data):
    return User.objects.create_user(
        username=user_data['username'],
        email=user_data['email'],
        name=user_data['name'],
        password=user_data['password'],
    )


@pytest.mark.django_db
class TestUserRegistration:
    """Test user registration endpoint."""
    
    def test_register_user_success(self, api_client, user_data):
        """Test successful user registration."""
        url = reverse('register')
        response = api_client.post(url, user_data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['username'] == user_data['username']
        assert response.data['user']['email'] == user_data['email']
        
        # Verify user was created
        assert User.objects.filter(username=user_data['username']).exists()
    
    def test_register_user_duplicate_username(self, api_client, user_data, created_user):
        """Test registration with duplicate username fails."""
        url = reverse('register')
        response = api_client.post(url, user_data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'username' in str(response.data).lower()
    
    def test_register_user_password_mismatch(self, api_client, user_data):
        """Test registration with mismatched passwords fails."""
        user_data['password_confirm'] = 'differentpass123'
        url = reverse('register')
        response = api_client.post(url, user_data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in str(response.data).lower()
    
    def test_register_user_short_password(self, api_client, user_data):
        """Test registration with short password fails."""
        user_data['password'] = 'short'
        user_data['password_confirm'] = 'short'
        url = reverse('register')
        response = api_client.post(url, user_data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserLogin:
    """Test user login endpoint."""
    
    def test_login_success(self, api_client, created_user, user_data):
        """Test successful login."""
        url = reverse('login')
        response = api_client.post(
            url,
            {
                'username': user_data['username'],
                'password': user_data['password'],
            },
            format='json'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['username'] == user_data['username']
    
    def test_login_invalid_credentials(self, api_client, created_user):
        """Test login with invalid credentials fails."""
        url = reverse('login')
        response = api_client.post(
            url,
            {
                'username': 'testuser',
                'password': 'wrongpassword',
            },
            format='json'
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_nonexistent_user(self, api_client):
        """Test login with nonexistent user fails."""
        url = reverse('login')
        response = api_client.post(
            url,
            {
                'username': 'nonexistent',
                'password': 'password123',
            },
            format='json'
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestTokenRefresh:
    """Test token refresh endpoint."""
    
    def test_refresh_token_success(self, api_client, created_user, user_data):
        """Test successful token refresh."""
        # First login to get tokens
        login_url = reverse('login')
        login_response = api_client.post(
            login_url,
            {
                'username': user_data['username'],
                'password': user_data['password'],
            },
            format='json'
        )
        refresh_token = login_response.data['refresh']
        
        # Refresh token
        refresh_url = reverse('token_refresh')
        response = api_client.post(
            refresh_url,
            {'refresh': refresh_token},
            format='json'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
    
    def test_refresh_token_invalid(self, api_client):
        """Test refresh with invalid token fails."""
        refresh_url = reverse('token_refresh')
        response = api_client.post(
            refresh_url,
            {'refresh': 'invalid_token'},
            format='json'
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestMeView:
    """Test current user profile endpoint."""
    
    def test_get_me_authenticated(self, api_client, created_user):
        """Test getting current user profile when authenticated."""
        api_client.force_authenticate(user=created_user)
        url = reverse('me')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == created_user.username
        assert response.data['email'] == created_user.email
    
    def test_get_me_unauthenticated(self, api_client):
        """Test getting current user profile when unauthenticated fails."""
        url = reverse('me')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUpdateProfile:
    """Test update profile endpoint."""
    
    def test_update_profile_success(self, api_client, created_user):
        """Test successful profile update."""
        api_client.force_authenticate(user=created_user)
        url = reverse('update_profile')
        update_data = {
            'name': 'Updated Name',
            'first_name': 'Updated',
            'last_name': 'Name',
        }
        response = api_client.put(url, update_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == update_data['name']
        assert response.data['first_name'] == update_data['first_name']
        
        # Verify database was updated
        created_user.refresh_from_db()
        assert created_user.name == update_data['name']
    
    def test_update_profile_unauthenticated(self, api_client):
        """Test update profile when unauthenticated fails."""
        url = reverse('update_profile')
        response = api_client.put(url, {'name': 'New Name'}, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestChangePassword:
    """Test change password endpoint."""
    
    def test_change_password_success(self, api_client, created_user, user_data):
        """Test successful password change."""
        api_client.force_authenticate(user=created_user)
        url = reverse('change_password')
        password_data = {
            'old_password': user_data['password'],
            'new_password': 'newpass123',
            'confirm_password': 'newpass123',
        }
        response = api_client.post(url, password_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data
        
        # Verify password was changed
        created_user.refresh_from_db()
        assert created_user.check_password('newpass123')
    
    def test_change_password_wrong_old_password(self, api_client, created_user):
        """Test password change with wrong old password fails."""
        api_client.force_authenticate(user=created_user)
        url = reverse('change_password')
        password_data = {
            'old_password': 'wrongpassword',
            'new_password': 'newpass123',
            'confirm_password': 'newpass123',
        }
        response = api_client.post(url, password_data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_change_password_mismatch(self, api_client, created_user, user_data):
        """Test password change with mismatched new passwords fails."""
        api_client.force_authenticate(user=created_user)
        url = reverse('change_password')
        password_data = {
            'old_password': user_data['password'],
            'new_password': 'newpass123',
            'confirm_password': 'differentpass123',
        }
        response = api_client.post(url, password_data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_change_password_unauthenticated(self, api_client):
        """Test password change when unauthenticated fails."""
        url = reverse('change_password')
        response = api_client.post(
            url,
            {
                'old_password': 'old',
                'new_password': 'new',
                'confirm_password': 'new',
            },
            format='json'
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
