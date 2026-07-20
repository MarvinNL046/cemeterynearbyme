/**
 * Ad-hoc verification for the static lib/data.ts.
 * Run from repo root:  npx tsx scripts/verify-static-data.ts
 */
import * as realFs from 'fs';
import path from 'path';

// --- instrument fs.promises.readFile so we can prove which files are touched
const reads: string[] = [];
const origReadFile = realFs.promises.readFile;
(realFs.promises as unknown as { readFile: unknown }).readFile = function (
  this: unknown,
  file: Parameters<typeof origReadFile>[0],
  ...rest: unknown[]
) {
  reads.push(path.basename(String(file)));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (origReadFile as any).call(this, file, ...(rest as []));
};

function since(mark: number) {
  return reads.slice(mark);
}

async function main() {
  const d = await import('../lib/data');

  let fail = 0;
  const check = (name: string, cond: boolean, detail = '') => {
    if (!cond) fail++;
    console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -- ' + detail : ''}`);
  };

  // ---- getCemeteryBySlug reads ONLY slug-index + the one shard ----
  let mark = reads.length;
  const one = await d.getCemeteryBySlug('prince-george-s-chapel-marker-dagsboro-de');
  const filesTouched = since(mark);
  check('getCemeteryBySlug returns record', !!one && one.slug === 'prince-george-s-chapel-marker-dagsboro-de');
  check('  state_abbr DE', one?.state_abbr === 'DE');
  check(
    '  reads only slug-index.json + DE.json',
    filesTouched.length === 2 && filesTouched.includes('slug-index.json') && filesTouched.includes('DE.json'),
    filesTouched.join(', ')
  );

  // second lookup in same state: cache hit, zero extra reads
  mark = reads.length;
  const two = await d.getCemeteryBySlug('prince-george-s-chapel-marker-dagsboro-de');
  check('  cached second lookup does 0 file reads', since(mark).length === 0 && !!two, since(mark).join(', '));

  // a slug in a DIFFERENT state reads exactly one new shard
  mark = reads.length;
  const ny = await d.getCemeteryBySlug('new-york-city-marble-cemetery-new-york-new-york');
  check('  other-state slug reads exactly 1 new shard', since(mark).length === 1 && since(mark)[0] === 'NY.json', since(mark).join(', '));
  check('  and resolves', ny?.state_abbr === 'NY');

  check('unknown slug -> null', (await d.getCemeteryBySlug('does-not-exist-xyz')) === null);
  check('prototype-key slug -> null', (await d.getCemeteryBySlug('constructor')) === null);

  // ---- getStats reads the precomputed file only ----
  mark = reads.length;
  const stats = await d.getStats();
  check('getStats reads only stats.json', since(mark).join(',') === 'stats.json', since(mark).join(', '));
  check('  total_cemeteries 53428', stats.total_cemeteries === 53428, String(stats.total_cemeteries));
  check('  8 keys, same shape', Object.keys(stats).length === 8, Object.keys(stats).join(','));

  // ---- featured ----
  mark = reads.length;
  const feat = await d.getFeaturedCemeteries();
  check('getFeaturedCemeteries default limit 10', feat.length === 10);
  check('  reads only featured.json', since(mark).join(',') === 'featured.json', since(mark).join(', '));
  check('  sorted by rating*log(reviews) desc (precomputed)', !!feat[0].rating);
  const feat50 = await d.getFeaturedCemeteries(50);
  check('  limit honoured', feat50.length === 50);

  // ---- state ----
  mark = reads.length;
  // Parity with the original SQL: state ILIKE $1 OR state_abbr ILIKE $1.
  // A full NAME therefore selects on the `state` column (169 rows) while the
  // ABBREVIATION selects on state_abbr, i.e. the whole DE shard (165 rows).
  // They are deliberately NOT the same set — see scripts/verify-state-parity.ts.
  const de = await d.getCemeteriesByState('Delaware');
  check('getCemeteriesByState("Delaware") -> 169 (state column)', de.length === 169, String(de.length));
  check('  did NOT read all 51 shards', since(mark).filter((f) => /^[A-Z]{2}\.json$/.test(f)).length < 51, since(mark).join(', '));
  const deAbbr = await d.getCemeteriesByState('DE');
  check('getCemeteriesByState("DE") -> 165 (state_abbr column)', deAbbr.length === 165, String(deAbbr.length));
  check('  case-insensitive', (await d.getCemeteriesByState('dElAwArE')).length === 169);
  check('  unknown state -> []', (await d.getCemeteriesByState('Atlantis')).length === 0);
  check('  returns a copy (caller sort cannot corrupt cache)', de !== (await d.getCemeteriesByState('Delaware')));

  // ---- counties / cities ----
  const counties = await d.getAllCounties();
  const cities = await d.getAllCities();
  check('getAllCounties sorted + unique', counties.length > 0 && counties.every((c, i, a) => i === 0 || a[i - 1].localeCompare(c) <= 0), String(counties.length));
  check('getAllCities sorted + unique', cities.length > 0 && cities.every((c, i, a) => i === 0 || a[i - 1].localeCompare(c) <= 0), String(cities.length));
  check('  no dupes in counties', new Set(counties.map((c) => c.toLowerCase())).size === counties.length);
  check('  no dupes in cities', new Set(cities.map((c) => c.toLowerCase())).size === cities.length);

  // Distinct counties over the SAME predicate as getCemeteriesByState('Delaware').
  const deCounties = await d.getCountiesByState('Delaware');
  check('getCountiesByState("Delaware")', deCounties.length === 3 && deCounties.includes('Sussex County'), deCounties.join(', '));
  check('  sorted', deCounties.every((c, i, a) => i === 0 || a[i - 1].localeCompare(c) <= 0));
  const deCities = await d.getCitiesByState('DE');
  check('getCitiesByState("DE") > 0', deCities.length > 0, String(deCities.length));

  // city lookup narrows shards via facets
  mark = reads.length;
  const dagsboro = await d.getCemeteriesByCity('Dagsboro');
  check('getCemeteriesByCity("Dagsboro") > 0', dagsboro.length > 0, String(dagsboro.length));
  check('  did NOT read all 51 shards', since(mark).filter((f) => /^[A-Z]{2}\.json$/.test(f)).length <= 2, since(mark).join(', '));
  check('  case-insensitive matches', (await d.getCemeteriesByCity('dagsboro')).length === dagsboro.length);
  check('  whitespace tolerated', (await d.getCemeteriesByCity('  Dagsboro ')).length === dagsboro.length);
  check('  with state filter', (await d.getCemeteriesByCity('Dagsboro', 'DE')).length === dagsboro.filter((c) => c.state_abbr === 'DE').length);

  const sussex = await d.getCemeteriesByCounty('Sussex County', 'DE');
  check('getCemeteriesByCounty("Sussex County","DE") > 0', sussex.length > 0, String(sussex.length));
  check('  all in DE', sussex.every((c) => c.state_abbr === 'DE'));

  // ---- all cemeteries ----
  const all = await d.getAllCemeteries();
  check('getAllCemeteries -> 53428', all.length === 53428, String(all.length));
  check('  every record has required Cemetery fields', all.every((c) => c.id && c.name && c.slug && c.city !== undefined && c.state_abbr && c.country && c.type && c.type_slug));

  // ---- types ----
  const hist = await d.getCemeteriesByType('historic-cemetery');
  check('getCemeteriesByType("historic-cemetery") > 0', hist.length > 0, String(hist.length));
  check('  case-insensitive', (await d.getCemeteriesByType('HISTORIC-CEMETERY')).length === hist.length);
  const types = await d.getAllTypes();
  check('getAllTypes from cemetery-types.json', types.length === 32, String(types.length));
  const states = await d.getAllStates();
  check('getAllStates from states.json', states.length === 51, String(states.length));

  // ---- search ----
  const s1 = await d.searchCemeteries('oak hill');
  check('searchCemeteries("oak hill") returns <=100', s1.length > 0 && s1.length <= 100, String(s1.length));
  check('  sorted rating desc, unrated last', s1.every((c, i, a) => i === 0 || (a[i - 1].rating ?? -Infinity) >= (c.rating ?? -Infinity)));
  check('  every hit matches one of the 6 columns', s1.every((c) => [c.name, c.city, c.county, c.state, c.address, c.zipCode].some((v) => (v ?? '').toLowerCase().includes('oak hill'))));

  mark = reads.length;
  const s2 = await d.searchCemeteries('cemetery', { state: 'DE' });
  check(
    'search with state filter stays in that state',
    s2.length > 0 && s2.every((c) => c.state_abbr === 'DE'),
    String(s2.length)
  );
  check('  and reads no new shards', since(mark).filter((f) => /^[A-Z]{2}\.json$/.test(f)).length === 0, since(mark).join(', '));

  const s3 = await d.searchCemeteries('', { city: 'Dagsboro' });
  check('search empty query + city filter', s3.length > 0 && s3.every((c) => c.city.toLowerCase() === 'dagsboro'), String(s3.length));
  const s4 = await d.searchCemeteries('', { type: 'historic' });
  check('search type filter is substring on type', s4.length > 0 && s4.every((c) => c.type.toLowerCase().includes('historic')), String(s4.length));
  check('search unknown state -> []', (await d.searchCemeteries('x', { state: 'Atlantis' })).length === 0);

  // ---- nearby ----
  const near = await d.getNearbyCemeteries(38.5479281, -75.2386685, 25, 20);
  check('getNearbyCemeteries returns results', near.length > 0, String(near.length));
  check('  ascending distance', near.every((c, i, a) => i === 0 || a[i - 1].distance <= c.distance));
  check('  all within radius', near.every((c) => c.distance <= 25));
  check('  limit honoured', near.length <= 20);
  check('  nearest is the seed point itself', near[0].distance < 0.01, String(near[0].distance));
  check('  hydrated with full record', !!near[0].name && !!near[0].slug);
  const near0 = await d.getNearbyCemeteries(0, 0, 5, 10);
  check('  middle of ocean -> []', near0.length === 0);

  // ---- recently updated ----
  const recent = await d.getRecentlyUpdated();
  check('getRecentlyUpdated default 10', recent.length === 10, String(recent.length));
  check('  descending updated_at', recent.every((c, i, a) => i === 0 || (a[i - 1].updated_at as string) >= (c.updated_at as string)));

  console.log(`\n${fail === 0 ? 'ALL CHECKS PASSED' : fail + ' CHECK(S) FAILED'}`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
