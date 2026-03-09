# Phase 3: Payment Integration - Testing Guide

## Overview

Phase 3 implements complete Stripe payment processing:
- Card creation before payment (marked as unpaid)
- Stripe checkout session generation
- Webhook handling for payment confirmation
- Email sending to recipients
- Confirmation page with shareable link

## Setup Required

### 1. Stripe Account Setup

```bash
# Get your keys from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLIC_KEY

# Get webhook secret:
# 1. Go to https://dashboard.stripe.com/test/webhooks
# 2. Create endpoint: http://localhost:3000/api/payment/webhook
# 3. Select: charge.succeeded and checkout.session.completed events
# 4. Copy the signing secret
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

Update `.env.local` with these keys.

### 2. SendGrid Account Setup (Optional for MVP)

```bash
# Get API key from https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY=SG.YOUR_API_KEY
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

**Note**: If not configured, emails will log to console instead.

### 3. Database Migration

Ensure the `isPaid` field is added to the Card table:

```bash
npx prisma migrate dev
```

Verify in Prisma Studio:
```bash
npx prisma studio
```

## Full Payment Flow Testing

### Step 1: Start the Application

```bash
npm run dev
```

Or with Docker:
```bash
docker-compose up -d
```

### Step 2: Browse Templates

1. Visit `http://localhost:3000/create`
2. See template gallery
3. Click on a template (e.g., "Balloon Party")

### Step 3: Customize Card

1. Edit headline, body, signature
2. Select color palette
3. Verify live preview updates
4. Click "Next: Add Recipients →"

### Step 4: Add Recipients

1. Enter sender name (required)
2. Enter sender email (optional)
3. Add 2-3 recipient emails
4. Click "Continue to Payment →"

### Step 5: Review & Checkout

1. Verify sender and recipients are correct
2. Verify card preview shows customizations
3. See payment amount ($3 or $5)
4. Click "Continue to Payment"

### Step 6: Stripe Checkout

Should redirect to Stripe test checkout page.

**Test Cards**:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

Use any future expiry date and any CVC (e.g., 12/25, 123).

### Step 7: Webhook Handling

#### Local Testing with Stripe CLI:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli

# Login to your account
stripe login

# Forward webhooks to local endpoint
stripe listen --forward-to localhost:3000/api/payment/webhook

# Get the webhook signing secret and update .env.local
```

When payment completes:
1. Stripe CLI shows webhook received
2. Card marked as `isPaid = true`
3. Emails sent to recipients (logged to console or SendGrid)
4. Recipients table updated with `emailSentAt`

### Step 8: Confirmation Page

After payment, should see:
- ✓ Success message
- ✓ Card creation confirmed
- ✓ Emails sent confirmed
- ✓ Shareable link displayed
- ✓ Copy to clipboard button
- ✓ Share buttons (WhatsApp, Email, Twitter)
- ✓ View card button

### Step 9: View Sent Card

Click "View Your Card" or visit the link:
```
http://localhost:3000/card/LINKTOKEN
```

Should see:
- ✓ Card displays with animations
- ✓ Share buttons visible
- ✓ Works on mobile

### Step 10: Verify Database State

Check Prisma Studio:

```bash
npx prisma studio
```

Verify:
1. **Cards table**:
   - `isPaid = true`
   - `stripePaymentId` = payment ID
   - `linkToken` = unique token
   - `expiresAt` = 7 days from now
   - `customText` = JSON with headline, body, signature

2. **Recipients table**:
   - Multiple rows for each recipient
   - `cardId` = linked card
   - `recipientEmail` = recipient email
   - `emailSentAt` = timestamp
   - `firstOpenedAt` = null (until opened)

3. **CardOpens table**:
   - Should see entries after viewing card
   - `openedAt` = timestamp
   - `deviceType` = mobile/desktop
   - `userAgent` = browser info

## Testing Edge Cases

### 1. Payment Cancelled

1. Start checkout but don't complete payment
2. On Stripe page, click "Back to {domain}"
3. Should be redirected to `/checkout`
4. Card should still exist with `isPaid = false`

### 2. Webhook Retry (Idempotency)

1. Complete payment successfully
2. Manually trigger webhook retry in Stripe Dashboard
3. Should not send duplicate emails (check `emailSentAt` updated once)

### 3. Expired Card

1. Set card `expiresAt` to past date in Prisma Studio
2. Visit card URL
3. Should show expiration message

### 4. Invalid Link Token

1. Visit `http://localhost:3000/card/invalidtoken123`
2. Should show "Card not found" error

### 5. Multiple Recipients

1. Create card with 5+ recipients
2. Verify all receive emails (logged to console)
3. Check all recipient records created

## Debugging

### Check Webhook Logs

If Stripe CLI is running:
```bash
stripe logs tail
```

### Check Application Logs

```bash
npm run dev  # Shows console logs
# or
docker-compose logs -f app  # If using Docker
```

### Check Database

```bash
# Interactive query in Prisma Studio
npx prisma studio

# Or via PostgreSQL CLI (if using Docker)
docker-compose exec postgres psql -U greeting_user -d greeting_cards
```

### Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. See payment history
3. Click payment to see details
4. Check webhook delivery status

## Common Issues

### Issue: Webhook Not Received

**Solution**:
1. Verify webhook URL is correct: `http://localhost:3000/api/payment/webhook`
2. Check Stripe webhook signing secret is correct
3. Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/payment/webhook`
4. Check application logs for errors

### Issue: Card Created but Not Paid

**Cause**: Webhook didn't fire or wasn't processed
**Solution**:
1. Check webhook delivery in Stripe Dashboard
2. Manually retry webhook if needed
3. Check error logs in application

### Issue: Emails Not Sent

**Cause**: SendGrid not configured or API key invalid
**Solution**:
1. Check `.env.local` has `SENDGRID_API_KEY` set
2. Look for console logs showing email status
3. Check SendGrid Activity tab for bounces/rejections

### Issue: Confirmation Page Shows Blank

**Cause**: Card data not fetched properly
**Solution**:
1. Check that card exists in database
2. Verify card ID in URL matches database
3. Check browser console for errors

## Environment Variables Checklist

Required for Phase 3:
- [ ] `STRIPE_SECRET_KEY` - Stripe test key
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- [ ] `STRIPE_WEBHOOK_SECRET` - From `stripe listen` output
- [ ] `BASE_URL` - Set to `http://localhost:3000` for local testing
- [ ] `SENDGRID_API_KEY` (optional) - For actual email sending
- [ ] `SENDGRID_FROM_EMAIL` (optional) - Sender email

## Success Criteria

✅ All items must pass:

1. **Card Creation**
   - ✅ Card created in database before payment
   - ✅ Link token generated and cached in Redis
   - ✅ Card marked as `isPaid = false`
   - ✅ Recipients created

2. **Payment Processing**
   - ✅ Stripe checkout session created
   - ✅ Redirect to Stripe works
   - ✅ Test payment succeeds
   - ✅ Redirect to confirmation page works

3. **Webhook Handling**
   - ✅ Webhook event received from Stripe
   - ✅ Event signature verified
   - ✅ Card marked as `isPaid = true`
   - ✅ `stripePaymentId` stored

4. **Email Sending**
   - ✅ Email sent to all recipients
   - ✅ `emailSentAt` timestamp updated
   - ✅ Email contains correct link
   - ✅ Email is responsive on mobile

5. **Confirmation Page**
   - ✅ Displays successfully
   - ✅ Shows shareable link
   - ✅ Copy to clipboard works
   - ✅ Share buttons functional
   - ✅ View card button works

6. **Card Viewing**
   - ✅ Card accessible via link
   - ✅ Animations work smoothly
   - ✅ Share buttons visible
   - ✅ Analytics tracked

## Next Steps (Phase 4)

Once Phase 3 is verified:

1. Implement actual email sending (if using SendGrid)
2. Add email tracking
3. Create analytics dashboard
4. Implement retry logic for failed emails
5. Begin Phase 4: Polish & Final Templates

## Performance Metrics

Target performance for Phase 3:

- **Card Creation**: < 500ms
- **Checkout Session**: < 1000ms (includes Stripe API call)
- **Webhook Processing**: < 1000ms
- **Email Sending**: < 2000ms for 5 recipients
- **Confirmation Page Load**: < 1500ms

Monitor these in Chrome DevTools Network tab and application logs.

---

**Last Updated**: March 8, 2026
**Phase 3 Status**: Ready for Testing
