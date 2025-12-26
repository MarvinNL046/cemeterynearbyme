/**
 * Match Famous Deaths to Cemeteries
 *
 * This script matches famous deaths from famous-deaths.json to cemeteries in cemeteries.json
 * using multiple matching strategies:
 * 1. Exact cemetery name match
 * 2. Fuzzy match (contains)
 * 3. City + State match when cemetery text partially matches
 */

import * as fs from 'fs';
import * as path from 'path';

interface FamousDeath {
  name: string;
  birth_date: string | null;
  death_date: string;
  death_day: number;
  death_month: number;
  profession: string;
  description: string;
  cemetery: string | null;
  city: string | null;
  state: string | null;
  country: string;
  wikipedia: string | null;
  cemetery_slug: string | null;
  wikidata_id: string;
}

interface FamousDeathsData {
  lastUpdated: string;
  source: string;
  count: number;
  deaths: FamousDeath[];
}

interface Cemetery {
  slug: string;
  name: string;
  city: string;
  state: string;
  state_abbr?: string;
  county?: string;
  country: string;
  type?: string;
}

interface MatchResult {
  confidence: 'exact' | 'high' | 'medium' | 'low';
  slug: string;
  matchedName: string;
  reason: string;
}

// Normalize string for comparison
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Remove common cemetery words for fuzzy matching
function removeCommonWords(str: string): string {
  return str
    .replace(/\b(cemetery|memorial|park|gardens?|mausoleum|national|veterans?|green-?wood|lawn|hills?|rest|eternal|peace|oak|forest|holy|cross|saint|st|mount|mt)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if two strings are similar enough
function areSimilar(a: string, b: string): boolean {
  const normA = normalize(a);
  const normB = normalize(b);

  // Exact match
  if (normA === normB) return true;

  // One contains the other
  if (normA.includes(normB) || normB.includes(normA)) return true;

  // Check significant word overlap
  const wordsA = new Set(normA.split(' ').filter(w => w.length > 2));
  const wordsB = new Set(normB.split(' ').filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return false;

  let overlap = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) overlap++;
  }

  const similarity = overlap / Math.min(wordsA.size, wordsB.size);
  return similarity >= 0.5;
}

// Build cemetery lookup indices
function buildCemeteryIndices(cemeteries: Cemetery[]) {
  const byExactName = new Map<string, Cemetery[]>();
  const byCity = new Map<string, Cemetery[]>();
  const byCityState = new Map<string, Cemetery[]>();

  // Filter out invalid cemeteries
  const validCemeteries = cemeteries.filter(c => isValidCemeteryName(c.name));
  const all = validCemeteries;

  console.log(`Filtered to ${validCemeteries.length} valid cemeteries (removed ${cemeteries.length - validCemeteries.length} invalid)`);

  for (const cemetery of validCemeteries) {
    // Index by normalized name
    const normName = normalize(cemetery.name);
    if (!byExactName.has(normName)) {
      byExactName.set(normName, []);
    }
    byExactName.get(normName)!.push(cemetery);

    // Index by city
    const normCity = normalize(cemetery.city);
    if (!byCity.has(normCity)) {
      byCity.set(normCity, []);
    }
    byCity.get(normCity)!.push(cemetery);

    // Index by city+state
    const cityState = `${normCity}|${normalize(cemetery.state)}`;
    if (!byCityState.has(cityState)) {
      byCityState.set(cityState, []);
    }
    byCityState.get(cityState)!.push(cemetery);
  }

  return { byExactName, byCity, byCityState, all };
}

// Get significant words from a cemetery name (excluding common terms)
function getSignificantWords(str: string): string[] {
  const commonWords = new Set([
    'cemetery', 'memorial', 'park', 'garden', 'gardens', 'mausoleum',
    'national', 'veterans', 'lawn', 'hills', 'rest', 'eternal', 'peace',
    'grove', 'view', 'the', 'of', 'and', 'at', 'in', 'mortuary'
  ]);

  return normalize(str)
    .split(' ')
    .filter(w => w.length > 2 && !commonWords.has(w));
}

// Check if cemetery name is valid (not just generic terms or bad data)
function isValidCemeteryName(name: string): boolean {
  const normalized = normalize(name);
  const significantWords = getSignificantWords(name);

  // Filter out bad data
  if (name.length < 5) return false;
  if (name === '!' || name.startsWith('!')) return false;

  // Filter out too-generic names
  const genericNames = [
    'cemetery', 'memorial park', 'memorial gardens', 'burial grounds',
    'graveyard', 'churchyard', 'mausoleum', 'crematorium', 'va'
  ];
  if (genericNames.includes(normalized)) return false;

  // Must have at least one significant word
  return significantWords.length > 0;
}

// Check if two cemetery names represent the same cemetery
function isSameCemetery(name1: string, name2: string): boolean {
  const words1 = getSignificantWords(name1);
  const words2 = getSignificantWords(name2);

  if (words1.length === 0 || words2.length === 0) return false;

  // All significant words from the shorter list must be in the longer list
  const shorter = words1.length <= words2.length ? words1 : words2;
  const longer = words1.length <= words2.length ? words2 : words1;
  const longerSet = new Set(longer);

  let matchCount = 0;
  for (const word of shorter) {
    if (longerSet.has(word)) matchCount++;
  }

  // Require at least 80% of significant words to match
  return matchCount >= Math.ceil(shorter.length * 0.8);
}

// Try to match a death's cemetery to our database
function matchCemetery(
  death: FamousDeath,
  indices: ReturnType<typeof buildCemeteryIndices>
): MatchResult | null {
  if (!death.cemetery) return null;

  const deathCemetery = death.cemetery;

  // Skip invalid cemetery values (like wikidata IDs or URLs)
  if (deathCemetery.startsWith('Q') ||
      deathCemetery.startsWith('http') ||
      deathCemetery.length < 5) {
    return null;
  }

  const normDeathCemetery = normalize(deathCemetery);
  const deathSignificantWords = getSignificantWords(deathCemetery);

  // Skip if no significant words (e.g., just "Cemetery" or "Memorial Park")
  if (deathSignificantWords.length === 0) {
    return null;
  }

  // Strategy 1: Exact name match
  const exactMatches = indices.byExactName.get(normDeathCemetery);
  if (exactMatches && exactMatches.length === 1) {
    return {
      confidence: 'exact',
      slug: exactMatches[0].slug,
      matchedName: exactMatches[0].name,
      reason: 'Exact name match'
    };
  }

  // If multiple exact matches, try to narrow by city/state
  if (exactMatches && exactMatches.length > 1 && death.city && death.state) {
    const cityMatch = exactMatches.find(c =>
      normalize(c.city) === normalize(death.city!) ||
      normalize(c.state) === normalize(death.state!)
    );
    if (cityMatch) {
      return {
        confidence: 'exact',
        slug: cityMatch.slug,
        matchedName: cityMatch.name,
        reason: 'Exact name + location match'
      };
    }
  }

  // Strategy 2: Same cemetery check with significant words
  // First, if we have location info, prioritize local matches
  if (death.city && death.state) {
    const normCity = normalize(death.city);
    const normState = normalize(death.state);

    // Check cemeteries in the same city first
    const localCemeteries = indices.byCity.get(normCity) || [];
    for (const cemetery of localCemeteries) {
      if (isSameCemetery(cemetery.name, deathCemetery)) {
        return {
          confidence: 'high',
          slug: cemetery.slug,
          matchedName: cemetery.name,
          reason: 'Same cemetery (city match)'
        };
      }
    }

    // Then check state-level matches
    for (const cemetery of indices.all) {
      if (normalize(cemetery.state) === normState ||
          normalize(cemetery.state_abbr || '') === normState) {
        if (isSameCemetery(cemetery.name, deathCemetery)) {
          return {
            confidence: 'high',
            slug: cemetery.slug,
            matchedName: cemetery.name,
            reason: 'Same cemetery (state match)'
          };
        }
      }
    }
  }

  // Strategy 3: Famous cemeteries with unique names (no location needed)
  const famousCemeteries: Record<string, { pattern: string; slugPart: string }[]> = {
    'hollywood forever': [{ pattern: 'hollywood forever', slugPart: 'hollywood-forever-cemetery' }],
    'arlington national': [{ pattern: 'arlington national', slugPart: 'arlington-national-cemetery' }],
    'greenwood': [{ pattern: 'green-wood', slugPart: 'green-wood-cemetery' }, { pattern: 'greenwood', slugPart: 'green-wood-cemetery' }],
    'forest lawn': [{ pattern: 'forest lawn', slugPart: 'forest-lawn-memorial' }],
    'westwood village': [{ pattern: 'westwood village', slugPart: 'westwood-village-memorial' }],
    'hillside memorial': [{ pattern: 'hillside memorial', slugPart: 'hillside-memorial' }],
    'mount auburn': [{ pattern: 'mount auburn', slugPart: 'mount-auburn-cemetery' }],
    'woodlawn': [{ pattern: 'woodlawn', slugPart: 'woodlawn-cemetery' }],
    'congressional': [{ pattern: 'congressional', slugPart: 'congressional-cemetery' }],
    'evergreen': [{ pattern: 'evergreen cemetery', slugPart: 'evergreen-cemetery' }],
    'calvary': [{ pattern: 'calvary cemetery', slugPart: 'calvary-cemetery' }],
    'holy cross': [{ pattern: 'holy cross cemetery', slugPart: 'holy-cross-cemetery' }],
    'gate of heaven': [{ pattern: 'gate of heaven', slugPart: 'gate-of-heaven' }],
  };

  for (const [, patterns] of Object.entries(famousCemeteries)) {
    for (const { pattern, slugPart } of patterns) {
      if (normDeathCemetery.includes(pattern)) {
        // Find matching cemetery
        const match = indices.all.find(c => c.slug.includes(slugPart));
        if (match) {
          return {
            confidence: 'medium',
            slug: match.slug,
            matchedName: match.name,
            reason: 'Famous cemetery pattern match'
          };
        }
      }
    }
  }

  // Strategy 4: Fallback - look for strong name matches across all cemeteries
  for (const cemetery of indices.all) {
    if (isSameCemetery(cemetery.name, deathCemetery)) {
      // Only accept if the match is strong (multiple significant words)
      const cemeterySignificantWords = getSignificantWords(cemetery.name);
      if (cemeterySignificantWords.length >= 2 && deathSignificantWords.length >= 2) {
        return {
          confidence: 'low',
          slug: cemetery.slug,
          matchedName: cemetery.name,
          reason: 'Strong name match (multiple significant words)'
        };
      }
    }
  }

  return null;
}

async function main() {
  console.log('Loading data files...');

  // Load famous deaths
  const deathsPath = path.join(__dirname, '..', 'data', 'famous-deaths.json');
  const deathsData: FamousDeathsData = JSON.parse(
    fs.readFileSync(deathsPath, 'utf-8')
  );

  // Load cemeteries
  const cemeteriesPath = path.join(__dirname, '..', 'data', 'cemeteries.json');
  const cemeteries: Cemetery[] = JSON.parse(
    fs.readFileSync(cemeteriesPath, 'utf-8')
  );

  console.log(`Loaded ${deathsData.deaths.length} famous deaths`);
  console.log(`Loaded ${cemeteries.length} cemeteries`);

  // Build indices
  console.log('\nBuilding cemetery indices...');
  const indices = buildCemeteryIndices(cemeteries);

  // Count deaths that have cemetery info
  const deathsWithCemetery = deathsData.deaths.filter(d => d.cemetery && !d.cemetery.startsWith('Q') && !d.cemetery.startsWith('http'));
  console.log(`\nDeaths with cemetery info: ${deathsWithCemetery.length}`);

  // Match deaths to cemeteries
  console.log('\nMatching deaths to cemeteries...');

  const stats = {
    total: deathsData.deaths.length,
    withCemetery: deathsWithCemetery.length,
    matched: 0,
    exact: 0,
    high: 0,
    medium: 0,
    low: 0,
    unmatched: 0
  };

  const matchedDeaths: { death: FamousDeath; match: MatchResult }[] = [];
  const unmatchedCemeteries = new Set<string>();

  for (const death of deathsData.deaths) {
    const match = matchCemetery(death, indices);

    if (match) {
      death.cemetery_slug = match.slug;
      stats.matched++;
      stats[match.confidence]++;
      matchedDeaths.push({ death, match });
    } else if (death.cemetery && !death.cemetery.startsWith('Q') && !death.cemetery.startsWith('http')) {
      stats.unmatched++;
      unmatchedCemeteries.add(death.cemetery);
    }
  }

  // Update the deaths data with matches
  deathsData.lastUpdated = new Date().toISOString();

  // Save updated deaths data
  console.log('\nSaving updated famous-deaths.json...');
  fs.writeFileSync(deathsPath, JSON.stringify(deathsData, null, 2));

  // Print results
  console.log('\n=== MATCHING RESULTS ===');
  console.log(`Total deaths: ${stats.total}`);
  console.log(`Deaths with cemetery info: ${stats.withCemetery}`);
  console.log(`\nMatched: ${stats.matched} (${(stats.matched / stats.withCemetery * 100).toFixed(1)}% of those with cemetery info)`);
  console.log(`  - Exact matches: ${stats.exact}`);
  console.log(`  - High confidence: ${stats.high}`);
  console.log(`  - Medium confidence: ${stats.medium}`);
  console.log(`  - Low confidence: ${stats.low}`);
  console.log(`\nUnmatched: ${stats.unmatched}`);

  // Show sample matches
  console.log('\n=== SAMPLE MATCHES ===');
  const sampleSize = 20;
  const samples = matchedDeaths.slice(0, sampleSize);

  for (const { death, match } of samples) {
    console.log(`\n"${death.name}" (${death.profession})`);
    console.log(`  Cemetery: ${death.cemetery}`);
    console.log(`  Matched: ${match.matchedName}`);
    console.log(`  Slug: ${match.slug}`);
    console.log(`  Confidence: ${match.confidence}`);
    console.log(`  Reason: ${match.reason}`);
  }

  // Show unmatched cemeteries
  if (unmatchedCemeteries.size > 0) {
    console.log('\n=== SAMPLE UNMATCHED CEMETERIES ===');
    const unmatchedArray = Array.from(unmatchedCemeteries).slice(0, 30);
    for (const cemetery of unmatchedArray) {
      console.log(`  - ${cemetery}`);
    }
    if (unmatchedCemeteries.size > 30) {
      console.log(`  ... and ${unmatchedCemeteries.size - 30} more`);
    }
  }

  // Show cemeteries with most notable burials
  console.log('\n=== CEMETERIES WITH MOST NOTABLE BURIALS ===');
  const cemeteryBurialCount = new Map<string, number>();
  for (const death of deathsData.deaths) {
    if (death.cemetery_slug) {
      cemeteryBurialCount.set(
        death.cemetery_slug,
        (cemeteryBurialCount.get(death.cemetery_slug) || 0) + 1
      );
    }
  }

  const topCemeteries = Array.from(cemeteryBurialCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  for (const [slug, count] of topCemeteries) {
    const cemetery = cemeteries.find(c => c.slug === slug);
    console.log(`  ${count} burials: ${cemetery?.name || slug}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);
