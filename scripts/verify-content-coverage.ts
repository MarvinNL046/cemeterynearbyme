#!/usr/bin/env node
/**
 * Verify Content Coverage Script
 * Checkt of alle begraafplaatsen content hebben
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

async function main() {
  console.log(chalk.bold.cyan('\n=== Content Coverage Verification ===\n'));

  // Paths
  const dataDir = path.join(__dirname, '..', 'data');
  const begraafplaatsenPath = path.join(dataDir, 'begraafplaatsen.json');
  const scrapedDir = path.join(dataDir, 'scraped-begraafplaatsen');
  const enrichmentsDir = path.join(dataDir, 'enrichments-begraafplaatsen');

  // Load all cemeteries
  const begraafplaatsen = JSON.parse(fs.readFileSync(begraafplaatsenPath, 'utf-8'));
  const totalCemeteries = Object.keys(begraafplaatsen).length;

  // Check scraped content
  const scrapedFiles = fs.existsSync(scrapedDir) 
    ? fs.readdirSync(scrapedDir).filter(f => f.endsWith('.json'))
    : [];
  
  // Check enriched content
  const enrichedFiles = fs.existsSync(enrichmentsDir)
    ? fs.readdirSync(enrichmentsDir).filter(f => f.endsWith('.json'))
    : [];

  // Calculate coverage
  const scrapedCount = scrapedFiles.length;
  const enrichedCount = enrichedFiles.length;
  const scrapedPercentage = ((scrapedCount / totalCemeteries) * 100).toFixed(1);
  const enrichedPercentage = ((enrichedCount / totalCemeteries) * 100).toFixed(1);

  // Find missing
  const allSlugs = Object.keys(begraafplaatsen);
  const scrapedSlugs = scrapedFiles.map(f => f.replace('.json', ''));
  const enrichedSlugs = enrichedFiles.map(f => f.replace('.json', ''));
  
  const missingScraped = allSlugs.filter(slug => !scrapedSlugs.includes(slug));
  const missingEnriched = allSlugs.filter(slug => !enrichedSlugs.includes(slug));

  // Report
  console.log(chalk.bold('📊 Coverage Report:'));
  console.log(chalk.gray('─'.repeat(50)));
  
  console.log(chalk.bold(`Total begraafplaatsen: ${totalCemeteries}`));
  console.log();
  
  console.log(chalk.blue(`📥 Scraped content: ${scrapedCount}/${totalCemeteries} (${scrapedPercentage}%)`));
  if (scrapedPercentage === '100.0') {
    console.log(chalk.green('✅ All cemeteries have been scraped!'));
  } else {
    console.log(chalk.yellow(`⚠️  Missing: ${missingScraped.length} cemeteries`));
  }
  
  console.log();
  console.log(chalk.magenta(`✨ Enriched content: ${enrichedCount}/${totalCemeteries} (${enrichedPercentage}%)`));
  if (enrichedPercentage === '100.0') {
    console.log(chalk.green('✅ All cemeteries have been enriched!'));
  } else {
    console.log(chalk.yellow(`⚠️  Missing: ${missingEnriched.length} cemeteries`));
  }

  // AdSense readiness
  console.log();
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.bold('🎯 AdSense Readiness:'));
  
  if (enrichedPercentage === '100.0') {
    console.log(chalk.green('✅ 100% content coverage achieved!'));
    console.log(chalk.green('✅ Ready for AdSense application!'));
  } else {
    const remaining = totalCemeteries - enrichedCount;
    const estimatedCost = (remaining * 0.002).toFixed(2);
    console.log(chalk.yellow(`⏳ Need to enrich ${remaining} more pages`));
    console.log(chalk.yellow(`💰 Estimated cost: €${estimatedCost}`));
  }

  // Show examples of missing (if any)
  if (missingEnriched.length > 0 && missingEnriched.length <= 10) {
    console.log();
    console.log(chalk.gray('Missing enrichments:'));
    missingEnriched.forEach(slug => {
      console.log(chalk.gray(`  - ${slug}`));
    });
  } else if (missingEnriched.length > 10) {
    console.log();
    console.log(chalk.gray(`First 10 missing enrichments:`));
    missingEnriched.slice(0, 10).forEach(slug => {
      console.log(chalk.gray(`  - ${slug}`));
    });
    console.log(chalk.gray(`  ... and ${missingEnriched.length - 10} more`));
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    total: totalCemeteries,
    scraped: {
      count: scrapedCount,
      percentage: scrapedPercentage,
      missing: missingScraped
    },
    enriched: {
      count: enrichedCount,
      percentage: enrichedPercentage,
      missing: missingEnriched
    },
    adsenseReady: enrichedPercentage === '100.0'
  };

  const reportPath = path.join(dataDir, 'content-coverage-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log();
  console.log(chalk.gray(`Detailed report saved to: ${reportPath}`));
}

main().catch(console.error);