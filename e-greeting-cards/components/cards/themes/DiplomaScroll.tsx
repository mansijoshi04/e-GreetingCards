import Wrap from './Wrap';

const corners: [number, number][] = [[28, 28], [372, 28], [28, 572], [372, 572]];

export default function DiplomaScroll() {
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
        <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#2e5090" strokeWidth="3" opacity="0.45" />
        <rect x="20" y="20" width="360" height="560" rx="3" fill="none" stroke="#2e5090" strokeWidth="1" opacity="0.3" />
        {corners.map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill="none" stroke="#2e5090" strokeWidth="2" opacity="0.5" />
            <circle cx={cx} cy={cy} r="3.5" fill="#FFD700" opacity="0.7" />
          </g>
        ))}
        <g transform="translate(200, 160)" opacity="0.85">
          <polygon points="0,-30 50,0 0,30 -50,0" fill="#2e5090" />
          <circle cx="0" cy="-30" r="6" fill="#2e5090" />
          <circle cx="0" cy="-30" r="3" fill="#FFD700" />
          <rect x="-18" y="-28" width="36" height="24" rx="4" fill="#1a3a6e" />
          <polygon points="0,-30 50,0 0,30 -50,0" fill="none" stroke="#4a7ad0" strokeWidth="1.5" opacity="0.4" />
          <line x1="40" y1="-8" x2="56" y2="20" stroke="#FFD700" strokeWidth="2.5" />
          <circle cx="57" cy="22" r="5" fill="#FFD700" />
          <line x1="55" y1="26" x2="52" y2="38" stroke="#FFD700" strokeWidth="1.5" />
          <line x1="57" y1="26" x2="57" y2="40" stroke="#FFD700" strokeWidth="1.5" />
          <line x1="59" y1="26" x2="62" y2="38" stroke="#FFD700" strokeWidth="1.5" />
        </g>
        <g transform="translate(200, 470)" opacity="0.85">
          <rect x="-75" y="-40" width="150" height="80" rx="4" fill="url(#ds-scroll)" stroke="#c8b880" strokeWidth="2" />
          <ellipse cx="-75" cy="0" rx="10" ry="40" fill="#e8d898" stroke="#c8b880" strokeWidth="1.5" />
          <ellipse cx="-75" cy="0" rx="5" ry="36" fill="#f5eecc" />
          <ellipse cx="75" cy="0" rx="10" ry="40" fill="#e8d898" stroke="#c8b880" strokeWidth="1.5" />
          <ellipse cx="75" cy="0" rx="5" ry="36" fill="#f5eecc" />
          <line x1="-50" y1="-15" x2="50" y2="-15" stroke="#2e5090" strokeWidth="1.5" opacity="0.4" />
          <line x1="-40" y1="-5"  x2="40"  y2="-5"  stroke="#2e5090" strokeWidth="1" opacity="0.3" />
          <line x1="-50" y1="5"   x2="50"  y2="5"   stroke="#2e5090" strokeWidth="1" opacity="0.3" />
          <line x1="-40" y1="15"  x2="40"  y2="15"  stroke="#2e5090" strokeWidth="1" opacity="0.3" />
          <rect x="-8" y="-44" width="16" height="88" fill="#c0392b" opacity="0.75" rx="2" />
          <circle cx="0" cy="0" r="12" fill="#c0392b" opacity="0.85" />
          <circle cx="0" cy="0" r="7" fill="#e74c3c" opacity="0.9" />
          <text x="0" y="4" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">★</text>
        </g>
        <text x="60"  y="68"  textAnchor="middle" fontSize="22" fill="#FFD700" opacity="0.7">★</text>
        <text x="340" y="68"  textAnchor="middle" fontSize="22" fill="#FFD700" opacity="0.7">★</text>
        <text x="200" y="42"  textAnchor="middle" fontSize="16" fill="#FFD700" opacity="0.6">✦</text>
        <text x="60"  y="548" textAnchor="middle" fontSize="18" fill="#FFD700" opacity="0.6">★</text>
        <text x="340" y="548" textAnchor="middle" fontSize="18" fill="#FFD700" opacity="0.6">★</text>
        <path d="M80 46 Q200 36 320 46" stroke="#2e5090" strokeWidth="1.5" fill="none" opacity="0.35" />
        <path d="M80 548 Q200 558 320 548" stroke="#2e5090" strokeWidth="1.5" fill="none" opacity="0.35" />
      </svg>
    </Wrap>
  );
}
