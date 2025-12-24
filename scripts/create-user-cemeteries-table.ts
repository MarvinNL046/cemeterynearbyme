#!/usr/bin/env npx tsx
/**
 * Create user_cemeteries table in NeonDB
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createTable() {
  console.log('Creating user_cemeteries table...');

  try {
    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS user_cemeteries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        naam VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        type VARCHAR(100) NOT NULL DEFAULT 'algemene begraafplaats',
        adres VARCHAR(255),
        postcode VARCHAR(10),
        plaats VARCHAR(100) NOT NULL,
        gemeente VARCHAR(100) NOT NULL,
        provincie VARCHAR(50) NOT NULL,
        gps_coordinaten VARCHAR(50),
        telefoon VARCHAR(50),
        email VARCHAR(255),
        website VARCHAR(500),
        beschrijving TEXT,
        openingstijden TEXT,
        faciliteiten TEXT,
        jaar_oprichting VARCHAR(10),
        photos TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        rejection_reason TEXT,
        reviewed_at TIMESTAMP,
        reviewed_by INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✅ Table created');

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS user_cemeteries_user_id_idx ON user_cemeteries(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS user_cemeteries_status_idx ON user_cemeteries(status)`;
    await sql`CREATE INDEX IF NOT EXISTS user_cemeteries_gemeente_idx ON user_cemeteries(gemeente)`;
    console.log('✅ Indexes created');

    // Verify table exists
    const result = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_name = 'user_cemeteries'
    `;

    if (result.length > 0) {
      console.log('✅ Table verified: user_cemeteries');
    } else {
      console.error('❌ Table not found after creation');
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTable();
