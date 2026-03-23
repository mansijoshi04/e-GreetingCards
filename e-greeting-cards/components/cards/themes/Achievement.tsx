import Wrap from './Wrap';

const sparklePositions: [number, number][] = [[100, 120], [300, 120], [70, 500], [330, 500]];
const starburstCount = Array.from({ length: 16 });

export default function Achievement() {
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
        {starburstCount.map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <line key={i} x1="200" y1="440" x2={200 + 200 * Math.cos(a)} y2={440 + 200 * Math.sin(a)}
            stroke="#FFD700" strokeWidth="1.5" opacity="0.18" />;
        })}
        <g transform="translate(200, 440)" opacity="0.92">
          <rect x="-50" y="58" width="100" height="12" rx="4" fill="url(#ach-trophy)" />
          <rect x="-12" y="30" width="24" height="30" rx="3" fill="url(#ach-trophy)" />
          <rect x="-14" y="46" width="28" height="8" rx="2" fill="#DAA520" />
          <path d="M-55,-50 L-48,28 L48,28 L55,-50 Z" fill="url(#ach-trophy)" />
          <ellipse cx="0" cy="-50" rx="55" ry="14" fill="#FFE88A" />
          <ellipse cx="0" cy="-50" rx="44" ry="10" fill="#DAA520" opacity="0.4" />
          <path d="M-55,-40 Q-85,-40 -85,-15 Q-85,10 -48,15" fill="none" stroke="url(#ach-trophy)" strokeWidth="14" strokeLinecap="round" />
          <path d="M55,-40 Q85,-40 85,-15 Q85,10 48,15" fill="none" stroke="url(#ach-trophy)" strokeWidth="14" strokeLinecap="round" />
          <text x="0" y="0" textAnchor="middle" fontSize="28" fill="#FFD700" opacity="0.6">★</text>
          <ellipse cx="-22" cy="-30" rx="8" ry="18" fill="white" opacity="0.15" transform="rotate(-15,-22,-30)" />
        </g>
        <text x="55"  y="75"  textAnchor="middle" fontSize="28" fill="#DAA520" opacity="0.65">★</text>
        <text x="345" y="75"  textAnchor="middle" fontSize="28" fill="#DAA520" opacity="0.65">★</text>
        <text x="35"  y="300" textAnchor="middle" fontSize="22" fill="#DAA520" opacity="0.5">★</text>
        <text x="365" y="300" textAnchor="middle" fontSize="22" fill="#DAA520" opacity="0.5">★</text>
        <text x="200" y="42"  textAnchor="middle" fontSize="20" fill="#DAA520" opacity="0.6">✦</text>
        {sparklePositions.map(([x, y], i) => (
          <g key={i} opacity="0.55">
            <line x1={x - 10} y1={y} x2={x + 10} y2={y} stroke="#DAA520" strokeWidth="1.5" />
            <line x1={x} y1={y - 10} x2={x} y2={y + 10} stroke="#DAA520" strokeWidth="1.5" />
            <line x1={x - 7} y1={y - 7} x2={x + 7} y2={y + 7} stroke="#DAA520" strokeWidth="0.8" />
            <line x1={x + 7} y1={y - 7} x2={x - 7} y2={y + 7} stroke="#DAA520" strokeWidth="0.8" />
            <circle cx={x} cy={y} r="2.5" fill="#DAA520" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}
