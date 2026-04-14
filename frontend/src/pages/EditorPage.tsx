import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Palette, Type, AlertCircle } from 'lucide-react';
import { getTemplate } from '../templates/registry';
import { TierBadge } from '../components/ui/TierBadge';
import type { CardText, CardStyling, ColorPreset } from '../types/card';

export const EditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const template = slug ? getTemplate(slug) : undefined;

  const [customText, setCustomText] = useState<CardText>(
    template?.defaultText ?? { headline: '', body: '', signature: '' }
  );
  const [senderName, setSenderName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<ColorPreset | undefined>(
    template?.colorPresets?.[0]
  );
  const [customStyling, setCustomStyling] = useState<CardStyling>({});

  useEffect(() => {
    if (!template) return;
    setCustomText(template.defaultText);
    setSelectedPreset(template.colorPresets[0]);
  }, [slug]);

  if (!template) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-stone-400" />
          </div>
          <p className="text-stone-600 font-medium">Template not found.</p>
          <button onClick={() => navigate('/browse')} className="mt-4 text-rose-500 text-sm font-semibold hover:underline">
            Back to browse
          </button>
        </div>
      </div>
    );
  }

  const CardComponent = template.component;

  const handlePresetSelect = (preset: ColorPreset) => {
    setSelectedPreset(preset);
    setCustomStyling(s => ({
      ...s,
      colorPreset: preset.name,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
    }));
  };

  const handleContinue = () => {
    // Save editor state to sessionStorage for next steps
    sessionStorage.setItem('giflove_card', JSON.stringify({
      slug: template.slug,
      tier: template.tier,
      customText,
      customStyling,
      senderName,
    }));
    navigate('/checkout/recipients');
  };

  const effectiveStyling: CardStyling = {
    ...customStyling,
    primaryColor: selectedPreset?.secondary ?? customStyling.primaryColor,
    secondaryColor: selectedPreset?.primary ?? customStyling.secondaryColor,
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-stone-500">
          <button onClick={() => navigate('/browse')} className="hover:text-rose-500 transition-colors">Browse</button>
          <ChevronRight size={14} />
          <span className="text-stone-800 font-medium">{template.title}</span>
          <TierBadge tier={template.tier} className="ml-2" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Live Preview */}
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Live Preview</p>
            <div className="w-full aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-xl">
              <CardComponent
                customText={customText}
                senderName={senderName || 'You'}
                customStyling={effectiveStyling}
                tier={template.tier}
                isPreview={true}
              />
            </div>
          </div>

          {/* Editor Panel */}
          <div className="flex flex-col gap-6">
            <div>
              <h1
                className="text-2xl font-bold text-stone-800"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Customize your card
              </h1>
              <p className="text-stone-500 text-sm mt-1">Edit text and pick a colour palette.</p>
            </div>

            {/* Text fields */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-1">
                <Type size={16} className="text-rose-400" /> Message
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">To</label>
                <input
                  type="text"
                  value={customText.to ?? ''}
                  onChange={e => setCustomText(t => ({ ...t, to: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  placeholder="e.g. Alex — shown as 'Dear Alex' on the card"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Headline</label>
                <input
                  type="text"
                  value={customText.headline}
                  onChange={e => setCustomText(t => ({ ...t, headline: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  placeholder="Happy Birthday!"
                  maxLength={80}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Message</label>
                <textarea
                  value={customText.body}
                  onChange={e => setCustomText(t => ({ ...t, body: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all resize-none"
                  placeholder="Write something from the heart..."
                  maxLength={300}
                />
                <p className="text-xs text-stone-400 text-right mt-0.5">{customText.body.length}/300</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Sign-off</label>
                <input
                  type="text"
                  value={customText.signature}
                  onChange={e => setCustomText(t => ({ ...t, signature: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  placeholder="With love"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Your name <span className="text-stone-400">(optional here — required before sending)</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  placeholder="e.g. Sarah"
                  maxLength={60}
                />
              </div>
            </div>

            {/* Color presets */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5">
              <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-4">
                <Palette size={16} className="text-rose-400" /> Colour Palette
              </div>
              <div className="flex gap-3">
                {template.colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    title={preset.name}
                    className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                      selectedPreset?.name === preset.name
                        ? 'border-rose-400 scale-105 shadow-md'
                        : 'border-transparent hover:border-stone-300'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                {template.colorPresets.map(preset => (
                  <p
                    key={preset.name}
                    className={`flex-1 text-center text-xs font-medium transition-colors ${
                      selectedPreset?.name === preset.name ? 'text-rose-500' : 'text-stone-400'
                    }`}
                  >
                    {preset.name}
                  </p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.button
              onClick={handleContinue}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md flex items-center justify-center gap-2"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Continue to Send <ChevronRight size={18} />
            </motion.button>

            <p className="text-xs text-stone-400 text-center">
              {template.tier === 'free'
                ? 'Free — no payment needed. You\'ll get a shareable link.'
                : `${template.tier === 'essential' ? '$2.99' : template.tier === 'premium' ? '$4.99' : '$30'} — pay after customizing.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
