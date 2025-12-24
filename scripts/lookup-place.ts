#!/usr/bin/env npx tsx
/**
 * Lookup a specific place via Bright Data SERP API
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.BRIGHTDATA_SERP_API_KEY;
const ZONE = process.env.BRIGHTDATA_DISCOVERY_ZONE || 'begraafplaatsindebuurt';

const query = process.argv[2] || 'Gemeentelijke Begraafplaats Oud-Avereest Bellstraat Oud-Avereest';

async function searchPlace(searchQuery: string) {
  console.log(`Searching for: ${searchQuery}`);
  console.log(`Using zone: ${ZONE}`);

  const encodedQuery = encodeURIComponent(searchQuery);

  const response = await fetch('https://api.brightdata.com/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      zone: ZONE,
      url: `https://www.google.com/maps/search/${encodedQuery}?brd_json=1`,
      format: 'json',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('API Error:', response.status, text);
    return null;
  }

  const data = await response.json();

  // Parse the body if it's a string
  if (data.body && typeof data.body === 'string') {
    try {
      data.parsedBody = JSON.parse(data.body);
    } catch (e) {
      // Keep original
    }
  }

  // Show nicely formatted results
  if (data.parsedBody?.organic?.[0]) {
    const place = data.parsedBody.organic[0];
    console.log('\n========== GEVONDEN PLAATS ==========');
    console.log('Naam:', place.title);
    console.log('Adres:', place.address);
    console.log('Openingstijden:', place.work_status);
    console.log('Rating:', place.rating, `(${place.reviews_cnt} reviews)`);
    console.log('Latitude:', place.latitude);
    console.log('Longitude:', place.longitude);
    console.log('Google Place ID:', place.map_id_encoded);
    console.log('Google CID:', place.fid);
    console.log('Foto:', place.original_image);
    console.log('Categorie:', place.category?.map((c: any) => c.title).join(', '));
    console.log('Tags:', place.tags?.map((t: any) => t.key_title).join(', '));
    console.log('Google Maps:', place.map_link);
    console.log('======================================\n');

    // Show full place object to see all available fields
    console.log('\n========== VOLLEDIGE DATA ==========');
    console.log(JSON.stringify(place, null, 2));
    console.log('=====================================\n');
  } else {
    console.log('Geen resultaten gevonden');
    console.log(JSON.stringify(data, null, 2));
  }

  return data;
}

searchPlace(query);
