import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface Sitemap {
  url?: SitemapEntry | SitemapEntry[];
}

interface SitemapIndex {
  sitemap?: { loc: string; lastmod?: string } | Array<{ loc: string; lastmod?: string }>;
}

async function checkSitemap() {
  console.log('🔍 Checking sitemap structure for begraafplaatsindebuurt.nl...\n');

  const parser = new XMLParser();

  // Check main sitemap
  const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ No sitemap.xml found in public directory');
    console.error('Please run: npm run generate-sitemaps');
    return;
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const parsed = parser.parse(sitemapContent);

  // Check if it's a sitemap index
  if (parsed.sitemapindex) {
    console.log('✅ Found sitemap index');
    const sitemapIndex = parsed.sitemapindex as SitemapIndex;
    const sitemaps = Array.isArray(sitemapIndex.sitemap)
      ? sitemapIndex.sitemap
      : [sitemapIndex.sitemap];

    console.log(`📁 Found ${sitemaps.length} sub-sitemaps:\n`);

    let totalUrls = 0;
    const urlStats: { [key: string]: number } = {};

    // Check each sub-sitemap
    for (const sitemap of sitemaps) {
      if (!sitemap) continue;
      
      const filename = sitemap.loc.split('/').pop() || '';
      const subSitemapPath = path.join(process.cwd(), 'public/sitemaps', filename);

      if (fs.existsSync(subSitemapPath)) {
        const subContent = fs.readFileSync(subSitemapPath, 'utf-8');
        const subParsed = parser.parse(subContent);
        
        if (subParsed.urlset && subParsed.urlset.url) {
          const urls = Array.isArray(subParsed.urlset.url)
            ? subParsed.urlset.url.length
            : 1;
          totalUrls += urls;
          urlStats[filename] = urls;
          console.log(`  ✅ ${filename}: ${urls} URLs`);

          // Show sample URLs for each sitemap
          const urlList = Array.isArray(subParsed.urlset.url)
            ? subParsed.urlset.url
            : [subParsed.urlset.url];
          
          if (urlList.length > 0) {
            console.log(`     Sample: ${urlList[0].loc}`);
            if (urlList.length > 1) {
              console.log(`     Sample: ${urlList[1].loc}`);
            }
          }
          console.log('');
        } else {
          console.log(`  ⚠️  ${filename}: Empty or invalid sitemap`);
        }
      } else {
        console.log(`  ❌ ${filename}: NOT FOUND at ${subSitemapPath}`);
      }
    }

    // Summary statistics
    console.log('📊 Summary Statistics:');
    console.log('====================');
    console.log(`Total sitemaps: ${sitemaps.length}`);
    console.log(`Total URLs: ${totalUrls}\n`);

    // Breakdown by type
    console.log('📈 URL Distribution:');
    console.log('==================');
    for (const [filename, count] of Object.entries(urlStats).sort((a, b) => b[1] - a[1])) {
      const percentage = ((count / totalUrls) * 100).toFixed(1);
      console.log(`${filename.padEnd(35)} ${count.toString().padStart(6)} (${percentage}%)`);
    }

  } else if (parsed.urlset) {
    // Single sitemap (not index)
    const urlset = parsed.urlset as Sitemap;
    const urls = Array.isArray(urlset.url)
      ? urlset.url.length
      : 1;
    console.log(`✅ Found single sitemap with ${urls} URLs`);
    
    // Show some sample URLs
    const urlList = Array.isArray(urlset.url) ? urlset.url : [urlset.url];
    console.log('\n📝 Sample URLs:');
    for (let i = 0; i < Math.min(5, urlList.length); i++) {
      console.log(`  - ${urlList[i]?.loc || 'Unknown URL'}`);
    }
  } else {
    console.error('❌ Invalid sitemap structure');
  }

  // Check for missing important URLs
  console.log('\n🔎 Checking for important URLs:');
  const importantUrls = [
    'https://www.begraafplaatsindebuurt.nl/',
    'https://www.begraafplaatsindebuurt.nl/contact',
    'https://www.begraafplaatsindebuurt.nl/over-ons',
    'https://www.begraafplaatsindebuurt.nl/provincie/noord-holland',
    'https://www.begraafplaatsindebuurt.nl/gemeente/amsterdam',
    'https://www.begraafplaatsindebuurt.nl/type/algemeen'
  ];

  // Read all sub-sitemaps to check for URLs
  const sitemapsDir = path.join(process.cwd(), 'public/sitemaps');
  if (fs.existsSync(sitemapsDir)) {
    const allUrls = new Set<string>();
    
    const sitemapFiles = fs.readdirSync(sitemapsDir).filter(f => f.endsWith('.xml'));
    for (const file of sitemapFiles) {
      const content = fs.readFileSync(path.join(sitemapsDir, file), 'utf-8');
      const parsed = parser.parse(content);
      
      if (parsed.urlset && parsed.urlset.url) {
        const urls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
        urls.forEach((url: SitemapEntry) => allUrls.add(url.loc));
      }
    }

    for (const url of importantUrls) {
      if (allUrls.has(url)) {
        console.log(`  ✅ ${url}`);
      } else {
        console.log(`  ❌ ${url} - MISSING`);
      }
    }
  }
}

// Run the check
checkSitemap().catch(error => {
  console.error('❌ Error checking sitemap:', error);
  process.exit(1);
});