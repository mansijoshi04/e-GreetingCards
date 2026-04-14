"""
Link token generation and Redis-backed expiry management.
"""
import secrets
import string
import json
from datetime import timedelta

import redis
from django.utils import timezone
from django.conf import settings

from giflove.constants import LINK_EXPIRY_DAYS, LINK_TOKEN_LENGTH

_redis_client = None


def get_redis():
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(settings.REDIS_URL)
    return _redis_client


def generate_link_token() -> str:
    """Generate a unique alphanumeric token of length LINK_TOKEN_LENGTH."""
    from apps.cards.models import Card

    alphabet = string.ascii_lowercase + string.digits
    while True:
        token = "".join(secrets.choice(alphabet) for _ in range(LINK_TOKEN_LENGTH))
        if not Card.objects.filter(link_token=token).exists():
            return token


def compute_expiry(tier: str):
    """Return the expiry datetime for a given tier (from constants, not settings)."""
    days = LINK_EXPIRY_DAYS[tier]
    return timezone.now() + timedelta(days=days)


def cache_card_link(link_token: str, card_id: str, expires_at) -> None:
    """Store link → card_id mapping in Redis with TTL matching expiry."""
    r = get_redis()
    ttl_seconds = int((expires_at - timezone.now()).total_seconds())
    if ttl_seconds > 0:
        r.setex(
            f"card:{link_token}",
            ttl_seconds,
            json.dumps({"card_id": str(card_id), "expires_at": expires_at.isoformat()}),
        )


def validate_link_token(link_token: str) -> dict | None:
    """
    Validate a link token via Redis (fast path).
    Falls back to the database if Redis is unavailable.
    Returns {"card_id": ..., "expires_at": ...} or None if expired/not found.
    """
    try:
        raw = get_redis().get(f"card:{link_token}")
        if raw is None:
            return None
        return json.loads(raw)
    except Exception:
        # Redis unavailable — fall back to DB
        from apps.cards.models import Card

        try:
            card = Card.objects.get(link_token=link_token)
            if card.expires_at > timezone.now():
                return {"card_id": str(card.id), "expires_at": card.expires_at.isoformat()}
        except Card.DoesNotExist:
            pass
        return None


def invalidate_link(link_token: str) -> None:
    """Remove a token from Redis (called on expiry or manual deletion)."""
    try:
        get_redis().delete(f"card:{link_token}")
    except Exception:
        pass
