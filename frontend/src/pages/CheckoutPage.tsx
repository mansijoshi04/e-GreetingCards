import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { createCard } from '../services/api';
import type { Tier } from '../types/card';

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: string) => void };
      Initialize: (config: { token: string; eventCallback?: (data: PaddleEvent) => void }) => void;
      Checkout: { open: (config: PaddleCheckoutConfig) => void; close: () => void };
    };
  }
}

interface PaddleEvent {
  name: string;
  data?: { transaction_id?: string };
}

interface PaddleCheckoutConfig {
  items?: { priceId: string; quantity: number }[];
  customData?: Record<string, string>;
  settings?: { theme?: string; displayMode?: string; locale?: string; successUrl?: string };
}

const PADDLE_PRICE_IDS: Record<Tier, string> = {
  free: '',
  essential: import.meta.env.VITE_PADDLE_PRICE_ESSENTIAL ?? 'pri_placeholder_essential',
  premium: import.meta.env.VITE_PADDLE_PRICE_PREMIUM ?? 'pri_placeholder_premium',
  bulk: import.meta.env.VITE_PADDLE_PRICE_BULK ?? 'pri_placeholder_bulk',
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ready' | 'processing' | 'creating' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  // Prevents checkout.closed from navigating away after checkout.completed fires
  const paymentDone = useRef(false);

  const cardData = (() => {
    try {
      const raw = sessionStorage.getItem('giflove_card');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  useEffect(() => {
    if (!cardData) { navigate('/browse'); return; }

    if (cardData.tier === 'free') {
      handleFreeCard();
      return;
    }

    loadPaddle();
  }, []);

  const handleFreeCard = async () => {
    setStatus('creating');
    try {
      const res = await createCard({
        templateSlug: cardData.slug,
        tier: 'free',
        senderName: cardData.senderName,
        senderEmail: cardData.senderEmail ?? '',
        customText: cardData.customText,
        customStyling: cardData.customStyling,
        recipients: cardData.recipients ?? [],
      });
      sessionStorage.setItem('giflove_link_token', res.linkToken);
      sessionStorage.setItem('giflove_expires_at', res.expiresAt);
      navigate('/confirmation');
    } catch (e) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Failed to create card.');
    }
  };

  const loadPaddle = () => {
    if (window.Paddle) {
      initPaddle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = initPaddle;
    script.onerror = () => {
      setStatus('error');
      setErrorMsg('Failed to load payment provider.');
    };
    document.head.appendChild(script);
  };

  const initPaddle = () => {
    if (!window.Paddle) return;
    const env = import.meta.env.VITE_PADDLE_ENVIRONMENT ?? 'sandbox';
    if (env === 'sandbox') {
      window.Paddle.Environment.set('sandbox');
    }
    window.Paddle.Initialize({
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN ?? '',
      eventCallback: handlePaddleEvent,
    });
    setStatus('ready');
    openCheckout();
  };

  const openCheckout = () => {
    if (!window.Paddle) return;
    const priceId = PADDLE_PRICE_IDS[cardData.tier as Tier];
    if (!priceId) { setStatus('error'); setErrorMsg('No price configured for this tier.'); return; }

    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { templateSlug: cardData.slug, tier: cardData.tier },
      settings: {
        theme: 'light',
        displayMode: 'overlay',
        successUrl: `${window.location.origin}/confirmation`,
      },
    });
  };

  const handlePaddleEvent = async (event: PaddleEvent) => {
    if (event.name === 'checkout.completed') {
      paymentDone.current = true;
      window.Paddle?.Checkout.close();
      setStatus('creating');
      const paddleTransactionId = event.data?.transaction_id;
      try {
        const res = await createCard({
          templateSlug: cardData.slug,
          tier: cardData.tier,
          senderName: cardData.senderName,
          senderEmail: cardData.senderEmail ?? '',
          customText: cardData.customText,
          customStyling: cardData.customStyling,
          recipients: cardData.recipients ?? [],
          scheduledAt: cardData.scheduledAt,
          paddleTransactionId,
        });
        sessionStorage.setItem('giflove_link_token', res.linkToken);
        sessionStorage.setItem('giflove_expires_at', res.expiresAt);
        navigate('/confirmation');
      } catch (e) {
        setStatus('error');
        setErrorMsg(e instanceof Error ? e.message : 'Payment succeeded but card creation failed. Contact support.');
      }
    }

    // Paddle fires checkout.closed right after checkout.completed — ignore it
    // if we've already handled the successful payment.
    if (event.name === 'checkout.closed' && !paymentDone.current) {
      navigate('/checkout/recipients');
    }
  };

  return (
    <div className="min-h-screen bg-vellum-base flex flex-col items-center justify-center px-4 gap-6 pt-16">
      {status === 'loading' || status === 'ready' || status === 'processing' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-pop-violet/10 border border-pop-violet/30 flex items-center justify-center">
            {status === 'loading' ? (
              <Loader2 size={28} className="text-pop-violet animate-spin" />
            ) : (
              <Lock size={28} className="text-pop-violet" />
            )}
          </div>
          <h2 className="font-serif text-2xl text-ink-espresso">
            {status === 'loading' ? 'Loading payment…' : 'Complete your payment'}
          </h2>
          <p className="text-ink-espresso/70 text-sm max-w-xs">
            Secure checkout powered by Paddle. Your card will be created instantly after payment.
          </p>
          {status === 'ready' && (
            <button
              onClick={openCheckout}
              className="text-pop-violet text-sm font-semibold hover:text-pop-rose"
            >
              Click here if checkout didn't open
            </button>
          )}
        </motion.div>
      ) : status === 'creating' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <Sparkles size={32} className="text-pop-rose" />
          <Loader2 size={24} className="text-pop-violet animate-spin" />
          <p className="font-serif text-2xl text-ink-espresso">
            Creating your card…
          </p>
          <p className="text-ink-espresso/70 text-sm">Just a moment!</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center max-w-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-vellum-base border border-ink-espresso/15 flex items-center justify-center">
            <AlertCircle size={28} className="text-ink-espresso/60" />
          </div>
          <h2 className="font-serif text-2xl text-ink-espresso">
            Something went wrong
          </h2>
          <p className="text-ink-espresso/70 text-sm">{errorMsg}</p>
          <button
            onClick={() => navigate('/checkout/recipients')}
            className="bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
          >
            Go back
          </button>
        </motion.div>
      )}
    </div>
  );
};
