import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  faciliteiten: string;
  gps_coordinaten: string;
  foto_url: string;
  openingstijden: string;
  historie: string;
  bijzondere_graven: string;
  links: string;
  slug?: string;
}

interface GeneratedContent {
  samenvatting: string;
  geschiedenis: string;
  kenmerken: string[];
  toegankelijkheid: string;
  voorzieningen: string[];
  bezoekerstips: string[];
}

function createSlug(name: string, gemeente: string): string {
  const combined = `${name}-${gemeente}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return combined;
}

async function generateContent(cemetery: Cemetery): Promise<GeneratedContent> {
  const prompt = `
    Genereer content voor de volgende begraafplaats in Nederland:
    
    Naam: ${cemetery.naam_begraafplaats}
    Gemeente: ${cemetery.gemeente}
    Provincie: ${cemetery.provincie}
    Type: ${cemetery.type}
    Faciliteiten: ${cemetery.faciliteiten}
    Historie: ${cemetery.historie}
    Bijzondere graven: ${cemetery.bijzondere_graven}
    
    Genereer de volgende content in het Nederlands:
    1. Een korte samenvatting (2-3 zinnen)
    2. Een beschrijving van de geschiedenis (3-4 zinnen)
    3. Drie unieke kenmerken
    4. Informatie over toegankelijkheid
    5. Drie voorzieningen (aanvullend op de gegeven faciliteiten)
    6. Drie bezoekerstips
    
    Antwoord in JSON formaat.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content generated');
    
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error generating content for ${cemetery.naam_begraafplaats}:`, error);
    
    // Return fallback content
    return {
      samenvatting: `${cemetery.naam_begraafplaats} is een ${cemetery.type} begraafplaats in ${cemetery.gemeente}, ${cemetery.provincie}.`,
      geschiedenis: `Deze begraafplaats heeft een rijke historie. ${cemetery.historie || 'De exacte geschiedenis is momenteel niet beschikbaar.'}`,
      kenmerken: [
        `Type: ${cemetery.type}`,
        `Locatie: ${cemetery.gemeente}`,
        'Historische waarde'
      ],
      toegankelijkheid: 'De begraafplaats is toegankelijk tijdens openingstijden.',
      voorzieningen: cemetery.faciliteiten ? cemetery.faciliteiten.split(',') : ['Algemene voorzieningen'],
      bezoekerstips: [
        'Respecteer de rust op de begraafplaats',
        'Houd rekening met de openingstijden',
        'Parkeren is mogelijk in de omgeving'
      ]
    };
  }
}

async function processCSV() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'data', 'cemeteries.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
    // Parse CSV
    const records: Cemetery[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} cemeteries to process`);

    // Create output directory
    const outputDir = path.join(process.cwd(), 'data', 'generated');
    await fs.mkdir(outputDir, { recursive: true });

    // Process each cemetery
    for (let i = 0; i < records.length; i++) {
      const cemetery = records[i];
      cemetery.slug = createSlug(cemetery.naam_begraafplaats, cemetery.gemeente);
      
      console.log(`Processing ${i + 1}/${records.length}: ${cemetery.naam_begraafplaats}`);
      
      const outputPath = path.join(outputDir, `${cemetery.slug}.json`);
      
      // Check if file already exists
      try {
        await fs.access(outputPath);
        console.log(`  - Already exists, skipping`);
        continue;
      } catch {
        // File doesn't exist, generate content
      }

      // Generate content
      const generatedContent = await generateContent(cemetery);
      
      // Combine data
      const fullData = {
        ...cemetery,
        generated: generatedContent,
        lastUpdated: new Date().toISOString(),
      };
      
      // Save to file
      await fs.writeFile(
        outputPath,
        JSON.stringify(fullData, null, 2),
        'utf-8'
      );
      
      console.log(`  - Generated and saved`);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Create index file
    const indexData = records.map(cemetery => ({
      slug: cemetery.slug,
      naam: cemetery.naam_begraafplaats,
      gemeente: cemetery.gemeente,
      provincie: cemetery.provincie,
      type: cemetery.type,
    }));

    await fs.writeFile(
      path.join(outputDir, 'index.json'),
      JSON.stringify(indexData, null, 2),
      'utf-8'
    );

    console.log('\nData generation complete!');
    console.log(`Generated ${records.length} cemetery files`);
    
  } catch (error) {
    console.error('Error processing CSV:', error);
    process.exit(1);
  }
}

// Run the script
processCSV();