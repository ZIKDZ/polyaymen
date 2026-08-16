from rest_framework import generics, permissions
from .models import ArtistProfile
from .serializers import ArtistProfileSerializer


class ArtistProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/profile/          -> public
    PATCH /api/profile/         -> owner only (dashboard "Edit bio" screen)
    Always operates on the single ArtistProfile row (created via fixture/admin).
    """
    serializer_class = ArtistProfileSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_object(self):
        obj, _ = ArtistProfile.objects.get_or_create(pk=1, defaults={"name": "Polyaymen"})
        return obj
