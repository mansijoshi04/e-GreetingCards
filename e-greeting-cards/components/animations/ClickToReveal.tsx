'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardContent from '@/components/cards/CardContent';
import ConfettiLayer from '@/components/cards/ConfettiLayer';

interface ClickToRevealProps {
  content: Record<string, string>;
  design: any;
  cardId: string;
}

export default function ClickToReveal({
  content,
  design,
  cardId,
}: ClickToRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const confettiConfig = design.animations?.confetti || {};

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      {/* Cover layer - scales and fades out */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-purple-500 cursor-pointer flex items-center justify-center z-50"
            onClick={handleReveal}
            initial={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 20,
              opacity: 0,
              transition: { duration: 0.8, ease: 'easeInOut' },
            }}
          >
            <motion.div
              className="text-center text-white"
              initial={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 font-headline"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                🎉 You've got a card!
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Click anywhere to open
              </motion.p>
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.div
                  className="inline-block"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <p className="text-3xl">↓</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card content - fades and scales in */}
      <motion.div
        className="max-w-2xl w-full mx-auto px-4 z-40 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isRevealed
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.8 }
        }
        transition={{
          delay: isRevealed ? 0.3 : 0,
          duration: 0.6,
        }}
      >
        <div className="rounded-2xl shadow-2xl overflow-hidden">
          <CardContent content={content} design={design} />
        </div>
      </motion.div>

      {/* Share buttons */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex gap-4 justify-center z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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
        )}
      </AnimatePresence>

      {/* Confetti effect */}
      {confettiConfig.enabled && isRevealed && (
        <ConfettiLayer trigger={isRevealed} config={confettiConfig} cardId={cardId} />
      )}
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
