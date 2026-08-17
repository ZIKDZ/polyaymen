from django.db import migrations


BIO = (
    "I'm Aymen, a 3D artist focused on product visualization and creating "
    "premium, realistic visuals. I create 3D renders and animations for "
    "products ranging from watches and electronics to cosmetics and more, "
    "with a focus on lighting, materials, composition, and detail."
)
TAGLINE = "3D product visualization — watches, electronics, cosmetics."


def seed_bio(apps, schema_editor):
    ArtistProfile = apps.get_model("profile_info", "ArtistProfile")
    profile, _ = ArtistProfile.objects.get_or_create(pk=1, defaults={"name": "Aymen"})
    profile.name = profile.name or "Aymen"
    profile.tagline = TAGLINE
    profile.bio = BIO
    profile.save()


def unseed_bio(apps, schema_editor):
    ArtistProfile = apps.get_model("profile_info", "ArtistProfile")
    ArtistProfile.objects.filter(pk=1).update(tagline="", bio="")


class Migration(migrations.Migration):

    dependencies = [
        ("profile_info", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_bio, unseed_bio),
    ]