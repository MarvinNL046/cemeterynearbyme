/**
 * verify-state-parity.ts
 *
 * Proves that the static data layer reproduces the ORIGINAL SQL predicate
 *
 *   WHERE state ILIKE $1 OR state_abbr ILIKE $1
 *
 * for every state-scoped function, by re-running that predicate directly over
 * the Neon export and comparing with what lib/data.ts returns.
 *
 * Usage (from the repo root):
 *   npx tsx scripts/verify-state-parity.ts <exportDir>
 */

import fs from 'fs';
import path from 'path';
import * as d from '../lib/data';

const ROOT = process.cwd();
const EXPORT_DIR = path.resolve(
  process.argv[2] || process.env.EXPORT_DIR || path.join(ROOT, 'export')
);
const CEMETERIES_EXPORT = path.join(EXPORT_DIR, 'cemeterynearbyme_com__cemeteries.json');

interface Row {
  slug: string;
  city: string;
  county: string | null;
  state: string;
  state_abbr: string;
}

const norm = (v: string | null | undefined) => (typeof v === 'string' ? v.trim().toLowerCase() : null);

/** ILIKE with no wildcards: case-insensitive equality, NULL never matches. */
const ilike = (value: string | null | undefined, pattern: string) =>
  value === null || value === undefined ? false : norm(value) === norm(pattern);

/** The original WHERE clause. */
const oldSqlStatePredicate = (row: Row, arg: string) =>
  ilike(row.state, arg) || ilike(row.state_abbr, arg);

// States the review named as the ones that shifted, plus a few controls.
const STATES = [
  'Tennessee',
  'Ohio',
  'Texas',
  'Illinois',
  'Alabama',
  'District of Columbia',
  'Georgia',
  'Colorado',
  'Nebraska',
  'Wyoming',
  'North Dakota',
  'Delaware',
  'California',
];

let failures = 0;

function check(label: string, ok: boolean, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `   ${detail}` : ''}`);
}

async function main() {
  const rows: Row[] = JSON.parse(fs.readFileSync(CEMETERIES_EXPORT, 'utf-8'));
  console.log(`export: ${rows.length.toLocaleString()} rows\n`);

  console.log('=== getCemeteriesByState — old SQL vs static layer ===');
  for (const state of STATES) {
    const expected = rows.filter((r) => oldSqlStatePredicate(r, state));
    const actual = await d.getCemeteriesByState(state);

    const expectedSlugs = new Set(expected.map((r) => r.slug));
    const actualSlugs = new Set(actual.map((c) => c.slug));
    const sameSet =
      expectedSlugs.size === actualSlugs.size && [...expectedSlugs].every((s) => actualSlugs.has(s));

    check(
      `${state.padEnd(22)} ${String(expected.length).padStart(6)} records`,
      expected.length === actual.length && sameSet,
      expected.length === actual.length ? '' : `got ${actual.length}`
    );
  }

  console.log('\n=== abbreviation argument (state_abbr branch) ===');
  for (const abbr of ['TN', 'OH', 'TX', 'DC', 'WY']) {
    const expected = rows.filter((r) => oldSqlStatePredicate(r, abbr));
    const actual = await d.getCemeteriesByState(abbr);
    check(
      `${abbr.padEnd(22)} ${String(expected.length).padStart(6)} records`,
      expected.length === actual.length,
      expected.length === actual.length ? '' : `got ${actual.length}`
    );
  }

  console.log('\n=== getCountiesByState / getCitiesByState (SELECT DISTINCT) ===');
  for (const state of STATES) {
    const inState = rows.filter((r) => oldSqlStatePredicate(r, state));

    const expCounties = [...new Set(inState.map((r) => r.county).filter((c): c is string => !!c))].sort(
      (a, b) => a.localeCompare(b)
    );
    const actCounties = await d.getCountiesByState(state);
    check(
      `counties ${state.padEnd(22)} ${String(expCounties.length).padStart(5)}`,
      expCounties.length === actCounties.length && expCounties.every((c, i) => c === actCounties[i]),
      `got ${actCounties.length}`
    );

    const expCities = [...new Set(inState.map((r) => r.city).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    );
    const actCities = await d.getCitiesByState(state);
    check(
      `cities   ${state.padEnd(22)} ${String(expCities.length).padStart(5)}`,
      expCities.length === actCities.length && expCities.every((c, i) => c === actCities[i]),
      `got ${actCities.length}`
    );
  }

  console.log('\n=== getCemeteriesByCity / getCemeteriesByCounty with a state argument ===');
  const cityCases: Array<[string, string]> = [
    ['Memphis', 'Tennessee'],
    ['Columbus', 'Ohio'],
    ['Houston', 'Texas'],
    ['Chicago', 'Illinois'],
    ['Washington', 'District of Columbia'],
  ];
  for (const [city, state] of cityCases) {
    const expected = rows.filter((r) => ilike(r.city, city) && oldSqlStatePredicate(r, state));
    const actual = await d.getCemeteriesByCity(city, state);
    check(
      `city ${`${city}, ${state}`.padEnd(34)} ${String(expected.length).padStart(4)}`,
      expected.length === actual.length,
      `got ${actual.length}`
    );
  }

  const countyCases: Array<[string, string]> = [
    ['Shelby County', 'Tennessee'],
    ['Franklin County', 'Ohio'],
    ['Harris County', 'Texas'],
    ['Cook County', 'Illinois'],
  ];
  for (const [county, state] of countyCases) {
    const expected = rows.filter((r) => ilike(r.county, county) && oldSqlStatePredicate(r, state));
    const actual = await d.getCemeteriesByCounty(county, state);
    check(
      `county ${`${county}, ${state}`.padEnd(32)} ${String(expected.length).padStart(4)}`,
      expected.length === actual.length,
      `got ${actual.length}`
    );
  }

  console.log('\n=== searchCemeteries state filter (pre-limit population) ===');
  for (const state of ['Tennessee', 'Ohio', 'Alabama', 'District of Columbia']) {
    const expected = rows.filter(
      (r) => oldSqlStatePredicate(r, state) && r.city.toLowerCase().includes('a')
    );
    const actual = await d.searchCemeteries('a', { state });
    // searchCemeteries caps at 100, so the population is compared through the cap.
    // Which 100 differs by design (see the NULLS FIRST note in lib/data.ts);
    // the state predicate itself must hold for every returned record.
    const expectedCapped = Math.min(expected.length, 100);
    check(
      `search ${state.padEnd(22)} ${String(expectedCapped).padStart(3)} of ${String(expected.length).padStart(5)}`,
      actual.length === expectedCapped &&
        actual.every((c) => ilike(c.state, state) || ilike(c.state_abbr, state)),
      `got ${actual.length}`
    );
  }

  console.log('\n=== /state, /state/[state] and footer agree (task D) ===');
  const summaries = await d.getStateSummaries();
  for (const state of STATES) {
    const summary = summaries.find((s) => s.name === state);
    const detailPage = await d.getCemeteriesByState(state);
    check(
      `summary vs detail page ${state.padEnd(22)}`,
      !!summary && summary.cemeteryCount === detailPage.length,
      `${summary?.cemeteryCount} vs ${detailPage.length}`
    );
  }

  const { getTopStatesByCemeteryCount } = await import('../lib/footer-data');
  const footer = await getTopStatesByCemeteryCount(50);
  let footerMismatch = 0;
  for (const f of footer) {
    const summary = summaries.find((s) => s.name === f.name);
    if (!summary || summary.cemeteryCount !== f.count) footerMismatch++;
  }
  check(`footer counts match summaries (${footer.length} states)`, footerMismatch === 0, `${footerMismatch} mismatches`);

  console.log(`\n${failures === 0 ? 'ALL PARITY CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
