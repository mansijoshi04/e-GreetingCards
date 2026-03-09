import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CardRenderer from '@/components/cards/CardRenderer';
import {
  validateLink,
  fetchCardData,
  updateCardAccess,
} from '@/lib/services/linkService';

export const dynamic = 'force-dynamic';

interface CardPageProps {
  params: {
    linkToken: string;
  };
}

/**
 * Generate metadata for card preview (SEO)
 */
export async function generateMetadata({
  params,
}: CardPageProps): Promise<Metadata> {
  const { linkToken } = params;

  // Validate link
  const validation = await validateLink(linkToken);

  if (!validation.valid) {
    return {
      title: 'Card Expired - E-Greeting Cards',
      description: 'This greeting card has expired or does not exist.',
    };
  }

  // Fetch card for metadata
  const card = await fetchCardData(validation.cardId);

  if (!card) {
    return {
      title: 'Card Not Found - E-Greeting Cards',
      description: 'The greeting card you are looking for does not exist.',
    };
  }

  const template = card.template as any;
  const customText = card.customText as any;

  return {
    title: `${customText.headline} - E-Greeting Cards`,
    description: `${card.senderName} sent you a special ${template.category} card!`,
    openGraph: {
      title: `${customText.headline} - E-Greeting Cards`,
      description: `${card.senderName} sent you a special ${template.category} card!`,
      type: 'website',
      images: [
        {
          url: template.thumbnailUrl || '/og-card.png',
          width: 1200,
          height: 630,
          alt: `${template.name} greeting card`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${customText.headline}`,
      description: `${card.senderName} sent you a greeting card!`,
    },
  };
}

/**
 * Card viewing page
 * Server component that validates and renders the card
 */
export default async function CardPage({ params }: CardPageProps) {
  const { linkToken } = params;

  // 1. Validate link token
  const validation = await validateLink(linkToken);

  if (!validation.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Expired</h1>
          <p className="text-gray-600 mb-8">
            {validation.message || 'This greeting card is no longer available.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Create Your Own Card
          </a>
        </div>
      </div>
    );
  }

  // 2. Fetch card data with validation
  const cardId = validation.cardId;
  const card = await fetchCardData(cardId);

  if (!card) {
    notFound();
  }

  // 3. Update last accessed timestamp
  await updateCardAccess(cardId);

  // 4. Render the card with all animations
  return (
    <main className="w-full min-h-screen bg-white">
      <CardRenderer card={card} linkToken={linkToken} />
    </main>
  );
}
