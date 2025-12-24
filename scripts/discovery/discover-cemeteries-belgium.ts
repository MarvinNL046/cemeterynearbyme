#!/usr/bin/env npx tsx
/**
 * Cemetery Discovery Script voor België met Bright Data SERP API
 *
 * Zoekt begraafplaatsen in Belgische steden via Google Maps.
 * Ondersteunt drie regio's:
 * - Vlaanderen (NL): Nederlandse zoektermen
 * - Wallonië (FR): Franse zoektermen
 * - Brussel (NL/FR): Tweetalige zoektermen
 *
 * Gebruik:
 *   npx tsx scripts/discovery/discover-cemeteries-belgium.ts                    # Alle pending locaties
 *   npx tsx scripts/discovery/discover-cemeteries-belgium.ts --regio Vlaanderen
 *   npx tsx scripts/discovery/discover-cemeteries-belgium.ts --provincie "Antwerpen"
 *   npx tsx scripts/discovery/discover-cemeteries-belgium.ts --batch 50
 *   npx tsx scripts/discovery/discover-cemeteries-belgium.ts --dry-run
 *   npx tsx scripts/discovery/discover-cemeteries-belgium.ts --resume
 */

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// ============================================================================
// Configuration
// ============================================================================

const API_KEY = process.env.BRIGHTDATA_SERP_API_KEY || process.env.BRIGHTDATA_API_KEY;
const SERP_ZONE = process.env.BRIGHTDATA_DISCOVERY_ZONE || 'begraafplaatsindebuurt';

const SERP_API_URL = 'https://api.brightdata.com/request';

const DATA_DIR = path.join(process.cwd(), 'data', 'discovery');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations-belgium.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress-belgium.json');
const RESULTS_FILE = path.join(DATA_DIR, 'discovered-cemeteries-belgium.json');
const RATE_LIMIT_FILE = path.join(DATA_DIR, 'rate-limits-belgium.json');

// Rate limiting
const RATE_LIMIT = {
  requestsPerMinute: 999999,
  requestsPerHour: 999999,
  requestsPerDay: 999999,
  retryDelayMs: 5000,
  maxRetries: 3,
  delayBetweenQueries: 500,    // Was 1000ms, nu 500ms
  delayBetweenLocations: 2000, // Was 5000ms, nu 2000ms
};

// Search queries per language
const SEARCH_QUERIES_NL = [
  'begraafplaats',
  'kerkhof',
  'cemetery',
  'natuurbegraafplaats',
  'joodse begraafplaats',
  'islamitische begraafplaats',
  'rooms-katholieke begraafplaats',
  'protestantse begraafplaats',
  'oorlogsbegraafplaats',
  'crematorium',
];

const SEARCH_QUERIES_FR = [
  'cimetière',
  'cemetery',
  'cimetière naturel',
  'cimetière juif',
  'cimetière islamique',
  'cimetière catholique',
  'cimetière protestant',
  'cimetière militaire',
  'crématorium',
];

// Combined for Brussels (bilingual)
const SEARCH_QUERIES_BILINGUAL = [
  'begraafplaats',
  'cimetière',
  'kerkhof',
  'cemetery',
  'natuurbegraafplaats',
  'cimetière naturel',
  'crematorium',
  'crématorium',
];

// ============================================================================
// Types
// ============================================================================

interface DiscoveryLocationBelgium {
  id: string;
  plaats: string;
  gemeente: string;
  provincie: string;
  regio: 'Vlaanderen' | 'Wallonië' | 'Brussel';
  land: 'België';
  taal: 'nl' | 'fr' | 'nl/fr';
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results_count: number;
  last_searched_at: string | null;
  search_query: string | null;
  created_at: string;
  error_message?: string;
  retry_count?: number;
}

interface DiscoveredCemeteryBelgium {
  // Identifiers
  google_cid: string;
  google_place_id?: string;

  // Basic info
  name: string;
  original_title?: string;
  address?: string;
  phone?: string;
  website?: string;

  // Location
  latitude?: number;
  longitude?: number;
  plaats?: string;
  gemeente?: string;
  provincie?: string;
  regio?: 'Vlaanderen' | 'Wallonië' | 'Brussel';
  land: 'België';
  postcode?: string;

  // Google Maps data
  rating?: number;
  review_count?: number;
  business_type?: string;
  categories?: string[];

  // Opening hours
  opening_hours?: any;

  // Photo URL
  photo_url?: string;

  // Facilities
  facilities?: string[];

  // Reviews
  reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date?: string;
  }>;

  // Discovery metadata
  search_query: string;
  search_language: 'nl' | 'fr' | 'nl/fr';
  discovered_location_id: string;
  discovered_at: string;
}

interface RateLimitState {
  minute_count: number;
  minute_reset_at: string;
  hour_count: number;
  hour_reset_at: string;
  day_count: number;
  day_reset_at: string;
  total_requests: number;
  total_errors: number;
  last_request_at: string | null;
}

// ============================================================================
// Belgian Postcode Lookup
// ============================================================================

/**
 * Extract Belgian postcode from address
 * Belgian postcodes are 4 digits (1000-9999)
 */
function extractBelgianPostcode(address: string): string | null {
  // Belgian postcodes: 4 digits, often preceded by "B-" or "BE "
  const patterns = [
    /\b(?:B-|BE\s*)?([1-9]\d{3})\b/,  // 1000-9999
    /\b([1-9]\d{3})\s+[A-Z]/,          // 1000 Brussels
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract place name from Belgian address
 */
function extractPlaatsFromBelgianAddress(address: string): string | null {
  // Belgian format: "Street 123, 1000 Brussels" or "Street 123, B-1000 Brussels"
  const patterns = [
    /\b(?:B-|BE\s*)?[1-9]\d{3}\s+([A-Za-zÀ-ÿ\s'-]+?)(?:,|$)/,
    /,\s*([A-Za-zÀ-ÿ\s'-]+?)\s*,\s*(?:Belgium|België|Belgique)/i,
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

// ============================================================================
// Rate Limiting
// ============================================================================

function loadRateLimits(): RateLimitState {
  const now = new Date();
  const defaults: RateLimitState = {
    minute_count: 0,
    minute_reset_at: new Date(now.getTime() + 60000).toISOString(),
    hour_count: 0,
    hour_reset_at: new Date(now.getTime() + 3600000).toISOString(),
    day_count: 0,
    day_reset_at: new Date(now.setHours(24, 0, 0, 0)).toISOString(),
    total_requests: 0,
    total_errors: 0,
    last_request_at: null,
  };

  if (!fs.existsSync(RATE_LIMIT_FILE)) {
    return defaults;
  }

  try {
    const state = JSON.parse(fs.readFileSync(RATE_LIMIT_FILE, 'utf-8'));

    if (new Date(state.minute_reset_at) < now) {
      state.minute_count = 0;
      state.minute_reset_at = new Date(now.getTime() + 60000).toISOString();
    }
    if (new Date(state.hour_reset_at) < now) {
      state.hour_count = 0;
      state.hour_reset_at = new Date(now.getTime() + 3600000).toISOString();
    }
    if (new Date(state.day_reset_at) < now) {
      state.day_count = 0;
      state.day_reset_at = new Date(now.setHours(24, 0, 0, 0)).toISOString();
    }

    return state;
  } catch {
    return defaults;
  }
}

function saveRateLimits(state: RateLimitState): void {
  fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(state, null, 2));
}

// ============================================================================
// Bright Data SERP API
// ============================================================================

/**
 * Search Google Maps via SERP API for Belgium
 * Uses 'be' country code and appropriate language
 */
async function searchGoogleMapsSERP(
  query: string,
  location: string,
  language: 'nl' | 'fr' | 'nl/fr',
  retryCount = 0
): Promise<any> {
  // Use appropriate language for Google
  const hl = language === 'fr' ? 'fr' : 'nl';

  // Build search query with Belgium context
  const searchQuery = `${query} ${location} België`;
  const googleUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}?hl=${hl}&brd_json=1`;

  try {
    const response = await fetch(SERP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        zone: SERP_ZONE,
        url: googleUrl,
        format: 'json',
        country: 'be',  // Belgium country code
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 429) {
        throw new Error('RATE_LIMITED');
      }

      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { data, searchQuery };

  } catch (error: any) {
    if (retryCount < RATE_LIMIT.maxRetries) {
      const delay = RATE_LIMIT.retryDelayMs * Math.pow(2, retryCount);
      console.log(`   ⟳ Retry ${retryCount + 1}/${RATE_LIMIT.maxRetries} in ${delay / 1000}s...`);
      await sleep(delay);
      return searchGoogleMapsSERP(query, location, language, retryCount + 1);
    }

    throw error;
  }
}

// ============================================================================
// Data Processing
// ============================================================================

/**
 * Process SERP JSON response and extract cemetery data for Belgium
 */
async function processSerpResponse(
  response: { data: any; searchQuery: string },
  location: DiscoveryLocationBelgium,
  query: string
): Promise<DiscoveredCemeteryBelgium[]> {
  const cemeteries: DiscoveredCemeteryBelgium[] = [];
  let data = response.data;
  const seenCids = new Set<string>();

  // Parse body if it's a string
  if (data.body && typeof data.body === 'string') {
    try {
      data = JSON.parse(data.body);
    } catch {
      console.error('   ⚠️ Failed to parse body JSON');
      return cemeteries;
    }
  }

  // Handle different response structures
  const places = data.organic ||
                 data.local_results ||
                 data.places ||
                 data.organic_results ||
                 data.results ||
                 (Array.isArray(data) ? data : []);

  for (const place of places) {
    // Extract CID
    const cid = place.fid ||
                place.map_id ||
                place.cid ||
                place.data_cid ||
                place.place_id ||
                place.data_id ||
                extractCidFromUrl(place.link || place.url || place.map_link);

    if (!cid || seenCids.has(String(cid))) continue;
    seenCids.add(String(cid));

    // Check if this looks like a cemetery
    const name = place.title || place.name || '';
    const nameLower = name.toLowerCase();

    const categories = place.category || [];
    const categoryIds = categories.map((c: any) => (c.id || c).toLowerCase());
    const categoryTitles = categories.map((c: any) => (c.title || '').toLowerCase());

    // Check in both Dutch and French
    const isCemetery =
      nameLower.includes('begraafplaats') ||
      nameLower.includes('kerkhof') ||
      nameLower.includes('cemetery') ||
      nameLower.includes('cimetière') ||
      nameLower.includes('graf') ||
      nameLower.includes('dodenakker') ||
      categoryIds.includes('cemetery') ||
      categoryIds.includes('cimetière') ||
      categoryIds.includes('funeral') ||
      categoryTitles.includes('begraafplaats') ||
      categoryTitles.includes('cimetière');

    // For cemetery searches, be more lenient
    const isRelevantQuery = query.toLowerCase().includes('begraafplaats') ||
                           query.toLowerCase().includes('cimetière') ||
                           query.toLowerCase().includes('kerkhof');
    if (!isCemetery && !isRelevantQuery) continue;

    // Get primary category
    const primaryCategory = categories[0]?.title || categories[0]?.id ||
                           (location.taal === 'fr' ? 'cimetière' : 'begraafplaats');

    // Extract address info
    const address = place.address || place.formatted_address || '';
    const postcode = extractBelgianPostcode(address);
    const plaatsFromAddress = extractPlaatsFromBelgianAddress(address);

    // Use search location as fallback
    const plaats = plaatsFromAddress || location.plaats;
    const gemeente = location.gemeente;
    const provincie = location.provincie;
    const regio = location.regio;

    // Extract photo URL
    const photoUrl = place.original_image ||
                     place.image ||
                     place.photo ||
                     place.thumbnail ||
                     place.main_image;

    // Extract all category titles
    const allCategories = categories.map((c: any) => c.title || c.id || c).filter(Boolean);

    // Extract facilities
    const tags = place.tags || [];
    const facilities = tags
      .map((t: any) => t.value_title_short || t.key_title || t.value_title)
      .filter(Boolean);

    const cemetery: DiscoveredCemeteryBelgium = {
      google_cid: String(cid),
      google_place_id: place.map_id_encoded || (String(cid).startsWith('ChIJ') ? String(cid) : undefined),
      name: name,
      original_title: place.original_title || undefined,
      address: address,
      phone: place.phone,
      website: place.website || place.link || place.display_link,
      latitude: place.latitude || place.lat,
      longitude: place.longitude || place.lng,
      plaats: plaats,
      gemeente: gemeente,
      provincie: provincie,
      regio: regio,
      land: 'België',
      postcode: postcode || undefined,
      rating: place.rating ? parseFloat(String(place.rating)) : undefined,
      review_count: place.reviews_cnt || place.reviews_count || place.review_count,
      business_type: primaryCategory,
      categories: allCategories.length > 0 ? allCategories : undefined,
      opening_hours: place.work_status || place.hours || place.opening_hours,
      photo_url: photoUrl || undefined,
      facilities: facilities.length > 0 ? facilities : undefined,
      search_query: query,
      search_language: location.taal,
      discovered_location_id: location.id,
      discovered_at: new Date().toISOString(),
    };

    // Parse reviews if available
    if (place.top_reviews || place.reviews_data) {
      cemetery.reviews = parseReviews(place);
    }

    cemeteries.push(cemetery);
  }

  return cemeteries;
}

/**
 * Extract CID from Google Maps URL
 */
function extractCidFromUrl(url?: string): string | null {
  if (!url) return null;

  const cidMatch = url.match(/[?&]cid=(\d+)/);
  if (cidMatch) return cidMatch[1];

  const dataIdMatch = url.match(/data=.*?!1s(0x[a-f0-9]+:[a-f0-9]+)/);
  if (dataIdMatch) return dataIdMatch[1];

  const placeIdMatch = url.match(/(ChIJ[a-zA-Z0-9_-]+)/);
  if (placeIdMatch) return placeIdMatch[1];

  return null;
}

/**
 * Parse reviews from place data
 */
function parseReviews(place: any): DiscoveredCemeteryBelgium['reviews'] {
  const reviews: DiscoveredCemeteryBelgium['reviews'] = [];
  const rawReviews = place.top_reviews || place.reviews_data || [];

  for (const review of rawReviews.slice(0, 10)) {
    reviews.push({
      reviewer_name: review.author || review.reviewer_name || 'Anonymous',
      rating: review.rating || 0,
      review_text: review.text || review.content || review.snippet || '',
      review_date: review.date || review.review_date,
    });
  }

  return reviews;
}

// ============================================================================
// File Operations
// ============================================================================

function loadLocations(): DiscoveryLocationBelgium[] {
  if (!fs.existsSync(LOCATIONS_FILE)) {
    console.error('❌ Locations file not found. Run seed-locations-belgium.ts first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(LOCATIONS_FILE, 'utf-8'));
}

function saveLocations(locations: DiscoveryLocationBelgium[]): void {
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(locations, null, 2));
}

function loadDiscoveredCemeteries(): DiscoveredCemeteryBelgium[] {
  if (!fs.existsSync(RESULTS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveDiscoveredCemeteries(cemeteries: DiscoveredCemeteryBelgium[]): void {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(cemeteries, null, 2));
}

function updateProgress(locations: DiscoveryLocationBelgium[], cemeteries: DiscoveredCemeteryBelgium[]): void {
  const progress = {
    total_locations: locations.length,
    pending: locations.filter(l => l.status === 'pending').length,
    in_progress: locations.filter(l => l.status === 'in_progress').length,
    completed: locations.filter(l => l.status === 'completed').length,
    failed: locations.filter(l => l.status === 'failed').length,
    total_cemeteries_found: cemeteries.length,
    unique_cids: new Set(cemeteries.map(c => c.google_cid)).size,
    per_regio: {
      Vlaanderen: {
        total: locations.filter(l => l.regio === 'Vlaanderen').length,
        completed: locations.filter(l => l.regio === 'Vlaanderen' && l.status === 'completed').length,
        cemeteries: cemeteries.filter(c => c.regio === 'Vlaanderen').length,
      },
      Wallonië: {
        total: locations.filter(l => l.regio === 'Wallonië').length,
        completed: locations.filter(l => l.regio === 'Wallonië' && l.status === 'completed').length,
        cemeteries: cemeteries.filter(c => c.regio === 'Wallonië').length,
      },
      Brussel: {
        total: locations.filter(l => l.regio === 'Brussel').length,
        completed: locations.filter(l => l.regio === 'Brussel' && l.status === 'completed').length,
        cemeteries: cemeteries.filter(c => c.regio === 'Brussel').length,
      },
    },
    last_run_at: new Date().toISOString(),
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ============================================================================
// Utilities
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get search queries based on language
 */
function getSearchQueries(taal: 'nl' | 'fr' | 'nl/fr'): string[] {
  switch (taal) {
    case 'fr':
      return SEARCH_QUERIES_FR;
    case 'nl/fr':
      return SEARCH_QUERIES_BILINGUAL;
    case 'nl':
    default:
      return SEARCH_QUERIES_NL;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    regio: null as string | null,
    provincie: null as string | null,
    batch: 0,
    dryRun: false,
    resume: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--regio' && args[i + 1]) {
      options.regio = args[i + 1];
      i++;
    } else if (args[i] === '--provincie' && args[i + 1]) {
      options.provincie = args[i + 1];
      i++;
    } else if (args[i] === '--batch' && args[i + 1]) {
      options.batch = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--resume') {
      options.resume = true;
    }
  }

  return options;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const options = parseArgs();

  console.log('🇧🇪 Cemetery Discovery Script - België\n');
  console.log('━'.repeat(50));

  // Check API key
  if (!API_KEY) {
    console.error('❌ BRIGHTDATA_API_KEY niet gevonden in .env.local');
    process.exit(1);
  }

  // Check if locations file exists
  if (!fs.existsSync(LOCATIONS_FILE)) {
    console.log('⚠️ Locations bestand niet gevonden.');
    console.log('   Run eerst: npx tsx scripts/discovery/seed-locations-belgium.ts');
    process.exit(1);
  }

  // Load data
  let locations = loadLocations();
  let discoveredCemeteries = loadDiscoveredCemeteries();
  const rateLimits = loadRateLimits();

  // Build set of existing CIDs to avoid duplicates
  const existingCids = new Set(discoveredCemeteries.map(c => c.google_cid));

  // Filter locations to process
  let toProcess = locations.filter(l => {
    if (options.resume && l.status === 'in_progress') return true;
    if (l.status === 'pending') return true;
    if (l.status === 'failed' && (l.retry_count || 0) < RATE_LIMIT.maxRetries) return true;
    return false;
  });

  // Filter by regio
  if (options.regio) {
    toProcess = toProcess.filter(l =>
      l.regio.toLowerCase() === options.regio!.toLowerCase()
    );
  }

  // Filter by provincie
  if (options.provincie) {
    toProcess = toProcess.filter(l =>
      l.provincie.toLowerCase() === options.provincie!.toLowerCase()
    );
  }

  // Sort by priority
  toProcess.sort((a, b) => b.priority - a.priority);

  // Apply batch limit
  if (options.batch > 0) {
    toProcess = toProcess.slice(0, options.batch);
  }

  console.log(`📊 Status:`);
  console.log(`   Totaal locaties: ${locations.length}`);
  console.log(`   Te verwerken: ${toProcess.length}`);
  console.log(`   Al gevonden: ${discoveredCemeteries.length} begraafplaatsen`);
  console.log(`   Unieke CIDs: ${existingCids.size}`);
  console.log('');

  // Show breakdown by region
  const regioBreakdown = toProcess.reduce((acc, l) => {
    acc[l.regio] = (acc[l.regio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(regioBreakdown).length > 0) {
    console.log('   Per regio:');
    for (const [regio, count] of Object.entries(regioBreakdown)) {
      const taal = regio === 'Vlaanderen' ? '🇳🇱 NL' : regio === 'Wallonië' ? '🇫🇷 FR' : '🇳🇱🇫🇷 NL/FR';
      console.log(`   - ${regio}: ${count} locaties (${taal})`);
    }
    console.log('');
  }

  if (toProcess.length === 0) {
    console.log('✅ Alle locaties zijn al verwerkt!');
    return;
  }

  if (options.dryRun) {
    console.log('🧪 DRY RUN - Geen API calls worden gedaan\n');
    console.log('Te verwerken locaties:');
    toProcess.slice(0, 10).forEach((loc, i) => {
      const taal = loc.taal === 'nl' ? '🇳🇱' : loc.taal === 'fr' ? '🇫🇷' : '🇳🇱🇫🇷';
      console.log(`   ${i + 1}. ${loc.plaats} (${loc.gemeente}, ${loc.provincie}) ${taal}`);
    });
    if (toProcess.length > 10) {
      console.log(`   ... en nog ${toProcess.length - 10} meer`);
    }
    return;
  }

  // Process locations
  console.log(`🚀 Start verwerking van ${toProcess.length} locaties...\n`);

  let processed = 0;
  let newCemeteries = 0;

  for (const location of toProcess) {
    const taalIcon = location.taal === 'nl' ? '🇳🇱' : location.taal === 'fr' ? '🇫🇷' : '🇳🇱🇫🇷';
    console.log(`\n${taalIcon} ${location.plaats} (${location.gemeente}, ${location.provincie})`);

    // Update status
    location.status = 'in_progress';
    saveLocations(locations);

    try {
      let locationResults: DiscoveredCemeteryBelgium[] = [];
      const searchQueries = getSearchQueries(location.taal);

      // Search with each query
      for (const query of searchQueries) {
        console.log(`   🔎 Zoeken: "${query} ${location.plaats}"...`);

        const response = await searchGoogleMapsSERP(query, location.plaats, location.taal);
        const cemeteries = await processSerpResponse(response, location, query);

        // Filter duplicates
        for (const cemetery of cemeteries) {
          if (!existingCids.has(cemetery.google_cid)) {
            existingCids.add(cemetery.google_cid);
            locationResults.push(cemetery);
            discoveredCemeteries.push(cemetery);
            newCemeteries++;
          }
        }

        console.log(`   ✓ ${cemeteries.length} CIDs gevonden (${locationResults.length} nieuw)`);

        // Small delay between queries
        await sleep(RATE_LIMIT.delayBetweenQueries);
      }

      // Update location
      location.status = 'completed';
      location.results_count = locationResults.length;
      location.last_searched_at = new Date().toISOString();
      location.search_query = searchQueries.join(', ');

      // Save progress
      saveLocations(locations);
      saveDiscoveredCemeteries(discoveredCemeteries);
      updateProgress(locations, discoveredCemeteries);
      saveRateLimits(rateLimits);

      processed++;
      console.log(`   💾 Opgeslagen (${processed}/${toProcess.length})`);

    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`);

      location.status = 'failed';
      location.error_message = error.message;
      location.retry_count = (location.retry_count || 0) + 1;

      saveLocations(locations);
      rateLimits.total_errors++;
      saveRateLimits(rateLimits);
    }

    // Delay between locations
    await sleep(RATE_LIMIT.delayBetweenLocations);
  }

  // Final summary
  console.log('\n' + '━'.repeat(50));
  console.log('📊 SAMENVATTING');
  console.log('━'.repeat(50));
  console.log(`✅ Verwerkt: ${processed}/${toProcess.length} locaties`);
  console.log(`🆕 Nieuw gevonden: ${newCemeteries} begraafplaatsen`);
  console.log(`📦 Totaal in database: ${discoveredCemeteries.length}`);
  console.log(`🔢 Unieke CIDs: ${existingCids.size}`);

  // Per region summary
  const finalRegio = discoveredCemeteries.reduce((acc, c) => {
    const regio = c.regio || 'Onbekend';
    acc[regio] = (acc[regio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n   Per regio:');
  for (const [regio, count] of Object.entries(finalRegio)) {
    console.log(`   - ${regio}: ${count} begraafplaatsen`);
  }

  console.log('━'.repeat(50));
  console.log(`\n📁 Data opgeslagen in: ${DATA_DIR}`);
  console.log('\n🚀 Volgende stappen:');
  console.log('   1. npx tsx scripts/merge-discovery-data-belgium.ts');
  console.log('   2. npx tsx scripts/enrich-osm-data.ts --land België');
  console.log('   3. npx tsx scripts/enrich-content-quality.ts --land België');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
