import { NextRequest, NextResponse } from 'next/server';
import { getTemplatesGrouped, getAllTemplates } from '@/lib/services/templateService';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/templates
 * Get all active templates, optionally grouped by category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grouped = searchParams.get('grouped') === 'true';

    if (grouped) {
      const templates = await getTemplatesGrouped();
      return NextResponse.json(templates, { status: 200 });
    }

    const templates = await getAllTemplates();
    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch templates',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
