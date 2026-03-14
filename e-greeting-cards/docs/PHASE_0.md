# Phase 0: Foundation Setup

**Status**: ✅ Complete
**Completed**: March 8, 2026

---

## What Was Built

### Project Scaffolding
- Next.js 15 with App Router + TypeScript (strict mode)
- Tailwind CSS with custom color themes (birthday, anniversary, graduation, thankYou palettes)
- PostCSS pipeline
- Complete folder structure for all phases

### Database & Caching
- **Prisma ORM** with PostgreSQL provider
- **4-table schema**: `templates`, `cards`, `recipients`, `card_opens`
- **Redis** via `ioredis` for link expiry management
- **Seed file** with 3 initial templates (Balloon Party / Birthday, Rose Petals / Anniversary, Diploma Scroll / Graduation)

### Docker Stack
- `Dockerfile` — multi-stage production build, `--omit=optional` to skip broken `sharp` native binaries
- `docker-compose.yml` — PostgreSQL 16, Redis 7, Next.js app with health checks
- App container auto-runs `prisma migrate deploy` + `prisma db seed` on startup
- `.dockerignore` — excludes `node_modules` and `package-lock.json` so Docker does a fresh `npm install`

### Application Code
- `app/layout.tsx` — root layout, Google Fonts (Poppins, Inter, Dancing Script, Cormorant Garamond), SEO metadata
- `app/page.tsx` — landing page (hero, tier cards, features, footer)
- `app/globals.css` — Tailwind base styles
- `lib/db/prisma.ts` — Prisma singleton
- `lib/db/redis.ts` — Redis singleton with connection logging

### Configuration Files
- `tsconfig.json` — strict mode, path alias `@/`
- `tailwind.config.ts` — custom colors, `font-headline`/`font-body`/`font-signature` utilities
- `.env.example` — template for all required environment variables

---

## Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| **ORM** | Prisma | Type-safe queries, auto-generated client, easy migrations |
| **Cache** | Redis (ioredis) | O(1) lookups, built-in TTL for 7-day link expiry |
| **Containerisation** | Docker Compose | Reproducible dev environment; Vercel for prod |
| **CSS** | Tailwind | Rapid styling, responsive utilities, custom theme tokens |
| **Font loading** | `next/font/google` | Zero-CLS, self-hosted at edge |

---

## Database Schema

```sql
templates   — pre-designed card layouts (designConfig JSONB)
cards       — user-created cards (linkToken, expiresAt, isPaid)
recipients  — per-card email list with tracking timestamps
card_opens  — analytics (device, IP, referrer, opened_at)
```

---

## Development Commands

```bash
# Start full stack (migrations + seed run automatically)
docker compose up

# Full reset (clears all data, rebuilds image)
docker compose down -v && docker compose build --no-cache && docker compose up

# Prisma Studio (DB UI)
docker compose exec app npx prisma studio

# App logs
docker compose logs -f app
```

---

## Environment Variables

```bash
DATABASE_URL=postgresql://greeting_user:greeting_password@postgres:5432/greeting_cards
REDIS_URL=redis://redis:6379
BASE_URL=http://localhost:3000
NODE_ENV=development
```

> **Note**: Prisma CLI reads `.env`, Next.js reads `.env.local`. Keep `DATABASE_URL` in both.

---

## Lessons Learned

- `sharp` npm package has broken optional binary packages — fixed with `"overrides": { "sharp": "0.32.6" }` in `package.json` and `--omit=optional` in Dockerfile.
- Local npm@11 vs Docker npm@10 causes lock file conflicts — excluded `package-lock.json` from Docker via `.dockerignore`; Docker runs a fresh `npm install`.
- Run `npx prisma generate` **after** `COPY . .` in Dockerfile so the schema is present when the client is generated.
