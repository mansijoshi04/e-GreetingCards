import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with templates...');

  // Delete in dependency order (cards reference templates)
  await prisma.cardOpen.deleteMany();
  await prisma.recipient.deleteMany();
  await prisma.card.deleteMany();
  await prisma.template.deleteMany();

  // 1. Balloon Party - Birthday Basic
  await prisma.template.create({
    data: {
      name: 'Balloon Party',
      category: 'birthday',
      tier: 'basic',
      priceCents: 300,
      thumbnailUrl: '/templates/balloon-party-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'envelope-open',
          confetti: {
            enabled: true,
            colors: ['#FF6B9D', '#FFE66D', '#4ECDC4'],
            intensity: 200,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#87CEEB', '#B0E2F0'],
          visualTheme: 'balloon-party',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Happy Birthday!',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '48px',
              fontFamily: 'Poppins',
              fontWeight: '700',
              color: '#FF4500',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeInUp', delay: 0.3 },
            },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Hope your day is filled with joy!',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '20px',
              fontFamily: 'Inter',
              color: '#333333',
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: '1.6',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeInUp', delay: 0.6 },
            },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'Love, [Your Name]',
            position: { bottom: '15%', right: '10%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Dancing Script',
              color: '#666666',
              fontStyle: 'italic',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeIn', delay: 0.9 },
            },
          },
        ],
        customizableProperties: [
          'headline.text',
          'headline.color',
          'body.text',
          'signature.text',
          'layout.backgroundValue',
        ],
      }),
    },
  });

  // 2. Rose Petals - Anniversary Premium
  await prisma.template.create({
    data: {
      name: 'Rose Petals',
      category: 'anniversary',
      tier: 'premium',
      priceCents: 500,
      thumbnailUrl: '/templates/rose-petals-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'envelope-open',
          confetti: {
            enabled: true,
            colors: ['#C84B6E', '#FFB6C1', '#D4AF37'],
            intensity: 150,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#3d0015', '#7b1040'],
          visualTheme: 'rose-petals',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Happy Anniversary!',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '48px',
              fontFamily: 'Dancing Script',
              fontWeight: '700',
              color: '#FFB6C1',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeInUp', delay: 0.3 },
            },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Forever starts now...',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '22px',
              fontFamily: 'Inter',
              color: '#f9d0e0',
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: '1.8',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeInUp', delay: 0.6 },
            },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'With all my love',
            position: { bottom: '15%', right: '10%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Dancing Script',
              color: '#FFB6C1',
              fontStyle: 'italic',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeIn', delay: 0.9 },
            },
          },
        ],
        customizableProperties: [
          'headline.text',
          'headline.color',
          'body.text',
          'signature.text',
          'layout.backgroundValue',
        ],
      }),
    },
  });

  // 3. Diploma Scroll - Graduation Basic
  await prisma.template.create({
    data: {
      name: 'Diploma Scroll',
      category: 'graduation',
      tier: 'basic',
      priceCents: 300,
      thumbnailUrl: '/templates/diploma-scroll-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'envelope-open',
          confetti: {
            enabled: true,
            colors: ['#2E5090', '#FFD700', '#00A8E8'],
            intensity: 200,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#F0F4F8', '#E8F0F8'],
          visualTheme: 'diploma-scroll',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Congratulations Graduate!',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '48px',
              fontFamily: 'Poppins',
              fontWeight: '700',
              color: '#2E5090',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeInUp', delay: 0.3 },
            },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Your hard work has paid off. The world is waiting for you!',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Inter',
              color: '#1A1A1A',
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: '1.6',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeInUp', delay: 0.6 },
            },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'Proud of you!',
            position: { bottom: '15%', right: '10%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Inter',
              color: '#666666',
            },
            editable: true,
            animations: {
              entrance: { type: 'fadeIn', delay: 0.9 },
            },
          },
        ],
        customizableProperties: [
          'headline.text',
          'headline.color',
          'body.text',
          'signature.text',
          'layout.backgroundValue',
        ],
      }),
    },
  });

  // 4. Confetti Burst - Birthday Basic
  await prisma.template.create({
    data: {
      name: 'Confetti Burst',
      category: 'birthday',
      tier: 'basic',
      priceCents: 300,
      thumbnailUrl: '/templates/confetti-burst-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'envelope-open',
          confetti: {
            enabled: true,
            colors: ['#FF6B9D', '#FFE66D', '#4ECDC4', '#FF4500', '#9370DB'],
            intensity: 400,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#FFF8E7', '#FFF0F3'],
          visualTheme: 'confetti-burst',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Happy Birthday! 🎉',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '52px',
              fontFamily: 'Poppins',
              fontWeight: '700',
              color: '#FF4500',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.3 } },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Wishing you a day bursting with happiness!',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '20px',
              fontFamily: 'Inter',
              color: '#333333',
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: '1.6',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.6 } },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'With love',
            position: { bottom: '15%', right: '10%' },
            style: { fontSize: '18px', fontFamily: 'Dancing Script', color: '#666666', fontStyle: 'italic' },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 0.9 } },
          },
        ],
        customizableProperties: ['headline.text', 'body.text', 'signature.text', 'layout.backgroundValue'],
      }),
    },
  });

  // 5. Simple Thanks - Thank You Basic
  await prisma.template.create({
    data: {
      name: 'Simple Thanks',
      category: 'thankYou',
      tier: 'basic',
      priceCents: 300,
      thumbnailUrl: '/templates/simple-thanks-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'auto-play',
          confetti: { enabled: false },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#0b2e22', '#1a5240'],
          visualTheme: 'simple-thanks',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Thank You',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '56px',
              fontFamily: 'Cormorant Garamond',
              fontWeight: '300',
              color: '#a8e6cf',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 0.3 } },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Your kindness means more than words can say.',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Inter',
              color: '#d4f5e9',
              textAlign: 'center',
              maxWidth: '65%',
              lineHeight: '1.8',
            },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 0.7 } },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'Gratefully',
            position: { bottom: '15%', right: '10%' },
            style: { fontSize: '18px', fontFamily: 'Dancing Script', color: '#a8e6cf', fontStyle: 'italic' },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 1.1 } },
          },
        ],
        customizableProperties: ['headline.text', 'body.text', 'signature.text', 'layout.backgroundValue'],
      }),
    },
  });

  // 6. Achievement - Graduation Basic
  await prisma.template.create({
    data: {
      name: 'Achievement',
      category: 'graduation',
      tier: 'basic',
      priceCents: 300,
      thumbnailUrl: '/templates/achievement-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'auto-play',
          confetti: {
            enabled: true,
            colors: ['#FFD700', '#DAA520', '#FFA500', '#2E5090'],
            intensity: 180,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#FFF8E7', '#FFFDE4'],
          visualTheme: 'achievement',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'You Did It!',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '60px',
              fontFamily: 'Poppins',
              fontWeight: '700',
              color: '#DAA520',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.3 } },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Years of hard work, late nights, and dedication — all leading to this moment.',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Inter',
              color: '#333333',
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: '1.6',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.6 } },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'So proud of you',
            position: { bottom: '15%', right: '10%' },
            style: { fontSize: '18px', fontFamily: 'Dancing Script', color: '#DAA520', fontStyle: 'italic' },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 0.9 } },
          },
        ],
        customizableProperties: ['headline.text', 'body.text', 'signature.text', 'layout.backgroundValue'],
      }),
    },
  });

  // 7. Cake Celebration - Birthday Premium
  await prisma.template.create({
    data: {
      name: 'Cake Celebration',
      category: 'birthday',
      tier: 'premium',
      priceCents: 500,
      thumbnailUrl: '/templates/cake-celebration-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'click-to-reveal',
          confetti: {
            enabled: true,
            colors: ['#FFD700', '#FF6B9D', '#FFA500', '#FF4500'],
            intensity: 300,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#13111a', '#2a1f50'],
          visualTheme: 'cake-celebration',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Make a Wish!',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '52px',
              fontFamily: 'Dancing Script',
              fontWeight: '700',
              color: '#FFD700',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.3 } },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Every candle is a wish, every bite a memory. Hope this birthday is your sweetest yet!',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Inter',
              color: '#e8d5ff',
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: '1.7',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.6 } },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'With all my love',
            position: { bottom: '15%', right: '10%' },
            style: { fontSize: '20px', fontFamily: 'Dancing Script', color: '#FFD700', fontStyle: 'italic' },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 0.9 } },
          },
        ],
        customizableProperties: ['headline.text', 'body.text', 'signature.text', 'layout.backgroundValue'],
      }),
    },
  });

  // 8. Heart Float - Anniversary Premium
  await prisma.template.create({
    data: {
      name: 'Heart Float',
      category: 'anniversary',
      tier: 'premium',
      priceCents: 500,
      thumbnailUrl: '/templates/heart-float-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'click-to-reveal',
          confetti: {
            enabled: true,
            colors: ['#C84B6E', '#FFB6C1', '#FF85A1', '#FFCCD5'],
            intensity: 200,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#fff0f5', '#ffd6e7'],
          visualTheme: 'heart-float',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Still Falling for You',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '46px',
              fontFamily: 'Dancing Script',
              fontWeight: '700',
              color: '#C84B6E',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.3 } },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'Another year together, another year of choosing you every single day.',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '19px',
              fontFamily: 'Inter',
              color: '#4A4A4A',
              textAlign: 'center',
              maxWidth: '68%',
              lineHeight: '1.8',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.6 } },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'Forever yours',
            position: { bottom: '15%', right: '10%' },
            style: { fontSize: '20px', fontFamily: 'Dancing Script', color: '#C84B6E', fontStyle: 'italic' },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 0.9 } },
          },
        ],
        customizableProperties: ['headline.text', 'body.text', 'signature.text', 'layout.backgroundValue'],
      }),
    },
  });

  // 9. Cap Toss - Graduation Premium
  await prisma.template.create({
    data: {
      name: 'Cap Toss',
      category: 'graduation',
      tier: 'premium',
      priceCents: 500,
      thumbnailUrl: '/templates/cap-toss-thumb.jpg',
      designConfig: JSON.stringify({
        version: '1.0',
        animations: {
          entrance: 'fade-in-scale',
          scrollTrigger: 'click-to-reveal',
          confetti: {
            enabled: true,
            colors: ['#2E5090', '#FFD700', '#00A8E8', '#FFFFFF'],
            intensity: 350,
            trigger: 'onReveal',
          },
        },
        layout: {
          backgroundType: 'gradient',
          backgroundValue: ['#0a0e2e', '#151b5e'],
          visualTheme: 'cap-toss',
          containerStyle: 'centered',
          aspectRatio: '16:9',
        },
        elements: [
          {
            id: 'headline',
            type: 'text',
            defaultText: 'Toss That Cap!',
            position: { top: '20%', left: '50%' },
            style: {
              fontSize: '54px',
              fontFamily: 'Poppins',
              fontWeight: '700',
              color: '#FFD700',
              textAlign: 'center',
              maxWidth: '80%',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.3 } },
          },
          {
            id: 'body',
            type: 'text',
            defaultText: 'You crossed the stage, now go change the world. We could not be prouder.',
            position: { top: '45%', left: '50%' },
            style: {
              fontSize: '18px',
              fontFamily: 'Inter',
              color: '#c8d8f8',
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: '1.6',
            },
            editable: true,
            animations: { entrance: { type: 'fadeInUp', delay: 0.6 } },
          },
          {
            id: 'signature',
            type: 'text',
            defaultText: 'So incredibly proud',
            position: { bottom: '15%', right: '10%' },
            style: { fontSize: '20px', fontFamily: 'Dancing Script', color: '#FFD700', fontStyle: 'italic' },
            editable: true,
            animations: { entrance: { type: 'fadeIn', delay: 0.9 } },
          },
        ],
        customizableProperties: ['headline.text', 'body.text', 'signature.text', 'layout.backgroundValue'],
      }),
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
