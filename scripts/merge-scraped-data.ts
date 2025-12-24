#!/usr/bin/env npx tsx
/**
 * Merge Scraped Data Script
 *
 * Mergt data van scraped-begraafplaatsinformatie/alle-begraafplaatsen.json
 * naar de hoofd begraafplaatsen.json. Vult ontbrekende velden aan.
 */
import * as fs from 'fs';
import * as path from 'path';

interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  slug: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  foto_url?: string;
  bron_url?: string;
  jaar_oprichting?: string;
  [key: string]: any;
}

interface ScrapedItem {
  naam: string;
  gemeente: string;
  plaats?: string;
  url?: string;
  provincie: string;
  foto_url?: string;
  adres?: string;
  postcode?: string;
  type?: string;
  jaar_oprichting?: string;
}

// Normalize string for matching
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Create match key
function createKey(naam: string, gemeente: string): string {
  return `${normalize(naam)}|${normalize(gemeente)}`;
}

async function mergeScrapedData() {
  console.log('\n📊 Merge Scraped Data naar Begraafplaatsen.json\n');

  const baseDir = path.join(__dirname, '..');
  const mainPath = path.join(baseDir, 'data', 'begraafplaatsen.json');
  const scrapedPath = path.join(baseDir, 'data', 'scraped-begraafplaatsinformatie', 'alle-begraafplaatsen.json');
  const publicPath = path.join(baseDir, 'public', 'data', 'cemeteries.json');
  const backupPath = path.join(baseDir, 'data', `backup-${Date.now()}.json`);

  // Load main data (array)
  console.log('📂 Laden van hoofd data...');
  const mainData: Cemetery[] = JSON.parse(fs.readFileSync(mainPath, 'utf-8'));
  console.log(`   ${mainData.length} begraafplaatsen geladen`);

  // Load scraped data
  console.log('📂 Laden van gescrapete data...');
  const scrapedData: ScrapedItem[] = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
  console.log(`   ${scrapedData.length} gescrapete records geladen`);

  // Backup
  console.log('💾 Backup maken...');
  fs.writeFileSync(backupPath, JSON.stringify(mainData, null, 2));

  // Create scraped lookup map
  const scrapedMap = new Map<string, ScrapedItem>();
  for (const item of scrapedData) {
    const key = createKey(item.naam, item.gemeente);
    scrapedMap.set(key, item);

    // Also add with plaats
    if (item.plaats) {
      scrapedMap.set(createKey(item.naam, item.plaats), item);
    }
  }

  // Stats
  let matched = 0;
  let addedFotoUrl = 0;
  let addedBronUrl = 0;
  let addedJaar = 0;
  let addedAdres = 0;
  let addedPostcode = 0;

  // Merge
  console.log('\n🔄 Mergen...');
  for (const cem of mainData) {
    const key = createKey(cem.naam_begraafplaats, cem.gemeente);
    let scraped = scrapedMap.get(key);

    // Try with plaats
    if (!scraped && cem.plaats) {
      scraped = scrapedMap.get(createKey(cem.naam_begraafplaats, cem.plaats));
    }

    if (scraped) {
      matched++;

      // foto_url (skip logos)
      if (scraped.foto_url &&
          !scraped.foto_url.includes('logo.svg') &&
          !scraped.foto_url.includes('google-logo') &&
          !cem.foto_url) {
        cem.foto_url = scraped.foto_url;
        addedFotoUrl++;
      }

      // bron_url
      if (scraped.url && !cem.bron_url) {
        cem.bron_url = scraped.url;
        addedBronUrl++;
      }

      // jaar_oprichting
      if (scraped.jaar_oprichting && !cem.jaar_oprichting) {
        cem.jaar_oprichting = scraped.jaar_oprichting;
        addedJaar++;
      }

      // adres
      if (scraped.adres && !cem.adres) {
        cem.adres = scraped.adres;
        addedAdres++;
      }

      // postcode
      if (scraped.postcode && !cem.postcode) {
        cem.postcode = scraped.postcode;
        addedPostcode++;
      }
    }
  }

  // Save
  console.log('\n💾 Opslaan...');
  fs.writeFileSync(mainPath, JSON.stringify(mainData, null, 2));
  fs.writeFileSync(publicPath, JSON.stringify(mainData, null, 2));

  // Summary
  console.log('\n✅ Merge voltooid!\n');
  console.log(`Statistieken:`);
  console.log(`   Totaal:              ${mainData.length}`);
  console.log(`   Gematched:           ${matched}`);
  console.log(`   Foto URL toegevoegd: ${addedFotoUrl}`);
  console.log(`   Bron URL toegevoegd: ${addedBronUrl}`);
  console.log(`   Jaar toegevoegd:     ${addedJaar}`);
  console.log(`   Adres toegevoegd:    ${addedAdres}`);
  console.log(`   Postcode toegevoegd: ${addedPostcode}`);
  console.log(`\n📁 Updated: ${mainPath}`);
  console.log(`📁 Updated: ${publicPath}`);
}

mergeScrapedData().catch(console.error);