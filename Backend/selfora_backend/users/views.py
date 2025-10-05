# users/views.py

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

User = get_user_model()

# ✅ Root test view
def home(request):
    return JsonResponse({"message": "Welcome to Selfora API"})


# ✅ Login view
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=400)

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid email or password."}, status=400)

        # ✅ Authenticate user by username (Django default)
        user = authenticate(username=user_obj.username, password=password)

        if user is None:
            return Response({"detail": "Invalid email or password."}, status=400)

        # ✅ Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        # ✅ Return consistent format for frontend
        return Response(
            {
                "message": "Login successful!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "token": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_200_OK,
        )


# ✅ Register view
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully"},
                status=status.HTTP_201_CREATED,
            )
        print("Register errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
