import Wrap from './Wrap';

function Rose({ cx, cy, r, color, darkColor }:
  { cx: number; cy: number; r: number; color: string; darkColor: string }) {
  return (
    <g>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <ellipse key={i}
          cx={cx + Math.cos(a) * r * 0.62}
          cy={cy + Math.sin(a) * r * 0.62}
          rx={r * 0.55} ry={r * 0.38}
          fill={color}
          transform={`rotate(${(i / 6) * 360},${cx + Math.cos(a) * r * 0.62},${cy + Math.sin(a) * r * 0.62})`}
          opacity="0.85"
        />;
      })}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 + 0.3;
        return <ellipse key={i}
          cx={cx + Math.cos(a) * r * 0.3}
          cy={cy + Math.sin(a) * r * 0.3}
          rx={r * 0.32} ry={r * 0.22}
          fill={darkColor} opacity="0.9"
        />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.22} fill={darkColor} />
    </g>
  );
}

function SmallFlower({ cx, cy, r, color }:
  { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return <circle key={i}
          cx={cx + Math.cos(a) * r * 0.7}
          cy={cy + Math.sin(a) * r * 0.7}
          r={r * 0.45} fill={color} opacity="0.85"
        />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.3} fill="#FFD700" />
    </g>
  );
}

function Leaf({ cx, cy, rx, ry, rot, color }:
  { cx: number; cy: number; rx: number; ry: number; rot: number; color: string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} opacity="0.8"
    transform={`rotate(${rot},${cx},${cy})`} />;
}

export default function RosePetals() {
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
        <g>
          <Leaf cx={30} cy={80}  rx={28} ry={12} rot={-40} color="#5cba80" />
          <Leaf cx={55} cy={45}  rx={26} ry={11} rot={-65} color="#4caf70" />
          <Leaf cx={75} cy={95}  rx={24} ry={10} rot={-20} color="#68c890" />
          <Leaf cx={15} cy={115} rx={22} ry={9}  rot={-55} color="#5cba80" />
          <Rose cx={50}  cy={60} r={28} color="#e05575" darkColor="#c0394a" />
          <Rose cx={88}  cy={42} r={22} color="#f07890" darkColor="#d45568" />
          <Rose cx={22}  cy={30} r={18} color="#e8688a" darkColor="#c84060" />
        </g>
        <g>
          <Leaf cx={370} cy={80}  rx={28} ry={12} rot={40} color="#5cba80" />
          <Leaf cx={345} cy={45}  rx={26} ry={11} rot={65} color="#4caf70" />
          <Leaf cx={325} cy={95}  rx={24} ry={10} rot={20} color="#68c890" />
          <Leaf cx={385} cy={115} rx={22} ry={9}  rot={55} color="#5cba80" />
          <Rose cx={350} cy={60} r={28} color="#e05575" darkColor="#c0394a" />
          <Rose cx={312} cy={42} r={22} color="#f07890" darkColor="#d45568" />
          <Rose cx={378} cy={30} r={18} color="#e8688a" darkColor="#c84060" />
        </g>
        <g>
          <Leaf cx={30}  cy={520} rx={28} ry={12} rot={40}  color="#5cba80" />
          <Leaf cx={55}  cy={555} rx={26} ry={11} rot={65}  color="#4caf70" />
          <Leaf cx={75}  cy={505} rx={24} ry={10} rot={20}  color="#68c890" />
          <Leaf cx={15}  cy={485} rx={22} ry={9}  rot={55}  color="#5cba80" />
          <Rose cx={50}  cy={540} r={28} color="#c84060" darkColor="#a03048" />
          <Rose cx={88}  cy={558} r={22} color="#d45870" darkColor="#b04058" />
          <Rose cx={22}  cy={570} r={18} color="#e06880" darkColor="#c05060" />
        </g>
        <g>
          <Leaf cx={370} cy={520} rx={28} ry={12} rot={-40} color="#5cba80" />
          <Leaf cx={345} cy={555} rx={26} ry={11} rot={-65} color="#4caf70" />
          <Leaf cx={325} cy={505} rx={24} ry={10} rot={-20} color="#68c890" />
          <Leaf cx={385} cy={485} rx={22} ry={9}  rot={-55} color="#5cba80" />
          <Rose cx={350} cy={540} r={28} color="#c84060" darkColor="#a03048" />
          <Rose cx={312} cy={558} r={22} color="#d45870" darkColor="#b04058" />
          <Rose cx={378} cy={570} r={18} color="#e06880" darkColor="#c05060" />
        </g>
        <SmallFlower cx={110} cy={55}  r={14} color="#7b9fff" />
        <SmallFlower cx={290} cy={55}  r={14} color="#7b9fff" />
        <SmallFlower cx={15}  cy={200} r={11} color="#b085f5" />
        <SmallFlower cx={385} cy={200} r={11} color="#b085f5" />
        <SmallFlower cx={15}  cy={400} r={11} color="#b085f5" />
        <SmallFlower cx={385} cy={400} r={11} color="#b085f5" />
        <SmallFlower cx={110} cy={545} r={14} color="#7b9fff" />
        <SmallFlower cx={290} cy={545} r={14} color="#7b9fff" />
        <path d="M88,42 Q200,20 312,42" stroke="#5cba80" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M88,558 Q200,580 312,558" stroke="#5cba80" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M15,115 Q8,300 15,485" stroke="#5cba80" strokeWidth="1.5" fill="none" opacity="0.35" />
        <path d="M385,115 Q392,300 385,485" stroke="#5cba80" strokeWidth="1.5" fill="none" opacity="0.35" />
      </svg>
    </Wrap>
  );
}
