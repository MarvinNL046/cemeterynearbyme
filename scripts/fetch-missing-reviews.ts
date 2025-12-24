#!/usr/bin/env npx tsx
/**
 * Fetch missing reviews - voor begraafplaatsen met CID maar zonder reviews
 *
 * Features:
 * - Retry logic (3 attempts per batch)
 * - Rate limiting (configurable delay)
 * - Progress saving after each batch
 * - Resumes from where it left off
 * - Detailed logging
 *
 * Gebruik:
 *   npx tsx scripts/fetch-missing-reviews.ts --dry-run       # Toon wat er gedaan zou worden
 *   npx tsx scripts/fetch-missing-reviews.ts --batch 10      # Verwerk 10 locaties per API call
 *   npx tsx scripts/fetch-missing-reviews.ts                 # Start/hervat volledige run
 */

import fs from 'fs';
import path from 'path';

const API_KEY = 'eb74cc13a9d2b8886970e445602106c99490677afcc77fa2c9c6b230cf3092d0';
const DATASET_ID = 'gd_m8ebnr0q2qlklc02fz';
const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const REVIEWS_DIR = path.join(process.cwd(), 'data', 'reviews');
const PROGRESS_FILE = path.join(process.cwd(), 'data', 'missing-reviews-progress.json');

// Configuration
const CONFIG = {
  batchSize: 10,           // CIDs per API request (smaller = more reliable)
  delayBetweenBatches: 10000,  // 10 seconds between batches
  delayBetweenRetries: 30000,  // 30 seconds before retry
  maxRetries: 3,
  jobTimeout: 180000,      // 3 minutes max wait per job
  jobPollInterval: 3000,   // Check job status every 3 seconds
};

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  google_place_id?: string;
  [key: string]: unknown;
}

interface Review {
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  reviewer_image?: string;
}

interface Progress {
  processedSlugs: string[];
  lastRun: string;
  stats: {
    found: number;
    notFound: number;
    errors: number;
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    batchSize: CONFIG.batchSize,
    reset: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--batch' && args[i + 1]) {
      options.batchSize = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--reset') {
      options.reset = true;
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

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return {
    processedSlugs: [],
    lastRun: new Date().toISOString(),
    stats: { found: 0, notFound: 0, errors: 0 }
  };
}

function saveProgress(progress: Progress): void {
  progress.lastRun = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function hasReviewsFile(slug: string): boolean {
  return fs.existsSync(path.join(REVIEWS_DIR, `${slug}.json`));
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

async function fetchReviewsBatch(cids: string[]): Promise<{ snapshot_id: string }> {
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
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async function checkJobStatus(snapshotId: string): Promise<{ status: string }> {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/progress/${snapshotId}`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` } }
  );

  if (!response.ok) {
    throw new Error(`Status check failed: ${response.status}`);
  }

  return response.json();
}

async function getJobResults(snapshotId: string): Promise<any[]> {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` } }
  );

  if (!response.ok) {
    throw new Error(`Results fetch failed: ${response.status}`);
  }

  return response.json();
}

async function waitForJob(snapshotId: string): Promise<any[]> {
  const startTime = Date.now();

  while (Date.now() - startTime < CONFIG.jobTimeout) {
    const status = await checkJobStatus(snapshotId);

    if (status.status === 'ready') {
      return getJobResults(snapshotId);
    }

    if (status.status === 'failed') {
      throw new Error('Job failed');
    }

    process.stdout.write('.');
    await sleep(CONFIG.jobPollInterval);
  }

  throw new Error('Job timed out');
}

function parseReviews(result: any): Review[] {
  const reviews: Review[] = [];

  if (result.top_reviews && Array.isArray(result.top_reviews)) {
    for (const review of result.top_reviews) {
      reviews.push({
        reviewer_name: review.reviewer_name || 'Anonymous',
        rating: review.rating || 0,
        review_text: review.content || '',
        review_date: review.review_date || '',
        reviewer_image: review.reviewer_image_url,
      });
    }
  }

  return reviews;
}

async function waitForJobWithRetry(snapshotId: string, attempt = 1): Promise<any[]> {
  try {
    return await waitForJob(snapshotId);
  } catch (error) {
    if (attempt < CONFIG.maxRetries) {
      console.log(` ⚠️ ${error instanceof Error ? error.message : error}`);
      console.log(`   🔄 Retry ${attempt}/${CONFIG.maxRetries} - waiting ${CONFIG.delayBetweenRetries / 1000}s...`);
      await sleep(CONFIG.delayBetweenRetries);
      return waitForJobWithRetry(snapshotId, attempt + 1);
    }
    throw error;
  }
}

async function processBatch(
  batch: Cemetery[],
  progress: Progress
): Promise<{ found: number; notFound: number; errors: number }> {
  const stats = { found: 0, notFound: 0, errors: 0 };
  const cids = batch.map(c => c.google_place_id!);
  const cidToSlug = new Map(batch.map(c => [c.google_place_id, c.slug]));
  const cidToName = new Map(batch.map(c => [c.google_place_id, c.naam_begraafplaats]));

  try {
    // Create job ONCE
    const job = await fetchReviewsBatch(cids);
    process.stdout.write(` [${job.snapshot_id}]`);

    // Retry waiting for the SAME job
    const results = await waitForJobWithRetry(job.snapshot_id);
    console.log(` ✓ ${results.length} results`);

    for (const result of results) {
      // Match result to cemetery by CID
      const cid = result.cid || result.cid_location;
      let slug = cidToSlug.get(cid);

      // Fallback: try to match by name
      if (!slug) {
        for (const [c, s] of cidToName.entries()) {
          if (result.name?.toLowerCase().includes(s.toLowerCase().split(' ')[0])) {
            slug = cidToSlug.get(c);
            break;
          }
        }
      }

      if (!slug) continue;

      const reviews = parseReviews(result);

      if (reviews.length > 0) {
        saveReviews(slug, reviews);
        stats.found++;
        console.log(`   ✅ ${result.name}: ${reviews.length} reviews`);
      } else {
        stats.notFound++;
      }

      // Mark as processed
      if (!progress.processedSlugs.includes(slug)) {
        progress.processedSlugs.push(slug);
      }
    }

    // Mark all batch items as processed (even if no reviews)
    for (const cemetery of batch) {
      if (!progress.processedSlugs.includes(cemetery.slug)) {
        progress.processedSlugs.push(cemetery.slug);
      }
    }

    return stats;
  } catch (error) {
    console.log(` ❌ Batch failed: ${error instanceof Error ? error.message : error}`);
    stats.errors = batch.length;
    return stats;
  }
}

async function main() {
  const options = parseArgs();

  console.log('🔍 Missing Reviews Fetcher');
  console.log('==========================\n');

  // Load data
  const cemeteries = loadCemeteries();
  let progress = options.reset ? {
    processedSlugs: [],
    lastRun: new Date().toISOString(),
    stats: { found: 0, notFound: 0, errors: 0 }
  } : loadProgress();

  // Find cemeteries with CID but no reviews file and not yet processed
  const missing = cemeteries.filter(c =>
    c.google_place_id &&
    /^\d+$/.test(c.google_place_id) &&
    !hasReviewsFile(c.slug) &&
    !progress.processedSlugs.includes(c.slug)
  );

  console.log(`📊 Status:`);
  console.log(`   Totaal met CID: ${cemeteries.filter(c => c.google_place_id && /^\d+$/.test(c.google_place_id)).length}`);
  console.log(`   Al verwerkt: ${progress.processedSlugs.length}`);
  console.log(`   Met reviews bestand: ${cemeteries.filter(c => hasReviewsFile(c.slug)).length}`);
  console.log(`   Nog te verwerken: ${missing.length}`);
  console.log('');

  if (missing.length === 0) {
    console.log('✅ Alles is al verwerkt!');
    return;
  }

  // Dry run
  if (options.dryRun) {
    console.log('🧪 DRY RUN - Eerste 10 ontbrekende:');
    missing.slice(0, 10).forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.naam_begraafplaats} (${c.gemeente})`);
    });
    console.log(`\n   ... en nog ${Math.max(0, missing.length - 10)} meer`);
    return;
  }

  // Process in batches
  const totalBatches = Math.ceil(missing.length / options.batchSize);
  console.log(`🚀 Start verwerking: ${missing.length} locaties in ${totalBatches} batches van ${options.batchSize}`);
  console.log('   (Ctrl+C om te stoppen - voortgang wordt opgeslagen)\n');

  let batchNum = 0;

  for (let i = 0; i < missing.length; i += options.batchSize) {
    batchNum++;
    const batch = missing.slice(i, i + options.batchSize);

    process.stdout.write(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} locaties)`);

    const stats = await processBatch(batch, progress);

    // Update progress stats
    progress.stats.found += stats.found;
    progress.stats.notFound += stats.notFound;
    progress.stats.errors += stats.errors;

    // Save progress after each batch
    saveProgress(progress);

    // Rate limiting between batches
    if (i + options.batchSize < missing.length) {
      console.log(`   ⏳ Wacht ${CONFIG.delayBetweenBatches / 1000}s...`);
      await sleep(CONFIG.delayBetweenBatches);
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTATEN');
  console.log('='.repeat(50));
  console.log(`✅ Met reviews gevonden: ${progress.stats.found}`);
  console.log(`📭 Geen reviews: ${progress.stats.notFound}`);
  console.log(`⚠️  Errors: ${progress.stats.errors}`);
  console.log(`📁 Totaal reviews bestanden: ${fs.readdirSync(REVIEWS_DIR).filter(f => f.endsWith('.json')).length}`);
  console.log('='.repeat(50));
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Gestopt door gebruiker. Voortgang is opgeslagen.');
  console.log('   Herstart het script om door te gaan.');
  process.exit(0);
});

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
