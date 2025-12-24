/**
 * Scraper voor begraafplaatsinformatie.nl via Jina.ai Reader API
 *
 * Dit script haalt alle begraafplaatsen op van begraafplaatsinformatie.nl
 * en slaat ze op in een gestructureerd JSON formaat.
 */

import fs from 'fs';
import path from 'path';

// Jina.ai API configuratie
const JINA_API_KEY = 'jina_87f2d697e60a4f93b5b0b7576da1a857shcct21CGvGd4dbCBSyCUHLfKodA';
const JINA_READER_URL = 'https://r.jina.ai/';

// Alle Nederlandse provincies
const PROVINCIES = [
  'drenthe',
  'flevoland',
  'friesland',
  'gelderland',
  'groningen',
  'limburg',
  'noord-brabant',
  'noord-holland',
  'overijssel',
  'utrecht',
  'zeeland',
  'zuid-holland'
];

interface BegraafplaatsBasic {
  naam: string;
  gemeente: string;
  plaats?: string;
  url: string;
  provincie: string;
}

interface BegraafplaatsDetail extends BegraafplaatsBasic {
  adres?: string;
  postcode?: string;
  type?: string;
  jaar_oprichting?: string;
  faciliteiten?: string[];
  openingstijden?: string;
  telefoon?: string;
  website?: string;
  beschrijving?: string;
  foto_url?: string;
}

interface ScrapeProgress {
  lastProvince: string;
  lastIndex: number;
  completedProvinces: string[];
  totalScraped: number;
  timestamp: string;
}

// Rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch met Jina.ai Reader
async function fetchWithJina(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`   ⚠️ Poging ${attempt} mislukt, opnieuw proberen...`);
      await delay(2000 * attempt);
    }
  }
  throw new Error('Max retries exceeded');
}

// Parse begraafplaatsen van provincie pagina
function parseBegraafplaatsenLijst(content: string, provincie: string): BegraafplaatsBasic[] {
  const begraafplaatsen: BegraafplaatsBasic[] = [];

  // Format:
  // ##### Naam Begraafplaats
  //
  // Gemeente - Plaats (of alleen Gemeente)
  //
  // [Bekijk details](https://www.begraafplaatsinformatie.nl/...)

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

// Parse detail pagina voor volledige informatie
function parseDetailPagina(content: string, basic: BegraafplaatsBasic): BegraafplaatsDetail {
  const detail: BegraafplaatsDetail = { ...basic };

  // Foto URL extractie
  const fotoMatch = content.match(/!\[Image[^\]]*\]\((https:\/\/www\.begraafplaatsinformatie\.nl\/img\/[^\)]+)\)/);
  if (fotoMatch) {
    detail.foto_url = fotoMatch[1];
  }

  // Adres extractie - zoek naar straatnaam met huisnummer
  const adresMatch = content.match(/([A-Z][a-z]+(?:\s+[a-z]+)*(?:straat|weg|laan|plein|pad|dreef|hof|singel|kade|gracht))\s+(\d+[a-zA-Z]?)/i);
  if (adresMatch) {
    detail.adres = `${adresMatch[1]} ${adresMatch[2]}`;
  }

  // Postcode extractie
  const postcodeMatch = content.match(/(\d{4}\s?[A-Z]{2})\s+([A-Za-z\-\s]+)\s*\(/);
  if (postcodeMatch) {
    detail.postcode = postcodeMatch[1].replace(' ', '');
  }

  // Type extractie
  const typeMatch = content.match(/\*\*Type:\*\*\s*([^\n]+)/i);
  if (typeMatch) {
    detail.type = typeMatch[1].trim();
  }

  // Jaar van oprichting
  const jaarMatch = content.match(/\*\*Jaar van oprichting:\*\*\s*(\d{4})/i);
  if (jaarMatch) {
    detail.jaar_oprichting = jaarMatch[1];
  }

  // Telefoon
  const telMatch = content.match(/(\+31[\s\-]?(?:\d[\s\-]?){9}|\b0\d{2}[\s\-]?\d{7}\b|\b0\d{3}[\s\-]?\d{6}\b)/);
  if (telMatch) {
    detail.telefoon = telMatch[1].replace(/[\s\-]/g, '');
  }

  // Website - zoek naar externe links
  const webMatch = content.match(/\[(?:website|bezoek website)\]\((https?:\/\/(?!www\.begraafplaatsinformatie)[^\)]+)\)/i);
  if (webMatch) {
    detail.website = webMatch[1];
  }

  return detail;
}

// Laad of maak progress file
function loadProgress(): ScrapeProgress {
  const progressPath = path.join(__dirname, '../data/scraped-begraafplaatsinformatie/progress.json');

  if (fs.existsSync(progressPath)) {
    return JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
  }

  return {
    lastProvince: '',
    lastIndex: 0,
    completedProvinces: [],
    totalScraped: 0,
    timestamp: new Date().toISOString()
  };
}

// Sla progress op
function saveProgress(progress: ScrapeProgress): void {
  const outputDir = path.join(__dirname, '../data/scraped-begraafplaatsinformatie');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const progressPath = path.join(outputDir, 'progress.json');
  progress.timestamp = new Date().toISOString();
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

// Sla begraafplaatsen op per provincie
function saveProvincieData(provincie: string, data: BegraafplaatsDetail[]): void {
  const outputDir = path.join(__dirname, '../data/scraped-begraafplaatsinformatie');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${provincie}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`✅ ${data.length} begraafplaatsen opgeslagen voor ${provincie}`);
}

// Combineer alle data tot één bestand
function combineAllData(): void {
  const outputDir = path.join(__dirname, '../data/scraped-begraafplaatsinformatie');
  const allData: BegraafplaatsDetail[] = [];

  for (const provincie of PROVINCIES) {
    const filePath = path.join(outputDir, `${provincie}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allData.push(...data);
    }
  }

  // Sla gecombineerde data op
  const combinedPath = path.join(outputDir, 'alle-begraafplaatsen.json');
  fs.writeFileSync(combinedPath, JSON.stringify(allData, null, 2));

  console.log(`\n📊 Totaal: ${allData.length} begraafplaatsen gecombineerd`);

  // Maak ook een summary
  const summary = {
    totaal: allData.length,
    per_provincie: {} as Record<string, number>,
    per_type: {} as Record<string, number>,
    met_adres: allData.filter(bp => bp.adres).length,
    met_postcode: allData.filter(bp => bp.postcode).length,
    met_foto: allData.filter(bp => bp.foto_url).length,
    met_jaar: allData.filter(bp => bp.jaar_oprichting).length,
    laatste_update: new Date().toISOString()
  };

  for (const bp of allData) {
    summary.per_provincie[bp.provincie] = (summary.per_provincie[bp.provincie] || 0) + 1;
    if (bp.type) {
      summary.per_type[bp.type] = (summary.per_type[bp.type] || 0) + 1;
    }
  }

  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
}

// Hoofdfunctie
async function main() {
  console.log('🚀 Start scraping begraafplaatsinformatie.nl via Jina.ai\n');

  const progress = loadProgress();
  let startProvinceIndex = 0;

  // Hervat vanaf laatste positie
  if (progress.lastProvince) {
    startProvinceIndex = PROVINCIES.indexOf(progress.lastProvince);
    console.log(`📍 Hervatten vanaf ${progress.lastProvince} (${progress.totalScraped} al gescraped)\n`);
  }

  for (let i = startProvinceIndex; i < PROVINCIES.length; i++) {
    const provincie = PROVINCIES[i];

    // Skip als al voltooid
    if (progress.completedProvinces.includes(provincie)) {
      console.log(`⏭️  ${provincie} al voltooid, overslaan`);
      continue;
    }

    console.log(`\n📍 Scraping ${provincie.toUpperCase()}...`);

    try {
      // Haal provincie pagina op
      const provincieUrl = `https://www.begraafplaatsinformatie.nl/${provincie}`;
      console.log(`   Ophalen: ${provincieUrl}`);

      const provincieContent = await fetchWithJina(provincieUrl);
      await delay(1000); // Rate limiting

      // Parse lijst van begraafplaatsen
      const begraafplaatsenBasic = parseBegraafplaatsenLijst(provincieContent, provincie);
      console.log(`   Gevonden: ${begraafplaatsenBasic.length} begraafplaatsen`);

      const begraafplaatsenDetail: BegraafplaatsDetail[] = [];

      // Haal details op per begraafplaats
      const startIndex = (progress.lastProvince === provincie) ? progress.lastIndex : 0;

      for (let j = startIndex; j < begraafplaatsenBasic.length; j++) {
        const bp = begraafplaatsenBasic[j];

        try {
          console.log(`   [${j + 1}/${begraafplaatsenBasic.length}] ${bp.naam}`);

          const detailContent = await fetchWithJina(bp.url);
          const detail = parseDetailPagina(detailContent, bp);
          begraafplaatsenDetail.push(detail);

          // Update progress
          progress.lastProvince = provincie;
          progress.lastIndex = j + 1;
          progress.totalScraped++;

          // Save progress elke 10 items
          if (j % 10 === 0) {
            saveProgress(progress);
          }

          // Rate limiting - wacht 500ms tussen requests
          await delay(500);

        } catch (error) {
          console.error(`   ❌ Fout bij ${bp.naam}: ${error}`);
          // Sla op wat we hebben en ga door
          begraafplaatsenDetail.push({ ...bp });
        }
      }

      // Sla provincie data op
      saveProvincieData(provincie, begraafplaatsenDetail);

      // Markeer als voltooid
      progress.completedProvinces.push(provincie);
      progress.lastIndex = 0;
      saveProgress(progress);

      console.log(`✅ ${provincie} voltooid: ${begraafplaatsenDetail.length} begraafplaatsen`);

      // Wacht even tussen provincies
      await delay(2000);

    } catch (error) {
      console.error(`❌ Fout bij provincie ${provincie}: ${error}`);
      saveProgress(progress);
    }
  }

  // Combineer alle data
  console.log('\n📦 Combineren van alle data...');
  combineAllData();

  console.log('\n🎉 Scraping voltooid!');
}

// Run als direct uitgevoerd
main().catch(console.error);
