from django.urls import path
from . import views
from .views import (
    RegisterView, LoginView, get_learning_videos, get_motivational_quotes, 
    get_random_quote, AdminUsersView, AdminVideosView, AdminQuotesView,
    AdminTemplatesView, AdminFeedbackView, MongoTemplatesView, 
    InitializeTemplatesView, get_public_templates, UserDocumentsView
)

urlpatterns = [
    path("", views.home, name="home"),
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("learning-videos/", get_learning_videos, name="learning_videos"),
    path("motivational-quotes/", get_motivational_quotes, name="motivational_quotes"),
    path("random-quote/", get_random_quote, name="random_quote"),

    # Admin endpoints
    path("admin/users/", AdminUsersView.as_view(), name="admin_users"),
    path("admin/users/<int:user_id>/", AdminUsersView.as_view(), name="admin_user_detail"),
    path("admin/videos/", AdminVideosView.as_view(), name="admin_videos"),
    path("admin/videos/<int:video_id>/", AdminVideosView.as_view(), name="admin_video_detail"),
    path("admin/quotes/", AdminQuotesView.as_view(), name="admin_quotes"),
    path("admin/quotes/<int:quote_id>/", AdminQuotesView.as_view(), name="admin_quote_detail"),
    path("admin/templates/", AdminTemplatesView.as_view(), name="admin_templates"),
    path("admin/templates/<int:template_id>/", AdminTemplatesView.as_view(), name="admin_template_detail"),
    path("admin/feedback/", AdminFeedbackView.as_view(), name="admin_feedback"),
    path("admin/feedback/<int:feedback_id>/", AdminFeedbackView.as_view(), name="admin_feedback_detail"),

    # MongoDB Template endpoints
    path("mongo-templates/", MongoTemplatesView.as_view(), name="mongo_templates"),
    path("mongo-templates/<str:template_id>/", MongoTemplatesView.as_view(), name="mongo_template_detail"),
    path("initialize-templates/", InitializeTemplatesView.as_view(), name="initialize_templates"),
    path("public-templates/", get_public_templates, name="public_templates"),
    path("user-documents/", UserDocumentsView.as_view(), name="user_documents"),
]
