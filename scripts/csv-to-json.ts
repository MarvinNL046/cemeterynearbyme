#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

interface BegraafplaatsCSV {
  name: string;
  site?: string;
  phone?: string;
  full_address?: string;
  street?: string;
  city: string;
  postal_code?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  rating?: string;
  reviews?: string;
  photo?: string;
  located_in?: string;
  working_hours?: string;
  about?: string;
  logo?: string;
  description?: string;
  location_link?: string;
}

function createSlug(naam: string, gemeente: string): string {
  return `${naam}-${gemeente}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const begraafplaatsen: Record<string, any> = {};

// Try different possible CSV files
const csvFiles = [
  'begraafplaats-filtered.csv',
  'begraafplaats.csv',
  'begraafplaatsen.csv'
];

let csvPath = '';
for (const file of csvFiles) {
  const testPath = path.join(__dirname, '..', 'data', file);
  if (fs.existsSync(testPath)) {
    csvPath = testPath;
    console.log(`Found CSV file: ${file}`);
    break;
  }
}

if (!csvPath) {
  console.error('No CSV file found in data directory');
  process.exit(1);
}

const outputPath = path.join(__dirname, '..', 'data', 'begraafplaatsen.json');

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row: BegraafplaatsCSV) => {
    // Skip empty rows
    if (!row.name || !row.city) return;
    
    const naam = row.name;
    const gemeente = row.city;
    const slug = createSlug(naam, gemeente);
    
    // Determine provincie from postal code
    const postcode = row.postal_code?.substring(0, 4);
    let provincie = 'Onbekend';
    
    // Simple provincie mapping based on postcode ranges
    if (postcode) {
      const pc = parseInt(postcode);
      if (pc >= 1000 && pc <= 1299) provincie = 'Noord-Holland';
      else if (pc >= 1300 && pc <= 1379) provincie = 'Flevoland';
      else if (pc >= 1380 && pc <= 2199) provincie = 'Noord-Holland';
      else if (pc >= 2200 && pc <= 3299) provincie = 'Zuid-Holland';
      else if (pc >= 3300 && pc <= 3499) provincie = 'Zuid-Holland';
      else if (pc >= 3500 && pc <= 3999) provincie = 'Utrecht';
      else if (pc >= 4000 && pc <= 4299) provincie = 'Zeeland';
      else if (pc >= 4300 && pc <= 4999) provincie = 'Noord-Brabant';
      else if (pc >= 5000 && pc <= 5999) provincie = 'Noord-Brabant';
      else if (pc >= 6000 && pc <= 6499) provincie = 'Limburg';
      else if (pc >= 6500 && pc <= 6999) provincie = 'Gelderland';
      else if (pc >= 7000 && pc <= 7999) provincie = 'Gelderland';
      else if (pc >= 8000 && pc <= 8999) provincie = 'Overijssel';
      else if (pc >= 9000 && pc <= 9299) provincie = 'Friesland';
      else if (pc >= 9300 && pc <= 9399) provincie = 'Drenthe';
      else if (pc >= 9400 && pc <= 9699) provincie = 'Drenthe';
      else if (pc >= 9700 && pc <= 9999) provincie = 'Groningen';
    }
    
    begraafplaatsen[slug] = {
      naam,
      gemeente,
      provincie,
      type: naam.toLowerCase().includes('joodse') ? 'joodse begraafplaats' : 
            naam.toLowerCase().includes('islamitisch') ? 'islamitische begraafplaats' :
            naam.toLowerCase().includes('natuurbegraafplaats') ? 'natuurbegraafplaats' :
            'algemene begraafplaats',
      adres: row.street || row.full_address,
      postcode: row.postal_code,
      telefoon: row.phone,
      website: row.site,
      slug,
      gps_coordinaten: row.latitude && row.longitude ? `${row.latitude},${row.longitude}` : null,
      rating: row.rating,
      reviews: row.reviews,
      photo: row.photo,
      openingstijden: row.working_hours,
      beschrijving: row.description || row.about
    };
  })
  .on('end', () => {
    fs.writeFileSync(
      outputPath,
      JSON.stringify(begraafplaatsen, null, 2)
    );
    console.log(`✅ Converted ${Object.keys(begraafplaatsen).length} cemeteries`);
    console.log(`📁 Saved to: ${outputPath}`);
  })
  .on('error', (error) => {
    console.error('Error processing CSV:', error);
  });