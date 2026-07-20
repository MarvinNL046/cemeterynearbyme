/**
 * build-static-data.ts
 *
 * Builds the static data layer from the Neon export so the site no longer
 * needs Postgres at runtime.
 *
 * Input (Neon export, snake_case column names — the ONLY source of truth):
 *   <exportDir>/cemeterynearbyme_com__cemeteries.json
 *   <exportDir>/cemeterynearbyme_com__website_feedback.json
 *
 * Output (data/static/):
 *   cemeteries/{STATE_ABBR}.json  full CemeteryWithContent records per state
 *   slug-index.json               { slug: STATE_ABBR } for detail routing
 *   stats.json                    the aggregates getStats() computes in SQL
 *   geo.json                      [{ slug, lat, lng, state }] for getNearbyCemeteries
 *   facets.json                   sorted distinct states / counties / cities / types
 *   featured.json                 top 200 by rating * LOG(review_count + 1)
 *   state-alias-index.json        state-column value -> records living in a foreign shard
 *   website-feedback.json         website_feedback rows, camelCased
 *
 * Field mapping mirrors mapRowToCemetery / mapRowToCemeteryWithContent in
 * lib/data.ts exactly, including the `undefined` fallbacks (undefined values
 * are dropped by JSON.stringify, which keeps the files small).
 *
 * Slugs are ALWAYS taken verbatim from the export — never regenerated, because
 * the database contains two different slug conventions.
 *
 * Usage (from the repo root):
 *   node scripts/build-static-data.ts <exportDir>
 *   npx tsx scripts/build-static-data.ts <exportDir>
 *   EXPORT_DIR=/path/to/export node scripts/build-static-data.ts
 */

import fs from 'fs';
import path from 'path';

// ===== Paths =====

// Run from the repo root (npm scripts already do); override with REPO_ROOT.
const ROOT = path.resolve(process.env.REPO_ROOT || process.cwd());
const EXPORT_DIR = path.resolve(
  process.argv[2] || process.env.EXPORT_DIR || path.join(ROOT, 'export')
);
const CEMETERIES_EXPORT = path.join(EXPORT_DIR, 'cemeterynearbyme_com__cemeteries.json');
const FEEDBACK_EXPORT = path.join(EXPORT_DIR, 'cemeterynearbyme_com__website_feedback.json');

const OUT_DIR = path.join(ROOT, 'data', 'static');
const OUT_STATES_DIR = path.join(OUT_DIR, 'cemeteries');

const FEATURED_LIMIT = 200;

// ===== Types =====

/** Raw row exactly as exported from Postgres (snake_case). */
interface ExportRow {
  id: number;
  slug: string;
  name: string;
  type: string;
  type_slug: string | null;
  address: string | null;
  city: string;
  county: string | null;
  state: string;
  state_abbr: string;
  zip_code: string | null;
  country: string;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  google_place_id: string | null;
  google_cid: string | null;
  rating: string | null;
  review_count: number | null;
  photo_url: string | null;
  photos: string[] | null;
  opening_hours: string | null;
  facilities: string[] | null;
  categories: string[] | null;
  year_established: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  enriched_content: string | null;
  generated_summary: string | null;
  generated_history: string | null;
  generated_features: string[] | null;
  generated_amenities: string[] | null;
  generated_visitor_tips: string[] | null;
  generated_directions: string | null;
  generated_local_context: string | null;
  enriched_at: string | null;
  source: string | null;
  status: string | null;
  discovered_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface FeedbackRow {
  id: number;
  type: string;
  rating: number | null;
  feedback: string | null;
  page_title: string | null;
  page_url: string | null;
  user_agent: string | null;
  ip_address: string | null;
  status: string;
  created_at: string;
}

// ===== Mapping =====

/**
 * Mirrors mapRowToCemetery() + mapRowToCemeteryWithContent() in lib/data.ts.
 * Keep the two in sync — this is the shape the app already consumes.
 */
function mapExportRow(row: ExportRow) {
  return {
    // --- mapRowToCemetery ---
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    address: row.address || undefined,
    city: row.city,
    county: row.county || undefined,
    state: row.state,
    state_abbr: row.state_abbr,
    zipCode: row.zip_code || undefined,
    country: row.country,
    latitude: row.latitude ? parseFloat(row.latitude) : undefined,
    longitude: row.longitude ? parseFloat(row.longitude) : undefined,
    type: row.type,
    type_slug: row.type_slug || row.type.toLowerCase().replace(/\s+/g, '-'),
    phone: row.phone || undefined,
    email: row.email || undefined,
    website: row.website || undefined,
    description: row.description || undefined,
    opening_hours: row.opening_hours || undefined,
    facilities: row.facilities || undefined,
    year_established: row.year_established || undefined,
    rating: row.rating ? parseFloat(row.rating) : undefined,
    review_count: row.review_count || undefined,
    photo_url: row.photo_url || undefined,
    photos: row.photos || undefined,
    status: row.status || undefined,
    source: row.source || undefined,
    discovered_at: row.discovered_at || undefined,
    updated_at: row.updated_at || undefined,

    // --- mapRowToCemeteryWithContent ---
    enriched: !!row.enriched_content || !!row.generated_summary,
    enriched_at: row.enriched_at || undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    enrichedContent: row.enriched_content || undefined,
    generated: row.generated_summary
      ? {
          summary: row.generated_summary || '',
          history: row.generated_history || '',
          features: row.generated_features || [],
          accessibility: '',
          amenities: row.generated_amenities || [],
          visitor_tips: row.generated_visitor_tips || [],
          directions: row.generated_directions || undefined,
          local_context: row.generated_local_context || undefined,
        }
      : undefined,
  };
}

type StaticCemetery = ReturnType<typeof mapExportRow>;

// ===== Helpers =====

function writeJson(file: string, data: unknown): number {
  fs.writeFileSync(file, JSON.stringify(data));
  return fs.statSync(file).size;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function addTo(map: Map<string, Set<string>>, key: string, value: string) {
  let set = map.get(key);
  if (!set) {
    set = new Set<string>();
    map.set(key, set);
  }
  set.add(value);
}

// ===== Main =====

function main() {
  if (!fs.existsSync(CEMETERIES_EXPORT)) {
    throw new Error(`Export not found: ${CEMETERIES_EXPORT}`);
  }
  if (!fs.existsSync(path.join(ROOT, 'data', 'states.json'))) {
    throw new Error(`Not a repo root (data/states.json missing): ${ROOT}`);
  }

  console.log(`Reading ${CEMETERIES_EXPORT} ...`);
  const rows: ExportRow[] = JSON.parse(fs.readFileSync(CEMETERIES_EXPORT, 'utf-8'));
  console.log(`  ${rows.length.toLocaleString()} rows`);

  fs.mkdirSync(OUT_STATES_DIR, { recursive: true });

  // --- pass 1: shard by state, build index/geo/facets/stat accumulators ---
  const byState = new Map<string, StaticCemetery[]>();
  const slugIndex: Record<string, string> = {};
  const geo: Array<{ slug: string; lat: number; lng: number; state: string }> = [];

  const stateNames = new Map<string, string>(); // abbr -> full state name
  const distinctStates = new Set<string>();
  const distinctCities = new Set<string>();
  const distinctCounties = new Set<string>();
  const countiesByState = new Map<string, Set<string>>();
  const citiesByState = new Map<string, Set<string>>();
  const typeMap = new Map<string, string>(); // type_slug -> type label
  let withRatings = 0;
  let withPhotos = 0;
  let duplicateSlugs = 0;

  for (const row of rows) {
    const c = mapExportRow(row);
    const abbr = c.state_abbr;

    let list = byState.get(abbr);
    if (!list) {
      list = [];
      byState.set(abbr, list);
    }
    list.push(c);

    if (slugIndex[c.slug] !== undefined) duplicateSlugs++;
    slugIndex[c.slug] = abbr; // verbatim DB slug, never regenerated

    if (c.latitude !== undefined && c.longitude !== undefined) {
      geo.push({ slug: c.slug, lat: c.latitude, lng: c.longitude, state: abbr });
    }

    if (!stateNames.has(abbr)) stateNames.set(abbr, c.state);

    // COUNT(DISTINCT x) ignores NULLs — mirror that
    if (row.state) distinctStates.add(row.state);
    if (row.city) {
      distinctCities.add(row.city);
      addTo(citiesByState, abbr, row.city);
    }
    if (row.county) {
      distinctCounties.add(row.county);
      addTo(countiesByState, abbr, row.county);
    }
    if (!typeMap.has(c.type_slug)) typeMap.set(c.type_slug, c.type);

    if (row.rating !== null && row.rating !== undefined) withRatings++;
    if (row.photo_url !== null && row.photo_url !== undefined) withPhotos++;
  }

  // --- 1. data/static/cemeteries/{STATE_ABBR}.json ---
  const stateFiles: Array<{ abbr: string; count: number; bytes: number }> = [];
  for (const abbr of [...byState.keys()].sort()) {
    const list = byState.get(abbr)!;
    list.sort((a, b) => a.name.localeCompare(b.name));
    const file = path.join(OUT_STATES_DIR, `${abbr}.json`);
    stateFiles.push({ abbr, count: list.length, bytes: writeJson(file, list) });
  }

  // --- 2. slug-index.json / 4. geo.json ---
  const slugIndexBytes = writeJson(path.join(OUT_DIR, 'slug-index.json'), slugIndex);
  const geoBytes = writeJson(path.join(OUT_DIR, 'geo.json'), geo);

  // --- 3. stats.json (mirrors getStats()) ---
  const statesJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'states.json'), 'utf-8'));
  const typesJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data', 'cemetery-types.json'), 'utf-8')
  );

  const stats = {
    total_cemeteries: rows.length,
    total_states: (statesJson.states || []).length,
    states_with_cemeteries: distinctStates.size,
    cities_with_cemeteries: distinctCities.size,
    counties_with_cemeteries: distinctCounties.size,
    total_types: (typesJson.types || []).length,
    with_ratings: withRatings,
    with_photos: withPhotos,
  };
  const statsBytes = writeJson(path.join(OUT_DIR, 'stats.json'), stats);

  // --- 5. facets.json ---
  const counties: Array<{ county: string; state: string }> = [];
  for (const [abbr, set] of countiesByState) {
    for (const county of set) counties.push({ county, state: abbr });
  }
  counties.sort((a, b) => a.county.localeCompare(b.county) || a.state.localeCompare(b.state));

  const cities: Array<{ city: string; state: string }> = [];
  for (const [abbr, set] of citiesByState) {
    for (const city of set) cities.push({ city, state: abbr });
  }
  cities.sort((a, b) => a.city.localeCompare(b.city) || a.state.localeCompare(b.state));

  // NOTE: the `state` column in the export disagrees with `state_abbr` on a
  // minority of rows (e.g. every ND row carries a different full state name),
  // so the canonical name/slug comes from data/states.json, keyed on the
  // reliable state_abbr. stateNames (first-seen DB value) is only a fallback.
  const canonicalStates = new Map<string, { name: string; slug: string }>(
    (statesJson.states || []).map((s: { name: string; abbr: string; slug: string }) => [
      s.abbr,
      { name: s.name, slug: s.slug },
    ])
  );

  const facets = {
    states: [...byState.keys()]
      .map((abbr) => {
        const canonical = canonicalStates.get(abbr);
        const name = canonical?.name || stateNames.get(abbr)!;
        return {
          abbr,
          name,
          slug: canonical?.slug || name.toLowerCase().replace(/\s+/g, '-'),
          count: byState.get(abbr)!.length,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
    counties,
    cities,
    types: [...typeMap.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.slug.localeCompare(b.slug)),
  };
  const facetsBytes = writeJson(path.join(OUT_DIR, 'facets.json'), facets);

  // --- 6. featured.json — getFeaturedCemeteries(): rating * LOG(review_count + 1) ---
  const featured = rows
    .filter((r) => r.rating !== null && (r.review_count || 0) > 0)
    .map((r) => {
      const rating = parseFloat(r.rating as string);
      return { row: r, rating, score: rating * Math.log10((r.review_count || 0) + 1) };
    })
    .sort((a, b) => b.score - a.score || b.rating - a.rating)
    .slice(0, FEATURED_LIMIT)
    .map((x) => mapExportRow(x.row));
  const featuredBytes = writeJson(path.join(OUT_DIR, 'featured.json'), featured);

  // --- 7. state-alias-index.json ---
  //
  // The shards are keyed on state_abbr, but the ORIGINAL SQL matched
  //   state ILIKE $1 OR state_abbr ILIKE $1
  // so a record whose `state` column says "Tennessee" while its state_abbr says
  // "WY" belongs on the Tennessee page even though it is stored in WY.json.
  // This index lets lib/data.ts find those records without opening all 51
  // shards: it maps the lowercased `state` value to the records carrying it
  // that do NOT live in that state's own shard.
  //
  //   { "tennessee": { "shards": ["WY", "NE"], "slugs": ["a-b-wy", ...] } }
  //
  // `shards` is the (small) set of files to open; `slugs` is the exact record
  // set, so the reader never has to trust a shard-wide assumption.
  const abbrByStateName = new Map<string, string>(
    (statesJson.states || []).map((s: { name: string; abbr: string }) => [
      s.name.trim().toLowerCase(),
      s.abbr,
    ])
  );

  const aliasIndex: Record<string, { shards: string[]; slugs: string[] }> = {};
  let aliasRecords = 0;
  for (const row of rows) {
    if (!row.state) continue;
    const key = row.state.trim().toLowerCase();
    if (!key) continue;

    // Home shard for this state NAME. When the name is unknown (garbage value)
    // there is no home shard, so every record carrying it is an alias.
    const homeAbbr = abbrByStateName.get(key);
    if (homeAbbr && homeAbbr === row.state_abbr) continue; // already in the right shard

    let entry = aliasIndex[key];
    if (!entry) {
      entry = { shards: [], slugs: [] };
      aliasIndex[key] = entry;
    }
    if (!entry.shards.includes(row.state_abbr)) entry.shards.push(row.state_abbr);
    entry.slugs.push(row.slug);
    aliasRecords++;
  }
  for (const entry of Object.values(aliasIndex)) entry.shards.sort();
  const aliasBytes = writeJson(path.join(OUT_DIR, 'state-alias-index.json'), aliasIndex);

  // --- website feedback ---
  let feedbackBytes = 0;
  let feedbackCount = 0;
  if (fs.existsSync(FEEDBACK_EXPORT)) {
    const fb: FeedbackRow[] = JSON.parse(fs.readFileSync(FEEDBACK_EXPORT, 'utf-8'));
    feedbackCount = fb.length;
    feedbackBytes = writeJson(
      path.join(OUT_DIR, 'website-feedback.json'),
      fb.map((f) => ({
        id: String(f.id),
        type: f.type,
        rating: f.rating ?? undefined,
        feedback: f.feedback || undefined,
        pageTitle: f.page_title || undefined,
        pageUrl: f.page_url || undefined,
        userAgent: f.user_agent || undefined,
        ipAddress: f.ip_address || undefined,
        status: f.status,
        createdAt: f.created_at,
      }))
    );
  }

  // --- verification: every slug resolves to a record in its state shard ---
  const slugIndexOnDisk: Record<string, string> = JSON.parse(
    fs.readFileSync(path.join(OUT_DIR, 'slug-index.json'), 'utf-8')
  );
  const slugCount = Object.keys(slugIndexOnDisk).length;
  const slugsPerStateFile = new Map<string, Set<string>>();
  for (const { abbr } of stateFiles) {
    const list: StaticCemetery[] = JSON.parse(
      fs.readFileSync(path.join(OUT_STATES_DIR, `${abbr}.json`), 'utf-8')
    );
    slugsPerStateFile.set(abbr, new Set(list.map((c) => c.slug)));
  }
  let resolvable = 0;
  const unresolved: string[] = [];
  for (const [slug, abbr] of Object.entries(slugIndexOnDisk)) {
    if (slugsPerStateFile.get(abbr)?.has(slug)) resolvable++;
    else if (unresolved.length < 10) unresolved.push(`${slug} -> ${abbr}`);
  }

  // --- report ---
  const totalStateBytes = stateFiles.reduce((s, f) => s + f.bytes, 0);
  console.log('\n=== OUTPUT ===');
  console.log(
    `data/static/cemeteries/*.json   ${stateFiles.length} files, ${rows.length} records, ${formatBytes(totalStateBytes)}`
  );
  for (const f of stateFiles) {
    console.log(
      `  ${f.abbr.padEnd(4)} ${String(f.count).padStart(6)} records  ${formatBytes(f.bytes).padStart(9)}`
    );
  }
  console.log(`data/static/slug-index.json     ${slugCount} slugs, ${formatBytes(slugIndexBytes)}`);
  console.log(`data/static/stats.json          ${formatBytes(statsBytes)}`);
  console.log(`  ${JSON.stringify(stats)}`);
  console.log(`data/static/geo.json            ${geo.length} points, ${formatBytes(geoBytes)}`);
  console.log(
    `data/static/facets.json         ${facets.states.length} states / ${facets.counties.length} counties / ${facets.cities.length} cities / ${facets.types.length} types, ${formatBytes(facetsBytes)}`
  );
  console.log(
    `data/static/featured.json       ${featured.length} records, ${formatBytes(featuredBytes)}`
  );
  console.log(
    `data/static/state-alias-index.json ${Object.keys(aliasIndex).length} state names / ${aliasRecords} foreign-shard records, ${formatBytes(aliasBytes)}`
  );
  if (feedbackCount) {
    console.log(
      `data/static/website-feedback.json ${feedbackCount} records, ${formatBytes(feedbackBytes)}`
    );
  }

  console.log('\n=== VERIFICATION ===');
  console.log(`rows in export                : ${rows.length}`);
  console.log(`unique slugs in index         : ${slugCount}`);
  console.log(`duplicate slugs in export     : ${duplicateSlugs}`);
  console.log(`slugs resolvable to a record  : ${resolvable} / ${slugCount}`);
  console.log(`records without lat/lng       : ${rows.length - geo.length}`);
  if (unresolved.length) console.log(`unresolved (first 10)         : ${unresolved.join(', ')}`);
  if (resolvable !== slugCount || slugCount + duplicateSlugs !== rows.length) {
    console.error('VERIFICATION FAILED');
    process.exit(1);
  }
  console.log('VERIFICATION OK');
}

main();
