import React from 'react';
import { LegalLayout, LegalSection } from '../components/ui/LegalLayout';

export const RefundPolicyPage: React.FC = () => (
  <LegalLayout title="Refund Policy" lastUpdated="May 2026">
    <p>
      Greeting cards are a personal, time-sensitive product. Here's how we handle refunds.
    </p>

    <LegalSection title="Scheduled cards (refundable)">
      <p>
        If you scheduled a card for a future date and it hasn't been sent yet, you can cancel it for a full refund up until the scheduled send time. Email <a href="mailto:hello@giflove.ca" className="text-pop-violet hover:text-pop-rose underline">hello@giflove.ca</a> with your order ID.
      </p>
    </LegalSection>

    <LegalSection title="Delivered cards (non-refundable)">
      <p>
        Once a card has been sent to recipients (or once you've copied a Free-tier link out of the system), the purchase is non-refundable. The work — generating the card, hosting it, delivering the email — has already been done.
      </p>
    </LegalSection>

    <LegalSection title="Technical issues">
      <p>
        If a card failed to send due to an issue on our end (server error, broken animation, broken delivery), we'll either re-send it or issue a full refund — your choice. Email us with your order ID and a description of what went wrong.
      </p>
    </LegalSection>

    <LegalSection title="Bulk tier">
      <p>
        For Bulk orders, partial refunds are possible if a portion of recipients failed delivery for technical reasons. We'll calculate the proportional refund based on undelivered recipients.
      </p>
    </LegalSection>

    <LegalSection title="How to request a refund">
      <ol className="list-decimal pl-6 flex flex-col gap-2">
        <li>Email <a href="mailto:hello@giflove.ca" className="text-pop-violet hover:text-pop-rose underline">hello@giflove.ca</a> with your order ID and the reason.</li>
        <li>We respond within 2 business days.</li>
        <li>Approved refunds land back on your original payment method within 5–10 business days (Paddle's processing window).</li>
      </ol>
    </LegalSection>
  </LegalLayout>
);
