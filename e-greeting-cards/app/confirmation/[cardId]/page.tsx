'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ConfirmationPageProps {
  params: {
    cardId: string;
  };
  searchParams: {
    session_id?: string;
  };
}

interface CardData {
  id: string;
  linkToken: string;
  senderName: string;
  expiresAt: string;
  recipients: Array<{ recipientEmail: string }>;
}

export default function ConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetch(`/api/cards/${params.cardId}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.message || data.error || 'Failed to load card details'
          );
        }

        const data = await response.json();
        setCardData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load card');
        setLoading(false);
      }
    };

    fetchCardData();
  }, [params.cardId]);

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';
  const cardUrl = cardData
    ? `${baseUrl}/card/${cardData.linkToken}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this special greeting card I sent you! ${cardUrl}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = 'Check out my greeting card!';
    const body = `I sent you a special greeting card! Open it here: ${cardUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-gray-600 font-medium">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Link
            href="/create"
            className="text-pink-600 hover:text-pink-700 font-semibold"
          >
            ← Back to Create
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-pink-600 hover:text-pink-700 font-semibold">
            ← Back Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-headline">
              Payment Successful!
            </h1>
            <p className="text-gray-600">Your card has been created and emails are being sent.</p>
          </motion.div>

          {/* Status Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
          >
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span className="text-gray-700">
                  Card created and ready to view
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span className="text-gray-700">
                  Emails sent to all recipients
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span className="text-gray-700">
                  Link valid for 7 days
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shareable Link Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Card Link</h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Card URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                  {cardUrl}
                </code>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className={`w-full py-3 rounded-lg font-semibold transition-colors mb-4 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {copied ? '✓ Link Copied!' : 'Copy Link to Clipboard'}
            </motion.button>
          </motion.div>

          {/* Share Options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Share Your Card</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <span>💬</span>
                WhatsApp
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmailShare}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <span>📧</span>
                Email
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Just%20sent%20an%20amazing%20greeting%20card!%20${encodeURIComponent(cardUrl)}`, '_blank')}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
              >
                <span>𝕏</span>
                Twitter
              </motion.button>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
          >
            <p className="text-sm text-blue-800">
              <strong>💡 What's Next?</strong><br />
              Recipients will receive an email with your card link. They can open it anytime within the next 7 days. You can track when they open it in your dashboard.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4"
          >
            {cardData && (
              <Link
                href={`/card/${cardData.linkToken}`}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                View Your Card
              </Link>
            )}

            <Link
              href="/create"
              className={`${cardData ? 'flex-1' : 'flex-1'} py-3 px-4 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors text-center`}
            >
              Create Another Card
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
