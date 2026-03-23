# Staging & Production Deployment Guide — Hostinger VPS

## Overview

Both staging and production run on the same VPS using Docker Compose. Each environment is an independent clone of the repo with its own containers, database, and `.env` file. Nginx proxies each domain to the correct container port.

| Environment | Domain | VPS Port | Branch |
|-------------|--------|----------|--------|
| Staging | `staging.giflove.ca` | `3040` | `staging` |
| Production | `giflove.ca` | `3050` | `main` |

Postgres and Redis for each environment run inside their own Docker network — no host ports exposed.

---

## Prerequisites

Before starting, confirm the following are true:

- [ ] You have SSH access to the VPS (`ssh user@147.79.78.1`)
- [ ] Docker is installed on the VPS (`docker --version`)
- [ ] Docker Compose v2 is installed (`docker compose version`)
- [ ] Nginx is installed and running (`sudo nginx -t`)
- [ ] Certbot is installed (`certbot --version`) — already present from mansijoshi.ca
- [ ] DNS records are in place (see `docs/DNS_SETUP.md`)
- [ ] You have your Paddle sandbox credentials (API key, webhook secret, price IDs, client token)
- [ ] You have your Resend API key

---

## Part A — Staging Deployment

### A1 — SSH into the VPS

```bash
ssh your-username@147.79.78.1
```

### A2 — Clone the repo

```bash
mkdir -p ~/apps/giflove-staging
cd ~/apps/giflove-staging
git clone -b staging https://github.com/mansijoshi04/e-GreetingCards.git .
```

> If you get a permission error, you may need to set up a GitHub personal access token or SSH key on the VPS. See the note at the bottom of this section.

### A3 — Create the `.env` file

```bash
cd ~/apps/giflove-staging/e-greeting-cards
nano .env
```

Paste the following and fill in real values:

```env
# Database
POSTGRES_USER=greeting_user
POSTGRES_PASSWORD=<generate a strong random password>
POSTGRES_DB=greeting_cards_staging

# App
APP_PORT=3040
BASE_URL=https://staging.giflove.ca
NODE_ENV=production

# Paddle — use SANDBOX credentials here
PADDLE_API_KEY=test_<your sandbox api key>
PADDLE_WEBHOOK_SECRET=ntf_<your sandbox webhook secret>
PADDLE_ENVIRONMENT=sandbox
PADDLE_BASIC_PRICE_ID=pri_<your sandbox basic price id>
PADDLE_PREMIUM_PRICE_ID=pri_<your sandbox premium price id>
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=<your sandbox client token>

# Email
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_<your resend api key>
EMAIL_FROM=cards@giflove.ca
```

Save and exit: `Ctrl+O`, `Enter`, `Ctrl+X`

> **Never commit this file.** It is in `.gitignore`. The `.env` file stays on the VPS only.

### A4 — Start the stack

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This will:
1. Build the Next.js production image from the Dockerfile (takes 2–5 minutes on first run)
2. Start Postgres and Redis containers
3. Wait for Postgres to be healthy
4. Run `prisma migrate deploy` to set up the database schema
5. Start the Next.js app on port 3040

**Check it's running:**

```bash
docker compose -f docker-compose.prod.yml ps
```

You should see three containers with status `Up` or `healthy`:
```
NAME                          STATUS
greeting-cards-db-prod        Up (healthy)
greeting-cards-redis-prod     Up (healthy)
greeting-cards-app-prod       Up
```

**Check app logs:**

```bash
docker compose -f docker-compose.prod.yml logs app --tail=50
```

Look for `✓ Ready` or `started server on 0.0.0.0:3000` — this means the app is running inside the container on port 3000 (which maps to host port 3040).

**Test locally on the VPS before wiring up Nginx:**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3040
```

Should return `200`. If you get `000` or `Connection refused`, check the logs.

### A5 — Add Nginx config for staging

```bash
sudo nano /etc/nginx/sites-available/staging.giflove.ca
```

Paste:

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

Enable the site and reload:

```bash
sudo ln -s /etc/nginx/sites-available/staging.giflove.ca /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### A6 — Get SSL certificate

```bash
sudo certbot --nginx -d staging.giflove.ca
```

Certbot will:
1. Obtain a Let's Encrypt certificate for `staging.giflove.ca`
2. Automatically update your Nginx config to redirect HTTP → HTTPS
3. Add SSL listener on port 443

When prompted, choose to redirect all HTTP traffic to HTTPS.

**Verify SSL:**

```bash
curl -s -o /dev/null -w "%{http_code}" https://staging.giflove.ca
```

Should return `200`. Open in a browser — you should see a padlock and the GifLove homepage.

### A7 — Register Paddle sandbox webhook

1. Log into Paddle sandbox dashboard
2. Go to **Developer Tools → Notifications → New Notification**
3. URL: `https://staging.giflove.ca/api/payment/webhook`
4. Events: select `transaction.completed`
5. Save and copy the webhook secret
6. Update the `PADDLE_WEBHOOK_SECRET` value in your VPS `.env` file
7. Restart the app container to pick up the new value:

```bash
docker compose -f docker-compose.prod.yml restart app
```

### A8 — Run E2E test on staging

1. Visit `https://staging.giflove.ca`
2. Pick a template → customize → add your own email as a recipient → proceed to pay
3. Complete Paddle sandbox checkout using test card `4242 4242 4242 4242` (any future expiry, any CVV)
4. You should be redirected to the confirmation page with a shareable link
5. Check your email — the card notification should arrive from `cards@giflove.ca`
6. Open the card link — animation should play
7. Check Resend dashboard → **Emails** — status should show "Delivered"

---

### Note: GitHub auth on VPS for private repos

If your GitHub repo is private, `git clone` will ask for credentials. The easiest approach:

1. Generate a GitHub personal access token (PAT): GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token → check `repo` scope
2. Clone using the token:
   ```bash
   git clone -b staging https://<your-token>@github.com/mansijoshi04/e-GreetingCards.git .
   ```
3. Or configure git credentials on the VPS once:
   ```bash
   git config --global credential.helper store
   # Then clone — it will prompt once and save credentials
   ```

---

## Part B — Production Deployment

> **Do this only after staging is fully working and tested.**

Production uses real Paddle credentials (not sandbox) and runs on port 3050.

### B1 — Clone the repo (production)

```bash
mkdir -p ~/apps/giflove-production
cd ~/apps/giflove-production
git clone -b main https://github.com/mansijoshi04/e-GreetingCards.git .
```

### B2 — Create the `.env` file

```bash
cd ~/apps/giflove-production/e-greeting-cards
nano .env
```

```env
# Database
POSTGRES_USER=greeting_user
POSTGRES_PASSWORD=<different strong password from staging>
POSTGRES_DB=greeting_cards_production

# App
APP_PORT=3050
BASE_URL=https://giflove.ca
NODE_ENV=production

# Paddle — use LIVE/PRODUCTION credentials here
PADDLE_API_KEY=<your live paddle api key>
PADDLE_WEBHOOK_SECRET=<your live webhook secret>
PADDLE_ENVIRONMENT=production
PADDLE_BASIC_PRICE_ID=pri_<your live basic price id>
PADDLE_PREMIUM_PRICE_ID=pri_<your live premium price id>
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=<your live client token>

# Email
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_<your resend api key>
EMAIL_FROM=cards@giflove.ca
```

### B3 — Start the stack

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**Verify:**

```bash
docker compose -f docker-compose.prod.yml ps
curl -s -o /dev/null -w "%{http_code}" http://localhost:3050
```

### B4 — Add Nginx config for production

```bash
sudo nano /etc/nginx/sites-available/giflove.ca
```

```nginx
server {
    server_name giflove.ca www.giflove.ca;

    location / {
        proxy_pass http://localhost:3050;
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

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/giflove.ca /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### B5 — Get SSL certificate

```bash
sudo certbot --nginx -d giflove.ca -d www.giflove.ca
```

This covers both `giflove.ca` and `www.giflove.ca` in one certificate.

### B6 — Register Paddle live webhook

1. Log into Paddle **production** dashboard (vendors.paddle.com)
2. Go to **Developer Tools → Notifications → New Notification**
3. URL: `https://giflove.ca/api/payment/webhook`
4. Events: `transaction.completed`
5. Save and copy the webhook secret
6. Update `PADDLE_WEBHOOK_SECRET` in the production `.env`
7. Restart:
   ```bash
   docker compose -f docker-compose.prod.yml restart app
   ```

### B7 — Smoke test production

1. Visit `https://giflove.ca` — padlock should be present
2. Complete one real (or very cheap) test transaction
3. Confirm email delivery via Resend dashboard

---

## Useful Commands

**Restart a specific container:**
```bash
# Staging
cd ~/apps/giflove-staging/e-greeting-cards
docker compose -f docker-compose.prod.yml restart app

# Production
cd ~/apps/giflove-production/e-greeting-cards
docker compose -f docker-compose.prod.yml restart app
```

**View live logs:**
```bash
docker compose -f docker-compose.prod.yml logs app -f
```

**Pull latest code and redeploy (manual):**
```bash
git pull origin staging   # or main for production
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
```

**Stop everything:**
```bash
docker compose -f docker-compose.prod.yml down
```

**Stop and wipe database (destructive — use only to reset):**
```bash
docker compose -f docker-compose.prod.yml down -v
```

**Check Nginx:**
```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl reload nginx
```

**Check SSL certificate expiry:**
```bash
sudo certbot certificates
```

Certbot auto-renews certificates via a cron job — no manual action needed.

---

## Troubleshooting

**App container keeps restarting:**
```bash
docker compose -f docker-compose.prod.yml logs app --tail=100
```
Most common cause: `prisma migrate deploy` failed because Postgres wasn't ready yet. The healthcheck should prevent this, but if it happens, restart manually:
```bash
docker compose -f docker-compose.prod.yml restart app
```

**502 Bad Gateway from Nginx:**
The app container isn't running or isn't on the expected port. Check:
```bash
docker compose -f docker-compose.prod.yml ps
curl http://localhost:3040   # or 3050 for prod
```

**Paddle webhook not firing:**
- Confirm the webhook URL is exactly `https://staging.giflove.ca/api/payment/webhook`
- Check the Paddle dashboard for failed webhook deliveries
- Check app logs for `[webhook]` entries

**Email not arriving:**
- Check Resend dashboard → Emails for the delivery status
- If status is "Delivered" but not in inbox, check spam folder
- If DMARC/DKIM issues appear in Resend, re-verify the domain DNS records

---

## Staging Deployment Checklist

### Setup (one-time)
- [ ] SSH into VPS successfully
- [ ] `~/apps/giflove-staging/` directory created
- [ ] Repo cloned to `~/apps/giflove-staging/e-greeting-cards` (staging branch)
- [ ] `.env` file created with all staging values filled in
- [ ] `docker compose -f docker-compose.prod.yml up -d --build` runs without errors
- [ ] All 3 containers show as healthy: `docker compose -f docker-compose.prod.yml ps`
- [ ] `curl http://localhost:3040` returns 200
- [ ] Nginx config created at `/etc/nginx/sites-available/staging.giflove.ca`
- [ ] Nginx site enabled and reloaded without errors
- [ ] `certbot --nginx -d staging.giflove.ca` completes successfully
- [ ] `https://staging.giflove.ca` loads in browser with padlock

### Paddle & Email
- [ ] Paddle sandbox webhook registered for `https://staging.giflove.ca/api/payment/webhook`
- [ ] `PADDLE_WEBHOOK_SECRET` in `.env` matches the webhook secret from Paddle sandbox

### E2E Verification
- [ ] Can create and customize a card on staging
- [ ] Paddle sandbox checkout completes (test card `4242 4242 4242 4242`)
- [ ] Confirmation page appears with a shareable link
- [ ] Card email received from `cards@giflove.ca`
- [ ] Card link opens and animation plays
- [ ] Resend dashboard shows "Delivered" for the email

---

## Production Deployment Checklist

### Prerequisites
- [ ] Staging has been fully tested and working for at least a few days
- [ ] Live Paddle account approved and price IDs created
- [ ] Resend account verified (same account and API key as staging is fine)

### Setup (one-time)
- [ ] `~/apps/giflove-production/` directory created
- [ ] Repo cloned (main branch)
- [ ] `.env` file created with all **production/live** values
- [ ] `docker compose -f docker-compose.prod.yml up -d --build` runs without errors
- [ ] All 3 containers healthy: `docker compose -f docker-compose.prod.yml ps`
- [ ] `curl http://localhost:3050` returns 200
- [ ] Nginx config created at `/etc/nginx/sites-available/giflove.ca`
- [ ] Nginx site enabled and reloaded without errors
- [ ] `certbot --nginx -d giflove.ca -d www.giflove.ca` completes successfully
- [ ] `https://giflove.ca` loads with padlock
- [ ] `https://www.giflove.ca` redirects correctly

### Paddle & Email
- [ ] Live Paddle webhook registered for `https://giflove.ca/api/payment/webhook`
- [ ] `PADDLE_WEBHOOK_SECRET` in `.env` matches the live webhook secret

### Smoke Test
- [ ] Homepage loads correctly
- [ ] Template gallery loads
- [ ] Card creation flow works end to end
- [ ] Real payment processes correctly
- [ ] Email delivered from `cards@giflove.ca`
- [ ] Card opens and animation plays
