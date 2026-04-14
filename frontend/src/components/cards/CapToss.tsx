import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

const CapToss: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const [tossed, setTossed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const accent = customStyling?.primaryColor ?? '#1d4ed8';

  const handleToss = () => {
    if (isPreview || tossed) return;
    setTossed(true);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: [accent, '#fbbf24', '#f43f5e', '#10b981'],
    });
    setTimeout(() => setRevealed(true), 1500);
  };

  // Preview loop
  React.useEffect(() => {
    if (!isPreview) return;
    const t = setInterval(() => {
      setTossed(true);
      setTimeout(() => setTossed(false), 2500);
    }, 3500);
    return () => clearInterval(t);
  }, [isPreview]);

  return (
    <CardShell
      coverFrom="#dbeafe"
      coverTo={accent}
      coverIcon={<GraduationCap size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
      confettiOnOpen={false}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)' }}
      >
        <AnimatePresence mode="wait">
          {revealed && !isPreview ? (
            <motion.div
              key="message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className="flex flex-col items-center text-center gap-4 p-8"
            >
              <GraduationCap size={42} style={{ color: accent }} />
              {customText.to && (
                <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
                  Dear {customText.to},
                </p>
              )}
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Quicksand, sans-serif', color: accent }}>
                {customText.headline}
              </h2>
              <p className="text-sm leading-relaxed max-w-[210px] text-stone-600">
                {customText.body}
              </p>
              <p className="text-xs italic text-stone-400">
                {customText.signature}{senderName ? `, ${senderName}` : ''}
              </p>
            </motion.div>
          ) : (
            <motion.div key="caps" className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Floating graduation caps */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{ left: `${15 + i * 16}%`, bottom: '28%' }}
                  animate={
                    tossed
                      ? { y: [0, -(180 + i * 45), 400], rotate: [0, 360 + i * 90], opacity: [1, 1, 0] }
                      : { y: [0, -8, 0], rotate: [0, 5, -5, 0] }
                  }
                  transition={
                    tossed
                      ? { duration: 1.5, ease: 'easeInOut', delay: i * 0.07 }
                      : {
                          y: { repeat: Infinity, duration: 2 + i * 0.3, ease: 'easeInOut', delay: i * 0.2 },
                          rotate: { repeat: Infinity, duration: 3 + i * 0.4 },
                        }
                  }
                >
                  <GraduationCap
                    size={30 + (i % 3) * 6}
                    style={{ color: i % 2 === 0 ? accent : '#fbbf24' }}
                  />
                </motion.div>
              ))}

              {!tossed && (
                <motion.button
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  onClick={handleToss}
                  className="absolute bottom-8 flex items-center gap-2 px-5 py-2 rounded-full text-white font-bold text-sm shadow-md"
                  style={{ background: accent, fontFamily: 'Quicksand, sans-serif' }}
                >
                  <Sparkles size={14} /> Toss your cap!
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardShell>
  );
};

export default CapToss;
