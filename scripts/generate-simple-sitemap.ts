import { getAllCemeteries, getAllProvinces, getAllMunicipalities } from '../lib/data';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const BASE_URL = 'https://www.begraafplaatsindebuurt.nl';

async function generateSimpleSitemap() {
  console.log(chalk.blue('🗺️  Generating simple sitemap...'));
  
  // Get all data
  const cemeteries = await getAllCemeteries();
  const provinces = await getAllProvinces();
  const municipalities = await getAllMunicipalities();
  
  console.log(chalk.cyan(`Found ${cemeteries.length} cemeteries`));
  console.log(chalk.cyan(`Found ${provinces.length} provinces`));
  console.log(chalk.cyan(`Found ${municipalities.length} municipalities`));
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Homepage
  xml += `  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;
  
  // Static pages
  const staticPages = [
    { path: '/privacy', priority: 0.3 },
    { path: '/voorwaarden', priority: 0.3 },
    { path: '/over-ons', priority: 0.5 },
    { path: '/contact', priority: 0.5 },
    { path: '/blog', priority: 0.7 },
    { path: '/provincie', priority: 0.8 },
    { path: '/type', priority: 0.7 },
  ];
  
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
  }
  
  // Province pages
  for (const province of provinces) {
    const slug = province.toLowerCase().replace(/\s+/g, '-');
    xml += `  <url>
    <loc>${BASE_URL}/provincie/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }
  
  // Municipality pages (limit to avoid huge sitemap)
  const topMunicipalities = municipalities.slice(0, 500); // First 500
  for (const municipality of topMunicipalities) {
    const slug = municipality.toLowerCase().replace(/\s+/g, '-');
    xml += `  <url>
    <loc>${BASE_URL}/gemeente/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  }
  
  // Cemetery pages (most important - limit to ensure Google processes them)
  const topCemeteries = cemeteries.slice(0, 1000); // First 1000
  for (const cemetery of topCemeteries) {
    xml += `  <url>
    <loc>${BASE_URL}/begraafplaats/${cemetery.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  }
  
  xml += '</urlset>';
  
  // Write to public directory
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  await fs.writeFile(sitemapPath, xml);
  
  // Calculate stats
  const totalUrls = 1 + staticPages.length + provinces.length + topMunicipalities.length + topCemeteries.length;
  
  console.log(chalk.green('✅ Sitemap generated successfully!'));
  console.log(chalk.white(`Total URLs: ${totalUrls}`));
  console.log(chalk.gray(`- Static pages: ${staticPages.length + 1}`));
  console.log(chalk.gray(`- Provinces: ${provinces.length}`));
  console.log(chalk.gray(`- Municipalities: ${topMunicipalities.length} (of ${municipalities.length})`));
  console.log(chalk.gray(`- Cemeteries: ${topCemeteries.length} (of ${cemeteries.length})`));
  console.log(chalk.yellow(`\nSaved to: ${sitemapPath}`));
  
  // Also create a robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml`;
  
  await fs.writeFile(path.join(process.cwd(), 'public', 'robots.txt'), robotsTxt);
  console.log(chalk.green('✅ robots.txt updated'));
}

// Run if called directly
if (require.main === module) {
  generateSimpleSitemap().catch(console.error);
}

export { generateSimpleSitemap };