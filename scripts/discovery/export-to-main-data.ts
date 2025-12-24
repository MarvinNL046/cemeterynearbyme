#!/usr/bin/env npx tsx
/**
 * Export discovered cemeteries naar de main begraafplaatsen.json
 *
 * Merged nieuwe gevonden begraafplaatsen met bestaande data,
 * voorkomt duplicaten, en genereert slugs.
 *
 * Gebruik:
 *   npx tsx scripts/discovery/export-to-main-data.ts              # Merge alles
 *   npx tsx scripts/discovery/export-to-main-data.ts --dry-run    # Preview
 *   npx tsx scripts/discovery/export-to-main-data.ts --skip-existing  # Alleen nieuwe
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// ============================================================================
// Fuzzy Matching Utilities
// ============================================================================

/**
 * Normalize string for comparison (removes accents, lowercase, strips common words)
 */
function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s]/g, ' ')    // Keep only alphanumeric
    .replace(/\b(begraafplaats|kerkhof|cemetery|algemene|gemeentelijke|oude|nieuwe|r\.?k\.?|rooms?[\s-]?katholieke?|protestantse?|hervormde?|st\.?|sint)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity between two strings (0-1)
 */
function similarity(str1: string, str2: string): number {
  const s1 = normalizeForMatch(str1);
  const s2 = normalizeForMatch(str2);

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;

  // Levenshtein-based similarity
  const maxLen = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  return 1 - (distance / maxLen);
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
        dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
      }
    }
  }
  return dp[m][n];
}
const DISCOVERY_DIR = path.join(DATA_DIR, 'discovery');
const DISCOVERED_FILE = path.join(DISCOVERY_DIR, 'discovered-cemeteries.json');
const MAIN_DATA_FILE = path.join(DATA_DIR, 'begraafplaatsen.json');
const PUBLIC_DATA_FILE = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');
const REVIEWS_DIR = path.join(DATA_DIR, 'reviews');

interface DiscoveredCemetery {
  google_cid: string;
  google_place_id?: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  plaats?: string;
  gemeente?: string;
  provincie?: string;
  postcode?: string;
  rating?: number;
  review_count?: number;
  business_type?: string;
  opening_hours?: any;
  reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date?: string;
  }>;
  discovered_at: string;
}

interface MainCemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  type: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gps_coordinaten?: string;
  telefoon?: string;
  website?: string;
  openingstijden?: string;
  google_rating?: number;
  google_review_count?: number;
  google_place_id?: string;
  // ... other fields
  [key: string]: any;
}

function generateSlug(name: string, plaats?: string): string {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  if (plaats) {
    const plaatsSlug = plaats
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // Only add plaats if not already in name
    if (!slug.includes(plaatsSlug)) {
      slug = `${slug}-${plaatsSlug}`;
    }
  }

  return slug;
}

function determineType(name: string, businessType?: string): string {
  const nameLower = name.toLowerCase();
  const typeLower = (businessType || '').toLowerCase();

  if (nameLower.includes('natuur') || typeLower.includes('natuur')) {
    return 'natuurbegraafplaats';
  }
  if (nameLower.includes('jood') || nameLower.includes('jewish')) {
    return 'joodse begraafplaats';
  }
  if (nameLower.includes('islam') || nameLower.includes('muslim')) {
    return 'islamitische begraafplaats';
  }
  if (nameLower.includes('rooms') || nameLower.includes('katholiek') || nameLower.includes('r.k.')) {
    return 'rooms-katholieke begraafplaats';
  }
  if (nameLower.includes('protestant') || nameLower.includes('hervormd')) {
    return 'protestantse begraafplaats';
  }

  return 'algemene begraafplaats';
}

function formatOpeningHours(hours: any): string | undefined {
  if (!hours) return undefined;

  if (typeof hours === 'string') return hours;

  if (Array.isArray(hours)) {
    return hours
      .filter(h => h && h.day && h.hours)
      .map(h => `${h.day}: ${h.hours}`)
      .join(', ');
  }

  if (typeof hours === 'object') {
    return Object.entries(hours)
      .map(([day, time]) => `${day}: ${time}`)
      .join(', ');
  }

  return undefined;
}

function convertToMainFormat(discovered: DiscoveredCemetery): MainCemetery {
  const slug = generateSlug(discovered.name, discovered.plaats);

  return {
    naam_begraafplaats: discovered.name,
    slug: slug,
    gemeente: discovered.gemeente || discovered.plaats || 'Onbekend',
    provincie: discovered.provincie || 'Onbekend',
    type: determineType(discovered.name, discovered.business_type),
    adres: discovered.address,
    postcode: discovered.postcode,
    plaats: discovered.plaats,
    gps_coordinaten: discovered.latitude && discovered.longitude
      ? `${discovered.latitude},${discovered.longitude}`
      : undefined,
    telefoon: discovered.phone,
    website: discovered.website,
    openingstijden: formatOpeningHours(discovered.opening_hours),
    google_rating: discovered.rating,
    google_review_count: discovered.review_count,
    google_place_id: discovered.google_cid, // We store CID here for reviews fetching
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    skipExisting: args.includes('--skip-existing'),
  };
}

async function main() {
  const options = parseArgs();

  console.log('📤 Export Discovered Cemeteries to Main Data\n');
  console.log('━'.repeat(50));

  // Load discovered cemeteries
  if (!fs.existsSync(DISCOVERED_FILE)) {
    console.error('❌ Geen discovered cemeteries gevonden.');
    console.log('   Run eerst: npx tsx scripts/discovery/discover-cemeteries.ts');
    process.exit(1);
  }

  const discovered: DiscoveredCemetery[] = JSON.parse(
    fs.readFileSync(DISCOVERED_FILE, 'utf-8')
  );

  console.log(`📥 Geladen: ${discovered.length} discovered cemeteries`);

  // Load existing main data
  let existing: MainCemetery[] = [];
  if (fs.existsSync(MAIN_DATA_FILE)) {
    existing = JSON.parse(fs.readFileSync(MAIN_DATA_FILE, 'utf-8'));
    console.log(`📥 Bestaand: ${existing.length} cemeteries in main data`);
  }

  // Build lookup maps
  const existingSlugs = new Set(existing.map(c => c.slug));
  const existingCids = new Set(
    existing
      .filter(c => c.google_place_id)
      .map(c => c.google_place_id)
  );

  // Build list for fuzzy matching (name + gemeente + provincie)
  const existingForFuzzy = existing.map(c => ({
    naam: c.naam_begraafplaats,
    gemeente: c.gemeente || '',
    provincie: c.provincie || '',
    slug: c.slug,
  }));

  /**
   * Find potential duplicate using fuzzy matching
   * Returns the slug if found, null otherwise
   */
  function findFuzzyDuplicate(name: string, gemeente: string, provincie: string): string | null {
    const SIMILARITY_THRESHOLD = 0.75;

    for (const existing of existingForFuzzy) {
      // Must be in same gemeente or provincie
      const sameGemeente = normalizeForMatch(existing.gemeente) === normalizeForMatch(gemeente);
      const sameProvincie = normalizeForMatch(existing.provincie) === normalizeForMatch(provincie);

      if (!sameGemeente && !sameProvincie) continue;

      // Check name similarity
      const nameSim = similarity(name, existing.naam);

      if (nameSim >= SIMILARITY_THRESHOLD) {
        return existing.slug;
      }

      // Also check if normalized names match exactly
      if (normalizeForMatch(name) === normalizeForMatch(existing.naam) && sameGemeente) {
        return existing.slug;
      }
    }

    return null;
  }

  // Process discovered cemeteries
  let added = 0;
  let updated = 0;
  let skipped = 0;
  let fuzzyMatched = 0;
  const newReviews: { slug: string; reviews: any[] }[] = [];

  for (const disc of discovered) {
    const converted = convertToMainFormat(disc);

    // Check 1: Exact CID match
    if (existingCids.has(disc.google_cid)) {
      if (options.skipExisting) {
        skipped++;
        continue;
      }

      // Update existing entry with new data
      const idx = existing.findIndex(c => c.google_place_id === disc.google_cid);
      if (idx >= 0) {
        // Update fields that might be missing
        if (!existing[idx].google_rating && converted.google_rating) {
          existing[idx].google_rating = converted.google_rating;
        }
        if (!existing[idx].google_review_count && converted.google_review_count) {
          existing[idx].google_review_count = converted.google_review_count;
        }
        if (!existing[idx].telefoon && converted.telefoon) {
          existing[idx].telefoon = converted.telefoon;
        }
        if (!existing[idx].website && converted.website) {
          existing[idx].website = converted.website;
        }
        updated++;
      }
      continue;
    }

    // Check 2: Fuzzy name match (catches "Begraafplaats X" vs "Algemene Begraafplaats X")
    const fuzzyMatch = findFuzzyDuplicate(
      disc.name,
      disc.gemeente || disc.plaats || '',
      disc.provincie || ''
    );

    if (fuzzyMatch) {
      fuzzyMatched++;
      // Optionally update the existing entry with CID
      const idx = existing.findIndex(c => c.slug === fuzzyMatch);
      if (idx >= 0 && !existing[idx].google_place_id) {
        existing[idx].google_place_id = disc.google_cid;
        if (!existing[idx].google_rating && converted.google_rating) {
          existing[idx].google_rating = converted.google_rating;
        }
        if (!existing[idx].google_review_count && converted.google_review_count) {
          existing[idx].google_review_count = converted.google_review_count;
        }
        updated++;
      }
      continue;
    }

    // Check for duplicate slugs
    let finalSlug = converted.slug;
    let counter = 1;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${converted.slug}-${counter}`;
      counter++;
    }
    converted.slug = finalSlug;

    // Add to existing
    existing.push(converted);
    existingSlugs.add(converted.slug);
    existingCids.add(disc.google_cid);
    added++;

    // Save reviews if any
    if (disc.reviews && disc.reviews.length > 0) {
      newReviews.push({
        slug: converted.slug,
        reviews: disc.reviews.map(r => ({
          reviewer_name: r.reviewer_name,
          rating: r.rating,
          review_text: r.review_text,
          review_date: r.review_date || new Date().toISOString(),
        }))
      });
    }
  }

  console.log(`\n📊 Resultaten:`);
  console.log(`   Nieuw toegevoegd: ${added}`);
  console.log(`   Bijgewerkt (CID match): ${updated}`);
  console.log(`   Fuzzy matched (naam): ${fuzzyMatched}`);
  console.log(`   Overgeslagen (exact): ${skipped}`);
  console.log(`   Reviews gevonden: ${newReviews.length}`);

  if (options.dryRun) {
    console.log('\n🧪 DRY RUN - Geen wijzigingen opgeslagen');

    if (added > 0) {
      console.log('\nVoorbeeld nieuwe entries:');
      const newEntries = existing.slice(-Math.min(5, added));
      newEntries.forEach(e => {
        console.log(`   - ${e.naam_begraafplaats} (${e.gemeente}, ${e.provincie})`);
        console.log(`     Slug: ${e.slug}`);
        console.log(`     Type: ${e.type}`);
      });
    }
    return;
  }

  // Save main data
  fs.writeFileSync(MAIN_DATA_FILE, JSON.stringify(existing, null, 2));
  fs.writeFileSync(PUBLIC_DATA_FILE, JSON.stringify(existing, null, 2));
  console.log(`\n💾 Main data opgeslagen: ${existing.length} totaal`);

  // Save reviews
  if (!fs.existsSync(REVIEWS_DIR)) {
    fs.mkdirSync(REVIEWS_DIR, { recursive: true });
  }

  let reviewsSaved = 0;
  for (const { slug, reviews } of newReviews) {
    const reviewFile = path.join(REVIEWS_DIR, `${slug}.json`);

    // Merge with existing reviews if any
    let existingReviews: any[] = [];
    if (fs.existsSync(reviewFile)) {
      try {
        existingReviews = JSON.parse(fs.readFileSync(reviewFile, 'utf-8'));
      } catch {}
    }

    // Dedupe by reviewer name
    const existingReviewers = new Set(existingReviews.map(r => r.reviewer_name));
    const newUniqueReviews = reviews.filter(r => !existingReviewers.has(r.reviewer_name));

    if (newUniqueReviews.length > 0) {
      const merged = [...existingReviews, ...newUniqueReviews];
      fs.writeFileSync(reviewFile, JSON.stringify(merged, null, 2));
      reviewsSaved++;
    }
  }

  console.log(`💾 Reviews opgeslagen: ${reviewsSaved} bestanden`);

  console.log('\n✅ Export voltooid!');
  console.log(`   ${MAIN_DATA_FILE}`);
  console.log(`   ${PUBLIC_DATA_FILE}`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
