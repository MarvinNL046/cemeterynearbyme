#!/usr/bin/env npx tsx
/**
 * Wikidata Scraper for Famous Deaths
 *
 * Fetches deceased Dutch and Belgian notable people from Wikidata
 * with their death dates, professions, and burial locations.
 *
 * Usage: npx tsx scripts/scrape-wikidata-deaths.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const WIKIDATA_ENDPOINT = 'https://query.wikidata.org/sparql';

// Simpler SPARQL queries - split by country for better performance
function getSparqlQuery(country: 'NL' | 'BE', offset: number = 0): string {
  const countryCode = country === 'NL' ? 'Q55' : 'Q31';
  const countryName = country === 'NL' ? 'Nederland' : 'België';

  return `
SELECT DISTINCT
  ?person ?personLabel
  ?birthDate ?deathDate
  ?occupationLabel
  ?burialPlaceLabel
  ?article
WHERE {
  # Person with this nationality
  ?person wdt:P27 wd:${countryCode}.

  # Must be a human
  ?person wdt:P31 wd:Q5.

  # Person who has died
  ?person wdt:P570 ?deathDate.

  # Filter: only people who died after 1950 (more relevant/known)
  FILTER(YEAR(?deathDate) >= 1950)

  # Get birth date
  OPTIONAL { ?person wdt:P569 ?birthDate. }

  # Get first occupation only
  OPTIONAL { ?person wdt:P106 ?occupation. }

  # Get burial place
  OPTIONAL { ?person wdt:P119 ?burialPlace. }

  # Get Dutch or English Wikipedia article (optional but preferred)
  OPTIONAL {
    ?article schema:about ?person;
             schema:isPartOf <https://nl.wikipedia.org/>.
  }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "nl,en". }
}
ORDER BY DESC(?deathDate)
LIMIT 2000
OFFSET ${offset}
`;
}

interface WikidataResult {
  person: { value: string };
  personLabel: { value: string };
  birthDate?: { value: string };
  deathDate: { value: string };
  occupationLabel?: { value: string };
  burialPlaceLabel?: { value: string };
  burialPlaceCoords?: { value: string };
  cityLabel?: { value: string };
  countryLabel?: { value: string };
  article?: { value: string };
  description?: { value: string };
}

interface FamousDeath {
  naam: string;
  geboortedatum: string;
  sterfdatum: string;
  sterfdag: number;
  sterfmaand: number;
  beroep: string;
  bekendheid: string;
  begraafplaats: string | null;
  plaats: string | null;
  provincie: string | null;
  land: string;
  wikipedia: string | null;
  begraafplaats_slug: string | null;
  wikidata_id: string;
}

async function fetchWikidataQuery(query: string): Promise<WikidataResult[]> {
  const url = `${WIKIDATA_ENDPOINT}?query=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/sparql-results+json',
      'User-Agent': 'BegraafplaatsInDeBuurt/1.0 (info@begraafplaatsindebuurt.nl)'
    }
  });

  if (!response.ok) {
    throw new Error(`Wikidata request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.results.bindings;
}

async function fetchWikidata(): Promise<{ results: WikidataResult[], country: string }[]> {
  console.log('🔍 Fetching data from Wikidata...\n');

  const allResults: { results: WikidataResult[], country: string }[] = [];

  // Fetch Dutch people
  console.log('🇳🇱 Fetching Dutch notable people...');
  try {
    const nlResults = await fetchWikidataQuery(getSparqlQuery('NL', 0));
    console.log(`   ✅ Found ${nlResults.length} Dutch results`);
    allResults.push({ results: nlResults, country: 'Nederland' });
  } catch (error) {
    console.error('   ❌ Error fetching Dutch data:', error);
  }

  // Small delay between requests
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Fetch Belgian people
  console.log('🇧🇪 Fetching Belgian notable people...');
  try {
    const beResults = await fetchWikidataQuery(getSparqlQuery('BE', 0));
    console.log(`   ✅ Found ${beResults.length} Belgian results`);
    allResults.push({ results: beResults, country: 'België' });
  } catch (error) {
    console.error('   ❌ Error fetching Belgian data:', error);
  }

  return allResults;
}

function parseDate(dateStr: string): { date: string; day: number; month: number } | null {
  try {
    // Wikidata dates are in ISO format: 2024-03-15T00:00:00Z
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return {
        date: `${match[1]}-${match[2]}-${match[3]}`,
        day: parseInt(match[3], 10),
        month: parseInt(match[2], 10)
      };
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
}

function extractWikidataId(uri: string): string {
  // Extract Q-number from URI like http://www.wikidata.org/entity/Q12345
  const match = uri.match(/Q\d+$/);
  return match ? match[0] : '';
}

function cleanOccupation(occupation: string | undefined): string {
  if (!occupation) return 'Bekende Nederlander';

  // Clean up common occupation labels
  const cleaned = occupation
    .replace(/^(a|an|the)\s+/i, '')
    .trim();

  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function processResults(resultSets: { results: WikidataResult[], country: string }[]): FamousDeath[] {
  // Group by person (to handle multiple occupations)
  const personMap = new Map<string, FamousDeath>();
  let totalRaw = 0;

  for (const { results, country } of resultSets) {
    console.log(`📊 Processing ${results.length} ${country} results...`);
    totalRaw += results.length;

    for (const result of results) {
      const wikidataId = extractWikidataId(result.person.value);
      const deathDate = parseDate(result.deathDate.value);

      if (!deathDate || !wikidataId) continue;

      // Skip if name looks like a Q-number (unresolved label)
      if (result.personLabel.value.startsWith('Q')) continue;

      const birthDate = result.birthDate ? parseDate(result.birthDate.value) : null;

      const existing = personMap.get(wikidataId);

      if (existing) {
        // Already have this person, skip
        continue;
      }

      personMap.set(wikidataId, {
        naam: result.personLabel.value,
        geboortedatum: birthDate?.date || '',
        sterfdatum: deathDate.date,
        sterfdag: deathDate.day,
        sterfmaand: deathDate.month,
        beroep: cleanOccupation(result.occupationLabel?.value),
        bekendheid: '',
        begraafplaats: result.burialPlaceLabel?.value || null,
        plaats: null,
        provincie: null,
        land: country,
        wikipedia: result.article?.value || null,
        begraafplaats_slug: null,
        wikidata_id: wikidataId
      });
    }
  }

  console.log(`\n✅ Processed ${totalRaw} raw results into ${personMap.size} unique people`);
  return Array.from(personMap.values());
}

function mergeWithExisting(newDeaths: FamousDeath[], existingPath: string): FamousDeath[] {
  let existing: FamousDeath[] = [];

  if (fs.existsSync(existingPath)) {
    const data = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
    existing = data.deaths || [];
    console.log(`📁 Found ${existing.length} existing entries`);
  }

  // Create a map of existing entries by name+death date for deduplication
  const existingMap = new Map<string, FamousDeath>();
  for (const death of existing) {
    const key = `${death.naam.toLowerCase()}-${death.sterfdatum}`;
    existingMap.set(key, death);
  }

  // Add new entries, preferring existing data (manually curated)
  let added = 0;
  for (const death of newDeaths) {
    const key = `${death.naam.toLowerCase()}-${death.sterfdatum}`;
    if (!existingMap.has(key)) {
      existingMap.set(key, death);
      added++;
    }
  }

  console.log(`✅ Added ${added} new entries`);

  // Sort by death date (most recent first)
  const merged = Array.from(existingMap.values());
  merged.sort((a, b) => {
    if (!a.sterfdatum) return 1;
    if (!b.sterfdatum) return -1;
    return b.sterfdatum.localeCompare(a.sterfdatum);
  });

  return merged;
}

function generateStats(deaths: FamousDeath[]) {
  // Count entries per day of year
  const dayCount = new Map<string, number>();
  for (const death of deaths) {
    if (death.sterfdag && death.sterfmaand) {
      const key = `${death.sterfmaand}-${death.sterfdag}`;
      dayCount.set(key, (dayCount.get(key) || 0) + 1);
    }
  }

  // Count with burial place
  const withBurial = deaths.filter(d => d.begraafplaats).length;

  // Count by country
  const byCountry = new Map<string, number>();
  for (const death of deaths) {
    byCountry.set(death.land, (byCountry.get(death.land) || 0) + 1);
  }

  console.log('\n📊 Statistics:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Total entries: ${deaths.length}`);
  console.log(`   Unique days covered: ${dayCount.size} / 366`);
  console.log(`   Coverage: ${((dayCount.size / 366) * 100).toFixed(1)}%`);
  console.log(`   With burial place: ${withBurial} (${((withBurial / deaths.length) * 100).toFixed(1)}%)`);
  console.log(`   By country:`);
  for (const [country, count] of byCountry) {
    console.log(`     - ${country}: ${count}`);
  }

  // Find days without entries
  const missingDays: string[] = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${month}-${day}`;
      if (!dayCount.has(key)) {
        missingDays.push(key);
      }
    }
  }

  if (missingDays.length > 0 && missingDays.length <= 30) {
    console.log(`\n   Days without entries (${missingDays.length}):`);
    console.log(`   ${missingDays.join(', ')}`);
  } else if (missingDays.length > 30) {
    console.log(`\n   ⚠️  ${missingDays.length} days still without entries`);
  }
}

async function main() {
  console.log('🇳🇱🇧🇪 Wikidata Famous Deaths Scraper');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Fetch from Wikidata
    const resultSets = await fetchWikidata();
    const totalResults = resultSets.reduce((sum, r) => sum + r.results.length, 0);
    console.log(`\n✅ Received ${totalResults} total results from Wikidata\n`);

    // Process results
    const deaths = processResults(resultSets);

    // Merge with existing data
    const dataPath = path.join(process.cwd(), 'data', 'famous-deaths.json');
    const merged = mergeWithExisting(deaths, dataPath);

    // Generate statistics
    generateStats(merged);

    // Save to file
    const output = {
      lastUpdated: new Date().toISOString(),
      source: 'Wikidata + manual curation',
      count: merged.length,
      deaths: merged
    };

    fs.writeFileSync(dataPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Saved to ${dataPath}`);

    // Also save a backup
    const backupPath = path.join(process.cwd(), 'data', `famous-deaths-backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(output, null, 2));
    console.log(`💾 Backup saved to ${backupPath}`);

    console.log('\n✨ Done!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
