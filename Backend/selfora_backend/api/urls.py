from rest_framework.routers import DefaultRouter
from .views import TemplateViewSet, PageViewSet

router = DefaultRouter()
router.register(r"templates", TemplateViewSet, basename="template")
router.register(r"pages", PageViewSet, basename="page")

urlpatterns = router.urls
