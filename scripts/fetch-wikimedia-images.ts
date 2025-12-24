/**
 * Wikimedia Commons Cemetery Image Fetcher
 *
 * Fetches Creative Commons licensed images from Wikimedia Commons
 * and matches them to our cemetery database.
 *
 * License: Images are under CC BY-SA 3.0 or similar - attribution required
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  slug: string;
  photo?: string;
  wikimedia_image?: string;
  wikimedia_attribution?: string;
  [key: string]: unknown;
}

interface WikimediaImage {
  title: string;
  url: string;
  thumbUrl: string;
  attribution: string;
  license: string;
}

// Province name mapping (Dutch to English for Wikimedia)
const provinceMap: Record<string, string> = {
  'Limburg': 'Limburg_(Netherlands)',
  'Noord-Brabant': 'North_Brabant',
  'Noord-Holland': 'North_Holland',
  'Zuid-Holland': 'South_Holland',
  'Gelderland': 'Gelderland',
  'Utrecht': 'Utrecht_(province)',
  'Overijssel': 'Overijssel',
  'Friesland': 'Friesland',
  'Groningen': 'Groningen_(province)',
  'Drenthe': 'Drenthe',
  'Zeeland': 'Zeeland',
  'Flevoland': 'Flevoland',
};

// Fetch JSON from URL
async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'BegraafplaatsInDeBuurt/1.0 (info@begraafplaatsindebuurt.nl)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download image to local file
async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, {
      headers: {
        'User-Agent': 'BegraafplaatsInDeBuurt/1.0 (info@begraafplaatsindebuurt.nl)'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (res) => {
            res.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve(true);
            });
          }).on('error', () => resolve(false));
        } else {
          resolve(false);
        }
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', () => resolve(false));
  });
}

// Get all images from a Wikimedia category
async function getCategoryImages(category: string): Promise<WikimediaImage[]> {
  const images: WikimediaImage[] = [];
  let continueParam = '';

  do {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(category)}&cmtype=file&cmlimit=100&format=json${continueParam}`;

    try {
      const data = await fetchJson(url);
      const members = data.query?.categorymembers || [];

      for (const member of members) {
        if (member.title.match(/\.(jpg|jpeg|png)$/i)) {
          // Get image info
          const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(member.title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json`;

          try {
            const infoData = await fetchJson(infoUrl);
            const pages = infoData.query?.pages || {};
            const pageId = Object.keys(pages)[0];
            const imageInfo = pages[pageId]?.imageinfo?.[0];

            if (imageInfo) {
              const metadata = imageInfo.extmetadata || {};
              images.push({
                title: member.title,
                url: imageInfo.url,
                thumbUrl: imageInfo.thumburl || imageInfo.url,
                attribution: metadata.Artist?.value?.replace(/<[^>]*>/g, '') || 'Wikimedia Commons',
                license: metadata.LicenseShortName?.value || 'CC BY-SA',
              });
            }
          } catch (e) {
            console.error(`Error fetching info for ${member.title}:`, e);
          }
        }
      }

      continueParam = data.continue ? `&cmcontinue=${data.continue.cmcontinue}` : '';
    } catch (e) {
      console.error(`Error fetching category ${category}:`, e);
      break;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));

  } while (continueParam);

  return images;
}

// Normalize string for matching
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate similarity between two strings
function similarity(s1: string, s2: string): number {
  const n1 = normalize(s1);
  const n2 = normalize(s2);

  // Exact match
  if (n1 === n2) return 1;

  // Contains match
  if (n1.includes(n2) || n2.includes(n1)) return 0.8;

  // Word overlap
  const words1 = new Set(n1.split(' '));
  const words2 = new Set(n2.split(' '));
  const intersection = [...words1].filter(w => words2.has(w) && w.length > 3);
  const union = new Set([...words1, ...words2]);

  return intersection.length / union.size;
}

// Extract location info from Wikimedia image title
function extractLocation(title: string): { name: string; location: string } {
  // Remove "File:" prefix and extension
  let name = title.replace(/^File:/, '').replace(/\.(jpg|jpeg|png)$/i, '');

  // Common patterns in Wikimedia titles
  // "Begraafplaats Name Location.jpg"
  // "Name cemetery in Location.jpg"
  // "Location - Cemetery name.jpg"

  const locationMatch = name.match(/(?:in|te|,)\s+([A-Za-z\s-]+?)(?:\s*[-,]|$)/i);
  const location = locationMatch ? locationMatch[1].trim() : '';

  return { name, location };
}

async function main() {
  console.log('🖼️  Wikimedia Commons Cemetery Image Fetcher');
  console.log('============================================\n');

  // Load cemeteries
  const cemeteriesPath = path.join(process.cwd(), 'public/data/cemeteries.json');
  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(cemeteriesPath, 'utf-8'));

  console.log(`📊 Loaded ${cemeteries.length} cemeteries\n`);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'public/images/wikimedia');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Categories to search - expanded list
  const categories = [
    'Category:Cemeteries_in_the_Netherlands',
    'Category:Jewish_cemeteries_in_the_Netherlands',
    'Category:Islamic_cemeteries_in_the_Netherlands',
    'Category:Roman_Catholic_cemeteries_in_the_Netherlands',
    'Category:War_cemeteries_in_the_Netherlands',
    'Category:Protestant_cemeteries_in_the_Netherlands',
    'Category:Municipal_cemeteries_in_the_Netherlands',
    'Category:Churchyards_in_the_Netherlands',
  ];

  // Add province-specific categories with subcategories
  for (const [dutch, english] of Object.entries(provinceMap)) {
    categories.push(`Category:Cemeteries_in_${english}`);
    categories.push(`Category:Jewish_cemeteries_in_${english}`);
    categories.push(`Category:Roman_Catholic_cemeteries_in_${english}`);
  }

  // Fetch all images
  console.log('📥 Fetching images from Wikimedia Commons...\n');
  const allImages: WikimediaImage[] = [];

  for (const category of categories) {
    console.log(`  📁 ${category}`);
    const images = await getCategoryImages(category);
    console.log(`     Found ${images.length} images`);
    allImages.push(...images);

    // Rate limiting between categories
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Remove duplicates
  const uniqueImages = allImages.filter((img, index, self) =>
    index === self.findIndex(i => i.title === img.title)
  );

  console.log(`\n📷 Total unique images: ${uniqueImages.length}\n`);

  // Match images to cemeteries
  console.log('🔍 Matching images to cemeteries...\n');

  let matchCount = 0;
  const matches: Array<{ cemetery: Cemetery; image: WikimediaImage; score: number }> = [];

  for (const image of uniqueImages) {
    const { name, location } = extractLocation(image.title);

    let bestMatch: { cemetery: Cemetery; score: number } | null = null;

    for (const cemetery of cemeteries) {
      // Skip if already has a photo
      if (cemetery.photo || cemetery.wikimedia_image) continue;

      // Calculate match score
      let score = similarity(name, cemetery.naam_begraafplaats);

      // Bonus for location match
      if (location) {
        if (normalize(location).includes(normalize(cemetery.gemeente)) ||
            normalize(cemetery.gemeente).includes(normalize(location)) ||
            normalize(location).includes(normalize(cemetery.plaats || '')) ||
            normalize(cemetery.plaats || '').includes(normalize(location))) {
          score += 0.3;
        }
      }

      // Update best match - lowered threshold for more matches
      if (score > 0.4 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { cemetery, score };
      }
    }

    if (bestMatch && bestMatch.score >= 0.5) {
      matches.push({ cemetery: bestMatch.cemetery, image, score: bestMatch.score });
    }
  }

  // Sort by score and take best matches
  matches.sort((a, b) => b.score - a.score);

  // Remove duplicate cemetery matches (keep highest score)
  const uniqueMatches = matches.filter((match, index, self) =>
    index === self.findIndex(m => m.cemetery.slug === match.cemetery.slug)
  );

  console.log(`✅ Found ${uniqueMatches.length} matches\n`);

  // Download images and update cemeteries
  console.log('💾 Downloading images...\n');

  for (const match of uniqueMatches.slice(0, 500)) { // Limit to 500 for now
    const ext = match.image.title.match(/\.(jpg|jpeg|png)$/i)?.[1] || 'jpg';
    const filename = `${match.cemetery.slug}.${ext}`;
    const filepath = path.join(outputDir, filename);

    console.log(`  📥 ${match.cemetery.naam_begraafplaats}`);
    console.log(`     Score: ${(match.score * 100).toFixed(0)}%`);
    console.log(`     Source: ${match.image.title.substring(0, 50)}...`);

    const success = await downloadImage(match.image.thumbUrl, filepath);

    if (success) {
      // Update cemetery
      const cemeteryIndex = cemeteries.findIndex(c => c.slug === match.cemetery.slug);
      if (cemeteryIndex !== -1) {
        cemeteries[cemeteryIndex].wikimedia_image = `/images/wikimedia/${filename}`;
        cemeteries[cemeteryIndex].wikimedia_attribution = `${match.image.attribution} (${match.image.license})`;
        matchCount++;
        console.log(`     ✅ Saved\n`);
      }
    } else {
      console.log(`     ❌ Failed to download\n`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Save updated cemeteries
  fs.writeFileSync(cemeteriesPath, JSON.stringify(cemeteries, null, 2));

  // Create attributions file
  const attributions = uniqueMatches
    .filter(m => cemeteries.find(c => c.slug === m.cemetery.slug)?.wikimedia_image)
    .map(m => ({
      cemetery: m.cemetery.naam_begraafplaats,
      slug: m.cemetery.slug,
      image: m.image.title,
      attribution: m.image.attribution,
      license: m.image.license,
      url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(m.image.title)}`,
    }));

  fs.writeFileSync(
    path.join(process.cwd(), 'public/images/wikimedia/attributions.json'),
    JSON.stringify(attributions, null, 2)
  );

  console.log('\n============================================');
  console.log(`✨ Done! Downloaded ${matchCount} images`);
  console.log(`📄 Attributions saved to public/images/wikimedia/attributions.json`);
  console.log('============================================\n');
}

main().catch(console.error);
