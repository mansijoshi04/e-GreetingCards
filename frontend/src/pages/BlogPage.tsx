import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const POSTS = [
  {
    title: 'Why animated greetings stick',
    date: 'May 2026',
    excerpt: 'Static cards get a glance. Animated ones get re-watched, screenshotted, and sent to a friend. We dig into the psychology of motion in personal messages.',
    tint: 'bg-pop-rose/10 border-pop-rose/30',
  },
  {
    title: 'A short history of greeting cards (and why they need to evolve)',
    date: 'April 2026',
    excerpt: 'From Victorian die-cuts to Hallmark to e-cards to whatever this is. The format has been overdue for a refresh.',
    tint: 'bg-pop-violet/10 border-pop-violet/30',
  },
  {
    title: '5 ways to make a Premium card unforgettable',
    date: 'April 2026',
    excerpt: 'Tips on photo selection, message length, palette choice, and timing. Small choices that make the difference between "nice" and "I cried."',
    tint: 'bg-pop-electric/25 border-ink-espresso/20',
  },
];

export const BlogPage: React.FC = () => (
  <div className="min-h-screen bg-vellum-base text-ink-espresso pt-28 pb-20 px-4">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— Journal —</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-4">The GifLove Blog</h1>
      <p className="text-lg text-ink-espresso/70 mb-16 max-w-2xl">
        Notes on greetings, design, animation, and the small moments that make a message land.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {POSTS.map((p, i) => (
          <motion.a
            key={p.title}
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`block rounded-2xl border p-6 transition-transform hover:-translate-y-1 ${p.tint}`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-ink-espresso/60 mb-3">{p.date}</p>
            <h2 className="font-serif text-2xl text-ink-espresso mb-3 leading-tight">{p.title}</h2>
            <p className="text-sm text-ink-espresso/75 leading-relaxed mb-4">{p.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-espresso">
              Read more <ArrowRight size={14} />
            </span>
          </motion.a>
        ))}
      </div>

      <p className="text-sm text-ink-espresso/60 text-center mt-16">More posts coming soon.</p>
    </div>
  </div>
);
