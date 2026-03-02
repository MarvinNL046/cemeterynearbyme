// Load environment variables first
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import { blogPosts } from '../lib/blog-data';

const baseUrl = 'https://cemeterynearbyme.com';
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

  const hasDatabase = Boolean(process.env.DATABASE_URL);
  const sql = hasDatabase ? neon(process.env.DATABASE_URL as string) : null;

  // Create sitemaps directory
  const sitemapsDir = path.join(process.cwd(), 'public/sitemaps');
  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  let cemeteriesData: Array<{ slug: string }> = [];
  let countiesData: Array<{ county: string }> = [];
  let citiesData: Array<{ city: string }> = [];
  let typesData: Array<{ type_slug: string }> = [];

  if (sql) {
    console.log('📊 Fetching data from database...');
    cemeteriesData = await sql`SELECT slug FROM cemeteries WHERE status = 'active' ORDER BY slug` as Array<{ slug: string }>;
    countiesData = await sql`SELECT DISTINCT county FROM cemeteries WHERE county IS NOT NULL AND county != '' ORDER BY county` as Array<{ county: string }>;
    citiesData = await sql`SELECT DISTINCT city FROM cemeteries WHERE city IS NOT NULL AND city != '' ORDER BY city` as Array<{ city: string }>;
    typesData = await sql`SELECT DISTINCT type_slug FROM cemeteries WHERE type_slug IS NOT NULL AND type_slug != '' ORDER BY type_slug` as Array<{ type_slug: string }>;
  } else {
    console.log('⚠️  DATABASE_URL not set. Falling back to public/data/cemeteries.json');
    const cemeteriesPath = path.join(process.cwd(), 'public/data/cemeteries.json');
    const raw = JSON.parse(fs.readFileSync(cemeteriesPath, 'utf-8')) as Array<{
      slug?: string;
      county?: string;
      city?: string;
      type_slug?: string;
      typeSlug?: string;
    }>;

    cemeteriesData = raw
      .filter((row) => row.slug)
      .map((row) => ({ slug: row.slug as string }));

    countiesData = Array.from(new Set(raw.map((row) => row.county).filter(Boolean)))
      .map((county) => ({ county: county as string }));

    citiesData = Array.from(new Set(raw.map((row) => row.city).filter(Boolean)))
      .map((city) => ({ city: city as string }));

    typesData = Array.from(
      new Set(raw.map((row) => row.type_slug || row.typeSlug).filter(Boolean))
    ).map((typeSlug) => ({ type_slug: typeSlug as string }));
  }

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
