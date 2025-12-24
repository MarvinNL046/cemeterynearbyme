import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

interface FuneralHome {
  name: string;
  website: string;
  phone: string;
  full_address: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  photo_url: string;
  hours: string;
  accessibility: string;
  logo_url: string;
  place_id: string;
  maps_url: string;
}

interface ProcessedFuneralHome {
  naam: string;
  website: string;
  telefoon: string;
  adres: string;
  straat: string;
  gemeente: string;
  postcode: string;
  provincie?: string;
  latitude: number;
  longitude: number;
  beoordeling: number;
  aantal_reviews: number;
  foto_url: string;
  openingstijden: any;
  toegankelijkheid: any;
  type: 'uitvaartonderneming';
  slug: string;
}

// Map cities to provinces
const cityToProvince: Record<string, string> = {
  // Groningen
  'Groningen': 'Groningen',
  'Hoogezand': 'Groningen',
  'Veendam': 'Groningen',
  'Winschoten': 'Groningen',
  
  // Friesland
  'Leeuwarden': 'Friesland',
  'Sneek': 'Friesland',
  'Heerenveen': 'Friesland',
  
  // Drenthe
  'Assen': 'Drenthe',
  'Emmen': 'Drenthe',
  'Hoogeveen': 'Drenthe',
  
  // Overijssel
  'Zwolle': 'Overijssel',
  'Enschede': 'Overijssel',
  'Deventer': 'Overijssel',
  'Almelo': 'Overijssel',
  
  // Gelderland
  'Arnhem': 'Gelderland',
  'Nijmegen': 'Gelderland',
  'Apeldoorn': 'Gelderland',
  'Ede': 'Gelderland',
  
  // Utrecht
  'Utrecht': 'Utrecht',
  'Amersfoort': 'Utrecht',
  'Veenendaal': 'Utrecht',
  'Zeist': 'Utrecht',
  
  // Noord-Holland
  'Amsterdam': 'Noord-Holland',
  'Haarlem': 'Noord-Holland',
  'Zaandam': 'Noord-Holland',
  'Hoofddorp': 'Noord-Holland',
  'Alkmaar': 'Noord-Holland',
  'Hilversum': 'Noord-Holland',
  
  // Zuid-Holland
  'Rotterdam': 'Zuid-Holland',
  'Den Haag': 'Zuid-Holland',
  "'s-Gravenhage": 'Zuid-Holland',
  'Dordrecht': 'Zuid-Holland',
  'Leiden': 'Zuid-Holland',
  'Zoetermeer': 'Zuid-Holland',
  'Delft': 'Zuid-Holland',
  
  // Zeeland
  'Middelburg': 'Zeeland',
  'Vlissingen': 'Zeeland',
  'Goes': 'Zeeland',
  'Terneuzen': 'Zeeland',
  
  // Noord-Brabant
  'Eindhoven': 'Noord-Brabant',
  'Tilburg': 'Noord-Brabant',
  'Breda': 'Noord-Brabant',
  "'s-Hertogenbosch": 'Noord-Brabant',
  'Den Bosch': 'Noord-Brabant',
  'Helmond': 'Noord-Brabant',
  
  // Limburg
  'Maastricht': 'Limburg',
  'Venlo': 'Limburg',
  'Heerlen': 'Limburg',
  'Sittard': 'Limburg',
  'Roermond': 'Limburg',
  
  // Flevoland
  'Almere': 'Flevoland',
  'Lelystad': 'Flevoland',
  'Emmeloord': 'Flevoland',
};

function getProvince(city: string): string {
  // Direct match
  if (cityToProvince[city]) {
    return cityToProvince[city];
  }
  
  // Try to find partial match
  for (const [knownCity, province] of Object.entries(cityToProvince)) {
    if (city.includes(knownCity) || knownCity.includes(city)) {
      return province;
    }
  }
  
  // Default to unknown - we'll need to handle these separately
  return 'Onbekend';
}

function createSlug(name: string, city: string): string {
  const combined = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return combined;
}

async function processCSV(inputPath: string, outputDir: string) {
  const records: FuneralHome[] = [];
  const parser = createReadStream(inputPath).pipe(
    parse({
      columns: [
        'name',
        'website', 
        'phone',
        'full_address',
        'street',
        'city',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'rating',
        'review_count',
        'photo_url',
        'price_level',
        'hours',
        'accessibility',
        'logo_url',
        'place_id',
        'maps_url'
      ],
      skip_empty_lines: true,
      from_line: 2, // Skip header
    })
  );

  console.log('Reading CSV file...');
  
  for await (const record of parser) {
    if (record.country === 'Netherlands') {
      records.push({
        ...record,
        latitude: parseFloat(record.latitude),
        longitude: parseFloat(record.longitude),
        rating: parseFloat(record.rating) || 0,
        review_count: parseInt(record.review_count) || 0,
      });
    }
  }

  console.log(`Found ${records.length} Dutch funeral homes`);

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Process records by province
  const byProvince: Record<string, ProcessedFuneralHome[]> = {};
  const unknownCities: Set<string> = new Set();

  for (const record of records) {
    const province = getProvince(record.city);
    
    if (province === 'Onbekend') {
      unknownCities.add(record.city);
    }

    const processed: ProcessedFuneralHome = {
      naam: record.name,
      website: record.website,
      telefoon: record.phone,
      adres: record.full_address,
      straat: record.street,
      gemeente: record.city,
      postcode: record.postal_code,
      provincie: province,
      latitude: record.latitude,
      longitude: record.longitude,
      beoordeling: record.rating,
      aantal_reviews: record.review_count,
      foto_url: record.photo_url,
      openingstijden: record.hours ? JSON.parse(record.hours) : null,
      toegankelijkheid: record.accessibility ? JSON.parse(record.accessibility) : null,
      type: 'uitvaartonderneming',
      slug: createSlug(record.name, record.city),
    };

    if (!byProvince[province]) {
      byProvince[province] = [];
    }
    byProvince[province].push(processed);
  }

  // Save data by province
  for (const [province, funeralHomes] of Object.entries(byProvince)) {
    const filename = `uitvaart-${province.toLowerCase().replace(/\s+/g, '-')}.json`;
    await fs.writeFile(
      path.join(outputDir, filename),
      JSON.stringify(funeralHomes, null, 2),
      'utf-8'
    );
    console.log(`Saved ${funeralHomes.length} funeral homes for ${province}`);
  }

  // Save summary
  const summary = {
    total: records.length,
    byProvince: Object.entries(byProvince).map(([province, homes]) => ({
      province,
      count: homes.length,
    })),
    unknownCities: Array.from(unknownCities).sort(),
    generated: new Date().toISOString(),
  };

  await fs.writeFile(
    path.join(outputDir, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );

  console.log('\nSummary:');
  console.log(`Total funeral homes: ${records.length}`);
  console.log(`Unknown cities: ${unknownCities.size}`);
  if (unknownCities.size > 0) {
    console.log('Please add these cities to the cityToProvince mapping:');
    console.log(Array.from(unknownCities).slice(0, 10).join(', '));
  }
}

// Run the script
const inputPath = process.argv[2] || path.join(process.cwd(), 'data', 'funeral-homes.csv');
const outputDir = path.join(process.cwd(), 'data', 'uitvaart');

processCSV(inputPath, outputDir)
  .then(() => console.log('\nDone!'))
  .catch(console.error);