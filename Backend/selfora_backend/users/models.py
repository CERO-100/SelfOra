from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Extra fields if you want, for now just email and username are enough
    email = models.EmailField(unique=True)

    class Meta:
        app_label = 'users'
        db_table = 'users_customuser'

    def __str__(self):
        return self.username

class LearningVideo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_url = models.URLField(help_text="YouTube embed URL or other video URL")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class MotivationalQuote(models.Model):
    quote_text = models.TextField(max_length=500)
    author = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.quote_text[:50]}..." if len(self.quote_text) > 50 else self.quote_text


class Template(models.Model):
    TEMPLATE_TYPES = [
        ('study_plan', 'Study Plan'),
        ('goal_tracker', 'Goal Tracker'),
        ('habit_tracker', 'Habit Tracker'),
        ('daily_schedule', 'Daily Schedule'),
        ('notes', 'Notes'),
    ]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TEMPLATE_TYPES)
    description = models.TextField(blank=True)
    content = models.JSONField(help_text="Template structure and fields")
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class UserFeedback(models.Model):
    FEEDBACK_TYPES = [
        ('bug', 'Bug Report'),
        ('feature', 'Feature Request'),
        ('improvement', 'Improvement Suggestion'),
        ('general', 'General Feedback'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='feedback',
        null=True,  # Allow null temporarily for admin creation
        blank=True  # Allow blank in forms
    )
    type = models.CharField(max_length=20, choices=FEEDBACK_TYPES, default='general')
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_notes = models.TextField(blank=True, help_text="Internal notes for admin")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        user_name = self.user.username if self.user else 'Anonymous'
        return f"{self.title} - {user_name}"
    
    def clean(self):
        """Custom validation to ensure user is set"""
        from django.core.exceptions import ValidationError
        if not self.user:
            raise ValidationError('User field is required.')
    
    def save(self, *args, **kwargs):
        # Run validation before saving
        self.clean()
        super().save(*args, **kwargs)
