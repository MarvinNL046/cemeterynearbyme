/**
 * Script om begraafplaats types te updaten op basis van de naam
 *
 * Voert de volgende types in:
 * - algemene begraafplaats (default)
 * - joodse begraafplaats (behouden)
 * - bijzondere begraafplaats (behouden)
 * - rooms-katholieke begraafplaats (nieuw)
 * - protestantse begraafplaats (nieuw)
 * - natuurbegraafplaats (nieuw)
 * - islamitische begraafplaats (nieuw)
 *
 * Run: npx tsx scripts/update-cemetery-types.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface Cemetery {
  naam_begraafplaats: string;
  type: string;
  [key: string]: unknown;
}

// Detectie regels voor types (volgorde is belangrijk - specifiekere eerst)
const typeDetectionRules: Array<{
  type: string;
  patterns: RegExp[];
}> = [
  {
    type: 'joodse begraafplaats',
    patterns: [/jood/i, /joods/i, /jewish/i, /israelit/i]
  },
  {
    type: 'islamitische begraafplaats',
    patterns: [/islam/i, /mosli/i, /muslim/i, /moslim/i]
  },
  {
    type: 'natuurbegraafplaats',
    patterns: [/natuur/i, /natuurbegr/i, /natural/i]
  },
  {
    type: 'rooms-katholieke begraafplaats',
    patterns: [
      /katholiek/i,
      /r\.k\./i,
      /rk\s/i,
      /rk-/i,
      /parochie/i,
      /st\.\s/i,        // St. (Sint)
      /sint[\s-]/i,
      /heilig/i,
      /h\.\s/i,         // H. (Heilig)
      /o\.l\.v/i,       // Onze Lieve Vrouwe
      /maria/i
    ]
  },
  {
    type: 'protestantse begraafplaats',
    patterns: [
      /protestant/i,
      /hervormd/i,
      /gereformeer/i,
      /reformator/i,
      /evangelis/i,
      /luthers/i,
      /doopsgezind/i,
      /remonstrant/i,
      /nh\s/i,          // NH (Nederlands Hervormd)
      /nh-/i,
      /n\.h\./i
    ]
  },
  {
    type: 'bijzondere begraafplaats',
    patterns: [
      /oorlog/i,
      /military/i,
      /war\s/i,
      /soldaten/i,
      /ereveld/i,
      /ere-veld/i,
      /commonwealth/i,
      /cremator/i       // Crematoria als bijzonder
    ]
  }
];

function detectType(name: string, currentType: string): string {
  // Als het al een specifiek type heeft (niet algemeen), behoud het
  if (currentType !== 'algemene begraafplaats') {
    return currentType;
  }

  // Check tegen alle detectie regels
  for (const rule of typeDetectionRules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(name)) {
        return rule.type;
      }
    }
  }

  // Default: blijft algemene begraafplaats
  return 'algemene begraafplaats';
}

async function updateCemeteryTypes() {
  const dataPath = path.join(process.cwd(), 'public/data/cemeteries.json');
  const backupPath = path.join(process.cwd(), 'public/data/cemeteries.backup.json');

  console.log('🏁 Start updating cemetery types...\n');

  // Lees de data
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const cemeteries: Cemetery[] = JSON.parse(rawData);

  console.log(`📊 Totaal aantal begraafplaatsen: ${cemeteries.length}\n`);

  // Maak backup
  fs.writeFileSync(backupPath, rawData);
  console.log(`💾 Backup gemaakt: ${backupPath}\n`);

  // Tel huidige types
  const beforeCounts: Record<string, number> = {};
  cemeteries.forEach(c => {
    beforeCounts[c.type] = (beforeCounts[c.type] || 0) + 1;
  });

  console.log('📋 Types VOOR update:');
  Object.entries(beforeCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  console.log('');

  // Update types
  let updatedCount = 0;
  const changes: Array<{ name: string; from: string; to: string }> = [];

  cemeteries.forEach(cemetery => {
    const oldType = cemetery.type;
    const newType = detectType(cemetery.naam_begraafplaats, oldType);

    if (newType !== oldType) {
      cemetery.type = newType;
      updatedCount++;
      changes.push({
        name: cemetery.naam_begraafplaats,
        from: oldType,
        to: newType
      });
    }
  });

  // Tel nieuwe types
  const afterCounts: Record<string, number> = {};
  cemeteries.forEach(c => {
    afterCounts[c.type] = (afterCounts[c.type] || 0) + 1;
  });

  console.log('📋 Types NA update:');
  Object.entries(afterCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const diff = count - (beforeCounts[type] || 0);
      const diffStr = diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : '';
      console.log(`   ${type}: ${count}${diffStr}`);
    });
  console.log('');

  console.log(`✅ ${updatedCount} begraafplaatsen bijgewerkt\n`);

  // Toon enkele voorbeelden van wijzigingen
  if (changes.length > 0) {
    console.log('📝 Voorbeelden van wijzigingen:');
    const examples = changes.slice(0, 15);
    examples.forEach(change => {
      console.log(`   "${change.name}"`);
      console.log(`      ${change.from} → ${change.to}`);
    });
    if (changes.length > 15) {
      console.log(`   ... en ${changes.length - 15} meer`);
    }
    console.log('');
  }

  // Schrijf de data terug
  fs.writeFileSync(dataPath, JSON.stringify(cemeteries, null, 2));
  console.log(`💾 Data opgeslagen: ${dataPath}`);

  // Update ook data/begraafplaatsen.json als die bestaat
  const altDataPath = path.join(process.cwd(), 'data/begraafplaatsen.json');
  if (fs.existsSync(altDataPath)) {
    fs.writeFileSync(altDataPath, JSON.stringify(cemeteries, null, 2));
    console.log(`💾 Data opgeslagen: ${altDataPath}`);
  }

  console.log('\n🎉 Klaar!');
}

updateCemeteryTypes().catch(console.error);
