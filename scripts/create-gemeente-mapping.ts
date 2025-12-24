#!/usr/bin/env tsx
/**
 * Create gemeente mapping using PDOK Locatieserver API
 * Maps plaatsnamen (woonplaatsen) to official CBS gemeentes
 *
 * Usage: npx tsx scripts/create-gemeente-mapping.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface GemeenteMapping {
  [plaatsnaam: string]: {
    gemeente: string;
    provincie: string;
  };
}

interface PDOKResponse {
  response: {
    numFound: number;
    docs: Array<{
      weergavenaam: string;
      gemeentenaam?: string;
      provincienaam?: string;
      type: string;
    }>;
  };
}

const PDOK_API = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free';

async function getGemeenteForPlaats(plaatsnaam: string): Promise<{ gemeente: string; provincie: string } | null> {
  try {
    const url = `${PDOK_API}?q=${encodeURIComponent(plaatsnaam)}&fq=type:woonplaats&rows=1`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`  ⚠️ API error for "${plaatsnaam}": ${response.status}`);
      return null;
    }

    const data: PDOKResponse = await response.json();

    if (data.response.numFound > 0 && data.response.docs[0].gemeentenaam) {
      return {
        gemeente: data.response.docs[0].gemeentenaam,
        provincie: data.response.docs[0].provincienaam || ''
      };
    }

    return null;
  } catch (error) {
    console.error(`  ❌ Error for "${plaatsnaam}":`, error);
    return null;
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🔄 Creating gemeente mapping from PDOK Locatieserver...\n');

  // Load existing cemetery data
  const dataPath = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
  const publicDataPath = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');

  let cemeteries: any[] = [];

  if (fs.existsSync(dataPath)) {
    cemeteries = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } else if (fs.existsSync(publicDataPath)) {
    cemeteries = JSON.parse(fs.readFileSync(publicDataPath, 'utf-8'));
  } else {
    console.error('❌ No cemetery data found!');
    process.exit(1);
  }

  console.log(`📊 Found ${cemeteries.length} begraafplaatsen\n`);

  // Get all unique plaats values (first priority) and gemeente values (fallback)
  const allPlaces = new Set<string>();

  for (const cemetery of cemeteries) {
    // Add plaats if exists
    if (cemetery.plaats && cemetery.plaats.trim()) {
      allPlaces.add(cemetery.plaats.trim());
    }
    // Also add gemeente as it might be a place name in some cases
    if (cemetery.gemeente && cemetery.gemeente.trim()) {
      allPlaces.add(cemetery.gemeente.trim());
    }
  }

  const uniquePlaces = Array.from(allPlaces).sort();
  console.log(`📍 Found ${uniquePlaces.length} unique plaatsnamen to map\n`);

  // Create mapping
  const mapping: GemeenteMapping = {};
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < uniquePlaces.length; i++) {
    const plaats = uniquePlaces[i];
    process.stdout.write(`[${i + 1}/${uniquePlaces.length}] ${plaats}... `);

    const result = await getGemeenteForPlaats(plaats);

    if (result) {
      mapping[plaats] = result;
      console.log(`✅ → ${result.gemeente} (${result.provincie})`);
      successCount++;
    } else {
      console.log('❌ not found');
      failCount++;
    }

    // Rate limiting - PDOK is a free government API, be nice
    await sleep(100);
  }

  // Save mapping
  const outputPath = path.join(process.cwd(), 'data', 'gemeente-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  // Calculate stats
  const uniqueGemeentes = new Set(Object.values(mapping).map(m => m.gemeente));

  console.log('\n' + '='.repeat(50));
  console.log('✅ Gemeente mapping created!');
  console.log(`📍 ${successCount} plaatsnamen mapped`);
  console.log(`❌ ${failCount} plaatsnamen not found`);
  console.log(`🏛️ ${uniqueGemeentes.size} unique official CBS gemeentes`);
  console.log(`📁 Saved to: ${outputPath}`);
}

main().catch(console.error);
