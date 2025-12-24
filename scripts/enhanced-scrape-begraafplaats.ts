import axios from 'axios';
import chalk from 'chalk';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

config({ path: path.join(__dirname, '..', '.env.brightdata') });

const API_TOKEN = '90e72bf183dcec69948a69a369dec41d115341fe15991eb195b456364aef4ff0';
const ZONE = 'mcp_unlocker';

// Enhanced search queries voor begraafplaatsen zonder website
async function performEnhancedSearches(begraafplaats: any) {
  const searchQueries = [
    // Basis informatie
    `${begraafplaats.naam} ${begraafplaats.gemeente} begraafplaats openingstijden contact`,
    
    // Historische informatie
    `${begraafplaats.naam} ${begraafplaats.gemeente} geschiedenis historie opgericht`,
    `${begraafplaats.naam} historische graven monumenten`,
    
    // Beroemde personen
    `${begraafplaats.naam} beroemde personen begraven bekende nederlanders`,
    `${begraafplaats.naam} oorlogsgraven veteranen`,
    
    // Praktische informatie
    `${begraafplaats.naam} tarieven kosten graf`,
    `${begraafplaats.naam} route bereikbaarheid parkeren`,
    
    // Nieuws en gebeurtenissen
    `${begraafplaats.naam} nieuws renovatie uitbreiding`,
    
    // Genealogie
    `${begraafplaats.naam} genealogie familiegeschiedenis stamboom`
  ];

  const results: any = {};

  for (const query of searchQueries) {
    try {
      console.log(chalk.yellow(`🔍 Searching: "${query}"`));
      
      const searchUrl = `https://www.google.nl/search?q=${encodeURIComponent(query)}&hl=nl&gl=nl`;
      const response = await axios.post(
        'https://api.brightdata.com/request',
        {
          url: searchUrl,
          zone: ZONE,
          format: 'raw',
          data_format: 'markdown',
          country: 'nl',
        },
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const queryType = query.includes('geschiedenis') ? 'historical' :
                       query.includes('beroemde') ? 'famous_persons' :
                       query.includes('tarieven') ? 'rates' :
                       query.includes('route') ? 'accessibility' :
                       query.includes('nieuws') ? 'news' :
                       query.includes('genealogie') ? 'genealogy' : 'general';

      results[queryType] = {
        query,
        content: response.data,
        length: response.data.length,
        timestamp: new Date().toISOString()
      };

      // Extract key information
      const content = response.data.toLowerCase();
      if (content.includes('opgericht in') || content.includes('gesticht in')) {
        console.log(chalk.green('  ✅ Found historical information!'));
      }
      if (content.includes('begraven ligt') || content.includes('laatste rustplaats')) {
        console.log(chalk.green('  ✅ Found famous persons!'));
      }
      if (content.includes('€') || content.includes('euro') || content.includes('tarief')) {
        console.log(chalk.green('  ✅ Found pricing information!'));
      }

      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.error(chalk.red(`  ❌ Failed: ${error.message}`));
    }
  }

  return results;
}

// Extract structured historical data
function extractHistoricalData(searchResults: any) {
  const historical = {
    foundingYear: null as number | null,
    historicalEvents: [] as string[],
    famousPersons: [] as string[],
    warGraves: false,
    monuments: [] as string[],
    churchConnection: null as string | null,
  };

  // Try to extract founding year
  const yearPattern = /opgericht in (\d{4})|gesticht in (\d{4})|sinds (\d{4})/gi;
  
  for (const [key, result] of Object.entries(searchResults)) {
    const content = (result as any).content || '';
    
    // Extract years
    const yearMatches = content.matchAll(yearPattern);
    for (const match of yearMatches) {
      const year = parseInt(match[1] || match[2] || match[3]);
      if (year && year > 1500 && year < 2024) {
        historical.foundingYear = year;
        break;
      }
    }

    // Extract famous persons
    const famousPattern = /([A-Z][a-z]+ [A-Z][a-z]+) \(\d{4}-\d{4}\)/g;
    const famousMatches = content.matchAll(famousPattern);
    for (const match of famousMatches) {
      if (!historical.famousPersons.includes(match[1])) {
        historical.famousPersons.push(match[1]);
      }
    }

    // Check for war graves
    if (content.includes('oorlogsgraven') || content.includes('veteranen')) {
      historical.warGraves = true;
    }

    // Check for church connection
    if (content.includes('hervormde kerk') || content.includes('katholieke kerk')) {
      historical.churchConnection = content.includes('hervormde') ? 'Hervormd' : 'Katholiek';
    }
  }

  return historical;
}

// Main enhanced scraping function
export async function enhancedScrapeBegraafplaats(slug: string) {
  console.log(chalk.bold.blue(`\n🪦 Enhanced Scraping: ${slug}\n`));

  // Load begraafplaats data
  const dataFile = path.join(__dirname, '..', 'public', 'data', 'cemeteries.json');
  const begraafplaatsen = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  const begraafplaats = begraafplaatsen.find((b: any) => b.slug === slug);

  if (!begraafplaats) {
    console.error(chalk.red(`❌ Begraafplaats "${slug}" not found`));
    return null;
  }

  console.log(chalk.cyan('Begraafplaats info:'));
  console.log(chalk.gray(`- Naam: ${begraafplaats.naam}`));
  console.log(chalk.gray(`- Gemeente: ${begraafplaats.gemeente}`));
  console.log(chalk.gray(`- Provincie: ${begraafplaats.provincie}`));

  // Perform enhanced searches
  const searchResults = await performEnhancedSearches(begraafplaats);
  
  // Extract historical data
  const historicalData = extractHistoricalData(searchResults);

  // Build enhanced result
  const enhancedResult = {
    ...begraafplaats,
    scrapedAt: new Date().toISOString(),
    enhancedData: {
      historical: historicalData,
      searchResults: searchResults,
      dataQuality: {
        hasHistoricalInfo: !!historicalData.foundingYear,
        hasFamousPersons: historicalData.famousPersons.length > 0,
        hasWarGraves: historicalData.warGraves,
        hasPricingInfo: !!searchResults.rates?.content.includes('€'),
        completenessScore: 0, // Will calculate below
      }
    }
  };

  // Calculate completeness score
  let score = 0;
  if (enhancedResult.enhancedData.dataQuality.hasHistoricalInfo) score += 25;
  if (enhancedResult.enhancedData.dataQuality.hasFamousPersons) score += 25;
  if (enhancedResult.enhancedData.dataQuality.hasWarGraves) score += 25;
  if (enhancedResult.enhancedData.dataQuality.hasPricingInfo) score += 25;
  enhancedResult.enhancedData.dataQuality.completenessScore = score;

  // Save enhanced data
  const outputDir = path.join(__dirname, '..', 'data', 'scraped-brightdata-enhanced');
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, `${slug}.json`);
  await fs.writeFile(outputFile, JSON.stringify(enhancedResult, null, 2));

  console.log(chalk.green(`\n✅ Enhanced scraping complete!`));
  console.log(chalk.cyan('Summary:'));
  console.log(chalk.gray(`- Historical data found: ${historicalData.foundingYear ? '✅' : '❌'}`));
  console.log(chalk.gray(`- Famous persons found: ${historicalData.famousPersons.length > 0 ? '✅' : '❌'} (${historicalData.famousPersons.length})`));
  console.log(chalk.gray(`- War graves: ${historicalData.warGraves ? '✅' : '❌'}`));
  console.log(chalk.gray(`- Data completeness: ${score}%`));
  
  if (historicalData.foundingYear) {
    console.log(chalk.yellow(`\n📅 Founded in: ${historicalData.foundingYear}`));
  }
  
  if (historicalData.famousPersons.length > 0) {
    console.log(chalk.yellow(`\n👤 Famous persons buried here:`));
    historicalData.famousPersons.forEach(person => {
      console.log(chalk.gray(`  - ${person}`));
    });
  }

  return enhancedResult;
}

// If run directly
if (require.main === module) {
  const slug = process.argv[2];
  if (!slug) {
    console.error(chalk.red('Please provide a slug'));
    process.exit(1);
  }
  
  enhancedScrapeBegraafplaats(slug).catch(console.error);
}