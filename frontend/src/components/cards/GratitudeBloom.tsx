import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flower2, Scroll } from 'lucide-react';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

// CSS flower shape — no emoji
const Flower = ({ color, size = 28 }: { color: string; size?: number }) => {
  const petalSize = size * 0.38;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* 4 petals */}
      {[0, 90, 180, 270].map(angle => (
        <div
          key={angle}
          className="absolute"
          style={{
            width: petalSize,
            height: petalSize * 1.5,
            background: `radial-gradient(ellipse at 50% 30%, ${color}cc, ${color})`,
            borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
            top: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg)`,
          }}
        />
      ))}
      {/* Center */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          background: '#fde68a',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}
      />
    </div>
  );
};

const FLOWER_COLORS = ['#f43f5e', '#fb923c', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

const GratitudeBloom: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const [progress, setProgress] = useState(isPreview ? 1 : 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const accent = customStyling?.primaryColor ?? '#10b981';

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isPreview) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isPreview]);

  const flowerConfigs = React.useMemo(() =>
    FLOWER_COLORS.map((color, i) => ({
      color,
      left: 4 + i * 16,
      bloomAt: i / FLOWER_COLORS.length * 0.8,
      size: 24 + (i % 3) * 8,
    })),
  []);

  return (
    <CardShell
      coverFrom="#d1fae5"
      coverTo={accent}
      coverIcon={<Flower2 size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
      confettiOnOpen={false}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #fafffe 100%)' }}
      >
        <div
          style={{ height: isPreview ? 'auto' : '220%', minHeight: '100%' }}
          className="flex flex-col items-center justify-end pb-10 px-6"
        >
          {/* Flower row */}
          <div className="relative w-full h-28 mb-4">
            {flowerConfigs.map((f, i) => {
              const bloomed = isPreview || progress > f.bloomAt;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: `${f.left}%`, bottom: 0 }}
                  animate={bloomed ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 120, delay: i * 0.1 }}
                >
                  <Flower color={f.color} size={f.size} />
                </motion.div>
              );
            })}
          </div>

          {/* Message */}
          <motion.div
            animate={isPreview || progress > 0.5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm w-full"
          >
            <Flower2 size={32} style={{ color: accent }} />

            {customText.to && (
              <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
                Dear {customText.to},
              </p>
            )}
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: accent }}>
              {customText.headline}
            </h2>
            <p className="text-sm leading-relaxed italic text-stone-600 max-w-[200px]"
               style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {customText.body}
            </p>
            <p className="text-xs italic text-stone-400" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {customText.signature}{senderName ? `, ${senderName}` : ''}
            </p>
          </motion.div>

          {!isPreview && progress < 0.2 && (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-4 text-stone-400 text-xs font-medium flex items-center gap-1"
            >
              <Scroll size={12} /> Scroll to bloom
            </motion.p>
          )}
        </div>
      </div>
    </CardShell>
  );
};

export default GratitudeBloom;
