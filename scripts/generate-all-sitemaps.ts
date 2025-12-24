import { getAllCemeteries, getAllProvinces, getAllMunicipalities } from '../lib/data';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const BASE_URL = 'https://www.begraafplaatsindebuurt.nl';
const URLS_PER_SITEMAP = 1000;

async function generateAllSitemaps() {
  console.log(chalk.blue('🗺️  Generating complete sitemap structure...'));
  
  // Get all data
  const cemeteries = await getAllCemeteries();
  const provinces = await getAllProvinces();
  const municipalities = await getAllMunicipalities();
  
  console.log(chalk.cyan(`Found ${cemeteries.length} cemeteries`));
  console.log(chalk.cyan(`Found ${provinces.length} provinces`));
  console.log(chalk.cyan(`Found ${municipalities.length} municipalities`));
  
  const publicDir = path.join(process.cwd(), 'public');
  const generatedSitemaps = [];
  
  // 1. Generate main sitemap with static pages and provinces
  let mainXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  mainXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Homepage
  mainXml += `  <url>
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
    mainXml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
  }
  
  // Province pages
  for (const province of provinces) {
    const slug = province.toLowerCase().replace(/\s+/g, '-');
    mainXml += `  <url>
    <loc>${BASE_URL}/provincie/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }
  
  mainXml += '</urlset>';
  await fs.writeFile(path.join(publicDir, 'sitemap-main.xml'), mainXml);
  generatedSitemaps.push('sitemap-main.xml');
  
  // 2. Generate municipality sitemaps
  const municipalityChunks = Math.ceil(municipalities.length / URLS_PER_SITEMAP);
  for (let i = 0; i < municipalityChunks; i++) {
    const start = i * URLS_PER_SITEMAP;
    const end = Math.min(start + URLS_PER_SITEMAP, municipalities.length);
    const chunk = municipalities.slice(start, end);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const municipality of chunk) {
      const slug = municipality.toLowerCase().replace(/\s+/g, '-');
      xml += `  <url>
    <loc>${BASE_URL}/gemeente/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    }
    
    xml += '</urlset>';
    const filename = `sitemap-gemeenten-${i + 1}.xml`;
    await fs.writeFile(path.join(publicDir, filename), xml);
    generatedSitemaps.push(filename);
  }
  
  // 3. Generate cemetery sitemaps
  const cemeteryChunks = Math.ceil(cemeteries.length / URLS_PER_SITEMAP);
  for (let i = 0; i < cemeteryChunks; i++) {
    const start = i * URLS_PER_SITEMAP;
    const end = Math.min(start + URLS_PER_SITEMAP, cemeteries.length);
    const chunk = cemeteries.slice(start, end);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const cemetery of chunk) {
      xml += `  <url>
    <loc>${BASE_URL}/begraafplaats/${cemetery.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    }
    
    xml += '</urlset>';
    const filename = `sitemap-begraafplaatsen-${i + 1}.xml`;
    await fs.writeFile(path.join(publicDir, filename), xml);
    generatedSitemaps.push(filename);
  }
  
  // 4. Generate sitemap index
  let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const sitemap of generatedSitemaps) {
    indexXml += `  <sitemap>
    <loc>${BASE_URL}/${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>\n`;
  }
  
  indexXml += '</sitemapindex>';
  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), indexXml);
  
  // 5. Update robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
${generatedSitemaps.map(s => `Sitemap: ${BASE_URL}/${s}`).join('\n')}`;
  
  await fs.writeFile(path.join(publicDir, 'robots.txt'), robotsTxt);
  
  // Calculate stats
  const totalUrls = staticPages.length + 1 + provinces.length + municipalities.length + cemeteries.length;
  
  console.log(chalk.green('✅ All sitemaps generated successfully!'));
  console.log(chalk.white(`Total URLs: ${totalUrls}`));
  console.log(chalk.gray(`- Static + provinces: ${staticPages.length + 1 + provinces.length}`));
  console.log(chalk.gray(`- Municipalities: ${municipalities.length} (in ${municipalityChunks} sitemaps)`));
  console.log(chalk.gray(`- Cemeteries: ${cemeteries.length} (in ${cemeteryChunks} sitemaps)`));
  console.log(chalk.yellow(`\nGenerated ${generatedSitemaps.length} sitemaps:`));
  generatedSitemaps.forEach(s => console.log(chalk.gray(`  - ${s}`)));
  console.log(chalk.green('\n✅ robots.txt updated with all sitemaps'));
}

// Run if called directly
if (require.main === module) {
  generateAllSitemaps().catch(console.error);
}

export { generateAllSitemaps };