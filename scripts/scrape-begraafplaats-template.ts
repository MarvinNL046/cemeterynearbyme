#!/usr/bin/env node
/**
 * Web Scraping Script voor Begraafplaatsen
 * Gebaseerd op vindtandarts.nl scraping model
 * Gebruikt Bright Data Web Unlocker voor betrouwbare scraping
 */

import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
import pLimit from 'p-limit';

// Configuration
const BRIGHT_DATA_USERNAME = process.env.BRIGHT_DATA_USERNAME || 'your_username';
const BRIGHT_DATA_PASSWORD = process.env.BRIGHT_DATA_PASSWORD || 'your_password';
const CONCURRENT_REQUESTS = 15; // Optimale snelheid zonder overbelasting

// Bright Data Web Unlocker endpoint
const BRIGHT_DATA_URL = 'https://api.brightdata.com/dca/dataset/v3';

interface BegraafplaatsData {
  naam: string;
  gemeente: string;
  provincie: string;
  type: string;
  website?: string;
  slug: string;
  adres?: string;
  telefoon?: string;
}

interface ScrapedContent {
  url: string;
  success: boolean;
  content?: {
    geschiedenis?: string;
    faciliteiten?: string;
    diensten?: string;
    openingstijden?: string;
    contact?: string;
    bereikbaarheid?: string;
    tarieven?: string;
  };
  error?: string;
  scrapedAt: string;
}

/**
 * Extract relevant content from HTML
 */
function extractBegraafplaatsContent(html: string): ScrapedContent['content'] {
  // Remove scripts and styles
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Extract text content
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  
  // Look for specific content patterns
  const content: ScrapedContent['content'] = {};
  
  // Geschiedenis patterns
  const geschiedenisPatterns = [
    /geschiedenis[\s\S]{0,500}/i,
    /historie[\s\S]{0,500}/i,
    /opgericht[\s\S]{0,300}/i,
    /sinds\s+\d{4}[\s\S]{0,300}/i
  ];
  
  for (const pattern of geschiedenisPatterns) {
    const match = text.match(pattern);
    if (match) {
      content.geschiedenis = match[0].substring(0, 500);
      break;
    }
  }
  
  // Faciliteiten patterns
  const faciliteitenPatterns = [
    /faciliteiten[\s\S]{0,500}/i,
    /voorzieningen[\s\S]{0,500}/i,
    /aula[\s\S]{0,300}/i,
    /parkeer[\s\S]{0,300}/i
  ];
  
  for (const pattern of faciliteitenPatterns) {
    const match = text.match(pattern);
    if (match) {
      content.faciliteiten = match[0].substring(0, 500);
      break;
    }
  }
  
  // Diensten patterns
  const dienstenPatterns = [
    /diensten[\s\S]{0,500}/i,
    /begrafenis[\s\S]{0,500}/i,
    /crematie[\s\S]{0,500}/i,
    /uitvaart[\s\S]{0,500}/i
  ];
  
  for (const pattern of dienstenPatterns) {
    const match = text.match(pattern);
    if (match) {
      content.diensten = match[0].substring(0, 500);
      break;
    }
  }
  
  // Openingstijden
  const openingstijdenPatterns = [
    /openingstijden[\s\S]{0,300}/i,
    /geopend[\s\S]{0,300}/i,
    /bezoektijden[\s\S]{0,300}/i,
    /maandag\s*t\/m[\s\S]{0,200}/i
  ];
  
  for (const pattern of openingstijdenPatterns) {
    const match = text.match(pattern);
    if (match) {
      content.openingstijden = match[0].substring(0, 300);
      break;
    }
  }
  
  // Contact
  const contactMatch = text.match(/contact[\s\S]{0,400}/i);
  if (contactMatch) {
    content.contact = contactMatch[0].substring(0, 400);
  }
  
  // Bereikbaarheid
  const bereikbaarheidMatch = text.match(/bereikbaarheid[\s\S]{0,400}/i) || 
                              text.match(/route[\s\S]{0,400}/i) ||
                              text.match(/parkeren[\s\S]{0,400}/i);
  if (bereikbaarheidMatch) {
    content.bereikbaarheid = bereikbaarheidMatch[0].substring(0, 400);
  }
  
  // Tarieven
  const tarievenMatch = text.match(/tarieven[\s\S]{0,400}/i) || 
                        text.match(/kosten[\s\S]{0,400}/i) ||
                        text.match(/prijzen[\s\S]{0,400}/i);
  if (tarievenMatch) {
    content.tarieven = tarievenMatch[0].substring(0, 400);
  }
  
  return content;
}

/**
 * Scrape a single cemetery website using Bright Data
 */
async function scrapeBegraafplaatsWebsite(url: string): Promise<ScrapedContent> {
  try {
    const response = await fetch(`${BRIGHT_DATA_URL}?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${BRIGHT_DATA_USERNAME}:${BRIGHT_DATA_PASSWORD}`).toString('base64')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const content = extractBegraafplaatsContent(html);
    
    return {
      url,
      success: true,
      content,
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      url,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      scrapedAt: new Date().toISOString()
    };
  }
}

/**
 * Main processing function
 */
async function main() {
  console.log('=== Begraafplaats Web Scraping Script ===');
  console.log(`Concurrent requests: ${CONCURRENT_REQUESTS}`);
  console.log();
  
  // Load cemetery data
  const dataPath = path.join(__dirname, '..', 'data', 'begraafplaatsen.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`Error: ${dataPath} not found`);
    console.error('First, create a JSON file with cemetery data');
    process.exit(1);
  }
  
  const begraafplaatsen: Record<string, BegraafplaatsData> = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
  );
  
  // Filter cemeteries with websites
  const withWebsites = Object.entries(begraafplaatsen)
    .filter(([_, data]) => data.website && data.website.startsWith('http'))
    .map(([slug, data]) => ({ ...data, slug }));
  
  console.log(`Found ${Object.keys(begraafplaatsen).length} cemeteries`);
  console.log(`${withWebsites.length} have websites to scrape`);
  console.log();
  
  // Create output directory
  const outputDir = path.join(__dirname, '..', 'data', 'scraped-begraafplaatsen');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Track progress
  let processed = 0;
  let successful = 0;
  let failed = 0;
  
  // Create rate limiter
  const limit = pLimit(CONCURRENT_REQUESTS);
  
  // Process in batches
  const batchSize = 50;
  for (let i = 0; i < withWebsites.length; i += batchSize) {
    const batch = withWebsites.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1} (${i + 1}-${Math.min(i + batchSize, withWebsites.length)} of ${withWebsites.length})`);
    
    const promises = batch.map(cemetery => 
      limit(async () => {
        const outputPath = path.join(outputDir, `${cemetery.slug}.json`);
        
        // Skip if already scraped
        if (fs.existsSync(outputPath)) {
          console.log(`✓ Skipping ${cemetery.slug} - already scraped`);
          processed++;
          successful++;
          return;
        }
        
        console.log(`Scraping ${cemetery.slug}...`);
        const result = await scrapeBegraafplaatsWebsite(cemetery.website!);
        
        // Save result
        fs.writeFileSync(outputPath, JSON.stringify({
          ...cemetery,
          scraped: result
        }, null, 2));
        
        processed++;
        if (result.success) {
          successful++;
          console.log(`✓ Successfully scraped ${cemetery.slug}`);
        } else {
          failed++;
          console.log(`✗ Failed to scrape ${cemetery.slug}: ${result.error}`);
        }
      })
    );
    
    await Promise.all(promises);
    
    console.log(`Batch complete. Progress: ${processed}/${withWebsites.length} (${successful} successful, ${failed} failed)`);
    
    // Pause between batches to avoid rate limiting
    if (i + batchSize < withWebsites.length) {
      console.log('Pausing between batches...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // Final report
  console.log('\n=== Final Report ===');
  console.log(`Total processed: ${processed}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((successful / processed) * 100).toFixed(1)}%`);
  console.log('\nScraping complete!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}