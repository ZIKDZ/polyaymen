from rest_framework import serializers
from .models import ArtistProfile, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "order"]


class ArtistProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = ArtistProfile
        fields = [
            "id", "name", "tagline", "bio", "avatar", "resume",
            "email", "location",
            "artstation_url", "sketchfab_url", "instagram_url",
            "linkedin_url", "twitter_url", "skills",
        ]
