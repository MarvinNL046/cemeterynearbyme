import { promises as fs } from 'fs';
import path from 'path';

/**
 * Static data layer.
 *
 * Reads the precomputed files in data/static/ (built by
 * scripts/build-static-data.ts) instead of querying Postgres. No `./db` import
 * lives in this module any more — lib/db is still used by the admin/API routes.
 *
 * Layout:
 *   data/static/cemeteries/{ABBR}.json  full records per state, name-sorted
 *   data/static/slug-index.json         { slug: ABBR }  -> single-shard detail lookup
 *   data/static/stats.json              precomputed getStats() aggregates
 *   data/static/geo.json                [{ slug, lat, lng, state }] for nearby
 *   data/static/facets.json             distinct states / counties / cities / types
 *   data/static/featured.json           top 200 by rating * LOG(review_count + 1)
 *   data/static/state-alias-index.json  state-column value -> records in a foreign shard
 *
 * Every shard/index is parsed at most once per process and kept in a
 * module-level cache, so ISR instances reuse the parsed objects.
 */

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

// ===== STATIC FILE LAYOUT =====

const DATA_DIR = path.join(process.cwd(), 'data');
const STATIC_DIR = path.join(DATA_DIR, 'static');
const SHARD_DIR = path.join(STATIC_DIR, 'cemeteries');

interface StatsShape {
  total_cemeteries: number;
  total_states: number;
  states_with_cemeteries: number;
  cities_with_cemeteries: number;
  counties_with_cemeteries: number;
  total_types: number;
  with_ratings: number;
  with_photos: number;
}

interface FacetsShape {
  states: Array<{ abbr: string; name: string; slug: string; count: number }>;
  counties: Array<{ county: string; state: string }>;
  cities: Array<{ city: string; state: string }>;
  types: Array<{ slug: string; name: string }>;
}

interface GeoPoint {
  slug: string;
  lat: number;
  lng: number;
  state: string;
}

/** state-column value (lowercased) -> the records carrying it that sit in another shard. */
type StateAliasIndex = Record<string, { shards: string[]; slugs: string[] }>;

const EMPTY_STATS: StatsShape = {
  total_cemeteries: 0,
  total_states: 0,
  states_with_cemeteries: 0,
  cities_with_cemeteries: 0,
  counties_with_cemeteries: 0,
  total_types: 0,
  with_ratings: 0,
  with_photos: 0,
};

const EMPTY_FACETS: FacetsShape = { states: [], counties: [], cities: [], types: [] };

// ===== CACHING =====
//
// Promises (not values) are cached so concurrent callers share one read+parse.
// A rejected promise is evicted so a transient failure is retried next call.

const shardCache = new Map<string, Promise<CemeteryWithContent[]>>();
const fileCache = new Map<string, Promise<unknown>>();

let statesCache: State[] | null = null;
let typesCache: CemeteryType[] | null = null;
let allCemeteriesCache: Promise<CemeteryWithContent[]> | null = null;

async function readJson<T>(absPath: string): Promise<T> {
  const content = await fs.readFile(absPath, 'utf-8');
  return JSON.parse(content) as T;
}

/** Read + parse a static file once per process. */
function loadFile<T>(absPath: string): Promise<T> {
  const cached = fileCache.get(absPath);
  if (cached) return cached as Promise<T>;

  const promise = readJson<T>(absPath).catch((error) => {
    fileCache.delete(absPath); // don't cache the failure
    throw error;
  });
  fileCache.set(absPath, promise);
  return promise;
}

function loadStats(): Promise<StatsShape> {
  return loadFile<StatsShape>(path.join(STATIC_DIR, 'stats.json'));
}

function loadFacets(): Promise<FacetsShape> {
  return loadFile<FacetsShape>(path.join(STATIC_DIR, 'facets.json'));
}

function loadGeo(): Promise<GeoPoint[]> {
  return loadFile<GeoPoint[]>(path.join(STATIC_DIR, 'geo.json'));
}

function loadSlugIndex(): Promise<Record<string, string>> {
  return loadFile<Record<string, string>>(path.join(STATIC_DIR, 'slug-index.json'));
}

function loadFeatured(): Promise<CemeteryWithContent[]> {
  return loadFile<CemeteryWithContent[]>(path.join(STATIC_DIR, 'featured.json'));
}

/**
 * Missing file -> empty index: every record then simply lives in its own shard,
 * which is the pre-alias behaviour rather than a hard failure.
 */
function loadStateAliasIndex(): Promise<StateAliasIndex> {
  return loadFile<StateAliasIndex>(path.join(STATIC_DIR, 'state-alias-index.json')).catch(() => ({}));
}

/** Load one state shard. Only ever touches data/static/cemeteries/{ABBR}.json. */
function loadShard(abbr: string): Promise<CemeteryWithContent[]> {
  // Guard: the abbr becomes a filename, so never let anything else through.
  if (!/^[A-Za-z]{2}$/.test(abbr)) return Promise.resolve([]);
  const key = abbr.toUpperCase();

  const cached = shardCache.get(key);
  if (cached) return cached;

  const promise = readJson<CemeteryWithContent[]>(path.join(SHARD_DIR, `${key}.json`))
    .catch((error: NodeJS.ErrnoException) => {
      shardCache.delete(key);
      if (error && error.code === 'ENOENT') return []; // state without a shard
      throw error;
    });
  shardCache.set(key, promise);
  return promise;
}

/** Load several shards and concatenate them. */
async function loadShards(abbrs: Iterable<string>): Promise<CemeteryWithContent[]> {
  const lists = await Promise.all([...abbrs].map(loadShard));
  return lists.flat();
}

/** Every shard, in state-alphabetical order (name-sorted within each state). */
function loadAllCemeteries(): Promise<CemeteryWithContent[]> {
  if (allCemeteriesCache) return allCemeteriesCache;

  const promise = (async () => {
    const facets = await loadFacets();
    const abbrs = facets.states.map((s) => s.abbr).sort();
    return loadShards(abbrs);
  })().catch((error) => {
    allCemeteriesCache = null;
    throw error;
  });

  allCemeteriesCache = promise;
  return promise;
}

// ===== ILIKE EQUIVALENTS =====
//
// Postgres ILIKE is case-insensitive; in JS that becomes an explicit
// toLowerCase() comparison. Inputs and stored values are trimmed so stray
// whitespace from a URL segment can't silently miss.

function normalize(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

/** ILIKE 'pattern' with no wildcards -> case-insensitive equality. NULL never matches. */
function ilikeEquals(value: string | null | undefined, pattern: string): boolean {
  if (value === null || value === undefined) return false;
  return normalize(value) === normalize(pattern);
}

/**
 * ILIKE '%term%' -> case-insensitive substring match. NULL never matches.
 * `term` must already be normalized by the caller.
 */
function ilikeContains(value: string | null | undefined, term: string): boolean {
  if (value === null || value === undefined) return false;
  return value.toLowerCase().includes(term);
}

/**
 * Resolve a state abbreviation, full name or slug to its canonical abbr.
 *
 * The shards are keyed on state_abbr, which the export's `state` column
 * disagrees with on ~4.5% of rows (see build-static-data.ts), so state_abbr is
 * the only reliable key. Returns null when nothing matches.
 */
async function resolveStateAbbr(state: string): Promise<string | null> {
  const wanted = normalize(state);
  if (!wanted) return null;

  const facets = await loadFacets();
  for (const s of facets.states) {
    if (normalize(s.abbr) === wanted || normalize(s.name) === wanted || normalize(s.slug) === wanted) {
      return s.abbr;
    }
  }

  // Fall back to data/states.json for states that have no cemeteries at all.
  const states = await getAllStates();
  const match = states.find(
    (s) => normalize(s.abbr) === wanted || normalize(s.name) === wanted || normalize(s.slug) === wanted
  );
  return match ? match.abbr : null;
}

// ===== STATE PREDICATE (parity with the original SQL) =====
//
// The SQL this layer replaced filtered on
//   WHERE state ILIKE $1 OR state_abbr ILIKE $1
// and callers pass the FULL state name (app/state/[state]/page.tsx:35,57 and
// app/guide/state/[state]/page.tsx:115 all pass `state.name`).
//
// That predicate is deliberately reproduced verbatim. It is NOT the same as
// "everything in this state's shard": the export's `state` column disagrees
// with `state_abbr` on ~2.4k rows, so a full-name query returns rows out of
// other shards and skips rows sitting in its own. Switching to a shard-wide
// filter would silently change the record count on 50 indexed state pages —
// the count is printed in the <title> — so parity wins over tidiness here.

/** state ILIKE $1 OR state_abbr ILIKE $1, on one record. */
function matchesState(record: Cemetery, state: string): boolean {
  return ilikeEquals(record.state, state) || ilikeEquals(record.state_abbr, state);
}

/**
 * All records matching `state ILIKE x OR state_abbr ILIKE x`, without opening
 * all 51 shards.
 *
 * Candidate shards = the state's own shard (resolved from abbr/name/slug) plus
 * the shards named by state-alias-index.json for this exact state-column value.
 * Everything outside those shards is provably a non-match, so filtering the
 * candidates gives the same set a full scan would.
 */
async function selectByState(state: string): Promise<CemeteryWithContent[]> {
  const key = normalize(state);
  if (!key) return [];

  const shards = new Set<string>();

  const own = await resolveStateAbbr(state);
  if (own) shards.add(own);

  const alias = await loadStateAliasIndex();
  const entry = alias[key];
  if (entry) for (const abbr of entry.shards) shards.add(abbr);

  if (shards.size === 0) return [];

  const records = await loadShards(shards);
  return records.filter((c) => matchesState(c, state));
}

/** Sort by rating descending, records without a rating last. */
function byRatingDesc(a: Cemetery, b: Cemetery): number {
  const ra = a.rating ?? Number.NEGATIVE_INFINITY;
  const rb = b.rating ?? Number.NEGATIVE_INFINITY;
  return rb - ra;
}

// ===== CORE DATA FUNCTIONS =====

export async function getAllCemeteries(): Promise<Cemetery[]> {
  try {
    const all = await loadAllCemeteries();
    return all.slice(); // shallow copy: callers sort the result in place
  } catch (error) {
    console.error('Error loading cemeteries from static data:', error);
    return [];
  }
}

/**
 * Detail lookup. Reads slug-index.json to find the one state shard holding this
 * slug and parses only that shard — never all 51.
 */
export async function getCemeteryBySlug(slug: string): Promise<CemeteryWithContent | null> {
  try {
    const index = await loadSlugIndex();
    if (!Object.prototype.hasOwnProperty.call(index, slug)) return null;

    const abbr = index[slug];
    if (!abbr) return null;

    const shard = await loadShard(abbr);
    return shard.find((c) => c.slug === slug) || null;
  } catch (error) {
    console.error('Error loading cemetery:', error);
    return null;
  }
}

// ===== STATE FUNCTIONS =====

export async function getAllStates(): Promise<State[]> {
  if (statesCache) return statesCache;

  try {
    const statesPath = path.join(DATA_DIR, 'states.json');
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

/**
 * `state ILIKE x OR state_abbr ILIKE x` — see the STATE PREDICATE note above.
 * Pass the full state name (as every caller does) or the abbreviation.
 */
export async function getCemeteriesByState(state: string): Promise<Cemetery[]> {
  try {
    return await selectByState(state);
  } catch (error) {
    console.error('Error loading cemeteries by state:', error);
    return [];
  }
}

/**
 * Per-state totals for every state in data/states.json, computed through the
 * SAME predicate the state detail page uses. /state, /state/[state] and the
 * footer all read this, so their numbers cannot drift apart.
 */
export interface StateSummary extends State {
  cemeteryCount: number;
  countyCount: number;
  cityCount: number;
}

let stateSummariesCache: Promise<StateSummary[]> | null = null;

export async function getStateSummaries(): Promise<StateSummary[]> {
  if (stateSummariesCache) return stateSummariesCache;

  const promise = (async () => {
    const states = await getAllStates();
    const summaries: StateSummary[] = [];

    for (const state of states) {
      const records = await selectByState(state.name);
      const counties = new Set<string>();
      const cities = new Set<string>();
      for (const c of records) {
        if (c.county) counties.add(c.county);
        if (c.city) cities.add(c.city);
      }
      summaries.push({
        ...state,
        cemeteryCount: records.length,
        countyCount: counties.size,
        cityCount: cities.size,
      });
    }

    return summaries;
  })().catch((error) => {
    stateSummariesCache = null;
    throw error;
  });

  stateSummariesCache = promise;
  return promise;
}

// ===== COUNTY FUNCTIONS =====

export async function getAllCounties(): Promise<string[]> {
  try {
    const facets = await loadFacets();
    const seen = new Set<string>();
    const counties: string[] = [];

    for (const entry of facets.counties) {
      if (!entry.county) continue;
      const key = entry.county.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      counties.push(entry.county);
    }

    return counties.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error loading counties:', error);
    return [];
  }
}

/** SELECT DISTINCT county WHERE county <> '' AND (state ILIKE x OR state_abbr ILIKE x). */
export async function getCountiesByState(state: string): Promise<string[]> {
  try {
    const records = await selectByState(state);

    // SELECT DISTINCT is case-SENSITIVE, so dedupe on the exact string.
    const seen = new Set<string>();
    for (const c of records) {
      if (c.county) seen.add(c.county); // '' was mapped to undefined at build time
    }

    return [...seen].sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error loading counties by state:', error);
    return [];
  }
}

export async function getCemeteriesByCounty(county: string, state?: string): Promise<Cemetery[]> {
  try {
    // With a state argument the SQL was
    //   county ILIKE $1 AND (state ILIKE $2 OR state_abbr ILIKE $2)
    if (state) {
      const inState = await selectByState(state);
      return inState.filter((c) => ilikeEquals(c.county, county));
    }

    // Without one: narrow to the shards that actually contain this county.
    const facets = await loadFacets();
    const abbrs = [
      ...new Set(facets.counties.filter((e) => ilikeEquals(e.county, county)).map((e) => e.state)),
    ];
    if (abbrs.length === 0) return [];

    const records = await loadShards(abbrs);
    return records.filter((c) => ilikeEquals(c.county, county));
  } catch (error) {
    console.error('Error loading cemeteries by county:', error);
    return [];
  }
}

// ===== CITY FUNCTIONS =====

export async function getAllCities(): Promise<string[]> {
  try {
    const facets = await loadFacets();
    const seen = new Set<string>();
    const cities: string[] = [];

    for (const entry of facets.cities) {
      if (!entry.city) continue;
      const key = entry.city.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      cities.push(entry.city);
    }

    return cities.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error loading cities:', error);
    return [];
  }
}

/** SELECT DISTINCT city WHERE city <> '' AND (state ILIKE x OR state_abbr ILIKE x). */
export async function getCitiesByState(state: string): Promise<string[]> {
  try {
    const records = await selectByState(state);

    // SELECT DISTINCT is case-SENSITIVE, so dedupe on the exact string.
    const seen = new Set<string>();
    for (const c of records) {
      if (c.city) seen.add(c.city);
    }

    return [...seen].sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error loading cities by state:', error);
    return [];
  }
}

export async function getCemeteriesByCity(city: string, state?: string): Promise<Cemetery[]> {
  try {
    // With a state argument the SQL was
    //   city ILIKE $1 AND (state ILIKE $2 OR state_abbr ILIKE $2)
    if (state) {
      const inState = await selectByState(state);
      return inState.filter((c) => ilikeEquals(c.city, city));
    }

    // Without one: narrow to the shards that actually contain this city.
    const facets = await loadFacets();
    const abbrs = [
      ...new Set(facets.cities.filter((e) => ilikeEquals(e.city, city)).map((e) => e.state)),
    ];
    if (abbrs.length === 0) return [];

    const records = await loadShards(abbrs);
    return records.filter((c) => ilikeEquals(c.city, city));
  } catch (error) {
    console.error('Error loading cemeteries by city:', error);
    return [];
  }
}

// ===== TYPE FUNCTIONS =====

export async function getAllTypes(): Promise<CemeteryType[]> {
  if (typesCache) return typesCache;

  try {
    const typesPath = path.join(DATA_DIR, 'cemetery-types.json');
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
    // Type isn't part of the shard key, so this is a full scan (as the SQL was).
    const all = await loadAllCemeteries();
    return all.filter((c) => ilikeEquals(c.type, type) || ilikeEquals(c.type_slug, type));
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
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
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

/** Reads the precomputed aggregates; never scans the 53k records. */
export async function getStats(): Promise<StatsShape> {
  try {
    return await loadStats();
  } catch (error) {
    console.error('Error loading stats:', error);
    return { ...EMPTY_STATS };
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
    const facets = await loadFacets().catch(() => EMPTY_FACETS);

    // Pick the cheapest shard set the filters allow; otherwise scan everything.
    let records: CemeteryWithContent[];
    if (filters?.state) {
      // state ILIKE x OR state_abbr ILIKE x — same predicate as the SQL.
      records = await selectByState(filters.state);
      if (records.length === 0) return [];
    } else if (filters?.city) {
      const abbrs = [
        ...new Set(facets.cities.filter((e) => ilikeEquals(e.city, filters.city!)).map((e) => e.state)),
      ];
      if (abbrs.length === 0) return [];
      records = await loadShards(abbrs);
    } else if (filters?.county) {
      const abbrs = [
        ...new Set(
          facets.counties.filter((e) => ilikeEquals(e.county, filters.county!)).map((e) => e.state)
        ),
      ];
      if (abbrs.length === 0) return [];
      records = await loadShards(abbrs);
    } else {
      records = await loadAllCemeteries();
    }

    const typeTerm = filters?.type ? normalize(filters.type) : null;
    const q = query && query.trim() ? query.trim().toLowerCase() : null;

    const results = records.filter((c) => {
      // type: ILIKE '%type%' on type OR ILIKE 'type' on type_slug
      if (filters?.type && !(ilikeContains(c.type, typeTerm!) || ilikeEquals(c.type_slug, filters.type))) {
        return false;
      }
      if (filters?.city && !ilikeEquals(c.city, filters.city)) return false;
      if (filters?.county && !ilikeEquals(c.county, filters.county)) return false;

      // free-text: ILIKE '%q%' across the same 6 columns as the SQL
      if (q) {
        const hit =
          ilikeContains(c.name, q) ||
          ilikeContains(c.city, q) ||
          ilikeContains(c.county, q) ||
          ilikeContains(c.state, q) ||
          ilikeContains(c.address, q) ||
          ilikeContains(c.zipCode, q);
        if (!hit) return false;
      }

      return true;
    });

    // DELIBERATE DEVIATION from the SQL, do not "fix" back:
    // Postgres `ORDER BY rating DESC` is NULLS FIRST, so the old top-100 was
    // filled almost entirely with unrated records (15,950 rows have no rating).
    // byRatingDesc puts unrated records LAST, which is what a "best results
    // first" list is supposed to mean. Same limit, better 100.
    return results.sort(byRatingDesc).slice(0, 100);
  } catch (error) {
    console.error('Error searching cemeteries:', error);
    return [];
  }
}

// ===== NEARBY CEMETERIES =====

// Haversine distance calculation
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

/**
 * Ranks the lightweight geo.json points (all 53k, ~40 bytes each) and only then
 * hydrates the handful of winners from their own shards.
 */
export async function getNearbyCemeteries(
  lat: number,
  lon: number,
  radiusMiles: number = 25,
  limit: number = 20
): Promise<Array<Cemetery & { distance: number }>> {
  try {
    const points = await loadGeo();

    const nearest = points
      .map((p) => ({ point: p, distance: haversineDistance(lat, lon, p.lat, p.lng) }))
      .filter((p) => p.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    if (nearest.length === 0) return [];

    // Hydrate from only the shards the winners live in.
    const records = await loadShards(new Set(nearest.map((n) => n.point.state)));
    const bySlug = new Map(records.map((c) => [c.slug, c]));

    const hydrated: Array<Cemetery & { distance: number }> = [];
    for (const { point, distance } of nearest) {
      const record = bySlug.get(point.slug);
      if (record) hydrated.push({ ...record, distance });
    }

    return hydrated;
  } catch (error) {
    console.error('Error loading nearby cemeteries:', error);
    return [];
  }
}

// ===== FEATURED/POPULAR =====

/**
 * Reads the precomputed ranking; never scans the 53k records.
 *
 * The file is capped (FEATURED_LIMIT in scripts/build-static-data.ts), so a
 * larger `limit` cannot be served. That used to happen silently — it now warns,
 * so the cap gets raised in the builder instead of quietly shrinking a page.
 */
export async function getFeaturedCemeteries(limit: number = 10): Promise<Cemetery[]> {
  try {
    const featured = await loadFeatured();
    if (limit > featured.length) {
      console.warn(
        `getFeaturedCemeteries(${limit}): featured.json only holds ${featured.length} records, ` +
          `returning ${featured.length}. Raise FEATURED_LIMIT in scripts/build-static-data.ts and rebuild.`
      );
    }
    return featured.slice(0, limit);
  } catch (error) {
    console.error('Error loading featured cemeteries:', error);
    return [];
  }
}

export async function getRecentlyUpdated(limit: number = 10): Promise<Cemetery[]> {
  try {
    // No precomputed file for this one, so it scans the (cached) shards.
    const all = await loadAllCemeteries();
    return all
      .filter((c) => !!c.updated_at)
      .sort((a, b) => (b.updated_at as string).localeCompare(a.updated_at as string))
      .slice(0, limit);
  } catch (error) {
    console.error('Error loading recently updated cemeteries:', error);
    return [];
  }
}
