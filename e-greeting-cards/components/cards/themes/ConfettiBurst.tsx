import Wrap from './Wrap';

const dots: [number, number, string][] = [
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

const burstAngles = [0, 45, 90, 135, 180, 225, 270, 315];
const burstColors1 = ['#FF4444','#FFC107','#26A65B','#9C27B0','#FF8C42','#FF4444','#FFC107','#26A65B'];
const burstColors2 = ['#9C27B0','#FF8C42','#FFC107','#FF4444','#26A65B','#9C27B0','#FF8C42','#FFC107'];
const burstColors3 = ['#26A65B','#FF4444','#FFC107','#FF8C42','#9C27B0','#26A65B','#FF4444','#FFC107'];

export default function ConfettiBurst() {
  return (
    <Wrap>
      <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="600" fill="#fffdf9" />
        <g transform="translate(30,30) rotate(40)">
          <rect x="-6" y="-30" width="12" height="40" rx="3" fill="#FF8C42" />
          <rect x="-8" y="8" width="16" height="6" rx="2" fill="#FFC107" />
          {burstAngles.map((a, i) => (
            <line key={i} x1="0" y1="-32"
              x2={12 * Math.sin(a * Math.PI / 180)}
              y2={-32 - 12 * Math.cos(a * Math.PI / 180)}
              stroke={burstColors1[i]} strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
        <g transform="translate(370,570) rotate(-140)">
          <rect x="-6" y="-30" width="12" height="40" rx="3" fill="#9C27B0" />
          <rect x="-8" y="8" width="16" height="6" rx="2" fill="#FF4444" />
          {burstAngles.map((a, i) => (
            <line key={i} x1="0" y1="-32"
              x2={12 * Math.sin(a * Math.PI / 180)}
              y2={-32 - 12 * Math.cos(a * Math.PI / 180)}
              stroke={burstColors2[i]} strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
        <g transform="translate(370,30) rotate(-40)">
          <rect x="-6" y="-30" width="12" height="40" rx="3" fill="#26A65B" />
          <rect x="-8" y="8" width="16" height="6" rx="2" fill="#9C27B0" />
          {burstAngles.map((a, i) => (
            <line key={i} x1="0" y1="-32"
              x2={12 * Math.sin(a * Math.PI / 180)}
              y2={-32 - 12 * Math.cos(a * Math.PI / 180)}
              stroke={burstColors3[i]} strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
        {dots.map(([x, y, c], i) => (
          i % 3 === 0
            ? <circle key={i} cx={x} cy={y} r="7" fill={c} opacity="0.85" />
            : i % 3 === 1
            ? <rect key={i} x={x - 5} y={y - 3.5} width="10" height="7" rx="1.5"
                fill={c} opacity="0.85" transform={`rotate(${i * 17},${x},${y})`} />
            : <ellipse key={i} cx={x} cy={y} rx="7" ry="4.5"
                fill={c} opacity="0.85" transform={`rotate(${i * 23},${x},${y})`} />
        ))}
        <circle cx="30"  cy="300" r="7" fill="#FF4444" opacity="0.5" />
        <circle cx="370" cy="280" r="7" fill="#FFC107" opacity="0.5" />
        <circle cx="30"  cy="360" r="6" fill="#26A65B" opacity="0.45" />
        <circle cx="370" cy="380" r="6" fill="#9C27B0" opacity="0.45" />
      </svg>
    </Wrap>
  );
}
