/**
 * Test script voor Jina.ai scraping - test alleen Limburg
 */

import fs from 'fs';
import path from 'path';

const JINA_API_KEY = 'jina_87f2d697e60a4f93b5b0b7576da1a857shcct21CGvGd4dbCBSyCUHLfKodA';
const JINA_READER_URL = 'https://r.jina.ai/';

interface BegraafplaatsBasic {
  naam: string;
  gemeente: string;
  plaats?: string;
  url: string;
  provincie: string;
}

interface GemeenteInfo {
  naam: string;
  url: string;
  aantal: number;
}

// Fetch met Jina.ai Reader
async function fetchWithJina(url: string): Promise<string> {
  console.log(`   Fetching: ${url}`);

  const response = await fetch(`${JINA_READER_URL}${url}`, {
    headers: {
      'Authorization': `Bearer ${JINA_API_KEY}`,
      'Accept': 'text/plain'
    }
  });

  if (!response.ok) {
    throw new Error(`Jina fetch failed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

// Parse gemeente links van provincie pagina
function parseGemeenteLinks(content: string): GemeenteInfo[] {
  const gemeenten: GemeenteInfo[] = [];

  // Format: [Beek](https://www.begraafplaatsinformatie.nl/gemeente/beek)10
  const gemeentePattern = /\[([^\]]+)\]\((https:\/\/www\.begraafplaatsinformatie\.nl\/gemeente\/[^\)]+)\)(\d+)/g;

  let match;
  while ((match = gemeentePattern.exec(content)) !== null) {
    gemeenten.push({
      naam: match[1],
      url: match[2],
      aantal: parseInt(match[3])
    });
  }

  return gemeenten;
}

// Parse begraafplaatsen van provincie pagina (directe lijst)
function parseBegraafplaatsenDirect(content: string, provincie: string): BegraafplaatsBasic[] {
  const begraafplaatsen: BegraafplaatsBasic[] = [];

  // Format:
  // ##### Naam Begraafplaats
  //
  // Gemeente - Plaats (of alleen Gemeente)
  //
  // [Bekijk details](https://www.begraafplaatsinformatie.nl/...)

  // Patroon voor begraafplaats blokken
  const blockPattern = /#####\s+([^\n]+)\n+([^\n]+)\n+\[Bekijk details\]\((https:\/\/www\.begraafplaatsinformatie\.nl\/[^\)]+)\)/g;

  let match;
  while ((match = blockPattern.exec(content)) !== null) {
    const naam = match[1].trim();
    const locatie = match[2].trim();
    const url = match[3];

    // Parse locatie (kan zijn: "Gemeente" of "Gemeente - Plaats")
    let gemeente = locatie;
    let plaats: string | undefined;

    if (locatie.includes(' - ')) {
      const parts = locatie.split(' - ');
      gemeente = parts[0].trim();
      plaats = parts[1].trim();
    }

    begraafplaatsen.push({
      naam,
      gemeente,
      plaats,
      url,
      provincie
    });
  }

  return begraafplaatsen;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🧪 Test Jina.ai scraping voor Limburg\n');

  const provincie = 'limburg';
  const provincieUrl = `https://www.begraafplaatsinformatie.nl/${provincie}`;

  const outputDir = path.join(__dirname, '../data/jina-test');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Test 1: Haal provincie pagina op
    console.log('Test 1: Provincie pagina ophalen...');
    const content = await fetchWithJina(provincieUrl);
    console.log(`   ✅ Content opgehaald: ${content.length} karakters`);

    // Test 2: Parse gemeenten
    console.log('\nTest 2: Gemeenten parsen...');
    const gemeenten = parseGemeenteLinks(content);
    console.log(`   ✅ ${gemeenten.length} gemeenten gevonden`);
    console.log(`   Totaal begraafplaatsen: ${gemeenten.reduce((sum, g) => sum + g.aantal, 0)}`);

    gemeenten.slice(0, 5).forEach((g, i) => {
      console.log(`   ${i + 1}. ${g.naam} (${g.aantal} begraafplaatsen)`);
    });

    // Test 3: Parse directe begraafplaatsen lijst
    console.log('\nTest 3: Directe begraafplaatsen parsen...');
    const begraafplaatsenDirect = parseBegraafplaatsenDirect(content, provincie);
    console.log(`   ✅ ${begraafplaatsenDirect.length} begraafplaatsen op pagina`);

    begraafplaatsenDirect.slice(0, 5).forEach((bp, i) => {
      console.log(`   ${i + 1}. ${bp.naam} (${bp.gemeente}${bp.plaats ? ' - ' + bp.plaats : ''})`);
    });

    // Test 4: Haal een gemeente pagina op voor meer begraafplaatsen
    if (gemeenten.length > 0) {
      console.log('\nTest 4: Gemeente pagina ophalen (Beek)...');
      await delay(1000);

      const beekContent = await fetchWithJina(gemeenten[0].url);
      console.log(`   ✅ Gemeente content opgehaald: ${beekContent.length} karakters`);

      fs.writeFileSync(path.join(outputDir, 'gemeente-beek-raw.txt'), beekContent);
      console.log(`   💾 Opgeslagen in data/jina-test/gemeente-beek-raw.txt`);

      const begraafplaatsenBeek = parseBegraafplaatsenDirect(beekContent, provincie);
      console.log(`   ✅ ${begraafplaatsenBeek.length} begraafplaatsen in Beek`);

      begraafplaatsenBeek.forEach((bp, i) => {
        console.log(`   ${i + 1}. ${bp.naam}`);
      });
    }

    // Test 5: Haal detail pagina op
    if (begraafplaatsenDirect.length > 0) {
      console.log('\nTest 5: Detail pagina ophalen...');
      await delay(1000);

      const firstBp = begraafplaatsenDirect[0];
      const detailContent = await fetchWithJina(firstBp.url);
      console.log(`   ✅ Detail content opgehaald: ${detailContent.length} karakters`);

      fs.writeFileSync(path.join(outputDir, 'detail-sample.txt'), detailContent);
      console.log(`   💾 Opgeslagen in data/jina-test/detail-sample.txt`);

      // Toon een preview
      console.log('\n   Preview (eerste 800 tekens):');
      console.log('   ---');
      console.log('   ' + detailContent.substring(0, 800).replace(/\n/g, '\n   '));
      console.log('   ---');
    }

    // Sla alle resultaten op
    fs.writeFileSync(
      path.join(outputDir, 'limburg-gemeenten.json'),
      JSON.stringify(gemeenten, null, 2)
    );
    fs.writeFileSync(
      path.join(outputDir, 'limburg-begraafplaatsen.json'),
      JSON.stringify(begraafplaatsenDirect, null, 2)
    );

    console.log('\n✅ Test succesvol afgerond!');
    console.log(`   📊 Resultaten opgeslagen in data/jina-test/`);
    console.log('\nVolgend stap: npm run jina:scrape voor volledige scrape');

  } catch (error) {
    console.error('\n❌ Test gefaald:', error);
    process.exit(1);
  }
}

main();
