import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { getProvince as getProvinceByPostcode } from './postcode-to-province';

// Shared types
interface ProcessedCemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  faciliteiten: string;
  gps_coordinaten: string;
  foto_url: string;
  openingstijden: string;
  historie: string;
  bijzondere_graven: string;
  links: string;
  slug: string;
  telefoon?: string;
  adres?: string;
  beoordeling?: number;
  aantal_reviews?: number;
  toegankelijkheid?: any;
  raw_openingstijden?: any;
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

// This mapping is now replaced by dynamic postcode lookup

// Keywords that indicate NON-cemetery businesses
const excludeKeywords = [
  // Auto/Vehicle related
  'auto',
  'autobedrijf',
  'automobielbedrijf',
  'autokerkhof', // auto graveyard
  'autowasserette',
  'tankstation',
  'garage',
  
  // Parking
  'parkeren',
  'parking',
  
  // Businesses with "kerkhof" in name but not actual cemeteries
  'bp kerkhof', // gas station
  
  // Other businesses
  'bv', // company indicator
  'b.v.',
  'winkel',
  'shop',
  'hotel',
  'restaurant',
  'cafe',
  'café',
  
  // Suppliers/services
  'natuurkisten', // coffin supplier
  'bloemist',
  'steenhouwer',
];

// Keywords that indicate funeral services (not cemeteries)
const funeralServiceKeywords = [
  'uitvaartverzorging',
  'uitvaartzorg',
  'uitvaartcentrum',
  'uitvaartbegeleiding',
  'uitvaartatelier',
  'uitvaartvereniging',
  'uitvaartondernemer',
  'monuta', // funeral service chain
  'dela', // funeral service chain (except crematoriums)
  'akoestisch duo', // musicians for funerals
  'zangeres uitvaart', // funeral singers
  'afscheid in beeld', // funeral photographers
];

// Keywords that definitely indicate a cemetery
const cemeteryKeywords = [
  'begraafplaats',
  'kerkhof',
  'cemetery',
  'graf',
  'graven',
  'begraaf',
  
  // Specific cemetery types
  'natuurbegraafplaats',
  'oorlogsgraven',
  'erebegraafplaats',
  'joodse begraafplaats',
  'islamitische begraafplaats',
  'rooms katholieke kerkhof',
  'protestantse begraafplaats',
  'algemene begraafplaats',
  'gemeentelijke begraafplaats',
  'ambtsbegraafplaats',
];

// Special handling for crematoriums
const crematoriumKeywords = [
  'crematorium',
  'crematie',
];

// Shared utility functions
function createSlug(name: string, city: string): string {
  const combined = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return combined;
}

function isCemetery(name: string, includeCrematoriums: boolean = true): boolean {
  const nameLower = name.toLowerCase();
  
  // First check explicit exclusions
  for (const keyword of excludeKeywords) {
    if (nameLower.includes(keyword)) {
      // Special case: allow if it also contains cemetery keywords
      const hasCemeteryKeyword = cemeteryKeywords.some(ck => nameLower.includes(ck));
      if (!hasCemeteryKeyword) {
        return false;
      }
    }
  }
  
  // Check for funeral service businesses
  for (const keyword of funeralServiceKeywords) {
    if (nameLower.includes(keyword)) {
      // Special exception: DELA crematoriums are actual crematoriums
      if (nameLower.includes('dela') && nameLower.includes('crematorium')) {
        continue;
      }
      return false;
    }
  }
  
  // Check for crematoriums
  const isCrematorium = crematoriumKeywords.some(keyword => nameLower.includes(keyword));
  if (isCrematorium && !includeCrematoriums) {
    return false;
  }
  
  // Check if it has cemetery keywords
  const hasCemeteryKeyword = cemeteryKeywords.some(keyword => nameLower.includes(keyword));
  const hasGenericName = nameLower === 'cemetery' || nameLower === 'kerkhof';
  
  if (hasCemeteryKeyword || hasGenericName || (isCrematorium && includeCrematoriums)) {
    return true;
  }
  
  // If no cemetery keywords found, it's likely not a cemetery
  return false;
}

// Use the dynamic postcode-based province lookup
function getProvince(city: string, postalCode: string): string {
  return getProvinceByPostcode(city, postalCode);
}

// Cemetery-specific functions
function determineCemeteryType(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('rooms') || nameLower.includes('katholiek') || nameLower.includes('r.k.') || nameLower.includes('parochie')) {
    return 'rooms-katholiek';
  }
  if (nameLower.includes('joods') || nameLower.includes('joodse') || nameLower.includes('israel')) {
    return 'joods';
  }
  if (nameLower.includes('islam') || nameLower.includes('moskee') || nameLower.includes('moslim')) {
    return 'islamitisch';
  }
  if (nameLower.includes('natuur')) {
    return 'natuurbegraafplaats';
  }
  if (nameLower.includes('protestant') || nameLower.includes('hervorm') || nameLower.includes('gereform')) {
    return 'protestants';
  }
  
  return 'algemeen';
}

function extractFacilities(accessibility: any, name: string): string {
  const facilities = [];
  
  if (accessibility?.Toegankelijkheid?.['Rolstoeltoegankelijke ingang']) {
    facilities.push('rolstoeltoegankelijk');
  }
  if (accessibility?.Toegankelijkheid?.['Rolstoeltoegankelijke parking']) {
    facilities.push('rolstoeltoegankelijke parking');
  }
  
  // Guess facilities from name
  const nameLower = name.toLowerCase();
  if (nameLower.includes('crematorium')) {
    facilities.push('crematorium');
  }
  if (nameLower.includes('aula')) {
    facilities.push('aula');
  }
  
  return facilities.join(',');
}

function formatOpeningHours(hours: any): string {
  if (!hours) return 'onbekend';
  
  try {
    const hoursObj = typeof hours === 'string' ? JSON.parse(hours) : hours;
    
    // Check if always open
    const days = Object.values(hoursObj);
    if (days.every(day => day === '24 uur geopend')) {
      return 'altijd toegankelijk';
    }
    
    // Check if same hours every day
    const uniqueHours = [...new Set(days)];
    if (uniqueHours.length === 1) {
      return `dagelijks ${uniqueHours[0]}`;
    }
    
    // Return Monday hours as default
    return hoursObj.maandag || 'op afspraak';
  } catch {
    return 'onbekend';
  }
}

// Main processing functions
export async function processCemeteryCSV(inputPath: string): Promise<ProcessedCemetery[]> {
  const records: any[] = [];
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

  console.log('Reading cemetery CSV file...');
  
  for await (const record of parser) {
    if (record.country === 'Netherlands' && isCemetery(record.name)) {
      records.push({
        ...record,
        latitude: parseFloat(record.latitude) || 0,
        longitude: parseFloat(record.longitude) || 0,
        rating: parseFloat(record.rating) || 0,
        review_count: parseInt(record.review_count) || 0,
      });
    }
  }

  console.log(`Found ${records.length} Dutch cemeteries (after filtering non-cemetery entries)`);

  // Process records
  const processedCemeteries: ProcessedCemetery[] = [];
  const unknownCities: Set<string> = new Set();
  const byProvince: Record<string, number> = {};

  for (const record of records) {
    const province = getProvince(record.city, record.postal_code);
    
    if (province === 'Onbekend') {
      unknownCities.add(`${record.city} (${record.postal_code})`);
    }

    byProvince[province] = (byProvince[province] || 0) + 1;

    const processed: ProcessedCemetery = {
      naam_begraafplaats: record.name,
      gemeente: record.city,
      provincie: province,
      type: determineCemeteryType(record.name),
      faciliteiten: extractFacilities(
        record.accessibility ? JSON.parse(record.accessibility) : null,
        record.name
      ),
      gps_coordinaten: `${record.latitude},${record.longitude}`,
      foto_url: record.photo_url || '',
      openingstijden: formatOpeningHours(record.hours),
      historie: '', // Will be generated later
      bijzondere_graven: '',
      links: record.website || record.maps_url || '',
      slug: createSlug(record.name, record.city),
      // Extra fields
      telefoon: record.phone,
      adres: record.full_address,
      beoordeling: record.rating,
      aantal_reviews: record.review_count,
      toegankelijkheid: record.accessibility ? JSON.parse(record.accessibility) : null,
      raw_openingstijden: record.hours ? JSON.parse(record.hours) : null,
    };

    processedCemeteries.push(processed);
  }

  // Log summary
  console.log('\nCemetery Summary:');
  console.log(`Total cemeteries: ${records.length}`);
  console.log('\nBy province:');
  Object.entries(byProvince)
    .sort(([,a], [,b]) => b - a)
    .forEach(([province, count]) => {
      console.log(`  ${province}: ${count}`);
    });
  
  if (unknownCities.size > 0) {
    console.log(`\nUnknown cities: ${unknownCities.size}`);
    console.log('First 10 unknown cities:');
    Array.from(unknownCities).slice(0, 10).forEach(city => {
      console.log(`  '${city}': 'PROVINCIE',`);
    });
  }

  return processedCemeteries;
}

export async function processFuneralCSV(inputPath: string): Promise<ProcessedFuneralHome[]> {
  const records: any[] = [];
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

  console.log('Reading funeral homes CSV file...');
  
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

  // Process records
  const processedFuneralHomes: ProcessedFuneralHome[] = [];
  const unknownCities: Set<string> = new Set();
  const byProvince: Record<string, number> = {};

  for (const record of records) {
    const province = getProvince(record.city, record.postal_code);
    
    if (province === 'Onbekend') {
      unknownCities.add(`${record.city} (${record.postal_code})`);
    }

    byProvince[province] = (byProvince[province] || 0) + 1;

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

    processedFuneralHomes.push(processed);
  }

  // Log summary
  console.log('\nFuneral Homes Summary:');
  console.log(`Total funeral homes: ${records.length}`);
  console.log('\nBy province:');
  Object.entries(byProvince)
    .sort(([,a], [,b]) => b - a)
    .forEach(([province, count]) => {
      console.log(`  ${province}: ${count}`);
    });
  
  if (unknownCities.size > 0) {
    console.log(`\nUnknown cities: ${unknownCities.size}`);
    console.log('First 10 unknown cities:');
    Array.from(unknownCities).slice(0, 10).forEach(city => {
      console.log(`  '${city}': 'PROVINCIE',`);
    });
  }

  return processedFuneralHomes;
}

// Main function to process all data
async function processAllData() {
  const args = process.argv.slice(2);
  const dataType = args[0] || 'all';
  const inputPath = args[1];

  try {
    switch (dataType) {
      case 'cemetery':
        if (!inputPath) {
          console.error('Please provide input path for cemetery CSV');
          process.exit(1);
        }
        const cemeteries = await processCemeteryCSV(inputPath);
        
        // Save cemetery data
        const cemeteryOutputPath = path.join(process.cwd(), 'data', 'cemeteries-processed.json');
        await fs.writeFile(cemeteryOutputPath, JSON.stringify(cemeteries, null, 2), 'utf-8');
        console.log(`\nSaved ${cemeteries.length} cemeteries to ${cemeteryOutputPath}`);
        break;

      case 'funeral':
        if (!inputPath) {
          console.error('Please provide input path for funeral homes CSV');
          process.exit(1);
        }
        const funeralHomes = await processFuneralCSV(inputPath);
        
        // Save funeral home data
        const funeralOutputPath = path.join(process.cwd(), 'data', 'funeral-homes-processed.json');
        await fs.writeFile(funeralOutputPath, JSON.stringify(funeralHomes, null, 2), 'utf-8');
        console.log(`\nSaved ${funeralHomes.length} funeral homes to ${funeralOutputPath}`);
        break;

      case 'all':
        console.log('Processing all data types...');
        console.log('Please run with specific type: cemetery or funeral');
        console.log('Usage: tsx scripts/process-all-data.ts [cemetery|funeral] <input-csv-path>');
        break;

      default:
        console.error(`Unknown data type: ${dataType}`);
        console.log('Usage: tsx scripts/process-all-data.ts [cemetery|funeral] <input-csv-path>');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error processing data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  processAllData();
}