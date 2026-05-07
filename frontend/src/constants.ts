/**
 * Frontend business rule constants.
 * Must mirror backend/giflove/constants.py — update both when changing tier rules.
 */

export const TIER_FREE = 'free' as const;
export const TIER_ESSENTIAL = 'essential' as const;
export const TIER_PREMIUM = 'premium' as const;
export const TIER_BULK = 'bulk' as const;

export const TIER_PRICES: Record<string, number> = {
  free: 0,
  essential: 2.99,
  premium: 4.99,
  bulk: 30.00,
};

export const TIER_PRICES_DISPLAY: Record<string, string> = {
  free: 'Free',
  essential: '$2.99',
  premium: '$4.99',
  bulk: '$30',
};

export const RECIPIENT_LIMITS: Record<string, number> = {
  free: 1,
  essential: 3,
  premium: 5,
  bulk: 50,
};

export const LINK_EXPIRY_DAYS: Record<string, number> = {
  free: 3,
  essential: 7,
  premium: 14,
  bulk: 30,
};

/** Tiers that can schedule delivery */
export const SCHEDULING_TIERS = ['essential', 'premium', 'bulk'] as const;

/** Tiers that get email delivery via the platform */
export const PLATFORM_EMAIL_TIERS = ['essential', 'premium', 'bulk'] as const;

/** Tiers that show open tracking */
export const OPEN_TRACKING_TIERS = ['premium', 'bulk'] as const;

/** Tiers that can download as PNG */
export const PNG_DOWNLOAD_TIERS = ['essential', 'premium', 'bulk'] as const;

/** Tiers that can download as video */
export const VIDEO_DOWNLOAD_TIERS = ['premium', 'bulk'] as const;

/** Tiers that can upload image/video media */
export const MEDIA_UPLOAD_TIERS = ['premium', 'bulk'] as const;

/** Tiers that do NOT show the GifLove watermark */
export const NO_WATERMARK_TIERS = ['essential', 'premium', 'bulk'] as const;

export const TIER_DESCRIPTIONS: Record<string, string> = {
  free: 'Try it free. Every occasion covered.',
  essential: 'The go-to for solo senders.',
  premium: 'The one that makes people gasp.',
  bulk: 'One card, fifty people.',
};

export const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  free: { bg: 'bg-vellum-base', text: 'text-ink-espresso', border: 'border-ink-espresso/30' },
  essential: { bg: 'bg-pop-rose/10', text: 'text-pop-rose', border: 'border-pop-rose/40' },
  premium: { bg: 'bg-pop-violet/10', text: 'text-pop-violet', border: 'border-pop-violet/40' },
  bulk: { bg: 'bg-pop-electric/25', text: 'text-ink-espresso', border: 'border-ink-espresso/30' },
};
