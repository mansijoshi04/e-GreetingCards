import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Cake, Heart, GraduationCap, HeartHandshake, Trophy, MousePointer, Hand, FileText, Sparkles } from 'lucide-react';
import { TEMPLATES } from '../templates/registry';
import { TierBadge } from '../components/ui/TierBadge';
import type { CardCategory, Tier } from '../types/card';

const CATEGORY_ORDER: { value: CardCategory; label: string }[] = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'congratulations', label: 'Congratulations' },
  { value: 'get-well-soon', label: 'Get Well Soon' },
];

const TIER_FILTERS: { label: string; value: Tier | 'all' }[] = [
  { label: 'All tiers', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Essential', value: 'essential' },
  { label: 'Premium', value: 'premium' },
  { label: 'Bulk', value: 'bulk' },
];

const TIER_GRADIENT: Record<Tier, string> = {
  free: 'from-vellum-base to-vellum-base',
  essential: 'from-pop-rose/15 to-pop-rose/5',
  premium: 'from-pop-violet/15 to-pop-violet/5',
  bulk: 'from-pop-electric/30 to-pop-electric/10',
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
  birthday: 'text-pop-rose',
  anniversary: 'text-pop-rose',
  graduation: 'text-pop-violet',
  'thank-you': 'text-pop-violet',
  congratulations: 'text-ink-espresso',
  'get-well-soon': 'text-pop-violet',
};

export const BrowsePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTier = (searchParams.get('tier') ?? 'all') as Tier | 'all';
  const [activeTier, setActiveTier] = useState<Tier | 'all'>(initialTier);

  const handleTierChange = (next: Tier | 'all') => {
    setActiveTier(next);
    if (next === 'all') {
      searchParams.delete('tier');
    } else {
      searchParams.set('tier', next);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const sectionsByCategory = useMemo(() => {
    return CATEGORY_ORDER.map(cat => ({
      ...cat,
      cards: TEMPLATES.filter(
        t => t.category === cat.value && (activeTier === 'all' || t.tier === activeTier),
      ),
    })).filter(s => s.cards.length > 0);
  }, [activeTier]);

  const handleSelectCard = (slug: string) => navigate(`/editor/${slug}`);

  return (
    <div className="min-h-screen bg-vellum-base pb-20">
      {/* Header */}
      <div className="px-4 pt-28 pb-10 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-ink-espresso mb-3 flex items-center justify-center gap-3">
          <Sparkles size={28} className="text-pop-rose" />
          Choose your card
        </h1>
        <p className="text-ink-espresso/70 text-base max-w-md mx-auto mb-6">
          {TEMPLATES.length} templates across {CATEGORY_ORDER.length} occasions. Pick one and make their day.
        </p>

        {/* Tier dropdown */}
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="tier-filter" className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-espresso/60">
            Show
          </label>
          <select
            id="tier-filter"
            value={activeTier}
            onChange={e => handleTierChange(e.target.value as Tier | 'all')}
            className="text-sm font-semibold px-4 py-2 rounded-full border border-ink-espresso/25 bg-vellum-base text-ink-espresso hover:border-pop-violet focus:outline-none focus:ring-2 focus:ring-pop-violet/30 focus:border-pop-violet transition-all cursor-pointer"
          >
            {TIER_FILTERS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category rows */}
      <div className="max-w-6xl mx-auto flex flex-col gap-14 px-4">
        {sectionsByCategory.length === 0 ? (
          <div className="text-center py-20 text-ink-espresso/50">
            <Sparkles size={40} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No cards in this tier yet</p>
            <button
              onClick={() => handleTierChange('all')}
              className="mt-3 text-pop-violet text-sm font-semibold hover:text-pop-rose"
            >
              Show all tiers
            </button>
          </div>
        ) : (
          sectionsByCategory.map(section => {
            const CatIcon = CATEGORY_ICON[section.value];
            const iconColor = CATEGORY_ICON_COLOR[section.value];
            return (
              <section key={section.value}>
                <div className="flex items-center gap-3 mb-5 px-1">
                  <div className={`w-10 h-10 rounded-full bg-vellum-base border border-ink-espresso/10 flex items-center justify-center ${iconColor}`}>
                    <CatIcon size={20} />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-ink-espresso">{section.label}</h2>
                  <span className="text-xs text-ink-espresso/50 font-semibold tracking-widest uppercase ml-auto">
                    {section.cards.length} {section.cards.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>

                <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory">
                  {section.cards.map((template, i) => {
                    const TplIcon = CATEGORY_ICON[template.category];
                    const tplIconColor = CATEGORY_ICON_COLOR[template.category];
                    return (
                      <motion.div
                        key={template.slug}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="shrink-0 snap-start w-64 md:w-72"
                      >
                        <button
                          onClick={() => handleSelectCard(template.slug)}
                          className="w-full text-left group rounded-2xl overflow-hidden border border-ink-espresso/15 hover:border-pop-rose bg-vellum-base transition-all active:scale-95"
                        >
                          <div
                            className={`aspect-[3/4] bg-gradient-to-br ${TIER_GRADIENT[template.tier]} flex flex-col items-center justify-center relative overflow-hidden`}
                            style={template.previewGradient ? { background: template.previewGradient } : undefined}
                          >
                            <div className="group-hover:scale-110 transition-transform duration-300">
                              <TplIcon size={64} className={tplIconColor} />
                            </div>
                            <div className="absolute top-3 left-3">
                              <TierBadge tier={template.tier} />
                            </div>
                            {template.animationType !== 'auto-play' && (
                              <div className="absolute bottom-3 right-3 bg-vellum-base/85 backdrop-blur text-ink-espresso/75 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                {template.animationType === 'gesture'
                                  ? <><Hand size={11} /> Interactive</>
                                  : template.animationType === 'click-to-reveal'
                                  ? <><MousePointer size={11} /> Tap to open</>
                                  : <><FileText size={11} /> Scroll</>}
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="font-serif text-xl text-ink-espresso leading-tight">{template.title}</p>
                            <p className="text-ink-espresso/65 text-sm mt-1.5 line-clamp-2 leading-relaxed">{template.description}</p>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};
