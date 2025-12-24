#!/usr/bin/env npx tsx
/**
 * Pre-cache all cemetery images locally for static deployment
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'images');
const CONCURRENCY = 10;
const TIMEOUT = 10000;

interface Cemetery {
  naam_begraafplaats: string;
  foto_url?: string;
  slug?: string;
}

interface DownloadResult {
  url: string;
  success: boolean;
  cached: boolean;
  error?: string;
}

async function downloadImage(url: string): Promise<DownloadResult> {
  const urlHash = crypto.createHash('md5').update(url).digest('hex');
  const fileName = `${urlHash}.jpg`;
  const filePath = path.join(CACHE_DIR, fileName);

  // Check if already cached
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > 1000) { // Valid image should be > 1KB
      return { url, success: true, cached: true };
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { url, success: false, error: `HTTP ${response.status}` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.length < 1000) {
      return { url, success: false, error: 'Image too small' };
    }

    fs.writeFileSync(filePath, buffer);
    return { url, success: true, cached: false };
  } catch (error: any) {
    return { url, success: false, error: error.message };
  }
}

async function processBatch(urls: string[]): Promise<DownloadResult[]> {
  return Promise.all(urls.map(downloadImage));
}

async function main() {
  console.log('🖼️  Image Pre-Cache Script');
  console.log('=========================\n');

  // Create cache directory
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  // Load cemeteries
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as Cemetery[];

  // Get unique foto_urls
  const urls = [...new Set(
    data
      .filter(c => c.foto_url && c.foto_url.startsWith('http'))
      .map(c => c.foto_url!)
  )];

  console.log(`📊 Found ${urls.length} unique image URLs\n`);

  // Check already cached
  const alreadyCached = urls.filter(url => {
    const hash = crypto.createHash('md5').update(url).digest('hex');
    const filePath = path.join(CACHE_DIR, `${hash}.jpg`);
    return fs.existsSync(filePath) && fs.statSync(filePath).size > 1000;
  });

  console.log(`✅ Already cached: ${alreadyCached.length}`);
  console.log(`📥 To download: ${urls.length - alreadyCached.length}\n`);

  const toDownload = urls.filter(url => !alreadyCached.includes(url));

  if (toDownload.length === 0) {
    console.log('🎉 All images already cached!');
    return;
  }

  let downloaded = 0;
  let failed = 0;
  let skipped = alreadyCached.length;

  console.log('Downloading...\n');

  // Process in batches
  for (let i = 0; i < toDownload.length; i += CONCURRENCY) {
    const batch = toDownload.slice(i, i + CONCURRENCY);
    const results = await processBatch(batch);

    for (const result of results) {
      if (result.success) {
        downloaded++;
        process.stdout.write('.');
      } else {
        failed++;
        process.stdout.write('x');
      }
    }

    // Progress update every 100
    if ((i + CONCURRENCY) % 100 === 0 || i + CONCURRENCY >= toDownload.length) {
      const progress = Math.min(i + CONCURRENCY, toDownload.length);
      const percent = Math.round((progress / toDownload.length) * 100);
      console.log(`\n[${percent}%] ${progress}/${toDownload.length} - ✅ ${downloaded} downloaded, ❌ ${failed} failed`);
    }
  }

  console.log('\n\n📊 Final Results:');
  console.log('=================');
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped (cached): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Cache location: ${CACHE_DIR}`);

  // Calculate cache size
  const files = fs.readdirSync(CACHE_DIR);
  const totalSize = files.reduce((sum, file) => {
    const stats = fs.statSync(path.join(CACHE_DIR, file));
    return sum + stats.size;
  }, 0);
  console.log(`💾 Total cache size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(console.error);
