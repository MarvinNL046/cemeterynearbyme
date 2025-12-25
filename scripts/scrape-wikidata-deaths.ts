#!/usr/bin/env npx tsx
/**
 * Wikidata Scraper for Famous American Deaths
 *
 * Fetches deceased American notable people from Wikidata
 * with their death dates, professions, and burial locations.
 *
 * Usage: npx tsx scripts/scrape-wikidata-deaths.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const WIKIDATA_ENDPOINT = 'https://query.wikidata.org/sparql';

// Configuration
const START_YEAR = new Date().getFullYear(); // Current year (dynamic)
const END_YEAR = 1800; // Go back to 1800 for rich historical data

// SPARQL query for American deceased notable people
function getSparqlQuery(year: number): string {
  return `
SELECT DISTINCT
  ?person ?personLabel
  ?birthDate ?deathDate
  ?occupationLabel
  ?burialPlaceLabel
WHERE {
  ?person wdt:P27 wd:Q30 .
  ?person wdt:P31 wd:Q5 .
  ?person wdt:P570 ?deathDate .
  FILTER(YEAR(?deathDate) = ${year})
  OPTIONAL { ?person wdt:P569 ?birthDate . }
  OPTIONAL { ?person wdt:P106 ?occupation . }
  OPTIONAL { ?person wdt:P119 ?burialPlace . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
LIMIT 500
`;
}

interface WikidataResult {
  person: { value: string };
  personLabel: { value: string };
  birthDate?: { value: string };
  deathDate: { value: string };
  occupationLabel?: { value: string };
  burialPlaceLabel?: { value: string };
  article?: { value: string };
}

interface FamousDeath {
  name: string;
  birth_date: string;
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

async function fetchWikidataQuery(query: string): Promise<WikidataResult[]> {
  // Use POST for longer queries
  const response = await fetch(WIKIDATA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'CemeteryNearMe/1.0 (https://cemeterynearbyme.com; info@cemeterynearbyme.com)'
    },
    body: `query=${encodeURIComponent(query)}`
  });

  if (!response.ok) {
    throw new Error(`Wikidata request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.results.bindings;
}

async function fetchWikidata(): Promise<WikidataResult[]> {
  console.log('🔍 Fetching data from Wikidata...\n');
  console.log(`📅 Fetching from ${START_YEAR} back to ${END_YEAR} (${START_YEAR - END_YEAR + 1} years)\n`);

  const allResults: WikidataResult[] = [];

  // Fetch year by year (smaller queries = faster)
  for (let year = START_YEAR; year >= END_YEAR; year--) {
    try {
      const results = await fetchWikidataQuery(getSparqlQuery(year));
      if (results.length > 0) {
        console.log(`🇺🇸 ${year}: ${results.length} notable Americans`);
        allResults.push(...results);
      }
      // Rate limiting - 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error for ${year}:`, error);
      // Wait and retry once
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        const results = await fetchWikidataQuery(getSparqlQuery(year));
        if (results.length > 0) {
          allResults.push(...results);
        }
      } catch {
        console.error(`   Retry failed for ${year}`);
      }
    }
  }

  return allResults;
}

function parseDate(dateStr: string): { date: string; day: number; month: number } | null {
  try {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return {
        date: `${match[1]}-${match[2]}-${match[3]}`,
        day: parseInt(match[3], 10),
        month: parseInt(match[2], 10)
      };
    }
  } catch (e) {}
  return null;
}

function extractWikidataId(uri: string): string {
  const match = uri.match(/Q\d+$/);
  return match ? match[0] : '';
}

function cleanOccupation(occupation: string | undefined): string {
  if (!occupation) return 'Notable American';
  const cleaned = occupation.replace(/^(a|an|the)\s+/i, '').trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function processResults(results: WikidataResult[]): FamousDeath[] {
  const personMap = new Map<string, FamousDeath>();
  console.log(`📊 Processing ${results.length} results...`);

  for (const result of results) {
    const wikidataId = extractWikidataId(result.person.value);
    const deathDate = parseDate(result.deathDate.value);

    if (!deathDate || !wikidataId) continue;
    if (result.personLabel.value.startsWith('Q')) continue;

    const birthDate = result.birthDate ? parseDate(result.birthDate.value) : null;

    if (personMap.has(wikidataId)) continue;

    personMap.set(wikidataId, {
      name: result.personLabel.value,
      birth_date: birthDate?.date || '',
      death_date: deathDate.date,
      death_day: deathDate.day,
      death_month: deathDate.month,
      profession: cleanOccupation(result.occupationLabel?.value),
      description: '',
      cemetery: result.burialPlaceLabel?.value || null,
      city: null,
      state: null,
      country: 'USA',
      wikipedia: result.article?.value || null,
      cemetery_slug: null,
      wikidata_id: wikidataId
    });
  }

  console.log(`\n✅ Processed into ${personMap.size} unique people`);
  return Array.from(personMap.values());
}

function mergeWithExisting(newDeaths: FamousDeath[], existingPath: string): FamousDeath[] {
  let existing: FamousDeath[] = [];

  if (fs.existsSync(existingPath)) {
    const data = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
    existing = data.deaths || [];
    console.log(`📁 Found ${existing.length} existing entries`);
  }

  const existingMap = new Map<string, FamousDeath>();
  for (const death of existing) {
    const key = `${death.name.toLowerCase()}-${death.death_date}`;
    existingMap.set(key, death);
  }

  let added = 0;
  for (const death of newDeaths) {
    const key = `${death.name.toLowerCase()}-${death.death_date}`;
    if (!existingMap.has(key)) {
      existingMap.set(key, death);
      added++;
    }
  }

  console.log(`✅ Added ${added} new entries`);

  const merged = Array.from(existingMap.values());
  merged.sort((a, b) => b.death_date.localeCompare(a.death_date));

  return merged;
}

function generateStats(deaths: FamousDeath[]) {
  const dayCount = new Map<string, number>();
  for (const death of deaths) {
    if (death.death_day && death.death_month) {
      const key = `${death.death_month}-${death.death_day}`;
      dayCount.set(key, (dayCount.get(key) || 0) + 1);
    }
  }

  const withCemetery = deaths.filter(d => d.cemetery).length;

  console.log('\n📊 Statistics:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Total entries: ${deaths.length}`);
  console.log(`   Unique days covered: ${dayCount.size} / 366`);
  console.log(`   Coverage: ${((dayCount.size / 366) * 100).toFixed(1)}%`);
  console.log(`   With cemetery: ${withCemetery} (${((withCemetery / deaths.length) * 100).toFixed(1)}%)`);
}

async function main() {
  console.log('🇺🇸 Wikidata Famous American Deaths Scraper');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const results = await fetchWikidata();
    console.log(`\n✅ Received ${results.length} total results from Wikidata\n`);

    const deaths = processResults(results);

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dataPath = path.join(dataDir, 'famous-deaths.json');
    const merged = mergeWithExisting(deaths, dataPath);

    generateStats(merged);

    const output = {
      lastUpdated: new Date().toISOString(),
      source: 'Wikidata',
      count: merged.length,
      deaths: merged
    };

    fs.writeFileSync(dataPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Saved to ${dataPath}`);

    console.log('\n✨ Done!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
