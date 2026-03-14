# Paddle Setup Guide

This guide walks you through configuring Paddle for local development and production deployment of the E-Greeting Card platform.

---

## Overview

The platform uses **Paddle** as its payment processor. Paddle operates as a **merchant of record**, meaning Paddle handles VAT/tax compliance automatically — no need to manage regional tax rules yourself.

**Pricing:**
- Basic Cards: $3.00 → `PADDLE_BASIC_PRICE_ID`
- Premium Cards: $5.00 → `PADDLE_PREMIUM_PRICE_ID`

**Environments:**
- **Sandbox** — for local development and testing (uses fake money)
- **Production** — for live payments (separate Paddle account, real money)

---

## Prerequisites

- Node.js ≥ 18 and npm
- `@paddle/paddle-node-sdk` is already in `package.json` — just run `npm install`
- Docker running (for local Postgres + Redis via `docker-compose`)
- (Optional, for real webhook testing) ngrok installed

---

## Step 1: Create a Paddle Sandbox Account

1. Go to [https://sandbox-vendors.paddle.com](https://sandbox-vendors.paddle.com)
2. Sign up with your email address
3. Verify your account via the confirmation email
4. Log in to the sandbox dashboard

> Sandbox and production are **completely separate accounts** at separate URLs. Keys from one will not work in the other.

---

## Step 2: Create Two Products and Prices

### A. Basic Greeting Card ($3.00)

1. In the sidebar: **Catalog → Products → New Product**
2. Fill in:
   - Name: `Basic Greeting Card`
   - Type: `Digital`
3. Save the product, then open it
4. Go to **Prices → Add Price**:
   - Amount: `$3.00`
   - Currency: `USD`
   - Billing: `One-time`
5. Save and copy the **Price ID** (format: `pri_01abc...`)

### B. Premium Greeting Card ($5.00)

1. Repeat the same steps with:
   - Name: `Premium Greeting Card`
   - Amount: `$5.00`
2. Copy the **Price ID**

---

## Step 3: Get Your API Key

1. In the sidebar: **Developer Tools → Authentication**
2. Copy the **Sandbox** API key (format: `test_abc123...`)

> Never use a production key in `.env.local`. The sandbox key starts with `test_`.

---

## Step 4: Set Up a Webhook Endpoint

You have two options depending on whether you want real Paddle webhook delivery or a quick local test.

### Option A: Mock Payment (No ngrok needed)

The platform ships with a dev-only mock endpoint that simulates a completed payment without touching Paddle at all. Use this to test the full card creation → email → card viewer flow instantly.

- Endpoint: `POST /api/dev/mock-payment`
- Only active when `NODE_ENV !== 'production'`
- See [Step 7](#step-7-test-locally-without-paddle-mock-payment-flow) for usage

### Option B: Real Sandbox Webhook (ngrok required)

To test actual Paddle-hosted checkout and webhook delivery:

1. Install ngrok (if not already):
   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com/download
   ```

2. Start a tunnel to your local dev server:
   ```bash
   ngrok http 3000
   ```

3. Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok-free.app`)

4. In Paddle sandbox dashboard: **Developer Tools → Webhooks → New Endpoint**
   - URL: `https://your-ngrok-url/api/payment/webhook`
   - Events: check `transaction.completed`
   - Save

5. Copy the **Webhook Secret** (format: `ntf_...`) shown after saving

---

## Step 5: Configure Environment Variables

Create a file called `.env.local` inside the `e-greeting-cards/` directory:

```bash
# Paddle
PADDLE_API_KEY=test_your_api_key_here
PADDLE_WEBHOOK_SECRET=ntf_your_webhook_secret_here
PADDLE_ENVIRONMENT=sandbox
PADDLE_BASIC_PRICE_ID=pri_your_basic_price_id
PADDLE_PREMIUM_PRICE_ID=pri_your_premium_price_id

# App
BASE_URL=http://localhost:3000

# Database (matches docker-compose defaults)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/egreetingcards

# Redis
REDIS_URL=redis://localhost:6379

# Email (optional — logs to console if not set)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=cards@yourdomain.com
```

> `.env.local` is gitignored. Never commit real API keys to version control.

---

## Step 6: Install Dependencies and Start the Dev Server

```bash
cd e-greeting-cards

# Install all dependencies (includes @paddle/paddle-node-sdk and html2canvas)
npm install

# Start Postgres + Redis via Docker
docker-compose up -d

# Apply database schema
npm run db:migrate

# Seed the template library
npm run db:seed

# Start Next.js dev server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Step 7: Test Locally Without Paddle (Mock Payment Flow)

Use this to verify the full flow — card creation, email delivery, and card viewer — without needing Paddle credentials.

1. Open [http://localhost:3000](http://localhost:3000)
2. Choose a template → customize → add recipient emails → proceed to checkout
3. Open **Browser DevTools → Network tab**
4. Find the `create-session` request and inspect the JSON response
5. Copy the `cardId` value from the response
6. In a terminal, run:
   ```bash
   curl -X POST http://localhost:3000/api/dev/mock-payment \
     -H "Content-Type: application/json" \
     -d '{"cardId": "paste-card-id-here"}'
   ```
7. Check your terminal running `npm run dev` — a formatted email log will appear:

   ```
   ┌─────────────────────────────────────────┐
   │          📧 EMAIL (DEV MODE)            │
   ├─────────────────────────────────────────┤
   │ TO:      recipient@example.com          │
   │ FROM:    cards@yourdomain.com           │
   │ SUBJECT: Alice sent you a birthday card │
   │ LINK:    http://localhost:3000/card/... │
   └─────────────────────────────────────────┘
   ```

8. Copy the card link from the log and open it in the browser — the animation should play

---

## Step 8: Test With Real Paddle Sandbox

1. Complete [Step 4B](#option-b-real-sandbox-webhook-ngrok-required) to set up ngrok and register the webhook
2. Update `.env.local`:
   ```bash
   BASE_URL=https://your-ngrok-url.ngrok-free.app
   ```
3. Restart the dev server (`Ctrl+C`, then `npm run dev`)
4. Go through the full checkout flow on the site
5. You'll be redirected to the Paddle-hosted checkout page
6. Use Paddle's test card:
   - Card number: `4111 1111 1111 1111`
   - Expiry: any future date
   - CVV: any 3 digits
7. After payment, Paddle sends a `transaction.completed` webhook to your ngrok URL
8. The card is marked `isPaid = true` and an email log appears in the terminal
9. You are redirected to `/confirmation/[cardId]` with a shareable card link

---

## Step 9: Going to Production (Checklist)

- [ ] Create a **production** Paddle account at [https://vendors.paddle.com](https://vendors.paddle.com)
- [ ] Create Basic and Premium products/prices in the production dashboard
- [ ] Set `PADDLE_ENVIRONMENT=production` in your environment
- [ ] Replace `PADDLE_API_KEY` with the production key (does not start with `test_`)
- [ ] Update `PADDLE_BASIC_PRICE_ID` and `PADDLE_PREMIUM_PRICE_ID` with production Price IDs
- [ ] Register your production webhook endpoint (e.g., `https://yourdomain.com/api/payment/webhook`)
- [ ] Copy the production webhook secret to `PADDLE_WEBHOOK_SECRET`
- [ ] Set `BASE_URL` to your Vercel deployment URL
- [ ] Add all env vars to **Vercel → Project Settings → Environment Variables**
- [ ] Set `SENDGRID_API_KEY` to a real SendGrid key for live email delivery

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `PADDLE_API_KEY` errors on startup | Key not set or wrong format | Check `.env.local` exists and has the correct key, then restart dev server |
| `Price ID not configured` error | `PADDLE_BASIC_PRICE_ID` or `PADDLE_PREMIUM_PRICE_ID` is empty | Set both Price IDs in `.env.local` |
| Webhook returns 401 Invalid signature | Wrong `PADDLE_WEBHOOK_SECRET` | Copy the secret from Paddle Dashboard → Webhooks → your endpoint → show secret |
| Mock payment returns 404 | Running in production mode | Mock endpoint only works when `NODE_ENV !== 'production'` |
| Emails not sending (no log either) | Service misconfigured | If `SENDGRID_API_KEY` is empty, emails log to the terminal — check the console |
| Email logs appear but card link is wrong | `BASE_URL` not set | Set `BASE_URL=http://localhost:3000` in `.env.local` |
| Card not found after mock payment | Wrong `cardId` | Get `cardId` from the `create-session` API response in DevTools Network tab |
| Paddle checkout page not loading | Price ID mismatch | Confirm the Price ID in `.env.local` exists in your sandbox catalog |
| `docker-compose up` fails | Port conflict or Docker not running | Ensure Docker Desktop is running and ports 5432/6379 are free |
