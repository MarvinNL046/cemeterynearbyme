/**
 * Google Maps Photo Fetcher via CID using Bright Data Web Unlocker
 *
 * Fetches photos from Google Maps using CID through Bright Data's Web Unlocker
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  slug: string;
  google_place_id?: string;
  photo?: string;
  wikimedia_image?: string;
  google_photo?: string;
  [key: string]: unknown;
}

const BRIGHTDATA_CUSTOMER_ID = process.env.BRIGHTDATA_CUSTOMER_ID;
const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const BRIGHTDATA_ZONE = process.env.BRIGHTDATA_ZONE || 'mcp_unlocker';

if (!BRIGHTDATA_CUSTOMER_ID || !BRIGHTDATA_API_KEY) {
  console.error('Missing Bright Data credentials in .env.local');
  process.exit(1);
}

// Bright Data Web Unlocker proxy
const proxyHost = 'brd.superproxy.io';
const proxyPort = 33335; // Web Unlocker port
const proxyAuth = `brd-customer-${BRIGHTDATA_CUSTOMER_ID}-zone-${BRIGHTDATA_ZONE}:${BRIGHTDATA_API_KEY}`;

// Fetch URL through Bright Data Web Unlocker
async function fetchWithUnlocker(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      host: proxyHost,
      port: proxyPort,
      path: url,
      method: 'GET',
      headers: {
        'Proxy-Authorization': 'Basic ' + Buffer.from(proxyAuth).toString('base64'),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

// Extract photo URL from Google Maps HTML
function extractPhotoUrl(html: string): string | null {
  // Look for different patterns Google uses for photos

  // Pattern 1: lh5.googleusercontent.com photos
  const lh5Match = html.match(/https:\/\/lh5\.googleusercontent\.com\/p\/[A-Za-z0-9_-]+/);
  if (lh5Match) return lh5Match[0];

  // Pattern 2: streetviewpixels with photo
  const streetviewMatch = html.match(/https:\/\/streetviewpixels[^"'\s]+/);
  if (streetviewMatch) return streetviewMatch[0];

  // Pattern 3: lh3.googleusercontent.com (place photos)
  const lh3Match = html.match(/https:\/\/lh3\.googleusercontent\.com\/places\/[^"'\s]+/);
  if (lh3Match) return lh3Match[0];

  // Pattern 4: Any googleusercontent with AF1QipN (user photos)
  const af1Match = html.match(/https:\/\/[^"'\s]*googleusercontent\.com[^"'\s]*AF1QipN[^"'\s]*/);
  if (af1Match) return af1Match[0];

  // Pattern 5: geo photos
  const geoMatch = html.match(/https:\/\/geo[0-9]\.ggpht\.com\/[^"'\s]+/);
  if (geoMatch) return geoMatch[0];

  return null;
}

// Download image directly (not through proxy for final download)
async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve);
          return;
        }
        resolve(false);
        return;
      }

      if (response.statusCode !== 200) {
        console.log(`   HTTP ${response.statusCode}`);
        resolve(false);
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filepath);
        if (stats.size < 2000) {
          fs.unlinkSync(filepath);
          resolve(false);
        } else {
          resolve(true);
        }
      });
      file.on('error', () => resolve(false));
    });

    req.on('error', () => resolve(false));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log('📷 Google Maps Photo Fetcher via CID');
  console.log('=====================================\n');

  // Load cemeteries
  const cemeteriesPath = path.join(process.cwd(), 'data/begraafplaatsen.json');
  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(cemeteriesPath, 'utf-8'));

  // Filter cemeteries without photos but with CID
  const cemeteriesWithCid = cemeteries.filter(c =>
    !c.photo &&
    !c.wikimedia_image &&
    !c.google_photo &&
    c.google_place_id
  );

  console.log(`📊 Total cemeteries: ${cemeteries.length}`);
  console.log(`📷 Without photos (with CID): ${cemeteriesWithCid.length}\n`);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'public/images/google');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Process cemeteries (limit to batch size)
  const batchSize = parseInt(process.argv[2]) || 10;
  const batch = cemeteriesWithCid.slice(0, batchSize);

  console.log(`🔄 Processing batch of ${batch.length} cemeteries...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const cemetery of batch) {
    const cid = cemetery.google_place_id;
    console.log(`📍 ${cemetery.naam_begraafplaats} (${cemetery.gemeente})`);
    console.log(`   CID: ${cid}`);

    try {
      // Fetch Google Maps page via CID
      const mapsUrl = `https://www.google.com/maps?cid=${cid}`;
      console.log(`   Fetching Maps page...`);

      const html = await fetchWithUnlocker(mapsUrl);

      // Extract photo URL
      const photoUrl = extractPhotoUrl(html);

      if (photoUrl) {
        console.log(`   Found photo: ${photoUrl.substring(0, 60)}...`);

        const filename = `${cemetery.slug}.jpg`;
        const filepath = path.join(outputDir, filename);

        const success = await downloadImage(photoUrl, filepath);

        if (success) {
          const index = cemeteries.findIndex(c => c.slug === cemetery.slug);
          if (index !== -1) {
            cemeteries[index].google_photo = `/images/google/${filename}`;
            successCount++;
            console.log(`   ✅ Saved\n`);
          }
        } else {
          failCount++;
          console.log(`   ❌ Download failed\n`);
        }
      } else {
        failCount++;
        console.log(`   ❌ No photo found in page\n`);
      }
    } catch (error: any) {
      failCount++;
      console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Save updated data
  fs.writeFileSync(cemeteriesPath, JSON.stringify(cemeteries, null, 2));

  console.log('\n=====================================');
  console.log(`✨ Done!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('=====================================\n');
}

main().catch(console.error);
