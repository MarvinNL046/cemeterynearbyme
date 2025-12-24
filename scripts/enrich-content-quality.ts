#!/usr/bin/env npx tsx
/**
 * HIGH-QUALITY Content Enrichment Script
 *
 * Genereert unieke, waardevolle content per begraafplaats voor AdSense approval.
 *
 * Features:
 * - Type-specifieke prompts (joodse, natuur, islamitisch, etc.)
 * - Gebruikt ALLE beschikbare context data
 * - Minimum 400 woorden per pagina
 * - Variatie in openingszinnen (geen template-content)
 * - Quality checks en retry logic
 * - Progress tracking met resume capability
 *
 * Gebruik:
 *   npx tsx scripts/enrich-content-quality.ts --dry-run      # Preview
 *   npx tsx scripts/enrich-content-quality.ts --batch 50     # Eerste 50
 *   npx tsx scripts/enrich-content-quality.ts --reset        # Start opnieuw
 *   npx tsx scripts/enrich-content-quality.ts                # Volledige run
 */

import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env.openai
dotenv.config({ path: path.join(process.cwd(), '.env.openai') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') }); // Fallback

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.8, // Hogere temperature voor meer variatie
  CONCURRENCY: 5,
  MIN_WORDS: 400,
  MAX_RETRIES: 3,
  DELAY_BETWEEN_REQUESTS: 200, // ms
  SAVE_INTERVAL: 25, // Save elke 25 entries

  DATA_FILE: path.join(process.cwd(), 'data', 'begraafplaatsen.json'),
  PROGRESS_FILE: path.join(process.cwd(), 'data', 'enrichment-quality-progress.json'),
  BACKUP_FILE: path.join(process.cwd(), 'data', 'begraafplaatsen-pre-enrichment.json'),
};

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  slug: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gps_coordinaten?: string;
  telefoon?: string;
  website?: string;
  openingstijden?: string;
  jaar_oprichting?: string;
  oppervlakte?: string;
  aantal_graven?: string;
  aantal_personen?: string;
  faciliteiten?: string[];
  embeddedReviews?: any[];
  google_rating?: string;
  google_review_count?: string;
  wikipedia_url?: string;
  bron_url?: string;
  generated?: any;
  [key: string]: any;
}

interface GeneratedContent {
  samenvatting: string;
  geschiedenis?: string;
  sfeer_en_omgeving?: string;
  praktische_informatie?: string;
  bijzonderheden?: string[];
  bezoekerstips?: string[];
}

interface Progress {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  completedSlugs: string[];
  failedSlugs: string[];
  lastRun: string;
  avgWordCount: number;
}

// =============================================================================
// TYPE-SPECIFIC PROMPTS
// =============================================================================

const TYPE_CONTEXTS: Record<string, string> = {
  'joodse begraafplaats': `
Dit is een JOODSE begraafplaats. Belangrijke aspecten om te benadrukken:
- Joodse begrafenistradities (tahara, tachrichim, eenvoudige kisten)
- Grafstenen met Hebreeuwse inscripties
- Oriëntatie van graven richting Jeruzalem
- Het plaatsen van steentjes op graven als teken van herinnering
- Historische context van de Joodse gemeenschap in deze regio
- Eventuele verbanden met WOII en de Holocaust
- Het eeuwige karakter van Joodse graven (geen ruiming)
- De rol van de chevra kadisha (begrafenisgenootschap)
`,

  'natuurbegraafplaats': `
Dit is een NATUURBEGRAAFPLAATS. Belangrijke aspecten om te benadrukken:
- Ecologische en duurzame benadering van begraven
- Integratie met de natuur (bomen, wilde bloemen, fauna)
- Biologisch afbreekbare materialen (kisten, urnen)
- Geen traditionele grafstenen, maar natuurlijke markers
- Bijdrage aan natuurbehoud en biodiversiteit
- De rust en sereniteit van de natuurlijke omgeving
- Wandelpaden en natuurbeleving voor bezoekers
- Het filosofische aspect: terugkeer naar de natuur
`,

  'islamitische begraafplaats': `
Dit is een ISLAMITISCHE begraafplaats. Belangrijke aspecten om te benadrukken:
- Islamitische begrafenisrituelen (ghusl, kafan)
- Oriëntatie van graven richting Mekka (Qibla)
- Het belang van snelle begrafenis in de islam
- Eenvoudige graven zonder overdadige decoratie
- Gescheiden secties voor mannen en vrouwen waar van toepassing
- De groeiende moslimgemeenschap in Nederland
- Respect voor islamitische tradities en gebruiken
- Rol van de moskee en imam bij begrafenissen
`,

  'rooms-katholieke begraafplaats': `
Dit is een ROOMS-KATHOLIEKE begraafplaats. Belangrijke aspecten om te benadrukken:
- Katholieke tradities rond dood en begrafenis
- Kruisen en religieuze symboliek op grafmonumenten
- De rol van de parochie en pastoor
- Sacramenten (laatste oliesel, uitvaartmis)
- Historische banden met de lokale kerk
- Eventuele klooster- of priestersecties
- Allerheiligen en Allerzielen tradities
- De troost van het geloof in het hiernamaals
`,

  'protestantse begraafplaats': `
Dit is een PROTESTANTSE begraafplaats. Belangrijke aspecten om te benadrukken:
- Protestantse/hervormde tradities
- Sobere, waardige grafmonumenten
- Historische banden met de Nederlands Hervormde of Gereformeerde kerk
- De rol van de kerkenraad en dominee
- Bijbelteksten op grafstenen
- Reformatorisch erfgoed in de regio
- Eenvoud en ingetogenheid als kernwaarden
`,

  'oorlogsbegraafplaats': `
Dit is een OORLOGSBEGRAAFPLAATS. Belangrijke aspecten om te benadrukken:
- Herdenking van gevallenen uit WOI, WOII of andere conflicten
- De verhalen achter de slachtoffers
- Internationale samenwerking (bijv. Commonwealth War Graves)
- Herdenkingsceremonies en monumenten
- De blijvende les van oorlog en vrede
- Educatieve waarde voor nieuwe generaties
- Onderhoud en respect voor de gevallenen
- Persoonlijke verhalen van helden en burgerslachtoffers
`,

  'bijzondere begraafplaats': `
Dit is een BIJZONDERE begraafplaats. Onderzoek wat deze begraafplaats uniek maakt:
- Is het een historische begraafplaats met monumentale waarde?
- Zijn er beroemde of belangrijke personen begraven?
- Heeft het een bijzondere architectuur of landschapsontwerp?
- Is er een specifieke gemeenschap of groep die hier begraven ligt?
- Wat maakt de sfeer of locatie bijzonder?
`,

  'crematorium': `
Dit betreft een CREMATORIUM. Belangrijke aspecten om te benadrukken:
- Moderne voorzieningen voor crematie
- Afscheidsruimtes en aula's
- De keuze voor crematie in Nederland
- Asbestemming mogelijkheden
- Milieuvriendelijke aspecten van moderne crematie
- Combinatie met uitvaartcentrum of begraafplaats
`,
};

const OPENING_VARIATIONS = [
  'In het hart van {gemeente} ligt',
  'Verscholen in {provincie} bevindt zich',
  'Al sinds {jaar} vormt',
  'Tussen de {omgeving} van {plaats} rust',
  'Een bijzondere plek in {gemeente} is',
  'Midden in {plaats} treffen bezoekers',
  'Aan de rand van {gemeente} ligt',
  'In de rustige omgeving van {plaats} bevindt zich',
  'Een waardig monument in {provincie} is',
  'Omringd door {omgeving} staat',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTypeContext(type: string): string {
  const lowerType = type.toLowerCase();

  for (const [key, context] of Object.entries(TYPE_CONTEXTS)) {
    if (lowerType.includes(key.replace(' begraafplaats', ''))) {
      return context;
    }
  }

  // Default voor algemene begraafplaats
  return `
Dit is een ALGEMENE begraafplaats. Belangrijke aspecten om te benadrukken:
- De rol van de begraafplaats in de lokale gemeenschap
- Historische ontwikkeling en oprichting
- Verschillende secties of grafvelden
- Monumentale of bijzondere graven
- Landschappelijke kenmerken en beplanting
- Praktische voorzieningen voor bezoekers
- Verbinding met de lokale geschiedenis
- Betekenis voor nabestaanden en de gemeenschap
`;
}

function buildContextString(cemetery: Cemetery): string {
  const parts: string[] = [];

  if (cemetery.jaar_oprichting) {
    parts.push(`Opgericht in: ${cemetery.jaar_oprichting}`);
  }
  if (cemetery.oppervlakte) {
    parts.push(`Oppervlakte: ${cemetery.oppervlakte} m²`);
  }
  if (cemetery.aantal_graven) {
    parts.push(`Aantal graven: ${cemetery.aantal_graven}`);
  }
  if (cemetery.aantal_personen) {
    parts.push(`Begraven personen: ${cemetery.aantal_personen}`);
  }
  if (cemetery.faciliteiten) {
    const faciliteiten = Array.isArray(cemetery.faciliteiten)
      ? cemetery.faciliteiten
      : [cemetery.faciliteiten];
    if (faciliteiten.length > 0) {
      parts.push(`Faciliteiten: ${faciliteiten.join(', ')}`);
    }
  }
  if (cemetery.openingstijden) {
    parts.push(`Openingstijden: ${cemetery.openingstijden}`);
  }
  if (cemetery.google_rating) {
    parts.push(`Google rating: ${cemetery.google_rating}/5 (${cemetery.google_review_count || '?'} reviews)`);
  }
  if (cemetery.wikipedia_url) {
    parts.push(`Heeft Wikipedia pagina: Ja`);
  }
  if (cemetery.embeddedReviews && cemetery.embeddedReviews.length > 0) {
    const reviewSnippets = cemetery.embeddedReviews
      .slice(0, 3)
      .map(r => r.review_text || r.text)
      .filter(Boolean)
      .map(t => t.substring(0, 100));
    if (reviewSnippets.length > 0) {
      parts.push(`Bezoekersreacties: "${reviewSnippets.join('" | "')}"`);
    }
  }

  return parts.join('\n');
}

function createPrompt(cemetery: Cemetery): string {
  const typeContext = getTypeContext(cemetery.type);
  const dataContext = buildContextString(cemetery);
  const randomOpening = OPENING_VARIATIONS[Math.floor(Math.random() * OPENING_VARIATIONS.length)];

  return `Je bent een ervaren schrijver gespecialiseerd in Nederlandse begraafplaatsen en funeraire cultuur.

OPDRACHT: Schrijf een informatieve, unieke en boeiende tekst over deze begraafplaats.

=== BEGRAAFPLAATS GEGEVENS ===
Naam: ${cemetery.naam_begraafplaats}
Type: ${cemetery.type}
Gemeente: ${cemetery.gemeente}
Provincie: ${cemetery.provincie}
${cemetery.plaats ? `Plaats: ${cemetery.plaats}` : ''}
${cemetery.adres ? `Adres: ${cemetery.adres}` : ''}

=== BESCHIKBARE INFORMATIE ===
${dataContext || 'Geen aanvullende informatie beschikbaar.'}

=== TYPE-SPECIFIEKE CONTEXT ===
${typeContext}

=== SCHRIJFINSTRUCTIES ===

1. LENGTE: Schrijf MINIMAAL 400 woorden, bij voorkeur 450-500 woorden.

2. OPENINGSZIN: Begin NIET met "${cemetery.naam_begraafplaats} is een..."
   Gebruik een creatieve opening, bijvoorbeeld variaties op: "${randomOpening}"

3. STRUCTUUR: Verweef de volgende elementen natuurlijk in je tekst:
   - Een sfeervolle introductie die de lezer meeneemt
   - Historische context of achtergrond
   - Beschrijving van de omgeving en sfeer
   - Praktische informatie voor bezoekers
   - Wat maakt deze plek bijzonder of betekenisvol

4. TOON: Respectvol maar toegankelijk, informatief maar niet droog.

5. LOKALE RELEVANTIE: Verwijs naar de gemeente ${cemetery.gemeente} en provincie ${cemetery.provincie}.
   Maak de tekst relevant voor mensen die hier zoeken.

6. UNIEKHEID: Elke zin moet waarde toevoegen. Geen opvulzinnen of generieke teksten.

7. SEO: Verwerk natuurlijk de termen: "${cemetery.naam_begraafplaats}", "begraafplaats ${cemetery.gemeente}", "${cemetery.type}".

=== OUTPUT FORMAT (JSON) ===
{
  "samenvatting": "De volledige tekst van minimaal 400 woorden",
  "geschiedenis": "2-3 zinnen over de geschiedenis indien bekend",
  "sfeer_en_omgeving": "2-3 zinnen over de sfeer en omgeving",
  "praktische_informatie": "Belangrijkste praktische info voor bezoekers",
  "bijzonderheden": ["Bijzonderheid 1", "Bijzonderheid 2", "Bijzonderheid 3"],
  "bezoekerstips": ["Tip 1", "Tip 2"]
}

BELANGRIJK: De "samenvatting" moet de hoofdtekst zijn van minimaal 400 woorden. Dit is de belangrijkste content.`;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function validateContent(content: GeneratedContent, cemetery: Cemetery): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  const wordCount = countWords(content.samenvatting || '');
  if (wordCount < CONFIG.MIN_WORDS) {
    issues.push(`Te weinig woorden: ${wordCount} (minimum: ${CONFIG.MIN_WORDS})`);
  }

  // Check voor template-achtige opening
  const templateOpenings = [
    `${cemetery.naam_begraafplaats} is een`,
    `${cemetery.naam_begraafplaats} is de`,
    `Dit is een ${cemetery.type}`,
    `Deze begraafplaats is`,
  ];

  const samenvatting = content.samenvatting?.toLowerCase() || '';
  for (const template of templateOpenings) {
    if (samenvatting.startsWith(template.toLowerCase())) {
      issues.push(`Template-achtige opening gedetecteerd: "${template}..."`);
      break;
    }
  }

  // Check voor te generieke content
  const genericPhrases = [
    'biedt een waardige rustplaats',
    'staat open voor alle gezindten',
    'vervult een belangrijke functie',
  ];

  let genericCount = 0;
  for (const phrase of genericPhrases) {
    if (samenvatting.includes(phrase.toLowerCase())) {
      genericCount++;
    }
  }
  if (genericCount >= 2) {
    issues.push('Te veel generieke zinnen gedetecteerd');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// MAIN ENRICHMENT LOGIC
// =============================================================================

async function enrichCemetery(
  openai: OpenAI,
  cemetery: Cemetery,
  attempt: number = 1
): Promise<GeneratedContent | null> {
  try {
    const prompt = createPrompt(cemetery);

    const response = await openai.chat.completions.create({
      model: CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: 'Je bent een expert in Nederlandse begraafplaatsen en funeraire cultuur. Je schrijft altijd unieke, informatieve content. Antwoord in valid JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: CONFIG.TEMPERATURE,
      max_tokens: CONFIG.MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content) as GeneratedContent;

    // Validate
    const validation = validateContent(parsed, cemetery);

    if (!validation.valid && attempt < CONFIG.MAX_RETRIES) {
      console.log(`   ⚠️  Validatie gefaald: ${validation.issues.join(', ')}`);
      console.log(`   🔄 Retry ${attempt + 1}/${CONFIG.MAX_RETRIES}...`);
      await sleep(1000);
      return enrichCemetery(openai, cemetery, attempt + 1);
    }

    if (!validation.valid) {
      console.log(`   ❌ Validatie gefaald na ${CONFIG.MAX_RETRIES} pogingen`);
      return null;
    }

    return parsed;

  } catch (error: any) {
    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(`   ⚠️  Error: ${error.message}, retry ${attempt + 1}...`);
      await sleep(2000);
      return enrichCemetery(openai, cemetery, attempt + 1);
    }
    console.error(`   ❌ Failed after ${CONFIG.MAX_RETRIES} attempts:`, error.message);
    return null;
  }
}

// =============================================================================
// PROGRESS MANAGEMENT
// =============================================================================

function loadProgress(): Progress {
  try {
    if (fs.existsSync(CONFIG.PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG.PROGRESS_FILE, 'utf-8'));
    }
  } catch (e) {}

  return {
    total: 0,
    completed: 0,
    failed: 0,
    skipped: 0,
    completedSlugs: [],
    failedSlugs: [],
    lastRun: new Date().toISOString(),
    avgWordCount: 0,
  };
}

function saveProgress(progress: Progress): void {
  progress.lastRun = new Date().toISOString();
  fs.writeFileSync(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function loadCemeteries(): Cemetery[] {
  return JSON.parse(fs.readFileSync(CONFIG.DATA_FILE, 'utf-8'));
}

function saveCemeteries(cemeteries: Cemetery[]): void {
  fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(cemeteries, null, 2));
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reset = args.includes('--reset');
  const batchArg = args.find(a => a.startsWith('--batch'));
  const batchSize = batchArg ? parseInt(args[args.indexOf(batchArg) + 1]) : Infinity;

  console.log('');
  console.log('🚀 HIGH-QUALITY Content Enrichment');
  console.log('===================================');
  console.log(`Model: ${CONFIG.MODEL}`);
  console.log(`Minimum woorden: ${CONFIG.MIN_WORDS}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Check API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY niet gevonden in environment');
    console.log('   Zet: export OPENAI_API_KEY=sk-...');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  // Load data
  console.log('📂 Loading data...');
  const cemeteries = loadCemeteries();
  let progress = reset ? loadProgress() : loadProgress();

  if (reset) {
    progress = {
      total: 0, completed: 0, failed: 0, skipped: 0,
      completedSlugs: [], failedSlugs: [],
      lastRun: new Date().toISOString(), avgWordCount: 0,
    };
  }

  console.log(`   Totaal begraafplaatsen: ${cemeteries.length}`);
  console.log(`   Al verwerkt: ${progress.completedSlugs.length}`);

  // Filter entries die verwerkt moeten worden
  const toProcess = cemeteries.filter(c => {
    // Skip als al verwerkt
    if (progress.completedSlugs.includes(c.slug)) return false;

    // Check of huidige generated content goed genoeg is
    const gen = c.generated;
    if (gen && typeof gen === 'object') {
      const samenv = gen.samenvatting || '';
      const words = countWords(samenv);
      if (words >= CONFIG.MIN_WORDS) {
        return false; // Al goede content
      }
    }

    return true;
  });

  console.log(`   Te verwerken: ${toProcess.length}`);
  console.log('');

  if (toProcess.length === 0) {
    console.log('✅ Alle entries hebben al goede content!');
    return;
  }

  // Dry run
  if (dryRun) {
    console.log('🧪 DRY RUN - Eerste 5 entries:');
    for (const c of toProcess.slice(0, 5)) {
      const gen = c.generated?.samenvatting || '';
      const words = countWords(gen);
      console.log(`   - ${c.naam_begraafplaats} (${c.type})`);
      console.log(`     Huidige woorden: ${words}`);
    }
    console.log('');
    console.log(`Totaal te verwerken: ${Math.min(toProcess.length, batchSize)}`);
    return;
  }

  // Create backup
  if (!fs.existsSync(CONFIG.BACKUP_FILE)) {
    console.log('📦 Creating backup...');
    fs.copyFileSync(CONFIG.DATA_FILE, CONFIG.BACKUP_FILE);
  }

  // Process
  const processCount = Math.min(toProcess.length, batchSize);
  console.log(`🚀 Processing ${processCount} entries...`);
  console.log('');

  let totalWords = 0;
  let successCount = 0;

  for (let i = 0; i < processCount; i++) {
    const cemetery = toProcess[i];
    const pct = Math.round((i / processCount) * 100);

    process.stdout.write(`[${pct}%] ${i + 1}/${processCount}: ${cemetery.naam_begraafplaats.substring(0, 40)}...`);

    const content = await enrichCemetery(openai, cemetery);

    if (content) {
      // Update cemetery
      const idx = cemeteries.findIndex(c => c.slug === cemetery.slug);
      if (idx !== -1) {
        cemeteries[idx].generated = content;

        // Update SEO fields
        const words = countWords(content.samenvatting);
        totalWords += words;
        successCount++;

        console.log(` ✅ ${words} woorden`);

        progress.completedSlugs.push(cemetery.slug);
        progress.completed++;
      }
    } else {
      console.log(' ❌ Gefaald');
      progress.failedSlugs.push(cemetery.slug);
      progress.failed++;
    }

    // Save periodically
    if ((i + 1) % CONFIG.SAVE_INTERVAL === 0) {
      console.log(`   💾 Saving progress...`);
      saveCemeteries(cemeteries);
      saveProgress(progress);
    }

    // Rate limiting
    await sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
  }

  // Final save
  saveCemeteries(cemeteries);
  progress.avgWordCount = successCount > 0 ? Math.round(totalWords / successCount) : 0;
  saveProgress(progress);

  // Summary
  console.log('');
  console.log('===================================');
  console.log('📊 RESULTATEN');
  console.log('===================================');
  console.log(`✅ Succesvol: ${successCount}`);
  console.log(`❌ Gefaald: ${progress.failed}`);
  console.log(`📝 Gemiddeld woorden: ${progress.avgWordCount}`);
  console.log(`📁 Data opgeslagen in: ${CONFIG.DATA_FILE}`);
  console.log('');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Gestopt door gebruiker. Progress is opgeslagen.');
  process.exit(0);
});

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
