#!/usr/bin/env npx tsx
/**
 * Merge Discovery Data into Belgian Cemeteries Database
 *
 * Converts discovered Belgian cemetery data into the main format and creates
 * a new begraafplaatsen-belgie.json file.
 *
 * Unlike the Dutch merge script, this creates NEW entries from discovery
 * since there's no existing Belgian data.
 *
 * Features:
 * - Creates slug from name + plaats
 * - Determines type based on name/categories
 * - Handles Dutch (NL), French (FR), and bilingual (NL/FR) entries
 * - Quality checks for data completeness
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DISCOVERED_FILE = path.join(DATA_DIR, 'discovery', 'discovered-cemeteries-belgium.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'begraafplaatsen-belgie.json');
const PUBLIC_OUTPUT_FILE = path.join(process.cwd(), 'public', 'data', 'cemeteries-belgium.json');
const MERGE_LOG_FILE = path.join(DATA_DIR, 'merge-log-belgium.json');

interface DiscoveredCemeteryBelgium {
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
  regio?: 'Vlaanderen' | 'Wallonië' | 'Brussel';
  land: 'België';
  postcode?: string;
  rating?: number;
  review_count?: number;
  business_type?: string;
  categories?: string[];
  opening_hours?: any;
  photo_url?: string;
  facilities?: string[];
  reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date?: string;
  }>;
  search_query: string;
  search_language: 'nl' | 'fr' | 'nl/fr';
  discovered_location_id: string;
  discovered_at: string;
}

interface CemeteryBelgium {
  slug: string;
  naam_begraafplaats: string;
  naam_fr?: string;  // French name for Wallonia
  gemeente: string;
  provincie: string;
  regio: 'Vlaanderen' | 'Wallonië' | 'Brussel';
  land: 'België';
  taal: 'nl' | 'fr' | 'nl/fr';
  type: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gps_coordinaten?: string;
  google_rating?: number;
  google_review_count?: number;
  google_place_id?: string;
  google_cid?: string;
  openingstijden?: string;
  telefoon?: string;
  website?: string;
  foto_url?: string;
  faciliteiten?: string;
  embeddedReviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date?: string;
  }>;
}

interface MergeStats {
  total_discovered: number;
  total_created: number;
  duplicates_removed: number;
  per_regio: {
    Vlaanderen: number;
    Wallonië: number;
    Brussel: number;
  };
  per_type: Record<string, number>;
  with_rating: number;
  with_photo: number;
  with_reviews: number;
  with_gps: number;
  with_opening_hours: number;
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
    .replace(/\s*\|\s*(?:uitvaartcentrum|begraafplaats|crematorium|cimetière|funérarium).*$/i, '')
    .replace(/\s*-\s*(?:uitvaartcentrum|begraafplaats|crematorium|cimetière|funérarium).*$/i, '')
    .replace(/\s*,.*$/, '')
    .trim();
}

/**
 * Determine cemetery type based on name and categories
 * Supports both Dutch and French terminology
 */
function determineType(name: string, categories?: string[], language?: string): string {
  const nameLower = name.toLowerCase();
  const catLower = (categories || []).map(c => c.toLowerCase());

  // Check for specific types (Dutch + French)
  if (nameLower.includes('natuur') || nameLower.includes('naturel') ||
      catLower.some(c => c.includes('natuur') || c.includes('naturel'))) {
    return 'natuurbegraafplaats';
  }

  if (nameLower.includes('joods') || nameLower.includes('juif') ||
      nameLower.includes('israël') || nameLower.includes('israélit') ||
      catLower.some(c => c.includes('joods') || c.includes('juif'))) {
    return 'joodse begraafplaats';
  }

  if (nameLower.includes('islam') || nameLower.includes('muslim') ||
      nameLower.includes('musulman') ||
      catLower.some(c => c.includes('islam') || c.includes('muslim'))) {
    return 'islamitische begraafplaats';
  }

  if (nameLower.includes('oorlog') || nameLower.includes('militair') ||
      nameLower.includes('militaire') || nameLower.includes('guerre') ||
      nameLower.includes('commonwealth') || nameLower.includes('war') ||
      catLower.some(c => c.includes('oorlog') || c.includes('military') || c.includes('militaire'))) {
    return 'oorlogsbegraafplaats';
  }

  if (nameLower.includes('cremator') || nameLower.includes('crémator') ||
      catLower.some(c => c.includes('cremator') || c.includes('crémator'))) {
    return 'crematorium';
  }

  // Default based on language
  return 'algemene begraafplaats';
}

/**
 * Format opening hours to readable string
 */
function formatOpeningHours(hours: any): string | undefined {
  if (!hours) return undefined;

  if (typeof hours === 'string') {
    return hours;
  }

  // If it's an object with work_status or similar
  if (hours.work_status) {
    return hours.work_status;
  }

  // If it's an array of hours per day
  if (Array.isArray(hours)) {
    return hours.join(', ');
  }

  return undefined;
}

// ============================================================================
// Main Processing
// ============================================================================

async function main() {
  console.log('🇧🇪 Merging Belgian discovery data...\n');

  // Load discovered cemeteries
  if (!fs.existsSync(DISCOVERED_FILE)) {
    console.error('❌ Discovered cemeteries file not found:', DISCOVERED_FILE);
    console.log('   Run discover-cemeteries-belgium.ts first');
    process.exit(1);
  }

  const discovered: DiscoveredCemeteryBelgium[] = JSON.parse(fs.readFileSync(DISCOVERED_FILE, 'utf-8'));
  console.log(`📥 Loaded ${discovered.length} discovered entries`);

  // Track stats
  const stats: MergeStats = {
    total_discovered: discovered.length,
    total_created: 0,
    duplicates_removed: 0,
    per_regio: {
      Vlaanderen: 0,
      Wallonië: 0,
      Brussel: 0,
    },
    per_type: {},
    with_rating: 0,
    with_photo: 0,
    with_reviews: 0,
    with_gps: 0,
    with_opening_hours: 0,
    timestamp: new Date().toISOString(),
  };

  // Process discovered entries, removing duplicates by CID
  const seenCids = new Set<string>();
  const seenSlugs = new Set<string>();
  const cemeteries: CemeteryBelgium[] = [];

  for (const d of discovered) {
    // Skip duplicates by CID
    if (seenCids.has(d.google_cid)) {
      stats.duplicates_removed++;
      continue;
    }
    seenCids.add(d.google_cid);

    // Clean name and generate slug
    const cleanedName = cleanName(d.name);
    const plaats = d.plaats || d.gemeente || '';
    let slug = generateSlug(cleanedName, plaats);

    // Handle duplicate slugs by appending a number
    let slugCounter = 1;
    while (seenSlugs.has(slug)) {
      slug = `${generateSlug(cleanedName, plaats)}-${slugCounter}`;
      slugCounter++;
    }
    seenSlugs.add(slug);

    // Determine type
    const type = determineType(d.name, d.categories, d.search_language);

    // Determine regio (use search location if not set)
    const regio = d.regio || 'Vlaanderen';

    // Create cemetery entry
    const cemetery: CemeteryBelgium = {
      slug,
      naam_begraafplaats: cleanedName,
      gemeente: d.gemeente || '',
      provincie: d.provincie || '',
      regio: regio,
      land: 'België',
      taal: d.search_language || 'nl',
      type,
      adres: d.address,
      postcode: d.postcode,
      plaats: d.plaats,
      google_cid: d.google_cid,
      google_place_id: d.google_place_id,
      google_rating: d.rating,
      google_review_count: d.review_count,
      telefoon: d.phone,
      website: d.website,
      foto_url: d.photo_url,
      faciliteiten: d.facilities?.join(', '),
      openingstijden: formatOpeningHours(d.opening_hours),
    };

    // Add GPS coordinates
    if (d.latitude && d.longitude) {
      cemetery.gps_coordinaten = `${d.latitude},${d.longitude}`;
    }

    // Add French name for Wallonia entries
    if (regio === 'Wallonië' || regio === 'Brussel') {
      cemetery.naam_fr = cleanedName;
    }

    // Add embedded reviews
    if (d.reviews && d.reviews.length > 0) {
      cemetery.embeddedReviews = d.reviews;
    }

    cemeteries.push(cemetery);

    // Update stats
    stats.total_created++;
    stats.per_regio[regio]++;
    stats.per_type[type] = (stats.per_type[type] || 0) + 1;

    if (cemetery.google_rating) stats.with_rating++;
    if (cemetery.foto_url) stats.with_photo++;
    if (cemetery.embeddedReviews && cemetery.embeddedReviews.length > 0) stats.with_reviews++;
    if (cemetery.gps_coordinaten) stats.with_gps++;
    if (cemetery.openingstijden) stats.with_opening_hours++;
  }

  // Sort by regio, then provincie, then gemeente
  cemeteries.sort((a, b) => {
    if (a.regio !== b.regio) return a.regio.localeCompare(b.regio);
    if (a.provincie !== b.provincie) return a.provincie.localeCompare(b.provincie);
    if (a.gemeente !== b.gemeente) return a.gemeente.localeCompare(b.gemeente);
    return a.naam_begraafplaats.localeCompare(b.naam_begraafplaats);
  });

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 MERGE RESULTS');
  console.log('='.repeat(60));
  console.log(`   Total discovered: ${stats.total_discovered}`);
  console.log(`   Total created: ${stats.total_created}`);
  console.log(`   Duplicates removed: ${stats.duplicates_removed}`);
  console.log('');
  console.log('   Per regio:');
  console.log(`     🇧🇪 Vlaanderen: ${stats.per_regio.Vlaanderen}`);
  console.log(`     🇧🇪 Wallonië: ${stats.per_regio.Wallonië}`);
  console.log(`     🇧🇪 Brussel: ${stats.per_regio.Brussel}`);
  console.log('');
  console.log('   Per type:');
  for (const [type, count] of Object.entries(stats.per_type).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${type}: ${count}`);
  }
  console.log('');
  console.log('   Data completeness:');
  console.log(`     📊 With rating: ${stats.with_rating} (${(stats.with_rating / stats.total_created * 100).toFixed(1)}%)`);
  console.log(`     📷 With photo: ${stats.with_photo} (${(stats.with_photo / stats.total_created * 100).toFixed(1)}%)`);
  console.log(`     💬 With reviews: ${stats.with_reviews} (${(stats.with_reviews / stats.total_created * 100).toFixed(1)}%)`);
  console.log(`     📍 With GPS: ${stats.with_gps} (${(stats.with_gps / stats.total_created * 100).toFixed(1)}%)`);
  console.log(`     🕐 With opening hours: ${stats.with_opening_hours} (${(stats.with_opening_hours / stats.total_created * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  // Ensure directories exist
  const dataDir = path.dirname(OUTPUT_FILE);
  const publicDir = path.dirname(PUBLIC_OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // Save output files
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cemeteries, null, 2));
  console.log(`\n💾 Saved to ${OUTPUT_FILE}`);

  fs.writeFileSync(PUBLIC_OUTPUT_FILE, JSON.stringify(cemeteries, null, 2));
  console.log(`💾 Saved to ${PUBLIC_OUTPUT_FILE}`);

  // Save merge log
  fs.writeFileSync(MERGE_LOG_FILE, JSON.stringify(stats, null, 2));
  console.log(`💾 Saved merge log to ${MERGE_LOG_FILE}`);

  // Show sample entries
  console.log('\n📋 Sample entries:');
  const samples = [
    cemeteries.find(c => c.regio === 'Vlaanderen'),
    cemeteries.find(c => c.regio === 'Wallonië'),
    cemeteries.find(c => c.regio === 'Brussel'),
  ].filter(Boolean);

  for (const sample of samples) {
    if (sample) {
      const icon = sample.regio === 'Vlaanderen' ? '🇳🇱' :
                   sample.regio === 'Wallonië' ? '🇫🇷' : '🇳🇱🇫🇷';
      console.log(`\n   ${icon} ${sample.naam_begraafplaats}`);
      console.log(`      Gemeente: ${sample.gemeente}, ${sample.provincie}`);
      console.log(`      Type: ${sample.type}`);
      console.log(`      Slug: ${sample.slug}`);
      if (sample.google_rating) console.log(`      Rating: ${sample.google_rating}⭐ (${sample.google_review_count} reviews)`);
    }
  }

  console.log('\n✅ Done! Belgian cemetery data ready.');
  console.log('\n🚀 Next steps:');
  console.log('   1. npx tsx scripts/enrich-osm-data.ts --land België');
  console.log('   2. npx tsx scripts/enrich-content-quality.ts --land België');
  console.log('   3. Add Belgium routes to Next.js app');
}

main().catch(console.error);
