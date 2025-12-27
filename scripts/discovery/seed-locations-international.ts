#!/usr/bin/env npx tsx
/**
 * International Cemetery Discovery Seed Script
 *
 * Generates location lists for cemetery discovery across multiple countries:
 * - USA (51 states + DC)
 * - Canada (13 provinces/territories)
 * - United Kingdom (4 countries with regions)
 * - Australia (6 states + 2 territories)
 *
 * Usage:
 *   npx tsx scripts/discovery/seed-locations-international.ts --country usa
 *   npx tsx scripts/discovery/seed-locations-international.ts --country canada --province "Ontario"
 *   npx tsx scripts/discovery/seed-locations-international.ts --country uk --region "Scotland"
 *   npx tsx scripts/discovery/seed-locations-international.ts --country australia --state "Victoria"
 *   npx tsx scripts/discovery/seed-locations-international.ts --list-countries
 *   npx tsx scripts/discovery/seed-locations-international.ts --stats
 */

import fs from 'fs';
import path from 'path';

const CONFIG_DIR = path.join(process.cwd(), 'data', 'country-configs');
const DATA_DIR = path.join(process.cwd(), 'data', 'discovery');

// Supported countries
type SupportedCountry = 'usa' | 'canada' | 'uk' | 'australia';

const COUNTRY_FILES: Record<SupportedCountry, string> = {
  usa: 'usa.json',
  canada: 'canada.json',
  uk: 'united-kingdom.json',
  australia: 'australia.json',
};

// Types
interface DiscoveryLocation {
  id: string;
  country: string;
  country_code: string;
  region: string; // state/province/country(UK)
  region_abbr: string;
  city: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results_count: number;
  last_searched_at: string | null;
  search_query: string | null;
  created_at: string;
}

interface DiscoveryProgress {
  country: string;
  total_locations: number;
  pending: number;
  completed: number;
  failed: number;
  total_results: number;
  last_run_at: string | null;
  started_at: string | null;
}

interface USAConfig {
  country: { name: string; code: string };
  states: Array<{
    name: string;
    abbr: string;
    slug: string;
    priority: number;
    major_cities: string[];
  }>;
}

interface CanadaConfig {
  country: { name: string; code: string };
  provinces: Array<{
    name: string;
    abbr: string;
    slug: string;
    priority: number;
    major_cities: string[];
  }>;
}

interface UKConfig {
  country: { name: string; code: string };
  regions: Array<{
    name: string;
    slug: string;
    type: string;
    priority: number;
    major_cities?: string[];
    regions?: Array<{
      name: string;
      slug: string;
      priority: number;
      major_cities: string[];
    }>;
  }>;
}

interface AustraliaConfig {
  country: { name: string; code: string };
  states: Array<{
    name: string;
    abbr: string;
    slug: string;
    priority: number;
    major_cities: string[];
  }>;
}

function loadCountryConfig(country: SupportedCountry): USAConfig | CanadaConfig | UKConfig | AustraliaConfig {
  const configPath = path.join(CONFIG_DIR, COUNTRY_FILES[country]);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config not found for ${country}: ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateUSALocations(config: USAConfig, filterState?: string): DiscoveryLocation[] {
  const locations: DiscoveryLocation[] = [];
  const now = new Date().toISOString();

  for (const state of config.states) {
    if (filterState && state.name.toLowerCase() !== filterState.toLowerCase() &&
        state.abbr.toLowerCase() !== filterState.toLowerCase()) {
      continue;
    }

    for (const city of state.major_cities) {
      const id = `${generateSlug(city)}-${state.abbr.toLowerCase()}-usa`;
      locations.push({
        id,
        country: config.country.name,
        country_code: config.country.code,
        region: state.name,
        region_abbr: state.abbr,
        city,
        priority: state.priority,
        status: 'pending',
        results_count: 0,
        last_searched_at: null,
        search_query: null,
        created_at: now,
      });
    }
  }

  return locations;
}

function generateCanadaLocations(config: CanadaConfig, filterProvince?: string): DiscoveryLocation[] {
  const locations: DiscoveryLocation[] = [];
  const now = new Date().toISOString();

  for (const province of config.provinces) {
    if (filterProvince && province.name.toLowerCase() !== filterProvince.toLowerCase() &&
        province.abbr.toLowerCase() !== filterProvince.toLowerCase()) {
      continue;
    }

    for (const city of province.major_cities) {
      const id = `${generateSlug(city)}-${province.abbr.toLowerCase()}-can`;
      locations.push({
        id,
        country: config.country.name,
        country_code: config.country.code,
        region: province.name,
        region_abbr: province.abbr,
        city,
        priority: province.priority,
        status: 'pending',
        results_count: 0,
        last_searched_at: null,
        search_query: null,
        created_at: now,
      });
    }
  }

  return locations;
}

function generateUKLocations(config: UKConfig, filterRegion?: string): DiscoveryLocation[] {
  const locations: DiscoveryLocation[] = [];
  const now = new Date().toISOString();

  for (const region of config.regions) {
    if (filterRegion && region.name.toLowerCase() !== filterRegion.toLowerCase()) {
      continue;
    }

    // Handle England with sub-regions
    if (region.regions) {
      for (const subRegion of region.regions) {
        for (const city of subRegion.major_cities) {
          const id = `${generateSlug(city)}-${generateSlug(subRegion.name)}-gbr`;
          locations.push({
            id,
            country: config.country.name,
            country_code: config.country.code,
            region: `${region.name} - ${subRegion.name}`,
            region_abbr: subRegion.slug.toUpperCase().substring(0, 4),
            city,
            priority: subRegion.priority,
            status: 'pending',
            results_count: 0,
            last_searched_at: null,
            search_query: null,
            created_at: now,
          });
        }
      }
    } else if (region.major_cities) {
      // Handle Scotland, Wales, Northern Ireland
      for (const city of region.major_cities) {
        const id = `${generateSlug(city)}-${region.slug}-gbr`;
        locations.push({
          id,
          country: config.country.name,
          country_code: config.country.code,
          region: region.name,
          region_abbr: region.slug.toUpperCase().substring(0, 3),
          city,
          priority: region.priority,
          status: 'pending',
          results_count: 0,
          last_searched_at: null,
          search_query: null,
          created_at: now,
        });
      }
    }
  }

  return locations;
}

function generateAustraliaLocations(config: AustraliaConfig, filterState?: string): DiscoveryLocation[] {
  const locations: DiscoveryLocation[] = [];
  const now = new Date().toISOString();

  for (const state of config.states) {
    if (filterState && state.name.toLowerCase() !== filterState.toLowerCase() &&
        state.abbr.toLowerCase() !== filterState.toLowerCase()) {
      continue;
    }

    for (const city of state.major_cities) {
      const id = `${generateSlug(city)}-${state.abbr.toLowerCase()}-aus`;
      locations.push({
        id,
        country: config.country.name,
        country_code: config.country.code,
        region: state.name,
        region_abbr: state.abbr,
        city,
        priority: state.priority,
        status: 'pending',
        results_count: 0,
        last_searched_at: null,
        search_query: null,
        created_at: now,
      });
    }
  }

  return locations;
}

function generateLocations(country: SupportedCountry, filter?: string): DiscoveryLocation[] {
  const config = loadCountryConfig(country);

  switch (country) {
    case 'usa':
      return generateUSALocations(config as USAConfig, filter);
    case 'canada':
      return generateCanadaLocations(config as CanadaConfig, filter);
    case 'uk':
      return generateUKLocations(config as UKConfig, filter);
    case 'australia':
      return generateAustraliaLocations(config as AustraliaConfig, filter);
    default:
      throw new Error(`Unsupported country: ${country}`);
  }
}

function printStats(): void {
  console.log('\n📊 International Discovery Statistics\n');
  console.log('=' .repeat(60));

  for (const [country, file] of Object.entries(COUNTRY_FILES)) {
    try {
      const locations = generateLocations(country as SupportedCountry);
      const byRegion = locations.reduce((acc, loc) => {
        const key = loc.region.split(' - ')[0]; // Handle UK sub-regions
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log(`\n🌍 ${country.toUpperCase()}`);
      console.log(`   Total locations: ${locations.length}`);
      console.log(`   Regions: ${Object.keys(byRegion).length}`);
      console.log(`   Top regions:`);

      Object.entries(byRegion)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([region, count]) => {
          console.log(`     - ${region}: ${count} cities`);
        });
    } catch (err) {
      console.log(`\n⚠️ ${country.toUpperCase()}: Config not found`);
    }
  }

  console.log('\n' + '='.repeat(60));
}

function listCountries(): void {
  console.log('\n🌍 Supported Countries\n');
  console.log('=' .repeat(40));

  for (const [key, file] of Object.entries(COUNTRY_FILES)) {
    const configPath = path.join(CONFIG_DIR, file);
    const exists = fs.existsSync(configPath);
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${key.toUpperCase().padEnd(12)} → ${file}`);
  }

  console.log('\n' + '='.repeat(40));
  console.log('\nUsage examples:');
  console.log('  --country usa');
  console.log('  --country canada --province Ontario');
  console.log('  --country uk --region Scotland');
  console.log('  --country australia --state Victoria');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    country: null as SupportedCountry | null,
    filter: null as string | null,
    dryRun: false,
    reset: false,
    stats: false,
    listCountries: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--country':
        if (nextArg && nextArg in COUNTRY_FILES) {
          options.country = nextArg as SupportedCountry;
          i++;
        }
        break;
      case '--state':
      case '--province':
      case '--region':
        if (nextArg) {
          options.filter = nextArg;
          i++;
        }
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--reset':
        options.reset = true;
        break;
      case '--stats':
        options.stats = true;
        break;
      case '--list-countries':
        options.listCountries = true;
        break;
      case '--help':
        console.log(`
International Cemetery Discovery Seed Script

Usage:
  npx tsx scripts/discovery/seed-locations-international.ts [options]

Options:
  --country <code>     Country to seed (usa, canada, uk, australia)
  --state <name>       Filter by state (USA/Australia)
  --province <name>    Filter by province (Canada)
  --region <name>      Filter by region/country (UK)
  --dry-run            Show what would be generated without saving
  --reset              Clear existing locations and start fresh
  --stats              Show statistics for all countries
  --list-countries     List all supported countries
  --help               Show this help message

Examples:
  # Generate locations for all US states
  npx tsx scripts/discovery/seed-locations-international.ts --country usa

  # Generate only for California
  npx tsx scripts/discovery/seed-locations-international.ts --country usa --state California

  # Generate for Canada, Ontario only
  npx tsx scripts/discovery/seed-locations-international.ts --country canada --province Ontario

  # Generate for UK Scotland
  npx tsx scripts/discovery/seed-locations-international.ts --country uk --region Scotland

  # Show stats for all countries
  npx tsx scripts/discovery/seed-locations-international.ts --stats
        `);
        process.exit(0);
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  console.log('🌍 International Cemetery Discovery Seed Script\n');

  if (options.stats) {
    printStats();
    return;
  }

  if (options.listCountries) {
    listCountries();
    return;
  }

  if (!options.country) {
    console.log('❌ Please specify a country with --country <code>');
    console.log('   Use --list-countries to see available options');
    console.log('   Use --help for more information');
    process.exit(1);
  }

  // Ensure directories exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Generate locations
  const locations = generateLocations(options.country, options.filter || undefined);

  console.log(`📊 Generated ${locations.length} locations for ${options.country.toUpperCase()}`);

  if (options.filter) {
    console.log(`   Filtered by: ${options.filter}`);
  }

  // Stats by region
  const byRegion = locations.reduce((acc, loc) => {
    acc[loc.region] = (acc[loc.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📍 Locations by region:');
  Object.entries(byRegion)
    .sort((a, b) => b[1] - a[1])
    .forEach(([region, count]) => {
      console.log(`   ${region}: ${count}`);
    });

  if (options.dryRun) {
    console.log('\n🧪 DRY RUN - No data saved');
    console.log('\nSample locations:');
    locations.slice(0, 10).forEach(loc => {
      console.log(`   - ${loc.city}, ${loc.region_abbr} (${loc.country_code})`);
    });
    return;
  }

  // File paths
  const locationsFile = path.join(DATA_DIR, `locations-${options.country}.json`);
  const progressFile = path.join(DATA_DIR, `progress-${options.country}.json`);

  // Load existing or start fresh
  let existingLocations: DiscoveryLocation[] = [];
  if (!options.reset && fs.existsSync(locationsFile)) {
    try {
      existingLocations = JSON.parse(fs.readFileSync(locationsFile, 'utf-8'));
      console.log(`\n📂 Loaded ${existingLocations.length} existing locations`);
    } catch {
      console.log('⚠️ Could not load existing file, starting fresh');
    }
  }

  // Merge: keep existing status, add new
  const existingIds = new Set(existingLocations.map(l => l.id));
  let added = 0;
  let skipped = 0;

  for (const newLoc of locations) {
    if (existingIds.has(newLoc.id)) {
      skipped++;
    } else {
      existingLocations.push(newLoc);
      added++;
    }
  }

  // Sort by priority then by region
  existingLocations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.region.localeCompare(b.region);
  });

  // Save locations
  fs.writeFileSync(locationsFile, JSON.stringify(existingLocations, null, 2));

  // Create/update progress
  const progress: DiscoveryProgress = {
    country: options.country,
    total_locations: existingLocations.length,
    pending: existingLocations.filter(l => l.status === 'pending').length,
    completed: existingLocations.filter(l => l.status === 'completed').length,
    failed: existingLocations.filter(l => l.status === 'failed').length,
    total_results: existingLocations.reduce((sum, l) => sum + l.results_count, 0),
    last_run_at: null,
    started_at: null,
  };
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));

  console.log('\n✅ Seed complete!');
  console.log(`   Added: ${added}`);
  console.log(`   Skipped (existing): ${skipped}`);
  console.log(`   Total: ${existingLocations.length}`);
  console.log(`\n📁 Files:`);
  console.log(`   ${locationsFile}`);
  console.log(`   ${progressFile}`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
