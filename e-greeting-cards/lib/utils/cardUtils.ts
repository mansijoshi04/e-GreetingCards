/**
 * Shared card utility functions used across animation components.
 */
import html2canvas from 'html2canvas';

/**
 * Share the current card via different channels.
 */
export function shareCard(method: 'copy' | 'whatsapp' | 'email'): void {
  const url = window.location.href;
  const title = 'You received a special greeting card!';

  if (method === 'copy') {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  } else if (method === 'whatsapp') {
    const text = encodeURIComponent(`${title}\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  } else if (method === 'email') {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Open this greeting card:\n\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }
}

/**
 * Download the card element matching `selector` as a PNG image.
 */
export async function downloadCardAsPng(selector: string): Promise<void> {
  try {
    const cardElement = document.querySelector(selector);
    if (!cardElement) {
      alert('Card content not found');
      return;
    }

    const canvas = await html2canvas(cardElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = 'greeting-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error downloading card:', error);
    alert('Failed to download card');
  }
}
