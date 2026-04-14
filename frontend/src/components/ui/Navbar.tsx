import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.svg';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
            <img src={logo} alt="GifLove logo" className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-stone-800" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            GifLove
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/browse"
            className={`text-sm font-medium transition-colors ${
              isActive('/browse') ? 'text-rose-500' : 'text-stone-600 hover:text-rose-500'
            }`}
          >
            Browse Cards
          </Link>
          <Link
            to="/#pricing"
            className="text-sm font-medium text-stone-600 hover:text-rose-500 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/browse"
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors shadow-sm"
          >
            Send a Card
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-rose-100/60 bg-white/95 backdrop-blur-md px-4 py-4 flex flex-col gap-4">
          <Link
            to="/browse"
            className="text-sm font-medium text-stone-700 hover:text-rose-500"
            onClick={() => setMobileOpen(false)}
          >
            Browse Cards
          </Link>
          <Link
            to="/#pricing"
            className="text-sm font-medium text-stone-700 hover:text-rose-500"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/browse"
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Send a Card
          </Link>
        </div>
      )}
    </header>
  );
};
