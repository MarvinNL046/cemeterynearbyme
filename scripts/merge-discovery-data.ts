#!/usr/bin/env npx tsx
/**
 * Merge Discovery Data into Existing Cemeteries - ENHANCED VERSION
 *
 * Updates existing cemetery entries with data from the discovery process using
 * multiple intelligent matching strategies:
 *
 * 1. Exact slug match
 * 2. GPS coordinate proximity (within 100m)
 * 3. Postcode + name similarity
 * 4. Gemeente + fuzzy name matching
 *
 * Data merged:
 * - google_rating
 * - google_review_count
 * - google_place_id
 * - google_cid
 * - openingstijden (if not already set)
 * - telefoon (if not already set)
 * - gps_coordinaten (if not already set)
 * - foto_url (if not already set)
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DISCOVERED_FILE = path.join(DATA_DIR, 'discovery', 'discovered-cemeteries.json');
const CEMETERY_FILE = path.join(DATA_DIR, 'begraafplaatsen.json');
const PUBLIC_CEMETERY_FILE = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');
const MERGE_LOG_FILE = path.join(DATA_DIR, 'merge-log.json');

interface DiscoveredCemetery {
  google_cid: string;
  google_place_id?: string;
  name: string;
  original_title?: string;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  plaats?: string;
  gemeente?: string;
  provincie?: string;
  rating?: number;
  review_count?: number;
  business_type?: string;
  categories?: string[];
  opening_hours?: string;
  search_query?: string;
  discovered_at?: string;
  postcode?: string;
  photo_url?: string;
  facilities?: string[];
}

interface Cemetery {
  slug: string;
  naam_begraafplaats: string;
  gemeente: string;
  provincie?: string;
  plaats?: string;
  postcode?: string;
  adres?: string;
  gps_coordinaten?: string;
  google_rating?: number;
  google_review_count?: number;
  google_place_id?: string;
  google_cid?: string;
  openingstijden?: string;
  telefoon?: string;
  website?: string;
  foto_url?: string;
  faciliteiten?: string;  // Comma-separated string of facilities
  [key: string]: unknown;
}

interface MatchResult {
  cemetery: Cemetery;
  discovered: DiscoveredCemetery;
  matchType: 'exact_slug' | 'gps_proximity' | 'postcode_name' | 'gemeente_fuzzy' | 'cid_match';
  confidence: number;
}

interface MergeStats {
  total_cemeteries: number;
  total_discovered: number;
  matched: number;
  updated: number;
  by_match_type: Record<string, number>;
  ratings_added: number;
  opening_hours_added: number;
  phones_added: number;
  websites_added: number;
  gps_added: number;
  photos_added: number;
  facilities_added: number;
  unmatched_discovered: number;
  timestamp: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateSlug(name: string, plaats: string): string {
  const combined = `${name} ${plaats}`;
  return combined
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

function cleanName(name: string): string {
  return name
    .replace(/\s*\|\s*(?:uitvaartcentrum|begraafplaats|crematorium).*$/i, '')
    .replace(/\s*-\s*(?:uitvaartcentrum|begraafplaats|crematorium).*$/i, '')
    .replace(/\s*,.*$/, '') // Remove everything after comma
    .trim();
}

function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity score between two strings (0-1)
 */
function stringSimilarity(str1: string, str2: string): number {
  const n1 = normalizeForComparison(str1);
  const n2 = normalizeForComparison(str2);

  if (n1 === n2) return 1.0;
  if (n1.length === 0 || n2.length === 0) return 0;

  // Check if one contains the other
  if (n1.includes(n2) || n2.includes(n1)) {
    return 0.9;
  }

  const maxLen = Math.max(n1.length, n2.length);
  const distance = levenshteinDistance(n1, n2);
  return 1 - distance / maxLen;
}

/**
 * Calculate distance between two GPS coordinates in meters
 */
function gpsDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Parse GPS coordinates from string "lat,lon"
 */
function parseGps(gpsStr?: string): { lat: number; lon: number } | null {
  if (!gpsStr) return null;
  const parts = gpsStr.split(',').map(p => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lon: parts[1] };
  }
  return null;
}

/**
 * Extract 4-digit postcode prefix
 */
function getPostcode4(postcode?: string): string | null {
  if (!postcode) return null;
  const match = postcode.replace(/\s/g, '').match(/^(\d{4})/);
  return match ? match[1] : null;
}

// ============================================================================
// Matching Strategies
// ============================================================================

/**
 * Strategy 1: Exact slug match
 */
function matchBySlug(
  cemetery: Cemetery,
  discoveredBySlug: Map<string, DiscoveredCemetery>
): DiscoveredCemetery | null {
  return discoveredBySlug.get(cemetery.slug) || null;
}

/**
 * Strategy 2: Match by Google CID (if cemetery already has one)
 */
function matchByCid(
  cemetery: Cemetery,
  discoveredByCid: Map<string, DiscoveredCemetery>
): DiscoveredCemetery | null {
  if (!cemetery.google_cid) return null;
  return discoveredByCid.get(cemetery.google_cid) || null;
}

/**
 * Strategy 3: GPS proximity match (within 100 meters)
 */
function matchByGps(
  cemetery: Cemetery,
  discoveredList: DiscoveredCemetery[],
  maxDistanceMeters: number = 100
): { discovered: DiscoveredCemetery; distance: number } | null {
  const cemeteryGps = parseGps(cemetery.gps_coordinaten);
  if (!cemeteryGps) return null;

  let bestMatch: { discovered: DiscoveredCemetery; distance: number } | null = null;

  for (const d of discoveredList) {
    if (!d.latitude || !d.longitude) continue;

    const distance = gpsDistance(
      cemeteryGps.lat, cemeteryGps.lon,
      d.latitude, d.longitude
    );

    if (distance <= maxDistanceMeters) {
      if (!bestMatch || distance < bestMatch.distance) {
        bestMatch = { discovered: d, distance };
      }
    }
  }

  return bestMatch;
}

/**
 * Strategy 4: Postcode + name similarity
 */
function matchByPostcodeAndName(
  cemetery: Cemetery,
  discoveredByPostcode: Map<string, DiscoveredCemetery[]>,
  minSimilarity: number = 0.6
): { discovered: DiscoveredCemetery; similarity: number } | null {
  const pc4 = getPostcode4(cemetery.postcode);
  if (!pc4) return null;

  const candidates = discoveredByPostcode.get(pc4) || [];
  let bestMatch: { discovered: DiscoveredCemetery; similarity: number } | null = null;

  for (const d of candidates) {
    const similarity = stringSimilarity(cemetery.naam_begraafplaats, d.name);
    if (similarity >= minSimilarity) {
      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { discovered: d, similarity };
      }
    }
  }

  return bestMatch;
}

/**
 * Strategy 5: Gemeente + fuzzy name matching
 */
function matchByGemeenteAndName(
  cemetery: Cemetery,
  discoveredByGemeente: Map<string, DiscoveredCemetery[]>,
  minSimilarity: number = 0.7
): { discovered: DiscoveredCemetery; similarity: number } | null {
  const gemeenteKey = normalizeForComparison(cemetery.gemeente);
  const candidates = discoveredByGemeente.get(gemeenteKey) || [];
  let bestMatch: { discovered: DiscoveredCemetery; similarity: number } | null = null;

  for (const d of candidates) {
    const similarity = stringSimilarity(cemetery.naam_begraafplaats, d.name);
    if (similarity >= minSimilarity) {
      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { discovered: d, similarity };
      }
    }
  }

  return bestMatch;
}

// ============================================================================
// Main Merge Logic
// ============================================================================

function mergeData(cemetery: Cemetery, discovered: DiscoveredCemetery): boolean {
  let wasUpdated = false;

  // Update google_rating
  if (discovered.rating && !cemetery.google_rating) {
    cemetery.google_rating = discovered.rating;
    wasUpdated = true;
  }

  // Update google_review_count
  if (discovered.review_count && !cemetery.google_review_count) {
    cemetery.google_review_count = discovered.review_count;
    wasUpdated = true;
  }

  // Update google_place_id
  if (discovered.google_place_id && !cemetery.google_place_id) {
    cemetery.google_place_id = discovered.google_place_id;
    wasUpdated = true;
  }

  // Update google_cid
  if (discovered.google_cid && !cemetery.google_cid) {
    cemetery.google_cid = discovered.google_cid;
    wasUpdated = true;
  }

  // Update openingstijden
  if (discovered.opening_hours && !cemetery.openingstijden) {
    cemetery.openingstijden = discovered.opening_hours;
    wasUpdated = true;
  }

  // Update telefoon
  if (discovered.phone && !cemetery.telefoon) {
    cemetery.telefoon = discovered.phone;
    wasUpdated = true;
  }

  // Update GPS coordinates
  if (discovered.latitude && discovered.longitude && !cemetery.gps_coordinaten) {
    cemetery.gps_coordinaten = `${discovered.latitude},${discovered.longitude}`;
    wasUpdated = true;
  }

  // Update foto_url from Google Maps
  if (discovered.photo_url && !cemetery.foto_url) {
    cemetery.foto_url = discovered.photo_url;
    wasUpdated = true;
  }

  // Update website
  if (discovered.website && !cemetery.website) {
    cemetery.website = discovered.website;
    wasUpdated = true;
  }

  // Update faciliteiten from Google Maps tags
  if (discovered.facilities && discovered.facilities.length > 0 && !cemetery.faciliteiten) {
    cemetery.faciliteiten = discovered.facilities.join(', ');
    wasUpdated = true;
  }

  return wasUpdated;
}

async function main() {
  console.log('🔄 Merging discovery data into existing cemeteries (ENHANCED)...\n');

  // Load discovered cemeteries
  if (!fs.existsSync(DISCOVERED_FILE)) {
    console.error('❌ Discovered cemeteries file not found:', DISCOVERED_FILE);
    process.exit(1);
  }

  const discovered: DiscoveredCemetery[] = JSON.parse(fs.readFileSync(DISCOVERED_FILE, 'utf-8'));
  console.log(`📥 Loaded ${discovered.length} discovered entries`);

  // Load existing cemeteries
  if (!fs.existsSync(CEMETERY_FILE)) {
    console.error('❌ Cemetery file not found:', CEMETERY_FILE);
    process.exit(1);
  }

  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(CEMETERY_FILE, 'utf-8'));
  console.log(`📥 Loaded ${cemeteries.length} existing cemeteries`);

  // Build indexes for different matching strategies
  console.log('\n📊 Building match indexes...');

  // Index by slug
  const discoveredBySlug = new Map<string, DiscoveredCemetery>();
  for (const d of discovered) {
    const cleanedName = cleanName(d.name);
    const plaats = d.plaats || '';
    const slug = generateSlug(cleanedName, plaats);
    const existing = discoveredBySlug.get(slug);
    if (!existing || (d.review_count || 0) > (existing.review_count || 0)) {
      discoveredBySlug.set(slug, d);
    }
  }
  console.log(`   Slug index: ${discoveredBySlug.size} entries`);

  // Index by CID
  const discoveredByCid = new Map<string, DiscoveredCemetery>();
  for (const d of discovered) {
    if (d.google_cid) {
      discoveredByCid.set(d.google_cid, d);
    }
  }
  console.log(`   CID index: ${discoveredByCid.size} entries`);

  // Index by postcode (4 digits)
  const discoveredByPostcode = new Map<string, DiscoveredCemetery[]>();
  for (const d of discovered) {
    const pc4 = getPostcode4(d.postcode);
    if (pc4) {
      const list = discoveredByPostcode.get(pc4) || [];
      list.push(d);
      discoveredByPostcode.set(pc4, list);
    }
  }
  console.log(`   Postcode index: ${discoveredByPostcode.size} postcodes`);

  // Index by gemeente
  const discoveredByGemeente = new Map<string, DiscoveredCemetery[]>();
  for (const d of discovered) {
    if (d.gemeente) {
      const key = normalizeForComparison(d.gemeente);
      const list = discoveredByGemeente.get(key) || [];
      list.push(d);
      discoveredByGemeente.set(key, list);
    }
  }
  console.log(`   Gemeente index: ${discoveredByGemeente.size} gemeentes`);

  // Track matches and stats
  const matches: MatchResult[] = [];
  const matchedDiscoveredCids = new Set<string>();
  const stats: MergeStats = {
    total_cemeteries: cemeteries.length,
    total_discovered: discovered.length,
    matched: 0,
    updated: 0,
    by_match_type: {
      exact_slug: 0,
      cid_match: 0,
      gps_proximity: 0,
      postcode_name: 0,
      gemeente_fuzzy: 0,
    },
    ratings_added: 0,
    opening_hours_added: 0,
    phones_added: 0,
    websites_added: 0,
    gps_added: 0,
    photos_added: 0,
    facilities_added: 0,
    unmatched_discovered: 0,
    timestamp: new Date().toISOString(),
  };

  // Process each cemetery
  console.log('\n🔍 Matching cemeteries...');

  for (const cemetery of cemeteries) {
    let match: DiscoveredCemetery | null = null;
    let matchType: MatchResult['matchType'] = 'exact_slug';
    let confidence = 0;

    // Strategy 1: Exact slug match
    match = matchBySlug(cemetery, discoveredBySlug);
    if (match) {
      matchType = 'exact_slug';
      confidence = 1.0;
    }

    // Strategy 2: CID match
    if (!match) {
      match = matchByCid(cemetery, discoveredByCid);
      if (match) {
        matchType = 'cid_match';
        confidence = 1.0;
      }
    }

    // Strategy 3: GPS proximity
    if (!match) {
      const gpsMatch = matchByGps(cemetery, discovered, 100);
      if (gpsMatch) {
        match = gpsMatch.discovered;
        matchType = 'gps_proximity';
        confidence = 1 - (gpsMatch.distance / 100); // Higher confidence for closer matches
      }
    }

    // Strategy 4: Postcode + name
    if (!match) {
      const postcodeMatch = matchByPostcodeAndName(cemetery, discoveredByPostcode, 0.6);
      if (postcodeMatch) {
        match = postcodeMatch.discovered;
        matchType = 'postcode_name';
        confidence = postcodeMatch.similarity;
      }
    }

    // Strategy 5: Gemeente + fuzzy name
    if (!match) {
      const gemeenteMatch = matchByGemeenteAndName(cemetery, discoveredByGemeente, 0.7);
      if (gemeenteMatch) {
        match = gemeenteMatch.discovered;
        matchType = 'gemeente_fuzzy';
        confidence = gemeenteMatch.similarity;
      }
    }

    // Apply match if found
    if (match) {
      matches.push({ cemetery, discovered: match, matchType, confidence });
      matchedDiscoveredCids.add(match.google_cid);
      stats.matched++;
      stats.by_match_type[matchType]++;

      // Track what was added before merge
      const hadRating = !!cemetery.google_rating;
      const hadOpeningHours = !!cemetery.openingstijden;
      const hadPhone = !!cemetery.telefoon;
      const hadWebsite = !!cemetery.website;
      const hadGps = !!cemetery.gps_coordinaten;
      const hadPhoto = !!cemetery.foto_url;
      const hadFacilities = !!cemetery.faciliteiten;

      // Merge data
      const wasUpdated = mergeData(cemetery, match);

      if (wasUpdated) {
        stats.updated++;
        if (!hadRating && cemetery.google_rating) stats.ratings_added++;
        if (!hadOpeningHours && cemetery.openingstijden) stats.opening_hours_added++;
        if (!hadPhone && cemetery.telefoon) stats.phones_added++;
        if (!hadWebsite && cemetery.website) stats.websites_added++;
        if (!hadGps && cemetery.gps_coordinaten) stats.gps_added++;
        if (!hadPhoto && cemetery.foto_url) stats.photos_added++;
        if (!hadFacilities && cemetery.faciliteiten) stats.facilities_added++;
      }
    }
  }

  // Count unmatched discovered entries
  stats.unmatched_discovered = discovered.filter(d => !matchedDiscoveredCids.has(d.google_cid)).length;

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 MERGE RESULTS');
  console.log('='.repeat(60));
  console.log(`   Total cemeteries: ${stats.total_cemeteries}`);
  console.log(`   Total discovered: ${stats.total_discovered}`);
  console.log(`   Matched: ${stats.matched} (${(stats.matched / stats.total_cemeteries * 100).toFixed(1)}%)`);
  console.log(`   Updated: ${stats.updated}`);
  console.log('');
  console.log('   Match types:');
  console.log(`     - Exact slug: ${stats.by_match_type.exact_slug}`);
  console.log(`     - CID match: ${stats.by_match_type.cid_match}`);
  console.log(`     - GPS proximity: ${stats.by_match_type.gps_proximity}`);
  console.log(`     - Postcode + name: ${stats.by_match_type.postcode_name}`);
  console.log(`     - Gemeente + fuzzy: ${stats.by_match_type.gemeente_fuzzy}`);
  console.log('');
  console.log('   Data added:');
  console.log(`     📊 Ratings: ${stats.ratings_added}`);
  console.log(`     🕐 Opening hours: ${stats.opening_hours_added}`);
  console.log(`     📞 Phone numbers: ${stats.phones_added}`);
  console.log(`     🌐 Websites: ${stats.websites_added}`);
  console.log(`     📍 GPS coordinates: ${stats.gps_added}`);
  console.log(`     📷 Photos: ${stats.photos_added}`);
  console.log(`     ♿ Facilities: ${stats.facilities_added}`);
  console.log('');
  console.log(`   Unmatched discovered entries: ${stats.unmatched_discovered}`);
  console.log('='.repeat(60));

  // Show some fuzzy matches for review
  const fuzzyMatches = matches.filter(m =>
    m.matchType === 'postcode_name' || m.matchType === 'gemeente_fuzzy'
  ).slice(0, 10);

  if (fuzzyMatches.length > 0) {
    console.log('\n📋 Sample fuzzy matches (for review):');
    for (const m of fuzzyMatches) {
      console.log(`   "${m.cemetery.naam_begraafplaats}" → "${m.discovered.name}"`);
      console.log(`      Type: ${m.matchType}, Confidence: ${(m.confidence * 100).toFixed(0)}%`);
    }
  }

  // Save updated cemeteries
  fs.writeFileSync(CEMETERY_FILE, JSON.stringify(cemeteries, null, 2));
  console.log(`\n💾 Saved to ${CEMETERY_FILE}`);

  // Also update public data
  fs.writeFileSync(PUBLIC_CEMETERY_FILE, JSON.stringify(cemeteries, null, 2));
  console.log(`💾 Saved to ${PUBLIC_CEMETERY_FILE}`);

  // Save merge log
  fs.writeFileSync(MERGE_LOG_FILE, JSON.stringify(stats, null, 2));
  console.log(`💾 Saved merge log to ${MERGE_LOG_FILE}`);

  console.log('\n✅ Done! Discovery data merged into cemetery records.');
}

main().catch(console.error);
