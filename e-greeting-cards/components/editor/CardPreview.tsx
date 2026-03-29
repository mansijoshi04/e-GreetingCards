'use client';

import type { StaticTemplate as Template } from '@/lib/templates/types';
import CardContent from '@/components/cards/CardContent';

interface CardPreviewProps {
  template: Template;
  customText: Record<string, string>;
  customStyling: Record<string, any>;
}

export default function CardPreview({ template, customText, customStyling }: CardPreviewProps) {
  let designConfig = {};
  try {
    designConfig = JSON.parse(template.designConfig as string);
  } catch (e) {
    console.error('Failed to parse designConfig:', e);
  }

  return (
    <div className="w-full max-w-sm mx-auto rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white">
      <CardContent content={customText} design={designConfig} styling={customStyling} />
    </div>
  );
}
