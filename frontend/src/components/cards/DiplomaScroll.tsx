import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Scroll } from 'lucide-react';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

const DiplomaScroll: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const accent = customStyling?.primaryColor ?? '#854d0e';

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isPreview) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setScrollProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isPreview]);

  const unroll = isPreview ? 1 : Math.min(1, scrollProgress * 1.6);

  return (
    <CardShell
      coverFrom="#fef9c3"
      coverTo={accent}
      coverIcon={<GraduationCap size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
      confettiOnOpen={false}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ background: 'linear-gradient(160deg, #fefce8 0%, #fef9c3 100%)' }}
      >
        <div
          style={{ height: isPreview ? 'auto' : '240%', minHeight: '100%' }}
          className="flex flex-col items-center justify-start pt-8 px-5 pb-8 gap-4"
        >
          <motion.div
            className="relative w-full max-w-[260px]"
            style={{ originY: 0 }}
            animate={{ scaleY: Math.max(0.08, unroll) }}
            transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          >
            <div
              className="w-full h-5 rounded-full shadow mb-1"
              style={{ background: `linear-gradient(180deg, ${accent} 0%, #92400e 100%)` }}
            />
            <div
              className="w-full px-5 py-6 flex flex-col items-center text-center gap-3"
              style={{
                background: 'linear-gradient(180deg, #fef9c3 0%, #fefce8 100%)',
                border: `1.5px solid ${accent}40`,
                fontFamily: 'Cormorant Garamond, serif',
              }}
            >
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: accent }}
              >
                <GraduationCap size={18} style={{ color: accent }} />
              </div>

              {customText.to && (
                <p className="text-xs italic" style={{ color: accent, opacity: 0.8 }}>
                  Presented to {customText.to}
                </p>
              )}

              <h2 className="text-lg font-bold leading-tight" style={{ color: accent }}>
                {customText.headline}
              </h2>

              <div className="w-12 h-px" style={{ background: accent, opacity: 0.3 }} />

              <p className="text-xs leading-relaxed text-stone-600 italic">{customText.body}</p>

              <div className="w-12 h-px" style={{ background: accent, opacity: 0.3 }} />

              <p className="text-xs italic text-stone-500">
                {customText.signature}{senderName ? `, ${senderName}` : ''}
              </p>
            </div>
            <div
              className="w-full h-5 rounded-full shadow mt-1"
              style={{ background: `linear-gradient(180deg, #92400e 0%, ${accent} 100%)` }}
            />
          </motion.div>

          {!isPreview && scrollProgress < 0.25 && (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-4 text-stone-400 text-xs font-medium flex items-center gap-1"
            >
              <Scroll size={12} /> Scroll to unroll
            </motion.p>
          )}
        </div>
      </div>
    </CardShell>
  );
};

export default DiplomaScroll;
