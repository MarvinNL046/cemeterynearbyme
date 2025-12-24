#!/usr/bin/env node
/**
 * Complete Scraping Script voor ALLE Begraafplaatsen
 * Scraped websites waar mogelijk, maakt entries voor alle begraafplaatsen
 */

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import pLimit from 'p-limit';
import chalk from 'chalk';
import { config } from 'dotenv';

// Load Bright Data credentials
config({ path: path.join(__dirname, '..', '.env.brightdata') });

const CONFIG = {
  API_TOKEN: process.env.BRIGHTDATA_API_TOKEN,
  ZONE: process.env.BRIGHTDATA_ZONE || 'mcp_unlocker',
  CONCURRENCY: parseInt(process.env.SCRAPE_CONCURRENCY || '10'),
  RETRY_ATTEMPTS: parseInt(process.env.SCRAPE_RETRY_ATTEMPTS || '3'),
  TIMEOUT: parseInt(process.env.SCRAPE_TIMEOUT || '30000'),
};

// Validate configuration
if (!CONFIG.API_TOKEN) {
  console.error(chalk.red('Error: BRIGHTDATA_API_TOKEN not found in .env.brightdata'));
  process.exit(1);
}

interface BegraafplaatsData {
  naam: string;
  gemeente: string;
  provincie: string;
  type?: string;
  website?: string;
  adres?: string;
  postcode?: string;
  telefoon?: string;
  email?: string;
  slug?: string;
  gps_coordinaten?: string;
  rating?: string;
  reviews?: string;
  photo?: string;
  openingstijden?: string;
  beschrijving?: string;
}

interface ScrapedContent {
  url?: string;
  success: boolean;
  hasWebsite: boolean;
  content?: {
    titel?: string;
    geschiedenis?: string;
    faciliteiten?: string;
    diensten?: string;
    openingstijden?: string;
    contact?: string;
    bereikbaarheid?: string;
    tarieven?: string;
    reglement?: string;
    monumenten?: string;
    actualText?: string;
  };
  error?: string;
  scrapedAt: string;
  responseTime?: number;
}

const axiosInstance = axios.create({
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Authorization': `Bearer ${CONFIG.API_TOKEN}`,
    'Content-Type': 'application/json',
  }
});

async function scrapeWebsite(url: string, retryCount = 0): Promise<ScrapedContent> {
  const startTime = Date.now();
  
  try {
    console.log(chalk.blue(`Scraping: ${url}`));
    
    const response = await axiosInstance.post(
      'https://api.brightdata.com/dca/dataset/v3',
      {
        url,
        zone: CONFIG.ZONE,
        format: 'raw',
        country: 'nl',
        render: true,
        block_resources: false,
        premium_proxy: true,
        serp: {
          parse: true,
          advanced_parsing: true
        }
      }
    );

    const responseTime = Date.now() - startTime;
    const html = response.data.html || response.data;
    
    // Extract content using regex patterns
    const content: any = {
      actualText: html.substring(0, 10000), // Store first 10k chars for analysis
    };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) content.titel = titleMatch[1].trim();

    // Common patterns for cemetery information
    const patterns = {
      geschiedenis: /(?:geschiedenis|historie|opgericht|ontstaan)[\s\S]{0,1000}/gi,
      openingstijden: /(?:openingstijd|geopend|open|bezoektijd)[\s\S]{0,500}/gi,
      diensten: /(?:diensten|service|begrafenis|crematie|uitvaart)[\s\S]{0,1000}/gi,
      faciliteiten: /(?:faciliteiten|voorzieningen|aula|parkeren)[\s\S]{0,800}/gi,
      contact: /(?:contact|telefoon|email|adres)[\s\S]{0,500}/gi,
      bereikbaarheid: /(?:bereikbaar|route|parkeer|openbaar vervoer)[\s\S]{0,500}/gi,
      tarieven: /(?:tarief|tarieven|kosten|prijs|prijzen)[\s\S]{0,500}/gi,
      monumenten: /(?:monument|oorlogsgraven|historisch|bijzonder)[\s\S]{0,500}/gi,
    };

    // Extract content for each pattern
    for (const [key, pattern] of Object.entries(patterns)) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        // Clean HTML tags and normalize whitespace
        content[key] = matches[0]
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 500);
      }
    }

    console.log(chalk.green(`✓ Success: ${url} (${responseTime}ms)`));
    
    return {
      url,
      success: true,
      hasWebsite: true,
      content,
      scrapedAt: new Date().toISOString(),
      responseTime
    };

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    if (retryCount < CONFIG.RETRY_ATTEMPTS) {
      console.log(chalk.yellow(`⟳ Retrying ${url} (attempt ${retryCount + 1}/${CONFIG.RETRY_ATTEMPTS})`));
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return scrapeWebsite(url, retryCount + 1);
    }

    console.error(chalk.red(`✗ Failed: ${url} - ${error.message}`));
    
    return {
      url,
      success: false,
      hasWebsite: true,
      error: error.response?.data?.message || error.message,
      scrapedAt: new Date().toISOString(),
      responseTime
    };
  }
}

async function createEmptyEntry(begraafplaats: BegraafplaatsData): Promise<ScrapedContent> {
  console.log(chalk.gray(`📝 Creating entry for: ${begraafplaats.naam} (no website)`));
  
  return {
    success: true,
    hasWebsite: false,
    content: {
      titel: begraafplaats.naam,
      geschiedenis: '',
      faciliteiten: '',
      diensten: '',
      openingstijden: begraafplaats.openingstijden || '',
      contact: [
        begraafplaats.telefoon ? `Telefoon: ${begraafplaats.telefoon}` : '',
        begraafplaats.adres ? `Adres: ${begraafplaats.adres}` : '',
        begraafplaats.postcode ? `Postcode: ${begraafplaats.postcode}` : ''
      ].filter(Boolean).join(', '),
      bereikbaarheid: begraafplaats.gps_coordinaten ? `GPS: ${begraafplaats.gps_coordinaten}` : '',
      tarieven: '',
      monumenten: '',
      actualText: begraafplaats.beschrijving || ''
    },
    scrapedAt: new Date().toISOString()
  };
}

async function main() {
  console.log(chalk.bold.cyan('\n=== Complete Begraafplaats Scraping (All Cemeteries) ==='));
  console.log(chalk.gray(`API Token: ${CONFIG.API_TOKEN?.substring(0, 10) || 'Not set'}...`));
  console.log(chalk.gray(`Concurrent requests: ${CONFIG.CONCURRENCY}`));
  console.log(chalk.gray(`Zone: ${CONFIG.ZONE}\n`));

  // Load cemetery data
  const dataPath = path.join(__dirname, '..', 'data', 'begraafplaatsen.json');
  if (!fs.existsSync(dataPath)) {
    console.error(chalk.red('Error: begraafplaatsen.json not found'));
    console.log(chalk.yellow('Run: npx ts-node scripts/csv-to-json.ts'));
    process.exit(1);
  }

  const begraafplaatsen: Record<string, BegraafplaatsData> = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
  );

  const totalCemeteries = Object.keys(begraafplaatsen).length;
  console.log(chalk.bold(`Found ${totalCemeteries} total cemeteries`));

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'data', 'scraped-begraafplaatsen');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check existing scraped files
  const existingFiles = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
  
  console.log(chalk.green(`Already scraped: ${existingFiles.length} cemeteries`));

  // Progress tracking
  const progressFile = path.join(__dirname, '..', 'data', 'progress-logs', 'complete-scraping-progress.json');
  const progressDir = path.dirname(progressFile);
  if (!fs.existsSync(progressDir)) {
    fs.mkdirSync(progressDir, { recursive: true });
  }

  let progress: any = { 
    completed: existingFiles, 
    failed: [], 
    noWebsite: [],
    totalTime: 0,
    lastUpdated: new Date().toISOString()
  };
  
  if (fs.existsSync(progressFile)) {
    const savedProgress = JSON.parse(fs.readFileSync(progressFile, 'utf-8'));
    progress = { ...savedProgress, completed: [...new Set([...savedProgress.completed, ...existingFiles])] };
  }

  // Filter out already completed
  const toProcess = Object.entries(begraafplaatsen)
    .filter(([slug, _]) => !progress.completed.includes(slug))
    .map(([slug, data]) => ({ ...data, slug }));

  if (toProcess.length === 0) {
    console.log(chalk.green('✅ All cemeteries already processed!'));
    console.log(chalk.blue(`Total with websites: ${progress.completed.filter((s: string) => !progress.noWebsite.includes(s)).length}`));
    console.log(chalk.gray(`Total without websites: ${progress.noWebsite.length}`));
    return;
  }

  console.log(chalk.bold(`\n${toProcess.length} cemeteries to process`));

  // Separate cemeteries with and without websites
  const withWebsites = toProcess.filter(b => b.website && b.website.startsWith('http'));
  const withoutWebsites = toProcess.filter(b => !b.website || !b.website.startsWith('http'));

  console.log(chalk.blue(`  - ${withWebsites.length} with websites to scrape`));
  console.log(chalk.gray(`  - ${withoutWebsites.length} without websites (will create entries)\n`));

  // Rate limiting
  const limit = pLimit(CONFIG.CONCURRENCY);
  let completed = 0;
  let failed = 0;
  let noWebsiteCount = 0;

  // First, process all without websites (fast)
  if (withoutWebsites.length > 0) {
    console.log(chalk.bold.gray('\nCreating entries for cemeteries without websites...'));
    
    for (const begraafplaats of withoutWebsites) {
      if (!begraafplaats.slug) continue;

      const result = await createEmptyEntry(begraafplaats);
      
      // Save result
      const outputPath = path.join(outputDir, `${begraafplaats.slug}.json`);
      fs.writeFileSync(outputPath, JSON.stringify({
        begraafplaats,
        scraped: result
      }, null, 2));

      noWebsiteCount++;
      progress.completed.push(begraafplaats.slug);
      progress.noWebsite.push(begraafplaats.slug);
      
      // Update progress periodically
      if (noWebsiteCount % 100 === 0) {
        fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
        console.log(chalk.gray(`Progress: ${noWebsiteCount}/${withoutWebsites.length} entries created`));
      }
    }
    
    console.log(chalk.green(`✓ Created ${noWebsiteCount} entries for cemeteries without websites`));
  }

  // Then process cemeteries with websites
  if (withWebsites.length > 0) {
    console.log(chalk.bold.blue('\nScraping cemeteries with websites...'));
    
    // Process in batches
    const batchSize = 20;
    for (let i = 0; i < withWebsites.length; i += batchSize) {
      const batch = withWebsites.slice(i, i + batchSize);
      console.log(chalk.bold.blue(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(withWebsites.length/batchSize)}`));

      const promises = batch.map(begraafplaats => 
        limit(async () => {
          if (!begraafplaats.website || !begraafplaats.slug) return;

          const result = await scrapeWebsite(begraafplaats.website);
          
          // Save result
          const outputPath = path.join(outputDir, `${begraafplaats.slug}.json`);
          fs.writeFileSync(outputPath, JSON.stringify({
            begraafplaats,
            scraped: result
          }, null, 2));

          if (result.success) {
            completed++;
            progress.completed.push(begraafplaats.slug);
            progress.totalTime += result.responseTime || 0;
          } else {
            failed++;
            progress.failed.push({ slug: begraafplaats.slug, error: result.error });
          }

          // Update progress
          fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
        })
      );

      await Promise.all(promises);
      
      console.log(chalk.gray(`Progress: ${completed} scraped, ${failed} failed`));
      
      // Pause between batches
      if (i + batchSize < withWebsites.length) {
        console.log(chalk.gray('Pausing between batches...'));
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  // Final report
  console.log(chalk.bold.green('\n=== Complete Scraping Report ==='));
  console.log(chalk.green(`✓ Total processed: ${progress.completed.length}/${totalCemeteries}`));
  console.log(chalk.blue(`  - Websites scraped: ${completed}`));
  console.log(chalk.gray(`  - No website entries: ${noWebsiteCount}`));
  console.log(chalk.yellow(`  - Already existed: ${existingFiles.length}`));
  console.log(chalk.red(`  - Failed: ${failed}`));
  
  if (completed > 0) {
    console.log(chalk.blue(`⏱ Average response time: ${Math.round(progress.totalTime / completed)}ms`));
  }
  
  console.log(chalk.gray(`\nAll data saved to: ${outputDir}`));
  console.log(chalk.bold.green(`\n✅ Ready for enrichment! All ${totalCemeteries} cemeteries have entries.`));
}

// Run the script
main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});