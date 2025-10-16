from django.contrib import admin
from .models import Template, Page


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "owner", "is_global", "updated_at")
	list_filter = ("is_global", "category")
	search_fields = ("title", "description", "owner__username")


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "owner", "is_favorite", "updated_at")
	list_filter = ("is_favorite",)
	search_fields = ("title", "owner__username")

