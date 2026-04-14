from django.urls import path
from .views import TrackOpenView

urlpatterns = [
    path("open/", TrackOpenView.as_view(), name="track-open"),
]
