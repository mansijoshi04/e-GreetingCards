import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  Gift, 
  HelpCircle, 
  Edit3, 
  Send, 
  Check,
  X,
  Type,
  ChevronRight
} from 'lucide-react';

// --- Types ---
type Page = 'home' | 'cards' | 'editor' | 'about' | 'faq';
type Tier = 'basic' | 'premium';

type CardType = 'static' | 'birthday-cake' | 'balloons' | 'envelope';

interface CardTemplate {
  id: string;
  title: string;
  tier: Tier;
  image: string;
  category: string;
  type: CardType;
}

// --- Mock Data ---
const TEMPLATES: CardTemplate[] = [
  { id: '1', title: 'Love Scroll', tier: 'premium', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&h=800&auto=format&fit=crop', category: 'Love', type: 'envelope' },
  { id: '2', title: 'A Little Birthday Toast', tier: 'premium', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=600&h=800&auto=format&fit=crop', category: 'Birthday', type: 'birthday-cake' },
  { id: '3', title: 'Floating Balloons', tier: 'premium', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&h=800&auto=format&fit=crop', category: 'Birthday', type: 'balloons' },
  { id: '4', title: 'A Little Birthday Toast', tier: 'basic', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&h=800&auto=format&fit=crop', category: 'Birthday', type: 'static' },
  { id: '5', title: 'Sparkly Birthday Wishes', tier: 'basic', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&h=800&auto=format&fit=crop', category: 'Birthday', type: 'static' },
];

// --- Components ---

// --- Components ---

const FoldedCard = ({ 
  message, 
  recipient, 
  fontSize, 
  color, 
  frontImage,
  isBirthday = false,
  isLove = false,
  isBalloons = false
}: { 
  message: string, 
  recipient: string, 
  fontSize: number, 
  color: string,
  frontImage: string,
  isBirthday?: boolean,
  isLove?: boolean,
  isBalloons?: boolean
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
          colors: ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa']
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
                      y: [0, -2, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.6 + Math.random() * 0.4,
                      ease: "easeInOut"
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
                const color = colors[i % colors.length];
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.1, type: "spring" }}
                    className="absolute origin-bottom"
                    style={{ 
                      rotate: `${rotation}deg`,
                      bottom: '0px'
                    }}
                  >
                    <div 
                      className="w-0.5 bg-stone-300 rounded-full" 
                      style={{ height: `${height}px` }} 
                    />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2 + Math.random(),
                        ease: "easeInOut"
                      }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <Heart 
                        size={heartSize} 
                        fill={color} 
                        className="text-transparent"
                        style={{ color: color }}
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
                    transition={{ delay, type: "spring", damping: 15 }}
                    className="absolute bottom-0"
                    style={{ x: xOffset }}
                  >
                    {/* Wavy String */}
                    <svg width="40" height="100" className="overflow-visible">
                      <motion.path
                        d="M 20 100 Q 10 75 20 50 Q 30 25 20 0"
                        fill="none"
                        stroke="#a8a29e"
                        strokeWidth="1"
                        animate={{ d: ["M 20 100 Q 10 75 20 50 Q 30 25 20 0", "M 20 100 Q 30 75 20 50 Q 10 25 20 0", "M 20 100 Q 10 75 20 50 Q 30 25 20 0"] }}
                        transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }}
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
                        rotate: [0, 3, -3, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 4 + i,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 w-14 h-18 rounded-full shadow-sm"
                      style={{ 
                        backgroundColor: colors[i], 
                        opacity: 0.7,
                        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
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
              type: "spring",
              stiffness: 100
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
                With love, GifLove
              </span>
            </div>
          </motion.div>
        </div>

        {/* Front Cover (Folding Page) */}
        <motion.div 
          animate={{ rotateY: isOpen ? -160 : 0 }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            delay: 0.2 // Slight delay before opening
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

const BirthdayCakeCard = ({ message, recipient, fontSize, color, image, isBirthday = false, isLove = false, isBalloons = false }: { message: string, recipient: string, fontSize: number, color: string, image: string, isBirthday?: boolean, isLove?: boolean, isBalloons?: boolean }) => {
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
                          transform: `rotate(${Math.random() * 360}deg)`
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
                              transition={{ duration: 2, ease: "easeOut" }}
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
                          transform: `rotate(${Math.random() * 360}deg)`
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
                <Sparkles size={20} className="text-rose-500" /> Make a Wish & Blow!
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

const BalloonCard = ({ message, recipient, fontSize, color, image, isBirthday = false, isLove = false, isBalloons = false }: { message: string, recipient: string, fontSize: number, color: string, image: string, isBirthday?: boolean, isLove?: boolean, isBalloons?: boolean }) => {
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
                const leftPos = 15 + (i * 12); // Spread balloons from 15% to 87%
                return (
                  <motion.div
                    key={i}
                    initial={{ y: 600, left: `${leftPos}%` }}
                    animate={!popped.includes(i) ? { 
                      y: [-20, 20, -20], 
                      x: [-10, 10, -10], // Subtle horizontal sway
                      top: `${20 + (i % 3) * 15}%`
                    } : { 
                      scale: [1, 1.5, 0],
                      opacity: [1, 1, 0],
                      rotate: [0, 20, -20]
                    }}
                    transition={{ 
                      y: { repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut" },
                      x: { repeat: Infinity, duration: 4 + i * 0.5, ease: "easeInOut" },
                      scale: { duration: 0.3 },
                      opacity: { duration: 0.3 }
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
                {popped.length < 4 ? `Pop ${4 - popped.length} more to reveal...` : "Yay! Here it comes..."}
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EnvelopeCard = ({ message, recipient, fontSize, color, image, isBirthday = false, isLove = false, isBalloons = false }: { message: string, recipient: string, fontSize: number, color: string, image: string, isBirthday?: boolean, isLove?: boolean, isBalloons?: boolean }) => {
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
            transition={{ duration: 0.8, ease: "anticipate" }}
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
                      rotate: (Math.random() - 0.5) * 120
                    }}
                    transition={{ 
                      delay: 0.3 + i * 0.08,
                      duration: 2.2,
                      ease: "easeOut"
                    }}
                    className="absolute left-1/2 top-1/2"
                  >
                    <Heart 
                      size={14 + Math.random() * 18} 
                      className={i % 3 === 0 ? "text-red-600" : i % 3 === 1 ? "text-rose-400" : "text-white"} 
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
                transition={{ duration: 1, ease: "backOut" }}
                className={`absolute inset-x-6 top-6 bottom-6 bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col items-center justify-center text-center border border-stone-100 transition-all duration-300 ${isOpen ? 'z-40' : 'z-10'}`}
              >
                {isLove ? (
                  <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Card Preview" />
                ) : (
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                       <Heart size={32} className="text-rose-500" fill="currentColor" />
                    </div>
                    <p className="serif text-sm text-stone-500 italic">You've received a GifLove greeting</p>
                  </div>
                )}
              </motion.div>
      
              {/* The Envelope */}
              <div className={`absolute inset-0 ${isLove ? 'bg-[#d2b48c]' : 'bg-rose-100'} rounded-lg shadow-xl z-20 border ${isLove ? 'border-[#bc9d76]' : 'border-rose-200/50'}`}>
                {/* Flap */}
                <motion.div 
                  animate={isOpen ? { rotateX: -160 } : { rotateX: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className={`absolute inset-x-0 top-0 h-1/2 ${isLove ? 'bg-[#c19a6b]' : 'bg-rose-200'} origin-top shadow-md flex items-end justify-center pb-4 transition-all duration-300 ${isOpen ? 'z-10' : 'z-30'}`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
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

const Navbar = ({ currentPage, setPage }: { currentPage: Page, setPage: (p: Page) => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <button 
        onClick={() => setPage('home')}
        className="flex items-center gap-2 group cursor-pointer"
      >
        <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
          <Heart size={18} fill="currentColor" />
        </div>
        <span className="playful text-xl font-bold tracking-tight text-rose-500">GifLove</span>
      </button>
      
      <div className="flex items-center gap-8">
        <button onClick={() => setPage('home')} className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-rose-600' : 'text-stone-500 hover:text-stone-900'}`}>Home</button>
        <button onClick={() => setPage('about')} className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-rose-600' : 'text-stone-500 hover:text-stone-900'}`}>About</button>
        <button onClick={() => setPage('faq')} className={`text-sm font-medium transition-colors ${currentPage === 'faq' ? 'text-rose-600' : 'text-stone-500 hover:text-stone-900'}`}>How it Works</button>
        <button 
          onClick={() => setPage('cards')}
          className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
        >
          Browse Cards
        </button>
      </div>
    </div>
  </nav>
);

const HomePage = ({ onSelectTier }: { onSelectTier: (t: Tier) => void }) => (
  <div className="pt-32 pb-20 px-6">
    <div className="max-w-4xl mx-auto text-center mb-20">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="playful text-6xl md:text-7xl font-bold mb-6 leading-tight text-stone-800"
      >
        Digital greetings, <br />
        <span className="italic">beautifully crafted.</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-stone-500 text-lg max-w-xl mx-auto"
      >
        Send more than just a message. Choose from our curated collection of artistic e-cards and personalize them for your loved ones.
      </motion.p>
    </div>

    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Basic Tier */}
      <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white p-10 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6">
          <Gift className="text-stone-400" size={32} />
        </div>
        <h3 className="playful text-3xl mb-2 font-bold text-stone-700">Basic Collection</h3>
        <div className="text-4xl font-light mb-6">$3<span className="text-lg text-stone-400">/card</span></div>
        <ul className="text-stone-500 space-y-3 mb-10 text-sm">
          <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Standard Artistic Designs</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Basic Text Customization</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Instant Email Delivery</li>
        </ul>
        <button 
          onClick={() => onSelectTier('basic')}
          className="w-full py-4 rounded-2xl border-2 border-stone-900 font-semibold hover:bg-stone-900 hover:text-white transition-all"
        >
          Choose Basic
        </button>
      </motion.div>

      {/* Premium Tier */}
      <motion.div 
        whileHover={{ y: -10 }}
        className="bg-stone-900 p-10 rounded-[2rem] text-white flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-6 right-6 bg-rose-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Popular
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="text-rose-400" size={32} />
        </div>
        <h3 className="playful text-3xl mb-2 font-bold text-stone-700">Premium Collection</h3>
        <div className="text-4xl font-light mb-6">$4<span className="text-lg text-white/40">/card</span></div>
        <ul className="text-white/60 space-y-3 mb-10 text-sm">
          <li className="flex items-center gap-2"><Check size={16} className="text-rose-400" /> Exclusive Premium Designs</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-rose-400" /> Advanced Layout Editor</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-rose-400" /> Animated Transitions</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-rose-400" /> Scheduled Delivery</li>
        </ul>
        <button 
          onClick={() => onSelectTier('premium')}
          className="w-full py-4 rounded-2xl bg-rose-500 font-semibold hover:bg-rose-600 transition-all"
        >
          Go Premium
        </button>
      </motion.div>
    </div>
  </div>
);

const CardsPage = ({ tier, onSelectCard }: { tier: Tier | null, onSelectCard: (c: CardTemplate) => void }) => {
  const filteredTemplates = tier ? TEMPLATES.filter(t => t.tier === tier) : TEMPLATES;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="playful text-5xl mb-4 capitalize font-bold text-stone-800">{tier ? `${tier} Collection` : 'All Cards'}</h2>
          <p className="text-stone-500">Select a template to start personalizing your greeting.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Birthday', 'Anniversary', 'Thank You'].map(cat => (
            <button key={cat} className="px-4 py-2 rounded-full text-sm border border-stone-200 hover:border-stone-900 transition-colors whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((card, idx) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group cursor-pointer"
            onClick={() => onSelectCard(card)}
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-4 relative bg-stone-100">
              {card.type === 'static' ? (
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="w-full h-full scale-50 opacity-60 group-hover:scale-75 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    {card.type === 'birthday-cake' && <BirthdayCakeCard message="" recipient="" fontSize={12} color="#000" image={card.image} isBirthday={card.category === 'Birthday'} isLove={card.category === 'Love'} isBalloons={false} />}
                    {card.type === 'balloons' && <BalloonCard message="" recipient="" fontSize={12} color="#000" image={card.image} isBirthday={false} isLove={card.category === 'Love'} isBalloons={true} />}
                    {card.type === 'envelope' && <EnvelopeCard message="" recipient="" fontSize={12} color="#000" image={card.image} isBirthday={card.category === 'Birthday'} isLove={card.category === 'Love'} isBalloons={false} />}
                  </div>
                  <div className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-full shadow-lg">
                    <Sparkles size={16} />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white text-stone-900 px-6 py-3 rounded-full font-medium flex items-center gap-2">
                  <Edit3 size={18} /> Edit Card
                </div>
              </div>
            </div>
            <h4 className="playful text-xl mb-1 font-bold text-stone-700">{card.title}</h4>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">{card.category}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EditorPage = ({ card, onBack }: { card: CardTemplate, onBack: () => void }) => {
  const [message, setMessage] = useState("Wishing you a day filled with happiness and a year filled with joy. Happy Birthday!");
  const [recipient, setRecipient] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("#1c1917");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="pt-24 min-h-screen flex flex-col md:flex-row bg-stone-50">
      {/* Sidebar Controls */}
      <div className="w-full md:w-96 bg-white border-r border-stone-200 p-8 overflow-y-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 mb-8 transition-colors">
          <X size={20} /> Cancel Editing
        </button>
        
        <h2 className="playful text-3xl mb-8 font-bold text-stone-800">Personalize</h2>

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Recipient Name</label>
            <input 
              type="text" 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Your Message</label>
            <textarea 
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Font Size</label>
              <div className="flex items-center gap-3">
                <Type size={16} className="text-stone-400" />
                <input 
                  type="range" min="12" max="48" 
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-rose-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Text Color</label>
              <div className="flex items-center gap-2">
                {['#1c1917', '#e11d48', '#059669', '#2563eb', '#d97706'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-stone-900 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${isPreviewMode ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900'}`}
            >
              <Sparkles size={18} /> {isPreviewMode ? 'Back to Editor' : 'Preview Animation'}
            </button>
            <button className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10">
              <Send size={18} /> Send Greeting
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-6 md:p-12 flex items-center justify-center overflow-hidden bg-stone-100/50">
        <div className="max-w-md w-full aspect-[3/4] relative">
          <AnimatePresence mode="wait">
            {isPreviewMode ? (
              <motion.div 
                key="animated"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full"
              >
                {card.type === 'birthday-cake' && <BirthdayCakeCard message={message} recipient={recipient} fontSize={fontSize} color={color} image={card.image} isBirthday={card.category === 'Birthday'} isLove={card.category === 'Love'} isBalloons={false} />}
                {card.type === 'balloons' && <BalloonCard message={message} recipient={recipient} fontSize={fontSize} color={color} image={card.image} isBirthday={false} isLove={card.category === 'Love'} isBalloons={true} />}
                {card.type === 'envelope' && <EnvelopeCard message={message} recipient={recipient} fontSize={fontSize} color={color} image={card.image} isBirthday={card.category === 'Birthday'} isLove={card.category === 'Love'} isBalloons={false} />}
                {card.type === 'static' && (
                  <div className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center">
                    <p className="text-stone-400 italic mb-4">Static cards don't have animations, but they look great!</p>
                    <img src={card.image} className="w-full h-48 object-cover rounded-xl mb-6" referrerPolicy="no-referrer" />
                    <p className="serif" style={{ fontSize: `${fontSize}px`, color }}>{message}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="static"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layoutId={`card-${card.id}`}
                className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden w-full h-full flex flex-col relative"
              >
                <div className="h-1/2 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center text-center">
                  {recipient && (
                    <motion.h4 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="serif text-xl md:text-2xl mb-4 text-stone-400 italic"
                    >
                      Dear {recipient},
                    </motion.h4>
                  )}
                  <p 
                    className="serif leading-relaxed"
                    style={{ fontSize: `${fontSize}px`, color: color }}
                  >
                    {message}
                  </p>
                  <div className="mt-8 pt-8 border-t border-stone-100 w-full">
                    <span className="serif text-lg italic text-stone-400">With love, GifLove</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
    <h2 className="serif text-6xl mb-12 text-center">Our Story</h2>
    <div className="aspect-video rounded-[3rem] overflow-hidden mb-16">
      <img src="https://picsum.photos/seed/studio/1200/800" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    </div>
    <div className="prose prose-stone lg:prose-xl mx-auto">
      <p className="serif text-2xl leading-relaxed mb-8">
        GifLove was born from a simple observation: in our fast-paced digital world, 
        the art of the personal message was being lost to quick texts and generic emojis.
      </p>
      <p className="text-stone-500 leading-relaxed mb-6">
        We believe that a greeting card is more than just paper or pixels—it's a vessel for emotion, 
        a moment of connection, and a lasting memory. Our mission is to combine the timeless 
        elegance of traditional stationery with the convenience of digital delivery.
      </p>
      <p className="text-stone-500 leading-relaxed">
        Every template in our collection is hand-picked or custom-designed by independent artists, 
        ensuring that your message is wrapped in beauty. Whether it's a milestone birthday, 
        a quiet thank you, or a grand celebration, we're here to help you say it better.
      </p>
    </div>
  </div>
);

const FAQPage = () => {
  const faqs = [
    { q: "How do I send a card?", a: "Simply choose a pricing tier, select a design you love, personalize it with your message, and enter the recipient's email address. We'll handle the rest!" },
    { q: "Can I schedule a card for later?", a: "Yes! Our Premium tier allows you to pick a specific date and time for your card to be delivered, so you never miss a special moment." },
    { q: "What's the difference between Basic and Premium?", a: "Basic cards offer beautiful standard designs and text editing. Premium gives you access to exclusive artist collections, advanced layout tools, and scheduled delivery." },
    { q: "Is it secure?", a: "Absolutely. We use industry-standard encryption to protect your data and ensure your messages are only seen by the intended recipient." }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <h2 className="serif text-6xl mb-12 text-center">How it Works</h2>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
            <h4 className="serif text-2xl mb-4 flex items-center gap-3">
              <HelpCircle className="text-rose-500" size={24} />
              {faq.q}
            </h4>
            <p className="text-stone-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardTemplate | null>(null);

  const handleSelectTier = (tier: Tier) => {
    setSelectedTier(tier);
    setPage('cards');
    window.scrollTo(0, 0);
  };

  const handleSelectCard = (card: CardTemplate) => {
    setSelectedCard(card);
    setPage('editor');
    window.scrollTo(0, 0);
  };

  const navigateTo = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <Navbar currentPage={page} setPage={navigateTo} />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {page === 'home' && <HomePage onSelectTier={handleSelectTier} />}
            {page === 'cards' && <CardsPage tier={selectedTier} onSelectCard={handleSelectCard} />}
            {page === 'editor' && selectedCard && (
              <EditorPage card={selectedCard} onBack={() => navigateTo('cards')} />
            )}
            {page === 'about' && <AboutPage />}
            {page === 'faq' && <FAQPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {page !== 'editor' && (
        <footer className="bg-stone-900 text-white py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white">
                  <Heart size={18} fill="currentColor" />
                </div>
                <span className="playful text-2xl font-bold tracking-tight text-rose-500">GifLove</span>
              </div>
              <p className="text-white/40 max-w-sm">
                Elevating digital connections through artistic design and personal touch.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Platform</h5>
              <ul className="space-y-4 text-sm text-white/60">
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => navigateTo('cards')} className="hover:text-white transition-colors cursor-pointer">Browse Cards</button></li>
                <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors cursor-pointer">How it Works</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-white/60">
                <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors cursor-pointer">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
            © 2024 GifLove Greetings. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
