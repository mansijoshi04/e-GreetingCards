# GifLove — Product Requirements Document

**Version:** 1.0  
**Date:** April 2026  
**Product:** GifLove (giflove.ca)

---

## Tagline

> Greetings that feel like a moment, not a message.

## Core Promise

Animated digital greeting cards sent via a shareable link. Pay once, deliver magic.

Recipients receive a card that actually does something — an envelope tears open as you scroll, candles blow out when you tap, balloons pop on click. Cards expire in days, not forever. That scarcity makes them feel like an occasion.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, Django 5, Django REST Framework |
| Frontend | React 19, TypeScript, Vite, React Router v7, Motion, Tailwind CSS |
| Database | PostgreSQL (Django ORM, no templates table) |
| Cache / Queue broker | Redis |
| Scheduled tasks | Celery |
| Payments | Paddle (overlay checkout) |
| Email delivery | Resend |
| Media storage | MinIO — self-hosted S3-compatible object storage (images/videos uploaded by Premium/Bulk users) |
| Hosting | Hostinger VPS — Docker Compose + Nginx reverse proxy |
| CI/CD | GitHub Actions |

---

## Infrastructure Separation

Each environment is fully isolated with its own compose file and env file. **CI/CD never writes or overwrites env files on the VPS.**

| Environment | Compose File | Env File | Port | URL |
|-------------|-------------|----------|------|-----|
| Local dev | `docker-compose.yml` | `.env.local` | 3000 | localhost |
| Staging | `docker-compose.staging.yml` | `.env.staging` | 3040 | staging.giflove.ca |
| Production | `docker-compose.prod.yml` | `.env.prod` | 3050 | giflove.ca |

Env files (`.env.staging`, `.env.prod`) are placed manually on the VPS once and never committed to git. `.env.example` in the repo documents all required variables.

---

## Card Template System

Templates are **static code**, not database rows. The template registry lives in `frontend/src/templates/registry.ts` as a typed array of `CardTemplate` objects (defined in `frontend/src/types/card.ts`).

The database stores only the user's customization (text, colors, media URL) alongside the `template_slug` string. No templates table exists — no seeding required. Adding a new card = add a component file + register the slug.

### Card Component Standard

Every card component must satisfy the `CardProps` TypeScript interface — enforced at compile time. This contract is fixed regardless of the card's visual design, animation style, or interaction type. The full spec lives in `CLAUDE.md → Card Component Standard`.

**Key rules:**
- Each card is self-contained — all animations and effects live inside the component file
- Every card handles `isPreview` (loops animations, disables gestures in the editor)
- Every registry entry provides: slug, title, category, tier, component, defaultText, 3+ colorPresets, description, animationType
- Interaction type, animation sequence, color palette, and gesture details are specified by the designer per card — not predefined globally

**Before building a new card, always confirm:** slug, category, tier, animation type, interaction details, color presets, typography, animation sequence, interaction hint, and preview gradient.

---

## Pricing Tiers

### Free — $0

**Target:** First-time visitors, casual one-off senders  
**Card Types:** Static only (no animations, no interactions)  
**Recipients:** 1 (manual link share — platform does not send email)  
**Sending:** Manual link share only  
**Link Expiry:** 3 days  

**Features:**
- 1 static template per category (6 templates total: Birthday, Anniversary, Graduation, Thank You, Congratulations, Get Well Soon)
- Text customization: headline and message only
- GifLove watermark displayed on card
- No scheduling

**Differentiator:** Zero friction to try. Every occasion has a free option — no payment required, no account needed.

---

### Essential — $2.99 per card

**Target:** Casual senders — birthdays, thank-yous, quick celebrations  
**Card Types:** Animated (scroll-to-open, click-to-reveal, confetti)  
**Recipients:** Up to 3 (platform emails on your behalf)  
**Sending:** Instant or Scheduled  
**Link Expiry:** 7 days  

**Features:**
- All standard animated card templates (~8 templates)
- Full text customization: headline, body, signature
- Email delivery via Resend to up to 3 recipients
- Scheduled delivery: pick future date/time — platform sends automatically
- No GifLove watermark
- Basic color palette selection (3 preset options)
- Download card as PNG (static snapshot)
- Mobile-optimized

**Differentiator:** The go-to for solo senders. Scheduling means you never miss a birthday, even when life gets busy.

---

### Premium — $4.99 per card

**Target:** People who want to go all-out — milestone birthdays, anniversaries, graduations  
**Card Types:** All animated + premium interactive (blow candles, pop balloons, open envelope)  
**Recipients:** Up to 5 (platform emails on your behalf)  
**Sending:** Instant or Scheduled  
**Link Expiry:** 14 days  

**Features:**
- All Essential features
- All premium interactive card types: BirthdayCake (blow candles), BalloonPop, EnvelopeReveal
- Full color customization: custom color picker + font choice
- **Upload your own image or video** — embed a personal photo or short video clip directly on the card (max 10 MB image, 30-second video; stored in MinIO on the same VPS)
- Download as **PNG or MP4/WebM video** (MP4 captures full animation via browser MediaRecorder API)
- Open tracking: see who opened your card and when
- Priority email delivery

**Download format note:** GIF is excluded — its 256-color palette produces visible banding on gradient card backgrounds. PNG is a perfect static snapshot. MP4/WebM captures the full animation at full quality and is supported everywhere.

**Differentiator:** Upload a real photo, schedule it perfectly, download the animation. Nothing generic about it. The one that makes people gasp.

---

### Bulk — $30 per card (up to 50 recipients)

**Target:** HR teams, event planners, small businesses, teachers  
**Card Types:** All animated + all premium interactive  
**Recipients:** Up to 50 per card  
**Sending:** Instant or Scheduled  
**Link Expiry:** 30 days  

**Features:**
- All Premium features
- Up to 50 recipients per card
- **Upload your own image or video** — higher limits than Premium (max 50 MB image, 2-minute video)
- Custom sender name/branding (e.g. "From: Acme Corp HR Team")
- CSV upload for recipient emails
- Dashboard with analytics: open rates, per-recipient tracking
- Priority support
- Download as PNG or MP4/WebM

**Pricing model:** Flat $30 per card (not a credits pack) — one purchase per occasion, no per-recipient math. If repeat-use patterns emerge after launch, a credits system can be added later.

**Differentiator:** One card, fifty people. Ideal for company-wide announcements, team celebrations, or large events.

---

## Tier Comparison Table

| Feature | Free | Essential ($2.99) | Premium ($4.99) | Bulk ($30) |
|---------|:----:|:-----------------:|:---------------:|:----------:|
| Card types | Static | Animated | Animated + Interactive | All |
| Recipients | 1 (manual) | Up to 3 | Up to 5 | Up to 50 |
| Email delivery | No | Yes | Yes | Yes |
| Scheduling | No | Yes | Yes | Yes |
| Link expiry | 3 days | 7 days | 14 days | 30 days |
| Color customization | No | 3 presets | Full picker | Full picker |
| Font choice | No | No | Yes | Yes |
| Upload image/video | No | No | Yes (10 MB / 30s) | Yes (50 MB / 2 min) |
| Open tracking | No | No | Yes | Yes (per-recipient) |
| Watermark | Yes | No | No | No |
| Download PNG | No | Yes | Yes | Yes |
| Download MP4/WebM | No | No | Yes | Yes |
| CSV recipient upload | No | No | No | Yes |
| Custom sender branding | No | No | No | Yes |
| Analytics dashboard | No | No | No | Yes |

---

## Card Categories — MVP

6 categories, 12 templates. All templates are static code entries in the registry — none are seeded to the database.

### Birthday
| Slug | Tier | Description |
|------|------|-------------|
| `minimal-wish` | Free | Clean typography, soft fade-in, no interaction |
| `balloon-bash` | Essential | Animated floating balloons + confetti burst on reveal |
| `confetti-overload` | Essential | Heavy confetti (400 particles), bright rainbow palette |
| `cake-and-candles` | Premium | Interactive blow-the-candles experience, transitions to card message |

### Anniversary
| Slug | Tier | Description |
|------|------|-------------|
| `heart-float` | Essential | Floating hearts, soft pastels, click-to-reveal |
| `rose-petals` | Premium | Falling rose petal animation, romantic gradient, scroll-triggered |

### Graduation
| Slug | Tier | Description |
|------|------|-------------|
| `diploma-scroll` | Essential | Scroll interaction unrolls a diploma; serif typography |
| `cap-toss` | Premium | Animated graduation caps flying, confetti burst, school-color customizable |

### Thank You
| Slug | Tier | Description |
|------|------|-------------|
| `simple-thanks` | Free | Minimal, message-forward, clean sans-serif fade-in |
| `gratitude-bloom` | Premium | Flowers bloom as you scroll; watercolor aesthetic |

### Congratulations
| Slug | Tier | Description |
|------|------|-------------|
| `party-popper` | Essential | Confetti from corners, bold celebratory typography |
| `gold-shimmer` | Premium | Trophy/medal illustration, gold shimmer particle effect |

### Get Well Soon *(Phase 2)*
| Slug | Tier | Description |
|------|------|-------------|
| `sunshine-flowers` | Essential | Gentle animations, warm tones, cheerful message |

---

## User Flows

### Sender Journey
1. **Landing page** — Browse templates by category, see tier pricing
2. **Template selection** — Filter by occasion, preview animation on hover
3. **Customization editor** — Edit text (headline, body, signature), pick color palette, upload photo/video (Premium/Bulk), preview live
4. **Add recipients** — Enter up to N email addresses (or upload CSV for Bulk), set scheduled send time (optional)
5. **Payment** — Paddle overlay checkout
6. **Confirmation** — Card link shown, copy link button, WhatsApp/email share buttons

### Recipient Journey
1. **Email received** — "You've got a card from [Sender]" via Resend
2. **Card page loads** — `giflove.ca/card/<token>` — expiry checked, card design loaded
3. **Interactive experience** — Scroll/click/blow to reveal the card; confetti fires
4. **After viewing** — "Create your own" CTA (growth loop)

---

## Post-MVP Enhancements

- **Group cards** — Multiple contributors add messages to one card
- **Photo collage** — Upload multiple photos, displayed as a gallery within the card
- **Scheduling calendar** — Save upcoming birthdays, auto-remind before the date
- **User accounts** — Save card history, re-use designs, favourite templates
- **B2B API** — Let partners trigger card sends programmatically
- **Localization** — French (Canada), Spanish

---

## Critical Success Metrics

| Metric | Target |
|--------|--------|
| Conversion rate (visitor → paid card) | > 5% |
| Avg recipients per paid card | ≥ 2 |
| Recipient click-through ("Create your own") | > 20% |
| Card load time (mobile 4G) | < 2 seconds |
| Email deliverability rate | > 98% |
