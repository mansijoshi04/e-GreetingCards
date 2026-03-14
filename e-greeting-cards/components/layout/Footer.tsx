import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
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
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
        © 2024 Giflove. All rights reserved.
      </div>
    </footer>
  );
}
