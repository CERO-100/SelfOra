from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from django.db.models import Q
from .models import Template, Page
from .serializers import TemplateSerializer, PageSerializer


class IsAdminOrOwner(permissions.BasePermission):
    """Allow admins full access; users can access their own objects; global templates are read-only for non-admins."""

    def has_object_permission(self, request, view, obj: Template):
        if request.user and request.user.is_staff:
            return True
        # Non-admins: can read all, modify only own and non-global
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner_id == getattr(request.user, "id", None) and not obj.is_global


class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        qs = super().get_queryset()
        # Non-admin users: show global templates + own
        user = self.request.user
        if user.is_staff:
            return qs
        return qs.filter(Q(is_global=True) | Q(owner=user))

    def perform_create(self, serializer):
        # If user is not admin, force is_global=False and set owner
        is_global = serializer.validated_data.get("is_global", False)
        if not self.request.user.is_staff:
            is_global = False
        serializer.save(owner=self.request.user, is_global=is_global)

    @action(detail=True, methods=["post"], url_path="use")
    def use_template(self, request, pk=None):
        """Create a user-owned copy from a template (global or another).

        Returns newly created Template with owner=request.user and source_template set.
        """
        template = self.get_object()
        data = request.data or {}
        title = data.get("title") or f"{template.title} (Copy)"
        new_template = Template.objects.create(
            title=title,
            description=data.get("description", template.description),
            content=data.get("content", template.content),
            owner=request.user,
            is_global=False,
            source_template=template,
            category=data.get("category", template.category),
            tags=data.get("tags", template.tags),
        )
        serializer = self.get_serializer(new_template)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
from django.shortcuts import render

# Create your views here.


class PageViewSet(viewsets.ModelViewSet):
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see their own pages
        return Page.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
