import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { config } from 'dotenv';
import path from 'path';

// Load environment
config({ path: path.join(__dirname, '..', '.env.brightdata') });

const API_TOKEN = '90e72bf183dcec69948a69a369dec41d115341fe15991eb195b456364aef4ff0';
const ZONE = 'mcp_unlocker';

async function testBrightDataConnection() {
  console.log(chalk.bold.blue('\n🧪 Testing Bright Data API Connection\n'));
  console.log(chalk.gray('Using shared API token from vindtandarts.nl\n'));

  // Test 1: Simple website scrape
  const websiteSpinner = ora('Testing website scraping...').start();
  try {
    const websiteResponse = await axios.post(
      'https://api.brightdata.com/request',
      {
        url: 'https://www.begraafplaats-zorgvlied.nl/',
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

    websiteSpinner.succeed('Website scraping works! ✅');
    console.log(chalk.gray(`Response size: ${websiteResponse.data.length} characters`));
    console.log(chalk.gray(`Sample: ${websiteResponse.data.substring(0, 200)}...`));
    
    // Check for begraafplaats-specific content
    const hasOpeningHours = websiteResponse.data.toLowerCase().includes('openingstijd');
    const hasContact = websiteResponse.data.toLowerCase().includes('contact') || websiteResponse.data.toLowerCase().includes('telefoon');
    const hasFacilities = websiteResponse.data.toLowerCase().includes('parkeer') || websiteResponse.data.toLowerCase().includes('aula');
    
    console.log(chalk.cyan('\n📋 Content Analysis:'));
    console.log(chalk.gray(`- Opening hours found: ${hasOpeningHours ? '✅' : '❌'}`));
    console.log(chalk.gray(`- Contact info found: ${hasContact ? '✅' : '❌'}`));
    console.log(chalk.gray(`- Facilities info found: ${hasFacilities ? '✅' : '❌'}`));
    
  } catch (error: any) {
    websiteSpinner.fail('Website scraping failed ❌');
    console.error(chalk.red(error.response?.data || error.message));
  }

  // Test 2: Google search
  const searchSpinner = ora('\nTesting Google search...').start();
  try {
    const searchResponse = await axios.post(
      'https://api.brightdata.com/request',
      {
        url: 'https://www.google.nl/search?q=begraafplaats+zorgvlied+amsterdam+openingstijden&hl=nl&gl=nl',
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

    searchSpinner.succeed('Google search works! ✅');
    console.log(chalk.gray(`Response size: ${searchResponse.data.length} characters`));
    
    // Check for search results
    const hasResults = searchResponse.data.includes('Zorgvlied') || searchResponse.data.includes('begraafplaats');
    console.log(chalk.gray(`Relevant results found: ${hasResults ? '✅' : '❌'}`));
    
  } catch (error: any) {
    searchSpinner.fail('Google search failed ❌');
    console.error(chalk.red(error.response?.data || error.message));
  }

  // Test 3: Check zone status
  console.log(chalk.blue('\n📊 Configuration Summary:'));
  console.log(chalk.gray(`- Zone: ${ZONE}`));
  console.log(chalk.gray(`- Token: ${API_TOKEN.substring(0, 20)}...`));
  console.log(chalk.gray(`- Target country: Netherlands (nl)`));

  console.log(chalk.green('\n✅ Connection test complete!'));
  console.log(chalk.yellow('\n📝 Next steps:'));
  console.log('1. Create .env.brightdata file with your configuration');
  console.log('2. Run: npm run brightdata:single -- --slug "begraafplaats-zorgvlied-amsterdam"');
  console.log('3. Run: npm run brightdata:scrape-all (for all begraafplaatsen)');
  console.log('4. Monitor progress in data/scraped-brightdata/progress.json');
  console.log('5. Check Bright Data dashboard for usage stats');
  
  console.log(chalk.cyan('\n💡 Tips:'));
  console.log('- Start with a small batch to test cost estimation');
  console.log('- Monitor your Bright Data dashboard for real-time usage');
  console.log('- The scraper will resume from where it left off if interrupted');
}

testBrightDataConnection().catch(console.error);