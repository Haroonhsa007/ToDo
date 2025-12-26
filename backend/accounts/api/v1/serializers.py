# from django.contrib.auth import get_user_model
# from django.db import transaction
# from rest_framework import serializers

# from accounts.models import Company


# User = get_user_model()


# class UserSerializer(serializers.ModelSerializer):
#     """Public representation of the user used in API responses."""

#     class Meta:
#         model = User
#         fields = [
#             "id",
#             "username",
#             "name",
#             "email",
#             "is_company_admin",
#             "is_manager",
#             "is_member",
#             "is_active",
#             "is_deleted",
#             "is_superuser",
#             "company",
#         ]
#         read_only_fields = ["id", "is_active", "company"]


# class _UniqueUsernameEmailMixin(serializers.Serializer):
#     """Shared validation for username/email uniqueness.

#     This mixin is used in multiple serializers:
#     - `CompanyUserCreateSerializer` uses the standard `username` / `email` fields,
#       so DRF will call `validate_username` / `validate_email`.
#     - `CompanyWithAdminCreateSerializer` uses `admin_username` / `admin_email`,
#       so it must call the internal helpers explicitly inside `validate()`.
#     """

#     def _validate_unique_username(self, value: str) -> str:
#         if User.objects.filter(username=value).exists():
#             raise serializers.ValidationError("Username already exists.")
#         return value

#     def _validate_unique_email(self, value: str) -> str:
#         if User.objects.filter(email=value).exists():
#             raise serializers.ValidationError("Email already exists.")
#         return value

#     def validate_username(self, value: str) -> str:
#         # Used when the field is literally named "username"
#         return self._validate_unique_username(value)

#     def validate_email(self, value: str) -> str:
#         # Used when the field is literally named "email"
#         return self._validate_unique_email(value)


# class CompanyWithAdminCreateSerializer(_UniqueUsernameEmailMixin):
#     """
#     Used by a global superuser to create:
#     - a new Company
#     - its company_admin user
#     in a single request.
#     """

#     company_name = serializers.CharField(max_length=255)
#     company_description = serializers.CharField(
#         required=False, allow_blank=True, allow_null=True
#     )

#     admin_username = serializers.CharField(max_length=150)
#     admin_name = serializers.CharField(max_length=255)
#     admin_email = serializers.EmailField()
#     admin_password = serializers.CharField(write_only=True, min_length=8)

#     def validate(self, attrs):
#         """
#         Ensure that admin_username/admin_email are unique before hitting the DB.

#         Without this, attempting to reuse an existing username/email would raise
#         an IntegrityError from the database instead of a clean 400 response.
#         """
#         attrs = super().validate(attrs)
#         self._validate_unique_username(attrs["admin_username"])
#         self._validate_unique_email(attrs["admin_email"])
#         return attrs

#     def create(self, validated_data):
#         company_name = validated_data["company_name"]
#         company_description = validated_data.get("company_description", "")

#         admin_username = validated_data["admin_username"]
#         admin_name = validated_data["admin_name"]
#         admin_email = validated_data["admin_email"]
#         admin_password = validated_data["admin_password"]

#         with transaction.atomic():
#             # Create company_admin user first (no company yet)
#             admin_user = User.objects.create_user(
#                 username=admin_username,
#                 email=admin_email,
#                 name=admin_name,
#                 password=admin_password,
#                 is_company_admin=True,
#             )

#             # Create company and link admin
#             company = Company.objects.create(
#                 name=company_name,
#                 description=company_description,
#                 admin=admin_user,
#             )

#             # Link admin user to the company
#             admin_user.company = company
#             admin_user.save(update_fields=["company"])

#         return {
#             "company": company,
#             "admin": admin_user,
#         }


# class CompanyUserCreateSerializer(_UniqueUsernameEmailMixin):
#     """
#     Used by a company_admin to create manager/member users in their company.
#     """

#     username = serializers.CharField(max_length=150)
#     name = serializers.CharField(max_length=255)
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True, min_length=8)
#     role = serializers.ChoiceField(choices=["manager", "member"])

#     def create(self, validated_data):
#         request = self.context["request"]
#         creator = request.user

#         if not creator.is_company_admin or creator.company is None:
#             raise serializers.ValidationError(
#                 "Only a company admin with an associated company can create users."
#             )

#         role = validated_data["role"]
#         is_manager = role == "manager"
#         is_member = role == "member"

#         return User.objects.create_user(
#             username=validated_data["username"],
#             email=validated_data["email"],
#             name=validated_data["name"],
#             password=validated_data["password"],
#             company=creator.company,
#             is_manager=is_manager,
#             is_member=is_member,
#         )


