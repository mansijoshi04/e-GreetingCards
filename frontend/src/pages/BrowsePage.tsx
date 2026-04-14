import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Cake, Heart, GraduationCap, HeartHandshake, Trophy, MousePointer, Hand, FileText, Sparkles } from 'lucide-react';
import { TEMPLATES } from '../templates/registry';
import { TierBadge } from '../components/ui/TierBadge';
import type { CardCategory, Tier } from '../types/card';

const CATEGORIES: { label: string; value: CardCategory | 'all'; Icon?: React.FC<{ size?: number; className?: string }> }[] = [
  { label: 'All', value: 'all' },
  { label: 'Birthday', value: 'birthday', Icon: Cake },
  { label: 'Anniversary', value: 'anniversary', Icon: Heart },
  { label: 'Graduation', value: 'graduation', Icon: GraduationCap },
  { label: 'Thank You', value: 'thank-you', Icon: HeartHandshake },
  { label: 'Congratulations', value: 'congratulations', Icon: Trophy },
];

const TIER_FILTERS: { label: string; value: Tier | 'all' }[] = [
  { label: 'All Tiers', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Essential', value: 'essential' },
  { label: 'Premium', value: 'premium' },
  { label: 'Bulk', value: 'bulk' },
];

const TIER_GRADIENT: Record<Tier, string> = {
  free: 'from-stone-100 to-stone-50',
  essential: 'from-sky-100 to-blue-50',
  premium: 'from-violet-100 to-purple-50',
  bulk: 'from-amber-100 to-yellow-50',
};

const CATEGORY_ICON: Record<CardCategory, React.FC<{ size?: number; className?: string }>> = {
  birthday: Cake,
  anniversary: Heart,
  graduation: GraduationCap,
  'thank-you': HeartHandshake,
  congratulations: Trophy,
  'get-well-soon': Sparkles,
};

const CATEGORY_ICON_COLOR: Record<CardCategory, string> = {
  birthday: 'text-rose-400',
  anniversary: 'text-pink-400',
  graduation: 'text-blue-400',
  'thank-you': 'text-green-500',
  congratulations: 'text-amber-500',
  'get-well-soon': 'text-sky-400',
};

export const BrowsePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialCategory = (searchParams.get('category') ?? 'all') as CardCategory | 'all';
  const initialTier = (searchParams.get('tier') ?? 'all') as Tier | 'all';

  const [activeCategory, setActiveCategory] = useState<CardCategory | 'all'>(initialCategory);
  const [activeTier, setActiveTier] = useState<Tier | 'all'>(initialTier);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchCategory = activeCategory === 'all' || t.category === activeCategory;
      const matchTier = activeTier === 'all' || t.tier === activeTier;
      const matchSearch = search === '' ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchTier && matchSearch;
    });
  }, [activeCategory, activeTier, search]);

  const handleSelectCard = (slug: string) => {
    navigate(`/editor/${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-16">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-10 text-center">
        <h1
          className="text-4xl font-bold text-stone-800 mb-2 flex items-center justify-center gap-3"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          <Sparkles size={28} className="text-rose-400" />
          Choose Your Card
        </h1>
        <p className="text-stone-500 text-base max-w-md mx-auto">
          {TEMPLATES.length} templates across 5 occasions. Pick one and make their day.
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          {/* Search */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cards..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-stone-200 bg-stone-50 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.value
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-rose-200 hover:text-rose-500'
                }`}
              >
                {cat.Icon && <cat.Icon size={12} />}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tier tabs */}
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
            {TIER_FILTERS.map(t => (
              <button
                key={t.value}
                onClick={() => setActiveTier(t.value)}
                className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                  activeTier === t.value
                    ? 'bg-stone-700 text-white border-stone-700'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <Search size={40} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No cards found</p>
            <p className="text-sm mt-1">Try clearing the filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((template, i) => {
              const CatIcon = CATEGORY_ICON[template.category];
              const catIconColor = CATEGORY_ICON_COLOR[template.category];
              return (
                <motion.div
                  key={template.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => handleSelectCard(template.slug)}
                    className="w-full text-left group rounded-2xl overflow-hidden border border-stone-100 hover:border-rose-200 bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    {/* Card preview thumbnail */}
                    <div
                      className={`aspect-[3/4] bg-gradient-to-br ${TIER_GRADIENT[template.tier]} flex flex-col items-center justify-center relative overflow-hidden`}
                      style={template.previewGradient ? { background: template.previewGradient } : undefined}
                    >
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        <CatIcon size={44} className={catIconColor} />
                      </div>
                      <div className="absolute top-2 left-2">
                        <TierBadge tier={template.tier} />
                      </div>
                      {template.animationType !== 'auto-play' && (
                        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur text-stone-500 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                          {template.animationType === 'gesture'
                            ? <><Hand size={9} /> Interactive</>
                            : template.animationType === 'click-to-reveal'
                            ? <><MousePointer size={9} /> Tap to open</>
                            : <><FileText size={9} /> Scroll</>}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="font-semibold text-stone-800 text-sm leading-tight">{template.title}</p>
                      <p className="text-stone-400 text-xs mt-0.5 line-clamp-2">{template.description}</p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
