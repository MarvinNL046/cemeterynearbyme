/**
 * Import cemeteries from JSON to PostgreSQL database
 *
 * Usage: npx tsx scripts/migrations/import-cemeteries-to-db.ts
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { cemeteries } from '../../drizzle/schema-simple';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

const client = neon(DATABASE_URL);
const db = drizzle(client);

// State abbreviation mapping
const STATE_ABBR: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC', 'Washington DC': 'DC', 'Washington D.C.': 'DC',
};

function getStateAbbr(state: string): string {
  // Check if already an abbreviation (2 chars)
  if (state.length === 2 && state === state.toUpperCase()) {
    return state;
  }
  return STATE_ABBR[state] || state.slice(0, 2).toUpperCase();
}

function createTypeSlug(type: string): string {
  return type.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface JSONCemetery {
  slug: string;
  name: string;
  address?: string;
  city: string;
  state: string;
  state_abbr?: string;
  county?: string;
  zip?: string;
  zipCode?: string;
  country?: string;
  type?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  photo_url?: string;
  photos?: string[];
  opening_hours?: string;
  google_cid?: string;
  google_place_id?: string;
  facilities?: string[];
  categories?: string[];
  year_established?: string;
  description?: string;
  discovered_at?: string;
  // Enriched fields
  seoTitle?: string;
  seoDescription?: string;
  enrichedContent?: string;
  generated?: {
    summary?: string;
    history?: string;
    features?: string[];
    amenities?: string[];
    visitor_tips?: string[];
    directions?: string;
    local_context?: string;
  };
  enriched_at?: string;
}

async function importCemeteries() {
  console.log('🚀 Starting cemetery import to database...\n');

  // Load JSON data
  const jsonPath = path.join(process.cwd(), 'public/data/cemeteries.json');
  console.log(`📁 Loading data from: ${jsonPath}`);

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as JSONCemetery[];
  console.log(`📊 Found ${jsonData.length} cemeteries to import\n`);

  // Process in batches
  const BATCH_SIZE = 500;
  const batches = [];
  for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
    batches.push(jsonData.slice(i, i + BATCH_SIZE));
  }
  console.log(`📦 Split into ${batches.length} batches of ${BATCH_SIZE}\n`);

  let totalImported = 0;
  let totalErrors = 0;

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchNum = batchIndex + 1;

    console.log(`⏳ Processing batch ${batchNum}/${batches.length} (${batch.length} records)...`);

    const records = batch.map((c) => ({
      slug: c.slug,
      name: c.name,
      type: c.type || 'public-cemetery',
      typeSlug: createTypeSlug(c.type || 'public-cemetery'),
      address: c.address || null,
      city: c.city,
      county: c.county || null,
      state: c.state,
      stateAbbr: c.state_abbr || getStateAbbr(c.state),
      zipCode: c.zip || c.zipCode || null,
      country: c.country || 'USA',
      latitude: c.latitude?.toString() || null,
      longitude: c.longitude?.toString() || null,
      phone: c.phone || null,
      email: c.email || null,
      website: c.website || null,
      googlePlaceId: c.google_place_id || null,
      googleCid: c.google_cid || null,
      rating: c.rating?.toString() || null,
      reviewCount: c.review_count || 0,
      photoUrl: c.photo_url || null,
      photos: c.photos || null,
      openingHours: c.opening_hours || null,
      facilities: c.facilities || null,
      categories: c.categories || null,
      yearEstablished: c.year_established || null,
      description: c.description || null,
      seoTitle: c.seoTitle || null,
      seoDescription: c.seoDescription || null,
      enrichedContent: c.enrichedContent || null,
      generatedSummary: c.generated?.summary || null,
      generatedHistory: c.generated?.history || null,
      generatedFeatures: c.generated?.features || null,
      generatedAmenities: c.generated?.amenities || null,
      generatedVisitorTips: c.generated?.visitor_tips || null,
      generatedDirections: c.generated?.directions || null,
      generatedLocalContext: c.generated?.local_context || null,
      enrichedAt: c.enriched_at || null,
      source: 'google_maps',
      status: 'active',
      discoveredAt: c.discovered_at || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    try {
      // Use ON CONFLICT to upsert
      await db.insert(cemeteries)
        .values(records)
        .onConflictDoUpdate({
          target: cemeteries.slug,
          set: {
            name: sql`EXCLUDED.name`,
            type: sql`EXCLUDED.type`,
            typeSlug: sql`EXCLUDED.type_slug`,
            address: sql`EXCLUDED.address`,
            city: sql`EXCLUDED.city`,
            county: sql`EXCLUDED.county`,
            state: sql`EXCLUDED.state`,
            stateAbbr: sql`EXCLUDED.state_abbr`,
            zipCode: sql`EXCLUDED.zip_code`,
            latitude: sql`EXCLUDED.latitude`,
            longitude: sql`EXCLUDED.longitude`,
            phone: sql`EXCLUDED.phone`,
            website: sql`EXCLUDED.website`,
            rating: sql`EXCLUDED.rating`,
            reviewCount: sql`EXCLUDED.review_count`,
            photoUrl: sql`EXCLUDED.photo_url`,
            photos: sql`EXCLUDED.photos`,
            openingHours: sql`EXCLUDED.opening_hours`,
            facilities: sql`EXCLUDED.facilities`,
            categories: sql`EXCLUDED.categories`,
            updatedAt: sql`EXCLUDED.updated_at`,
          },
        });

      totalImported += batch.length;
      console.log(`   ✅ Batch ${batchNum} complete (${totalImported}/${jsonData.length} total)`);
    } catch (error) {
      console.error(`   ❌ Error in batch ${batchNum}:`, error);
      totalErrors += batch.length;
    }
  }

  console.log('\n========================================');
  console.log(`✅ Import complete!`);
  console.log(`   📊 Total imported: ${totalImported}`);
  console.log(`   ❌ Total errors: ${totalErrors}`);
  console.log('========================================\n');

  // Verify import
  const [countResult] = await db.select({ count: sql`COUNT(*)` }).from(cemeteries);
  console.log(`📊 Database now contains ${countResult.count} cemeteries\n`);
}

// Run the import
importCemeteries()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
