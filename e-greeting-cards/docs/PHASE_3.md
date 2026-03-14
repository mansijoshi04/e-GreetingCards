# Phase 3: Payment & Card Delivery

**Status**: ✅ Complete (migrated from Stripe → Paddle)
**Completed**: March 14, 2026

---

## What Was Built

### Payment Service (`lib/services/paymentService.ts`)
- Wraps `@paddle/paddle-node-sdk`
- `createCheckoutSession(cardData)` — creates a Paddle transaction/checkout URL
- `constructWebhookEvent(body, signature)` — verifies webhook signature with `PADDLE_WEBHOOK_SECRET`
- `refundTransaction(transactionId)` — stub (logs warning; Paddle refund API varies by version)
- Uses `Environment.Sandbox` vs `Environment.Production` based on `PADDLE_ENVIRONMENT` env var

### Email Service (`lib/services/emailService.ts`)
- `sendCardEmail(options)` — sends a single email via SendGrid
- `sendCardEmailsToRecipients(cardId, card, cardUrl)` — batch sends to all card recipients; updates `emailSentAt` per recipient
- `generateEmailHTML(card, cardUrl)` — responsive HTML email template (gradient header, CTA button, expiry notice, growth-loop footer)
- **Graceful fallback**: if `SENDGRID_API_KEY` is not set, logs a detailed console preview of the email instead of erroring

### Payment Session API (`app/api/payment/create-session/route.ts`)
`POST /api/payment/create-session`
1. Validates required fields
2. Fetches template to get price
3. Generates unique 12-char link token via `linkService`
4. Creates `Card` record (`isPaid = false`)
5. Creates `Recipient` records
6. Caches card in Redis (7-day TTL)
7. Creates Paddle checkout session
8. Returns `{ cardId, checkoutUrl }`

### Webhook Handler (`app/api/payment/webhook/route.ts`)
`POST /api/payment/webhook`
- Handles `transaction.completed` event (Paddle equivalent of `checkout.session.completed`)
- Verifies signature, extracts `cardId` from transaction custom data
- Idempotency check: skips if `isPaid` already true
- Updates `Card`: `isPaid = true`, `stripePaymentId = transactionId`
- Calls `sendCardEmailsToRecipients()` — email failures are logged but don't fail the webhook (Paddle retries are handled gracefully)

### Card Details API (`app/api/cards/[cardId]/route.ts`)
`GET /api/cards/[cardId]`
- Returns card with template and recipients
- Allows access for paid cards, or within 5 minutes of creation (for the confirmation page race condition before webhook fires)

### Checkout Page (`app/checkout/page.tsx`)
- Reads card draft from `sessionStorage`
- Calls `POST /api/payment/create-session`
- Shows loading state during API call
- Redirects to Paddle checkout URL on success

### Confirmation Page (`app/confirmation/[cardId]/page.tsx`)
- Fetches card data from `GET /api/cards/[cardId]`
- Displays shareable link with copy-to-clipboard
- Share buttons: WhatsApp, Email, Twitter
- View card button
- Create another card CTA

### Dev Mock Payment (`app/api/dev/mock-payment/route.ts`)
- `POST /api/dev/mock-payment` — development-only endpoint
- Marks a card as paid and triggers email sending without going through Paddle
- Protected: only available when `NODE_ENV !== 'production'`

---

## Payment Flow

```
Checkout page
  → POST /api/payment/create-session
    → Card created (isPaid=false), recipients created, cached in Redis
    → Paddle checkout session created
  → Redirect to Paddle checkout URL

Paddle checkout (user pays)
  → Redirect to /confirmation/[cardId]

Paddle webhook (async, seconds later)
  → POST /api/payment/webhook
    → Card: isPaid=true, stripePaymentId=transactionId
    → Emails sent to all recipients
    → Recipients: emailSentAt updated
```

---

## Environment Variables

```bash
# Paddle
PADDLE_API_KEY=test_...
PADDLE_WEBHOOK_SECRET=ntf_...
PADDLE_ENVIRONMENT=sandbox          # or "production"
PADDLE_BASIC_PRICE_ID=pri_...       # $3 price
PADDLE_PREMIUM_PRICE_ID=pri_...     # $5 price

# Email (optional — logs to console if absent)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=cards@yourdomain.com

# App
BASE_URL=http://localhost:3000
```

---

## Paddle Setup (Sandbox)

1. Create account at [paddle.com](https://paddle.com) → switch to Sandbox
2. **API key**: Paddle Dashboard → Developer → Authentication → Generate key
3. **Prices**: Catalog → Prices → create two one-time prices ($3 basic, $5 premium); copy the `pri_...` IDs
4. **Webhook**: Developer → Notifications → New destination
   - URL: `https://YOUR_NGROK.ngrok.io/api/payment/webhook` (use ngrok for local testing)
   - Events: `transaction.completed`
   - Copy the signing secret (`ntf_...`)
5. Add all keys to `.env.local`
6. Test card: `4111 1111 1111 1111` / any future date / any CVV

### Local Webhook Testing with ngrok

```bash
# Install ngrok, then:
ngrok http 3000

# Update PADDLE_WEBHOOK_SECRET in .env.local with the secret from the Paddle notification destination
# Update BASE_URL to your ngrok URL for the session
```

---

## Testing the Full Flow

```bash
# Option A: Real Paddle (requires ngrok)
docker compose up
# Go to http://localhost:3000/create → select template → customise → add recipients → checkout
# Complete payment with test card 4111 1111 1111 1111
# Check confirmation page + card link

# Option B: Dev mock payment (no Paddle needed)
curl -X POST http://localhost:3000/api/dev/mock-payment \
  -H "Content-Type: application/json" \
  -d '{"cardId":"YOUR_CARD_ID"}'
# Card is instantly marked paid, emails sent/logged
```

### Verify Database State

```bash
docker compose exec app npx prisma studio
# Cards table: isPaid=true, stripePaymentId set, linkToken present
# Recipients table: emailSentAt timestamp set
# CardOpens table: entries after viewing the card
```

### Test Scenarios

| Scenario | How to test | Expected |
|---|---|---|
| Happy path | Complete Paddle payment | Card paid, emails sent, confirmation shows link |
| Dev mock | POST /api/dev/mock-payment | Same result without Paddle |
| Cancelled payment | Leave Paddle checkout | Card stays isPaid=false, can retry |
| Expired card | Set expiresAt to past in DB | "Card Expired" page at /card/[token] |
| No SendGrid key | Leave SENDGRID_API_KEY blank | Rich console log instead of real email |
| Webhook retry | Trigger twice | Idempotency check: second run skipped |

---

## Troubleshooting

**Webhook not received**: Verify ngrok is running and the URL in Paddle Notifications matches exactly. Check `docker compose logs -f app` for errors.

**Card not marked paid**: Webhook signing secret mismatch. Regenerate `PADDLE_WEBHOOK_SECRET` from Paddle dashboard and update `.env.local`. Restart the app container.

**Emails not sending**: If `SENDGRID_API_KEY` is blank, look for the email log in the console. If set, check SendGrid Activity Feed for bounce/rejection reasons.

**Confirmation page blank**: The card may not be accessible yet (webhook hasn't fired). The API allows access within 5 minutes of creation. Refresh the page after the webhook fires.

---

## Files Created

```
lib/services/paymentService.ts
lib/services/emailService.ts
app/api/payment/create-session/route.ts
app/api/payment/webhook/route.ts
app/api/cards/[cardId]/route.ts
app/api/dev/mock-payment/route.ts
app/checkout/page.tsx          (updated)
app/confirmation/[cardId]/page.tsx
```

---

## Migration Note: Stripe → Paddle

The original Phase 3 implementation used Stripe. During this session (March 14, 2026) we migrated to Paddle:
- Replaced `stripe` npm package with `@paddle/paddle-node-sdk`
- Changed env vars from `STRIPE_*` to `PADDLE_*`
- Webhook event changed from `checkout.session.completed` → `transaction.completed`
- Field name `stripePaymentId` kept in Prisma schema (stores Paddle transaction ID) to avoid a migration
- `docker-compose.yml` updated to use Paddle env vars
