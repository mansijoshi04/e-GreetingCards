import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy - Giflove',
  description: 'Giflove refund and cancellation policy for digital greeting cards.',
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-stone-900 mb-4">Refund Policy</h1>
        <p className="text-stone-500 mb-12">Last updated: March 2024</p>

        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Digital Goods</h2>
            <p className="text-stone-600 leading-relaxed">
              Giflove sells digital greeting cards that are delivered instantly upon payment. Because the card
              is a digital product that is created and made available immediately, all sales are generally
              final.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Eligibility for a Refund</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              We will issue a full refund if:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600">
              <li>Your refund request is made within <strong>24 hours</strong> of purchase.</li>
              <li>A technical error on our end prevented the card from being delivered or displayed correctly.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">How to Request a Refund</h2>
            <p className="text-stone-600 leading-relaxed">
              Email us at{' '}
              <a href="mailto:support@giflove.com" className="text-rose-500 hover:text-rose-600">
                support@giflove.com
              </a>{' '}
              within 24 hours of your purchase. Please include the email address you used at checkout and a
              brief description of the issue. We will respond within one business day.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Processing Time</h2>
            <p className="text-stone-600 leading-relaxed">
              Approved refunds are processed through Paddle and typically appear on your statement within
              5–10 business days depending on your payment provider.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
