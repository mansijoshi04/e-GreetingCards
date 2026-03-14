import { Metadata } from 'next';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import TemplateGallery from '@/components/templates/TemplateGallery';
import { getAllTemplates } from '@/lib/services/templateService';

export const metadata: Metadata = {
  title: 'Create Your Card - Giflove',
  description: 'Choose from beautiful templates and create your personalized greeting card.',
};

const CATEGORIES = [
  { value: 'all', label: 'All Occasions' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'thankYou', label: 'Thank You' },
];

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; category?: string }>;
}) {
  const params = await searchParams;
  const tier = params.tier || 'all';
  const category = params.category || 'all';
  const templates = await getAllTemplates();

  // Filter by tier and category
  const filteredTemplates = templates.filter(t => {
    const tierMatch = tier === 'all' || t.tier === tier;
    const categoryMatch = category === 'all' || t.category === category;
    return tierMatch && categoryMatch;
  });

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

      {/* Filters */}
      <section className="py-6 px-6 border-b border-stone-100 bg-white">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(({ value, label }) => (
              <Link
                key={value}
                href={`/create?tier=${tier}&category=${value}`}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === value
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Tier Pills */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold mr-1">Price:</span>
            <Link
              href={`/create?tier=all&category=${category}`}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tier === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All
            </Link>
            <Link
              href={`/create?tier=basic&category=${category}`}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tier === 'basic'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Basic — $3
            </Link>
            <Link
              href={`/create?tier=premium&category=${category}`}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tier === 'premium'
                  ? 'bg-rose-500 text-white'
                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              }`}
            >
              Premium — $5
            </Link>
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <TemplateGallery templates={filteredTemplates} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
