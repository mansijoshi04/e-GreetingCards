import Wrap from './Wrap';

const confetti: [number, number, string, number][] = [
  [40,30,'#FF6B6B',20],[90,50,'#FFD93D',-15],[140,25,'#7EC8E3',40],
  [190,45,'#C9B1FF',10],[240,28,'#FFA040',-30],[290,50,'#FF6B6B',25],
  [340,30,'#FFD93D',-10],[380,48,'#7EC8E3',35],
  [30,555,'#C9B1FF',20],[80,570,'#FF6B6B',-25],[140,558,'#FFD93D',15],
  [200,575,'#7EC8E3',-10],[260,562,'#FFA040',40],[320,572,'#FF6B6B',-20],
  [370,555,'#FFD93D',25],
];

const candleColors = ['#FFD700', '#f472b6', '#60a5fa', '#34d399'];
const candleXs = [-22, -8, 8, 22];
const decorationColors = ['#FFD700','#a78bfa','#34d399','#f87171','#60a5fa','#fbbf24','#f472b6'];
const sparklePositions: [number, number][] = [[50,90],[350,90],[25,290],[375,290],[110,450],[290,450],[200,28]];
const starPositions: [number, number][] = [[80,155],[160,180],[240,170],[320,155],[70,430],[330,420]];

export default function CakeCelebration() {
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
        {confetti.map(([x, y, color, rot], i) => (
          i % 3 === 0
            ? <circle key={i} cx={x} cy={y} r="5.5" fill={color} opacity="0.85" />
            : i % 3 === 1
            ? <rect key={i} x={x - 4.5} y={y - 3} width="9" height="6" rx="1"
                fill={color} opacity="0.85" transform={`rotate(${rot},${x},${y})`} />
            : <polygon key={i}
                points={`${x},${y - 5.5} ${x + 4.5},${y + 3.5} ${x - 4.5},${y + 3.5}`}
                fill={color} opacity="0.85" transform={`rotate(${rot},${x},${y})`} />
        ))}
        <g transform="translate(200, 490)" opacity="0.95">
          <ellipse cx="0" cy="58" rx="85" ry="12" fill="#2a2040" />
          <ellipse cx="0" cy="56" rx="82" ry="10" fill="#3d3060" />
          <rect x="-70" y="10" width="140" height="48" rx="4" fill="#f472b6" />
          <rect x="-70" y="10" width="140" height="12" rx="4" fill="#fb7ac2" />
          {[-50,-30,-10,10,30,50].map((dx, i) => (
            <ellipse key={i} cx={dx} cy="10" rx="8" ry="6" fill="white" opacity="0.9" />
          ))}
          {[-55,-35,-15,5,25,45,65].map((dx, i) => (
            <circle key={i} cx={dx} cy="34" r="4" fill={decorationColors[i]} />
          ))}
          <rect x="-50" y="-24" width="100" height="36" rx="4" fill="#c084fc" />
          <rect x="-50" y="-24" width="100" height="10" rx="4" fill="#d8a4ff" />
          {[-38,-18,2,22,42].map((dx, i) => (
            <ellipse key={i} cx={dx} cy="-24" rx="7" ry="5" fill="white" opacity="0.9" />
          ))}
          <rect x="-32" y="-52" width="64" height="30" rx="4" fill="#fb923c" />
          <rect x="-32" y="-52" width="64" height="9" rx="4" fill="#fba560" />
          {[-22,-4,14].map((dx, i) => (
            <ellipse key={i} cx={dx} cy="-52" rx="6" ry="4.5" fill="white" opacity="0.9" />
          ))}
          {candleXs.map((cx, i) => (
            <g key={i}>
              <rect x={cx - 4} y="-80" width="8" height="28" rx="2" fill={candleColors[i]} />
              <ellipse cx={cx} cy="-84" rx="5" ry="8" fill="#FF8C00" opacity="0.9" />
              <ellipse cx={cx} cy="-85" rx="2.5" ry="5" fill="#FFE040" />
              <circle cx={cx} cy="-84" r="10" fill="#FF8C00" opacity="0.12" />
            </g>
          ))}
        </g>
        {sparklePositions.map(([x, y], i) => (
          <g key={i} opacity="0.75">
            <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke="#FFD700" strokeWidth="1.5" />
            <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke="#FFD700" strokeWidth="1.5" />
            <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} stroke="#FFD700" strokeWidth="0.9" />
            <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} stroke="#FFD700" strokeWidth="0.9" />
            <circle cx={x} cy={y} r="2.5" fill="#FFD700" />
          </g>
        ))}
        {starPositions.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.45" />
        ))}
      </svg>
    </Wrap>
  );
}
