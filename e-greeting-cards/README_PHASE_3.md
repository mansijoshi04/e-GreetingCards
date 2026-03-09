# Phase 3: Payment Integration - README

## Quick Overview

Phase 3 implements a complete Stripe payment system with webhook handling and email delivery. The system creates cards before payment, then finalizes them after successful payment.

## Architecture Highlights

### Payment Flow

```
User Checkout → Creates Card (unpaid) → Stripe Session → Payment → Webhook → Email → Confirmation
```

### Key Features

1. **Card Creation Before Payment**
   - Card created with `isPaid = false`
   - Link token generated (unique 12-char code)
   - Cached in Redis for fast access
   - Customers can return to payment if interrupted

2. **Secure Payment Processing**
   - Stripe checkout session created
   - Metadata includes card ID
   - Webhook signature verification
   - Idempotency checking (prevents duplicate emails)

3. **Email Integration**
   - Responsive HTML templates
   - Click/open tracking
   - Batch sending to multiple recipients
   - Graceful error handling

4. **Post-Payment Experience**
   - Confirmation page with shareable link
   - Copy to clipboard
   - Share via WhatsApp, Email, Twitter
   - View card immediately

## Files Created

### Services (2 files)
- `lib/services/paymentService.ts` - Stripe API wrapper
- `lib/services/emailService.ts` - Email delivery service

### API Routes (3 endpoints)
- `app/api/payment/create-session/route.ts` - Create Stripe session
- `app/api/payment/webhook/route.ts` - Handle payment events
- `app/api/cards/[cardId]/route.ts` - Fetch card details

### Pages (1 new)
- `app/confirmation/[cardId]/page.tsx` - Post-payment confirmation

### Database (1 migration)
- `prisma/schema.prisma` - Added `isPaid` field
- `20260308181417_add_is_paid` - Migration applied

## Configuration

### Required Environment Variables

```bash
# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_KEY

# SendGrid (optional - falls back to console)
SENDGRID_API_KEY=SG.YOUR_KEY
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Application
BASE_URL=http://localhost:3000
```

## How to Test

### 1. Setup (5 minutes)
```bash
# Get Stripe test keys from dashboard
# Update .env.local with keys
# No npm install needed - dependencies already installed
```

### 2. Start Development
```bash
npm run dev
```

### 3. Run Full Flow
1. Navigate to http://localhost:3000/create
2. Select a template
3. Customize card
4. Add recipients
5. Go to checkout
6. Click "Continue to Payment"
7. Use test card: 4242 4242 4242 4242
8. Complete payment
9. See confirmation page

### 4. Verify
```bash
# Check database
npx prisma studio

# Look for:
# - Card with isPaid = true
# - Recipients with emailSentAt set
```

## Testing Stripe Webhook Locally

### Option A: Stripe CLI (Recommended)
```bash
# Install from https://stripe.com/docs/stripe-cli

# Forward webhooks
stripe listen --forward-to localhost:3000/api/payment/webhook

# In Stripe Dashboard, check webhook deliveries
```

### Option B: Manual Testing
If webhook isn't firing locally, you can test with curl:

```bash
# Simulate webhook in another terminal
curl -X POST http://localhost:3000/api/payment/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: YOUR_SIGNATURE" \
  -d '{"type":"charge.succeeded","data":{"object":{"metadata":{"cardId":"YOUR_CARD_ID"}}}}'
```

## Test Cards

```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
⚠️ Requires Auth: 4000 0025 0000 3155
```

Use any future date (12/25) and any 3-digit CVC (123).

## Troubleshooting

### Webhook Not Received
1. Check Stripe CLI is running: `stripe listen`
2. Verify webhook URL in dashboard
3. Check console logs for errors
4. Look at Stripe Dashboard → Webhooks → Event Deliveries

### Card Not Marked as Paid
1. Check webhook signing secret is correct
2. Verify card was created in database
3. Check console logs for webhook errors
4. Try retrying webhook in Stripe Dashboard

### Emails Not Sending
1. If not configured, check console logs (should show "Email would be sent to...")
2. If SendGrid configured, check SendGrid Activity tab
3. Verify SENDGRID_API_KEY is correct

## Code Examples

### Creating a Stripe Session

```typescript
const response = await fetch('/api/payment/create-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateId: 'template-id',
    senderName: 'John',
    customText: { headline: 'Hello', body: 'Message', signature: 'John' },
    recipients: ['john@example.com']
  })
});

const { checkoutUrl } = await response.json();
window.location.href = checkoutUrl;
```

### Sending Email Manually

```typescript
import { sendCardEmail } from '@/lib/services/emailService';

await sendCardEmail({
  recipientEmail: 'john@example.com',
  cardUrl: 'https://yourdomain.com/card/abc123',
  senderName: 'Sarah',
  cardCategory: 'birthday',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});
```

## Performance Metrics

Target performance:
- Card creation: < 600ms
- Webhook processing: < 100ms
- Email batch send: < 2s (5 recipients)
- Confirmation load: < 1s

## What's Next After Phase 3

### Phase 4 (2-3 days)
- Email retry logic for failed sends
- Analytics dashboard
- 9 additional templates (total 12)
- Mobile optimization refinements

### Phase 5 (2-3 days)
- Performance optimization (Lighthouse > 90)
- Additional animations (click-to-reveal)
- Error pages and loading states
- Accessibility improvements

### Phase 6 (1-2 days)
- Vercel deployment
- Production database setup
- Domain and SSL
- Launch checklist

## Support & Documentation

- **PHASE_3_QUICK_START.md** - 30-minute setup guide
- **PHASE_3_TESTING.md** - Comprehensive testing guide
- **PHASE_3_IN_PROGRESS.md** - Implementation details
- **IMPLEMENTATION_SUMMARY.md** - Full project overview

## Success Criteria

Phase 3 is complete when:
- ✅ Payment flow works end-to-end
- ✅ Webhook receives and processes events
- ✅ Cards marked as paid in database
- ✅ Emails sent to all recipients
- ✅ Confirmation page displays correctly
- ✅ Card accessible via link after payment

---

**Status**: Ready for Testing
**Implementation Date**: March 8, 2026
**Estimated Testing Time**: 1-2 hours
