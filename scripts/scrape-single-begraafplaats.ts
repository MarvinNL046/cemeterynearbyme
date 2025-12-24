import { config } from 'dotenv';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs/promises';

config({ path: path.join(__dirname, '..', '.env.brightdata') });

const API_TOKEN = '90e72bf183dcec69948a69a369dec41d115341fe15991eb195b456364aef4ff0';
const ZONE = 'mcp_unlocker';

async function scrapeSingleBegraafplaats(slug: string) {
  console.log(chalk.bold.blue(`\n🪦 Scraping single begraafplaats: ${slug}\n`));

  // Load begraafplaatsen data
  const dataFile = path.join(__dirname, '..', 'public', 'data', 'cemeteries.json');
  let begraafplaatsen;
  
  try {
    begraafplaatsen = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  } catch (error) {
    console.error(chalk.red('❌ Could not load cemeteries.json'));
    console.error('Make sure you have run the data build process first');
    process.exit(1);
  }

  const begraafplaats = begraafplaatsen.find((b: any) => b.slug === slug);
  if (!begraafplaats) {
    console.error(chalk.red(`❌ Begraafplaats with slug "${slug}" not found`));
    console.log(chalk.yellow('\nAvailable slugs (first 10):'));
    begraafplaatsen.slice(0, 10).forEach((b: any) => {
      console.log(chalk.gray(`  - ${b.slug}`));
    });
    process.exit(1);
  }

  console.log(chalk.cyan('Found begraafplaats:'));
  console.log(chalk.gray(`- Naam: ${begraafplaats.naam_begraafplaats}`));
  console.log(chalk.gray(`- Gemeente: ${begraafplaats.gemeente}`));
  console.log(chalk.gray(`- Provincie: ${begraafplaats.provincie}`));
  console.log(chalk.gray(`- Type: ${begraafplaats.type}`));
  console.log(chalk.gray(`- Website: ${begraafplaats.website || 'Geen website'}`));

  // Check for generic names
  const genericNames = ['cemetery', 'begraafplaats', 'kerkhof'];
  if (genericNames.includes(begraafplaats.naam_begraafplaats.toLowerCase().trim())) {
    console.log(chalk.red(`\n⚠️  Warning: This appears to be a generic cemetery name`));
    console.log(chalk.yellow('Consider skipping entries with generic names like "Cemetery"'));
  }

  const results: any = {
    slug,
    naam: begraafplaats.naam_begraafplaats,
    gemeente: begraafplaats.gemeente,
    provincie: begraafplaats.provincie,
    type: begraafplaats.type,
    scrapedAt: new Date().toISOString(),
    websiteData: null,
    googleData: null,
  };

  // Scrape website if available
  if (begraafplaats.website && !begraafplaats.website.includes('google.com/maps')) {
    console.log(chalk.yellow('\n📄 Scraping website...'));
    try {
      const response = await axios.post(
        'https://api.brightdata.com/request',
        {
          url: begraafplaats.website,
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

      console.log(chalk.green('✅ Website scraped successfully'));
      console.log(chalk.gray(`Content length: ${response.data.length} characters`));

      results.websiteData = {
        url: begraafplaats.website,
        content: response.data,
        contentLength: response.data.length,
      };

      // Extract some key information
      const content = response.data.toLowerCase();
      console.log(chalk.cyan('\n📊 Quick content analysis:'));
      console.log(chalk.gray(`- Has opening hours: ${content.includes('openingstijd') ? '✅' : '❌'}`));
      console.log(chalk.gray(`- Has contact info: ${content.includes('telefoon') || content.includes('email') ? '✅' : '❌'}`));
      console.log(chalk.gray(`- Has facilities info: ${content.includes('parkeer') || content.includes('aula') ? '✅' : '❌'}`));
      console.log(chalk.gray(`- Has rates info: ${content.includes('tarief') || content.includes('prijs') ? '✅' : '❌'}`));

    } catch (error: any) {
      console.error(chalk.red('❌ Website scraping failed:'), error.response?.data || error.message);
    }
  } else {
    console.log(chalk.yellow('\n⚠️  No website available'));
  }

  // Always search Google for additional info
  console.log(chalk.yellow('\n🔍 Searching Google...'));
  const searchQuery = `${begraafplaats.naam_begraafplaats} ${begraafplaats.gemeente} begraafplaats openingstijden contact`;
  console.log(chalk.gray(`Query: "${searchQuery}"`));

  try {
    const searchUrl = `https://www.google.nl/search?q=${encodeURIComponent(searchQuery)}&hl=nl&gl=nl`;
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

    console.log(chalk.green('✅ Google search completed'));
    console.log(chalk.gray(`Results length: ${response.data.length} characters`));

    results.googleData = {
      query: searchQuery,
      results: response.data,
      resultsLength: response.data.length,
    };

  } catch (error: any) {
    console.error(chalk.red('❌ Google search failed:'), error.response?.data || error.message);
  }

  // Save to file
  const outputDir = path.join(__dirname, '..', 'data', 'scraped-brightdata');
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, `${slug}.json`);
  await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

  console.log(chalk.green(`\n✅ Saved to: ${outputFile}`));
  console.log(chalk.cyan('\n📈 Summary:'));
  console.log(chalk.gray(`- Website scraped: ${results.websiteData ? '✅' : '❌'}`));
  console.log(chalk.gray(`- Google searched: ${results.googleData ? '✅' : '❌'}`));
  console.log(chalk.gray(`- Total data collected: ${JSON.stringify(results).length} bytes`));
  
  console.log(chalk.yellow('\n💡 Next steps:'));
  console.log('1. Check the output file for scraped data');
  console.log('2. Run AI enrichment on this data');
  console.log('3. Or run full scraping: npm run brightdata:scrape-all');
}

// Get slug from command line
const args = process.argv.slice(2);
let slug = '';

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--slug' && args[i + 1]) {
    slug = args[i + 1];
    break;
  } else if (args[i].startsWith('--slug=')) {
    slug = args[i].substring(7);
    break;
  }
}

if (!slug) {
  console.error(chalk.red('❌ Please provide a slug'));
  console.log('Usage: npm run brightdata:single -- --slug "begraafplaats-slug"');
  console.log('\nExample:');
  console.log('  npm run brightdata:single -- --slug "begraafplaats-zorgvlied-amsterdam"');
  process.exit(1);
}

scrapeSingleBegraafplaats(slug).catch(console.error);