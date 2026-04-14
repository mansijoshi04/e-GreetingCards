import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import CardShell from './CardShell';
import { Watermark } from '../ui/Watermark';
import type { CardProps } from '../../types/card';

const MinimalWish: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const accent = customStyling?.secondaryColor ?? '#f43f5e';
  const coverFrom = customStyling?.primaryColor ?? '#ffeef2';
  const coverTo = accent;

  return (
    <CardShell
      coverFrom={coverFrom}
      coverTo={coverTo}
      coverIcon={<Sparkles size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
      confettiOnOpen={false}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center gap-5"
        style={{ background: `linear-gradient(145deg, ${coverFrom} 0%, #fff8f8 100%)` }}
      >
        <div className="absolute top-6 left-6 w-16 h-16 rounded-full opacity-15" style={{ background: accent }} />
        <div className="absolute bottom-8 right-6 w-24 h-24 rounded-full opacity-10" style={{ background: accent }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={isPreview ? { rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Sparkles size={32} style={{ color: accent }} />
          </motion.div>

          {customText.to && (
            <p className="text-sm italic" style={{ color: accent, opacity: 0.9, fontFamily: 'Cormorant Garamond, serif' }}>
              Dear {customText.to},
            </p>
          )}

          <h2 className="text-2xl font-bold leading-snug" style={{ fontFamily: 'Quicksand, sans-serif', color: accent }}>
            {customText.headline}
          </h2>

          <p className="text-sm leading-relaxed max-w-[210px]" style={{ color: '#57534e' }}>
            {customText.body}
          </p>

          <div className="w-10 h-px" style={{ background: accent, opacity: 0.25 }} />

          <p className="text-xs italic" style={{ color: '#78716c' }}>
            {customText.signature}{senderName ? `, ${senderName}` : ''}
          </p>
        </motion.div>

        <Watermark />
      </div>
    </CardShell>
  );
};

export default MinimalWish;
