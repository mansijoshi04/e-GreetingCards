import type { StaticTemplate } from '@/lib/templates/types';
import {
  getAllTemplates as registryGetAll,
  getTemplatesByCategory as registryGetByCategory,
  getTemplateById as registryGetById,
  getTemplatesGrouped as registryGetGrouped,
  getCategories as registryGetCategories,
  getTemplateCounts as registryGetCounts,
} from '@/lib/templates/registry';

/**
 * Get all active templates
 */
export async function getAllTemplates(): Promise<StaticTemplate[]> {
  return registryGetAll();
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(
  category: string
): Promise<StaticTemplate[]> {
  return registryGetByCategory(category.toLowerCase());
}

/**
 * Get single template by ID
 */
export async function getTemplateById(
  templateId: string
): Promise<StaticTemplate | null> {
  return registryGetById(templateId) ?? null;
}

/**
 * Get templates grouped by category
 */
export async function getTemplatesGrouped(): Promise<
  Record<string, StaticTemplate[]>
> {
  return registryGetGrouped();
}

/**
 * Get template with design config parsed
 */
export async function getTemplateWithDesign(
  templateId: string
): Promise<(StaticTemplate & { design: any }) | null> {
  const template = registryGetById(templateId);
  if (!template) return null;
  return { ...template, design: template.designConfig as any };
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<string[]> {
  return registryGetCategories().sort();
}

/**
 * Get template count by category
 */
export async function getTemplateCounts(): Promise<Record<string, number>> {
  return registryGetCounts();
}
