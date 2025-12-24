import fs from 'fs';
import path from 'path';

const API_KEY = 'eb74cc13a9d2b8886970e445602106c99490677afcc77fa2c9c6b230cf3092d0';

interface BrightDataResult {
  place_id: string;
  url: string;
  name: string;
  address: string;
  rating: number;
  reviews_count: number;
  phone_number?: string;
  lat: number;
  lon: number;
  top_reviews?: {
    reviewer_name: string;
    review_date: string;
    rating: number;
    content: string;
  }[];
}

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gps_coordinaten?: string;
  google_place_id?: string;
  google_rating?: number;
  google_reviews_count?: number;
  google_reviews?: {
    reviewer_name: string;
    review_date: string;
    rating: number;
    content: string;
  }[];
  [key: string]: unknown;
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
  console.log('Downloaded ' + results.length + ' results');

  // Load cemetery data
  const dataPath = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Load URL mapping
  const mappingPath = path.join(process.cwd(), 'data', 'url-slug-mapping.json');
  const urlMapping: { url: string; slug: string }[] = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  // Create URL to slug lookup
  const urlToSlug = new Map<string, string>();
  for (const m of urlMapping) {
    const normalizedUrl = m.url.split('@')[0];
    urlToSlug.set(normalizedUrl, m.slug);
  }

  let matchedCount = 0;
  let reviewsAdded = 0;

  for (const result of results) {
    if (!result.url) continue;

    // Try to match by URL first
    const normalizedUrl = result.url.split('@')[0];
    let slug = urlToSlug.get(normalizedUrl);

    // If no URL match, try GPS matching
    if (!slug && result.lat && result.lon) {
      const cemetery = cemeteries.find(c => {
        if (!c.gps_coordinaten) return false;
        const [cLat, cLon] = c.gps_coordinaten.split(',').map(s => parseFloat(s.trim()));
        const dist = findDistance(cLat, cLon, result.lat, result.lon);
        return dist < 0.005;
      });
      if (cemetery) {
        slug = cemetery.slug;
      }
    }

    if (!slug) continue;

    // Find cemetery and update
    const cemetery = cemeteries.find(c => c.slug === slug);
    if (!cemetery) continue;

    matchedCount++;

    // Update cemetery with Google data
    cemetery.google_place_id = result.place_id;
    cemetery.google_rating = result.rating;
    cemetery.google_reviews_count = result.reviews_count;

    if (result.top_reviews && result.top_reviews.length > 0) {
      cemetery.google_reviews = result.top_reviews.map(r => ({
        reviewer_name: r.reviewer_name,
        review_date: r.review_date,
        rating: r.rating,
        content: r.content,
      }));
      reviewsAdded += result.top_reviews.length;
    }

    const reviewCount = result.reviews_count || 0;
    console.log('Matched: ' + cemetery.naam_begraafplaats + ' - ' + reviewCount + ' reviews');
  }

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(cemeteries, null, 2));
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'cemeteries.json'),
    JSON.stringify(cemeteries, null, 2)
  );

  console.log('\n=== Import Summary ===');
  console.log('Results from BrightData: ' + results.length);
  console.log('Matched cemeteries: ' + matchedCount);
  console.log('Reviews added: ' + reviewsAdded);
}

// Run with snapshot ID from command line
const snapshotId = process.argv[2];
if (!snapshotId) {
  console.log('Usage: npx tsx scripts/import-gmaps-reviews.ts <snapshot_id>');
  process.exit(1);
}

importReviews(snapshotId).catch(console.error);
