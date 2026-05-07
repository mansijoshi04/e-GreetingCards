import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Palette, Type, AlertCircle, Eye, X } from 'lucide-react';
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
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!template) return;
    setCustomText(template.defaultText);
    setSelectedPreset(template.colorPresets[0]);
  }, [slug]);

  useEffect(() => {
    if (!previewOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewOpen(false);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [previewOpen]);

  if (!template) {
    return (
      <div className="min-h-screen bg-vellum-base flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-vellum-base border border-ink-espresso/15 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-ink-espresso/60" />
          </div>
          <p className="text-ink-espresso font-medium">Template not found.</p>
          <button onClick={() => navigate('/browse')} className="mt-4 text-pop-violet text-sm font-semibold hover:text-pop-rose">
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

  const previewHeadline = customText.headline || template.defaultText.headline;
  const thumbBg = template.previewGradient ?? `linear-gradient(135deg, ${selectedPreset?.primary ?? '#fff'} 0%, ${selectedPreset?.secondary ?? '#fff'} 100%)`;

  return (
    <div className="min-h-screen bg-vellum-base pt-16">
      {/* Breadcrumb */}
      <div className="bg-vellum-base border-b border-ink-espresso/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-ink-espresso/70">
          <button onClick={() => navigate('/browse')} className="hover:text-pop-rose transition-colors">Browse</button>
          <ChevronRight size={14} />
          <span className="text-ink-espresso font-medium">{template.title}</span>
          <TierBadge tier={template.tier} className="ml-2" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Editor Panel */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-ink-espresso">
                Customize your card
              </h1>
              <p className="text-ink-espresso/70 text-sm mt-1">Edit text and pick a colour palette. Hit Preview to see the recipient view.</p>
            </div>

            {/* Text fields */}
            <div className="bg-vellum-base rounded-2xl border border-ink-espresso/15 p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-ink-espresso font-semibold text-sm mb-1">
                <Type size={16} className="text-pop-rose" /> Message
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-espresso/70 mb-1">To</label>
                <input
                  type="text"
                  value={customText.to ?? ''}
                  onChange={e => setCustomText(t => ({ ...t, to: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-ink-espresso/20 text-sm focus:outline-none focus:ring-2 focus:ring-pop-violet/30 focus:border-pop-violet transition-all"
                  placeholder="e.g. Alex — shown as 'Dear Alex' on the card"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-espresso/70 mb-1">Headline</label>
                <input
                  type="text"
                  value={customText.headline}
                  onChange={e => setCustomText(t => ({ ...t, headline: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-ink-espresso/20 text-sm focus:outline-none focus:ring-2 focus:ring-pop-violet/30 focus:border-pop-violet transition-all"
                  placeholder="Happy Birthday!"
                  maxLength={80}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-espresso/70 mb-1">Message</label>
                <textarea
                  value={customText.body}
                  onChange={e => setCustomText(t => ({ ...t, body: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-ink-espresso/20 text-sm focus:outline-none focus:ring-2 focus:ring-pop-violet/30 focus:border-pop-violet transition-all resize-none"
                  placeholder="Write something from the heart..."
                  maxLength={300}
                />
                <p className="text-xs text-ink-espresso/50 text-right mt-0.5">{customText.body.length}/300</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-espresso/70 mb-1">Sign-off</label>
                <input
                  type="text"
                  value={customText.signature}
                  onChange={e => setCustomText(t => ({ ...t, signature: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-ink-espresso/20 text-sm focus:outline-none focus:ring-2 focus:ring-pop-violet/30 focus:border-pop-violet transition-all"
                  placeholder="With love"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-espresso/70 mb-1">
                  Your name <span className="text-ink-espresso/50">(optional here — required before sending)</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ink-espresso/20 text-sm focus:outline-none focus:ring-2 focus:ring-pop-violet/30 focus:border-pop-violet transition-all"
                  placeholder="e.g. Sarah"
                  maxLength={60}
                />
              </div>
            </div>

            {/* Color presets */}
            <div className="bg-vellum-base rounded-2xl border border-ink-espresso/15 p-5">
              <div className="flex items-center gap-2 text-ink-espresso font-semibold text-sm mb-4">
                <Palette size={16} className="text-pop-rose" /> Colour Palette
              </div>
              <div className="flex gap-3">
                {template.colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    title={preset.name}
                    className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                      selectedPreset?.name === preset.name
                        ? 'border-pop-violet scale-105'
                        : 'border-transparent hover:border-ink-espresso/30'
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
                      selectedPreset?.name === preset.name ? 'text-pop-violet' : 'text-ink-espresso/50'
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
              className="w-full bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold py-4 rounded-2xl text-base transition-colors flex items-center justify-center gap-2"
            >
              Continue to Send <ChevronRight size={18} />
            </motion.button>

            <p className="text-xs text-ink-espresso/60 text-center">
              {template.tier === 'free'
                ? 'Free — no payment needed. You\'ll get a shareable link.'
                : `${template.tier === 'essential' ? '$2.99' : template.tier === 'premium' ? '$4.99' : '$30'} — pay after customizing.`}
            </p>
          </div>

          {/* Right rail — static thumbnail + Preview button */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <p className="text-xs font-semibold text-ink-espresso/60 uppercase tracking-widest mb-3">Your card</p>
            <div
              className="relative w-full aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden border border-ink-espresso/15 shadow-xl"
              style={{ background: thumbBg }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-3">
                <span className="font-serif italic text-2xl md:text-3xl text-ink-espresso/85 leading-tight">
                  {previewHeadline}
                </span>
                {customText.signature && (
                  <span className="font-serif italic text-base text-ink-espresso/70">
                    — {customText.signature}
                  </span>
                )}
                <span className="text-[10px] tracking-[0.18em] uppercase text-ink-espresso/55 mt-2">
                  Static snapshot
                </span>
              </div>
            </div>

            <button
              onClick={() => setPreviewOpen(true)}
              className="mt-4 w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold py-3 rounded-full transition-colors"
            >
              <Eye size={16} /> Preview card
            </button>
            <p className="text-xs text-ink-espresso/55 text-center mt-2 max-w-sm mx-auto">
              See exactly how your recipient will experience the card.
            </p>
          </div>
        </div>
      </div>

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            key="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setPreviewOpen(false)}
            className="fixed inset-0 z-50 bg-ink-espresso/90 backdrop-blur-sm flex flex-col items-center justify-center px-4 py-8"
          >
            <button
              onClick={() => setPreviewOpen(false)}
              aria-label="Close preview"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-vellum-base/95 hover:bg-vellum-base text-ink-espresso flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>

            <p className="text-vellum-base/70 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Recipient preview
            </p>

            <motion.div
              key="preview-card"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
            >
              <CardComponent
                customText={customText}
                senderName={senderName || 'You'}
                customStyling={effectiveStyling}
                tier={template.tier}
                isPreview={false}
              />
            </motion.div>

            <p className="text-vellum-base/60 text-xs mt-5 text-center max-w-xs">
              Animations and interactions play exactly as the recipient will see them. Press Esc or click outside to close.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
