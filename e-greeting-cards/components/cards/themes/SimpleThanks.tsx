import Wrap from './Wrap';

function Flower({ cx, cy, r, petalColor, centerColor, petals = 6 }:
  { cx: number; cy: number; r: number; petalColor: string; centerColor: string; petals?: number }) {
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
  { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" opacity="0.6" />
      <ellipse cx={mx} cy={my} rx={len * 0.42} ry={len * 0.18} fill={color} opacity="0.75"
        transform={`rotate(${angle},${mx},${my})`} />
    </g>
  );
}

export default function SimpleThanks() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="600" fill="#ffffff" />
        <g opacity="0.88">
          <Leaf x1={20} y1={590} x2={80} y2={530} color="#4caf7d" />
          <Leaf x1={10} y1={580} x2={55} y2={515} color="#5cba8a" />
          <Leaf x1={30} y1={595} x2={100} y2={550} color="#3d9e6a" />
          <Leaf x1={60} y1={590} x2={40} y2={530} color="#4caf7d" />
          <Flower cx={82} cy={528} r={22} petalColor="#FF8C42" centerColor="#FFD700" />
          <Flower cx={46} cy={550} r={16} petalColor="#FFC107" centerColor="#FF8C42" petals={5} />
          <Flower cx={112} cy={555} r={14} petalColor="#FF8C42" centerColor="#FFD700" petals={5} />
        </g>
        <g opacity="0.88">
          <Leaf x1={380} y1={10} x2={320} y2={70} color="#4caf7d" />
          <Leaf x1={390} y1={20} x2={345} y2={85} color="#5cba8a" />
          <Leaf x1={370} y1={5} x2={300} y2={50} color="#3d9e6a" />
          <Leaf x1={340} y1={10} x2={360} y2={70} color="#4caf7d" />
          <Flower cx={318} cy={72} r={22} petalColor="#FF8C42" centerColor="#FFD700" />
          <Flower cx={354} cy={88} r={16} petalColor="#FFC107" centerColor="#FF8C42" petals={5} />
          <Flower cx={288} cy={52} r={14} petalColor="#FF8C42" centerColor="#FFD700" petals={5} />
        </g>
        <Flower cx={18} cy={80} r={13} petalColor="#26bfad" centerColor="#FFF" petals={5} />
        <Flower cx={382} cy={520} r={13} petalColor="#26bfad" centerColor="#FFF" petals={5} />
        <Leaf x1={5} y1={100} x2={35} y2={140} color="#4caf7d" />
        <Leaf x1={365} y1={500} x2={395} y2={460} color="#4caf7d" />
        <circle cx="200" cy="14" r="4" fill="#FF8C42" opacity="0.6" />
        <circle cx="185" cy="14" r="3" fill="#FFC107" opacity="0.5" />
        <circle cx="215" cy="14" r="3" fill="#26bfad" opacity="0.5" />
        <circle cx="200" cy="586" r="4" fill="#FF8C42" opacity="0.6" />
      </svg>
    </Wrap>
  );
}
