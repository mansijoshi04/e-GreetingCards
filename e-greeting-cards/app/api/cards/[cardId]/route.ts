import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/cards/[cardId]
 * Get card details by card ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params;

    if (!cardId) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true,
            tier: true,
            priceCents: true,
          },
        },
        recipients: {
          select: {
            recipientEmail: true,
            emailSentAt: true,
            firstOpenedAt: true,
            openCount: true,
          },
        },
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Only return card if it's paid (or within reasonable time of creation for session-based viewing)
    // For confirmation page, we allow viewing if created recently and in session
    const createdAtTime = card.createdAt.getTime();
    const nowTime = new Date().getTime();
    const fiveMinutesMs = 5 * 60 * 1000;

    // Allow viewing if paid OR created within last 5 minutes (for confirmation page)
    if (!card.isPaid && nowTime - createdAtTime > fiveMinutesMs) {
      return NextResponse.json(
        { error: 'Card not ready yet' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        id: card.id,
        linkToken: card.linkToken,
        senderName: card.senderName,
        senderEmail: card.senderEmail,
        template: card.template,
        recipients: card.recipients,
        expiresAt: card.expiresAt,
        createdAt: card.createdAt,
        isPaid: card.isPaid,
        recipientCount: card.recipients.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching card:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch card',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
