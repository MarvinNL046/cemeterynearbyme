import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import pLimit from 'p-limit';
import chalk from 'chalk';
import ora from 'ora';
import cliProgress from 'cli-progress';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.brightdata') });

// Configuration - GEBRUIK DEZELFDE API TOKEN
const CONFIG = {
  API_TOKEN: '90e72bf183dcec69948a69a369dec41d115341fe15991eb195b456364aef4ff0', // Jouw bestaande token
  WEB_UNLOCKER_ZONE: 'mcp_unlocker', // Gebruik dezelfde zone
  CONCURRENCY: parseInt(process.env.SCRAPE_CONCURRENCY || '10'),
  RETRY_ATTEMPTS: parseInt(process.env.SCRAPE_RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: 1000,
  TIMEOUT: parseInt(process.env.SCRAPE_TIMEOUT || '30000'),
  OUTPUT_DIR: path.join(__dirname, '..', 'data', 'scraped-brightdata'),
  PROGRESS_FILE: path.join(__dirname, '..', 'data', 'scraped-brightdata', 'progress.json'),
  SUMMARY_FILE: path.join(__dirname, '..', 'data', 'scraped-brightdata', 'summary.json'),
};

// Types
interface Begraafplaats {
  slug: string;
  naam: string;
  gemeente: string;
  provincie: string;
  type: string;
  website?: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  telefoon?: string;
  email?: string;
  coordinaten?: {
    lat: number;
    lng: number;
  };
}

interface ScrapedData {
  slug: string;
  naam: string;
  gemeente: string;
  provincie: string;
  type: string;
  scrapedAt: string;
  searchQuery: string;
  websiteData: {
    url: string | null;
    hasWebsite: boolean;
    openingstijden: any;
    contact: {
      telefoon: string | null;
      email: string | null;
      adres: string | null;
    };
    tarieven: any;
    geschiedenis: string | null;
    faciliteiten: string[];
    parkeren: string | null;
    toegankelijkheid: string | null;
    monumentenbeleid: string | null;
    grafsoorten: string[];
    diensten: string[];
    rawContent: string | null;
  };
  googleData: {
    searchResults: any;
    reviews: {
      rating: number | null;
      totalReviews: number | null;
      recentReviews: any[];
    };
    photos: string[];
    nearbyBegraafplaatsen: any[];
  };
  enrichmentHints: {
    hasHistoricalInfo: boolean;
    hasRates: boolean;
    hasOpeningHours: boolean;
    needsEnrichment: boolean;
  };
}

interface Progress {
  startTime: string;
  lastUpdate: string;
  totalBegraafplaatsen: number;
  completed: number;
  failed: number;
  skipped: number;
  completedSlugs: string[];
  failedSlugs: { slug: string; error: string; timestamp: string }[];
  averageTimePerItem: number;
}

// Initialize progress
let progress: Progress = {
  startTime: new Date().toISOString(),
  lastUpdate: new Date().toISOString(),
  totalBegraafplaatsen: 0,
  completed: 0,
  failed: 0,
  skipped: 0,
  completedSlugs: [],
  failedSlugs: [],
  averageTimePerItem: 0,
};

// Progress bar
const progressBar = new cliProgress.SingleBar({
  format: 'Scraping |{bar}| {percentage}% | {value}/{total} | ETA: {eta_formatted}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

// Create output directory
async function ensureOutputDir() {
  await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
}

// Load existing progress
async function loadProgress(): Promise<void> {
  try {
    const data = await fs.readFile(CONFIG.PROGRESS_FILE, 'utf-8');
    progress = JSON.parse(data);
    console.log(chalk.blue(`📂 Resuming from previous session: ${progress.completed}/${progress.totalBegraafplaatsen} completed`));
  } catch {
    console.log(chalk.yellow('📝 Starting fresh scraping session'));
  }
}

// Save progress
async function saveProgress(): Promise<void> {
  progress.lastUpdate = new Date().toISOString();
  await fs.writeFile(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  attempts: number = CONFIG.RETRY_ATTEMPTS,
  delay: number = CONFIG.RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, attempts - 1, delay * 2);
  }
}

// Bright Data API headers
const getApiHeaders = () => ({
  'Authorization': `Bearer ${CONFIG.API_TOKEN}`,
  'Content-Type': 'application/json',
});

// Scrape website using Bright Data
async function scrapeWebsite(url: string): Promise<any> {
  try {
    const response = await axios.post(
      'https://api.brightdata.com/request',
      {
        url,
        zone: CONFIG.WEB_UNLOCKER_ZONE,
        format: 'raw',
        data_format: 'markdown',
        country: 'nl', // Force Netherlands
      },
      {
        headers: getApiHeaders(),
        timeout: CONFIG.TIMEOUT,
      }
    );

    return {
      content: response.data,
      status: 'success',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Website scraping failed: ${error.response?.data || error.message}`);
  }
}

// Search Google for begraafplaats info
async function searchGoogle(query: string): Promise<any> {
  try {
    const searchUrl = `https://www.google.nl/search?q=${encodeURIComponent(query)}&hl=nl&gl=nl`;

    const response = await axios.post(
      'https://api.brightdata.com/request',
      {
        url: searchUrl,
        zone: CONFIG.WEB_UNLOCKER_ZONE,
        format: 'raw',
        data_format: 'markdown',
        country: 'nl',
      },
      {
        headers: getApiHeaders(),
        timeout: CONFIG.TIMEOUT,
      }
    );

    return {
      results: response.data,
      query,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Google search failed: ${error.response?.data || error.message}`);
  }
}

// Extract structured data from scraped content
function extractStructuredData(
  websiteContent: any,
  searchResults: any,
  begraafplaats: Begraafplaats
): ScrapedData {
  const content = websiteContent?.content || '';
  const searchContent = searchResults?.results || '';

  // Extract opening hours (common patterns)
  const openingstijdenPattern = /openingstijden?:?\s*([^\n]+(?:\n[^\n]+)*)/gi;
  const openingstijdenMatch = content.match(openingstijdenPattern);

  // Extract contact info
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const phonePattern = /(?:tel|telefoon|t):?\s*([\d\s\-\(\)]+)/gi;

  // Extract facilities
  const faciliteitenKeywords = [
    'aula', 'parkeerplaats', 'toilet', 'invalidentoilet',
    'rolstoeltoegankelijk', 'koffiekamer', 'condoleanceruimte',
    'strooiveld', 'urnenmuur', 'columbarium'
  ];

  const faciliteiten = faciliteitenKeywords.filter(keyword =>
    content.toLowerCase().includes(keyword) ||
    searchContent.toLowerCase().includes(keyword)
  );

  // Extract graf types
  const grafsoorten = [];
  const grafTypes = [
    'algemeen graf', 'particulier graf', 'kindergraf',
    'urnengraf', 'urnennis', 'natuurgraf', 'foetussen graf'
  ];

  grafTypes.forEach(type => {
    if (content.toLowerCase().includes(type) || searchContent.toLowerCase().includes(type)) {
      grafsoorten.push(type);
    }
  });

  return {
    slug: begraafplaats.slug,
    naam: begraafplaats.naam,
    gemeente: begraafplaats.gemeente,
    provincie: begraafplaats.provincie,
    type: begraafplaats.type,
    scrapedAt: new Date().toISOString(),
    searchQuery: `${begraafplaats.naam} ${begraafplaats.gemeente} begraafplaats`,
    websiteData: {
      url: begraafplaats.website || null,
      hasWebsite: !!begraafplaats.website && !begraafplaats.website.includes('google.com/maps'),
      openingstijden: openingstijdenMatch ? openingstijdenMatch[0] : null,
      contact: {
        telefoon: begraafplaats.telefoon || content.match(phonePattern)?.[1] || null,
        email: begraafplaats.email || content.match(emailPattern)?.[0] || null,
        adres: begraafplaats.adres || null,
      },
      tarieven: content.toLowerCase().includes('tarief') || content.toLowerCase().includes('prijs')
        ? 'Tariefinformatie gevonden - zie website'
        : null,
      geschiedenis: content.match(/geschiedenis|historie|opgericht|gesticht/i)
        ? 'Historische informatie beschikbaar'
        : null,
      faciliteiten,
      parkeren: content.toLowerCase().includes('parkeer')
        ? 'Parkeerinformatie beschikbaar'
        : null,
      toegankelijkheid: content.toLowerCase().includes('rolstoel') || content.toLowerCase().includes('toegankelijk')
        ? 'Toegankelijkheidsinformatie beschikbaar'
        : null,
      monumentenbeleid: content.toLowerCase().includes('monument')
        ? 'Monumentenbeleid informatie beschikbaar'
        : null,
      grafsoorten,
      diensten: [],
      rawContent: websiteContent?.content || null,
    },
    googleData: {
      searchResults: searchResults?.results || null,
      reviews: {
        rating: null,
        totalReviews: null,
        recentReviews: [],
      },
      photos: [],
      nearbyBegraafplaatsen: [],
    },
    enrichmentHints: {
      hasHistoricalInfo: !!(content.match(/geschiedenis|historie|opgericht|gesticht/i)),
      hasRates: !!(content.toLowerCase().includes('tarief') || content.toLowerCase().includes('prijs')),
      hasOpeningHours: !!openingstijdenMatch,
      needsEnrichment: !begraafplaats.website || faciliteiten.length < 3,
    },
  };
}

// Process single begraafplaats
async function processBegraafplaats(
  begraafplaats: Begraafplaats,
  index: number,
  total: number
): Promise<void> {
  const startTime = Date.now();

  try {
    // Check if already processed
    if (progress.completedSlugs.includes(begraafplaats.slug)) {
      progress.skipped++;
      return;
    }

    let websiteContent = null;
    let searchResults = null;

    // Scrape website if available
    if (begraafplaats.website && !begraafplaats.website.includes('google.com/maps')) {
      try {
        websiteContent = await retryWithBackoff(() => scrapeWebsite(begraafplaats.website!));
      } catch (error: any) {
        console.log(chalk.yellow(`\n⚠️  Website scraping failed for ${begraafplaats.naam}: ${error.message}`));
      }
    }

    // Always search Google for additional info
    const searchQuery = `${begraafplaats.naam} ${begraafplaats.gemeente} begraafplaats openingstijden contact`;
    try {
      searchResults = await retryWithBackoff(() => searchGoogle(searchQuery));
    } catch (error: any) {
      console.log(chalk.yellow(`\n⚠️  Google search failed for ${begraafplaats.naam}: ${error.message}`));
    }

    // Extract and structure data
    const result = extractStructuredData(websiteContent, searchResults, begraafplaats);

    // Save result
    const outputFile = path.join(CONFIG.OUTPUT_DIR, `${begraafplaats.slug}.json`);
    await fs.writeFile(outputFile, JSON.stringify(result, null, 2));

    // Update progress
    progress.completed++;
    progress.completedSlugs.push(begraafplaats.slug);
    const processingTime = Date.now() - startTime;
    progress.averageTimePerItem =
      (progress.averageTimePerItem * (progress.completed - 1) + processingTime) / progress.completed;

    progressBar.update(progress.completed);

  } catch (error: any) {
    progress.failed++;
    progress.failedSlugs.push({
      slug: begraafplaats.slug,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    progressBar.update(progress.completed);
  }
}

// Generate summary report
async function generateSummary(): Promise<void> {
  const summary = {
    generatedAt: new Date().toISOString(),
    statistics: {
      total: progress.totalBegraafplaatsen,
      completed: progress.completed,
      failed: progress.failed,
      skipped: progress.skipped,
      successRate: ((progress.completed / progress.totalBegraafplaatsen) * 100).toFixed(2) + '%',
    },
    coverage: {
      withWebsite: 0,
      withOpeningHours: 0,
      withContactInfo: 0,
      withFacilities: 0,
      withRates: 0,
      needsEnrichment: 0,
    },
    failedItems: progress.failedSlugs,
  };

  // Analyze scraped files for coverage stats
  const files = await fs.readdir(CONFIG.OUTPUT_DIR);
  for (const file of files) {
    if (file.endsWith('.json') && file !== 'progress.json' && file !== 'summary.json') {
      try {
        const data = JSON.parse(await fs.readFile(path.join(CONFIG.OUTPUT_DIR, file), 'utf-8'));
        if (data.websiteData.hasWebsite) summary.coverage.withWebsite++;
        if (data.websiteData.openingstijden) summary.coverage.withOpeningHours++;
        if (data.websiteData.contact.telefoon || data.websiteData.contact.email) summary.coverage.withContactInfo++;
        if (data.websiteData.faciliteiten.length > 0) summary.coverage.withFacilities++;
        if (data.websiteData.tarieven) summary.coverage.withRates++;
        if (data.enrichmentHints.needsEnrichment) summary.coverage.needsEnrichment++;
      } catch (error) {
        // Skip invalid files
      }
    }
  }

  await fs.writeFile(CONFIG.SUMMARY_FILE, JSON.stringify(summary, null, 2));
}

// Main function
async function main() {
  console.log(chalk.bold.blue('\n🪦 Begraafplaatsen Bright Data Scraper\n'));
  console.log(chalk.gray(`Using existing API token from vindtandarts.nl setup`));

  // Ensure output directory exists
  await ensureOutputDir();

  // Load progress
  await loadProgress();

  // Load begraafplaatsen data
  const dataFile = path.join(__dirname, '..', 'public', 'data', 'cemeteries.json');
  let begraafplaatsen: Begraafplaats[];

  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    begraafplaatsen = JSON.parse(data);
  } catch (error) {
    console.error(chalk.red('❌ Could not load cemeteries.json'));
    console.error('Make sure you have run the data build process first');
    process.exit(1);
  }

  const totalBegraafplaatsen = begraafplaatsen.length;
  progress.totalBegraafplaatsen = totalBegraafplaatsen;

  console.log(chalk.bold(`📊 Total begraafplaatsen to process: ${totalBegraafplaatsen}`));
  console.log(chalk.bold(`⚡ Concurrency: ${CONFIG.CONCURRENCY} parallel requests\n`));

  // Initialize progress bar
  progressBar.start(totalBegraafplaatsen, progress.completed);

  // Create rate limiter
  const limit = pLimit(CONFIG.CONCURRENCY);

  // Process start time
  const processStartTime = Date.now();

  // Save progress periodically
  const progressInterval = setInterval(async () => {
    await saveProgress();
  }, 10000); // Every 10 seconds

  // Process all begraafplaatsen
  const tasks = begraafplaatsen.map((begraafplaats, index) =>
    limit(() => processBegraafplaats(begraafplaats, index, totalBegraafplaatsen))
  );

  await Promise.all(tasks);

  // Stop progress bar
  progressBar.stop();
  clearInterval(progressInterval);

  // Final save
  await saveProgress();
  await generateSummary();

  // Calculate total time
  const totalTime = Date.now() - processStartTime;
  const totalMinutes = totalTime / 60000;

  // Final report
  console.log('\n' + chalk.bold.green('='.repeat(60)));
  console.log(chalk.bold.green('✅ SCRAPING COMPLETE'));
  console.log(chalk.bold.green('='.repeat(60)));
  console.log(chalk.white(`Total begraafplaatsen: ${totalBegraafplaatsen}`));
  console.log(chalk.green(`Successful: ${progress.completed}`));
  console.log(chalk.yellow(`Skipped: ${progress.skipped}`));
  console.log(chalk.red(`Failed: ${progress.failed}`));
  console.log(chalk.blue(`Total time: ${totalMinutes.toFixed(1)} minutes`));
  console.log(chalk.cyan(`Average time per item: ${(progress.averageTimePerItem / 1000).toFixed(1)}s`));
  console.log(chalk.magenta(`\n📄 Summary report saved to: ${CONFIG.SUMMARY_FILE}`));
  console.log(chalk.bold.green('='.repeat(60)));

  // Show failed items if any
  if (progress.failedSlugs.length > 0) {
    console.log(chalk.red('\n❌ Failed items:'));
    progress.failedSlugs.forEach(({ slug, error }) => {
      console.log(chalk.red(`  - ${slug}: ${error}`));
    });
    console.log(chalk.yellow('\nTip: Run the script again to retry failed items'));
  }
}

// Run the scraper
main().catch(error => {
  console.error(chalk.red('\n❌ Fatal error:'), error);
  progressBar.stop();
  process.exit(1);
});