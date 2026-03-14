import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - Giflove',
  description: 'How Giflove collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-stone-900 mb-4">Privacy Policy</h1>
        <p className="text-stone-500 mb-12">Last updated: March 2024</p>

        <div className="prose prose-stone max-w-none space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">1. Information We Collect</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              When you use Giflove, we collect the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600">
              <li><strong>Email addresses</strong> — your email (optional) and the email addresses of recipients you add.</li>
              <li><strong>Sender name</strong> — the name you provide when creating a card.</li>
              <li><strong>Card content</strong> — the headline, message, and signature you write.</li>
              <li><strong>Payment information</strong> — processed securely by Paddle. We do not store your card number or payment details.</li>
              <li><strong>Usage data</strong> — when a card is opened, the device type, and referral source, for tracking purposes shown to the card sender.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-stone-600">
              <li>To deliver greeting cards to recipients via email.</li>
              <li>To process payments through Paddle.</li>
              <li>To show senders when their cards have been opened.</li>
              <li>To improve our service and debug issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">3. Data Retention</h2>
            <p className="text-stone-600 leading-relaxed">
              Cards and their associated content are automatically deleted 7 days after creation. Email addresses
              collected for delivery purposes are not retained beyond the card's expiry period. Payment records
              are retained as required by law and by Paddle's terms of service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">4. Third-Party Services</h2>
            <p className="text-stone-600 leading-relaxed mb-3">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 text-stone-600">
              <li><strong>Paddle</strong> — payment processing. Subject to Paddle's privacy policy.</li>
              <li><strong>SendGrid</strong> — transactional email delivery.</li>
              <li><strong>Vercel</strong> — hosting and infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">5. Your Rights</h2>
            <p className="text-stone-600 leading-relaxed">
              You may request deletion of any personal data we hold about you by contacting us. Since cards
              expire after 7 days and are deleted automatically, most data is removed without any action needed
              on your part.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">6. Contact</h2>
            <p className="text-stone-600 leading-relaxed">
              For any privacy-related questions, please contact us at{' '}
              <a href="mailto:privacy@giflove.com" className="text-rose-500 hover:text-rose-600">
                privacy@giflove.com
              </a>.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
