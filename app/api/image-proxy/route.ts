import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Image proxy that serves pre-cached static images
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // Generate hash for the cached filename
  const urlHash = crypto.createHash('md5').update(imageUrl).digest('hex');
  const cachedPath = `/cache/images/${urlHash}.jpg`;

  // Fetch the pre-cached static image and return it
  // This works with Next.js Image Optimization (unlike redirects)
  const origin = request.nextUrl.origin;
  const imageResponse = await fetch(`${origin}${cachedPath}`);

  if (!imageResponse.ok) {
    // Return placeholder if cached image not found
    const placeholderResponse = await fetch(`${origin}/images/placeholder.svg`);
    return new NextResponse(placeholderResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Return the cached image
  return new NextResponse(imageResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}