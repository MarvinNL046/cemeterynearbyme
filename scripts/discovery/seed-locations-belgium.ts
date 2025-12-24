#!/usr/bin/env npx tsx
/**
 * Seed Script voor Belgische Steden/Plaatsen (JSON-based)
 *
 * Genereert een JSON bestand met alle Belgische gemeenten en grote plaatsen
 * voor gebruik in het discovery script.
 *
 * België structuur:
 * - Vlaanderen (5 provincies) - Nederlandstalig
 * - Wallonië (5 provincies) - Franstalig
 * - Brussel-Hoofdstad - Tweetalig
 *
 * Gebruik:
 *   npx tsx scripts/discovery/seed-locations-belgium.ts
 *   npx tsx scripts/discovery/seed-locations-belgium.ts --regio "Vlaanderen"
 *   npx tsx scripts/discovery/seed-locations-belgium.ts --dry-run
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'discovery');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations-belgium.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress-belgium.json');

// Belgische gewesten met provincies, gemeenten en plaatsen
// Data gebaseerd op officiële Belgische indeling 2024

interface RegioData {
  gemeenten: string[];
  extraPlaatsen?: Record<string, string[]>;
}

interface ProvincieConfig {
  regio: 'Vlaanderen' | 'Wallonië' | 'Brussel';
  taal: 'nl' | 'fr' | 'nl/fr';
  data: RegioData;
}

const BELGIE_DATA: Record<string, ProvincieConfig> = {
  // ============================================
  // VLAANDEREN (Nederlandstalig)
  // ============================================
  'Antwerpen': {
    regio: 'Vlaanderen',
    taal: 'nl',
    data: {
      gemeenten: [
        'Antwerpen', 'Mechelen', 'Turnhout', 'Lier', 'Heist-op-den-Berg',
        'Brasschaat', 'Schoten', 'Mortsel', 'Boom', 'Wilrijk', 'Merksem',
        'Deurne', 'Hoboken', 'Ekeren', 'Borgerhout', 'Berchem', 'Wijnegem',
        'Kapellen', 'Stabroek', 'Beerse', 'Geel', 'Mol', 'Herentals',
        'Hoogstraten', 'Malle', 'Zoersel', 'Ranst', 'Lint', 'Kontich',
        'Edegem', 'Hove', 'Aartselaar', 'Niel', 'Schelle', 'Hemiksem',
        'Rumst', 'Puurs-Sint-Amands', 'Bornem', 'Sint-Katelijne-Waver',
        'Duffel', 'Bonheiden', 'Berlaar', 'Nijlen', 'Putte', 'Balen',
        'Dessel', 'Retie', 'Arendonk', 'Ravels', 'Oud-Turnhout', 'Kasterlee',
        'Lille', 'Grobbendonk', 'Vorselaar', 'Olen', 'Westerlo', 'Hulshout',
        'Herselt', 'Laakdal', 'Meerhout', 'Ham', 'Tessenderlo', 'Essen',
        'Kalmthout', 'Wuustwezel', 'Brecht', 'Zandvliet', 'Schilde',
        'Wommelgem', 'Zandhoven', 'Zoersel'
      ],
      extraPlaatsen: {
        'Antwerpen': ['Wilrijk', 'Merksem', 'Deurne', 'Hoboken', 'Ekeren', 'Borgerhout', 'Berchem'],
        'Mechelen': ['Walem', 'Leest', 'Hombeek', 'Heffen', 'Muizen'],
        'Turnhout': ['Oud-Turnhout', 'Vosselaar'],
        'Geel': ['Ten Aard', 'Punt', 'Stelen']
      }
    }
  },
  'Limburg (B)': {
    regio: 'Vlaanderen',
    taal: 'nl',
    data: {
      gemeenten: [
        'Hasselt', 'Genk', 'Sint-Truiden', 'Tongeren', 'Beringen', 'Maasmechelen',
        'Lommel', 'Diepenbeek', 'Bilzen', 'Leopoldsburg', 'Tessenderlo',
        'Heusden-Zolder', 'Houthalen-Helchteren', 'Zonhoven', 'Maaseik',
        'Bree', 'Peer', 'Hamont-Achel', 'Neerpelt', 'Overpelt', 'Lummen',
        'Halen', 'Herk-de-Stad', 'Nieuwerkerken', 'Gingelom', 'Borgloon',
        'Wellen', 'Kortessem', 'Hoeselt', 'Riemst', 'Voeren', 'Lanaken',
        'Dilsen-Stokkem', 'Kinrooi', 'As', 'Opglabbeek', 'Zutendaal',
        'Alken', 'Heers', 'Landen'
      ],
      extraPlaatsen: {
        'Hasselt': ['Kuringen', 'Stevoort', 'Kermt', 'Wimmertingen'],
        'Genk': ['Winterslag', 'Waterschei', 'Zwartberg', 'Bokrijk'],
        'Tongeren': ['Piringen', 'Nerem', 'Mal', 'Riksingen']
      }
    }
  },
  'Oost-Vlaanderen': {
    regio: 'Vlaanderen',
    taal: 'nl',
    data: {
      gemeenten: [
        'Gent', 'Aalst', 'Sint-Niklaas', 'Dendermonde', 'Lokeren', 'Beveren',
        'Ronse', 'Geraardsbergen', 'Ninove', 'Wetteren', 'Zele', 'Temse',
        'Oudenaarde', 'Deinze', 'Eeklo', 'Zelzate', 'Evergem', 'Maldegem',
        'Lochristi', 'Destelbergen', 'Laarne', 'Wichelen', 'Berlare', 'Zottegem',
        'Herzele', 'Sint-Lievens-Houtem', 'Erpe-Mere', 'Lede', 'Haaltert',
        'Denderleeuw', 'Lebbeke', 'Buggenhout', 'Hamme', 'Waasmunster',
        'Stekene', 'Moerbeke', 'Wachtebeke', 'Kaprijke', 'Sint-Laureins',
        'Assenede', 'Lievegem', 'Merelbeke', 'Melle', 'Oosterzele', 'Gavere',
        'Nazareth', 'De Pinte', 'Sint-Martens-Latem', 'Kruisem', 'Horebeke',
        'Kluisbergen', 'Wortegem-Petegem', 'Brakel', 'Lierde', 'Maarkedal'
      ],
      extraPlaatsen: {
        'Gent': ['Ledeberg', 'Gentbrugge', 'Sint-Amandsberg', 'Mariakerke', 'Wondelgem', 'Drongen'],
        'Aalst': ['Hofstade', 'Gijzegem', 'Moorsel', 'Erembodegem', 'Nieuwerkerken'],
        'Sint-Niklaas': ['Belsele', 'Nieuwkerken-Waas', 'Sinaai']
      }
    }
  },
  'West-Vlaanderen': {
    regio: 'Vlaanderen',
    taal: 'nl',
    data: {
      gemeenten: [
        'Brugge', 'Oostende', 'Kortrijk', 'Roeselare', 'Waregem', 'Ieper',
        'Knokke-Heist', 'Blankenberge', 'Nieuwpoort', 'De Panne', 'Koksijde',
        'Middelkerke', 'Bredene', 'De Haan', 'Damme', 'Jabbeke', 'Torhout',
        'Ichtegem', 'Gistel', 'Oudenburg', 'Diksmuide', 'Veurne', 'Lo-Reninge',
        'Alveringem', 'Poperinge', 'Heuvelland', 'Mesen', 'Wervik', 'Menen',
        'Wevelgem', 'Kuurne', 'Harelbeke', 'Deerlijk', 'Zwevegem', 'Anzegem',
        'Avelgem', 'Spiere-Helkijn', 'Ingelmunster', 'Izegem', 'Ledegem',
        'Moorslede', 'Lichtervelde', 'Ardooie', 'Pittem', 'Meulebeke', 'Tielt',
        'Dentergem', 'Wielsbeke', 'Oostrozebeke', 'Lendelede', 'Hooglede',
        'Staden', 'Langemark-Poelkapelle', 'Zonnebeke', 'Ruiselede', 'Wingene',
        'Beernem', 'Oostkamp', 'Zedelgem'
      ],
      extraPlaatsen: {
        'Brugge': ['Sint-Kruis', 'Sint-Andries', 'Assebroek', 'Sint-Michiels', 'Zeebrugge', 'Lissewege'],
        'Oostende': ['Mariakerke', 'Stene', 'Zandvoorde'],
        'Kortrijk': ['Heule', 'Bissegem', 'Marke', 'Aalbeke', 'Bellegem', 'Kooigem']
      }
    }
  },
  'Vlaams-Brabant': {
    regio: 'Vlaanderen',
    taal: 'nl',
    data: {
      gemeenten: [
        'Leuven', 'Vilvoorde', 'Halle', 'Tienen', 'Diest', 'Aarschot',
        'Zaventem', 'Machelen', 'Grimbergen', 'Meise', 'Kapelle-op-den-Bos',
        'Londerzeel', 'Zemst', 'Steenokkerzeel', 'Kampenhout', 'Haacht',
        'Boortmeerbeek', 'Herent', 'Kortenberg', 'Kraainem', 'Wezembeek-Oppem',
        'Tervuren', 'Overijse', 'Hoeilaart', 'Sint-Pieters-Leeuw', 'Lennik',
        'Pepingen', 'Gooik', 'Roosdaal', 'Liedekerke', 'Affligem', 'Ternat',
        'Dilbeek', 'Asse', 'Merchtem', 'Opwijk', 'Wemmel', 'Beersel',
        'Linkebeek', 'Sint-Genesius-Rode', 'Drogenbos', 'Bertem', 'Huldenberg',
        'Oud-Heverlee', 'Bierbeek', 'Lubbeek', 'Holsbeek', 'Rotselaar',
        'Tremelo', 'Begijnendijk', 'Keerbergen', 'Bonheiden', 'Putte',
        'Bekkevoort', 'Tielt-Winge', 'Glabbeek', 'Boutersem', 'Kortenaken',
        'Zoutleeuw', 'Linter', 'Hoegaarden', 'Scherpenheuvel-Zichem', 'Geetbets'
      ],
      extraPlaatsen: {
        'Leuven': ['Kessel-Lo', 'Heverlee', 'Wilsele', 'Wijgmaal'],
        'Halle': ['Buizingen', 'Lembeek', 'Essenbeek'],
        'Vilvoorde': ['Koningslo', 'Houtem', 'Peutie']
      }
    }
  },

  // ============================================
  // BRUSSEL (Tweetalig NL/FR)
  // ============================================
  'Brussel-Hoofdstad': {
    regio: 'Brussel',
    taal: 'nl/fr',
    data: {
      gemeenten: [
        'Brussel', 'Schaarbeek', 'Anderlecht', 'Elsene', 'Ukkel', 'Sint-Jans-Molenbeek',
        'Etterbeek', 'Jette', 'Sint-Gillis', 'Vorst', 'Watermaal-Bosvoorde',
        'Sint-Lambrechts-Woluwe', 'Sint-Pieters-Woluwe', 'Oudergem', 'Evere',
        'Ganshoren', 'Koekelberg', 'Sint-Agatha-Berchem', 'Sint-Joost-ten-Node'
      ],
      extraPlaatsen: {
        'Brussel': ['Laken', 'Neder-Over-Heembeek', 'Haren']
      }
    }
  },

  // ============================================
  // WALLONIË (Franstalig)
  // ============================================
  'Henegouwen': {
    regio: 'Wallonië',
    taal: 'fr',
    data: {
      gemeenten: [
        'Charleroi', 'Bergen', 'La Louvière', 'Doornik', 'Moeskroen', 'Zinnik',
        'Châtelet', 'Binche', 'Aat', 'Komen-Waasten', 'Lessen', 'Péruwelz',
        'Colfontaine', 'Quaregnon', 'Boussu', 'Saint-Ghislain', 'Frameries',
        'Dour', 'Quiévrain', 'Hornu', 'Jemappes', 'Wasmes', 'Flenu',
        'Marchienne-au-Pont', 'Mont-sur-Marchienne', 'Marcinelle', 'Couillet',
        'Gilly', 'Ransart', 'Jumet', 'Gosselies', 'Roux', 'Fontaine-l\'Évêque',
        'Chapelle-lez-Herlaimont', 'Manage', 'Seneffe', 'Écaussinnes', 'Braine-le-Comte',
        'Enghien', 'Leuze-en-Hainaut', 'Beloeil', 'Bernissart', 'Brugelette',
        'Chièvres', 'Frasnes-lez-Anvaing', 'Ellezelles', 'Flobecq', 'Mont-de-l\'Enclus',
        'Celles', 'Rumes', 'Brunehaut', 'Antoing'
      ],
      extraPlaatsen: {
        'Charleroi': ['Marchienne-au-Pont', 'Marcinelle', 'Gilly', 'Jumet', 'Gosselies', 'Couillet', 'Ransart'],
        'Bergen': ['Jemappes', 'Cuesmes', 'Ghlin', 'Obourg', 'Nimy'],
        'La Louvière': ['Houdeng-Goegnies', 'Haine-Saint-Paul', 'Haine-Saint-Pierre', 'Saint-Vaast']
      }
    }
  },
  'Luik': {
    regio: 'Wallonië',
    taal: 'fr',
    data: {
      gemeenten: [
        'Luik', 'Seraing', 'Verviers', 'Herstal', 'Ans', 'Saint-Nicolas',
        'Beyne-Heusay', 'Fléron', 'Grâce-Hollogne', 'Awans', 'Flémalle',
        'Chaudfontaine', 'Eupen', 'Welkenraedt', 'Limbourg', 'Dison',
        'Spa', 'Malmedy', 'Stavelot', 'Vielsalm', 'Trois-Ponts', 'Stoumont',
        'Aywaille', 'Esneux', 'Neupré', 'Nandrin', 'Modave', 'Clavier',
        'Ouffet', 'Anthisnes', 'Comblain-au-Pont', 'Hamoir', 'Ferrières',
        'Hoei', 'Wanze', 'Amay', 'Engis', 'Saint-Georges-sur-Meuse',
        'Verlaine', 'Villers-le-Bouillet', 'Héron', 'Burdinne', 'Braives',
        'Wasseiges', 'Geer', 'Berloz', 'Donceel', 'Fexhe-le-Haut-Clocher',
        'Waremme', 'Borgworm', 'Hannut', 'Lincent', 'Remicourt', 'Oreye',
        'Crisnée', 'Plombières', 'Blegny', 'Dalhem', 'Oupeye', 'Visé',
        'Bassenge', 'Juprelle', 'Rocourt'
      ],
      extraPlaatsen: {
        'Luik': ['Angleur', 'Bressoux', 'Grivegnée', 'Jupille', 'Rocourt', 'Wandre'],
        'Verviers': ['Heusy', 'Stembert', 'Ensival', 'Hodimont'],
        'Seraing': ['Jemeppe', 'Ougrée', 'Boncelles']
      }
    }
  },
  'Luxemburg (B)': {
    regio: 'Wallonië',
    taal: 'fr',
    data: {
      gemeenten: [
        'Aarlen', 'Bastenaken', 'Marche-en-Famenne', 'Virton', 'Neufchâteau',
        'Bertrix', 'Libramont-Chevigny', 'Bouillon', 'Florenville', 'Chiny',
        'Musson', 'Aubange', 'Messancy', 'Attert', 'Habay', 'Léglise',
        'Vaux-sur-Sûre', 'Fauvillers', 'Martelange', 'Sainte-Ode', 'Bertogne',
        'Houffalize', 'Vielsalm', 'Gouvy', 'Tenneville', 'La Roche-en-Ardenne',
        'Rendeux', 'Manhay', 'Érezée', 'Hotton', 'Nassogne', 'Rochefort',
        'Wellin', 'Tellin', 'Libin', 'Saint-Hubert', 'Paliseul', 'Herbeumont',
        'Tintigny', 'Étalle', 'Rouvroy', 'Saint-Léger', 'Meix-devant-Virton',
        'Durbuy'
      ],
      extraPlaatsen: {
        'Aarlen': ['Arlon-centre', 'Stockem', 'Heinsch'],
        'Bastenaken': ['Bastogne-centre', 'Longvilly', 'Wardin'],
        'Bouillon': ['Bouillon-centre', 'Corbion', 'Noirefontaine']
      }
    }
  },
  'Namen': {
    regio: 'Wallonië',
    taal: 'fr',
    data: {
      gemeenten: [
        'Namen', 'Andenne', 'Sambreville', 'Gembloux', 'Dinant', 'Ciney',
        'Philippeville', 'Couvin', 'Rochefort', 'Beauraing', 'Gedinne',
        'Vresse-sur-Semois', 'Bièvre', 'Hastière', 'Onhaye', 'Anhée',
        'Yvoir', 'Profondeville', 'Fosses-la-Ville', 'Floreffe', 'Mettet',
        'Florennes', 'Walcourt', 'Cerfontaine', 'Doische', 'Viroinval',
        'Éghezée', 'Fernelmont', 'La Bruyère', 'Sombreffe', 'Jemeppe-sur-Sambre',
        'Gesves', 'Ohey', 'Havelange', 'Somme-Leuze', 'Hamois', 'Assesse'
      ],
      extraPlaatsen: {
        'Namen': ['Jambes', 'Saint-Servais', 'Erpent', 'Wépion', 'Malonne'],
        'Dinant': ['Bouvignes', 'Anseremme', 'Falmignoul'],
        'Andenne': ['Seilles', 'Vezin', 'Bonneville']
      }
    }
  },
  'Waals-Brabant': {
    regio: 'Wallonië',
    taal: 'fr',
    data: {
      gemeenten: [
        'Ottignies-Louvain-la-Neuve', 'Waver', 'Nijvel', 'Braine-l\'Alleud',
        'Waterloo', 'Tubize', 'La Hulpe', 'Rixensart', 'Lasne', 'Genappe',
        'Court-Saint-Étienne', 'Mont-Saint-Guibert', 'Villers-la-Ville',
        'Chastre', 'Walhain', 'Perwez', 'Jodoigne', 'Hélécine', 'Orp-Jauche',
        'Ramillies', 'Incourt', 'Beauvechain', 'Grez-Doiceau', 'Chaumont-Gistoux',
        'Rebecq', 'Ittre', 'Braine-le-Château'
      ],
      extraPlaatsen: {
        'Ottignies-Louvain-la-Neuve': ['Louvain-la-Neuve', 'Ottignies', 'Limelette'],
        'Waver': ['Bierges', 'Limal'],
        'Nijvel': ['Nivelles-centre', 'Baulers', 'Thines']
      }
    }
  }
};

// Zoektermen per taal
const SEARCH_TERMS = {
  nl: 'begraafplaats, kerkhof, cemetery, natuurbegraafplaats, joodse begraafplaats, islamitische begraafplaats, rooms-katholieke begraafplaats, protestantse begraafplaats, oorlogsbegraafplaats, crematorium',
  fr: 'cimetière, cemetery, cimetière naturel, cimetière juif, cimetière islamique, cimetière catholique, cimetière protestant, cimetière militaire, crématorium',
  'nl/fr': 'begraafplaats, kerkhof, cimetière, cemetery, natuurbegraafplaats, joodse begraafplaats, islamitische begraafplaats, cimetière naturel, cimetière juif, crematorium, crématorium'
};

export interface DiscoveryLocationBelgium {
  id: string;
  plaats: string;
  gemeente: string;
  provincie: string;
  regio: 'Vlaanderen' | 'Wallonië' | 'Brussel';
  land: 'België';
  taal: 'nl' | 'fr' | 'nl/fr';
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results_count: number;
  last_searched_at: string | null;
  search_query: string | null;
  created_at: string;
}

export interface DiscoveryProgressBelgium {
  total_locations: number;
  pending: number;
  completed: number;
  failed: number;
  total_results: number;
  last_run_at: string | null;
  started_at: string | null;
  per_regio: {
    Vlaanderen: { total: number; completed: number };
    Wallonië: { total: number; completed: number };
    Brussel: { total: number; completed: number };
  };
}

function generateLocations(filterRegio?: string, filterProvincie?: string): DiscoveryLocationBelgium[] {
  const locations: DiscoveryLocationBelgium[] = [];
  const now = new Date().toISOString();

  for (const [provincie, config] of Object.entries(BELGIE_DATA)) {
    // Filter by regio if specified
    if (filterRegio && config.regio.toLowerCase() !== filterRegio.toLowerCase()) {
      continue;
    }

    // Filter by provincie if specified
    if (filterProvincie && provincie.toLowerCase() !== filterProvincie.toLowerCase()) {
      continue;
    }

    const { regio, taal, data } = config;

    // Add all gemeenten (as both gemeente AND plaats)
    for (const gemeente of data.gemeenten) {
      const id = `be-${gemeente.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${provincie.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      locations.push({
        id,
        plaats: gemeente,
        gemeente: gemeente,
        provincie: provincie,
        regio: regio,
        land: 'België',
        taal: taal,
        priority: 10, // Hoofdplaatsen krijgen hogere prioriteit
        status: 'pending',
        results_count: 0,
        last_searched_at: null,
        search_query: SEARCH_TERMS[taal],
        created_at: now
      });
    }

    // Add extra plaatsen within gemeenten
    if (data.extraPlaatsen) {
      for (const [gemeente, plaatsen] of Object.entries(data.extraPlaatsen)) {
        for (const plaats of plaatsen) {
          // Skip als plaats al bestaat als gemeente
          if (data.gemeenten.includes(plaats)) continue;

          const id = `be-${plaats.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${gemeente.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          locations.push({
            id,
            plaats: plaats,
            gemeente: gemeente,
            provincie: provincie,
            regio: regio,
            land: 'België',
            taal: taal,
            priority: 5, // Lagere prioriteit voor kleinere plaatsen
            status: 'pending',
            results_count: 0,
            last_searched_at: null,
            search_query: SEARCH_TERMS[taal],
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
    regio: null as string | null,
    provincie: null as string | null,
    dryRun: false,
    reset: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--regio' && args[i + 1]) {
      options.regio = args[i + 1];
      i++;
    } else if (args[i] === '--provincie' && args[i + 1]) {
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

  console.log('🇧🇪 Belgische Steden Seed Script (JSON-based)\n');

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`📁 Created directory: ${DATA_DIR}`);
  }

  // Generate locations
  const newLocations = generateLocations(options.regio || undefined, options.provincie || undefined);

  console.log(`📊 Statistieken:`);
  console.log(`   Nieuw gegenereerd: ${newLocations.length}`);

  // Count per regio
  const perRegio = newLocations.reduce((acc, loc) => {
    acc[loc.regio] = (acc[loc.regio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n   Per regio:');
  for (const [regio, count] of Object.entries(perRegio).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${regio}: ${count}`);
  }

  // Count per provincie
  const perProvincie = newLocations.reduce((acc, loc) => {
    acc[loc.provincie] = (acc[loc.provincie] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n   Per provincie:');
  for (const [prov, count] of Object.entries(perProvincie).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${prov}: ${count}`);
  }

  // Count per taal
  const perTaal = newLocations.reduce((acc, loc) => {
    acc[loc.taal] = (acc[loc.taal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n   Per taal:');
  for (const [taal, count] of Object.entries(perTaal)) {
    console.log(`   ${taal}: ${count}`);
  }

  if (options.dryRun) {
    console.log('\n🧪 DRY RUN - Geen data wordt geschreven');
    console.log('\nVoorbeeld locaties:');

    // Show some from each region
    const vlaanderen = newLocations.filter(l => l.regio === 'Vlaanderen').slice(0, 3);
    const wallonie = newLocations.filter(l => l.regio === 'Wallonië').slice(0, 3);
    const brussel = newLocations.filter(l => l.regio === 'Brussel').slice(0, 3);

    console.log('\n   Vlaanderen (NL):');
    vlaanderen.forEach(loc => {
      console.log(`   - ${loc.plaats} (${loc.gemeente}, ${loc.provincie})`);
    });

    console.log('\n   Wallonië (FR):');
    wallonie.forEach(loc => {
      console.log(`   - ${loc.plaats} (${loc.gemeente}, ${loc.provincie})`);
    });

    console.log('\n   Brussel (NL/FR):');
    brussel.forEach(loc => {
      console.log(`   - ${loc.plaats} (${loc.gemeente}, ${loc.provincie})`);
    });

    return;
  }

  // Load existing locations or start fresh
  let existingLocations: DiscoveryLocationBelgium[] = [];
  if (!options.reset && fs.existsSync(LOCATIONS_FILE)) {
    try {
      existingLocations = JSON.parse(fs.readFileSync(LOCATIONS_FILE, 'utf-8'));
      console.log(`\n📂 Bestaand bestand geladen: ${existingLocations.length} locaties`);
    } catch {
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

  // Sort by priority (highest first), then by regio, then by provincie
  existingLocations.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (a.regio !== b.regio) return a.regio.localeCompare(b.regio);
    return a.provincie.localeCompare(b.provincie);
  });

  // Save locations
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(existingLocations, null, 2));

  // Update/create progress file
  const progress: DiscoveryProgressBelgium = {
    total_locations: existingLocations.length,
    pending: existingLocations.filter(l => l.status === 'pending').length,
    completed: existingLocations.filter(l => l.status === 'completed').length,
    failed: existingLocations.filter(l => l.status === 'failed').length,
    total_results: existingLocations.reduce((sum, l) => sum + l.results_count, 0),
    last_run_at: null,
    started_at: null,
    per_regio: {
      Vlaanderen: {
        total: existingLocations.filter(l => l.regio === 'Vlaanderen').length,
        completed: existingLocations.filter(l => l.regio === 'Vlaanderen' && l.status === 'completed').length
      },
      Wallonië: {
        total: existingLocations.filter(l => l.regio === 'Wallonië').length,
        completed: existingLocations.filter(l => l.regio === 'Wallonië' && l.status === 'completed').length
      },
      Brussel: {
        total: existingLocations.filter(l => l.regio === 'Brussel').length,
        completed: existingLocations.filter(l => l.regio === 'Brussel' && l.status === 'completed').length
      }
    }
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));

  console.log('\n✅ Seed complete!');
  console.log(`   Toegevoegd: ${added}`);
  console.log(`   Overgeslagen (bestond al): ${skipped}`);
  console.log(`   Totaal in bestand: ${existingLocations.length}`);
  console.log(`\n📁 Bestanden:`);
  console.log(`   ${LOCATIONS_FILE}`);
  console.log(`   ${PROGRESS_FILE}`);

  console.log('\n🚀 Volgende stappen:');
  console.log('   1. Run discovery: npx tsx scripts/discovery/discover-cemeteries-belgium.ts');
  console.log('   2. Merge data: npx tsx scripts/merge-discovery-data-belgium.ts');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
