# Production Deployment Guide — giflove.ca

## Overview

Production runs on the same Hostinger VPS as staging, on a separate port:

| Environment | Branch | Port | URL |
|-------------|--------|------|-----|
| Staging | `staging` | 3040 | staging.giflove.ca |
| Production | `main` | 3050 | giflove.ca |

CI/CD handles all deploys after the one-time VPS setup below. Merging to `main` triggers `deploy-production.yml` automatically.

---

## Step 1 — Get Paddle Production Credentials

1. Log into [vendors.paddle.com](https://vendors.paddle.com)
2. Make sure you are in **Live** mode (toggle at the top — not Sandbox)
3. **API Key**: Developer Tools → Authentication → Generate API Key
   - Copy the key starting with `pdl_live_apikey_...`
4. **Client Token**: Developer Tools → Authentication → Client-side token
   - Copy the token starting with `live_...`
5. **Price IDs**: Catalog → Products → find your Basic and Premium products
   - Click each product → copy the Price ID (`pri_live_...`)
6. **Webhook Secret**:
   - Developer Tools → Notifications → Add notification
   - URL: `https://giflove.ca/api/payment/webhook`
   - Events: select `transaction.completed`
   - Save → copy the secret starting with `ntf_live_...`
7. **Approved Domain**: Developer Tools → Approved Domains → Add `giflove.ca`

---

## Step 2 — Set Up GitHub Secrets for Production

The staging and production workflows share the same secrets (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`) since they deploy to the same VPS as the same user. No new secrets needed — they are already set.

---

## Step 3 — VPS: Clone the repo for production

SSH into the VPS as `mjoshi`:

```bash
ssh mjoshi@147.79.78.1
```

Clone the repo on the `main` branch:

```bash
mkdir -p ~/apps/giflove-production
cd ~/apps/giflove-production
git clone -b main https://github.com/mansijoshi04/e-GreetingCards.git
```

This clones as `e-GreetingCards/` (matches GitHub repo name). Confirm structure:

```bash
ls ~/apps/giflove-production/e-GreetingCards/e-greeting-cards/docker-compose.prod.yml
```

---

## Step 4 — VPS: Create the .env file

```bash
nano ~/apps/giflove-production/e-GreetingCards/e-greeting-cards/.env
```

Paste the following, filling in your **live** Paddle credentials from Step 1:

```env
# App
BASE_URL=https://giflove.ca
NODE_ENV=production
APP_PORT=3050
COMPOSE_PROJECT_NAME=giflove-production

# Database
DATABASE_URL=postgresql://greeting_user:greeting_password@postgres:5432/greeting_cards_prod

# Redis
REDIS_URL=redis://redis:6379

# Paddle (LIVE credentials — not sandbox)
PADDLE_API_KEY=pdl_live_apikey_...
PADDLE_WEBHOOK_SECRET=ntf_live_...
PADDLE_ENVIRONMENT=production
PADDLE_BASIC_PRICE_ID=pri_live_...
PADDLE_PREMIUM_PRICE_ID=pri_live_...
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_...

# Email
EMAIL_PROVIDER=resend
EMAIL_FROM=cards@giflove.ca
RESEND_API_KEY=re_...
```

> **Important:** `PADDLE_ENVIRONMENT=production` (not `sandbox`). Using sandbox keys on production will silently fail.

---

## Step 5 — VPS: Set port and project name in .env

The port and container names are driven by `.env` — no editing of `docker-compose.prod.yml` needed.

The `.env` you created in Step 4 must include these two lines:

```env
APP_PORT=3050
COMPOSE_PROJECT_NAME=giflove-production
```

`APP_PORT=3050` tells Docker to bind the app to port 3050 (staging uses 3040).
`COMPOSE_PROJECT_NAME` namespaces all container and volume names so they don't conflict with staging containers.

Make sure staging's `.env` on the VPS also has:
```env
APP_PORT=3040
COMPOSE_PROJECT_NAME=giflove-staging
```

---

## Step 6 — VPS: Set up Nginx for giflove.ca (one-time)

```bash
sudo cp ~/apps/giflove-production/e-GreetingCards/e-greeting-cards/nginx/giflove.ca /etc/nginx/sites-available/giflove.ca
sudo ln -s /etc/nginx/sites-available/giflove.ca /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Then run Certbot to get SSL:

```bash
sudo certbot --nginx -d giflove.ca -d www.giflove.ca
```

After Certbot runs, verify:

```bash
sudo nginx -t
```

> Certbot will rewrite `sites-available/giflove.ca` with SSL config. Never edit this file manually after this point — Certbot manages it.

---

## Step 7 — VPS: First deploy (manual)

```bash
cd ~/apps/giflove-production/e-GreetingCards/e-greeting-cards
docker compose -f docker-compose.prod.yml up -d --build
```

Check containers are running:

```bash
docker compose -f docker-compose.prod.yml ps
```

All three (app, postgres, redis) should show `Up`.

Check logs for errors:

```bash
docker compose -f docker-compose.prod.yml logs app --tail=50
```

---

## Step 8 — Verify end-to-end

1. Visit **https://giflove.ca** — site should load
2. Create a card → go through the full flow → Paddle live checkout should appear
3. Complete a test purchase (use a real card — this is live mode)
4. Confirm email is received via Resend
5. Open the card link

---

## Step 9 — CI/CD takes over

From this point, every merge to `main` triggers `deploy-production.yml` automatically:

```
git checkout main
git merge staging
git push origin main
```

GitHub Actions will SSH in, pull, rebuild, and restart the container.

---

## Ongoing

**Check production logs:**
```bash
cd ~/apps/giflove-production/e-GreetingCards/e-greeting-cards
docker compose -f docker-compose.prod.yml logs app --tail=50
```

**Restart without rebuild:**
```bash
docker compose -f docker-compose.prod.yml restart app
```

**Rebuild after code change (normally done by CI/CD):**
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**Run a database migration manually:**
```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

---

## Checklist

### One-Time VPS Setup
- [ ] Repo cloned at `~/apps/giflove-production/e-greeting-cards/` on `main` branch
- [ ] `.env` created with live Paddle credentials and `BASE_URL=https://giflove.ca`
- [ ] Port changed to `3050` in `docker-compose.prod.yml` on VPS
- [ ] Container names updated to avoid conflict with staging
- [ ] `sites-available/giflove.ca` set up and symlinked
- [ ] Certbot SSL configured for `giflove.ca` and `www.giflove.ca`
- [ ] `docker compose up -d --build` run manually — all 3 containers running
- [ ] https://giflove.ca loads

### Paddle Live Setup
- [ ] Live API key added to `.env`
- [ ] Live client token added to `.env`
- [ ] Live Basic price ID added to `.env`
- [ ] Live Premium price ID added to `.env`
- [ ] Webhook set up pointing to `https://giflove.ca/api/payment/webhook`
- [ ] Webhook secret added to `.env`
- [ ] `giflove.ca` added to Paddle approved domains

### Verification
- [ ] Full purchase flow tested with real card
- [ ] Email received after purchase
- [ ] Card viewable at link
- [ ] CI/CD deploy triggered by merge to `main` and completed successfully
