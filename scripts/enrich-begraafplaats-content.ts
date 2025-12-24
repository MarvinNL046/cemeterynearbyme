import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Verify API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in .env.local');
  process.exit(1);
}

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const BATCH_SIZE = 5;
const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 seconds between AI calls
const MAX_RETRIES = 2;

// Helper delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate content using GPT-4o-mini specifically for begraafplaatsen
async function generateBegraafplaatsContent(data: any): Promise<string> {
  const name = data.begraafplaats_naam || data.naam_begraafplaats || 'Onbekende begraafplaats';
  const type = data.type || 'begraafplaats';
  const gemeente = data.gemeente || 'Nederland';
  const provincie = data.provincie || '';
  const websiteContent = data.website_content || 'Geen website informatie beschikbaar';
  
  const prompt = `
Je bent een content specialist voor Nederlandse begraafplaatsen. Genereer GESTRUCTUREERDE JSON content voor de volgende begraafplaats:

**Basis informatie:**
- Naam: ${name}
- Type: ${type}
- Gemeente: ${gemeente}
- Provincie: ${provincie}

**Website informatie:**
${websiteContent}

**Google Reviews:**
${data.google_reviews ? `
- Rating: ${data.google_rating}/5 (${data.google_review_count} reviews)
- Reviews: ${Array.isArray(data.google_reviews) ? JSON.stringify(data.google_reviews.slice(0, 3)) : JSON.stringify(data.google_reviews)}
` : 'Geen reviews beschikbaar'}

**Opdracht:**
Genereer ALLEEN geldige JSON in dit exacte format (geen extra tekst!):

{
  "samenvatting": "Korte beschrijving van 2-3 zinnen over wat deze begraafplaats bijzonder maakt",
  "geschiedenis": "Paragraaf van 3-4 zinnen over de geschiedenis en ontstaan van deze begraafplaats",
  "kenmerken": [
    "Karakteristiek kenmerk 1 (bijv. monumentale graven)",
    "Karakteristiek kenmerk 2 (bijv. oude bomen)",
    "Karakteristiek kenmerk 3 (bijv. architectuur)"
  ],
  "toegankelijkheid": "Paragraaf over bereikbaarheid, parkeren, openingstijden en toegankelijkheid voor mindervaliden",
  "voorzieningen": [
    "Voorziening 1 (bijv. parkeerplaats)",
    "Voorziening 2 (bijv. water tappunt)",
    "Voorziening 3 (bijv. bankjes)"
  ],
  "bezoekerstips": [
    "Praktische tip 1 voor bezoekers",
    "Praktische tip 2 over beste bezoektijden",
    "Praktische tip 3 over respectvol gedrag"
  ],
  "bijzondereGraven": "Informatie over opvallende graven, monumenten of bekende personen (indien van toepassing)",
  "natuurEnOmgeving": "Beschrijving van de natuurlijke omgeving, beplanting, seizoensgebonden aspecten"
}

Zorg ervoor dat:
- Content uniek is en specifiek voor deze begraafplaats
- Nederlandse taal, respectvolle en waardige toon
- Gebaseerd op beschikbare website en review informatie
- SEO-geoptimaliseerd voor "${type} ${gemeente}"
- Cultureel sensitief en respectvol
- ALLEEN JSON, geen extra tekst ervoor of erna`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Je bent een ervaren content writer voor Nederlandse begraafplaatsen. Genereer alleen geldige JSON zonder extra tekst. Wees respectvol en informatief.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const jsonContent = response.choices[0].message.content || '';
  
  try {
    // Parse and validate the JSON
    const parsedContent = JSON.parse(jsonContent);
    
    // Validate required fields
    const requiredFields = ['samenvatting', 'geschiedenis', 'kenmerken', 'toegankelijkheid', 'voorzieningen', 'bezoekerstips'];
    for (const field of requiredFields) {
      if (!parsedContent[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Return the structured JSON as a string for storage
    return JSON.stringify(parsedContent, null, 2);
  } catch (error) {
    console.error('   ⚠️ Failed to parse JSON, falling back to plain text');
    return jsonContent;
  }
}

async function enrichBegraafplaats(record: any, retryCount = 0): Promise<void> {
  try {
    console.log(`\n✍️ Enriching: ${record.begraafplaats_naam} (${record.gemeente})`);

    // Skip if already has content
    if (record.generated_content) {
      console.log('   ✅ Already has content');
      return;
    }

    // Skip if no scraped data
    if (!record.website_scraped_at && !record.google_scraped_at) {
      console.log('   ⏭️ No scraped data yet');
      return;
    }

    // Generate content
    console.log('   🤖 Generating content with GPT-4o-mini...');
    const content = await generateBegraafplaatsContent(record);

    // Save to database
    const { error } = await supabase
      .from('scraped_begraafplaats_data')
      .update({
        generated_content: content,
        generated_at: new Date().toISOString(),
        generated_by: 'gpt-4o-mini',
        scrape_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('begraafplaats_slug', record.begraafplaats_slug);

    if (error) throw error;

    const wordCount = content.split(/\s+/).length;
    console.log(`   ✅ Generated ${wordCount} words`);

  } catch (error) {
    console.error(`   ❌ Error: ${error}`);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`   🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await delay(DELAY_BETWEEN_REQUESTS * (retryCount + 1));
      return enrichBegraafplaats(record, retryCount + 1);
    }

    // Mark as failed
    await supabase
      .from('scraped_begraafplaats_data')
      .update({
        scrape_status: 'enrichment_failed',
        last_error: error instanceof Error ? error.message : 'Unknown error',
        updated_at: new Date().toISOString()
      })
      .eq('begraafplaats_slug', record.begraafplaats_slug);
  }
}

async function main() {
  console.log('🏛️ BEGRAAFPLAATS CONTENT ENRICHMENT TOOL');
  console.log('=========================================\n');

  try {
    // Check command line arguments
    const testMode = process.argv.includes('--test');
    const forceMode = process.argv.includes('--force'); // Re-generate existing content
    
    console.log('🔍 Loading begraafplaats data from database...\n');
    
    // Get data from scraped_begraafplaats_data table
    let query = supabase
      .from('scraped_begraafplaats_data')
      .select('*')
      .not('website_content', 'is', null) // Has scraped content
      .neq('website_content', '') // Not empty
      .order('created_at', { ascending: true });

    // Add filter for existing content unless force mode
    if (!forceMode) {
      query = query.is('generated_content', null); // No AI content yet
    }

    if (testMode) {
      query = query.limit(5);
      console.log('🧪 TEST MODE: Processing only 5 locations\n');
    }

    // Fetch in chunks to bypass Supabase default limit
    let allLocations = [];
    let from = 0;
    const chunkSize = 1000;
    
    while (true) {
      const { data, error } = await query.range(from, from + chunkSize - 1);
      if (error) throw error;
      
      if (!data || data.length === 0) break;
      
      allLocations.push(...data);
      
      if (data.length < chunkSize) break; // Last chunk
      
      from += chunkSize;
      console.log(`📥 Loaded ${allLocations.length} locations...`);
    }
    
    const locations = allLocations;

    if (!locations || locations.length === 0) {
      console.log('✅ No begraafplaatsen need enrichment!');
      console.log('💡 Try running the scraping script first: npm run scrape-websites');
      if (!forceMode) {
        console.log('💡 Or use --force flag to re-generate existing content');
      }
      return;
    }

    console.log(`📊 Found ${locations.length} begraafplaatsen to enrich\n`);

    // Show distribution stats
    const stats = {
      byType: {} as Record<string, number>,
      byProvince: {} as Record<string, number>
    };

    locations.forEach(loc => {
      stats.byType[loc.type || 'onbekend'] = (stats.byType[loc.type || 'onbekend'] || 0) + 1;
      stats.byProvince[loc.provincie || 'onbekend'] = (stats.byProvince[loc.provincie || 'onbekend'] || 0) + 1;
    });

    console.log('📋 Distribution by Type:');
    Object.entries(stats.byType)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });

    console.log('\n🏛️ Distribution by Province:');
    Object.entries(stats.byProvince)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([province, count]) => {
        console.log(`   ${province}: ${count}`);
      });

    // Show cost estimate (gpt-4o-mini: ~500 words = 400 tokens output)
    const estimatedCost = locations.length * 0.0006; // ~$0.60 per 1000 locations
    console.log(`\n💰 Estimated cost: $${estimatedCost.toFixed(2)}`);
    console.log(`⏱️ Estimated time: ${Math.ceil(locations.length * 2 / 60)} minutes\n`);

    // Process in batches
    let enrichedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < locations.length; i += BATCH_SIZE) {
      const batch = locations.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(locations.length / BATCH_SIZE);
      
      console.log(`\n📦 Batch ${batchNum}/${totalBatches}`);
      console.log('─'.repeat(50));

      // Process batch sequentially
      for (const location of batch) {
        try {
          await enrichBegraafplaats(location);
          enrichedCount++;
        } catch (error) {
          errorCount++;
          console.error(`   ❌ Failed to process ${location.begraafplaats_naam}: ${error}`);
        }
        
        // Progress update
        if (enrichedCount % 10 === 0) {
          const progress = ((enrichedCount + errorCount) / locations.length * 100).toFixed(1);
          console.log(`\n📊 Progress: ${enrichedCount + errorCount}/${locations.length} (${progress}%) - ✅ ${enrichedCount} | ❌ ${errorCount}\n`);
        }
        
        if (batch.indexOf(location) < batch.length - 1) {
          await delay(DELAY_BETWEEN_REQUESTS);
        }
      }

      // Delay between batches
      if (i + BATCH_SIZE < locations.length) {
        console.log(`\n⏳ Cooling down before next batch...`);
        await delay(DELAY_BETWEEN_REQUESTS * 3);
      }
    }

    // Final stats
    console.log('\n\n✅ ENRICHMENT COMPLETED!');
    console.log('========================\n');

    const { data: finalStats } = await supabase
      .from('scraped_begraafplaats_data')
      .select('scrape_status, generated_content');

    const completed = finalStats?.filter(s => s.generated_content).length || 0;
    const failed = finalStats?.filter(s => s.scrape_status === 'enrichment_failed').length || 0;
    const total = finalStats?.length || 0;

    console.log(`📊 Database Statistics:`);
    console.log(`   Total records: ${total}`);
    console.log(`   ✅ Successfully enriched: ${completed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📝 Completion rate: ${total > 0 ? ((completed / total) * 100).toFixed(1) : 0}%`);
    
    console.log(`\n🎯 This Session:`);
    console.log(`   ✅ Enriched: ${enrichedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    console.log(`\n💡 Next Steps:`);
    console.log('1. Review the enriched content in the database');
    console.log('2. Run: npm run export-enriched (to generate JSON files)');
    console.log('3. Run: npm run build-data (to update production data)');
    console.log('4. Test the updated content on the website\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run modes info
if (process.argv.includes('--help')) {
  console.log(`
🏛️ BEGRAAFPLAATS CONTENT ENRICHMENT TOOL
=========================================

Usage:
  npm run enrich-content        # Enrich all scraped begraafplaatsen
  npm run enrich-content --test # Test with 5 locations
  npm run enrich-content --force # Re-generate existing content

Options:
  --test   Process only 5 locations
  --force  Re-generate existing content
  --help   Show this help message

This tool:
- Reads scraped website and Google data from database
- Generates ~500 word unique content using GPT-4o-mini
- Saves the content back to database
- Creates respectful, informative content for begraafplaatsen

Prerequisites:
- Run 'npm run scrape-websites' first to collect data
- Ensure OPENAI_API_KEY is set in .env.local
- Ensure Supabase connection is configured

Cost estimate: ~$0.65 per 1000 locations
`);
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main();
}