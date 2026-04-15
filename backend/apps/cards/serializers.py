from rest_framework import serializers
from .models import Card, Recipient


class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = ["id", "email", "name", "first_opened_at", "open_count"]
        read_only_fields = ["id", "first_opened_at", "open_count"]


class CardCreateSerializer(serializers.Serializer):
    """Used when creating a card after Paddle payment."""
    template_slug = serializers.CharField(max_length=50)
    tier = serializers.ChoiceField(choices=["free", "essential", "premium", "bulk"])
    sender_name = serializers.CharField(max_length=100)
    sender_email = serializers.EmailField(required=False, allow_blank=True)
    sender_branding = serializers.CharField(max_length=200, required=False, allow_blank=True)
    custom_text = serializers.DictField()      # {headline, body, signature}
    custom_styling = serializers.DictField(required=False, allow_null=True)
    media_url = serializers.URLField(required=False, allow_blank=True)
    media_type = serializers.ChoiceField(choices=["image", "video", ""], required=False, allow_blank=True)
    scheduled_at = serializers.DateTimeField(required=False, allow_null=True)
    recipient_emails = serializers.ListField(
        child=serializers.EmailField(), min_length=1
    )
    # Optional — free tier cards have no Paddle transaction
    paddle_transaction_id = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    # amount_paid_cents is NOT accepted from the client — derived server-side from tier


class CardDetailSerializer(serializers.ModelSerializer):
    recipients = RecipientSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = [
            "id",
            "template_slug",
            "tier",
            "sender_name",
            "sender_branding",
            "custom_text",
            "custom_styling",
            "media_url",
            "media_type",
            "link_token",
            "expires_at",
            "scheduled_at",
            "emails_sent_at",
            "created_at",
            "recipients",
        ]
        read_only_fields = fields
