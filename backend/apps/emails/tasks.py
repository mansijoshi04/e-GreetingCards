"""
Celery tasks for email delivery.
send_card_emails is triggered immediately (instant) or via apply_async(eta=...) for scheduled sends.
"""
from celery import shared_task
from django.utils import timezone


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_card_emails(self, card_id: str):
    """
    Send the card link to all recipients via Resend.
    Retries up to 3 times on failure (e.g. Resend API timeout).
    """
    from apps.cards.models import Card, Recipient
    from .services.email_service import send_card_email

    try:
        card = Card.objects.prefetch_related("recipients").get(id=card_id)
    except Card.DoesNotExist:
        return  # Card deleted before task ran — nothing to do

    from django.conf import settings
    recipients = card.recipients.filter(email_sent_at__isnull=True)
    card_url = f"{settings.BASE_URL}/card/{card.link_token}"

    for recipient in recipients:
        try:
            send_card_email(
                to_email=recipient.email,
                sender_name=card.sender_name,
                sender_branding=card.sender_branding,
                card_url=card_url,
                category=card.template_slug,
            )
            Recipient.objects.filter(pk=recipient.pk).update(email_sent_at=timezone.now())
        except Exception as exc:
            raise self.retry(exc=exc)

    Card.objects.filter(pk=card.pk).update(emails_sent_at=timezone.now())
