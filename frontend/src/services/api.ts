/**
 * Typed API client for the Django backend.
 * Base URL is read from VITE_API_BASE_URL — defaults to /api for same-origin proxy.
 *
 * Field mapping: frontend uses camelCase, Django returns snake_case.
 * This module handles the conversion in both directions so the rest of the
 * app never sees snake_case.
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreateCardPayload {
  templateSlug: string;
  tier: string;
  senderName: string;
  senderEmail?: string;
  senderBranding?: string;
  customText: { headline: string; body: string; signature: string; to?: string };
  customStyling?: Record<string, string>;
  recipients: { email: string; name?: string }[];
  scheduledAt?: string;          // ISO 8601 — omit for instant send
  paddleTransactionId?: string;  // required for paid tiers, omit for free
}

export interface CreateCardResponse {
  linkToken: string;
  expiresAt: string;
}

export interface CardDetailResponse {
  templateSlug: string;
  tier: string;
  senderName: string;
  senderBranding?: string;
  customText: { headline: string; body: string; signature: string; to?: string };
  customStyling: Record<string, string> | null;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  expiresAt: string;
}

// ── Endpoints ────────────────────────────────────────────────────────────────

/**
 * POST /cards/ — create a card after Paddle payment (or directly for free tier).
 * Maps camelCase payload → snake_case body, and snake_case response → camelCase.
 */
export const createCard = async (payload: CreateCardPayload): Promise<CreateCardResponse> => {
  const body = {
    template_slug: payload.templateSlug,
    tier: payload.tier,
    sender_name: payload.senderName,
    sender_email: payload.senderEmail ?? '',
    sender_branding: payload.senderBranding ?? '',
    custom_text: payload.customText,
    custom_styling: payload.customStyling ?? null,
    // Backend expects a flat list of email strings, not objects
    recipient_emails: payload.recipients.map(r => r.email),
    scheduled_at: payload.scheduledAt ?? null,
    paddle_transaction_id: payload.paddleTransactionId ?? '',
  };

  const res = await request<{ link_token: string; expires_at: string; card_url: string }>('/cards/', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return {
    linkToken: res.link_token,
    expiresAt: res.expires_at,
  };
};

/**
 * GET /cards/:token/ — fetch card data for the recipient viewer.
 * Maps snake_case response → camelCase.
 */
export const getCard = async (token: string): Promise<CardDetailResponse> => {
  const res = await request<Record<string, unknown>>(`/cards/${token}/`);

  return {
    templateSlug: res.template_slug as string,
    tier: res.tier as string,
    senderName: res.sender_name as string,
    senderBranding: (res.sender_branding as string) || undefined,
    customText: res.custom_text as CardDetailResponse['customText'],
    customStyling: (res.custom_styling as Record<string, string>) ?? null,
    mediaUrl: (res.media_url as string) || undefined,
    mediaType: (res.media_type as 'image' | 'video') || undefined,
    expiresAt: res.expires_at as string,
  };
};
