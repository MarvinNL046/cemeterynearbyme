#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

async function convertJsonToArray() {
  const inputPath = path.join(__dirname, '..', 'data', 'begraafplaatsen.json');
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'cemeteries.json');
  
  // Create public/data directory if it doesn't exist
  const publicDataDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  
  // Read the object-based JSON
  const jsonContent = fs.readFileSync(inputPath, 'utf-8');
  const cemeteriesObject = JSON.parse(jsonContent);
  
  // Convert to array format
  const cemeteriesArray = Object.entries(cemeteriesObject).map(([slug, data]: [string, any]) => ({
    naam_begraafplaats: data.naam,
    gemeente: data.gemeente,
    provincie: data.provincie,
    type: data.type,
    faciliteiten: '',
    gps_coordinaten: data.gps_coordinaten || '',
    foto_url: '',
    openingstijden: data.openingstijden || '',
    historie: '',
    bijzondere_graven: '',
    links: data.website || '',
    slug: data.slug || slug,
    telefoon: data.telefoon || '',
    adres: data.adres || '',
    postcode: data.postcode || '',
    plaats: data.gemeente, // Use gemeente as plaats if not specified
    // Real scraped data fields
    rating: data.rating || '',
    reviews: data.reviews || '',
    photo: data.photo || '',
    beschrijving: data.beschrijving || '',
  }));
  
  // Sort by name for consistent output
  cemeteriesArray.sort((a, b) => a.naam_begraafplaats.localeCompare(b.naam_begraafplaats));
  
  // Write the array-based JSON
  fs.writeFileSync(outputPath, JSON.stringify(cemeteriesArray, null, 2));
  
  console.log(`✅ Converted ${cemeteriesArray.length} cemeteries from object to array format`);
  console.log(`📁 Output saved to: ${outputPath}`);
}

convertJsonToArray().catch(console.error);