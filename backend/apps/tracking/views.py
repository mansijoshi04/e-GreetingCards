from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.cards.models import Card, Recipient
from .models import CardOpen


def _detect_device(user_agent: str) -> str:
    ua = user_agent.lower()
    if "mobile" in ua:
        return "mobile"
    if "tablet" in ua or "ipad" in ua:
        return "tablet"
    return "desktop"


class TrackOpenView(APIView):
    """
    POST /api/tracking/open/
    Called by the card viewer page when a recipient opens the card.
    """
    def post(self, request):
        link_token = request.data.get("link_token")
        recipient_email = request.data.get("recipient_email", "")

        try:
            card = Card.objects.get(link_token=link_token)
        except Card.DoesNotExist:
            return Response({"error": "Card not found"}, status=status.HTTP_404_NOT_FOUND)

        recipient = None
        if recipient_email:
            try:
                recipient = Recipient.objects.get(card=card, email=recipient_email)
                now = timezone.now()
                Recipient.objects.filter(pk=recipient.pk).update(
                    first_opened_at=recipient.first_opened_at or now,
                    last_opened_at=now,
                    open_count=recipient.open_count + 1,
                )
            except Recipient.DoesNotExist:
                pass

        CardOpen.objects.create(
            card=card,
            recipient=recipient,
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            ip_address=request.META.get("REMOTE_ADDR"),
            referrer=request.META.get("HTTP_REFERER", ""),
            device_type=_detect_device(request.META.get("HTTP_USER_AGENT", "")),
        )

        return Response({"status": "tracked"})
