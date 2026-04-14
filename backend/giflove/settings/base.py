"""
Base settings shared across all environments.

Configuration contract:
  - Environment-specific values (credentials, URLs, keys) → read via config() from .env.*
  - Business rules (tier limits, prices, expiry days)     → imported from giflove.constants
  - Never write a literal price, limit, URL, or magic number inline here or anywhere else.
"""
from pathlib import Path
from decouple import config
from giflove import constants  # noqa: F401 — re-exported for template/signal access if needed

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config("DJANGO_SECRET_KEY")

DEBUG = False

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "corsheaders",
    "storages",
    "django_celery_beat",
    # Local
    "apps.cards",
    "apps.payments",
    "apps.emails",
    "apps.tracking",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "giflove.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
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

WSGI_APPLICATION = "giflove.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB"),
        "USER": config("POSTGRES_USER"),
        "PASSWORD": config("POSTGRES_PASSWORD"),
        "HOST": config("POSTGRES_HOST", default="db"),
        "PORT": config("POSTGRES_PORT", default="5432"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "America/Toronto"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",  # required for file uploads
    ],
}

# ---------------------------------------------------------------------------
# Redis + Celery
# ---------------------------------------------------------------------------
REDIS_URL = config("REDIS_URL", default="redis://redis:6379/0")
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_TIMEZONE = TIME_ZONE
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

# ---------------------------------------------------------------------------
# Paddle (payments)
# ---------------------------------------------------------------------------
PADDLE_API_KEY = config("PADDLE_API_KEY")
PADDLE_WEBHOOK_SECRET = config("PADDLE_WEBHOOK_SECRET")
PADDLE_ENVIRONMENT = config("PADDLE_ENVIRONMENT", default="production")
PADDLE_ESSENTIAL_PRICE_ID = config("PADDLE_ESSENTIAL_PRICE_ID")
PADDLE_PREMIUM_PRICE_ID = config("PADDLE_PREMIUM_PRICE_ID")
PADDLE_BULK_PRICE_ID = config("PADDLE_BULK_PRICE_ID")

# ---------------------------------------------------------------------------
# Resend (email delivery)
# ---------------------------------------------------------------------------
RESEND_API_KEY = config("RESEND_API_KEY")
EMAIL_FROM = config("EMAIL_FROM")
EMAIL_PROVIDER = config("EMAIL_PROVIDER", default="resend")  # 'resend' | 'console'

# ---------------------------------------------------------------------------
# MinIO — self-hosted S3-compatible object storage for Premium/Bulk media uploads
#
# MINIO_ENDPOINT_URL  → internal URL used by Django/boto3 to talk to MinIO
#                       (e.g. http://minio:9000 inside Docker)
# MINIO_PUBLIC_URL    → external URL embedded in Card.media_url so browsers can load files
#                       (e.g. http://localhost:9000 in dev, https://giflove.ca/media in prod)
# ---------------------------------------------------------------------------
MINIO_ENDPOINT_URL = config("MINIO_ENDPOINT_URL")
MINIO_PUBLIC_URL = config("MINIO_PUBLIC_URL")
MINIO_ACCESS_KEY = config("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = config("MINIO_SECRET_KEY")
MINIO_BUCKET_NAME = config("MINIO_BUCKET_NAME")
MINIO_USE_SSL = config("MINIO_USE_SSL", default=False, cast=bool)

# django-storages S3 backend pointed at MinIO
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        "OPTIONS": {
            "access_key": MINIO_ACCESS_KEY,
            "secret_key": MINIO_SECRET_KEY,
            "bucket_name": MINIO_BUCKET_NAME,
            "endpoint_url": MINIO_ENDPOINT_URL,
            "use_ssl": MINIO_USE_SSL,
            "default_acl": "public-read",
            "signature_version": "s3v4",
            "file_overwrite": False,
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
BASE_URL = config("BASE_URL")
