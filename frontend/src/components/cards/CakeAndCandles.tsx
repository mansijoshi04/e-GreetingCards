import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cake, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

const CakeAndCandles: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const [isBlowing, setIsBlowing] = useState(false);
  const [blownOut, setBlownOut] = useState(false);
  const accent = customStyling?.primaryColor ?? '#f43f5e';

  const handleBlow = () => {
    if (isPreview || isBlowing) return;
    setIsBlowing(true);
    setTimeout(() => {
      setBlownOut(true);
      confetti({ particleCount: 180, spread: 80, origin: { y: 0.5 } });
    }, 2400);
  };

  // Preview loop: cycle candles blowing
  useEffect(() => {
    if (!isPreview) return;
    const t = setInterval(() => {
      setIsBlowing(true);
      setTimeout(() => setIsBlowing(false), 2800);
    }, 4000);
    return () => clearInterval(t);
  }, [isPreview]);

  return (
    <CardShell
      coverFrom="#ffe4e6"
      coverTo={accent}
      coverIcon={<Cake size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
      confettiOnOpen={false}
    >
      <div
        className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff1f2 0%, #fef3c7 100%)' }}
      >
        <AnimatePresence mode="wait">
          {blownOut && !isPreview ? (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="flex flex-col items-center text-center gap-4 p-8"
            >
              <Cake size={40} style={{ color: accent }} />
              {customText.to && (
                <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
                  Dear {customText.to},
                </p>
              )}
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Quicksand, sans-serif', color: accent }}>
                {customText.headline}
              </h2>
              <p className="text-sm leading-relaxed max-w-[200px] text-stone-600">{customText.body}</p>
              <p className="text-xs italic text-stone-400">
                {customText.signature}{senderName ? `, ${senderName}` : ''}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="cake"
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Cake illustration */}
              <motion.div
                animate={isBlowing ? { x: [0, -2, 2, -2, 2, 0] } : {}}
                transition={{ duration: 0.35, repeat: isBlowing ? 10 : 0 }}
              >
                {/* Candles row */}
                <div className="flex justify-around px-6 mb-1">
                  {[0, 1, 2].map(ci => (
                    <div key={ci} className="relative flex flex-col items-center">
                      {/* Flame */}
                      <AnimatePresence>
                        {!isBlowing && (
                          <motion.div
                            key={`flame-${ci}`}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: [1, 1.3, 1], x: [0, 1, -1, 0] }}
                            exit={{ scaleY: 0, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 0.6 + ci * 0.08 }}
                            className="w-3 h-5 rounded-full mb-0.5"
                            style={{
                              background: 'radial-gradient(ellipse at 50% 60%, #fde68a, #f97316)',
                              boxShadow: '0 0 8px 2px rgba(249,115,22,0.5)',
                              transformOrigin: 'bottom center',
                            }}
                          />
                        )}
                        {isBlowing && (
                          <motion.div
                            key={`smoke-${ci}`}
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.5, 0], y: -40, scale: [0.5, 2.5, 3.5] }}
                            transition={{ duration: 1.8 }}
                            className="w-3 h-3 rounded-full blur-md mb-1"
                            style={{ background: 'rgba(120,113,108,0.5)' }}
                          />
                        )}
                      </AnimatePresence>
                      {/* Candle stick */}
                      <div
                        className="w-2.5 h-10 rounded-sm"
                        style={{ background: ci % 2 === 0 ? '#fda4af' : '#bfdbfe' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Top cake tier */}
                <div
                  className="w-28 h-12 rounded-t-lg relative overflow-hidden shadow-inner"
                  style={{ background: 'linear-gradient(180deg, #fecdd3 0%, #fda4af 100%)', border: '1px solid #fda4af' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 rounded-t-lg" />
                </div>

                {/* Bottom cake tier */}
                <div
                  className="w-44 h-16 rounded-t-lg relative overflow-hidden shadow-inner -mt-px"
                  style={{ background: 'linear-gradient(180deg, #fda4af 0%, #fb7185 100%)', border: '1px solid #fb7185', borderTop: 'none' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-4 bg-white/25" />
                </div>

                {/* Plate */}
                <div className="w-48 h-5 rounded-full -mt-px mx-auto shadow"
                     style={{ background: 'linear-gradient(180deg, #e7e5e4 0%, #d6d3d1 100%)' }} />
              </motion.div>

              {!isBlowing && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleBlow}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold shadow-md transition-all active:scale-95"
                  style={{ background: accent, fontFamily: 'Quicksand, sans-serif' }}
                >
                  <Sparkles size={16} /> Make a Wish!
                </motion.button>
              )}

              {isBlowing && !blownOut && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-stone-500 italic text-sm"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Your wish is coming true...
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardShell>
  );
};

export default CakeAndCandles;
