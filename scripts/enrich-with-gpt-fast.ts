import fs from 'fs/promises';
import path from 'path';
import { OpenAI } from 'openai';
import chalk from 'chalk';
import ora from 'ora';
import pLimit from 'p-limit';
import cliProgress from 'cli-progress';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.openai') });

// Configuration for FASTER processing
const CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MODEL: 'gpt-3.5-turbo', // Faster and cheaper model
  MAX_TOKENS: 500, // Smaller response for speed
  TEMPERATURE: 0.7,
  CONCURRENCY: 20, // Much higher concurrency
  INPUT_DIR: path.join(__dirname, '..', 'data', 'scraped-brightdata'),
  OUTPUT_DIR: path.join(__dirname, '..', 'data', 'enriched-content-fast'),
  PROGRESS_FILE: path.join(__dirname, '..', 'data', 'enriched-content-fast', 'progress.json'),
};

// Types
interface ScrapedData {
  slug: string;
  naam: string;
  gemeente: string;
  provincie: string;
  type: string;
  websiteData?: any;
  googleData?: any;
}

interface EnrichedContent {
  slug: string;
  naam: string;
  gemeente: string;
  provincie: string;
  type: string;
  seoTitle: string;
  seoDescription: string;
  shortContent: string; // Shorter content for speed
  highlights: string[];
  enrichedAt: string;
  wordCount: number;
}

// Progress tracking
let progress = {
  total: 0,
  completed: 0,
  failed: 0,
  completedSlugs: [] as string[],
  failedSlugs: [] as string[],
};

// Create a simpler, faster prompt
function createFastEnrichmentPrompt(data: ScrapedData): string {
  return `Schrijf een korte SEO-beschrijving voor ${data.naam} in ${data.gemeente}, ${data.provincie}.

Type: ${data.type} begraafplaats

Genereer in JSON formaat:
{
  "seoTitle": "SEO titel (max 60 karakters)",
  "seoDescription": "Meta description (max 155 karakters)",
  "shortContent": "Informatieve tekst van 150-200 woorden over deze begraafplaats",
  "highlights": [
    "Kenmerk 1",
    "Kenmerk 2",
    "Kenmerk 3"
  ]
}

Focus op lokale relevantie en praktische informatie.`;
}

// Initialize OpenAI client
function initOpenAI(): OpenAI {
  if (!CONFIG.OPENAI_API_KEY) {
    console.error(chalk.red('❌ OPENAI_API_KEY not found in .env.openai'));
    process.exit(1);
  }
  
  return new OpenAI({
    apiKey: CONFIG.OPENAI_API_KEY,
  });
}

// Enrich single begraafplaats (FAST version)
async function enrichBegraafplaatsFast(
  openai: OpenAI,
  scrapedData: ScrapedData
): Promise<EnrichedContent | null> {
  try {
    const prompt = createFastEnrichmentPrompt(scrapedData);
    
    const response = await openai.chat.completions.create({
      model: CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: 'Genereer korte, effectieve SEO content voor Nederlandse begraafplaatsen. Antwoord in JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: CONFIG.TEMPERATURE,
      max_tokens: CONFIG.MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const enrichedData = JSON.parse(response.choices[0].message.content || '{}');
    const wordCount = enrichedData.shortContent ? enrichedData.shortContent.split(/\s+/).length : 0;
    
    return {
      slug: scrapedData.slug,
      naam: scrapedData.naam,
      gemeente: scrapedData.gemeente,
      provincie: scrapedData.provincie,
      type: scrapedData.type,
      ...enrichedData,
      enrichedAt: new Date().toISOString(),
      wordCount,
    };
    
  } catch (error: any) {
    console.error(chalk.red(`Failed to enrich ${scrapedData.slug}:`), error.message);
    return null;
  }
}

// Load progress
async function loadProgress(): Promise<void> {
  try {
    const data = await fs.readFile(CONFIG.PROGRESS_FILE, 'utf-8');
    progress = JSON.parse(data);
  } catch {
    // Fresh start
  }
}

// Save progress
async function saveProgress(): Promise<void> {
  await fs.writeFile(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Main enrichment function
async function main() {
  console.log(chalk.bold.blue('\n🚀 FAST GPT-3.5-turbo Enrichment Pipeline\n'));
  
  // Initialize OpenAI
  const openai = initOpenAI();
  
  // Ensure output directory
  await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
  
  // Load progress
  await loadProgress();
  
  // Get all scraped files
  const files = await fs.readdir(CONFIG.INPUT_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'progress.json' && f !== 'summary.json');
  
  console.log(chalk.cyan(`Found ${jsonFiles.length} scraped begraafplaatsen to enrich`));
  
  // Filter already processed
  const toProcess = jsonFiles.filter(f => {
    const slug = f.replace('.json', '');
    return !progress.completedSlugs.includes(slug);
  });
  
  if (toProcess.length === 0) {
    console.log(chalk.green('✅ All begraafplaatsen already enriched!'));
    return;
  }
  
  console.log(chalk.yellow(`Processing ${toProcess.length} begraafplaatsen...\n`));
  
  // Progress bar
  const progressBar = new cliProgress.SingleBar({
    format: 'Fast Enriching |{bar}| {percentage}% | {value}/{total} | {filename}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });
  
  progressBar.start(toProcess.length, 0, { filename: 'Starting...' });
  
  // Process with higher concurrency limit
  const limit = pLimit(CONFIG.CONCURRENCY);
  let processed = 0;
  
  const tasks = toProcess.map(filename => 
    limit(async () => {
      try {
        // Load scraped data
        const scrapedPath = path.join(CONFIG.INPUT_DIR, filename);
        const scrapedData = JSON.parse(await fs.readFile(scrapedPath, 'utf-8'));
        
        // Enrich with GPT
        const enriched = await enrichBegraafplaatsFast(openai, scrapedData);
        
        if (enriched) {
          // Save enriched content
          const outputPath = path.join(CONFIG.OUTPUT_DIR, filename);
          await fs.writeFile(outputPath, JSON.stringify(enriched, null, 2));
          
          progress.completed++;
          progress.completedSlugs.push(scrapedData.slug);
        } else {
          progress.failed++;
          progress.failedSlugs.push(filename.replace('.json', ''));
        }
        
        processed++;
        progressBar.update(processed, { filename: scrapedData.naam || filename });
        
        // Save progress periodically
        if (processed % 50 === 0) {
          await saveProgress();
        }
        
      } catch (error: any) {
        console.error(chalk.red(`\nError processing ${filename}:`), error.message);
        progress.failed++;
      }
    })
  );
  
  await Promise.all(tasks);
  
  progressBar.stop();
  
  // Final save
  progress.total = jsonFiles.length;
  await saveProgress();
  
  // Summary
  console.log(chalk.bold.green('\n✅ Fast Enrichment Complete!\n'));
  console.log(chalk.white(`Total processed: ${progress.completed}`));
  console.log(chalk.red(`Failed: ${progress.failed}`));
  console.log(chalk.cyan(`Output directory: ${CONFIG.OUTPUT_DIR}`));
  
  // Performance stats
  const timePerItem = toProcess.length > 0 ? (processed / toProcess.length) : 0;
  console.log(chalk.yellow(`\n⚡ Performance: ~${timePerItem.toFixed(2)} seconds per item`));
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { enrichBegraafplaatsFast, createFastEnrichmentPrompt };