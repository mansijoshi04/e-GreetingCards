import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/giflove-logo.png';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const linkBase = 'text-sm font-medium tracking-wide transition-colors';
  const linkRest = 'text-ink-espresso/80 hover:text-pop-rose';
  const linkActive = 'text-pop-rose';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-vellum-base/85 backdrop-blur-md border-b border-ink-espresso/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
        {/* Left: logo only */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="GifLove"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-serif text-ink-espresso tracking-tight">GifLove</span>
        </Link>

        <div className="flex-1" />

        {/* Right: How It Works · Pricing · CREATE */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/how-it-works" className={`${linkBase} ${isActive('/how-it-works') ? linkActive : linkRest}`}>
            How It Works
          </Link>
          <Link to="/#pricing" className={`${linkBase} ${linkRest}`}>
            Pricing
          </Link>
          <Link
            to="/browse"
            className="bg-pop-violet hover:bg-pop-rose text-vellum-base text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-colors"
          >
            Create
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg text-ink-espresso hover:bg-ink-espresso/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ink-espresso/10 bg-vellum-base/95 backdrop-blur-md px-4 py-5 flex flex-col gap-4">
          <Link to="/how-it-works" className="text-sm font-medium text-ink-espresso hover:text-pop-rose" onClick={() => setMobileOpen(false)}>
            How It Works
          </Link>
          <Link to="/#pricing" className="text-sm font-medium text-ink-espresso hover:text-pop-rose" onClick={() => setMobileOpen(false)}>
            Pricing
          </Link>
          <Link
            to="/browse"
            className="bg-pop-violet hover:bg-pop-rose text-vellum-base text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full text-center transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Create
          </Link>
        </div>
      )}
    </header>
  );
};
