import Link from 'next/link';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'About - Giflove',
  description: 'Learn about our mission to make digital greetings special.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Heart size={14} fill="white" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900">Giflove</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-stone-500 hover:text-stone-900">Home</Link>
            <Link href="/about" className="text-sm font-medium text-rose-600">About</Link>
            <Link href="/faq" className="text-sm font-medium text-stone-500 hover:text-stone-900">How it Works</Link>
            <Link
              href="/create"
              className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
            >
              Browse Cards
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h2 className="font-serif text-6xl mb-12 text-center text-stone-900">Our Story</h2>
        <div className="aspect-video rounded-[3rem] overflow-hidden mb-16">
          <img
            src="https://picsum.photos/seed/studio/1200/800"
            alt="Giflove Studio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-2xl mx-auto">
          <p className="font-serif text-2xl leading-relaxed mb-8 text-stone-900">
            Giflove was born from a simple observation: in our fast-paced digital world,
            the art of the personal message was being lost to quick texts and generic emojis.
          </p>
          <p className="text-stone-500 leading-relaxed mb-6">
            We believe that a greeting card is more than just paper or pixels—it's a vessel for emotion,
            a moment of connection, and a lasting memory. Our mission is to combine the timeless
            elegance of traditional stationery with the convenience of digital delivery.
          </p>
          <p className="text-stone-500 leading-relaxed">
            Every template in our collection is hand-picked or custom-designed by independent artists,
            ensuring that your message is wrapped in beauty. Whether it's a milestone birthday,
            a quiet thank you, or a grand celebration, we're here to help you say it better.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white">
                <Heart size={14} fill="white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">Giflove</span>
            </div>
            <p className="text-white/40 max-w-sm">
              Elevating digital connections through artistic design and personal touch.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Platform</h5>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/create" className="hover:text-white transition-colors">Browse Cards</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">How it Works</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
          © 2024 Giflove Greetings. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
