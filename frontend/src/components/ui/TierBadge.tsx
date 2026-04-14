import React from 'react';
import { TIER_COLORS } from '../../constants';
import type { Tier } from '../../types/card';

interface TierBadgeProps {
  tier: Tier;
  className?: string;
}

const TIER_LABELS: Record<Tier, string> = {
  free: 'Free',
  essential: 'Essential',
  premium: 'Premium',
  bulk: 'Bulk',
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, className = '' }) => {
  const colors = TIER_COLORS[tier];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {TIER_LABELS[tier]}
    </span>
  );
};
