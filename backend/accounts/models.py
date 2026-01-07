from django.db import models

from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class User(AbstractUser, TimestampedModel):
    """
    Custom user model:
    - Superuser: global admin who can create companies and company admin users.
    - Company admin: admin for a single company, can create manager and staff users.
    - Manager / Staff: belong to a company and are managed by the company admin.
    """

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    # Flags / status
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    # Role flags inside a company
    # is_company_admin = models.BooleanField(default=False)  # Company admin (created by superuser)
    # is_manager = models.BooleanField(default=False)  # Company manager
    # is_member = models.BooleanField(default=False)  # QA user named as member (set by company admin)
    is_superuser = models.BooleanField(default=False)  # Only one super user (global)

    # Company this user belongs to (null for global superuser)
    # TODO: Uncomment when Company model is implemented
    # company = models.ForeignKey(
    #     "Company",
    #     related_name="users",
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True,
    # )

    def delete(self, using=None, keep_parents=False):
        """
        Soft delete the user: mark as deleted and inactive, but keep the row.
        """
        self.is_deleted = True
        self.is_active = False
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "is_active", "deleted_at"])


    def __str__(self):
        return self.email

'''
Company will be used a Center
'''
# class Company(TimestampedModel): # Company will be used a Center
#     """
#     Company created by the superuser.
#     Each company has one admin user (company_admin) who can create manager and staff users.
#     """

#     name = models.CharField(max_length=255)
#     description = models.TextField(blank=True, null=True)
#     is_deleted = models.BooleanField(default=False)

#     # The main admin user for this company
#     admin = models.OneToOneField(
#         "User",
#         related_name="admin_company",
#         on_delete=models.CASCADE,
#     )

#     def delete(self, using=None, keep_parents=False):
#         """
#         Soft delete the company: mark as deleted, but keep the row.
#         """
#         self.is_deleted = True
#         self.deleted_at = timezone.now()
#         self.save(update_fields=["is_deleted", "deleted_at"])

#     def __str__(self):
#         return self.name
