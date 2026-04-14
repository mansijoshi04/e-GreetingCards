/**
 * CardShell — the universal greeting card wrapper.
 *
 * All card types use this. It handles:
 *  - Front cover design (gradient + icon)
 *  - 3D fold-open animation on tap/click
 *  - Confetti burst on open
 *  - isPreview: skips to open state immediately so the editor sees the inside
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface CardShellProps {
  /** Primary/lighter background color for the front cover */
  coverFrom: string;
  /** Secondary/darker accent color for the front cover */
  coverTo: string;
  /** Icon rendered centered on the front cover */
  coverIcon: React.ReactNode;
  /** Short prompt shown on the cover before opening */
  interactionHint?: string;
  /** Content rendered inside the open card */
  children: React.ReactNode;
  /** When true, card starts open (editor preview mode) */
  isPreview?: boolean;
  /** Called once when the card opens — use to trigger card-specific effects */
  onOpen?: () => void;
  /** Fire confetti on open? Default true */
  confettiOnOpen?: boolean;
}

const CardShell: React.FC<CardShellProps> = ({
  coverFrom,
  coverTo,
  coverIcon,
  interactionHint = 'Tap to open',
  children,
  isPreview = false,
  onOpen,
  confettiOnOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(isPreview);

  const handleOpen = () => {
    if (isOpen || isPreview) return;
    setIsOpen(true);
    if (confettiOnOpen) {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 65, origin: { y: 0.55 } });
      }, 700);
    }
    onOpen?.();
  };

  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden"
      style={{ perspective: '1800px' }}
    >
      {/* Inside of the card (always rendered behind the cover) */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        {children}
      </div>

      {/* Front cover — folds open to the left */}
      <motion.div
        animate={{ rotateY: isOpen ? -168 : 0 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 z-20 rounded-3xl cursor-pointer"
        style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
        onClick={handleOpen}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 gap-6"
          style={{
            background: `linear-gradient(145deg, ${coverFrom} 0%, ${coverTo} 100%)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Icon badge */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
            {coverIcon}
          </div>

          {/* Tap hint pulses */}
          {!isOpen && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute bottom-8 flex flex-col items-center gap-1"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <p className="text-white/80 text-xs font-medium tracking-wide"
                 style={{ fontFamily: 'Quicksand, sans-serif' }}>
                {interactionHint}
              </p>
            </motion.div>
          )}
        </div>

        {/* Back of the front cover (inside-left page) */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #f7f3ef 0%, #faf8f5 100%)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default CardShell;
