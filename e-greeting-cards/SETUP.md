# Docker Setup Guide

This project is fully containerized using Docker and Docker Compose. Everything runs in containers for consistent development and deployment.

## Prerequisites

- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose** - Usually included with Docker Desktop
- **Git** - For cloning the repository

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-greeting-cards
```

### 2. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

The `.env.local` file will be used by Docker Compose. Key variables:
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name
- `REDIS_PORT` - Redis port
- `APP_PORT` - Next.js application port

Add your API keys for production features:
- `STRIPE_SECRET_KEY` - Get from Stripe dashboard
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Get from Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` - For webhook verification
- `SENDGRID_API_KEY` - Get from SendGrid account
- `SENDGRID_FROM_EMAIL` - Email address for sending cards

### 3. Start the Application

```bash
docker-compose up -d
```

This command will:
1. Build the Next.js Docker image
2. Start PostgreSQL container
3. Start Redis container
4. Start Next.js application container
5. Run database migrations
6. Seed initial templates

The process takes 1-2 minutes on first run.

### 4. Verify Setup

Check if all containers are running:
```bash
docker-compose ps
```

Expected output:
```
NAME                    STATUS
greeting-cards-db       Up (healthy)
greeting-cards-redis    Up (healthy)
greeting-cards-app      Up
```

View application logs:
```bash
docker-compose logs -f app
```

Wait for the "Ready on" message:
```
event - compiled client and server successfully (123 modules)
- Local:        http://localhost:3000
```

### 5. Access the Application

Open your browser:
- **Application**: http://localhost:3000
- **Prisma Studio** (database UI): `docker-compose exec app npm run db:studio`

## Common Docker Commands

### View Logs

```bash
# View app logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# View Redis logs
docker-compose logs -f redis

# View all logs
docker-compose logs -f
```

### Database Operations

```bash
# Run migrations
docker-compose exec app npm run db:migrate

# Seed database
docker-compose exec app npm run db:seed

# Open Prisma Studio
docker-compose exec app npm run db:studio

# Access PostgreSQL directly
docker-compose exec postgres psql -U greeting_user -d greeting_cards
```

### Stop Services

```bash
# Stop all containers (keeps data)
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# Stop specific service
docker-compose stop app
```

### Rebuild Containers

```bash
# Rebuild the app image after code changes
docker-compose up -d --build app

# Full rebuild of all services
docker-compose up -d --build
```

## Development Workflow

### Making Code Changes

1. **Frontend/API Changes**: Changes are automatically detected and hot-reloaded
   - Modify files in `app/`, `components/`, or `lib/`
   - Next.js dev server will automatically rebuild

2. **Database Schema Changes**:
   ```bash
   docker-compose exec app npm run db:migrate
   ```

3. **Adding New Templates**:
   - Add template to `prisma/seed.ts`
   - Run: `docker-compose exec app npm run db:seed`

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

```bash
# On Linux/Mac
lsof -i :3000  # Find process using port 3000
kill -9 <PID>   # Kill the process

# Or change the port in .env.local
APP_PORT=3001
```

### Database Connection Errors

```bash
# Check if PostgreSQL container is healthy
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Redis Connection Errors

```bash
# Check Redis container
docker-compose ps

# Restart Redis
docker-compose restart redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Need Fresh Start

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d
```

## Testing Stripe Payments

Use test card for development:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **Name**: Any name

## Testing Email

By default, emails are sent through SendGrid in development mode.

To test without SendGrid:
1. Leave `SENDGRID_API_KEY` blank
2. Email sending will log to console instead
3. Check Docker logs: `docker-compose logs -f app`

## Performance Tips

### Faster Development

- Use `docker-compose exec` instead of rebuilding containers
- Keep volumes mounted for code changes
- Use Prisma Studio for database inspection instead of CLI commands

### Resource Management

```bash
# Limit container resources in docker-compose.yml
services:
  app:
    mem_limit: 1gb
    cpus: 1
```

## Deploying to Production

### Using Vercel

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Connect Vercel Postgres and Redis services
4. Vercel automatically builds and deploys

### Using Docker Swarm/Kubernetes

1. Use the `Dockerfile` for production image
2. Replace database connection strings with production databases
3. Deploy with orchestration platform

## File Volumes

These directories are mounted for development:

```
.:/app                  # Source code
/app/node_modules       # Node modules (cached)
/app/.next             # Build output
postgres_data:/var/lib/postgresql/data  # Database persistence
redis_data:/data       # Redis persistence
```

## Next Steps

1. **Create First Card**: Visit http://localhost:3000
2. **Customize a Template**: Browse and select a template
3. **Test Payment**: Use test Stripe card
4. **View Dashboard**: Check `docker-compose ps`
5. **Review Code**: Explore `app/`, `components/`, and `lib/` directories

## Need Help?

- Check Docker logs: `docker-compose logs -f`
- Review `.env.local` configuration
- Ensure Docker Desktop is running
- Check Docker has sufficient disk space
- Verify all ports are available (3000, 5432, 6379)

## More Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
