#!/usr/bin/env npx tsx
/**
 * Script om Google Reviews te scrapen voor alle begraafplaatsen via BrightData
 *
 * Features:
 * - Live progress tracking met progress bar
 * - Skip locaties die al reviews hebben
 * - Auto-import wanneer klaar
 * - Batch processing per provincie
 *
 * Gebruik:
 *   npx tsx scripts/scrape-all-reviews.ts --dry-run                    # Toon wat er gescrapet zou worden
 *   npx tsx scripts/scrape-all-reviews.ts --provincie "Noord-Brabant"  # Start scrape + live monitoring
 *   npx tsx scripts/scrape-all-reviews.ts --batch 100                  # Scrape max 100 locaties
 *   npx tsx scripts/scrape-all-reviews.ts --watch <id>                 # Live monitoring van een job
 *   npx tsx scripts/scrape-all-reviews.ts --watch <id> --auto-import   # Auto-import wanneer klaar
 *   npx tsx scripts/scrape-all-reviews.ts --status <id>                # Check status (eenmalig)
 *   npx tsx scripts/scrape-all-reviews.ts --import <id>                # Importeer resultaten
 *   npx tsx scripts/scrape-all-reviews.ts --resume                     # Hervat laatste job
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const API_KEY = 'eb74cc13a9d2b8886970e445602106c99490677afcc77fa2c9c6b230cf3092d0';
const sql = neon(process.env.DATABASE_URL!);
const RATE_LIMIT_MS = 5000; // 5 seconden tussen requests
const PROGRESS_FILE = path.join(process.cwd(), 'data', 'scrape-progress.json');

// Google Maps Full Info - Collect by URL (includes top_reviews!)
const DATASET_ID = 'gd_m8ebnr0q2qlklc02fz';

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gps_coordinaten?: string;
}

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

interface ScrapeProgress {
  snapshotId: string;
  startedAt: string;
  status: 'running' | 'ready' | 'importing' | 'completed' | 'failed';
  totalUrls: number;
  provincie?: string;
  urlMapping: { url: string; slug: string }[];
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    provincie?: string;
    status?: string;
    import?: string;
    watch?: string;
    dryRun: boolean;
    batch: number;
    skipExisting: boolean;
    resume: boolean;
    autoImport: boolean;
  } = {
    dryRun: false,
    batch: 0,
    skipExisting: true, // Default: skip existing
    resume: false,
    autoImport: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--provincie' && args[i + 1]) {
      options.provincie = args[i + 1];
      i++;
    } else if (args[i] === '--status' && args[i + 1]) {
      options.status = args[i + 1];
      i++;
    } else if (args[i] === '--import' && args[i + 1]) {
      options.import = args[i + 1];
      i++;
    } else if (args[i] === '--watch' && args[i + 1]) {
      options.watch = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--batch' && args[i + 1]) {
      options.batch = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--skip-existing') {
      options.skipExisting = true;
    } else if (args[i] === '--include-existing') {
      options.skipExisting = false;
    } else if (args[i] === '--resume') {
      options.resume = true;
    } else if (args[i] === '--auto-import') {
      options.autoImport = true;
    }
  }

  return options;
}

// Sleep function for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load progress from file
function loadProgress(): ScrapeProgress | null {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

// Save progress to file
function saveProgress(progress: ScrapeProgress): void {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Load all cemeteries
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

// Get slugs that already have reviews in the database
async function getExistingSlugs(): Promise<Set<string>> {
  console.log('🔍 Checking database for existing reviews...');

  try {
    const result = await sql`
      SELECT DISTINCT cemetery_slug FROM google_reviews
    `;

    const slugs = new Set(result.map((r: { cemetery_slug: string }) => r.cemetery_slug));
    console.log(`   Found ${slugs.size} cemeteries with existing reviews`);
    return slugs;
  } catch (error) {
    console.error('⚠️  Could not check existing reviews:', error);
    return new Set();
  }
}

// Generate Google Maps search URL for a cemetery
function generateSearchUrl(cemetery: Cemetery): string {
  // Build query: name, address, postcode, place, Nederland
  const parts = [cemetery.naam_begraafplaats];

  if (cemetery.adres) {
    parts.push(cemetery.adres);
  }

  if (cemetery.postcode) {
    parts.push(cemetery.postcode);
  }

  if (cemetery.plaats) {
    parts.push(cemetery.plaats);
  } else if (cemetery.gemeente) {
    parts.push(cemetery.gemeente);
  }

  parts.push('Nederland');

  const query = parts.join(', ');

  // Add GPS coordinates if available for better accuracy
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

// Start a BrightData scraping job
async function startScrapeJob(urls: { url: string; slug: string }[], provincie?: string): Promise<string> {
  console.log(`\n🚀 Starting BrightData job for ${urls.length} URLs...`);
  console.log('   (This may take a while with rate limiting)');

  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}&include_errors=true`,
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
    throw new Error(`Failed to start job: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const snapshotId = result.snapshot_id;

  console.log('✅ Job started:', snapshotId);

  // Save progress
  const progress: ScrapeProgress = {
    snapshotId,
    startedAt: new Date().toISOString(),
    status: 'running',
    totalUrls: urls.length,
    provincie,
    urlMapping: urls,
  };
  saveProgress(progress);
  console.log(`📁 Progress saved to: ${PROGRESS_FILE}`);

  return snapshotId;
}

// Check job status
async function checkStatus(snapshotId: string): Promise<{ status: string; progress?: number }> {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/progress/${snapshotId}`,
    {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    }
  );

  const status = await response.json();
  return status;
}

// Check and display status
async function displayStatus(snapshotId: string): Promise<void> {
  console.log(`\n🔍 Checking status for job ${snapshotId}...`);

  const status = await checkStatus(snapshotId);
  console.log('\nStatus:', JSON.stringify(status, null, 2));

  if (status.status === 'ready') {
    console.log('\n✅ Job is ready! Run this command to import:');
    console.log(`   npx tsx scripts/scrape-all-reviews.ts --import ${snapshotId}`);

    // Update progress
    const progress = loadProgress();
    if (progress && progress.snapshotId === snapshotId) {
      progress.status = 'ready';
      saveProgress(progress);
    }
  } else if (status.status === 'running') {
    const pct = status.progress ? `(${Math.round(status.progress * 100)}%)` : '';
    console.log(`\n⏳ Job is still running ${pct}. Check again in a few minutes.`);
  } else if (status.status === 'failed') {
    console.log('\n❌ Job failed!');
  }
}

// Watch job status with live updates
async function watchJob(snapshotId: string, autoImport: boolean = false): Promise<void> {
  console.log(`\n👀 Watching job ${snapshotId}...`);
  console.log('   Press Ctrl+C to stop watching\n');

  const startTime = Date.now();
  let lastProgress = -1;

  while (true) {
    try {
      const status = await checkStatus(snapshotId);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const elapsedStr = `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

      // Clear line and show status
      process.stdout.write('\r\x1b[K'); // Clear line

      if (status.status === 'running') {
        const pct = status.progress ? Math.round(status.progress * 100) : 0;
        const records = (status as any).records || 0;
        const errors = (status as any).errors || 0;

        // Progress bar
        const barWidth = 30;
        const filled = Math.round((pct / 100) * barWidth);
        const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

        process.stdout.write(
          `⏳ [${bar}] ${pct}% | ✅ ${records} records | ❌ ${errors} errors | ⏱️ ${elapsedStr}`
        );

        // Show milestone updates
        if (pct > lastProgress && pct % 10 === 0) {
          console.log(`\n   📊 ${pct}% complete - ${records} records scraped`);
          lastProgress = pct;
        }
      } else if (status.status === 'ready') {
        const records = (status as any).records || 0;
        const errors = (status as any).errors || 0;

        console.log(`\n\n✅ Job completed in ${elapsedStr}!`);
        console.log(`   📊 Records: ${records} | Errors: ${errors}`);

        // Update progress file
        const progress = loadProgress();
        if (progress && progress.snapshotId === snapshotId) {
          progress.status = 'ready';
          saveProgress(progress);
        }

        if (autoImport && records > 0) {
          console.log('\n🚀 Auto-importing results...\n');
          await importResults(snapshotId);
        } else if (records > 0) {
          console.log(`\n💡 Import with: npx tsx scripts/scrape-all-reviews.ts --import ${snapshotId}`);
        } else {
          console.log('\n⚠️  No records to import.');
        }
        break;
      } else if (status.status === 'failed') {
        console.log(`\n\n❌ Job failed after ${elapsedStr}`);
        console.log('Status:', JSON.stringify(status, null, 2));
        break;
      }
    } catch (error) {
      process.stdout.write('\r\x1b[K');
      process.stdout.write(`⚠️  Connection error, retrying...`);
    }

    // Poll every 5 seconds
    await sleep(5000);
  }
}

// Download and import results with rate limiting
async function importResults(snapshotId: string): Promise<void> {
  console.log(`\n📥 Downloading results for job ${snapshotId}...`);

  // Update progress
  const progress = loadProgress();
  if (progress && progress.snapshotId === snapshotId) {
    progress.status = 'importing';
    saveProgress(progress);
  }

  // Download results
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const results: BrightDataResult[] = await response.json();
  console.log(`📊 Downloaded ${results.length} results`);

  // Load URL mapping from progress or file
  let urlMapping: { url: string; slug: string }[] = [];

  if (progress && progress.urlMapping) {
    urlMapping = progress.urlMapping;
  } else {
    const mappingPath = path.join(process.cwd(), 'data', `url-slug-mapping-${snapshotId}.json`);
    if (fs.existsSync(mappingPath)) {
      urlMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    }
  }

  // Load cemeteries for GPS matching fallback
  const cemeteries = loadCemeteries();

  let matchedCount = 0;
  let reviewsImported = 0;
  let skippedNoReviews = 0;
  let skippedNoMatch = 0;
  let duplicatesSkipped = 0;

  console.log('\n📝 Importing reviews to database...');
  console.log('   (Rate limited: 5 sec between each cemetery)\n');

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    let slug: string | undefined;

    // Progress indicator
    process.stdout.write(`\r   Processing ${i + 1}/${results.length}...`);

    // Try input URL matching first
    if (result.input?.url) {
      const mapping = urlMapping.find(m => m.url === result.input!.url);
      if (mapping) {
        slug = mapping.slug;
      }
    }

    // Fallback: GPS matching
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
        const dLat = Math.abs(cLat - result.lat);
        const dLon = Math.abs(cLon - result.lon);
        return Math.sqrt(dLat * dLat + dLon * dLon) < 0.003;
      });
      if (cemetery) {
        slug = cemetery.slug;
      }
    }

    // Fallback: name matching
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
      skippedNoMatch++;
      continue;
    }

    matchedCount++;

    // Import reviews
    if (result.top_reviews && result.top_reviews.length > 0) {
      for (const review of result.top_reviews) {
        if (!review.content || review.content.trim() === '') continue;

        try {
          const insertResult = await sql`
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
            RETURNING id
          `;

          if (insertResult.length > 0) {
            reviewsImported++;
          } else {
            duplicatesSkipped++;
          }
        } catch (err) {
          console.error('\n⚠️  Failed to insert review:', err);
        }
      }
    } else {
      skippedNoReviews++;
    }

    // Rate limiting between imports
    if (i < results.length - 1) {
      await sleep(100); // Small delay for DB imports (not full 5s)
    }
  }

  // Update progress
  if (progress && progress.snapshotId === snapshotId) {
    progress.status = 'completed';
    saveProgress(progress);
  }

  console.log('\n\n' + '='.repeat(50));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total results from BrightData: ${results.length}`);
  console.log(`Matched to cemeteries: ${matchedCount}`);
  console.log(`No match found: ${skippedNoMatch}`);
  console.log(`Locations without reviews: ${skippedNoReviews}`);
  console.log(`New reviews imported: ${reviewsImported}`);
  console.log(`Duplicate reviews skipped: ${duplicatesSkipped}`);
  console.log('='.repeat(50));
}

// Main function
async function main() {
  const options = parseArgs();

  // Resume last job
  if (options.resume) {
    const progress = loadProgress();
    if (!progress) {
      console.log('❌ No previous job found to resume');
      return;
    }

    console.log(`\n📋 Found previous job: ${progress.snapshotId}`);
    console.log(`   Started: ${progress.startedAt}`);
    console.log(`   Status: ${progress.status}`);
    console.log(`   URLs: ${progress.totalUrls}`);

    if (progress.status === 'running') {
      await displayStatus(progress.snapshotId);
    } else if (progress.status === 'ready') {
      console.log('\n🎯 Job is ready for import!');
      await importResults(progress.snapshotId);
    } else if (progress.status === 'completed') {
      console.log('\n✅ Job already completed!');
    }
    return;
  }

  // Check status
  if (options.status) {
    await displayStatus(options.status);
    return;
  }

  // Watch job with live updates
  if (options.watch) {
    await watchJob(options.watch, options.autoImport);
    return;
  }

  // Import results
  if (options.import) {
    await importResults(options.import);
    return;
  }

  // Load cemeteries
  const allCemeteries = loadCemeteries(options.provincie);
  console.log(`\n📍 Found ${allCemeteries.length} cemeteries${options.provincie ? ` in ${options.provincie}` : ''}`);

  // Get existing slugs to skip
  let cemeteriesToScrape = allCemeteries;
  let skippedCount = 0;

  if (options.skipExisting) {
    const existingSlugs = await getExistingSlugs();
    cemeteriesToScrape = allCemeteries.filter(c => !existingSlugs.has(c.slug));
    skippedCount = allCemeteries.length - cemeteriesToScrape.length;

    if (skippedCount > 0) {
      console.log(`⏭️  Skipping ${skippedCount} cemeteries that already have reviews`);
    }
  }

  console.log(`🎯 ${cemeteriesToScrape.length} cemeteries to scrape`);

  // Generate URLs with slug mapping
  const urlsWithSlugs = cemeteriesToScrape.map(c => ({
    url: generateSearchUrl(c),
    slug: c.slug,
  }));

  // Apply batch limit
  let urlsToProcess = urlsWithSlugs;
  if (options.batch > 0 && urlsWithSlugs.length > options.batch) {
    urlsToProcess = urlsWithSlugs.slice(0, options.batch);
    console.log(`📦 Limiting to batch of ${options.batch} URLs`);
  }

  if (urlsToProcess.length === 0) {
    console.log('\n✅ Nothing to scrape! All cemeteries already have reviews.');
    return;
  }

  // Dry run - just show URLs
  if (options.dryRun) {
    console.log('\n🔍 DRY RUN - URLs that would be scraped:');
    console.log('='.repeat(60));

    // Group by provincie for overview
    const byProvincie = new Map<string, number>();
    for (const c of cemeteriesToScrape) {
      byProvincie.set(c.provincie, (byProvincie.get(c.provincie) || 0) + 1);
    }

    console.log('\nPer provincie:');
    for (const [prov, count] of [...byProvincie.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`   ${prov}: ${count} locaties`);
    }

    console.log('\nVoorbeeld URLs (eerste 10):');
    urlsToProcess.slice(0, 10).forEach((u, i) => {
      console.log(`${i + 1}. ${u.slug}`);
      console.log(`   ${u.url}`);
    });

    if (urlsToProcess.length > 10) {
      console.log(`\n... en ${urlsToProcess.length - 10} meer`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SAMENVATTING');
    console.log('='.repeat(60));
    console.log(`Totaal in database: ${allCemeteries.length}`);
    console.log(`Al reviews: ${skippedCount} (wordt overgeslagen)`);
    console.log(`Te scrapen: ${urlsToProcess.length}`);
    console.log(`💰 Geschatte kosten: ~$${(urlsToProcess.length * 0.0015).toFixed(2)}`);
    console.log('='.repeat(60));

    console.log('\n💡 Start scrape met:');
    console.log(`   npx tsx scripts/scrape-all-reviews.ts${options.provincie ? ` --provincie "${options.provincie}"` : ''}${options.batch ? ` --batch ${options.batch}` : ''}`);
    return;
  }

  // Show summary and start
  console.log('\n' + '='.repeat(50));
  console.log('🎯 SCRAPE JOB');
  console.log('='.repeat(50));
  console.log(`URLs to scrape: ${urlsToProcess.length}`);
  console.log(`Estimated cost: ~$${(urlsToProcess.length * 0.0015).toFixed(2)}`);
  console.log('='.repeat(50));

  // Start the job
  const snapshotId = await startScrapeJob(urlsToProcess, options.provincie);

  // Automatically start watching with auto-import
  console.log('\n🎬 Starting live monitoring...');
  await watchJob(snapshotId, true); // Auto-import when done
}

main().catch(console.error);
