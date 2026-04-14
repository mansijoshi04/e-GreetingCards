"""
Email delivery service. Supports 'resend' (production) and 'console' (local dev).
Controlled by EMAIL_PROVIDER setting.
"""
import resend
from django.conf import settings


def send_card_email(
    to_email: str,
    sender_name: str,
    sender_branding: str,
    card_url: str,
    category: str,
) -> None:
    provider = settings.EMAIL_PROVIDER

    if provider == "console":
        print(
            f"[EMAIL] To: {to_email} | From: {sender_name or sender_branding} | URL: {card_url}"
        )
        return

    display_name = sender_branding if sender_branding else sender_name
    subject = f"{display_name} sent you a card!"

    html = _build_email_html(display_name, card_url, category)

    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send({
        "from": f"GifLove <{settings.EMAIL_FROM}>",
        "to": [to_email],
        "subject": subject,
        "html": html,
    })


def _build_email_html(display_name: str, card_url: str, category: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#FF6B9D 0%,#4ECDC4 100%);padding:40px 20px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:28px;">You've got a card!</h1>
    </div>
    <div style="padding:40px 30px;text-align:center;">
      <p style="font-size:18px;color:#333;margin-bottom:10px;">
        <strong>{display_name}</strong> sent you a special card
      </p>
      <p style="font-size:14px;color:#666;margin-bottom:30px;">Click below to open it</p>
      <a href="{card_url}"
         style="display:inline-block;padding:16px 40px;background:#FF6B9D;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">
        Open Your Card
      </a>
      <p style="font-size:12px;color:#999;margin-top:30px;">This card expires soon — open it while it lasts.</p>
    </div>
    <div style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee;">
      <p style="font-size:12px;color:#666;margin:0;">
        Want to send your own? <a href="https://giflove.ca" style="color:#FF6B9D;">Get started at giflove.ca</a>
      </p>
    </div>
  </div>
</body>
</html>"""
