from rest_framework import serializers
from .models import Template, Page


class TemplateSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Template
        fields = [
            "id",
            "title",
            "description",
            "content",
            "owner",
            "owner_username",
            "is_global",
            "source_template",
            "category",
            "tags",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["owner", "created_at", "updated_at"]


class PageSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Page
        fields = [
            "id",
            "title",
            "content",
            "icon",
            "is_favorite",
            "owner",
            "owner_username",
            "parent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["owner", "created_at", "updated_at"]
