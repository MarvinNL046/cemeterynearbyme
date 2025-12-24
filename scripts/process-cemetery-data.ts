import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

interface RawCemetery {
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

// Special handling for crematoriums (can be included or excluded based on preference)
const crematoriumKeywords = [
  'crematorium',
  'crematie',
];

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
  // Extra fields from new data
  telefoon?: string;
  adres?: string;
  beoordeling?: number;
  aantal_reviews?: number;
  toegankelijkheid?: any;
  raw_openingstijden?: any;
}

// Map cities to provinces (uitgebreide lijst)
const cityToProvince: Record<string, string> = {
  // Groningen
  'Groningen': 'Groningen',
  'Hoogezand': 'Groningen',
  'Veendam': 'Groningen',
  'Winschoten': 'Groningen',
  'Delfzijl': 'Groningen',
  'Stadskanaal': 'Groningen',
  'Appingedam': 'Groningen',
  
  // Friesland
  'Leeuwarden': 'Friesland',
  'Sneek': 'Friesland',
  'Heerenveen': 'Friesland',
  'Drachten': 'Friesland',
  'Harlingen': 'Friesland',
  'Joure': 'Friesland',
  'Franeker': 'Friesland',
  
  // Drenthe
  'Assen': 'Drenthe',
  'Emmen': 'Drenthe',
  'Hoogeveen': 'Drenthe',
  'Meppel': 'Drenthe',
  'Coevorden': 'Drenthe',
  'Roden': 'Drenthe',
  
  // Overijssel
  'Zwolle': 'Overijssel',
  'Enschede': 'Overijssel',
  'Deventer': 'Overijssel',
  'Almelo': 'Overijssel',
  'Hengelo': 'Overijssel',
  'Kampen': 'Overijssel',
  'Steenwijk': 'Overijssel',
  
  // Gelderland
  'Arnhem': 'Gelderland',
  'Nijmegen': 'Gelderland',
  'Apeldoorn': 'Gelderland',
  'Ede': 'Gelderland',
  'Doetinchem': 'Gelderland',
  'Zutphen': 'Gelderland',
  'Tiel': 'Gelderland',
  'Wageningen': 'Gelderland',
  'Harderwijk': 'Gelderland',
  
  // Utrecht
  'Utrecht': 'Utrecht',
  'Amersfoort': 'Utrecht',
  'Veenendaal': 'Utrecht',
  'Zeist': 'Utrecht',
  'Nieuwegein': 'Utrecht',
  'Houten': 'Utrecht',
  'Leusden': 'Utrecht',
  'Woerden': 'Utrecht',
  
  // Noord-Holland
  'Amsterdam': 'Noord-Holland',
  'Haarlem': 'Noord-Holland',
  'Zaandam': 'Noord-Holland',
  'Hoofddorp': 'Noord-Holland',
  'Alkmaar': 'Noord-Holland',
  'Hilversum': 'Noord-Holland',
  'Amstelveen': 'Noord-Holland',
  'Purmerend': 'Noord-Holland',
  'Hoorn': 'Noord-Holland',
  'Velsen': 'Noord-Holland',
  'Den Helder': 'Noord-Holland',
  'Beverwijk': 'Noord-Holland',
  'Heerhugowaard': 'Noord-Holland',
  'Bussum': 'Noord-Holland',
  'Schagen': 'Noord-Holland',
  
  // Zuid-Holland
  'Rotterdam': 'Zuid-Holland',
  'Den Haag': 'Zuid-Holland',
  "'s-Gravenhage": 'Zuid-Holland',
  'Dordrecht': 'Zuid-Holland',
  'Leiden': 'Zuid-Holland',
  'Zoetermeer': 'Zuid-Holland',
  'Delft': 'Zuid-Holland',
  'Alphen aan den Rijn': 'Zuid-Holland',
  'Westland': 'Zuid-Holland',
  'Schiedam': 'Zuid-Holland',
  'Spijkenisse': 'Zuid-Holland',
  'Vlaardingen': 'Zuid-Holland',
  'Gouda': 'Zuid-Holland',
  'Capelle aan den IJssel': 'Zuid-Holland',
  'Rijswijk': 'Zuid-Holland',
  'Leidschendam': 'Zuid-Holland',
  'Voorburg': 'Zuid-Holland',
  'Hellevoetsluis': 'Zuid-Holland',
  
  // Zeeland
  'Middelburg': 'Zeeland',
  'Vlissingen': 'Zeeland',
  'Goes': 'Zeeland',
  'Terneuzen': 'Zeeland',
  'Hulst': 'Zeeland',
  'Sluis': 'Zeeland',
  'Tholen': 'Zeeland',
  
  // Noord-Brabant
  'Eindhoven': 'Noord-Brabant',
  'Tilburg': 'Noord-Brabant',
  'Breda': 'Noord-Brabant',
  "'s-Hertogenbosch": 'Noord-Brabant',
  'Den Bosch': 'Noord-Brabant',
  'Helmond': 'Noord-Brabant',
  'Oss': 'Noord-Brabant',
  'Roosendaal': 'Noord-Brabant',
  'Bergen op Zoom': 'Noord-Brabant',
  'Waalwijk': 'Noord-Brabant',
  'Oosterhout': 'Noord-Brabant',
  'Veghel': 'Noord-Brabant',
  'Uden': 'Noord-Brabant',
  'Veldhoven': 'Noord-Brabant',
  'Valkenswaard': 'Noord-Brabant',
  
  // Limburg
  'Maastricht': 'Limburg',
  'Venlo': 'Limburg',
  'Heerlen': 'Limburg',
  'Sittard': 'Limburg',
  'Roermond': 'Limburg',
  'Weert': 'Limburg',
  'Kerkrade': 'Limburg',
  'Geleen': 'Limburg',
  'Brunssum': 'Limburg',
  'Landgraaf': 'Limburg',
  
  // Flevoland
  'Almere': 'Flevoland',
  'Lelystad': 'Flevoland',
  'Emmeloord': 'Flevoland',
  'Dronten': 'Flevoland',
  'Zeewolde': 'Flevoland',
  'Urk': 'Flevoland',
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
  
  console.log(`Unknown city: ${city}`);
  return 'Onbekend';
}

function determineType(name: string): string {
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

async function processCSV(inputPath: string) {
  const records: RawCemetery[] = [];
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
    const province = getProvince(record.city);
    
    if (province === 'Onbekend') {
      unknownCities.add(record.city);
    }

    byProvince[province] = (byProvince[province] || 0) + 1;

    const processed: ProcessedCemetery = {
      naam_begraafplaats: record.name,
      gemeente: record.city,
      provincie: province,
      type: determineType(record.name),
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

  // Save as new cemeteries.csv
  const csvHeader = 'naam_begraafplaats,gemeente,provincie,type,faciliteiten,gps_coordinaten,foto_url,openingstijden,historie,bijzondere_graven,links\n';
  
  const csvContent = csvHeader + processedCemeteries.map(c => 
    `"${c.naam_begraafplaats}","${c.gemeente}","${c.provincie}","${c.type}","${c.faciliteiten}","${c.gps_coordinaten}","${c.foto_url}","${c.openingstijden}","${c.historie}","${c.bijzondere_graven}","${c.links}"`
  ).join('\n');

  const outputPath = path.join(process.cwd(), 'data', 'cemeteries-full.csv');
  await fs.writeFile(outputPath, csvContent, 'utf-8');

  // Save JSON version with all data
  const jsonPath = path.join(process.cwd(), 'data', 'cemeteries-full.json');
  await fs.writeFile(jsonPath, JSON.stringify(processedCemeteries, null, 2), 'utf-8');

  console.log('\nSummary:');
  console.log(`Total cemeteries: ${records.length}`);
  console.log('\nBy province:');
  Object.entries(byProvince)
    .sort(([,a], [,b]) => b - a)
    .forEach(([province, count]) => {
      console.log(`  ${province}: ${count}`);
    });
  
  console.log(`\nUnknown cities: ${unknownCities.size}`);
  if (unknownCities.size > 0) {
    console.log('First 20 unknown cities:');
    Array.from(unknownCities).slice(0, 20).forEach(city => {
      console.log(`  '${city}': 'PROVINCIE',`);
    });
  }

  console.log(`\nFiles created:`);
  console.log(`  - ${outputPath} (CSV format)`);
  console.log(`  - ${jsonPath} (JSON format with extra data)`);
}

// Run the script
const inputPath = process.argv[2] || path.join(process.cwd(), 'data', 'begraafplaats.csv');

processCSV(inputPath)
  .then(() => console.log('\nDone!'))
  .catch(console.error);