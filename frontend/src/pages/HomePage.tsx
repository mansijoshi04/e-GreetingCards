import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Zap, Heart } from 'lucide-react';
import {
  TIER_PRICES_DISPLAY,
  RECIPIENT_LIMITS,
  LINK_EXPIRY_DAYS,
  TIER_DESCRIPTIONS,
} from '../constants';
import { TEMPLATES } from '../templates/registry';
import heroGif from '../assets/gifs/hero.gif';
import missionGif from '../assets/gifs/mission.gif';
import accentGif from '../assets/gifs/accent.gif';

const TYPEWRITER_WORDS = ['Seen.', 'Unforgettable.', 'Loved.'];

const useTypewriter = (words: string[], pause = 2200) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % words.length), pause);
    return () => clearInterval(id);
  }, [words, pause]);
  return words[index];
};

const OCCASIONS = [
  'Birthday', 'Anniversary', 'Graduation', 'Thank You',
  'Congratulations', 'Get Well Soon', 'New Job', 'Just Because',
];

const MISSION_VALUES = [
  { Icon: Sparkles, body: 'Animated cards that earn a re-watch — not a swipe-past.' },
  { Icon: Zap, body: 'Sixty seconds from picking a template to hitting send.' },
  { Icon: Heart, body: 'No subscription. Pay once per card. That\'s it.' },
];

const PROCESS = [
  { n: 1, title: 'Pick a template', body: 'Browse 12+ animated cards, sorted by occasion.' },
  { n: 2, title: 'Customize', body: 'Edit text, swap colors, drop in a photo or video.' },
  { n: 3, title: 'Pay', body: 'One charge per card. No subscription, ever.' },
  { n: 4, title: 'Send the link', body: 'Email it through us, or paste it anywhere.' },
];

type TierKey = 'free' | 'essential' | 'premium' | 'bulk';

const TIERS: {
  key: TierKey;
  name: string;
  features: string[];
  cta: string;
  surface: string;
  border: string;
  ctaClass: string;
  dotClass: string;
  popular?: boolean;
}[] = [
  {
    key: 'free',
    name: 'Free',
    features: ['1 static card per occasion', 'Manual link sharing', 'GifLove watermark'],
    cta: 'Try it free',
    surface: 'bg-vellum-base',
    border: 'border-ink-espresso/15',
    ctaClass: 'bg-ink-espresso hover:bg-ink-espresso/90 text-vellum-base',
    dotClass: 'bg-ink-espresso',
  },
  {
    key: 'essential',
    name: 'Essential',
    features: ['Animated templates', 'Up to 3 recipients', 'Scheduled delivery', 'PNG download'],
    cta: 'Get started',
    surface: 'bg-pop-rose/10',
    border: 'border-pop-rose/40',
    ctaClass: 'bg-pop-rose hover:bg-pop-rose/90 text-vellum-base',
    dotClass: 'bg-pop-rose',
  },
  {
    key: 'premium',
    name: 'Premium',
    features: ['Interactive cards', 'Photo or video upload', 'PNG + MP4 download', 'Open tracking'],
    cta: 'Go Premium',
    surface: 'bg-pop-violet/10',
    border: 'border-pop-violet/50',
    ctaClass: 'bg-pop-violet hover:bg-pop-violet/90 text-vellum-base',
    dotClass: 'bg-pop-violet',
    popular: true,
  },
  {
    key: 'bulk',
    name: 'Bulk',
    features: ['Up to 50 recipients', 'CSV upload', 'Custom sender branding', 'Analytics dashboard'],
    cta: 'Send to crew',
    surface: 'bg-pop-electric/25',
    border: 'border-ink-espresso/25',
    ctaClass: 'bg-ink-espresso hover:bg-ink-espresso/90 text-vellum-base',
    dotClass: 'bg-ink-espresso',
  },
];

const SHOWCASE_TOP = TEMPLATES.slice(0, 6);
const SHOWCASE_BOTTOM = TEMPLATES.slice(6, 12);

// Envelope teases this card
const ENVELOPE_PEEK = TEMPLATES.find(t => t.slug === 'cake-and-candles') ?? TEMPLATES[0];

// ── Sub-components ───────────────────────────────────────────────────────────

const ThumbCard: React.FC<{
  gradient?: string;
  title: string;
  hint?: string;
  className?: string;
}> = ({ gradient, title, hint, className = '' }) => (
  <div
    className={`relative aspect-[3/4] rounded-2xl border border-ink-espresso/15 overflow-hidden ${className}`}
    style={{ background: gradient ?? '#fff' }}
  >
    <div className="absolute inset-0 dashed-border opacity-30" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
      <span className="font-serif italic text-2xl text-ink-espresso/85 leading-tight">{title}</span>
      {hint && (
        <span className="text-[10px] tracking-[0.18em] uppercase text-ink-espresso/60">{hint}</span>
      )}
    </div>
  </div>
);

const EnvelopeVault: React.FC = () => {
  // Layout (% of 28rem container):
  //   Envelope body: bottom 70% (i.e. top of envelope at 30%)
  //   Front pocket: bottom 35% (top edge at 65%)
  //   Flap: spans top half of envelope (30%–65%), origin-top, rotates -170° to open
  //   Card rest position: bottom 5%, height ~52% — fully hidden behind flap (z-30) + pocket (z-20)
  //   Card slides up by -300px (~67% of container) — fully clears the envelope
  //
  // Timing (5s loop, sequential):
  //   0–15%   flap opens
  //   15–35%  card rises out
  //   35–65%  card holds at top
  //   65–85%  card descends back inside
  //   85–100% flap closes
  return (
    <div className="relative w-80 h-[28rem] sm:w-96 sm:h-[30rem] mx-auto" style={{ perspective: 1200 }}>
      {/* Envelope back panel — bottom 70%, full opacity so no seam vs. front pocket */}
      <div className="absolute left-0 right-0 bottom-0 h-[70%] rounded-2xl bg-pop-rose border border-ink-espresso/25 shadow-xl z-0" />

      {/* Card — z-10, hidden at rest by flap + pocket */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-44 sm:w-52 z-10"
        style={{ bottom: '5%' }}
        animate={{
          y: [0, 0, -300, -300, 0, 0],
          rotate: [0, 0, -2, 2, 0, 0],
        }}
        transition={{
          duration: 5,
          times: [0, 0.15, 0.35, 0.65, 0.85, 1],
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ThumbCard
          gradient={ENVELOPE_PEEK.previewGradient}
          title={ENVELOPE_PEEK.title}
          className="shadow-2xl"
        />
      </motion.div>

      {/* Front pocket — bottom 35%, hides card bottom; subtle inner shadow gives depth */}
      <div className="absolute left-0 right-0 bottom-0 h-[35%] rounded-b-2xl bg-pop-rose z-20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]" />

      {/* Wax-seal accent on the front pocket */}
      <div className="absolute left-1/2 bottom-5 -translate-x-1/2 w-10 h-10 rounded-full bg-pop-electric border-2 border-ink-espresso/40 z-30 flex items-center justify-center text-ink-espresso font-serif text-sm">
        G
      </div>

      {/* Flap — top half of envelope, hinges at top, swings back when open */}
      <motion.div
        className="absolute left-0 right-0 origin-top z-30"
        style={{
          top: '30%',
          height: '38%',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
        animate={{ rotateX: [0, -170, -170, 0] }}
        transition={{
          duration: 5,
          times: [0, 0.15, 0.85, 1],
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 320 200" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,0 L320,0 L160,200 Z"
            fill="#ff007a"
            stroke="#1a1a1a"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

export const HomePage: React.FC = () => {
  const word = useTypewriter(TYPEWRITER_WORDS);

  return (
    <div className="min-h-screen bg-vellum-base text-ink-espresso">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <span className="inline-flex items-center gap-2 border border-ink-espresso/20 text-ink-espresso/70 text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-8">
              <Sparkles size={12} className="text-pop-rose" /> Animated greeting cards
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.02] mb-2">
              Greetings worth being
            </h1>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic leading-[1.02] mb-8">
              <span className="relative inline-block bg-pop-rose/40 px-4 py-1 rounded-lg text-ink-espresso">
                {word}
              </span>
            </h1>

            <p className="text-lg text-ink-espresso/70 max-w-lg mb-10 leading-relaxed">
              Send a card that actually does something — envelopes that open, candles you blow out, balloons you pop. Built for moments people remember.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/browse"
                className="bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-8 py-3.5 rounded-full transition-colors text-base text-center"
              >
                Create a card
              </Link>
              <Link
                to="/browse?tier=free"
                className="border border-ink-espresso text-ink-espresso hover:bg-ink-espresso hover:text-vellum-base font-semibold px-8 py-3.5 rounded-full transition-colors text-base text-center"
              >
                Browse templates
              </Link>
            </div>
          </motion.div>

          {/* Right: hero gif slot */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -z-10 w-72 h-72 bg-pop-electric/30 blur-3xl rounded-full" />
            <div className="absolute -z-10 right-0 top-0 w-44 h-44 bg-pop-rose/20 blur-3xl rounded-full" />

            <div className="relative w-full max-w-xs md:max-w-sm transform -rotate-2">
              <div className="absolute inset-0 dashed-border rounded-3xl" />
              <div className="relative p-3">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-ink-espresso/15 bg-vellum-base shadow-2xl">
                  <img src={heroGif} alt="GifLove animated greeting" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wavy band into ribbon (dotted serif text) ── */}
      <div className="relative">
        <div className="h-[60px] bg-pop-electric wavy-top-vibrant" aria-hidden />
        <section className="bg-pop-electric border-b border-ink-espresso/15 py-5 overflow-hidden">
          <div className="flex w-max animate-ribbon">
            {[0, 1].map(dup => (
              <div key={dup} className="flex items-center pr-3 whitespace-nowrap font-serif italic text-2xl md:text-3xl text-ink-espresso">
                {OCCASIONS.concat(OCCASIONS).map((occ, i) => (
                  <span key={`${dup}-${i}`} className="px-5">
                    {occ}
                    <span className="text-ink-espresso/50 not-italic ml-5">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Mission ──────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: text + values */}
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— Our Mission —</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight">
              Make every greeting feel like an event, not a notification.
            </h2>

            <div className="flex flex-col gap-5">
              {MISSION_VALUES.map(({ Icon, body }) => (
                <div key={body} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pop-violet/15 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-pop-violet" />
                  </div>
                  <p className="text-base text-ink-espresso/80 leading-relaxed pt-2">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: gif */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -z-10 w-72 h-72 bg-pop-violet/15 blur-3xl rounded-full" />
            <div className="relative w-full max-w-sm transform rotate-2">
              <div className="absolute inset-0 dashed-border rounded-3xl" />
              <div className="relative p-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-ink-espresso/15 bg-vellum-base shadow-xl">
                  <img src={missionGif} alt="GifLove in motion" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Showcase: two-row marquee with per-card hover pop ── */}
      <section className="py-20 overflow-hidden">
        <div className="px-4 max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 text-center mb-3">— Showcase —</p>
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-14">A few cards in the wild</h2>
        </div>

        {/* Row 1 — left scroll */}
        <div className="relative mb-6">
          <div className="flex w-max animate-ribbon">
            {[0, 1].map(dup => (
              <div key={`top-${dup}`} className="flex gap-5 pr-5">
                {SHOWCASE_TOP.map(t => (
                  <Link
                    key={`top-${dup}-${t.slug}`}
                    to={`/editor/${t.slug}`}
                    className="block w-56 shrink-0 origin-bottom transition-transform duration-300 hover:scale-110 hover:-translate-y-3 hover:z-20 relative"
                  >
                    <ThumbCard gradient={t.previewGradient} title={t.title} hint={t.interactionHint ?? 'Open card'} className="hover:shadow-2xl" />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right scroll */}
        <div className="relative">
          <div className="flex w-max animate-ribbon-reverse">
            {[0, 1].map(dup => (
              <div key={`bot-${dup}`} className="flex gap-5 pr-5">
                {SHOWCASE_BOTTOM.map(t => (
                  <Link
                    key={`bot-${dup}-${t.slug}`}
                    to={`/editor/${t.slug}`}
                    className="block w-56 shrink-0 origin-bottom transition-transform duration-300 hover:scale-110 hover:-translate-y-3 hover:z-20 relative"
                  >
                    <ThumbCard gradient={t.previewGradient} title={t.title} hint={t.interactionHint ?? 'Open card'} className="hover:shadow-2xl" />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process — light purple band, pink numerals ── */}
      <section className="relative py-28 px-4 bg-pop-violet/10 border-y border-pop-violet/20 overflow-hidden">
        {/* Scattered accent gif */}
        <img
          src={accentGif}
          alt=""
          aria-hidden
          className="hidden md:block absolute top-10 right-12 w-28 opacity-90 pointer-events-none -rotate-6"
        />

        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 text-center mb-3">— How it works —</p>
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-16">Four steps. Two minutes.</h2>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] border-t border-dashed border-pop-violet/40 -z-0" aria-hidden />

            {PROCESS.map(p => (
              <div key={p.n} className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-pop-rose border border-pop-rose/60 flex items-center justify-center mb-5 relative z-10 shadow-[0_8px_24px_-8px_rgba(255,0,122,0.5)]">
                  <span className="font-serif text-4xl text-vellum-base">{p.n}</span>
                </div>
                <h3 className="font-serif text-2xl mb-2">{p.title}</h3>
                <p className="text-base text-ink-espresso/75 max-w-[14rem]">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/how-it-works"
              className="inline-block text-sm font-semibold text-pop-violet hover:text-pop-rose transition-colors"
            >
              See the full walkthrough →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 text-center mb-3">— Pricing —</p>
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-3">Pick your vibe</h2>
          <p className="text-ink-espresso/70 text-center mb-16">Start free. Upgrade when someone deserves the full experience.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl p-6 border-2 ${tier.surface} ${tier.border} flex flex-col gap-5 overflow-hidden ${
                  tier.popular ? 'lg:scale-[1.06] lg:z-10 shadow-[0_12px_40px_-10px_rgba(143,0,255,0.45)]' : ''
                }`}
              >
                {tier.popular && (
                  <div
                    className="absolute top-0 right-0 w-36 h-36 pointer-events-none"
                    aria-hidden
                  >
                    <span className="absolute top-6 -right-10 rotate-45 bg-pop-electric text-ink-espresso text-[10px] font-bold tracking-[0.2em] uppercase px-12 py-1 border-y border-ink-espresso/20">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="font-serif text-3xl mb-1">{tier.name}</h3>
                  <p className="text-xs text-ink-espresso/60">{TIER_DESCRIPTIONS[tier.key]}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-5xl">{TIER_PRICES_DISPLAY[tier.key]}</span>
                  {tier.key !== 'free' && <span className="text-ink-espresso/50 text-sm">/ card</span>}
                </div>

                <div className="text-xs text-ink-espresso/60 border-y border-ink-espresso/10 py-3">
                  Up to {RECIPIENT_LIMITS[tier.key]} recipient{RECIPIENT_LIMITS[tier.key] === 1 ? '' : 's'} · {LINK_EXPIRY_DAYS[tier.key]}-day link
                </div>

                <ul className="flex flex-col gap-2.5 text-sm flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <span className={`mt-1.5 w-2.5 h-2.5 rounded-sm shrink-0 ${tier.dotClass}`} />
                      <span className="text-ink-espresso/85">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/browse?tier=${tier.key}`}
                  className={`block text-center text-sm font-semibold py-3 rounded-full transition-colors ${tier.ctaClass}`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vault — animated envelope ───────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— The Vault —</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Every card you've sent, kept.</h2>
          <p className="text-ink-espresso/70 mb-16 max-w-xl mx-auto">
            Open rates, recipient activity, and a re-watchable copy of every animated card. Yours forever.
          </p>

          <EnvelopeVault />

          <p className="text-sm text-ink-espresso/60 mt-10 mb-8">
            12 templates · open tracking · re-watchable forever
          </p>

          <Link
            to="/browse"
            className="inline-block bg-pop-violet hover:bg-pop-rose text-vellum-base font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Open the vault
          </Link>
        </div>
      </section>
    </div>
  );
};
