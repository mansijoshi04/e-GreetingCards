import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const STEPS = [
  {
    n: 1,
    title: 'Pick a template',
    body: 'Browse 12+ animated cards across every occasion — birthdays, anniversaries, graduations, thank-yous, congratulations, and get-well-soons. Each card has its own personality.',
  },
  {
    n: 2,
    title: 'Customize it',
    body: 'Edit the headline, body, and sign-off. Swap the colour palette. On Premium and Bulk, drop in a photo or short video to make it personal.',
  },
  {
    n: 3,
    title: 'Pay once',
    body: 'No subscription, ever. Pay per card via Paddle (Apple Pay, Google Pay, card — whatever you have). Free tier costs nothing.',
  },
  {
    n: 4,
    title: 'Send the link',
    body: 'We email it on your behalf to up to 50 recipients (depending on tier), or hand you a shareable link to drop wherever. Schedule it for the perfect moment.',
  },
];

const FAQ = [
  { q: 'How long does the link work?', a: 'Free links last 3 days. Essential 7. Premium 14. Bulk 30. Cards are designed to feel like an occasion, not a forever artifact.' },
  { q: 'Can recipients reply?', a: 'Not through the card itself. The link includes your name so recipients know who sent it and can reach back through their normal channels.' },
  { q: 'Do I need an account?', a: 'No. Just pay and send. We email you the receipt and a copy of the link.' },
  { q: 'What about refunds?', a: 'See our refund policy — short version: unsent scheduled cards can be refunded; delivered cards cannot.' },
];

export const HowItWorksPage: React.FC = () => (
  <div className="min-h-screen bg-vellum-base text-ink-espresso pt-28 pb-20 px-4">
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— How It Works —</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-4">Four steps. Two minutes.</h1>
      <p className="text-lg text-ink-espresso/70 mb-16 max-w-2xl">
        From picking a template to hitting send. Here's how every GifLove card gets made.
      </p>

      <div className="flex flex-col gap-12 mb-24">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-6 items-start"
          >
            <div className="w-16 h-16 rounded-full bg-pop-rose border border-pop-rose/60 flex items-center justify-center shrink-0 shadow-[0_8px_24px_-8px_rgba(255,0,122,0.5)]">
              <span className="font-serif text-3xl text-vellum-base">{s.n}</span>
            </div>
            <div className="flex-1 pt-2">
              <h2 className="font-serif text-2xl mb-2">{s.title}</h2>
              <p className="text-base text-ink-espresso/75 leading-relaxed">{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— FAQ —</p>
        <h2 className="font-serif text-3xl mb-8">Common questions</h2>
        <div className="flex flex-col gap-6">
          {FAQ.map(item => (
            <div key={item.q} className="border-b border-ink-espresso/10 pb-6">
              <h3 className="font-serif text-xl mb-2">{item.q}</h3>
              <p className="text-base text-ink-espresso/75 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/browse"
          className="inline-block bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          Pick your card
        </Link>
      </div>
    </div>
  </div>
);
