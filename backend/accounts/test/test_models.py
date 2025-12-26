# import datetime

# import pytest
# from accounts.models import Company, User


# @pytest.mark.django_db
# def test_company_str_returns_name():
#     admin_user = User.objects.create(
#         username="adminuser",
#         email="admin@example.com",
#         name="Admin User",
#         is_company_admin=True,
#     )
#     company = Company.objects.create(
#         name="Acme Corp", description="A test company.", admin=admin_user
#     )
#     assert str(company) == "Acme Corp"


# @pytest.mark.django_db
# def test_user_str_returns_email():
#     user = User.objects.create(
#         username="testuser",
#         email="user@example.com",
#         name="Test User",
#     )
#     assert str(user) == "user@example.com"


# @pytest.mark.django_db
# def test_user_default_role_and_status_flags():
#     user = User.objects.create(
#         username="rolesuser",
#         email="roles@example.com",
#         name="Roles User",
#     )
#     assert user.is_company_admin is False
#     assert user.is_manager is False
#     assert user.is_member is False  # Set by company admin during account creation
#     assert user.is_superuser is False
#     assert user.is_deleted is False
#     assert user.is_active is True


# @pytest.mark.django_db
# def test_company_default_is_deleted_flag():
#     admin_user = User.objects.create(
#         username="compdefaultadmin",
#         email="compdefaultadmin@example.com",
#         name="Comp Default Admin",
#         is_company_admin=True,
#     )
#     company = Company.objects.create(
#         name="DefaultCo", description="", admin=admin_user
#     )
#     assert company.is_deleted is False


# @pytest.mark.django_db
# def test_user_soft_delete_marks_deleted_and_inactive_but_keeps_row():
#     user = User.objects.create(
#         username="deletetest",
#         email="delete@example.com",
#         name="To Delete",
#     )
#     user_id = user.id
#     count_before = User.objects.count()

#     assert user.is_deleted is False
#     assert user.is_active is True

#     user.delete()
#     user.refresh_from_db()

#     assert user.is_deleted is True
#     assert user.is_active is False
#     assert user.deleted_at is not None
#     assert isinstance(user.deleted_at, datetime.datetime)

#     # Soft delete should not reduce the total row count
#     assert User.objects.count() == count_before
#     assert User.objects.get(id=user_id).is_deleted is True


# @pytest.mark.django_db
# def test_company_soft_delete_marks_deleted_but_keeps_row():
#     admin_user = User.objects.create(
#         username="compadmin",
#         email="compadmin@example.com",
#         name="Comp Admin",
#         is_company_admin=True,
#     )
#     company = Company.objects.create(
#         name="SoftDeleteCo", description="", admin=admin_user
#     )
#     company_id = company.id
#     count_before = Company.objects.count()

#     assert company.is_deleted is False

#     company.delete()
#     company.refresh_from_db()

#     assert company.is_deleted is True
#     assert company.deleted_at is not None
#     assert isinstance(company.deleted_at, datetime.datetime)

#     # Soft delete should not reduce the total row count
#     assert Company.objects.count() == count_before
#     assert Company.objects.get(id=company_id).is_deleted is True


# @pytest.mark.django_db
# def test_user_company_relationship():
#     admin = User.objects.create(
#         username="companyadmin",
#         email="admin@cmpx.com",
#         name="Cmpx Admin",
#     )
#     company = Company.objects.create(
#         name="Cmpx",
#         admin=admin,
#     )
#     staff_user = User.objects.create(
#         username="staff1",
#         email="staff1@cmpx.com",
#         name="Staff 1",
#         company=company,
#     )
#     assert staff_user.company == company
#     assert staff_user in company.users.all()


# @pytest.mark.django_db
# def test_company_admin_relationship_via_one_to_one():
#     admin = User.objects.create(
#         username="onetooneadmin",
#         email="onetooneadmin@example.com",
#         name="OneToOne Admin",
#         is_company_admin=True,
#     )
#     company = Company.objects.create(
#         name="OneToOneCo",
#         admin=admin,
#     )
#     # Forward relation
#     assert company.admin == admin
#     # Reverse relation via related_name
#     assert admin.admin_company == company


# @pytest.mark.django_db
# def test_timestamped_model_fields_auto_set_on_create_and_update():
#     admin = User.objects.create(
#         username="admints",
#         email="admints@ts.com",
#         name="Admin TS",
#     )
#     company = Company.objects.create(
#         name="TimestampCo",
#         admin=admin,
#     )
#     assert company.created_at is not None
#     assert company.updated_at is not None
#     before_update = company.updated_at
#     company.description = "Updated desc"
#     company.save()
#     company.refresh_from_db()
#     assert company.updated_at >= before_update


# @pytest.mark.django_db
# def test_soft_deleting_company_does_not_delete_related_users():
#     admin = User.objects.create(
#         username="reladmin",
#         email="reladmin@example.com",
#         name="Rel Admin",
#         is_company_admin=True,
#     )
#     company = Company.objects.create(
#         name="RelCo",
#         admin=admin,
#     )
#     staff_user = User.objects.create(
#         username="relstaff",
#         email="relstaff@example.com",
#         name="Rel Staff",
#         company=company,
#     )

#     company.delete()
#     company.refresh_from_db()
#     staff_user.refresh_from_db()

#     assert company.is_deleted is True
#     # User should still exist and still be linked to the company row
#     assert staff_user.company == company