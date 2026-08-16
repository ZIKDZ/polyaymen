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


class R2Storage(S3Boto3Storage):
    bucket_name = config("R2_BUCKET_NAME", default="")
    endpoint_url = config("R2_ENDPOINT_URL", default="")  # https://<account-id>.r2.cloudflarestorage.com
    access_key = config("R2_ACCESS_KEY_ID", default="")
    secret_key = config("R2_SECRET_ACCESS_KEY", default="")
    region_name = "auto"
    default_acl = None
    querystring_auth = False  # public URLs, not signed — bucket must have public access enabled
    file_overwrite = False
    addressing_style = "virtual"

    # Optional: set R2_PUBLIC_DOMAIN in .env once you've enabled public access
    # (either R2's own r2.dev domain or a custom domain connected in the
    # Cloudflare dashboard). Falls back to the default S3-style URL if unset,
    # which won't actually be publicly reachable until you configure one.
    custom_domain = config("R2_PUBLIC_DOMAIN", default=None) or None
