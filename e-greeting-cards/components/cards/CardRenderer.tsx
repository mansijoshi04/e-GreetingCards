'use client';

import { useEffect } from 'react';
import { Card } from '@prisma/client';
import type { StaticTemplate } from '@/lib/templates/types';
import BasicCardExperience from '@/components/cards/BasicCardExperience';
import PremiumCardExperience from '@/components/cards/PremiumCardExperience';

type CardWithTemplate = Card & { template: StaticTemplate };

interface CardRendererProps {
  card: CardWithTemplate;
  linkToken: string;
}

const PREMIUM_INTERACTIVE_THEMES = ['cake-celebration', 'balloon-party', 'confetti-burst', 'rose-petals', 'heart-float', 'cap-toss', 'love-scroll', 'birthday-toast', 'floating-balloons'];

export default function CardRenderer({ card, linkToken }: CardRendererProps) {
  const designConfig = typeof card.template.designConfig === 'string'
    ? JSON.parse(card.template.designConfig)
    : card.template.designConfig as any;
  const customText = typeof card.customText === 'string'
    ? JSON.parse(card.customText)
    : card.customText as any;
  const customStyling = typeof card.customStyling === 'string'
    ? JSON.parse(card.customStyling)
    : (card.customStyling as any) || {};

  const visualTheme = designConfig?.layout?.visualTheme || '';
  const tier = card.template.tier;
  const category = card.template.category;

  // Track card open on client side
  useEffect(() => {
    const trackOpen = async () => {
      try {
        await fetch('/api/tracking/open', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            linkToken,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Failed to track card open:', error);
      }
    };
    trackOpen();
  }, [linkToken]);

  const sharedProps = {
    content: customText,
    design: designConfig,
    styling: customStyling,
    cardId: card.id,
    category,
    tier,
  };

  // Premium cards with interactive pre-reveal game
  if (tier === 'premium' && PREMIUM_INTERACTIVE_THEMES.includes(visualTheme)) {
    return <PremiumCardExperience {...sharedProps} />;
  }

  // Basic cards (and premium without a specific game) — folded card with typewriter
  return <BasicCardExperience {...sharedProps} />;
}
