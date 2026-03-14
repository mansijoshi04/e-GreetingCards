'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Heart size={14} fill="white" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900">Giflove</span>
          </button>

          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-rose-600">Home</Link>
            <Link href="/about" className="text-sm font-medium text-stone-500 hover:text-stone-900">About</Link>
            <Link href="/faq" className="text-sm font-medium text-stone-500 hover:text-stone-900">How it Works</Link>
            <Link
              href="/create"
              className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
            >
              Browse Cards
            </Link>
          </div>
        </div>
      </nav>

      {/* Home Page Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="font-serif text-6xl md:text-7xl font-light mb-6 leading-tight text-stone-900">
            Digital greetings, <br />
            beautifully crafted.
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Send more than just a message. Choose from our curated collection of artistic e-cards and personalize them for your loved ones.
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

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white">
                <Heart size={14} fill="white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">Giflove</span>
            </div>
            <p className="text-white/40 max-w-sm">
              Elevating digital connections through artistic design and personal touch.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Platform</h5>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/create" className="hover:text-white transition-colors">Browse Cards</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">How it Works</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
          © 2024 Giflove. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
