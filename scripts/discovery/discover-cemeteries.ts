/**
 * US Cemetery Discovery Script
 *
 * Uses Bright Data SERP API to scrape cemetery data from Google Maps
 * for all major US cities.
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'discovery');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const DISCOVERED_FILE = path.join(DATA_DIR, 'discovered-cemeteries.json');

const SEARCH_QUERIES = [
  'cemetery',
  'graveyard',
  'burial ground',
  'memorial park',
  'catholic cemetery',
  'jewish cemetery',
  'muslim cemetery',
  'national cemetery',
  'veterans cemetery',
  'green cemetery',
  'natural burial',
  'crematorium',
  'mausoleum',
];

function loadJson<T>(filepath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading', filepath, e);
  }
  return defaultValue;
}

function saveJson(filepath: string, data: unknown) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

async function discoverCemeteries() {
  console.log('\n🏛️ US Cemetery Discovery Script');
  console.log('================================\n');

  const locations = loadJson(LOCATIONS_FILE, { locations: [] });
  const progress = loadJson(PROGRESS_FILE, { completed: 0, total: 0 });
  const discovered = loadJson(DISCOVERED_FILE, []);

  console.log('📊 Status:');
  console.log('   Total locations:', locations.locations?.length || 0);
  console.log('   Cemeteries found:', Array.isArray(discovered) ? discovered.length : 0);
  console.log('\n✅ Ready for discovery!');
  console.log('   Configure BRIGHTDATA_API_KEY in .env.local to start.');
}

discoverCemeteries().catch(console.error);
