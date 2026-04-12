'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BirthdayCakeCard, BalloonCard, EnvelopeCard } from '@/components/cards/PrototypeCards';
import FoldedCard from '@/components/cards/FoldedCard';
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
  styling = {},
  cardId,
  category,
  tier,
}: PremiumCardExperienceProps) {
  const [gameComplete, setGameComplete] = useState(false);
  const visualTheme = design?.layout?.visualTheme || '';
  const interactionType = design?.animations?.interactionType;
  const coverImageUrl = COVER_IMAGES[visualTheme] || DEFAULT_COVER;

  const isCake = interactionType === 'blow-candles' || visualTheme === 'cake-celebration';
  const isBalloon =
    interactionType === 'pop-balloons' ||
    visualTheme === 'balloon-party' ||
    visualTheme === 'confetti-burst';
  const isEnvelope = visualTheme === 'rose-petals' || visualTheme === 'heart-float';

  // Map app content fields to prototype card props
  const message = content.body || content.headline || '';
  const recipient = content.recipientName || content.recipient || '';
  const signature = content.signature || '';
  const fontSize = 18;
  const color = '#78716c'; // stone-500

  // Controls which decorations appear inside the FoldedCard
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

  // Fallback for any other premium themes
  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden">
      {!gameComplete ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setGameComplete(true)}
          className="px-8 py-4 bg-white rounded-full shadow-lg text-stone-700 font-bold text-lg border border-stone-100"
        >
          Open your card ✨
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', damping: 18 }}
          className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100"
        >
          <FoldedCard
            content={content}
            design={design}
            styling={styling}
            cardId={cardId}
            category={category}
            tier={tier}
            coverImageUrl={coverImageUrl}
            typewriter={false}
          />
        </motion.div>
      )}
    </div>
  );
}
