import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Dynamic route to serve sitemap files from public/sitemaps directory
export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    // Validate filename to prevent directory traversal
    if (!filename.endsWith('.xml') || filename.includes('..')) {
      return new NextResponse('Invalid sitemap filename', { status: 400 });
    }

    // Read the sitemap from the public/sitemaps directory
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemaps', filename);
    
    if (!fs.existsSync(sitemapPath)) {
      return new NextResponse('Sitemap not found', { status: 404 });
    }

    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}