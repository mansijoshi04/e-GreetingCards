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
          backgroundValue: ['#FFE5EC', '#FFC4D6'],
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
              color: '#FF6B9D',
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
          backgroundValue: ['#FFF0F3', '#FFE0E6'],
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
              color: '#C84B6E',
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
              color: '#4A4A4A',
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
