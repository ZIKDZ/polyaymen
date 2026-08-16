from django.db import models
from django.utils.text import slugify
from config.storages import R2Storage


class Category(models.Model):
    """e.g. Characters, Environments, Hard Surface, Sculpts"""
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tool(models.Model):
    """Software used: Blender, ZBrush, Substance Painter, Maya, etc."""
    name = models.CharField(max_length=60, unique=True)
    icon = models.ImageField(upload_to="tool_icons/", blank=True, null=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    summary = models.CharField(
        max_length=240, blank=True,
        help_text="Short one-liner shown on project cards."
    )
    description = models.TextField(blank=True)

    thumbnail = models.ImageField(
        upload_to="thumbnails/",
        help_text="Cover image shown in the grid before the 3D model loads."
    )

    # The star of the show: a self-contained GLB (mesh + materials + textures).
    glb_file = models.FileField(
        upload_to="models/",
        storage=R2Storage(),
        blank=True,
        null=True,
        help_text="Optional. If set, an interactive 3D viewer is shown on the project page."
    )
    poly_count = models.PositiveIntegerField(blank=True, null=True)
    texture_resolution = models.CharField(max_length=40, blank=True)

    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="projects"
    )
    tools = models.ManyToManyField(Tool, blank=True, related_name="projects")

    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(
        default=0, help_text="Lower numbers appear first."
    )
    published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            i = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                i += 1
                slug = f"{base}-{i}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    """Fallback / supplementary gallery images (turntable renders, close-ups)."""
    project = models.ForeignKey(Project, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="gallery/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} - image {self.order}"
