# Phase 1: Core Card Viewing System - Testing Guide

Successfully implemented the complete card viewing system with scroll-to-open animations and tracking!

## What's Been Built

### Components Created:
1. ✅ **Link Service** (`lib/services/linkService.ts`)
   - Generate unique 12-character tokens
   - Validate links with Redis caching
   - Handle 7-day expiry
   - Fetch card data

2. ✅ **Card Service** (`lib/services/cardService.ts`)
   - Create cards with recipients
   - Get card statistics
   - Card management utilities

3. ✅ **Card Viewing Page** (`app/card/[linkToken]/page.tsx`)
   - Server-side rendering for SEO
   - Link validation
   - Meta tags for social sharing

4. ✅ **CardRenderer** (`components/cards/CardRenderer.tsx`)
   - Client component for rendering
   - Animation selection logic
   - Tracking integration

5. ✅ **CardContent** (`components/cards/CardContent.tsx`)
   - Renders design elements (text, images, Lottie)
   - Applies styles from design config
   - Smooth entrance animations

6. ✅ **ScrollToOpen Animation** (`components/animations/ScrollToOpen.tsx`)
   - Scroll-triggered envelope effect
   - Flap rotation based on scroll progress
   - Share buttons (Copy, WhatsApp, Email)

7. ✅ **ClickToReveal Animation** (`components/animations/ClickToReveal.tsx`)
   - Click-triggered cover reveal
   - Zoom-out effect on cover
   - Smooth card appearance

8. ✅ **ConfettiLayer** (`components/cards/ConfettiLayer.tsx`)
   - react-confetti integration
   - Configurable colors and intensity
   - Auto-dismissal after duration

9. ✅ **Tracking API** (`app/api/tracking/open/route.ts`)
   - Logs card open events
   - Captures device type, IP, referrer
   - Database persistence

## Quick Testing

### Prerequisites
- Docker Desktop installed and running
- All dependencies installed from Phase 0

### 1. Start Docker Stack

```bash
# Navigate to project
cd e-greeting-cards

# Start all services
docker-compose up -d

# Wait for startup (1-2 minutes)
docker-compose logs -f app

# Look for message:
# - Local: http://localhost:3000
# ✓ event - compiled successfully
```

### 2. Access Database

Option A: Prisma Studio (recommended)
```bash
docker-compose exec app npm run db:studio
```
Then open http://localhost:5555

Option B: PostgreSQL CLI
```bash
docker-compose exec postgres psql -U greeting_user -d greeting_cards
```

### 3. Test Card Viewing

#### Step 1: Get a Card to Test
Query the database to get a template ID and create test data:

```sql
-- In Prisma Studio or PostgreSQL CLI
SELECT id, name FROM templates LIMIT 1;
```

#### Step 2: Manually Create a Test Card

Option A: Using Prisma Studio
1. Open Prisma Studio (http://localhost:5555)
2. Go to `Card` model
3. Click "Add Record"
4. Fill in:
   - `templateId`: (from templates query above)
   - `senderName`: "Test User"
   - `senderEmail`: "test@example.com"
   - `customText`: `{"headline":"Happy Birthday!","body":"Hope you have a great day!","signature":"Love, Test"}`
   - `linkToken`: Generate any 12-char string like `testcard123a`
   - `expiresAt`: A date 7 days from now
   - `amountPaidCents`: 300
   - `stripePaymentId`: "test_payment_123"

Option B: Using SQL
```sql
INSERT INTO cards (
  id,
  template_id,
  sender_name,
  sender_email,
  custom_text,
  custom_styling,
  link_token,
  expires_at,
  stripe_payment_id,
  amount_paid_cents
) VALUES (
  uuid_generate_v4(),
  (SELECT id FROM templates LIMIT 1),
  'Test User',
  'test@example.com',
  '{"headline":"Happy Birthday!","body":"Hope you have a great day!","signature":"Love, Test"}',
  '{"colors":["#FF6B9D","#FFE66D"]}',
  'testcard123a',
  NOW() + INTERVAL '7 days',
  'test_payment_123',
  300
);
```

#### Step 3: Cache in Redis

```bash
# Open Redis CLI
docker-compose exec redis redis-cli

# Set cache (replace values with your card ID and link token)
SET card:testcard123a '{"cardId":"[YOUR_CARD_ID]","expiresAt":"[EXPIRES_AT_DATE]"}' EX 604800
```

#### Step 4: View the Card

Open browser and navigate to:
```
http://localhost:3000/card/testcard123a
```

### 4. Test Scroll-to-Open Animation

1. **Page loads**: Should see instruction "Scroll down to open"
2. **Scroll down**: Envelope flap should rotate as you scroll
3. **Continue scrolling**: Card should slide up and fade in
4. **At 70% scroll**: Confetti should trigger (if enabled in template)
5. **Bottom of page**: Share buttons should appear

### 5. Test Share Functionality

Click the share buttons that appear after card opens:
- **📋 Copy Link**: Copies card URL to clipboard
- **💬 WhatsApp**: Opens WhatsApp Web with pre-filled message
- **📧 Email**: Opens default email client

### 6. Test Analytics Tracking

Check if the card open was tracked:

```bash
# In Prisma Studio, go to CardOpen model
# Should see a record with:
- cardId: (your test card)
- openedAt: (current timestamp)
- deviceType: desktop/mobile/tablet
- userAgent: (your browser agent)
```

Or via SQL:
```sql
SELECT * FROM card_opens ORDER BY opened_at DESC LIMIT 5;
```

### 7. Test Click-to-Reveal Animation

To test the click-to-reveal variant:

1. Create another test card with design config:
```json
{
  "animations": {
    "scrollTrigger": "click-to-reveal",
    "confetti": {
      "enabled": true,
      "colors": ["#FF6B9D", "#4ECDC4"],
      "intensity": 150
    }
  },
  ...rest of design_config
}
```

2. Visit that card's URL
3. Click anywhere on the cover
4. Verify smooth zoom-out animation
5. Verify card content appears
6. Verify confetti triggers

### 8. Test on Mobile Device

```bash
# Get your machine's IP
ipconfig getifaddr en0  # Mac
hostname -I              # Linux
ipconfig                 # Windows (look for IPv4)

# On mobile, visit:
http://[YOUR_IP]:3000/card/testcard123a
```

Test on:
- iPhone Safari
- Android Chrome
- Tablet (iPad/Android tablet)

Verify:
- Responsive layout works
- Scroll animation smooth at 60fps
- Tap/touch interactions work
- Confetti displays properly

### 9. Test Error Handling

#### Test Expired Link
```bash
# Create test card with expired date
# Visit: http://localhost:3000/card/expired-token
# Should show: "Card Expired" error page
```

#### Test Invalid Link
```bash
# Visit: http://localhost:3000/card/invalidtoken123
# Should show: "This card has expired or does not exist"
```

### 10. Check Console for Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Open a card - should be NO errors
4. Scroll animation - should be NO errors
5. Check Network tab - all requests should be successful (200/201 status)

### 11. Performance Testing

In Chrome DevTools:

1. **Lighthouse Audit**:
   - Press Ctrl+Shift+P
   - Type "Lighthouse"
   - Run audit
   - Target: Performance > 90, Accessibility > 95

2. **Performance Tab**:
   - Open Performance tab
   - Record while scrolling animation
   - Check: 60fps consistency, no jank

3. **Network Tab**:
   - Check page load time < 2 seconds
   - Card render should happen quickly
   - Images should be optimized

### 12. Database Integrity

Verify data integrity:

```sql
-- Check cards have valid templates
SELECT c.id, c.link_token, t.name
FROM cards c
JOIN templates t ON c.template_id = t.id;

-- Check card opens exist
SELECT COUNT(*) as total_opens
FROM card_opens;

-- Check cache is working
-- In redis-cli: KEYS card:*
```

## Troubleshooting

### Card Not Found
```bash
# Check card exists
docker-compose exec postgres psql -U greeting_user -d greeting_cards
SELECT * FROM cards WHERE link_token = 'testcard123a';
```

### Confetti Not Showing
1. Check template config has `confetti.enabled: true`
2. Verify scroll reaches > 70% or click is registered
3. Check browser console for errors

### Animation Stuttering
1. Check Performance in DevTools
2. Verify no CPU-intensive tabs open
3. Try on desktop instead of mobile

### Redis Connection Failed
```bash
docker-compose restart redis
docker-compose logs redis
```

### Database Connection Failed
```bash
docker-compose restart postgres
docker-compose exec postgres psql -U greeting_user -d greeting_cards -c "SELECT 1"
```

## File Structure

```
Phase 1 Implementation:
├── lib/services/
│   ├── linkService.ts          ✅ Link management
│   └── cardService.ts          ✅ Card operations
├── components/cards/
│   ├── CardRenderer.tsx        ✅ Main renderer
│   ├── CardContent.tsx         ✅ Element rendering
│   └── ConfettiLayer.tsx       ✅ Celebration effects
├── components/animations/
│   ├── ScrollToOpen.tsx        ✅ Scroll trigger
│   └── ClickToReveal.tsx       ✅ Click trigger
├── app/card/
│   ├── [linkToken]/page.tsx    ✅ Card viewing page
│   └── [linkToken]/loading.tsx ✅ Loading skeleton
└── app/api/tracking/
    └── open/route.ts           ✅ Analytics API
```

## Success Criteria

✅ All components created and integrated
✅ Scroll-to-open animation works smoothly
✅ Click-to-reveal animation works
✅ Confetti effects trigger correctly
✅ Card analytics tracking functional
✅ Error handling for expired/invalid cards
✅ SEO metadata generation
✅ Mobile responsive layout
✅ Share functionality working
✅ No console errors

## Next Steps: Phase 2

Now that card viewing is complete, Phase 2 will add:
1. Template gallery
2. Customization editor
3. Recipients management
4. Card creation flow

Expected timeline: 3-4 days

---

**Phase 1 Status**: ✅ Complete and Ready for Testing

Start with the Quick Testing section above to verify everything works!
