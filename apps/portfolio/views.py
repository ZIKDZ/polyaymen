from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Project, Category, Tool
from .serializers import (
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectWriteSerializer,
    CategorySerializer,
    ToolSerializer,
)


class PublicProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public-facing, read-only. Used by the main site grid + project detail page.
    GET /api/projects/
    GET /api/projects/<slug>/
    """
    queryset = Project.objects.filter(published=True)
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__slug", "is_featured", "tools__name"]
    search_fields = ["title", "summary", "description"]
    ordering_fields = ["order", "created_at"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectListSerializer


class DashboardProjectViewSet(viewsets.ModelViewSet):
    """
    Authenticated-only CRUD for the owner's dashboard.
    /api/dashboard/projects/
    """
    queryset = Project.objects.all().order_by("order", "-created_at")
    serializer_class = ProjectWriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "slug"


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ToolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    permission_classes = [permissions.AllowAny]
