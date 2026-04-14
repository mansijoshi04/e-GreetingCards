import uuid
from django.db import models
from django.conf import settings


class Card(models.Model):
    TIER_CHOICES = [
        ("free", "Free"),
        ("essential", "Essential"),
        ("premium", "Premium"),
        ("bulk", "Bulk"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Template reference — slug only, no FK. Templates live in frontend registry.
    template_slug = models.CharField(max_length=50)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES)

    # Sender
    sender_name = models.CharField(max_length=100)
    sender_email = models.EmailField(blank=True)
    sender_branding = models.CharField(max_length=200, blank=True)  # Bulk only

    # Card content (user customization)
    custom_text = models.JSONField()           # {headline, body, signature}
    custom_styling = models.JSONField(null=True, blank=True)  # {colors, font}
    media_url = models.URLField(blank=True)    # MinIO public URL (Premium/Bulk uploads)
    media_type = models.CharField(max_length=10, blank=True)  # 'image' | 'video'

    # Link management
    link_token = models.CharField(max_length=12, unique=True)
    expires_at = models.DateTimeField()

    # Scheduling (null = send immediately after payment)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    emails_sent_at = models.DateTimeField(null=True, blank=True)

    # Payment
    amount_paid_cents = models.IntegerField(default=0)
    paddle_transaction_id = models.CharField(max_length=100, blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    last_accessed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "cards"
        indexes = [
            models.Index(fields=["link_token"]),
            models.Index(fields=["expires_at"]),
            models.Index(fields=["scheduled_at"]),
        ]

    def __str__(self):
        return f"{self.tier} card ({self.template_slug}) — {self.link_token}"


class Recipient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="recipients")
    email = models.EmailField()
    name = models.CharField(max_length=100, blank=True)

    # Tracking
    email_sent_at = models.DateTimeField(null=True, blank=True)
    first_opened_at = models.DateTimeField(null=True, blank=True)
    last_opened_at = models.DateTimeField(null=True, blank=True)
    open_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "recipients"
        indexes = [
            models.Index(fields=["card"]),
        ]

    def __str__(self):
        return f"{self.email} — {self.card.link_token}"
