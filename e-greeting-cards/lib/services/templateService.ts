import { prisma } from '@/lib/db/prisma';
import { Template } from '@prisma/client';

/**
 * Get all active templates
 */
export async function getAllTemplates(): Promise<Template[]> {
  return await prisma.template.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
  });
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(
  category: string
): Promise<Template[]> {
  return await prisma.template.findMany({
    where: {
      isActive: true,
      category: category.toLowerCase(),
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get single template by ID
 */
export async function getTemplateById(
  templateId: string
): Promise<Template | null> {
  return await prisma.template.findUnique({
    where: { id: templateId },
  });
}

/**
 * Get templates grouped by category
 */
export async function getTemplatesGrouped(): Promise<
  Record<string, Template[]>
> {
  const templates = await getAllTemplates();

  const grouped: Record<string, Template[]> = {};

  templates.forEach((template) => {
    if (!grouped[template.category]) {
      grouped[template.category] = [];
    }
    grouped[template.category].push(template);
  });

  return grouped;
}

/**
 * Get template with design config parsed
 */
export async function getTemplateWithDesign(
  templateId: string
): Promise<(Template & { design: any }) | null> {
  const template = await getTemplateById(templateId);

  if (!template) return null;

  return {
    ...template,
    design: template.designConfig as any,
  };
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<string[]> {
  const templates = await getAllTemplates();
  const categories = new Set(templates.map((t) => t.category));
  return Array.from(categories).sort();
}

/**
 * Get template count by category
 */
export async function getTemplateCounts(): Promise<
  Record<string, number>
> {
  const templates = await getAllTemplates();
  const counts: Record<string, number> = {};

  templates.forEach((template) => {
    counts[template.category] = (counts[template.category] || 0) + 1;
  });

  return counts;
}
