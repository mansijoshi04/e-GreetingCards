# Open Issues & Planned Work

Track of all known improvements, bugs, and features to build next.
Work through these one by one — top of each section = highest priority.

---

## UI / UX

### #1 — Template gallery filters
**What**: Add filter tabs on `/create` to filter cards by category (Birthday, Anniversary, Graduation, Thank You) and tier (Basic, Premium).
**Where**: `app/create/page.tsx` + `components/templates/TemplateGallery.tsx`
**How**: Filter state in parent, pass down as prop. Categories come from existing `template.category` values already in DB. No API change needed — filter client-side from the fetched list.

---

### #2 — Colour picker: text colour not applying + proper colour picker
**What (bug)**: The "Message Colour" swatch in the customisation panel updates `customStyling` state but the `CardPreview` and `CardContent` components don't apply it to the text elements. Fix the wiring.
**What (feature)**: Replace the 4 preset colour swatches with a full colour picker — the native `<input type="color">` or a library like `react-colorful` so users can pick any hex or adjust hue/saturation/lightness.
**Where**: `components/editor/CustomizationPanel.tsx` (picker UI), `components/editor/CardPreview.tsx` + `components/cards/CardContent.tsx` (applying the colour).
**Background colour**: Same improvement — allow any background colour, not just 4 presets. Background is either a solid or a gradient (two stops). Show two colour pickers side-by-side for gradient templates.

---

### #3 — Animation preview before going to recipients
**What**: After customising a card, instead of going straight to `/recipients`, show a full-screen preview that plays the card's animation (scroll-to-open or click-to-reveal). User confirms "Looks good → Add Recipients" or goes back to edit.
**Where**: Add a `PreviewModal` component or a dedicated `/preview` step between `/create/[templateId]` and `/recipients`.
**Notes**: The `CardRenderer` + animation components already exist. Just need a modal or page wrapper with a "Send this card →" CTA.

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

### #6 — Add 3 more basic cards + 3 more premium cards (total 9)
**What**: Expand the seed file with 6 new templates so there's a meaningful selection and a clearer distinction between basic and premium.

Suggested additions:
**Basic** (simple animations, solid/gradient bg):
- "Confetti Burst" — Birthday, heavy confetti, rainbow
- "Simple Thanks" — Thank You, minimal fade-in, clean sans-serif
- "Achievement" — Graduation, gold shimmer, bold typography

**Premium** (unique reveal, richer design):
- "Cake Celebration" — Birthday, animated candles, click-to-reveal
- "Heart Float" — Anniversary, floating hearts, click-to-reveal
- "Cap Toss" — Graduation, scroll triggers cap-toss animation

**Where**: `prisma/seed.ts` — add 6 new `prisma.template.create()` blocks.
**After adding**: `docker compose down -v && docker compose up` to reseed.

---

### #7 — Shared Navbar and Footer components
**What**: `app/page.tsx`, `app/about/page.tsx`, `app/faq/page.tsx`, `app/create/page.tsx` all duplicate the same Navbar and Footer HTML. Extract into `components/layout/Navbar.tsx` and `components/layout/Footer.tsx`.
**Where**: Create `components/layout/` folder. Import into each page (or add to `app/layout.tsx` if all pages should share it).

---

## Legal / Compliance

### #8 — Privacy Policy page (required for Paddle production)
**What**: Create `app/privacy/page.tsx` with a real privacy policy.
**Minimum content**: Data collected (email, payment info via Paddle), how it's used, retention (cards expire in 7 days), third-party services (Paddle, SendGrid), contact email.
**Link**: Already referenced in footer as `href="#"` — update to `/privacy`.

---

### #9 — Refund Policy page (required for Paddle production)
**What**: Create `app/refund/page.tsx`.
**Minimum content**: Cards are digital goods delivered on purchase — refunds within 24 hours if card was not opened by any recipient. Contact process for requesting a refund.
**Link**: Add to footer under Company section.

---

### #10 — Terms of Service page (required for Paddle production)
**What**: Create `app/terms/page.tsx`.
**Minimum content**: Acceptable use, no harassment/spam, card expiry policy, payment terms, intellectual property of templates.
**Link**: Add to footer.

---

### #11 — Footer links: update # placeholders to real pages
**What**: The footer has `href="#"` for Privacy Policy and Contact. Once pages are created, update all footer links across `page.tsx`, `about/page.tsx`, `faq/page.tsx`, `create/page.tsx`.
**Depends on**: #7 (shared footer), #8, #9, #10.

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
- [ ] `metadataBase` set in `app/layout.tsx` (Next.js warns about this currently)
- [ ] Switch `NODE_ENV` to `production` (disables `/api/dev/mock-payment`)

---

### #13 — Fix `metadataBase` warning
**What**: Next.js logs a warning: `metadataBase property in metadata export is not set`. Set it in `app/layout.tsx`.
**How**: `export const metadata = { metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'), ... }`
**Small task — do this soon.**

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
