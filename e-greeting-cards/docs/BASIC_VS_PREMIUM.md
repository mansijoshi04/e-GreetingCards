# Basic vs Premium Cards — Design & Experience Specification

## Philosophy

The goal is not to make basic cards feel cheap and premium cards feel expensive. The goal is to make **both tiers feel genuinely special** — just in different ways.

- **Basic ($3)** = *"I thought of you"* — one beautiful moment. The card opens, it's alive, it feels personal.
- **Premium ($5)** = *"I made this for you"* — a multi-stage experience. You interact, you anticipate, and then the card reveals itself as a payoff.

The key rule: **basic must clear the bar of "worth $3."** The moment basic feels generic, the whole pricing model falls apart.

---

## Why Would Someone Pay $3 at All?

They're paying for:
- The **convenience** of a shareable link (vs texting "happy birthday")
- A **nicer experience** than a free e-card or a plain message
- Animations that make it feel like an occasion
- Not having to design anything themselves

The $3 bar is: **clearly better than a free text message or a generic free e-card site.**

---

## Why Would Someone Pay $5 Instead of $3?

The premium difference is felt by the **recipient**, not just seen. The interaction mechanic — popping balloons, blowing out candles — makes the recipient an **active participant**. They're doing something, not just watching. That moment of "wait, I have to pop these?" followed by the reveal is what makes it feel like unwrapping a gift, not just opening a card.

---

## The Core Distinction

| | Basic $3 | Premium $5 |
|---|---|---|
| **Experience type** | Passive — tap once, card opens | Interactive — multi-stage, earn the reveal |
| **Stage 1** | Front cover with "tap to open" hint | Pre-reveal game (blow candles / pop balloons) |
| **Stage 2** | 3D card flip open | FoldedCard scales in after game completes |
| **Stage 3** | — | Tap cover → 3D card flip open |
| **Inside feel** | Beautiful, alive, personal | Everything in basic + richer inside scene |
| **"Made for you" feel** | Medium | High |

---

## Animation Levels (Defined)

### Level 1 — Static Pretty
Elements just appear with a simple fade. No movement after load. Looks nice, feels like a webpage. **Not acceptable for either tier.**

### Level 2 — Alive (Basic floor)
Elements animate in sequentially. Something is always subtly moving inside the card (flickering candles, floating balloons, drifting hearts). Card feels like it's breathing. **This is the minimum for basic.**

### Level 3 — Interactive (Premium floor)
Recipient must do something to reveal the card. The act of interacting creates anticipation. The reveal moment has a payoff (confetti, dramatic entrance, inside decorations animating in). **This is the minimum for premium.**

### Level 4 — Cinematic (Future)
Multi-scene experience. Sound + visuals timed together. Feels like a short film made for you. Future phase.

---

## Feature Comparison

| Feature | Basic $3 | Premium $5 |
|---|---|---|
| **Opening mechanic** | Tap front cover once → 3D flip | Pre-reveal game → FoldedCard scales in → tap → 3D flip |
| **Pre-reveal game** | None | Blow candles (cake) / Pop balloons (balloon/confetti) |
| **3D card flip** | Yes | Yes |
| **Typewriter effect** | Yes — body text types out character by character | No (card appears after game; typewriter would feel slow) |
| **Inside decorations** | Themed per category (candles / bouquet / balloons / sparkles / leaf) | Same + richer scene (more elements, more animation) |
| **Confetti on reveal** | Yes — standard burst | Yes — themed shapes (hearts, petals, stars, confetti) |
| **Cover photo** | Curated Unsplash photo per template | Same (sender photo upload — future feature) |
| **Sound** | None | Future: timed chime/pop effects |
| **Customization** | Text only (headline, body, signature) | Text + accent color (future) |
| **Recipient name** | "Dear [name]," shown inside | Same |

---

## The FoldedCard Experience (Both Tiers)

Both tiers share the same `FoldedCard` component as the final reveal. This is what makes both feel like a real physical greeting card.

### Front Cover
- Beautiful full-bleed cover photo (Unsplash, curated per template)
- Subtle gradient overlay at bottom (text legibility)
- Animated chevron pulse in bottom-right corner: "tap to open" hint
- 3D perspective container (`perspective: 2000px`)

### The Flip
- `rotateY(-160deg)` on tap — front cover folds back like a real book
- `transform-style: preserve-3d`, `origin-left`
- 1.5s easeInOut transition
- Back of front cover visible briefly (stone-100 background with faint heart watermark)

### Inside Right Page
- Soft gradient background per category:
  - Birthday: `white → rose-50`
  - Anniversary: `#fff0f5 → #ffd6e7`
  - Graduation: `#f0f4f8 → #e8f0f8`
  - Thank You: `#f5f8f0 → #edf5e8`
- Content appears sequentially after flip completes:
  1. **Recipient greeting** — "Dear [name]," italic, stone-400, Quicksand font (0.8s delay)
  2. **Headline** — large, Dancing Script, themed color (0.6s delay, spring physics)
  3. **Body** — Quicksand bold, stone-700 (0.8s delay — or typewriter for basic)
  4. **Signature** — italic, stone-400, right-aligned, with top border divider
- Inside decorations animate in behind the text (z-0)

### Inside Decorations (Per Theme/Category)

| Theme / Category | Inside Decoration |
|---|---|
| `balloon-party`, `confetti-burst` | 4 watercolor balloons float up from bottom with wavy SVG string paths and bow knots, gentle sway animation |
| `cake-celebration`, birthday | 6 birthday candles at bottom, alternating pink/blue, flickering orange flame with glow effect |
| `rose-petals`, `heart-float`, anniversary | 7-stem heart bouquet, fan arrangement, hearts pulse and sway on stems |
| `diploma-scroll`, `achievement`, graduation | 6 gold star sparkles scatter across the card, scale in with stagger |
| `simple-thanks`, thankYou | Delicate leaf/botanical SVG arc at bottom, fades in softly |

### Confetti
- Triggers 600ms after tap (basic) or after game completes (premium)
- Themed shapes per category:
  - Anniversary → rose petals (lower gravity, more drift)
  - Graduation → gold stars
  - Heart-float theme → hearts
  - Birthday / default → square confetti
- Premium uses 250 pieces, basic uses 200
- Category-specific color palettes

---

## Premium Pre-Reveal Games

### Blow Candles (cake-celebration)

**Screen:** Rose-50 gradient background. Animated 3-tier birthday cake:
- Top tier: pink sponge with rainbow sprinkles and frosting drips
- Bottom tier: wider layer, same style
- Stone plate at base
- 3 candles on top with flickering animated flames (orange glow, blur)

**Interaction:**
1. "Make a Wish & Blow!" button appears (Quicksand font, rose-500, white background, rounded pill)
2. User clicks → cake shakes with x-axis animation
3. Candle flames disappear (scale 0, opacity 0)
4. Smoke puffs animate upward (blur, opacity fade, scale out, x drift)
5. "Puff... your wish is coming true!" appears in serif italic
6. After 2.5s → card exit animation (scale down + fade up) → FoldedCard scales in

### Pop Balloons (balloon-party, confetti-burst)

**Screen:** Sky-blue gradient. 7 floating balloons scattered across screen:
- Balloons: emoji 🎈 🎊 🎁 ✨ 💖 ⭐ 🌈
- Each balloon bobs up/down and sways side-to-side continuously
- Spread at different heights and horizontal positions

**Interaction:**
1. Counter shown: "Pop 4 more balloons to reveal..."
2. User taps a balloon → pop animation (scale 1→1.6→0, rotate, opacity 0, 0.35s)
3. Counter decrements on each pop
4. After 4 popped → "Yay! Here it comes..." → FoldedCard scales in (spring physics, 0.9s delay)

---

## Typewriter Effect (Basic Only)

- Applies to **body text only** (headline fades in, signature fades in after typewriter completes)
- Character-by-character reveal using `setInterval` at 30ms per character
- Blinking cursor shown while typing (animated opacity 1→0, 0.5s repeat)
- Cursor disappears when typing complete
- Starts at 1.2s delay after card flip begins
- Signature appears after: `1.2s + (bodyText.length * 0.03s)` delay

---

## Cover Images (Per Template)

All covers are Unsplash photos, portrait orientation (600×800), with a subtle dark gradient overlay at the bottom.

| Template | Cover Photo Style |
|---|---|
| `balloon-party` | Bright colorful party balloons |
| `confetti-burst` | Colorful confetti shower |
| `diploma-scroll` | Graduation/academic setting |
| `simple-thanks` | Soft botanical / flowers |
| `achievement` | Gold trophy / achievement |
| `rose-petals` | Red roses close-up |
| `cake-celebration` | Candlelit birthday cake |
| `heart-float` | Soft pink bokeh / hearts |
| `cap-toss` | Graduation cap toss celebration |

---

## What Is NOT Different Between Tiers

- The FoldedCard component itself — both tiers use the same 3D flip
- Inside decorations quality — same animation quality, same themed elements
- Confetti — both get confetti, premium just gets slightly more pieces
- Cover photo quality — both use the same Unsplash photos

The only things that are premium-exclusive right now:
1. The pre-reveal interaction game
2. (Future) Sender photo upload on cover
3. (Future) Sound effects timed to interaction
4. (Future) Color palette customization

---

## Future Premium Differentiators (Not Yet Built)

| Feature | Description |
|---|---|
| **Sender photo on cover** | Sender uploads their own photo — replaces stock cover image. Makes it unmistakably personal. |
| **Sound effects** | Timed chime/pop sounds during balloon pop and candle blow. Mute/unmute toggle. |
| **Color palette picker** | 3-4 preset color swatches that change accent colors on inside content |
| **Multi-page experience** | Left page = photo/media, right page = message. Scroll through pages. |
| **Name entry unlock** | Recipient types their name to unlock the card — makes it feel gated and exclusive |
| **Shake to reveal** | Mobile shake gesture triggers the reveal |
| **Countdown timer** | Card shows a countdown before it can be opened — builds anticipation |

---

## Technical Implementation

| Component | Purpose |
|---|---|
| `FoldedCard.tsx` | Core 3D flip card — shared by both tiers |
| `BasicCardExperience.tsx` | Basic tier wrapper — assigns cover image, enables typewriter |
| `PremiumCardExperience.tsx` | Premium tier — runs pre-reveal game, then shows FoldedCard |
| `coverImages.ts` | Shared map of Unsplash cover URLs per template slug |
| `CardRenderer.tsx` | Routes to Basic or Premium based on `tier` + `visualTheme` |
| `ConfettiLayer.tsx` | Themed confetti — shapes and colors vary by category/theme |

**Routing logic in CardRenderer:**
- `tier === 'premium'` AND theme in `[cake-celebration, balloon-party, confetti-burst, rose-petals, heart-float, cap-toss]` → `PremiumCardExperience`
- Everything else → `BasicCardExperience`
