'use client';

import type { StaticTemplate as Template } from '@/lib/templates/types';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CardPreview from './CardPreview';

interface PreviewPaneProps {
  template: Template;
  customText: Record<string, string>;
  customStyling: Record<string, any>;
}

export default function PreviewPane({
  template,
  customText,
  customStyling,
}: PreviewPaneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6"
    >
      {/* Card Preview */}
      <CardPreview
        template={template}
        customText={customText}
        customStyling={customStyling}
      />

      {/* Info Below Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center text-xs text-stone-600 space-y-2"
      >
        <p className="font-semibold text-stone-900">{template.name}</p>
        <p>
          {template.tier === 'premium' ? (
            <span className="inline-flex items-center gap-1"><Sparkles size={12} /> Premium Card ($5)</span>
          ) : 'Basic Card ($3)'}
        </p>
        <p className="text-stone-500">Live preview • Edit on the left</p>
      </motion.div>
    </motion.div>
  );
}
