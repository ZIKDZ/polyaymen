"""
Django settings for the polyaymen 3D portfolio backend.
"""
from pathlib import Path
from datetime import timedelta
from decouple import config, Csv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY", default="dev-secret-key-change-me-in-production")
DEBUG = config("DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",

    # media storage (must come before staticfiles)
    "cloudinary_storage",
    "django.contrib.staticfiles",
    "cloudinary",

    # third party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",

    # local apps
    "apps.accounts",
    "apps.portfolio",
    "apps.profile_info",
    "apps.contact",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "frontend" / "dist"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# --- Database (Supabase Postgres) ---
# DATABASE_URL comes from your Supabase project: Project Settings -> Database ->
# Connection string ("URI" tab). Use the pooler (port 6543, "Transaction" mode)
# connection string for typical Django deployments, e.g.:
# postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
# If DATABASE_URL isn't set (e.g. no .env yet), falls back to local sqlite so
# `manage.py` commands still work out of the box.
DATABASES = {
    "default": dj_database_url.parse(
        config("DATABASE_URL", default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
        conn_max_age=0,
        ssl_require=config("DATABASE_SSL_REQUIRE", default=True, cast=bool),
    )
}
if not DATABASES["default"]["NAME"] == str(BASE_DIR / "db.sqlite3"):
    DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Static files (served via WhiteNoise; frontend build output) ---
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "frontend" / "dist"]
WHITENOISE_ROOT = BASE_DIR / "frontend" / "dist"

# --- Media (project thumbnails, gallery images, GLB 3D model files) ---
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# --- Cloudinary (CDN for uploaded media) ---
# Credentials from your Cloudinary dashboard (Settings -> API Keys).
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME", default=""),
    "API_KEY": config("CLOUDINARY_API_KEY", default=""),
    "API_SECRET": config("CLOUDINARY_API_SECRET", default=""),
}

# --- File storage backends ---
# NOTE: Django 4.2 deprecated the old-style DEFAULT_FILE_STORAGE /
# STATICFILES_STORAGE settings in favor of the STORAGES dict below, and
# Django itself stopped reading the old-style settings as of 5.1 (this
# project runs 6.1) — STORAGES is what Django's own storage machinery
# actually uses now.
#
# HOWEVER: django-cloudinary-storage's own `collectstatic` management
# command override reads `settings.STATICFILES_STORAGE` directly (it
# hasn't been updated for the Django 5.1+ removal), so that attribute
# has to keep existing as a plain setting or collectstatic crashes with
# AttributeError. Django itself ignores it — it's kept purely for that
# third-party package's benefit. Same story for DEFAULT_FILE_STORAGE,
# kept for any other cloudinary_storage internals that still check it.
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"
DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# Images (thumbnails, gallery shots, tool icons) get Cloudinary's image
# pipeline (auto-optimized/resized on delivery) via MediaCloudinaryStorage.
# GLB files aren't an image format Cloudinary transforms, so
# Project.glb_file explicitly overrides this with R2Storage (see
# config/storages.py / apps/portfolio/models.py) to just get CDN delivery
# with no transformation attempted.
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# Bump this if artists upload dense/uncompressed GLBs. Encourage Draco/Meshopt
# compression client-side or via a post-upload processing step instead of
# raising this indefinitely.
DATA_UPLOAD_MAX_MEMORY_SIZE = 200 * 1024 * 1024  # 200MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 200 * 1024 * 1024

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- DRF ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/minute",
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "ROTATE_REFRESH_TOKENS": True,
}

# --- CORS ---
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173,http://127.0.0.1:5173",
    cast=Csv(),
)

# --- Contact form email (later: hook to real SMTP / SES / Resend) ---
CONTACT_NOTIFY_EMAIL = config("CONTACT_NOTIFY_EMAIL", default="hello@polyaymen.com")
EMAIL_BACKEND = config(
    "EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend"
)