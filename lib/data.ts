import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  faciliteiten?: string;
  gps_coordinaten?: string;
  foto_url?: string;
  openingstijden?: string;
  historie?: string;
  bijzondere_graven?: string;
  links?: string;
  slug: string;
  telefoon?: string;
  email?: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  beoordeling?: number;
  aantal_reviews?: number;
  toegankelijkheid?: Record<string, unknown>;
  raw_openingstijden?: Record<string, string>;
  // Real scraped data fields
  rating?: string;
  reviews?: string;
  photo?: string;
  beschrijving?: string;
  // Embedded Google reviews
  embeddedReviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date: string;
    reviewer_image?: string;
  }>;
  // New fields for cemetery statistics
  oppervlakte?: string;
  aantal_graven?: string;
  aantal_personen?: string;
  status?: string;
  meest_voorkomende_namen?: Array<{naam: string; aantal: number}>;
  jaar_oprichting?: string;
  beheerder?: string;
  website?: string;
  bijzondere_kenmerken?: string;
  // Wikimedia Commons images
  wikimedia_image?: string;
  wikimedia_attribution?: string;
  // OSM enriched data
  osm_id?: string;
  wikipedia_url?: string;
}

export interface GeneratedContent {
  samenvatting: string;
  geschiedenis: string;
  kenmerken: string[];
  toegankelijkheid: string;
  voorzieningen: string[];
  bezoekerstips: string[];
  bijzondereGraven?: string;
  natuurEnOmgeving?: string;
  lokaleContext?: string;
  statistieken?: string;
  provincieInfo?: string;
  typeInfo?: string;
  praktischeInfo?: string;
  bereikbaarheid?: string;
  monumentStatus?: string;
  // Pet cemetery specific fields
  diensten?: string;
  rouwbegeleiding?: string;
  diersoorten?: string;
  herdenkingsmogelijkheden?: string;
}

export interface EnrichedCemeteryData {
  // Scraped website data
  website_url?: string;
  website_content?: string;
  website_scraped_at?: string;
  website_openingstijden?: string;
  website_tarieven?: string;
  website_contact_info?: any;
  
  // Google Maps data
  google_rating?: number;
  google_review_count?: number;
  google_reviews?: any[];
  google_photo?: string;  // Single local photo path from fetch script
  google_photos?: string[];
  google_opening_hours?: any;
  google_phone?: string;
  google_address?: string;
  
  // AI generated content
  generated?: GeneratedContent;
  generated_at?: string;
  generated_by?: string;
  
  // Enrichment metadata
  enriched: boolean;
  enriched_at?: string;
  scraped_at?: string;
  last_updated?: string;
  
  // SEO fields from enriched content
  seoTitle?: string;
  seoDescription?: string;
  enrichedContent?: string;
}

export interface CemeteryWithContent extends Cemetery, EnrichedCemeteryData {}

let cemeteriesCache: Cemetery[] | null = null;

export async function getAllCemeteries(): Promise<Cemetery[]> {
  if (cemeteriesCache) return cemeteriesCache;

  try {
    // In production, try to read from public directory first
    const publicJsonPath = path.join(process.cwd(), 'public', 'data', 'cemeteries.json');
    try {
      const publicJsonContent = await fs.readFile(publicJsonPath, 'utf-8');
      cemeteriesCache = JSON.parse(publicJsonContent) as Cemetery[];
      return cemeteriesCache;
    } catch {
      // Continue to other options
    }

    // Try to use the processed JSON file in data directory
    const jsonPath = path.join(process.cwd(), 'data', 'cemeteries-processed.json');
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');
    cemeteriesCache = JSON.parse(jsonContent) as Cemetery[];
    return cemeteriesCache;
  } catch {
    // Fallback to CSV if JSON doesn't exist
    try {
      console.log('JSON file not found, falling back to CSV');
      const csvPath = path.join(process.cwd(), 'data', 'begraafplaats.csv');
      const csvContent = await fs.readFile(csvPath, 'utf-8');
      
      const records: Cemetery[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      });

      // Add slugs
      cemeteriesCache = records.map(cemetery => ({
        ...cemetery,
        slug: createSlug(cemetery.naam_begraafplaats, cemetery.gemeente),
      }));

      return cemeteriesCache;
    } catch (error) {
      console.error('Error loading cemetery data:', error);
      // Return empty array to prevent crashes in production
      return [];
    }
  }
}

export async function getCemeteryBySlug(slug: string): Promise<CemeteryWithContent | null> {
  try {
    // First try to get enriched data from the main data file
    const cemeteries = await getAllCemeteries() as CemeteryWithContent[];
    const cemetery = cemeteries.find(c => c.slug === slug);
    
    if (cemetery) {
      // Try to load enriched content from JSON file
      try {
        const enrichedPath = path.join(process.cwd(), 'data', 'enriched-content', `${slug}.json`);
        const enrichedContent = await fs.readFile(enrichedPath, 'utf-8');
        const enrichedData = JSON.parse(enrichedContent);
        
        // Transform enriched data to match the expected format
        const generated: GeneratedContent = {
          samenvatting: enrichedData.content.substring(0, 200) + '...',
          geschiedenis: enrichedData.historischeInfo || '',
          kenmerken: enrichedData.highlights || [],
          toegankelijkheid: enrichedData.praktischeInfo?.toegankelijkheid || '',
          voorzieningen: Object.entries(enrichedData.praktischeInfo || {})
            .filter(([key, value]) => value && key !== 'toegankelijkheid')
            .map(([key, value]) => `${key}: ${value}`),
          bezoekerstips: [
            enrichedData.praktischeInfo?.openingstijden && `Openingstijden: ${enrichedData.praktischeInfo.openingstijden}`,
            enrichedData.praktischeInfo?.parkeren && `Parkeren: ${enrichedData.praktischeInfo.parkeren}`,
          ].filter(Boolean),
          bijzondereGraven: enrichedData.bijzonderheden?.join('. ') || '',
          natuurEnOmgeving: '', // Not in enriched format
        };
        
        return {
          ...cemetery,
          enriched: true,
          generated,
          enriched_at: enrichedData.enrichedAt,
          seoTitle: enrichedData.seoTitle,
          seoDescription: enrichedData.seoDescription,
          enrichedContent: enrichedData.content,
          scraped_at: enrichedData.scrapedAt,
          last_updated: enrichedData.enrichedAt
        };
      } catch {
        // No enriched content found, return basic data
        console.log(`No enriched content found for ${slug}`);
      }
      
      // If the cemetery has generated content, return it with enriched flag
      if (cemetery.generated) {
        return {
          ...cemetery,
          enriched: true
        };
      }

      // If not enriched, return basic cemetery data
      return {
        ...cemetery,
        enriched: false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading cemetery data:', error);
    return null;
  }
}

// Get enriched cemeteries only
export async function getEnrichedCemeteries(): Promise<CemeteryWithContent[]> {
  const cemeteries = await getAllCemeteries() as CemeteryWithContent[];
  return cemeteries.filter(c => c.enriched && c.generated);
}

// Get statistics about enriched content
export async function getEnrichmentStats() {
  const cemeteries = await getAllCemeteries() as CemeteryWithContent[];
  const total = cemeteries.length;
  const enriched = cemeteries.filter(c => c.enriched).length;
  const withWebsites = cemeteries.filter(c => c.website_url).length;
  const withReviews = cemeteries.filter(c => c.google_rating).length;
  
  return {
    total,
    enriched,
    withWebsites,
    withReviews,
    enrichmentRate: total > 0 ? (enriched / total) * 100 : 0,
    websiteRate: total > 0 ? (withWebsites / total) * 100 : 0,
    reviewRate: total > 0 ? (withReviews / total) * 100 : 0
  };
}

export async function getCemeteriesByProvince(province: string): Promise<Cemetery[]> {
  const cemeteries = await getAllCemeteries();
  return cemeteries.filter(c => c.provincie && c.provincie.toLowerCase() === province.toLowerCase());
}

export async function getCemeteriesByMunicipality(municipality: string): Promise<Cemetery[]> {
  const cemeteries = await getAllCemeteries();
  return cemeteries.filter(c => c.gemeente && c.gemeente.toLowerCase() === municipality.toLowerCase());
}

export async function getCemeteriesByType(type: string): Promise<Cemetery[]> {
  const cemeteries = await getAllCemeteries();
  return cemeteries.filter(c => c.type && c.type.toLowerCase() === type.toLowerCase());
}

export async function getAllProvinces(): Promise<string[]> {
  try {
    const provinciesPath = path.join(process.cwd(), 'data', 'provincies.json');
    const provinciesContent = await fs.readFile(provinciesPath, 'utf-8');
    const provinciesData = JSON.parse(provinciesContent);
    return Object.keys(provinciesData).map(key => provinciesData[key].naam);
  } catch {
    // Fallback to getting provinces from cemeteries if new structure doesn't exist
    const cemeteries = await getAllCemeteries();
    const provinces = [...new Set(cemeteries.map(c => c.provincie).filter(Boolean))]
      .filter(p => p.toLowerCase() !== 'onbekend'); // Filter out "Onbekend"
    return provinces.sort();
  }
}

export async function getProvincieData(provincieSlug: string) {
  try {
    const provinciesPath = path.join(process.cwd(), 'data', 'provincies.json');
    const provinciesContent = await fs.readFile(provinciesPath, 'utf-8');
    const provinciesData = JSON.parse(provinciesContent);
    return provinciesData[provincieSlug] || null;
  } catch {
    return null;
  }
}

export async function getAllMunicipalities(): Promise<string[]> {
  const cemeteries = await getAllCemeteries();
  const municipalities = [...new Set(cemeteries.map(c => c.gemeente).filter(Boolean))];
  return municipalities.sort();
}

export async function getAllTypes(): Promise<string[]> {
  const cemeteries = await getAllCemeteries();
  const types = [...new Set(cemeteries.map(c => c.type).filter(Boolean))];
  return types.sort();
}

export function createSlug(name: string, gemeente: string): string {
  const combined = `${name}-${gemeente}`
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return combined;
}

// Create municipality slug with proper handling of special characters
export function createMunicipalitySlug(municipality: string): string {
  return municipality
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Create place slug with proper handling of special characters
export function createPlaceSlug(place: string): string {
  return place
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Get all unique places
export async function getAllPlaces(): Promise<string[]> {
  const cemeteries = await getAllCemeteries();
  const places = [...new Set(cemeteries
    .map(c => c.plaats)
    .filter((p): p is string => typeof p === 'string' && p.trim() !== '')
  )];
  return places.sort();
}

// Get cemeteries by place
export async function getCemeteriesByPlace(place: string): Promise<Cemetery[]> {
  const cemeteries = await getAllCemeteries();
  return cemeteries.filter(c => 
    c.plaats && c.plaats.toLowerCase() === place.toLowerCase()
  );
}

// Get municipality for a place
export async function getMunicipalityByPlace(place: string): Promise<string | null> {
  const cemeteries = await getAllCemeteries();
  const cemetery = cemeteries.find(c => 
    c.plaats && c.plaats.toLowerCase() === place.toLowerCase()
  );
  return cemetery ? cemetery.gemeente : null;
}

// Get province for a place
export async function getProvinceByPlace(place: string): Promise<string | null> {
  const cemeteries = await getAllCemeteries();
  const cemetery = cemeteries.find(c => 
    c.plaats && c.plaats.toLowerCase() === place.toLowerCase()
  );
  return cemetery ? cemetery.provincie : null;
}

// Get all unique places within a municipality
export async function getPlacesByMunicipality(municipality: string): Promise<string[]> {
  const cemeteries = await getCemeteriesByMunicipality(municipality);
  const places = [...new Set(cemeteries
    .map(c => c.plaats)
    .filter((p): p is string => typeof p === 'string' && p.trim() !== '')
  )];
  return places.sort();
}

// ===== OFFICIAL CBS GEMEENTE MAPPING =====
// Uses PDOK Locatieserver data to map plaatsnamen to official CBS gemeentes

interface GemeenteMapping {
  [plaatsnaam: string]: {
    gemeente: string;
    provincie: string;
  };
}

let gemeenteMappingCache: GemeenteMapping | null = null;

// Load gemeente mapping from JSON file
async function loadGemeenteMapping(): Promise<GemeenteMapping> {
  if (gemeenteMappingCache) return gemeenteMappingCache;

  try {
    const mappingPath = path.join(process.cwd(), 'data', 'gemeente-mapping.json');
    const mappingContent = await fs.readFile(mappingPath, 'utf-8');
    gemeenteMappingCache = JSON.parse(mappingContent) as GemeenteMapping;
    return gemeenteMappingCache;
  } catch (error) {
    console.error('Error loading gemeente mapping:', error);
    return {};
  }
}

// Get official CBS gemeente for a plaatsnaam
export async function getOfficialGemeente(plaatsnaam: string): Promise<{ gemeente: string; provincie: string } | null> {
  const mapping = await loadGemeenteMapping();
  return mapping[plaatsnaam] || null;
}

// Get all cemeteries in an official CBS gemeente
export async function getCemeteriesByOfficialGemeente(officialGemeente: string): Promise<Cemetery[]> {
  const mapping = await loadGemeenteMapping();
  const cemeteries = await getAllCemeteries();

  // Find all plaatsnamen that map to this official gemeente
  const plaatsenInGemeente = Object.entries(mapping)
    .filter(([, info]) => info.gemeente.toLowerCase() === officialGemeente.toLowerCase())
    .map(([plaatsnaam]) => plaatsnaam.toLowerCase());

  // Filter cemeteries where plaats OR gemeente matches
  return cemeteries.filter(cemetery => {
    const plaats = cemetery.plaats?.toLowerCase() || '';
    const gemeente = cemetery.gemeente?.toLowerCase() || '';

    return plaatsenInGemeente.includes(plaats) ||
           plaatsenInGemeente.includes(gemeente) ||
           gemeente === officialGemeente.toLowerCase();
  });
}

// Get list of all official CBS gemeentes with cemetery counts
export async function getAllOfficialGemeentes(): Promise<Array<{ gemeente: string; provincie: string; count: number }>> {
  const mapping = await loadGemeenteMapping();
  const cemeteries = await getAllCemeteries();

  // Build a set of unique official gemeentes
  const officialGemeentes = new Map<string, { gemeente: string; provincie: string }>();

  for (const [, info] of Object.entries(mapping)) {
    if (!officialGemeentes.has(info.gemeente)) {
      officialGemeentes.set(info.gemeente, info);
    }
  }

  // Count cemeteries per official gemeente
  const result: Array<{ gemeente: string; provincie: string; count: number }> = [];

  for (const [gemeenteName, info] of officialGemeentes) {
    // Find all plaatsnamen that map to this gemeente
    const plaatsenInGemeente = Object.entries(mapping)
      .filter(([, mappingInfo]) => mappingInfo.gemeente === gemeenteName)
      .map(([plaatsnaam]) => plaatsnaam.toLowerCase());

    // Count cemeteries
    const count = cemeteries.filter(cemetery => {
      const plaats = cemetery.plaats?.toLowerCase() || '';
      const gemeente = cemetery.gemeente?.toLowerCase() || '';

      return plaatsenInGemeente.includes(plaats) ||
             plaatsenInGemeente.includes(gemeente) ||
             gemeente === gemeenteName.toLowerCase();
    }).length;

    if (count > 0) {
      result.push({
        gemeente: info.gemeente,
        provincie: info.provincie,
        count
      });
    }
  }

  return result.sort((a, b) => a.gemeente.localeCompare(b.gemeente, 'nl'));
}

// Get all official gemeentes in a province
export async function getOfficialGemeentesByProvince(province: string): Promise<Array<{ gemeente: string; count: number }>> {
  const allGemeentes = await getAllOfficialGemeentes();
  return allGemeentes
    .filter(g => g.provincie.toLowerCase() === province.toLowerCase())
    .map(({ gemeente, count }) => ({ gemeente, count }))
    .sort((a, b) => a.gemeente.localeCompare(b.gemeente, 'nl'));
}

// Create slug for official gemeente
export function createOfficialGemeenteSlug(gemeente: string): string {
  return gemeente
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, '-') // Replace (L) with hyphen
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Collapse multiple hyphens
}