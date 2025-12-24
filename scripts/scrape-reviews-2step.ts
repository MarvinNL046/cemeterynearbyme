#!/usr/bin/env npx tsx
/**
 * 2-STAPS Google Reviews Scraper via BrightData
 *
 * Stap 1: Google Maps Full Info (search URL → place_id + top_reviews)
 * Stap 2: Google Maps Reviews (place_id → alle reviews)
 *
 * Gebruik:
 *   npx tsx scripts/scrape-reviews-2step.ts --dry-run                     # Toon wat er gebeurt
 *   npx tsx scripts/scrape-reviews-2step.ts --provincie "Noord-Brabant"   # Start stap 1
 *   npx tsx scripts/scrape-reviews-2step.ts --step2                       # Start stap 2 (na stap 1)
 *   npx tsx scripts/scrape-reviews-2step.ts --import-step1 <id>           # Importeer stap 1 resultaten
 *   npx tsx scripts/scrape-reviews-2step.ts --import-step2 <id>           # Importeer stap 2 resultaten
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const API_KEY = 'eb74cc13a9d2b8886970e445602106c99490677afcc77fa2c9c6b230cf3092d0';
const sql = neon(process.env.DATABASE_URL!);

// Dataset IDs - UPDATE DEZE NA BEVESTIGING
const DATASET_GOOGLE_MAPS_INFO = 'gd_l1vijqt9jfj7olije';  // Google Maps full information - Collect by URL
const DATASET_GOOGLE_REVIEWS = 'gd_luzfs1dn2oa0teb81';    // Google Maps Reviews - Collect by URL

const PROGRESS_FILE = path.join(process.cwd(), 'data', 'scrape-2step-progress.json');

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gps_coordinaten?: string;
  google_place_id?: string;
}

interface Progress {
  step: 1 | 2;
  snapshotId: string;
  status: 'running' | 'ready' | 'completed';
  startedAt: string;
  provincie?: string;
  urlMapping: { url: string; slug: string }[];
  placeIds?: { place_id: string; slug: string; url: string }[];
}

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    provincie?: string;
    dryRun: boolean;
    step2: boolean;
    importStep1?: string;
    importStep2?: string;
    watch?: string;
    status?: string;
  } = {
    dryRun: false,
    step2: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--provincie' && args[i + 1]) {
      options.provincie = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--step2') {
      options.step2 = true;
    } else if (args[i] === '--import-step1' && args[i + 1]) {
      options.importStep1 = args[i + 1];
      i++;
    } else if (args[i] === '--import-step2' && args[i + 1]) {
      options.importStep2 = args[i + 1];
      i++;
    } else if (args[i] === '--watch' && args[i + 1]) {
      options.watch = args[i + 1];
      i++;
    } else if (args[i] === '--status' && args[i + 1]) {
      options.status = args[i + 1];
      i++;
    }
  }

  return options;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadProgress(): Progress | null {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

function saveProgress(progress: Progress): void {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function loadCemeteries(provincie?: string): Cemetery[] {
  const dataPath = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  if (provincie) {
    return cemeteries.filter(c =>
      c.provincie.toLowerCase() === provincie.toLowerCase()
    );
  }
  return cemeteries;
}

async function getExistingSlugs(): Promise<Set<string>> {
  console.log('🔍 Checking database for existing reviews...');
  try {
    const result = await sql`SELECT DISTINCT cemetery_slug FROM google_reviews`;
    const slugs = new Set(result.map((r: { cemetery_slug: string }) => r.cemetery_slug));
    console.log(`   Found ${slugs.size} cemeteries with existing reviews`);
    return slugs;
  } catch (error) {
    console.error('⚠️  Could not check existing reviews:', error);
    return new Set();
  }
}

// Generate search URL for Step 1
function generateSearchUrl(cemetery: Cemetery): string {
  const parts = [cemetery.naam_begraafplaats];
  if (cemetery.adres) parts.push(cemetery.adres);
  if (cemetery.postcode) parts.push(cemetery.postcode);
  if (cemetery.plaats) parts.push(cemetery.plaats);
  else if (cemetery.gemeente) parts.push(cemetery.gemeente);
  parts.push('Nederland');

  const query = parts.join(', ');

  if (cemetery.gps_coordinaten) {
    const coords = cemetery.gps_coordinaten.split(',');
    if (coords.length === 2) {
      const lat = coords[0].trim();
      const lon = coords[1].trim();
      return `https://www.google.nl/maps/search/${encodeURIComponent(query)}/@${lat},${lon},17z?hl=nl`;
    }
  }

  return `https://www.google.nl/maps/search/${encodeURIComponent(query)}?hl=nl`;
}

// Check job status
async function checkStatus(snapshotId: string): Promise<any> {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/progress/${snapshotId}`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` } }
  );
  return response.json();
}

// Watch job with live updates
async function watchJob(snapshotId: string, step: 1 | 2): Promise<boolean> {
  console.log(`\n👀 Watching Step ${step} job ${snapshotId}...`);
  console.log('   Press Ctrl+C to stop\n');

  const startTime = Date.now();

  while (true) {
    try {
      const status = await checkStatus(snapshotId);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const elapsedStr = `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

      process.stdout.write('\r\x1b[K');

      if (status.status === 'running') {
        const pct = status.progress ? Math.round(status.progress * 100) : 0;
        const records = status.records || 0;
        const errors = status.errors || 0;

        const barWidth = 30;
        const filled = Math.round((pct / 100) * barWidth);
        const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

        process.stdout.write(
          `⏳ Step ${step} [${bar}] ${pct}% | ✅ ${records} | ❌ ${errors} | ⏱️ ${elapsedStr}`
        );
      } else if (status.status === 'ready') {
        console.log(`\n\n✅ Step ${step} completed in ${elapsedStr}!`);
        console.log(`   📊 Records: ${status.records || 0} | Errors: ${status.errors || 0}`);
        return true;
      } else if (status.status === 'failed') {
        console.log(`\n\n❌ Step ${step} failed after ${elapsedStr}`);
        console.log('Status:', JSON.stringify(status, null, 2));
        return false;
      }
    } catch (error) {
      process.stdout.write('\r\x1b[K⚠️  Connection error, retrying...');
    }

    await sleep(5000);
  }
}

// STEP 1: Get place info and top reviews
async function startStep1(cemeteries: Cemetery[]): Promise<string> {
  console.log(`\n🚀 STEP 1: Getting place info for ${cemeteries.length} locations...`);

  const urls = cemeteries.map(c => ({
    url: generateSearchUrl(c),
    slug: c.slug,
  }));

  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_GOOGLE_MAPS_INFO}&include_errors=true`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urls.map(u => ({ url: u.url }))),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to start Step 1: ${response.status} - ${error}`);
  }

  const result = await response.json();
  console.log('✅ Step 1 job started:', result.snapshot_id);

  // Save progress
  const progress: Progress = {
    step: 1,
    snapshotId: result.snapshot_id,
    status: 'running',
    startedAt: new Date().toISOString(),
    urlMapping: urls,
  };
  saveProgress(progress);

  return result.snapshot_id;
}

// Import Step 1 results and extract place_ids
async function importStep1(snapshotId: string): Promise<{ place_id: string; slug: string; url: string }[]> {
  console.log(`\n📥 Importing Step 1 results...`);

  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` } }
  );

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const results = await response.json();
  console.log(`📊 Downloaded ${results.length} results`);

  const progress = loadProgress();
  const urlMapping = progress?.urlMapping || [];

  const placeIds: { place_id: string; slug: string; url: string }[] = [];
  let reviewsImported = 0;

  for (const result of results) {
    if (!result.place_id) continue;

    // Find matching slug
    let slug: string | undefined;
    if (result.input?.url) {
      const mapping = urlMapping.find(m => m.url === result.input.url);
      if (mapping) slug = mapping.slug;
    }

    if (!slug) continue;

    // Save place_id for step 2
    placeIds.push({
      place_id: result.place_id,
      slug,
      url: result.url || result.input?.url,
    });

    // Also import top_reviews if available (bonus!)
    if (result.top_reviews && result.top_reviews.length > 0) {
      for (const review of result.top_reviews) {
        if (!review.content) continue;
        try {
          await sql`
            INSERT INTO google_reviews (
              cemetery_slug, google_place_id, reviewer_name, reviewer_image_url,
              rating, content, review_date, language
            ) VALUES (
              ${slug}, ${result.place_id}, ${review.reviewer_name}, ${review.reviewer_image_url || null},
              ${review.rating}, ${review.content},
              ${review.review_date ? new Date(review.review_date).toISOString() : null}, 'nl'
            ) ON CONFLICT DO NOTHING
          `;
          reviewsImported++;
        } catch (err) {
          // Ignore duplicates
        }
      }
    }
  }

  // Update progress with place_ids
  if (progress) {
    progress.status = 'completed';
    progress.placeIds = placeIds;
    saveProgress(progress);
  }

  console.log(`\n✅ Step 1 Import Complete!`);
  console.log(`   📍 Place IDs found: ${placeIds.length}`);
  console.log(`   📝 Bonus reviews imported: ${reviewsImported}`);
  console.log(`\n💡 Ready for Step 2: npx tsx scripts/scrape-reviews-2step.ts --step2`);

  return placeIds;
}

// STEP 2: Get all reviews using place_ids
async function startStep2(): Promise<string> {
  const progress = loadProgress();

  if (!progress?.placeIds || progress.placeIds.length === 0) {
    throw new Error('No place_ids found! Run Step 1 first.');
  }

  console.log(`\n🚀 STEP 2: Getting ALL reviews for ${progress.placeIds.length} locations...`);

  // Use the place URLs for the reviews endpoint
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_GOOGLE_REVIEWS}&include_errors=true`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress.placeIds.map(p => ({
        url: p.url,
        days_limit: 365 * 5  // Get reviews from last 5 years
      }))),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to start Step 2: ${response.status} - ${error}`);
  }

  const result = await response.json();
  console.log('✅ Step 2 job started:', result.snapshot_id);

  // Update progress
  progress.step = 2;
  progress.snapshotId = result.snapshot_id;
  progress.status = 'running';
  saveProgress(progress);

  return result.snapshot_id;
}

// Import Step 2 results (all reviews)
async function importStep2(snapshotId: string): Promise<void> {
  console.log(`\n📥 Importing Step 2 results (all reviews)...`);

  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` } }
  );

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const results = await response.json();
  console.log(`📊 Downloaded ${results.length} reviews`);

  const progress = loadProgress();
  const placeIdMap = new Map(progress?.placeIds?.map(p => [p.place_id, p.slug]) || []);

  let imported = 0;
  let duplicates = 0;

  for (const review of results) {
    const slug = placeIdMap.get(review.place_id);
    if (!slug || !review.review) continue;

    try {
      const result = await sql`
        INSERT INTO google_reviews (
          cemetery_slug, google_place_id, reviewer_name, reviewer_image_url,
          rating, content, review_date, language
        ) VALUES (
          ${slug}, ${review.place_id}, ${review.reviewer_name}, ${review.profile_pic_url || null},
          ${review.review_rating}, ${review.review},
          ${review.review_date ? new Date(review.review_date).toISOString() : null}, 'nl'
        ) ON CONFLICT DO NOTHING
        RETURNING id
      `;
      if (result.length > 0) imported++;
      else duplicates++;
    } catch (err) {
      duplicates++;
    }
  }

  console.log(`\n✅ Step 2 Import Complete!`);
  console.log(`   📝 New reviews imported: ${imported}`);
  console.log(`   🔄 Duplicates skipped: ${duplicates}`);
}

// Main
async function main() {
  const options = parseArgs();

  // Watch a specific job
  if (options.watch) {
    const progress = loadProgress();
    await watchJob(options.watch, progress?.step || 1);
    return;
  }

  // Check status
  if (options.status) {
    const status = await checkStatus(options.status);
    console.log('Status:', JSON.stringify(status, null, 2));
    return;
  }

  // Import Step 1
  if (options.importStep1) {
    await importStep1(options.importStep1);
    return;
  }

  // Import Step 2
  if (options.importStep2) {
    await importStep2(options.importStep2);
    return;
  }

  // Start Step 2
  if (options.step2) {
    const snapshotId = await startStep2();
    const success = await watchJob(snapshotId, 2);
    if (success) {
      await importStep2(snapshotId);
    }
    return;
  }

  // Default: Start Step 1
  const allCemeteries = loadCemeteries(options.provincie);
  console.log(`\n📍 Found ${allCemeteries.length} cemeteries${options.provincie ? ` in ${options.provincie}` : ''}`);

  const existingSlugs = await getExistingSlugs();
  const cemeteriesToScrape = allCemeteries.filter(c => !existingSlugs.has(c.slug));
  const skipped = allCemeteries.length - cemeteriesToScrape.length;

  if (skipped > 0) {
    console.log(`⏭️  Skipping ${skipped} cemeteries with existing reviews`);
  }

  console.log(`🎯 ${cemeteriesToScrape.length} cemeteries to scrape`);

  if (cemeteriesToScrape.length === 0) {
    console.log('\n✅ Nothing to scrape!');
    return;
  }

  // Dry run
  if (options.dryRun) {
    console.log('\n🔍 DRY RUN - Would scrape:');
    cemeteriesToScrape.slice(0, 5).forEach((c, i) => {
      console.log(`${i + 1}. ${c.slug}`);
      console.log(`   ${generateSearchUrl(c)}`);
    });
    if (cemeteriesToScrape.length > 5) {
      console.log(`... and ${cemeteriesToScrape.length - 5} more`);
    }
    console.log(`\n💰 Estimated cost: ~$${(cemeteriesToScrape.length * 0.0015 * 2).toFixed(2)} (Step 1 + Step 2)`);
    return;
  }

  // Start Step 1
  console.log('\n' + '='.repeat(50));
  console.log('🎯 STEP 1: Get Place IDs + Top Reviews');
  console.log('='.repeat(50));
  console.log(`Locations: ${cemeteriesToScrape.length}`);
  console.log(`Est. cost: ~$${(cemeteriesToScrape.length * 0.0015).toFixed(2)}`);
  console.log('='.repeat(50));

  const snapshotId = await startStep1(cemeteriesToScrape);
  const success = await watchJob(snapshotId, 1);

  if (success) {
    await importStep1(snapshotId);
    console.log('\n📋 Next: Run Step 2 to get ALL reviews:');
    console.log('   npx tsx scripts/scrape-reviews-2step.ts --step2');
  }
}

main().catch(console.error);
