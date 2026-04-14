"""
Read-only endpoint that mirrors the frontend template registry.
Used by the frontend to validate template slugs and render template lists server-side if needed.
"""
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response

# Python-side mirror of frontend/src/templates/registry.ts
# Keep in sync when adding new templates.
TEMPLATE_REGISTRY = [
    {"slug": "minimal-wish",       "title": "Minimal Wish",       "category": "birthday",        "tier": "free"},
    {"slug": "balloon-bash",       "title": "Balloon Bash",       "category": "birthday",        "tier": "essential"},
    {"slug": "confetti-overload",  "title": "Confetti Overload",  "category": "birthday",        "tier": "essential"},
    {"slug": "cake-and-candles",   "title": "Cake & Candles",     "category": "birthday",        "tier": "premium"},
    {"slug": "heart-float",        "title": "Heart Float",        "category": "anniversary",     "tier": "essential"},
    {"slug": "rose-petals",        "title": "Rose Petals",        "category": "anniversary",     "tier": "premium"},
    {"slug": "diploma-scroll",     "title": "Diploma Scroll",     "category": "graduation",      "tier": "essential"},
    {"slug": "cap-toss",           "title": "Cap Toss",           "category": "graduation",      "tier": "premium"},
    {"slug": "simple-thanks",      "title": "Simple Thanks",      "category": "thank-you",       "tier": "free"},
    {"slug": "gratitude-bloom",    "title": "Gratitude Bloom",    "category": "thank-you",       "tier": "premium"},
    {"slug": "party-popper",       "title": "Party Popper",       "category": "congratulations", "tier": "essential"},
    {"slug": "gold-shimmer",       "title": "Gold Shimmer",       "category": "congratulations", "tier": "premium"},
]

VALID_SLUGS = {t["slug"] for t in TEMPLATE_REGISTRY}


class TemplateListView(APIView):
    def get(self, request):
        return Response(TEMPLATE_REGISTRY)


urlpatterns = [
    path("", TemplateListView.as_view(), name="template-list"),
]
