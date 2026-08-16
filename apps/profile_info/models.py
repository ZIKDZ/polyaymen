from django.db import models
from django.core.exceptions import ValidationError


class ArtistProfile(models.Model):
    """
    Singleton model — there's only ever one artist. Enforced in save().
    """
    name = models.CharField(max_length=120, default="Polyaymen")
    tagline = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="profile/", blank=True, null=True)
    resume = models.FileField(upload_to="profile/", blank=True, null=True)

    email = models.EmailField(blank=True)
    location = models.CharField(max_length=120, blank=True)

    artstation_url = models.URLField(blank=True)
    sketchfab_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Artist Profile"
        verbose_name_plural = "Artist Profile"

    def clean(self):
        if not self.pk and ArtistProfile.objects.exists():
            raise ValidationError("Only one ArtistProfile instance is allowed.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Skill(models.Model):
    """Optional skill/tag chips shown on the About page, e.g. 'Character Sculpting'."""
    profile = models.ForeignKey(ArtistProfile, related_name="skills", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name
