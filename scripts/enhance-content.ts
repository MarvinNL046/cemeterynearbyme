#!/usr/bin/env npx tsx
/**
 * Enhance cemetery content with varied writing styles
 * - Mixes different writing approaches randomly
 * - Injects real data (reviews, OSM, location specifics)
 * - Processes ~50 cemeteries per province
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.openai' });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const PUBLIC_FILE = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');
const PROGRESS_FILE = path.join(process.cwd(), 'data', 'enhance-progress.json');

const PER_PROVINCE = 50;
const BATCH_SIZE = 5;

interface Cemetery {
  naam_begraafplaats: string;
  slug: string;
  gemeente: string;
  provincie: string;
  type: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gps_coordinaten?: string;
  google_reviews?: Array<{ text: string; rating: number; author: string }>;
  rating?: string;
  reviews?: string;
  osm_id?: string;
  faciliteiten?: string;
  oppervlakte?: string;
  generated?: {
    samenvatting: string;
    enhanced?: boolean;
    style?: string;
  };
  [key: string]: unknown;
}

interface Progress {
  completed: string[];
  lastProvince?: string;
}

// Writing style templates - will be mixed randomly
const STYLE_PROMPTS = [
  {
    name: 'journalistiek',
    prompt: `Schrijf als een journalist die een reportage maakt. Begin met een pakkende opening, gebruik concrete details en citeer eventuele reviews. Wissel korte en lange zinnen af.`
  },
  {
    name: 'poëtisch',
    prompt: `Schrijf poëtisch en beeldend. Gebruik metaforen over seizoenen, natuur en de cyclus van het leven. Focus op sfeer en emotie, minder op feiten.`
  },
  {
    name: 'historisch',
    prompt: `Schrijf als een historicus. Focus op de tijdlijn, de ontwikkeling door de jaren heen, en de rol in de lokale geschiedenis. Gebruik formele taal.`
  },
  {
    name: 'persoonlijk',
    prompt: `Schrijf vanuit het perspectief van een bezoeker. Beschrijf wat je ziet, hoort en voelt bij het betreden van de begraafplaats. Gebruik "je" en "men".`
  },
  {
    name: 'praktisch',
    prompt: `Schrijf praktisch en informatief. Focus op faciliteiten, bereikbaarheid, en wat bezoekers moeten weten. Gebruik opsommingen en duidelijke structuur.`
  },
  {
    name: 'verhalend',
    prompt: `Vertel een verhaal. Begin misschien met een anekdote of een beschrijving van een specifiek graf of monument. Weef feiten door het verhaal.`
  }
];

function loadProgress(): Progress {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  return { completed: [] };
}

function saveProgress(progress: Progress): void {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function getRandomStyle(): typeof STYLE_PROMPTS[0] {
  return STYLE_PROMPTS[Math.floor(Math.random() * STYLE_PROMPTS.length)];
}

function buildPrompt(cemetery: Cemetery, style: typeof STYLE_PROMPTS[0]): string {
  let context = `
Begraafplaats: ${cemetery.naam_begraafplaats}
Plaats: ${cemetery.plaats || cemetery.gemeente}
Gemeente: ${cemetery.gemeente}
Provincie: ${cemetery.provincie}
Type: ${cemetery.type}
`;

  if (cemetery.adres) context += `Adres: ${cemetery.adres}\n`;
  if (cemetery.oppervlakte) context += `Oppervlakte: ${cemetery.oppervlakte} m²\n`;
  if (cemetery.faciliteiten) context += `Faciliteiten: ${cemetery.faciliteiten}\n`;
  if (cemetery.rating && cemetery.reviews) {
    context += `Google Rating: ${cemetery.rating} sterren (${cemetery.reviews} reviews)\n`;
  }

  // Add real reviews if available
  if (cemetery.google_reviews && cemetery.google_reviews.length > 0) {
    context += `\nEchte Google Reviews:\n`;
    cemetery.google_reviews.slice(0, 3).forEach((review, i) => {
      context += `- "${review.text.substring(0, 200)}${review.text.length > 200 ? '...' : ''}" - ${review.author}\n`;
    });
  }

  return `Je bent een Nederlandse content schrijver voor een begraafplaatsen website.

${style.prompt}

BELANGRIJK:
- Schrijf ALLEEN in het Nederlands
- Minimaal 400 woorden, maximaal 600 woorden
- GEEN standaard openingszinnen zoals "Tussen de..." of "Omringd door..."
- GEEN clichés over "serene sfeer" of "laatste rustplaats"
- Varieer je woordkeuze en zinsstructuur
- Als er echte reviews zijn, verwerk deze subtiel in de tekst
- Wees specifiek over de locatie (${cemetery.plaats}, ${cemetery.provincie})
- Noem concrete details als je die hebt

CONTEXT:
${context}

Schrijf nu een unieke, gevarieerde tekst over deze begraafplaats. Alleen de tekst, geen titel of headers.`;
}

async function enhanceCemetery(
  client: OpenAI,
  cemetery: Cemetery,
  style: typeof STYLE_PROMPTS[0]
): Promise<string> {
  const prompt = buildPrompt(cemetery, style);

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = response.choices[0]?.message?.content;
  if (content) {
    return content;
  }
  throw new Error('Unexpected response type');
}

async function processProvince(
  client: OpenAI | null,
  data: Cemetery[],
  progress: Progress,
  province: string,
  limit: number,
  dryRun: boolean
): Promise<{ processed: number; errors: number }> {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📍 ${province}`);
  console.log('='.repeat(50));

  // Select cemeteries to enhance (prioritize those with most data)
  const provinceCemeteries = data
    .filter(c => c.provincie === province)
    .filter(c => !c.generated?.enhanced)
    .filter(c => !progress.completed.includes(c.slug))
    .sort((a, b) => {
      const scoreA = (a.google_reviews?.length || 0) * 3 +
                     (a.rating ? 2 : 0) +
                     (a.oppervlakte ? 1 : 0) +
                     (a.faciliteiten ? 1 : 0);
      const scoreB = (b.google_reviews?.length || 0) * 3 +
                     (b.rating ? 2 : 0) +
                     (b.oppervlakte ? 1 : 0) +
                     (b.faciliteiten ? 1 : 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);

  console.log(`📋 Te verwerken: ${provinceCemeteries.length} begraafplaatsen\n`);

  if (provinceCemeteries.length === 0) {
    console.log('✅ Deze provincie is al klaar!\n');
    return { processed: 0, errors: 0 };
  }

  if (dryRun) {
    console.log('🔍 Dry run - geen wijzigingen');
    provinceCemeteries.forEach((c, i) => {
      const style = getRandomStyle();
      console.log(`${i + 1}. ${c.naam_begraafplaats} (${c.gemeente}) - stijl: ${style.name}`);
    });
    return { processed: 0, errors: 0 };
  }

  let processed = 0;
  let errors = 0;

  for (let i = 0; i < provinceCemeteries.length; i += BATCH_SIZE) {
    const batch = provinceCemeteries.slice(i, i + BATCH_SIZE);

    for (const cemetery of batch) {
      const style = getRandomStyle();

      try {
        console.log(`[${processed + 1}/${provinceCemeteries.length}] ${cemetery.naam_begraafplaats} (${style.name})...`);

        const newContent = await enhanceCemetery(client!, cemetery, style);

        const index = data.findIndex(c => c.slug === cemetery.slug);
        if (index !== -1) {
          if (!data[index].generated) {
            data[index].generated = { samenvatting: '' };
          }
          data[index].generated!.samenvatting = newContent;
          data[index].generated!.enhanced = true;
          data[index].generated!.style = style.name;
        }

        progress.completed.push(cemetery.slug);
        processed++;
        saveProgress(progress);
        await new Promise(r => setTimeout(r, 500));

      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
        errors++;
      }
    }

    // Save after each batch
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    fs.writeFileSync(PUBLIC_FILE, JSON.stringify(data, null, 2));
    console.log(`  💾 Saved (${processed}/${provinceCemeteries.length})\n`);
  }

  return { processed, errors };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || String(PER_PROVINCE));

  console.log('🔄 Content Enhancement Script');
  console.log('=============================\n');

  if (!dryRun && !process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not set');
    process.exit(1);
  }

  const client = dryRun ? null : new OpenAI();
  const data: Cemetery[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const progress = loadProgress();

  // Get all provinces
  const provinces = [...new Set(data.map(c => c.provincie))].sort();

  console.log(`📊 Limiet per provincie: ${limit}`);
  console.log(`🗺️  Provincies: ${provinces.length}`);

  let totalProcessed = 0;
  let totalErrors = 0;

  for (const province of provinces) {
    const result = await processProvince(client, data, progress, province, limit, dryRun);
    totalProcessed += result.processed;
    totalErrors += result.errors;
  }

  // Final save
  if (!dryRun) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    fs.writeFileSync(PUBLIC_FILE, JSON.stringify(data, null, 2));
  }

  console.log('\n\n🎉 KLAAR!');
  console.log('=========');
  console.log(`✅ Totaal verwerkt: ${totalProcessed}`);
  console.log(`❌ Totaal errors: ${totalErrors}`);
  console.log(`📁 Opgeslagen in: ${OUTPUT_FILE}`);
}

main().catch(console.error);
