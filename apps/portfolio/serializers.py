from rest_framework import serializers
from .models import Project, ProjectImage, Category, Tool


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = ["id", "name", "icon"]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "caption", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight — used for the grid. No GLB, no gallery, keeps payload small."""
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "summary", "thumbnail",
            "category", "is_featured", "has_3d_model", "glb_file",
        ]

    has_3d_model = serializers.SerializerMethodField()

    def get_has_3d_model(self, obj):
        return bool(obj.glb_file)


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full payload for the project detail page, including the 3D viewer asset."""
    category = CategorySerializer(read_only=True)
    tools = ToolSerializer(many=True, read_only=True)
    gallery = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "summary", "description",
            "thumbnail", "glb_file", "poly_count", "texture_resolution",
            "category", "tools", "gallery",
            "is_featured", "created_at",
        ]


class ProjectWriteSerializer(serializers.ModelSerializer):
    """Used by the authenticated dashboard to create/update projects."""
    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "summary", "description",
            "thumbnail", "glb_file", "poly_count", "texture_resolution",
            "category", "tools", "is_featured", "order", "published",
        ]
        extra_kwargs = {"slug": {"required": False}}
