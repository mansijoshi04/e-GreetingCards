'use client';

import { motion } from 'framer-motion';
import { Template } from '@prisma/client';
import { Lightbulb } from 'lucide-react';

/** Circular dashed color picker trigger — hides the native input under a styled circle */
function ColorPicker({
  value,
  onChange,
  title,
}: {
  value: string;
  onChange: (hex: string) => void;
  title?: string;
}) {
  return (
    <label className="relative cursor-pointer shrink-0" title={title}>
      {/* Visible circle */}
      <div className="w-9 h-9 rounded-full border-2 border-dashed border-stone-400 p-0.5 hover:border-stone-600 transition-colors">
        <div className="w-full h-full rounded-full" style={{ backgroundColor: value }} />
      </div>
      {/* Invisible native input layered on top */}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </label>
  );
}

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
  let designConfig: any = {};
  try { designConfig = JSON.parse(template.designConfig as string); } catch {}

  // Default headline color from template
  const defaultHeadlineColor =
    designConfig?.elements?.find((e: any) => e.id === 'headline')?.style?.color || '#FF6B9D';

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

  const quickTextColors = ['#1c1917', '#f43f5e', '#334155', '#059669', '#7c3aed', '#d97706'];
  const colors = colorThemes[template.category] || colorThemes['birthday'];
  const quickBgPresets = Object.entries(colors);

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

  const handleTextColorChange = (hex: string) => {
    setCustomStyling({ ...customStyling, textColor: hex });
  };

  const handleHeadlineColorChange = (hex: string) => {
    setCustomStyling({ ...customStyling, headlineColor: hex });
  };

  const handleGradientColorChange = (index: 0 | 1, hex: string) => {
    const current: string[] = customStyling.backgroundValue || Object.values(colors)[0];
    const updated = [...current];
    updated[index] = hex;
    setCustomStyling({ ...customStyling, backgroundValue: updated });
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

      {/* Headline Color */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
          Headline Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <ColorPicker
            value={customStyling.headlineColor || defaultHeadlineColor}
            onChange={handleHeadlineColorChange}
            title="Pick headline color"
          />
          {quickTextColors.map((hex) => (
            <button
              key={hex}
              onClick={() => handleHeadlineColorChange(hex)}
              className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                customStyling.headlineColor === hex ? 'border-rose-500 scale-110' : 'border-stone-200'
              }`}
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>
      </motion.div>

      {/* Message Color */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
          Message Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <ColorPicker
            value={customStyling.textColor || '#333333'}
            onChange={handleTextColorChange}
            title="Pick message color"
          />
          {quickTextColors.map((hex) => (
            <button
              key={hex}
              onClick={() => handleTextColorChange(hex)}
              className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                customStyling.textColor === hex ? 'border-rose-500 scale-110' : 'border-stone-200'
              }`}
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>
      </motion.div>

      {/* Background */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
          Background
        </label>

        {/* Custom gradient pickers */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <ColorPicker
              value={(customStyling.backgroundValue || Object.values(colors)[0])[0] || '#ffffff'}
              onChange={(hex) => handleGradientColorChange(0, hex)}
              title="Gradient start color"
            />
            <span className="text-xs text-stone-400">→</span>
            <ColorPicker
              value={(customStyling.backgroundValue || Object.values(colors)[0])[1] || '#f5f5f5'}
              onChange={(hex) => handleGradientColorChange(1, hex)}
              title="Gradient end color"
            />
          </div>
          <div
            className="flex-1 h-10 rounded-lg border border-stone-200"
            style={{
              background: `linear-gradient(135deg, ${(customStyling.backgroundValue || Object.values(colors)[0])[0]}, ${(customStyling.backgroundValue || Object.values(colors)[0])[1]})`,
            }}
          />
        </div>

        {/* Quick preset themes */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {quickBgPresets.map(([name, colorSet]) => (
            <button
              key={name}
              onClick={() => handleColorChange(colorSet)}
              className={`w-full px-3 py-2 rounded-xl border-2 transition-all flex items-center justify-between ${
                JSON.stringify(customStyling.backgroundValue) === JSON.stringify(colorSet)
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-xs font-medium text-stone-700">{name}</span>
              <div className="flex gap-1.5">
                {colorSet.map((color) => (
                  <div
                    key={color}
                    className="w-4 h-4 rounded-full border border-stone-300"
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
