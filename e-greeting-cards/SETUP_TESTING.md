# E-Greeting Cards - Testing Setup Guide

## Phase 3: Full End-to-End Payment & Email Testing

This guide walks through setting up Stripe webhooks locally and testing the complete payment flow.

---

## **Step 1: Get Stripe Test API Keys**

### On Stripe Dashboard:
1. Go to https://dashboard.stripe.com/test/apikeys
2. Under "Standard keys", copy:
   - **Secret key** (starts with `sk_test_`)
   - **Publishable key** (starts with `pk_test_`)

### Update `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_WEBHOOK_SECRET_HERE  # Leave blank for now
```

---

## **Step 2: Setup Stripe CLI for Webhooks (Optional but Recommended)**

### Install Stripe CLI:

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
Download from https://github.com/stripe/stripe-cli/releases

**Linux:**
```bash
curl https://raw.githubusercontent.com/stripe/stripe-cli/master/installers/install.sh -o install.sh
sudo bash install.sh
```

### Connect to Your Account:
```bash
stripe login
# Opens browser to authenticate
# Copy the Restricted API key from the terminal
```

### Forward Webhooks Locally:
```bash
cd e-greeting-cards
stripe listen --forward-to localhost:3000/api/payment/webhook
```

This will output:
```
Ready! Your webhook signing secret is: whsec_test_XXXXXXXXXXXXX
```

**Copy this secret** to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXX
```

---

## **Step 3: Start the Development Server**

```bash
cd e-greeting-cards
npm run dev
# Server runs on http://localhost:3000
```

In another terminal, keep the Stripe webhook forward running:
```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

---

## **Step 4: Test the Full Flow**

### Navigate Through the App:

**1. Home Page** (`http://localhost:3000`)
- Click "Choose Basic" or "Go Premium"

**2. Template Gallery** (`http://localhost:3000/create?tier=basic`)
- Click a template card

**3. Editor** (e.g., `/create/balloon-party`)
- Edit headline, message, signature
- See live preview on the right
- Click "Next: Recipients"

**4. Recipients** (`http://localhost:3000/recipients`)
- Enter your name (required)
- Enter your email (optional but good for testing)
- Add test recipient emails (use your own email to receive test emails)
- Click "Continue to Payment"

**5. Checkout** (`http://localhost:3000/checkout`)
- Review order summary
- Click "Continue to Payment"
- Redirects to Stripe checkout

**6. Stripe Checkout**
- Use **test card**: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- Name: Anything
- Click "Pay"

**7. Confirmation** (`http://localhost:3000/confirmation/[cardId]`)
- Should show "Payment Successful!" ✅
- Shows shareable link
- Copy link button
- Share buttons (WhatsApp, Email, Twitter)

**8. Stripe Webhook** (Check terminal running `stripe listen`)
- Should log: `→ 2024-01-15 14:32:10 ▶ charge.succeeded [evt_...]`
- Should show webhook was forwarded to localhost:3000

**9. Card Viewer** (`http://localhost:3000/card/[linkToken]`)
- Click "View Your Card" on confirmation page
- Should see the card with scroll animation
- Scroll down to reveal the card content
- Desktop: Smooth scroll animation
- Mobile: Tap to scroll, animation should work smoothly

**10. Check Email** (If SendGrid configured)
- Check your email inbox
- Should receive email from `cards@localhost` with:
  - "You've Received a Card!" subject
  - "Open Your Card" button
  - Link to card with 7-day expiry notice

---

## **Step 5: Verify Database State**

After payment succeeds, verify the data was saved:

```bash
# Open Prisma Studio
npx prisma studio

# Or check manually:
# Cards table should have:
#   - isPaid: true
#   - linkToken: (unique token)
#   - stripePaymentId: (Stripe payment ID)
#   - recipients: 1+ recipient records

# Recipients table should have:
#   - recipientEmail: (your test email)
#   - emailSentAt: (timestamp)
```

---

## **Step 6: Test Error Cases**

### Failed Card Payment:
- Use card: `4000 0000 0000 0002`
- Should be declined, show error message
- Database: Card created with `isPaid: false`

### Expired Card Links:
- Update card `expiresAt` in database to past date
- Try to access `/card/[linkToken]`
- Should show "Card Expired" message

### Invalid Recipient Email:
- Recipients page validation should prevent form submission
- Error message appears below invalid email

---

## **Step 7: SendGrid Setup (Optional - For Real Emails)**

### Get SendGrid API Key:
1. Go to https://sendgrid.com/
2. Sign up or login
3. Go to Settings → API Keys
4. Create a new API key
5. Copy the key

### Update `.env.local`:
```bash
SENDGRID_API_KEY=SG.YOUR_API_KEY_HERE
SENDGRID_FROM_EMAIL=your-verified-email@example.com
```

**Note**: SendGrid requires verifying the sender email domain. For testing, you can:
- Use your personal email as `SENDGRID_FROM_EMAIL`
- Or set it to `cards@localhost` (emails will log to console if not configured)

### Verify Email Send:
- Go through payment flow
- Check email inbox for card invitation
- Click "Open Your Card" button
- Should link to correct card with token

---

## **Step 8: Performance & Animations**

### Test on Mobile:
```bash
# Get your laptop IP
# On Mac: ifconfig | grep "inet " (look for non-127.0.0.1)
# On Windows: ipconfig (look for IPv4 Address)

# Visit from phone: http://YOUR_IP:3000
```

### Check Animation Performance:
- Open DevTools (F12)
- Go to Performance tab
- Record while scrolling card
- Target: 60fps (should be smooth)

### Mobile-Specific:
- ScrollToOpen: Scroll down to reveal
- ClickToReveal: Tap to reveal (if template uses click-to-reveal)
- Confetti: Should trigger smoothly without lag

---

## **Step 9: Known Test Scenarios**

### Scenario 1: Happy Path (Success)
1. Basic card, 2 recipients, valid payment → ✅ Card created, emails sent
2. Premium card, 5 recipients, valid payment → ✅ Card created, confetti included

### Scenario 2: Payment Decline
1. Use declined test card (4000 0000 0000 0002)
2. Should show error → ✅ Card created unpaid, can retry

### Scenario 3: Webhook Timeout (Test Stripe Retry)
1. Kill webhook listener during payment
2. Complete payment on Stripe
3. Restart webhook listener
4. Stripe retries webhook → ✅ Card marked paid eventually

### Scenario 4: Expired Link
1. Create card
2. Wait 7 days or manually set `expiresAt` in DB to past date
3. Try to access card → ✅ Shows "Card Expired" message

---

## **Troubleshooting**

### Webhook Not Hitting Endpoint:
```bash
# Check Stripe CLI is running
stripe listen --forward-to localhost:3000/api/payment/webhook

# Check server logs for POST /api/payment/webhook
# Should see: "Webhook processing error" or success response
```

### Database Not Saving Card:
```bash
# Check DATABASE_URL in .env.local
DATABASE_URL="file:prisma/dev.db"

# Verify database exists
ls -la e-greeting-cards/prisma/dev.db

# Check Prisma migrations
npx prisma migrate status
```

### Emails Not Sending:
- If no SENDGRID_API_KEY: Logs to console (check server logs)
- If SENDGRID_API_KEY set: Check SendGrid dashboard for delivery logs
- Verify `SENDGRID_FROM_EMAIL` is domain-verified in SendGrid

### Card Preview Not Showing:
```bash
# Check template is seeded
npx prisma studio
# Templates table should have 3 records

# Check designConfig is valid JSON
# Should have structure: { animations, layout, elements[] }
```

---

## **Next Steps After Testing**

Once the full flow works:

1. **Add more templates** (currently 3, need 9+ more)
2. **Optimize animations** for mobile (check 60fps on real device)
3. **Deploy to Vercel** with production Stripe keys
4. **Set up beta testing** with 10-20 users
5. **Monitor analytics** - track completion rates, popular templates

---

## **Quick Commands Reference**

```bash
# Start dev server
npm run dev

# Start Stripe webhook listener (in another terminal)
stripe listen --forward-to localhost:3000/api/payment/webhook

# View database
npx prisma studio

# Check migrations
npx prisma migrate status

# Reseed templates
DATABASE_URL="file:prisma/dev.db" npx prisma migrate reset --force --skip-generate

# View server logs
npm run dev  # Check terminal output

# Kill port 3000 if stuck
npx kill-port 3000
```

---

**Happy testing! Let us know if you hit any issues.** 🚀
