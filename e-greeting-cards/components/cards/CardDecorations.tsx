import BalloonParty    from './themes/BalloonParty';
import ConfettiBurst   from './themes/ConfettiBurst';
import SimpleThanks    from './themes/SimpleThanks';
import DiplomaScroll   from './themes/DiplomaScroll';
import Achievement     from './themes/Achievement';
import RosePetals      from './themes/RosePetals';
import CakeCelebration from './themes/CakeCelebration';
import HeartFloat      from './themes/HeartFloat';
import CapToss         from './themes/CapToss';

const THEMES: Record<string, React.ComponentType> = {
  'balloon-party':    BalloonParty,
  'confetti-burst':   ConfettiBurst,
  'simple-thanks':    SimpleThanks,
  'diploma-scroll':   DiplomaScroll,
  'achievement':      Achievement,
  'rose-petals':      RosePetals,
  'cake-celebration': CakeCelebration,
  'heart-float':      HeartFloat,
  'cap-toss':         CapToss,
};

export default function CardDecorations({ theme }: { theme: string }) {
  const Theme = THEMES[theme];
  return Theme ? <Theme /> : null;
}
