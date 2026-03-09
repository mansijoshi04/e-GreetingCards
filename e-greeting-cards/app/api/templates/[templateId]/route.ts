import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/services/templateService';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/templates/[templateId]
 * Get single template with full design config
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const template = await getTemplateById(templateId);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error('Error fetching template:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
