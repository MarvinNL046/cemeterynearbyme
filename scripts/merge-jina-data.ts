/**
 * Merge Script: Combineert nieuwe Jina.ai data met bestaande data
 *
 * Strategie:
 * 1. Bestaande URLs en slugs BEHOUDEN (SEO!)
 * 2. Bestaande data VERRIJKEN met nieuwe info
 * 3. Nieuwe begraafplaatsen TOEVOEGEN
 * 4. Redirect map genereren indien nodig
 */

import fs from 'fs';
import path from 'path';

interface ExistingCemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  slug: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  rating?: string;
  reviews?: string;
  photo?: string;
  gps_coordinaten?: string;
  telefoon?: string;
  website?: string;
  // ... andere velden
  [key: string]: any;
}

interface JinaCemetery {
  naam: string;
  gemeente: string;
  plaats?: string;
  url: string;
  provincie: string;
  adres?: string;
  postcode?: string;
  type?: string;
  jaar_oprichting?: string;
  foto_url?: string;
  telefoon?: string;
  website?: string;
}

interface MergeStats {
  existing_count: number;
  jina_count: number;
  matched: number;
  enriched: number;
  new_added: number;
  final_count: number;
}

// Normaliseer tekst voor vergelijking
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Genereer slug van naam en plaats
function generateSlug(naam: string, plaats?: string, gemeente?: string): string {
  const base = plaats || gemeente || '';
  const combined = `${naam}-${base}`.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return combined || 'begraafplaats';
}

// Match begraafplaats op naam + gemeente/plaats
function findMatch(jina: JinaCemetery, existing: ExistingCemetery[]): ExistingCemetery | null {
  const jinaNameNorm = normalize(jina.naam);
  const jinaGemeenteNorm = normalize(jina.gemeente);
  const jinaPlaatsNorm = jina.plaats ? normalize(jina.plaats) : '';

  for (const ex of existing) {
    const exNameNorm = normalize(ex.naam_begraafplaats);
    const exGemeenteNorm = normalize(ex.gemeente);
    const exPlaatsNorm = ex.plaats ? normalize(ex.plaats) : '';

    // Exacte match op naam + gemeente
    if (jinaNameNorm === exNameNorm && jinaGemeenteNorm === exGemeenteNorm) {
      return ex;
    }

    // Match op naam + plaats
    if (jinaNameNorm === exNameNorm && jinaPlaatsNorm && jinaPlaatsNorm === exPlaatsNorm) {
      return ex;
    }

    // Fuzzy match: naam bevat elkaar + zelfde gemeente
    if (jinaGemeenteNorm === exGemeenteNorm) {
      if (jinaNameNorm.includes(exNameNorm) || exNameNorm.includes(jinaNameNorm)) {
        // Extra check: minimaal 70% overlap
        const shorter = jinaNameNorm.length < exNameNorm.length ? jinaNameNorm : exNameNorm;
        const longer = jinaNameNorm.length >= exNameNorm.length ? jinaNameNorm : exNameNorm;
        if (shorter.length / longer.length > 0.7) {
          return ex;
        }
      }
    }
  }

  return null;
}

// Converteer Jina type naar bestaand type format
function convertType(jinaType?: string): string {
  if (!jinaType) return 'algemene begraafplaats';

  const typeLower = jinaType.toLowerCase();

  if (typeLower.includes('joods') || typeLower.includes('israël')) {
    return 'joodse begraafplaats';
  }
  if (typeLower.includes('islam')) {
    return 'islamitische begraafplaats';
  }
  if (typeLower.includes('natuur')) {
    return 'natuurbegraafplaats';
  }

  return 'algemene begraafplaats';
}

// Verrijk bestaande entry met Jina data
function enrichExisting(existing: ExistingCemetery, jina: JinaCemetery): ExistingCemetery {
  const enriched = { ...existing };

  // Alleen aanvullen wat ontbreekt, niet overschrijven
  if (!enriched.adres && jina.adres) {
    enriched.adres = jina.adres;
  }
  if (!enriched.postcode && jina.postcode) {
    enriched.postcode = jina.postcode;
  }
  if (!enriched.plaats && jina.plaats) {
    enriched.plaats = jina.plaats;
  }
  if (!enriched.telefoon && jina.telefoon) {
    enriched.telefoon = jina.telefoon;
  }
  if (!enriched.website && jina.website) {
    enriched.website = jina.website;
  }

  // Nieuwe velden toevoegen
  if (jina.jaar_oprichting) {
    enriched.jaar_oprichting = jina.jaar_oprichting;
  }

  // Bron URL opslaan voor referentie
  enriched.bron_url = jina.url;

  return enriched;
}

// Converteer Jina entry naar bestaand formaat
function convertJinaToExisting(jina: JinaCemetery): ExistingCemetery {
  return {
    naam_begraafplaats: jina.naam,
    gemeente: jina.gemeente,
    provincie: jina.provincie,
    type: convertType(jina.type),
    slug: generateSlug(jina.naam, jina.plaats, jina.gemeente),
    adres: jina.adres,
    postcode: jina.postcode,
    plaats: jina.plaats,
    telefoon: jina.telefoon,
    website: jina.website,
    jaar_oprichting: jina.jaar_oprichting,
    bron_url: jina.url,
    // Geen foto - moet later via Google Places
  };
}

async function main() {
  console.log('🔄 Start merge van Jina.ai data met bestaande data\n');

  const stats: MergeStats = {
    existing_count: 0,
    jina_count: 0,
    matched: 0,
    enriched: 0,
    new_added: 0,
    final_count: 0
  };

  // 1. Laad bestaande data
  const existingPath = path.join(__dirname, '../data/begraafplaatsen.json');
  let existingData: ExistingCemetery[] = [];

  if (fs.existsSync(existingPath)) {
    existingData = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
    stats.existing_count = existingData.length;
    console.log(`📂 Bestaande data geladen: ${stats.existing_count} begraafplaatsen`);
  } else {
    console.log('⚠️  Geen bestaande data gevonden, nieuwe database wordt aangemaakt');
  }

  // 2. Laad Jina data (gecombineerd bestand)
  const jinaPath = path.join(__dirname, '../data/scraped-begraafplaatsinformatie/alle-begraafplaatsen.json');

  if (!fs.existsSync(jinaPath)) {
    console.error('❌ Jina data niet gevonden! Eerst npm run jina:scrape uitvoeren.');
    process.exit(1);
  }

  const jinaData: JinaCemetery[] = JSON.parse(fs.readFileSync(jinaPath, 'utf-8'));
  stats.jina_count = jinaData.length;
  console.log(`📂 Jina data geladen: ${stats.jina_count} begraafplaatsen\n`);

  // 3. Merge proces
  console.log('🔍 Matching en merging...\n');

  const mergedData: ExistingCemetery[] = [...existingData];
  const usedSlugs = new Set(existingData.map(e => e.slug));
  const matchedJinaUrls = new Set<string>();

  for (const jina of jinaData) {
    const match = findMatch(jina, existingData);

    if (match) {
      // Match gevonden - verrijk bestaande entry
      stats.matched++;
      matchedJinaUrls.add(jina.url);

      const index = mergedData.findIndex(e => e.slug === match.slug);
      if (index !== -1) {
        const enriched = enrichExisting(mergedData[index], jina);
        if (JSON.stringify(enriched) !== JSON.stringify(mergedData[index])) {
          mergedData[index] = enriched;
          stats.enriched++;
        }
      }
    } else {
      // Geen match - nieuwe entry toevoegen
      const newEntry = convertJinaToExisting(jina);

      // Zorg voor unieke slug
      let slug = newEntry.slug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${newEntry.slug}-${counter}`;
        counter++;
      }
      newEntry.slug = slug;
      usedSlugs.add(slug);

      mergedData.push(newEntry);
      stats.new_added++;
    }
  }

  stats.final_count = mergedData.length;

  // 4. Resultaten opslaan
  console.log('\n💾 Resultaten opslaan...');

  // Backup van oude data
  const backupPath = path.join(__dirname, '../data/begraafplaatsen-backup-' + new Date().toISOString().split('T')[0] + '.json');
  if (existingData.length > 0) {
    fs.writeFileSync(backupPath, JSON.stringify(existingData, null, 2));
    console.log(`   📦 Backup: ${backupPath}`);
  }

  // Nieuwe merged data
  fs.writeFileSync(existingPath, JSON.stringify(mergedData, null, 2));
  console.log(`   ✅ Merged data: ${existingPath}`);

  // Ook naar public folder
  const publicPath = path.join(__dirname, '../public/data/cemeteries.json');
  fs.writeFileSync(publicPath, JSON.stringify(mergedData, null, 2));
  console.log(`   ✅ Public data: ${publicPath}`);

  // Statistieken
  console.log('\n📊 MERGE RESULTATEN:');
  console.log('═══════════════════════════════════════');
  console.log(`   Bestaande entries:     ${stats.existing_count}`);
  console.log(`   Jina entries:          ${stats.jina_count}`);
  console.log(`   ─────────────────────────────────────`);
  console.log(`   Matches gevonden:      ${stats.matched}`);
  console.log(`   Verrijkt met data:     ${stats.enriched}`);
  console.log(`   NIEUW toegevoegd:      ${stats.new_added}`);
  console.log(`   ─────────────────────────────────────`);
  console.log(`   TOTAAL na merge:       ${stats.final_count}`);
  console.log('═══════════════════════════════════════');

  // Stats opslaan
  const statsPath = path.join(__dirname, '../data/merge-stats.json');
  fs.writeFileSync(statsPath, JSON.stringify({
    ...stats,
    timestamp: new Date().toISOString()
  }, null, 2));

  console.log('\n✅ Merge voltooid!');
  console.log('\n📝 Volgende stappen:');
  console.log('   1. npm run build - om sitemaps te regenereren');
  console.log('   2. Controleer de nieuwe paginas op de website');
  console.log('   3. Submit nieuwe sitemap naar Google Search Console');
}

main().catch(console.error);
