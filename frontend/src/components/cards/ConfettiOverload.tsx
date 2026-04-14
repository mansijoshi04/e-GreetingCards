import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

const ConfettiOverload: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const [revealed, setRevealed] = useState(false);
  const accent = customStyling?.primaryColor ?? '#8b5cf6';

  const fireConfetti = () => {
    const count = isPreview ? 80 : 400;
    const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc'];
    confetti({ particleCount: count / 2, angle: 60, spread: 80, origin: { x: 0, y: 0.6 }, colors });
    confetti({ particleCount: count / 2, angle: 120, spread: 80, origin: { x: 1, y: 0.6 }, colors });
  };

  const handleOpen = () => {
    fireConfetti();
    setTimeout(() => setRevealed(true), 500);
  };

  useEffect(() => {
    if (!isPreview) return;
    const interval = setInterval(fireConfetti, 3200);
    setRevealed(true);
    return () => clearInterval(interval);
  }, [isPreview]);

  return (
    <CardShell
      coverFrom="#f5f3ff"
      coverTo={accent}
      coverIcon={<PartyPopper size={36} className="text-white" />}
      interactionHint="Tap for a surprise"
      isPreview={isPreview}
      onOpen={handleOpen}
      confettiOnOpen={false}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 gap-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #f0f9ff 100%)' }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-15 pointer-events-none"
            style={{
              width: 16 + i * 14,
              height: 16 + i * 14,
              background: ['#f43f5e','#fb923c','#facc15','#4ade80','#60a5fa','#c084fc'][i],
              top: `${8 + i * 14}%`,
              left: `${4 + i * 14}%`,
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.4 }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={revealed || isPreview ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <PartyPopper size={40} style={{ color: accent }} />

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

export default ConfettiOverload;
