from django.urls import path
from .views import ArtistProfileView

urlpatterns = [
    path("profile/", ArtistProfileView.as_view(), name="artist-profile"),
]
