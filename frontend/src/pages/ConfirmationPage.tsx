import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Copy, ExternalLink, MessageCircle, Users, Calendar, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TierBadge } from '../components/ui/TierBadge';
import { TEMPLATES } from '../templates/registry';

interface StoredCard {
  slug: string;
  tier: string;
  customText: { headline: string; body: string; signature: string };
  senderName: string;
  senderEmail?: string;
  recipients?: { email: string; name?: string }[];
  scheduledAt?: string;
}

export const ConfirmationPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const linkToken = sessionStorage.getItem('giflove_link_token');
  const expiresAt = sessionStorage.getItem('giflove_expires_at');

  const cardData = (() => {
    try {
      const raw = sessionStorage.getItem('giflove_card');
      return raw ? (JSON.parse(raw) as StoredCard) : null;
    } catch { return null; }
  })();

  const template = cardData ? TEMPLATES.find(t => t.slug === cardData.slug) : null;

  const cardUrl = linkToken
    ? `${window.location.origin}/card/${linkToken}`
    : null;

  const expiryLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const scheduledLabel = cardData?.scheduledAt
    ? new Date(cardData.scheduledAt).toLocaleString('en-CA', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
    : null;

  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.5 } });
  }, []);

  const handleCopy = async () => {
    if (!cardUrl) return;
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!cardUrl) return;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`I sent you a card! Open it here: ${cardUrl}`)}`,
      '_blank',
    );
  };

  return (
    <div className="min-h-screen bg-vellum-base flex flex-col items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-md flex flex-col gap-4"
      >
        {/* Success card */}
        <div className="bg-vellum-base rounded-3xl border border-ink-espresso/15 shadow-xl p-8 flex flex-col items-center text-center gap-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-pop-electric border border-ink-espresso/20 flex items-center justify-center"
          >
            <Check size={40} className="text-ink-espresso" strokeWidth={3} />
          </motion.div>

          <div>
            <h1 className="font-serif text-3xl text-ink-espresso mb-1">
              Your card is ready!
            </h1>
            <p className="text-ink-espresso/70 text-sm">
              {scheduledLabel
                ? `Scheduled to send on ${scheduledLabel}.`
                : 'Your card has been sent.'}
              {expiryLabel && <> Expires <strong>{expiryLabel}</strong>.</>}
            </p>
          </div>

          {/* Card link */}
          {cardUrl ? (
            <div className="w-full bg-vellum-base rounded-2xl border border-ink-espresso/15 p-4 flex flex-col gap-3">
              <p className="text-xs font-medium text-ink-espresso/50 uppercase tracking-widest">Your card link</p>
              <p className="text-sm text-ink-espresso break-all font-mono">{cardUrl}</p>
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  copied ? 'bg-pop-electric text-ink-espresso' : 'bg-pop-violet hover:bg-pop-rose text-vellum-base'
                }`}
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
              </button>
            </div>
          ) : (
            <div className="w-full bg-vellum-base rounded-2xl border border-ink-espresso/15 p-4 text-sm text-ink-espresso/50 text-center">
              No link found — check your email for delivery confirmation.
            </div>
          )}

          {/* Share buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
            {cardUrl && (
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-vellum-base border border-ink-espresso/20 hover:bg-ink-espresso hover:text-vellum-base text-ink-espresso text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                <ExternalLink size={14} /> Preview Card
              </a>
            )}
          </div>
        </div>

        {/* Card summary panel */}
        {cardData && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-vellum-base rounded-3xl border border-ink-espresso/15 shadow-sm p-6 flex flex-col gap-4"
          >
            {/* Template + tier */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-pop-rose" />
                <span className="font-serif text-ink-espresso text-lg">

                  {template?.title ?? cardData.slug}
                </span>
              </div>
              <TierBadge tier={cardData.tier as never} />
            </div>

            {/* Card text preview */}
            <div className="bg-vellum-base border border-ink-espresso/10 rounded-xl p-3 flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-ink-espresso">{cardData.customText.headline}</p>
              <p className="text-xs text-ink-espresso/70 line-clamp-2">{cardData.customText.body}</p>
              <p className="text-xs text-ink-espresso/50 mt-1 italic">— {cardData.customText.signature}</p>
            </div>

            {/* From */}
            <div className="flex items-center gap-2 text-xs text-ink-espresso/70">
              <span className="font-medium text-ink-espresso">From:</span> {cardData.senderName}
              {cardData.senderEmail && <span className="text-ink-espresso/50">({cardData.senderEmail})</span>}
            </div>

            {/* Recipients */}
            {cardData.recipients && cardData.recipients.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-ink-espresso/70">
                  <Users size={13} /> Recipients
                </div>
                <div className="flex flex-col gap-1">
                  {cardData.recipients.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-ink-espresso">
                      <div className="w-5 h-5 rounded-full bg-pop-rose/15 flex items-center justify-center text-pop-rose font-bold text-[10px] flex-shrink-0">
                        {(r.name || r.email)[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{r.name || r.email}</span>
                      {r.name && <span className="text-ink-espresso/50">{r.email}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled send time */}
            {scheduledLabel && (
              <div className="flex items-center gap-2 text-xs text-ink-espresso/70 bg-pop-electric/20 border border-ink-espresso/15 rounded-xl px-3 py-2">
                <Calendar size={13} className="text-ink-espresso flex-shrink-0" />
                <span>Scheduled for <strong className="text-ink-espresso">{scheduledLabel}</strong></span>
              </div>
            )}
          </motion.div>
        )}

        {/* Footer links */}
        <div className="flex justify-center gap-4 text-xs text-ink-espresso/50 pt-2">
          <Link to="/browse" className="hover:text-pop-rose transition-colors">
            Send another card
          </Link>
          <span>·</span>
          <Link to="/" className="hover:text-pop-rose transition-colors">
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
