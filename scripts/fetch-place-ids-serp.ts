#!/usr/bin/env npx tsx
/**
 * Fetch Google Place IDs via BrightData SERP API (super snel!)
 *
 * Gebruik:
 *   npx tsx scripts/fetch-place-ids-serp.ts --dry-run                    # Test 1 locatie
 *   npx tsx scripts/fetch-place-ids-serp.ts --provincie "Utrecht"        # Alle locaties in Utrecht
 *   npx tsx scripts/fetch-place-ids-serp.ts --batch 100                  # Eerste 100 locaties
 *   npx tsx scripts/fetch-place-ids-serp.ts                              # Alle locaties
 */

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const API_KEY = 'db844ba6-02f6-4af0-9f10-d2baa9c1e95b';
const ZONE = 'begraafplaatsindebuurt';
const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const DELAY_MS = 5000; // 5 sec between requests (rate limit protection)

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gps_coordinaten?: string;
  google_place_id?: string;
  [key: string]: unknown;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    provincie?: string;
    batch: number;
    dryRun: boolean;
    skipExisting: boolean;
  } = {
    batch: 0,
    dryRun: false,
    skipExisting: true,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--provincie' && args[i + 1]) {
      options.provincie = args[i + 1];
      i++;
    } else if (args[i] === '--batch' && args[i + 1]) {
      options.batch = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--include-existing') {
      options.skipExisting = false;
    }
  }

  return options;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadCemeteries(): Cemetery[] {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveCemeteries(cemeteries: Cemetery[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cemeteries, null, 2));
  // Also update public copy
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'cemeteries.json'),
    JSON.stringify(cemeteries, null, 2)
  );
}

function buildSearchQuery(cemetery: Cemetery): string {
  const parts = [cemetery.naam_begraafplaats];

  if (cemetery.plaats) {
    parts.push(cemetery.plaats);
  } else if (cemetery.gemeente) {
    parts.push(cemetery.gemeente);
  }

  parts.push('begraafplaats');

  return parts.join(' ');
}

async function searchGoogle(query: string, retries = 3): Promise<any> {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=nl&gl=nl`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sec timeout

      const response = await fetch('https://api.brightdata.com/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          zone: ZONE,
          url: url,
          format: 'json',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        // Rate limited - wait longer and retry
        console.log(`\n   ⏳ Rate limited, waiting 10s (attempt ${attempt}/${retries})...`);
        await sleep(10000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`SERP API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`\n   ⏱️ Timeout, retrying (${attempt}/${retries})...`);
      } else if (attempt === retries) {
        throw error;
      } else {
        console.log(`\n   ⚠️ Request failed, retrying (${attempt}/${retries})...`);
      }
      await sleep(3000);
    }
  }
  throw new Error('Max retries reached');
}

interface ExtractedIds {
  cid: string | null;
  placeId: string | null;
  mapsUrl: string | null;
}

function extractIds(serpResult: any): ExtractedIds {
  const result: ExtractedIds = { cid: null, placeId: null, mapsUrl: null };

  // Parse the body if it's a string (SERP API returns JSON in body field)
  let data = serpResult;
  if (serpResult.body && typeof serpResult.body === 'string') {
    try {
      data = JSON.parse(serpResult.body);
    } catch {
      // If parsing fails, use original
    }
  }

  // 1. Extract ludocid (CID) from knowledge graph facts
  if (data.knowledge?.facts) {
    for (const fact of data.knowledge.facts) {
      // Check key_link for ludocid parameter
      if (fact.key_link) {
        const ludocidMatch = fact.key_link.match(/ludocid=(\d+)/);
        if (ludocidMatch) {
          result.cid = ludocidMatch[1];
        }
      }

      // Check value links for Maps URL with place data
      if (fact.value) {
        for (const val of fact.value) {
          if (val.link?.includes('google.com/maps')) {
            result.mapsUrl = val.link;

            // Extract hex CID from Maps URL (0x....:0x....)
            const hexMatch = val.link.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
            if (hexMatch && !result.placeId) {
              result.placeId = hexMatch[1];
            }
          }
        }
      }
    }
  }

  // 2. Check local_results / local_pack
  if (data.local_results) {
    for (const r of data.local_results) {
      if (r.place_id && !result.placeId) result.placeId = r.place_id;
      if (r.data_id && !result.placeId) result.placeId = r.data_id;
      if (r.cid && !result.cid) result.cid = r.cid;
    }
  }

  // 3. Check local_map
  if (data.local_map?.places) {
    for (const place of data.local_map.places) {
      if (place.place_id && !result.placeId) result.placeId = place.place_id;
      if (place.data_id && !result.placeId) result.placeId = place.data_id;
      if (place.cid && !result.cid) result.cid = place.cid;
    }
  }

  // 4. Check knowledge_graph direct fields
  if (data.knowledge_graph?.place_id && !result.placeId) {
    result.placeId = data.knowledge_graph.place_id;
  }

  return result;
}

function extractPlaceId(serpResult: any): string | null {
  const ids = extractIds(serpResult);
  // Return CID first (preferred for BrightData), then placeId
  return ids.cid || ids.placeId || null;
}

function extractPlaceIdFromHtml(html: string): string | null {
  // Look for place_id patterns in raw HTML
  const patterns = [
    /data-pid="([^"]+)"/,
    /"place_id":"([^"]+)"/,
    /\/maps\/place\/[^\/]+\/@[^\/]+\/data=![^!]+!1s([^!]+)/,
    /0x[0-9a-f]+:0x[0-9a-f]+/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1] || match[0];
  }

  return null;
}

async function main() {
  const options = parseArgs();

  console.log('🔍 BrightData SERP API - Place ID Fetcher\n');

  let cemeteries = loadCemeteries();

  // Filter by provincie
  if (options.provincie) {
    cemeteries = cemeteries.filter(c =>
      c.provincie.toLowerCase() === options.provincie!.toLowerCase()
    );
    console.log(`📍 Filtered to ${cemeteries.length} cemeteries in ${options.provincie}`);
  }

  // Skip existing
  if (options.skipExisting) {
    const before = cemeteries.length;
    cemeteries = cemeteries.filter(c => !c.google_place_id);
    const skipped = before - cemeteries.length;
    if (skipped > 0) {
      console.log(`⏭️  Skipping ${skipped} cemeteries with existing place_id`);
    }
  }

  // Apply batch limit
  if (options.batch > 0 && cemeteries.length > options.batch) {
    cemeteries = cemeteries.slice(0, options.batch);
    console.log(`📦 Limited to batch of ${options.batch}`);
  }

  console.log(`🎯 ${cemeteries.length} cemeteries to process\n`);

  if (cemeteries.length === 0) {
    console.log('✅ Nothing to do!');
    return;
  }

  // Dry run - test with first cemetery
  if (options.dryRun) {
    const test = cemeteries[0];
    const query = buildSearchQuery(test);
    console.log('🧪 DRY RUN - Testing with:');
    console.log(`   Name: ${test.naam_begraafplaats}`);
    console.log(`   Query: ${query}`);
    console.log('\n   Searching...');

    try {
      const result = await searchGoogle(query);
      console.log('\n   Response type:', typeof result);

      if (typeof result === 'string') {
        // Raw HTML response
        console.log('   Got HTML response, length:', result.length);
        const placeId = extractPlaceIdFromHtml(result);
        console.log('   Extracted place_id:', placeId || 'NOT FOUND');

        // Save sample for debugging
        fs.writeFileSync('data/serp-sample.html', result);
        console.log('\n   Saved sample to data/serp-sample.html');
      } else {
        // JSON response
        console.log('   Got JSON response');
        console.log('   Top-level keys:', Object.keys(result).join(', '));

        // Extract all IDs
        const ids = extractIds(result);
        console.log('\n   📍 Extracted IDs:');
        console.log(`      CID (ludocid): ${ids.cid || 'NOT FOUND'}`);
        console.log(`      Place ID: ${ids.placeId || 'NOT FOUND'}`);
        console.log(`      Maps URL: ${ids.mapsUrl ? 'Found' : 'NOT FOUND'}`);

        // Show what we'll save
        const finalId = ids.cid || ids.placeId;
        console.log(`\n   ✅ Will save: ${finalId || 'NOTHING - no ID found'}`);

        // Save sample for debugging
        fs.writeFileSync('data/serp-sample.json', JSON.stringify(result, null, 2));
        console.log('\n   💾 Saved sample to data/serp-sample.json');
      }
    } catch (error) {
      console.error('   Error:', error);
    }
    return;
  }

  // Process all cemeteries
  const allCemeteries = loadCemeteries(); // Reload for updating
  let found = 0;
  let notFound = 0;
  let errors = 0;

  console.log('🚀 Starting... (Ctrl+C to stop)\n');

  for (let i = 0; i < cemeteries.length; i++) {
    const cemetery = cemeteries[i];
    const query = buildSearchQuery(cemetery);

    process.stdout.write(`\r[${i + 1}/${cemeteries.length}] ${cemetery.slug.substring(0, 50).padEnd(50)} `);

    try {
      const result = await searchGoogle(query);

      let placeId: string | null = null;
      if (typeof result === 'string') {
        placeId = extractPlaceIdFromHtml(result);
      } else {
        placeId = extractPlaceId(result);
      }

      if (placeId) {
        // Update in full cemetery list
        const idx = allCemeteries.findIndex(c => c.slug === cemetery.slug);
        if (idx >= 0) {
          allCemeteries[idx].google_place_id = placeId;
        }
        found++;
        process.stdout.write('✅');
      } else {
        notFound++;
        process.stdout.write('❌');
      }
    } catch (error) {
      errors++;
      process.stdout.write('⚠️');
    }

    // Rate limiting
    if (i < cemeteries.length - 1) {
      await sleep(DELAY_MS);
    }

    // Save progress every 50 items
    if ((i + 1) % 50 === 0) {
      saveCemeteries(allCemeteries);
      console.log(`\n   💾 Progress saved (${found} found so far)`);
    }
  }

  // Final save
  saveCemeteries(allCemeteries);

  console.log('\n\n' + '='.repeat(50));
  console.log('📊 RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Place IDs found: ${found}`);
  console.log(`❌ Not found: ${notFound}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
