import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
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
 * Create a Stripe checkout session for card payment
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<string> {
  const {
    amountCents,
    cardId,
    templateName,
    successUrl,
    cancelUrl,
    metadata = {},
  } = params;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `E-Greeting Card: ${templateName}`,
              description: 'Beautiful animated greeting card with email delivery',
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        cardId,
        ...metadata,
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Construct a webhook event from raw body and signature
 * Used to verify webhook authenticity
 */
export function constructWebhookEvent(
  body: string,
  signature: string
): Stripe.Event {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    return stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

/**
 * Get payment intent details (for testing/verification)
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent | null> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return null;
  }
}

/**
 * Refund a payment
 */
export async function refundPayment(
  paymentIntentId: string,
  reason?: string
): Promise<Stripe.Refund | null> {
  try {
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: (reason as Stripe.RefundCreateParams.Reason) || 'requested_by_customer',
    });
  } catch (error) {
    console.error('Error refunding payment:', error);
    return null;
  }
}
