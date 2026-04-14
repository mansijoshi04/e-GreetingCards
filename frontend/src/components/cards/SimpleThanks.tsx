import React from 'react';
import { motion } from 'motion/react';
import { HeartHandshake } from 'lucide-react';
import CardShell from './CardShell';
import { Watermark } from '../ui/Watermark';
import type { CardProps } from '../../types/card';

const SimpleThanks: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const accent = customStyling?.primaryColor ?? '#10b981';
  const coverFrom = '#d1fae5';
  const coverTo = accent;

  return (
    <CardShell
      coverFrom={coverFrom}
      coverTo={coverTo}
      coverIcon={<HeartHandshake size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
      confettiOnOpen={false}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center gap-5"
        style={{ background: 'linear-gradient(145deg, #f0fdf4 0%, #fafffe 100%)' }}
      >
        <div className="absolute top-6 right-6 w-20 h-20 rounded-full opacity-10" style={{ background: accent }} />
        <div className="absolute bottom-6 left-4 w-14 h-14 rounded-full opacity-10" style={{ background: accent }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={isPreview ? { y: [0, -6, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <HeartHandshake size={36} style={{ color: accent }} />
          </motion.div>

          {customText.to && (
            <p className="text-sm italic" style={{ color: accent, opacity: 0.9, fontFamily: 'Cormorant Garamond, serif' }}>
              Dear {customText.to},
            </p>
          )}

          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: accent }}>
            {customText.headline}
          </h2>

          <p className="text-sm leading-relaxed max-w-[210px]" style={{ color: '#44403c', opacity: 0.85 }}>
            {customText.body}
          </p>

          <div className="flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: accent, opacity: 0.3 }} />
            <p className="text-xs italic" style={{ color: '#78716c' }}>
              {customText.signature}{senderName ? `, ${senderName}` : ''}
            </p>
            <div className="w-8 h-px" style={{ background: accent, opacity: 0.3 }} />
          </div>
        </motion.div>

        <Watermark />
      </div>
    </CardShell>
  );
};

export default SimpleThanks;
