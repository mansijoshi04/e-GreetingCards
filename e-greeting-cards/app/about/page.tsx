import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'About - Giflove',
  description: 'Learn about our mission to make digital greetings special.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      <Navbar activePath="/about" />

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
            We believe that a greeting card is more than just paper or pixels—it&apos;s a vessel for emotion,
            a moment of connection, and a lasting memory. Our mission is to combine the timeless
            elegance of traditional stationery with the convenience of digital delivery.
          </p>
          <p className="text-stone-500 leading-relaxed">
            Every template in our collection is hand-picked or custom-designed by independent artists,
            ensuring that your message is wrapped in beauty. Whether it&apos;s a milestone birthday,
            a quiet thank you, or a grand celebration, we&apos;re here to help you say it better.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
