import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Trash2, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { RECIPIENT_LIMITS, TIER_PRICES_DISPLAY, SCHEDULING_TIERS, PLATFORM_EMAIL_TIERS } from '../constants';
import { TierBadge } from '../components/ui/TierBadge';
import type { Tier } from '../types/card';

interface StoredCard {
  slug: string;
  tier: Tier;
  customText: { headline: string; body: string; signature: string };
  customStyling: Record<string, string>;
  senderName: string;
}

interface Recipient {
  email: string;
  name: string;
}

export const RecipientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [card, setCard] = useState<StoredCard | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([{ email: '', name: '' }]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem('giflove_card');
    if (!stored) { navigate('/browse'); return; }
    const parsed: StoredCard = JSON.parse(stored);
    setCard(parsed);
    setSenderName(parsed.senderName || '');
  }, []);

  if (!card) return null;

  const tier = card.tier;
  const maxRecipients = RECIPIENT_LIMITS[tier];
  const canSchedule = (SCHEDULING_TIERS as readonly string[]).includes(tier);
  const platformSendsEmail = (PLATFORM_EMAIL_TIERS as readonly string[]).includes(tier);

  const addRecipient = () => {
    if (recipients.length < maxRecipients) {
      setRecipients(r => [...r, { email: '', name: '' }]);
    }
  };

  const removeRecipient = (i: number) => {
    setRecipients(r => r.filter((_, idx) => idx !== i));
  };

  const updateRecipient = (i: number, field: keyof Recipient, value: string) => {
    setRecipients(r => r.map((rec, idx) => idx === i ? { ...rec, [field]: value } : rec));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!senderName.trim()) errs.senderName = 'Your name is required so the recipient knows who sent this.';
    if (platformSendsEmail && !senderEmail.trim()) errs.senderEmail = 'Your email is required for delivery confirmation.';

    const validRecipients = recipients.filter(r => r.email.trim());
    if (validRecipients.length === 0) errs.recipients = 'Add at least one recipient email.';
    validRecipients.forEach((r, i) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
        errs[`recipient_${i}`] = 'Invalid email address';
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    const validRecipients = recipients.filter(r => r.email.trim());
    sessionStorage.setItem('giflove_card', JSON.stringify({
      ...card,
      senderName,
      senderEmail,
      recipients: validRecipients,
      scheduledAt: scheduledAt || undefined,
    }));

    if (tier === 'free') {
      navigate('/checkout/payment');
    } else {
      navigate('/checkout/payment');
    }
  };

  const minScheduledAt = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-16">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-8 text-center">
        <div className="flex justify-center mb-3">
          <TierBadge tier={tier} />
        </div>
        <h1
          className="text-2xl font-bold text-stone-800"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          Who's receiving this?
        </h1>
        <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
          {platformSendsEmail
            ? `We'll send the card on your behalf to up to ${maxRecipients} ${maxRecipients === 1 ? 'recipient' : 'recipients'}.`
            : 'You\'ll get a shareable link to send yourself.'}
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-8 flex flex-col gap-6">
        {/* Sender info */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-stone-800 text-sm">From you</h2>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Your name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all ${
                errors.senderName ? 'border-red-300 bg-red-50' : 'border-stone-200'
              }`}
              placeholder="e.g. Sarah"
            />
            {errors.senderName && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle size={12} /> {errors.senderName}
              </p>
            )}
          </div>

          {platformSendsEmail && (
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Your email <span className="text-rose-400">*</span>
                <span className="text-stone-400 ml-1">(for delivery confirmation)</span>
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all ${
                  errors.senderEmail ? 'border-red-300 bg-red-50' : 'border-stone-200'
                }`}
                placeholder="you@example.com"
              />
              {errors.senderEmail && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle size={12} /> {errors.senderEmail}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recipients */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-800 text-sm">
              Recipients
              {platformSendsEmail && (
                <span className="text-stone-400 font-normal ml-1">({maxRecipients} max)</span>
              )}
            </h2>
            {errors.recipients && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors.recipients}
              </p>
            )}
          </div>

          {!platformSendsEmail && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              Free tier — you'll receive a shareable link to send yourself. No email delivery.
            </div>
          )}

          <div className="flex flex-col gap-3">
            {recipients.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 items-start"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="email"
                    value={rec.email}
                    onChange={e => updateRecipient(i, 'email', e.target.value)}
                    disabled={!platformSendsEmail && i > 0}
                    className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all ${
                      errors[`recipient_${i}`] ? 'border-red-300' : 'border-stone-200'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    placeholder="recipient@example.com"
                  />
                  {errors[`recipient_${i}`] && (
                    <p className="text-xs text-red-500">{errors[`recipient_${i}`]}</p>
                  )}
                </div>
                {recipients.length > 1 && (
                  <button
                    onClick={() => removeRecipient(i)}
                    className="mt-1 p-2 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {platformSendsEmail && recipients.length < maxRecipients && (
            <button
              onClick={addRecipient}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <Plus size={14} /> Add another recipient
            </button>
          )}
        </div>

        {/* Scheduling */}
        {canSchedule && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-rose-400" />
              <h2 className="font-semibold text-stone-800 text-sm">When to send</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setScheduledAt('')}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  !scheduledAt ? 'bg-rose-500 text-white border-rose-500' : 'border-stone-200 text-stone-600 hover:border-rose-200'
                }`}
              >
                Send now
              </button>
              <button
                onClick={() => setScheduledAt(minScheduledAt)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  scheduledAt ? 'bg-rose-500 text-white border-rose-500' : 'border-stone-200 text-stone-600 hover:border-rose-200'
                }`}
              >
                Schedule
              </button>
            </div>
            {scheduledAt && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  min={minScheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Continue */}
        <motion.button
          onClick={handleContinue}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md flex items-center justify-center gap-2"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          {tier === 'free' ? 'Create My Card' : `Continue to Payment — ${TIER_PRICES_DISPLAY[tier]}`}
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};
