/**
 * One-time migration: backfill cards.template_id from UUID to slug.
 *
 * Run BEFORE dropping the templates table:
 *   docker compose -f docker-compose.prod.yml exec app npx ts-node prisma/scripts/migrate-template-ids.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map template names (as stored in DB) to registry slugs
const NAME_TO_SLUG: Record<string, string> = {
  'Balloon Party': 'balloon-party',
  'Rose Petals': 'rose-petals',
  'Diploma Scroll': 'diploma-scroll',
  'Confetti Burst': 'confetti-burst',
  'Simple Thanks': 'simple-thanks',
  'Achievement': 'achievement',
  'Cake Celebration': 'cake-celebration',
  'Heart Float': 'heart-float',
  'Cap Toss': 'cap-toss',
};

async function main() {
  console.log('Starting template ID migration (UUID → slug)...\n');

  // Fetch all templates from DB
  const templates = await (prisma as any).template.findMany();

  if (templates.length === 0) {
    console.log('No templates found in DB — nothing to migrate.');
    return;
  }

  let totalUpdated = 0;

  for (const template of templates) {
    const slug = NAME_TO_SLUG[template.name];

    if (!slug) {
      console.warn(`WARNING: No slug mapping for template "${template.name}" (${template.id}) — skipping`);
      continue;
    }

    // Update all cards pointing to this template UUID
    const result = await prisma.card.updateMany({
      where: { templateId: template.id },
      data: { templateId: slug },
    });

    console.log(`"${template.name}" (${template.id}) → "${slug}": ${result.count} card(s) updated`);
    totalUpdated += result.count;
  }

  console.log(`\nDone. ${totalUpdated} card(s) updated total.`);

  // Verify: no UUID-format template IDs should remain
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const allCards = await prisma.card.findMany({ select: { id: true, templateId: true } });
  const uuidCards = allCards.filter((c) => uuidPattern.test(c.templateId));

  if (uuidCards.length > 0) {
    console.error(`\nERROR: ${uuidCards.length} card(s) still have UUID template IDs:`);
    uuidCards.forEach((c) => console.error(`  Card ${c.id}: templateId = ${c.templateId}`));
    process.exit(1);
  } else {
    console.log('Verification passed: no UUID template IDs remaining.');
  }
}

main()
  .catch((e) => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
