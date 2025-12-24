#!/usr/bin/env npx tsx
/**
 * Fetch missing photos - voor begraafplaatsen met CID maar zonder foto's
 *
 * Features:
 * - Intelligent rate limiting met exponential backoff
 * - Retry logic (3 attempts per batch)
 * - Progress saving after each batch
 * - Resumes from where it left off
 * - Downloads images locally
 * - Detailed logging
 *
 * Gebruik:
 *   npx tsx scripts/fetch-missing-photos.ts --dry-run       # Toon wat er gedaan zou worden
 *   npx tsx scripts/fetch-missing-photos.ts --batch 10      # Verwerk 10 locaties per API call
 *   npx tsx scripts/fetch-missing-photos.ts --reset         # Start opnieuw (reset progress)
 *   npx tsx scripts/fetch-missing-photos.ts                 # Start/hervat volledige run
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const API_KEY = 'eb74cc13a9d2b8886970e445602106c99490677afcc77fa2c9c6b230cf3092d0';
const DATASET_ID = 'gd_m8ebnr0q2qlklc02fz';
const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'images', 'google');
const PROGRESS_FILE = path.join(process.cwd(), 'data', 'missing-photos-progress.json');

// Configuration
const CONFIG = {
  batchSize: 5,              // CIDs per API request (keep small for reliability)
  minDelayBetweenBatches: 15000,   // Minimum 15 seconds between batches
  maxDelayBetweenBatches: 60000,   // Maximum 60 seconds between batches
  delayBetweenRetries: 45000,      // 45 seconds before retry
  maxRetries: 3,
  jobTimeout: 240000,        // 4 minutes max wait per job
  jobPollInterval: 5000,     // Check job status every 5 seconds
  downloadTimeout: 20000,    // 20 seconds for image download
  maxConsecutiveErrors: 5,   // Stop after 5 consecutive errors
};

// Rate limiter state
const rateLimiter = {
  lastRequestTime: 0,
  consecutiveErrors: 0,
  currentDelay: CONFIG.minDelayBetweenBatches,
  requestCount: 0,
};

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  google_place_id?: string;
  photo?: string;
  wikimedia_image?: string;
  google_photo?: string;
  [key: string]: unknown;
}

interface Progress {
  processedSlugs: string[];
  lastRun: string;
  stats: {
    found: number;
    notFound: number;
    errors: number;
    downloaded: number;
  };
}

interface BrightDataResult {
  cid?: string;
  cid_location?: string;
  name?: string;
  main_image?: string;
  photos_and_videos?: string[];
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

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// Rate limiting functions
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - rateLimiter.lastRequestTime;
  const waitTime = Math.max(0, rateLimiter.currentDelay - timeSinceLastRequest);

  if (waitTime > 0) {
    console.log(`   ⏳ Rate limit: wacht ${formatTime(waitTime)}...`);
    await sleep(waitTime);
  }

  rateLimiter.lastRequestTime = Date.now();
  rateLimiter.requestCount++;
}

function onRequestSuccess(): void {
  rateLimiter.consecutiveErrors = 0;
  // Gradually decrease delay on success (min 15s)
  rateLimiter.currentDelay = Math.max(
    CONFIG.minDelayBetweenBatches,
    rateLimiter.currentDelay * 0.9
  );
}

function onRequestError(): void {
  rateLimiter.consecutiveErrors++;
  // Exponential backoff on error (max 60s)
  rateLimiter.currentDelay = Math.min(
    CONFIG.maxDelayBetweenBatches,
    rateLimiter.currentDelay * 1.5
  );
  console.log(`   ⚠️  Rate limit verhoogd naar ${formatTime(rateLimiter.currentDelay)}`);
}

function shouldStop(): boolean {
  return rateLimiter.consecutiveErrors >= CONFIG.maxConsecutiveErrors;
}

function loadCemeteries(): Cemetery[] {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveCemeteries(cemeteries: Cemetery[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cemeteries, null, 2));
}

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return {
    processedSlugs: [],
    lastRun: new Date().toISOString(),
    stats: { found: 0, notFound: 0, errors: 0, downloaded: 0 }
  };
}

function saveProgress(progress: Progress): void {
  progress.lastRun = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function hasPhotoFile(slug: string): boolean {
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  return extensions.some(ext =>
    fs.existsSync(path.join(PHOTOS_DIR, `${slug}.${ext}`))
  );
}

function hasAnyPhoto(cemetery: Cemetery): boolean {
  return !!(cemetery.photo || cemetery.wikimedia_image || cemetery.google_photo);
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Clean up URL (remove HTML entities)
    const cleanUrl = url.replace(/&amp;/g, '&');

    const protocol = cleanUrl.startsWith('https') ? https : http;

    const req = protocol.get(cleanUrl, {
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
        resolve(false);
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        // Check file size (minimum 2KB for a real image)
        try {
          const stats = fs.statSync(filepath);
          if (stats.size < 2000) {
            fs.unlinkSync(filepath);
            resolve(false);
          } else {
            resolve(true);
          }
        } catch {
          resolve(false);
        }
      });
      file.on('error', () => {
        try { fs.unlinkSync(filepath); } catch {}
        resolve(false);
      });
    });

    req.on('error', () => resolve(false));
    req.setTimeout(CONFIG.downloadTimeout, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function fetchPhotosBatch(cids: string[]): Promise<{ snapshot_id: string }> {
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

async function getJobResults(snapshotId: string): Promise<BrightDataResult[]> {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` } }
  );

  if (!response.ok) {
    throw new Error(`Results fetch failed: ${response.status}`);
  }

  return response.json();
}

async function waitForJob(snapshotId: string): Promise<BrightDataResult[]> {
  const startTime = Date.now();
  let dots = 0;

  while (Date.now() - startTime < CONFIG.jobTimeout) {
    try {
      const status = await checkJobStatus(snapshotId);

      if (status.status === 'ready') {
        return getJobResults(snapshotId);
      }

      if (status.status === 'failed') {
        throw new Error('Job failed');
      }
    } catch (error) {
      // Ignore status check errors, just retry
    }

    dots++;
    if (dots % 10 === 0) {
      process.stdout.write(`${Math.floor((Date.now() - startTime) / 1000)}s`);
    } else {
      process.stdout.write('.');
    }
    await sleep(CONFIG.jobPollInterval);
  }

  throw new Error('Job timed out');
}

async function waitForJobWithRetry(snapshotId: string, attempt = 1): Promise<BrightDataResult[]> {
  try {
    return await waitForJob(snapshotId);
  } catch (error) {
    if (attempt < CONFIG.maxRetries) {
      const waitTime = CONFIG.delayBetweenRetries * attempt; // Increase wait with each retry
      console.log(`\n   ⚠️ ${error instanceof Error ? error.message : error}`);
      console.log(`   🔄 Retry ${attempt}/${CONFIG.maxRetries} - wacht ${formatTime(waitTime)}...`);
      await sleep(waitTime);
      return waitForJobWithRetry(snapshotId, attempt + 1);
    }
    throw error;
  }
}

function getBestPhotoUrl(result: BrightDataResult): string | null {
  // Prefer photos_and_videos (higher quality)
  if (result.photos_and_videos && result.photos_and_videos.length > 0) {
    let bestPhoto = result.photos_and_videos[0];
    // Try to upgrade resolution if it's a Google photo
    if (bestPhoto.includes('w=') && bestPhoto.includes('h=')) {
      bestPhoto = bestPhoto.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=900');
    }
    return bestPhoto.replace(/&amp;/g, '&');
  }

  // Fallback to main_image
  if (result.main_image) {
    let mainImage = result.main_image;
    // Try to upgrade resolution
    if (mainImage.includes('w=') && mainImage.includes('h=')) {
      mainImage = mainImage.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=900');
    }
    return mainImage.replace(/&amp;/g, '&');
  }

  return null;
}

async function processBatch(
  batch: Cemetery[],
  allCemeteries: Cemetery[],
  progress: Progress
): Promise<{ found: number; notFound: number; errors: number; downloaded: number }> {
  const stats = { found: 0, notFound: 0, errors: 0, downloaded: 0 };
  const cids = batch.map(c => c.google_place_id!);
  const cidToSlug = new Map(batch.map(c => [c.google_place_id, c.slug]));
  const cidToName = new Map(batch.map(c => [c.google_place_id, c.naam_begraafplaats]));

  try {
    // Wait for rate limit
    await waitForRateLimit();

    // Create job
    const job = await fetchPhotosBatch(cids);
    process.stdout.write(` [${job.snapshot_id.slice(-8)}] `);

    // Wait for results
    const results = await waitForJobWithRetry(job.snapshot_id);
    console.log(` ✓ ${results.length} results`);

    // Mark success for rate limiter
    onRequestSuccess();

    for (const result of results) {
      // Match result to cemetery by CID
      const cid = result.cid || result.cid_location;
      let slug = cidToSlug.get(cid);

      // Fallback: try to match by name
      if (!slug && result.name) {
        for (const [c, s] of cidToName.entries()) {
          if (result.name.toLowerCase().includes(s.toLowerCase().split(' ')[0])) {
            slug = cidToSlug.get(c);
            break;
          }
        }
      }

      if (!slug) continue;

      const photoUrl = getBestPhotoUrl(result);

      if (photoUrl) {
        stats.found++;

        // Download the image
        const filename = `${slug}.jpg`;
        const filepath = path.join(PHOTOS_DIR, filename);

        const shortName = (result.name || slug).substring(0, 40);
        process.stdout.write(`   📥 ${shortName}...`);
        const downloaded = await downloadImage(photoUrl, filepath);

        if (downloaded) {
          // Update cemetery data
          const index = allCemeteries.findIndex(c => c.slug === slug);
          if (index !== -1) {
            allCemeteries[index].google_photo = `/images/google/${filename}`;
            stats.downloaded++;
            console.log(` ✅`);
          }
        } else {
          console.log(` ⚠️ download failed`);
        }
      } else {
        stats.notFound++;
      }

      // Mark as processed
      if (!progress.processedSlugs.includes(slug)) {
        progress.processedSlugs.push(slug);
      }
    }

    // Mark all batch items as processed
    for (const cemetery of batch) {
      if (!progress.processedSlugs.includes(cemetery.slug)) {
        progress.processedSlugs.push(cemetery.slug);
      }
    }

    return stats;
  } catch (error) {
    console.log(`\n   ❌ Batch failed: ${error instanceof Error ? error.message : error}`);
    onRequestError();
    stats.errors = batch.length;
    return stats;
  }
}

async function main() {
  const options = parseArgs();

  console.log('');
  console.log('📷 Missing Photos Fetcher');
  console.log('='.repeat(50));
  console.log(`🕒 Gestart: ${new Date().toLocaleString('nl-NL')}`);
  console.log('');

  // Ensure photos directory exists
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  // Load data
  const cemeteries = loadCemeteries();
  let progress = options.reset ? {
    processedSlugs: [],
    lastRun: new Date().toISOString(),
    stats: { found: 0, notFound: 0, errors: 0, downloaded: 0 }
  } : loadProgress();

  // Find cemeteries with CID but no photos and not yet processed
  const missing = cemeteries.filter(c =>
    c.google_place_id &&
    /^\d+$/.test(c.google_place_id) &&
    !hasAnyPhoto(c) &&
    !hasPhotoFile(c.slug) &&
    !progress.processedSlugs.includes(c.slug)
  );

  const withCid = cemeteries.filter(c => c.google_place_id && /^\d+$/.test(c.google_place_id));
  const withPhotos = cemeteries.filter(c => hasAnyPhoto(c) || hasPhotoFile(c.slug));

  console.log(`📊 Status:`);
  console.log(`   Totaal begraafplaatsen: ${cemeteries.length}`);
  console.log(`   Met CID: ${withCid.length}`);
  console.log(`   Met foto: ${withPhotos.length}`);
  console.log(`   Al verwerkt: ${progress.processedSlugs.length}`);
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
  console.log(`🚀 Start verwerking:`);
  console.log(`   ${missing.length} locaties in ${totalBatches} batches van ${options.batchSize}`);
  console.log(`   Rate limit: ${formatTime(CONFIG.minDelayBetweenBatches)} - ${formatTime(CONFIG.maxDelayBetweenBatches)}`);
  console.log('');
  console.log('   (Ctrl+C om te stoppen - voortgang wordt opgeslagen)');
  console.log('');

  let batchNum = 0;
  const startTime = Date.now();

  for (let i = 0; i < missing.length; i += options.batchSize) {
    // Check if we should stop due to too many errors
    if (shouldStop()) {
      console.log('');
      console.log(`❌ Gestopt: ${CONFIG.maxConsecutiveErrors} opeenvolgende fouten`);
      console.log('   Wacht even en probeer later opnieuw.');
      break;
    }

    batchNum++;
    const batch = missing.slice(i, i + options.batchSize);
    const elapsed = formatTime(Date.now() - startTime);

    console.log(`📦 Batch ${batchNum}/${totalBatches} [${elapsed}]`);

    const stats = await processBatch(batch, cemeteries, progress);

    // Update progress stats
    progress.stats.found += stats.found;
    progress.stats.notFound += stats.notFound;
    progress.stats.errors += stats.errors;
    progress.stats.downloaded += stats.downloaded;

    // Save progress and updated cemeteries after each batch
    saveProgress(progress);
    saveCemeteries(cemeteries);

    // Show running stats every 10 batches
    if (batchNum % 10 === 0) {
      console.log('');
      console.log(`   📈 Tussenstand: ${progress.stats.downloaded} gedownload, ${progress.stats.errors} errors`);
      console.log('');
    }
  }

  // Final summary
  const totalTime = formatTime(Date.now() - startTime);
  console.log('');
  console.log('='.repeat(50));
  console.log('📊 RESULTATEN');
  console.log('='.repeat(50));
  console.log(`⏱️  Totale tijd: ${totalTime}`);
  console.log(`📦 Batches verwerkt: ${batchNum}`);
  console.log(`✅ Met foto gevonden: ${progress.stats.found}`);
  console.log(`📥 Gedownload: ${progress.stats.downloaded}`);
  console.log(`📭 Geen foto: ${progress.stats.notFound}`);
  console.log(`⚠️  Errors: ${progress.stats.errors}`);

  const photoFiles = fs.existsSync(PHOTOS_DIR)
    ? fs.readdirSync(PHOTOS_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).length
    : 0;
  console.log(`📁 Totaal foto bestanden: ${photoFiles}`);
  console.log('='.repeat(50));
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n');
  console.log('⚠️  Gestopt door gebruiker.');
  console.log('   Voortgang is opgeslagen.');
  console.log('   Herstart het script om door te gaan.');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('\n❌ Onverwachte fout:', error.message);
  process.exit(1);
});

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
