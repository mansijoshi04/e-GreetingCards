import React from 'react';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ title, lastUpdated, children }) => (
  <div className="min-h-screen bg-vellum-base text-ink-espresso pt-28 pb-20 px-4">
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-ink-espresso/60 mb-3">— Legal —</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-3">{title}</h1>
      <p className="text-sm text-ink-espresso/60 mb-12">Last updated {lastUpdated}</p>

      <div className="prose-style flex flex-col gap-8 text-base leading-relaxed text-ink-espresso/85">
        {children}
      </div>
    </div>
  </div>
);

export const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-serif text-2xl text-ink-espresso">{title}</h2>
    <div className="flex flex-col gap-3">{children}</div>
  </section>
);
