# Phase 1: Core Card Viewing System

**Status**: ✅ Complete
**Completed**: March 8, 2026

---

## What Was Built

### Link Management (`lib/services/linkService.ts`)
- `generateLinkToken(length)` — creates a unique 12-character alphanumeric token with collision detection
- `validateLink(token)` — checks Redis first (fast path), falls back to PostgreSQL
- `cacheCardLink(token, cardId, expiresAt)` — stores in Redis with 7-day TTL
- `fetchCardData(token)` — loads card + template + recipients from DB
- `updateCardAccess(cardId)` — updates `lastAccessedAt` timestamp

### Card Service (`lib/services/cardService.ts`)
- `createCard()`, `getCard()`, `getCardStats()`, `deleteCard()`

### Card Viewer (`app/card/[linkToken]/page.tsx`)
- Server-side rendered (SSR) for SEO and social preview metadata
- Validates link expiry, renders error page for expired/invalid tokens
- Fires analytics tracking on load
- `app/card/[linkToken]/loading.tsx` — skeleton loader

### Animation Components

**`components/animations/ScrollToOpen.tsx`** — Envelope effect
- Framer Motion `useScroll` + `useTransform` maps scroll progress → flap rotation (0° → -180°) and card Y position (400px → 0)
- Sticky container keeps envelope in viewport while user scrolls
- Confetti triggers at 55% scroll progress
- Share buttons fade in after card is revealed

**`components/animations/ClickToReveal.tsx`** — Cover reveal
- Cover div scales from 1 → 20 and fades out on click
- Card fades/scales in with 0.3s delay
- Share buttons animate in with `AnimatePresence`

**`components/cards/CardRenderer.tsx`** — Selects animation based on `design.animations.scrollTrigger`
**`components/cards/CardContent.tsx`** — Renders design elements (text, with entrance animations)
**`components/cards/ConfettiLayer.tsx`** — `react-confetti` wrapper; configurable colors + intensity; auto-dismisses after duration

### Shared Utilities
**`components/ui/ShareButton.tsx`** — Reusable animated button (used by both animation components)
**`lib/utils/cardUtils.ts`** — `shareCard(method)` and `downloadCardAsPng(selector)` shared across animation components

### Analytics API (`app/api/tracking/open/route.ts`)
- `POST /api/tracking/open` — logs card opens with device type, IP, user-agent, referrer
- Updates `recipients.firstOpenedAt`, `openCount`, `lastOpenedAt`
- Inserts row into `card_opens`

---

## Architecture Decisions

**SSR for card pages** — enables dynamic OG metadata per card, secure link validation server-side, faster perceived load.

**Redis + DB fallback** — Redis for O(1) validation, PostgreSQL as reliable persistence. If Redis is unavailable, the DB validates expiry directly.

**Framer Motion scroll transforms** — maps `scrollYProgress` (0–1) to CSS properties using `useTransform`. Sticky container pattern keeps the animation anchored while the page scrolls beneath it.

**Two animation patterns** — `scroll-trigger: envelope-open` vs `click-to-reveal`. Template's `designConfig.animations.scrollTrigger` controls which is used. Designed to be extensible (new types just need a new component and a branch in CardRenderer).

**Client-side tracking** — fires after hydration so user-agent and referrer are available from the browser.

---

## How to Test

```bash
# 1. Start Docker stack
docker compose up

# 2. Open Prisma Studio and create a test card
docker compose exec app npx prisma studio  # http://localhost:5555

# 3. Cache the card in Redis
docker compose exec redis redis-cli
SET card:testcard123a '{"cardId":"YOUR_CARD_ID","expiresAt":"2026-03-20T00:00:00.000Z"}' EX 604800

# 4. View the card
open http://localhost:3000/card/testcard123a
```

### Test Scenarios
- **Scroll-to-open**: page loads with instruction; scroll → flap rotates → card slides up → confetti → share buttons
- **Click-to-reveal**: cover fills screen → tap → cover zooms/fades → card appears → confetti → share buttons
- **Expired link**: visit `/card/invalidtoken` → "Card not found" error page
- **Analytics**: check `card_opens` table in Prisma Studio after viewing a card
- **Download**: click 🖼️ button → PNG downloads at 2x resolution
- **Share**: copy link, WhatsApp, email all functional

### Performance Targets
- Page load: < 1.5s
- Animation: 60fps (verify in Chrome DevTools Performance tab)
- Analytics call: < 200ms (async, non-blocking)

---

## Files Created

```
lib/services/linkService.ts
lib/services/cardService.ts
lib/utils/cardUtils.ts
components/animations/ScrollToOpen.tsx
components/animations/ClickToReveal.tsx
components/cards/CardRenderer.tsx
components/cards/CardContent.tsx
components/cards/ConfettiLayer.tsx
components/ui/ShareButton.tsx
app/card/[linkToken]/page.tsx
app/card/[linkToken]/loading.tsx
app/api/tracking/open/route.ts
```
