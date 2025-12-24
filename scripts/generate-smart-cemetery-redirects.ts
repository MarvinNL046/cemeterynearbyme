import fs from 'fs';
import path from 'path';

interface Cemetery {
  slug: string;
  naam_begraafplaats: string;
  plaats?: string;
  gemeente: string;
  type?: string;
  [key: string]: unknown;
}

interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Extract place name from old-style slug
function extractPlaceFromSlug(slug: string): string | null {
  // Remove common prefixes
  const prefixes = [
    'algemene-begraafplaats-',
    'begraafplaats-',
    'cemetery-',
    'kerkhof-',
    'joodse-begraafplaats-',
    'rk-begraafplaats-',
    'rooms-katholieke-begraafplaats-',
    'nh-begraafplaats-',
    'nh-kerkhof-',
    'oude-begraafplaats-',
    'nieuwe-begraafplaats-',
    'gemeentelijke-begraafplaats-',
    'natuurbegraafplaats-',
    'dierenbegraafplaats-',
  ];

  let remaining = slug;
  for (const prefix of prefixes) {
    if (slug.startsWith(prefix)) {
      remaining = slug.slice(prefix.length);
      break;
    }
  }

  // If the remaining part has double place name (e.g., "terborg-terborg"), get first part
  const parts = remaining.split('-');
  if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
    return parts[parts.length - 1];
  }

  // Otherwise return the last part (usually the place)
  return parts[parts.length - 1] || null;
}

// Find best matching cemetery for an old slug
function findBestMatch(oldSlug: string, cemeteries: Cemetery[]): Cemetery | null {
  const place = extractPlaceFromSlug(oldSlug);
  if (!place) return null;

  // Find all cemeteries that end with this place name
  const matches = cemeteries.filter(c => c.slug.endsWith('-' + place) || c.slug.endsWith(place));

  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];

  // If multiple matches, try to find one with similar type
  const typeMatch = matches.find(c => {
    if (oldSlug.includes('joodse') && c.slug.includes('joods')) return true;
    if (oldSlug.includes('rk-') && c.slug.includes('rk-')) return true;
    if (oldSlug.includes('nh-') && c.slug.includes('nh-')) return true;
    if (oldSlug.includes('algemene') && c.slug.includes('algemene')) return true;
    if (oldSlug.includes('natuur') && c.slug.includes('natuur')) return true;
    return false;
  });

  return typeMatch || matches[0];
}

async function generateSmartRedirects() {
  const data: Cemetery[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/cemeteries.json'), 'utf8')
  );

  // Known old slugs that don't exist anymore (from Google Search Console)
  const knownOldSlugs = [
    // From user's examples
    'begraafplaats-steenbrugge-deventer-deventer',
    'joodse-begraafplaats-terborg-terborg',
    'begraafplaats-de-kim-westerbork',
    'begraafplaats-markstraat-opheusden',
    'dierenbegraafplaats-den-haag',
    'algemene-begraafplaats-kloetinge-kloetinge',
    'oude-begraafplaats-meester-nijhoffstraat-heerde',
    'wierdebegraafplaats-groningen',
    'rk-begraafplaats-foxham-hoogezand',
    'begraafplaats-wierum-adorp',
    'begraafplaats-landsmeer-landsmeer',
    'rooms-katholieke-begraafplaats-wijk-bij-duurstede',
    'de-oude-begraafplaats-purmerend-purmerend',
    'rk-begraafplaats-h-trudo-zundert-zundert',
    'cemetery-nieuw-beerta',
    'french-military-cemetery-kapelle-kapelle',
    'begraafplaats-angerlo',
    'cemetery-wildervank',
    'cemetery-spankeren',
    'algemene-begraafplaats-oudenbosch-oudenbosch',
    'algemene-begraafplaats-kockengen-kockengen',
    'begraafplaats-veldhoven',
  ];

  const existingSlugs = new Set(data.map(c => c.slug));
  const redirects: Redirect[] = [];

  // Process known old slugs
  for (const oldSlug of knownOldSlugs) {
    if (existingSlugs.has(oldSlug)) continue; // Skip if it exists

    const match = findBestMatch(oldSlug, data);
    if (match) {
      redirects.push({
        source: `/begraafplaats/${oldSlug}`,
        destination: `/begraafplaats/${match.slug}`,
        permanent: true,
      });
    }
  }

  // Generate redirects for common patterns (double place names)
  const plaatsen = [...new Set(data.filter(c => c.plaats).map(c => createSlug(c.plaats!)))];

  for (const plaats of plaatsen) {
    const prefixes = ['algemene-begraafplaats-', 'begraafplaats-', 'oude-begraafplaats-', 'nieuwe-begraafplaats-', 'de-oude-begraafplaats-'];

    for (const prefix of prefixes) {
      // Pattern: prefix + plaats + plaats (e.g., algemene-begraafplaats-purmerend-purmerend)
      const oldSlug = `${prefix}${plaats}-${plaats}`;

      if (!existingSlugs.has(oldSlug)) {
        const match = findBestMatch(oldSlug, data);
        if (match && match.slug !== oldSlug) {
          redirects.push({
            source: `/begraafplaats/${oldSlug}`,
            destination: `/begraafplaats/${match.slug}`,
            permanent: true,
          });
        }
      }
    }
  }

  // Remove duplicates and filter out redirects where source equals destination
  const uniqueRedirects = [...new Map(redirects.map(r => [r.source, r])).values()]
    .filter(r => r.source !== r.destination);

  console.log('Smart cemetery redirects generated:', uniqueRedirects.length);
  console.log('\nExamples:');
  uniqueRedirects.slice(0, 30).forEach(r => {
    console.log(`${r.source} => ${r.destination}`);
  });

  // Load existing redirects and merge
  const existingRedirects: Redirect[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/cemetery-redirects.json'), 'utf8')
  );

  // Merge and deduplicate
  const allRedirects = [...existingRedirects];
  const existingSources = new Set(existingRedirects.map(r => r.source));

  for (const redirect of uniqueRedirects) {
    if (!existingSources.has(redirect.source)) {
      allRedirects.push(redirect);
    }
  }

  console.log('\nTotal redirects after merge:', allRedirects.length);

  // Save
  fs.writeFileSync(
    path.join(process.cwd(), 'data/cemetery-redirects.json'),
    JSON.stringify(allRedirects, null, 2)
  );
  console.log('Saved to data/cemetery-redirects.json');
}

generateSmartRedirects().catch(console.error);
