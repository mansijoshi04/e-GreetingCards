import { HelpCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
      <Navbar activePath="/faq" />

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

      <Footer />
    </main>
  );
}
