from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from apps.portfolio.urls import urlpatterns as portfolio_public_urls
from apps.portfolio.urls import dashboard_urlpatterns as portfolio_dashboard_urls
from apps.contact.views import ContactInboxView

urlpatterns = [
    path("admin/", admin.site.urls),

    # --- Public site API ---
    path("api/", include(portfolio_public_urls)),
    path("api/", include("apps.profile_info.urls")),
    path("api/", include("apps.contact.urls")),
    path("api/", include("apps.accounts.urls")),

    # --- Dashboard-only API (JWT protected inside the views themselves) ---
    path("api/dashboard/", include(portfolio_dashboard_urls)),
    path("api/dashboard/messages/", ContactInboxView.as_view(), name="dashboard-messages"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
