/**
 * Card Component Standard — TypeScript definitions.
 *
 * Every card component and registry entry MUST satisfy these interfaces.
 * If a card doesn't implement CardProps, it won't compile.
 *
 * See CLAUDE.md → "Card Component Standard" for the full authoring guide.
 */

import type { ComponentType } from 'react';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type Tier = 'free' | 'essential' | 'premium' | 'bulk';

export type CardCategory =
  | 'birthday'
  | 'anniversary'
  | 'graduation'
  | 'thank-you'
  | 'congratulations'
  | 'get-well-soon';

/**
 * How the card is triggered / revealed.
 * Specified per card design — ask the designer when building a new card.
 */
export type AnimationType =
  | 'scroll-to-open'   // card reveals as the user scrolls down
  | 'click-to-reveal'  // user clicks/taps a cover element to trigger the reveal
  | 'gesture'          // user performs a specific action (blow candles, pop balloons, etc.)
  | 'auto-play';       // animation plays automatically on load, no interaction needed

export type CardFont = 'inter' | 'cormorant' | 'quicksand';

// ---------------------------------------------------------------------------
// Content & styling types
// ---------------------------------------------------------------------------

/** Text the sender customizes in the editor. */
export interface CardText {
  headline: string;
  body: string;
  signature: string;
  /** Recipient name — shown as "Dear {to}" inside the card. Optional. */
  to?: string;
}

/**
 * A named color palette shown as a preset option in the editor.
 * Every template must define at least 3 presets.
 */
export interface ColorPreset {
  name: string;
  primary: string;     // hex — dominant accent color
  secondary: string;   // hex — supporting color
  background: string;  // hex — card background
  text: string;        // hex — body text color
}

/** Styling overrides the sender applies in the editor. */
export interface CardStyling {
  colorPreset?: string;     // name of a preset from the template's colorPresets list
  primaryColor?: string;    // custom hex (overrides preset.primary)
  secondaryColor?: string;  // custom hex (overrides preset.secondary)
  fontFamily?: CardFont;
  fontSize?: 'sm' | 'md' | 'lg';
}

// ---------------------------------------------------------------------------
// CardProps — the contract every card component must implement
// ---------------------------------------------------------------------------

/**
 * Every card component in frontend/src/components/cards/ MUST accept these props.
 *
 * Usage:
 *   const MyCard: React.FC<CardProps> = ({ customText, customStyling, ... }) => { ... }
 *
 * Cards are self-contained — all animations and effects live inside the component.
 * Do not import shared effect utilities; build what you need inside the component.
 */
export interface CardProps {
  // --- Content (required) ---
  customText: CardText;
  senderName: string;

  // --- Styling (optional — fall back to template defaults if absent) ---
  customStyling?: CardStyling;

  // --- Media (Premium + Bulk only — undefined for Free + Essential) ---
  mediaUrl?: string;           // MinIO public URL
  mediaType?: 'image' | 'video';

  // --- Bulk branding (optional) ---
  senderBranding?: string;     // e.g. "From: Acme Corp HR Team"

  // --- Context ---
  tier: Tier;

  /**
   * true when the card is rendered inside the editor preview pane.
   *
   * When isPreview is true, cards MUST:
   *   - Loop animations instead of playing them once
   *   - Disable gesture interactions (blow, pop) that require physical input
   *   - Not fire any analytics events
   */
  isPreview?: boolean;
}

// ---------------------------------------------------------------------------
// CardTemplate — the registry entry every template must export
// ---------------------------------------------------------------------------

/**
 * The shape of every entry in frontend/src/templates/registry.ts.
 *
 * Add a new entry here whenever a new card component is created.
 * The slug must also be added to the Python mirror in backend/apps/cards/template_urls.py.
 */
export interface CardTemplate {
  /** Stable identifier stored in the DB. Never rename after launch. */
  slug: string;

  /** Display name shown in the template browser. */
  title: string;

  category: CardCategory;
  tier: Tier;

  /** The card component. Must satisfy CardProps. */
  component: ComponentType<CardProps>;

  // --- Editor defaults ---
  /** Pre-filled text shown in the editor before the sender edits anything. */
  defaultText: CardText;

  /** At least 3 color presets. First preset is the default. */
  colorPresets: ColorPreset[];

  /** Fonts available for this template. Defaults to all fonts if omitted. */
  availableFonts?: CardFont[];

  // --- Template browser metadata ---
  /** One-sentence description shown on the template card. */
  description: string;

  /** How the card is triggered. Used to show an appropriate preview affordance. */
  animationType: AnimationType;

  /**
   * Short prompt shown to the recipient before they interact.
   * Required for 'gesture' and 'click-to-reveal' animation types.
   * Example: "Blow out the candles", "Tap to open your card"
   */
  interactionHint?: string;

  /** CSS gradient string used as the thumbnail background in the template browser. */
  previewGradient?: string;
}
