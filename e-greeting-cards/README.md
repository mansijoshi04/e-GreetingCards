# E-Greeting Cards Platform

Interactive web-based greeting card platform where users can create, customize, and send digital celebration cards through shareable links. The platform focuses on making digital greetings feel special through animations, interactivity, and beautiful design.

## Features

- **12 Beautiful Templates** - Templates for birthdays, anniversaries, graduations, thank you, and more
- **Scroll-to-Open Animations** - Envelope effect that reveals the card as users scroll
- **Click-to-Reveal** - Alternative interaction mode for a different experience
- **Confetti Effects** - Celebratory particles that trigger on reveal
- **Multi-Recipient Support** - Send to up to 15 people with one card
- **Email Integration** - Automatic email sending to all recipients
- **Link Expiry System** - Cards expire after 7 days for urgency
- **Analytics Tracking** - Track when and how recipients open cards
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Animations**: Framer Motion, react-confetti
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for link expiry management
- **Payments**: Stripe
- **Email**: SendGrid
- **Hosting**: Docker (development) / Vercel (production)

## Getting Started with Docker

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-greeting-cards
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Stripe and SendGrid credentials
   ```

3. **Start the application with Docker**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Start PostgreSQL database (port 5432)
   - Start Redis cache (port 6379)
   - Start Next.js dev server (port 3000)
   - Run Prisma migrations
   - Seed initial templates

4. **View the application**
   ```
   http://localhost:3000
   ```

### Available Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Run database migrations
docker-compose exec app npm run db:migrate

# Seed database with templates
docker-compose exec app npm run db:seed

# Access database with Prisma Studio
docker-compose exec app npm run db:studio

# Stop and remove volumes (fresh start)
docker-compose down -v
```

## Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── card/              # Card viewing page
│   ├── create/            # Card creation flow
│   ├── checkout/          # Payment page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── cards/             # Card rendering
│   ├── animations/        # Animation components
│   ├── editor/            # Customization UI
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and services
│   ├── db/                # Database clients
│   ├── services/          # Business logic
│   └── constants/         # Config constants
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── docker-compose.yml     # Docker configuration
└── Dockerfile             # Container image
```

## Development Workflow

### Creating a New Card

1. Visit `http://localhost:3000`
2. Click "Create Card"
3. Select a template
4. Customize the text and colors
5. Add recipient emails (up to 15)
6. Complete payment (test mode with `4242 4242 4242 4242`)
7. Card is created and emails are sent

### Viewing a Card

Recipients can view the card at a unique link like: `http://localhost:3000/card/abc123xyz`

The scroll-to-open animation reveals the card as they scroll down the page.

## Database

### Prisma Commands

```bash
# Create a new migration
docker-compose exec app npx prisma migrate dev --name feature_name

# View database with Prisma Studio
docker-compose exec app npm run db:studio

# Generate Prisma client
docker-compose exec app npx prisma generate

# Check database connection
docker-compose exec app npx prisma db execute --stdin
```

### Database Schema

- **templates** - Card design templates
- **cards** - User-created cards
- **recipients** - Email recipients for each card
- **card_opens** - Analytics tracking

## Environment Variables

See `.env.example` for all available variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname
REDIS_URL=redis://host:port

# Stripe (test mode keys from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (API key from sendgrid.com)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=cards@domain.com
```

## Testing

### Test Stripe Payment

Use the test card: `4242 4242 4242 4242` with any future expiry date and any CVC.

### View Database

Access Prisma Studio at: `docker-compose exec app npm run db:studio`

## Roadmap

### Phase 1: Core Card Viewing (Week 1)
- ✅ Scroll-to-open animations
- ✅ Card rendering system
- ✅ Link validation and tracking

### Phase 2: Card Creation (Week 2-3)
- Template gallery
- Customization editor
- Recipients management

### Phase 3: Payment Integration (Week 3-4)
- Stripe checkout flow
- Webhook handling

### Phase 4: Email Sending (Week 4-5)
- SendGrid integration
- Confirmation page

### Phase 5: Polish & Features (Week 5-6)
- 12 templates total
- Mobile optimization
- Landing page

### Phase 6: Deployment (Week 6)
- Vercel deployment
- Production setup

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly with Docker
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please create an issue on GitHub.
