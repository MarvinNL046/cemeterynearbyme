import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

interface Begraafplaats {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  slug: string;
  type: string;
  website?: string;
}

async function analyzeDataQuality() {
  console.log(chalk.bold.blue('\n🔍 Cemetery Data Quality Analysis\n'));

  // Load data
  const dataFile = path.join(__dirname, '..', 'public', 'data', 'cemeteries.json');
  let begraafplaatsen: Begraafplaats[];

  try {
    begraafplaatsen = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  } catch (error) {
    console.error(chalk.red('❌ Could not load cemeteries.json'));
    process.exit(1);
  }

  console.log(chalk.cyan(`Total entries: ${begraafplaatsen.length}`));

  // Analyze generic names
  const genericNames = ['cemetery', 'begraafplaats', 'kerkhof'];
  const genericEntries = begraafplaatsen.filter(b => 
    genericNames.includes(b.naam_begraafplaats.toLowerCase().trim())
  );

  console.log(chalk.yellow(`\n📊 Generic name entries: ${genericEntries.length}`));
  if (genericEntries.length > 0) {
    console.log(chalk.gray('\nGeneric entries by gemeente:'));
    genericEntries.forEach(entry => {
      console.log(chalk.gray(`  - "${entry.naam_begraafplaats}" in ${entry.gemeente} (${entry.provincie})`));
    });
  }

  // Analyze suspicious patterns
  console.log(chalk.yellow('\n🚨 Suspicious patterns:'));
  
  // Entries without Dutch names
  const nonDutchPattern = /^[A-Za-z\s]+$/;
  const suspiciousNames = begraafplaatsen.filter(b => 
    nonDutchPattern.test(b.naam_begraafplaats) && 
    !b.naam_begraafplaats.toLowerCase().includes('begraafplaats') &&
    !b.naam_begraafplaats.toLowerCase().includes('kerkhof')
  );

  console.log(chalk.gray(`\nEnglish-only names: ${suspiciousNames.length}`));
  suspiciousNames.slice(0, 10).forEach(entry => {
    console.log(chalk.gray(`  - "${entry.naam_begraafplaats}" in ${entry.gemeente}`));
  });

  // Analyze duplicates
  const nameGemeentePairs = begraafplaatsen.map(b => `${b.naam_begraafplaats}|${b.gemeente}`);
  const duplicates = nameGemeentePairs.filter((item, index) => nameGemeentePairs.indexOf(item) !== index);
  console.log(chalk.gray(`\nDuplicate entries: ${duplicates.length}`));

  // Province analysis
  console.log(chalk.cyan('\n📍 Province distribution:'));
  const provinceCounts: Record<string, number> = {};
  begraafplaatsen.forEach(b => {
    provinceCounts[b.provincie] = (provinceCounts[b.provincie] || 0) + 1;
  });
  
  Object.entries(provinceCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([province, count]) => {
      console.log(chalk.gray(`  - ${province}: ${count} entries`));
    });

  // Recommendations
  console.log(chalk.bold.green('\n✅ Recommendations:'));
  console.log('1. Filter out entries with generic names like "Cemetery"');
  console.log('2. Verify province assignments (e.g., Zelhem should be in Gelderland, not Overijssel)');
  console.log('3. Remove or merge duplicate entries');
  console.log(`4. Consider removing ${genericEntries.length} generic entries before scraping`);
  
  // Export problematic entries
  const problematicEntries = {
    genericNames: genericEntries,
    suspiciousNames: suspiciousNames.slice(0, 20),
    totalEntries: begraafplaatsen.length,
    cleanEntries: begraafplaatsen.length - genericEntries.length
  };

  const outputFile = path.join(__dirname, '..', 'data', 'data-quality-report.json');
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(problematicEntries, null, 2));
  
  console.log(chalk.magenta(`\n📄 Full report saved to: ${outputFile}`));
}

analyzeDataQuality().catch(console.error);