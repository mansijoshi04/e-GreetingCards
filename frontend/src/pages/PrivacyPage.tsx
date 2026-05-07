import React from 'react';
import { LegalLayout, LegalSection } from '../components/ui/LegalLayout';

export const PrivacyPage: React.FC = () => (
  <LegalLayout title="Privacy Policy" lastUpdated="May 2026">
    <p>
      We collect as little personal data as we need to deliver your cards and run the service. This page lays out what we collect, why, and who we share it with.
    </p>

    <LegalSection title="What we collect">
      <p>When you create or send a card, we collect:</p>
      <ul className="list-disc pl-6 flex flex-col gap-2">
        <li>Your name and email address (for delivery confirmation and the receipt).</li>
        <li>Recipient names and email addresses (so we can deliver the card on your behalf).</li>
        <li>The text, photos, and videos you put into the card.</li>
        <li>Payment information — handled entirely by Paddle. We see only an order ID and the tier you paid for, never your card number.</li>
        <li>Basic analytics on card opens (anonymized device type, country, timestamp) for tiers that include open tracking.</li>
      </ul>
    </LegalSection>

    <LegalSection title="How we use it">
      <p>
        Your data is used only to deliver the card, send transactional emails (receipt, delivery confirmation), and improve the service. We do not sell or rent your data to anyone, ever.
      </p>
    </LegalSection>

    <LegalSection title="Third parties we use">
      <ul className="list-disc pl-6 flex flex-col gap-2">
        <li><strong>Paddle</strong> — payment processing.</li>
        <li><strong>Resend</strong> — sending transactional and recipient emails.</li>
        <li><strong>MinIO</strong> (self-hosted) — storing your uploaded media.</li>
      </ul>
      <p>Each has their own privacy policy. We pick partners we trust to keep data minimal and secure.</p>
    </LegalSection>

    <LegalSection title="Retention">
      <p>
        Card content is deleted when the link expires (3–30 days after creation, depending on tier). Payment records are kept for tax and accounting purposes for the period required by Canadian law. You may request deletion of any account data at any time.
      </p>
    </LegalSection>

    <LegalSection title="Your rights">
      <p>
        You can request access to, correction of, or deletion of your personal data by emailing us. We respond within 30 days.
      </p>
    </LegalSection>

    <LegalSection title="Contact">
      <p>
        Privacy questions: <a href="mailto:privacy@giflove.ca" className="text-pop-violet hover:text-pop-rose underline">privacy@giflove.ca</a>.
      </p>
    </LegalSection>
  </LegalLayout>
);
