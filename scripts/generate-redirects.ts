import fs from 'fs';
import path from 'path';

interface GemeenteMapping {
  [plaatsnaam: string]: {
    gemeente: string;
    provincie: string;
  };
}

interface Cemetery {
  gemeente: string;
  plaats?: string;
  [key: string]: unknown;
}

interface Redirect {
  from: string;
  to: string;
  plaats: string;
  gemeente: string;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateRedirects() {
  const mapping: GemeenteMapping = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/gemeente-mapping.json'), 'utf8')
  );

  const data: Cemetery[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/cemeteries.json'), 'utf8')
  );

  // Get all current gemeente slugs (from actual gemeente field)
  const currentGemeentes = [...new Set(data.map(c => c.gemeente).filter(Boolean))];
  const currentGemeenteSlugs = new Set(currentGemeentes.map(g => createSlug(g)));

  // Get all plaats names from mapping
  const plaatsnamen = Object.keys(mapping);

  // Find plaatsnamen whose slug doesn't match any current gemeente slug
  const redirectsNeeded: Redirect[] = [];

  for (const plaats of plaatsnamen) {
    const plaatsSlug = createSlug(plaats);
    const correctGemeente = mapping[plaats].gemeente;
    const correctGemeenteSlug = createSlug(correctGemeente);

    // Only add redirect if plaats slug doesn't exist as gemeente and is different from correct gemeente
    if (!currentGemeenteSlugs.has(plaatsSlug) && plaatsSlug !== correctGemeenteSlug) {
      redirectsNeeded.push({
        from: plaatsSlug,
        to: correctGemeenteSlug,
        plaats: plaats,
        gemeente: correctGemeente
      });
    }
  }

  console.log('Redirects needed:', redirectsNeeded.length);
  console.log('\nFirst 30 examples:');
  redirectsNeeded.slice(0, 30).forEach(r => {
    console.log(`/gemeente/${r.from} => /gemeente/${r.to} (${r.plaats} -> ${r.gemeente})`);
  });

  // Save to file for redirect generation
  fs.writeFileSync(
    path.join(process.cwd(), 'data/gemeente-redirects.json'),
    JSON.stringify(redirectsNeeded, null, 2)
  );
  console.log('\nSaved to data/gemeente-redirects.json');

  // Generate Next.js redirect config
  const nextRedirects = redirectsNeeded.map(r => ({
    source: `/gemeente/${r.from}`,
    destination: `/gemeente/${r.to}`,
    permanent: true,
  }));

  console.log('\n\nNext.js redirect config (first 20):');
  console.log(JSON.stringify(nextRedirects.slice(0, 20), null, 2));

  // Save Next.js format
  fs.writeFileSync(
    path.join(process.cwd(), 'data/nextjs-gemeente-redirects.json'),
    JSON.stringify(nextRedirects, null, 2)
  );
  console.log('\nSaved Next.js format to data/nextjs-gemeente-redirects.json');
}

generateRedirects().catch(console.error);
