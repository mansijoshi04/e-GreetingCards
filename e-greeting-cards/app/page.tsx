'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      <Navbar activePath="/" />

      {/* Home Page Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="font-serif text-6xl md:text-7xl font-light mb-6 leading-tight text-stone-900">
            Digital greetings, <br />
            beautifully crafted.
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Because some moments deserve more than a text. Beautifully animated e-cards, personalized by you, delivered instantly.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Basic Tier */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6">
              <Gift size={28} className="text-stone-600" />
            </div>
            <h3 className="font-serif text-3xl mb-2 text-stone-900">Basic Collection</h3>
            <div className="text-4xl font-light mb-6 text-stone-900">
              $3<span className="text-lg text-stone-400">/card</span>
            </div>
            <ul className="text-stone-500 space-y-3 mb-10 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Standard Artistic Designs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Basic Text Customization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Instant Email Delivery
              </li>
            </ul>
            <Link
              href="/create?tier=basic"
              className="w-full py-4 rounded-2xl border-2 border-stone-900 font-semibold hover:bg-stone-900 hover:text-white transition-all text-stone-900"
            >
              Choose Basic
            </Link>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-stone-900 p-10 rounded-[2rem] text-white flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-6 right-6 bg-rose-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Popular
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles size={28} className="text-rose-400" />
            </div>
            <h3 className="font-serif text-3xl mb-2 text-white">Premium Collection</h3>
            <div className="text-4xl font-light mb-6 text-white">
              $5<span className="text-lg text-white/40">/card</span>
            </div>
            <ul className="text-white/80 space-y-3 mb-10 text-base">
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✓</span>
                Exclusive Premium Designs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✓</span>
                Advanced Layout Editor
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✓</span>
                Animated Transitions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✓</span>
                Scheduled Delivery
              </li>
            </ul>
            <Link
              href="/create?tier=premium"
              className="w-full py-4 rounded-2xl bg-rose-500 font-semibold hover:bg-rose-600 transition-all text-white"
            >
              Go Premium
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
