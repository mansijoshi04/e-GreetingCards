'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CardContent from '@/components/cards/CardContent';
import ConfettiLayer from '@/components/cards/ConfettiLayer';
import ShareButton from '@/components/ui/ShareButton';
import { shareCard, downloadCardAsPng } from '@/lib/utils/cardUtils';
import { Copy, MessageCircle, Mail, Download } from 'lucide-react';

interface ScrollToOpenProps {
  content: Record<string, string>;
  design: any;
  styling?: Record<string, any>;
  cardId: string;
  category?: string;
  tier?: string;
  isPreview?: boolean;
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollToOpen({
  content,
  design,
  styling = {},
  cardId,
  category = 'birthday',
  tier = 'basic',
  isPreview = false,
  scrollContainer,
}: ScrollToOpenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end start'],
  });

  const confettiConfig = design.animations?.confetti || {};
  const visualTheme: string = design?.layout?.visualTheme || '';

  // ── Balloon Party: balloons float up as user scrolls ──────────────────────
  const balloon1Y    = useTransform(scrollYProgress, [0, 0.65], ['95%', '-30%']);
  const balloon2Y    = useTransform(scrollYProgress, [0.05, 0.70], ['100%', '-20%']);
  const balloon3Y    = useTransform(scrollYProgress, [0.02, 0.68], ['98%', '-25%']);
  const balloon4Y    = useTransform(scrollYProgress, [0.08, 0.72], ['100%', '-15%']);
  const balloonCardY = useTransform(scrollYProgress, [0.15, 0.65], ['80%', '0%']);
  const balloonCardOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);

  // ── Envelope: standard reveal ─────────────────────────────────────────────
  const flapRotation  = useTransform(scrollYProgress, [0, 0.4],  [0, -180]);
  const cardY         = useTransform(scrollYProgress, [0.1, 0.55], [400, 0]);
  const cardOpacity   = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  // Shared: trigger confetti + share buttons once card fully revealed
  useTransform(scrollYProgress, (value) => {
    if (value > 0.55 && !hasTriggeredConfetti) setHasTriggeredConfetti(true);
    if (value > 0.4  && !cardRevealed)         setCardRevealed(true);
  });

  if (visualTheme === 'balloon-party') {
    return (
      <div ref={containerRef} className="h-[200vh] relative">
        <div className="sticky top-0 h-[100dvh] flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, #56c8f0 0%, #a8e6f8 60%, #c9f4b2 100%)' }}>

          {/* Clouds */}
          <svg className="absolute top-8 left-0 right-0 w-full pointer-events-none" style={{ height: 60 }} viewBox="0 0 400 60" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="70"  cy="35" rx="40" ry="18" fill="white" opacity="0.8" />
            <ellipse cx="96"  cy="26" rx="28" ry="16" fill="white" opacity="0.8" />
            <ellipse cx="46"  cy="32" rx="24" ry="14" fill="white" opacity="0.8" />
            <ellipse cx="310" cy="38" rx="45" ry="20" fill="white" opacity="0.7" />
            <ellipse cx="344" cy="27" rx="32" ry="18" fill="white" opacity="0.7" />
            <ellipse cx="282" cy="36" rx="28" ry="15" fill="white" opacity="0.7" />
          </svg>

          {/* Balloon 1 – red */}
          <motion.div className="absolute left-[8%] pointer-events-none" style={{ y: balloon1Y }}>
            <BalloonSVG color="#FF5252" highlight="#FF9090" size={88} />
          </motion.div>

          {/* Balloon 2 – yellow */}
          <motion.div className="absolute left-[28%] pointer-events-none" style={{ y: balloon2Y }}>
            <BalloonSVG color="#FFC107" highlight="#FFE066" size={80} />
          </motion.div>

          {/* Balloon 3 – purple */}
          <motion.div className="absolute right-[28%] pointer-events-none" style={{ y: balloon3Y }}>
            <BalloonSVG color="#9C27B0" highlight="#D0AAFF" size={84} />
          </motion.div>

          {/* Balloon 4 – green */}
          <motion.div className="absolute right-[8%] pointer-events-none" style={{ y: balloon4Y }}>
            <BalloonSVG color="#26A65B" highlight="#80E8A0" size={76} />
          </motion.div>

          {/* Card — rises up as if carried by balloons */}
          <motion.div
            className="absolute w-72 rounded-xl shadow-2xl z-30 card-content-wrapper"
            style={{ y: balloonCardY, opacity: balloonCardOpacity }}
          >
            <CardContent content={content} design={design} styling={styling} />
          </motion.div>

          {/* Scroll hint */}
          <div className="absolute top-16 left-0 right-0 text-center pointer-events-none z-40">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="text-stone-700 font-medium"
            >
              <p className="text-lg drop-shadow">Scroll down to release the balloons</p>
              <motion.p className="text-xl mt-1" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.p>
            </motion.div>
          </div>

          {/* Confetti */}
          {confettiConfig.enabled && (
            <ConfettiLayer trigger={hasTriggeredConfetti} config={confettiConfig} cardId={cardId} category={category} tier={tier} />
          )}

          {/* Share buttons */}
          {!isPreview && (
            <motion.div
              className="absolute bottom-10 left-0 right-0 flex gap-4 justify-center z-40 flex-wrap px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: cardRevealed ? 1 : 0, y: cardRevealed ? 0 : 20 }}
              transition={{ duration: 0.4 }}
            >
              <ShareButton onClick={() => shareCard('copy')}      Icon={Copy}          label="Copy Link" />
              <ShareButton onClick={() => shareCard('whatsapp')}  Icon={MessageCircle} label="WhatsApp" />
              <ShareButton onClick={() => shareCard('email')}     Icon={Mail}          label="Email" />
              <ShareButton onClick={() => downloadCardAsPng('.card-content-wrapper')} Icon={Download} label="Download" />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ── Default: envelope animation ───────────────────────────────────────────
  return (
    <div ref={containerRef} className="h-[200vh] relative">
      <div className="sticky top-0 h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">

        {/* Envelope body */}
        <div className="absolute w-96 h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-2xl z-10" />

        {/* Envelope flap */}
        <motion.div
          className="absolute w-96 h-48 bg-gradient-to-br from-red-200 to-red-300 rounded-t-lg shadow-lg z-20 origin-bottom"
          style={{ rotateX: flapRotation, transformStyle: 'preserve-3d', top: '25%', perspective: '1000px' }}
        />

        {/* Card slides out */}
        <motion.div
          className="absolute w-80 rounded-lg shadow-2xl z-30 card-content-wrapper"
          style={{ y: cardY, opacity: cardOpacity }}
        >
          <CardContent content={content} design={design} styling={styling} />
        </motion.div>

        {/* Confetti */}
        {confettiConfig.enabled && (
          <ConfettiLayer trigger={hasTriggeredConfetti} config={confettiConfig} cardId={cardId} category={category} tier={tier} />
        )}

        {/* Scroll hint */}
        <div className="absolute top-20 left-0 right-0 text-center pointer-events-none z-40">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-600 font-medium"
          >
            <p className="text-lg">Scroll down to open</p>
            <p className="text-sm text-gray-500 mt-1">↓</p>
          </motion.div>
        </div>

        {/* Share buttons */}
        {!isPreview && (
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex gap-4 justify-center z-40 flex-wrap px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: cardRevealed ? 1 : 0, y: cardRevealed ? 0 : 20 }}
            transition={{ duration: 0.4 }}
          >
            <ShareButton onClick={() => shareCard('copy')}      Icon={Copy}          label="Copy Link" />
            <ShareButton onClick={() => shareCard('whatsapp')}  Icon={MessageCircle} label="WhatsApp" />
            <ShareButton onClick={() => shareCard('email')}     Icon={Mail}          label="Email" />
            <ShareButton onClick={() => downloadCardAsPng('.card-content-wrapper')} Icon={Download} label="Download" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Balloon SVG helper ────────────────────────────────────────────────────────
function BalloonSVG({ color, highlight, size }: { color: string; highlight: string; size: number }) {
  return (
    <svg viewBox="-55 -75 110 170" style={{ width: size, height: size * 1.55 }}>
      {/* Balloon body */}
      <ellipse cx="0" cy="0" rx="48" ry="60" fill={color} />
      {/* Shine */}
      <ellipse cx="-16" cy="-22" rx="16" ry="10" fill={highlight} opacity="0.35" transform="rotate(-20,-16,-22)" />
      {/* Knot */}
      <ellipse cx="0" cy="62" rx="6" ry="4" fill={color} />
      {/* String */}
      <path d="M0 66 Q8 85 -4 100 Q-12 115 2 135" stroke="#aaa" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
