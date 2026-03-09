'use client';

import { useRouter } from 'next/navigation';
import { Template } from '@prisma/client';
import { motion } from 'framer-motion';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const tierColor = template.tier === 'premium' ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-700';
  const tierLabel = template.tier === 'premium' ? 'Premium ($5)' : 'Basic ($3)';
  const price = template.tier === 'premium' ? '$5' : '$3';
  const priceColor = template.tier === 'premium' ? 'text-rose-500' : 'text-stone-900';

  // Parse design config from JSON string
  let designConfig = {};
  try {
    designConfig = JSON.parse(template.designConfig as string);
  } catch (e) {
    console.error('Failed to parse designConfig:', e);
  }

  const designConfigTyped = designConfig as any;
  const backgroundValue = designConfigTyped?.layout?.backgroundValue;
  const bgGradient = Array.isArray(backgroundValue)
    ? `linear-gradient(135deg, ${backgroundValue[0]}, ${backgroundValue[1] || backgroundValue[0]})`
    : backgroundValue || '#fdfcfb';

  // Get headline color and text from first element
  const headlineElement = designConfigTyped?.elements?.[0];
  const headlineColor = headlineElement?.style?.color || '#FF6B9D';
  const headlineText = headlineElement?.defaultText || 'Happy Birthday!';

  const handleCardClick = () => {
    router.push(`/create/${template.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/create/${template.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col bg-white border border-stone-200 hover:border-stone-300"
      onClick={handleCardClick}
    >
      {/* Template Image/Preview - Gradient background */}
      <div
        className="relative w-full aspect-[3/4] flex items-center justify-center overflow-hidden"
        style={{ background: bgGradient }}
      >
        {/* Premium Badge with Animation */}
        <motion.div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${tierColor}`}
          animate={template.tier === 'premium' ? { rotate: [0, -5, 5, 0] } : {}}
          transition={template.tier === 'premium' ? { duration: 3, repeat: Infinity } : {}}
        >
          {template.tier === 'premium' && <span>✨</span>}
          {tierLabel}
        </motion.div>

        {/* Center text preview - Shows actual template headline */}
        <div className="text-center px-6 flex flex-col items-center justify-center h-full">
          <h2
            className="text-3xl font-serif font-bold drop-shadow-lg mb-4 leading-tight"
            style={{ color: headlineColor }}
          >
            {headlineText}
          </h2>
          <p className="text-sm opacity-75 drop-shadow">
            Click to customize
          </p>
        </div>
      </div>

      {/* Template Info */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-lg font-serif font-semibold text-stone-900 mb-2">
          {template.name}
        </h3>

        <p className="text-xs uppercase tracking-widest text-stone-500 mb-auto capitalize">
          {template.category}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className={`text-2xl font-serif font-bold ${priceColor}`}>
            {price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 text-white bg-stone-900 px-4 py-2 rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors"
            onClick={handleEditClick}
          >
            Edit Card
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
