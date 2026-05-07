import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Music2, Bookmark } from 'lucide-react';
import logo from '../../assets/giflove-logo.png';

const socialClass = 'p-2 rounded-full border border-vellum-base/15 text-vellum-base/70 hover:text-pop-rose hover:border-pop-rose transition-colors';
const linkClass = 'text-vellum-base/70 hover:text-pop-rose transition-colors';

export const Footer: React.FC = () => (
  <footer className="bg-ink-espresso text-vellum-base mt-auto">
    <div className="max-w-6xl mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GifLove" className="h-11 w-auto object-contain" />
            <span className="text-2xl font-serif text-vellum-base">GifLove</span>
          </Link>
          <p className="text-sm text-vellum-base/70 max-w-xs leading-relaxed">
            Greetings worth being seen. Animated cards that feel like a moment, not a message.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <a href="#" aria-label="Instagram" className={socialClass}><Instagram size={16} /></a>
            <a href="#" aria-label="TikTok" className={socialClass}><Music2 size={16} /></a>
            <a href="#" aria-label="X / Twitter" className={socialClass}><Twitter size={16} /></a>
            <a href="#" aria-label="Pinterest" className={socialClass}><Bookmark size={16} /></a>
          </div>
        </div>

        {/* Product */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-vellum-base/50 mb-4">Product</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/browse" className={linkClass}>Browse Cards</Link></li>
            <li><Link to="/#pricing" className={linkClass}>Pricing</Link></li>
            <li><Link to="/how-it-works" className={linkClass}>How It Works</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-vellum-base/50 mb-4">Company</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/blog" className={linkClass}>Blog</Link></li>
            <li><Link to="/about" className={linkClass}>About</Link></li>
            <li><Link to="/contact" className={linkClass}>Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-vellum-base/50 mb-4">Legal</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/terms" className={linkClass}>Terms</Link></li>
            <li><Link to="/privacy" className={linkClass}>Privacy</Link></li>
            <li><Link to="/refund" className={linkClass}>Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-vellum-base/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-vellum-base/50">
        <span>© {new Date().getFullYear()} GifLove. Made in Canada.</span>
        <span>giflove.ca</span>
      </div>
    </div>
  </footer>
);
