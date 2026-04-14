import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PartyPopper as PartyPopperIcon, Trophy, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

const PartyPopper: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const [revealed, setRevealed] = useState(false);
  const accent = customStyling?.primaryColor ?? '#f59e0b';

  const fireCorners = () => {
    const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa'];
    confetti({ particleCount: 50, angle: 45, spread: 55, origin: { x: 0, y: 0.35 }, colors });
    confetti({ particleCount: 50, angle: 135, spread: 55, origin: { x: 1, y: 0.35 }, colors });
    confetti({ particleCount: 35, angle: 315, spread: 45, origin: { x: 0, y: 1 }, colors });
    confetti({ particleCount: 35, angle: 225, spread: 45, origin: { x: 1, y: 1 }, colors });
  };

  const handleOpen = () => {
    fireCorners();
    setTimeout(() => setRevealed(true), 400);
  };

  useEffect(() => {
    if (!isPreview) return;
    setRevealed(true);
    const interval = setInterval(fireCorners, 3500);
    return () => clearInterval(interval);
  }, [isPreview]);

  const cornerIcons = [
    { Icon: PartyPopperIcon, pos: 'top-3 left-3' },
    { Icon: Trophy, pos: 'top-3 right-3' },
    { Icon: Sparkles, pos: 'bottom-3 left-3' },
    { Icon: Star, pos: 'bottom-3 right-3' },
  ];

  return (
    <CardShell
      coverFrom="#fef3c7"
      coverTo={accent}
      coverIcon={<PartyPopperIcon size={36} className="text-white" />}
      interactionHint="Tap to celebrate"
      isPreview={isPreview}
      onOpen={handleOpen}
      confettiOnOpen={false}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 gap-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}
      >
        {cornerIcons.map(({ Icon, pos }) => (
          <div key={pos} className={`absolute ${pos} opacity-20`}>
            <Icon size={22} style={{ color: accent }} />
          </div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={revealed || isPreview ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <PartyPopperIcon size={40} style={{ color: accent }} />
          </motion.div>

          {customText.to && (
            <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
              Dear {customText.to},
            </p>
          )}
          <h2 className="text-2xl font-bold leading-snug" style={{ fontFamily: 'Quicksand, sans-serif', color: accent }}>
            {customText.headline}
          </h2>
          <p className="text-sm leading-relaxed max-w-[210px] text-stone-600">{customText.body}</p>
          <p className="text-xs italic text-stone-400">
            {customText.signature}{senderName ? `, ${senderName}` : ''}
          </p>
        </motion.div>
      </div>
    </CardShell>
  );
};

export default PartyPopper;
