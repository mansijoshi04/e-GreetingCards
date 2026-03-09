'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CardDraft {
  templateId: string;
  customText: Record<string, string>;
  customStyling: Record<string, any>;
}

export default function RecipientsPage() {
  const router = useRouter();
  const [cardDraft, setCardDraft] = useState<CardDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Load card draft from session storage
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('cardDraft');
      if (!draft) {
        router.push('/create');
        return;
      }

      const parsedDraft = JSON.parse(draft);
      setCardDraft(parsedDraft);
      setLoading(false);
    } catch (error) {
      console.error('Error loading card draft:', error);
      router.push('/create');
    }
  }, [router]);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle adding a new recipient field
  const handleAddRecipient = () => {
    if (recipients.length < 15) {
      setRecipients([...recipients, '']);
    }
  };

  // Handle removing a recipient field
  const handleRemoveRecipient = (index: number) => {
    const updated = recipients.filter((_, i) => i !== index);
    setRecipients(updated.length === 0 ? [''] : updated);
  };

  // Handle recipient email change
  const handleRecipientChange = (index: number, value: string) => {
    const updated = [...recipients];
    updated[index] = value;
    setRecipients(updated);

    // Clear error for this field if user is typing
    if (errors[`recipient-${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`recipient-${index}`];
      setErrors(newErrors);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate sender name
    if (!senderName.trim()) {
      newErrors.senderName = 'Sender name is required';
    }

    // Validate recipient emails
    const nonEmptyRecipients = recipients.filter(r => r.trim());

    if (nonEmptyRecipients.length === 0) {
      newErrors.recipients = 'Please add at least one recipient email';
    }

    nonEmptyRecipients.forEach((email, index) => {
      if (!isValidEmail(email)) {
        newErrors[`recipient-${recipients.indexOf(email)}`] = 'Invalid email format';
      }
    });

    // Validate sender email if provided
    if (senderEmail && !isValidEmail(senderEmail)) {
      newErrors.senderEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !cardDraft) {
      return;
    }

    setSubmitting(true);

    try {
      // Get non-empty recipient emails
      const recipientEmails = recipients
        .filter(r => r.trim())
        .filter(r => isValidEmail(r));

      // Save updated draft with sender and recipient info
      const updatedDraft = {
        ...cardDraft,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        recipients: recipientEmails,
      };

      sessionStorage.setItem('cardDraft', JSON.stringify(updatedDraft));

      // Navigate to checkout
      setTimeout(() => {
        router.push('/checkout');
      }, 300);
    } catch (error) {
      console.error('Error saving recipients:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-stone-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link href="/create" className="text-stone-500 hover:text-stone-700 text-sm font-medium">
            ← Back
          </Link>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-2">
            Add Recipients
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] border border-stone-200 p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Who should receive this card?
            </h2>
            <p className="text-stone-600">
              Add up to 15 recipients. We'll email them a link to view your card.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sender Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4"
            >
              <h3 className="text-lg font-serif font-semibold text-stone-900">From</h3>

              {/* Sender Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                    if (errors.senderName) {
                      const newErrors = { ...errors };
                      delete newErrors.senderName;
                      setErrors(newErrors);
                    }
                  }}
                  placeholder="e.g., Sarah"
                  maxLength={100}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.senderName
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-stone-200 focus:ring-rose-500/20'
                  }`}
                />
                {errors.senderName && (
                  <p className="text-rose-600 text-sm mt-1">{errors.senderName}</p>
                )}
              </div>

              {/* Sender Email */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
                  Your Email <span className="text-stone-400">(optional)</span>
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => {
                    setSenderEmail(e.target.value);
                    if (errors.senderEmail) {
                      const newErrors = { ...errors };
                      delete newErrors.senderEmail;
                      setErrors(newErrors);
                    }
                  }}
                  placeholder="e.g., sarah@example.com"
                  maxLength={255}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.senderEmail
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-stone-200 focus:ring-rose-500/20'
                  }`}
                />
                {errors.senderEmail && (
                  <p className="text-rose-600 text-sm mt-1">{errors.senderEmail}</p>
                )}
                <p className="text-xs text-stone-500 mt-1">
                  We'll send tracking updates to this email
                </p>
              </div>
            </motion.div>

            {/* Recipients Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-semibold text-stone-900">To</h3>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                  {recipients.filter(r => r.trim()).length}/15 recipients
                </span>
              </div>

              {errors.recipients && (
                <p className="text-rose-600 text-sm">{errors.recipients}</p>
              )}

              <div className="space-y-3">
                {recipients.map((email, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleRecipientChange(index, e.target.value)}
                        placeholder={`recipient${index + 1}@example.com`}
                        maxLength={255}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-stone-900 ${
                          errors[`recipient-${index}`]
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-stone-200 focus:ring-rose-500/20'
                        }`}
                      />
                      {errors[`recipient-${index}`] && (
                        <p className="text-rose-600 text-xs mt-1">
                          {errors[`recipient-${index}`]}
                        </p>
                      )}
                    </div>

                    {recipients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(index)}
                        className="px-3 py-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold"
                      >
                        ✕
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              {recipients.length < 15 && (
                <button
                  type="button"
                  onClick={handleAddRecipient}
                  className="w-full py-2 border-2 border-dashed border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-semibold text-sm"
                >
                  + Add Another Recipient
                </button>
              )}

              {recipients.length === 15 && (
                <p className="text-sm text-stone-500 text-center">
                  Maximum 15 recipients reached
                </p>
              )}
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900"
            >
              <p>
                💡 <strong>No account needed:</strong> Recipients get an email with a link. Cards expire in 7 days.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 pt-6 border-t border-stone-200"
            >
              <Link
                href="/create"
                className="flex-1 py-3 px-4 border-2 border-stone-200 rounded-2xl text-stone-700 hover:bg-stone-50 transition-colors font-semibold text-center"
              >
                ← Back
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!senderName || submitting}
                className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
                  senderName && !submitting
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Saving...' : 'Continue to Payment →'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
