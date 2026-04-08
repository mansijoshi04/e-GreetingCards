'use client';

import FoldedCard from '@/components/cards/FoldedCard';
import { COVER_IMAGES, DEFAULT_COVER } from '@/components/cards/coverImages';

interface BasicCardExperienceProps {
  content: Record<string, string>;
  design: any;
  styling?: Record<string, any>;
  cardId: string;
  category?: string;
  tier?: string;
}

export default function BasicCardExperience({
  content,
  design,
  styling = {},
  cardId,
  category,
  tier,
}: BasicCardExperienceProps) {
  const visualTheme = design?.layout?.visualTheme || '';
  const coverImageUrl = COVER_IMAGES[visualTheme] || DEFAULT_COVER;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
      <FoldedCard
        content={content}
        design={design}
        styling={styling}
        cardId={cardId}
        category={category}
        tier={tier}
        coverImageUrl={coverImageUrl}
        typewriter={true}
      />
    </div>
  );
}
