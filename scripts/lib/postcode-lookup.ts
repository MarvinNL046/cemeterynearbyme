/**
 * Postcode Lookup Library
 *
 * Provides gemeente/provincie lookup from Dutch postcodes using multiple strategies:
 * 1. Local cache from our own cemetery data
 * 2. PDOK API (free Dutch government data)
 * 3. Fallback to plaats name matching
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CACHE_FILE = path.join(DATA_DIR, 'postcode-cache.json');
const GEMEENTE_MAPPING_FILE = path.join(DATA_DIR, 'gemeente-mapping.json');

interface LocationInfo {
  gemeente: string;
  provincie: string;
  plaats?: string;
  source: 'cache' | 'pdok' | 'gemeente-mapping' | 'fallback';
}

interface PostcodeCache {
  [postcode4: string]: {
    gemeente: string;
    provincie: string;
    plaats?: string;
    updated_at: string;
  };
}

// Province name normalization
const PROVINCE_MAPPING: Record<string, string> = {
  'noord-holland': 'Noord-Holland',
  'zuid-holland': 'Zuid-Holland',
  'noord-brabant': 'Noord-Brabant',
  'limburg': 'Limburg',
  'gelderland': 'Gelderland',
  'overijssel': 'Overijssel',
  'flevoland': 'Flevoland',
  'utrecht': 'Utrecht',
  'drenthe': 'Drenthe',
  'groningen': 'Groningen',
  'friesland': 'Friesland',
  'fryslân': 'Friesland',
  'fryslan': 'Friesland',
  'zeeland': 'Zeeland',
};

function normalizeProvince(province: string): string {
  return PROVINCE_MAPPING[province.toLowerCase()] || province;
}

// Load cache
let postcodeCache: PostcodeCache = {};
try {
  if (fs.existsSync(CACHE_FILE)) {
    postcodeCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load postcode cache:', e);
}

// Load gemeente mapping
let gemeenteMapping: Record<string, { gemeente: string; provincie: string }> = {};
try {
  if (fs.existsSync(GEMEENTE_MAPPING_FILE)) {
    gemeenteMapping = JSON.parse(fs.readFileSync(GEMEENTE_MAPPING_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load gemeente mapping:', e);
}

/**
 * Save the postcode cache to disk
 */
export function saveCache(): void {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(postcodeCache, null, 2));
}

/**
 * Build postcode cache from our cemetery data
 */
export function buildCacheFromCemeteryData(): void {
  const cemeteriesFile = path.join(DATA_DIR, 'begraafplaatsen.json');
  if (!fs.existsSync(cemeteriesFile)) return;

  const cemeteries = JSON.parse(fs.readFileSync(cemeteriesFile, 'utf-8'));
  let added = 0;

  for (const c of cemeteries) {
    if (c.postcode && c.gemeente && c.provincie) {
      const pc4 = c.postcode.replace(/\s/g, '').substring(0, 4);
      if (/^\d{4}$/.test(pc4) && !postcodeCache[pc4]) {
        postcodeCache[pc4] = {
          gemeente: c.gemeente,
          provincie: normalizeProvince(c.provincie),
          plaats: c.plaats,
          updated_at: new Date().toISOString(),
        };
        added++;
      }
    }
  }

  if (added > 0) {
    saveCache();
    console.log(`Added ${added} postcodes to cache from cemetery data`);
  }
}

/**
 * Lookup location info from PDOK API
 */
async function lookupFromPDOK(postcode: string): Promise<LocationInfo | null> {
  const pc4 = postcode.replace(/\s/g, '').substring(0, 4);

  try {
    // PDOK Locatieserver - free Dutch government geocoding API
    const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=postcode:${pc4}&rows=1&fl=gemeentenaam,provincienaam,woonplaatsnaam`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.response?.docs?.[0]) {
      const doc = data.response.docs[0];
      const gemeente = doc.gemeentenaam;
      const provincie = normalizeProvince(doc.provincienaam || '');
      const plaats = doc.woonplaatsnaam;

      if (gemeente && provincie) {
        // Cache the result
        postcodeCache[pc4] = {
          gemeente,
          provincie,
          plaats,
          updated_at: new Date().toISOString(),
        };
        saveCache();

        return {
          gemeente,
          provincie,
          plaats,
          source: 'pdok',
        };
      }
    }
  } catch (e) {
    console.warn(`PDOK lookup failed for ${pc4}:`, e);
  }

  return null;
}

/**
 * Lookup location info from plaats name via gemeente mapping
 */
function lookupFromPlaatsName(plaats: string): LocationInfo | null {
  if (!plaats) return null;

  // Try exact match
  const mapping = gemeenteMapping[plaats];
  if (mapping) {
    return {
      gemeente: mapping.gemeente,
      provincie: normalizeProvince(mapping.provincie),
      plaats,
      source: 'gemeente-mapping',
    };
  }

  // Try case-insensitive match
  const plaatsLower = plaats.toLowerCase();
  for (const [key, value] of Object.entries(gemeenteMapping)) {
    if (key.toLowerCase() === plaatsLower) {
      return {
        gemeente: value.gemeente,
        provincie: normalizeProvince(value.provincie),
        plaats: key,
        source: 'gemeente-mapping',
      };
    }
  }

  return null;
}

/**
 * Extract plaats name from Google address string
 */
export function extractPlaatsFromAddress(address: string): string | null {
  if (!address) return null;

  // Pattern: "Street 123, 1234 AB Plaatsnaam, Nederland"
  const match = address.match(/\d{4}\s*[A-Z]{2}\s+([^,]+)/i);
  if (match) {
    return match[1].trim();
  }

  // Pattern: just "Plaatsnaam, Nederland" at the end
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    const beforeLast = parts[parts.length - 2];
    // Remove postcode if present
    const cleaned = beforeLast.replace(/\d{4}\s*[A-Z]{2}\s*/i, '').trim();
    if (cleaned && !cleaned.match(/^\d/)) {
      return cleaned;
    }
  }

  return null;
}

/**
 * Extract postcode from Google address string
 */
export function extractPostcodeFromAddress(address: string): string | null {
  if (!address) return null;

  const match = address.match(/(\d{4})\s*([A-Z]{2})/i);
  if (match) {
    return `${match[1]} ${match[2].toUpperCase()}`;
  }

  return null;
}

/**
 * Main lookup function - tries multiple strategies
 */
export async function lookupLocation(
  postcode?: string,
  plaats?: string,
  address?: string
): Promise<LocationInfo | null> {
  // Extract from address if not provided
  if (!postcode && address) {
    postcode = extractPostcodeFromAddress(address) || undefined;
  }
  if (!plaats && address) {
    plaats = extractPlaatsFromAddress(address) || undefined;
  }

  // Strategy 1: Check cache by postcode
  if (postcode) {
    const pc4 = postcode.replace(/\s/g, '').substring(0, 4);
    if (postcodeCache[pc4]) {
      return {
        ...postcodeCache[pc4],
        source: 'cache',
      };
    }
  }

  // Strategy 2: Try PDOK API
  if (postcode) {
    const pdokResult = await lookupFromPDOK(postcode);
    if (pdokResult) {
      return pdokResult;
    }
  }

  // Strategy 3: Try gemeente mapping by plaats name
  if (plaats) {
    const mappingResult = lookupFromPlaatsName(plaats);
    if (mappingResult) {
      return mappingResult;
    }
  }

  return null;
}

/**
 * Batch lookup for multiple locations
 */
export async function lookupLocations(
  items: Array<{ postcode?: string; plaats?: string; address?: string }>
): Promise<Map<number, LocationInfo | null>> {
  const results = new Map<number, LocationInfo | null>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const result = await lookupLocation(item.postcode, item.plaats, item.address);
    results.set(i, result);

    // Small delay to be nice to PDOK API
    if (i < items.length - 1) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return results;
}

// Build cache on first import
buildCacheFromCemeteryData();
