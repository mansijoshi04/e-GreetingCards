# GifLove — Homepage Re-design Plan

Merge the **homepage flow** of `design-1.html` with the **brand palette + header** of `design-2(use colors and header only)/`. Apply the new palette across the rest of the app. Card template components stay untouched.

---

## 1. Context & Goal

We have two reference UIs in the repo:

- **`design-1.html`** — a bundled React prototype. We like its homepage *flow*: Hero with typewriter → Occasion ribbon (marquee) → Mission → Showcase → Process → Pricing → Vault → Footer.
- **`design-2(use colors and header only)/`** — a separate Vite app. We like its *brand palette* (vellum + ink + three "pop" accent colors) and its *fixed scroll-aware header*. We do **not** want design-2's structural pattern of full-width brightly-colored section blocks.

The current frontend (`frontend/src/`) uses warm-beige + Tailwind rose/violet/amber/stone — neither of the references. This pass replaces the theme tokens, swaps the Navbar, rebuilds HomePage to design-1's section flow, and propagates the new palette to the other pages and the Footer.

**Confirmed with user**:
1. Color usage = **accents + small color-tinted cards**. Vellum background everywhere; pop colors used only on buttons, badges, hover states, individual cards, and small decorative shapes. No full-width colored sections.
2. Pricing tier mapping = Free → ink/vellum outline · Essential → pop-rose · Premium → pop-violet (Most Popular) · Bulk → pop-electric.
3. Scope = global theme tokens + Navbar + HomePage rebuild + Footer + propagate palette to Browse / Editor / Checkout / Recipients / Confirmation / CardViewer.

**Out of scope**: card template components (`frontend/src/components/cards/*`), `frontend/src/templates/registry.ts`, `frontend/src/constants.ts` business rules, backend.

---

## 2. The Brand Palette (extracted from design-2)

Source: `design-2(use colors and header only)/src/index.css` `@theme` block.

| Token name | Hex | Role |
|---|---|---|
| `--color-vellum-base` | `#f7f7f2` | Page background everywhere — replaces current `#faf8f5` / `#fdfcfb` |
| `--color-ink-espresso` | `#1a1a1a` | Primary text, dark UI surfaces, borders — replaces stone-700/800 |
| `--color-pop-violet` | `#8F00ff` | Premium tier; primary CTA color |
| `--color-pop-rose` | `#ff007a` | Essential tier; hover/active accents |
| `--color-pop-electric` | `#f4fa37` | Bulk tier; highlight underlines, decorative squiggles, "Most Popular" ribbon |

**Fonts** (already in current theme except Quicksand): keep **Cormorant Garamond** (serif headings) + **Inter** (sans body). **Drop Quicksand** — it doesn't match the design-2 type voice.

**Optional utilities to port from design-2**:
- `.noise-overlay` — subtle 3% noise texture for vellum backgrounds.
- `.dashed-border` — SVG-based dashed outline (use for the showcase card frames).

---

## 3. File-by-File Changes

### 3.1 Theme tokens — `frontend/src/index.css`

Replace the existing `@theme` / root color setup with:

```css
@theme {
  --color-vellum-base: #f7f7f2;
  --color-ink-espresso: #1a1a1a;
  --color-pop-violet:  #8F00ff;
  --color-pop-rose:    #ff007a;
  --color-pop-electric:#f4fa37;
  --font-serif: "Cormorant Garamond", Georgia, serif;
  --font-sans:  "Inter", -apple-system, sans-serif;
}

body {
  background: var(--color-vellum-base);
  color: var(--color-ink-espresso);
  font-family: var(--font-sans);
}
```

Add `.noise-overlay` and `.dashed-border` utilities (copy verbatim from `design-2/src/index.css`).
Remove all references to Quicksand, `#faf8f5`, `#fdfcfb`.

### 3.2 Navbar — `frontend/src/components/ui/Navbar.tsx`

Rewrite based on design-2's header (see `design-2/src/App.tsx` lines ~271-290 and the imported Header file in that folder).

Behavior:
- Fixed top, full width, `z-50`.
- Starts transparent over hero; on scroll past 24px, gains `bg-vellum-base/80 backdrop-blur-md` and a 1px bottom border in `ink-espresso/10`. Implement with `useEffect` + `scroll` listener.
- Logo: small heart icon (inline SVG, pop-rose fill) + "GifLove" wordmark in Cormorant Garamond, ink-espresso.
- Desktop links (Inter, ink-espresso, pop-rose hover): **Browse Cards**, **Pricing**, then a **CREATE** button (pop-violet bg, vellum text, slight rounded corners, hover: pop-rose).
- Mobile: hamburger icon → slide-in panel with the same links stacked.
- Use React Router `<Link>` for navigation.

### 3.3 HomePage — `frontend/src/pages/HomePage.tsx` (full rebuild)

Discard current sections (categories grid, gradient blobs, "why GifLove" features, CTA banner). Replace with **design-1's section flow**, but rendered on a vellum background with accent-only color usage.

#### Section 1 — Hero
- Vellum background, full-viewport min-height.
- Centered, large Cormorant headline. The last word cycles via typewriter through `["Seen.", "Unforgettable.", "Loved."]` — implement with a small inline hook (no library); 2.5s per word, 250ms blink cursor.
- Sub-copy in Inter, ink at 70% opacity.
- Primary CTA: pop-violet bg, vellum text → `/browse`. Secondary CTA: outlined ink-espresso → `/pricing`.
- Behind one keyword in the headline, render a hand-drawn `pop-electric` underline squiggle (inline SVG, ~2px stroke) for accent.
- No big colored blob — keep the canvas clean.

#### Section 2 — Occasion ribbon
- Full-width horizontal marquee just below hero.
- Pills: **Birthday · Anniversary · Graduation · Thank You · Congratulations · Get Well Soon** (use the canonical category list — check `frontend/src/types/card.ts` `CardCategory` to confirm slugs; render the human labels here).
- CSS `@keyframes` infinite scroll, 40s linear, duplicate the list to make it seamless. `prefers-reduced-motion` → static row.
- Each pill: vellum bg, 1px ink border, ink text, rounded-full, px-4 py-2.
- Every 4th pill rotates a tinted background: pop-violet/10, pop-rose/10, pop-electric/20 (low opacity tints — accent only).

#### Section 3 — Mission
- Three short stat/value blocks in a row on vellum (no violet block as in design-2).
- Big number in Cormorant + pop-violet; label in Inter ink-espresso/70.
- Above the row, a small Cormorant section title and an em-dash divider.

#### Section 4 — Showcase
- Three example animated cards in a 3-column grid (1 col mobile).
- Each frame uses `.dashed-border` (ink-espresso) on vellum.
- The **first** card surface is tinted `pop-rose/8` (the "small color-tinted card" pattern). The other two stay vellum.
- Each frame holds a thumbnail (use a static image or a mini live render of one card from the registry — pick whatever's already cheapest).
- Below each: card title (Cormorant) + one-line description (Inter ink/70).

#### Section 5 — Process
- 4-step horizontal "How it works" row (stack on mobile).
- Each step: a circular pop-electric badge with a Cormorant numeral inside, a short title, a one-line description.
- Steps: **Pick a template → Customize → Pay → Send the link**.

#### Section 6 — Pricing
- 4 tier cards in a row (1 col mobile, 2 col tablet, 4 col desktop).
- Read tier data from `backend/giflove/constants.py`'s frontend mirror at `frontend/src/constants.ts` — **never hardcode prices, recipient counts, or expiry days** (CLAUDE.md rule).
- Tier-to-color mapping (the small color-tinted cards):
  - **Free** → vellum bg, 1px ink border, ink text.
  - **Essential** → `pop-rose/10` bg, 1px pop-rose border, ink text, pop-rose CTA.
  - **Premium** → `pop-violet/12` bg, 1px pop-violet border, ink text, pop-violet CTA. **"Most Popular" ribbon** in pop-electric (ink text on yellow) absolutely positioned top-right.
  - **Bulk** → `pop-electric/20` bg, 1px ink border, ink text, ink CTA (yellow + ink reads cleanest).
- Each card lists: tier name (Cormorant), price (large), recipients line, expiry line, 3-5 feature bullets, CTA → `/checkout?tier={slug}`.

#### Section 7 — Vault preview
- A small block (centered, max-w-4xl) showing 3 stacked card thumbnails with `transform: perspective(1000px) rotateY(-8deg)` and slight Y offsets — pure CSS, no library.
- Heading + one-line copy + pop-violet CTA "See your vault" → `/vault` (or `/recipients`, whichever is the existing route).

#### Section 8 — Footer
Handled in `Footer.tsx` (next file).

### 3.4 Footer — `frontend/src/components/ui/Footer.tsx`

- Vellum bg, ink-espresso text, 1px top border in ink/10.
- 3-column grid: Product / Company / Legal (keep current link list).
- Logo (left) + small tagline in Cormorant.
- Link hover → pop-rose.
- Bottom strip: copyright in Inter ink/60.

### 3.5 TierBadge — `frontend/src/components/ui/TierBadge.tsx`

Recolor per the tier mapping above. Replace any `bg-violet-600`/`bg-rose-500` etc. with the new pop tokens.

### 3.6 Other pages — palette propagation only (no structural changes)

For each, swap colors/tokens; do **not** restructure layouts.

| File | Changes |
|---|---|
| `frontend/src/pages/BrowsePage.tsx` | Vellum bg; ink text; filter chip active state = pop-violet bg + vellum text; selected card outline = pop-rose; hover scale unchanged. |
| `frontend/src/pages/EditorPage.tsx` | Vellum bg; ink toolbar; "Save & Continue" CTA = pop-violet; color-preset swatches use raw hex (don't theme them). Keep card preview pane untouched. |
| `frontend/src/pages/CheckoutPage.tsx` | Vellum bg; ink text; "Pay" button = pop-violet; tier banner uses the tier's mapped color at /10 tint. |
| `frontend/src/pages/RecipientsPage.tsx` | Vellum bg; ink; "Add recipient" pill = pop-rose. |
| `frontend/src/pages/ConfirmationPage.tsx` | Vellum bg; large pop-electric celebratory check/burst graphic; ink copy; pop-violet CTA back to home. |
| `frontend/src/pages/CardViewerPage.tsx` | Page chrome only (background + any nav/footer). **Do not touch the card render area.** |

### 3.7 Cleanup sweep

After the above, grep `frontend/src/` for these and replace or remove:
- `rose-500`, `rose-600`, `rose-50`, `rose-100`
- `bg-stone-`, `text-stone-`
- `quicksand`, `Quicksand`
- `#faf8f5`, `#fdfcfb`
- `bg-violet-600`, `bg-amber-` (when used as theme color, not as a deliberate tier mapping)

Skip `frontend/src/components/cards/**` — those palettes are part of each card design.

---

## 4. Critical Files

**To modify:**
- `frontend/src/index.css`
- `frontend/src/components/ui/Navbar.tsx`
- `frontend/src/components/ui/Footer.tsx`
- `frontend/src/components/ui/TierBadge.tsx`
- `frontend/src/pages/HomePage.tsx` (full rebuild)
- `frontend/src/pages/BrowsePage.tsx`
- `frontend/src/pages/EditorPage.tsx`
- `frontend/src/pages/CheckoutPage.tsx`
- `frontend/src/pages/RecipientsPage.tsx`
- `frontend/src/pages/ConfirmationPage.tsx`
- `frontend/src/pages/CardViewerPage.tsx` (page chrome only)

**To read for reference (do not modify):**
- `design-1.html` — section order + content tone for HomePage.
- `design-2(use colors and header only)/src/index.css` — `@theme` block, `.noise-overlay`, `.dashed-border`.
- `design-2(use colors and header only)/src/App.tsx` — Header pattern (lines ~271-290).
- `frontend/src/constants.ts` — tier prices/limits/expiry (read, never duplicate).
- `frontend/src/types/card.ts` — `CardCategory` enum for occasion ribbon labels.

---

## 5. Verification

1. **Type-check**: `cd frontend && npx tsc --noEmit` → zero errors.
2. **Run locally**: `docker compose --env-file .env.local up` (or `cd frontend && npm run dev`), visit `http://localhost:3000`.
3. **HomePage**: 8 sections render in order on vellum; hero typewriter cycles 3 words; occasion ribbon scrolls infinitely; pricing tiers render in their mapped pop colors; "Most Popular" ribbon visible on Premium.
4. **Navbar**: starts transparent over hero; gains blur + border after scrolling 24px+; mobile hamburger opens panel; CREATE button is pop-violet.
5. **Other pages**: click through Browse → Editor → Checkout → Recipients → Confirmation. Vellum bg + ink text everywhere; no orphan rose-500 / stone-700 / Quicksand instances. CTAs use pop-violet.
6. **Card viewer** (`/card/:token` for any test card): page chrome updated; card animation area is byte-identical to before.
7. **Responsive**: resize to 375px width — Navbar collapses, sections stack cleanly, no horizontal overflow.
8. **Reduced motion**: enable `prefers-reduced-motion` in browser → typewriter freezes on first word, ribbon stops scrolling.

---

## 6. Out of Scope (explicit non-goals)

- Card template components (`frontend/src/components/cards/*`) — their internal palettes belong to each card.
- Backend, Django settings, MinIO, Paddle, email templates.
- Tier business rules (prices, limits, expiry) — read from constants only.
- Any new templates, new pages, or new routes.
- A11y audit beyond reduced-motion and basic contrast spot-checks (the new ink-on-vellum and vellum-on-violet combinations are AA-compliant; pop-electric only ever holds ink text, never vellum).
