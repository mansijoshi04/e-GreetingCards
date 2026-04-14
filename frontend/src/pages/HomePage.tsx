import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles, Heart, Mail, Zap, Shield, Clock,
  Cake, GraduationCap, HeartHandshake, Trophy, Gift, Users, Check,
} from 'lucide-react';
import { TIER_PRICES_DISPLAY } from '../constants';

const TIERS = [
  {
    key: 'free',
    name: 'Free',
    price: TIER_PRICES_DISPLAY.free,
    Icon: Sparkles,
    iconColor: 'text-stone-500',
    color: 'from-stone-50 to-stone-100',
    border: 'border-stone-200',
    accent: 'text-stone-600',
    badge: 'bg-stone-100 text-stone-600',
    features: ['1 static card per occasion', 'Manual link sharing', '3-day link', 'GifLove watermark'],
    cta: 'Try for Free',
    ctaClass: 'bg-stone-700 hover:bg-stone-800 text-white',
  },
  {
    key: 'essential',
    name: 'Essential',
    price: TIER_PRICES_DISPLAY.essential,
    suffix: '/ card',
    Icon: Zap,
    iconColor: 'text-sky-500',
    color: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
    accent: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    features: ['Animated card templates', 'Email up to 3 recipients', 'Scheduled delivery', 'PNG download'],
    cta: 'Get Started',
    ctaClass: 'bg-sky-500 hover:bg-sky-600 text-white',
  },
  {
    key: 'premium',
    name: 'Premium',
    price: TIER_PRICES_DISPLAY.premium,
    suffix: '/ card',
    Icon: Gift,
    iconColor: 'text-violet-500',
    color: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    accent: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    features: ['Interactive cards (blow candles!)', 'Upload photo or video', 'PNG + MP4 download', 'Open tracking'],
    cta: 'Go Premium',
    ctaClass: 'bg-violet-600 hover:bg-violet-700 text-white',
    popular: true,
  },
  {
    key: 'bulk',
    name: 'Bulk',
    price: TIER_PRICES_DISPLAY.bulk,
    suffix: '/ card',
    Icon: Users,
    iconColor: 'text-amber-500',
    color: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    accent: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    features: ['Up to 50 recipients', 'CSV upload', 'Custom sender branding', 'Analytics dashboard'],
    cta: 'Send to Crew',
    ctaClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
];

const CATEGORIES = [
  { name: 'Birthday', Icon: Cake, count: 4, slug: 'birthday', bg: 'bg-rose-50', iconColor: 'text-rose-500' },
  { name: 'Anniversary', Icon: Heart, count: 2, slug: 'anniversary', bg: 'bg-pink-50', iconColor: 'text-pink-500' },
  { name: 'Graduation', Icon: GraduationCap, count: 2, slug: 'graduation', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { name: 'Thank You', Icon: HeartHandshake, count: 2, slug: 'thank-you', bg: 'bg-green-50', iconColor: 'text-green-600' },
  { name: 'Congratulations', Icon: Trophy, count: 2, slug: 'congratulations', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
];

const WHY_ITEMS = [
  { icon: Zap, title: 'Instant Delivery', body: 'Pay and your card lands in inboxes within seconds.' },
  { icon: Heart, title: 'Actually Interactive', body: 'Blow candles, pop balloons — recipients remember these.' },
  { icon: Clock, title: 'Schedule Ahead', body: 'Set a future date and we\'ll send it at the perfect moment.' },
  { icon: Shield, title: 'Links Expire', body: 'Cards feel like an occasion, not a forever link.' },
  { icon: Mail, title: 'Platform Delivers', body: 'We send the email — recipients get it beautifully formatted.' },
  { icon: Sparkles, title: 'Always Free Option', body: 'Every occasion has a free template. Zero pressure to pay.' },
];

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <section className="relative pt-20 pb-24 px-4 text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-rose-100/50 blur-3xl" />
          <div className="absolute -bottom-10 -left-20 w-80 h-80 rounded-full bg-violet-100/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-amber-100/30 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles size={14} /> Animated greeting cards — pay once, deliver magic
            </span>

            <h1
              className="text-5xl md:text-6xl font-bold text-stone-800 leading-tight mb-6"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Greetings that feel like
              <span className="text-rose-500"> a moment</span>,<br />
              not a message.
            </h1>

            <p className="text-lg text-stone-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Send a card that actually does something — envelopes that open, candles you blow out, balloons you pop. Built for people who want to make someone's day unforgettable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 text-base"
              >
                Browse Cards
              </Link>
              <Link
                to="/browse?tier=free"
                className="bg-white border border-stone-200 text-stone-700 hover:border-stone-300 font-semibold px-8 py-3.5 rounded-full transition-all text-base inline-flex items-center gap-2 justify-center"
              >
                <Sparkles size={16} className="text-stone-400" /> Try Free First
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-stone-800 text-center mb-2"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Every occasion covered
          </h2>
          <p className="text-stone-500 text-center mb-10">12 templates across 5 categories. Every tier. Every vibe.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/browse?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-rose-200 hover:bg-rose-50/40 transition-all group text-center"
                >
                  <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.Icon size={24} className={cat.iconColor} />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700 text-sm">{cat.name}</p>
                    <p className="text-stone-400 text-xs">{cat.count} designs</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 text-rose-500 font-semibold hover:text-rose-600 transition-colors text-sm"
            >
              See all templates →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section id="pricing" className="py-20 px-4 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-stone-800 text-center mb-2"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Pick your vibe
          </h2>
          <p className="text-stone-500 text-center mb-12">Start free. Upgrade when someone deserves the full experience.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl p-6 bg-gradient-to-br ${tier.color} border ${tier.border} flex flex-col gap-4`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <tier.Icon size={22} className={tier.iconColor} />
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tier.badge}`}>{tier.name}</span>
                </div>

                <div>
                  <span className={`text-3xl font-bold ${tier.accent}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    {tier.price}
                  </span>
                  {tier.suffix && <span className="text-stone-400 text-sm ml-1">{tier.suffix}</span>}
                </div>

                <ul className="flex flex-col gap-2 text-sm text-stone-600 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/browse?tier=${tier.key}`}
                  className={`block text-center text-sm font-semibold py-2.5 rounded-full transition-colors ${tier.ctaClass}`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GifLove */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-stone-800 text-center mb-12"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Why people love GifLove
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {WHY_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col gap-3 p-5 rounded-2xl bg-stone-50 border border-stone-100"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <item.icon size={20} className="text-rose-500" />
                </div>
                <h3 className="font-semibold text-stone-800">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-rose-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Ready to make someone's day?
          </h2>
          <p className="text-rose-100 mb-8 text-lg">
            Pick a card, customize it in 2 minutes, and send something they'll actually remember.
          </p>
          <Link
            to="/browse"
            className="inline-block bg-white text-rose-500 font-bold px-10 py-4 rounded-full hover:bg-rose-50 transition-colors shadow-lg text-base"
          >
            Browse Cards →
          </Link>
        </div>
      </section>
    </div>
  );
};
