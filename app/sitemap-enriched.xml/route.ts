import { getAllCemeteries } from '@/lib/data';
import { promises as fs } from 'fs';
import path from 'path';

// Sitemap for enriched cemetery pages (higher priority)
export async function GET() {
  const baseUrl = 'https://www.begraafplaatsindebuurt.nl';
  
  // Get all cemeteries
  const cemeteries = await getAllCemeteries();
  
  // Check which ones have enriched content
  const enrichedCemeteries = [];
  const enrichedDir = path.join(process.cwd(), 'data', 'enriched-content');
  
  for (const cemetery of cemeteries) {
    try {
      // Check if enriched file exists
      const enrichedPath = path.join(enrichedDir, `${cemetery.slug}.json`);
      await fs.access(enrichedPath);
      
      // If we get here, the file exists
      enrichedCemeteries.push(cemetery);
    } catch {
      // File doesn't exist, skip
    }
  }
  
  // Create sitemap XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add enriched cemetery pages with higher priority
  for (const cemetery of enrichedCemeteries) {
    const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    xml += `<url>
      <loc>${baseUrl}/begraafplaats/${cemetery.slug}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>`;
  }
  
  xml += '</urlset>';
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}