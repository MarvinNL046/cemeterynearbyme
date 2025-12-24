#!/usr/bin/env npx tsx
/**
 * Google Maps Ratings Scraper via BrightData SERP API
 *
 * Haalt Google ratings en review counts op voor begraafplaatsen
 * via BrightData's SERP API (Google zoekresultaten scraping).
 */

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import pLimit from 'p-limit';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.brightdata') });

// Configuration
const CONFIG = {
  // Use BRIGHTDATA_API_TOKEN for Bearer auth (not BRIGHTDATA_API_KEY)
  BRIGHTDATA_API_TOKEN: process.env.BRIGHTDATA_API_TOKEN || '',
  SERP_ZONE: process.env.BRIGHTDATA_SERP_ZONE || 'kinderopvang',
  CONCURRENCY: 3, // Conservative for SERP API
  TIMEOUT: 30000,
  DATA_FILE: path.join(__dirname, '..', 'data', 'begraafplaatsen.json'),
  PUBLIC_FILE: path.join(__dirname, '..', 'public', 'data', 'cemeteries.json'),
  PROGRESS_FILE: path.join(__dirname, '..', 'data', 'google-ratings-progress.json'),
  BATCH_SIZE: 20,
};

interface Begraafplaats {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  slug: string;
  google_rating?: number;
  google_review_count?: number;
  [key: string]: any;
}

interface Progress {
  total: number;
  completed: number;
  failed: number;
  completedSlugs: string[];
  lastUpdated: string;
}

let progress: Progress = {
  total: 0,
  completed: 0,
  failed: 0,
  completedSlugs: [],
  lastUpdated: new Date().toISOString(),
};

// BrightData SERP API request
async function searchGoogle(query: string): Promise<any> {
  const searchUrl = `https://www.google.nl/search?q=${encodeURIComponent(query)}&hl=nl&gl=nl`;

  try {
    // Use BrightData SERP API: POST /request
    const response = await axios.post(
      'https://api.brightdata.com/request',
      {
        zone: CONFIG.SERP_ZONE,
        url: searchUrl,
        format: 'raw', // Use raw HTML, we'll parse it ourselves
        country: 'nl',
      },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.BRIGHTDATA_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: CONFIG.TIMEOUT,
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(`SERP search failed: ${error.response?.status || error.message}`);
  }
}

// Extract rating from search results
function extractRating(searchResults: any, begraafplaatsNaam: string): { rating: number | null; reviewCount: number | null } {
  const result = { rating: null as number | null, reviewCount: null as number | null };

  if (!searchResults) return result;

  // Convert to string for regex matching
  const content = typeof searchResults === 'string'
    ? searchResults
    : JSON.stringify(searchResults);

  // Pattern 1: aria-label="Beoordeeld als X,X van 5," (Google star rating)
  const ariaLabelMatch = content.match(/aria-label="Beoordeeld als (\d[,\.]\d) van 5/i);
  if (ariaLabelMatch) {
    result.rating = parseFloat(ariaLabelMatch[1].replace(',', '.'));
  }

  // Pattern 2: X,X/5 or X.X/5 in visible text
  if (!result.rating) {
    const ratingSlash5 = content.match(/>(\d[,\.]\d)\s*\/\s*5</);
    if (ratingSlash5) {
      result.rating = parseFloat(ratingSlash5[1].replace(',', '.'));
    }
  }

  // Pattern 3: X,X sterren or X.X stars
  if (!result.rating) {
    const starsMatch = content.match(/(\d[,\.]\d)\s*(?:sterren|stars|★)/i);
    if (starsMatch) {
      result.rating = parseFloat(starsMatch[1].replace(',', '.'));
    }
  }

  // Look for review count: (XXX) pattern near rating section
  // The pattern in Google SERP is usually <span class="RDApEe...">(718)</span>
  const reviewCountMatch = content.match(/class="[^"]*">\((\d+)\)<\/span>/);
  if (reviewCountMatch) {
    result.reviewCount = parseInt(reviewCountMatch[1]);
  }

  // Alternative: look for "X recensies" or "X reviews"
  if (!result.reviewCount) {
    const reviewTextMatch = content.match(/(\d+)\s*(?:recensies|reviews|beoordelingen)/i);
    if (reviewTextMatch) {
      result.reviewCount = parseInt(reviewTextMatch[1]);
    }
  }

  return result;
}

// Process single begraafplaats
async function processOne(bp: Begraafplaats): Promise<{ rating: number | null; reviewCount: number | null }> {
  const query = `${bp.naam_begraafplaats} begraafplaats ${bp.gemeente} ${bp.provincie}`;

  try {
    const searchResults = await searchGoogle(query);
    return extractRating(searchResults, bp.naam_begraafplaats);
  } catch (error: any) {
    console.error(chalk.yellow(`\n⚠️ ${bp.naam_begraafplaats}: ${error.message}`));
    return { rating: null, reviewCount: null };
  }
}

// Load/save progress
async function loadProgress(): Promise<void> {
  try {
    const data = await fs.readFile(CONFIG.PROGRESS_FILE, 'utf-8');
    progress = JSON.parse(data);
    console.log(chalk.blue(`📂 Hervat vanaf ${progress.completed}/${progress.total}`));
  } catch {
    console.log(chalk.yellow('📝 Nieuwe scraping sessie'));
  }
}

async function saveProgress(): Promise<void> {
  progress.lastUpdated = new Date().toISOString();
  await fs.writeFile(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Main function
async function main() {
  console.log(chalk.bold.blue('\n🔍 Google Maps Ratings Scraper\n'));

  // Check API token
  if (!CONFIG.BRIGHTDATA_API_TOKEN) {
    console.error(chalk.red('❌ BRIGHTDATA_API_TOKEN niet gevonden in .env.brightdata'));
    process.exit(1);
  }

  // Parse arguments
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;
  const testMode = process.argv.includes('--test');

  await loadProgress();

  // Load data
  console.log(chalk.cyan('📖 Laden van begraafplaatsen...'));
  const data: Begraafplaats[] = JSON.parse(await fs.readFile(CONFIG.DATA_FILE, 'utf-8'));

  // Filter: alleen zonder rating
  const toProcess = data.filter(bp =>
    !bp.google_rating &&
    !progress.completedSlugs.includes(bp.slug)
  );

  progress.total = data.length;

  const withRating = data.filter(bp => bp.google_rating).length;
  console.log(chalk.white(`📊 Totaal: ${data.length}`));
  console.log(chalk.green(`✅ Met rating: ${withRating}`));
  console.log(chalk.yellow(`⏳ Te verwerken: ${toProcess.length}`));

  if (toProcess.length === 0) {
    console.log(chalk.green('\n✅ Alle begraafplaatsen hebben al een rating!'));
    return;
  }

  // Apply limit
  let processItems = toProcess;
  if (testMode) {
    processItems = toProcess.slice(0, 3);
    console.log(chalk.magenta(`\n🧪 TEST MODE: ${processItems.length} items\n`));
  } else if (limit) {
    processItems = toProcess.slice(0, limit);
    console.log(chalk.magenta(`\n📌 Limiet: ${processItems.length} items\n`));
  }

  // Progress bar
  const progressBar = new cliProgress.SingleBar({
    format: 'Scraping |{bar}| {percentage}% | {value}/{total} | {name}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });

  progressBar.start(processItems.length, 0, { name: 'Starting...' });

  // Process with concurrency
  const rateLimiter = pLimit(CONFIG.CONCURRENCY);
  let processed = 0;
  let batchCount = 0;
  let foundRatings = 0;

  // Create data map
  const dataMap = new Map(data.map(bp => [bp.slug, bp]));

  const tasks = processItems.map(bp =>
    rateLimiter(async () => {
      const { rating, reviewCount } = await processOne(bp);

      const item = dataMap.get(bp.slug);
      if (item) {
        if (rating !== null) {
          item.google_rating = rating;
          item.google_review_count = reviewCount || 0;
          foundRatings++;
        }
        progress.completedSlugs.push(bp.slug);
        progress.completed++;
      }

      processed++;
      progressBar.update(processed, { name: bp.naam_begraafplaats.substring(0, 25) });

      // Save batch
      batchCount++;
      if (batchCount >= CONFIG.BATCH_SIZE) {
        batchCount = 0;
        const updatedData = Array.from(dataMap.values());
        await fs.writeFile(CONFIG.DATA_FILE, JSON.stringify(updatedData, null, 2));
        await saveProgress();
      }

      // Rate limit delay
      await new Promise(r => setTimeout(r, 500));
    })
  );

  await Promise.all(tasks);

  progressBar.stop();

  // Final save
  console.log(chalk.cyan('\n💾 Opslaan van data...'));
  const finalData = Array.from(dataMap.values());
  await fs.writeFile(CONFIG.DATA_FILE, JSON.stringify(finalData, null, 2));
  await fs.writeFile(CONFIG.PUBLIC_FILE, JSON.stringify(finalData, null, 2));
  await saveProgress();

  // Summary
  console.log(chalk.bold.green('\n✅ Scraping voltooid!\n'));
  console.log(chalk.white(`   Verwerkt: ${processed}`));
  console.log(chalk.green(`   Ratings gevonden: ${foundRatings}`));
  console.log(chalk.yellow(`   Zonder rating: ${processed - foundRatings}`));

  // Show examples
  const examples = finalData.filter(bp => bp.google_rating).slice(0, 3);
  if (examples.length > 0) {
    console.log(chalk.yellow('\n📝 Voorbeelden met rating:'));
    examples.forEach(ex => {
      console.log(chalk.gray(`   ${ex.naam_begraafplaats}: ${ex.google_rating}/5 (${ex.google_review_count} reviews)`));
    });
  }
}

main().catch(console.error);
