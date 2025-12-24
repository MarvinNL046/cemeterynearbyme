import { getAllProvinces, getAllTypes } from '@/lib/data';

// Provinces and types sitemap
export async function GET() {
  const baseUrl = 'https://www.begraafplaatsindebuurt.nl';
  
  const [provinces, types] = await Promise.all([
    getAllProvinces(),
    getAllTypes(),
  ]);
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Province pages
  for (const province of provinces) {
    xml += `<url>
      <loc>${baseUrl}/provincie/${province.toLowerCase().replace(/\s+/g, '-')}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  }
  
  // Type pages
  for (const type of types) {
    xml += `<url>
      <loc>${baseUrl}/type/${type.toLowerCase().replace(/\s+/g, '-')}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`;
  }
  
  xml += '</urlset>';
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}