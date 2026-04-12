'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Edit3,
  ChevronRight,
} from 'lucide-react';

// Exact components from newdesign/src/App.tsx
// Changes from original:
//   1. `from 'motion/react'` → `from 'framer-motion'`
//   2. Added `export` to each component
//   3. Added `signature?` prop to FoldedCard (replaces hardcoded "With love, Heartfelt")

export const FoldedCard = ({
  message,
  recipient,
  signature,
  fontSize,
  color,
  frontImage,
  isBirthday = false,
  isLove = false,
  isBalloons = false,
}: {
  message: string;
  recipient: string;
  signature?: string;
  fontSize: number;
  color: string;
  frontImage: string;
  isBirthday?: boolean;
  isLove?: boolean;
  isBalloons?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Confetti with a slight delay to match the opening animation
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa'],
        });
      }, 600);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-[300px] aspect-[3/4] perspective-2000 cursor-pointer group"
        onClick={handleOpen}
      >
        {/* Back Side (Inside Left) */}
        <div className="absolute inset-0 bg-stone-50 rounded-xl shadow-inner border border-stone-200" />

        {/* Inside Content (Right Page) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-rose-50 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm overflow-hidden">
          {/* Birthday Candles at the bottom */}
          {isBirthday && isOpen && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-6 z-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                      y: [0, -2, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + Math.random() * 0.4,
                      ease: 'easeInOut',
                    }}
                    className="w-2.5 h-4 bg-orange-400 rounded-full blur-[1px] shadow-[0_0_8px_rgba(251,146,60,0.8)]"
                  />
                  <div className={`w-1.5 h-8 ${i % 2 === 0 ? 'bg-rose-200' : 'bg-blue-200'} rounded-full`} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Heart Bouquet for Love Cards */}
          {isLove && isOpen && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-end px-6 z-0 h-32">
              {[...Array(7)].map((_, i) => {
                const rotation = (i - 3) * 15; // Fan out from -45 to 45 degrees
                const height = 60 + Math.random() * 40;
                const heartSize = 16 + Math.random() * 12;
                const colors = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#be123c'];
                const heartColor = colors[i % colors.length];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.1, type: 'spring' }}
                    className="absolute origin-bottom"
                    style={{
                      rotate: `${rotation}deg`,
                      bottom: '0px',
                    }}
                  >
                    <div
                      className="w-0.5 bg-stone-300 rounded-full"
                      style={{ height: `${height}px` }}
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2 + Math.random(),
                        ease: 'easeInOut',
                      }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <Heart
                        size={heartSize}
                        fill={heartColor}
                        className="text-transparent"
                        style={{ color: heartColor }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Watercolor Balloons for Balloon Cards */}
          {isBalloons && isOpen && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end px-4 z-0 h-40 overflow-hidden pointer-events-none">
              {[...Array(4)].map((_, i) => {
                const colors = ['#f472b6', '#c084fc', '#fb923c', '#facc15'];
                const xOffset = (i - 1.5) * 55;
                const delay = 1.4 + i * 0.15;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 150 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, type: 'spring', damping: 15 }}
                    className="absolute bottom-0"
                    style={{ x: xOffset } as any}
                  >
                    {/* Wavy String */}
                    <svg width="40" height="100" className="overflow-visible">
                      <motion.path
                        d="M 20 100 Q 10 75 20 50 Q 30 25 20 0"
                        fill="none"
                        stroke="#a8a29e"
                        strokeWidth="1"
                        animate={{
                          d: [
                            'M 20 100 Q 10 75 20 50 Q 30 25 20 0',
                            'M 20 100 Q 30 75 20 50 Q 10 25 20 0',
                            'M 20 100 Q 10 75 20 50 Q 30 25 20 0',
                          ],
                        }}
                        transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut' }}
                      />
                      {/* Bow */}
                      <g transform="translate(20, 0)">
                        <circle cx="-3" cy="0" r="3" fill="none" stroke="#a8a29e" strokeWidth="1" />
                        <circle cx="3" cy="0" r="3" fill="none" stroke="#a8a29e" strokeWidth="1" />
                      </g>
                    </svg>

                    {/* Balloon Body */}
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 3, -3, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4 + i,
                        ease: 'easeInOut',
                      }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 w-14 h-18 rounded-full shadow-sm"
                      style={{
                        backgroundColor: colors[i],
                        opacity: 0.7,
                        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                      }}
                    >
                      {/* Highlight */}
                      <div className="absolute top-3 left-3 w-3 h-5 bg-white/40 rounded-full blur-[1px] rotate-12" />

                      {/* Patterns */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        {i === 1 && <div className="w-full h-full border border-white/30 grid grid-cols-4 grid-rows-4" />}
                        {i === 3 && <div className="w-full h-full border-t-2 border-white/20 mt-2" />}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              delay: 1.2,
              duration: 1,
              type: 'spring',
              stiffness: 100,
            }}
            className="relative z-10 -mt-12"
          >
            {recipient && (
              <h4 className="playful text-lg mb-4 text-stone-400 font-medium italic">
                Dear {recipient},
              </h4>
            )}
            <p
              className="playful leading-relaxed font-bold"
              style={{ fontSize: `${fontSize * 0.7}px`, color }}
            >
              {message}
            </p>
            <div className="mt-6 pt-6 border-t border-stone-100 w-full">
              <span className="playful text-sm font-medium italic text-stone-400">
                {signature || 'With love'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Front Cover (Folding Page) */}
        <motion.div
          animate={{ rotateY: isOpen ? -160 : 0 }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            delay: 0.2,
          }}
          className="absolute inset-0 z-20 origin-left preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl z-30">
            <img
              src={frontImage}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              alt="Card Cover"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            {!isOpen && (
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg animate-pulse">
                <ChevronRight size={20} className="text-stone-900" />
              </div>
            )}
          </div>

          {/* Back of Front Face (Inside Left) */}
          <div
            className="absolute inset-0 bg-stone-100 rounded-xl border-r border-stone-200 z-20"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full flex items-center justify-center p-8 opacity-20 grayscale">
              <Heart size={48} className="text-stone-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {!isOpen && (
        <div className="absolute bottom-4 text-stone-400 text-xs font-medium tracking-widest uppercase">
          Tap to open your card
        </div>
      )}
    </div>
  );
};

export const BirthdayCakeCard = ({
  message, recipient, signature, fontSize, color, image,
  isBirthday = false, isLove = false, isBalloons = false,
}: {
  message: string; recipient: string; signature?: string; fontSize: number; color: string;
  image: string; isBirthday?: boolean; isLove?: boolean; isBalloons?: boolean;
}) => {
  const [isBlowing, setIsBlowing] = useState(false);
  const [blownOut, setBlownOut] = useState(false);

  const handleBlow = () => {
    setIsBlowing(true);
    // Wait for flames to disappear and smoke to show before transitioning
    setTimeout(() => {
      setBlownOut(true);
    }, 2500);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-orange-50 overflow-hidden rounded-[2.5rem]">
      <AnimatePresence mode="wait">
        {blownOut ? (
          <motion.div
            key="folded"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full h-full"
          >
            <FoldedCard
              message={message}
              recipient={recipient}
              signature={signature}
              fontSize={fontSize}
              color={color}
              frontImage={image}
              isBirthday={isBirthday}
              isLove={isLove}
              isBalloons={isBalloons}
            />
          </motion.div>
        ) : (
          <motion.div
            key="animation"
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={isBlowing ? { x: [0, -2, 2, -2, 2, 0] } : {}}
              transition={{ duration: 0.5, repeat: isBlowing ? Infinity : 0 }}
              className="relative z-10 mt-12 scale-75 md:scale-100"
            >
              {/* Cake Layers */}
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
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          transform: `rotate(${Math.random() * 360}deg)`,
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
                              transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                              className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-500 rounded-full blur-[2px] shadow-[0_0_10px_#f97316]"
                            />
                          )}
                          {isBlowing && !blownOut && (
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
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          transform: `rotate(${Math.random() * 360}deg)`,
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

            {!isBlowing && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleBlow}
                className="mt-12 bg-white/80 backdrop-blur px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-white transition-all flex items-center gap-2 playful text-rose-500 border-2 border-rose-100"
              >
                <Sparkles size={20} className="text-rose-500" /> Make a Wish &amp; Blow!
              </motion.button>
            )}

            {isBlowing && !blownOut && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-stone-500 italic text-lg font-medium serif"
              >
                Puff... your wish is coming true!
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const BalloonCard = ({
  message, recipient, signature, fontSize, color, image,
  isBirthday = false, isLove = false, isBalloons = false,
}: {
  message: string; recipient: string; signature?: string; fontSize: number; color: string;
  image: string; isBirthday?: boolean; isLove?: boolean; isBalloons?: boolean;
}) => {
  const [popped, setPopped] = useState<number[]>([]);
  const [showFolded, setShowFolded] = useState(false);
  const balloons = ['🎈', '🎊', '🎁', '✨', '💖', '⭐', '🌈'];

  useEffect(() => {
    if (popped.length >= 4) {
      const timer = setTimeout(() => setShowFolded(true), 800);
      return () => clearTimeout(timer);
    }
  }, [popped]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-sky-50 overflow-hidden rounded-[2.5rem] p-10">
      <AnimatePresence mode="wait">
        {showFolded ? (
          <motion.div
            key="folded"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full"
          >
            <FoldedCard
              message={message}
              recipient={recipient}
              signature={signature}
              fontSize={fontSize}
              color={color}
              frontImage={image}
              isBirthday={isBirthday}
              isLove={isLove}
              isBalloons={isBalloons}
            />
          </motion.div>
        ) : (
          <motion.div
            key="animation"
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full relative"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              {balloons.map((b, i) => {
                const leftPos = 15 + i * 12; // Spread balloons from 15% to 87%
                return (
                  <motion.div
                    key={i}
                    initial={{ y: 600, left: `${leftPos}%` }}
                    animate={
                      !popped.includes(i)
                        ? { y: [-20, 20, -20], x: [-10, 10, -10], top: `${20 + (i % 3) * 15}%` }
                        : { scale: [1, 1.5, 0], opacity: [1, 1, 0], rotate: [0, 20, -20] }
                    }
                    transition={{
                      y: { repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' },
                      x: { repeat: Infinity, duration: 4 + i * 0.5, ease: 'easeInOut' },
                      scale: { duration: 0.3 },
                      opacity: { duration: 0.3 },
                    }}
                    onClick={() => !popped.includes(i) && setPopped([...popped, i])}
                    className="absolute text-5xl md:text-6xl cursor-pointer hover:scale-110 transition-transform select-none -translate-x-1/2"
                  >
                    {b}
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute bottom-10 left-0 right-0 text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-stone-400 text-sm font-bold playful italic"
              >
                {popped.length < 4 ? `Pop ${4 - popped.length} more to reveal...` : 'Yay! Here it comes...'}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const EnvelopeCard = ({
  message, recipient, signature, fontSize, color, image,
  isBirthday = false, isLove = false, isBalloons = false,
}: {
  message: string; recipient: string; signature?: string; fontSize: number; color: string;
  image: string; isBirthday?: boolean; isLove?: boolean; isBalloons?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFolded, setShowFolded] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    // Automatically transition to the card after 2 seconds
    setTimeout(() => {
      setShowFolded(true);
    }, 2000);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-stone-50 rounded-[2.5rem] overflow-hidden">
      <AnimatePresence mode="wait">
        {showFolded ? (
          <motion.div
            key="folded"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full h-full"
          >
            <FoldedCard
              message={message}
              recipient={recipient}
              signature={signature}
              fontSize={fontSize}
              color={color}
              frontImage={image}
              isBirthday={isBirthday}
              isLove={isLove}
              isBalloons={isBalloons}
            />
          </motion.div>
        ) : (
          <motion.div
            key="animation"
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: 'anticipate' }}
            className="flex flex-col items-center"
          >
            {isLove && isOpen && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.2, 0.8],
                      x: (i - 5.5) * 25 + (Math.random() - 0.5) * 30,
                      y: -140 - Math.random() * 100,
                      rotate: (Math.random() - 0.5) * 120,
                    }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 2.2, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2"
                  >
                    <Heart
                      size={14 + Math.random() * 18}
                      className={i % 3 === 0 ? 'text-red-600' : i % 3 === 1 ? 'text-rose-400' : 'text-white'}
                      fill="currentColor"
                    />
                  </motion.div>
                ))}
              </div>
            )}
            <div className="relative w-80 h-56 perspective-2000">
              {/* The Card inside */}
              <motion.div
                animate={isOpen ? { y: -140, z: 50, rotateX: 0, scale: 1.1 } : { y: 0, z: -10, scale: 0.9 }}
                transition={{ duration: 1, ease: 'backOut' }}
                className={`absolute inset-x-6 top-6 bottom-6 bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col items-center justify-center text-center border border-stone-100 transition-all duration-300 ${isOpen ? 'z-40' : 'z-10'}`}
              >
                {isLove ? (
                  <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Card Preview" />
                ) : (
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                      <Heart size={32} className="text-rose-500" fill="currentColor" />
                    </div>
                    <p className="serif text-sm text-stone-500 italic">You&apos;ve received a heartfelt greeting</p>
                  </div>
                )}
              </motion.div>

              {/* The Envelope */}
              <div className={`absolute inset-0 ${isLove ? 'bg-[#d2b48c]' : 'bg-rose-100'} rounded-lg shadow-xl z-20 border ${isLove ? 'border-[#bc9d76]' : 'border-rose-200/50'}`}>
                {/* Flap */}
                <motion.div
                  animate={isOpen ? { rotateX: -160 } : { rotateX: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className={`absolute inset-x-0 top-0 h-1/2 ${isLove ? 'bg-[#c19a6b]' : 'bg-rose-200'} origin-top shadow-md flex items-end justify-center pb-4 transition-all duration-300 ${isOpen ? 'z-10' : 'z-30'}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                >
                  {!isOpen && (
                    <div className={`w-8 h-8 ${isLove ? 'bg-red-600' : 'bg-rose-400'} rounded-full border-2 ${isLove ? 'border-red-500' : 'border-rose-300'} shadow-inner flex items-center justify-center mb-2`}>
                      <Heart size={14} className="text-white" fill="currentColor" />
                    </div>
                  )}
                </motion.div>

                {/* Envelope Body (Triangular Flaps) */}
                <div className="absolute inset-0 z-20 overflow-hidden rounded-lg">
                  {/* Bottom Flap */}
                  <div
                    className={`absolute inset-x-0 bottom-0 h-2/3 ${isLove ? 'bg-[#d2b48c]' : 'bg-rose-100'} border-t ${isLove ? 'border-[#bc9d76]/30' : 'border-rose-200/30'}`}
                    style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}
                  />
                  {/* Left Flap */}
                  <div
                    className={`absolute inset-y-0 left-0 w-2/3 ${isLove ? 'bg-[#e6ccac]/40' : 'bg-rose-50/60'} border-r ${isLove ? 'border-[#bc9d76]/20' : 'border-rose-200/20'}`}
                    style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                  />
                  {/* Right Flap */}
                  <div
                    className={`absolute inset-y-0 right-0 w-2/3 ${isLove ? 'bg-[#e6ccac]/40' : 'bg-rose-50/60'} border-l ${isLove ? 'border-[#bc9d76]/20' : 'border-rose-200/20'}`}
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
                  />
                </div>

                {/* Red Bow for Love Cards */}
                {isLove && !isOpen && (
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

            <div className="mt-16 flex gap-4">
              {!isOpen ? (
                <button
                  onClick={handleOpen}
                  className="bg-rose-500 text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center gap-2 playful border-b-4 border-rose-700 active:border-b-0 active:translate-y-1"
                >
                  <Edit3 size={20} /> Open Envelope
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-500 italic text-xl font-bold playful"
                >
                  Opening your message...
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
