from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect
from django.conf import settings


def confirmation_redirect(request):
    """
    Paddle's success URL must be publicly accessible (no localhost).
    In dev, the ngrok URL points here; Django bounces the browser to
    the React frontend. In production this URL is never hit because
    BASE_URL is already the public domain.
    """
    return HttpResponseRedirect(f"{settings.BASE_URL}/confirmation")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("confirmation", confirmation_redirect),  # Paddle success URL target
    path("api/cards/", include("apps.cards.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/tracking/", include("apps.tracking.urls")),
    path("api/templates/", include("apps.cards.template_urls")),
]
