# from django.contrib.auth import get_user_model
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated, IsAdminUser
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework_simplejwt.views import TokenObtainPairView

# from .serializers import (
#     CompanyUserCreateSerializer,
#     CompanyWithAdminCreateSerializer,
#     UserSerializer,
# )


# User = get_user_model()


# class MeView(APIView):
#     """
#     Simple authenticated endpoint to verify JWT setup.

#     - Send the access token in the Authorization header:
#         Authorization: Bearer <access_token>
#     """

#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         # Ensure related company is fetched in a single query when serialized
#         user = User.objects.select_related("company").get(pk=request.user.pk)
#         return Response(UserSerializer(user).data)


# class LoginView(TokenObtainPairView):
#     """
#     JWT login endpoint.
#     Uses SimpleJWT's TokenObtainPairView under the hood.
#     """

#     # Default serializer is fine; can be customized later if needed.
#     pass


# class CompanyWithAdminCreateView(APIView):
#     """
#     Superuser-only endpoint to create a Company and its company_admin.
#     """

#     permission_classes = [IsAuthenticated, IsAdminUser]

#     def post(self, request, *args, **kwargs):
#         serializer = CompanyWithAdminCreateSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         result = serializer.save()
#         company = result["company"]
#         admin = result["admin"]

#         return Response(
#             {
#                 "company": {
#                     "id": company.id,
#                     "name": company.name,
#                     "description": company.description,
#                 },
#                 "admin": UserSerializer(admin).data,
#             },
#             status=status.HTTP_201_CREATED,
#         )


# class CompanyUserCreateView(APIView):
#     """
#     Company admin endpoint to create manager/member users in their company.
#     """

#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         if not request.user.is_company_admin or request.user.company is None:
#             return Response(
#                 {"detail": "Only a company admin can create company users."},
#                 status=status.HTTP_403_FORBIDDEN,
#             )

#         serializer = CompanyUserCreateSerializer(
#             data=request.data,
#             context={"request": request},
#         )
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         return Response(
#             UserSerializer(user).data,
#             status=status.HTTP_201_CREATED,
#         )
