FROM python:3.12-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files.
# Production settings read many env vars at import time via decouple.config();
# pass dummies here so the settings module loads. Real values come from
# --env-file at runtime and override these. collectstatic doesn't connect
# to the DB or MinIO, it only needs the settings module to import cleanly.
RUN DJANGO_SECRET_KEY=build-only \
    POSTGRES_DB=build POSTGRES_USER=build POSTGRES_PASSWORD=build \
    PADDLE_API_KEY=build PADDLE_WEBHOOK_SECRET=build \
    PADDLE_ESSENTIAL_PRICE_ID=build PADDLE_PREMIUM_PRICE_ID=build PADDLE_BULK_PRICE_ID=build \
    RESEND_API_KEY=build EMAIL_FROM=build@example.com \
    MINIO_ENDPOINT_URL=http://build:9000 MINIO_PUBLIC_URL=http://build:9000 \
    MINIO_ACCESS_KEY=build MINIO_SECRET_KEY=build MINIO_BUCKET_NAME=build \
    python manage.py collectstatic --noinput --settings=giflove.settings.production

EXPOSE 8000

CMD ["gunicorn", "giflove.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
