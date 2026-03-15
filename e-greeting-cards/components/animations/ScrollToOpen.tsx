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
}

export default function ScrollToOpen({
  content,
  design,
  styling = {},
  cardId,
  category = 'birthday',
  tier = 'basic',
  isPreview = false,
}: ScrollToOpenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Map scroll progress to envelope flap rotation (0° to -180°)
  const flapRotation = useTransform(scrollYProgress, [0, 0.4], [0, -180]);

  // Map scroll to card reveal position (400px below to 0)
  const cardY = useTransform(scrollYProgress, [0.1, 0.55], [400, 0]);

  // Map scroll to card opacity
  const cardOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  // Trigger confetti + reveal buttons when card is fully up
  useTransform(scrollYProgress, (value) => {
    if (value > 0.55 && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
    }
    if (value > 0.4 && !cardRevealed) {
      setCardRevealed(true);
    }
  });

  const layout = design.layout || {};
  const confettiConfig = design.animations?.confetti || {};

  return (
    <div ref={containerRef} className="h-[200vh] relative">
      {/* Sticky container for envelope and card */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Envelope body (static background) */}
        <div className="absolute w-96 h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-2xl z-10" />

        {/* Envelope flap (rotates) */}
        <motion.div
          className="absolute w-96 h-48 bg-gradient-to-br from-red-200 to-red-300 rounded-t-lg shadow-lg z-20 origin-bottom"
          style={{
            rotateX: flapRotation,
            transformStyle: 'preserve-3d',
            top: '25%',
            perspective: '1000px',
          }}
        />

        {/* Card content (slides out) */}
        <motion.div
          className="absolute w-80 rounded-lg shadow-2xl z-30 card-content-wrapper"
          style={{
            y: cardY,
            opacity: cardOpacity,
          }}
        >
          <CardContent content={content} design={design} styling={styling} />
        </motion.div>

        {/* Confetti effect */}
        {confettiConfig.enabled && (
          <ConfettiLayer
            trigger={hasTriggeredConfetti}
            config={confettiConfig}
            cardId={cardId}
            category={category}
            tier={tier}
          />
        )}

        {/* Instructions */}
        <div className="absolute top-20 left-0 right-0 text-center pointer-events-none z-40">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-600 font-medium"
          >
            <p className="text-lg">Scroll down to open</p>
            <p className="text-sm text-gray-500 mt-1">↓</p>
          </motion.div>
        </div>

        {/* Share buttons — hidden in preview mode */}
        {!isPreview && (
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex gap-4 justify-center z-40 flex-wrap px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: cardRevealed ? 1 : 0, y: cardRevealed ? 0 : 20 }}
            transition={{ duration: 0.4 }}
          >
            <ShareButton onClick={() => shareCard('copy')} Icon={Copy} label="Copy Link" />
            <ShareButton onClick={() => shareCard('whatsapp')} Icon={MessageCircle} label="WhatsApp" />
            <ShareButton onClick={() => shareCard('email')} Icon={Mail} label="Email" />
            <ShareButton
              onClick={() => downloadCardAsPng('.card-content-wrapper')}
              Icon={Download}
              label="Download"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
