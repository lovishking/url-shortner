import { NextRequest, NextResponse } from 'next/server';
import { createLink, getAllLinks } from '@/lib/services/linkService';
import { createLinkSchema, isValidUrl } from '@/lib/utils/validation';

// GET /api/links - Get all links
export async function GET() {
  try {
    const links = await getAllLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST /api/links - Create a new short link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = createLinkSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { longUrl, customCode } = validation.data;

    // Validate URL
    if (!isValidUrl(longUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Create link
    const link = await createLink(longUrl, customCode);

    return NextResponse.json(link, { status: 201 });
  } catch (error: any) {
    console.error('Error creating link:', error);

    // Handle code already exists
    if (error.message === 'Code already exists') {
      return NextResponse.json(
        { error: 'Custom code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
