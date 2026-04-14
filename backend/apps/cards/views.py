from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from giflove.constants import RECIPIENT_LIMITS, PLATFORM_EMAIL_TIERS, SCHEDULING_TIERS
from .models import Card, Recipient
from .serializers import CardCreateSerializer, CardDetailSerializer
from .services.link_service import (
    generate_link_token,
    compute_expiry,
    cache_card_link,
    validate_link_token,
)


class CardCreateView(APIView):
    """
    POST /api/cards/
    Creates a card after successful Paddle payment.
    """
    def post(self, request):
        serializer = CardCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        tier = data["tier"]

        # Enforce recipient limit from constants (never a magic number)
        max_recipients = RECIPIENT_LIMITS[tier]
        recipient_emails = data["recipient_emails"]
        if len(recipient_emails) > max_recipients:
            return Response(
                {"error": f"Tier '{tier}' allows up to {max_recipients} recipients."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Reject scheduling requests for tiers that don't support it
        if data.get("scheduled_at") and tier not in SCHEDULING_TIERS:
            return Response(
                {"error": f"Tier '{tier}' does not support scheduled sending."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        link_token = generate_link_token()
        expires_at = compute_expiry(tier)

        card = Card.objects.create(
            template_slug=data["template_slug"],
            tier=tier,
            sender_name=data["sender_name"],
            sender_email=data.get("sender_email", ""),
            sender_branding=data.get("sender_branding", ""),
            custom_text=data["custom_text"],
            custom_styling=data.get("custom_styling"),
            media_url=data.get("media_url", ""),
            media_type=data.get("media_type", ""),
            link_token=link_token,
            expires_at=expires_at,
            scheduled_at=data.get("scheduled_at"),
            paddle_transaction_id=data["paddle_transaction_id"],
            amount_paid_cents=data["amount_paid_cents"],
        )

        Recipient.objects.bulk_create([
            Recipient(card=card, email=email)
            for email in recipient_emails
        ])

        cache_card_link(link_token, str(card.id), expires_at)

        # Trigger email delivery for tiers that use platform email
        if tier in PLATFORM_EMAIL_TIERS:
            from apps.emails.tasks import send_card_emails
            if card.scheduled_at:
                send_card_emails.apply_async(args=[str(card.id)], eta=card.scheduled_at)
            else:
                send_card_emails.delay(str(card.id))

        from django.conf import settings
        return Response(
            {
                "card_id": str(card.id),
                "link_token": link_token,
                "card_url": f"{settings.BASE_URL}/card/{link_token}",
                "expires_at": expires_at.isoformat(),
            },
            status=status.HTTP_201_CREATED,
        )


class CardDetailView(APIView):
    """
    GET /api/cards/<link_token>/
    Returns card data for the recipient card viewer. Validates expiry via Redis.
    """
    def get(self, request, link_token):
        cached = validate_link_token(link_token)
        if cached is None:
            return Response(
                {"error": "This card has expired or does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            card = Card.objects.prefetch_related("recipients").get(link_token=link_token)
        except Card.DoesNotExist:
            return Response({"error": "Card not found."}, status=status.HTTP_404_NOT_FOUND)

        Card.objects.filter(pk=card.pk).update(last_accessed_at=timezone.now())

        return Response(CardDetailSerializer(card).data)
