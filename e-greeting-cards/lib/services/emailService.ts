import sgMail from '@sendgrid/mail';

// Initialize SendGrid if API key is available
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export interface SendCardEmailParams {
  recipientEmail: string;
  recipientName?: string;
  cardUrl: string;
  senderName: string;
  cardCategory: string;
  expiresAt: Date;
}

/**
 * Send a card link via email
 */
export async function sendCardEmail(
  params: SendCardEmailParams
): Promise<boolean> {
  const {
    recipientEmail,
    recipientName,
    cardUrl,
    senderName,
    cardCategory,
    expiresAt,
  } = params;

  // If no API key, log to console (for development)
  if (!apiKey) {
    console.log('SendGrid not configured. Email would be sent to:', recipientEmail);
    console.log('Card URL:', cardUrl);
    return true;
  }

  const formattedExpiry = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    const html = generateEmailHTML(
      senderName,
      cardCategory,
      cardUrl,
      formattedExpiry,
      recipientName
    );

    const msg = {
      to: recipientEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@e-greeting-cards.com',
      subject: `${senderName} sent you a ${cardCategory} card! 🎉`,
      html,
      trackingSettings: {
        clickTracking: { enabled: true },
        openTracking: { enabled: true },
      },
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${recipientEmail}:`, error);
    return false;
  }
}

/**
 * Send multiple card emails
 */
export async function sendCardEmailsToRecipients(
  recipientEmails: string[],
  params: Omit<SendCardEmailParams, 'recipientEmail' | 'recipientName'>
): Promise<{ succeeded: number; failed: number }> {
  let succeeded = 0;
  let failed = 0;

  for (const email of recipientEmails) {
    const success = await sendCardEmail({
      ...params,
      recipientEmail: email,
    });

    if (success) {
      succeeded++;
    } else {
      failed++;
    }
  }

  return { succeeded, failed };
}

/**
 * Generate responsive email HTML
 */
export function generateEmailHTML(
  senderName: string,
  cardCategory: string,
  cardUrl: string,
  expiresAt: string,
  recipientName?: string
): string {
  const recipientGreeting = recipientName
    ? `Hello ${recipientName},`
    : 'Hello,';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You've Received a Greeting Card</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .greeting {
          font-size: 16px;
          color: #333;
          margin-bottom: 10px;
        }
        .message {
          font-size: 18px;
          color: #333;
          margin-bottom: 30px;
          font-weight: 500;
        }
        .highlight {
          color: #FF6B9D;
          font-weight: bold;
        }
        .button-wrapper {
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 16px 40px;
          background-color: #FF6B9D;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .button:hover {
          background-color: #E85680;
        }
        .cta-text {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
        .divider {
          border: none;
          border-top: 1px solid #eee;
          margin: 30px 0;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
        }
        .footer a {
          color: #FF6B9D;
          text-decoration: none;
        }
        .info-box {
          background-color: #E8F4F8;
          border-left: 4px solid #4ECDC4;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          border-radius: 4px;
          font-size: 13px;
          color: #2c5aa0;
        }
        .expiry-notice {
          font-size: 12px;
          color: #999;
          margin-top: 30px;
        }
        @media (max-width: 600px) {
          .container {
            max-width: 100%;
          }
          .header {
            padding: 30px 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .content {
            padding: 30px 20px;
          }
          .button {
            display: block;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 You've Received a Card!</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
          <p class="greeting">${recipientGreeting}</p>

          <p class="message">
            <span class="highlight">${senderName}</span> sent you a special <span class="highlight">${cardCategory}</span> card!
          </p>

          <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
            Click the button below to view your beautiful animated greeting card.
          </p>

          <!-- CTA Button -->
          <div class="button-wrapper">
            <a href="${cardUrl}" class="button">Open Your Card</a>
          </div>

          <!-- Info Box -->
          <div class="info-box">
            <strong>✨ What to expect:</strong><br>
            Your card features beautiful animations and personalized messages. The experience is optimized for mobile phones, so you'll have the best view on your phone!
          </div>

          <!-- Expiry Notice -->
          <p class="expiry-notice">
            ⏰ <strong>Important:</strong> This card link expires on ${expiresAt}. Make sure to open it before then!
          </p>

          <hr class="divider">

          <!-- Growth Loop -->
          <p style="color: #999; font-size: 13px;">
            Want to send your own greeting card? It's easy and only costs $3-$5!<br>
            <a href="${process.env.BASE_URL || 'https://e-greeting-cards.com'}" style="color: #FF6B9D; text-decoration: none; font-weight: bold;">Create your first card →</a>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            Questions? <a href="mailto:support@e-greeting-cards.com">Contact us</a>
          </p>
          <p style="margin-top: 10px;">
            © 2025 E-Greeting Cards. All rights reserved.
          </p>
        </div>
      </div>

      <!-- Tracking pixel (optional, handled by SendGrid) -->
    </body>
    </html>
  `;
}
