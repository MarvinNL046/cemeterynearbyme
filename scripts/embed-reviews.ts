#!/usr/bin/env npx tsx
/**
 * Embed Reviews into Cemetery Data
 *
 * Embeds review data directly into begraafplaatsen.json so it's available
 * without needing separate API calls to static JSON files.
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_DIR = path.join(DATA_DIR, 'reviews');
const CEMETERY_FILE = path.join(DATA_DIR, 'begraafplaatsen.json');
const PUBLIC_CEMETERY_FILE = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');

interface Review {
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  reviewer_image?: string;
}

interface Cemetery {
  slug: string;
  embeddedReviews?: Review[];
  reviews?: string | Review[];  // Can be string (old) or array (from previous embed runs)
  google_rating?: number;
  google_review_count?: number;
  [key: string]: unknown;
}

async function main() {
  console.log('📝 Embedding reviews into cemetery data...\n');

  // Load cemeteries
  if (!fs.existsSync(CEMETERY_FILE)) {
    console.error('❌ Cemetery file not found:', CEMETERY_FILE);
    process.exit(1);
  }

  const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(CEMETERY_FILE, 'utf-8'));
  console.log(`📥 Loaded ${cemeteries.length} cemeteries`);

  // Get all review files
  if (!fs.existsSync(REVIEWS_DIR)) {
    console.error('❌ Reviews directory not found:', REVIEWS_DIR);
    process.exit(1);
  }

  const reviewFiles = fs.readdirSync(REVIEWS_DIR).filter(f => f.endsWith('.json'));
  console.log(`📥 Found ${reviewFiles.length} review files`);

  // Create slug -> reviews map
  const reviewsMap = new Map<string, Review[]>();
  for (const file of reviewFiles) {
    const slug = file.replace('.json', '');
    try {
      const reviews: Review[] = JSON.parse(
        fs.readFileSync(path.join(REVIEWS_DIR, file), 'utf-8')
      );
      if (reviews.length > 0) {
        reviewsMap.set(slug, reviews);
      }
    } catch (err) {
      console.error(`  ⚠️ Error reading ${file}:`, err);
    }
  }

  console.log(`📊 ${reviewsMap.size} cemeteries have reviews`);

  // Embed reviews into cemeteries
  let embedded = 0;
  let totalReviews = 0;

  for (const cemetery of cemeteries) {
    // Remove old 'reviews' field if it's an array (from previous runs)
    if (Array.isArray(cemetery.reviews)) {
      delete cemetery.reviews;
    }

    const reviews = reviewsMap.get(cemetery.slug);
    if (reviews && reviews.length > 0) {
      cemetery.embeddedReviews = reviews;
      embedded++;
      totalReviews += reviews.length;

      // Calculate and set google_rating and google_review_count from embedded reviews
      const ratings = reviews.map(r => r.rating).filter(r => r != null && r > 0);
      if (ratings.length > 0) {
        const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        cemetery.google_rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
        cemetery.google_review_count = reviews.length;
      }
    }
  }

  console.log(`\n✅ Embedded reviews into ${embedded} cemeteries`);
  console.log(`📝 Total reviews embedded: ${totalReviews}`);

  // Save updated cemeteries
  fs.writeFileSync(CEMETERY_FILE, JSON.stringify(cemeteries, null, 2));
  console.log(`💾 Saved to ${CEMETERY_FILE}`);

  // Also update public data
  fs.writeFileSync(PUBLIC_CEMETERY_FILE, JSON.stringify(cemeteries, null, 2));
  console.log(`💾 Saved to ${PUBLIC_CEMETERY_FILE}`);

  console.log('\n✅ Done! Reviews are now embedded in cemetery data.');
}

main().catch(console.error);
