from django.urls import path
from .views import RegisterView, LoginView, get_user_streaks, update_streak, get_streak_leaderboard

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("streaks/", get_user_streaks, name="get_user_streaks"),
    path("streaks/update/", update_streak, name="update_streak"),
    path("streaks/leaderboard/", get_streak_leaderboard, name="streak_leaderboard"),
]
