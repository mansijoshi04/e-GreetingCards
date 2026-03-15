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

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {children}
    </div>
  );
}

// ─── Balloon Party ─ sky blue, 3 large colorful balloons + confetti ────────────
function BalloonParty() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bp-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#56c8f0" />
            <stop offset="100%" stopColor="#a8e6f8" />
          </linearGradient>
          <radialGradient id="bp-b1" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff9090" />
            <stop offset="100%" stopColor="#FF4444" />
          </radialGradient>
          <radialGradient id="bp-b2" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#FFC107" />
          </radialGradient>
          <radialGradient id="bp-b3" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#c09aff" />
            <stop offset="100%" stopColor="#9C27B0" />
          </radialGradient>
          <radialGradient id="bp-b4" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#80e8a0" />
            <stop offset="100%" stopColor="#26A65B" />
          </radialGradient>
        </defs>

        {/* Sky background */}
        <rect width="400" height="600" fill="url(#bp-bg)" />

        {/* Clouds */}
        <g opacity="0.82">
          <ellipse cx="68" cy="68" rx="40" ry="19" fill="white" />
          <ellipse cx="96" cy="58" rx="30" ry="18" fill="white" />
          <ellipse cx="44" cy="66" rx="24" ry="14" fill="white" />
        </g>
        <g opacity="0.7">
          <ellipse cx="320" cy="90" rx="46" ry="21" fill="white" />
          <ellipse cx="354" cy="78" rx="32" ry="19" fill="white" />
          <ellipse cx="292" cy="88" rx="28" ry="15" fill="white" />
        </g>

        {/* Balloon 1 – red, left side */}
        <ellipse cx="75" cy="200" rx="40" ry="50" fill="url(#bp-b1)" />
        <ellipse cx="62" cy="183" rx="13" ry="8" fill="white" opacity="0.25" />
        <path d="M75 250 Q74 252 75 254" stroke="#FF4444" strokeWidth="2" fill="none" />
        <path d="M75 254 Q65 310 68 360" stroke="#888" strokeWidth="1.4" fill="none" />

        {/* Balloon 2 – yellow, center */}
        <ellipse cx="200" cy="170" rx="44" ry="55" fill="url(#bp-b2)" />
        <ellipse cx="185" cy="150" rx="14" ry="9" fill="white" opacity="0.25" />
        <path d="M200 225 Q199 227 200 229" stroke="#FFC107" strokeWidth="2" fill="none" />
        <path d="M200 229 Q192 285 196 340" stroke="#888" strokeWidth="1.4" fill="none" />

        {/* Balloon 3 – purple, right side */}
        <ellipse cx="325" cy="195" rx="40" ry="50" fill="url(#bp-b3)" />
        <ellipse cx="312" cy="178" rx="13" ry="8" fill="white" opacity="0.25" />
        <path d="M325 245 Q324 247 325 249" stroke="#9C27B0" strokeWidth="2" fill="none" />
        <path d="M325 249 Q316 300 318 352" stroke="#888" strokeWidth="1.4" fill="none" />

        {/* Balloon 4 – green, far left bottom */}
        <ellipse cx="30" cy="380" rx="30" ry="38" fill="url(#bp-b4)" />
        <ellipse cx="21" cy="366" rx="10" ry="6" fill="white" opacity="0.22" />
        <path d="M30 418 Q24 450 26 475" stroke="#888" strokeWidth="1.4" fill="none" />

        {/* Balloon 5 – orange, far right bottom */}
        <ellipse cx="370" cy="360" rx="30" ry="38" fill="#FF8C42" />
        <ellipse cx="361" cy="346" rx="10" ry="6" fill="white" opacity="0.22" />
        <path d="M370 398 Q364 428 366 452" stroke="#888" strokeWidth="1.4" fill="none" />

        {/* Confetti scattered */}
        {/* Circles */}
        <circle cx="130" cy="40" r="6" fill="#FF4444" opacity="0.9" />
        <circle cx="180" cy="30" r="5" fill="#FFC107" opacity="0.9" />
        <circle cx="235" cy="48" r="6" fill="#26A65B" opacity="0.9" />
        <circle cx="290" cy="35" r="5" fill="#9C27B0" opacity="0.9" />
        <circle cx="145" cy="570" r="6" fill="#FF8C42" opacity="0.9" />
        <circle cx="210" cy="558" r="5" fill="#FF4444" opacity="0.9" />
        <circle cx="270" cy="575" r="6" fill="#FFC107" opacity="0.9" />
        <circle cx="320" cy="562" r="5" fill="#9C27B0" opacity="0.9" />
        {/* Rectangles (streamers) */}
        <rect x="155" y="34" width="12" height="6" fill="#9C27B0" opacity="0.85" transform="rotate(30,161,37)" />
        <rect x="256" y="42" width="12" height="6" fill="#FF4444" opacity="0.85" transform="rotate(-25,262,45)" />
        <rect x="175" y="566" width="12" height="6" fill="#26A65B" opacity="0.85" transform="rotate(40,181,569)" />
        <rect x="245" y="575" width="12" height="6" fill="#FF8C42" opacity="0.85" transform="rotate(-15,251,578)" />
        {/* Stars */}
        <text x="108" y="58" fontSize="18" fill="#FFD700" opacity="0.8">★</text>
        <text x="350" y="58" fontSize="16" fill="#FF8C42" opacity="0.8">★</text>
        <text x="50" y="555" fontSize="16" fill="#FFC107" opacity="0.8">★</text>
        <text x="360" y="548" fontSize="18" fill="#FF4444" opacity="0.8">★</text>
      </svg>
    </Wrap>
  );
}

// ─── Confetti Burst ─ white bg, party crackers + dense confetti ────────────────
function ConfettiBurst() {
  const dots = [
    [42,38,'#FF4444'],[78,22,'#FFC107'],[118,42,'#26A65B'],[158,28,'#9C27B0'],
    [198,44,'#FF8C42'],[240,26,'#FF4444'],[278,44,'#26A65B'],[318,30,'#FFC107'],
    [358,48,'#9C27B0'],[30,82,'#FF8C42'],[72,72,'#FF4444'],[120,88,'#FFC107'],
    [170,78,'#26A65B'],[222,90,'#9C27B0'],[270,76,'#FF8C42'],[310,88,'#FF4444'],
    [358,72,'#FFC107'],[388,90,'#26A65B'],
    [38,520,'#FF4444'],[80,534,'#9C27B0'],[130,520,'#FFC107'],[182,538,'#26A65B'],
    [234,522,'#FF8C42'],[282,534,'#FF4444'],[330,520,'#9C27B0'],[376,536,'#FFC107'],
    [55,560,'#26A65B'],[105,572,'#FF8C42'],[155,558,'#FF4444'],[208,574,'#9C27B0'],
    [258,562,'#FFC107'],[308,574,'#26A65B'],[355,560,'#FF8C42'],[390,572,'#FF4444'],
  ];
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="600" fill="#fffdf9" />

        {/* Party cracker top-left */}
        <g transform="translate(30,30) rotate(40)">
          <rect x="-6" y="-30" width="12" height="40" rx="3" fill="#FF8C42" />
          <rect x="-8" y="8" width="16" height="6" rx="2" fill="#FFC107" />
          {/* Burst lines */}
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <line key={i} x1="0" y1="-32" x2={12*Math.sin(a*Math.PI/180)} y2={-32-12*Math.cos(a*Math.PI/180)}
              stroke={['#FF4444','#FFC107','#26A65B','#9C27B0','#FF8C42','#FF4444','#FFC107','#26A65B'][i]}
              strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>

        {/* Party cracker bottom-right */}
        <g transform="translate(370,570) rotate(-140)">
          <rect x="-6" y="-30" width="12" height="40" rx="3" fill="#9C27B0" />
          <rect x="-8" y="8" width="16" height="6" rx="2" fill="#FF4444" />
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <line key={i} x1="0" y1="-32" x2={12*Math.sin(a*Math.PI/180)} y2={-32-12*Math.cos(a*Math.PI/180)}
              stroke={['#9C27B0','#FF8C42','#FFC107','#FF4444','#26A65B','#9C27B0','#FF8C42','#FFC107'][i]}
              strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>

        {/* Party cracker top-right */}
        <g transform="translate(370,30) rotate(-40)">
          <rect x="-6" y="-30" width="12" height="40" rx="3" fill="#26A65B" />
          <rect x="-8" y="8" width="16" height="6" rx="2" fill="#9C27B0" />
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <line key={i} x1="0" y1="-32" x2={12*Math.sin(a*Math.PI/180)} y2={-32-12*Math.cos(a*Math.PI/180)}
              stroke={['#26A65B','#FF4444','#FFC107','#FF8C42','#9C27B0','#26A65B','#FF4444','#FFC107'][i]}
              strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>

        {/* Dense confetti dots */}
        {dots.map(([x, y, c], i) => (
          i % 3 === 0
            ? <circle key={i} cx={x as number} cy={y as number} r="7" fill={c as string} opacity="0.85" />
            : i % 3 === 1
            ? <rect key={i} x={(x as number)-5} y={(y as number)-3.5} width="10" height="7" rx="1.5"
                fill={c as string} opacity="0.85" transform={`rotate(${i*17},${x},${y})`} />
            : <ellipse key={i} cx={x as number} cy={y as number} rx="7" ry="4.5"
                fill={c as string} opacity="0.85" transform={`rotate(${i*23},${x},${y})`} />
        ))}

        {/* Mid-card dots (lighter, so text is readable) */}
        <circle cx="30"  cy="300" r="7" fill="#FF4444"  opacity="0.5" />
        <circle cx="370" cy="280" r="7" fill="#FFC107"  opacity="0.5" />
        <circle cx="30"  cy="360" r="6" fill="#26A65B"  opacity="0.45" />
        <circle cx="370" cy="380" r="6" fill="#9C27B0"  opacity="0.45" />
      </svg>
    </Wrap>
  );
}

// ─── Simple Thanks ─ white bg, botanical orange + teal flowers at corners ──────
function SimpleThanks() {
  // A single flower: center circle + N petals
  function Flower({ cx, cy, r, petalColor, centerColor, petals = 6 }:
    { cx:number; cy:number; r:number; petalColor:string; centerColor:string; petals?:number }) {
    return (
      <g>
        {Array.from({ length: petals }).map((_, i) => {
          const a = (i / petals) * Math.PI * 2;
          return (
            <ellipse key={i}
              cx={cx + Math.cos(a) * r * 0.65}
              cy={cy + Math.sin(a) * r * 0.65}
              rx={r * 0.52} ry={r * 0.38}
              fill={petalColor}
              transform={`rotate(${(i / petals) * 360},${cx + Math.cos(a) * r * 0.65},${cy + Math.sin(a) * r * 0.65})`}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.38} fill={centerColor} />
      </g>
    );
  }

  function Leaf({ x1, y1, x2, y2, color }:
    { x1:number; y1:number; x2:number; y2:number; color:string }) {
    const mx = (x1+x2)/2, my = (y1+y2)/2;
    const angle = Math.atan2(y2-y1, x2-x1) * 180/Math.PI;
    const len = Math.hypot(x2-x1, y2-y1);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" opacity="0.6" />
        <ellipse cx={mx} cy={my} rx={len*0.42} ry={len*0.18} fill={color} opacity="0.75"
          transform={`rotate(${angle},${mx},${my})`} />
      </g>
    );
  }

  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="600" fill="#ffffff" />

        {/* Botanical arrangement – bottom left */}
        <g opacity="0.88">
          <Leaf x1={20} y1={590} x2={80} y2={530} color="#4caf7d" />
          <Leaf x1={10} y1={580} x2={55} y2={515} color="#5cba8a" />
          <Leaf x1={30} y1={595} x2={100} y2={550} color="#3d9e6a" />
          <Leaf x1={60} y1={590} x2={40} y2={530} color="#4caf7d" />
          <Flower cx={82} cy={528} r={22} petalColor="#FF8C42" centerColor="#FFD700" />
          <Flower cx={46} cy={550} r={16} petalColor="#FFC107" centerColor="#FF8C42" petals={5} />
          <Flower cx={112} cy={555} r={14} petalColor="#FF8C42" centerColor="#FFD700" petals={5} />
        </g>

        {/* Botanical arrangement – top right */}
        <g opacity="0.88">
          <Leaf x1={380} y1={10} x2={320} y2={70} color="#4caf7d" />
          <Leaf x1={390} y1={20} x2={345} y2={85} color="#5cba8a" />
          <Leaf x1={370} y1={5} x2={300} y2={50} color="#3d9e6a" />
          <Leaf x1={340} y1={10} x2={360} y2={70} color="#4caf7d" />
          <Flower cx={318} cy={72} r={22} petalColor="#FF8C42" centerColor="#FFD700" />
          <Flower cx={354} cy={88} r={16} petalColor="#FFC107" centerColor="#FF8C42" petals={5} />
          <Flower cx={288} cy={52} r={14} petalColor="#FF8C42" centerColor="#FFD700" petals={5} />
        </g>

        {/* Small accent flowers scattered */}
        <Flower cx={18} cy={80} r={13} petalColor="#26bfad" centerColor="#FFF" petals={5} />
        <Flower cx={382} cy={520} r={13} petalColor="#26bfad" centerColor="#FFF" petals={5} />
        <Leaf x1={5} y1={100} x2={35} y2={140} color="#4caf7d" />
        <Leaf x1={365} y1={500} x2={395} y2={460} color="#4caf7d" />

        {/* Tiny dots accent */}
        <circle cx="200" cy="14" r="4" fill="#FF8C42" opacity="0.6" />
        <circle cx="185" cy="14" r="3" fill="#FFC107" opacity="0.5" />
        <circle cx="215" cy="14" r="3" fill="#26bfad" opacity="0.5" />
        <circle cx="200" cy="586" r="4" fill="#FF8C42" opacity="0.6" />
      </svg>
    </Wrap>
  );
}

// ─── Diploma Scroll ─ cream, actual scroll + mortarboard cap ──────────────────
function DiplomaScroll() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ds-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f4ea" />
            <stop offset="100%" stopColor="#ede8d8" />
          </linearGradient>
          <linearGradient id="ds-scroll" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf8ef" />
            <stop offset="100%" stopColor="#f0e8c8" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#ds-bg)" />

        {/* Double border frame */}
        <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#2e5090" strokeWidth="3" opacity="0.45" />
        <rect x="20" y="20" width="360" height="560" rx="3" fill="none" stroke="#2e5090" strokeWidth="1" opacity="0.3" />

        {/* Corner ornaments */}
        {[[28,28],[372,28],[28,572],[372,572]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill="none" stroke="#2e5090" strokeWidth="2" opacity="0.5" />
            <circle cx={cx} cy={cy} r="3.5" fill="#FFD700" opacity="0.7" />
          </g>
        ))}

        {/* Graduation cap (mortarboard) in upper third */}
        <g transform="translate(200, 160)" opacity="0.85">
          {/* Board (diamond shape) */}
          <polygon points="0,-30 50,0 0,30 -50,0" fill="#2e5090" />
          {/* Top button */}
          <circle cx="0" cy="-30" r="6" fill="#2e5090" />
          <circle cx="0" cy="-30" r="3" fill="#FFD700" />
          {/* Cylinder/crown */}
          <rect x="-18" y="-28" width="36" height="24" rx="4" fill="#1a3a6e" />
          {/* Board highlight */}
          <polygon points="0,-30 50,0 0,30 -50,0" fill="none" stroke="#4a7ad0" strokeWidth="1.5" opacity="0.4" />
          {/* Tassel */}
          <line x1="40" y1="-8" x2="56" y2="20" stroke="#FFD700" strokeWidth="2.5" />
          <circle cx="57" cy="22" r="5" fill="#FFD700" />
          {/* Tassel end threads */}
          <line x1="55" y1="26" x2="52" y2="38" stroke="#FFD700" strokeWidth="1.5" />
          <line x1="57" y1="26" x2="57" y2="40" stroke="#FFD700" strokeWidth="1.5" />
          <line x1="59" y1="26" x2="62" y2="38" stroke="#FFD700" strokeWidth="1.5" />
        </g>

        {/* Diploma scroll in lower third */}
        <g transform="translate(200, 470)" opacity="0.85">
          {/* Rolled scroll - main body */}
          <rect x="-75" y="-40" width="150" height="80" rx="4" fill="url(#ds-scroll)" stroke="#c8b880" strokeWidth="2" />
          {/* Left roll end */}
          <ellipse cx="-75" cy="0" rx="10" ry="40" fill="#e8d898" stroke="#c8b880" strokeWidth="1.5" />
          <ellipse cx="-75" cy="0" rx="5" ry="36" fill="#f5eecc" />
          {/* Right roll end */}
          <ellipse cx="75" cy="0" rx="10" ry="40" fill="#e8d898" stroke="#c8b880" strokeWidth="1.5" />
          <ellipse cx="75" cy="0" rx="5" ry="36" fill="#f5eecc" />
          {/* Text lines on scroll */}
          <line x1="-50" y1="-15" x2="50" y2="-15" stroke="#2e5090" strokeWidth="1.5" opacity="0.4" />
          <line x1="-40" y1="-5"  x2="40"  y2="-5"  stroke="#2e5090" strokeWidth="1" opacity="0.3" />
          <line x1="-50" y1="5"   x2="50"  y2="5"   stroke="#2e5090" strokeWidth="1" opacity="0.3" />
          <line x1="-40" y1="15"  x2="40"  y2="15"  stroke="#2e5090" strokeWidth="1" opacity="0.3" />
          {/* Red ribbon */}
          <rect x="-8" y="-44" width="16" height="88" fill="#c0392b" opacity="0.75" rx="2" />
          <circle cx="0" cy="0" r="12" fill="#c0392b" opacity="0.85" />
          <circle cx="0" cy="0" r="7" fill="#e74c3c" opacity="0.9" />
          <text x="0" y="4" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">★</text>
        </g>

        {/* Gold stars */}
        <text x="60"  y="68"  textAnchor="middle" fontSize="22" fill="#FFD700" opacity="0.7">★</text>
        <text x="340" y="68"  textAnchor="middle" fontSize="22" fill="#FFD700" opacity="0.7">★</text>
        <text x="200" y="42"  textAnchor="middle" fontSize="16" fill="#FFD700" opacity="0.6">✦</text>
        <text x="60"  y="548" textAnchor="middle" fontSize="18" fill="#FFD700" opacity="0.6">★</text>
        <text x="340" y="548" textAnchor="middle" fontSize="18" fill="#FFD700" opacity="0.6">★</text>

        {/* Top decorative line */}
        <path d="M80 46 Q200 36 320 46" stroke="#2e5090" strokeWidth="1.5" fill="none" opacity="0.35" />
        <path d="M80 548 Q200 558 320 548" stroke="#2e5090" strokeWidth="1.5" fill="none" opacity="0.35" />
      </svg>
    </Wrap>
  );
}

// ─── Achievement ─ cream, prominent gold trophy, starbursts ──────────────────
function Achievement() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ach-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffde7" />
            <stop offset="100%" stopColor="#fff8c4" />
          </linearGradient>
          <radialGradient id="ach-glow" cx="50%" cy="80%" r="40%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ach-trophy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE050" />
            <stop offset="100%" stopColor="#DAA520" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#ach-bg)" />
        <rect width="400" height="600" fill="url(#ach-glow)" />

        {/* Starburst rays from trophy center */}
        {Array.from({length: 16}).map((_,i) => {
          const a = (i/16)*Math.PI*2;
          return <line key={i} x1="200" y1="440" x2={200+200*Math.cos(a)} y2={440+200*Math.sin(a)}
            stroke="#FFD700" strokeWidth="1.5" opacity="0.18" />;
        })}

        {/* TROPHY */}
        <g transform="translate(200, 440)" opacity="0.92">
          {/* Base plate */}
          <rect x="-50" y="58" width="100" height="12" rx="4" fill="url(#ach-trophy)" />
          {/* Stem */}
          <rect x="-12" y="30" width="24" height="30" rx="3" fill="url(#ach-trophy)" />
          {/* Stem accent */}
          <rect x="-14" y="46" width="28" height="8" rx="2" fill="#DAA520" />
          {/* Cup body */}
          <path d="M-55,-50 L-48,28 L48,28 L55,-50 Z" fill="url(#ach-trophy)" rx="4" />
          {/* Cup opening ellipse */}
          <ellipse cx="0" cy="-50" rx="55" ry="14" fill="#FFE88A" />
          {/* Cup inner shadow */}
          <ellipse cx="0" cy="-50" rx="44" ry="10" fill="#DAA520" opacity="0.4" />
          {/* Left handle */}
          <path d="M-55,-40 Q-85,-40 -85,-15 Q-85,10 -48,15" fill="none" stroke="url(#ach-trophy)" strokeWidth="14" strokeLinecap="round" />
          {/* Right handle */}
          <path d="M55,-40 Q85,-40 85,-15 Q85,10 48,15" fill="none" stroke="url(#ach-trophy)" strokeWidth="14" strokeLinecap="round" />
          {/* Star on cup */}
          <text x="0" y="0" textAnchor="middle" fontSize="28" fill="#FFD700" opacity="0.6">★</text>
          {/* Shine */}
          <ellipse cx="-22" cy="-30" rx="8" ry="18" fill="white" opacity="0.15" transform="rotate(-15,-22,-30)" />
        </g>

        {/* Gold stars scattered */}
        <text x="55"  y="75"  textAnchor="middle" fontSize="28" fill="#DAA520" opacity="0.65">★</text>
        <text x="345" y="75"  textAnchor="middle" fontSize="28" fill="#DAA520" opacity="0.65">★</text>
        <text x="35"  y="300" textAnchor="middle" fontSize="22" fill="#DAA520" opacity="0.5">★</text>
        <text x="365" y="300" textAnchor="middle" fontSize="22" fill="#DAA520" opacity="0.5">★</text>
        <text x="200" y="42"  textAnchor="middle" fontSize="20" fill="#DAA520" opacity="0.6">✦</text>

        {/* Sparkle crosses */}
        {[[100,120],[300,120],[70,500],[330,500]].map(([x,y],i) => (
          <g key={i} opacity="0.55">
            <line x1={x-10} y1={y} x2={x+10} y2={y} stroke="#DAA520" strokeWidth="1.5" />
            <line x1={x} y1={y-10} x2={x} y2={y+10} stroke="#DAA520" strokeWidth="1.5" />
            <line x1={x-7} y1={y-7} x2={x+7} y2={y+7} stroke="#DAA520" strokeWidth="0.8" />
            <line x1={x+7} y1={y-7} x2={x-7} y2={y+7} stroke="#DAA520" strokeWidth="0.8" />
            <circle cx={x} cy={y} r="2.5" fill="#DAA520" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}

// ─── Rose Petals ─ blush pink, watercolor floral border frame ─────────────────
function RosePetals() {
  // Draw a rose: layered petals
  function Rose({ cx, cy, r, color, darkColor }:
    { cx:number; cy:number; r:number; color:string; darkColor:string }) {
    return (
      <g>
        {/* Outer petals */}
        {Array.from({length:6}).map((_,i) => {
          const a = (i/6)*Math.PI*2;
          return <ellipse key={i}
            cx={cx + Math.cos(a)*r*0.62}
            cy={cy + Math.sin(a)*r*0.62}
            rx={r*0.55} ry={r*0.38}
            fill={color}
            transform={`rotate(${(i/6)*360},${cx+Math.cos(a)*r*0.62},${cy+Math.sin(a)*r*0.62})`}
            opacity="0.85"
          />;
        })}
        {/* Inner petals */}
        {Array.from({length:5}).map((_,i) => {
          const a = (i/5)*Math.PI*2 + 0.3;
          return <ellipse key={i}
            cx={cx + Math.cos(a)*r*0.3}
            cy={cy + Math.sin(a)*r*0.3}
            rx={r*0.32} ry={r*0.22}
            fill={darkColor}
            opacity="0.9"
          />;
        })}
        {/* Center */}
        <circle cx={cx} cy={cy} r={r*0.22} fill={darkColor} />
      </g>
    );
  }

  function SmallFlower({ cx, cy, r, color }:
    { cx:number; cy:number; r:number; color:string }) {
    return (
      <g>
        {Array.from({length:5}).map((_,i) => {
          const a = (i/5)*Math.PI*2;
          return <circle key={i}
            cx={cx + Math.cos(a)*r*0.7}
            cy={cy + Math.sin(a)*r*0.7}
            r={r*0.45} fill={color} opacity="0.85"
          />;
        })}
        <circle cx={cx} cy={cy} r={r*0.3} fill="#FFD700" />
      </g>
    );
  }

  function Leaf({ cx, cy, rx, ry, rot, color }:
    { cx:number; cy:number; rx:number; ry:number; rot:number; color:string }) {
    return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} opacity="0.8"
      transform={`rotate(${rot},${cx},${cy})`} />;
  }

  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="rp-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff5f8" />
            <stop offset="100%" stopColor="#ffe8f0" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#rp-bg)" />

        {/* TOP LEFT corner arrangement */}
        <g>
          {/* Leaves */}
          <Leaf cx={30} cy={80}  rx={28} ry={12} rot={-40} color="#5cba80" />
          <Leaf cx={55} cy={45}  rx={26} ry={11} rot={-65} color="#4caf70" />
          <Leaf cx={75} cy={95}  rx={24} ry={10} rot={-20} color="#68c890" />
          <Leaf cx={15} cy={115} rx={22} ry={9}  rot={-55} color="#5cba80" />
          {/* Roses */}
          <Rose cx={50}  cy={60} r={28} color="#e05575" darkColor="#c0394a" />
          <Rose cx={88}  cy={42} r={22} color="#f07890" darkColor="#d45568" />
          <Rose cx={22}  cy={30} r={18} color="#e8688a" darkColor="#c84060" />
        </g>

        {/* TOP RIGHT corner arrangement */}
        <g>
          <Leaf cx={370} cy={80}  rx={28} ry={12} rot={40} color="#5cba80" />
          <Leaf cx={345} cy={45}  rx={26} ry={11} rot={65} color="#4caf70" />
          <Leaf cx={325} cy={95}  rx={24} ry={10} rot={20} color="#68c890" />
          <Leaf cx={385} cy={115} rx={22} ry={9}  rot={55} color="#5cba80" />
          <Rose cx={350} cy={60} r={28} color="#e05575" darkColor="#c0394a" />
          <Rose cx={312} cy={42} r={22} color="#f07890" darkColor="#d45568" />
          <Rose cx={378} cy={30} r={18} color="#e8688a" darkColor="#c84060" />
        </g>

        {/* BOTTOM LEFT corner arrangement */}
        <g>
          <Leaf cx={30}  cy={520} rx={28} ry={12} rot={40}  color="#5cba80" />
          <Leaf cx={55}  cy={555} rx={26} ry={11} rot={65}  color="#4caf70" />
          <Leaf cx={75}  cy={505} rx={24} ry={10} rot={20}  color="#68c890" />
          <Leaf cx={15}  cy={485} rx={22} ry={9}  rot={55}  color="#5cba80" />
          <Rose cx={50}  cy={540} r={28} color="#c84060" darkColor="#a03048" />
          <Rose cx={88}  cy={558} r={22} color="#d45870" darkColor="#b04058" />
          <Rose cx={22}  cy={570} r={18} color="#e06880" darkColor="#c05060" />
        </g>

        {/* BOTTOM RIGHT corner arrangement */}
        <g>
          <Leaf cx={370} cy={520} rx={28} ry={12} rot={-40} color="#5cba80" />
          <Leaf cx={345} cy={555} rx={26} ry={11} rot={-65} color="#4caf70" />
          <Leaf cx={325} cy={505} rx={24} ry={10} rot={-20} color="#68c890" />
          <Leaf cx={385} cy={485} rx={22} ry={9}  rot={-55} color="#5cba80" />
          <Rose cx={350} cy={540} r={28} color="#c84060" darkColor="#a03048" />
          <Rose cx={312} cy={558} r={22} color="#d45870" darkColor="#b04058" />
          <Rose cx={378} cy={570} r={18} color="#e06880" darkColor="#c05060" />
        </g>

        {/* Blue/purple accent small flowers */}
        <SmallFlower cx={110} cy={55}  r={14} color="#7b9fff" />
        <SmallFlower cx={290} cy={55}  r={14} color="#7b9fff" />
        <SmallFlower cx={15}  cy={200} r={11} color="#b085f5" />
        <SmallFlower cx={385} cy={200} r={11} color="#b085f5" />
        <SmallFlower cx={15}  cy={400} r={11} color="#b085f5" />
        <SmallFlower cx={385} cy={400} r={11} color="#b085f5" />
        <SmallFlower cx={110} cy={545} r={14} color="#7b9fff" />
        <SmallFlower cx={290} cy={545} r={14} color="#7b9fff" />

        {/* Connecting stem lines top */}
        <path d="M88,42 Q200,20 312,42" stroke="#5cba80" strokeWidth="2" fill="none" opacity="0.5" />
        {/* Connecting stem lines bottom */}
        <path d="M88,558 Q200,580 312,558" stroke="#5cba80" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Side vines */}
        <path d="M15,115 Q8,300 15,485" stroke="#5cba80" strokeWidth="1.5" fill="none" opacity="0.35" />
        <path d="M385,115 Q392,300 385,485" stroke="#5cba80" strokeWidth="1.5" fill="none" opacity="0.35" />
      </svg>
    </Wrap>
  );
}

// ─── Cake Celebration ─ dark night sky, birthday cake + sparkles ──────────────
function CakeCelebration() {
  const confetti = [
    [40,30,'#FF6B6B',20],[90,50,'#FFD93D',-15],[140,25,'#7EC8E3',40],
    [190,45,'#C9B1FF',10],[240,28,'#FFA040',-30],[290,50,'#FF6B6B',25],
    [340,30,'#FFD93D',-10],[380,48,'#7EC8E3',35],
    [30,555,'#C9B1FF',20],[80,570,'#FF6B6B',-25],[140,558,'#FFD93D',15],
    [200,575,'#7EC8E3',-10],[260,562,'#FFA040',40],[320,572,'#FF6B6B',-20],
    [370,555,'#FFD93D',25],
  ];
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ck-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12101e" />
            <stop offset="100%" stopColor="#251b50" />
          </linearGradient>
          <radialGradient id="ck-glow" cx="50%" cy="80%" r="45%">
            <stop offset="0%" stopColor="#7a50d8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7a50d8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="600" fill="url(#ck-bg)" />
        <rect width="400" height="600" fill="url(#ck-glow)" />

        {/* Confetti rain */}
        {confetti.map(([x, y, color, rot], i) => (
          i % 3 === 0
            ? <circle key={i} cx={x as number} cy={y as number} r="5.5" fill={color as string} opacity="0.85" />
            : i % 3 === 1
            ? <rect key={i} x={(x as number)-4.5} y={(y as number)-3} width="9" height="6" rx="1"
                fill={color as string} opacity="0.85" transform={`rotate(${rot},${x},${y})`} />
            : <polygon key={i}
                points={`${x},${(y as number)-5.5} ${(x as number)+4.5},${(y as number)+3.5} ${(x as number)-4.5},${(y as number)+3.5}`}
                fill={color as string} opacity="0.85" transform={`rotate(${rot},${x},${y})`} />
        ))}

        {/* ── Birthday cake ── */}
        <g transform="translate(200, 490)" opacity="0.95">
          {/* Plate */}
          <ellipse cx="0" cy="58" rx="85" ry="12" fill="#2a2040" />
          <ellipse cx="0" cy="56" rx="82" ry="10" fill="#3d3060" />

          {/* Bottom tier */}
          <rect x="-70" y="10" width="140" height="48" rx="4" fill="#f472b6" />
          <rect x="-70" y="10" width="140" height="12" rx="4" fill="#fb7ac2" />
          {/* Frosting drips bottom tier */}
          {[-50,-30,-10,10,30,50].map((dx,i) => (
            <ellipse key={i} cx={dx} cy="10" rx="8" ry="6" fill="white" opacity="0.9" />
          ))}
          {/* Decoration dots on bottom tier */}
          {[-55,-35,-15,5,25,45,65].map((dx,i) => (
            <circle key={i} cx={dx} cy="34" r="4" fill={['#FFD700','#a78bfa','#34d399','#f87171','#60a5fa','#fbbf24','#f472b6'][i]} />
          ))}

          {/* Middle tier */}
          <rect x="-50" y="-24" width="100" height="36" rx="4" fill="#c084fc" />
          <rect x="-50" y="-24" width="100" height="10" rx="4" fill="#d8a4ff" />
          {/* Frosting drips middle tier */}
          {[-38,-18,2,22,42].map((dx,i) => (
            <ellipse key={i} cx={dx} cy="-24" rx="7" ry="5" fill="white" opacity="0.9" />
          ))}

          {/* Top tier */}
          <rect x="-32" y="-52" width="64" height="30" rx="4" fill="#fb923c" />
          <rect x="-32" y="-52" width="64" height="9" rx="4" fill="#fba560" />
          {/* Frosting drips top tier */}
          {[-22,-4,14].map((dx,i) => (
            <ellipse key={i} cx={dx} cy="-52" rx="6" ry="4.5" fill="white" opacity="0.9" />
          ))}

          {/* Candles */}
          {[-22,-8,8,22].map((cx, i) => (
            <g key={i}>
              <rect x={cx-4} y="-80" width="8" height="28" rx="2"
                fill={['#FFD700','#f472b6','#60a5fa','#34d399'][i]} />
              {/* Flame outer */}
              <ellipse cx={cx} cy="-84" rx="5" ry="8" fill="#FF8C00" opacity="0.9" />
              {/* Flame inner */}
              <ellipse cx={cx} cy="-85" rx="2.5" ry="5" fill="#FFE040" />
              {/* Glow */}
              <circle cx={cx} cy="-84" r="10" fill="#FF8C00" opacity="0.12" />
            </g>
          ))}
        </g>

        {/* Gold sparkles */}
        {[[50,90],[350,90],[25,290],[375,290],[110,450],[290,450],[200,28]].map(([x,y],i) => (
          <g key={i} opacity="0.75">
            <line x1={x-8} y1={y} x2={x+8} y2={y} stroke="#FFD700" strokeWidth="1.5" />
            <line x1={x} y1={y-8} x2={x} y2={y+8} stroke="#FFD700" strokeWidth="1.5" />
            <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke="#FFD700" strokeWidth="0.9" />
            <line x1={x+5} y1={y-5} x2={x-5} y2={y+5} stroke="#FFD700" strokeWidth="0.9" />
            <circle cx={x} cy={y} r="2.5" fill="#FFD700" />
          </g>
        ))}

        {/* Tiny stars */}
        {[[80,155],[160,180],[240,170],[320,155],[70,430],[330,420]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.45" />
        ))}
      </svg>
    </Wrap>
  );
}

// ─── Heart Float ─ blush pink, prominent hearts + champagne glasses ────────────
function HeartFloat() {
  function Heart({ cx, cy, size, color, opacity = 1 }:
    { cx:number; cy:number; size:number; color:string; opacity?:number }) {
    const s = size / 20;
    return (
      <path
        transform={`translate(${cx},${cy}) scale(${s})`}
        d="M0,-10 C-5,-18 -18,-18 -18,-8 C-18,2 0,16 0,16 C0,16 18,2 18,-8 C18,-18 5,-18 0,-10 Z"
        fill={color}
        opacity={opacity}
      />
    );
  }

  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hf-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff0f6" />
            <stop offset="100%" stopColor="#ffd8ea" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#hf-bg)" />

        {/* Large hearts at corners/edges */}
        <Heart cx={55}  cy={90}  size={52} color="#e8608a" opacity={0.65} />
        <Heart cx={345} cy={110} size={48} color="#d94070" opacity={0.6}  />
        <Heart cx={35}  cy={300} size={40} color="#f07898" opacity={0.5}  />
        <Heart cx={365} cy={280} size={44} color="#e05578" opacity={0.55} />
        <Heart cx={65}  cy={480} size={46} color="#c83060" opacity={0.55} />
        <Heart cx={335} cy={460} size={42} color="#d84878" opacity={0.5}  />

        {/* Medium hearts */}
        <Heart cx={165} cy={50}  size={34} color="#f088a8" opacity={0.6}  />
        <Heart cx={235} cy={55}  size={30} color="#e06888" opacity={0.55} />
        <Heart cx={110} cy={180} size={28} color="#f09ab8" opacity={0.5}  />
        <Heart cx={290} cy={190} size={32} color="#e07898" opacity={0.55} />
        <Heart cx={155} cy={545} size={34} color="#e87898" opacity={0.6}  />
        <Heart cx={245} cy={550} size={30} color="#d86080" opacity={0.55} />

        {/* Small hearts */}
        <Heart cx={200} cy={25}  size={20} color="#ff85b0" opacity={0.7} />
        <Heart cx={14}  cy={165} size={18} color="#f090b0" opacity={0.6} />
        <Heart cx={386} cy={165} size={18} color="#f090b0" opacity={0.6} />
        <Heart cx={14}  cy={430} size={18} color="#e07898" opacity={0.55}/>
        <Heart cx={386} cy={430} size={18} color="#e07898" opacity={0.55}/>
        <Heart cx={200} cy={575} size={20} color="#e87898" opacity={0.65}/>

        {/* Champagne glasses – bottom sides */}
        <g stroke="#C84B6E" strokeWidth="2.2" fill="none" opacity="0.55">
          {/* Left glass */}
          <path d="M65,520 Q48,490 48,465 L82,465 Q82,490 65,520 Z" />
          <line x1="65" y1="520" x2="65" y2="545" />
          <line x1="50" y1="545" x2="80" y2="545" />
          {/* Bubbles */}
          <circle cx="60" cy="478" r="2.5" /><circle cx="67" cy="492" r="2" />
          <circle cx="63" cy="506" r="1.5" /><circle cx="70" cy="483" r="1.5" />
        </g>
        <g stroke="#C84B6E" strokeWidth="2.2" fill="none" opacity="0.55">
          {/* Right glass */}
          <path d="M335,520 Q318,490 318,465 L352,465 Q352,490 335,520 Z" />
          <line x1="335" y1="520" x2="335" y2="545" />
          <line x1="320" y1="545" x2="350" y2="545" />
          <circle cx="330" cy="478" r="2.5" /><circle cx="337" cy="492" r="2" />
          <circle cx="333" cy="506" r="1.5" /><circle cx="340" cy="483" r="1.5" />
        </g>

        {/* Sparkle dots */}
        {[[200,15],[18,250],[382,250],[200,585]].map(([x,y],i) => (
          <g key={i} opacity="0.65">
            <line x1={x-7} y1={y} x2={x+7} y2={y} stroke="#C84B6E" strokeWidth="1.4" />
            <line x1={x} y1={y-7} x2={x} y2={y+7} stroke="#C84B6E" strokeWidth="1.4" />
            <circle cx={x} cy={y} r="2" fill="#C84B6E" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}

// ─── Cap Toss ─ deep navy, prominent graduation caps + gold stars ──────────────
function CapToss() {
  function GradCap({ x, y, size, rot }: { x:number; y:number; size:number; rot:number }) {
    const s = size / 28;
    return (
      <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity="0.75">
        {/* Cap board (diamond) */}
        <polygon points="0,-24 32,0 0,24 -32,0" fill="#FFD700" />
        <polygon points="0,-24 32,0 0,24 -32,0" fill="none" stroke="#DAA520" strokeWidth="2" />
        {/* Top highlight */}
        <polygon points="0,-24 16,-12 0,0 -16,-12" fill="#FFE860" opacity="0.4" />
        {/* Crown cylinder */}
        <rect x="-10" y="-22" width="20" height="20" rx="3" fill="#c49010" />
        <rect x="-10" y="-22" width="20" height="7"  rx="3" fill="#DAA520" />
        {/* Tassel rope */}
        <line x1="22" y1="-8" x2="36" y2="18" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
        {/* Tassel ball */}
        <circle cx="37" cy="21" r="7" fill="#FFD700" />
        <circle cx="37" cy="21" r="4" fill="#DAA520" />
        {/* Tassel fringe */}
        {[-3,0,3,6,9].map((dx,i) => (
          <line key={i} x1={34+dx} y1="27" x2={33+dx} y2="42" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </g>
    );
  }

  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ct-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#08082e" />
            <stop offset="100%" stopColor="#141858" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#ct-bg)" />

        {/* Stars field */}
        {[[80,160],[150,200],[250,180],[320,155],[50,450],[350,450],
          [180,400],[220,420],[100,520],[300,510],[40,260],[360,270]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={1 + (i%3)*0.5} fill="white" opacity={0.2 + (i%4)*0.1} />
        ))}

        {/* Graduation caps scattered */}
        <GradCap x={65}  y={110} size={50} rot={-18} />
        <GradCap x={335} y={130} size={46} rot={22}  />
        <GradCap x={38}  y={330} size={40} rot={-28} />
        <GradCap x={362} y={310} size={44} rot={16}  />
        <GradCap x={140} y={65}  size={34} rot={10}  />
        <GradCap x={265} y={70}  size={32} rot={-12} />
        <GradCap x={80}  y={490} size={36} rot={20}  />
        <GradCap x={322} y={475} size={34} rot={-16} />

        {/* Confetti */}
        {[[50,38,'#FFD700'],[100,28,'#B0C4FF'],[160,48,'#FFD700'],[220,32,'#B0C4FF'],
          [280,50,'#FFD700'],[340,36,'#B0C4FF'],[390,52,'#FFD700'],
          [30,555,'#FFD700'],[80,570,'#B0C4FF'],[150,558,'#FFD700'],[220,574,'#B0C4FF'],
          [290,560,'#FFD700'],[350,574,'#B0C4FF'],[390,552,'#FFD700'],
        ].map(([x,y,c],i) => (
          i % 2 === 0
            ? <circle key={i} cx={x as number} cy={y as number} r="5" fill={c as string} opacity="0.8" />
            : <rect key={i} x={(x as number)-4} y={(y as number)-2.5} width="8" height="5" rx="1"
                fill={c as string} opacity="0.8" transform={`rotate(${i*22},${x},${y})`} />
        ))}

        {/* Gold sparkles */}
        {[[200,28],[22,200],[378,200],[120,490],[280,490],[200,578]].map(([x,y],i) => (
          <g key={i} opacity="0.8">
            <line x1={x-9} y1={y} x2={x+9} y2={y} stroke="#FFD700" strokeWidth="1.6" />
            <line x1={x} y1={y-9} x2={x} y2={y+9} stroke="#FFD700" strokeWidth="1.6" />
            <line x1={x-6} y1={y-6} x2={x+6} y2={y+6} stroke="#FFD700" strokeWidth="0.9" />
            <line x1={x+6} y1={y-6} x2={x-6} y2={y+6} stroke="#FFD700" strokeWidth="0.9" />
            <circle cx={x} cy={y} r="3" fill="#FFD700" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}
