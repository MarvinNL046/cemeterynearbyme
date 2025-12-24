import fs from 'fs';
import path from 'path';

interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  plaats?: string;
  adres?: string;
  postcode?: string;
  gps_coordinaten?: string;
  slug: string;
}

// Load cemetery data
const dataPath = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
const cemeteries: Cemetery[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Generate Google Maps search URLs
const urls: { url: string; slug: string }[] = [];

for (const cemetery of cemeteries) {
  // Build search query
  const parts = [
    cemetery.naam_begraafplaats,
    cemetery.adres,
    cemetery.postcode,
    cemetery.plaats || cemetery.gemeente,
    'Nederland'
  ].filter(Boolean);
  
  const query = encodeURIComponent(parts.join(', '));
  
  // If we have GPS coordinates, use them for more accurate results
  // Add hl=nl parameter for Dutch language reviews
  let url: string;
  if (cemetery.gps_coordinaten) {
    const [lat, lon] = cemetery.gps_coordinaten.split(',').map(s => s.trim());
    url = `https://www.google.nl/maps/search/${query}/@${lat},${lon},17z?hl=nl`;
  } else {
    url = `https://www.google.nl/maps/search/${query}?hl=nl`;
  }
  
  urls.push({ url, slug: cemetery.slug });
}

// Save URLs for BrightData
const brightdataInput = urls.map(u => ({ url: u.url }));
fs.writeFileSync(
  path.join(process.cwd(), 'data', 'brightdata-urls.json'),
  JSON.stringify(brightdataInput, null, 2)
);

// Save mapping for later matching
fs.writeFileSync(
  path.join(process.cwd(), 'data', 'url-slug-mapping.json'),
  JSON.stringify(urls, null, 2)
);

console.log(`Generated ${urls.length} Google Maps URLs`);
console.log('Saved to data/brightdata-urls.json and data/url-slug-mapping.json');

// Show first 3 examples
console.log('\nFirst 3 examples:');
urls.slice(0, 3).forEach(u => {
  console.log(`- ${u.slug}`);
  console.log(`  ${u.url}\n`);
});
