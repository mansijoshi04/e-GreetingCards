'use client';

import { useRouter } from 'next/navigation';
import { Template } from '@prisma/client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CardDecorations from '@/components/cards/CardDecorations';

interface TemplateCardProps {
  template: Template;
}

const ANIMATION_LABELS: Record<string, string> = {
  'envelope-open':  '↓ Scroll to open',
  'scroll-to-open': '↓ Scroll to open',
  'click-to-reveal': '👆 Click to reveal',
  'auto-play':       '✨ Auto-plays',
};

export default function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();

  let designConfig: any = {};
  try {
    designConfig = JSON.parse(template.designConfig as string);
  } catch (e) {
    console.error('Failed to parse designConfig:', e);
  }

  const visualTheme: string | undefined = designConfig?.layout?.visualTheme;
  const animationType: string = designConfig?.animations?.scrollTrigger || 'auto-play';
  const animationLabel = ANIMATION_LABELS[animationType] || ANIMATION_LABELS['auto-play'];

  const bgColors: string[] = designConfig?.layout?.backgroundValue || [];
  const bgGradient =
    bgColors.length >= 2
      ? `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`
      : bgColors[0] || '#fdfcfb';

  const headlineElement = designConfig?.elements?.[0];
  const headlineColor = headlineElement?.style?.color || '#FF6B9D';
  const headlineText  = headlineElement?.defaultText || 'Happy Birthday!';

  const tierColor = template.tier === 'premium' ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-700';
  const tierLabel = template.tier === 'premium' ? 'Premium ($5)' : 'Basic ($3)';
  const price      = template.tier === 'premium' ? '$5' : '$3';
  const priceColor = template.tier === 'premium' ? 'text-rose-500' : 'text-stone-900';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col bg-white border border-stone-200 hover:border-stone-300"
      onClick={() => router.push(`/create/${template.id}`)}
    >
      {/* Card illustration preview */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden"
        style={{ background: bgGradient }}
      >
        {/* SVG illustration layer */}
        {visualTheme && (
          <div className="absolute inset-0">
            <CardDecorations theme={visualTheme} />
          </div>
        )}

        {/* Tier badge */}
        <motion.div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10 ${tierColor}`}
          animate={template.tier === 'premium' ? { rotate: [0, -5, 5, 0] } : {}}
          transition={template.tier === 'premium' ? { duration: 3, repeat: Infinity } : {}}
        >
          {template.tier === 'premium' && <Sparkles size={12} />}
          {tierLabel}
        </motion.div>

        {/* Animation type badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-white backdrop-blur-sm z-10 whitespace-nowrap">
          {animationLabel}
        </div>

        {/* Headline text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
          <h2
            className="text-2xl font-serif font-bold text-center drop-shadow-lg leading-tight"
            style={{ color: headlineColor }}
          >
            {headlineText}
          </h2>
        </div>
      </div>

      {/* Template info */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-lg font-serif font-semibold text-stone-900 mb-2">
          {template.name}
        </h3>
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-auto capitalize">
          {template.category}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <span className={`text-2xl font-serif font-bold ${priceColor}`}>{price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 text-white bg-stone-900 px-4 py-2 rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors"
            onClick={e => { e.stopPropagation(); router.push(`/create/${template.id}`); }}
          >
            Edit Card
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
