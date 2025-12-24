#!/usr/bin/env npx tsx
/**
 * OSM Enrichment Script
 *
 * Haalt oppervlakte data op van OpenStreetMap via Overpass API
 * en zoekt aanvullende info (aantal graven, etc.) via Jina AI
 */

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const ENRICHMENT_LOG = path.join(process.cwd(), 'data', 'enrichment-log.json');
const JINA_API_KEY = 'jina_87f2d697e60a4f93b5b0b7576da1a857shcct21CGvGd4dbCBSyCUHLfKodA';

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  gps_coordinaten?: string;
  oppervlakte?: string;
  aantal_graven?: number;
  aantal_personen?: number;
  osm_id?: string;
  wikipedia_url?: string;
  wikidata_id?: string;
  [key: string]: any;
}

interface EnrichmentStats {
  total_processed: number;
  osm_found: number;
  area_calculated: number;
  jina_searched: number;
  graven_found: number;
  errors: number;
  timestamp: string;
}

// Calculate polygon area using Shoelace formula
function calculatePolygonArea(geometry: { lat: number; lon: number }[]): number {
  if (geometry.length < 3) return 0;

  let area = 0;
  const n = geometry.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    // Convert to approximate meters (at Netherlands latitude ~52°)
    const lat1 = geometry[i].lat;
    const lon1 = geometry[i].lon;
    const lat2 = geometry[j].lat;
    const lon2 = geometry[j].lon;

    // Approximate conversion to meters
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLon = 111320 * Math.cos(lat1 * Math.PI / 180);

    const x1 = lon1 * metersPerDegreeLon;
    const y1 = lat1 * metersPerDegreeLat;
    const x2 = lon2 * metersPerDegreeLon;
    const y2 = lat2 * metersPerDegreeLat;

    area += x1 * y2;
    area -= x2 * y1;
  }

  return Math.abs(area / 2);
}

// Query Overpass API for cemetery data near GPS coordinates
async function queryOSM(lat: number, lon: number, name: string): Promise<{
  area?: number;
  osm_id?: string;
  wikipedia?: string;
  wikidata?: string;
} | null> {
  // Search in a 500m radius around the GPS point
  const radius = 500;

  const query = `[out:json][timeout:25];
(
  way["landuse"="cemetery"](around:${radius},${lat},${lon});
  relation["landuse"="cemetery"](around:${radius},${lat},${lon});
);
out body geom;`;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });

    if (!response.ok) {
      console.error(`  OSM API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      return null;
    }

    // Find best match by name similarity or closest
    let bestMatch = data.elements[0];
    const nameLower = name.toLowerCase();

    for (const element of data.elements) {
      if (element.tags?.name) {
        const osmName = element.tags.name.toLowerCase();
        if (osmName.includes(nameLower) || nameLower.includes(osmName)) {
          bestMatch = element;
          break;
        }
      }
    }

    const result: { area?: number; osm_id?: string; wikipedia?: string; wikidata?: string } = {};

    if (bestMatch.geometry && bestMatch.geometry.length > 2) {
      result.area = Math.round(calculatePolygonArea(bestMatch.geometry));
    }

    result.osm_id = `${bestMatch.type}/${bestMatch.id}`;

    if (bestMatch.tags?.wikipedia) {
      result.wikipedia = `https://nl.wikipedia.org/wiki/${bestMatch.tags.wikipedia.replace('nl:', '')}`;
    }

    if (bestMatch.tags?.wikidata) {
      result.wikidata = bestMatch.tags.wikidata;
    }

    return result;
  } catch (error) {
    console.error(`  OSM query error:`, error);
    return null;
  }
}

// Search for additional cemetery info using Jina AI
async function searchJina(name: string, gemeente: string): Promise<{
  aantal_graven?: number;
  aantal_personen?: number;
} | null> {
  const query = encodeURIComponent(`"${name}" ${gemeente} aantal graven personen begraven`);

  try {
    const response = await fetch(`https://s.jina.ai/?q=${query}`, {
      headers: {
        'Authorization': `Bearer ${JINA_API_KEY}`,
        'X-Respond-With': 'no-content'
      }
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    // Try to extract numbers
    const result: { aantal_graven?: number; aantal_personen?: number } = {};

    // Look for patterns like "X graven" or "X.XXX graven"
    const gravenMatch = text.match(/(\d{1,3}(?:[.,]\d{3})*)\s*(?:graven|grafplaatsen|grafstenen)/i);
    if (gravenMatch) {
      const num = parseInt(gravenMatch[1].replace(/[.,]/g, ''));
      if (num > 10 && num < 500000) {
        result.aantal_graven = num;
      }
    }

    // Look for patterns like "X personen begraven" or "X begravingen"
    const personenMatch = text.match(/(\d{1,3}(?:[.,]\d{3})*)\s*(?:personen|mensen|begravingen|bijzettingen)/i);
    if (personenMatch) {
      const num = parseInt(personenMatch[1].replace(/[.,]/g, ''));
      if (num > 10 && num < 1000000) {
        result.aantal_personen = num;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch (error) {
    console.error(`  Jina search error:`, error);
    return null;
  }
}

// Rate limiting helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🗺️  OSM & Jina Enrichment Script');
  console.log('================================\n');

  // Load cemeteries
  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log(`📊 Loaded ${cemeteries.length} cemeteries\n`);

  // Filter cemeteries that have GPS but no oppervlakte
  const toEnrich = cemeteries.filter(c =>
    c.gps_coordinaten &&
    !c.oppervlakte
  );

  console.log(`🎯 ${toEnrich.length} cemeteries to enrich (have GPS, missing oppervlakte)\n`);

  // Check for --limit flag
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : toEnrich.length;
  const batch = toEnrich.slice(0, limit);

  console.log(`📦 Processing ${batch.length} cemeteries...\n`);

  const stats: EnrichmentStats = {
    total_processed: 0,
    osm_found: 0,
    area_calculated: 0,
    jina_searched: 0,
    graven_found: 0,
    errors: 0,
    timestamp: new Date().toISOString()
  };

  for (let i = 0; i < batch.length; i++) {
    const cemetery = batch[i];
    const [lat, lon] = cemetery.gps_coordinaten!.split(',').map(c => parseFloat(c.trim()));

    console.log(`[${i + 1}/${batch.length}] ${cemetery.naam_begraafplaats} (${cemetery.gemeente})`);

    stats.total_processed++;

    // Query OSM for polygon/area
    const osmData = await queryOSM(lat, lon, cemetery.naam_begraafplaats);

    if (osmData) {
      stats.osm_found++;

      if (osmData.area) {
        cemetery.oppervlakte = osmData.area.toString();
        stats.area_calculated++;
        console.log(`  ✅ Oppervlakte: ${osmData.area.toLocaleString('nl-NL')} m²`);
      }

      if (osmData.osm_id) {
        cemetery.osm_id = osmData.osm_id;
      }

      if (osmData.wikipedia) {
        cemetery.wikipedia_url = osmData.wikipedia;
        console.log(`  📖 Wikipedia: ${osmData.wikipedia}`);
      }

      if (osmData.wikidata) {
        cemetery.wikidata_id = osmData.wikidata;
      }
    } else {
      console.log(`  ⚠️ Niet gevonden in OSM`);
    }

    // Rate limit for OSM (1 request per second recommended)
    await sleep(1000);

    // Search Jina for additional info (only if we don't have graven count)
    if (!cemetery.aantal_graven) {
      stats.jina_searched++;
      const jinaData = await searchJina(cemetery.naam_begraafplaats, cemetery.gemeente);

      if (jinaData) {
        if (jinaData.aantal_graven) {
          cemetery.aantal_graven = jinaData.aantal_graven;
          stats.graven_found++;
          console.log(`  🪦 Aantal graven: ${jinaData.aantal_graven.toLocaleString('nl-NL')}`);
        }
        if (jinaData.aantal_personen) {
          cemetery.aantal_personen = jinaData.aantal_personen;
          console.log(`  👥 Aantal personen: ${jinaData.aantal_personen.toLocaleString('nl-NL')}`);
        }
      }

      // Rate limit for Jina
      await sleep(500);
    }

    // Find and update in main array
    const mainIndex = cemeteries.findIndex(c => c.slug === cemetery.slug);
    if (mainIndex !== -1) {
      cemeteries[mainIndex] = cemetery;
    }

    // Save progress every 50 cemeteries
    if ((i + 1) % 50 === 0) {
      console.log(`\n💾 Saving progress (${i + 1}/${batch.length})...\n`);
      fs.writeFileSync(DATA_FILE, JSON.stringify(cemeteries, null, 2));
    }
  }

  // Final save
  console.log('\n💾 Saving final results...');
  fs.writeFileSync(DATA_FILE, JSON.stringify(cemeteries, null, 2));

  // Also update public data
  const publicDataFile = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');
  fs.writeFileSync(publicDataFile, JSON.stringify(cemeteries, null, 2));

  // Save enrichment log
  fs.writeFileSync(ENRICHMENT_LOG, JSON.stringify(stats, null, 2));

  console.log('\n📊 Enrichment Summary:');
  console.log('======================');
  console.log(`Total processed:    ${stats.total_processed}`);
  console.log(`OSM matches:        ${stats.osm_found}`);
  console.log(`Area calculated:    ${stats.area_calculated}`);
  console.log(`Jina searches:      ${stats.jina_searched}`);
  console.log(`Graven data found:  ${stats.graven_found}`);
  console.log(`Errors:             ${stats.errors}`);
  console.log('\n✅ Done!');
}

main().catch(console.error);
