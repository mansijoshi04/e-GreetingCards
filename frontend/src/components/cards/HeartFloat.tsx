import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

const HEART_SIZES = [20, 14, 18, 12, 16, 14, 20];
const HEART_COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#be123c', '#f9a8d4', '#fecdd3'];

const HeartFloat: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const accent = customStyling?.primaryColor ?? '#f43f5e';

  return (
    <CardShell
      coverFrom="#ffe4e6"
      coverTo={accent}
      coverIcon={<Heart size={36} fill="white" className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #fff1f2 0%, #fdf2f8 100%)' }}
      >
        {/* Floating hearts background */}
        {HEART_SIZES.map((size, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: `${8 + i * 13}%`, bottom: `${4 + (i % 4) * 10}%` }}
            animate={{ y: [0, -16, 0], rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut', delay: i * 0.15 }}
          >
            <Heart size={size} fill={HEART_COLORS[i]} style={{ color: HEART_COLORS[i] }} />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <Heart size={44} fill={accent} style={{ color: accent }} />
          </motion.div>

          {customText.to && (
            <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
              Dear {customText.to},
            </p>
          )}
          <h2 className="text-2xl font-bold leading-snug" style={{ fontFamily: 'Cormorant Garamond, serif', color: accent }}>
            {customText.headline}
          </h2>
          <p className="text-sm leading-relaxed max-w-[200px] italic text-stone-600"
             style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {customText.body}
          </p>
          <p className="text-xs italic text-stone-400" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {customText.signature}{senderName ? `, ${senderName}` : ''}
          </p>
        </motion.div>
      </div>
    </CardShell>
  );
};

export default HeartFloat;
