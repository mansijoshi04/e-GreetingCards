import { Paddle, Environment } from '@paddle/paddle-node-sdk';

// Initialize Paddle SDK
const paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
  environment: process.env.PADDLE_ENVIRONMENT === 'production' ? Environment.production : Environment.sandbox,
});

export interface CreateCheckoutSessionParams {
  amountCents: number;
  cardId: string;
  templateName: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

/**
 * Create a Paddle transaction checkout session
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ checkoutUrl: string; transactionId: string }> {
  const {
    amountCents,
    cardId,
    templateName,
    successUrl,
    cancelUrl,
    metadata = {},
  } = params;

  try {
    // Select price ID based on amount
    const priceId =
      amountCents === 300
        ? process.env.PADDLE_BASIC_PRICE_ID!
        : process.env.PADDLE_PREMIUM_PRICE_ID!;

    if (!priceId) {
      throw new Error(
        `Price ID not configured for amount: ${amountCents}. Check PADDLE_BASIC_PRICE_ID and PADDLE_PREMIUM_PRICE_ID`
      );
    }

    // Create transaction with Paddle
    const transaction = await paddle.transactions.create({
      items: [
        {
          priceId,
          quantity: 1,
        },
      ],
      customData: {
        cardId,
        templateName,
        ...metadata,
      },
      checkout: {
        url: successUrl,
      },
    });

    if (!transaction.checkout?.url) {
      throw new Error('Failed to get checkout URL from Paddle transaction');
    }

    return {
      checkoutUrl: transaction.checkout.url,
      transactionId: transaction.id,
    };
  } catch (error) {
    console.error('Error creating Paddle checkout session:', error);
    throw error;
  }
}

/**
 * Verify a Paddle webhook signature
 * Returns true if signature is valid, false otherwise
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const secret = process.env.PADDLE_WEBHOOK_SECRET || '';

  try {
    // Paddle webhook verification
    const verified = paddle.webhooks.unmarshal(body, secret, signature);
    return !!verified;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Parse and return webhook event data
 */
export function parseWebhookEvent(
  body: string,
  signature: string
): any {
  const secret = process.env.PADDLE_WEBHOOK_SECRET || '';

  try {
    return paddle.webhooks.unmarshal(body, secret, signature);
  } catch (error) {
    console.error('Failed to parse webhook event:', error);
    throw error;
  }
}

/**
 * Get transaction details (for testing/verification)
 */
export async function getTransaction(
  transactionId: string
): Promise<any | null> {
  try {
    return await paddle.transactions.get(transactionId);
  } catch (error) {
    console.error('Error retrieving transaction:', error);
    return null;
  }
}

/**
 * Refund a transaction (if supported)
 */
export async function refundTransaction(
  transactionId: string,
  reason?: string
): Promise<any | null> {
  try {
    // Note: Refund API varies by Paddle version, this may need adjustment
    console.warn('Refund functionality to be implemented based on Paddle API');
    return null;
  } catch (error) {
    console.error('Error refunding transaction:', error);
    return null;
  }
}
