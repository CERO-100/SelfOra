from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LearningVideo, MotivationalQuote, Template, UserFeedback

User = get_user_model()



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user 


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class LearningVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningVideo
        fields = ['id', 'title', 'description', 'video_url', 'is_active', 'order', 'created_at', 'updated_at']


class MotivationalQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotivationalQuote
        fields = ['id', 'quote_text', 'author', 'is_active', 'order', 'created_at', 'updated_at']


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ['id', 'name', 'type', 'description', 'content', 'is_active', 'is_default', 'order', 'created_at', 'updated_at']


class UserFeedbackSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserFeedback
        fields = ['id', 'user', 'user_username', 'user_email', 'type', 'title', 'description', 
                 'priority', 'status', 'admin_notes', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

# Admin serializers
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'is_active', 'is_staff']
        read_only_fields = ['id', 'date_joined']
