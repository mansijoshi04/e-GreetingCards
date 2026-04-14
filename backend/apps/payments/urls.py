from django.urls import path
from .views import PaddleWebhookView

urlpatterns = [
    path("webhook/", PaddleWebhookView.as_view(), name="paddle-webhook"),
]
