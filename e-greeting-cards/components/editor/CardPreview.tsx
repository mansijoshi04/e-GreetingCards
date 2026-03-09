'use client';

import { Template } from '@prisma/client';

interface CardPreviewProps {
  template: Template;
  customText: Record<string, string>;
  customStyling: Record<string, any>;
}

export default function CardPreview({
  template,
  customText,
  customStyling,
}: CardPreviewProps) {
  // Parse designConfig from JSON string
  let designConfig = {};
  try {
    designConfig = JSON.parse(template.designConfig as string);
  } catch (e) {
    console.error('Failed to parse designConfig:', e);
  }

  const designConfigTyped = designConfig as any;
  const bgColors = customStyling.backgroundValue || designConfigTyped.layout?.backgroundValue || [];
  const bgGradient =
    bgColors.length === 2
      ? `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`
      : bgColors[0] || '#fdfcfb';

  // Get colors and styles from template design config
  const headlineElement = designConfigTyped.elements?.[0];
  const bodyElement = designConfigTyped.elements?.[1];
  const signatureElement = designConfigTyped.elements?.[2];

  const headlineColor = headlineElement?.style?.color || '#FF6B9D';
  const bodyColor = bodyElement?.style?.color || '#333333';
  const signatureColor = signatureElement?.style?.color || '#666666';

  // Get default text from template
  const headlineDefaultText = headlineElement?.defaultText || 'Happy Birthday!';
  const bodyDefaultText = bodyElement?.defaultText || 'Hope your day is filled with joy!';
  const signatureDefaultText = signatureElement?.defaultText || 'Love, [Your Name]';

  return (
    <div
      className="w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-between p-8 aspect-[3/4] border-8 border-white relative"
      style={{ background: bgGradient, minHeight: '500px' }}
    >
      {/* Top Section */}
      <div className="flex-0">
        {customText.recipientName && (
          <p className="font-serif text-sm italic mb-2" style={{ color: bodyColor }}>
            Dear {customText.recipientName},
          </p>
        )}
      </div>

      {/* Middle Section - Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center gap-4">
        {/* Headline */}
        <h1
          className="font-serif font-bold leading-tight"
          style={{
            fontSize: `${Math.min((customStyling.fontSize || 20) * 2.4, 56)}px`,
            color: headlineColor,
          }}
        >
          {customText.headline || headlineDefaultText}
        </h1>

        {/* Body */}
        <p
          className="font-body leading-relaxed max-w-xs"
          style={{
            fontSize: `${customStyling.fontSize || 20}px`,
            color: bodyColor,
          }}
        >
          {customText.body || bodyDefaultText}
        </p>
      </div>

      {/* Bottom Section - Signature */}
      <div className="flex-0 text-right">
        <p
          className="font-serif italic text-sm"
          style={{
            fontSize: '16px',
            color: signatureColor,
          }}
        >
          {customText.signature || signatureDefaultText}
        </p>
      </div>
    </div>
  );
}
