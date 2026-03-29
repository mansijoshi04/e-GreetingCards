import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service - Giflove',
  description: 'Terms and conditions for using the Giflove greeting card platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-stone-900 mb-4">Terms of Service</h1>
        <p className="text-stone-500 mb-12">Last updated: March 2024</p>

        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-stone-600 leading-relaxed">
              By using Giflove, you agree to these Terms of Service. If you do not agree, please do not
              use the platform.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">2. Acceptable Use</h2>
            <p className="text-stone-600 leading-relaxed mb-3">You agree not to use Giflove to:</p>
            <ul className="list-disc list-inside space-y-2 text-stone-600">
              <li>Send harassing, abusive, or hateful messages.</li>
              <li>Spam recipients with unsolicited cards.</li>
              <li>Impersonate another person or entity.</li>
              <li>Violate any applicable laws or regulations.</li>
              <li>Attempt to reverse-engineer or exploit the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">3. Card Expiry</h2>
            <p className="text-stone-600 leading-relaxed">
              All cards expire 7 days after creation. After expiry, the card link becomes inactive and the
              content is permanently deleted. We do not offer extensions to card expiry periods.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">4. Payment Terms</h2>
            <p className="text-stone-600 leading-relaxed">
              Cards are priced at $3 (Basic) or $5 (Premium) per card. Payment is processed by Paddle at
              the time of checkout. All prices are in USD. We reserve the right to change pricing with
              reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">5. Intellectual Property</h2>
            <p className="text-stone-600 leading-relaxed">
              All card templates, designs, and animations are the intellectual property of Giflove or our
              licensed designers. You may use the templates to create personalised cards for personal use
              only. Reproducing, redistributing, or reselling templates is prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-stone-600 leading-relaxed">
              Giflove is provided &quot;as is&quot;. We are not liable for any indirect, incidental, or consequential
              damages arising from your use of the platform, including failed email deliveries or data loss.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">7. Contact</h2>
            <p className="text-stone-600 leading-relaxed">
              Questions about these terms? Email{' '}
              <a href="mailto:legal@giflove.com" className="text-rose-500 hover:text-rose-600">
                legal@giflove.com
              </a>.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
