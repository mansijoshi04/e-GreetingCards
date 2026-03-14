'use client';

import { useEffect } from 'react';
import { Card, Template } from '@prisma/client';
import ScrollToOpen from '@/components/animations/ScrollToOpen';
import ClickToReveal from '@/components/animations/ClickToReveal';

type CardWithTemplate = Card & { template: Template };

interface CardRendererProps {
  card: CardWithTemplate;
  linkToken: string;
}

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

  // Track card open on client side (after hydration)
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

  // Determine which animation to use
  const scrollTrigger = designConfig.animations?.scrollTrigger || 'envelope-open';

  if (scrollTrigger === 'click-to-reveal') {
    return (
      <ClickToReveal
        content={customText}
        design={designConfig}
        styling={customStyling}
        cardId={card.id}
        category={card.template.category}
        tier={card.template.tier}
      />
    );
  }

  // Default: scroll-to-open envelope effect
  return (
    <ScrollToOpen
      content={customText}
      design={designConfig}
      styling={customStyling}
      cardId={card.id}
      category={card.template.category}
      tier={card.template.tier}
    />
  );
}
