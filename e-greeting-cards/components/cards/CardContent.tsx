'use client';

import { motion } from 'framer-motion';

interface CardContentProps {
  content: Record<string, string>;
  design: any;
  styling?: Record<string, any>;
}

export default function CardContent({ content, design, styling = {} }: CardContentProps) {
  const elements = design?.elements || [];
  const layout = design?.layout || {};

  // User's custom background overrides template default
  const bgColors: string[] = styling?.backgroundValue || layout.backgroundValue || [];

  const backgroundStyle: React.CSSProperties = {};
  if (bgColors.length >= 2) {
    backgroundStyle.background = `linear-gradient(to bottom right, ${bgColors[0]}, ${bgColors[1]})`;
  } else if (bgColors.length === 1) {
    backgroundStyle.backgroundColor = bgColors[0];
  } else if (layout.backgroundType === 'solid' && layout.backgroundValue) {
    backgroundStyle.backgroundColor = layout.backgroundValue[0] || layout.backgroundValue;
  }

  // User's text color override — stored as hex (legacy Tailwind names also supported)
  const textColorMap: Record<string, string> = {
    'stone-900': '#1c1917',
    'rose-500': '#f43f5e',
    'slate-700': '#334155',
    'emerald-600': '#059669',
  };
  const bodyTextColor = styling?.textColor
    ? textColorMap[styling.textColor] || styling.textColor
    : null;
  const headlineTextColor = styling?.headlineColor || null;

  // User's font size override for body text
  const bodyFontSize = styling?.fontSize ? `${styling.fontSize}px` : null;

  // Separate elements by ID for structured rendering
  const headline = elements.find((e: any) => e.id === 'headline');
  const body = elements.find((e: any) => e.id === 'body');
  const signature = elements.find((e: any) => e.id === 'signature');

  // Fallback: render all elements as generic text if structure unknown
  const knownIds = ['headline', 'body', 'signature'];
  const otherElements = elements.filter(
    (e: any) => !knownIds.includes(e.id) && e.type === 'text'
  );

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden flex flex-col items-center justify-between p-8"
      style={{ ...backgroundStyle, minHeight: '480px' }}
    >
      {/* Recipient name (optional) */}
      {content['recipientName'] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="w-full text-left pl-2 mt-2"
        >
          <p
            style={{
              fontSize: '16px',
              fontFamily: headline?.style?.fontFamily || 'system-ui, sans-serif',
              color: bodyTextColor || '#777777',
              fontStyle: 'italic',
            }}
          >
            Dear {content['recipientName']},
          </p>
        </motion.div>
      )}

      {/* Top section: headline */}
      {headline && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: headline.animations?.entrance?.delay || 0.3, ease: 'easeOut' }}
          className="w-full text-center mt-4"
        >
          <p
            style={{
              fontSize: headline.style?.fontSize || '40px',
              fontFamily: headline.style?.fontFamily || 'Georgia, serif',
              fontWeight: headline.style?.fontWeight || '700',
              color: headlineTextColor || headline.style?.color || '#333333',
              lineHeight: '1.2',
            }}
          >
            {content['headline'] || headline.defaultText || ''}
          </p>
        </motion.div>
      )}

      {/* Middle section: body */}
      {body && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: body.animations?.entrance?.delay || 0.6, ease: 'easeOut' }}
          className="w-full text-center my-6 px-4"
        >
          <p
            style={{
              fontSize: bodyFontSize || body.style?.fontSize || '18px',
              fontFamily: body.style?.fontFamily || 'system-ui, sans-serif',
              fontWeight: body.style?.fontWeight || '400',
              color: bodyTextColor || body.style?.color || '#555555',
              lineHeight: body.style?.lineHeight || '1.6',
            }}
          >
            {content['body'] || body.defaultText || ''}
          </p>
        </motion.div>
      )}

      {/* Other elements */}
      {otherElements.map((element: any) => (
        <motion.div
          key={element.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: element.animations?.entrance?.delay || 0.5, ease: 'easeOut' }}
          className="w-full text-center px-4"
        >
          <p
            style={{
              fontSize: element.style?.fontSize || '16px',
              fontFamily: element.style?.fontFamily || 'system-ui',
              color: element.style?.color || '#333333',
            }}
          >
            {content[element.id] || element.defaultText || ''}
          </p>
        </motion.div>
      ))}

      {/* Bottom section: signature */}
      {signature && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: signature.animations?.entrance?.delay || 0.9, ease: 'easeOut' }}
          className="w-full text-right pr-4 mb-2"
        >
          <p
            style={{
              fontSize: signature.style?.fontSize || '18px',
              fontFamily: signature.style?.fontFamily || 'Georgia, serif',
              fontWeight: signature.style?.fontWeight || '400',
              color: bodyTextColor || signature.style?.color || '#777777',
              fontStyle: signature.style?.fontStyle || 'italic',
            }}
          >
            {content['signature'] || signature.defaultText || ''}
          </p>
        </motion.div>
      )}
    </div>
  );
}
