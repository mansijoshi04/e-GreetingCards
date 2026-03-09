'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CardContent from '@/components/cards/CardContent';
import ConfettiLayer from '@/components/cards/ConfettiLayer';

interface ScrollToOpenProps {
  content: Record<string, string>;
  design: any;
  cardId: string;
}

export default function ScrollToOpen({
  content,
  design,
  cardId,
}: ScrollToOpenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Map scroll progress to envelope flap rotation (0° to -180°)
  const flapRotation = useTransform(scrollYProgress, [0, 0.4], [0, -180]);

  // Map scroll to card reveal position (400px below to 0)
  const cardY = useTransform(scrollYProgress, [0.2, 0.8], [400, 0]);

  // Map scroll to card opacity
  const cardOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  // Trigger confetti when scroll reaches 70%
  const confettiTrigger = useTransform(scrollYProgress, (value) => {
    if (value > 0.7 && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      return true;
    }
    return value > 0.7;
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
          className="absolute w-80 rounded-lg shadow-2xl z-30"
          style={{
            y: cardY,
            opacity: cardOpacity,
          }}
        >
          <CardContent content={content} design={design} />
        </motion.div>

        {/* Confetti effect */}
        {confettiConfig.enabled && (
          <ConfettiLayer
            trigger={hasTriggeredConfetti}
            config={confettiConfig}
            cardId={cardId}
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
        </motion.div>

        {/* Share buttons (bottom) */}
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex gap-4 justify-center z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: cardOpacity as any, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ShareButton
            onClick={() => shareCard('copy')}
            icon="📋"
            label="Copy Link"
          />
          <ShareButton
            onClick={() => shareCard('whatsapp')}
            icon="💬"
            label="WhatsApp"
          />
          <ShareButton
            onClick={() => shareCard('email')}
            icon="📧"
            label="Email"
          />
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Share button component
 */
function ShareButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2 text-sm font-medium"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}

/**
 * Share card via different channels
 */
function shareCard(method: 'copy' | 'whatsapp' | 'email') {
  const url = window.location.href;
  const title = 'You received a special greeting card!';

  if (method === 'copy') {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  } else if (method === 'whatsapp') {
    const text = encodeURIComponent(`${title}\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  } else if (method === 'email') {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Open this greeting card:\n\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }
}
