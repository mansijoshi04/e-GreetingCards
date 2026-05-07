import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Heart } from 'lucide-react';

const VALUES = [
  { Icon: Sparkles, body: 'Animated cards that earn a re-watch — not a swipe-past.' },
  { Icon: Zap, body: 'Sixty seconds from picking a template to hitting send.' },
  { Icon: Heart, body: 'No subscription. Pay once per card. That\'s it.' },
];

export const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-vellum-base text-ink-espresso pt-28 pb-20 px-4">
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— About —</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-4">Greetings worth being seen.</h1>
      <p className="text-lg text-ink-espresso/75 leading-relaxed mb-12 max-w-2xl">
        GifLove makes animated digital greeting cards that feel like a moment, not a message —
        envelopes that scroll open, candles you blow out, balloons you pop. Built in Ottawa, Canada,
        for the people who'd rather send something memorable than another text.
      </p>

      <section className="flex flex-col gap-5 mb-16">
        {VALUES.map(({ Icon, body }) => (
          <div key={body} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-pop-violet/15 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-pop-violet" />
            </div>
            <p className="text-base text-ink-espresso/80 leading-relaxed pt-2">{body}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4 mb-16">
        <h2 className="font-serif text-3xl">Why we built this</h2>
        <p className="text-base text-ink-espresso/80 leading-relaxed">
          Greeting cards turned into noise — a row of identical e-cards, a sea of generic graphics, a
          link that opens once and gets buried. We wanted the opposite: a card that has personality,
          plays only when the recipient earns it, and stays watchable while the moment lasts.
        </p>
        <p className="text-base text-ink-espresso/80 leading-relaxed">
          So GifLove cards are short-lived on purpose. Free links last 3 days. Premium 14. Bulk 30.
          Long enough to feel like an occasion. Not so long that they become forever artifacts.
        </p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/browse"
          className="inline-block bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-8 py-3.5 rounded-full transition-colors text-center"
        >
          Pick your card
        </Link>
        <Link
          to="/contact"
          className="inline-block border border-ink-espresso text-ink-espresso hover:bg-ink-espresso hover:text-vellum-base font-semibold px-8 py-3.5 rounded-full transition-colors text-center"
        >
          Get in touch
        </Link>
      </div>
    </div>
  </div>
);
