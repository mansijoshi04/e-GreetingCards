# E-Greeting Card Platform - Project Context

## Project Overview

An interactive web-based greeting card platform where users can create, customize, and send digital celebration cards through shareable links. The platform focuses on making digital greetings feel special through animations, interactivity, and beautiful design.

**Core Value Proposition:** Affordable ($3-5) celebration cards with delightful animations (scroll-to-open, confetti effects) that can be sent to multiple recipients via email or messaging apps.

---

## Business Model

### Pricing Structure
- **Basic Cards**: $3 (simple animations, standard templates)
- **Premium Cards**: $5 (advanced animations, premium designs)
- Per-card payment model (no subscriptions)

### Key Features
- Multi-recipient support (up to 15 people per card)
- 7-day link expiry (creates sense of occasion)
- Share via email or messaging (WhatsApp, SMS)
- Mobile-optimized (most cards opened on phones)

### Target Audience
- People celebrating birthdays, anniversaries, graduations
- Those who want more than a text message but less formal than physical cards
- Users who value convenience and digital-first experiences

---

## Technical Architecture

### Tech Stack

**Frontend**
- **React** with TypeScript (type safety, component reusability)
- **Next.js** (SSR for card previews, API routes)
- **Tailwind CSS** (rapid styling, responsive design)
- **Framer Motion** (scroll animations, transitions)
- **react-confetti** (celebration effects)

**Backend**
- **Next.js API Routes** (serverless functions)
- **PostgreSQL** (relational data: cards, recipients, templates)
- **Redis** (link expiry management, caching)
- **Hostinger VPS** (hosting — Docker Compose, Nginx reverse proxy)

**Third-Party Services**
- **Paddle** (payment processing — migrated from Stripe)
- **Resend** (email delivery — free tier, 3k emails/month)
- **AWS S3/Cloudinary** (image/design asset storage — future)

### Why These Choices?

**Next.js over separate backend:**
- Simpler deployment (single codebase)
- Better SEO for card previews (important for sharing)
- Built-in API routes eliminate separate Express server

**VPS + Docker over Vercel/serverless:**
- Full control over Postgres and Redis (no managed service costs)
- Same Docker Compose stack locally and in production — no environment surprises
- Hostinger VPS already hosts other apps (mansijoshi.ca, resumekickstarter.com, penpond.com)
- Nginx handles routing and SSL (Certbot/Let's Encrypt)

**PostgreSQL over NoSQL:**
- Relational data (cards → recipients, templates → cards)
- ACID compliance for payments
- Strong querying for analytics

**Redis for expiry:**
- Fast O(1) lookups for link validation
- Built-in TTL (Time To Live) for automatic cleanup
- Reduces database load

---

## Database Schema

### Core Tables

```sql
-- Card Templates (pre-designed layouts)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,                    -- "Balloon Party", "Rose Petals"
  category VARCHAR(50) NOT NULL,                 -- birthday, anniversary, graduation
  tier VARCHAR(20) NOT NULL,                     -- basic, premium
  price_cents INTEGER NOT NULL,                  -- 300 or 500
  thumbnail_url TEXT NOT NULL,                   -- S3 URL for preview
  design_config JSONB NOT NULL,                  -- Full design specification
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User-Created Cards
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) NOT NULL,
  
  -- Sender Information
  sender_email VARCHAR(255),                     -- Optional (can be anonymous)
  sender_name VARCHAR(100) NOT NULL,
  
  -- Card Content
  custom_text JSONB NOT NULL,                    -- {headline, body, signature}
  custom_styling JSONB,                          -- {colors, fonts} overrides
  
  -- Link Management
  link_token VARCHAR(12) UNIQUE NOT NULL,        -- Short unique code
  expires_at TIMESTAMP NOT NULL,                 -- 7 days from creation
  
  -- Payment
  stripe_payment_id VARCHAR(100),
  amount_paid_cents INTEGER NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP
);

-- Recipients (many-to-one with cards)
CREATE TABLE recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  
  -- Tracking
  email_sent_at TIMESTAMP,
  first_opened_at TIMESTAMP,                     -- NULL until opened
  open_count INTEGER DEFAULT 0,
  last_opened_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics (detailed tracking)
CREATE TABLE card_opens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES recipients(id),   -- NULL for anonymous opens
  
  -- Context
  opened_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,                                 -- How they found the link
  device_type VARCHAR(50)                        -- mobile, desktop, tablet
);

-- Indexes for performance
CREATE INDEX idx_cards_link_token ON cards(link_token);
CREATE INDEX idx_cards_expires_at ON cards(expires_at);
CREATE INDEX idx_recipients_card_id ON recipients(card_id);
CREATE INDEX idx_card_opens_card_id ON card_opens(card_id);
```

### Design Configuration Format

Each template's `design_config` JSONB field contains:

```json
{
  "version": "1.0",
  "animations": {
    "entrance": "fade-in-scale",                 -- How card first appears
    "scrollTrigger": "envelope-open",            -- scroll-to-open, click-to-reveal, auto-play
    "confetti": {
      "enabled": true,
      "colors": ["#FF6B9D", "#FFE66D", "#4ECDC4"],
      "intensity": 200,                          -- particle count
      "trigger": "onReveal"                      -- when to fire
    }
  },
  "layout": {
    "backgroundType": "gradient",                -- solid, gradient, image
    "backgroundValue": ["#FFE5EC", "#FFC4D6"],   -- gradient stops
    "containerStyle": "centered",                -- centered, full-bleed
    "aspectRatio": "16:9"                        -- for consistent sizing
  },
  "elements": [
    {
      "id": "headline",
      "type": "text",
      "defaultText": "Happy Birthday!",
      "position": { "top": "20%", "left": "50%" },
      "style": {
        "fontSize": "48px",
        "fontFamily": "Poppins",
        "fontWeight": "700",
        "color": "#FF6B9D",
        "textAlign": "center",
        "maxWidth": "80%"
      },
      "editable": true,                          -- User can customize
      "animations": {
        "entrance": { "type": "fadeInUp", "delay": 0.3 }
      }
    },
    {
      "id": "body",
      "type": "text",
      "defaultText": "Hope your day is filled with joy!",
      "position": { "top": "45%", "left": "50%" },
      "style": {
        "fontSize": "20px",
        "fontFamily": "Inter",
        "color": "#333333",
        "textAlign": "center",
        "maxWidth": "70%",
        "lineHeight": "1.6"
      },
      "editable": true,
      "animations": {
        "entrance": { "type": "fadeInUp", "delay": 0.6 }
      }
    },
    {
      "id": "signature",
      "type": "text",
      "defaultText": "Love, Sarah",
      "position": { "bottom": "15%", "right": "10%" },
      "style": {
        "fontSize": "18px",
        "fontFamily": "Dancing Script",
        "color": "#666666",
        "fontStyle": "italic"
      },
      "editable": true,
      "animations": {
        "entrance": { "type": "fadeIn", "delay": 0.9 }
      }
    },
    {
      "id": "animation-balloons",
      "type": "lottie",                          -- Animated illustration
      "assetUrl": "/animations/balloons.json",   -- Lottie file from S3
      "position": { "bottom": "0", "left": "0" },
      "size": { "width": "300px", "height": "300px" },
      "loop": true,
      "editable": false                          -- Part of template design
    }
  ],
  "customizableProperties": [
    "headline.text",
    "headline.color",
    "body.text",
    "signature.text",
    "layout.backgroundValue"
  ]
}
```

---

## Card Rendering System

### HTML/CSS Approach (Not Canvas)

**Why HTML over Canvas Element:**
1. **Responsive** - Works seamlessly across devices
2. **Accessible** - Screen readers can parse content
3. **SEO-friendly** - Search engines can preview cards
4. **Easier text rendering** - No manual text layout calculations
5. **Better tooling** - React components, Tailwind utilities
6. **Shareable previews** - Social media cards work properly

### Component Architecture

```tsx
// Card rendering hierarchy
<CardPage>                          // Full page wrapper
  <CardContainer>                   // Handles layout, background
    <AnimationWrapper>              // Manages entrance animations
      <ScrollTrigger>               // Detects scroll for interactions
        <CardContent>               // Actual card elements
          <TextElement />
          <TextElement />
          <AnimatedGraphic />
        </CardContent>
      </ScrollTrigger>
    </AnimationWrapper>
    <ConfettiLayer />              // Overlays confetti
  </CardContainer>
</CardPage>
```

### Rendering Process

1. **Fetch card data** from API using `link_token`
2. **Validate expiry** (check Redis, fallback to Postgres)
3. **Load template** and merge with custom content
4. **Parse design config** into React components
5. **Initialize animations** based on trigger type
6. **Track open event** (log to analytics, update recipient record)

---

## Animation Implementation

### 1. Scroll-to-Open (Envelope Effect)

**Concept:** User scrolls down, envelope flap rotates open, card slides out

**Implementation with Framer Motion:**

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

function EnvelopeCard({ content, design }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Map scroll progress to rotation angle
  const flapRotation = useTransform(
    scrollYProgress, 
    [0, 0.5],          // From start to midpoint
    [0, -180]          // Flap rotates from 0° to -180°
  );
  
  // Map scroll to card reveal position
  const cardY = useTransform(
    scrollYProgress,
    [0.2, 0.8],        // Starts moving at 20%, stops at 80%
    [400, 0]           // From 400px below to 0
  );
  
  const cardOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    [0, 1]
  );

  return (
    <div ref={containerRef} className="h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Envelope body (static) */}
        <div className="absolute w-96 h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-xl" />
        
        {/* Envelope flap (rotates) */}
        <motion.div 
          className="absolute w-96 h-48 bg-gradient-to-br from-red-200 to-red-300 origin-bottom"
          style={{ 
            rotateX: flapRotation,
            transformStyle: 'preserve-3d',
            top: 0
          }}
        />

        {/* Card content (slides out) */}
        <motion.div
          className="absolute w-80 bg-white rounded-lg shadow-2xl p-8"
          style={{ 
            y: cardY,
            opacity: cardOpacity
          }}
        >
          <h1 className="text-4xl font-bold text-center mb-4">
            {content.headline}
          </h1>
          <p className="text-lg text-center text-gray-700 mb-6">
            {content.body}
          </p>
          <p className="text-right italic text-gray-600">
            {content.signature}
          </p>
        </motion.div>

      </div>
    </div>
  );
}
```

**User Experience:**
- Page loads with envelope closed at top of viewport
- As user scrolls, flap opens smoothly
- Card appears to slide out from inside envelope
- Once fully revealed, user can read content
- Scroll position is "sticky" - envelope stays in view

### 2. Click-to-Reveal

**Concept:** User clicks anywhere, cover layer zooms out/fades, reveals card

```tsx
function ClickToReveal({ content }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    // Trigger confetti after reveal animation
    setTimeout(() => setShowConfetti(true), 800);
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      
      {/* Cover layer - scales and fades out */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 cursor-pointer flex items-center justify-center"
        onClick={handleReveal}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ 
          scale: isRevealed ? 20 : 1,
          opacity: isRevealed ? 0 : 1 
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut" 
        }}
      >
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">You've got a card! 🎉</h2>
          <p className="text-xl">Click anywhere to open</p>
        </div>
      </motion.div>

      {/* Card content - fades and scales in */}
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-12 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          scale: isRevealed ? 1 : 0.8
        }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <CardContent {...content} />
      </motion.div>

      {/* Confetti overlay */}
      {showConfetti && <ConfettiEffect />}

    </div>
  );
}
```

### 3. Confetti Implementation

```tsx
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function ConfettiEffect({ colors, intensity = 200, duration = 5000 }) {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Stop confetti after duration
    const timer = setTimeout(() => setIsActive(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isActive) return null;

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={intensity}
      colors={colors || ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3']}
      recycle={false}                    // Don't loop
      gravity={0.3}                      // Natural fall speed
      wind={0.01}                        // Slight drift
      initialVelocityY={20}              // Shoot upward first
    />
  );
}
```

---

## Link Management System

### Link Generation

```typescript
// When user completes payment
async function createCardLink(cardData: CardCreationData) {
  // Generate short, unique token
  const linkToken = generateShortToken(12); // e.g., "a7b3k9m2p5q1"
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  // Store in database
  const card = await prisma.cards.create({
    data: {
      template_id: cardData.templateId,
      sender_name: cardData.senderName,
      sender_email: cardData.senderEmail,
      custom_text: cardData.customText,
      custom_styling: cardData.customStyling,
      link_token: linkToken,
      expires_at: expiresAt,
      stripe_payment_id: cardData.paymentId,
      amount_paid_cents: cardData.amountCents
    }
  });

  // Store in Redis for fast expiry checks
  await redis.setex(
    `card:${linkToken}`,
    7 * 24 * 60 * 60,                   // 7 days in seconds
    JSON.stringify({
      cardId: card.id,
      expiresAt: expiresAt.toISOString()
    })
  );

  return {
    cardId: card.id,
    linkToken,
    fullUrl: `${process.env.BASE_URL}/card/${linkToken}`
  };
}

// Helper function for token generation
function generateShortToken(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  });
  
  // Verify uniqueness in database
  const exists = await prisma.cards.findUnique({
    where: { link_token: token }
  });
  
  if (exists) {
    return generateShortToken(length); // Retry if collision
  }
  
  return token;
}
```

### Link Validation (When Card is Accessed)

```typescript
async function validateAndFetchCard(linkToken: string) {
  // 1. Check Redis first (fast path)
  const cached = await redis.get(`card:${linkToken}`);
  
  if (!cached) {
    return { 
      error: 'EXPIRED', 
      message: 'This card has expired or does not exist.' 
    };
  }

  const { cardId, expiresAt } = JSON.parse(cached);
  
  // 2. Double-check expiry (Redis TTL might be slightly off)
  if (new Date(expiresAt) < new Date()) {
    await redis.del(`card:${linkToken}`);
    return { 
      error: 'EXPIRED', 
      message: 'This card has expired.' 
    };
  }

  // 3. Fetch full card data from database
  const card = await prisma.cards.findUnique({
    where: { id: cardId },
    include: {
      template: true,         // Include template design
      recipients: true        // Include recipient list
    }
  });

  if (!card) {
    return { 
      error: 'NOT_FOUND', 
      message: 'Card not found.' 
    };
  }

  // 4. Update last accessed timestamp
  await prisma.cards.update({
    where: { id: cardId },
    data: { last_accessed_at: new Date() }
  });

  return { success: true, card };
}
```

---

## Multi-Recipient System

### Email Sending Flow

```typescript
async function sendCardToRecipients(
  cardId: string, 
  recipientEmails: string[]
) {
  // Fetch card details
  const card = await prisma.cards.findUnique({
    where: { id: cardId },
    include: { template: true }
  });

  const cardUrl = `${process.env.BASE_URL}/card/${card.link_token}`;

  // Create recipient records
  const recipients = await Promise.all(
    recipientEmails.map(email =>
      prisma.recipients.create({
        data: {
          card_id: cardId,
          recipient_email: email,
          email_sent_at: new Date()
        }
      })
    )
  );

  // Send emails via SendGrid
  const emailPromises = recipientEmails.map(email => {
    const msg = {
      to: email,
      from: 'cards@yourdomain.com',
      subject: `${card.sender_name} sent you a ${card.template.category} card! 🎉`,
      html: generateEmailHTML(card, cardUrl)
    };
    
    return sendgrid.send(msg);
  });

  await Promise.all(emailPromises);

  return { 
    success: true, 
    recipientCount: recipientEmails.length,
    cardUrl 
  };
}

function generateEmailHTML(card: Card, cardUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header Image -->
        <div style="background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">You've Received a Card! 🎉</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px; text-align: center;">
          <p style="font-size: 18px; color: #333; margin-bottom: 10px;">
            <strong>${card.sender_name}</strong> sent you a special ${card.template.category} card
          </p>
          <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
            Click below to view your card
          </p>

          <!-- CTA Button -->
          <a href="${cardUrl}" 
             style="display: inline-block; padding: 16px 40px; background-color: #FF6B9D; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
            Open Your Card
          </a>

          <!-- Expiry Notice -->
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            ⏰ This card will expire in 7 days
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            Want to send your own card? <a href="${process.env.BASE_URL}" style="color: #FF6B9D;">Get started</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}
```

### Tracking Opens

```typescript
async function trackCardOpen(
  linkToken: string,
  recipientEmail: string | null,
  context: {
    userAgent: string;
    ipAddress: string;
    referrer: string;
  }
) {
  const card = await prisma.cards.findUnique({
    where: { link_token: linkToken }
  });

  if (!card) return;

  // Find recipient record if email provided
  let recipient = null;
  if (recipientEmail) {
    recipient = await prisma.recipients.findFirst({
      where: { 
        card_id: card.id, 
        recipient_email: recipientEmail 
      }
    });

    if (recipient) {
      // Update recipient tracking
      await prisma.recipients.update({
        where: { id: recipient.id },
        data: {
          first_opened_at: recipient.first_opened_at || new Date(),
          last_opened_at: new Date(),
          open_count: { increment: 1 }
        }
      });
    }
  }

  // Log detailed analytics
  await prisma.card_opens.create({
    data: {
      card_id: card.id,
      recipient_id: recipient?.id,
      user_agent: context.userAgent,
      ip_address: context.ipAddress,
      referrer: context.referrer,
      device_type: detectDeviceType(context.userAgent)
    }
  });
}

function detectDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}
```

---

## User Flows

### Sender Journey (Step-by-Step)

```
1. Landing Page
   ├─ Browse templates by category
   ├─ See pricing ($3 basic, $5 premium)
   └─ Click "Create Card"

2. Template Selection
   ├─ Filter by occasion (Birthday, Anniversary, etc.)
   ├─ Preview animation on hover
   └─ Select template → "Customize This"

3. Customization Editor
   ├─ Edit headline text
   ├─ Edit body message
   ├─ Edit signature
   ├─ Choose color palette (3-4 preset options)
   ├─ Preview live changes
   └─ Click "Next"

4. Add Recipients
   ├─ Enter up to 15 email addresses
   ├─ Option to add names (for personalization)
   └─ Click "Continue to Payment"

5. Payment
   ├─ Stripe checkout ($3 or $5)
   └─ Process payment

6. Confirmation & Sharing
   ├─ Card created successfully
   ├─ Display shareable link
   ├─ Copy link button
   ├─ Send via Email button (triggers email to recipients)
   ├─ Share on WhatsApp button
   └─ Dashboard link (see open stats)
```

### Recipient Journey

```
1. Receive Notification
   ├─ Email lands in inbox
   └─ Click "Open Your Card" button

2. Card Page Loads
   ├─ URL: yoursite.com/card/abc123xyz
   ├─ Check expiry (show error if expired)
   └─ Load card design + content

3. Interactive Experience
   ├─ Scroll-to-open animation plays
   │  OR Click-to-reveal interaction
   ├─ Card content appears
   └─ Confetti triggers (if enabled)

4. After Viewing
   ├─ Option to share on social media
   └─ CTA: "Create your own card" (growth loop)
```

---

## Initial Template Library (MVP)

### 12 Templates at Launch

**Birthday (4 templates)**

1. **"Balloon Party"** - Basic ($3)
   - Floating balloons illustration (Lottie animation)
   - Confetti on reveal
   - Bright, cheerful colors (#FF6B9D, #FFE66D)
   - Scroll-to-open

2. **"Cake Celebration"** - Premium ($5)
   - Animated candles with flickering flame
   - Sparkle particles
   - Elegant gold accents
   - Click-to-reveal

3. **"Minimalist Bold"** - Basic ($3)
   - Clean typography focus
   - Subtle fade-in animations
   - Monochrome + one accent color
   - Auto-play (no interaction)

4. **"Confetti Burst"** - Basic ($3)
   - Heavy confetti effect (400 particles)
   - Simple balloon illustrations
   - Rainbow colors
   - Scroll-to-open

**Anniversary (3 templates)**

5. **"Rose Petals"** - Premium ($5)
   - Falling rose petals animation
   - Romantic pink/red gradient
   - Cursive fonts
   - Scroll triggers petal fall

6. **"Heart Float"** - Basic ($3)
   - Floating hearts illustration
   - Soft pastel colors
   - Simple animations
   - Click-to-reveal

7. **"Golden Years"** - Premium ($5)
   - Elegant gold foil effect
   - Timeline visualization (years together)
   - Sophisticated typography
   - Scroll-to-open

**Graduation (3 templates)**

8. **"Cap Toss"** - Premium ($5)
   - Animated graduation caps flying
   - Confetti burst
   - School colors (customizable)
   - Click triggers cap toss

9. **"Diploma Scroll"** - Basic ($3)
   - Scroll to unroll diploma
   - Classic academic design
   - Clean serif fonts
   - Scroll-to-open

10. **"Achievement"** - Basic ($3)
    - Trophy/medal illustration
    - Gold shimmer effect
    - Bold typography
    - Auto-play

**Thank You (2 templates)**

11. **"Gratitude Flowers"** - Premium ($5)
    - Blooming flowers animation
    - Watercolor aesthetic
    - Elegant script fonts
    - Scroll triggers bloom

12. **"Simple Thanks"** - Basic ($3)
    - Minimal design
    - Focus on message
    - Clean sans-serif
    - Fade-in only

---

## Design System Specifications

### Color Palettes (Per Occasion)

```javascript
const colorThemes = {
  birthday: {
    primary: '#FF6B9D',      // Pink
    secondary: '#FFE66D',    // Yellow
    background: '#FFF5F7',   // Light pink
    accent: '#4ECDC4',       // Teal
    text: '#2C3E50'          // Dark blue-gray
  },
  anniversary: {
    primary: '#C84B6E',      // Deep rose
    secondary: '#FFB6C1',    // Light pink
    background: '#FFF0F3',   // Blush
    accent: '#D4AF37',       // Gold
    text: '#4A4A4A'
  },
  graduation: {
    primary: '#2E5090',      // Navy blue
    secondary: '#FFD700',    // Gold
    background: '#F0F4F8',   // Light blue-gray
    accent: '#00A8E8',       // Bright blue
    text: '#1A1A1A'
  },
  thankYou: {
    primary: '#6B8E23',      // Olive green
    secondary: '#F0E68C',    // Khaki
    background: '#FAFAF5',   // Off-white
    accent: '#FF6F61',       // Coral
    text: '#333333'
  },
  congratulations: {
    primary: '#FF4500',      // Orange-red
    secondary: '#FFD700',    // Gold
    background: '#FFF8E7',   // Cream
    accent: '#9370DB',       // Purple
    text: '#2F4F4F'          // Dark slate
  }
};
```

### Typography Scale

```javascript
const typography = {
  fonts: {
    headline: ['Poppins', 'Playfair Display', 'Montserrat'],
    body: ['Inter', 'Open Sans', 'Lato'],
    signature: ['Dancing Script', 'Pacifico', 'Great Vibes']
  },
  sizes: {
    headline: {
      mobile: '32px',
      tablet: '42px',
      desktop: '56px'
    },
    body: {
      mobile: '16px',
      tablet: '18px',
      desktop: '20px'
    },
    signature: {
      mobile: '16px',
      tablet: '18px',
      desktop: '20px'
    }
  },
  weights: {
    headline: 700,
    body: 400,
    signature: 400
  }
};
```

---

## MVP Scope & Timeline

### Phase 1: Core Experience (Weeks 1-2)

**Goal:** Basic card viewing works end-to-end

- [ ] Database schema setup (PostgreSQL + Prisma)
- [ ] 3 templates (1 birthday, 1 anniversary, 1 graduation)
- [ ] Basic scroll-to-open animation
- [ ] Text customization only (no colors yet)
- [ ] Link generation + expiry (Redis setup)
- [ ] Simple card viewing page

**Deliverable:** Can create a link, view a card with scroll animation

### Phase 2: Payments & Sending (Week 3)

**Goal:** Users can pay and send cards

- [ ] Stripe integration (payment flow)
- [ ] Email sending (SendGrid setup)
- [ ] Recipient management (add multiple emails)
- [ ] Tracking system (record opens)
- [ ] Confirmation page (show link, copy button)

**Deliverable:** Complete sender journey from creation to payment

### Phase 3: Polish & Features (Weeks 4-5)

**Goal:** Premium experience with all animations

- [ ] Add 9 more templates (total 12)
- [ ] Confetti effects
- [ ] Click-to-reveal option
- [ ] Color palette customization
- [ ] Mobile optimization
- [ ] Preview mode (test before paying)
- [ ] Open tracking dashboard

**Deliverable:** Full MVP with all core features

### Phase 4: Testing & Launch (Week 6)

**Goal:** Production-ready

- [ ] Beta testing (20 users, collect feedback)
- [ ] Bug fixes
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Analytics setup (track conversions, popular templates)
- [ ] Marketing landing page
- [ ] Launch 🚀

---

## Post-MVP Enhancements

### Phase 2 Features (After Launch)

**User Accounts**
- Save card history
- Re-use designs
- Template favorites

**Advanced Customization**
- Photo upload (add personal photos)
- Font selection
- Custom background images

**Scheduling**
- Schedule send date
- Auto-send on birthdays

**Collaboration**
- Group cards (multiple people contribute messages)
- Team cards for workplace celebrations

**Premium Tier**
- Unlimited recipients
- Remove branding
- Priority support

### Monetization Expansion

- **B2B**: Corporate packages for HR teams
- **White-label**: Event planners can rebrand
- **Subscriptions**: $10/month for unlimited cards
- **Custom templates**: Pay designers to create exclusive designs

---

## Technical Decisions Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| **Rendering** | HTML/CSS (not Canvas) | Responsive, accessible, SEO-friendly |
| **Animations** | Framer Motion | Best React integration, smooth scroll handling |
| **Link Expiry** | Redis + PostgreSQL | Fast lookups, reliable persistence |
| **Payments** | Paddle | Simpler tax/VAT handling than Stripe for digital goods |
| **Email** | Resend | Free up to 3k/month, simple API, great deliverability |
| **Hosting** | Hostinger VPS + Docker | Same stack as local dev, existing VPS already in use |
| **Reverse Proxy** | Nginx + Certbot | Auto-renewing SSL, consistent with other apps on VPS |
| **Image Storage** | Cloudinary (future) | CDN delivery, automatic optimization |
| **Database** | PostgreSQL (Docker) | Relational data, ACID compliance, runs in same compose stack |

---

## Key Implementation Principles

1. **Mobile-first design** - Most cards opened on phones
2. **Performance matters** - Lazy load images, optimize animations
3. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
4. **Growth loop** - Every card has "Create your own" CTA
5. **Data-driven** - Track everything (opens, conversions, popular templates)
6. **Start simple** - 3 templates to validate, expand after traction

---

## Critical Success Factors

**For Senders:**
- Customization is easy (< 2 minutes)
- Preview looks exactly like final card
- Payment is quick via Paddle checkout

**For Recipients:**
- Animations feel special (not generic)
- Works perfectly on mobile
- Loads fast (< 2 seconds)
- Easy to share socially

**For Business:**
- Conversion rate > 5% (visitors → paid cards)
- Average card sent to 3+ recipients
- 20%+ recipients click "Create your own"
- Repeat usage (users send multiple cards)

---

## Open Questions & Future Considerations

1. **Localization**: Support multiple languages?
2. **Accessibility**: Audio descriptions for animations?
3. **Offline mode**: PWA for card viewing?
4. **Video messages**: Record short video clips?
5. **Sustainability**: Plant a tree per card sent?
6. **API**: Let partners integrate card sending?

---

## Getting Started (Next Steps)

1. **Set up development environment**
   - Initialize Next.js project with TypeScript
   - Configure Tailwind CSS
   - Set up PostgreSQL (local or Vercel Postgres)
   - Install Framer Motion, react-confetti

2. **Create first template**
   - Design "Balloon Party" template
   - Implement scroll-to-open animation
   - Build customization form

3. **Implement link system**
   - Set up Redis (Upstash or local)
   - Build link generation logic
   - Create card viewing page

4. **Integrate Stripe**
   - Set up test mode
   - Build checkout flow
   - Handle webhooks

5. **Deploy to VPS**
   - SSH into Hostinger VPS
   - Clone repo, create `.env`, run `docker compose -f docker-compose.prod.yml up -d --build`
   - Configure Nginx + Certbot SSL
   - See `docs/DEPLOYMENT.md` for full walkthrough

---

## Current State (March 2026)

- **E2E flow working locally** via Docker Compose (template → customize → pay → email → view card)
- **Payment**: Paddle sandbox integrated and tested
- **Email**: Resend integrated (`emailService.ts`), Mailgun commented out for reference
- **Animations**: ScrollToOpen (envelope), ClickToReveal (cover fade), confetti, theme-aware cover screens
- **Templates**: 3 templates seeded (birthday, anniversary, graduation)
- **Deployment**: Staging (`staging.giflove.ca`) being set up on Hostinger VPS
- **CI/CD**: GitHub Actions workflows ready (`ci.yml`, `deploy-staging.yml`, `deploy-production.yml`)

### Deployment Docs
- `docs/DNS_SETUP.md` — GoDaddy DNS records (Resend + staging/prod A records)
- `docs/DEPLOYMENT.md` — Step-by-step VPS deployment for staging and production
- `docs/CICD.md` — GitHub Actions setup, SSH keys, sudoers, branch strategy
- `docs/phase_4_plan.md` — Phase 4 overview and order of operations

### Key File Locations
- `lib/services/emailService.ts` — Resend provider (Mailgun commented out)
- `lib/services/paymentService.ts` — Paddle integration
- `docker-compose.yml` — Local dev (hot reload, `prisma db push`)
- `docker-compose.prod.yml` — VPS production (built image, `prisma migrate deploy`)
- `nginx/conf.d/` — Proxy configs managed by CI/CD
- `nginx/staging.giflove.ca` + `nginx/giflove.ca` — Initial site configs (set up once, Certbot manages after)

---

**This document should provide complete context for implementing the e-greeting card platform. All technical decisions are justified, user flows are mapped, and the database schema supports the full feature set.**
