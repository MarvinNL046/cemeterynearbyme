import fs from 'fs';
import path from 'path';

interface Cemetery {
  slug: string;
  naam_begraafplaats: string;
  plaats?: string;
  gemeente: string;
  [key: string]: unknown;
}

interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

// Common old slug prefixes that might have been used
const OLD_PREFIXES = [
  'cemetery-',
  'begraafplaats-',
  'kerkhof-',
  'graveyard-',
];

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateCemeteryRedirects() {
  const data: Cemetery[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/cemeteries.json'), 'utf8')
  );

  // Create a map of all existing slugs
  const existingSlugs = new Set(data.map(c => c.slug));

  // Create a map of plaats -> cemeteries
  const plaatsMap = new Map<string, Cemetery[]>();
  for (const cem of data) {
    if (cem.plaats) {
      const plaatsSlug = createSlug(cem.plaats);
      if (!plaatsMap.has(plaatsSlug)) {
        plaatsMap.set(plaatsSlug, []);
      }
      plaatsMap.get(plaatsSlug)!.push(cem);
    }
  }

  const redirects: Redirect[] = [];

  // Generate potential old slugs and map them to new slugs
  for (const [plaatsSlug, cemeteries] of plaatsMap.entries()) {
    // Skip if only one cemetery in this place - no disambiguation needed
    const mainCemetery = cemeteries[0];

    // Generate potential old slug patterns
    for (const prefix of OLD_PREFIXES) {
      const oldSlug = `${prefix}${plaatsSlug}`;

      // Only add redirect if:
      // 1. Old slug doesn't exist as a current slug
      // 2. There's a cemetery to redirect to
      if (!existingSlugs.has(oldSlug) && mainCemetery) {
        redirects.push({
          source: `/begraafplaats/${oldSlug}`,
          destination: `/begraafplaats/${mainCemetery.slug}`,
          permanent: true,
        });
      }

      // Also try with plaats-plaats pattern (e.g., oudenbosch-oudenbosch)
      const doubleSlug = `${prefix}${plaatsSlug}-${plaatsSlug}`;
      if (!existingSlugs.has(doubleSlug) && mainCemetery) {
        redirects.push({
          source: `/begraafplaats/${doubleSlug}`,
          destination: `/begraafplaats/${mainCemetery.slug}`,
          permanent: true,
        });
      }

      // Also try algemene-begraafplaats prefix with double plaats
      const algDoubleSlug = `algemene-begraafplaats-${plaatsSlug}-${plaatsSlug}`;
      if (!existingSlugs.has(algDoubleSlug) && mainCemetery) {
        redirects.push({
          source: `/begraafplaats/${algDoubleSlug}`,
          destination: `/begraafplaats/${mainCemetery.slug}`,
          permanent: true,
        });
      }
    }
  }

  // Remove duplicates
  const uniqueRedirects = [...new Map(redirects.map(r => [r.source, r])).values()];

  console.log('Cemetery redirects generated:', uniqueRedirects.length);
  console.log('\nFirst 20 examples:');
  uniqueRedirects.slice(0, 20).forEach(r => {
    console.log(`${r.source} => ${r.destination}`);
  });

  // Save to file
  fs.writeFileSync(
    path.join(process.cwd(), 'data/cemetery-redirects.json'),
    JSON.stringify(uniqueRedirects, null, 2)
  );
  console.log('\nSaved to data/cemetery-redirects.json');

  return uniqueRedirects;
}

generateCemeteryRedirects().catch(console.error);
