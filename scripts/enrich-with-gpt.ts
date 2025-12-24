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

// Configuration
const CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MODEL: 'gpt-4o-mini', // Cost-effective model
  MAX_TOKENS: 1200, // Increased to ensure 350-400 words
  TEMPERATURE: 0.7,
  CONCURRENCY: 10, // Process 10 at a time (increased for better throughput)
  INPUT_DIR: path.join(__dirname, '..', 'data', 'scraped-brightdata'),
  OUTPUT_DIR: path.join(__dirname, '..', 'data', 'enriched-content'),
  PROGRESS_FILE: path.join(__dirname, '..', 'data', 'enriched-content', 'progress.json'),
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
  content: string;
  highlights: string[];
  praktischeInfo: {
    openingstijden?: string;
    adres?: string;
    contact?: string;
    parkeren?: string;
    toegankelijkheid?: string;
  };
  historischeInfo?: string;
  bijzonderheden?: string[];
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

// Create the perfect SEO prompt
function createEnrichmentPrompt(data: ScrapedData): string {
  const websiteContent = data.websiteData?.rawContent || '';
  const googleContent = data.googleData?.results || '';
  
  return `Je bent een SEO-specialist en contentschrijver voor Nederlandse begraafplaatsen. 

Schrijf een rijke, informatieve en SEO-geoptimaliseerde beschrijving voor deze begraafplaats:

BEGRAAFPLAATS INFORMATIE:
- Naam: ${data.naam}
- Gemeente: ${data.gemeente}
- Provincie: ${data.provincie}
- Type: ${data.type}

BESCHIKBARE INFORMATIE:
${websiteContent.substring(0, 2000)}
${googleContent.substring(0, 2000)}

INSTRUCTIES:
1. Schrijf een aantrekkelijke, informatieve tekst van MINIMAAL 350 en MAXIMAAL 400 woorden
2. Begin met een pakkende openingszin die de essentie van deze begraafplaats vangt
3. Gebruik natuurlijk de zoekwoorden: "${data.naam}", "${data.gemeente}", "begraafplaats", "${data.provincie}"
4. Schrijf in een warme, respectvolle maar toegankelijke toon
5. Vermeld praktische informatie waar beschikbaar
6. Voeg historische context toe indien bekend
7. Maak het lokaal relevant (noem nabijgelegen plaatsen/landmarks)
8. Eindig met een uitnodiging om de begraafplaats te bezoeken
9. BELANGRIJK: De tekst moet tussen 350-400 woorden zijn, vul aan met sfeerbeelden of extra details indien nodig

FORMAAT ANTWOORD (JSON):
{
  "seoTitle": "Korte, pakkende SEO titel (max 60 karakters)",
  "seoDescription": "Meta description voor Google (max 155 karakters)",
  "content": "De hoofdtekst (350-400 woorden)",
  "highlights": [
    "• Eerste highlight/kenmerk",
    "• Tweede highlight/kenmerk", 
    "• Derde highlight/kenmerk",
    "• Vierde highlight/kenmerk"
  ],
  "praktischeInfo": {
    "openingstijden": "Dagelijks van zonsopgang tot zonsondergang",
    "adres": "Volledig adres indien bekend",
    "contact": "Telefoonnummer of email indien bekend",
    "parkeren": "Parkeerinformatie",
    "toegankelijkheid": "Info over toegankelijkheid"
  },
  "historischeInfo": "Korte historische context (indien bekend)",
  "bijzonderheden": [
    "Bijzondere graven of monumenten",
    "Bekende personen (indien van toepassing)",
    "Architectonische kenmerken"
  ]
}

VOORBEELD HIGHLIGHTS (gebruik dit formaat):
• Historische begraafplaats uit [jaar] met monumentale graven
• Rustige, parkachtige omgeving met oude bomen
• Gratis parkeren direct bij de ingang
• Rolstoeltoegankelijk via verharde paden

Zorg dat de content uniek is en waarde toevoegt voor bezoekers die informatie zoeken over deze begraafplaats.`;
}

// Initialize OpenAI client
function initOpenAI(): OpenAI {
  if (!CONFIG.OPENAI_API_KEY) {
    console.error(chalk.red('❌ OPENAI_API_KEY not found in .env.openai'));
    console.log(chalk.yellow('Please create .env.openai with:'));
    console.log(chalk.gray('OPENAI_API_KEY=your-api-key-here'));
    process.exit(1);
  }
  
  return new OpenAI({
    apiKey: CONFIG.OPENAI_API_KEY,
  });
}

// Enrich single begraafplaats
async function enrichBegraafplaats(
  openai: OpenAI,
  scrapedData: ScrapedData
): Promise<EnrichedContent | null> {
  try {
    const prompt = createEnrichmentPrompt(scrapedData);
    
    const response = await openai.chat.completions.create({
      model: CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: 'Je bent een expert in het schrijven van SEO-geoptimaliseerde content voor Nederlandse begraafplaatsen. Antwoord altijd in perfect JSON formaat.'
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

    let enrichedData;
    try {
      const content = response.choices[0].message.content || '{}';
      // Clean up common JSON issues
      const cleanedContent = content
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\n/g, '\\n') // Escape newlines in strings
        .replace(/\r/g, '\\r') // Escape carriage returns
        .trim();
      
      enrichedData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error(chalk.yellow(`JSON parse error for ${scrapedData.slug}, retrying...`));
      // Retry with a simpler prompt
      const retryResponse = await openai.chat.completions.create({
        model: CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'Je bent een expert in het schrijven van SEO-geoptimaliseerde content voor Nederlandse begraafplaatsen. Antwoord altijd in perfect JSON formaat. Gebruik geen enkele newlines binnen string values.'
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
      
      enrichedData = JSON.parse(retryResponse.choices[0].message.content || '{}');
    }
    
    // Count words in content
    const wordCount = enrichedData.content ? enrichedData.content.split(/\s+/).length : 0;
    
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
  console.log(chalk.bold.blue('\n🤖 GPT-4o-mini Enrichment Pipeline\n'));
  
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
    format: 'Enriching |{bar}| {percentage}% | {value}/{total} | {filename}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });
  
  progressBar.start(toProcess.length, 0, { filename: 'Starting...' });
  
  // Process with concurrency limit
  const limit = pLimit(CONFIG.CONCURRENCY);
  let processed = 0;
  
  const tasks = toProcess.map(filename => 
    limit(async () => {
      try {
        // Load scraped data
        const scrapedPath = path.join(CONFIG.INPUT_DIR, filename);
        const scrapedData = JSON.parse(await fs.readFile(scrapedPath, 'utf-8'));
        
        // Enrich with GPT
        const enriched = await enrichBegraafplaats(openai, scrapedData);
        
        if (enriched) {
          // Save enriched content
          const outputPath = path.join(CONFIG.OUTPUT_DIR, filename);
          await fs.writeFile(outputPath, JSON.stringify(enriched, null, 2));
          
          progress.completed++;
          progress.completedSlugs.push(scrapedData.slug);
          
          // Quick quality check
          if (enriched.wordCount < 300) {
            console.log(chalk.yellow(`\n⚠️  Short content for ${scrapedData.naam}: ${enriched.wordCount} words`));
          }
        } else {
          progress.failed++;
          progress.failedSlugs.push(filename.replace('.json', ''));
        }
        
        processed++;
        progressBar.update(processed, { filename: scrapedData.naam || filename });
        
        // Save progress periodically
        if (processed % 10 === 0) {
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
  console.log(chalk.bold.green('\n✅ Enrichment Complete!\n'));
  console.log(chalk.white(`Total processed: ${progress.completed}`));
  console.log(chalk.red(`Failed: ${progress.failed}`));
  console.log(chalk.cyan(`Output directory: ${CONFIG.OUTPUT_DIR}`));
  
  // Show example
  if (progress.completed > 0) {
    console.log(chalk.yellow('\n📝 Example enriched content:'));
    const exampleFile = `${progress.completedSlugs[0]}.json`;
    const examplePath = path.join(CONFIG.OUTPUT_DIR, exampleFile);
    const example = JSON.parse(await fs.readFile(examplePath, 'utf-8'));
    
    console.log(chalk.gray('\nSEO Title:'), example.seoTitle);
    console.log(chalk.gray('SEO Description:'), example.seoDescription);
    console.log(chalk.gray('Word count:'), example.wordCount);
    console.log(chalk.gray('\nHighlights:'));
    example.highlights.forEach((h: string) => console.log(chalk.gray(h)));
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { enrichBegraafplaats, createEnrichmentPrompt };