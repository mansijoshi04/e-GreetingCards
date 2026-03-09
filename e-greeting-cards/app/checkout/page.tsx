'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CardDraft {
  templateId: string;
  customText: Record<string, string>;
  customStyling: Record<string, any>;
  senderName: string;
  senderEmail?: string;
  recipients: string[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cardDraft, setCardDraft] = useState<CardDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [templatePrice, setTemplatePrice] = useState<number | null>(null);

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

      // Fetch template to get price
      const fetchTemplatePrice = async () => {
        try {
          const response = await fetch(`/api/templates/${parsedDraft.templateId}`);
          if (response.ok) {
            const template = await response.json();
            setTemplatePrice(template.priceCents / 100);
          }
        } catch (error) {
          console.error('Error fetching template price:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTemplatePrice();
    } catch (error) {
      console.error('Error loading card draft:', error);
      router.push('/create');
    }
  }, [router]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!cardDraft) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Call create-session API
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardDraft),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setIsProcessing(false);
      console.error('Checkout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cardDraft) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <Link href="/recipients" className="text-pink-600 hover:text-pink-700 font-semibold">
              ← Back to Recipients
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2 font-headline">
              Review & Pay
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-white rounded-xl shadow-lg p-8 space-y-8"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-headline">Order Summary</h2>

              {/* From */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-blue-50 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-gray-600 mb-1">From</p>
                <p className="font-semibold text-gray-900">{cardDraft.senderName}</p>
                {cardDraft.senderEmail && (
                  <p className="text-sm text-gray-600">{cardDraft.senderEmail}</p>
                )}
              </motion.div>

              {/* Recipients */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-50 rounded-lg p-4"
              >
                <p className="text-sm text-gray-600 mb-3">To ({cardDraft.recipients.length} recipient{cardDraft.recipients.length !== 1 ? 's' : ''})</p>
                <ul className="space-y-2">
                  {cardDraft.recipients.map((email, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      {email}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Card Preview Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-gray-200 pt-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Card Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Headline:</strong> {cardDraft.customText.headline || '(Not set)'}
                </p>
                <p>
                  <strong>Message:</strong> {cardDraft.customText.body || '(Not set)'}
                </p>
                <p>
                  <strong>Signature:</strong> {cardDraft.customText.signature || '(Not set)'}
                </p>
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800"
            >
              <p>
                💡 Your card will be sent to {cardDraft.recipients.length} recipient{cardDraft.recipients.length !== 1 ? 's' : ''} via email with a unique link. The link will expire in 7 days.
              </p>
            </motion.div>
          </motion.div>

          {/* Payment Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24"
          >
            <h3 className="font-bold text-lg text-gray-900 mb-6">Payment</h3>

            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Card</span>
                <span className="font-semibold text-gray-900">
                  ${templatePrice ? templatePrice.toFixed(2) : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recipients</span>
                <span className="font-semibold text-gray-900">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold text-gray-900">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-pink-600">
                ${templatePrice ? templatePrice.toFixed(2) : '0.00'}
              </span>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              onClick={handleContinue}
              disabled={isProcessing}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isProcessing
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Continue to Payment'}
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
