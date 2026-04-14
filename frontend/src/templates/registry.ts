/**
 * Template Registry — single source of truth for all card templates.
 *
 * Adding a new template:
 *   1. Create the component in frontend/src/components/cards/
 *   2. Add an entry here
 *   3. Add the slug to backend/apps/cards/template_urls.py
 *   No migration, no seeding needed.
 */
import type { CardTemplate } from '../types/card';

import MinimalWish from '../components/cards/MinimalWish';
import SimpleThanks from '../components/cards/SimpleThanks';
import BalloonBash from '../components/cards/BalloonBash';
import ConfettiOverload from '../components/cards/ConfettiOverload';
import HeartFloat from '../components/cards/HeartFloat';
import DiplomaScroll from '../components/cards/DiplomaScroll';
import PartyPopper from '../components/cards/PartyPopper';
import CakeAndCandles from '../components/cards/CakeAndCandles';
import RosePetals from '../components/cards/RosePetals';
import CapToss from '../components/cards/CapToss';
import GratitudeBloom from '../components/cards/GratitudeBloom';
import GoldShimmer from '../components/cards/GoldShimmer';

export const TEMPLATES: CardTemplate[] = [
  // ── Birthday ──────────────────────────────────────────────────────────────
  {
    slug: 'minimal-wish',
    title: 'Minimal Wish',
    category: 'birthday',
    tier: 'free',
    component: MinimalWish,
    defaultText: {
      headline: 'Happy Birthday!',
      body: 'Wishing you a beautiful day filled with joy and all the things you love.',
      signature: 'With love',
    },
    colorPresets: [
      { name: 'Rose', primary: '#fdf2f8', secondary: '#f43f5e', background: '#fff7f7', text: '#44403c' },
      { name: 'Sky', primary: '#f0f9ff', secondary: '#0ea5e9', background: '#f8fcff', text: '#44403c' },
      { name: 'Sage', primary: '#f0fdf4', secondary: '#16a34a', background: '#f8fffe', text: '#44403c' },
    ],
    description: 'Clean typography, soft fade-in. Simple and heartfelt.',
    animationType: 'auto-play',
    previewGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fff7f7 100%)',
  },
  {
    slug: 'balloon-bash',
    title: 'Balloon Bash',
    category: 'birthday',
    tier: 'essential',
    component: BalloonBash,
    defaultText: {
      headline: 'Happy Birthday!',
      body: 'Pop the balloons to reveal something special just for you!',
      signature: 'Cheers',
    },
    colorPresets: [
      { name: 'Party', primary: '#f43f5e', secondary: '#fb923c', background: '#fff1f2', text: '#1c1917' },
      { name: 'Sky', primary: '#0ea5e9', secondary: '#38bdf8', background: '#f0f9ff', text: '#1c1917' },
      { name: 'Purple', primary: '#8b5cf6', secondary: '#c084fc', background: '#faf5ff', text: '#1c1917' },
    ],
    description: 'Pop floating balloons to reveal your birthday message.',
    animationType: 'click-to-reveal',
    interactionHint: 'Pop the balloons!',
    previewGradient: 'linear-gradient(135deg, #f0f9ff 0%, #fff1f2 100%)',
  },
  {
    slug: 'confetti-overload',
    title: 'Confetti Overload',
    category: 'birthday',
    tier: 'essential',
    component: ConfettiOverload,
    defaultText: {
      headline: 'It\'s Your Day!',
      body: 'Let\'s make it a memorable one. Here\'s to you and everything amazing about you!',
      signature: 'With celebration',
    },
    colorPresets: [
      { name: 'Rainbow', primary: '#8b5cf6', secondary: '#f43f5e', background: '#fdf4ff', text: '#1c1917' },
      { name: 'Sunny', primary: '#f59e0b', secondary: '#fb923c', background: '#fffbeb', text: '#1c1917' },
      { name: 'Aqua', primary: '#06b6d4', secondary: '#0ea5e9', background: '#ecfeff', text: '#1c1917' },
    ],
    description: 'Explosive confetti burst with a bright rainbow palette.',
    animationType: 'auto-play',
    previewGradient: 'linear-gradient(135deg, #fdf4ff 0%, #f0f9ff 100%)',
  },
  {
    slug: 'cake-and-candles',
    title: 'Cake & Candles',
    category: 'birthday',
    tier: 'premium',
    component: CakeAndCandles,
    defaultText: {
      headline: 'Make a Wish!',
      body: 'Close your eyes, take a deep breath, and blow out the candles. Your wish is about to come true.',
      signature: 'With love',
    },
    colorPresets: [
      { name: 'Rose', primary: '#f43f5e', secondary: '#fb7185', background: '#fff1f2', text: '#1c1917' },
      { name: 'Lilac', primary: '#a855f7', secondary: '#c084fc', background: '#faf5ff', text: '#1c1917' },
      { name: 'Peach', primary: '#f97316', secondary: '#fb923c', background: '#fff7ed', text: '#1c1917' },
    ],
    description: 'Blow out the candles to reveal your birthday message.',
    animationType: 'gesture',
    interactionHint: 'Make a wish & blow!',
    previewGradient: 'linear-gradient(160deg, #fff1f2 0%, #fef3c7 100%)',
  },

  // ── Anniversary ────────────────────────────────────────────────────────────
  {
    slug: 'heart-float',
    title: 'Heart Float',
    category: 'anniversary',
    tier: 'essential',
    component: HeartFloat,
    defaultText: {
      headline: 'Happy Anniversary',
      body: 'Every moment with you is a gift. Here\'s to many more years of laughter, love, and adventure.',
      signature: 'Forever yours',
    },
    colorPresets: [
      { name: 'Rose', primary: '#f43f5e', secondary: '#fb7185', background: '#fff1f2', text: '#1c1917' },
      { name: 'Blush', primary: '#e11d48', secondary: '#fda4af', background: '#fdf2f8', text: '#1c1917' },
      { name: 'Berry', primary: '#be123c', secondary: '#f43f5e', background: '#fff1f2', text: '#1c1917' },
    ],
    description: 'Tap to release a bouquet of floating hearts.',
    animationType: 'click-to-reveal',
    interactionHint: 'Tap to open your card',
    previewGradient: 'linear-gradient(145deg, #fff1f2 0%, #fdf2f8 100%)',
  },
  {
    slug: 'rose-petals',
    title: 'Rose Petals',
    category: 'anniversary',
    tier: 'premium',
    component: RosePetals,
    defaultText: {
      headline: 'Always & Forever',
      body: 'Like petals falling softly — our love is quiet, beautiful, and endless.',
      signature: 'With all my heart',
    },
    colorPresets: [
      { name: 'Crimson', primary: '#e11d48', secondary: '#f43f5e', background: '#fff1f2', text: '#1c1917' },
      { name: 'Blush', primary: '#db2777', secondary: '#ec4899', background: '#fdf2f8', text: '#1c1917' },
      { name: 'Dusty Rose', primary: '#9f1239', secondary: '#be123c', background: '#fff1f2', text: '#1c1917' },
    ],
    description: 'Rose petals fall as you watch, revealing a romantic message.',
    animationType: 'auto-play',
    previewGradient: 'linear-gradient(160deg, #fff1f2 0%, #fdf2f8 50%, #f5f3ff 100%)',
  },

  // ── Graduation ─────────────────────────────────────────────────────────────
  {
    slug: 'diploma-scroll',
    title: 'Diploma Scroll',
    category: 'graduation',
    tier: 'essential',
    component: DiplomaScroll,
    defaultText: {
      headline: 'Congratulations, Graduate!',
      body: 'Your hard work, late nights, and perseverance have paid off. This is just the beginning.',
      signature: 'So proud of you',
    },
    colorPresets: [
      { name: 'Parchment', primary: '#854d0e', secondary: '#92400e', background: '#fefce8', text: '#1c1917' },
      { name: 'Navy', primary: '#1d4ed8', secondary: '#2563eb', background: '#eff6ff', text: '#1c1917' },
      { name: 'Emerald', primary: '#065f46', secondary: '#047857', background: '#ecfdf5', text: '#1c1917' },
    ],
    description: 'Scroll to unroll a diploma with your graduation message.',
    animationType: 'scroll-to-open',
    interactionHint: 'Scroll to unroll your diploma',
    previewGradient: 'linear-gradient(160deg, #fefce8 0%, #fef9c3 100%)',
  },
  {
    slug: 'cap-toss',
    title: 'Cap Toss',
    category: 'graduation',
    tier: 'premium',
    component: CapToss,
    defaultText: {
      headline: 'Toss That Cap!',
      body: 'You did it! All the hard work, the sleepless nights — it all led to this incredible moment.',
      signature: 'Cheering you on',
    },
    colorPresets: [
      { name: 'Royal', primary: '#1d4ed8', secondary: '#fbbf24', background: '#eff6ff', text: '#1c1917' },
      { name: 'Scarlet', primary: '#dc2626', secondary: '#fbbf24', background: '#fef2f2', text: '#1c1917' },
      { name: 'Forest', primary: '#166534', secondary: '#fbbf24', background: '#f0fdf4', text: '#1c1917' },
    ],
    description: 'Tap to toss graduation caps into the air with confetti.',
    animationType: 'click-to-reveal',
    interactionHint: 'Tap to toss your cap!',
    previewGradient: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
  },

  // ── Thank You ──────────────────────────────────────────────────────────────
  {
    slug: 'simple-thanks',
    title: 'Simple Thanks',
    category: 'thank-you',
    tier: 'free',
    component: SimpleThanks,
    defaultText: {
      headline: 'Thank You',
      body: 'Your kindness means the world to me. I\'m so grateful to have you in my life.',
      signature: 'With gratitude',
    },
    colorPresets: [
      { name: 'Mint', primary: '#10b981', secondary: '#34d399', background: '#f0fdf4', text: '#1c1917' },
      { name: 'Teal', primary: '#0d9488', secondary: '#14b8a6', background: '#f0fdfa', text: '#1c1917' },
      { name: 'Sage', primary: '#16a34a', secondary: '#22c55e', background: '#f0fdf4', text: '#1c1917' },
    ],
    description: 'Minimal and message-forward. A clean, heartfelt thank you.',
    animationType: 'auto-play',
    previewGradient: 'linear-gradient(145deg, #f0fdf4 0%, #fafffe 100%)',
  },
  {
    slug: 'gratitude-bloom',
    title: 'Gratitude Bloom',
    category: 'thank-you',
    tier: 'premium',
    component: GratitudeBloom,
    defaultText: {
      headline: 'From the Bottom of My Heart',
      body: 'Like flowers in bloom, your kindness has made everything brighter. Thank you, truly.',
      signature: 'With warmth',
    },
    colorPresets: [
      { name: 'Garden', primary: '#10b981', secondary: '#34d399', background: '#f0fdf4', text: '#1c1917' },
      { name: 'Wildflower', primary: '#db2777', secondary: '#ec4899', background: '#fdf2f8', text: '#1c1917' },
      { name: 'Lavender', primary: '#7c3aed', secondary: '#a78bfa', background: '#f5f3ff', text: '#1c1917' },
    ],
    description: 'Flowers bloom as you scroll — a watercolour garden of gratitude.',
    animationType: 'scroll-to-open',
    interactionHint: 'Scroll to see flowers bloom',
    previewGradient: 'linear-gradient(160deg, #f0fdf4 0%, #fafffe 100%)',
  },

  // ── Congratulations ────────────────────────────────────────────────────────
  {
    slug: 'party-popper',
    title: 'Party Popper',
    category: 'congratulations',
    tier: 'essential',
    component: PartyPopper,
    defaultText: {
      headline: 'Congratulations!',
      body: 'You worked so hard for this and you absolutely deserve it. Celebrate loud!',
      signature: 'Proud of you',
    },
    colorPresets: [
      { name: 'Gold', primary: '#f59e0b', secondary: '#fbbf24', background: '#fffbeb', text: '#1c1917' },
      { name: 'Party', primary: '#f43f5e', secondary: '#fb923c', background: '#fff1f2', text: '#1c1917' },
      { name: 'Electric', primary: '#8b5cf6', secondary: '#06b6d4', background: '#faf5ff', text: '#1c1917' },
    ],
    description: 'Confetti bursts from every corner in a bold celebration.',
    animationType: 'auto-play',
    previewGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
  },
  {
    slug: 'gold-shimmer',
    title: 'Gold Shimmer',
    category: 'congratulations',
    tier: 'premium',
    component: GoldShimmer,
    defaultText: {
      headline: 'You\'ve Earned It!',
      body: 'This achievement is a testament to your dedication, your strength, and your brilliance.',
      signature: 'In admiration',
    },
    colorPresets: [
      { name: 'Gold', primary: '#d97706', secondary: '#fbbf24', background: '#fefce8', text: '#1c1917' },
      { name: 'Platinum', primary: '#6b7280', secondary: '#9ca3af', background: '#f9fafb', text: '#1c1917' },
      { name: 'Rose Gold', primary: '#e11d48', secondary: '#fbbf24', background: '#fff1f2', text: '#1c1917' },
    ],
    description: 'A trophy glimmers with golden shimmer particles — pure prestige.',
    animationType: 'auto-play',
    previewGradient: 'linear-gradient(145deg, #fefce8 0%, #fef3c7 100%)',
  },
];

/** Look up a template by slug. Returns undefined if not found. */
export const getTemplate = (slug: string): CardTemplate | undefined =>
  TEMPLATES.find(t => t.slug === slug);

/** Get all templates for a given category. */
export const getTemplatesByCategory = (category: string): CardTemplate[] =>
  TEMPLATES.filter(t => t.category === category);

/** Get all templates for a given tier. */
export const getTemplatesByTier = (tier: string): CardTemplate[] =>
  TEMPLATES.filter(t => t.tier === tier);
