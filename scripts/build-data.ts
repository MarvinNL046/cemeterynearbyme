import { promises as fs } from 'fs';
import path from 'path';

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
  slug: string;
  telefoon?: string;
  adres?: string;
  beoordeling?: number;
  aantal_reviews?: number;
  toegankelijkheid?: any;
  raw_openingstijden?: any;
}

async function buildData() {
  try {
    console.log('Building cemetery data for production...');
    
    // Check if we already have the public data (useful for Vercel if CSV is not available)
    const publicDataPath = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');
    try {
      await fs.access(publicDataPath);
      console.log('Public data already exists, checking if source is available...');
    } catch {
      // Public data doesn't exist, we need to build it
    }
    
    // Read the processed JSON file
    const processedJsonPath = path.join(process.cwd(), 'data', 'cemeteries-processed.json');
    let processedRecords: Cemetery[];
    
    try {
      const jsonContent = await fs.readFile(processedJsonPath, 'utf-8');
      processedRecords = JSON.parse(jsonContent);
    } catch {
      console.log('Processed JSON not found, checking for existing public data...');
      try {
        await fs.access(publicDataPath);
        console.log('Public data already exists, skipping build.');
        return;
      } catch {
        console.error('No data source available. Please ensure either:');
        console.error('1. Run: npx tsx scripts/process-all-data.ts cemetery data/begraafplaats.csv');
        console.error('2. /public/data/cemeteries.json is already built');
        process.exit(1);
      }
    }
    
    // Create output directory
    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(publicDataDir, { recursive: true });
    
    // Save the processed data
    const outputPath = path.join(publicDataDir, 'cemeteries.json');
    await fs.writeFile(
      outputPath,
      JSON.stringify(processedRecords, null, 2),
      'utf-8'
    );
    
    console.log(`✓ Processed ${processedRecords.length} cemeteries`);
    console.log(`✓ Saved to ${outputPath}`);
    
    // Create a summary file for quick stats
    const summary = {
      total: processedRecords.length,
      provinces: [...new Set(processedRecords.map(c => c.provincie).filter(Boolean))].sort(),
      municipalities: [...new Set(processedRecords.map(c => c.gemeente).filter(Boolean))].sort(),
      types: [...new Set(processedRecords.map(c => c.type).filter(Boolean))].sort(),
      lastUpdated: new Date().toISOString(),
    };
    
    await fs.writeFile(
      path.join(publicDataDir, 'summary.json'),
      JSON.stringify(summary, null, 2),
      'utf-8'
    );
    
    console.log('✓ Build complete!');
    
  } catch (error) {
    console.error('Error building data:', error);
    process.exit(1);
  }
}

// Run the build
buildData();