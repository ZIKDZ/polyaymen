# Auth is handled by djangorestframework-simplejwt's built-in views
# (TokenObtainPairView / TokenRefreshView), wired directly in config/urls.py.
# This file is kept as a place to grow custom auth logic later
# (e.g. a "who am I" endpoint for the dashboard shell) without needing
# to restructure the app.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class MeView(APIView):
    """GET /api/auth/me/ — used by the dashboard to confirm the session is valid."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })
