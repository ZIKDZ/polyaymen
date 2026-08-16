from django.contrib import admin
from .models import ArtistProfile, Skill


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1


@admin.register(ArtistProfile)
class ArtistProfileAdmin(admin.ModelAdmin):
    inlines = [SkillInline]

    def has_add_permission(self, request):
        # Enforce singleton in the admin too.
        return not ArtistProfile.objects.exists()
