import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ConfirmationPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const linkToken = sessionStorage.getItem('giflove_link_token');
  const expiresAt = sessionStorage.getItem('giflove_expires_at');
  const cardUrl = linkToken
    ? `${window.location.origin}/card/${linkToken}`
    : null;

  const expiryLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
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
    window.open(`https://wa.me/?text=${encodeURIComponent(`I sent you a card! Open it here: ${cardUrl}`)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-md bg-white rounded-3xl border border-stone-100 shadow-xl p-8 flex flex-col items-center text-center gap-6"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center"
        >
          <Check size={32} className="text-green-500" />
        </motion.div>

        <div>
          <h1
            className="text-2xl font-bold text-stone-800 mb-1"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Your card is ready!
          </h1>
          <p className="text-stone-500 text-sm">
            Share the link below with your recipient.
            {expiryLabel && <> The card expires on <strong>{expiryLabel}</strong>.</>}
          </p>
        </div>

        {/* Card link */}
        {cardUrl ? (
          <div className="w-full bg-stone-50 rounded-2xl border border-stone-200 p-4 flex flex-col gap-3">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">Your card link</p>
            <p className="text-sm text-stone-700 break-all font-mono">{cardUrl}</p>
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {copied ? (
                <><Check size={16} /> Copied!</>
              ) : (
                <><Copy size={16} /> Copy Link</>
              )}
            </button>
          </div>
        ) : (
          <div className="w-full bg-stone-50 rounded-2xl border border-stone-200 p-4 text-sm text-stone-400 text-center">
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
              className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              <ExternalLink size={14} /> Preview Card
            </a>
          )}
        </div>

        {/* Footer links */}
        <div className="flex gap-4 text-xs text-stone-400">
          <Link to="/browse" className="hover:text-rose-500 transition-colors">
            Send another card
          </Link>
          <span>·</span>
          <Link to="/" className="hover:text-rose-500 transition-colors">
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
