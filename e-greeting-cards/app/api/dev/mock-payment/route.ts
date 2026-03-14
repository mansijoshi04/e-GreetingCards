import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendCardEmailsToRecipients } from '@/lib/services/emailService';

export const runtime = 'nodejs';

/**
 * POST /api/dev/mock-payment
 * DEV ONLY: Mock a successful payment without Paddle webhook
 * Useful for testing the full flow locally without ngrok
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 404 }
    );
  }

  try {
    const body: { cardId: string } = await request.json();

    if (!body.cardId) {
      return NextResponse.json(
        { error: 'Missing cardId' },
        { status: 400 }
      );
    }

    // Fetch the card
    const card = await prisma.card.findUnique({
      where: { id: body.cardId },
      include: { template: true, recipients: true },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    if (card.isPaid) {
      return NextResponse.json(
        { error: 'Card is already marked as paid' },
        { status: 400 }
      );
    }

    // Mark card as paid
    await prisma.card.update({
      where: { id: body.cardId },
      data: {
        isPaid: true,
        stripePaymentId: `dev_mock_${Date.now()}`,
      },
    });

    // Send emails to all recipients
    try {
      const recipientEmails = card.recipients.map((r: { recipientEmail: string }) => r.recipientEmail);
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const cardUrl = `${baseUrl}/card/${card.linkToken}`;

      const emailResult = await sendCardEmailsToRecipients(recipientEmails, {
        cardUrl,
        senderName: card.senderName,
        cardCategory: card.template.category,
        expiresAt: card.expiresAt,
      });

      // Update email_sent_at for all recipients
      await prisma.recipient.updateMany({
        where: { cardId: body.cardId },
        data: { emailSentAt: new Date() },
      });

      console.log(
        `[DEV MOCK] Emails logged for card ${body.cardId}: ${emailResult.succeeded} succeeded, ${emailResult.failed} failed`
      );
    } catch (emailError) {
      console.error(`Error logging emails for card ${body.cardId}:`, emailError);
    }

    return NextResponse.json(
      {
        success: true,
        cardId: body.cardId,
        linkToken: card.linkToken,
        cardUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/card/${card.linkToken}`,
        message: 'Mock payment processed. Check console for email details.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dev mock payment error:', error);

    return NextResponse.json(
      {
        error: 'Mock payment failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
