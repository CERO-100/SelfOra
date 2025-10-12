from django.contrib import admin
from .models import LearningVideo, MotivationalQuote, Template, UserFeedback
from django.contrib.auth import get_user_model

User = get_user_model()

# Register your models here.
@admin.register(LearningVideo)
class LearningVideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'order', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['is_active', 'order']
    ordering = ['order', '-created_at'] 
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'video_url') 
        }),
        ('Display Settings', {
            'fields': ('is_active', 'order')
        }),
    )


@admin.register(MotivationalQuote)
class MotivationalQuoteAdmin(admin.ModelAdmin):
    list_display = ['quote_preview', 'author', 'is_active', 'order', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['quote_text', 'author']
    list_editable = ['is_active', 'order']
    ordering = ['order', '-created_at']
    def quote_preview(self, obj):
        return f"{obj.quote_text[:50]}..." if len(obj.quote_text) > 50 else obj.quote_text
    quote_preview.short_description = 'Quote'
    fieldsets = (
        (None, {
            'fields': ('quote_text', 'author')
        }),
        ('Display Settings', {
            'fields': ('is_active', 'order')
        }),
    )


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'is_active', 'is_default', 'order', 'created_at']
    list_filter = ['type', 'is_active', 'is_default', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active', 'is_default', 'order']
    ordering = ['order', '-created_at']
    fieldsets = (
        (None, {
            'fields': ('name', 'type', 'description')
        }),
        ('Content', {
            'fields': ('content',)
        }),
        ('Settings', {
            'fields': ('is_active', 'is_default', 'order')
        }),
    )


@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'type', 'priority', 'status', 'created_at']
    list_filter = ['type', 'priority', 'status', 'created_at']
    search_fields = ['title', 'description', 'user__username', 'user__email']
    list_editable = ['priority', 'status']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # If creating new feedback, set the current user as default
        if not obj and 'user' in form.base_fields:
            form.base_fields['user'].initial = request.user
        return form
    
    def save_model(self, request, obj, form, change):
        # If no user is set, use the current admin user
        if not obj.user_id:
            obj.user = request.user
        super().save_model(request, obj, form, change)
    
    fieldsets = (
        (None, {
            'fields': ('user', 'title', 'description', 'type')
        }),
        ('Management', {
            'fields': ('priority', 'status', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
