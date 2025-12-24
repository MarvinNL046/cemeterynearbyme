import fs from 'fs';
import path from 'path';

const baseUrl = 'https://www.begraafplaatsindebuurt.nl';
const URLS_PER_SITEMAP = 1000; // Keep under Google's recommended limit

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function createSitemapXML(urls: SitemapUrl[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of urls) {
    // Properly encode URL to handle special characters
    const encodedLoc = encodeURI(url.loc);
    xml += `  <url>
    <loc>${encodedLoc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>\n`;
  }

  xml += '</urlset>';
  return xml;
}

async function generateSitemaps() {
  console.log('🗺️  Generating sitemaps for begraafplaatsindebuurt.nl...');

  // Create sitemaps directory
  const sitemapsDir = path.join(process.cwd(), 'public/sitemaps');
  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  // Read data files
  const cemeteriesPath = path.join(process.cwd(), 'public/data/cemeteries.json');
  const summaryPath = path.join(process.cwd(), 'public/data/summary.json');

  if (!fs.existsSync(cemeteriesPath) || !fs.existsSync(summaryPath)) {
    console.error('❌ Required data files not found');
    console.error('Please run: npm run generate-data');
    process.exit(1);
  }

  const cemeteriesData = JSON.parse(fs.readFileSync(cemeteriesPath, 'utf-8'));
  const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

  const lastmod = new Date().toISOString().split('T')[0];
  const sitemapFiles: string[] = [];

  // 1. STATIC PAGES SITEMAP
  console.log('📄 Generating static pages sitemap...');
  const staticUrls: SitemapUrl[] = [
    // Homepage
    { loc: baseUrl, lastmod, changefreq: 'daily', priority: '1.0' },

    // Main navigation pages
    { loc: `${baseUrl}/provincie`, lastmod, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/gemeente`, lastmod, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/type`, lastmod, changefreq: 'weekly', priority: '0.8' },

    // Information pages
    { loc: `${baseUrl}/over-ons`, lastmod, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/contact`, lastmod, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/blog`, lastmod, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/download-gids`, lastmod, changefreq: 'monthly', priority: '0.7' },

    // Legal pages
    { loc: `${baseUrl}/privacy`, lastmod, changefreq: 'yearly', priority: '0.3' },
    { loc: `${baseUrl}/voorwaarden`, lastmod, changefreq: 'yearly', priority: '0.3' },
  ];

  // 2. PROVINCE PAGES
  console.log('🏛️  Adding province pages...');
  const provinces = [
    'drenthe', 'flevoland', 'friesland', 'gelderland', 'groningen',
    'limburg', 'noord-brabant', 'noord-holland', 'overijssel',
    'utrecht', 'zeeland', 'zuid-holland', 'onbekend'
  ];

  for (const province of provinces) {
    staticUrls.push({
      loc: `${baseUrl}/provincie/${province}`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.7'
    });
  }

  // 3. TYPE PAGES
  console.log('🏷️  Adding type pages...');
  const types = [
    'algemeen',
    'rooms-katholiek',
    'protestants',
    'joods',
    'islamitisch',
    'natuurbegraafplaats'
  ];

  for (const type of types) {
    staticUrls.push({
      loc: `${baseUrl}/type/${type}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7'
    });
  }

  // 4. PROVINCE-TYPE COMBINATIONS
  console.log('🔗 Adding province-type combination pages...');
  for (const province of provinces) {
    for (const type of types) {
      staticUrls.push({
        loc: `${baseUrl}/provincie/${province}/type/${type}`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.6'
      });
    }
  }

  // 5. DECEASED CALENDAR PAGES
  console.log('⚰️  Adding deceased calendar pages...');

  // Calendar overview page
  staticUrls.push({
    loc: `${baseUrl}/overleden`,
    lastmod,
    changefreq: 'daily',
    priority: '0.8'
  });

  // Today's deaths page (redirects to current date)
  staticUrls.push({
    loc: `${baseUrl}/vandaag`,
    lastmod,
    changefreq: 'daily',
    priority: '0.7'
  });

  // All 366 day pages
  const months = [
    { name: 'januari', days: 31 },
    { name: 'februari', days: 29 },
    { name: 'maart', days: 31 },
    { name: 'april', days: 30 },
    { name: 'mei', days: 31 },
    { name: 'juni', days: 30 },
    { name: 'juli', days: 31 },
    { name: 'augustus', days: 31 },
    { name: 'september', days: 30 },
    { name: 'oktober', days: 31 },
    { name: 'november', days: 30 },
    { name: 'december', days: 31 },
  ];

  for (const month of months) {
    for (let day = 1; day <= month.days; day++) {
      staticUrls.push({
        loc: `${baseUrl}/overleden/${month.name}/${day}`,
        lastmod,
        changefreq: 'yearly',
        priority: '0.5'
      });
    }
  }
  console.log(`✅ Deceased calendar pages: 366 day pages + overview`);

  // 6. BLOG POSTS
  console.log('📰 Adding blog posts...');
  const blogSlugs = [
    'begraafplaats-etiquette',
    'begraafplaats-fotografie-tips-etiquette',
    'beroemde-nederlanders-laatste-rustplaats',
    'beroemde-personen-nederlandse-begraafplaatsen',
    'crematie-versus-begraven-vergelijking',
    'crematie-versus-begraven-wat-past-bij-u',
    'digitaal-herdenken',
    'funeraire-symbolen-betekenis',
    'genealogie-onderzoek-begraafplaatsen',
    'geschiedenis-nederlandse-begraafplaatsen',
    'grafmonumenten-onderhoud-complete-gids',
    'kiezen-laatste-rustplaats',
    'kinderbegraafplaatsen-gevoelig-onderwerp',
    'kosten-begraven-nederland-overzicht',
    'natuurbegraafplaatsen-nederland',
    'oorlogsgraven-nederland-geschiedenis',
    'seizoenen-begraafplaats-natuur',
    'seizoenen-begraafplaats-wat-verwachten'
  ];

  for (const slug of blogSlugs) {
    staticUrls.push({
      loc: `${baseUrl}/blog/${slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.6'
    });
  }

  // Write static sitemap
  fs.writeFileSync(
    path.join(sitemapsDir, 'sitemap-static.xml'),
    createSitemapXML(staticUrls)
  );
  sitemapFiles.push('sitemap-static.xml');
  console.log(`✅ Static sitemap: ${staticUrls.length} URLs`);

  // 7. MUNICIPALITY SITEMAPS
  console.log('🏘️  Generating municipality sitemaps...');
  const municipalities = summaryData.municipalities || [];
  const municipalityUrls: SitemapUrl[] = municipalities.map((municipality: string) => ({
    loc: `${baseUrl}/gemeente/${createSlug(municipality)}`,
    lastmod,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  // Split municipalities into chunks
  const municipalityChunks: SitemapUrl[][] = [];
  for (let i = 0; i < municipalityUrls.length; i += URLS_PER_SITEMAP) {
    municipalityChunks.push(municipalityUrls.slice(i, i + URLS_PER_SITEMAP));
  }

  municipalityChunks.forEach((chunk, index) => {
    const filename = municipalityChunks.length > 1
      ? `sitemap-municipalities-${index + 1}.xml`
      : 'sitemap-municipalities.xml';
    fs.writeFileSync(
      path.join(sitemapsDir, filename),
      createSitemapXML(chunk)
    );
    sitemapFiles.push(filename);
  });
  console.log(`✅ Municipality sitemaps: ${municipalities.length} URLs in ${municipalityChunks.length} files`);

  // 8. CEMETERY DETAIL PAGES
  console.log('🪦  Generating cemetery sitemaps...');
  const cemeteryUrls: SitemapUrl[] = cemeteriesData.map((cemetery: any) => ({
    loc: `${baseUrl}/begraafplaats/${cemetery.slug}`,
    lastmod,
    changefreq: 'monthly',
    priority: '0.5'
  }));

  // Split cemeteries into chunks
  const cemeteryChunks: SitemapUrl[][] = [];
  for (let i = 0; i < cemeteryUrls.length; i += URLS_PER_SITEMAP) {
    cemeteryChunks.push(cemeteryUrls.slice(i, i + URLS_PER_SITEMAP));
  }

  cemeteryChunks.forEach((chunk, index) => {
    const filename = cemeteryChunks.length > 1
      ? `sitemap-cemeteries-${index + 1}.xml`
      : 'sitemap-cemeteries.xml';
    fs.writeFileSync(
      path.join(sitemapsDir, filename),
      createSitemapXML(chunk)
    );
    sitemapFiles.push(filename);
  });
  console.log(`✅ Cemetery sitemaps: ${cemeteriesData.length} URLs in ${cemeteryChunks.length} files`);

  // 9. CREATE SITEMAP INDEX
  console.log('📑 Creating sitemap index...');
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const filename of sitemapFiles) {
    sitemapIndex += `  <sitemap>
    <loc>${baseUrl}/sitemaps/${filename}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>\n`;
  }

  sitemapIndex += '</sitemapindex>';

  // Write sitemap index to root
  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), sitemapIndex);

  // Print summary
  console.log('\n📊 Sitemap Generation Summary:');
  console.log('================================');
  console.log(`✅ Static pages: ${staticUrls.length} URLs`);
  console.log(`✅ Municipalities: ${municipalities.length} URLs`);
  console.log(`✅ Cemeteries: ${cemeteriesData.length} URLs`);
  console.log(`✅ Total sitemaps: ${sitemapFiles.length}`);
  console.log(`✅ Total URLs: ${staticUrls.length + municipalityUrls.length + cemeteryUrls.length}`);
  console.log('================================');
  console.log('✨ Sitemap generation complete!');
}

// Run the script
generateSitemaps().catch(error => {
  console.error('❌ Error generating sitemaps:', error);
  process.exit(1);
});