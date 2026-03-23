import Wrap from './Wrap';

function Heart({ cx, cy, size, color, opacity = 1 }:
  { cx: number; cy: number; size: number; color: string; opacity?: number }) {
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

const sparklePositions: [number, number][] = [[200, 15], [18, 250], [382, 250], [200, 585]];

export default function HeartFloat() {
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
        <Heart cx={55}  cy={90}  size={52} color="#e8608a" opacity={0.65} />
        <Heart cx={345} cy={110} size={48} color="#d94070" opacity={0.6}  />
        <Heart cx={35}  cy={300} size={40} color="#f07898" opacity={0.5}  />
        <Heart cx={365} cy={280} size={44} color="#e05578" opacity={0.55} />
        <Heart cx={65}  cy={480} size={46} color="#c83060" opacity={0.55} />
        <Heart cx={335} cy={460} size={42} color="#d84878" opacity={0.5}  />
        <Heart cx={165} cy={50}  size={34} color="#f088a8" opacity={0.6}  />
        <Heart cx={235} cy={55}  size={30} color="#e06888" opacity={0.55} />
        <Heart cx={110} cy={180} size={28} color="#f09ab8" opacity={0.5}  />
        <Heart cx={290} cy={190} size={32} color="#e07898" opacity={0.55} />
        <Heart cx={155} cy={545} size={34} color="#e87898" opacity={0.6}  />
        <Heart cx={245} cy={550} size={30} color="#d86080" opacity={0.55} />
        <Heart cx={200} cy={25}  size={20} color="#ff85b0" opacity={0.7} />
        <Heart cx={14}  cy={165} size={18} color="#f090b0" opacity={0.6} />
        <Heart cx={386} cy={165} size={18} color="#f090b0" opacity={0.6} />
        <Heart cx={14}  cy={430} size={18} color="#e07898" opacity={0.55} />
        <Heart cx={386} cy={430} size={18} color="#e07898" opacity={0.55} />
        <Heart cx={200} cy={575} size={20} color="#e87898" opacity={0.65} />
        <g stroke="#C84B6E" strokeWidth="2.2" fill="none" opacity="0.55">
          <path d="M65,520 Q48,490 48,465 L82,465 Q82,490 65,520 Z" />
          <line x1="65" y1="520" x2="65" y2="545" />
          <line x1="50" y1="545" x2="80" y2="545" />
          <circle cx="60" cy="478" r="2.5" /><circle cx="67" cy="492" r="2" />
          <circle cx="63" cy="506" r="1.5" /><circle cx="70" cy="483" r="1.5" />
        </g>
        <g stroke="#C84B6E" strokeWidth="2.2" fill="none" opacity="0.55">
          <path d="M335,520 Q318,490 318,465 L352,465 Q352,490 335,520 Z" />
          <line x1="335" y1="520" x2="335" y2="545" />
          <line x1="320" y1="545" x2="350" y2="545" />
          <circle cx="330" cy="478" r="2.5" /><circle cx="337" cy="492" r="2" />
          <circle cx="333" cy="506" r="1.5" /><circle cx="340" cy="483" r="1.5" />
        </g>
        {sparklePositions.map(([x, y], i) => (
          <g key={i} opacity="0.65">
            <line x1={x - 7} y1={y} x2={x + 7} y2={y} stroke="#C84B6E" strokeWidth="1.4" />
            <line x1={x} y1={y - 7} x2={x} y2={y + 7} stroke="#C84B6E" strokeWidth="1.4" />
            <circle cx={x} cy={y} r="2" fill="#C84B6E" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}
