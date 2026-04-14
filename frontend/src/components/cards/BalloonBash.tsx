import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

// CSS balloon shape — no emojis
const Balloon = ({ color, size = 52, className = '' }: { color: string; size?: number; className?: string }) => (
  <div className={`flex flex-col items-center select-none ${className}`} style={{ width: size }}>
    <div
      style={{
        width: size,
        height: size * 1.25,
        background: `radial-gradient(ellipse at 35% 30%, ${color}99, ${color})`,
        borderRadius: '50% 50% 52% 48% / 42% 42% 58% 58%',
        boxShadow: `inset -4px -4px 8px rgba(0,0,0,0.1), inset 4px 4px 8px rgba(255,255,255,0.25)`,
      }}
    />
    <div style={{ width: 3, height: size * 0.08, background: color, borderRadius: '0 0 2px 2px' }} />
    <div style={{ width: 1, height: size * 0.55, background: '#a8a29e' }} />
  </div>
);

const BALLOON_COLORS = ['#f43f5e', '#8b5cf6', '#f59e0b', '#06b6d4', '#10b981', '#ec4899', '#3b82f6'];

const BalloonBash: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const [popped, setPopped] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const accent = customStyling?.primaryColor ?? '#f43f5e';

  const handlePop = (i: number) => {
    if (popped.includes(i)) return;
    const next = [...popped, i];
    setPopped(next);
    if (next.length >= 4) {
      confetti({ particleCount: 120, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setRevealed(true), 800);
    }
  };

  const InsideContent = () => (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(145deg, #f0f9ff 0%, #eff6ff 100%)' }}
    >
      <AnimatePresence mode="wait">
        {(revealed || isPreview) ? (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="flex flex-col items-center text-center gap-4 p-8"
          >
            <Star size={36} fill={accent} style={{ color: accent }} />
            {customText.to && (
              <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
                Dear {customText.to},
              </p>
            )}
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Quicksand, sans-serif', color: accent }}>
              {customText.headline}
            </h2>
            <p className="text-sm leading-relaxed max-w-[200px] text-stone-600">{customText.body}</p>
            <p className="text-xs italic text-stone-400">
              {customText.signature}{senderName ? `, ${senderName}` : ''}
            </p>
          </motion.div>
        ) : (
          <motion.div key="balloons" exit={{ opacity: 0 }} className="relative w-full h-full">
            {BALLOON_COLORS.map((color, i) => {
              const left = 8 + i * 12;
              const top = 10 + (i % 3) * 15;
              return (
                <motion.div
                  key={i}
                  className="absolute cursor-pointer"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  animate={
                    popped.includes(i)
                      ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
                      : { y: [0, -10, 0], x: [0, 4, 0] }
                  }
                  transition={
                    popped.includes(i)
                      ? { duration: 0.25 }
                      : {
                          y: { repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut' },
                          x: { repeat: Infinity, duration: 4 + i * 0.3, ease: 'easeInOut' },
                        }
                  }
                  onClick={() => handlePop(i)}
                >
                  <Balloon color={color} size={46} />
                </motion.div>
              );
            })}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-stone-400 text-xs font-medium"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {popped.length < 4 ? `Pop ${4 - popped.length} more to reveal` : 'Here it comes!'}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <CardShell
      coverFrom="#e0f2fe"
      coverTo={accent}
      coverIcon={<Gift size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
    >
      <InsideContent />
    </CardShell>
  );
};

export default BalloonBash;
