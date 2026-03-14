# Phase 2: Card Creation & Customisation

**Status**: ✅ Complete
**Completed**: March 8, 2026

---

## What Was Built

### Template Gallery (`app/create/page.tsx`)
- Fetches templates from `GET /api/templates`
- Filter by tier (Basic / Premium) and category (birthday, anniversary, graduation)
- Template cards with hover overlay showing name, price, and "Customise" CTA

### Card Editor (`app/create/[templateId]/page.tsx`)
- Fetches single template from `GET /api/templates/[templateId]`
- Two-column layout: left customisation panel + right live preview
- Persists draft state to `sessionStorage` for multi-step flow
- Passes data to Recipients page via `sessionStorage`

### Customisation Panel (`components/editor/CustomizationPanel.tsx`)
- Headline, body, signature text inputs
- Font size slider (14–32px)
- Text colour picker (4 preset swatches per category)
- Background theme selector (4 palette options per category)
- Live preview updates in < 100ms via controlled state

### Preview Pane (`components/editor/PreviewPane.tsx`)
- Wraps `CardPreview` component
- Shows real card rendering (same CSS classes used in card viewer)
- Responsive preview frame

### Card Preview (`components/editor/CardPreview.tsx`)
- Renders `designConfig` elements using the same logic as `CardContent`
- Merges `customText` overrides over template defaults
- Applies `customStyling` colour/font overrides

### Recipients Page (`app/recipients/page.tsx`)
- Sender name (required) + email (optional)
- Up to 15 recipient email inputs with add/remove controls
- Real-time email format validation
- Saves complete card data + recipients to `sessionStorage` on "Continue"

### Template APIs
- `GET /api/templates` — lists all active templates
- `GET /api/templates/[templateId]` — returns single template with full `designConfig`

### Template Service (`lib/services/templateService.ts`)
- `getTemplates(filters?)` — filter by category, tier, isActive
- `getTemplate(id)` — single template fetch

---

## Data Flow (Multi-Step Form)

```
/create                   (choose template)
  → sessionStorage: { templateId, templateData }

/create/[templateId]      (customise)
  → sessionStorage: { ..., customText, customStyling }

/recipients               (add recipients)
  → sessionStorage: { ..., senderName, senderEmail, recipients[] }

/checkout                 (review + pay)
  → reads sessionStorage, calls POST /api/payment/create-session
```

---

## Design System

### Colour Palettes (per occasion)
```typescript
birthday:    primary #FF6B9D, secondary #FFE66D, accent #4ECDC4
anniversary: primary #C84B6E, secondary #FFB6C1, accent #D4AF37
graduation:  primary #2E5090, secondary #FFD700, accent #00A8E8
```

### Typography Utilities (tailwind.config.ts)
- `font-headline` → Poppins
- `font-body` → Inter
- `font-signature` → Dancing Script

---

## Lessons Learned

- **Next.js 15 `params` as Promise**: In server components, `params` is now `Promise<{templateId: string}>` — must `await params` before using. In client components, use `React.use(params)`.
- **designConfig parsing**: `designConfig` comes back from Prisma as a string (JSONB serialised). Always parse with `JSON.parse()` before accessing properties. Pattern used across editor and gallery components.
- **sessionStorage for multi-step forms**: Simpler than URL params or global state for a linear 3-step flow. Cleared after payment succeeds.

---

## Files Created

```
app/create/page.tsx
app/create/[templateId]/page.tsx
app/recipients/page.tsx
app/api/templates/route.ts
app/api/templates/[templateId]/route.ts
components/editor/CustomizationPanel.tsx
components/editor/PreviewPane.tsx
components/editor/CardPreview.tsx
components/templates/TemplateGallery.tsx
components/templates/TemplateCard.tsx
lib/services/templateService.ts
```
