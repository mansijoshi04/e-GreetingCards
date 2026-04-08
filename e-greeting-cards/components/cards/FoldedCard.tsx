'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ConfettiLayer from '@/components/cards/ConfettiLayer';

interface FoldedCardProps {
  content: Record<string, string>;
  design: any;
  styling?: Record<string, any>;
  cardId: string;
  category?: string;
  tier?: string;
  coverImageUrl: string;
  typewriter?: boolean;
}

// --- Inside Decorations ---

function BirthdayCandles({ show }: { show: boolean }) {
  return (
    <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 px-6 z-0 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 + i * 0.1, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={show ? {
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
              y: [0, -2, 0],
            } : {}}
            transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: 'easeInOut' }}
            className="w-2.5 h-4 bg-orange-400 rounded-full blur-[1px]"
            style={{ boxShadow: '0 0 8px rgba(251,146,60,0.8)' }}
          />
          <div className={`w-1.5 h-8 rounded-full ${i % 2 === 0 ? 'bg-rose-200' : 'bg-blue-200'}`} />
        </motion.div>
      ))}
    </div>
  );
}

function HeartBouquet({ show }: { show: boolean }) {
  const colors = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#be123c', '#f43f5e', '#fb7185'];
  return (
    <div className="absolute bottom-3 left-0 right-0 flex justify-center items-end z-0 h-28 pointer-events-none">
      {[...Array(7)].map((_, i) => {
        const rotation = (i - 3) * 14;
        const height = 52 + i * 4;
        const heartSize = 14 + (i % 3) * 4;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={show ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 1.3 + i * 0.08, type: 'spring' }}
            className="absolute origin-bottom"
            style={{ rotate: `${rotation}deg`, bottom: 0 }}
          >
            <div className="w-0.5 bg-stone-300 rounded-full" style={{ height: `${height}px` }} />
            <motion.div
              animate={show ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: 'easeInOut' }}
              className="absolute -top-4 left-1/2 -translate-x-1/2"
            >
              <svg width={heartSize} height={heartSize} viewBox="0 0 24 24" fill={colors[i]}>
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function FloatingBalloons({ show }: { show: boolean }) {
  const colors = ['#f472b6', '#c084fc', '#fb923c', '#facc15'];
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end z-0 h-36 overflow-hidden pointer-events-none">
      {[...Array(4)].map((_, i) => {
        const xOffset = (i - 1.5) * 52;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 120 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.3 + i * 0.15, type: 'spring', damping: 14 }}
            className="absolute bottom-0"
            style={{ x: xOffset }}
          >
            {/* Wavy string */}
            <svg width="36" height="90" className="overflow-visible">
              <motion.path
                d="M 18 90 Q 8 68 18 45 Q 28 22 18 0"
                fill="none"
                stroke="#a8a29e"
                strokeWidth="1"
                animate={show ? {
                  d: [
                    'M 18 90 Q 8 68 18 45 Q 28 22 18 0',
                    'M 18 90 Q 28 68 18 45 Q 8 22 18 0',
                    'M 18 90 Q 8 68 18 45 Q 28 22 18 0',
                  ]
                } : {}}
                transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut' }}
              />
              {/* Bow */}
              <g transform="translate(18, 0)">
                <circle cx="-3" cy="0" r="2.5" fill="none" stroke="#a8a29e" strokeWidth="1" />
                <circle cx="3" cy="0" r="2.5" fill="none" stroke="#a8a29e" strokeWidth="1" />
              </g>
            </svg>
            {/* Balloon */}
            <motion.div
              animate={show ? { y: [0, -8, 0], rotate: [0, 3, -3, 0] } : {}}
              transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut' }}
              className="absolute -top-11 left-1/2 -translate-x-1/2 w-12 h-14 shadow-sm"
              style={{
                backgroundColor: colors[i],
                opacity: 0.75,
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              }}
            >
              <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/40 rounded-full blur-[1px] rotate-12" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function GoldSparkles({ show }: { show: boolean }) {
  const positions = [
    { top: '12%', left: '10%' }, { top: '20%', right: '12%' },
    { top: '55%', left: '8%' }, { top: '50%', right: '10%' },
    { top: '75%', left: '20%' }, { top: '78%', right: '18%' },
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={show ? { opacity: [0, 1, 0.6], scale: [0, 1.2, 1] } : {}}
          transition={{ delay: 1.2 + i * 0.15, duration: 0.6 }}
          className="absolute pointer-events-none z-0"
          style={pos}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#DAA520">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
        </motion.div>
      ))}
    </>
  );
}

function LeafAccent({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 0.4 } : {}}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-0"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
        <path d="M10 35 Q 30 5 60 20 Q 90 5 110 35" stroke="#6B8E23" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <ellipse cx="30" cy="18" rx="12" ry="7" fill="#6B8E23" opacity="0.3" transform="rotate(-20 30 18)"/>
        <ellipse cx="60" cy="12" rx="14" ry="8" fill="#6B8E23" opacity="0.3"/>
        <ellipse cx="90" cy="18" rx="12" ry="7" fill="#6B8E23" opacity="0.3" transform="rotate(20 90 18)"/>
      </svg>
    </motion.div>
  );
}

function InsideDecoration({ category, theme, show }: { category?: string; theme?: string; show: boolean }) {
  if (theme === 'balloon-party' || theme === 'confetti-burst') return <FloatingBalloons show={show} />;
  if (theme === 'cake-celebration') return <BirthdayCandles show={show} />;
  if (category === 'birthday') return <BirthdayCandles show={show} />;
  if (category === 'anniversary') return <HeartBouquet show={show} />;
  if (category === 'graduation') return <GoldSparkles show={show} />;
  if (category === 'thankYou') return <LeafAccent show={show} />;
  return null;
}

// --- Typewriter hook ---
function useTypewriter(text: string, started: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, started, speed]);

  return { displayed, done };
}

// --- Main FoldedCard ---

export default function FoldedCard({
  content,
  design,
  styling = {},
  cardId,
  category,
  tier,
  coverImageUrl,
  typewriter = false,
}: FoldedCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [typewriterStarted, setTypewriterStarted] = useState(false);

  const visualTheme = design?.layout?.visualTheme;
  const confettiConfig = design?.animations?.confetti || { enabled: true };

  const bodyText = content['body'] || '';
  const { displayed: typewriterText, done: typewriterDone } = useTypewriter(
    bodyText,
    typewriter && typewriterStarted,
    30
  );

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => setShowConfetti(true), 600);
    if (typewriter) setTimeout(() => setTypewriterStarted(true), 1200);
  };

  // Inside background
  const insideBg = category === 'anniversary'
    ? 'linear-gradient(135deg, #fff0f5, #ffd6e7)'
    : category === 'graduation'
    ? 'linear-gradient(135deg, #f0f4f8, #e8f0f8)'
    : category === 'thankYou'
    ? 'linear-gradient(135deg, #f5f8f0, #edf5e8)'
    : 'linear-gradient(135deg, #ffffff, #fff5f7)';

  // Signature font
  const sigFont = styling?.signatureFont || 'Dancing Script, Georgia, serif';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Confetti */}
      <ConfettiLayer
        trigger={showConfetti}
        config={confettiConfig}
        cardId={cardId}
        category={category}
        tier={tier}
        visualTheme={visualTheme}
      />

      <div
        className="relative w-full max-w-[300px] cursor-pointer group"
        style={{ aspectRatio: '3/4', perspective: '2000px' }}
        onClick={handleOpen}
      >
        {/* Back side visible behind front */}
        <div className="absolute inset-0 bg-stone-50 rounded-2xl shadow-inner border border-stone-200" />

        {/* Inside right page (always rendered, visible when cover flips away) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-6"
          style={{ background: insideBg }}
        >
          {/* Inside decorations */}
          <InsideDecoration category={category} theme={visualTheme} show={isOpen} />

          {/* Inside text content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-3 -mt-8">
            {/* Recipient greeting */}
            <AnimatePresence>
              {isOpen && content['recipientName'] && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-stone-400 italic text-sm font-medium w-full text-left"
                  style={{ fontFamily: 'Quicksand, Inter, sans-serif' }}
                >
                  Dear {content['recipientName']},
                </motion.p>
              )}
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence>
              {isOpen && content['headline'] && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7, type: 'spring' }}
                  className="font-bold leading-tight text-center"
                  style={{
                    fontSize: 'clamp(20px, 6vw, 26px)',
                    fontFamily: 'Dancing Script, Georgia, serif',
                    color: styling?.headlineColor || '#d4426a',
                  }}
                >
                  {content['headline']}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Body — typewriter or fade */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: typewriter ? 1.1 : 0.8, duration: 0.5 }}
                  className="w-full px-2"
                >
                  <p
                    className="text-center leading-relaxed"
                    style={{
                      fontSize: 'clamp(12px, 3.5vw, 15px)',
                      fontFamily: 'Quicksand, Inter, sans-serif',
                      fontWeight: 600,
                      color: styling?.textColor || '#4a4a4a',
                    }}
                  >
                    {typewriter ? typewriterText : bodyText}
                    {typewriter && !typewriterDone && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle"
                      />
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Signature */}
            <AnimatePresence>
              {isOpen && content['signature'] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: typewriter
                      ? 1.2 + bodyText.length * 0.03
                      : 1.1,
                    duration: 0.6,
                  }}
                  className="w-full border-t border-stone-100 pt-3 mt-1"
                >
                  <p
                    className="text-right italic text-stone-400"
                    style={{
                      fontSize: 'clamp(11px, 3vw, 14px)',
                      fontFamily: sigFont,
                    }}
                  >
                    {content['signature']}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Front cover — flips open */}
        <motion.div
          animate={{ rotateY: isOpen ? -160 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.1 }}
          className="absolute inset-0 z-20 origin-left"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front face */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl backface-hidden z-30">
            <img
              src={coverImageUrl}
              className="w-full h-full object-cover"
              alt="Card Cover"
              referrerPolicy="no-referrer"
            />
            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Open hint */}
            {!isOpen && (
              <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                >
                  <ChevronRight size={18} className="text-stone-700" />
                </motion.div>
              </div>
            )}
          </div>

          {/* Back of front cover (inside left page) */}
          <div
            className="absolute inset-0 bg-stone-100 rounded-2xl border-r border-stone-200 z-20 flex items-center justify-center"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          >
            <div className="opacity-10">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#888">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tap hint below card */}
      <AnimatePresence>
        {!isOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-stone-400 text-xs font-medium tracking-widest uppercase"
          >
            Tap to open your card
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
