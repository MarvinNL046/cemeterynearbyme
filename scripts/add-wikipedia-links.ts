/**
 * Script to add Wikipedia links to famous deaths data
 *
 * Fetches Wikipedia URLs from Wikidata API for each person
 * based on their wikidata_id
 */

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/famous-deaths.json');
const BATCH_SIZE = 50; // Wikidata API supports up to 50 IDs per request
const DELAY_MS = 1000; // Delay between batches to avoid rate limiting

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

interface DeathsData {
  lastUpdated: string;
  source: string;
  count: number;
  deaths: FamousDeath[];
}

async function fetchWikipediaUrls(wikidataIds: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  if (wikidataIds.length === 0) return results;

  const idsParam = wikidataIds.join('|');
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${idsParam}&props=sitelinks/urls&sitefilter=enwiki&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.entities) {
      for (const [id, entity] of Object.entries(data.entities)) {
        const entityData = entity as any;
        if (entityData.sitelinks?.enwiki?.url) {
          results.set(id, entityData.sitelinks.enwiki.url);
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching batch:`, error);
  }

  return results;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Reading famous deaths data...');
  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  const data: DeathsData = JSON.parse(rawData);

  // Find entries that need Wikipedia links
  const needsWikipedia = data.deaths.filter(
    d => d.wikidata_id && !d.wikipedia
  );

  console.log(`Found ${needsWikipedia.length} entries without Wikipedia links`);
  console.log(`Total entries: ${data.deaths.length}`);

  // Create batches
  const batches: string[][] = [];
  for (let i = 0; i < needsWikipedia.length; i += BATCH_SIZE) {
    batches.push(needsWikipedia.slice(i, i + BATCH_SIZE).map(d => d.wikidata_id));
  }

  console.log(`Processing ${batches.length} batches...`);

  // Create a map of wikidata_id -> wikipedia_url
  const wikipediaMap = new Map<string, string>();

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} IDs)...`);

    const batchResults = await fetchWikipediaUrls(batch);
    for (const [id, url] of batchResults) {
      wikipediaMap.set(id, url);
    }

    // Progress update
    const found = wikipediaMap.size;
    const processed = Math.min((i + 1) * BATCH_SIZE, needsWikipedia.length);
    console.log(`  Found ${found} Wikipedia links so far (${processed}/${needsWikipedia.length} processed)`);

    // Delay between batches
    if (i < batches.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nTotal Wikipedia links found: ${wikipediaMap.size}`);

  // Update the data
  let updated = 0;
  for (const death of data.deaths) {
    if (death.wikidata_id && wikipediaMap.has(death.wikidata_id)) {
      death.wikipedia = wikipediaMap.get(death.wikidata_id)!;
      updated++;
    }
  }

  console.log(`Updated ${updated} entries with Wikipedia links`);

  // Update timestamp
  data.lastUpdated = new Date().toISOString();

  // Save the data
  console.log('Saving updated data...');
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  console.log('Done!');

  // Summary
  const withWikipedia = data.deaths.filter(d => d.wikipedia).length;
  console.log(`\nSummary:`);
  console.log(`  Total entries: ${data.deaths.length}`);
  console.log(`  With Wikipedia: ${withWikipedia} (${(withWikipedia / data.deaths.length * 100).toFixed(1)}%)`);
}

main().catch(console.error);
