import Wrap from './Wrap';

export default function BalloonParty() {
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
        <rect width="400" height="600" fill="url(#bp-bg)" />
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
        <ellipse cx="75" cy="200" rx="40" ry="50" fill="url(#bp-b1)" />
        <ellipse cx="62" cy="183" rx="13" ry="8" fill="white" opacity="0.25" />
        <path d="M75 250 Q74 252 75 254" stroke="#FF4444" strokeWidth="2" fill="none" />
        <path d="M75 254 Q65 310 68 360" stroke="#888" strokeWidth="1.4" fill="none" />
        <ellipse cx="200" cy="170" rx="44" ry="55" fill="url(#bp-b2)" />
        <ellipse cx="185" cy="150" rx="14" ry="9" fill="white" opacity="0.25" />
        <path d="M200 225 Q199 227 200 229" stroke="#FFC107" strokeWidth="2" fill="none" />
        <path d="M200 229 Q192 285 196 340" stroke="#888" strokeWidth="1.4" fill="none" />
        <ellipse cx="325" cy="195" rx="40" ry="50" fill="url(#bp-b3)" />
        <ellipse cx="312" cy="178" rx="13" ry="8" fill="white" opacity="0.25" />
        <path d="M325 245 Q324 247 325 249" stroke="#9C27B0" strokeWidth="2" fill="none" />
        <path d="M325 249 Q316 300 318 352" stroke="#888" strokeWidth="1.4" fill="none" />
        <ellipse cx="30" cy="380" rx="30" ry="38" fill="url(#bp-b4)" />
        <ellipse cx="21" cy="366" rx="10" ry="6" fill="white" opacity="0.22" />
        <path d="M30 418 Q24 450 26 475" stroke="#888" strokeWidth="1.4" fill="none" />
        <ellipse cx="370" cy="360" rx="30" ry="38" fill="#FF8C42" />
        <ellipse cx="361" cy="346" rx="10" ry="6" fill="white" opacity="0.22" />
        <path d="M370 398 Q364 428 366 452" stroke="#888" strokeWidth="1.4" fill="none" />
        <circle cx="130" cy="40" r="6" fill="#FF4444" opacity="0.9" />
        <circle cx="180" cy="30" r="5" fill="#FFC107" opacity="0.9" />
        <circle cx="235" cy="48" r="6" fill="#26A65B" opacity="0.9" />
        <circle cx="290" cy="35" r="5" fill="#9C27B0" opacity="0.9" />
        <circle cx="145" cy="570" r="6" fill="#FF8C42" opacity="0.9" />
        <circle cx="210" cy="558" r="5" fill="#FF4444" opacity="0.9" />
        <circle cx="270" cy="575" r="6" fill="#FFC107" opacity="0.9" />
        <circle cx="320" cy="562" r="5" fill="#9C27B0" opacity="0.9" />
        <rect x="155" y="34" width="12" height="6" fill="#9C27B0" opacity="0.85" transform="rotate(30,161,37)" />
        <rect x="256" y="42" width="12" height="6" fill="#FF4444" opacity="0.85" transform="rotate(-25,262,45)" />
        <rect x="175" y="566" width="12" height="6" fill="#26A65B" opacity="0.85" transform="rotate(40,181,569)" />
        <rect x="245" y="575" width="12" height="6" fill="#FF8C42" opacity="0.85" transform="rotate(-15,251,578)" />
        <text x="108" y="58" fontSize="18" fill="#FFD700" opacity="0.8">★</text>
        <text x="350" y="58" fontSize="16" fill="#FF8C42" opacity="0.8">★</text>
        <text x="50" y="555" fontSize="16" fill="#FFC107" opacity="0.8">★</text>
        <text x="360" y="548" fontSize="18" fill="#FF4444" opacity="0.8">★</text>
      </svg>
    </Wrap>
  );
}
