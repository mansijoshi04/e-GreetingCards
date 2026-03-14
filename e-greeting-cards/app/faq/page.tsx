import Link from 'next/link';
import { Heart, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'How it Works - Giflove',
  description: 'Learn how Giflove greeting cards work.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'How do I send a card?',
      a: 'Simply choose a pricing tier, select a design you love, personalize it with your message, and enter the recipient\'s email address. We\'ll handle the rest!',
    },
    {
      q: 'Can I schedule a card for later?',
      a: 'Yes! Our Premium tier allows you to pick a specific date and time for your card to be delivered, so you never miss a special moment.',
    },
    {
      q: 'What\'s the difference between Basic and Premium?',
      a: 'Basic cards offer beautiful standard designs and text editing. Premium gives you access to exclusive artist collections, advanced layout tools, and scheduled delivery.',
    },
    {
      q: 'Is it secure?',
      a: 'Absolutely. We use industry-standard encryption to protect your data and ensure your messages are only seen by the intended recipient.',
    },
  ];

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
            <Link href="/about" className="text-sm font-medium text-stone-500 hover:text-stone-900">About</Link>
            <Link href="/faq" className="text-sm font-medium text-rose-600">How it Works</Link>
            <Link
              href="/create"
              className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
            >
              Browse Cards
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h2 className="font-serif text-6xl mb-12 text-center text-stone-900">How it Works</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
              <h4 className="font-serif text-2xl mb-4 flex items-center gap-3 text-stone-900">
                <HelpCircle size={20} className="text-rose-500 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-stone-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
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
