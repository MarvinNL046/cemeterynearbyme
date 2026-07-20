/**
 * Writes public/sitemaps/*.xml + public/sitemap.xml from the STATIC data layer
 * (data/static/, built by scripts/build-static-data.ts). No database, no
 * DATABASE_URL, no fallback to public/data/cemeteries.json — that fallback held
 * 6,038 of the 53,428 records and silently deleted 47,390 indexed URLs from the
 * sitemap robots.txt points Google at.
 */
import fs from 'fs';
import path from 'path';
import { blogPosts } from '../lib/blog-data';

const baseUrl = 'https://cemeterynearbyme.com';
const URLS_PER_SITEMAP = 1000;

const STATIC_DIR = path.join(process.cwd(), 'data', 'static');
const SHARD_DIR = path.join(STATIC_DIR, 'cemeteries');

interface StaticRecord {
  slug: string;
  city?: string;
  county?: string;
  type_slug?: string;
  status?: string;
}

interface Facets {
  counties: Array<{ county: string; state: string }>;
  cities: Array<{ city: string; state: string }>;
  types: Array<{ slug: string; name: string }>;
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
}

/** Every record, from every state shard. */
function readAllRecords(): StaticRecord[] {
  if (!fs.existsSync(SHARD_DIR)) {
    throw new Error(
      `Static data missing: ${SHARD_DIR}\nRun: npm run build-static-data -- <exportDir>`
    );
  }

  const files = fs.readdirSync(SHARD_DIR).filter((f) => f.endsWith('.json')).sort();
  const records: StaticRecord[] = [];
  for (const file of files) {
    records.push(...readJson<StaticRecord[]>(path.join(SHARD_DIR, file)));
  }
  return records;
}

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

  // Remove stale sitemap files from previous runs. The chunk count depends on
  // the dataset size, so a smaller dataset (or the old single-chunk naming,
  // e.g. sitemap-cities.xml vs sitemap-cities-1.xml) leaves behind orphan
  // files that are no longer referenced by the index but stay on disk and get
  // served. Always start from a clean directory.
  const staleFiles = fs
    .readdirSync(sitemapsDir)
    .filter((f) => /^sitemap-.*\.xml$/.test(f));
  for (const f of staleFiles) {
    fs.unlinkSync(path.join(sitemapsDir, f));
  }
  if (staleFiles.length > 0) {
    console.log(`🧹 Cleared ${staleFiles.length} existing sitemap file(s)`);
  }

  console.log('📊 Reading data/static ...');
  const records = readAllRecords();

  // SELECT slug FROM cemeteries WHERE status = 'active' ORDER BY slug
  // (build-static-data maps a NULL/'' status to undefined; the export has no
  // non-active rows, so this filter is a safety net, not a reduction.)
  const skippedInactive = records.filter((r) => r.status && r.status !== 'active').length;
  const cemeteriesData = records
    .filter((r) => r.slug && (!r.status || r.status === 'active'))
    .map((r) => ({ slug: r.slug }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  // SELECT DISTINCT county / city / type_slug — facets.json already holds these
  // per state; collapse to the distinct values the sitemap needs.
  const facetsPath = path.join(STATIC_DIR, 'facets.json');
  const facets: Facets = fs.existsSync(facetsPath)
    ? readJson<Facets>(facetsPath)
    : { counties: [], cities: [], types: [] };

  const countiesData = Array.from(new Set(facets.counties.map((e) => e.county).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b))
    .map((county) => ({ county }));

  const citiesData = Array.from(new Set(facets.cities.map((e) => e.city).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b))
    .map((city) => ({ city }));

  const typesData = Array.from(new Set(facets.types.map((t) => t.slug).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b))
    .map((type_slug) => ({ type_slug }));

  console.log(`   ${records.length} records read, ${skippedInactive} skipped as non-active`);

  console.log(`   Found ${cemeteriesData.length} cemeteries, ${countiesData.length} counties, ${citiesData.length} cities`);

  const lastmod = new Date().toISOString().split('T')[0];
  const sitemapFiles: string[] = [];

  // 1. STATIC PAGES SITEMAP
  console.log('📄 Generating static pages sitemap...');
  const staticUrls: SitemapUrl[] = [
    // Homepage
    { loc: baseUrl, lastmod, changefreq: 'daily', priority: '1.0' },

    // Main navigation pages
    { loc: `${baseUrl}/type`, lastmod, changefreq: 'weekly', priority: '0.8' },

    // Information pages
    { loc: `${baseUrl}/about`, lastmod, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/contact`, lastmod, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/blog`, lastmod, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/funeral-planning`, lastmod, changefreq: 'monthly', priority: '0.7' },

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

  // 3. TYPE PAGES - from database
  console.log('🏷️  Adding type pages...');
  for (const row of typesData) {
    if (row.type_slug) {
      staticUrls.push({
        loc: `${baseUrl}/type/${row.type_slug}`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.7'
      });
    }
  }

  // 4. Blog detail pages
  blogPosts.forEach((post) => {
    staticUrls.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.date || lastmod,
      changefreq: 'monthly',
      priority: '0.6',
    });
  });

  // Write static sitemap
  fs.writeFileSync(
    path.join(sitemapsDir, 'sitemap-static.xml'),
    createSitemapXML(staticUrls)
  );
  sitemapFiles.push('sitemap-static.xml');
  console.log(`✅ Static sitemap: ${staticUrls.length} URLs`);

  // 5. COUNTY SITEMAPS
  console.log('🏘️  Generating county sitemaps...');
  const countyUrls: SitemapUrl[] = countiesData.map((row: any) => ({
    loc: `${baseUrl}/county/${createSlug(row.county)}`,
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
    console.log(`✅ County sitemaps: ${countiesData.length} URLs in ${countyChunks.length} file(s)`);
  }

  // 6. CITY SITEMAPS
  console.log('🏙️  Generating city sitemaps...');
  const cityUrls: SitemapUrl[] = citiesData.map((row: any) => ({
    loc: `${baseUrl}/city/${createSlug(row.city)}`,
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
    console.log(`✅ City sitemaps: ${citiesData.length} URLs in ${cityChunks.length} file(s)`);
  }

  // 7. CEMETERY DETAIL PAGES
  console.log('🪦  Generating cemetery sitemaps...');
  const cemeteryUrls: SitemapUrl[] = cemeteriesData.map((row: any) => ({
    loc: `${baseUrl}/cemetery/${row.slug}`,
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
  console.log(`✅ Counties: ${countiesData.length} URLs`);
  console.log(`✅ Cities: ${citiesData.length} URLs`);
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
