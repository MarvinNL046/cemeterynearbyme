import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

interface RawEntry {
  name: string;
  website: string;
  phone: string;
  full_address: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  rating: string;
  review_count: string;
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
  'mts swinkels vd kerkhof', // business name
  
  // Other businesses
  'bv', // company indicator
  'b.v.',
  'winkel',
  'shop',
  'hotel',
  'restaurant',
  'cafe',
  'café',
  'grafsteenwinkel', // gravestone shop
  
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

function isCemetery(entry: RawEntry, includeCrematoriums: boolean = true): boolean {
  const nameLower = entry.name.toLowerCase();
  
  // First check explicit exclusions
  for (const keyword of excludeKeywords) {
    if (nameLower.includes(keyword)) {
      console.log(`Excluding (business keyword): ${entry.name}`);
      return false;
    }
  }
  
  // Check for funeral service businesses
  for (const keyword of funeralServiceKeywords) {
    if (nameLower.includes(keyword)) {
      // Special exception: DELA crematoriums are actual crematoriums
      if (nameLower.includes('dela') && nameLower.includes('crematorium')) {
        continue;
      }
      console.log(`Excluding (funeral service): ${entry.name}`);
      return false;
    }
  }
  
  // Check for crematoriums
  const isCrematorium = crematoriumKeywords.some(keyword => nameLower.includes(keyword));
  if (isCrematorium && !includeCrematoriums) {
    console.log(`Excluding (crematorium): ${entry.name}`);
    return false;
  }
  
  // Check if it has cemetery keywords
  const hasCemeteryKeyword = cemeteryKeywords.some(keyword => nameLower.includes(keyword));
  const hasGenericName = nameLower === 'cemetery' || nameLower === 'kerkhof';
  
  if (hasCemeteryKeyword || hasGenericName || (isCrematorium && includeCrematoriums)) {
    return true;
  }
  
  // If no cemetery keywords found, it's likely not a cemetery
  console.log(`Excluding (no cemetery keywords): ${entry.name}`);
  return false;
}

async function filterCemeteries(inputPath: string, outputPath: string, includeCrematoriums: boolean = true) {
  const records: RawEntry[] = [];
  const parser = createReadStream(inputPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  console.log('Reading CSV file...');
  
  for await (const record of parser) {
    records.push(record);
  }

  console.log(`Total entries: ${records.length}`);
  
  // Filter to only real cemeteries
  const cemeteries = records.filter(record => isCemetery(record, includeCrematoriums));
  
  console.log(`\nFiltered results:`);
  console.log(`- Original entries: ${records.length}`);
  console.log(`- Actual cemeteries: ${cemeteries.length}`);
  console.log(`- Removed entries: ${records.length - cemeteries.length}`);
  
  // Create CSV content
  const headers = Object.keys(records[0]);
  const csvContent = [
    headers.join(','),
    ...cemeteries.map(cemetery => 
      headers.map(header => {
        const value = cemetery[header as keyof RawEntry] || '';
        // Escape quotes and wrap in quotes if contains comma or quotes
        const escaped = value.toString().replace(/"/g, '""');
        return /[,"\n]/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');
  
  // Write filtered data
  await fs.writeFile(outputPath, csvContent, 'utf-8');
  console.log(`\nFiltered data saved to: ${outputPath}`);
  
  // Return statistics
  return {
    total: records.length,
    filtered: cemeteries.length,
    removed: records.length - cemeteries.length,
    removedEntries: records.filter(r => !isCemetery(r, includeCrematoriums)).map(r => r.name)
  };
}

// Run the script
async function main() {
  const inputPath = path.join(process.cwd(), 'data', 'begraafplaats.csv');
  const outputPath = path.join(process.cwd(), 'data', 'begraafplaats-filtered.csv');
  
  // You can set this to false if you want to exclude crematoriums
  const includeCrematoriums = true;
  
  try {
    const stats = await filterCemeteries(inputPath, outputPath, includeCrematoriums);
    
    // Save removed entries for review
    const removedPath = path.join(process.cwd(), 'data', 'removed-entries.json');
    await fs.writeFile(removedPath, JSON.stringify(stats.removedEntries, null, 2), 'utf-8');
    
    console.log(`\nRemoved entries saved to: ${removedPath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();