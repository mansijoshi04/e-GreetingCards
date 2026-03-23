export interface SendCardEmailParams {
  recipientEmail: string;
  recipientName?: string;
  cardUrl: string;
  senderName: string;
  cardCategory: string;
  expiresAt: Date;
}

/**
 * Send a card link via email.
 * Behaviour is controlled by EMAIL_PROVIDER env var:
 *   console  → pretty-print to stdout (development default)
 *   resend   → send via Resend REST API (production)
 *   mailgun  → send via Mailgun REST API (commented out, kept for reference)
 */
export async function sendCardEmail(
  params: SendCardEmailParams
): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER || 'console';

  if (provider === 'resend') {
    return sendViaResend(params);
  }

  // if (provider === 'mailgun') {
  //   return sendViaMailgun(params);
  // }

  return printToConsole(params);
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
    const success = await sendCardEmail({ ...params, recipientEmail: email });
    if (success) succeeded++;
    else failed++;
  }

  return { succeeded, failed };
}

// ---------------------------------------------------------------------------
// Console provider (development)
// ---------------------------------------------------------------------------

function printToConsole(params: SendCardEmailParams): boolean {
  const { recipientEmail, recipientName, cardUrl, senderName, cardCategory, expiresAt } = params;

  const formattedExpiry = expiresAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const w = 64;
  const line  = '═'.repeat(w - 2);
  const dline = '─'.repeat(w - 2);
  const pad   = (s: string) => `║  ${s}${' '.repeat(Math.max(0, w - 5 - s.length))}║`;

  console.log(`\n╔${line}╗`);
  console.log(pad('📧  EMAIL (console mode — not actually sent)'));
  console.log(`╠${dline.replace(/-/g, '─')}╣`);
  console.log(pad(`TO:       ${recipientEmail}`));
  console.log(pad(`FROM:     ${process.env.EMAIL_FROM || 'cards@yourapp.com'}`));
  console.log(pad(`SUBJECT:  ${senderName} sent you a ${cardCategory} card! 🎉`));
  if (recipientName) {
    console.log(pad(`DEAR:     ${recipientName}`));
  }
  console.log(`╠${dline.replace(/-/g, '─')}╣`);
  console.log(pad(`CARD LINK:`));
  console.log(pad(`  ${cardUrl}`));
  console.log(pad(`EXPIRES:  ${formattedExpiry}`));
  console.log(`╚${line}╝\n`);

  return true;
}

// ---------------------------------------------------------------------------
// Resend provider (production)
// ---------------------------------------------------------------------------

async function sendViaResend(params: SendCardEmailParams): Promise<boolean> {
  const { recipientEmail, recipientName, cardUrl, senderName, cardCategory, expiresAt } = params;

  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.EMAIL_FROM || 'cards@giflove.ca';

  if (!apiKey) {
    console.error('[email] RESEND_API_KEY not set — falling back to console');
    return printToConsole(params);
  }

  const formattedExpiry = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipientEmail,
        subject: `${senderName} sent you a ${cardCategory} card! 🎉`,
        html: generateEmailHTML(senderName, cardCategory, cardUrl, formattedExpiry, recipientName),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[email] Resend error ${response.status}:`, text);
      return false;
    }

    console.log(`[email] Sent via Resend to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error(`[email] Resend request failed:`, error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Mailgun provider — commented out, kept for reference if switching back
// ---------------------------------------------------------------------------

// async function sendViaMailgun(params: SendCardEmailParams): Promise<boolean> {
//   const { recipientEmail, recipientName, cardUrl, senderName, cardCategory, expiresAt } = params;
//
//   const apiKey  = process.env.MAILGUN_API_KEY;
//   const domain  = process.env.MAILGUN_DOMAIN;
//   const from    = process.env.EMAIL_FROM || `cards@${domain}`;
//   const region  = process.env.MAILGUN_REGION || 'us'; // 'us' or 'eu'
//
//   if (!apiKey || !domain) {
//     console.error('[email] MAILGUN_API_KEY or MAILGUN_DOMAIN not set — falling back to console');
//     return printToConsole(params);
//   }
//
//   const formattedExpiry = expiresAt.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });
//
//   const baseUrl = region === 'eu'
//     ? 'https://api.eu.mailgun.net'
//     : 'https://api.mailgun.net';
//
//   const body = new URLSearchParams({
//     from,
//     to: recipientEmail,
//     subject: `${senderName} sent you a ${cardCategory} card! 🎉`,
//     html: generateEmailHTML(senderName, cardCategory, cardUrl, formattedExpiry, recipientName),
//   });
//
//   try {
//     const response = await fetch(`${baseUrl}/v3/${domain}/messages`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: body.toString(),
//     });
//
//     if (!response.ok) {
//       const text = await response.text();
//       console.error(`[email] Mailgun error ${response.status}:`, text);
//       return false;
//     }
//
//     console.log(`[email] Sent via Mailgun to ${recipientEmail}`);
//     return true;
//   } catch (error) {
//     console.error(`[email] Mailgun request failed:`, error);
//     return false;
//   }
// }

// ---------------------------------------------------------------------------
// Email HTML template
// ---------------------------------------------------------------------------

export function generateEmailHTML(
  senderName: string,
  cardCategory: string,
  cardUrl: string,
  expiresAt: string,
  recipientName?: string
): string {
  const greeting = recipientName ? `Hello ${recipientName},` : 'Hello,';
  const baseUrl  = process.env.BASE_URL || 'https://e-greeting-cards.com';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've Received a Greeting Card</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%); color: #fff; padding: 40px 20px; text-align: center; }
    .header h1 { font-size: 28px; font-weight: bold; }
    .content { padding: 40px 30px; text-align: center; }
    .highlight { color: #FF6B9D; font-weight: bold; }
    .button { display: inline-block; padding: 16px 40px; background: #FF6B9D; color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 24px 0; }
    .info-box { background: #E8F4F8; border-left: 4px solid #4ECDC4; padding: 15px; margin: 20px 0; text-align: left; border-radius: 4px; font-size: 13px; color: #2c5aa0; }
    .expiry { font-size: 12px; color: #999; margin-top: 24px; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666; }
    .footer a { color: #FF6B9D; text-decoration: none; }
    @media (max-width: 600px) {
      .header h1 { font-size: 22px; }
      .content { padding: 24px 16px; }
      .button { display: block; width: 100%; max-width: 300px; margin: 20px auto; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 You've Received a Card!</h1>
    </div>
    <div class="content">
      <p style="font-size:16px; margin-bottom:8px;">${greeting}</p>
      <p style="font-size:18px; font-weight:500; margin-bottom:20px;">
        <span class="highlight">${senderName}</span> sent you a special
        <span class="highlight">${cardCategory}</span> card!
      </p>
      <p style="color:#666; font-size:15px; margin-bottom:8px;">
        Click below to view your animated greeting card.
      </p>
      <a href="${cardUrl}" class="button">Open Your Card 🎁</a>
      <div class="info-box">
        <strong>✨ What to expect:</strong><br>
        Your card has beautiful animations and a personal message. Best viewed on mobile!
      </div>
      <p class="expiry">⏰ This card link expires on <strong>${expiresAt}</strong>.</p>
      <hr style="border:none; border-top:1px solid #eee; margin:28px 0;">
      <p style="color:#999; font-size:13px;">
        Want to send your own card?
        <a href="${baseUrl}" style="color:#FF6B9D; font-weight:bold; text-decoration:none;">Create one for $3–$5 →</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2025 E-Greeting Cards. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
