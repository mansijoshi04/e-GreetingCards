import { Metadata } from 'next';
import Link from 'next/link';
import { Heart } from 'lucide-react';

import TemplateGallery from '@/components/templates/TemplateGallery';
import { getAllTemplates } from '@/lib/services/templateService';

export const metadata: Metadata = {
  title: 'Create Your Card - Giflove',
  description: 'Choose from beautiful templates and create your personalized greeting card.',
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const params = await searchParams;
  const tier = params.tier || 'all';
  const templates = await getAllTemplates();

  // Filter by tier if specified
  const filteredTemplates = tier === 'all'
    ? templates
    : templates.filter(t => t.tier === tier);

  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Heart size={14} fill="white" />
            </div>
            <span className="text-xl font-serif font-semibold text-stone-900">
              Giflove
            </span>
          </Link>
          <Link href="/" className="text-stone-600 hover:text-stone-900">
            Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-6 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-stone-900 mb-3">
            Choose Your Template
          </h1>
          <p className="text-lg text-stone-600">
            Select a beautiful design and customize it with your message
          </p>
        </div>
      </section>

      {/* Tier Filter Pills */}
      <section className="py-8 px-6 border-b border-stone-100 bg-white">
        <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
          <Link
            href="/create?tier=all"
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              tier === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
            }`}
          >
            All Templates
          </Link>
          <Link
            href="/create?tier=basic"
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              tier === 'basic'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
            }`}
          >
            Basic ($3)
          </Link>
          <Link
            href="/create?tier=premium"
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              tier === 'premium'
                ? 'bg-rose-500 text-white'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
          >
            Premium ($5)
          </Link>
        </div>
      </section>

      {/* Template Gallery */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <TemplateGallery templates={filteredTemplates} />
        </div>
      </section>

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
