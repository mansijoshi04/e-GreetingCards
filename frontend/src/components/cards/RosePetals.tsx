import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

// CSS petal — no emoji
const Petal = ({ color, size = 20, rotate = 0 }: { color: string; size?: number; rotate?: number }) => (
  <div
    style={{
      width: size,
      height: size * 1.4,
      background: `radial-gradient(ellipse at 35% 30%, ${color}cc, ${color})`,
      borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
      transform: `rotate(${rotate}deg)`,
    }}
  />
);

const PETAL_COLORS = ['#fda4af', '#fb7185', '#f9a8d4', '#f43f5e', '#fecdd3', '#fde68a', '#fda4af'];
const PETAL_ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315, 20, 65, 110, 155];

const RosePetals: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const accent = customStyling?.primaryColor ?? '#e11d48';

  const petalConfigs = React.useMemo(() =>
    [...Array(12)].map((_, i) => ({
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      rotate: PETAL_ROTATIONS[i],
      left: 4 + (i * 8),
      delay: i * 0.18,
      duration: 4.5 + (i % 3) * 1.2,
      size: 16 + (i % 4) * 5,
    })),
  []);

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
        style={{ background: 'linear-gradient(160deg, #fff1f2 0%, #fdf2f8 50%, #f5f3ff 100%)' }}
      >
        {/* Falling petals */}
        {petalConfigs.map((p, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: `${p.left}%`, top: -30 }}
            animate={{ y: ['0px', '115vh'], rotate: [p.rotate, p.rotate + 360], x: [0, 15, -12, 8, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Petal color={p.color} size={p.size} rotate={p.rotate} />
          </motion.div>
        ))}

        {/* Message card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isPreview ? 0 : 0.5, duration: 0.9 }}
          className="relative z-10 flex flex-col items-center gap-4 bg-white/65 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Heart size={36} fill={accent} style={{ color: accent }} />
          </motion.div>

          {customText.to && (
            <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
              Dear {customText.to},
            </p>
          )}
          <h2
            className="text-2xl font-bold leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: accent }}
          >
            {customText.headline}
          </h2>
          <p
            className="text-sm leading-relaxed max-w-[200px] italic"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#44403c' }}
          >
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

export default RosePetals;
