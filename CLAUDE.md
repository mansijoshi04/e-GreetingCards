# GifLove — Project Context

## What It Is

GifLove (giflove.ca) is an animated digital greeting card platform. Users pick a template, customize the text and colors, optionally upload a photo or video, pay via Paddle, and receive a shareable link. Recipients click the link and experience an interactive card — envelopes that scroll open, candles they blow out, balloons they pop. Cards expire in 3–30 days depending on tier.

**Pricing:**
| Tier | Price | Recipients | Scheduling | Media Upload |
|------|-------|-----------|------------|--------------|
| Free | $0 | 1 (manual link) | No | No |
| Essential | $2.99 | Up to 3 | Yes | No |
| Premium | $4.99 | Up to 5 | Yes | Yes (10 MB img, 30s video) |
| Bulk | $30 | Up to 50 | Yes | Yes (50 MB img, 2 min video) |

Full PRD at `docs/PRD.md`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, Django 5, Django REST Framework |
| Frontend | React 19, TypeScript, Vite, React Router v7, Motion, Tailwind CSS |
| Database | PostgreSQL 16 (Django ORM + Django migrations) |
| Cache / Task broker | Redis 7 |
| Scheduled tasks | Celery + django-celery-beat |
| Payments | Paddle (overlay checkout via Paddle.js on frontend) |
| Email | Resend (Python SDK) |
| Media storage | **MinIO** — self-hosted, S3-compatible, runs in Docker alongside the app |
| Hosting | Hostinger VPS — Docker Compose + Nginx reverse proxy |
| CI/CD | GitHub Actions |

---

## The No-Hardcoding Rule

**Every configuration value in this codebase must come from one of two places. No exceptions.**

### 1. Environment variables — for anything that changes between environments

Read with `decouple.config()` on the backend, `import.meta.env.VITE_*` on the frontend.

Things that belong in `.env.*`:
- Credentials (DB passwords, API keys, secret keys)
- Service URLs (database host, Redis URL, MinIO endpoint, base URL)
- Feature flags controlled per environment
- Anything that differs between local dev, staging, and production

### 2. `backend/giflove/constants.py` — for business rules that don't change per environment

Things that belong in `constants.py`:
- Tier identifiers (`TIER_FREE`, `TIER_PREMIUM`, etc.)
- Recipient limits per tier (`RECIPIENT_LIMITS`)
- Link expiry days per tier (`LINK_EXPIRY_DAYS`)
- Upload size limits per tier (`MEDIA_UPLOAD_LIMITS`)
- Prices in cents (`TIER_PRICES_CENTS`)
- Tier capability sets (`SCHEDULING_TIERS`, `OPEN_TRACKING_TIERS`, etc.)

The equivalent on the frontend is `frontend/src/constants.ts`.

### What this looks like in practice

```python
# WRONG — magic number inline in a view
if len(recipients) > 5:
    return error

# CORRECT — import from constants
from giflove.constants import RECIPIENT_LIMITS
if len(recipients) > RECIPIENT_LIMITS[tier]:
    return error
```

```python
# WRONG — hardcoded URL in a service
card_url = f"https://giflove.ca/card/{token}"

# CORRECT — read from settings (which reads from env)
from django.conf import settings
card_url = f"{settings.BASE_URL}/card/{token}"
```

```python
# WRONG — hardcoded credentials
s3 = boto3.client('s3', endpoint_url='http://minio:9000', ...)

# CORRECT — read from settings
s3 = boto3.client('s3', endpoint_url=settings.MINIO_ENDPOINT_URL, ...)
```

**If you find yourself writing a literal string, number, URL, or expiry inline in application logic — stop. Put it in the right place first.**

---

## Repo Structure

```
/                               ← repo root
├── backend/                    ← Django project
│   ├── giflove/
│   │   ├── constants.py        ← ALL business rules live here (tier limits, prices, expiry)
│   │   ├── settings/
│   │   │   ├── base.py         ← shared settings (reads from env via decouple.config)
│   │   │   ├── development.py  ← local dev overrides
│   │   │   └── production.py   ← staging + prod overrides
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── celery_app.py
│   ├── apps/
│   │   ├── cards/              ← Card + Recipient models, link service, template registry endpoint
│   │   ├── payments/           ← Paddle webhook handler
│   │   ├── emails/             ← Resend wrapper + Celery tasks
│   │   └── tracking/           ← CardOpen model + analytics endpoint
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile              ← production image (runs collectstatic)
│   └── Dockerfile.dev          ← dev image (no collectstatic, source mounted)
├── frontend/                   ← React + Vite app
│   ├── src/
│   │   ├── constants.ts        ← frontend business rule constants (mirrors backend/giflove/constants.py)
│   │   ├── templates/
│   │   │   └── registry.ts     ← SINGLE SOURCE OF TRUTH for all card templates
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │       └── api.ts          ← typed client for Django backend
│   ├── Dockerfile              ← production multi-stage build (nginx)
│   ├── nginx.conf              ← SPA routing for frontend container
│   └── package.json
├── nginx/
│   ├── staging.giflove.ca      ← internal Docker nginx (routes /api, /media, / per env)
│   └── giflove.ca
├── docs/
│   ├── PRD.md
│   └── 03-VPS-PORT-MAPPING.md
├── docker-compose.yml          ← local dev (Dockerfile.dev, hot reload, MinIO on localhost:9000)
├── docker-compose.staging.yml  ← staging VPS (port 3040, .env.staging)
├── docker-compose.prod.yml     ← production VPS (port 3050, .env.prod)
├── .env.example                ← committed reference for all required env vars
├── .env.local                  ← local dev values (gitignored)
└── .github/workflows/
    ├── ci.yml
    ├── deploy-staging.yml
    └── deploy-production.yml
```

---

## Card Component Standard

This is the contract every card component must follow. It exists so that anyone — human or LLM — can build a new card design without making structural decisions. The structure is fixed. Only the look, feel, and animation change per card.

### The two interfaces every card must satisfy

Defined in `frontend/src/types/card.ts` and enforced by TypeScript at compile time.

#### 1. `CardProps` — what every card component accepts

```typescript
interface CardProps {
  customText: { headline: string; body: string; signature: string };
  customStyling?: { colorPreset?, primaryColor?, secondaryColor?, fontFamily?, fontSize? };
  mediaUrl?: string;          // MinIO public URL — Premium/Bulk only, undefined otherwise
  mediaType?: 'image' | 'video';
  senderName: string;
  senderBranding?: string;    // Bulk only: "From: Acme Corp HR Team"
  tier: Tier;
  isPreview?: boolean;        // true when rendered in the editor preview pane
}
```

`isPreview` is the most important prop to handle correctly:
- When `true`: loop animations, disable gesture interactions (blow/pop/tap), fire no analytics
- When `false` or `undefined`: normal one-shot playback

#### 2. `CardTemplate` — the registry entry

```typescript
interface CardTemplate {
  slug: string;                          // stable DB key — never rename after launch
  title: string;
  category: CardCategory;
  tier: Tier;
  component: ComponentType<CardProps>;
  defaultText: CardText;                 // pre-filled editor text
  colorPresets: ColorPreset[];           // minimum 3, first is the default
  description: string;                  // one sentence for the template browser
  animationType: AnimationType;         // 'scroll-to-open' | 'click-to-reveal' | 'gesture' | 'auto-play'
  interactionHint?: string;             // required for gesture + click-to-reveal cards
  previewGradient?: string;             // CSS gradient for template browser thumbnail
}
```

### File structure for a card component

```
frontend/src/components/cards/
  BalloonBash.tsx          ← single file, self-contained
  CakeAndCandles.tsx
  MinimalWish.tsx
  ...
```

Each file is **self-contained** — all animations, effects, and assets needed by that card live inside the component file. Do not import from a shared effects library. If two cards use confetti, each has its own confetti logic.

### How to add a new card (checklist)

**Before writing any code, confirm the following with the designer (always ask if not provided):**

1. **Slug** — the stable URL-safe identifier (e.g. `balloon-bash`). Will be stored in the DB forever.
2. **Category** — `birthday` | `anniversary` | `graduation` | `thank-you` | `congratulations` | `get-well-soon`
3. **Tier** — `free` | `essential` | `premium` | `bulk`
4. **Animation type** — how is the card triggered? (`scroll-to-open` / `click-to-reveal` / `gesture` / `auto-play`)
5. **Interaction** — if gesture: what does the user do? (blow, pop, swipe, tap, shake)
6. **Color palette** — 3+ named presets with primary, secondary, background, and text hex values
7. **Typography** — which font(s) are available? (`inter` | `cormorant` | `quicksand`)
8. **Animation sequence** — what plays, in what order, at what trigger?
9. **Interaction hint** — the short text shown to the recipient (e.g. `"Blow out the candles"`)
10. **Preview gradient** — the CSS gradient for the thumbnail in the template browser

**Then:**

1. Create `frontend/src/components/cards/YourCardName.tsx` implementing `CardProps`
2. Add the entry to `frontend/src/templates/registry.ts` satisfying `CardTemplate`
3. Add the slug string to `backend/apps/cards/template_urls.py` (`TEMPLATE_REGISTRY` list)
4. Run `npx tsc --noEmit` — must pass with no errors

No migration needed. No seeding. That's it.

---

## Card Template System

Templates are **static code, not database rows**. No templates table. No seeding.

**Frontend registry** (`frontend/src/templates/registry.ts`) is the single source of truth — a typed array of `CardTemplate` objects (see `frontend/src/types/card.ts`). Each entry's component must satisfy `CardProps`.

**Backend** (`backend/apps/cards/template_urls.py`) holds a Python mirror of the slug list for server-side validation. Keep it in sync when adding templates.

**See "Card Component Standard" above for the full authoring guide and checklist.**

---

## Database Schema

**No templates table.** `Card` stores a `template_slug` string (not a FK).

Key models:
- `Card` — `template_slug`, `tier`, `link_token`, `expires_at`, `custom_text` (JSONField), `custom_styling` (JSONField), `media_url`, `scheduled_at`
- `Recipient` — FK to Card, `email`, `open_count`, `first_opened_at`
- `CardOpen` — analytics: FK to Card + Recipient, `device_type`, `ip_address`

Run migrations: `python manage.py migrate` (runs automatically on container start).

---

## Infrastructure — Staging / Production Separation

Each environment is **fully isolated**. CI/CD never writes or overwrites env files.

| Environment | Compose File | Env File | Port | URL |
|-------------|-------------|----------|------|-----|
| Local dev | `docker-compose.yml` | `.env.local` | 3000/8000/9000 | localhost |
| Staging | `docker-compose.staging.yml` | `.env.staging` | 3040 | staging.giflove.ca |
| Production | `docker-compose.prod.yml` | `.env.prod` | 3050 | giflove.ca |

**Env file rule:** `.env.staging` and `.env.prod` are placed on the VPS once manually and never touched by automation. `.env.example` is the committed reference — update it whenever a new variable is added.

**Request flow (VPS):**
```
Browser → host nginx (443/80) → Docker nginx (127.0.0.1:3040 or :3050)
        → /api/*    → Django backend (Gunicorn :8000)
        → /media/*  → MinIO bucket (proxied through Docker nginx)
        → /static/* → Django staticfiles
        → /*        → React SPA (nginx serving built bundle)
```

---

## Dev Setup

```bash
# 1. Clone repo
git clone <repo> && cd <repo>

# 2. .env.local is already included in the repo with safe dev defaults.
#    Edit it if you want to add real Paddle sandbox credentials.

# 3. Start all services (migrations and MinIO bucket creation run automatically)
docker compose up

# Access:
#   Frontend:     http://localhost:3000
#   Backend API:  http://localhost:8000/api/
#   Django admin: http://localhost:8000/admin/
#   MinIO API:    http://localhost:9000   (boto3 endpoint)
#   MinIO console:http://localhost:9001   (login: minioadmin / minioadmin123)
```

---

## Key Commands

```bash
# Run migrations (inside container)
docker compose exec backend python manage.py migrate

# Create Django superuser
docker compose exec -it backend python manage.py createsuperuser

# Django shell
docker compose exec -it backend python manage.py shell

# Celery worker logs
docker compose logs -f worker

# Frontend dev (standalone, outside Docker — faster for frontend-only work)
cd frontend && npm install && npm run dev

# Backend lint
cd backend && pip install ruff && ruff check .

# Frontend type check
cd frontend && npx tsc --noEmit

# VPS staging deploy
cd ~/apps/giflove-staging
docker compose -f docker-compose.staging.yml up -d --build
docker compose -f docker-compose.staging.yml logs backend --tail=50

# VPS production deploy
cd ~/apps/giflove-production
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs backend --tail=50
```

---

## Environment Variables

All variables documented in `.env.example`. Key notes:

| Var | Notes |
|-----|-------|
| `DJANGO_SECRET_KEY` | Generate: `python -c "import secrets; print(secrets.token_hex(50))"` |
| `DJANGO_SETTINGS_MODULE` | `giflove.settings.development` local, `giflove.settings.production` on VPS |
| `POSTGRES_HOST` | `db` inside Docker, `localhost` outside |
| `MINIO_ENDPOINT_URL` | **Internal** URL (`http://minio:9000`) — overridden per service in compose files. Read by Django/boto3 to make API calls. |
| `MINIO_PUBLIC_URL` | **External** URL embedded in `Card.media_url` for browsers. Dev: `http://localhost:9000`. Staging/prod: `https://{domain}/media` (nginx proxies) |
| `MINIO_BUCKET_NAME` | `giflove-dev` / `giflove-staging` / `giflove-prod` — isolates media per environment |
| `EMAIL_PROVIDER` | `console` (dev — prints to stdout) or `resend` (staging/prod) |
| `PADDLE_ENVIRONMENT` | `sandbox` for dev/staging, `production` for prod |
| `BASE_URL` | Used in email links — must be the public-facing URL for the environment |

---

## Media Uploads (Premium + Bulk)

- User selects an image or video in the frontend editor
- Frontend POSTs to `POST /api/cards/upload/` (Django)
- Django validates the file size against `MEDIA_UPLOAD_LIMITS[tier]` from `constants.py`
- Django uploads to MinIO via `boto3` using `MINIO_ENDPOINT_URL` (internal)
- The public URL (built from `MINIO_PUBLIC_URL`) is stored in `Card.media_url`
- Card viewer renders the file directly from `Card.media_url`

**Never store the internal `minio:9000` URL in the database — always use `MINIO_PUBLIC_URL` for the stored value.**

Limits (from `backend/giflove/constants.py`):
- Premium: 10 MB image, 30-second video
- Bulk: 50 MB image, 2-minute video

---

## Deployment (VPS — One-Time Setup per Environment)

```bash
# On VPS — staging example
cd ~/apps
git clone <repo> giflove-staging
cd giflove-staging

# Create env file from template (fill in real values)
cp .env.example .env.staging
nano .env.staging

# Start (MinIO bucket auto-created on first run by minio-init container)
docker compose -f docker-compose.staging.yml up -d --build

# Configure host nginx (once — Certbot manages SSL after)
sudo cp nginx/staging.giflove.ca /etc/nginx/sites-available/staging.giflove.ca
sudo ln -s /etc/nginx/sites-available/staging.giflove.ca /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d staging.giflove.ca
```

After this, CI/CD handles all subsequent deploys automatically on push to `staging` or `main`.

---

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Backend framework | Django + DRF | Developer familiarity; batteries included (ORM, admin, migrations); Celery integrates cleanly |
| Frontend | React + Vite + React Router | Starting from proven `newdesigns/` prototype; no SSR needed |
| Template storage | Static code registry | No seeding, no migration on template changes, version-controlled alongside components |
| Download formats | PNG + MP4/WebM | GIF excluded — 256-color palette degrades gradient card backgrounds. MP4 via MediaRecorder API captures full animation |
| Media storage | **MinIO** (self-hosted) | Free, open-source, S3-compatible API, runs in Docker alongside the app, no external account or egress fees, full data ownership |
| Env separation | `.env.local/.staging/.prod` + three compose files | Eliminates environment variable mix-up bugs; CI/CD never touches env files |
| Business rules | `constants.py` + `constants.ts` | Single authoritative source for limits, prices, expiry — never scattered as magic numbers across views and services |
| Scheduled emails | Celery + Redis | `apply_async(eta=...)` handles future send times; retries on failure; same broker already used for link caching |
