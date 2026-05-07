import React from 'react';
import { LegalLayout, LegalSection } from '../components/ui/LegalLayout';

export const TermsPage: React.FC = () => (
  <LegalLayout title="Terms of Service" lastUpdated="May 2026">
    <p>
      These terms govern your use of GifLove (giflove.ca). By creating, paying for, or sending a card through our service, you agree to these terms. If you don't agree, please don't use the service.
    </p>

    <LegalSection title="1. The service">
      <p>
        GifLove is a digital greeting card platform. You pick a template, customize the text and visuals, optionally upload media, pay for paid tiers via Paddle, and receive a shareable link. Recipients open the link to view an interactive card. Links expire 3–30 days after creation depending on tier.
      </p>
    </LegalSection>

    <LegalSection title="2. Payment">
      <p>
        Paid tiers (Essential, Premium, Bulk) are charged per card via Paddle, our payment processor. All prices are listed in CAD. Taxes are added at checkout where applicable. We do not store your payment card details — Paddle handles that directly.
      </p>
    </LegalSection>

    <LegalSection title="3. Acceptable use">
      <p>
        You may not use GifLove to send harassing, defamatory, illegal, or hateful content. Cards containing prohibited content may be removed without notice and without refund. We reserve the right to suspend service for users who repeatedly violate this clause.
      </p>
    </LegalSection>

    <LegalSection title="4. Content ownership">
      <p>
        You retain all rights to the text, photos, and videos you upload. By uploading, you grant GifLove a limited licence to host, transmit, and display that content for the purpose of delivering the card to your chosen recipients.
      </p>
    </LegalSection>

    <LegalSection title="5. Refunds">
      <p>
        See our <a href="/refund" className="text-pop-violet hover:text-pop-rose underline">Refund Policy</a> for the short version: scheduled cards can be cancelled and refunded before they're sent; delivered cards cannot be refunded.
      </p>
    </LegalSection>

    <LegalSection title="6. Liability">
      <p>
        GifLove is provided "as is." We aim for high reliability but do not guarantee uninterrupted service. Our liability for any claim related to the service is limited to the amount you paid for the card in question.
      </p>
    </LegalSection>

    <LegalSection title="7. Changes">
      <p>
        We may update these terms from time to time. Material changes will be announced via the website or email if we have one for you. Continued use after changes means you accept the updated terms.
      </p>
    </LegalSection>

    <LegalSection title="8. Contact">
      <p>
        Questions? Email <a href="mailto:hello@giflove.ca" className="text-pop-violet hover:text-pop-rose underline">hello@giflove.ca</a>.
      </p>
    </LegalSection>
  </LegalLayout>
);
