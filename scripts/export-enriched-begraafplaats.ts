import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface EnrichedBegraafplaats {
  // Basic info
  begraafplaats_slug: string;
  begraafplaats_naam: string;
  gemeente: string;
  provincie: string;
  type: string;
  
  // Original data
  gps_coordinaten?: string;
  faciliteiten?: string;
  openingstijden?: string;
  historie?: string;
  bijzondere_graven?: string;
  foto_url?: string;
  
  // Scraped data
  website_url?: string;
  website_content?: string;
  website_scraped_at?: string;
  website_openingstijden?: string;
  website_tarieven?: string;
  website_contact_info?: any;
  
  // Google data
  google_rating?: number;
  google_review_count?: number;
  google_reviews?: any[];
  google_photos?: string[];
  google_opening_hours?: any;
  google_phone?: string;
  google_address?: string;
  
  // Generated content
  generated_content?: string;
  generated_at?: string;
  generated_by?: string;
  
  // Metadata
  scrape_status?: string;
  created_at?: string;
  updated_at?: string;
}

interface ParsedGeneratedContent {
  samenvatting?: string;
  geschiedenis?: string;
  kenmerken?: string[];
  toegankelijkheid?: string;
  voorzieningen?: string[];
  bezoekerstips?: string[];
  bijzondereGraven?: string;
  natuurEnOmgeving?: string;
}

// Function to parse generated content JSON
function parseGeneratedContent(contentStr: string): ParsedGeneratedContent | null {
  if (!contentStr) return null;
  
  try {
    return JSON.parse(contentStr);
  } catch (error) {
    console.warn('Failed to parse generated content JSON:', error);
    return null;
  }
}

// Function to merge original data with enriched data
function mergeBegraafplaatsData(original: any, enriched: EnrichedBegraafplaats): any {
  const parsedContent = parseGeneratedContent(enriched.generated_content || '');
  
  return {
    // Original CSV data
    naam_begraafplaats: original.naam_begraafplaats || enriched.begraafplaats_naam,
    gemeente: original.gemeente || enriched.gemeente,
    provincie: original.provincie || enriched.provincie,
    type: original.type || enriched.type,
    faciliteiten: original.faciliteiten,
    gps_coordinaten: original.gps_coordinaten,
    foto_url: original.foto_url,
    openingstijden: original.openingstijden,
    historie: original.historie,
    bijzondere_graven: original.bijzondere_graven,
    links: original.links || enriched.website_url,
    slug: original.slug || enriched.begraafplaats_slug,
    telefoon: original.telefoon || enriched.google_phone,
    adres: original.adres || enriched.google_address,
    
    // Enhanced data from scraping
    website_url: enriched.website_url,
    website_openingstijden: enriched.website_openingstijden,
    website_tarieven: enriched.website_tarieven,
    website_contact_info: enriched.website_contact_info,
    
    // Google reviews data
    google_rating: enriched.google_rating,
    google_review_count: enriched.google_review_count,
    google_reviews: enriched.google_reviews,
    google_photos: enriched.google_photos,
    google_opening_hours: enriched.google_opening_hours,
    
    // Generated content (structured)
    generated: parsedContent,
    
    // Metadata
    enriched: !!enriched.generated_content,
    enriched_at: enriched.generated_at,
    scraped_at: enriched.website_scraped_at || enriched.updated_at,
    last_updated: enriched.updated_at
  };
}

async function exportEnrichedData() {
  console.log('📦 BEGRAAFPLAATS DATA EXPORT TOOL');
  console.log('=================================\n');

  try {
    // Load original cemetery data
    console.log('📥 Loading original cemetery data...');
    const originalDataPath = path.join(process.cwd(), 'public/data/cemeteries.json');
    
    if (!fs.existsSync(originalDataPath)) {
      console.error('❌ Original cemeteries.json not found!');
      console.log('Please run: npm run build-data first');
      return;
    }

    const originalData = JSON.parse(fs.readFileSync(originalDataPath, 'utf-8'));
    console.log(`   Found ${originalData.length} original records`);

    // Load enriched data from database
    console.log('📥 Loading enriched data from database...');
    const { data: enrichedData, error } = await supabase
      .from('scraped_begraafplaats_data')
      .select('*')
      .not('generated_content', 'is', null)
      .order('begraafplaats_slug');

    if (error) {
      console.error('❌ Failed to load enriched data:', error);
      return;
    }

    console.log(`   Found ${enrichedData?.length || 0} enriched records`);

    // Create lookup map for enriched data
    const enrichedMap = new Map<string, EnrichedBegraafplaats>();
    enrichedData?.forEach(item => {
      enrichedMap.set(item.begraafplaats_slug, item);
    });

    // Merge data
    console.log('🔄 Merging original and enriched data...');
    const mergedData = originalData.map((original: any) => {
      const enriched = enrichedMap.get(original.slug);
      if (enriched) {
        return mergeBegraafplaatsData(original, enriched);
      } else {
        // Return original data with enriched: false flag
        return {
          ...original,
          enriched: false,
          generated: null,
          enriched_at: null,
          scraped_at: null,
          last_updated: null
        };
      }
    });

    // Calculate statistics
    const stats = {
      total: mergedData.length,
      enriched: mergedData.filter((item: any) => item.enriched).length,
      withWebsites: mergedData.filter((item: any) => item.website_url).length,
      withReviews: mergedData.filter((item: any) => item.google_rating).length,
      byType: {} as Record<string, number>,
      byProvince: {} as Record<string, number>
    };

    mergedData.forEach((item: any) => {
      stats.byType[item.type || 'onbekend'] = (stats.byType[item.type || 'onbekend'] || 0) + 1;
      stats.byProvince[item.provincie || 'onbekend'] = (stats.byProvince[item.provincie || 'onbekend'] || 0) + 1;
    });

    // Export full dataset
    console.log('💾 Exporting full dataset...');
    const fullExportPath = path.join(process.cwd(), 'data', 'cemeteries-enriched.json');
    fs.writeFileSync(fullExportPath, JSON.stringify(mergedData, null, 2));
    console.log(`   ✅ Saved to: ${fullExportPath}`);

    // Export enriched-only dataset
    console.log('💾 Exporting enriched-only dataset...');
    const enrichedOnly = mergedData.filter((item: any) => item.enriched);
    const enrichedOnlyPath = path.join(process.cwd(), 'data', 'cemeteries-enriched-only.json');
    fs.writeFileSync(enrichedOnlyPath, JSON.stringify(enrichedOnly, null, 2));
    console.log(`   ✅ Saved to: ${enrichedOnlyPath}`);

    // Export by province for large datasets
    console.log('💾 Exporting by province...');
    const exportByProvinceDir = path.join(process.cwd(), 'data', 'by-province');
    if (!fs.existsSync(exportByProvinceDir)) {
      fs.mkdirSync(exportByProvinceDir, { recursive: true });
    }

    const byProvince: Record<string, any[]> = {};
    mergedData.forEach((item: any) => {
      const province = item.provincie || 'onbekend';
      if (!byProvince[province]) byProvince[province] = [];
      byProvince[province].push(item);
    });

    Object.entries(byProvince).forEach(([province, items]) => {
      const filename = `${province.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
      const filepath = path.join(exportByProvinceDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(items, null, 2));
      console.log(`   ✅ ${province}: ${items.length} items -> ${filename}`);
    });

    // Export summary/index file
    console.log('💾 Creating summary file...');
    const summary = {
      export_date: new Date().toISOString(),
      total_cemeteries: stats.total,
      enriched_cemeteries: stats.enriched,
      enrichment_percentage: ((stats.enriched / stats.total) * 100).toFixed(1),
      with_websites: stats.withWebsites,
      with_reviews: stats.withReviews,
      by_type: Object.entries(stats.byType)
        .sort(([,a], [,b]) => b - a)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      by_province: Object.entries(stats.byProvince)
        .sort(([,a], [,b]) => b - a)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      files: {
        full_dataset: 'cemeteries-enriched.json',
        enriched_only: 'cemeteries-enriched-only.json',
        by_province_directory: 'by-province/'
      }
    };

    const summaryPath = path.join(process.cwd(), 'data', 'export-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`   ✅ Summary saved to: ${summaryPath}`);

    // Update production data file
    console.log('💾 Updating production data file...');
    const productionPath = path.join(process.cwd(), 'public/data/cemeteries.json');
    fs.writeFileSync(productionPath, JSON.stringify(mergedData, null, 2));
    console.log(`   ✅ Updated: ${productionPath}`);

    // Create sample data for development
    const sampleData = enrichedOnly.slice(0, 50); // First 50 enriched items
    const samplePath = path.join(process.cwd(), 'data', 'sample-enriched.json');
    fs.writeFileSync(samplePath, JSON.stringify(sampleData, null, 2));
    console.log(`   ✅ Sample data (50 items): ${samplePath}`);

    // Display final statistics
    console.log('\n📊 EXPORT COMPLETED!');
    console.log('==================\n');
    console.log(`📈 Dataset Statistics:`);
    console.log(`   Total begraafplaatsen: ${stats.total}`);
    console.log(`   Enriched: ${stats.enriched} (${((stats.enriched / stats.total) * 100).toFixed(1)}%)`);
    console.log(`   With websites: ${stats.withWebsites} (${((stats.withWebsites / stats.total) * 100).toFixed(1)}%)`);
    console.log(`   With Google reviews: ${stats.withReviews} (${((stats.withReviews / stats.total) * 100).toFixed(1)}%)`);

    console.log(`\n📋 Top 5 Types:`);
    Object.entries(stats.byType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });

    console.log(`\n🏛️ Top 5 Provinces:`);
    Object.entries(stats.byProvince)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([province, count]) => {
        console.log(`   ${province}: ${count}`);
      });

    console.log(`\n📁 Exported Files:`);
    console.log(`   📄 Full dataset: data/cemeteries-enriched.json`);
    console.log(`   📄 Enriched only: data/cemeteries-enriched-only.json`);
    console.log(`   📄 Production file: public/data/cemeteries.json`);
    console.log(`   📄 Summary: data/export-summary.json`);
    console.log(`   📁 By province: data/by-province/`);

    console.log(`\n💡 Next Steps:`);
    console.log('1. Test the updated data on the website');
    console.log('2. Run: npm run build (to build with new data)');
    console.log('3. Deploy to production');
    console.log('4. Monitor SEO performance with enriched content\n');

    // Check for potential issues
    const noSlugItems = mergedData.filter((item: any) => !item.slug);
    if (noSlugItems.length > 0) {
      console.log(`⚠️  Warning: ${noSlugItems.length} items without slugs`);
    }

    const duplicateSlugs = new Set();
    const slugs = new Set();
    mergedData.forEach((item: any) => {
      if (slugs.has(item.slug)) {
        duplicateSlugs.add(item.slug);
      }
      slugs.add(item.slug);
    });

    if (duplicateSlugs.size > 0) {
      console.log(`⚠️  Warning: ${duplicateSlugs.size} duplicate slugs found`);
    }

  } catch (error) {
    console.error('\n❌ Export failed:', error);
    process.exit(1);
  }
}

// Show help
if (process.argv.includes('--help')) {
  console.log(`
📦 BEGRAAFPLAATS DATA EXPORT TOOL
=================================

Usage:
  npm run export-enriched

This tool:
- Loads original cemetery data from public/data/cemeteries.json
- Loads enriched data from scraped_begraafplaats_data table
- Merges the datasets intelligently
- Exports multiple formats for different use cases
- Updates the production data file

Output files:
- data/cemeteries-enriched.json (full dataset)
- data/cemeteries-enriched-only.json (enriched only)
- data/by-province/*.json (split by province)
- data/export-summary.json (statistics)
- public/data/cemeteries.json (production file updated)

Prerequisites:
- Original cemetery data must exist (run: npm run build-data)
- Enriched data in database (run: npm run enrich-content)
`);
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  exportEnrichedData();
}