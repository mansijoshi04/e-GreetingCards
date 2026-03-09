# Phase 3: Quick Start Testing Guide

## 1-Minute Setup

### Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy the **Secret Key** (starts with `sk_test_`)
3. Copy the **Publishable Key** (starts with `pk_test_`)

### Get Webhook Secret

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `http://localhost:3000/api/payment/webhook`
4. Events: Select `charge.succeeded` and `checkout.session.completed`
5. Click "Add endpoint"
6. View the endpoint you just created
7. Copy the **Signing Secret** (starts with `whsec_`)

### Update Environment Variables

**File**: `.env.local`

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
SENDGRID_API_KEY=SG.YOUR_API_KEY  # Optional - emails will log to console if not set
SENDGRID_FROM_EMAIL=noreply@yourdomain.com  # Optional
BASE_URL=http://localhost:3000
```

### Run Local Development

```bash
# Terminal 1: Start the Next.js server
npm run dev

# Terminal 2: Forward Stripe webhooks (optional but recommended)
# First, install Stripe CLI from: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/payment/webhook

# Copy the signing secret from the output and update .env.local with STRIPE_WEBHOOK_SECRET
```

## Testing the Full Flow

### Step 1: Create a Card

1. Open http://localhost:3000/create
2. Click on any template
3. Fill in headline, body, signature
4. Select color palette
5. Click "Next: Add Recipients →"

### Step 2: Add Recipients

1. Enter sender name (required): `Test User`
2. Enter sender email (optional): `your-email@example.com`
3. Add 1-2 recipient emails
4. Click "Continue to Payment →"

### Step 3: Checkout

1. Review the order summary
2. Click "Continue to Payment"
3. Should redirect to Stripe test checkout

### Step 4: Complete Payment

On Stripe checkout page:

- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- Name: Anything

Click "Complete order" or "Pay"

### Step 5: Confirmation Page

Should see:
- ✅ Success message
- ✅ Shareable link (copy button)
- ✅ Share options (WhatsApp, Email, Twitter)
- ✅ "View Your Card" button

### Step 6: Check Webhook (If Using Stripe CLI)

In Terminal 2 (Stripe CLI), you should see:

```
2026-03-08 14:35:42   charge.succeeded [evt_1234...]
2026-03-08 14:35:43   checkout.session.completed [evt_5678...]
```

If you don't see these, the webhook isn't connecting. Check:
- Is Stripe CLI running?
- Are both URLs correct?
- Check http://localhost:3000 is accessible

### Step 7: Verify in Database

```bash
npx prisma studio
```

Check `Cards` table:
- ✅ `isPaid = true`
- ✅ `stripePaymentId` is set
- ✅ `linkToken` matches the link shown

Check `Recipients` table:
- ✅ Multiple rows for each recipient
- ✅ `emailSentAt` is set (recent timestamp)

## Testing the Card Link

1. Copy the link from confirmation page
2. Visit it in a browser (or share it)
3. Should see the card with animations
4. Click/scroll to reveal the card
5. See share buttons

## Email Testing (SendGrid)

If you have SendGrid configured:

1. Check your inbox for the email sent to you
2. Email should have:
   - Sender name and card type
   - "Open Your Card" button with the link
   - Expiry date
   - Mobile-optimized design

If you don't have SendGrid:
1. Check application logs (npm run dev terminal)
2. Should see message: "Email would be sent to: [email]"

## Troubleshooting

### Issue: Stripe Checkout Not Loading

**Cause**: Invalid publishable key or environment not set

**Fix**:
1. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
2. Restart `npm run dev`
3. Check browser console for errors

### Issue: Webhook Not Received

**Cause**: Stripe CLI not running or webhook endpoint not registered

**Fix**:
1. Is Stripe CLI running? (`stripe listen --forward-to localhost:3000/api/payment/webhook`)
2. Check Stripe Dashboard for webhook delivery errors
3. Verify endpoint URL is exactly: `http://localhost:3000/api/payment/webhook`

### Issue: Card Not Marked as Paid

**Cause**: Webhook didn't execute or signature verification failed

**Fix**:
1. Check webhook signing secret is correct
2. Look for error logs in `npm run dev` terminal
3. Try manually retrying webhook in Stripe Dashboard

### Issue: Confirmation Page Shows Error

**Cause**: Card not found in database

**Fix**:
1. Check card was created (check database with Prisma Studio)
2. Verify card ID in URL matches database
3. Check console logs for errors

## Performance Testing

Once everything works, measure:

1. **Card Creation**: Time from clicking "Next" to Stripe redirect
   - Target: < 1.5 seconds
   - Check: Chrome DevTools Network tab

2. **Webhook Processing**: Time from payment to database update
   - Target: < 1 second (excluding email)
   - Check: Stripe CLI logs

3. **Email Sending**: Time to send to 5 recipients
   - Target: < 2 seconds (async)
   - Check: Application logs

4. **Confirmation Load**: Time to fetch card data and render
   - Target: < 1 second
   - Check: Chrome DevTools Network tab

## Next Steps

Once Phase 3 is verified:

1. Test on mobile device (iOS Safari, Android Chrome)
2. Try declined card: `4000 0000 0000 0002`
3. Test with multiple recipients (5+)
4. Test canceling payment and restarting

See `PHASE_3_TESTING.md` for comprehensive testing guide.

---

**Status**: Ready for Testing
**Time to Complete**: 30 minutes - 1 hour
**Next Phase**: Phase 4 - Polish & Final Features
