from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/cards/", include("apps.cards.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/tracking/", include("apps.tracking.urls")),
    path("api/templates/", include("apps.cards.template_urls")),
]
