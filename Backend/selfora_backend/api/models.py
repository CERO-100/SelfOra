from django.db import models
from django.conf import settings


class Template(models.Model):
	"""Reusable page/content template. Admins can create global templates; users can create and customize their own."""

	title = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	# Store rich content as JSON (e.g., Notion/Novel document), fallback to text if needed
	content = models.JSONField(default=dict, blank=True)

	# Ownership and scope
	owner = models.ForeignKey(
		settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="templates", null=True, blank=True
	)
	is_global = models.BooleanField(default=False)

	# Optional: track derivation (when a user uses a global template)
	source_template = models.ForeignKey(
		"self", on_delete=models.SET_NULL, null=True, blank=True, related_name="derived_templates"
	)

	# Simple taxonomy
	category = models.CharField(max_length=100, blank=True)
	tags = models.JSONField(default=list, blank=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-updated_at"]

	def __str__(self) -> str:  # pragma: no cover
		return self.title


class Page(models.Model):
	"""User pages/documents editable in the Notion-style editor."""

	title = models.CharField(max_length=255, default="Untitled")
	content = models.TextField(blank=True, default="")  # store HTML for now
	icon = models.CharField(max_length=8, blank=True)  # optional emoji/icon
	is_favorite = models.BooleanField(default=False)

	# Ownership and hierarchy
	owner = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="pages",
	)
	parent = models.ForeignKey(
		"self",
		null=True,
		blank=True,
		on_delete=models.CASCADE,
		related_name="children",
	)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-updated_at"]

	def __str__(self) -> str:  # pragma: no cover
		return self.title

