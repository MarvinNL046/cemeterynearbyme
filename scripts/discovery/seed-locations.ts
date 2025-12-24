#!/usr/bin/env npx tsx
/**
 * Seed Script voor Nederlandse Steden/Plaatsen (JSON-based)
 *
 * Genereert een JSON bestand met alle Nederlandse gemeenten en grote plaatsen
 * voor gebruik in het discovery script.
 *
 * Gebruik:
 *   npx tsx scripts/discovery/seed-locations.ts
 *   npx tsx scripts/discovery/seed-locations.ts --provincie "Noord-Holland"
 *   npx tsx scripts/discovery/seed-locations.ts --dry-run
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'discovery');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

// Alle 12 provincies met hun gemeenten en belangrijke plaatsen
// Data gebaseerd op CBS gemeentelijke indeling 2024
const NEDERLAND_DATA: Record<string, { gemeenten: string[]; extraPlaatsen?: Record<string, string[]> }> = {
  'Groningen': {
    gemeenten: [
      'Groningen', 'Het Hogeland', 'Westerkwartier', 'Midden-Groningen',
      'Oldambt', 'Pekela', 'Stadskanaal', 'Veendam', 'Westerwolde', 'Eemsdelta'
    ],
    extraPlaatsen: {
      'Het Hogeland': ['Bedum', 'Uithuizen', 'Winsum', 'Leens'],
      'Westerkwartier': ['Leek', 'Marum', 'Zuidhorn', 'Grootegast'],
      'Midden-Groningen': ['Hoogezand', 'Slochteren', 'Menterwolde'],
      'Oldambt': ['Winschoten', 'Scheemda', 'Reiderland'],
      'Eemsdelta': ['Appingedam', 'Delfzijl', 'Loppersum']
    }
  },
  'Friesland': {
    gemeenten: [
      'Leeuwarden', 'Súdwest-Fryslân', 'De Fryske Marren', 'Noardeast-Fryslân',
      'Smallingerland', 'Heerenveen', 'Opsterland', 'Waadhoeke', 'Tytsjerksteradiel',
      'Achtkarspelen', 'Dantumadiel', 'Harlingen', 'Weststellingwerf', 'Ooststellingwerf',
      'Ameland', 'Schiermonnikoog', 'Terschelling', 'Vlieland'
    ],
    extraPlaatsen: {
      'Súdwest-Fryslân': ['Sneek', 'Bolsward', 'Workum', 'IJlst', 'Stavoren'],
      'De Fryske Marren': ['Joure', 'Lemmer', 'Balk'],
      'Smallingerland': ['Drachten'],
      'Waadhoeke': ['Franeker', "St.-Annaparochie"],
      'Noardeast-Fryslân': ['Dokkum', 'Kollum']
    }
  },
  'Drenthe': {
    gemeenten: [
      'Assen', 'Emmen', 'Hoogeveen', 'Meppel', 'Coevorden', 'Borger-Odoorn',
      'Aa en Hunze', 'Midden-Drenthe', 'Noordenveld', 'Tynaarlo', 'Westerveld', 'De Wolden'
    ],
    extraPlaatsen: {
      'Aa en Hunze': ['Gieten', 'Anloo'],
      'Midden-Drenthe': ['Beilen', 'Westerbork'],
      'Noordenveld': ['Roden', 'Norg'],
      'De Wolden': ['Zuidwolde', 'Ruinen']
    }
  },
  'Overijssel': {
    gemeenten: [
      'Zwolle', 'Enschede', 'Deventer', 'Almelo', 'Hengelo', 'Kampen',
      'Hardenberg', 'Hellendoorn', 'Borne', 'Dalfsen', 'Dinkelland', 'Haaksbergen',
      'Losser', 'Oldenzaal', 'Olst-Wijhe', 'Ommen', 'Raalte', 'Rijssen-Holten',
      'Staphorst', 'Steenwijkerland', 'Tubbergen', 'Twenterand', 'Wierden', 'Zwartewaterland'
    ],
    extraPlaatsen: {
      'Hellendoorn': ['Nijverdal'],
      'Steenwijkerland': ['Steenwijk', 'Vollenhove', 'Giethoorn'],
      'Rijssen-Holten': ['Rijssen', 'Holten'],
      'Twenterand': ['Vriezenveen', 'Den Ham']
    }
  },
  'Flevoland': {
    gemeenten: [
      'Almere', 'Lelystad', 'Dronten', 'Noordoostpolder', 'Urk', 'Zeewolde'
    ],
    extraPlaatsen: {
      'Noordoostpolder': ['Emmeloord', 'Marknesse']
    }
  },
  'Gelderland': {
    gemeenten: [
      'Arnhem', 'Nijmegen', 'Apeldoorn', 'Ede', 'Doetinchem', 'Harderwijk',
      'Zutphen', 'Tiel', 'Wageningen', 'Barneveld', 'Winterswijk', 'Zevenaar',
      'Berkelland', 'Bronckhorst', 'Brummen', 'Buren', 'Culemborg', 'Duiven',
      'Elburg', 'Epe', 'Ermelo', 'Hattem', 'Heerde', 'Heumen', 'Lingewaard',
      'Lochem', 'Maasdriel', 'Montferland', 'Neder-Betuwe', 'Nijkerk', 'Nunspeet',
      'Oldebroek', 'Oost Gelre', 'Oude IJsselstreek', 'Overbetuwe', 'Putten',
      'Renkum', 'Rheden', 'Rozendaal', 'Scherpenzeel', 'Voorst', 'Westervoort',
      'West Betuwe', 'West Maas en Waal', 'Wijchen', 'Zaltbommel', 'Berg en Dal'
    ],
    extraPlaatsen: {
      'Berkelland': ['Borculo', 'Eibergen', 'Neede', 'Ruurlo'],
      'Bronckhorst': ['Hengelo (Gld)', 'Vorden', 'Zelhem'],
      'West Betuwe': ['Geldermalsen', 'Leerdam', 'Asperen'],
      'Oost Gelre': ['Groenlo', 'Lichtenvoorde'],
      'Oude IJsselstreek': ['Ulft', 'Gendringen', 'Terborg']
    }
  },
  'Utrecht': {
    gemeenten: [
      'Utrecht', 'Amersfoort', 'Veenendaal', 'Zeist', 'Nieuwegein', 'Houten',
      'IJsselstein', 'Leusden', 'Soest', 'Stichtse Vecht', 'De Bilt', 'Woerden',
      'Baarn', 'Bunnik', 'Bunschoten', 'De Ronde Venen', 'Lopik', 'Montfoort',
      'Oudewater', 'Renswoude', 'Rhenen', 'Utrechtse Heuvelrug', 'Vijfheerenlanden',
      'Wijk bij Duurstede', 'Woudenberg'
    ],
    extraPlaatsen: {
      'Stichtse Vecht': ['Maarssen', 'Breukelen', 'Loenen'],
      'De Ronde Venen': ['Mijdrecht', 'Wilnis', 'Vinkeveen'],
      'Utrechtse Heuvelrug': ['Driebergen', 'Doorn', 'Leersum', 'Amerongen'],
      'Vijfheerenlanden': ['Vianen', 'Meerkerk']
    }
  },
  'Noord-Holland': {
    gemeenten: [
      'Amsterdam', 'Haarlem', 'Zaanstad', 'Haarlemmermeer', 'Alkmaar', 'Amstelveen',
      'Hoorn', 'Purmerend', 'Hilversum', 'Den Helder', 'Velsen', 'Heerhugowaard',
      'Beverwijk', 'Castricum', 'Diemen', 'Drechterland', 'Enkhuizen', 'Edam-Volendam',
      'Heemskerk', 'Heemstede', 'Heiloo', 'Koggenland', 'Landsmeer', 'Langedijk',
      'Medemblik', 'Oostzaan', 'Opmeer', 'Ouder-Amstel', 'Schagen', 'Stede Broec',
      'Texel', 'Uitgeest', 'Uithoorn', 'Waterland', 'Wormerland', 'Zandvoort',
      'Bergen (NH)', 'Bloemendaal', 'Gooise Meren', 'Huizen', 'Laren', 'Blaricum', 'Wijdemeren'
    ],
    extraPlaatsen: {
      'Haarlemmermeer': ['Hoofddorp', 'Nieuw-Vennep', 'Badhoevedorp'],
      'Zaanstad': ['Zaandam', 'Koog aan de Zaan', 'Krommenie', 'Wormerveer'],
      'Velsen': ['IJmuiden', 'Velserbroek', 'Santpoort'],
      'Gooise Meren': ['Bussum', 'Naarden', 'Muiden'],
      'Schagen': ['Warmenhuizen'],
      'Waterland': ['Monnickendam', 'Marken']
    }
  },
  'Zuid-Holland': {
    gemeenten: [
      'Rotterdam', 'Den Haag', 'Leiden', 'Dordrecht', 'Zoetermeer', 'Delft',
      'Westland', 'Alphen aan den Rijn', 'Schiedam', 'Vlaardingen', 'Gouda',
      'Capelle aan den IJssel', 'Katwijk', 'Leidschendam-Voorburg', 'Maassluis',
      'Nissewaard', 'Noordwijk', 'Rijswijk', 'Pijnacker-Nootdorp', 'Waddinxveen',
      'Lansingerland', 'Papendrecht', 'Sliedrecht', 'Gorinchem', 'Hellevoetsluis',
      'Hendrik-Ido-Ambacht', 'Zwijndrecht', 'Barendrecht', 'Albrandswaard',
      'Goeree-Overflakkee', 'Hoeksche Waard', 'Krimpen aan den IJssel', 'Krimpenerwaard',
      'Lisse', 'Midden-Delfland', 'Molenlanden', 'Oegstgeest', 'Ridderkerk',
      'Teylingen', 'Voorschoten', 'Wassenaar', 'Hillegom', 'Bodegraven-Reeuwijk',
      'Zuidplas', 'Hardinxveld-Giessendam', 'Alblasserdam'
    ],
    extraPlaatsen: {
      'Westland': ['Naaldwijk', "'s-Gravenzande", 'Monster', 'Wateringen'],
      'Nissewaard': ['Spijkenisse', 'Hoogvliet'],
      'Goeree-Overflakkee': ['Middelharnis', 'Ouddorp', 'Goedereede'],
      'Hoeksche Waard': ['Oud-Beijerland', 'Strijen', "'s-Gravendeel"],
      'Krimpenerwaard': ['Schoonhoven', 'Bergambacht', 'Lekkerkerk'],
      'Teylingen': ['Sassenheim', 'Voorhout', 'Warmond'],
      'Molenlanden': ['Groot-Ammers', 'Nieuw-Lekkerland', 'Bleskensgraaf']
    }
  },
  'Zeeland': {
    gemeenten: [
      'Middelburg', 'Vlissingen', 'Goes', 'Terneuzen', 'Hulst', 'Schouwen-Duiveland',
      'Veere', 'Noord-Beveland', 'Borsele', 'Kapelle', 'Reimerswaal', 'Sluis', 'Tholen'
    ],
    extraPlaatsen: {
      'Schouwen-Duiveland': ['Zierikzee', 'Renesse', 'Bruinisse'],
      'Veere': ['Domburg', 'Oostkapelle', 'Vrouwenpolder'],
      'Sluis': ['Cadzand', 'Aardenburg', 'Breskens'],
      'Reimerswaal': ['Yerseke', 'Kruiningen']
    }
  },
  'Noord-Brabant': {
    gemeenten: [
      'Eindhoven', 'Tilburg', 'Breda', "'s-Hertogenbosch", 'Helmond', 'Roosendaal',
      'Oss', 'Bergen op Zoom', 'Waalwijk', 'Uden', 'Veldhoven', 'Oosterhout',
      'Meierijstad', 'Dongen', 'Woensdrecht', 'Geldrop-Mierlo', 'Heeze-Leende',
      'Best', 'Nuenen', 'Deurne', 'Moerdijk', 'Heusden', 'Bladel',
      'Boxtel', 'Bernheze', 'Baarle-Nassau', 'Oisterwijk', 'Gilze en Rijen',
      'Goirle', 'Hilvarenbeek', 'Laarbeek', 'Loon op Zand',
      'Oirschot', 'Reusel-De Mierden', 'Sint-Michielsgestel',
      'Someren', 'Son en Breugel', 'Steenbergen', 'Vught', 'Zundert', 'Asten',
      'Cranendonck', 'Drimmelen', 'Eersel', 'Etten-Leur', 'Gemert-Bakel',
      'Halderberge', 'Valkenswaard',
      'Altena', 'Maashorst', 'Land van Cuijk'
    ],
    extraPlaatsen: {
      'Meierijstad': ['Veghel', 'Sint-Oedenrode', 'Schijndel'],
      'Halderberge': ['Oudenbosch', 'Bosschenhoofd'],
      'Altena': ['Werkendam', 'Woudrichem', 'Aalburg'],
      'Moerdijk': ['Zevenbergen', 'Klundert'],
      'Land van Cuijk': ['Cuijk', 'Boxmeer', 'Grave', 'Mill'],
      'Maashorst': ['Uden', 'Landerd', 'Schaijk']
    }
  },
  'Limburg': {
    gemeenten: [
      'Maastricht', 'Venlo', 'Sittard-Geleen', 'Heerlen', 'Roermond', 'Weert',
      'Venray', 'Kerkrade', 'Landgraaf', 'Brunssum', 'Stein', 'Peel en Maas',
      'Horst aan de Maas', 'Nederweert', 'Leudal', 'Bergen (L)', 'Beesel', 'Voerendaal',
      'Eijsden-Margraten', 'Gulpen-Wittem', 'Vaals', 'Valkenburg aan de Geul',
      'Beekdaelen', 'Meerssen', 'Mook en Middelaar', 'Gennep', 'Beek', 'Echt-Susteren',
      'Simpelveld', 'Maasgouw'
    ],
    extraPlaatsen: {
      'Sittard-Geleen': ['Sittard', 'Geleen', 'Born'],
      'Peel en Maas': ['Panningen', 'Helden', 'Meijel'],
      'Horst aan de Maas': ['Horst', 'Sevenum', 'America'],
      'Leudal': ['Heythuysen', 'Roggel'],
      'Beekdaelen': ['Nuth', 'Schinnen', 'Onderbanken'],
      'Maasgouw': ['Maasbracht', 'Thorn', 'Wessem']
    }
  }
};

export interface DiscoveryLocation {
  id: string;
  plaats: string;
  gemeente: string;
  provincie: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results_count: number;
  last_searched_at: string | null;
  search_query: string | null;
  created_at: string;
}

export interface DiscoveryProgress {
  total_locations: number;
  pending: number;
  completed: number;
  failed: number;
  total_results: number;
  last_run_at: string | null;
  started_at: string | null;
}

function generateLocations(filterProvincie?: string): DiscoveryLocation[] {
  const locations: DiscoveryLocation[] = [];
  const now = new Date().toISOString();

  for (const [provincie, data] of Object.entries(NEDERLAND_DATA)) {
    // Filter by provincie if specified
    if (filterProvincie && provincie.toLowerCase() !== filterProvincie.toLowerCase()) {
      continue;
    }

    // Add all gemeenten (as both gemeente AND plaats)
    for (const gemeente of data.gemeenten) {
      const id = `${gemeente.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${provincie.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      locations.push({
        id,
        plaats: gemeente,
        gemeente: gemeente,
        provincie: provincie,
        priority: 10, // Hoofdplaatsen krijgen hogere prioriteit
        status: 'pending',
        results_count: 0,
        last_searched_at: null,
        search_query: null,
        created_at: now
      });
    }

    // Add extra plaatsen within gemeenten
    if (data.extraPlaatsen) {
      for (const [gemeente, plaatsen] of Object.entries(data.extraPlaatsen)) {
        for (const plaats of plaatsen) {
          // Skip als plaats al bestaat als gemeente
          if (data.gemeenten.includes(plaats)) continue;

          const id = `${plaats.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${gemeente.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          locations.push({
            id,
            plaats: plaats,
            gemeente: gemeente,
            provincie: provincie,
            priority: 5, // Lagere prioriteit voor kleinere plaatsen
            status: 'pending',
            results_count: 0,
            last_searched_at: null,
            search_query: null,
            created_at: now
          });
        }
      }
    }
  }

  return locations;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    provincie: null as string | null,
    dryRun: false,
    reset: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--provincie' && args[i + 1]) {
      options.provincie = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--reset') {
      options.reset = true;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  console.log('🌍 Nederlandse Steden Seed Script (JSON-based)\n');

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`📁 Created directory: ${DATA_DIR}`);
  }

  // Generate locations
  const newLocations = generateLocations(options.provincie || undefined);

  console.log(`📊 Statistieken:`);
  console.log(`   Nieuw gegenereerd: ${newLocations.length}`);

  // Count per provincie
  const perProvincie = newLocations.reduce((acc, loc) => {
    acc[loc.provincie] = (acc[loc.provincie] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  for (const [prov, count] of Object.entries(perProvincie).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${prov}: ${count}`);
  }

  if (options.dryRun) {
    console.log('\n🧪 DRY RUN - Geen data wordt geschreven');
    console.log('\nVoorbeeld locaties:');
    newLocations.slice(0, 10).forEach(loc => {
      console.log(`   - ${loc.plaats} (${loc.gemeente}, ${loc.provincie}) [priority: ${loc.priority}]`);
    });
    return;
  }

  // Load existing locations or start fresh
  let existingLocations: DiscoveryLocation[] = [];
  if (!options.reset && fs.existsSync(LOCATIONS_FILE)) {
    try {
      existingLocations = JSON.parse(fs.readFileSync(LOCATIONS_FILE, 'utf-8'));
      console.log(`\n📂 Bestaand bestand geladen: ${existingLocations.length} locaties`);
    } catch (e) {
      console.log('⚠️ Kon bestaand bestand niet laden, start opnieuw');
    }
  }

  // Merge: keep existing status/progress, add new locations
  const existingIds = new Set(existingLocations.map(l => l.id));
  let added = 0;
  let skipped = 0;

  for (const newLoc of newLocations) {
    if (existingIds.has(newLoc.id)) {
      skipped++;
    } else {
      existingLocations.push(newLoc);
      added++;
    }
  }

  // Sort by priority (highest first), then by provincie
  existingLocations.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.provincie.localeCompare(b.provincie);
  });

  // Save locations
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(existingLocations, null, 2));

  // Update/create progress file
  const progress: DiscoveryProgress = {
    total_locations: existingLocations.length,
    pending: existingLocations.filter(l => l.status === 'pending').length,
    completed: existingLocations.filter(l => l.status === 'completed').length,
    failed: existingLocations.filter(l => l.status === 'failed').length,
    total_results: existingLocations.reduce((sum, l) => sum + l.results_count, 0),
    last_run_at: null,
    started_at: null
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));

  console.log('\n✅ Seed complete!');
  console.log(`   Toegevoegd: ${added}`);
  console.log(`   Overgeslagen (bestond al): ${skipped}`);
  console.log(`   Totaal in bestand: ${existingLocations.length}`);
  console.log(`\n📁 Bestanden:`);
  console.log(`   ${LOCATIONS_FILE}`);
  console.log(`   ${PROGRESS_FILE}`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
