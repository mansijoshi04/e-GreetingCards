import Wrap from './Wrap';

function GradCap({ x, y, size, rot }: { x: number; y: number; size: number; rot: number }) {
  const s = size / 28;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity="0.75">
      <polygon points="0,-24 32,0 0,24 -32,0" fill="#FFD700" />
      <polygon points="0,-24 32,0 0,24 -32,0" fill="none" stroke="#DAA520" strokeWidth="2" />
      <polygon points="0,-24 16,-12 0,0 -16,-12" fill="#FFE860" opacity="0.4" />
      <rect x="-10" y="-22" width="20" height="20" rx="3" fill="#c49010" />
      <rect x="-10" y="-22" width="20" height="7" rx="3" fill="#DAA520" />
      <line x1="22" y1="-8" x2="36" y2="18" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      <circle cx="37" cy="21" r="7" fill="#FFD700" />
      <circle cx="37" cy="21" r="4" fill="#DAA520" />
      {[-3, 0, 3, 6, 9].map((dx, i) => (
        <line key={i} x1={34 + dx} y1="27" x2={33 + dx} y2="42" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
      ))}
    </g>
  );
}

const stars: [number, number][] = [
  [80,160],[150,200],[250,180],[320,155],[50,450],[350,450],
  [180,400],[220,420],[100,520],[300,510],[40,260],[360,270],
];
const confettiItems: [number, number, string][] = [
  [50,38,'#FFD700'],[100,28,'#B0C4FF'],[160,48,'#FFD700'],[220,32,'#B0C4FF'],
  [280,50,'#FFD700'],[340,36,'#B0C4FF'],[390,52,'#FFD700'],
  [30,555,'#FFD700'],[80,570,'#B0C4FF'],[150,558,'#FFD700'],[220,574,'#B0C4FF'],
  [290,560,'#FFD700'],[350,574,'#B0C4FF'],[390,552,'#FFD700'],
];
const sparklePositions: [number, number][] = [[200,28],[22,200],[378,200],[120,490],[280,490],[200,578]];

export default function CapToss() {
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
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.5} fill="white" opacity={0.2 + (i % 4) * 0.1} />
        ))}
        <GradCap x={65}  y={110} size={50} rot={-18} />
        <GradCap x={335} y={130} size={46} rot={22}  />
        <GradCap x={38}  y={330} size={40} rot={-28} />
        <GradCap x={362} y={310} size={44} rot={16}  />
        <GradCap x={140} y={65}  size={34} rot={10}  />
        <GradCap x={265} y={70}  size={32} rot={-12} />
        <GradCap x={80}  y={490} size={36} rot={20}  />
        <GradCap x={322} y={475} size={34} rot={-16} />
        {confettiItems.map(([x, y, c], i) => (
          i % 2 === 0
            ? <circle key={i} cx={x} cy={y} r="5" fill={c} opacity="0.8" />
            : <rect key={i} x={x - 4} y={y - 2.5} width="8" height="5" rx="1"
                fill={c} opacity="0.8" transform={`rotate(${i * 22},${x},${y})`} />
        ))}
        {sparklePositions.map(([x, y], i) => (
          <g key={i} opacity="0.8">
            <line x1={x - 9} y1={y} x2={x + 9} y2={y} stroke="#FFD700" strokeWidth="1.6" />
            <line x1={x} y1={y - 9} x2={x} y2={y + 9} stroke="#FFD700" strokeWidth="1.6" />
            <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="#FFD700" strokeWidth="0.9" />
            <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke="#FFD700" strokeWidth="0.9" />
            <circle cx={x} cy={y} r="3" fill="#FFD700" />
          </g>
        ))}
      </svg>
    </Wrap>
  );
}
