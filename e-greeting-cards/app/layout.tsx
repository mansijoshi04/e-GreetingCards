import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'Giflove - Send Animated Celebration Cards',
  description: 'Create and send beautiful animated greeting cards with scroll-to-open animations and confetti effects. Starting at just $3.',
  keywords: 'greeting cards, animated cards, birthday cards, anniversary cards, celebrations',
  openGraph: {
    title: 'E-Greeting Cards',
    description: 'Send joy with animated greeting cards',
    url: 'https://greeting-cards.com',
    siteName: 'E-Greeting Cards',
    images: [
      {
        url: 'https://greeting-cards.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Greeting Cards',
    description: 'Send joy with animated greeting cards',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
