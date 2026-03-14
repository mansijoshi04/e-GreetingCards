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
  category?: string; // birthday, anniversary, graduation, etc.
  tier?: string; // basic, premium
}

// Color palettes for each category
const categoryColorPalettes: Record<string, string[]> = {
  anniversary: ['#C84B6E', '#FFB6C1', '#D4AF37', '#FFC0CB', '#FF69B4'],
  birthday: ['#FF6B9D', '#FFE66D', '#4ECDC4', '#FF8C42', '#A8E6CF'],
  graduation: ['#2E5090', '#FFD700', '#00A8E8', '#C0A062', '#FFFFFF'],
  thankYou: ['#6B8E23', '#F0E68C', '#FF6F61', '#90EE90', '#DAA520'],
  congratulations: ['#FF4500', '#FFD700', '#9370DB', '#FF6347', '#FFA500'],
};

// Create shape drawing functions
function createShapeDrawer(shapeType: 'petal' | 'star' | 'confetti') {
  return (ctx: CanvasRenderingContext2D) => {
    switch (shapeType) {
      case 'petal': // Rose petal - soft oval
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 10, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case 'star': // 5-point star for graduation
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const x = Math.cos(angle) * 6;
          const y = Math.sin(angle) * 6;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'confetti': // Default square/rectangle
      default:
        ctx.fillRect(-3, -3, 6, 6);
        break;
    }
  };
}

// Get shape type based on category
function getShapeTypeForCategory(category?: string): 'petal' | 'star' | 'confetti' {
  switch (category?.toLowerCase()) {
    case 'anniversary':
      return 'petal';
    case 'graduation':
      return 'star';
    default:
      return 'confetti';
  }
}

export default function ConfettiLayer({
  trigger,
  config,
  cardId,
  category = 'birthday',
  tier = 'basic',
}: ConfettiLayerProps) {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  const duration = config.duration || 5000;
  const intensity = config.intensity || (tier === 'premium' ? 250 : 200);

  // Use category-specific colors if available and tier is premium
  const colors =
    tier === 'premium' && category && category in categoryColorPalettes
      ? categoryColorPalettes[category]
      : config.colors || [
          '#FF6B9D',
          '#FFE66D',
          '#4ECDC4',
          '#95E1D3',
          '#FF69B4',
        ];

  const shapeType = getShapeTypeForCategory(category);
  const drawShape = createShapeDrawer(shapeType);

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
      gravity={shapeType === 'petal' ? 0.1 : 0.3} // Petals fall slower
      wind={shapeType === 'petal' ? 0.05 : 0.01} // Petals drift more
      initialVelocityY={shapeType === 'petal' ? 5 : 20}
      drawShape={drawShape}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1000 }}
    />
  );
}
