import uuid
from django.db import models
from apps.cards.models import Card, Recipient


class CardOpen(models.Model):
    DEVICE_CHOICES = [
        ("mobile", "Mobile"),
        ("tablet", "Tablet"),
        ("desktop", "Desktop"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="opens")
    recipient = models.ForeignKey(
        Recipient, on_delete=models.SET_NULL, null=True, blank=True, related_name="opens"
    )

    opened_at = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    referrer = models.URLField(blank=True)
    device_type = models.CharField(max_length=20, choices=DEVICE_CHOICES, blank=True)

    class Meta:
        db_table = "card_opens"
        indexes = [
            models.Index(fields=["card"]),
            models.Index(fields=["opened_at"]),
        ]

    def __str__(self):
        return f"Open — {self.card.link_token} at {self.opened_at}"
