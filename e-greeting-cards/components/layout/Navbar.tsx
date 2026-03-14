import Link from 'next/link';
import { Heart } from 'lucide-react';

interface NavbarProps {
  /** The href of the currently active nav link, e.g. "/" or "/about" */
  activePath?: string;
}

export default function Navbar({ activePath }: NavbarProps) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'How it Works' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Heart size={14} fill="white" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-stone-900">Giflove</span>
        </Link>

        <div className="flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                activePath === href
                  ? 'text-rose-600'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/create"
            className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
          >
            Browse Cards
          </Link>
        </div>
      </div>
    </nav>
  );
}
