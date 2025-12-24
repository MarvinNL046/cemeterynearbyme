#!/usr/bin/env npx tsx
/**
 * Run content enhancement for all provinces
 * Usage: npx tsx scripts/enhance-all-provinces.ts [--limit=50]
 */

import { execSync } from 'child_process';

const PROVINCES = [
  'Drenthe',
  'Flevoland',
  'Friesland',
  'Gelderland',
  'Groningen',
  'Limburg',
  'Noord-Brabant',
  'Noord-Holland',
  'Overijssel',
  'Utrecht',
  'Zeeland',
  'Zuid-Holland'
];

const args = process.argv.slice(2);
const limit = args.find(a => a.startsWith('--limit=')) || '--limit=50';

console.log('🚀 Enhance All Provinces');
console.log('========================\n');
console.log(`Limiet per provincie: ${limit.split('=')[1]}\n`);

for (const province of PROVINCES) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📍 ${province}`);
  console.log('='.repeat(50));

  try {
    execSync(`npx tsx scripts/enhance-content.ts "${province}" ${limit}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } catch (error) {
    console.error(`❌ Error bij ${province}, ga door naar volgende...`);
  }
}

console.log('\n\n🎉 Alle provincies verwerkt!');
