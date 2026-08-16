from rest_framework.routers import DefaultRouter
from .views import (
    PublicProjectViewSet,
    DashboardProjectViewSet,
    CategoryViewSet,
    ToolViewSet,
)

public_router = DefaultRouter()
public_router.register("projects", PublicProjectViewSet, basename="project")
public_router.register("categories", CategoryViewSet, basename="category")
public_router.register("tools", ToolViewSet, basename="tool")

dashboard_router = DefaultRouter()
dashboard_router.register("projects", DashboardProjectViewSet, basename="dashboard-project")

urlpatterns = public_router.urls  # mounted at /api/
dashboard_urlpatterns = dashboard_router.urls  # mounted at /api/dashboard/
