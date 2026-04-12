'use client';

import { BirthdayCakeCard, BalloonCard, EnvelopeCard } from '@/components/cards/PrototypeCards';
import { COVER_IMAGES, DEFAULT_COVER } from '@/components/cards/coverImages';

interface PremiumCardExperienceProps {
  content: Record<string, string>;
  design: any;
  styling?: Record<string, any>;
  cardId: string;
  category?: string;
  tier?: string;
}

export default function PremiumCardExperience({
  content,
  design,
  category,
}: PremiumCardExperienceProps) {
  const visualTheme = design?.layout?.visualTheme || '';
  const interactionType = design?.animations?.interactionType;
  const coverImageUrl = COVER_IMAGES[visualTheme] || DEFAULT_COVER;

  const isCake = interactionType === 'blow-candles' || visualTheme === 'cake-celebration' || visualTheme === 'birthday-toast';
  const isBalloon =
    interactionType === 'pop-balloons' ||
    visualTheme === 'balloon-party' ||
    visualTheme === 'confetti-burst' ||
    visualTheme === 'floating-balloons' ||
    visualTheme === 'cap-toss';
  const isEnvelope = visualTheme === 'rose-petals' || visualTheme === 'heart-float' || visualTheme === 'love-scroll';

  const message = content.body || content.headline || '';
  const recipient = content.recipientName || content.recipient || '';
  const signature = content.signature || '';
  const fontSize = 18;
  const color = '#78716c'; // stone-500

  const isBirthday = isCake || category === 'birthday';
  const isLove = isEnvelope || category === 'anniversary';
  const isBalloons = isBalloon;

  const sharedProps = {
    message,
    recipient,
    signature,
    fontSize,
    color,
    isBirthday,
    isLove,
    isBalloons,
    image: coverImageUrl,
  };

  if (isCake) {
    return (
      <div className="w-full h-screen">
        <BirthdayCakeCard {...sharedProps} />
      </div>
    );
  }

  if (isBalloon) {
    return (
      <div className="w-full h-screen">
        <BalloonCard {...sharedProps} />
      </div>
    );
  }

  if (isEnvelope) {
    return (
      <div className="w-full h-screen">
        <EnvelopeCard {...sharedProps} />
      </div>
    );
  }

  return null;
}
