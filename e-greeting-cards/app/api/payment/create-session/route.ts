import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import redis from '@/lib/db/redis';
import { createCheckoutSession } from '@/lib/services/paymentService';
import { generateLinkToken } from '@/lib/services/linkService';
import { getTemplateById } from '@/lib/services/templateService';

export const runtime = 'nodejs';

interface CreateSessionRequest {
  templateId: string;
  senderName: string;
  senderEmail?: string;
  customText: Record<string, string>;
  customStyling?: Record<string, any>;
  recipients: string[];
}

/**
 * POST /api/payment/create-session
 * Create a card and generate a Stripe checkout session
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSessionRequest = await request.json();

    // Validate required fields
    if (
      !body.templateId ||
      !body.senderName ||
      !body.customText ||
      !body.recipients ||
      body.recipients.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch template to get price
    const template = await getTemplateById(body.templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Generate unique link token
    const linkToken = await generateLinkToken();

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create card record in database (marked as unpaid)
    const card = await prisma.card.create({
      data: {
        templateId: body.templateId,
        senderName: body.senderName,
        senderEmail: body.senderEmail || null,
        customText: JSON.stringify(body.customText),
        customStyling: body.customStyling ? JSON.stringify(body.customStyling) : null,
        linkToken,
        expiresAt,
        amountPaidCents: template.priceCents,
        isPaid: false, // Mark as unpaid initially
        stripePaymentId: null, // Will be set by webhook
      },
    });

    // Create recipient records
    await prisma.recipient.createMany({
      data: body.recipients.map((email) => ({
        cardId: card.id,
        recipientEmail: email,
      })),
    });

    // Cache the card in Redis for fast expiry checks
    await redis.setex(
      `card:${linkToken}`,
      7 * 24 * 60 * 60, // 7 days in seconds
      JSON.stringify({
        cardId: card.id,
        expiresAt: expiresAt.toISOString(),
      })
    );

    // Create Stripe checkout session
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const checkoutUrl = await createCheckoutSession({
      amountCents: template.priceCents,
      cardId: card.id,
      templateName: template.name,
      successUrl: `${baseUrl}/confirmation/${card.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/checkout`,
      metadata: {
        templateId: body.templateId,
        senderName: body.senderName,
        recipientCount: body.recipients.length,
      },
    });

    return NextResponse.json(
      {
        success: true,
        cardId: card.id,
        checkoutUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
