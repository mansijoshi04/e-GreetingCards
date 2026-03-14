'use client';

import { motion } from 'framer-motion';
import { Template } from '@prisma/client';
import { Lightbulb } from 'lucide-react';

interface CustomizationPanelProps {
  template: Template;
  customText: Record<string, string>;
  setCustomText: (text: Record<string, string>) => void;
  customStyling: Record<string, any>;
  setCustomStyling: (styling: Record<string, any>) => void;
}

export default function CustomizationPanel({
  template,
  customText,
  setCustomText,
  customStyling,
  setCustomStyling,
}: CustomizationPanelProps) {
  const designConfig = template.designConfig as any;

  const colorThemes: Record<string, Record<string, string[]>> = {
    birthday: {
      'Rose & Cream': ['#FFF0F3', '#FFE0E6'],
      'Sage & White': ['#F1F8E9', '#DCEDC8'],
      'Sky & Cloud': ['#E3F2FD', '#BBDEFB'],
      'Warm & Gold': ['#FFF8F0', '#FFE4D6'],
    },
    anniversary: {
      'Rose & Blush': ['#FFF0F3', '#FFE0E6'],
      'Gold & Cream': ['#FFF8F0', '#FFE4D6'],
      'Wine & Rose': ['#FFEBEE', '#FFCDD2'],
      'Lavender & Soft': ['#F3E5F5', '#E1BEE7'],
    },
    graduation: {
      'Navy & Gold': ['#F0F4F8', '#E3F2FD'],
      'Deep Blue': ['#E3F2FD', '#BBDEFB'],
      'Classic Navy': ['#F5F5F5', '#EEEEEE'],
      'Ocean & Sky': ['#E1F5FE', '#B3E5FC'],
    },
    thankYou: {
      'Sage & Cream': ['#FAFAF5', '#F1F8E9'],
      'Warm Brown': ['#EFE7DE', '#D7CCC8'],
      'Soft Green': ['#F1F8E9', '#DCEDC8'],
      'Pale Blue': ['#E3F2FD', '#BBDEFB'],
    },
  };

  const textColors = [
    { name: 'Stone', value: 'stone-900', hex: '#78716c' },
    { name: 'Rose', value: 'rose-500', hex: '#f43f5e' },
    { name: 'Slate', value: 'slate-700', hex: '#334155' },
    { name: 'Emerald', value: 'emerald-600', hex: '#059669' },
  ];

  const colors = colorThemes[template.category] || colorThemes['birthday'];

  const handleTextChange = (field: string, value: string) => {
    setCustomText({
      ...customText,
      [field]: value,
    });
  };

  const handleColorChange = (colors: string[]) => {
    setCustomStyling({
      ...customStyling,
      backgroundValue: colors,
    });
  };

  const handleTextColorChange = (colorValue: string) => {
    setCustomStyling({
      ...customStyling,
      textColor: colorValue,
    });
  };

  const handleFontSizeChange = (size: number) => {
    setCustomStyling({
      ...customStyling,
      fontSize: size,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Customize Your Card
        </h2>
        <p className="text-sm text-stone-600">
          Personalize with your message and styling
        </p>
      </div>

      {/* Recipient Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
          Recipient (optional)
        </label>
        <input
          type="text"
          value={customText.recipientName || ''}
          onChange={(e) => handleTextChange('recipientName', e.target.value)}
          maxLength={50}
          placeholder="e.g., Sarah"
          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-stone-900"
        />
        <p className="text-xs text-stone-500 mt-1">
          Appears as "Dear Sarah," on the card
        </p>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
          Headline <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={customText.headline || ''}
          onChange={(e) => handleTextChange('headline', e.target.value)}
          maxLength={100}
          placeholder="e.g., Happy Birthday!"
          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none text-stone-900"
          rows={2}
        />
        <p className="text-xs text-stone-500 mt-1">
          {(customText.headline || '').length}/100 characters
        </p>
      </motion.div>

      {/* Body Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={customText.body || ''}
          onChange={(e) => handleTextChange('body', e.target.value)}
          maxLength={500}
          placeholder="Write your personal message here..."
          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none text-stone-900"
          rows={4}
        />
        <p className="text-xs text-stone-500 mt-1">
          {(customText.body || '').length}/500 characters
        </p>
      </motion.div>

      {/* Signature */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
          Your Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={customText.signature || ''}
          onChange={(e) => handleTextChange('signature', e.target.value)}
          maxLength={50}
          placeholder="e.g., Love, Sarah"
          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-stone-900"
        />
        <p className="text-xs text-stone-500 mt-1">
          {(customText.signature || '').length}/50 characters
        </p>
      </motion.div>

      {/* Font Size */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
          Message Size: {customStyling.fontSize || 20}px
        </label>
        <input
          type="range"
          min="14"
          max="32"
          value={customStyling.fontSize || 20}
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
        <div className="flex justify-between text-xs text-stone-500 mt-2">
          <span>Small</span>
          <span>Large</span>
        </div>
      </motion.div>

      {/* Text Color */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
          Message Color
        </label>
        <div className="grid grid-cols-4 gap-3">
          {textColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleTextColorChange(color.value)}
              className={`h-12 rounded-lg border-2 transition-all ${
                customStyling.textColor === color.value
                  ? 'border-rose-500 scale-110'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </motion.div>

      {/* Background Theme */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
          Background Theme
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {Object.entries(colors).map(([name, colorSet]) => (
            <button
              key={name}
              onClick={() => handleColorChange(colorSet)}
              className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                JSON.stringify(customStyling.backgroundValue) === JSON.stringify(colorSet)
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-sm font-medium text-stone-700">{name}</span>
              <div className="flex gap-2">
                {colorSet.map((color) => (
                  <div
                    key={color}
                    className="w-5 h-5 rounded-full border border-stone-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-900"
      >
        <p className="flex items-start gap-2">
          <Lightbulb size={14} className="mt-0.5 shrink-0" />
          <span><strong>Preview:</strong> See live changes in the card on the right as you type.</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
