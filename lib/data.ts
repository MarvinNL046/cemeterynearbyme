import { promises as fs } from 'fs';
import path from 'path';
import { db, cemeteries } from './db';
import { eq, ilike, or, desc, asc, sql, and, count } from 'drizzle-orm';

// US Cemetery Interface
export interface Cemetery {
  // Core identifiers
  id: string;
  name: string;
  slug: string;

  // Location - US geography
  address?: string;
  city: string;
  county?: string;
  state: string;
  state_abbr: string;
  zipCode?: string;
  country: string;
  gps_coordinates?: string;
  latitude?: number;
  longitude?: number;

  // Classification
  type: string;
  type_slug: string;

  // Contact
  phone?: string;
  email?: string;
  website?: string;

  // Details
  description?: string;
  opening_hours?: string;
  facilities?: string[];
  year_established?: string;

  // Google data
  rating?: number;
  review_count?: number;
  photo?: string;
  photo_url?: string;
  photos?: string[];

  // Reviews
  reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date: string;
    reviewer_image?: string;
  }>;

  // Metadata
  status?: string;
  source?: string;
  discovered_at?: string;
  updated_at?: string;
}

// Generated content for SEO
export interface GeneratedContent {
  summary: string;
  history: string;
  features: string[];
  accessibility: string;
  amenities: string[];
  visitor_tips: string[];
  notable_burials?: string;
  natural_setting?: string;
  local_context?: string;
  state_info?: string;
  type_info?: string;
  practical_info?: string;
  directions?: string;
}

// Enriched cemetery with generated content
export interface EnrichedCemeteryData {
  website_url?: string;
  website_content?: string;
  website_scraped_at?: string;

  google_rating?: number;
  google_review_count?: number;
  google_reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date: string;
  }>;
  google_photo?: string;
  google_photos?: string[];

  generated?: GeneratedContent;
  generated_at?: string;

  enriched: boolean;
  enriched_at?: string;
  last_updated?: string;

  seoTitle?: string;
  seoDescription?: string;
  enrichedContent?: string;
}

export interface CemeteryWithContent extends Cemetery, EnrichedCemeteryData {}

// State interface
export interface State {
  name: string;
  abbr: string;
  slug: string;
  counties?: number;
  capital?: string;
  major_cities?: string[];
}

// Cemetery type interface
export interface CemeteryType {
  slug: string;
  name: string;
  description?: string;
  search_terms?: string[];
}

// Cache for static data (states and types only)
let statesCache: State[] | null = null;
let typesCache: CemeteryType[] | null = null;

// ===== HELPER: Map database row to Cemetery interface =====

function mapRowToCemetery(row: typeof cemeteries.$inferSelect): Cemetery {
  return {
    id: row.id.toString(),
    name: row.name,
    slug: row.slug,
    address: row.address || undefined,
    city: row.city,
    county: row.county || undefined,
    state: row.state,
    state_abbr: row.stateAbbr,
    zipCode: row.zipCode || undefined,
    country: row.country,
    latitude: row.latitude ? parseFloat(row.latitude) : undefined,
    longitude: row.longitude ? parseFloat(row.longitude) : undefined,
    type: row.type,
    type_slug: row.typeSlug || row.type.toLowerCase().replace(/\s+/g, '-'),
    phone: row.phone || undefined,
    email: row.email || undefined,
    website: row.website || undefined,
    description: row.description || undefined,
    opening_hours: row.openingHours || undefined,
    facilities: row.facilities || undefined,
    year_established: row.yearEstablished || undefined,
    rating: row.rating ? parseFloat(row.rating) : undefined,
    review_count: row.reviewCount || undefined,
    photo_url: row.photoUrl || undefined,
    photos: row.photos || undefined,
    status: row.status || undefined,
    source: row.source || undefined,
    discovered_at: row.discoveredAt || undefined,
    updated_at: row.updatedAt || undefined,
  };
}

function mapRowToCemeteryWithContent(row: typeof cemeteries.$inferSelect): CemeteryWithContent {
  const base = mapRowToCemetery(row);
  return {
    ...base,
    enriched: !!row.enrichedContent || !!row.generatedSummary,
    enriched_at: row.enrichedAt || undefined,
    seoTitle: row.seoTitle || undefined,
    seoDescription: row.seoDescription || undefined,
    enrichedContent: row.enrichedContent || undefined,
    generated: row.generatedSummary ? {
      summary: row.generatedSummary || '',
      history: row.generatedHistory || '',
      features: row.generatedFeatures || [],
      accessibility: '',
      amenities: row.generatedAmenities || [],
      visitor_tips: row.generatedVisitorTips || [],
      directions: row.generatedDirections || undefined,
      local_context: row.generatedLocalContext || undefined,
    } : undefined,
  };
}

// ===== CORE DATA FUNCTIONS =====

export async function getAllCemeteries(): Promise<Cemetery[]> {
  try {
    const results = await db.select().from(cemeteries);
    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error loading cemeteries from database:', error);
    return [];
  }
}

export async function getCemeteryBySlug(slug: string): Promise<CemeteryWithContent | null> {
  try {
    const results = await db.select()
      .from(cemeteries)
      .where(eq(cemeteries.slug, slug))
      .limit(1);

    if (results.length === 0) return null;

    return mapRowToCemeteryWithContent(results[0]);
  } catch (error) {
    console.error('Error loading cemetery:', error);
    return null;
  }
}

// ===== STATE FUNCTIONS =====

export async function getAllStates(): Promise<State[]> {
  if (statesCache) return statesCache;

  try {
    const statesPath = path.join(process.cwd(), 'data', 'states.json');
    const content = await fs.readFile(statesPath, 'utf-8');
    const data = JSON.parse(content);
    statesCache = data.states as State[];
    return statesCache;
  } catch (error) {
    console.error('Error loading states:', error);
    return [];
  }
}

export async function getStateBySlug(slug: string): Promise<State | null> {
  const states = await getAllStates();
  return states.find(s => s.slug === slug) || null;
}

export async function getStateByAbbr(abbr: string): Promise<State | null> {
  const states = await getAllStates();
  return states.find(s => s.abbr.toLowerCase() === abbr.toLowerCase()) || null;
}

export async function getCemeteriesByState(state: string): Promise<Cemetery[]> {
  try {
    const results = await db.select()
      .from(cemeteries)
      .where(
        or(
          ilike(cemeteries.state, state),
          ilike(cemeteries.stateAbbr, state)
        )
      );
    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error loading cemeteries by state:', error);
    return [];
  }
}

// ===== COUNTY FUNCTIONS =====

export async function getAllCounties(): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ county: cemeteries.county })
      .from(cemeteries)
      .where(sql`${cemeteries.county} IS NOT NULL AND ${cemeteries.county} != ''`)
      .orderBy(asc(cemeteries.county));

    return results.map(r => r.county!).filter(Boolean);
  } catch (error) {
    console.error('Error loading counties:', error);
    return [];
  }
}

export async function getCountiesByState(state: string): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ county: cemeteries.county })
      .from(cemeteries)
      .where(
        and(
          sql`${cemeteries.county} IS NOT NULL AND ${cemeteries.county} != ''`,
          or(
            ilike(cemeteries.state, state),
            ilike(cemeteries.stateAbbr, state)
          )
        )
      )
      .orderBy(asc(cemeteries.county));

    return results.map(r => r.county!).filter(Boolean);
  } catch (error) {
    console.error('Error loading counties by state:', error);
    return [];
  }
}

export async function getCemeteriesByCounty(county: string, state?: string): Promise<Cemetery[]> {
  try {
    let whereClause = ilike(cemeteries.county, county);

    if (state) {
      whereClause = and(
        whereClause,
        or(
          ilike(cemeteries.state, state),
          ilike(cemeteries.stateAbbr, state)
        )
      )!;
    }

    const results = await db.select()
      .from(cemeteries)
      .where(whereClause);

    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error loading cemeteries by county:', error);
    return [];
  }
}

// ===== CITY FUNCTIONS =====

export async function getAllCities(): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ city: cemeteries.city })
      .from(cemeteries)
      .where(sql`${cemeteries.city} IS NOT NULL AND ${cemeteries.city} != ''`)
      .orderBy(asc(cemeteries.city));

    return results.map(r => r.city).filter(Boolean);
  } catch (error) {
    console.error('Error loading cities:', error);
    return [];
  }
}

export async function getCitiesByState(state: string): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ city: cemeteries.city })
      .from(cemeteries)
      .where(
        and(
          sql`${cemeteries.city} IS NOT NULL AND ${cemeteries.city} != ''`,
          or(
            ilike(cemeteries.state, state),
            ilike(cemeteries.stateAbbr, state)
          )
        )
      )
      .orderBy(asc(cemeteries.city));

    return results.map(r => r.city).filter(Boolean);
  } catch (error) {
    console.error('Error loading cities by state:', error);
    return [];
  }
}

export async function getCemeteriesByCity(city: string, state?: string): Promise<Cemetery[]> {
  try {
    let whereClause = ilike(cemeteries.city, city);

    if (state) {
      whereClause = and(
        whereClause,
        or(
          ilike(cemeteries.state, state),
          ilike(cemeteries.stateAbbr, state)
        )
      )!;
    }

    const results = await db.select()
      .from(cemeteries)
      .where(whereClause);

    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error loading cemeteries by city:', error);
    return [];
  }
}

// ===== TYPE FUNCTIONS =====

export async function getAllTypes(): Promise<CemeteryType[]> {
  if (typesCache) return typesCache;

  try {
    const typesPath = path.join(process.cwd(), 'data', 'cemetery-types.json');
    const content = await fs.readFile(typesPath, 'utf-8');
    const data = JSON.parse(content);
    typesCache = data.types as CemeteryType[];
    return typesCache;
  } catch (error) {
    console.error('Error loading cemetery types:', error);
    return [];
  }
}

export async function getTypeBySlug(slug: string): Promise<CemeteryType | null> {
  const types = await getAllTypes();
  return types.find(t => t.slug === slug) || null;
}

export async function getCemeteriesByType(type: string): Promise<Cemetery[]> {
  try {
    const results = await db.select()
      .from(cemeteries)
      .where(
        or(
          ilike(cemeteries.type, type),
          ilike(cemeteries.typeSlug, type)
        )
      );

    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error loading cemeteries by type:', error);
    return [];
  }
}

// ===== SLUG UTILITIES =====

export function createSlug(name: string, city: string, state_abbr?: string): string {
  const base = state_abbr
    ? `${name}-${city}-${state_abbr}`
    : `${name}-${city}`;

  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createStateSlug(state: string): string {
  return state
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function createCountySlug(county: string): string {
  return county
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function createCitySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function createTypeSlug(type: string): string {
  return type
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ===== STATISTICS =====

export async function getStats() {
  try {
    const states = await getAllStates();
    const types = await getAllTypes();

    // Use SQL aggregations for efficiency
    const [statsResult] = await db.select({
      totalCemeteries: count(),
      statesWithCemeteries: sql<number>`COUNT(DISTINCT ${cemeteries.state})`,
      citiesWithCemeteries: sql<number>`COUNT(DISTINCT ${cemeteries.city})`,
      countiesWithCemeteries: sql<number>`COUNT(DISTINCT ${cemeteries.county})`,
      withRatings: sql<number>`COUNT(*) FILTER (WHERE ${cemeteries.rating} IS NOT NULL)`,
      withPhotos: sql<number>`COUNT(*) FILTER (WHERE ${cemeteries.photoUrl} IS NOT NULL)`,
    }).from(cemeteries);

    return {
      total_cemeteries: Number(statsResult.totalCemeteries),
      total_states: states.length,
      states_with_cemeteries: Number(statsResult.statesWithCemeteries),
      cities_with_cemeteries: Number(statsResult.citiesWithCemeteries),
      counties_with_cemeteries: Number(statsResult.countiesWithCemeteries),
      total_types: types.length,
      with_ratings: Number(statsResult.withRatings),
      with_photos: Number(statsResult.withPhotos),
    };
  } catch (error) {
    console.error('Error loading stats:', error);
    return {
      total_cemeteries: 0,
      total_states: 0,
      states_with_cemeteries: 0,
      cities_with_cemeteries: 0,
      counties_with_cemeteries: 0,
      total_types: 0,
      with_ratings: 0,
      with_photos: 0,
    };
  }
}

// ===== SEARCH =====

export async function searchCemeteries(query: string, filters?: {
  state?: string;
  type?: string;
  city?: string;
  county?: string;
}): Promise<Cemetery[]> {
  try {
    // Build dynamic where conditions
    const conditions = [];

    if (filters?.state) {
      conditions.push(
        or(
          ilike(cemeteries.state, filters.state),
          ilike(cemeteries.stateAbbr, filters.state)
        )
      );
    }

    if (filters?.type) {
      conditions.push(
        or(
          ilike(cemeteries.type, `%${filters.type}%`),
          ilike(cemeteries.typeSlug, filters.type)
        )
      );
    }

    if (filters?.city) {
      conditions.push(ilike(cemeteries.city, filters.city));
    }

    if (filters?.county) {
      conditions.push(ilike(cemeteries.county, filters.county));
    }

    // Add search query
    if (query && query.trim()) {
      const q = `%${query.trim()}%`;
      conditions.push(
        or(
          ilike(cemeteries.name, q),
          ilike(cemeteries.city, q),
          ilike(cemeteries.county, q),
          ilike(cemeteries.state, q),
          ilike(cemeteries.address, q),
          ilike(cemeteries.zipCode, q)
        )
      );
    }

    let dbQuery = db.select().from(cemeteries);

    if (conditions.length > 0) {
      dbQuery = dbQuery.where(and(...conditions)) as typeof dbQuery;
    }

    const results = await dbQuery
      .orderBy(desc(cemeteries.rating))
      .limit(100);

    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error searching cemeteries:', error);
    return [];
  }
}

// ===== NEARBY CEMETERIES =====

// Haversine distance calculation (fallback if no PostGIS)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function getNearbyCemeteries(
  lat: number,
  lon: number,
  radiusMiles: number = 25,
  limit: number = 20
): Promise<Array<Cemetery & { distance: number }>> {
  try {
    // Use database query with Haversine formula in SQL
    // This is more efficient than loading all cemeteries
    const results = await db.select()
      .from(cemeteries)
      .where(
        sql`${cemeteries.latitude} IS NOT NULL AND ${cemeteries.longitude} IS NOT NULL`
      )
      .limit(1000); // Get a reasonable number to filter

    // Calculate distances and filter client-side
    // TODO: Enable PostGIS for better performance
    const withDistance = results
      .map(row => ({
        ...mapRowToCemetery(row),
        distance: haversineDistance(
          lat, lon,
          parseFloat(row.latitude!),
          parseFloat(row.longitude!)
        )
      }))
      .filter(c => c.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return withDistance;
  } catch (error) {
    console.error('Error loading nearby cemeteries:', error);
    return [];
  }
}

// ===== FEATURED/POPULAR =====

export async function getFeaturedCemeteries(limit: number = 10): Promise<Cemetery[]> {
  try {
    const results = await db.select()
      .from(cemeteries)
      .where(
        and(
          sql`${cemeteries.rating} IS NOT NULL`,
          sql`${cemeteries.reviewCount} > 0`
        )
      )
      .orderBy(
        desc(sql`${cemeteries.rating} * LOG(${cemeteries.reviewCount} + 1)`),
        desc(cemeteries.rating)
      )
      .limit(limit);

    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error loading featured cemeteries:', error);
    return [];
  }
}

export async function getRecentlyUpdated(limit: number = 10): Promise<Cemetery[]> {
  try {
    const results = await db.select()
      .from(cemeteries)
      .where(sql`${cemeteries.updatedAt} IS NOT NULL`)
      .orderBy(desc(cemeteries.updatedAt))
      .limit(limit);

    return results.map(mapRowToCemetery);
  } catch (error) {
    console.error('Error loading recently updated cemeteries:', error);
    return [];
  }
}
