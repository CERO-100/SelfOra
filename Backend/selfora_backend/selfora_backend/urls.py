from django.contrib import admin
from django.urls import path, include
from users.views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("users.urls")),  
    path("api/", include("api.urls")),
    path("", home, name="home"),
]
