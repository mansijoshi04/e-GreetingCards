from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", ".ngrok-free.app", ".ngrok.io"]

# Allow all origins in dev
CORS_ALLOW_ALL_ORIGINS = True

# Use console email in dev (no Resend calls)
EMAIL_PROVIDER = "console"

# SQLite fallback for local dev without Docker (optional)
# Uncomment if you want to develop without Postgres:
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }
