from django.urls import path
from .views import CardCreateView, CardDetailView

urlpatterns = [
    path("", CardCreateView.as_view(), name="card-create"),
    path("<str:link_token>/", CardDetailView.as_view(), name="card-detail"),
]
