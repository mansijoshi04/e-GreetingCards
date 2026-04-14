import React from 'react';
import logo from '../../assets/logo.svg';

/**
 * Watermark overlay for Free tier cards.
 * Absolutely positioned — the parent card wrapper must have `position: relative`.
 */
export const Watermark: React.FC = () => (
  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/75 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none select-none z-50">
    <img src={logo} alt="GifLove" className="w-4 h-4" />
    <span className="text-xs font-semibold text-stone-500 tracking-tight">GifLove.ca</span>
  </div>
);
