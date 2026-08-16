"""
Seeds the database with demo content so you can see the site fully populated
before you have real work to upload.

Usage:
    python manage.py seed_demo_data            # add demo data (skips things that already exist)
    python manage.py seed_demo_data --clear     # wipe existing demo-tagged data first, then reseed

Notes:
- Thumbnails are generated on the fly (solid-color PNGs with the project title
  drawn on them) using Pillow, so this works with zero external assets. They
  upload through whatever DEFAULT_FILE_STORAGE is configured (Cloudinary, if
  you've set that up) same as a real upload would.
- glb_file is intentionally left blank on all seeded projects. There's no
  generic placeholder .glb worth faking, and Project.glb_file is optional —
  projects without one just show a static image on the project page instead
  of the 3D viewer. Drop a real .glb onto any seeded project from the admin
  or dashboard once you have one to test the viewer.
- Safe to re-run: uses get_or_create keyed on slug/name, so running it twice
  won't duplicate categories/tools/projects.
"""
import io
import random

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from PIL import Image, ImageDraw, ImageFont

from apps.portfolio.models import Category, Tool, Project
from apps.profile_info.models import ArtistProfile, Skill

CATEGORIES = ["Characters", "Environments", "Hard Surface", "Sculpts"]
TOOLS = ["Blender", "ZBrush", "Substance Painter", "Maya", "Marmoset Toolbag"]

# (title, summary, category, tools, poly_count, texture_res, featured, color)
DEMO_PROJECTS = [
    ("Ashfall Sentinel", "A weathered guardian construct for a post-volcanic world.",
     "Characters", ["ZBrush", "Substance Painter"], 84000, "4K", True, (91, 74, 58)),
    ("Riverbend Outpost", "A modular trading post built for a fantasy river delta.",
     "Environments", ["Blender", "Substance Painter"], 156000, "2K", True, (58, 84, 74)),
    ("Volt Coupe MK II", "Hard-surface concept vehicle, retro-futurist racing line.",
     "Hard Surface", ["Blender", "Marmoset Toolbag"], 62000, "4K", True, (58, 66, 91)),
    ("Kestrel Mask", "Ceremonial mask sculpt exploring bird-of-prey silhouettes.",
     "Sculpts", ["ZBrush"], 41000, "2K", False, (91, 58, 74)),
    ("Undercroft Ruins", "Collapsed stone vault, modular kit for a dungeon crawler.",
     "Environments", ["Blender", "Substance Painter", "ZBrush"], 210000, "4K", False, (74, 74, 58)),
    ("Cinder Golem", "Elemental creature sculpt with molten-crack surface detail.",
     "Characters", ["ZBrush", "Substance Painter"], 97000, "4K", False, (91, 58, 58)),
    ("Foundry Loader Bot", "Industrial cargo-loader hard-surface build.",
     "Hard Surface", ["Maya", "Marmoset Toolbag"], 73000, "2K", False, (58, 91, 91)),
    ("Wayfinder Bust", "Portrait study, stylized fantasy scout character.",
     "Sculpts", ["ZBrush"], 35000, "2K", False, (74, 58, 91)),
]


def make_placeholder_thumbnail(title, color):
    img = Image.new("RGB", (960, 720), color)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 48)
    except OSError:
        font = ImageFont.load_default()
    text = title
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((960 - w) / 2, (720 - h) / 2), text, fill=(255, 255, 255), font=font)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    buf.seek(0)
    return ContentFile(buf.read(), name=f"{title.lower().replace(' ', '-')}.jpg")


class Command(BaseCommand):
    help = "Seed demo categories, tools, projects, and an artist profile."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear", action="store_true",
            help="Delete existing demo projects/categories/tools before reseeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing demo projects...")
            Project.objects.filter(title__in=[p[0] for p in DEMO_PROJECTS]).delete()
            Category.objects.filter(name__in=CATEGORIES).delete()
            Tool.objects.filter(name__in=TOOLS).delete()

        categories = {}
        for name in CATEGORIES:
            cat, _ = Category.objects.get_or_create(name=name)
            categories[name] = cat

        tools = {}
        for name in TOOLS:
            tool, _ = Tool.objects.get_or_create(name=name)
            tools[name] = tool

        created_count = 0
        for order, (title, summary, cat_name, tool_names, poly_count, tex_res, featured, color) in enumerate(DEMO_PROJECTS):
            project, created = Project.objects.get_or_create(
                title=title,
                defaults=dict(
                    summary=summary,
                    description=(
                        f"{summary} Placeholder description generated by seed_demo_data — "
                        "replace with real project notes once you've got the actual piece."
                    ),
                    category=categories[cat_name],
                    poly_count=poly_count,
                    texture_resolution=tex_res,
                    is_featured=featured,
                    order=order,
                    published=True,
                ),
            )
            if created:
                project.thumbnail.save(
                    f"{project.slug}.jpg",
                    make_placeholder_thumbnail(title, color),
                    save=True,
                )
                project.tools.set([tools[n] for n in tool_names])
                created_count += 1

        if not ArtistProfile.objects.exists():
            profile = ArtistProfile.objects.create(
                name="Polyaymen",
                tagline="3D artist — characters, environments, hard surface.",
                bio=(
                    "Placeholder bio generated by seed_demo_data. Replace this with a real "
                    "bio from the Django admin or dashboard once you're ready to go live."
                ),
                email="hello@polyaymen.com",
                location="Algiers, Algeria",
            )
            for i, skill_name in enumerate(
                ["Character Sculpting", "Hard Surface Modeling", "Texturing", "Retopology"]
            ):
                Skill.objects.create(profile=profile, name=skill_name, order=i)
            self.stdout.write(self.style.SUCCESS("Created demo ArtistProfile."))
        else:
            self.stdout.write("ArtistProfile already exists, skipping.")

        self.stdout.write(self.style.SUCCESS(
            f"Done. Created {created_count} new project(s) "
            f"({len(DEMO_PROJECTS) - created_count} already existed)."
        ))
