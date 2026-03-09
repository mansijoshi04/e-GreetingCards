import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db/prisma';
import { constructWebhookEvent } from '@/lib/services/paymentService';
import { sendCardEmailsToRecipients } from '@/lib/services/emailService';

export const runtime = 'nodejs';

/**
 * POST /api/payment/webhook
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify and construct webhook event
    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Handle payment_intent.succeeded event
    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;

      if (charge.metadata?.cardId) {
        const cardId = charge.metadata.cardId as string;

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
            stripePaymentId: charge.payment_intent as string,
          },
        });

        // Send emails to all recipients
        try {
          const recipientEmails = existingCard.recipients.map(
            (r) => r.recipientEmail
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

    // Handle checkout.session.completed as alternative trigger
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.cardId && session.payment_status === 'paid') {
        const cardId = session.metadata.cardId as string;

        // Get the payment intent ID from the session
        const paymentIntentId = session.payment_intent as string;

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
            stripePaymentId: paymentIntentId,
          },
        });

        // Send emails to all recipients
        try {
          const recipientEmails = existingCard.recipients.map(
            (r) => r.recipientEmail
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
