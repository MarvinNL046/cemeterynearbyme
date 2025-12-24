#!/usr/bin/env -S npx tsx
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BegraafplaatsLocation {
  naam_begraafplaats: string;
  slug: string;
  links: string;
  gemeente: string;
  provincie: string;
  type: string;
  gps_coordinaten?: string;
  adres?: string;
  telefoon?: string;
  [key: string]: any;
}

interface ScrapedData {
  begraafplaats_slug: string;
  begraafplaats_naam: string;
  gemeente: string;
  provincie: string;
  type: string;
  website_url?: string;
  website_content?: string;
  website_scraped_at?: string;
  website_structured_data?: any;
  website_description?: string;
  website_openingstijden?: string;
  website_tarieven?: string;
  website_faciliteiten?: string[];
  website_historie?: string;
  website_contact_info?: any;
  website_fotos?: string[];
  google_place_id?: string;
  google_rating?: number;
  google_review_count?: number;
  google_reviews?: any[];
  google_scraped_at?: string;
  google_photos?: string[];
  google_opening_hours?: any;
  google_website?: string;
  google_phone?: string;
  google_address?: string;
  scrape_status?: 'pending' | 'scraping' | 'completed' | 'failed';
  last_error?: string;
  created_at?: string;
  updated_at?: string;
}

// Function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to check if location is already scraped
async function isLocationScraped(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('scraped_begraafplaats_data')
    .select('scrape_status')
    .eq('begraafplaats_slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error checking scraped status:', error);
    return false;
  }

  return data?.scrape_status === 'completed';
}

// Function to save scraped data to Supabase
async function saveScrapedData(data: ScrapedData) {
  const now = new Date().toISOString();
  const dataWithTimestamp = {
    ...data,
    updated_at: now,
    created_at: data.created_at || now
  };

  const { error } = await supabase
    .from('scraped_begraafplaats_data')
    .upsert(dataWithTimestamp, { onConflict: 'begraafplaats_slug' });

  if (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }
}

// Function to extract Google Maps URL from location data
function buildGoogleMapsUrl(location: BegraafplaatsLocation): string | null {
  // Try to build a search query from available data
  const parts = [];
  if (location.naam_begraafplaats) parts.push(location.naam_begraafplaats);
  parts.push('begraafplaats'); // Add context for better search results
  if (location.gemeente) parts.push(location.gemeente);
  if (location.provincie) parts.push(location.provincie);
  
  if (parts.length === 0) return null;
  
  const searchQuery = parts.join(', ');
  return `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
}

// Function to clean and validate website URLs
function cleanWebsiteUrl(url: string): string | null {
  if (!url || url.trim() === '') return null;
  
  // Clean up the URL
  let cleanUrl = url.trim();
  
  // Add protocol if missing
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  
  // Check if it's a valid URL pattern
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    return null;
  }
}

// Main scraping function
async function scrapeBegraafplaatsWebsites() {
  console.log('=== Begraafplaats Website Scraping Tool ===\n');
  console.log('This script will process begraafplaats locations and prepare them for scraping.');
  console.log('The actual scraping needs to be done through Claude using the Brightdata MCP tools.\n');

  // Load the data
  const dataPath = path.join(process.cwd(), 'public/data/cemeteries.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('Error: cemeteries.json not found!');
    console.log('Please run: npm run build-data');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const locations: BegraafplaatsLocation[] = JSON.parse(rawData);

  // Filter locations with website URLs
  const locationsWithWebsites = locations.filter(loc => {
    const cleanUrl = cleanWebsiteUrl(loc.links);
    return cleanUrl !== null;
  });

  console.log(`Found ${locations.length} total begraafplaats locations`);
  console.log(`Found ${locationsWithWebsites.length} locations with websites\n`);

  // Process in batches
  const batchSize = 10;
  const isTestRun = process.argv.includes('--test');
  const totalToProcess = isTestRun ? 10 : locationsWithWebsites.length;

  console.log(`Mode: ${isTestRun ? 'TEST (first 10 locations)' : 'FULL'}`);
  console.log(`Will process ${totalToProcess} locations in batches of ${batchSize}\n`);

  // Check database connection
  console.log('Checking database connection...');
  const { error: dbError } = await supabase
    .from('scraped_begraafplaats_data')
    .select('count')
    .limit(1);

  if (dbError) {
    console.error('Database connection failed:', dbError);
    console.log('\nPlease ensure:');
    console.log('1. The scraped_begraafplaats_data table exists in Supabase');
    console.log('2. Run the SQL in: supabase/create-scraped-begraafplaats-table.sql');
    console.log('3. Your environment variables are set correctly');
    process.exit(1);
  }

  console.log('Database connection successful!\n');

  // Generate scraping tasks
  const scrapingTasks = [];
  let skipCount = 0;

  for (let i = 0; i < totalToProcess; i++) {
    const location = locationsWithWebsites[i];
    
    // Check if already scraped
    if (await isLocationScraped(location.slug)) {
      console.log(`[${i + 1}/${totalToProcess}] Skipping ${location.naam_begraafplaats} - already scraped`);
      skipCount++;
      continue;
    }

    // Clean the website URL
    const cleanUrl = cleanWebsiteUrl(location.links);
    if (!cleanUrl) {
      console.log(`[${i + 1}/${totalToProcess}] Skipping ${location.naam_begraafplaats} - invalid URL`);
      skipCount++;
      continue;
    }

    // Prepare Google Maps URL
    const googleMapsUrl = buildGoogleMapsUrl(location);

    const task = {
      index: i + 1,
      slug: location.slug,
      naam: location.naam_begraafplaats,
      gemeente: location.gemeente,
      provincie: location.provincie,
      type: location.type,
      website_url: cleanUrl,
      google_maps_url: googleMapsUrl,
      location_data: {
        gps_coordinaten: location.gps_coordinaten,
        adres: location.adres,
        telefoon: location.telefoon,
        faciliteiten: location.faciliteiten,
        openingstijden: location.openingstijden
      }
    };

    scrapingTasks.push(task);

    // Initialize record in database
    await saveScrapedData({
      begraafplaats_slug: location.slug,
      begraafplaats_naam: location.naam_begraafplaats,
      gemeente: location.gemeente,
      provincie: location.provincie,
      type: location.type,
      website_url: cleanUrl,
      scrape_status: 'pending'
    });
  }

  console.log(`\nPrepared ${scrapingTasks.length} locations for scraping`);
  console.log(`Skipped ${skipCount} already scraped locations\n`);

  // Save tasks to a file for reference
  const tasksPath = path.join(process.cwd(), 'data', 'scraping-tasks.json');
  // Ensure data directory exists
  const dataDir = path.dirname(tasksPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(tasksPath, JSON.stringify(scrapingTasks, null, 2));
  console.log(`Scraping tasks saved to: ${tasksPath}\n`);

  // Generate example commands
  console.log('=== Instructions for Scraping ===\n');
  console.log('To scrape these locations, use Claude with the following Brightdata MCP tools:\n');
  
  const exampleTask = scrapingTasks[0];
  if (exampleTask) {
    console.log('Example for first location:');
    console.log(`Name: ${exampleTask.naam}`);
    console.log(`Website: ${exampleTask.website_url}`);
    console.log(`Location: ${exampleTask.gemeente}, ${exampleTask.provincie}`);
    console.log(`\n1. Scrape website content:`);
    console.log(`   mcp__brightdata__scrape_as_markdown(url="${exampleTask.website_url}")\n`);
    
    if (exampleTask.google_maps_url) {
      console.log(`2. Get Google Maps reviews:`);
      console.log(`   mcp__brightdata__web_data_google_maps_reviews(url="${exampleTask.google_maps_url}", days_limit="90")\n`);
    }
  }

  console.log('Process each location and update the database with:');
  console.log('- website_content (from scrape_as_markdown)');
  console.log('- website_scraped_at (current timestamp)');
  console.log('- google_rating, google_review_count, google_reviews (from google_maps_reviews)');
  console.log('- google_scraped_at (current timestamp)');
  console.log('- scrape_status = "completed" (or "failed" with last_error)');

  // Show batch information
  console.log(`\n=== Batch Processing ===`);
  console.log(`Total tasks: ${scrapingTasks.length}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Number of batches: ${Math.ceil(scrapingTasks.length / batchSize)}`);
  console.log('\nRemember to:');
  console.log('- Process in batches of 10');
  console.log('- Add 2-3 second delays between requests');
  console.log('- Add 5 second delays between batches');
  console.log('- Handle errors gracefully');
  console.log('- Update scrape_status for each location');
  console.log('- Focus on getting contact info, opening hours, and historical information\n');

  // Show data quality stats
  const stats = {
    total: locations.length,
    withWebsites: locationsWithWebsites.length,
    prepared: scrapingTasks.length,
    skipped: skipCount,
    byType: {} as Record<string, number>,
    byProvince: {} as Record<string, number>
  };

  // Calculate type distribution
  scrapingTasks.forEach(task => {
    stats.byType[task.type] = (stats.byType[task.type] || 0) + 1;
    stats.byProvince[task.provincie] = (stats.byProvince[task.provincie] || 0) + 1;
  });

  console.log('=== Data Quality Stats ===');
  console.log(`📊 Total locations: ${stats.total}`);
  console.log(`🌐 With websites: ${stats.withWebsites} (${(stats.withWebsites/stats.total*100).toFixed(1)}%)`);
  console.log(`✅ Ready to scrape: ${stats.prepared}`);
  console.log(`⏭️ Skipped: ${stats.skipped}`);
  
  console.log('\n📋 By Type:');
  Object.entries(stats.byType)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

  console.log('\n🏛️ By Province:');
  Object.entries(stats.byProvince)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10) // Show top 10
    .forEach(([province, count]) => {
      console.log(`   ${province}: ${count}`);
    });

  console.log('\n💡 Next Steps:');
  console.log('1. Use Claude with Brightdata MCP tools to scrape websites');
  console.log('2. Run: npm run enrich-content (after scraping)');
  console.log('3. Run: npm run export-enriched (after enrichment)');
  console.log('4. Run: npm run build-data (to update production data)\n');
}

// Run the preparation script
if (require.main === module) {
  scrapeBegraafplaatsWebsites().catch(console.error);
}