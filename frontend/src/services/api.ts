/**
 * Typed API client for the Django backend.
 * Base URL is read from VITE_API_BASE_URL — defaults to /api for same-origin proxy.
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

export interface CreateTransactionResponse {
  transactionId: string;
}

export interface CreateCardPayload {
  templateSlug: string;
  tier: string;
  senderName: string;
  senderEmail: string;
  customText: { headline: string; body: string; signature: string };
  customStyling?: Record<string, string>;
  recipients: { email: string; name?: string }[];
  scheduledAt?: string;           // ISO 8601 — omit for instant send
  paddleTransactionId?: string;   // required for paid tiers
}

export interface CreateCardResponse {
  linkToken: string;
  expiresAt: string;
}

export interface CardDetailResponse {
  templateSlug: string;
  tier: string;
  senderName: string;
  customText: { headline: string; body: string; signature: string };
  customStyling: Record<string, string> | null;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  senderBranding?: string;
  expiresAt: string;
}

// ── Endpoints ────────────────────────────────────────────────────────────────

/** POST /payments/create-transaction/ — create a Paddle transaction before checkout */
export const createTransaction = (payload: { tier: string; templateSlug: string }): Promise<CreateTransactionResponse> =>
  request('/payments/create-transaction/', { method: 'POST', body: JSON.stringify(payload) });

/** POST /cards/create/ — create a card after payment (or for free tier) */
export const createCard = (payload: CreateCardPayload): Promise<CreateCardResponse> =>
  request('/cards/create/', { method: 'POST', body: JSON.stringify(payload) });

/** GET /cards/:token/ — fetch card data for the recipient viewer */
export const getCard = (token: string): Promise<CardDetailResponse> =>
  request(`/cards/${token}/`);
