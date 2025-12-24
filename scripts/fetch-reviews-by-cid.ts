#!/usr/bin/env npx tsx
/**
 * Fetch Google Reviews via BrightData "Discover by CID" (super snel!)
 *
 * Prerequisites: Run fetch-place-ids-serp.ts first to get CIDs
 *
 * Gebruik:
 *   npx tsx scripts/fetch-reviews-by-cid.ts --dry-run                    # Test 1 locatie
 *   npx tsx scripts/fetch-reviews-by-cid.ts --provincie "Utrecht"        # Alle locaties in Utrecht
 *   npx tsx scripts/fetch-reviews-by-cid.ts --batch 100                  # Eerste 100 locaties
 *   npx tsx scripts/fetch-reviews-by-cid.ts                              # Alle locaties
 */

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const API_KEY = 'eb74cc13a9d2b8886970e445602106c99490677afcc77fa2c9c6b230cf3092d0';
const DATASET_ID = 'gd_m8ebnr0q2qlklc02fz'; // Google Maps Full Info (includes reviews)
const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const REVIEWS_DIR = path.join(process.cwd(), 'data', 'reviews');

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  google_place_id?: string;
  google_cid?: string;
  reviews_fetched_at?: string;
  [key: string]: unknown;
}

interface Review {
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  reviewer_image?: string;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    provincie?: string;
    batch: number;
    dryRun: boolean;
    skipExisting: boolean;
  } = {
    batch: 0,
    dryRun: false,
    skipExisting: true,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--provincie' && args[i + 1]) {
      options.provincie = args[i + 1];
      i++;
    } else if (args[i] === '--batch' && args[i + 1]) {
      options.batch = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--include-existing') {
      options.skipExisting = false;
    }
  }

  return options;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadCemeteries(): Cemetery[] {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveCemeteries(cemeteries: Cemetery[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cemeteries, null, 2));
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'cemeteries.json'),
    JSON.stringify(cemeteries, null, 2)
  );
}

function saveReviews(slug: string, reviews: Review[]): void {
  if (!fs.existsSync(REVIEWS_DIR)) {
    fs.mkdirSync(REVIEWS_DIR, { recursive: true });
  }
  fs.writeFileSync(
    path.join(REVIEWS_DIR, `${slug}.json`),
    JSON.stringify(reviews, null, 2)
  );
}

async function fetchReviewsByCids(cids: string[]): Promise<any> {
  // Use BrightData's "Discover by CID" - super fast!
  // Send multiple CIDs in one batch request
  const apiUrl = `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}&include_errors=true&type=discover_new&discover_by=cid`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(cids.map(cid => ({ CID: cid }))),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BrightData API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async function checkJobStatus(snapshotId: string): Promise<any> {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/progress/${snapshotId}`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Status check failed: ${response.status}`);
  }

  return response.json();
}

async function getJobResults(snapshotId: string): Promise<any[]> {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Results fetch failed: ${response.status}`);
  }

  return response.json();
}

async function waitForJob(snapshotId: string, maxWait = 60000): Promise<any[]> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    const status = await checkJobStatus(snapshotId);

    if (status.status === 'ready') {
      return getJobResults(snapshotId);
    }

    if (status.status === 'failed') {
      throw new Error(`Job failed: ${JSON.stringify(status)}`);
    }

    // Wait 2 seconds before checking again
    await sleep(2000);
  }

  throw new Error('Job timed out');
}

function parseReviews(data: any[]): Review[] {
  const reviews: Review[] = [];

  for (const item of data) {
    // Check top_reviews (BrightData Google Maps Full Info format)
    if (item.top_reviews && Array.isArray(item.top_reviews)) {
      for (const review of item.top_reviews) {
        reviews.push({
          reviewer_name: review.reviewer_name || 'Anonymous',
          rating: review.rating || 0,
          review_text: review.content || '',
          review_date: review.review_date || '',
          reviewer_image: review.reviewer_image_url,
        });
      }
    }

    // Also check reviews array (alternative format)
    if (item.reviews && Array.isArray(item.reviews)) {
      for (const review of item.reviews) {
        reviews.push({
          reviewer_name: review.author || review.reviewer_name || 'Anonymous',
          rating: review.rating || 0,
          review_text: review.text || review.content || review.review_text || '',
          review_date: review.date || review.review_date || '',
          reviewer_image: review.author_image || review.reviewer_image_url,
        });
      }
    }
  }

  return reviews;
}

async function main() {
  const options = parseArgs();

  console.log('⭐ BrightData Reviews Fetcher (by CID)\n');

  let cemeteries = loadCemeteries();

  // Only process cemeteries that have a CID
  cemeteries = cemeteries.filter(c => c.google_place_id && /^\d+$/.test(c.google_place_id));
  console.log(`📍 Found ${cemeteries.length} cemeteries with CID`);

  // Filter by provincie
  if (options.provincie) {
    cemeteries = cemeteries.filter(c =>
      c.provincie.toLowerCase() === options.provincie!.toLowerCase()
    );
    console.log(`📍 Filtered to ${cemeteries.length} in ${options.provincie}`);
  }

  // Skip existing
  if (options.skipExisting) {
    const before = cemeteries.length;
    cemeteries = cemeteries.filter(c => !c.reviews_fetched_at);
    const skipped = before - cemeteries.length;
    if (skipped > 0) {
      console.log(`⏭️  Skipping ${skipped} cemeteries with existing reviews`);
    }
  }

  // Apply batch limit
  if (options.batch > 0 && cemeteries.length > options.batch) {
    cemeteries = cemeteries.slice(0, options.batch);
    console.log(`📦 Limited to batch of ${options.batch}`);
  }

  console.log(`🎯 ${cemeteries.length} cemeteries to process\n`);

  if (cemeteries.length === 0) {
    console.log('✅ Nothing to do!');
    return;
  }

  // Dry run - test with first 3 cemeteries as a batch
  if (options.dryRun) {
    const testBatch = cemeteries.slice(0, Math.min(3, cemeteries.length));
    console.log('🧪 DRY RUN - Testing batch with:');
    testBatch.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.naam_begraafplaats} (CID: ${c.google_place_id})`);
    });

    const cids = testBatch.map(c => c.google_place_id!);
    console.log(`\n   Fetching ${cids.length} locations in ONE request...`);

    try {
      const job = await fetchReviewsByCids(cids);
      console.log('\n   Job created:', job.snapshot_id);
      console.log('   Waiting for results...');

      const results = await waitForJob(job.snapshot_id, 120000);
      console.log(`   Got ${results.length} result(s)`);

      let totalReviews = 0;
      for (const result of results) {
        const name = result.name || 'Unknown';
        const reviewCount = result.top_reviews?.length || 0;
        totalReviews += reviewCount;
        console.log(`\n   📍 ${name}: ${reviewCount} reviews`);
        if (reviewCount > 0 && result.top_reviews[0]) {
          const r = result.top_reviews[0];
          console.log(`      Sample: ${r.reviewer_name} - ${'⭐'.repeat(r.rating || 0)}`);
        }
      }

      console.log(`\n   📝 Total reviews found: ${totalReviews}`);

      // Save sample for debugging
      fs.writeFileSync('data/reviews-sample.json', JSON.stringify(results, null, 2));
      console.log('\n   💾 Saved sample to data/reviews-sample.json');
    } catch (error) {
      console.error('   Error:', error);
    }
    return;
  }

  // Process all cemeteries in batches
  const BATCH_SIZE = 50; // Send 50 CIDs per request
  const allCemeteries = loadCemeteries();
  let found = 0;
  let notFound = 0;
  let errors = 0;

  console.log(`🚀 Processing ${cemeteries.length} cemeteries in batches of ${BATCH_SIZE}...\n`);

  for (let batchStart = 0; batchStart < cemeteries.length; batchStart += BATCH_SIZE) {
    const batch = cemeteries.slice(batchStart, batchStart + BATCH_SIZE);
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(cemeteries.length / BATCH_SIZE);

    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} locations)`);

    const cids = batch.map(c => c.google_place_id!);
    const cidToSlug = new Map(batch.map(c => [c.google_place_id, c.slug]));

    try {
      const job = await fetchReviewsByCids(cids);
      console.log(`   Snapshot: ${job.snapshot_id}`);
      console.log('   Waiting for results...');

      const results = await waitForJob(job.snapshot_id, 300000); // 5 min timeout for batch

      for (const result of results) {
        const cid = result.cid || result.cid_location;
        const slug = cidToSlug.get(cid);

        if (!slug) {
          // Try to find by name match
          const cemetery = batch.find(c =>
            result.name?.toLowerCase().includes(c.naam_begraafplaats.toLowerCase().split(' ')[0])
          );
          if (!cemetery) continue;
        }

        const reviews = parseReviews([result]);

        if (reviews.length > 0) {
          const targetSlug = slug || batch.find(c => c.google_place_id === cid)?.slug;
          if (targetSlug) {
            saveReviews(targetSlug, reviews);

            const idx = allCemeteries.findIndex(c => c.slug === targetSlug);
            if (idx >= 0) {
              allCemeteries[idx].reviews_fetched_at = new Date().toISOString();
            }
            found++;
            console.log(`   ✅ ${result.name}: ${reviews.length} reviews`);
          }
        } else {
          notFound++;
        }
      }
    } catch (error) {
      errors += batch.length;
      console.log(`   ⚠️ Batch failed:`, error instanceof Error ? error.message : error);
    }

    // Save progress after each batch
    saveCemeteries(allCemeteries);
    console.log(`   💾 Progress saved`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ With reviews: ${found}`);
  console.log(`📭 No reviews: ${notFound}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
