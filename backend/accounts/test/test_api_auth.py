# import pytest
# from django.urls import reverse
# from rest_framework.test import APIClient

# from accounts.models import Company, User


# @pytest.fixture
# def api_client():
#     return APIClient()


# @pytest.mark.django_db
# def test_superuser_can_create_company_and_company_admin(api_client):
#     superuser = User.objects.create_superuser(
#         username="super",
#         email="super@example.com",
#         password="superpass123",
#     )
#     api_client.force_authenticate(user=superuser)

#     url = reverse("company_with_admin_create")
#     payload = {
#         "company_name": "Acme Inc",
#         "company_description": "Test company",
#         "admin_username": "acmeadmin",
#         "admin_name": "Acme Admin",
#         "admin_email": "admin@acme.com",
#         "admin_password": "adminpass123",
#     }

#     response = api_client.post(url, payload, format="json")
#     assert response.status_code == 201

#     company = Company.objects.get(name="Acme Inc")
#     admin_user = User.objects.get(username="acmeadmin")

#     assert company.admin == admin_user
#     assert admin_user.is_company_admin is True
#     assert admin_user.company == company


# @pytest.mark.django_db
# def test_non_superuser_cannot_create_company_and_company_admin(api_client):
#     normal_user = User.objects.create_user(
#         username="normal",
#         email="normal@example.com",
#         password="normalpass123",
#     )
#     api_client.force_authenticate(user=normal_user)

#     url = reverse("company_with_admin_create")
#     payload = {
#         "company_name": "Blocked Inc",
#         "company_description": "Should not be created",
#         "admin_username": "blockedadmin",
#         "admin_name": "Blocked Admin",
#         "admin_email": "blocked@ex.com",
#         "admin_password": "blockedpass123",
#     }

#     response = api_client.post(url, payload, format="json")
#     assert response.status_code in (403, 401)
#     assert not Company.objects.filter(name="Blocked Inc").exists()


# @pytest.mark.django_db
# def test_company_admin_can_create_manager_and_member(api_client):
#     User.objects.create_superuser(
#         username="super",
#         email="super@example.com",
#         password="superpass123",
#     )
#     company_admin = User.objects.create_user(
#         username="compadmin",
#         email="compadmin@example.com",
#         password="adminpass123",
#         is_company_admin=True,
#     )
#     company = Company.objects.create(
#         name="RoleCo",
#         admin=company_admin,
#     )
#     company_admin.company = company
#     company_admin.save()

#     api_client.force_authenticate(user=company_admin)
#     url = reverse("company_user_create")

#     # Create manager
#     manager_payload = {
#         "username": "manager1",
#         "name": "Manager One",
#         "email": "manager1@roleco.com",
#         "password": "managerpass123",
#         "role": "manager",
#     }
#     resp_manager = api_client.post(url, manager_payload, format="json")
#     assert resp_manager.status_code == 201
#     manager = User.objects.get(username="manager1")
#     assert manager.is_manager is True
#     assert manager.is_member is False
#     assert manager.company == company

#     # Create member
#     member_payload = {
#         "username": "member1",
#         "name": "Member One",
#         "email": "member1@roleco.com",
#         "password": "memberpass123",
#         "role": "member",
#     }
#     resp_member = api_client.post(url, member_payload, format="json")
#     assert resp_member.status_code == 201
#     member = User.objects.get(username="member1")
#     assert member.is_manager is False
#     assert member.is_member is True
#     assert member.company == company


# @pytest.mark.django_db
# def test_non_company_admin_cannot_create_company_users(api_client):
#     company_admin = User.objects.create_user(
#         username="compadmin",
#         email="compadmin@example.com",
#         password="adminpass123",
#         is_company_admin=True,
#     )
#     company = Company.objects.create(
#         name="RoleCo2",
#         admin=company_admin,
#     )
#     company_admin.company = company
#     company_admin.save()

#     normal_user = User.objects.create_user(
#         username="normal",
#         email="normal@example.com",
#         password="normalpass123",
#         company=company,
#     )

#     api_client.force_authenticate(user=normal_user)
#     url = reverse("company_user_create")

#     payload = {
#         "username": "newuser",
#         "name": "New User",
#         "email": "newuser@example.com",
#         "password": "somepass123",
#         "role": "member",
#     }
#     response = api_client.post(url, payload, format="json")
#     assert response.status_code == 403
#     assert not User.objects.filter(username="newuser").exists()


# @pytest.mark.django_db
# def test_login_returns_jwt_tokens(api_client):
#     User.objects.create_user(
#         username="loginuser",
#         email="loginuser@example.com",
#         password="loginpass123",
#     )

#     url = reverse("login")
#     payload = {"username": "loginuser", "password": "loginpass123"}
#     response = api_client.post(url, payload, format="json")

#     assert response.status_code == 200
#     assert "access" in response.data
#     assert "refresh" in response.data


