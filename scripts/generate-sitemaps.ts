import fs from 'fs';
import path from 'path';

const baseUrl = 'https://www.cemeterynearbyme.com';
const URLS_PER_SITEMAP = 1000;

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
  console.log('🗺️  Generating sitemaps for cemeterynearbyme.com...');

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
    { loc: `${baseUrl}/search`, lastmod, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/type`, lastmod, changefreq: 'weekly', priority: '0.8' },

    // Information pages
    { loc: `${baseUrl}/about`, lastmod, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/contact`, lastmod, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/blog`, lastmod, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/funeral-planning`, lastmod, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/compare`, lastmod, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/today`, lastmod, changefreq: 'daily', priority: '0.7' },
    { loc: `${baseUrl}/deaths`, lastmod, changefreq: 'daily', priority: '0.7' },

    // Legal pages
    { loc: `${baseUrl}/privacy`, lastmod, changefreq: 'yearly', priority: '0.3' },
    { loc: `${baseUrl}/terms`, lastmod, changefreq: 'yearly', priority: '0.3' },
  ];

  // 2. STATE PAGES
  console.log('🏛️  Adding state pages...');
  const usStates = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
    'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
    'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
    'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
    'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
    'new-hampshire', 'new-jersey', 'new-mexico', 'new-york',
    'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon',
    'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
    'west-virginia', 'wisconsin', 'wyoming', 'district-of-columbia'
  ];

  for (const state of usStates) {
    staticUrls.push({
      loc: `${baseUrl}/state/${state}`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.7'
    });
  }

  // 3. TYPE PAGES
  console.log('🏷️  Adding type pages...');
  const types = [
    'public-cemetery',
    'private-cemetery',
    'national-cemetery',
    'veterans-cemetery',
    'memorial-park',
    'church-cemetery',
    'family-cemetery',
    'green-cemetery',
    'historic-cemetery',
    'pet-cemetery'
  ];

  for (const type of types) {
    staticUrls.push({
      loc: `${baseUrl}/type/${type}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7'
    });
  }

  // 4. DEATHS CALENDAR PAGES (English months)
  console.log('⚰️  Adding deaths calendar pages...');
  const months = [
    { name: 'january', days: 31 },
    { name: 'february', days: 29 },
    { name: 'march', days: 31 },
    { name: 'april', days: 30 },
    { name: 'may', days: 31 },
    { name: 'june', days: 30 },
    { name: 'july', days: 31 },
    { name: 'august', days: 31 },
    { name: 'september', days: 30 },
    { name: 'october', days: 31 },
    { name: 'november', days: 30 },
    { name: 'december', days: 31 },
  ];

  for (const month of months) {
    for (let day = 1; day <= month.days; day++) {
      staticUrls.push({
        loc: `${baseUrl}/deaths/${month.name}/${day}`,
        lastmod,
        changefreq: 'yearly',
        priority: '0.5'
      });
    }
  }
  console.log(`✅ Deaths calendar pages: 366 day pages`);

  // Write static sitemap
  fs.writeFileSync(
    path.join(sitemapsDir, 'sitemap-static.xml'),
    createSitemapXML(staticUrls)
  );
  sitemapFiles.push('sitemap-static.xml');
  console.log(`✅ Static sitemap: ${staticUrls.length} URLs`);

  // 5. COUNTY SITEMAPS
  console.log('🏘️  Generating county sitemaps...');
  const counties = summaryData.counties || [];
  const countyUrls: SitemapUrl[] = counties.map((county: string) => ({
    loc: `${baseUrl}/county/${createSlug(county)}`,
    lastmod,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  if (countyUrls.length > 0) {
    const countyChunks: SitemapUrl[][] = [];
    for (let i = 0; i < countyUrls.length; i += URLS_PER_SITEMAP) {
      countyChunks.push(countyUrls.slice(i, i + URLS_PER_SITEMAP));
    }

    countyChunks.forEach((chunk, index) => {
      const filename = countyChunks.length > 1
        ? `sitemap-counties-${index + 1}.xml`
        : 'sitemap-counties.xml';
      fs.writeFileSync(
        path.join(sitemapsDir, filename),
        createSitemapXML(chunk)
      );
      sitemapFiles.push(filename);
    });
    console.log(`✅ County sitemaps: ${counties.length} URLs in ${countyChunks.length} file(s)`);
  }

  // 6. CITY SITEMAPS
  console.log('🏙️  Generating city sitemaps...');
  const cities = summaryData.cities || [];
  const cityUrls: SitemapUrl[] = cities.map((city: string) => ({
    loc: `${baseUrl}/city/${createSlug(city)}`,
    lastmod,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  if (cityUrls.length > 0) {
    const cityChunks: SitemapUrl[][] = [];
    for (let i = 0; i < cityUrls.length; i += URLS_PER_SITEMAP) {
      cityChunks.push(cityUrls.slice(i, i + URLS_PER_SITEMAP));
    }

    cityChunks.forEach((chunk, index) => {
      const filename = cityChunks.length > 1
        ? `sitemap-cities-${index + 1}.xml`
        : 'sitemap-cities.xml';
      fs.writeFileSync(
        path.join(sitemapsDir, filename),
        createSitemapXML(chunk)
      );
      sitemapFiles.push(filename);
    });
    console.log(`✅ City sitemaps: ${cities.length} URLs in ${cityChunks.length} file(s)`);
  }

  // 7. CEMETERY DETAIL PAGES
  console.log('🪦  Generating cemetery sitemaps...');
  const cemeteryUrls: SitemapUrl[] = cemeteriesData.map((cemetery: any) => ({
    loc: `${baseUrl}/cemetery/${cemetery.slug}`,
    lastmod,
    changefreq: 'monthly',
    priority: '0.5'
  }));

  if (cemeteryUrls.length > 0) {
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
    console.log(`✅ Cemetery sitemaps: ${cemeteriesData.length} URLs in ${cemeteryChunks.length} file(s)`);
  }

  // 8. CREATE SITEMAP INDEX
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
  console.log(`✅ Counties: ${counties.length} URLs`);
  console.log(`✅ Cities: ${cities.length} URLs`);
  console.log(`✅ Cemeteries: ${cemeteriesData.length} URLs`);
  console.log(`✅ Total sitemaps: ${sitemapFiles.length}`);
  console.log(`✅ Total URLs: ${staticUrls.length + countyUrls.length + cityUrls.length + cemeteryUrls.length}`);
  console.log('================================');
  console.log('✨ Sitemap generation complete!');
}

// Run the script
generateSitemaps().catch(error => {
  console.error('❌ Error generating sitemaps:', error);
  process.exit(1);
});
