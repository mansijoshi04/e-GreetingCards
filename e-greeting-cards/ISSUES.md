# Open Issues & Planned Work

Track of all known improvements, bugs, and features to build next.
Work through these one by one — top of each section = highest priority.

---

## UI / UX

### ✅ #1 — Template gallery filters
Category pills (Birthday, Anniversary, Graduation, Thank You) + tier pills (Basic/Premium) added to `/create`. Both compose via URL params. Empty state shows "no templates match" message.

---

### ✅ #2 — Colour picker: text colour not applying + proper colour picker
Bug fixed: `customStyling.textColor` now applied in `CardPreview` and `CardContent` (body + signature).
Feature: Replaced 4 preset swatches with `<input type="color">` + quick swatches for text colour. Background section now has two colour pickers for gradient stops (with live preview swatch) plus named presets below. `textColor` stored as hex.

---

### ✅ #3 — Animation preview before going to recipients
`PreviewModal` created (`components/editor/PreviewModal.tsx`). "Next: Recipients" opens a full-screen overlay with a live card preview and animation type hint. User confirms with "Looks good → Add Recipients" or goes back to edit.

---

### #4 — Each card has a unique animation / reveal style
**What**: Right now all scroll-to-open cards share the same pink envelope. Each template should have its own distinct reveal presentation matching its theme (e.g. Balloon Party = balloons pop → card appears; Rose Petals = petals drift aside; Diploma Scroll = scroll unrolls).
**How**: Add an optional `revealStyle` field to `designConfig` in the template. `CardRenderer` reads this and picks the right animation variant. For now at least give each template a different envelope colour and confetti colour that matches its palette.
**Priority**: Medium — requires building 3–6 new animation variants.

---

### #5 — Two-page (flip-style) premium cards
**What**: Premium cards can have a "front" and an "inside" — like a physical card. The front shows the occasion art/headline; flipping/clicking reveals the inside with the personal message.
**How**: Extend `designConfig` to support `pages: [{ elements: [...] }, { elements: [...] }]`. `CardRenderer` renders a CSS flip animation between pages.
**Scope**: Premium cards only. Keep single-page for basic.

---

### ✅ #6 — Add 3 more basic cards + 3 more premium cards (total 9)
6 new templates added to `prisma/seed.ts`: Confetti Burst (birthday/basic), Simple Thanks (thankYou/basic), Achievement (graduation/basic), Cake Celebration (birthday/premium), Heart Float (anniversary/premium), Cap Toss (graduation/premium).
**To apply**: `docker compose down -v && docker compose up` to reseed.

---

### ✅ #7 — Shared Navbar and Footer components
`components/layout/Navbar.tsx` and `components/layout/Footer.tsx` created. All four public pages (`page.tsx`, `about`, `faq`, `create`) now use the shared components.

---

## Legal / Compliance

### ✅ #8 — Privacy Policy page
`app/privacy/page.tsx` created with data collection, usage, retention, third-party services, and contact info.

---

### ✅ #9 — Refund Policy page
`app/refund/page.tsx` created. Covers digital goods policy, 24-hour refund eligibility, and contact process.

---

### ✅ #10 — Terms of Service page
`app/terms/page.tsx` created. Covers acceptable use, card expiry, payment terms, IP, and liability.

---

### ✅ #11 — Footer links: update # placeholders to real pages
Shared `Footer.tsx` links to `/privacy`, `/refund`, and `/terms`.

---

## Production Readiness

### #12 — Production deployment (Vercel + managed services)
**What**: Deploy the app to Vercel for production.
**Checklist**:
- [ ] Vercel Postgres (or Neon) for production DB
- [ ] Upstash Redis for production Redis
- [ ] Paddle production keys + live webhook URL
- [ ] SendGrid sender domain verified
- [ ] `BASE_URL` set to production domain
- [ ] Switch `NODE_ENV` to `production` (disables `/api/dev/mock-payment`)

---

### ✅ #13 — Fix `metadataBase` warning
`metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000')` added to `app/layout.tsx`.

---

## Future / Post-Launch

### #14 — Analytics dashboard for senders
Track when recipients open a card, device breakdown, link expiry countdown. Show on a `/dashboard/[cardId]` page.

### #15 — User accounts
Save card history, favourite templates, reuse past messages. Auth via NextAuth or Clerk.

### #16 — Scheduled delivery
Let senders pick a date/time for the card to be emailed (cron or Vercel scheduled functions).

### #17 — Group / collaborative cards
Multiple contributors add their own messages to one card before it's sent.
