"""
Cloudflare R2 storage backend, used specifically for large raw files (GLBs)
that don't fit Cloudinary's free-tier 10MB per-file limit. R2 is
S3-compatible, so this just configures django-storages' S3Boto3Storage to
point at an R2 bucket instead of AWS.

Images (thumbnails, gallery, tool icons) stay on Cloudinary — see
STORAGES["default"] in settings.py — since they're small and benefit from
Cloudinary's image transform pipeline. Only Project.glb_file uses this.
"""
from decouple import config
from storages.backends.s3boto3 import S3Boto3Storage


def _bare_host(value):
    """
    django-storages prepends 'https://' to custom_domain itself, so the env
    var must be a bare host (no scheme). If someone sets
    R2_PUBLIC_DOMAIN=https://pub-xxxx.r2.dev instead of pub-xxxx.r2.dev,
    this strips the scheme so we don't end up with 'https://https://...'
    in every generated file URL.
    """
    if not value:
        return None
    return value.split("://", 1)[-1].rstrip("/")


class R2Storage(S3Boto3Storage):
    bucket_name = config("R2_BUCKET_NAME", default="")
    endpoint_url = config("R2_ENDPOINT_URL", default="")
    access_key = config("R2_ACCESS_KEY_ID", default="")
    secret_key = config("R2_SECRET_ACCESS_KEY", default="")
    region_name = "auto"
    default_acl = None
    querystring_auth = False
    file_overwrite = False
    addressing_style = "virtual"

    # Prefix under which files are actually stored in the bucket, e.g. "polyaymen".
    # Without this, generated URLs point at the bucket root and 404.
    location = config("R2_LOCATION", default="")

    custom_domain = _bare_host(config("R2_PUBLIC_DOMAIN", default=None))