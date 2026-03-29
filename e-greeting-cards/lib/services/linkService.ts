import { prisma } from '@/lib/db/prisma';
import redis from '@/lib/db/redis';
import { getTemplateById } from '@/lib/templates/registry';

/**
 * Generate a unique link token for a card
 * Uses a 12-character alphanumeric string
 */
export async function generateLinkToken(length: number = 12): Promise<string> {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    token += chars[randomIndex];
  }

  // Check uniqueness in database
  const existing = await prisma.card.findUnique({
    where: { linkToken: token },
  });

  if (existing) {
    // Recursively generate a new token if collision occurs
    return generateLinkToken(length);
  }

  return token;
}

/**
 * Validate a card link by token
 * Checks Redis first (fast), falls back to database
 */
export async function validateLink(linkToken: string) {
  try {
    // 1. Check Redis first (O(1) lookup)
    const cached = await redis.get(`card:${linkToken}`);

    if (!cached) {
      return {
        valid: false,
        error: 'EXPIRED',
        message: 'This card has expired or does not exist.',
      };
    }

    const cached_data = JSON.parse(cached);
    const { cardId, expiresAt } = cached_data;

    // 2. Double-check expiry (Redis TTL might be slightly off)
    if (new Date(expiresAt) < new Date()) {
      await redis.del(`card:${linkToken}`);
      return {
        valid: false,
        error: 'EXPIRED',
        message: 'This card has expired.',
      };
    }

    return {
      valid: true,
      cardId,
      expiresAt,
    };
  } catch (error) {
    console.error('Error validating link:', error);

    // Fallback to database check
    const card = await prisma.card.findUnique({
      where: { linkToken },
    });

    if (!card) {
      return {
        valid: false,
        error: 'NOT_FOUND',
        message: 'Card not found.',
      };
    }

    if (new Date(card.expiresAt) < new Date()) {
      return {
        valid: false,
        error: 'EXPIRED',
        message: 'This card has expired.',
      };
    }

    return {
      valid: true,
      cardId: card.id,
      expiresAt: card.expiresAt.toISOString(),
    };
  }
}

/**
 * Cache a card link in Redis with TTL
 */
export async function cacheCardLink(
  linkToken: string,
  cardId: string,
  expiresAt: Date
): Promise<void> {
  const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

  if (ttlSeconds > 0) {
    await redis.setex(
      `card:${linkToken}`,
      ttlSeconds,
      JSON.stringify({
        cardId,
        expiresAt: expiresAt.toISOString(),
      })
    );
  }
}

/**
 * Fetch card data with template and recipients
 */
export async function fetchCardData(cardId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { recipients: true },
  });

  if (!card) return null;

  const template = getTemplateById(card.templateId) ?? null;
  return { ...card, template };
}

/**
 * Update card's last accessed timestamp
 */
export async function updateCardAccess(cardId: string): Promise<void> {
  await prisma.card.update({
    where: { id: cardId },
    data: { lastAccessedAt: new Date() },
  });
}
