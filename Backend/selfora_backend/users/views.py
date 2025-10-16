from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import date

from .serializers import RegisterSerializer
from .models import UserStreak, StreakBadge, UserActivity, Page

User = get_user_model()

# ✅ Root test view
def home(request):
    return JsonResponse({"message": "Welcome to Selfora API"})

# ✅ Login view
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            print(f"Login attempt for email: {email}")

            if not email or not password:
                return Response({"detail": "Email and password are required."}, status=400)

            # Since USERNAME_FIELD = 'email' in User model, authenticate with email
            user = authenticate(request, username=email, password=password)

            if user is None:
                print(f"Authentication failed for email: {email}")
                return Response({"detail": "Invalid email or password."}, status=400)
            
            print(f"Authentication successful for: {user.email}")

            if not user.is_active:
                return Response({"detail": "Account is disabled."}, status=400)

            # Record login streak
            try:
                streak, created = UserStreak.objects.get_or_create(
                    user=user,
                    streak_type='daily_login',
                    defaults={'current_streak': 0, 'longest_streak': 0}
                )
                
                activity, activity_created = UserActivity.objects.get_or_create(
                    user=user,
                    activity_type='daily_login',
                    activity_date=date.today()
                )
                
                if activity_created:
                    streak.update_streak()
            except Exception as e:
                # Log the error but don't fail login
                print(f"Streak update error: {e}")
                import traceback
                traceback.print_exc()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            # Check if user is admin (superuser)
            if user.is_superuser:
                return Response(
                    {
                        "message": "Admin login successful!",
                        "redirect_url": "/admin/dashboard",
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                            "role": "admin",
                        },
                        "token": {
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                    },
                    status=status.HTTP_200_OK,
                )

            # Normal user response
            return Response(
                {
                    "message": "Login successful!",
                    "redirect_url": "/user/dashboard",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": "user",
                    },
                    "token": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            # Catch any unexpected errors
            print(f"Login error: {e}")
            import traceback
            traceback.print_exc()
            return Response({"detail": f"Server error: {str(e)}"}, status=500)

# ✅ Register view
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "User created successfully"},
                    status=status.HTTP_201_CREATED,
                )
            
            # Log validation errors for debugging
            print("Registration validation errors:", serializer.errors)
            
            # Return detailed validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Catch any unexpected errors during registration
            print(f"Registration error: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {"detail": f"Server error during registration: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_streaks(request):
    """Get all streak data for the authenticated user"""
    try:
        streaks = UserStreak.objects.filter(user=request.user)
        streak_data = {}
        
        for streak in streaks:
            streak_data[streak.streak_type] = {
                'current_streak': streak.current_streak,
                'longest_streak': streak.longest_streak,
                'last_active_date': streak.last_active_date,
                'total_activities': streak.total_activities,
                'is_at_risk': streak.is_streak_at_risk()
            }
        
        # Get recent badges
        recent_badges = StreakBadge.objects.filter(
            user=request.user
        ).order_by('-earned_at')[:5]
        
        badges_data = []
        for badge in recent_badges:
            badges_data.append({
                'name': badge.get_badge_name(),
                'emoji': badge.get_badge_emoji(),
                'milestone': badge.milestone,
                'streak_type': badge.streak_type,
                'earned_at': badge.earned_at
            })
        
        return Response({
            'streaks': streak_data,
            'badges': badges_data,
            'total_badges': StreakBadge.objects.filter(user=request.user).count()
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_streak(request):
    """Update streak for a specific activity type"""
    activity_type = request.data.get('activity_type')
    
    if activity_type not in dict(UserStreak.STREAK_TYPES):
        return Response(
            {'error': 'Invalid activity type'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create or get the streak record
        streak, created = UserStreak.objects.get_or_create(
            user=request.user,
            streak_type=activity_type,
            defaults={
                'current_streak': 0,
                'longest_streak': 0
            }
        )
        
        # Record the activity
        activity, activity_created = UserActivity.objects.get_or_create(
            user=request.user,
            activity_type=activity_type,
            activity_date=date.today()
        )
        
        # Update streak only if it's a new activity for today
        if activity_created:
            new_streak = streak.update_streak()
            
            return Response({
                'message': f'Streak updated for {activity_type}',
                'current_streak': new_streak,
                'longest_streak': streak.longest_streak,
                'is_new_record': new_streak == streak.longest_streak and new_streak > 1
            })
        else:
            return Response({
                'message': 'Activity already recorded for today',
                'current_streak': streak.current_streak,
                'longest_streak': streak.longest_streak
            })
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_streak_leaderboard(request):
    """Get leaderboard for streaks"""
    activity_type = request.GET.get('type', 'daily_login')
    
    try:
        # Get top streaks for the specified type
        top_streaks = UserStreak.objects.filter(
            streak_type=activity_type
        ).select_related('user').order_by('-current_streak')[:10]
        
        leaderboard = []
        for i, streak in enumerate(top_streaks):
            leaderboard.append({
                'rank': i + 1,
                'username': streak.user.username,
                'current_streak': streak.current_streak,
                'longest_streak': streak.longest_streak,
                'is_current_user': streak.user == request.user
            })
        
        return Response({'leaderboard': leaderboard})
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Views for Page model
class PageView(APIView):
    def post(self, request):
        """Create a new page"""
        try:
            page = Page.objects.create(
                title=request.data.get("title"),
                content=request.data.get("content")  # JSON string
            )
            return Response({"id": str(page.id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request, pk):
        """Retrieve a specific page by ID"""
        try:
            page = Page.objects.get(pk=pk)
            return Response({
                "title": page.title,
                "content": page.content
            })
        except Page.DoesNotExist:
            return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Admin-only views for managing learning videos and motivational quotes
class LearningVideoView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        """Validate and save a learning video"""
        try:
            # Extract video data from request
            video_url = request.data.get("video_url")
            title = request.data.get("title")
            description = request.data.get("description")
            
            # Basic validation
            if not video_url or not title:
                return Response(
                    {"error": "Video URL and title are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # TODO: Add actual video saving logic here
            # For now, we just return the received data as a mock response
            return Response({
                "message": "Video saved successfully.",
                "video_url": video_url,
                "title": title,
                "description": description
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MotivationalQuoteView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        """Validate and save a motivational quote"""
        try:
            # Extract quote data from request
            quote_text = request.data.get("quote")
            author = request.data.get("author")
            
            # Basic validation
            if not quote_text or not author:
                return Response(
                    {"error": "Quote text and author are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # TODO: Add actual quote saving logic here
            # For now, we just return the received data as a mock response
            return Response({
                "message": "Quote saved successfully.",
                "quote": quote_text,
                "author": author
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

