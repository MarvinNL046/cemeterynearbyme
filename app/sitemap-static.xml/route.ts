// Static pages sitemap
export async function GET() {
  const baseUrl = 'https://www.begraafplaatsindebuurt.nl';
  
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { url: '/voorwaarden', priority: 0.3, changefreq: 'yearly' },
    { url: '/provincie', priority: 0.8, changefreq: 'weekly' },
    { url: '/type', priority: 0.7, changefreq: 'weekly' },
  ];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  for (const page of staticPages) {
    xml += `<url>
      <loc>${baseUrl}${page.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
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