'use client';

import { FoldedCard } from '@/components/cards/PrototypeCards';
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
  category,
}: BasicCardExperienceProps) {
  const visualTheme = design?.layout?.visualTheme || '';
  const coverImageUrl = COVER_IMAGES[visualTheme] || DEFAULT_COVER;

  const message = content.body || content.headline || '';
  const recipient = content.recipientName || content.recipient || '';
  const signature = content.signature || '';

  const isBirthday = category === 'birthday';
  const isLove = category === 'anniversary';
  const isBalloons = visualTheme === 'balloon-party' || visualTheme === 'confetti-burst';

  return (
    <div className="w-full h-screen">
      <FoldedCard
        message={message}
        recipient={recipient}
        signature={signature}
        fontSize={18}
        color="#78716c"
        frontImage={coverImageUrl}
        isBirthday={isBirthday}
        isLove={isLove}
        isBalloons={isBalloons}
      />
    </div>
  );
}
