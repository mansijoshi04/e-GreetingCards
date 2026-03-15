'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import ScrollToOpen from '@/components/animations/ScrollToOpen';
import ClickToReveal from '@/components/animations/ClickToReveal';
import CardContent from '@/components/cards/CardContent';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  design: any;
  customText: Record<string, string>;
  customStyling: Record<string, any>;
  category?: string;
  tier?: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  onConfirm,
  design,
  customText,
  customStyling,
  category = 'birthday',
  tier = 'basic',
}: PreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const animationType = design?.animations?.scrollTrigger || 'auto-play';

  const hint =
    animationType === 'envelope-open' || animationType === 'scroll-to-open'
      ? 'Scroll down to open the envelope'
      : animationType === 'click-to-reveal'
      ? 'Click anywhere to reveal the card'
      : 'Card fades in automatically';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-stone-900/95 z-10 shrink-0">
            <div>
              <p className="text-white font-semibold text-sm">Card Preview</p>
              <p className="text-white/50 text-xs mt-0.5">{hint}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                <X size={16} />
                Back to Edit
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm transition-all"
              >
                Looks good
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>

          {/* Animation area — scrollable so scroll-to-open works */}
          <div className="flex-1 overflow-y-auto">
            {(animationType === 'envelope-open' || animationType === 'scroll-to-open') && (
              <ScrollToOpen
                content={customText}
                design={design}
                styling={customStyling}
                cardId="preview"
                category={category}
                tier={tier}
                isPreview
              />
            )}

            {animationType === 'click-to-reveal' && (
              <ClickToReveal
                content={customText}
                design={design}
                styling={customStyling}
                cardId="preview"
                category={category}
                tier={tier}
                isPreview
              />
            )}

            {animationType === 'auto-play' && (
              <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-stone-100 to-stone-200">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full max-w-sm"
                >
                  <CardContent content={customText} design={design} styling={customStyling} />
                </motion.div>
              </div>
            )}
          </div>

          {/* Bottom confirm bar */}
          <div className="px-6 py-5 bg-stone-900/95 flex items-center justify-center gap-4 shrink-0 z-10">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl border-2 border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold text-sm transition-all"
            >
              ← Back to Edit
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              className="px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-all flex items-center gap-2"
            >
              Add Recipients
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
