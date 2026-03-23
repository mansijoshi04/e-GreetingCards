'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardContent from '@/components/cards/CardContent';
import ConfettiLayer from '@/components/cards/ConfettiLayer';
import ShareButton from '@/components/ui/ShareButton';
import { shareCard, downloadCardAsPng } from '@/lib/utils/cardUtils';
import { Copy, MessageCircle, Mail, Download, Heart, PartyPopper, Cake, GraduationCap, Wind, Flower2, ArrowDown } from 'lucide-react';

interface ClickToRevealProps {
  content: Record<string, string>;
  design: any;
  styling?: Record<string, any>;
  cardId: string;
  category?: string;
  tier?: string;
  isPreview?: boolean;
}

export default function ClickToReveal({
  content,
  design,
  styling = {},
  cardId,
  category = 'birthday',
  tier = 'basic',
  isPreview = false,
}: ClickToRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const confettiConfig = design.animations?.confetti || {};
  const visualTheme: string = design?.layout?.visualTheme || '';

  const handleReveal = () => setIsRevealed(true);

  // Persistent background that matches the cover so nothing shows through after reveal
  const themeBackground: Record<string, string> = {
    'heart-float':      'linear-gradient(135deg, #2a0020 0%, #600030 100%)',
    'cake-celebration': 'linear-gradient(135deg, #0d0b1a 0%, #1e1540 100%)',
    'cap-toss':         'linear-gradient(135deg, #080820 0%, #121858 100%)',
    'rose-petals':      'linear-gradient(135deg, #2a000e 0%, #6b1030 100%)',
  };
  const revealedBg = themeBackground[visualTheme] || 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: revealedBg }}>
      {/* Cover — theme-aware pre-reveal screen */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className="absolute inset-0 z-50"
            exit={{ scale: 18, opacity: 0, transition: { duration: 0.75, ease: 'easeInOut' } }}
          >
            {visualTheme === 'heart-float'      && <HeartFloatCover    onReveal={handleReveal} />}
            {visualTheme === 'cake-celebration' && <CakeCelebrationCover onReveal={handleReveal} />}
            {visualTheme === 'cap-toss'         && <CapTossCover        onReveal={handleReveal} />}
            {visualTheme === 'rose-petals'      && <RosePetalsCover     onReveal={handleReveal} />}
            {!['heart-float','cake-celebration','cap-toss','rose-petals'].includes(visualTheme) && (
              <DefaultCover onReveal={handleReveal} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card content */}
      <motion.div
        className="max-w-sm w-full mx-auto px-4 z-40 relative click-to-reveal-card"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ delay: isRevealed ? 0.35 : 0, duration: 0.6 }}
      >
        <div className="rounded-2xl shadow-2xl overflow-hidden">
          <CardContent content={content} design={design} styling={styling} />
        </div>
      </motion.div>

      {/* Share buttons */}
      {!isPreview && (
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              className="absolute bottom-10 left-0 right-0 flex gap-4 justify-center z-40 flex-wrap px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
            >
              <ShareButton onClick={() => shareCard('copy')}      Icon={Copy}          label="Copy Link" />
              <ShareButton onClick={() => shareCard('whatsapp')}  Icon={MessageCircle} label="WhatsApp" />
              <ShareButton onClick={() => shareCard('email')}     Icon={Mail}          label="Email" />
              <ShareButton onClick={() => downloadCardAsPng('.click-to-reveal-card')} Icon={Download} label="Download" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Confetti */}
      {confettiConfig.enabled && isRevealed && (
        <ConfettiLayer
          trigger={isRevealed}
          config={confettiConfig}
          cardId={cardId}
          category={category}
          tier={tier}
          visualTheme={visualTheme}
        />
      )}
    </div>
  );
}

// ─── Default cover ─ pink/purple, party popper ───────────────────────────────
function DefaultCover({ onReveal }: { onReveal: () => void }) {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-purple-600 cursor-pointer flex items-center justify-center"
      onClick={onReveal}
    >
      <div className="text-center text-white px-6">
        <motion.div className="flex justify-center mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
          <PartyPopper size={56} strokeWidth={1.5} />
        </motion.div>
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-3" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          You've got a card!
        </motion.h2>
        <motion.p className="text-lg md:text-xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          Tap anywhere to open
        </motion.p>
        <motion.div className="mt-6 flex justify-center" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown size={28} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Heart Float cover ─ crimson, floating hearts ────────────────────────────
function HeartFloatCover({ onReveal }: { onReveal: () => void }) {
  const hearts = [
    { x: '10%',  size: 40, delay: 0,    duration: 4.0 },
    { x: '25%',  size: 28, delay: 0.8,  duration: 3.5 },
    { x: '42%',  size: 50, delay: 0.3,  duration: 4.5 },
    { x: '58%',  size: 32, delay: 1.2,  duration: 3.8 },
    { x: '72%',  size: 44, delay: 0.6,  duration: 4.2 },
    { x: '88%',  size: 26, delay: 1.5,  duration: 3.6 },
    { x: '18%',  size: 22, delay: 2.0,  duration: 4.1 },
    { x: '65%',  size: 36, delay: 1.8,  duration: 3.9 },
  ];

  return (
    <div
      className="absolute inset-0 cursor-pointer flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2a0020 0%, #600030 100%)' }}
      onClick={onReveal}
    >
      {/* Floating hearts */}
      {hearts.map((h, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 text-rose-400 select-none pointer-events-none"
          style={{ left: h.x }}
          initial={{ y: '100%', opacity: 0.7 }}
          animate={{ y: '-120vh', opacity: [0.7, 0.9, 0.7, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={h.size} fill="currentColor" strokeWidth={0} />
        </motion.div>
      ))}

      {/* Center content */}
      <div className="text-center text-white px-6 relative z-10">
        <motion.div className="flex justify-center mb-4" initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Heart size={52} fill="#f43f5e" color="#f43f5e" strokeWidth={0} />
        </motion.div>
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          You've got a love note!
        </motion.h2>
        <motion.p className="text-lg md:text-xl text-pink-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          Tap to reveal
        </motion.p>
      </div>
    </div>
  );
}

// ─── Cake Celebration cover ─ dark sky, blow the candles ─────────────────────
function CakeCelebrationCover({ onReveal }: { onReveal: () => void }) {
  const [blown, setBlown] = useState(false);
  const [blowingIndex, setBlowingIndex] = useState(-1);
  const candles = [0, 1, 2, 3];

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    // Stagger each candle going out
    candles.forEach((_, i) => {
      setTimeout(() => setBlowingIndex(i), i * 280);
    });
    setTimeout(onReveal, candles.length * 280 + 900);
  };

  return (
    <div
      className="absolute inset-0 cursor-pointer flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d0b1a 0%, #1e1540 100%)' }}
      onClick={handleBlow}
    >
      {/* Stars */}
      {[...Array(14)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: 2+i%3, height: 2+i%3, left: `${(i*137)%100}%`, top: `${(i*97)%60}%`, opacity: 0.3+i%3*0.15 }} />
      ))}

      <div className="text-center text-white px-6 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <Cake size={32} strokeWidth={1.5} /> Birthday Surprise!
        </motion.h2>
        <motion.p className="text-lg text-purple-200 mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          {blown ? 'Making your wish come true...' : 'Tap to blow out the candles!'}
        </motion.p>

        {/* Birthday cake SVG */}
        <motion.svg
          viewBox="0 0 200 160" className="w-48 md:w-56 mx-auto mb-6"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
        >
          {/* Bottom tier */}
          <rect x="20" y="100" width="160" height="55" rx="4" fill="#f472b6" />
          <rect x="20" y="100" width="160" height="14" rx="4" fill="#fb7ac2" />
          {[-60,-30,0,30,60].map((dx,i) => (
            <ellipse key={i} cx={100+dx} cy="100" rx="10" ry="7" fill="white" opacity="0.9" />
          ))}
          {/* Middle tier */}
          <rect x="40" y="68" width="120" height="34" rx="4" fill="#c084fc" />
          <rect x="40" y="68" width="120" height="10" rx="4" fill="#d8a4ff" />
          {[-36,-12,12,36].map((dx,i) => (
            <ellipse key={i} cx={100+dx} cy="68" rx="9" ry="6" fill="white" opacity="0.9" />
          ))}
          {/* Top tier */}
          <rect x="60" y="42" width="80" height="28" rx="4" fill="#fb923c" />
          <rect x="60" y="42" width="80" height="8" rx="4" fill="#fba560" />

          {/* Candles */}
          {candles.map((i) => {
            const cx = 76 + i * 18;
            const isOut = blowingIndex >= i;
            return (
              <g key={i}>
                <rect x={cx-4} y="18" width="8" height="26" rx="2"
                  fill={['#FFD700','#f472b6','#60a5fa','#34d399'][i]} />
                {/* Flame */}
                {!isOut && (
                  <motion.g animate={{ scaleY: [1, 1.2, 0.9, 1.1, 1], x: [0, 1, -1, 0.5, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity }}>
                    <ellipse cx={cx} cy="13" rx="5" ry="8" fill="#FF8C00" opacity="0.9" />
                    <ellipse cx={cx} cy="12" rx="2.5" ry="5" fill="#FFE040" />
                  </motion.g>
                )}
                {/* Blown-out smoke */}
                {isOut && (
                  <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0, y: -20 }} transition={{ duration: 1.2 }}>
                    <ellipse cx={cx} cy="10" rx="3" ry="5" fill="#888" opacity="0.5" />
                  </motion.g>
                )}
              </g>
            );
          })}
        </motion.svg>

        {!blown && (
          <motion.div
            className="inline-block px-6 py-3 bg-yellow-400 text-stone-900 font-bold rounded-full text-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Wind size={14} className="inline-block mr-1" /> Tap to Blow!
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Cap Toss cover ─ navy, graduation cap toss animation ────────────────────
function CapTossCover({ onReveal }: { onReveal: () => void }) {
  const [tossed, setTossed] = useState(false);

  const handleToss = () => {
    if (tossed) return;
    setTossed(true);
    setTimeout(onReveal, 950);
  };

  return (
    <div
      className="absolute inset-0 cursor-pointer flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080820 0%, #121858 100%)' }}
      onClick={handleToss}
    >
      {/* Star field */}
      {[...Array(16)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1+i%3, height: 1+i%3, left: `${(i*137)%100}%`, top: `${(i*97)%100}%`, opacity: 0.15+i%4*0.1 }} />
      ))}

      <div className="text-center text-white px-6 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <GraduationCap size={32} strokeWidth={1.5} /> Congratulations!
        </motion.h2>
        <motion.p className="text-lg text-blue-200 mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          {tossed ? 'Cap in the air!' : 'Tap to toss your cap!'}
        </motion.p>

        {/* Graduation cap */}
        <motion.svg
          viewBox="-80 -80 160 160" className="w-36 md:w-44 mx-auto mb-6"
          animate={tossed ? { y: -500, rotate: 360 } : { y: [0, -12, 0], rotate: [0, -5, 5, 0] }}
          transition={tossed
            ? { duration: 0.9, ease: 'easeIn' }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Board */}
          <polygon points="0,-38 60,0 0,38 -60,0" fill="#FFD700" />
          <polygon points="0,-38 60,0 0,38 -60,0" fill="none" stroke="#DAA520" strokeWidth="2" />
          <polygon points="0,-38 30,-19 0,0 -30,-19" fill="#FFE860" opacity="0.4" />
          {/* Crown */}
          <rect x="-16" y="-36" width="32" height="30" rx="4" fill="#c49010" />
          <rect x="-16" y="-36" width="32" height="10" rx="4" fill="#DAA520" />
          {/* Tassel */}
          <line x1="36" y1="-12" x2="58" y2="28" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
          <circle cx="59" cy="32" r="10" fill="#FFD700" />
          <circle cx="59" cy="32" r="6" fill="#DAA520" />
          {[-6,-2,2,6,10].map((dx,i) => (
            <line key={i} x1={56+dx} y1="40" x2={55+dx} y2="60" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          ))}
        </motion.svg>

        {!tossed && (
          <motion.div
            className="inline-block px-6 py-3 bg-yellow-400 text-stone-900 font-bold rounded-full text-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <GraduationCap size={14} className="inline-block mr-1" /> Toss it!
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Rose Petals cover ─ deep wine, falling petals ───────────────────────────
function RosePetalsCover({ onReveal }: { onReveal: () => void }) {
  const petals = [
    { x: '8%',  size: 24, delay: 0,    duration: 4.5, rot: 30  },
    { x: '22%', size: 18, delay: 1.0,  duration: 3.8, rot: -20 },
    { x: '38%', size: 28, delay: 0.4,  duration: 4.2, rot: 45  },
    { x: '55%', size: 20, delay: 1.6,  duration: 3.5, rot: -35 },
    { x: '70%', size: 26, delay: 0.8,  duration: 4.8, rot: 25  },
    { x: '85%', size: 22, delay: 2.0,  duration: 4.0, rot: -50 },
    { x: '15%', size: 16, delay: 2.5,  duration: 3.9, rot: 15  },
    { x: '60%', size: 30, delay: 1.3,  duration: 4.4, rot: -40 },
  ];

  return (
    <div
      className="absolute inset-0 cursor-pointer flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2a000e 0%, #6b1030 100%)' }}
      onClick={onReveal}
    >
      {/* Falling petals */}
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-0 text-rose-300 select-none pointer-events-none"
          style={{ left: p.x, rotate: p.rot }}
          initial={{ y: '-10%', opacity: 0.8, x: 0 }}
          animate={{ y: '110vh', opacity: [0.8, 0.9, 0.6, 0], x: [0, 20, -15, 10, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          <Flower2 size={p.size} fill="currentColor" strokeWidth={0.5} />
        </motion.div>
      ))}

      <div className="text-center text-white px-6 relative z-10">
        <motion.div className="flex justify-center mb-4" initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Flower2 size={52} color="#f43f5e" strokeWidth={1.5} />
        </motion.div>
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          A special card for you
        </motion.h2>
        <motion.p className="text-lg md:text-xl text-pink-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          Tap to reveal
        </motion.p>
      </div>
    </div>
  );
}
