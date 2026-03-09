import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'nodejs';

/**
 * Track card open event
 * Logs when a recipient views a card
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkToken, userAgent, referrer, timestamp } = body;

    if (!linkToken) {
      return NextResponse.json(
        { error: 'linkToken is required' },
        { status: 400 }
      );
    }

    // Find card by link token
    const card = await prisma.card.findUnique({
      where: { linkToken },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Extract IP address from request headers
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      'unknown';

    // Detect device type from user agent
    const deviceType = detectDeviceType(userAgent);

    // Create open tracking record
    const cardOpen = await prisma.cardOpen.create({
      data: {
        cardId: card.id,
        userAgent: userAgent || null,
        ipAddress: ipAddress,
        referrer: referrer || null,
        deviceType: deviceType,
        openedAt: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Card open tracked',
        openId: cardOpen.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking card open:', error);

    return NextResponse.json(
      {
        error: 'Failed to track card open',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Detect device type from user agent string
 */
function detectDeviceType(userAgent: string | undefined): string {
  if (!userAgent) return 'unknown';

  if (/mobile|android|iphone|iPad|phone/i.test(userAgent)) {
    return 'mobile';
  }

  if (/tablet|ipad/i.test(userAgent)) {
    return 'tablet';
  }

  return 'desktop';
}
