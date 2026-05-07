import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, Clock, AlertCircle } from 'lucide-react';
import { getCard } from '../services/api';
import { getTemplate } from '../templates/registry';
import type { CardDetailResponse } from '../services/api';
import type { CardStyling, CardText } from '../types/card';

export const CardViewerPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [card, setCard] = useState<CardDetailResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error' | 'expired'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    getCard(token)
      .then(data => {
        // Check expiry client-side too
        if (new Date(data.expiresAt) < new Date()) {
          setStatus('expired');
          return;
        }
        setCard(data);
        setStatus('loaded');
      })
      .catch((e: Error) => {
        if (e.message.includes('404') || e.message.includes('410')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
      });
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-vellum-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-pop-violet animate-spin" />
          <p className="text-ink-espresso/70 text-sm">Opening your card…</p>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-vellum-base flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-vellum-base border border-ink-espresso/15 flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-ink-espresso/60" />
          </div>
          <h1 className="font-serif text-3xl text-ink-espresso mb-2">
            This card has expired
          </h1>
          <p className="text-ink-espresso/70 text-sm mb-6">
            GifLove cards are designed to feel special — they expire after a set time so they feel like a real occasion, not a forever link.
          </p>
          <Link
            to="/browse"
            className="inline-block bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
          >
            Send your own card →
          </Link>
        </motion.div>
      </div>
    );
  }

  if (status === 'error' || !card) {
    return (
      <div className="min-h-screen bg-vellum-base flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-vellum-base border border-ink-espresso/15 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-ink-espresso/60" />
          </div>
          <p className="text-ink-espresso font-medium">Card not found</p>
          <Link to="/" className="mt-4 block text-pop-violet text-sm font-semibold hover:text-pop-rose">Back to home</Link>
        </div>
      </div>
    );
  }

  const template = getTemplate(card.templateSlug);
  if (!template) {
    return (
      <div className="min-h-screen bg-vellum-base flex items-center justify-center">
        <p className="text-ink-espresso/70 text-sm">Unknown card template.</p>
      </div>
    );
  }

  const CardComponent = template.component;
  const customText: CardText = card.customText as CardText;
  const customStyling: CardStyling | undefined = card.customStyling
    ? (card.customStyling as unknown as CardStyling)
    : undefined;

  return (
    <div className="min-h-screen bg-vellum-base flex flex-col items-center justify-center px-4 py-8 gap-6">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
      >
        <CardComponent
          customText={customText}
          senderName={card.senderName}
          customStyling={customStyling}
          tier={card.tier as any}
          mediaUrl={card.mediaUrl}
          mediaType={card.mediaType}
          senderBranding={card.senderBranding}
          isPreview={false}
        />
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-ink-espresso/70 text-sm mb-3">
          Want to send a card like this?
        </p>
        <Link
          to="/browse"
          className="inline-block bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
        >
          Create your own on GifLove →
        </Link>
      </motion.div>
    </div>
  );
};
