#!/usr/bin/env npx tsx
/**
 * 404 Checker - Scant alle URLs uit de sitemap en checkt op 404s
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const CONCURRENCY = 10;

interface CheckResult {
  url: string;
  status: number;
  ok: boolean;
  error?: string;
}

async function getUrlsFromSitemap(): Promise<string[]> {
  const urls: string[] = [];

  // Load cemeteries for dynamic routes
  const cemeteriesFile = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
  const cemeteries = JSON.parse(fs.readFileSync(cemeteriesFile, 'utf-8'));

  // Static pages
  const staticPages = [
    '/',
    '/zoeken',
    '/vergelijk',
    '/provincie',
    '/type',
    '/blog',
    '/over-ons',
    '/contact',
    '/privacy',
    '/voorwaarden',
    '/login',
    '/register',
  ];

  urls.push(...staticPages.map(p => `${BASE_URL}${p}`));

  // Cemetery pages (sample - first 100)
  const sampleCemeteries = cemeteries.slice(0, 100);
  for (const c of sampleCemeteries) {
    urls.push(`${BASE_URL}/begraafplaats/${c.slug}`);
  }

  // Province pages
  const provinces = [...new Set(cemeteries.map((c: any) => c.provincie))];
  for (const p of provinces) {
    if (p) {
      const slug = p.toLowerCase().replace(/\s+/g, '-');
      urls.push(`${BASE_URL}/provincie/${slug}`);
    }
  }

  // Municipality pages (sample - first 50)
  const municipalities = [...new Set(cemeteries.map((c: any) => c.gemeente))].slice(0, 50);
  for (const m of municipalities) {
    if (m) {
      const slug = (m as string).toLowerCase().replace(/\s+/g, '-');
      urls.push(`${BASE_URL}/gemeente/${slug}`);
    }
  }

  // Type pages
  const types = [...new Set(cemeteries.map((c: any) => c.type))];
  for (const t of types) {
    if (t) {
      const slug = t.toLowerCase().replace(/\s+/g, '-');
      urls.push(`${BASE_URL}/type/${slug}`);
    }
  }

  return urls;
}

async function checkUrl(url: string): Promise<CheckResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow'
    });

    clearTimeout(timeout);

    return {
      url,
      status: response.status,
      ok: response.ok
    };
  } catch (error: any) {
    return {
      url,
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

async function checkBatch(urls: string[]): Promise<CheckResult[]> {
  return Promise.all(urls.map(checkUrl));
}

async function main() {
  console.log('🔍 404 Checker voor BegraafplaatsInDeBuurt.nl');
  console.log('=============================================\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // First check if server is running
  try {
    await fetch(BASE_URL);
  } catch (error) {
    console.error('❌ Server niet bereikbaar! Start eerst de dev server:\n');
    console.log('   npm run dev\n');
    process.exit(1);
  }

  console.log('📋 URLs verzamelen...');
  const urls = await getUrlsFromSitemap();
  console.log(`   ${urls.length} URLs gevonden\n`);

  console.log('🔄 Checken...\n');

  const results: CheckResult[] = [];
  const broken: CheckResult[] = [];

  // Process in batches
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await checkBatch(batch);

    for (const result of batchResults) {
      results.push(result);

      if (!result.ok) {
        broken.push(result);
        console.log(`❌ ${result.status || 'ERR'} ${result.url}${result.error ? ` (${result.error})` : ''}`);
      } else {
        process.stdout.write('.');
      }
    }
  }

  console.log('\n\n📊 Resultaten:');
  console.log('==============');
  console.log(`Totaal gecheckt:  ${results.length}`);
  console.log(`✅ OK:            ${results.filter(r => r.ok).length}`);
  console.log(`❌ Broken:        ${broken.length}`);

  if (broken.length > 0) {
    console.log('\n🚨 Broken URLs:');
    console.log('---------------');

    const by404 = broken.filter(r => r.status === 404);
    const by500 = broken.filter(r => r.status >= 500);
    const byError = broken.filter(r => r.status === 0);
    const byOther = broken.filter(r => r.status > 0 && r.status !== 404 && r.status < 500);

    if (by404.length > 0) {
      console.log(`\n404 Not Found (${by404.length}):`);
      by404.forEach(r => console.log(`  ${r.url}`));
    }

    if (by500.length > 0) {
      console.log(`\n5xx Server Errors (${by500.length}):`);
      by500.forEach(r => console.log(`  ${r.status} ${r.url}`));
    }

    if (byError.length > 0) {
      console.log(`\nConnection Errors (${byError.length}):`);
      byError.forEach(r => console.log(`  ${r.url} - ${r.error}`));
    }

    if (byOther.length > 0) {
      console.log(`\nOther Errors (${byOther.length}):`);
      byOther.forEach(r => console.log(`  ${r.status} ${r.url}`));
    }

    const logFile = path.join(process.cwd(), 'data', 'broken-links.json');
    fs.writeFileSync(logFile, JSON.stringify(broken, null, 2));
    console.log(`\n💾 Saved to ${logFile}`);
  } else {
    console.log('\n🎉 Geen broken links gevonden!');
  }
}

main().catch(console.error);
