from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
import uuid

class User(AbstractUser):
    # Extra fields if you want, for now just email and username are enough
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class UserStreak(models.Model):
    STREAK_TYPES = [
        ('daily_login', 'Daily Login'),
        ('task_completion', 'Task Completion'),
        ('page_creation', 'Page Creation'),
        ('editor_usage', 'Editor Usage'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='streaks')
    streak_type = models.CharField(max_length=20, choices=STREAK_TYPES)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    total_activities = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'streak_type']

    def update_streak(self):
        """Update streak based on today's activity"""
        today = timezone.now().date()

        # If already updated today, just return
        if self.last_active_date == today:
            return self.current_streak
        
        # Check if streak continues (yesterday) or breaks
        if self.last_active_date == today - timedelta(days=1):
            # Continued streak
            self.current_streak += 1
        else:
            # Streak broken or first day
            self.current_streak = 1

        # Update longest streak record
        self.longest_streak = max(self.longest_streak, self.current_streak)
        self.last_active_date = today
        self.total_activities += 1
        self.save()
        
        # Check for milestone badges
        self._check_streak_milestones()
        
        return self.current_streak

    def _check_streak_milestones(self):
        """Award badges for streak milestones"""
        milestones = [7, 14, 30, 60, 100, 365]
        
        for milestone in milestones:
            if self.current_streak == milestone:
                StreakBadge.objects.get_or_create(
                    user=self.user,
                    streak_type=self.streak_type,
                    milestone=milestone,
                    defaults={
                        'earned_at': timezone.now(),
                        'streak_count': self.current_streak
                    }
                )

    def is_streak_at_risk(self):
        """Check if streak is at risk (user hasn't been active today)"""
        today = timezone.now().date()
        return self.last_active_date < today

    def __str__(self):
        return f"{self.user.username} - {self.streak_type}: {self.current_streak} days"

class StreakBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='streak_badges')
    streak_type = models.CharField(max_length=20, choices=UserStreak.STREAK_TYPES)
    milestone = models.IntegerField()  # 7, 14, 30, etc.
    streak_count = models.IntegerField()  # Actual streak when earned
    earned_at = models.DateTimeField()
    
    class Meta:
        unique_together = ['user', 'streak_type', 'milestone']
    
    def get_badge_name(self):
        type_names = {
            'daily_login': 'Consistent Learner',
            'task_completion': 'Task Master',
            'page_creation': 'Content Creator',
            'editor_usage': 'Writing Enthusiast'
        }
        return f"{type_names.get(self.streak_type, 'Achievement')} - {self.milestone} Days"
    
    def get_badge_emoji(self):
        if self.milestone >= 365:
            return "🏆"
        elif self.milestone >= 100:
            return "💎"
        elif self.milestone >= 60:
            return "⭐"
        elif self.milestone >= 30:
            return "🥇"
        elif self.milestone >= 14:
            return "🥈"
        else:
            return "🥉"

class UserActivity(models.Model):
    """Track daily activities for streak calculation"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=UserStreak.STREAK_TYPES)
    activity_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'activity_type', 'activity_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.activity_date}"

class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=255)
    content = models.TextField()  # Store JSON string here
    created_at = models.DateTimeField(auto_now_add=True)
