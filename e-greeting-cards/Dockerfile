# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl so Prisma can detect the version and generate the correct binary
RUN apk add --no-cache openssl

# Copy package.json only - lock file excluded to avoid npm version conflicts between host and container
COPY package.json ./

# Install dependencies
RUN npm install --omit=optional

# Build-time env vars for NEXT_PUBLIC_* (baked into the JS bundle by Next.js)
ARG NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
ARG NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
ENV NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=$NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
ENV NEXT_PUBLIC_PADDLE_ENVIRONMENT=$NEXT_PUBLIC_PADDLE_ENVIRONMENT

# Copy source code
COPY . .

# Generate Prisma client (schema is now available)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init and openssl (openssl required for Prisma to detect OpenSSL 3.x on Alpine)
RUN apk add --no-cache dumb-init openssl

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.seed.json ./tsconfig.seed.json

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js
CMD ["npm", "run", "start"]
