import React from 'react';
import { Mail, Instagram, Twitter, Music2, Bookmark } from 'lucide-react';

const SUPPORT_EMAIL = 'hello@giflove.ca';

const socialClass =
  'p-3 rounded-full border border-ink-espresso/15 text-ink-espresso/70 hover:text-pop-rose hover:border-pop-rose transition-colors';

export const ContactPage: React.FC = () => (
  <div className="min-h-screen bg-vellum-base text-ink-espresso pt-28 pb-20 px-4">
    <div className="max-w-2xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— Contact —</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-4">Say hello.</h1>
      <p className="text-lg text-ink-espresso/75 leading-relaxed mb-12">
        Feedback, partnerships, or a card that didn't behave — we'd love to hear from you.
      </p>

      <section className="rounded-2xl border border-ink-espresso/15 p-6 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pop-rose/15 flex items-center justify-center shrink-0">
            <Mail size={20} className="text-pop-rose" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-espresso/60 mb-1">Email</p>
            <p className="font-serif text-2xl">{SUPPORT_EMAIL}</p>
          </div>
        </div>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-block bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-6 py-3 rounded-full transition-colors text-sm text-center"
        >
          Email us
        </a>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl mb-4">Follow along</h2>
        <div className="flex items-center gap-3">
          <a href="#" aria-label="Instagram" className={socialClass}><Instagram size={18} /></a>
          <a href="#" aria-label="TikTok" className={socialClass}><Music2 size={18} /></a>
          <a href="#" aria-label="X / Twitter" className={socialClass}><Twitter size={18} /></a>
          <a href="#" aria-label="Pinterest" className={socialClass}><Bookmark size={18} /></a>
        </div>
      </section>

      <section className="text-sm text-ink-espresso/65 leading-relaxed">
        <p>
          For refund questions, see our{' '}
          <a href="/refund" className="text-pop-violet hover:text-pop-rose underline">refund policy</a>.
          For privacy questions, see our{' '}
          <a href="/privacy" className="text-pop-violet hover:text-pop-rose underline">privacy policy</a>.
        </p>
        <p className="mt-3">Made in Ottawa, Canada.</p>
      </section>
    </div>
  </div>
);
