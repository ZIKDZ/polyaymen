from django.contrib import admin
from .models import Project, ProjectImage, Category, Tool


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "is_featured", "published", "order", "created_at"]
    list_filter = ["category", "is_featured", "published", "tools"]
    search_fields = ["title", "summary", "description"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProjectImageInline]
    filter_horizontal = ["tools"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ["name"]
