'use client';

export default function CardDecorations({ theme }: { theme: string }) {
  switch (theme) {
    case 'balloon-party':    return <BalloonParty />;
    case 'confetti-burst':   return <ConfettiBurst />;
    case 'simple-thanks':    return <SimpleThanks />;
    case 'diploma-scroll':   return <DiplomaScroll />;
    case 'achievement':      return <Achievement />;
    case 'rose-petals':      return <RosePetals />;
    case 'cake-celebration': return <CakeCelebration />;
    case 'heart-float':      return <HeartFloat />;
    case 'cap-toss':         return <CapToss />;
    default:                 return null;
  }
}

// ─── Shared wrapper ───────────────────────────────────────────────────────────
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {children}
    </div>
  );
}

// ─── Balloon Party ─ bright sky blue, cheerful ────────────────────────────────
function BalloonParty() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bp-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52c5f5" />
            <stop offset="100%" stopColor="#c9ecfc" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#bp-bg)" />
        {/* Clouds */}
        <g opacity="0.85">
          <ellipse cx="70" cy="72" rx="38" ry="18" fill="white" />
          <ellipse cx="97" cy="62" rx="28" ry="16" fill="white" />
          <ellipse cx="46" cy="69" rx="22" ry="13" fill="white" />
        </g>
        <g opacity="0.75">
          <ellipse cx="322" cy="96" rx="44" ry="20" fill="white" />
          <ellipse cx="353" cy="84" rx="30" ry="18" fill="white" />
          <ellipse cx="296" cy="93" rx="26" ry="15" fill="white" />
        </g>
        <g opacity="0.55">
          <ellipse cx="185" cy="46" rx="28" ry="13" fill="white" />
          <ellipse cx="202" cy="39" rx="19" ry="12" fill="white" />
        </g>
        {/* Balloon 1 – coral/red */}
        <ellipse cx="72" cy="178" rx="28" ry="34" fill="#FF6B6B" />
        <ellipse cx="64" cy="169" rx="9" ry="6" fill="#FF9090" opacity="0.45" />
        <path d="M72 212 Q66 238 64 268" stroke="#9ab" strokeWidth="1.4" fill="none" />
        {/* Balloon 2 – yellow */}
        <ellipse cx="330" cy="148" rx="26" ry="32" fill="#FFD93D" />
        <ellipse cx="322" cy="139" rx="8" ry="5.5" fill="#FFE87A" opacity="0.45" />
        <path d="M330 180 Q325 205 323 232" stroke="#9ab" strokeWidth="1.4" fill="none" />
        {/* Balloon 3 – purple */}
        <ellipse cx="368" cy="234" rx="24" ry="29" fill="#B388FF" />
        <ellipse cx="361" cy="226" rx="7.5" ry="5" fill="#D0AAFF" opacity="0.45" />
        <path d="M368 263 Q363 284 365 308" stroke="#9ab" strokeWidth="1.4" fill="none" />
        {/* Balloon 4 – teal */}
        <ellipse cx="38" cy="318" rx="24" ry="29" fill="#26C6DA" />
        <ellipse cx="31" cy="310" rx="7.5" ry="5" fill="#69EFFF" opacity="0.45" />
        <path d="M38 347 Q33 368 35 392" stroke="#9ab" strokeWidth="1.4" fill="none" />
        {/* Balloon 5 – orange */}
        <ellipse cx="355" cy="346" rx="22" ry="27" fill="#FFA040" />
        <ellipse cx="348" cy="338" rx="7" ry="4.5" fill="#FFC270" opacity="0.45" />
        <path d="M355 373 Q350 394 352 416" stroke="#9ab" strokeWidth="1.4" fill="none" />
        {/* Confetti top */}
        <circle cx="145" cy="38" r="5" fill="#FF6B6B" opacity="0.9" />
        <circle cx="200" cy="30" r="4" fill="#FFD93D" opacity="0.9" />
        <circle cx="256" cy="44" r="5" fill="#26C6DA" opacity="0.9" />
        <rect x="167" y="32" width="9" height="5" fill="#B388FF" opacity="0.9" transform="rotate(35,171,34)" />
        <rect x="228" y="40" width="9" height="5" fill="#FF6B6B" opacity="0.9" transform="rotate(-20,232,42)" />
        {/* Confetti bottom */}
        <circle cx="155" cy="556" r="5" fill="#FF6B6B" opacity="0.9" />
        <circle cx="218" cy="546" r="4" fill="#B388FF" opacity="0.9" />
        <circle cx="278" cy="562" r="5" fill="#FFD93D" opacity="0.9" />
        <rect x="178" y="550" width="9" height="5" fill="#26C6DA" opacity="0.9" transform="rotate(45,182,552)" />
        <rect x="248" y="558" width="9" height="5" fill="#FFA040" opacity="0.9" transform="rotate(-30,252,560)" />
        {/* Stars */}
        <text x="295" y="58" fontSize="15" fill="#FFD93D" opacity="0.75">★</text>
        <text x="108" y="542" fontSize="13" fill="#FF6B6B" opacity="0.75">★</text>
        <text x="335" y="385" fontSize="11" fill="#FFD93D" opacity="0.5">✦</text>
      </svg>
    </Wrap>
  );
}

// ─── Confetti Burst ─ white bg, rainbow confetti ───────────────────────────────
function ConfettiBurst() {
  const pieces = [
    [50,30,'#FF6B6B',20],[80,55,'#FFD93D',-15],[120,20,'#26C6DA',40],[160,45,'#B388FF',10],
    [200,25,'#FFA040',-30],[240,50,'#FF6B6B',25],[280,30,'#FFD93D',-10],[320,48,'#26C6DA',35],
    [360,22,'#B388FF',-25],[40,90,'#FFA040',15],[100,80,'#FF6B6B',-20],[180,75,'#FFD93D',45],
    [260,85,'#26C6DA',-35],[340,78,'#B388FF',20],[380,95,'#FFA040',-15],
    [30,510,'#FF6B6B',30],[70,530,'#FFD93D',-25],[130,515,'#26C6DA',15],[190,540,'#B388FF',-10],
    [250,520,'#FFA040',40],[310,535,'#FF6B6B',-20],[360,518,'#FFD93D',25],[390,545,'#26C6DA',-35],
  ];
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        {pieces.map(([x, y, color, rot], i) => (
          i % 3 === 0
            ? <circle key={i} cx={x as number} cy={y as number} r="6" fill={color as string} opacity="0.85" />
            : i % 3 === 1
            ? <rect key={i} x={(x as number)-5} y={(y as number)-3} width="10" height="6" fill={color as string} opacity="0.85" transform={`rotate(${rot},${x},${y})`} />
            : <polygon key={i} points={`${x},${(y as number)-6} ${(x as number)+5},${(y as number)+4} ${(x as number)-5},${(y as number)+4}`} fill={color as string} opacity="0.85" transform={`rotate(${rot},${x},${y})`} />
        ))}
        {/* Diagonal confetti streams */}
        <line x1="0" y1="0" x2="400" y2="600" stroke="none" />
        {[...Array(6)].map((_, i) => (
          <circle key={`s${i}`} cx={55*i+20} cy={80*i+20} r="4" fill={['#FF6B6B','#FFD93D','#26C6DA','#B388FF','#FFA040','#FF6B6B'][i]} opacity="0.5" />
        ))}
      </svg>
    </Wrap>
  );
}

// ─── Simple Thanks ─ deep forest green, botanical ─────────────────────────────
function SimpleThanks() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="st-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b2e22" />
            <stop offset="100%" stopColor="#1a5240" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#st-bg)" />
        {/* Leaf branch left */}
        <g opacity="0.6">
          <path d="M-10 320 Q30 250 60 180" stroke="#2d8a5e" strokeWidth="2.5" fill="none" />
          <ellipse cx="28" cy="268" rx="22" ry="11" fill="#2d8a5e" transform="rotate(-35,28,268)" />
          <ellipse cx="44" cy="228" rx="20" ry="10" fill="#34a06c" transform="rotate(-50,44,228)" />
          <ellipse cx="55" cy="194" rx="18" ry="9" fill="#2d8a5e" transform="rotate(-60,55,194)" />
          <ellipse cx="15" cy="300" rx="19" ry="9" fill="#34a06c" transform="rotate(-20,15,300)" />
        </g>
        {/* Leaf branch right */}
        <g opacity="0.6">
          <path d="M410 320 Q370 250 340 180" stroke="#2d8a5e" strokeWidth="2.5" fill="none" />
          <ellipse cx="372" cy="268" rx="22" ry="11" fill="#2d8a5e" transform="rotate(35,372,268)" />
          <ellipse cx="356" cy="228" rx="20" ry="10" fill="#34a06c" transform="rotate(50,356,228)" />
          <ellipse cx="345" cy="194" rx="18" ry="9" fill="#2d8a5e" transform="rotate(60,345,194)" />
          <ellipse cx="385" cy="300" rx="19" ry="9" fill="#34a06c" transform="rotate(20,385,300)" />
        </g>
        {/* Bottom foliage */}
        <g opacity="0.5">
          <ellipse cx="60" cy="560" rx="28" ry="14" fill="#2d8a5e" transform="rotate(-15,60,560)" />
          <ellipse cx="110" cy="575" rx="24" ry="12" fill="#34a06c" transform="rotate(-5,110,575)" />
          <ellipse cx="290" cy="575" rx="24" ry="12" fill="#34a06c" transform="rotate(5,290,575)" />
          <ellipse cx="340" cy="560" rx="28" ry="14" fill="#2d8a5e" transform="rotate(15,340,560)" />
        </g>
        {/* Top vine arch */}
        <g opacity="0.45">
          <path d="M0 40 Q200 -10 400 40" stroke="#2d8a5e" strokeWidth="2" fill="none" />
          <ellipse cx="80" cy="28" rx="14" ry="8" fill="#34a06c" transform="rotate(-20,80,28)" />
          <ellipse cx="160" cy="18" rx="14" ry="8" fill="#2d8a5e" transform="rotate(-5,160,18)" />
          <ellipse cx="240" cy="18" rx="14" ry="8" fill="#34a06c" transform="rotate(5,240,18)" />
          <ellipse cx="320" cy="28" rx="14" ry="8" fill="#2d8a5e" transform="rotate(20,320,28)" />
        </g>
        {/* Gold accent dots */}
        <circle cx="200" cy="12" r="3.5" fill="#d4af37" opacity="0.7" />
        <circle cx="140" cy="8" r="2.5" fill="#d4af37" opacity="0.5" />
        <circle cx="260" cy="8" r="2.5" fill="#d4af37" opacity="0.5" />
        <circle cx="200" cy="590" r="3.5" fill="#d4af37" opacity="0.7" />
      </svg>
    </Wrap>
  );
}

// ─── Diploma Scroll ─ parchment, classical ────────────────────────────────────
function DiplomaScroll() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="dp-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5f0e0" />
            <stop offset="100%" stopColor="#ede3c8" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#dp-bg)" />
        {/* Border frame */}
        <rect x="14" y="14" width="372" height="572" rx="4" fill="none" stroke="#2e5090" strokeWidth="3" opacity="0.5" />
        <rect x="22" y="22" width="356" height="556" rx="2" fill="none" stroke="#2e5090" strokeWidth="1.2" opacity="0.3" />
        {/* Corner ornaments */}
        {[[28,28],[372,28],[28,572],[372,572]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="none" stroke="#2e5090" strokeWidth="1.5" opacity="0.5" />
            <circle cx={cx} cy={cy} r="3" fill="#2e5090" opacity="0.4" />
          </g>
        ))}
        {/* Top scroll ornament */}
        <path d="M160 38 Q200 28 240 38" stroke="#2e5090" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="200" cy="32" r="5" fill="#FFD700" opacity="0.7" />
        <path d="M185 32 Q200 22 215 32" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.6" />
        {/* Bottom seal */}
        <circle cx="200" cy="558" r="22" fill="none" stroke="#2e5090" strokeWidth="2" opacity="0.4" />
        <circle cx="200" cy="558" r="16" fill="#2e5090" opacity="0.12" />
        <text x="200" y="563" textAnchor="middle" fontSize="14" fill="#2e5090" opacity="0.5">★</text>
        {/* Subtle horizontal rules */}
        <line x1="50" y1="90" x2="350" y2="90" stroke="#2e5090" strokeWidth="0.8" opacity="0.2" />
        <line x1="50" y1="510" x2="350" y2="510" stroke="#2e5090" strokeWidth="0.8" opacity="0.2" />
      </svg>
    </Wrap>
  );
}

// ─── Achievement ─ cream/gold, trophy, star burst ─────────────────────────────
function Achievement() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ach-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffde7" />
            <stop offset="100%" stopColor="#fff9c4" />
          </linearGradient>
          <radialGradient id="ach-burst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="600" fill="url(#ach-bg)" />
        {/* Star burst */}
        <circle cx="200" cy="300" r="160" fill="url(#ach-burst)" />
        {[0,20,40,60,80,100,120,140,160,180].map((deg, i) => (
          <line key={i} x1="200" y1="300"
            x2={200 + 180 * Math.cos((deg * Math.PI) / 180)}
            y2={300 + 180 * Math.sin((deg * Math.PI) / 180)}
            stroke="#FFD700" strokeWidth="1" opacity="0.2" />
        ))}
        {/* Trophy silhouette */}
        <g opacity="0.12" fill="#DAA520">
          <rect x="178" y="500" width="44" height="10" rx="2" />
          <rect x="188" y="490" width="24" height="12" rx="1" />
          {/* Cup */}
          <path d="M162 440 Q160 480 188 490 L212 490 Q240 480 238 440 Z" />
          {/* Handles */}
          <path d="M162 450 Q145 460 148 475 Q152 488 162 480" fill="none" stroke="#DAA520" strokeWidth="8" />
          <path d="M238 450 Q255 460 252 475 Q248 488 238 480" fill="none" stroke="#DAA520" strokeWidth="8" />
        </g>
        {/* Gold stars scattered */}
        {[[60,80],[340,80],[50,520],[350,520],[30,300],[370,300]].map(([x,y],i) => (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="20" fill="#DAA520" opacity="0.5">★</text>
        ))}
        <text x="200" y="70" textAnchor="middle" fontSize="26" fill="#DAA520" opacity="0.35">★</text>
        <text x="200" y="545" textAnchor="middle" fontSize="26" fill="#DAA520" opacity="0.35">★</text>
      </svg>
    </Wrap>
  );
}

// ─── Rose Petals ─ deep wine, romantic, premium ───────────────────────────────
function RosePetals() {
  const petals = [
    [60,80,'-20'],[340,120,'30'],[30,250,'-40'],[370,300,'15'],
    [80,450,'-10'],[330,420,'35'],[150,60,'25'],[250,70,'-15'],
    [40,160,'45'],[360,180,'-30'],[110,540,'20'],[290,550,'-25'],
  ];
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="rp-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d0015" />
            <stop offset="100%" stopColor="#7b1040" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#rp-bg)" />
        {/* Scattered petals */}
        {petals.map(([x, y, rot], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${rot})`} opacity="0.55">
            <ellipse rx="14" ry="22" fill="#e8608a" />
            <ellipse rx="6" ry="16" fill="#f08aaa" opacity="0.5" />
          </g>
        ))}
        {/* Small sparkle stars */}
        {[[120,40],[280,40],[50,300],[350,300],[160,560],[240,560],[200,15],[200,585]].map(([x,y],i) => (
          <g key={i} opacity="0.6">
            <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="#FFD6E0" strokeWidth="1.2" />
            <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="#FFD6E0" strokeWidth="1.2" />
            <circle cx={x} cy={y} r="1.5" fill="#FFD6E0" />
          </g>
        ))}
        {/* Soft glow circles at edges */}
        <circle cx="0" cy="0" r="100" fill="#e8608a" opacity="0.06" />
        <circle cx="400" cy="600" r="100" fill="#e8608a" opacity="0.06" />
      </svg>
    </Wrap>
  );
}

// ─── Cake Celebration ─ deep night sky, festive, premium ──────────────────────
function CakeCelebration() {
  const confetti = [
    [40,30,'#FF6B6B',20],[90,50,'#FFD93D',-15],[140,25,'#26C6DA',40],[190,45,'#B388FF',10],
    [240,28,'#FFA040',-30],[290,50,'#FF6B6B',25],[340,30,'#FFD93D',-10],[380,48,'#26C6DA',35],
    [30,555,'#B388FF',20],[80,570,'#FF6B6B',-25],[140,558,'#FFD93D',15],[200,575,'#26C6DA',-10],
    [260,562,'#FFA040',40],[320,572,'#FF6B6B',-20],[370,555,'#FFD93D',25],
  ];
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ck-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#13111a" />
            <stop offset="100%" stopColor="#2a1f50" />
          </linearGradient>
          <radialGradient id="ck-glow" cx="50%" cy="75%" r="40%">
            <stop offset="0%" stopColor="#6a40c8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6a40c8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="600" fill="url(#ck-bg)" />
        <rect width="400" height="600" fill="url(#ck-glow)" />
        {/* Confetti */}
        {confetti.map(([x, y, color, rot], i) => (
          i % 3 === 0
            ? <circle key={i} cx={x as number} cy={y as number} r="5.5" fill={color as string} opacity="0.8" />
            : i % 3 === 1
            ? <rect key={i} x={(x as number)-4.5} y={(y as number)-3} width="9" height="6" fill={color as string} opacity="0.8" transform={`rotate(${rot},${x},${y})`} />
            : <polygon key={i} points={`${x},${(y as number)-5} ${(x as number)+4.5},${(y as number)+3} ${(x as number)-4.5},${(y as number)+3}`} fill={color as string} opacity="0.8" transform={`rotate(${rot},${x},${y})`} />
        ))}
        {/* Cake silhouette at bottom */}
        <g opacity="0.18" fill="#a87eff">
          {/* Plate */}
          <ellipse cx="200" cy="535" rx="70" ry="10" />
          {/* Base tier */}
          <path d="M140 500 Q140 535 200 535 Q260 535 260 500 Z" />
          <rect x="140" y="470" width="120" height="32" rx="3" />
          {/* Middle tier */}
          <rect x="155" y="440" width="90" height="32" rx="3" />
          {/* Top tier */}
          <rect x="170" y="415" width="60" height="27" rx="3" />
          {/* Candles */}
          {[182, 196, 210, 224].map((cx, i) => (
            <g key={i}>
              <rect x={cx-3} y="400" width="6" height="16" rx="2" fill="#FFD93D" opacity="0.9" />
              {/* Flame */}
              <ellipse cx={cx} cy="397" rx="3.5" ry="5" fill="#FF9800" opacity="0.9" />
              <ellipse cx={cx} cy="396" rx="2" ry="3" fill="#FFD93D" opacity="0.9" />
            </g>
          ))}
        </g>
        {/* Star sparkles */}
        {[[50,90],[350,90],[25,300],[375,300],[100,480],[300,480],[200,30]].map(([x,y],i) => (
          <g key={i} opacity="0.65">
            <line x1={x-7} y1={y} x2={x+7} y2={y} stroke="#FFD700" strokeWidth="1.4" />
            <line x1={x} y1={y-7} x2={x} y2={y+7} stroke="#FFD700" strokeWidth="1.4" />
            <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke="#FFD700" strokeWidth="0.9" />
            <line x1={x+5} y1={y-5} x2={x-5} y2={y+5} stroke="#FFD700" strokeWidth="0.9" />
            <circle cx={x} cy={y} r="2" fill="#FFD700" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}

// ─── Heart Float ─ blush pink, champagne, hearts, premium ─────────────────────
function HeartFloat() {
  const hearts = [
    [55,80,22],[340,110,30],[30,250,18],[370,280,24],
    [75,430,20],[330,400,16],[170,55,26],[230,65,18],
    [45,160,14],[355,175,20],[100,520,22],[300,530,16],
  ];
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hf-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff0f5" />
            <stop offset="100%" stopColor="#ffd6e7" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#hf-bg)" />
        {/* Floating hearts */}
        {hearts.map(([x, y, s], i) => {
          const scale = (s as number) / 24;
          return (
            <g key={i} transform={`translate(${x},${y}) scale(${scale})`} opacity={0.25 + (i % 4) * 0.12}>
              <path d="M0,-8 C-4,-14 -14,-14 -14,-6 C-14,2 0,12 0,12 C0,12 14,2 14,-6 C14,-14 4,-14 0,-8 Z"
                fill="#e8608a" />
            </g>
          );
        })}
        {/* Champagne glasses (outline) - bottom left & right */}
        <g opacity="0.2" stroke="#C84B6E" strokeWidth="1.8" fill="none">
          <path d="M58 520 Q44 490 44 470 L72 470 Q72 490 58 520 Z" />
          <line x1="58" y1="520" x2="58" y2="540" />
          <line x1="46" y1="540" x2="70" y2="540" />
          {/* Bubbles */}
          <circle cx="54" cy="480" r="2" />
          <circle cx="60" cy="492" r="1.5" />
          <circle cx="56" cy="500" r="1" />
        </g>
        <g opacity="0.2" stroke="#C84B6E" strokeWidth="1.8" fill="none">
          <path d="M342 520 Q328 490 328 470 L356 470 Q356 490 342 520 Z" />
          <line x1="342" y1="520" x2="342" y2="540" />
          <line x1="330" y1="540" x2="354" y2="540" />
          <circle cx="338" cy="480" r="2" />
          <circle cx="344" cy="492" r="1.5" />
          <circle cx="340" cy="500" r="1" />
        </g>
        {/* Bubble dots */}
        {[[80,530],[100,545],[120,528],[280,528],[300,545],[320,530]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#e8608a" opacity="0.2" />
        ))}
        {/* Sparkle stars */}
        {[[200,25],[30,195],[370,195],[200,575]].map(([x,y],i) => (
          <g key={i} opacity="0.5">
            <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="#C84B6E" strokeWidth="1.2" />
            <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="#C84B6E" strokeWidth="1.2" />
            <circle cx={x} cy={y} r="1.5" fill="#C84B6E" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}

// ─── Cap Toss ─ deep navy, gold, graduation, premium ──────────────────────────
function CapToss() {
  // Graduation cap: board + tassel
  function Cap({ x, y, size, rot }: { x:number; y:number; size:number; rot:number }) {
    const s = size / 20;
    return (
      <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity="0.55">
        {/* Board */}
        <polygon points="0,-10 14,0 0,10 -14,0" fill="#FFD700" />
        {/* Top cylinder */}
        <rect x="-5" y="-8" width="10" height="7" rx="1" fill="#DAA520" />
        {/* Tassel */}
        <line x1="6" y1="-5" x2="14" y2="8" stroke="#FFD700" strokeWidth="2" />
        <circle cx="14" cy="10" r="3" fill="#FFD700" />
      </g>
    );
  }
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ct-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0e2e" />
            <stop offset="100%" stopColor="#151b5e" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#ct-bg)" />
        {/* Caps */}
        <Cap x={60}  y={100} size={34} rot={-15} />
        <Cap x={340} y={120} size={30} rot={20} />
        <Cap x={30}  y={340} size={28} rot={-25} />
        <Cap x={370} y={320} size={32} rot={15} />
        <Cap x={130} y={70}  size={22} rot={10} />
        <Cap x={270} y={75}  size={22} rot={-10} />
        {/* Confetti */}
        {[[50,40,'#FFD700'],[100,30,'#B0C4FF'],[160,50,'#FFD700'],[220,35,'#B0C4FF'],
          [280,50,'#FFD700'],[340,38,'#B0C4FF'],[390,55,'#FFD700'],
          [30,555,'#FFD700'],[80,570,'#B0C4FF'],[150,558,'#FFD700'],[220,572,'#B0C4FF'],
          [290,560,'#FFD700'],[350,572,'#B0C4FF'],[385,552,'#FFD700']
        ].map(([x,y,c],i) => (
          i % 2 === 0
            ? <circle key={i} cx={x as number} cy={y as number} r="4.5" fill={c as string} opacity="0.75" />
            : <rect key={i} x={(x as number)-4} y={(y as number)-2.5} width="8" height="5" fill={c as string} opacity="0.75"
                transform={`rotate(${i*25},${x},${y})`} />
        ))}
        {/* Gold sparkles */}
        {[[200,30],[25,200],[375,200],[120,490],[280,490],[200,575]].map(([x,y],i) => (
          <g key={i} opacity="0.7">
            <line x1={x-8} y1={y} x2={x+8} y2={y} stroke="#FFD700" strokeWidth="1.5" />
            <line x1={x} y1={y-8} x2={x} y2={y+8} stroke="#FFD700" strokeWidth="1.5" />
            <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke="#FFD700" strokeWidth="1" />
            <line x1={x+5} y1={y-5} x2={x-5} y2={y+5} stroke="#FFD700" strokeWidth="1" />
            <circle cx={x} cy={y} r="2.5" fill="#FFD700" />
          </g>
        ))}
        {/* Subtle star field */}
        {[[80,160],[150,200],[250,180],[320,160],[50,450],[350,450],[180,400],[220,420]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="1.2" fill="white" opacity="0.35" />
        ))}
      </svg>
    </Wrap>
  );
}
