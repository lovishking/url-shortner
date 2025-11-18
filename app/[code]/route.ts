import { NextResponse } from 'next/server';
import { getLinkByCode, incrementClicks } from '@/lib/services/linkService';
import { isValidCode } from '@/lib/utils/validation';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  // Validate code format
  if (!isValidCode(code)) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    // Get link by code
    const link = await getLinkByCode(code);

    if (!link) {
      return new Response('Not Found', { status: 404 });
    }

    // Increment clicks asynchronously (don't wait)
    incrementClicks(code).catch((error) => {
      console.error('Error incrementing clicks:', error);
    });

    // Perform 302 redirect using NextResponse
    return NextResponse.redirect(link.long_url, { status: 302 });
  } catch (error) {
    console.error('Error processing redirect:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
