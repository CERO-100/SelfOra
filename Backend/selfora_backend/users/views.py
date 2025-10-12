# users/views.py

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LearningVideoSerializer, MotivationalQuoteSerializer, AdminUserSerializer, TemplateSerializer, UserFeedbackSerializer
from .models import LearningVideo, MotivationalQuote, Template, UserFeedback
from rest_framework.decorators import api_view, permission_classes
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
try:
    from .mongodb_models import NotionTemplate, UserDocument, NOTION_TEMPLATE_EXAMPLES, MONGODB_AVAILABLE
except ImportError:
    MONGODB_AVAILABLE = False
    NotionTemplate = None
    UserDocument = None
    NOTION_TEMPLATE_EXAMPLES = {}

import json

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


# ✅ Get learning videos
@api_view(['GET'])
@permission_classes([AllowAny])
def get_learning_videos(request):
    try:
        videos = LearningVideo.objects.filter(is_active=True)
        serializer = LearningVideoSerializer(videos, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=200)
    except Exception as e:
        return Response({
            "success": False,
            "message": str(e)
        }, status=500)


# ✅ Get motivational quotes
@api_view(['GET'])
@permission_classes([AllowAny])
def get_motivational_quotes(request):
    try:
        quotes = MotivationalQuote.objects.filter(is_active=True)
        serializer = MotivationalQuoteSerializer(quotes, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=200)
    except Exception as e:
        return Response({
            "success": False,
            "message": str(e)
        }, status=500)


# ✅ Get random motivational quote
@api_view(['GET'])
@permission_classes([AllowAny])
def get_random_quote(request):
    try:
        import random
        quotes = list(MotivationalQuote.objects.filter(is_active=True))
        if quotes:
            random_quote = random.choice(quotes)
            serializer = MotivationalQuoteSerializer(random_quote)
            return Response({
                "success": True,
                "data": serializer.data
            }, status=200)
        else:
            return Response({
                "success": True,
                "data": {"quote_text": "Stay focused and keep learning!", "author": "Selfora"}
            }, status=200)
    except Exception as e:
        return Response({
            "success": False,
            "message": str(e)
        }, status=500)


# ✅ Admin endpoints - Fix authentication
class AdminUsersView(APIView):
    permission_classes = [IsAdminUser]  # Changed from staff_member_required

    def get(self, request):
        """Get all users for admin"""
        try:
            users = User.objects.all().order_by('-date_joined')
            search = request.GET.get('search', '')
            
            if search:
                users = users.filter(
                    Q(username__icontains=search) | Q(email__icontains=search)
                )
            
            serializer = AdminUserSerializer(users, many=True)
            
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def patch(self, request, user_id=None):
        """Update user status"""
        try:
            if not user_id:
                return Response({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
                
            user = User.objects.get(id=user_id)
            is_active = request.data.get('is_active')
            
            if is_active is not None:
                user.is_active = is_active
                user.save()
                
            return Response({
                'success': True,
                'message': 'User updated successfully'
            })
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)


class AdminVideosView(APIView):
    permission_classes = [IsAdminUser]  # Changed from staff_member_required

    def get(self, request):
        """Get all videos for admin"""
        try:
            videos = LearningVideo.objects.all().order_by('order', '-created_at')
            search = request.GET.get('search', '')
            
            if search:
                videos = videos.filter(title__icontains=search)
            
            serializer = LearningVideoSerializer(videos, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def post(self, request):
        """Create new video"""
        serializer = LearningVideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Video created successfully'
            }, status=201)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=400)

    def patch(self, request, video_id):
        """Update video"""
        try:
            video = LearningVideo.objects.get(id=video_id)
            serializer = LearningVideoSerializer(video, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Video updated successfully'
                })
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=400)
        except LearningVideo.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Video not found'
            }, status=404)

    def delete(self, request, video_id):
        """Delete video"""
        try:
            video = LearningVideo.objects.get(id=video_id)
            video.delete()
            return Response({
                'success': True,
                'message': 'Video deleted successfully'
            })
        except LearningVideo.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Video not found'
            }, status=404)


class AdminQuotesView(APIView):
    permission_classes = [IsAdminUser]  # Changed from staff_member_required

    def get(self, request):
        """Get all quotes for admin"""
        try:
            quotes = MotivationalQuote.objects.all().order_by('order', '-created_at')
            search = request.GET.get('search', '')
            
            if search:
                quotes = quotes.filter(
                    Q(quote_text__icontains=search) | Q(author__icontains=search)
                )
            
            serializer = MotivationalQuoteSerializer(quotes, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def post(self, request):
        """Create new quote"""
        serializer = MotivationalQuoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Quote created successfully'
            }, status=201)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=400)

    def patch(self, request, quote_id):
        """Update quote"""
        try:
            quote = MotivationalQuote.objects.get(id=quote_id)
            serializer = MotivationalQuoteSerializer(quote, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Quote updated successfully'
                })
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=400)
        except MotivationalQuote.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Quote not found'
            }, status=404)

    def delete(self, request, quote_id):
        """Delete quote"""
        try:
            quote = MotivationalQuote.objects.get(id=quote_id)
            quote.delete()
            return Response({
                'success': True,
                'message': 'Quote deleted successfully'
            })
        except MotivationalQuote.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Quote not found'
            }, status=404)


class AdminTemplatesView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get all templates for admin"""
        try:
            templates = Template.objects.all().order_by('order', '-created_at')
            search = request.GET.get('search', '')
            
            if search:
                templates = templates.filter(
                    Q(name__icontains=search) | Q(description__icontains=search)
                )
            
            serializer = TemplateSerializer(templates, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def post(self, request):
        """Create new template"""
        try:
            serializer = TemplateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Template created successfully'
                }, status=201)
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=400)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def patch(self, request, template_id=None):
        """Update template"""
        try:
            if not template_id:
                return Response({
                    'success': False,
                    'message': 'Template ID is required'
                }, status=400)
                
            template = Template.objects.get(id=template_id)
            serializer = TemplateSerializer(template, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Template updated successfully'
                })
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=400)
        except Template.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Template not found'
            }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def delete(self, request, template_id=None):
        """Delete template"""
        try:
            if not template_id:
                return Response({
                    'success': False,
                    'message': 'Template ID is required'
                }, status=400)
                
            template = Template.objects.get(id=template_id)
            template.delete()
            return Response({
                'success': True,
                'message': 'Template deleted successfully'
            })
        except Template.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Template not found'
            }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)


class AdminFeedbackView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get all user feedback for admin"""
        try:
            feedback = UserFeedback.objects.all().order_by('-created_at')
            search = request.GET.get('search', '')
            status_filter = request.GET.get('status', '')
            type_filter = request.GET.get('type', '')
            
            if search:
                feedback = feedback.filter(
                    Q(title__icontains=search) | 
                    Q(description__icontains=search) |
                    Q(user__username__icontains=search)
                )
            
            if status_filter:
                feedback = feedback.filter(status=status_filter)
                
            if type_filter:
                feedback = feedback.filter(type=type_filter)
            
            serializer = UserFeedbackSerializer(feedback, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def patch(self, request, feedback_id=None):
        """Update feedback status/notes"""
        try:
            if not feedback_id:
                return Response({
                    'success': False,
                    'message': 'Feedback ID is required'
                }, status=400)
                
            feedback = UserFeedback.objects.get(id=feedback_id)
            
            # Only allow admin to update status, priority, and admin_notes
            allowed_fields = ['status', 'priority', 'admin_notes']
            update_data = {k: v for k, v in request.data.items() if k in allowed_fields}
            
            serializer = UserFeedbackSerializer(feedback, data=update_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Feedback updated successfully'
                })
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=400)
        except UserFeedback.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Feedback not found'
            }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)


class MongoTemplatesView(APIView):
    permission_classes = [IsAdminUser]

    def __init__(self):
        super().__init__()
        if MONGODB_AVAILABLE and NotionTemplate:
            self.notion_template = NotionTemplate()
        else:
            self.notion_template = None

    def get(self, request):
        """Get all MongoDB Notion-like templates"""
        if not MONGODB_AVAILABLE:
            return Response({
                'success': False,
                'message': 'MongoDB not available. Please install pymongo and start MongoDB service.'
            }, status=503)
            
        try:
            search = request.GET.get('search', '')
            template_type = request.GET.get('type', '')
            
            if search:
                templates = self.notion_template.search_templates(search)
            elif template_type:
                templates = self.notion_template.get_templates_by_type(template_type)
            else:
                templates = self.notion_template.get_all_templates()
            
            return Response({
                'success': True,
                'data': templates
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'MongoDB error: {str(e)}'
            }, status=500)

    def post(self, request):
        """Create new MongoDB template"""
        if not MONGODB_AVAILABLE:
            return Response({
                'success': False,
                'message': 'MongoDB not available. Please install pymongo and start MongoDB service.'
            }, status=503)
            
        try:
            template_data = request.data
            template_data['created_by'] = request.user.id
            
            template = self.notion_template.create_template(template_data)
            return Response({
                'success': True,
                'data': template,
                'message': 'Template created successfully'
            }, status=201)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def patch(self, request, template_id=None):
        """Update MongoDB template"""
        try:
            if not template_id:
                return Response({
                    'success': False,
                    'message': 'Template ID is required'
                }, status=400)
            
            success = self.notion_template.update_template(template_id, request.data)
            if success:
                return Response({
                    'success': True,
                    'message': 'Template updated successfully'
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Template not found or update failed'
                }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def delete(self, request, template_id=None):
        """Delete MongoDB template"""
        try:
            if not template_id:
                return Response({
                    'success': False,
                    'message': 'Template ID is required'
                }, status=400)
            
            success = self.notion_template.delete_template(template_id)
            if success:
                return Response({
                    'success': True,
                    'message': 'Template deleted successfully'
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Template not found'
                }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)


class InitializeTemplatesView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        """Initialize predefined Notion-like templates"""
        if not MONGODB_AVAILABLE:
            return Response({
                'success': False,
                'message': 'MongoDB not available. Please install pymongo: pip install pymongo==4.6.0'
            }, status=503)
            
        try:
            notion_template = NotionTemplate()
            created_templates = []
            
            for template_key, template_data in NOTION_TEMPLATE_EXAMPLES.items():
                # Check if template already exists
                existing = notion_template.get_all_templates({'name': template_data['name']})
                if not existing:
                    template_data['created_by'] = request.user.id
                    template = notion_template.create_template(template_data)
                    created_templates.append(template)
            
            return Response({
                'success': True,
                'data': created_templates,
                'message': f'Initialized {len(created_templates)} templates'
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_public_templates(request):
    """Get public templates for users"""
    try:
        notion_template = NotionTemplate()
        template_type = request.GET.get('type', '')
        
        if template_type:
            templates = notion_template.get_templates_by_type(template_type)
        else:
            templates = notion_template.get_all_templates()
        
        # Remove admin-only fields
        public_templates = []
        for template in templates:
            public_template = {
                'id': template['id'],
                'name': template['name'],
                'type': template['type'],
                'description': template['description'],
                'icon': template.get('icon', '📄'),
                'cover': template.get('cover', ''),
                'content': template['content'],
                'category': template['metadata'].get('category', 'general'),
                'tags': template['metadata'].get('tags', [])
            }
            public_templates.append(public_template)
        
        return Response({
            'success': True,
            'data': public_templates
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=500)


class UserDocumentsView(APIView):
    permission_classes = [AllowAny]  # Will add proper user auth later

    def __init__(self):
        super().__init__()
        self.user_document = UserDocument()

    def get(self, request):
        """Get user's documents"""
        try:
            user_id = request.user.id if request.user.is_authenticated else 1  # Temporary
            documents = self.user_document.get_user_documents(user_id)
            
            return Response({
                'success': True,
                'data': documents
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

    def post(self, request):
        """Create new document from template"""
        try:
            user_id = request.user.id if request.user.is_authenticated else 1  # Temporary
            template_id = request.data.get('template_id')
            document_data = request.data
            
            document = self.user_document.create_document(user_id, template_id, document_data)
            return Response({
                'success': True,
                'data': document,
                'message': 'Document created successfully'
            }, status=201)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)
