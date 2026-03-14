'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ShareButtonProps {
  onClick: () => void;
  Icon: LucideIcon;
  label: string;
}

export default function ShareButton({ onClick, Icon, label }: ShareButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2 text-sm font-medium"
    >
      <Icon size={16} />
      <span>{label}</span>
    </motion.button>
  );
}
