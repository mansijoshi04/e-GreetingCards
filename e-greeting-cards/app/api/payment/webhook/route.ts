import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyWebhookSignature, parseWebhookEvent } from '@/lib/services/paymentService';
import { sendCardEmailsToRecipients } from '@/lib/services/emailService';

export const runtime = 'nodejs';

/**
 * POST /api/payment/webhook
 * Handle Paddle webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('paddle-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing paddle-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Paddle webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook event
    let event: any;
    try {
      event = parseWebhookEvent(body, signature);
    } catch (error) {
      console.error('Failed to parse webhook event:', error);
      return NextResponse.json(
        { error: 'Invalid event format' },
        { status: 400 }
      );
    }

    // Handle transaction.completed event
    if (event.eventType === 'transaction.completed') {
      const transaction = event.data;

      // Get cardId from customData
      const cardId = transaction.customData?.cardId;

      if (cardId) {
        // Check if card already marked as paid (idempotency)
        const existingCard = await prisma.card.findUnique({
          where: { id: cardId },
          include: { template: true, recipients: true },
        });

        if (!existingCard) {
          console.error(`Card not found: ${cardId}`);
          return NextResponse.json(
            { error: 'Card not found' },
            { status: 404 }
          );
        }

        if (existingCard.isPaid) {
          console.log(`Card already marked as paid: ${cardId}`);
          return NextResponse.json({ received: true });
        }

        // Mark card as paid
        await prisma.card.update({
          where: { id: cardId },
          data: {
            isPaid: true,
            stripePaymentId: transaction.id, // Store Paddle transaction ID
          },
        });

        // Send emails to all recipients
        try {
          const recipientEmails = existingCard.recipients.map(
            (r: { recipientEmail: string }) => r.recipientEmail
          );
          const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
          const cardUrl = `${baseUrl}/card/${existingCard.linkToken}`;

          const emailResult = await sendCardEmailsToRecipients(recipientEmails, {
            cardUrl,
            senderName: existingCard.senderName,
            cardCategory: existingCard.template.category,
            expiresAt: existingCard.expiresAt,
          });

          // Update email_sent_at for all recipients
          await prisma.recipient.updateMany({
            where: { cardId },
            data: { emailSentAt: new Date() },
          });

          console.log(
            `Emails sent for card ${cardId}: ${emailResult.succeeded} succeeded, ${emailResult.failed} failed`
          );
        } catch (emailError) {
          console.error(`Error sending emails for card ${cardId}:`, emailError);
          // Don't fail the webhook - emails can be retried later
        }
      }
    }

    // Return success for all events
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
