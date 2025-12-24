#!/usr/bin/env npx tsx
/**
 * Update a specific cemetery with new data
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const PUBLIC_FILE = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');

// Cemetery to update
const targetSlug = 'gemeentelijke-begraafplaats-oud-avereest-oud-avereest';

// New data from Google Places API
const newData = {
  adres: 'Oud Avereest 5a',
  postcode: '7707 PM',
  plaats: 'Balkbrug', // Corrected from Oud-Avereest
  gps_coordinaten: '52.6197203,6.3719871999999995',
  google_place_id: 'ChIJ9VGin9MOyEcRPMGvRG0u0-k',
  google_cid: '0x47c80ed39fa251f5:0xe9d32e6d44afc13c',
  google_rating: 4,
  google_review_count: 1,
  openingstijden: '24 uur geopend',
  foto_url: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzW0SGqa48cPdoZ-k7xBUwHFdISCGskbQHAj4qyCZxTmynvU_sCdU5sJ1FZgWQ9w8dexclo9bFPwIfyjZsDp_MrrAH2zJwZZXAd_aOB_1jbwaxyrK_ftQjxyUsqM1JexkmZCl4=w408-h306-k-no',
  faciliteiten: 'Rolstoeltoegankelijke ingang, Rolstoeltoegankelijk parkeren',
};

async function main() {
  console.log('📝 Updating cemetery:', targetSlug);

  // Load data
  const cemeteries = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log(`📥 Loaded ${cemeteries.length} cemeteries`);

  // Find and update
  let found = false;
  for (const cemetery of cemeteries) {
    if (cemetery.slug === targetSlug) {
      found = true;
      console.log('\n📍 Found cemetery:');
      console.log('   Before:');
      console.log('   - Adres:', cemetery.adres);
      console.log('   - Postcode:', cemetery.postcode);
      console.log('   - Plaats:', cemetery.plaats);
      console.log('   - GPS:', cemetery.gps_coordinaten || 'geen');
      console.log('   - Rating:', cemetery.google_rating || 'geen');
      console.log('   - Foto:', cemetery.foto_url || 'geen');

      // Apply updates
      Object.assign(cemetery, newData);

      // Update generated content with correct info
      if (cemetery.generated) {
        cemetery.generated.lokaleContext = `Gemeentelijke Begraafplaats Oud-Avereest is gelegen in de provincie Overijssel. De begraafplaats bevindt zich in Balkbrug, een plaats binnen de gemeente Hardenberg. U vindt de begraafplaats aan Oud Avereest 5a (7707 PM).`;
        cemetery.generated.toegankelijkheid = `De begraafplaats is goed toegankelijk. Er is een rolstoeltoegankelijke ingang en rolstoeltoegankelijk parkeren beschikbaar.`;
        cemetery.generated.voorzieningen = ['Rolstoeltoegankelijke ingang', 'Rolstoeltoegankelijk parkeren'];
        cemetery.generated.kenmerken = ['Algemene begraafplaats', '24 uur toegankelijk'];
      }

      console.log('\n   After:');
      console.log('   - Adres:', cemetery.adres);
      console.log('   - Postcode:', cemetery.postcode);
      console.log('   - Plaats:', cemetery.plaats);
      console.log('   - GPS:', cemetery.gps_coordinaten);
      console.log('   - Rating:', cemetery.google_rating);
      console.log('   - Foto:', cemetery.foto_url ? 'ja' : 'geen');
      console.log('   - Openingstijden:', cemetery.openingstijden);
      console.log('   - Faciliteiten:', cemetery.faciliteiten);

      break;
    }
  }

  if (!found) {
    console.error('❌ Cemetery not found:', targetSlug);
    process.exit(1);
  }

  // Save to both files
  fs.writeFileSync(DATA_FILE, JSON.stringify(cemeteries, null, 2));
  console.log('\n💾 Saved to', DATA_FILE);

  fs.writeFileSync(PUBLIC_FILE, JSON.stringify(cemeteries, null, 2));
  console.log('💾 Saved to', PUBLIC_FILE);

  console.log('\n✅ Done! Cemetery updated successfully.');
}

main().catch(console.error);
