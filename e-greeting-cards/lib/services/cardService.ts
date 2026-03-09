import { prisma } from '@/lib/db/prisma';
import redis from '@/lib/db/redis';
import { generateLinkToken, cacheCardLink } from './linkService';

/**
 * Card creation data
 */
export interface CardCreationData {
  templateId: string;
  senderName: string;
  senderEmail?: string;
  customText: {
    headline: string;
    body: string;
    signature: string;
  };
  customStyling?: Record<string, any>;
  recipients: string[];
  amountCents: number;
  stripePaymentId: string;
}

/**
 * Create a new card
 */
export async function createCard(cardData: CardCreationData) {
  // Generate unique link token
  const linkToken = await generateLinkToken();

  // Calculate expiry (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create card record
  const card = await prisma.card.create({
    data: {
      templateId: cardData.templateId,
      senderName: cardData.senderName,
      senderEmail: cardData.senderEmail || null,
      customText: cardData.customText,
      customStyling: cardData.customStyling || {},
      linkToken,
      expiresAt,
      stripePaymentId: cardData.stripePaymentId,
      amountPaidCents: cardData.amountCents,
    },
    include: {
      template: true,
    },
  });

  // Cache in Redis for fast access
  await cacheCardLink(linkToken, card.id, expiresAt);

  // Create recipient records
  const recipients = await Promise.all(
    cardData.recipients.map((email) =>
      prisma.recipient.create({
        data: {
          cardId: card.id,
          recipientEmail: email,
        },
      })
    )
  );

  return {
    card,
    recipients,
    cardUrl: `${process.env.BASE_URL}/card/${linkToken}`,
  };
}

/**
 * Get card with all details
 */
export async function getCard(cardId: string) {
  return await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      template: true,
      recipients: true,
      opens: true,
    },
  });
}

/**
 * Get card statistics
 */
export async function getCardStats(cardId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      recipients: true,
      opens: true,
    },
  });

  if (!card) return null;

  return {
    cardId,
    totalRecipients: card.recipients.length,
    totalOpens: card.opens.length,
    uniqueOpeners: new Set(
      card.opens.map((open) => open.recipientId).filter(Boolean)
    ).size,
    createdAt: card.createdAt,
    expiresAt: card.expiresAt,
    lastAccessedAt: card.lastAccessedAt,
  };
}

/**
 * Delete a card (and related data)
 */
export async function deleteCard(cardId: string) {
  return await prisma.card.delete({
    where: { id: cardId },
  });
}
