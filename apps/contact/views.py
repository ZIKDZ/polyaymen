from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, permissions

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactCreateView(generics.CreateAPIView):
    """POST /api/contact/  — public. Anyone visiting the site can send a message."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()
        send_mail(
            subject=f"New portfolio inquiry: {instance.subject or 'General'}",
            message=f"From: {instance.name} <{instance.email}>\n\n{instance.message}",
            from_email=None,
            recipient_list=[settings.CONTACT_NOTIFY_EMAIL],
            fail_silently=True,
        )


class ContactInboxView(generics.ListAPIView):
    """GET /api/dashboard/messages/ — owner only. The dashboard's inbox tab."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
