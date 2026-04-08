'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import FoldedCard from '@/components/cards/FoldedCard';
import { COVER_IMAGES, DEFAULT_COVER } from '@/components/cards/coverImages';

interface PremiumCardExperienceProps {
  content: Record<string, string>;
  design: any;
  styling?: Record<string, any>;
  cardId: string;
  category?: string;
  tier?: string;
}

// --- Blow Candles Experience (cake-celebration) ---

function BlowCandlesExperience({ onComplete }: { onComplete: () => void }) {
  const [isBlowing, setIsBlowing] = useState(false);
  const [done, setDone] = useState(false);

  const handleBlow = () => {
    if (isBlowing) return;
    setIsBlowing(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 400);
    }, 2500);
  };

  return (
    <motion.div
      key="cake"
      exit={{ scale: 0.85, opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: 'anticipate' }}
      className="flex flex-col items-center justify-center w-full h-full"
    >
      {/* Cake */}
      <motion.div
        animate={isBlowing ? { x: [0, -3, 3, -3, 3, 0] } : {}}
        transition={{ duration: 0.5, repeat: isBlowing ? 3 : 0 }}
        className="relative scale-90"
      >
        {/* Top tier */}
        <div className="w-28 h-14 bg-rose-200 rounded-t-lg relative shadow-inner border-b-2 border-rose-300 mx-auto">
          <div className="absolute inset-0 overflow-hidden rounded-t-lg opacity-60">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-2 rounded-full"
                style={{
                  backgroundColor: ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa'][i % 5],
                  top: `${(i * 17) % 80}%`,
                  left: `${(i * 23) % 85}%`,
                  transform: `rotate(${i * 36}deg)`,
                }}
              />
            ))}
          </div>
          {/* Candles */}
          <div className="absolute -top-10 left-0 right-0 flex justify-around px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative w-2 h-9 bg-yellow-100 rounded-full border-b-2 border-yellow-200">
                <AnimatePresence>
                  {!isBlowing && (
                    <motion.div
                      key="flame"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 0.4 + i * 0.15 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-3.5 h-5 bg-orange-400 rounded-full blur-[2px]"
                      style={{ boxShadow: '0 0 10px #f97316' }}
                    />
                  )}
                  {isBlowing && !done && (
                    <motion.div
                      key="smoke"
                      initial={{ opacity: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 0.5, 0], y: -50, scale: [0.5, 2, 3], x: [0, 8, -8, 4] }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-stone-400/50 rounded-full blur-md"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom tier */}
        <div className="w-44 h-18 bg-rose-200 rounded-t-lg relative shadow-inner border-b-4 border-rose-300 -mt-1 mx-auto" style={{ height: '4.5rem' }}>
          <div className="absolute inset-0 overflow-hidden rounded-t-lg opacity-50">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-2 rounded-full"
                style={{
                  backgroundColor: ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa'][i % 5],
                  top: `${(i * 19) % 80}%`,
                  left: `${(i * 21) % 90}%`,
                  transform: `rotate(${i * 25}deg)`,
                }}
              />
            ))}
          </div>
          {/* Frosting drips */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-4 h-6 bg-white/40 rounded-full -mt-1" />
            ))}
          </div>
        </div>
        {/* Plate */}
        <div className="w-52 h-6 bg-stone-200 rounded-full -mt-1 mx-auto shadow-md" />
      </motion.div>

      {/* CTA */}
      {!isBlowing && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleBlow}
          className="mt-10 bg-white/90 backdrop-blur px-7 py-3.5 rounded-full text-base font-bold shadow-lg hover:bg-white transition-all flex items-center gap-2 text-rose-500 border-2 border-rose-100"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          <Sparkles size={18} className="text-rose-400" />
          Make a Wish &amp; Blow!
        </motion.button>
      )}
      {isBlowing && !done && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-stone-500 italic text-base font-medium"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Puff... your wish is coming true!
        </motion.p>
      )}
    </motion.div>
  );
}

// --- Pop Balloons Experience (balloon-party, confetti-burst) ---

const BALLOON_EMOJIS = ['🎈', '🎊', '🎁', '✨', '💖', '⭐', '🌈'];

function PopBalloonsExperience({ onComplete }: { onComplete: () => void }) {
  const [popped, setPopped] = useState<number[]>([]);
  const TARGET = 4;

  const handlePop = (i: number) => {
    if (popped.includes(i)) return;
    const next = [...popped, i];
    setPopped(next);
    if (next.length >= TARGET) {
      setTimeout(onComplete, 900);
    }
  };

  const remaining = TARGET - popped.length;

  return (
    <motion.div
      key="balloons"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full"
    >
      {BALLOON_EMOJIS.map((b, i) => {
        const leftPos = 10 + i * 11;
        const topPos = 15 + (i % 3) * 18;
        return (
          <motion.div
            key={i}
            initial={{ y: 500, left: `${leftPos}%` }}
            animate={
              !popped.includes(i)
                ? { y: [0, -18, 0], x: [-8, 8, -8], top: `${topPos}%` }
                : { scale: [1, 1.6, 0], opacity: [1, 1, 0], rotate: [0, 25, -25] }
            }
            transition={
              !popped.includes(i)
                ? {
                    y: { repeat: Infinity, duration: 2.5 + i * 0.4, ease: 'easeInOut' },
                    x: { repeat: Infinity, duration: 3.5 + i * 0.4, ease: 'easeInOut' },
                  }
                : { duration: 0.35 }
            }
            onClick={() => handlePop(i)}
            className="absolute text-5xl cursor-pointer select-none -translate-x-1/2 hover:scale-110 transition-transform"
          >
            {b}
          </motion.div>
        );
      })}

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <motion.p
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-stone-500 text-sm font-bold italic"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          {remaining > 0
            ? `Pop ${remaining} more balloon${remaining > 1 ? 's' : ''} to reveal...`
            : 'Yay! Here it comes...'}
        </motion.p>
      </div>
    </motion.div>
  );
}

// --- Main PremiumCardExperience ---

export default function PremiumCardExperience({
  content,
  design,
  styling = {},
  cardId,
  category,
  tier,
}: PremiumCardExperienceProps) {
  const [gameComplete, setGameComplete] = useState(false);
  const visualTheme = design?.layout?.visualTheme || '';
  const interactionType = design?.animations?.interactionType;
  const coverImageUrl = COVER_IMAGES[visualTheme] || DEFAULT_COVER;

  // Determine which game to show
  const isCake = interactionType === 'blow-candles' || visualTheme === 'cake-celebration';
  const isBalloon = interactionType === 'pop-balloons' || visualTheme === 'balloon-party' || visualTheme === 'confetti-burst';

  // Background per theme
  const gameBg = isCake
    ? 'linear-gradient(135deg, #fff1f2, #ffe4e6)'
    : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';

  return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: gameComplete ? undefined : gameBg }}>
      <AnimatePresence mode="wait">
        {!gameComplete ? (
          <div key="game" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {isCake && <BlowCandlesExperience onComplete={() => setGameComplete(true)} />}
            {isBalloon && <PopBalloonsExperience onComplete={() => setGameComplete(true)} />}
            {!isCake && !isBalloon && (
              // Fallback for other premium themes — just show folded card directly
              <motion.div
                key="fallback"
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setGameComplete(true)}
                  className="px-8 py-4 bg-white rounded-full shadow-lg text-stone-700 font-bold text-lg border border-stone-100"
                >
                  Open your card ✨
                </motion.button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            key="card"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', damping: 18 }}
            className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100"
          >
            <FoldedCard
              content={content}
              design={design}
              styling={styling}
              cardId={cardId}
              category={category}
              tier={tier}
              coverImageUrl={coverImageUrl}
              typewriter={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
