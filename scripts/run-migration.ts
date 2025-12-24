import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log('Creating tables...');

  // Google reviews table
  await sql`
    CREATE TABLE IF NOT EXISTS google_reviews (
      id SERIAL PRIMARY KEY,
      cemetery_slug VARCHAR(255) NOT NULL,
      google_place_id VARCHAR(255),
      reviewer_name VARCHAR(255) NOT NULL,
      reviewer_image_url TEXT,
      rating INTEGER NOT NULL,
      content TEXT,
      review_date TIMESTAMP,
      language VARCHAR(10) DEFAULT 'nl',
      imported_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log('✓ google_reviews table created');

  await sql`CREATE INDEX IF NOT EXISTS google_reviews_cemetery_slug_idx ON google_reviews(cemetery_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS google_reviews_rating_idx ON google_reviews(rating)`;

  // User favorites table
  await sql`
    CREATE TABLE IF NOT EXISTS user_favorites_by_slug (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      cemetery_slug VARCHAR(255) NOT NULL,
      cemetery_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log('✓ user_favorites_by_slug table created');

  await sql`CREATE INDEX IF NOT EXISTS user_favorites_by_slug_user_id_idx ON user_favorites_by_slug(user_id)`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS user_favorites_by_slug_unique ON user_favorites_by_slug(user_id, cemetery_slug)`;

  // Cemetery reviews table
  await sql`
    CREATE TABLE IF NOT EXISTS cemetery_reviews (
      id SERIAL PRIMARY KEY,
      cemetery_slug VARCHAR(255) NOT NULL,
      user_id INTEGER,
      author_name VARCHAR(255) NOT NULL,
      author_email VARCHAR(255),
      rating INTEGER NOT NULL,
      title VARCHAR(255),
      content TEXT NOT NULL,
      visit_date VARCHAR(50),
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      ip_hash VARCHAR(64),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log('✓ cemetery_reviews table created');

  await sql`CREATE INDEX IF NOT EXISTS cemetery_reviews_slug_idx ON cemetery_reviews(cemetery_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS cemetery_reviews_status_idx ON cemetery_reviews(status)`;
  await sql`CREATE INDEX IF NOT EXISTS cemetery_reviews_user_id_idx ON cemetery_reviews(user_id)`;

  // Cemetery photos table
  await sql`
    CREATE TABLE IF NOT EXISTS cemetery_photos (
      id SERIAL PRIMARY KEY,
      cemetery_slug VARCHAR(255) NOT NULL,
      user_id INTEGER,
      uploader_name VARCHAR(255) NOT NULL,
      uploader_email VARCHAR(255),
      file_name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      file_size INTEGER,
      caption VARCHAR(500),
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      ip_hash VARCHAR(64),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log('✓ cemetery_photos table created');

  await sql`CREATE INDEX IF NOT EXISTS cemetery_photos_slug_idx ON cemetery_photos(cemetery_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS cemetery_photos_status_idx ON cemetery_photos(status)`;

  console.log('\nAll tables created successfully!');
}

runMigration().catch(console.error);
