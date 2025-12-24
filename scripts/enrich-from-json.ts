#!/usr/bin/env npx tsx
/**
 * Content Enrichment Script
 *
 * Dit script verrijkt begraafplaatsen met GPT-4o-mini gegenereerde content.
 * Het werkt direct met begraafplaatsen.json en slaat de verrijkte content
 * terug op in dezelfde file.
 */

import fs from 'fs/promises';
import path from 'path';
import { OpenAI } from 'openai';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import pLimit from 'p-limit';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.openai') });

// Configuration
const CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.7,
  CONCURRENCY: 5, // API rate limit friendly
  DATA_FILE: path.join(__dirname, '..', 'data', 'begraafplaatsen.json'),
  PUBLIC_FILE: path.join(__dirname, '..', 'public', 'data', 'cemeteries.json'),
  PROGRESS_FILE: path.join(__dirname, '..', 'data', 'enrichment-progress.json'),
  BATCH_SIZE: 50, // Save every 50 items
};

interface Begraafplaats {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  slug: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  jaar_oprichting?: string;
  beheerder?: string;
  faciliteiten?: string;
  bijzondere_kenmerken?: string;
  openingstijden?: string;
  telefoon?: string;
  // Enriched fields
  enrichedContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  enriched_at?: string;
  generated?: {
    samenvatting?: string;
    geschiedenis?: string;
    kenmerken?: string[];
    voorzieningen?: string[];
    bezoekerstips?: string[];
    toegankelijkheid?: string;
  };
  [key: string]: any;
}

interface Progress {
  total: number;
  completed: number;
  failed: number;
  completedSlugs: string[];
  lastUpdated: string;
}

let progress: Progress = {
  total: 0,
  completed: 0,
  failed: 0,
  completedSlugs: [],
  lastUpdated: new Date().toISOString(),
};

// Create enrichment prompt
function createPrompt(bp: Begraafplaats): string {
  const contextInfo = [];

  if (bp.adres) contextInfo.push(`Adres: ${bp.adres}`);
  if (bp.postcode) contextInfo.push(`Postcode: ${bp.postcode}`);
  if (bp.jaar_oprichting) contextInfo.push(`Opgericht in: ${bp.jaar_oprichting}`);
  if (bp.beheerder) contextInfo.push(`Beheerder: ${bp.beheerder}`);
  if (bp.faciliteiten) contextInfo.push(`Faciliteiten: ${bp.faciliteiten}`);
  if (bp.bijzondere_kenmerken) contextInfo.push(`Bijzonderheden: ${bp.bijzondere_kenmerken}`);
  if (bp.openingstijden) contextInfo.push(`Openingstijden: ${bp.openingstijden}`);

  return `Je bent een expert contentschrijver voor Nederlandse begraafplaatsen. Schrijf een informatieve, respectvolle en SEO-geoptimaliseerde beschrijving.

BEGRAAFPLAATS:
- Naam: ${bp.naam_begraafplaats}
- Gemeente: ${bp.gemeente}
- Provincie: ${bp.provincie}
- Type: ${bp.type}
${contextInfo.length > 0 ? '\nBESCHIKBARE INFO:\n' + contextInfo.join('\n') : ''}

INSTRUCTIES:
1. Schrijf een tekst van 350-450 woorden
2. Begin met een pakkende openingszin
3. Gebruik natuurlijk de zoekwoorden: "${bp.naam_begraafplaats}", "${bp.gemeente}", "begraafplaats"
4. Schrijf in een warme, respectvolle maar informatieve toon
5. Als er historische info is (jaar_oprichting), weef dit in
6. Maak het lokaal relevant voor ${bp.gemeente} en ${bp.provincie}
7. Eindig met praktische info of een uitnodiging

ANTWOORD IN JSON:
{
  "seoTitle": "SEO titel max 60 karakters met locatie",
  "seoDescription": "Meta description 140-155 karakters",
  "content": "De hoofdtekst van 350-450 woorden",
  "samenvatting": "Korte samenvatting van 2-3 zinnen",
  "kenmerken": ["Kenmerk 1", "Kenmerk 2", "Kenmerk 3"],
  "voorzieningen": ["Voorziening 1", "Voorziening 2"],
  "bezoekerstips": ["Tip 1", "Tip 2"]
}`;
}

// Initialize OpenAI
function initOpenAI(): OpenAI {
  if (!CONFIG.OPENAI_API_KEY) {
    console.error(chalk.red('❌ OPENAI_API_KEY niet gevonden in .env.openai'));
    console.log(chalk.yellow('Maak .env.openai met: OPENAI_API_KEY=sk-...'));
    process.exit(1);
  }
  return new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
}

// Enrich single begraafplaats
async function enrichOne(openai: OpenAI, bp: Begraafplaats): Promise<Begraafplaats | null> {
  try {
    const response = await openai.chat.completions.create({
      model: CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: 'Je bent een expert contentschrijver. Antwoord ALLEEN in valid JSON format.'
        },
        {
          role: 'user',
          content: createPrompt(bp)
        }
      ],
      temperature: CONFIG.TEMPERATURE,
      max_tokens: CONFIG.MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content || '{}';
    const enriched = JSON.parse(content);

    // Merge enriched data into begraafplaats
    return {
      ...bp,
      enrichedContent: enriched.content,
      seoTitle: enriched.seoTitle,
      seoDescription: enriched.seoDescription,
      enriched_at: new Date().toISOString(),
      generated: {
        samenvatting: enriched.samenvatting,
        kenmerken: enriched.kenmerken || [],
        voorzieningen: enriched.voorzieningen || [],
        bezoekerstips: enriched.bezoekerstips || [],
      }
    };
  } catch (error: any) {
    console.error(chalk.red(`\n❌ Fout bij ${bp.naam_begraafplaats}:`), error.message);
    return null;
  }
}

// Load/save progress
async function loadProgress(): Promise<void> {
  try {
    const data = await fs.readFile(CONFIG.PROGRESS_FILE, 'utf-8');
    progress = JSON.parse(data);
    console.log(chalk.blue(`📂 Hervat vanaf ${progress.completed}/${progress.total}`));
  } catch {
    console.log(chalk.yellow('📝 Nieuwe enrichment sessie'));
  }
}

async function saveProgress(): Promise<void> {
  progress.lastUpdated = new Date().toISOString();
  await fs.writeFile(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Main function
async function main() {
  console.log(chalk.bold.blue('\n🤖 Begraafplaats Content Enrichment\n'));

  // Check for --limit argument
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

  // Check for --test flag
  const testMode = process.argv.includes('--test');

  const openai = initOpenAI();
  await loadProgress();

  // Load data
  console.log(chalk.cyan('📖 Laden van begraafplaatsen...'));
  const data: Begraafplaats[] = JSON.parse(await fs.readFile(CONFIG.DATA_FILE, 'utf-8'));

  // Filter already enriched
  const toProcess = data.filter(bp =>
    !bp.enrichedContent &&
    !progress.completedSlugs.includes(bp.slug)
  );

  progress.total = data.length;

  console.log(chalk.white(`📊 Totaal: ${data.length}`));
  console.log(chalk.green(`✅ Al verrijkt: ${data.filter(bp => bp.enrichedContent).length}`));
  console.log(chalk.yellow(`⏳ Te verwerken: ${toProcess.length}`));

  if (toProcess.length === 0) {
    console.log(chalk.green('\n✅ Alle begraafplaatsen zijn al verrijkt!'));
    return;
  }

  // Apply limit
  let processItems = toProcess;
  if (testMode) {
    processItems = toProcess.slice(0, 3);
    console.log(chalk.magenta(`\n🧪 TEST MODE: Verwerkt slechts ${processItems.length} items\n`));
  } else if (limit) {
    processItems = toProcess.slice(0, limit);
    console.log(chalk.magenta(`\n📌 Limiet: Verwerkt ${processItems.length} items\n`));
  }

  // Progress bar
  const progressBar = new cliProgress.SingleBar({
    format: 'Verrijken |{bar}| {percentage}% | {value}/{total} | {name}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });

  progressBar.start(processItems.length, 0, { name: 'Starting...' });

  // Process with concurrency
  const rateLimiter = pLimit(CONFIG.CONCURRENCY);
  let processed = 0;
  let batchCount = 0;

  // Create a map for quick lookup
  const dataMap = new Map(data.map(bp => [bp.slug, bp]));

  const tasks = processItems.map(bp =>
    rateLimiter(async () => {
      const enriched = await enrichOne(openai, bp);

      if (enriched) {
        // Update in map
        dataMap.set(bp.slug, enriched);
        progress.completed++;
        progress.completedSlugs.push(bp.slug);
      } else {
        progress.failed++;
      }

      processed++;
      progressBar.update(processed, { name: bp.naam_begraafplaats.substring(0, 30) });

      // Save batch
      batchCount++;
      if (batchCount >= CONFIG.BATCH_SIZE) {
        batchCount = 0;
        const updatedData = Array.from(dataMap.values());
        await fs.writeFile(CONFIG.DATA_FILE, JSON.stringify(updatedData, null, 2));
        await saveProgress();
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    })
  );

  await Promise.all(tasks);

  progressBar.stop();

  // Final save
  console.log(chalk.cyan('\n💾 Opslaan van data...'));
  const finalData = Array.from(dataMap.values());
  await fs.writeFile(CONFIG.DATA_FILE, JSON.stringify(finalData, null, 2));
  await fs.writeFile(CONFIG.PUBLIC_FILE, JSON.stringify(finalData, null, 2));
  await saveProgress();

  // Summary
  console.log(chalk.bold.green('\n✅ Enrichment voltooid!\n'));
  console.log(chalk.white(`   Verwerkt: ${processed}`));
  console.log(chalk.green(`   Succesvol: ${progress.completed}`));
  console.log(chalk.red(`   Mislukt: ${progress.failed}`));

  // Show example
  const example = finalData.find(bp => bp.enrichedContent);
  if (example) {
    console.log(chalk.yellow('\n📝 Voorbeeld:'));
    console.log(chalk.gray(`   Naam: ${example.naam_begraafplaats}`));
    console.log(chalk.gray(`   SEO Title: ${example.seoTitle}`));
    console.log(chalk.gray(`   Content lengte: ${example.enrichedContent?.split(' ').length || 0} woorden`));
  }
}

main().catch(console.error);
