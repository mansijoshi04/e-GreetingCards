'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Edit3 } from 'lucide-react';
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
      exit={{ scale: 0.8, opacity: 0, y: -50 }}
      className="flex flex-col items-center"
    >
      <motion.div
        animate={isBlowing ? { x: [0, -2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.5, repeat: isBlowing ? Infinity : 0 }}
        className="relative z-10 mt-12 scale-75 md:scale-100"
      >
        <div className="flex flex-col items-center">
          {/* Top Layer */}
          <div className="w-32 h-16 bg-rose-200 rounded-t-lg relative shadow-inner border-b-2 border-rose-300">
            {/* Sprinkles */}
            <div className="absolute inset-0 overflow-hidden rounded-t-lg opacity-60">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa'][i % 5],
                    top: `${(i * 17) % 100}%`,
                    left: `${(i * 23) % 100}%`,
                    transform: `rotate(${i * 30}deg)`,
                  }}
                />
              ))}
            </div>
            {/* Drip effect */}
            <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-4 h-6 bg-white/40 rounded-full -mt-1" />
              ))}
            </div>
            {/* Candles */}
            <div className="absolute -top-10 left-0 right-0 flex justify-around px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative w-2 h-10 bg-yellow-100 rounded-full border-b-2 border-yellow-200">
                  <AnimatePresence>
                    {!isBlowing && (
                      <motion.div
                        key="flame"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 0.5 + i * 0.15 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-500 rounded-full blur-[2px]"
                        style={{ boxShadow: '0 0 10px #f97316' }}
                      />
                    )}
                    {isBlowing && !done && (
                      <motion.div
                        key="smoke"
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.6, 0], y: -60, scale: [0.5, 2, 3], x: [0, 10, -10, 5] }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-stone-400/60 rounded-full blur-md"
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Layer */}
          <div className="w-48 h-20 bg-rose-200 rounded-t-lg relative shadow-inner border-b-4 border-rose-300 -mt-1">
            {/* Sprinkles */}
            <div className="absolute inset-0 overflow-hidden rounded-t-lg opacity-60">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa'][i % 5],
                    top: `${(i * 19) % 100}%`,
                    left: `${(i * 21) % 100}%`,
                    transform: `rotate(${i * 18}deg)`,
                  }}
                />
              ))}
            </div>
            {/* Drip effect */}
            <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-5 h-8 bg-white/40 rounded-full -mt-1" />
              ))}
            </div>
          </div>
        </div>

        {/* Plate */}
        <div className="w-56 h-8 bg-stone-200 rounded-full -mt-2 mx-auto shadow-md" />
      </motion.div>

      {/* CTA */}
      {!isBlowing && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleBlow}
          className="mt-12 bg-white/80 backdrop-blur px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-white transition-all flex items-center gap-2 text-rose-500 border-2 border-rose-100"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          <Sparkles size={20} className="text-rose-500" />
          Make a Wish &amp; Blow!
        </motion.button>
      )}
      {isBlowing && !done && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-stone-500 italic text-lg font-medium"
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
      setTimeout(onComplete, 800);
    }
  };

  const remaining = TARGET - popped.length;

  return (
    <motion.div
      key="balloons"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full"
    >
      {BALLOON_EMOJIS.map((b, i) => {
        const leftPos = 15 + i * 12;
        const topPos = 20 + (i % 3) * 15;
        return (
          <motion.div
            key={i}
            initial={{ y: 600, left: `${leftPos}%` }}
            animate={
              !popped.includes(i)
                ? { y: [-20, 20, -20], x: [-10, 10, -10], top: `${topPos}%` }
                : { scale: [1, 1.5, 0], opacity: [1, 1, 0], rotate: [0, 20, -20] }
            }
            transition={
              !popped.includes(i)
                ? {
                    y: { repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' },
                    x: { repeat: Infinity, duration: 4 + i * 0.5, ease: 'easeInOut' },
                  }
                : { duration: 0.3 }
            }
            onClick={() => handlePop(i)}
            className="absolute text-5xl md:text-6xl cursor-pointer hover:scale-110 transition-transform select-none -translate-x-1/2"
          >
            {b}
          </motion.div>
        );
      })}

      <div className="absolute bottom-10 left-0 right-0 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-stone-400 text-sm font-bold italic"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          {remaining > 0 ? `Pop ${remaining} more to reveal...` : 'Yay! Here it comes...'}
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- Envelope Reveal Experience (rose-petals, heart-float) ---

function EnvelopeRevealExperience({ onComplete, coverImageUrl }: { onComplete: () => void; coverImageUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => setShowCard(true), 2000);
  };

  useEffect(() => {
    if (showCard) {
      setTimeout(onComplete, 200);
    }
  }, [showCard]);

  return (
    <motion.div
      key="envelope"
      exit={{ y: -100, opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: 'anticipate' }}
      className="flex flex-col items-center justify-center w-full h-full"
    >
      {/* Heart burst on open */}
      {isOpen && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.8],
                x: (i - 5.5) * 25 + (Math.round(Math.random() - 0.5) * 30),
                y: -140 - Math.round(Math.random() * 100),
                rotate: (Math.round(Math.random() - 0.5)) * 120,
              }}
              transition={{ delay: 0.3 + i * 0.08, duration: 2.2, ease: 'easeOut' }}
              className="absolute left-1/2 top-1/2"
            >
              <Heart
                size={14 + Math.round(Math.random() * 18)}
                className={i % 3 === 0 ? 'text-red-600' : i % 3 === 1 ? 'text-rose-400' : 'text-white'}
                fill="currentColor"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Envelope */}
      <div className="relative w-80 h-56 perspective-[2000px]">
        {/* Card preview inside — slides up when opened */}
        <motion.div
          animate={isOpen ? { y: -140, scale: 1.1 } : { y: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: 'backOut' }}
          className={`absolute inset-x-6 top-6 bottom-6 bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ${isOpen ? 'z-40' : 'z-10'}`}
        >
          <img
            src={coverImageUrl}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            alt="Card Preview"
          />
        </motion.div>

        {/* Envelope body */}
        <div
          className={`absolute inset-0 rounded-lg shadow-xl z-20 border border-[#bc9d76]`}
          style={{ backgroundColor: '#d2b48c' }}
        >
          {/* Top flap — folds open */}
          <motion.div
            animate={isOpen ? { rotateX: -160 } : { rotateX: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`absolute inset-x-0 top-0 h-1/2 origin-top shadow-md flex items-end justify-center pb-4 transition-all duration-300 ${isOpen ? 'z-10' : 'z-30'}`}
            style={{
              backgroundColor: '#c19a6b',
              transformStyle: 'preserve-3d',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          >
            {!isOpen && (
              <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-red-500 shadow-inner flex items-center justify-center mb-2">
                <Heart size={14} className="text-white" fill="currentColor" />
              </div>
            )}
          </motion.div>

          {/* Envelope interior flaps */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-lg">
            {/* Bottom flap */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 border-t border-[#bc9d76]/30"
              style={{ backgroundColor: '#d2b48c', clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}
            />
            {/* Left flap */}
            <div
              className="absolute inset-y-0 left-0 w-2/3 border-r border-[#bc9d76]/20"
              style={{ backgroundColor: '#e6ccac', opacity: 0.4, clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
            />
            {/* Right flap */}
            <div
              className="absolute inset-y-0 right-0 w-2/3 border-l border-[#bc9d76]/20"
              style={{ backgroundColor: '#e6ccac', opacity: 0.4, clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
            />
          </div>

          {/* Red bow — visible when closed */}
          {!isOpen && (
            <div className="absolute bottom-6 right-6 z-40 rotate-12">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-red-600 rounded-full scale-x-150 -rotate-45" />
                <div className="absolute inset-0 border-2 border-red-600 rounded-full scale-x-150 rotate-45" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-700 rounded-full shadow-sm" />
                <div className="absolute top-full left-1/2 -translate-x-1 w-0.5 h-6 bg-red-600 origin-top rotate-12" />
                <div className="absolute top-full left-1/2 w-0.5 h-6 bg-red-600 origin-top -rotate-12" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 flex gap-4">
        {!isOpen ? (
          <button
            onClick={handleOpen}
            className="bg-rose-500 text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center gap-2 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            <Edit3 size={20} /> Open Envelope
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-500 italic text-xl font-bold"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Opening your message...
          </motion.div>
        )}
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
  const isEnvelope = visualTheme === 'rose-petals' || visualTheme === 'heart-float';

  // Background per theme — matches prototype exactly
  const gameBg = isCake
    ? 'linear-gradient(to bottom, #fff1f2, #fff7ed)'  // rose-50 → orange-50
    : isBalloon
    ? '#f0f9ff'                                        // sky-50
    : isEnvelope
    ? '#fafaf9'                                        // stone-50
    : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: gameComplete ? undefined : gameBg }}
    >
      <AnimatePresence mode="wait">
        {!gameComplete ? (
          <div key="game" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {isCake && <BlowCandlesExperience onComplete={() => setGameComplete(true)} />}
            {isBalloon && <PopBalloonsExperience onComplete={() => setGameComplete(true)} />}
            {isEnvelope && <EnvelopeRevealExperience onComplete={() => setGameComplete(true)} coverImageUrl={coverImageUrl} />}
            {!isCake && !isBalloon && !isEnvelope && (
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
