import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import logo from '../../assets/logo.svg';

export const Footer: React.FC = () => (
  <footer className="bg-stone-50 border-t border-stone-200 mt-auto">
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="GifLove" className="w-6 h-6" />
          <span className="text-lg font-bold text-stone-700" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            GifLove
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center gap-6 text-sm text-stone-500">
          <Link to="/browse" className="hover:text-rose-500 transition-colors">Browse Cards</Link>
          <Link to="/#pricing" className="hover:text-rose-500 transition-colors">Pricing</Link>
          <Link to="/privacy" className="hover:text-rose-500 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-rose-500 transition-colors">Terms</Link>
        </nav>

        {/* Made with love */}
        <p className="text-xs text-stone-400 flex items-center gap-1">
          Made with <Heart size={12} className="text-rose-400 fill-rose-400" /> in Canada
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-stone-200 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} GifLove. Greetings that feel like a moment, not a message.
      </div>
    </div>
  </footer>
);
