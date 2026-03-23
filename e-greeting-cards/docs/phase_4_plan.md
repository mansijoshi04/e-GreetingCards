# Phase 4 Plan: Resend + VPS Deployment + CI/CD + staging.giflove.ca

## Context
The app's E2E flow works locally via Docker. This phase ships it to the real internet using the existing VPS (Docker + Nginx already installed, mansijoshi.ca + 2 other apps running there).

**No Vercel, No Neon, No Upstash** — the VPS runs the full Docker Compose stack (Postgres + Redis + app) the same way as local dev.

---

## What Changes vs Local Dev

| Local | VPS (staging/prod) |
|-------|--------------------|
| `docker-compose.yml` (dev server, hot reload) | `docker-compose.prod.yml` (Dockerfile build, `npm start`) |
| `prisma db push` | `prisma migrate deploy` (runs on container start) |
| `localhost:3000` | Nginx proxies domain → container port |
| `.env.local` | `.env` on VPS (never committed) |

---

## VPS Directory Structure

Two separate clones of the repo:

```
~/apps/
  giflove-staging/        ← staging branch, port 3040
    e-greeting-cards/
      .env                ← staging env vars (created manually, never committed)
  giflove-production/     ← main branch, port 3050 (set up when ready for prod)
    e-greeting-cards/
      .env                ← production env vars (created manually, never committed)
```

> Ports follow the VPS 30xx convention (3020/3030 = RK, 3040/3050 = GifLove).
> Postgres + Redis are Docker-internal only — no host ports exposed.

---

## Files Created / Modified

| File | Status | Notes |
|------|--------|-------|
| `docker-compose.prod.yml` | Created | Production compose — Dockerfile build, `npm start`, migrations on startup |
| `.github/workflows/ci.yml` | Created | Lint + build quality gate on PRs |
| `.github/workflows/deploy-staging.yml` | Created | SSH deploy on push to `staging` branch |
| `.github/workflows/deploy-production.yml` | Created | SSH deploy on push to `main` branch |
| `lib/services/emailService.ts` | Updated | Resend provider added; Mailgun commented out |
| `.env.example` | Updated | Resend vars; removed SendGrid; added `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` |

---

## Part 1 — Resend Email Setup (manual)

1. Create account at **resend.com** (free, no credit card)
2. Go to **Domains → Add Domain** → enter `giflove.ca`
3. Add DNS records in GoDaddy:

| Type | Name | Value |
|------|------|-------|
| TXT | `resend._domainkey` | DKIM key from Resend |
| TXT | `@` | SPF value from Resend |

> GoDaddy auto-appends the root domain — enter just the subdomain part in the Name field (e.g. `resend._domainkey`, not `resend._domainkey.giflove.ca`)

4. Click Verify in Resend (usually under 10 min)
5. **API Keys → Create API Key** → name: `giflove-production` → copy immediately

**Env vars:**
```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
EMAIL_FROM=cards@giflove.ca
```

---

## Part 2 — DNS for staging.giflove.ca (GoDaddy)

Add one A record pointing to your VPS IP:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `staging` | `<VPS IP>` | 1 Hour |

Same IP as mansijoshi.ca.

---

## Part 3 — VPS Setup for Staging (one-time, manual)

SSH into the VPS:

```bash
mkdir -p ~/apps/giflove-staging
cd ~/apps/giflove-staging
git clone -b staging https://github.com/mansijoshi04/e-GreetingCards.git .
cd e-greeting-cards
nano .env   # paste staging env vars below
```

**`.env` contents for staging:**
```
POSTGRES_USER=greeting_user
POSTGRES_PASSWORD=<strong random password>
POSTGRES_DB=greeting_cards_staging
APP_PORT=3040

BASE_URL=https://staging.giflove.ca
NODE_ENV=production

PADDLE_API_KEY=test_<sandbox key>
PADDLE_WEBHOOK_SECRET=ntf_<sandbox webhook secret>
PADDLE_ENVIRONMENT=sandbox
PADDLE_BASIC_PRICE_ID=pri_<sandbox>
PADDLE_PREMIUM_PRICE_ID=pri_<sandbox>
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=<sandbox client token>

EMAIL_PROVIDER=resend
RESEND_API_KEY=re_<api key>
EMAIL_FROM=cards@giflove.ca
```

**Start the stack:**
```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps       # should show 3 containers running
docker compose -f docker-compose.prod.yml logs app  # check for errors
```

---

## Part 4 — Nginx Config for staging.giflove.ca

Create `/etc/nginx/sites-available/staging.giflove.ca`:

```nginx
server {
    server_name staging.giflove.ca;

    location / {
        proxy_pass http://localhost:3040;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/staging.giflove.ca /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
certbot --nginx -d staging.giflove.ca   # Certbot already installed from mansijoshi.ca
```

---

## Part 5 — GitHub Actions CI/CD

### GitHub Secrets (repo → Settings → Secrets → Actions)

| Secret | Value |
|--------|-------|
| `VPS_HOST` | VPS IP address |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | Private key content (starts with `-----BEGIN...`) |

To get the SSH key value: run `cat ~/.ssh/id_rsa` on the VPS (or generate a dedicated deploy key).

### How it works
- **Any PR** to `staging` or `main` → `ci.yml` runs lint + build (quality gate)
- **Push to `staging`** → `deploy-staging.yml` SSHs into VPS, `git pull`, rebuilds Docker
- **Push to `main`** → `deploy-production.yml` SSHs into VPS, `git pull`, rebuilds Docker

---

## Branch Model

```
main ──────────── production (giflove.ca, port 3050)
  ↑
staging ────────── staging.giflove.ca (port 3040)
  ↑
feature/* ──────── local only
```

Flow: feature branch → PR to `staging` → merge → auto-deploys to staging → test → PR to `main` → merge → auto-deploys to production

---

## Order of Operations

| Step | What | Where |
|------|------|-------|
| 1 | Create `staging` branch, push code to GitHub | terminal |
| 2 | Create Resend account, add domain `giflove.ca` | resend.com |
| 3 | Add Resend DNS records in GoDaddy | GoDaddy DNS |
| 4 | Add A record `staging` → VPS IP in GoDaddy | GoDaddy DNS |
| 5 | Verify Resend domain, copy API key | Resend dashboard |
| 6 | SSH into VPS, clone repo, create `.env` | VPS terminal |
| 7 | Run `docker compose -f docker-compose.prod.yml up -d --build` | VPS terminal |
| 8 | Add Nginx config, enable site, reload, run Certbot | VPS terminal |
| 9 | Add GitHub secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` | GitHub settings |
| 10 | Push a commit to `staging` → verify Actions deploy runs | GitHub |
| 11 | Verify `https://staging.giflove.ca` loads | browser |
| 12 | Register Paddle sandbox webhook for `https://staging.giflove.ca/api/payment/webhook` | Paddle sandbox |
| 13 | Full E2E test (create card → pay → email → view card) | browser |

---

## Gotchas

| Risk | Fix |
|------|-----|
| `prisma migrate deploy` fails on first start | Postgres healthcheck in compose ensures DB is ready before app starts |
| Port conflict on VPS | Check with `ss -tlnp \| grep 3040`; 3040/3050 are reserved for GifLove per port map |
| Nginx conflicts with existing sites | Run `nginx -t` before reload; check `/etc/nginx/sites-enabled/` |
| GitHub Actions SSH key format | Must be raw private key content starting with `-----BEGIN...` |
| `git pull` fails on VPS due to local changes | `.env` must not be committed — verify it's in `.gitignore` |
| Resend DKIM name in GoDaddy | Enter just `resend._domainkey`, GoDaddy appends `.giflove.ca` automatically |

---

## Verification (E2E Test on Staging)

1. `https://staging.giflove.ca` loads the homepage
2. Pick a template → customize → add a recipient email → pay
3. Paddle sandbox checkout completes (test card `4242 4242 4242 4242`)
4. Confirmation page shows shareable link
5. Resend dashboard → Emails → shows "Delivered"
6. Recipient email arrives in inbox (not spam)
7. Card link opens → animation plays
8. Push a new commit to `staging` → GitHub Actions runs → new version deploys automatically
