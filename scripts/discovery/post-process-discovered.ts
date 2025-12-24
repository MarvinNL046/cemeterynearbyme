#!/usr/bin/env npx tsx
/**
 * Post-Process Discovered Cemeteries
 *
 * Transforms discovered cemetery data into website-ready format:
 * - Generates slugs
 * - Detects cemetery type from name
 * - Normalizes gemeente/provincie
 * - Filters out non-cemetery results (uitvaartcentra, dieren, etc.)
 * - Generates basic content fields
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DISCOVERED_FILE = path.join(DATA_DIR, 'discovery', 'discovered-cemeteries.json');
const MAIN_DATA_FILE = path.join(DATA_DIR, 'begraafplaatsen.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'begraafplaatsen.json');

// Type definitions
interface DiscoveredCemetery {
  google_cid: string;
  google_place_id: string;
  name: string;
  address: string;
  phone?: string;
  latitude: number;
  longitude: number;
  plaats: string;
  gemeente: string;
  provincie: string;
  rating?: number;
  review_count?: number;
  business_type?: string;
  opening_hours?: string;
  search_query: string;
  discovered_at: string;
  postcode?: string;
}

interface WebsiteCemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  adres?: string;
  postcode?: string;
  plaats: string;
  gps_coordinaten?: string;
  telefoon?: string;
  openingstijden?: string;
  slug: string;
  google_rating?: number;
  google_review_count?: number;
  google_place_id?: string;
  google_cid?: string;
  status: string;
  bron: string;
}

// Exclusion patterns - these are NOT cemeteries
const EXCLUSION_PATTERNS = [
  /dieren/i,
  /huisdier/i,
  /hond/i,
  /kat/i,
  /anubis/i,
  /pet/i,
  /ab-ire/i,
  /uitvaart(?:centrum|dienst|verzorging|verzekering|onderneming|branche)/i,
  /crematori(?:um|a)$/i,  // Only exclude if name ends with crematorium
  /steenhouw/i,
  /monument(?:en)?maker/i,
  /grafste(?:en|nen)/i,
  /bloem/i,
  /krans/i,
  /rouw/i,
  /begrafenis(?:ondernemer|vereniging)/i,
  /verzekering/i,
  /notaris/i,
  /advocaat/i,
  /testament/i,
];

// Inclusion patterns - these ARE cemeteries (override exclusions)
const INCLUSION_PATTERNS = [
  /begraafplaats/i,
  /kerkhof/i,
  /cemetery/i,
  /graveyard/i,
  /^r\.?k\.?\s/i,
  /rooms[\s-]?katholiek/i,
  /protestant/i,
  /joods/i,
  /jewish/i,
  /islamitisch/i,
  /muslim/i,
  /oorlog/i,
  /war\s?grave/i,
  /natuur\s?begraaf/i,
  /algemene\s?begraaf/i,
];

// Type detection patterns
const TYPE_PATTERNS: { pattern: RegExp; type: string }[] = [
  { pattern: /joods|joodse|jewish|israelitisch/i, type: 'joodse begraafplaats' },
  { pattern: /islamitisch|muslim|moslim|moskeë/i, type: 'islamitische begraafplaats' },
  { pattern: /natuur|bos|eco|groen/i, type: 'natuurbegraafplaats' },
  { pattern: /r\.?k\.?|rooms[\s-]?katholiek|parochie|sint|st\.|heilig/i, type: 'rooms-katholieke begraafplaats' },
  { pattern: /protestant|hervormd|gereformeerd|luthers/i, type: 'protestantse begraafplaats' },
  { pattern: /oorlog|war|military|soldaat|veteraan|airborne/i, type: 'oorlogsbegraafplaats' },
  { pattern: /crematori/i, type: 'crematorium' },
];

// Province name normalization (lowercase key -> proper case)
const PROVINCE_MAPPING: Record<string, string> = {
  'noord-holland': 'Noord-Holland',
  'zuid-holland': 'Zuid-Holland',
  'noord-brabant': 'Noord-Brabant',
  'limburg': 'Limburg',
  'gelderland': 'Gelderland',
  'overijssel': 'Overijssel',
  'flevoland': 'Flevoland',
  'utrecht': 'Utrecht',
  'drenthe': 'Drenthe',
  'groningen': 'Groningen',
  'friesland': 'Friesland',
  'fryslân': 'Friesland',
  'zeeland': 'Zeeland',
};

function normalizeProvince(province: string): string {
  const normalized = PROVINCE_MAPPING[province.toLowerCase()];
  return normalized || province;
}

function generateSlug(name: string, plaats: string): string {
  const combined = `${name} ${plaats}`;
  return combined
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Remove duplicate hyphens
    .replace(/^-|-$/g, '')           // Trim hyphens
    .substring(0, 100);              // Limit length
}

function detectType(name: string, searchQuery: string): string {
  // Check name first
  for (const { pattern, type } of TYPE_PATTERNS) {
    if (pattern.test(name)) {
      return type;
    }
  }

  // Check search query as fallback
  for (const { pattern, type } of TYPE_PATTERNS) {
    if (pattern.test(searchQuery)) {
      return type;
    }
  }

  return 'algemene begraafplaats';
}

function isCemetery(item: DiscoveredCemetery): boolean {
  const name = item.name.toLowerCase();
  const businessType = (item.business_type || '').toLowerCase();

  // First check if it's explicitly a cemetery
  for (const pattern of INCLUSION_PATTERNS) {
    if (pattern.test(name) || pattern.test(businessType)) {
      return true;
    }
  }

  // Check exclusion patterns
  for (const pattern of EXCLUSION_PATTERNS) {
    if (pattern.test(name)) {
      return false;
    }
  }

  // If business type is "Begraafplaats", include it
  if (businessType.includes('begraafplaats')) {
    return true;
  }

  // Default: if it came from cemetery search, likely is one
  const cemeteryQueries = ['begraafplaats', 'kerkhof', 'cemetery', 'natuurbegraafplaats'];
  if (cemeteryQueries.some(q => item.search_query.toLowerCase().includes(q))) {
    return true;
  }

  return false;
}

function cleanName(name: string): string {
  // Remove common suffixes like "| begraafplaats in Almere"
  return name
    .replace(/\s*\|\s*(?:uitvaartcentrum|begraafplaats|crematorium).*$/i, '')
    .replace(/\s*-\s*(?:uitvaartcentrum|begraafplaats|crematorium).*$/i, '')
    .trim();
}

function extractAddress(fullAddress: string | undefined): { adres: string; postcode: string } {
  if (!fullAddress) {
    return { adres: '', postcode: '' };
  }
  // Parse "Kruidenweg 3, 1312 SR Almere, Nederland"
  const parts = fullAddress.split(',').map(p => p.trim());
  const adres = parts[0] || '';

  // Extract postcode from second part
  const postcodeMatch = parts[1]?.match(/(\d{4}\s*[A-Z]{2})/);
  const postcode = postcodeMatch ? postcodeMatch[1] : '';

  return { adres, postcode };
}

function transformToWebsiteFormat(discovered: DiscoveredCemetery): WebsiteCemetery {
  const cleanedName = cleanName(discovered.name);
  const { adres, postcode } = extractAddress(discovered.address);

  return {
    naam_begraafplaats: cleanedName,
    gemeente: discovered.gemeente,
    provincie: normalizeProvince(discovered.provincie),
    type: detectType(discovered.name, discovered.search_query),
    adres: adres || undefined,
    postcode: postcode || discovered.postcode || undefined,
    plaats: discovered.plaats,
    gps_coordinaten: `${discovered.latitude},${discovered.longitude}`,
    telefoon: discovered.phone || undefined,
    openingstijden: discovered.opening_hours || undefined,
    slug: generateSlug(cleanedName, discovered.plaats),
    google_rating: discovered.rating,
    google_review_count: discovered.review_count,
    google_place_id: discovered.google_place_id,
    google_cid: discovered.google_cid,
    status: 'Discovered',
    bron: 'Google Maps Discovery',
  };
}

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

function isSimilar(name1: string, name2: string, threshold: number = 0.8): boolean {
  const n1 = name1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n2 = name2.toLowerCase().replace(/[^a-z0-9]/g, '');

  const maxLen = Math.max(n1.length, n2.length);
  if (maxLen === 0) return true;

  const distance = levenshteinDistance(n1, n2);
  const similarity = 1 - distance / maxLen;

  return similarity >= threshold;
}

async function main() {
  console.log('🔄 Post-processing discovered cemeteries...\n');

  // Load discovered cemeteries
  if (!fs.existsSync(DISCOVERED_FILE)) {
    console.error('❌ Discovered cemeteries file not found:', DISCOVERED_FILE);
    process.exit(1);
  }

  const discovered: DiscoveredCemetery[] = JSON.parse(fs.readFileSync(DISCOVERED_FILE, 'utf-8'));
  console.log(`📥 Loaded ${discovered.length} discovered entries`);

  // Load existing cemeteries
  let existing: WebsiteCemetery[] = [];
  if (fs.existsSync(MAIN_DATA_FILE)) {
    existing = JSON.parse(fs.readFileSync(MAIN_DATA_FILE, 'utf-8'));
    console.log(`📥 Loaded ${existing.length} existing cemeteries`);
  }

  // Filter to only cemeteries
  const cemeteries = discovered.filter(isCemetery);
  const filtered = discovered.length - cemeteries.length;
  console.log(`\n🔍 Filtered out ${filtered} non-cemetery entries`);
  console.log(`✅ ${cemeteries.length} valid cemeteries to process`);

  // Transform to website format
  const transformed = cemeteries.map(transformToWebsiteFormat);

  // Count by type
  const typeCounts: Record<string, number> = {};
  transformed.forEach(c => {
    typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
  });

  console.log('\n📊 Types detected:');
  Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

  // Deduplicate against existing
  const existingSlugs = new Set(existing.map(c => c.slug));
  const existingNames = existing.map(c => ({
    name: c.naam_begraafplaats,
    gemeente: c.gemeente,
  }));

  const newCemeteries: WebsiteCemetery[] = [];
  const duplicates: string[] = [];

  for (const cemetery of transformed) {
    // Check slug
    if (existingSlugs.has(cemetery.slug)) {
      duplicates.push(`${cemetery.naam_begraafplaats} (slug exists)`);
      continue;
    }

    // Check fuzzy name match in same gemeente
    const isDuplicate = existingNames.some(e =>
      e.gemeente.toLowerCase() === cemetery.gemeente.toLowerCase() &&
      isSimilar(e.name, cemetery.naam_begraafplaats, 0.85)
    );

    if (isDuplicate) {
      duplicates.push(`${cemetery.naam_begraafplaats} (similar name in ${cemetery.gemeente})`);
      continue;
    }

    // Also check against newly added
    const isInternalDuplicate = newCemeteries.some(n =>
      n.gemeente.toLowerCase() === cemetery.gemeente.toLowerCase() &&
      isSimilar(n.naam_begraafplaats, cemetery.naam_begraafplaats, 0.85)
    );

    if (isInternalDuplicate) {
      duplicates.push(`${cemetery.naam_begraafplaats} (duplicate in batch)`);
      continue;
    }

    newCemeteries.push(cemetery);
  }

  console.log(`\n🔄 Deduplication results:`);
  console.log(`   ${duplicates.length} duplicates found`);
  console.log(`   ${newCemeteries.length} new unique cemeteries`);

  if (duplicates.length > 0 && duplicates.length <= 20) {
    console.log('\n   Duplicates:');
    duplicates.forEach(d => console.log(`   - ${d}`));
  } else if (duplicates.length > 20) {
    console.log(`\n   (Showing first 20 duplicates)`);
    duplicates.slice(0, 20).forEach(d => console.log(`   - ${d}`));
  }

  // Normalize provinces in existing data too
  const normalizedExisting = existing.map(c => ({
    ...c,
    provincie: normalizeProvince(c.provincie),
  }));

  // Merge with existing
  const merged = [...normalizedExisting, ...newCemeteries];

  // Sort by provincie, then gemeente, then naam
  merged.sort((a, b) => {
    if (a.provincie !== b.provincie) return a.provincie.localeCompare(b.provincie);
    if (a.gemeente !== b.gemeente) return a.gemeente.localeCompare(b.gemeente);
    return a.naam_begraafplaats.localeCompare(b.naam_begraafplaats);
  });

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));
  console.log(`\n💾 Written ${merged.length} cemeteries to ${OUTPUT_FILE}`);

  // Also copy to public/data for frontend
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  if (fs.existsSync(publicDataDir)) {
    fs.writeFileSync(
      path.join(publicDataDir, 'cemeteries.json'),
      JSON.stringify(merged, null, 2)
    );
    console.log(`💾 Synced to public/data/cemeteries.json`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`   Original discovered: ${discovered.length}`);
  console.log(`   Filtered (non-cemetery): ${filtered}`);
  console.log(`   Duplicates removed: ${duplicates.length}`);
  console.log(`   New cemeteries added: ${newCemeteries.length}`);
  console.log(`   Total in database: ${merged.length}`);
  console.log('='.repeat(50));

  // Province breakdown
  const provinceCount: Record<string, number> = {};
  merged.forEach(c => {
    provinceCount[c.provincie] = (provinceCount[c.provincie] || 0) + 1;
  });

  console.log('\n📍 Cemeteries per province:');
  Object.entries(provinceCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([prov, count]) => {
      console.log(`   ${prov}: ${count}`);
    });
}

main().catch(console.error);
