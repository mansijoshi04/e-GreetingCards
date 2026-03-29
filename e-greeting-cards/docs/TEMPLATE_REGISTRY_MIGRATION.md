# Template Registry Migration Plan

## Why We're Doing This

Templates currently live in two places:
1. **Database** — metadata + designConfig JSON (queried on every page load)
2. **Codebase** — theme React components (`BalloonParty.tsx`, `RosePetals.tsx` etc.)

Every new template already requires a code change (new theme component + THEMES map entry). The DB is just extra overhead with no benefit. At 100+ templates this becomes painful — a massive seed file, upsert logic on every addition, and a DB failure breaks the template gallery entirely.

**After this migration:**
- Templates live in a single TypeScript registry file
- Zero DB queries for template data — in-memory lookups
- DB goes down → template gallery still works
- Adding a template = add theme component + add registry entry (no seeding, no upserts)
- DB keeps doing what it's good at: user cards, recipients, analytics

---

## Current Architecture

```
Browser → GET /api/templates → templateService.ts → prisma.template.findMany() → DB
Browser → GET /card/[token] → linkService.ts → prisma.card.findUnique({ include: { template: true } }) → DB
```

Visual theme components are already hardcoded:
- `components/cards/themes/*.tsx` — BalloonParty, RosePetals, DiplomaScroll, etc.
- `components/cards/CardDecorations.tsx` — THEMES map: `{ 'balloon-party': BalloonParty, ... }`

---

## Target Architecture

```
Browser → GET /api/templates → templateService.ts → registry.getAllTemplates() → in-memory
Browser → GET /card/[token] → linkService.ts → prisma.card.findUnique() + registry.getTemplateById(card.templateId)
```

---

## Implementation Steps

### Step 1 — Create `lib/templates/types.ts`
Define `StaticTemplate` interface to replace the Prisma-generated `Template` type:
```ts
export interface StaticTemplate {
  id: string           // slug e.g. 'balloon-party'
  name: string
  category: string
  tier: string
  priceCents: number
  thumbnailUrl: string
  designConfig: string // JSON string
  isActive: boolean
  createdAt: Date      // static date, for interface compatibility
}
```

### Step 2 — Create `lib/templates/registry.ts`
- Export `TEMPLATES: StaticTemplate[]` — copy designConfig from `prisma/seed.ts`, use slug IDs:

| Template name | Registry ID |
|---|---|
| Balloon Party | `balloon-party` |
| Rose Petals | `rose-petals` |
| Diploma Scroll | `diploma-scroll` |
| Confetti Burst | `confetti-burst` |
| Simple Thanks | `simple-thanks` |
| Achievement | `achievement` |
| Cake Celebration | `cake-celebration` |
| Heart Float | `heart-float` |
| Cap Toss | `cap-toss` |

- Export helper functions (synchronous):
  - `getTemplateById(id)`
  - `getAllTemplates()`
  - `getTemplatesByCategory(category)`
  - `getTemplatesGrouped()`
  - `getCategories()`
  - `getTemplateCounts()`

### Step 3 — Rewrite `lib/services/templateService.ts`
- Replace all `prisma.template.*` calls with registry function calls
- Same function signatures — all callers unchanged
- Replace `import { Template } from '@prisma/client'` → `import type { StaticTemplate } from '@/lib/templates/types'`

### Step 4 — Fix Template type imports in 7 files
Replace `Template` from `@prisma/client` → `StaticTemplate` from `@/lib/templates/types` in:
- `components/cards/CardRenderer.tsx`
- `components/editor/CardPreview.tsx`
- `components/editor/CustomizationPanel.tsx`
- `components/editor/PreviewPane.tsx`
- `components/templates/TemplateCard.tsx`
- `components/templates/TemplateGallery.tsx`
- `app/create/[templateId]/page.tsx`

### Step 5 — Fix Prisma queries that join template
Remove `include: { template: true }` and replace with registry lookup in:
- `lib/services/linkService.ts` → `fetchCardData()`
- `lib/services/cardService.ts` → `getCard()`
- `app/api/cards/[cardId]/route.ts`

Pattern for each:
```ts
// Before
const card = await prisma.card.findUnique({ where: { id }, include: { template: true } })

// After
const card = await prisma.card.findUnique({ where: { id } })
const template = card ? getTemplateById(card.templateId) : null
// attach: return { ...card, template }
```

If template not found → return graceful fallback, not a crash.

### Step 6 — Prisma schema surgery
**`prisma/schema.prisma`:**
- Remove `Template` model entirely
- Remove `template Template @relation(...)` field from `Card` model
- Keep `templateId String @map("template_id")` as plain string (no FK)

### Step 7 — DB migration (two-step, order matters)

**Step 7a — Backfill template IDs FIRST (while templates table still exists)**

Write `prisma/scripts/migrate-template-ids.ts`:
```
For each template in DB:
  - Get its current UUID and name
  - Map name → slug (e.g. "Balloon Party" → "balloon-party")
  - UPDATE cards SET template_id = '<slug>' WHERE template_id = '<uuid>'
```

Run on VPS:
```bash
docker compose -f docker-compose.prod.yml exec app npx ts-node prisma/scripts/migrate-template-ids.ts
```

**Step 7b — Drop FK and templates table**

Create Prisma migration:
```sql
ALTER TABLE "cards" DROP CONSTRAINT "cards_template_id_fkey";
DROP TABLE "templates";
```

Run `npx prisma generate` after to regenerate client.

### Step 8 — Cleanup
- Delete `prisma/seed.ts`
- Delete `tsconfig.seed.json`
- Remove `"db:seed"` script from `package.json`
- Remove `"prisma": { "seed": "..." }` from `package.json`
- No changes needed to `GET /api/templates` or `GET /api/templates/[templateId]` routes

---

## Verification Checklist
- [ ] `npm run build` passes with no type errors
- [ ] `npm run lint` passes
- [ ] Template gallery loads at `/create`
- [ ] Card customization works at `/create/[templateId]`
- [ ] Existing card links still render at `/card/[linkToken]`
- [ ] Prisma Studio confirms `templates` table is gone
- [ ] `cards.template_id` shows slug values (not UUIDs)
- [ ] Stop DB container → template gallery still loads (served from registry)
