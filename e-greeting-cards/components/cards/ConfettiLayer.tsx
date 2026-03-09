'use client';

import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

interface ConfettiLayerProps {
  trigger: boolean;
  config: {
    enabled?: boolean;
    colors?: string[];
    intensity?: number;
    duration?: number;
  };
  cardId: string;
}

export default function ConfettiLayer({
  trigger,
  config,
  cardId,
}: ConfettiLayerProps) {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  const duration = config.duration || 5000;
  const intensity = config.intensity || 200;
  const colors = config.colors || [
    '#FF6B9D',
    '#FFE66D',
    '#4ECDC4',
    '#95E1D3',
    '#FF69B4',
  ];

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);

      // Auto-deactivate after duration
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, isActive, duration]);

  if (!isActive || !config.enabled) {
    return null;
  }

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={intensity}
      colors={colors}
      recycle={false}
      gravity={0.3}
      wind={0.01}
      initialVelocityY={20}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1000 }}
    />
  );
}
