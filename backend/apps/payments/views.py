"""
Paddle webhook handler.
Paddle calls POST /api/payments/webhook/ after a transaction completes.
The frontend triggers card creation via POST /api/cards/ after receiving the transaction ID from Paddle.js.
"""
import json
import hashlib
import hmac

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


@method_decorator(csrf_exempt, name="dispatch")
class PaddleWebhookView(APIView):
    """
    Receives and verifies Paddle webhook events.
    Currently used for logging/auditing — card creation is triggered client-side
    after Paddle overlay checkout completes (transaction ID returned to frontend).
    """
    def post(self, request):
        signature = request.headers.get("Paddle-Signature", "")
        raw_body = request.body

        if not _verify_paddle_signature(raw_body, signature):
            return Response({"error": "Invalid signature"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            event = json.loads(raw_body)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)

        event_type = event.get("event_type", "")

        if event_type == "transaction.completed":
            # Log for audit — card creation handled by frontend → /api/cards/
            pass

        return Response({"status": "ok"})


def _verify_paddle_signature(body: bytes, signature_header: str) -> bool:
    """Verify the Paddle webhook signature."""
    try:
        parts = dict(p.split("=", 1) for p in signature_header.split(";"))
        ts = parts.get("ts", "")
        h1 = parts.get("h1", "")
        signed_payload = f"{ts}:{body.decode()}"
        expected = hmac.new(
            settings.PADDLE_WEBHOOK_SECRET.encode(),
            signed_payload.encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, h1)
    except Exception:
        return False
