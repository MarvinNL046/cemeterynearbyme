import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const API_KEY = 'eb74cc13a9d2b8886970e445602106c99490677afcc77fa2c9c6b230cf3092d0';
const sql = neon(process.env.DATABASE_URL!);

interface BrightDataReview {
  reviewer_name: string;
  reviewer_image_url?: string;
  review_date: string;
  rating: number;
  content: string;
}

interface BrightDataResult {
  place_id: string;
  url: string;
  name: string;
  address: string;
  rating: number;
  reviews_count: number;
  lat: number;
  lon: number;
  top_reviews?: BrightDataReview[];
  input?: {
    url: string;
  };
}

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gps_coordinaten?: string;
}

async function downloadSnapshot(snapshotId: string): Promise<BrightDataResult[]> {
  console.log('Downloading snapshot ' + snapshotId + '...');

  const response = await fetch(
    'https://api.brightdata.com/datasets/v3/snapshot/' + snapshotId + '?format=json',
    {
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to download: ' + response.statusText);
  }

  return response.json();
}

function findDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = Math.abs(lat1 - lat2);
  const dLon = Math.abs(lon1 - lon2);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

async function importReviews(snapshotId: string) {
  // Download BrightData results
  const results = await downloadSnapshot(snapshotId);
  console.log('Downloaded ' + results.length + ' results from BrightData');

  // Load cemetery data for matching
  const dataPath = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Load URL mapping
  const mappingPath = path.join(process.cwd(), 'data', 'url-slug-mapping.json');
  const urlMapping: { url: string; slug: string }[] = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  // Create slug lookup by normalized URL
  const urlToSlug = new Map<string, string>();
  for (const m of urlMapping) {
    // Extract search query for matching
    const match = m.url.match(/\/maps\/search\/([^@]+)/);
    if (match) {
      urlToSlug.set(decodeURIComponent(match[1]).toLowerCase(), m.slug);
    }
  }

  let matchedCount = 0;
  let reviewsImported = 0;

  for (const result of results) {
    if (!result.url && !result.input?.url) continue;

    let slug: string | undefined;

    // Try input URL matching first (most reliable - direct mapping)
    if (result.input?.url) {
      const inputUrl = result.input.url;
      const mapping = urlMapping.find(m => m.url === inputUrl);
      if (mapping) {
        slug = mapping.slug;
      }
    }

    // Fallback: Try GPS matching (only if lat/lon looks like Netherlands - ~50-54 lat, 3-7 lon)
    if (!slug && result.lat && result.lon &&
        result.lat > 50 && result.lat < 54 &&
        result.lon > 3 && result.lon < 8) {
      const cemetery = cemeteries.find(c => {
        if (!c.gps_coordinaten) return false;
        const coords = c.gps_coordinaten.split(',');
        if (coords.length !== 2) return false;
        const cLat = parseFloat(coords[0].trim());
        const cLon = parseFloat(coords[1].trim());
        if (isNaN(cLat) || isNaN(cLon)) return false;
        const dist = findDistance(cLat, cLon, result.lat, result.lon);
        return dist < 0.003; // ~300m tolerance
      });
      if (cemetery) {
        slug = cemetery.slug;
      }
    }

    // Fallback: try name matching (excluding generic "Google Maps" name)
    if (!slug && result.name && result.name !== 'Google Maps') {
      const normalizedName = result.name.toLowerCase();
      const cemetery = cemeteries.find(c => {
        const cName = c.naam_begraafplaats.toLowerCase();
        return cName.includes(normalizedName) || normalizedName.includes(cName);
      });
      if (cemetery) {
        slug = cemetery.slug;
      }
    }

    if (!slug) {
      console.log('No match for: ' + result.name + ' (input: ' + (result.input?.url || 'none') + ')');
      continue;
    }

    matchedCount++;
    console.log('Matched: ' + result.name + ' -> ' + slug);

    // Import reviews to database
    if (result.top_reviews && result.top_reviews.length > 0) {
      for (const review of result.top_reviews) {
        if (!review.content || review.content.trim() === '') continue;

        try {
          await sql`
            INSERT INTO google_reviews (
              cemetery_slug,
              google_place_id,
              reviewer_name,
              reviewer_image_url,
              rating,
              content,
              review_date,
              language
            ) VALUES (
              ${slug},
              ${result.place_id},
              ${review.reviewer_name},
              ${review.reviewer_image_url || null},
              ${review.rating},
              ${review.content},
              ${review.review_date ? new Date(review.review_date).toISOString() : null},
              'nl'
            )
            ON CONFLICT DO NOTHING
          `;
          reviewsImported++;
        } catch (err) {
          console.error('Failed to insert review:', err);
        }
      }
    }
  }

  console.log('\n=== Import Summary ===');
  console.log('Results from BrightData: ' + results.length);
  console.log('Matched cemeteries: ' + matchedCount);
  console.log('Reviews imported to DB: ' + reviewsImported);
}

// Check status or import
async function main() {
  const snapshotId = process.argv[2];

  if (!snapshotId) {
    console.log('Usage: npx tsx scripts/import-gmaps-to-db.ts <snapshot_id>');
    console.log('\nTo check status: npx tsx scripts/import-gmaps-to-db.ts status <snapshot_id>');
    process.exit(1);
  }

  if (snapshotId === 'status') {
    const id = process.argv[3];
    if (!id) {
      console.log('Please provide snapshot ID');
      process.exit(1);
    }
    const response = await fetch(
      'https://api.brightdata.com/datasets/v3/progress/' + id,
      { headers: { 'Authorization': 'Bearer ' + API_KEY } }
    );
    const status = await response.json();
    console.log('Status:', JSON.stringify(status, null, 2));
    return;
  }

  await importReviews(snapshotId);
}

main().catch(console.error);
