/**
 * US Cemetery Scraper via Jina.ai Reader API
 *
 * This script scrapes cemetery data from various US cemetery directories:
 * - interment.net (cemetery records)
 * - billiongraves.com (cemetery data)
 *
 * Purpose: Get additional historical/descriptive content that GPT can use
 * to write unique "About" sections for each cemetery page.
 *
 * Pipeline:
 * 1. Bright Data SERP → Base cemetery data (location, ratings, photos)
 * 2. Jina.ai → Extra content (history, descriptions, burial counts)
 * 3. OpenAI GPT → Generate unique "About" sections
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import 'dotenv/config';

// Jina.ai API configuration
const JINA_API_KEY = process.env.JINA_API_KEY || '';
const JINA_READER_URL = 'https://r.jina.ai/';

if (!JINA_API_KEY) {
  console.error('❌ JINA_API_KEY not found in environment variables');
  process.exit(1);
}

// US States with their abbreviations
const US_STATES = [
  { name: 'Alabama', abbrev: 'AL' },
  { name: 'Alaska', abbrev: 'AK' },
  { name: 'Arizona', abbrev: 'AZ' },
  { name: 'Arkansas', abbrev: 'AR' },
  { name: 'California', abbrev: 'CA' },
  { name: 'Colorado', abbrev: 'CO' },
  { name: 'Connecticut', abbrev: 'CT' },
  { name: 'Delaware', abbrev: 'DE' },
  { name: 'Florida', abbrev: 'FL' },
  { name: 'Georgia', abbrev: 'GA' },
  { name: 'Hawaii', abbrev: 'HI' },
  { name: 'Idaho', abbrev: 'ID' },
  { name: 'Illinois', abbrev: 'IL' },
  { name: 'Indiana', abbrev: 'IN' },
  { name: 'Iowa', abbrev: 'IA' },
  { name: 'Kansas', abbrev: 'KS' },
  { name: 'Kentucky', abbrev: 'KY' },
  { name: 'Louisiana', abbrev: 'LA' },
  { name: 'Maine', abbrev: 'ME' },
  { name: 'Maryland', abbrev: 'MD' },
  { name: 'Massachusetts', abbrev: 'MA' },
  { name: 'Michigan', abbrev: 'MI' },
  { name: 'Minnesota', abbrev: 'MN' },
  { name: 'Mississippi', abbrev: 'MS' },
  { name: 'Missouri', abbrev: 'MO' },
  { name: 'Montana', abbrev: 'MT' },
  { name: 'Nebraska', abbrev: 'NE' },
  { name: 'Nevada', abbrev: 'NV' },
  { name: 'New Hampshire', abbrev: 'NH' },
  { name: 'New Jersey', abbrev: 'NJ' },
  { name: 'New Mexico', abbrev: 'NM' },
  { name: 'New York', abbrev: 'NY' },
  { name: 'North Carolina', abbrev: 'NC' },
  { name: 'North Dakota', abbrev: 'ND' },
  { name: 'Ohio', abbrev: 'OH' },
  { name: 'Oklahoma', abbrev: 'OK' },
  { name: 'Oregon', abbrev: 'OR' },
  { name: 'Pennsylvania', abbrev: 'PA' },
  { name: 'Rhode Island', abbrev: 'RI' },
  { name: 'South Carolina', abbrev: 'SC' },
  { name: 'South Dakota', abbrev: 'SD' },
  { name: 'Tennessee', abbrev: 'TN' },
  { name: 'Texas', abbrev: 'TX' },
  { name: 'Utah', abbrev: 'UT' },
  { name: 'Vermont', abbrev: 'VT' },
  { name: 'Virginia', abbrev: 'VA' },
  { name: 'Washington', abbrev: 'WA' },
  { name: 'West Virginia', abbrev: 'WV' },
  { name: 'Wisconsin', abbrev: 'WI' },
  { name: 'Wyoming', abbrev: 'WY' },
  { name: 'District of Columbia', abbrev: 'DC' },
  { name: 'Puerto Rico', abbrev: 'PR' },
];

interface CemeteryBasic {
  name: string;
  city: string;
  county?: string;
  state: string;
  stateAbbrev: string;
  url: string;
  source: string;
}

interface CemeteryDetail extends CemeteryBasic {
  address?: string;
  zipCode?: string;
  type?: string;
  established?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  website?: string;
  description?: string;
  history?: string;
  burialCount?: number;
  photoUrl?: string;
  rawContent?: string; // For GPT enrichment
}

interface ScrapeProgress {
  lastState: string;
  lastSource: string;
  lastIndex: number;
  completedStates: string[];
  totalScraped: number;
  timestamp: string;
}

// Rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with Jina.ai Reader
async function fetchWithJina(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log('   Fetching:', url.substring(0, 80) + (url.length > 80 ? '...' : ''));

      const response = await fetch(JINA_READER_URL + url, {
        headers: {
          'Authorization': 'Bearer ' + JINA_API_KEY,
          'Accept': 'text/plain',
          'X-Return-Format': 'text'
        }
      });

      if (!response.ok) {
        throw new Error('Jina fetch failed: ' + response.status + ' ' + response.statusText);
      }

      const text = await response.text();
      console.log('   Received ' + text.length + ' characters');
      return text;
    } catch (error) {
      if (attempt === retries) throw error;
      console.log('   Attempt ' + attempt + ' failed, retrying...');
      await delay(2000 * attempt);
    }
  }
  throw new Error('Max retries exceeded');
}

// Parse interment.net state page
function parseIntermentStatePage(content: string, state: { name: string; abbrev: string }): CemeteryBasic[] {
  const cemeteries: CemeteryBasic[] = [];

  // Look for cemetery links in markdown format
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/www\.interment\.net\/data\/us\/[^)]+)\)/g;

  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    const name = match[1].trim();
    const url = match[2];

    // Extract county from URL path
    const pathMatch = url.match(/\/us\/[^/]+\/([^/]+)\//);
    const county = pathMatch
      ? pathMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : undefined;

    // Skip navigation links
    if (name.toLowerCase().includes('back to') || name.toLowerCase().includes('index')) {
      continue;
    }

    cemeteries.push({
      name,
      city: '',
      county,
      state: state.name,
      stateAbbrev: state.abbrev,
      url,
      source: 'interment.net'
    });
  }

  return cemeteries;
}

// Parse interment.net detail page for extra content
function parseIntermentDetailPage(content: string, basic: CemeteryBasic): CemeteryDetail {
  const detail: CemeteryDetail = { ...basic };

  // Store raw content for GPT enrichment (trimmed to reasonable size)
  detail.rawContent = content.substring(0, 3000);

  // Location extraction
  const locationMatch = content.match(/Location[:\s]+([^\n]+)/i);
  if (locationMatch) {
    const loc = locationMatch[1].trim();
    const cityMatch = loc.match(/^([^,]+),?\s*(?:County)?/i);
    if (cityMatch) {
      detail.city = cityMatch[1].trim();
    }
  }

  // County extraction
  const countyMatch = content.match(/(?:County|Parish)[:\s]+([^\n,]+)/i);
  if (countyMatch) {
    detail.county = countyMatch[1].trim();
  }

  // GPS coordinates
  const gpsMatch = content.match(/GPS[:\s]+(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/i);
  if (gpsMatch) {
    detail.coordinates = {
      latitude: parseFloat(gpsMatch[1]),
      longitude: parseFloat(gpsMatch[2])
    };
  }

  // Burial count
  const burialMatch = content.match(/(\d{1,3}(?:,\d{3})*)\s+(?:burials?|records?|graves?)/i);
  if (burialMatch) {
    detail.burialCount = parseInt(burialMatch[1].replace(/,/g, ''));
  }

  // Year established
  const yearMatch = content.match(/(?:established|founded|created)[:\s]+(\d{4})/i);
  if (yearMatch) {
    detail.established = yearMatch[1];
  }

  // Historical description - look for substantial text
  const lines = content.split('\n').filter(line =>
    line.length > 100 &&
    !line.startsWith('[') &&
    !line.startsWith('http') &&
    !line.includes('Navigation')
  );
  if (lines.length > 0) {
    detail.history = lines.slice(0, 3).join(' ').substring(0, 1000);
  }

  return detail;
}

// Progress management
function getOutputDir(): string {
  return path.join(__dirname, '../../data/scraped-cemeteries');
}

function loadProgress(): ScrapeProgress {
  const progressPath = path.join(getOutputDir(), 'progress.json');

  if (fs.existsSync(progressPath)) {
    return JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
  }

  return {
    lastState: '',
    lastSource: '',
    lastIndex: 0,
    completedStates: [],
    totalScraped: 0,
    timestamp: new Date().toISOString()
  };
}

function saveProgress(progress: ScrapeProgress): void {
  const outputDir = getOutputDir();
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const progressPath = path.join(outputDir, 'progress.json');
  progress.timestamp = new Date().toISOString();
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

function saveStateData(state: string, source: string, data: CemeteryDetail[]): void {
  const outputDir = getOutputDir();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = state.toLowerCase().replace(/\s+/g, '-') + '-' + source.replace(/\./g, '-') + '.json';
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log('Saved ' + data.length + ' cemeteries for ' + state + ' (' + source + ')');
}

function combineAllData(): void {
  const outputDir = getOutputDir();
  const allData: CemeteryDetail[] = [];

  if (!fs.existsSync(outputDir)) {
    console.log('No data to combine yet');
    return;
  }

  const files = fs.readdirSync(outputDir).filter(f =>
    f.endsWith('.json') &&
    f !== 'progress.json' &&
    f !== 'all-cemeteries.json' &&
    f !== 'summary.json'
  );

  for (const file of files) {
    const filePath = path.join(outputDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    allData.push(...data);
  }

  // Remove duplicates by URL
  const unique = Array.from(new Map(allData.map(c => [c.url, c])).values());

  // Save combined data
  const combinedPath = path.join(outputDir, 'all-cemeteries.json');
  fs.writeFileSync(combinedPath, JSON.stringify(unique, null, 2));

  console.log('\nTotal: ' + unique.length + ' unique cemeteries combined');

  // Create summary
  const summary: Record<string, unknown> = {
    total: unique.length,
    byState: {} as Record<string, number>,
    bySource: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    withAddress: unique.filter(c => c.address).length,
    withCoordinates: unique.filter(c => c.coordinates).length,
    withBurialCount: unique.filter(c => c.burialCount).length,
    withHistory: unique.filter(c => c.history).length,
    lastUpdated: new Date().toISOString()
  };

  const byState = summary.byState as Record<string, number>;
  const bySource = summary.bySource as Record<string, number>;
  const byType = summary.byType as Record<string, number>;

  for (const cemetery of unique) {
    byState[cemetery.state] = (byState[cemetery.state] || 0) + 1;
    bySource[cemetery.source] = (bySource[cemetery.source] || 0) + 1;
    if (cemetery.type) {
      byType[cemetery.type] = (byType[cemetery.type] || 0) + 1;
    }
  }

  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log('Summary saved to ' + summaryPath);
}

// Main scraping function for interment.net
async function scrapeInterment(states: typeof US_STATES, progress: ScrapeProgress): Promise<void> {
  console.log('\nScraping interment.net...\n');

  for (const state of states) {
    const stateKey = state.abbrev + '-interment';

    if (progress.completedStates.includes(stateKey)) {
      console.log('Skipping ' + state.name + ' (already completed)');
      continue;
    }

    console.log('\nScraping ' + state.name + '...');

    try {
      // interment.net uses lowercase state names with hyphens
      const statePath = state.name.toLowerCase().replace(/\s+/g, '-');
      const stateUrl = 'http://www.interment.net/data/us/' + statePath + '/index.htm';

      const stateContent = await fetchWithJina(stateUrl);
      await delay(1500);

      const cemeteries = parseIntermentStatePage(stateContent, state);
      console.log('   Found: ' + cemeteries.length + ' cemeteries');

      if (cemeteries.length === 0) {
        console.log('   No cemeteries found, skipping');
        progress.completedStates.push(stateKey);
        saveProgress(progress);
        continue;
      }

      const detailedCemeteries: CemeteryDetail[] = [];

      // Limit to first 30 per state to avoid timeout
      const maxDetails = 30;
      const toFetch = cemeteries.slice(0, maxDetails);

      for (let i = 0; i < toFetch.length; i++) {
        const cemetery = toFetch[i];

        try {
          console.log('   [' + (i + 1) + '/' + toFetch.length + '] ' + cemetery.name);

          const detailContent = await fetchWithJina(cemetery.url);
          const detail = parseIntermentDetailPage(detailContent, cemetery);
          detailedCemeteries.push(detail);

          progress.totalScraped++;

          if (i % 10 === 0) {
            saveProgress(progress);
          }

          await delay(800);

        } catch (error) {
          console.error('   Error fetching ' + cemetery.name + ': ' + error);
          detailedCemeteries.push({ ...cemetery });
        }
      }

      // Add remaining without details
      for (let i = maxDetails; i < cemeteries.length; i++) {
        detailedCemeteries.push({ ...cemeteries[i] });
      }

      saveStateData(state.name, 'interment.net', detailedCemeteries);

      progress.completedStates.push(stateKey);
      saveProgress(progress);

      console.log('Completed ' + state.name + ': ' + detailedCemeteries.length + ' cemeteries');

      await delay(2000);

    } catch (error) {
      console.error('Error with ' + state.name + ': ' + error);
      saveProgress(progress);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  console.log('US Cemetery Scraper via Jina.ai\n');
  console.log('Purpose: Gather extra content for GPT enrichment\n');

  let source = 'interment';
  let statesToScrape = US_STATES;
  let testMode = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) {
      source = args[i + 1];
      i++;
    } else if (args[i] === '--state' && args[i + 1]) {
      const stateArg = args[i + 1].toUpperCase();
      const found = US_STATES.find(s => s.abbrev === stateArg || s.name.toUpperCase() === stateArg);
      if (found) {
        statesToScrape = [found];
      } else {
        console.error('Unknown state: ' + args[i + 1]);
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--test') {
      testMode = true;
      statesToScrape = US_STATES.slice(0, 3);
    } else if (args[i] === '--help') {
      console.log(`
Usage: npx tsx scripts/scraping/scrape-us-cemeteries.ts [options]

Options:
  --source <name>    Source to scrape (interment)
  --state <abbrev>   Scrape specific state (e.g., TX, CA)
  --test             Test mode - only first 3 states
  --resume           Resume from last saved position
  --help             Show this help message

Examples:
  npx tsx scripts/scraping/scrape-us-cemeteries.ts --test
  npx tsx scripts/scraping/scrape-us-cemeteries.ts --state TX
  npx tsx scripts/scraping/scrape-us-cemeteries.ts --resume
      `);
      process.exit(0);
    }
  }

  if (testMode) {
    console.log('Test mode: scraping first 3 states only\n');
  }

  console.log('Source: ' + source);
  console.log('States to scrape: ' + statesToScrape.length);
  console.log('');

  const progress = loadProgress();

  if (source === 'interment') {
    await scrapeInterment(statesToScrape, progress);
  } else {
    console.log('Unknown source: ' + source);
  }

  console.log('\nCombining all data...');
  combineAllData();

  console.log('\nScraping completed!');
}

main().catch(console.error);
