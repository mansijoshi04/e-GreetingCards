"""
Business rules and tier configuration — the single source of truth for all product constraints.

Rule: Never write a tier limit, price, expiry, or upload size as a literal value
anywhere in the codebase. Always import from here.
"""

# ---------------------------------------------------------------------------
# Tier identifiers — use these constants, never raw strings
# ---------------------------------------------------------------------------
TIER_FREE = "free"
TIER_ESSENTIAL = "essential"
TIER_PREMIUM = "premium"
TIER_BULK = "bulk"

ALL_TIERS = [TIER_FREE, TIER_ESSENTIAL, TIER_PREMIUM, TIER_BULK]

TIER_CHOICES = [(t, t.capitalize()) for t in ALL_TIERS]

# ---------------------------------------------------------------------------
# Pricing (in cents)
# ---------------------------------------------------------------------------
TIER_PRICES_CENTS = {
    TIER_FREE: 0,
    TIER_ESSENTIAL: 299,
    TIER_PREMIUM: 499,
    TIER_BULK: 3000,
}

# ---------------------------------------------------------------------------
# Recipient limits per tier
# ---------------------------------------------------------------------------
RECIPIENT_LIMITS = {
    TIER_FREE: 1,
    TIER_ESSENTIAL: 3,
    TIER_PREMIUM: 5,
    TIER_BULK: 50,
}

# ---------------------------------------------------------------------------
# Link expiry (days from card creation)
# ---------------------------------------------------------------------------
LINK_EXPIRY_DAYS = {
    TIER_FREE: 3,
    TIER_ESSENTIAL: 7,
    TIER_PREMIUM: 14,
    TIER_BULK: 30,
}

# ---------------------------------------------------------------------------
# Media upload limits (only for tiers that support uploads)
# ---------------------------------------------------------------------------
MEDIA_UPLOAD_LIMITS = {
    TIER_PREMIUM: {
        "image_mb": 10,
        "video_seconds": 30,
    },
    TIER_BULK: {
        "image_mb": 50,
        "video_seconds": 120,
    },
}

# ---------------------------------------------------------------------------
# Feature flags per tier (which tiers unlock which capabilities)
# ---------------------------------------------------------------------------
MEDIA_UPLOAD_TIERS = frozenset({TIER_PREMIUM, TIER_BULK})
SCHEDULING_TIERS = frozenset({TIER_ESSENTIAL, TIER_PREMIUM, TIER_BULK})
OPEN_TRACKING_TIERS = frozenset({TIER_PREMIUM, TIER_BULK})
PLATFORM_EMAIL_TIERS = frozenset({TIER_ESSENTIAL, TIER_PREMIUM, TIER_BULK})
CSV_UPLOAD_TIERS = frozenset({TIER_BULK})
CUSTOM_BRANDING_TIERS = frozenset({TIER_BULK})
PNG_DOWNLOAD_TIERS = frozenset({TIER_ESSENTIAL, TIER_PREMIUM, TIER_BULK})
VIDEO_DOWNLOAD_TIERS = frozenset({TIER_PREMIUM, TIER_BULK})

# ---------------------------------------------------------------------------
# Link token length
# ---------------------------------------------------------------------------
LINK_TOKEN_LENGTH = 12
