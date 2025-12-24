/**
 * Scraper voor dierenbegraafplaatsen in Nederland via Jina.ai Reader API
 *
 * Dit script haalt alle dierenbegraafplaatsen op van verschillende bronnen
 * en slaat ze op in een gestructureerd JSON formaat.
 */

import fs from 'fs';
import path from 'path';

// Jina.ai API configuratie
const JINA_API_KEY = 'jina_87f2d697e60a4f93b5b0b7576da1a857shcct21CGvGd4dbCBSyCUHLfKodA';
const JINA_READER_URL = 'https://r.jina.ai/';
const JINA_SEARCH_URL = 'https://s.jina.ai/';

interface Dierenbegraafplaats {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  telefoon?: string;
  website?: string;
  email?: string;
  openingstijden?: string;
  faciliteiten?: string;
  beschrijving?: string;
  slug: string;
  bron_url?: string;
  generated?: {
    samenvatting: string;
    kenmerken: string[];
    toegankelijkheid: string;
  };
}

// Bekende dierenbegraafplaatsen - uitgebreid met alle bekende locaties
const BEKENDE_DIERENBEGRAAFPLAATSEN = [
  // GRONINGEN (2)
  {
    naam: 'Dierenbegraafplaats De Garst',
    url: 'https://dierenbegraafplaatsgroningen.nl',
    gemeente: 'Oldambt',
    provincie: 'Groningen',
    plaats: 'Westerlee',
    adres: 'Sportlaan 4',
    postcode: '9678 RC'
  },
  {
    naam: 'Huisdierencrematorium Stadskanaal',
    url: null,
    gemeente: 'Stadskanaal',
    provincie: 'Groningen',
    plaats: 'Stadskanaal',
    adres: 'Mandenmaker 7',
    postcode: '9502 KK'
  },
  // FRIESLAND (2)
  {
    naam: 'Dierenbegraafplaats Leeuwarden',
    url: null,
    gemeente: 'Leeuwarden',
    provincie: 'Friesland',
    plaats: 'Leeuwarden'
  },
  {
    naam: 'Dierencrematorium Domesticus',
    url: null,
    gemeente: 'Súdwest-Fryslân',
    provincie: 'Friesland',
    plaats: 'Bolsward',
    adres: 'De Marne 238',
    postcode: '8701 MH'
  },
  // DRENTHE (6)
  {
    naam: 'Dierencrematorium Het Laatste Afscheid',
    url: 'https://www.hetlaatsteafscheid.nl',
    gemeente: 'De Wolden',
    provincie: 'Drenthe',
    plaats: 'De Wijk'
  },
  {
    naam: 'Dierenuitvaartcentrum Smilde',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/smilde/',
    gemeente: 'Midden-Drenthe',
    provincie: 'Drenthe',
    plaats: 'Smilde'
  },
  {
    naam: 'Dierenbegraafplaats De Marand',
    url: null,
    gemeente: 'Hoogeveen',
    provincie: 'Drenthe',
    plaats: 'Hollandscheveld',
    adres: 'Wilfred Stillweg 10-A',
    postcode: '7913 XB'
  },
  {
    naam: 'Dierenbegraafplaats Larixhof',
    url: null,
    gemeente: 'Westerveld',
    provincie: 'Drenthe',
    plaats: 'Wilhelminaoord',
    adres: 'Hooiweg 4',
    postcode: '8384 GJ'
  },
  {
    naam: "Dierenbegraafplaats 't Hunebed",
    url: null,
    gemeente: 'Hoogeveen',
    provincie: 'Drenthe',
    plaats: 'Pesse',
    adres: 'Hoogeveenseweg 37',
    postcode: '7933 PE'
  },
  {
    naam: 'Dierenbegraafplaats de Bijenweide',
    url: null,
    gemeente: 'Emmen',
    provincie: 'Drenthe',
    plaats: 'Emmen',
    adres: 'Zwaaikom 5',
    postcode: '7825 TE'
  },
  // OVERIJSSEL (5)
  {
    naam: 'Dierenbegraafplaats Steenwijk',
    url: null,
    gemeente: 'Steenwijkerland',
    provincie: 'Overijssel',
    plaats: 'Steenwijk'
  },
  {
    naam: 'Dierenuitvaartcentrum Oost-Nederland',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/oost-nederland/',
    gemeente: 'Deventer',
    provincie: 'Overijssel',
    plaats: 'Deventer'
  },
  {
    naam: 'Dierenbegraafplaats Vennenberg',
    url: null,
    gemeente: 'Dalfsen',
    provincie: 'Overijssel',
    plaats: 'Dalfsen',
    adres: 'Kortersweg 4',
    postcode: '7722 JG'
  },
  {
    naam: 'Dierenbegraafplaats Zwolle',
    url: null,
    gemeente: 'Zwolle',
    provincie: 'Overijssel',
    plaats: 'Zwolle',
    adres: 'Bergkloosterweg 92',
    postcode: '8034 PS'
  },
  {
    naam: 'Dierencrematorium Enschede',
    url: null,
    gemeente: 'Enschede',
    provincie: 'Overijssel',
    plaats: 'Enschede'
  },
  // FLEVOLAND (2)
  {
    naam: 'Dierenuitvaartcentrum Anubis Almere',
    url: 'https://anubisalmere.nl',
    gemeente: 'Almere',
    provincie: 'Flevoland',
    plaats: 'Almere',
    adres: 'Duwweg 2010',
    postcode: '1338 GB'
  },
  {
    naam: 'Dierencrematorium Flevoland',
    url: null,
    gemeente: 'Dronten',
    provincie: 'Flevoland',
    plaats: 'Swifterbant',
    adres: 'De Maalstroom 15',
    postcode: '8255 RN'
  },
  // GELDERLAND (14)
  {
    naam: 'Dierenbegraafplaats Klaverweiden',
    url: 'https://www.klaverweiden.nl',
    gemeente: 'Nijkerk',
    provincie: 'Gelderland',
    plaats: 'Hoevelaken',
    adres: 'Hoevelakerveenweg 14',
    postcode: '3871 KK'
  },
  {
    naam: 'Dierenuitvaartcentrum Majesta De Betuwe',
    url: null,
    gemeente: 'West Betuwe',
    provincie: 'Gelderland',
    plaats: 'Geldermalsen',
    adres: 'Kerkstraat 4',
    postcode: '4191 AB'
  },
  {
    naam: 'Huisdierencrematorium Amadeus',
    url: null,
    gemeente: 'Nijmegen',
    provincie: 'Gelderland',
    plaats: 'Nijmegen',
    adres: 'Sint Teunismolenweg 56',
    postcode: '6534 AG',
    telefoon: '024-3503880'
  },
  {
    naam: 'Dierencrematorium en begraafplaats Kolleweidenhof',
    url: null,
    gemeente: 'Oude IJsselstreek',
    provincie: 'Gelderland',
    plaats: 'Heelweg',
    adres: 'Bosboombroekerweg 35',
    postcode: '7055 AT'
  },
  {
    naam: "Dierenbegraafplaats 't Jagtveld",
    url: null,
    gemeente: 'Heumen',
    provincie: 'Gelderland',
    plaats: 'Heumen',
    adres: 'Looistraat 59',
    postcode: '6582 BB'
  },
  {
    naam: "Dierenbegraafplaats 't Uivershof",
    url: null,
    gemeente: 'Montferland',
    provincie: 'Gelderland',
    plaats: 'Beek',
    adres: 'Arnhemseweg 26',
    postcode: '7037 DB'
  },
  {
    naam: 'Dierenbegraafplaats Eibergen Brouwerskamp',
    url: null,
    gemeente: 'Berkelland',
    provincie: 'Gelderland',
    plaats: 'Eibergen',
    adres: 'Slotmansweg 10',
    postcode: '7152 AC'
  },
  {
    naam: 'Dierenbegraafplaats Erve ten Holte',
    url: null,
    gemeente: 'Rheden',
    provincie: 'Gelderland',
    plaats: 'Spankeren',
    adres: 'Bockhorstweg 8',
    postcode: '6956 CA'
  },
  {
    naam: 'Dierenbegraafplaats Majesta Medenstein',
    url: null,
    gemeente: 'Neder-Betuwe',
    provincie: 'Gelderland',
    plaats: 'Echteld',
    adres: 'Remkettingweg 2-A',
    postcode: '4054 MH'
  },
  {
    naam: 'Dierenbegraafplaats De Passage',
    url: null,
    gemeente: 'West Maas en Waal',
    provincie: 'Gelderland',
    plaats: 'Dreumel',
    adres: 'Waaldijk 16',
    postcode: '6621 KG'
  },
  {
    naam: 'Huisdierenbegraafplaats De Hoeve',
    url: null,
    gemeente: 'Overbetuwe',
    provincie: 'Gelderland',
    plaats: 'Elst'
  },
  {
    naam: 'Dierenbegraafplaats Haarlo',
    url: null,
    gemeente: 'Berkelland',
    provincie: 'Gelderland',
    plaats: 'Haarlo'
  },
  {
    naam: 'Dierenbegraafplaats Nijmegen',
    url: null,
    gemeente: 'Nijmegen',
    provincie: 'Gelderland',
    plaats: 'Nijmegen'
  },
  {
    naam: 'Dierencrematorium Apeldoorn',
    url: null,
    gemeente: 'Apeldoorn',
    provincie: 'Gelderland',
    plaats: 'Apeldoorn'
  },
  // UTRECHT (4)
  {
    naam: 'Dierenbegraafplaats De Wildernis',
    url: 'https://www.dierenbegraafplaatsdewildernis.nl',
    gemeente: 'Amersfoort',
    provincie: 'Utrecht',
    plaats: 'Amersfoort'
  },
  {
    naam: 'Dierenbegraafplaats Houten',
    url: 'https://www.dierenbegraafplaatshouten.nl',
    gemeente: 'Houten',
    provincie: 'Utrecht',
    plaats: 'Houten'
  },
  {
    naam: 'Dierencrematorium en Begraafplaats Heuvelrug',
    url: 'https://www.dierencrematoriumheuvelrug.nl',
    gemeente: 'Utrechtse Heuvelrug',
    provincie: 'Utrecht',
    plaats: 'Doorn'
  },
  {
    naam: 'Dierenuitvaartcentrum IJsselstein',
    url: null,
    gemeente: 'IJsselstein',
    provincie: 'Utrecht',
    plaats: 'IJsselstein',
    adres: 'Oude Utrechtseweg 3',
    postcode: '3402 ST'
  },
  // NOORD-HOLLAND (10)
  {
    naam: 'Dierenbegraafplaats De Stille Weiden',
    url: null,
    gemeente: 'Koggenland',
    provincie: 'Noord-Holland',
    plaats: 'Berkhout',
    adres: 'Bobeldijk 83',
    postcode: '1647 CJ'
  },
  {
    naam: 'Dierenuitvaartcentrum Schagerbrug',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/schagerbrug/',
    gemeente: 'Schagen',
    provincie: 'Noord-Holland',
    plaats: 'Schagerbrug'
  },
  {
    naam: 'Dierenuitvaartcentrum Amsterdam Oost',
    url: null,
    gemeente: 'Amsterdam',
    provincie: 'Noord-Holland',
    plaats: 'Amsterdam',
    adres: 'Voorzandpad 2',
    postcode: '1098 TZ',
    telefoon: '020-7231966'
  },
  {
    naam: 'Dierencrematorium Westerhout',
    url: null,
    gemeente: 'Beverwijk',
    provincie: 'Noord-Holland',
    plaats: 'Beverwijk',
    adres: 'Zeestraat 214B',
    postcode: '1943 AE',
    telefoon: '0251-216363'
  },
  {
    naam: 'Dierenbegraafplaats Zandvoort',
    url: null,
    gemeente: 'Zandvoort',
    provincie: 'Noord-Holland',
    plaats: 'Zandvoort',
    adres: 'Tollensstraat 67',
    postcode: '2041 PR'
  },
  {
    naam: 'Dierencrematorium Amsterdam D.U.C.',
    url: 'https://www.ducamsterdam.nl',
    gemeente: 'Amsterdam',
    provincie: 'Noord-Holland',
    plaats: 'Amsterdam'
  },
  {
    naam: 'Dierencrematorium Heerhugowaard',
    url: 'https://dierencrematoriumheerhugowaard.nl',
    gemeente: 'Dijk en Waard',
    provincie: 'Noord-Holland',
    plaats: 'Heerhugowaard',
    adres: 'Laanderweg 13c',
    postcode: '1704 JT'
  },
  {
    naam: 'Dierencrematorium Zaanstad',
    url: 'https://dierencrematoriumzaanstad.nl',
    gemeente: 'Zaanstad',
    provincie: 'Noord-Holland',
    plaats: 'Wormerveer',
    adres: 'Industrieweg 50',
    postcode: '1521 NE'
  },
  {
    naam: 'Dierencrematorium Naarden',
    url: null,
    gemeente: 'Gooise Meren',
    provincie: 'Noord-Holland',
    plaats: 'Naarden',
    adres: 'Kobaltstraat 2',
    postcode: '1411 AM'
  },
  {
    naam: 'Dierenbegraafplaats Haarlem',
    url: null,
    gemeente: 'Haarlem',
    provincie: 'Noord-Holland',
    plaats: 'Haarlem'
  },
  // ZUID-HOLLAND (10)
  {
    naam: 'Dierenbegraafplaats Zevenhoven',
    url: 'http://www.dierenbegraafplaats.com',
    gemeente: 'Nieuwkoop',
    provincie: 'Zuid-Holland',
    plaats: 'Zevenhoven',
    adres: 'Hogedijk 10',
    postcode: '2435 NC'
  },
  {
    naam: 'Dierenuitvaartcentrum Nootdorp',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/nootdorp/',
    gemeente: 'Pijnacker-Nootdorp',
    provincie: 'Zuid-Holland',
    plaats: 'Nootdorp'
  },
  {
    naam: 'Dierenuitvaartcentrum Waddinxveen',
    url: null,
    gemeente: 'Waddinxveen',
    provincie: 'Zuid-Holland',
    plaats: 'Waddinxveen',
    adres: 'Staringlaan 14',
    postcode: '2741 GC'
  },
  {
    naam: 'Dierencrematorium Majesta Rotterdam',
    url: null,
    gemeente: 'Rotterdam',
    provincie: 'Zuid-Holland',
    plaats: 'Rotterdam',
    adres: 'Satijnbloem 31',
    postcode: '3068 JP'
  },
  {
    naam: 'Huisdieren- en paardencrematorium Rotterdam',
    url: null,
    gemeente: 'Rotterdam',
    provincie: 'Zuid-Holland',
    plaats: 'Rotterdam',
    adres: 'Buitendijk 101',
    postcode: '3078 XC'
  },
  {
    naam: 'Dierenbegraafplaats Groenendijk',
    url: 'https://www.dierenuitvaartcentrum-groenendijk.nl',
    gemeente: 'Alphen aan den Rijn',
    provincie: 'Zuid-Holland',
    plaats: 'Hazerswoude-Rijndijk',
    adres: 'Groenestein 12-d',
    postcode: '2394 AV'
  },
  {
    naam: 'Dierenbegraafplaats Gerenal',
    url: 'https://www.gerenal.nl',
    gemeente: 'Westland',
    provincie: 'Zuid-Holland',
    plaats: 'Honselersdijk'
  },
  {
    naam: 'Dierenbegraafplaats Rotterdam',
    url: null,
    gemeente: 'Rotterdam',
    provincie: 'Zuid-Holland',
    plaats: 'Rotterdam'
  },
  {
    naam: 'Dierencrematorium Den Haag',
    url: null,
    gemeente: 'Den Haag',
    provincie: 'Zuid-Holland',
    plaats: 'Den Haag'
  },
  {
    naam: 'Dierencrematorium Leiden',
    url: null,
    gemeente: 'Leiden',
    provincie: 'Zuid-Holland',
    plaats: 'Leiden'
  },
  // ZEELAND (2)
  {
    naam: 'Huiduc Dierenbegraafplaats Zeeland',
    url: 'https://huiduc.nl',
    gemeente: 'Borsele',
    provincie: 'Zeeland',
    plaats: 'Heinkenszand'
  },
  {
    naam: 'Dierencrematorium Zeeland',
    url: 'https://www.dierencrematoriumzeeland.nl',
    gemeente: 'Veere',
    provincie: 'Zeeland',
    plaats: 'Koudekerke'
  },
  // NOORD-BRABANT (12)
  {
    naam: 'Dierenbegraafplaats Viviana',
    url: 'https://begraafplaatsviviana.nl',
    gemeente: 'Breda',
    provincie: 'Noord-Brabant',
    plaats: 'Prinsenbeek',
    adres: 'Vianendreef 97',
    postcode: '4841 LE'
  },
  {
    naam: 'Dierenuitvaartcentrum Roosendaal',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/roosendaal/',
    gemeente: 'Roosendaal',
    provincie: 'Noord-Brabant',
    plaats: 'Roosendaal'
  },
  {
    naam: 'Dierencrematorium Majesta Jori',
    url: null,
    gemeente: 'Roosendaal',
    provincie: 'Noord-Brabant',
    plaats: 'Roosendaal',
    adres: 'Belder 26',
    postcode: '4704 RK'
  },
  {
    naam: 'Dierenuitvaartcentrum Uden',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/uden/',
    gemeente: 'Uden',
    provincie: 'Noord-Brabant',
    plaats: 'Uden'
  },
  {
    naam: 'Dierencrematorium Majesta Maashorst',
    url: null,
    gemeente: 'Maashorst',
    provincie: 'Noord-Brabant',
    plaats: 'Uden',
    adres: 'Hockeyweg 4',
    postcode: '5405 NC'
  },
  {
    naam: 'Dierenbegraafplaats De Wilgenhof',
    url: 'https://www.dierenbegraafplaatsdewilgenhof.nl',
    gemeente: 'Best',
    provincie: 'Noord-Brabant',
    plaats: 'Best',
    adres: 'Huiskenshoek 10',
    postcode: '5684 LP'
  },
  {
    naam: 'Huisdieren begraaf en crematiecentrum Peelrust',
    url: null,
    gemeente: 'Gemert-Bakel',
    provincie: 'Noord-Brabant',
    plaats: 'Handel',
    adres: 'Peeldijk 18',
    postcode: '5423 VB'
  },
  {
    naam: 'Dierencrematorium en begraafplaats Raamrust',
    url: 'http://www.dierencrematoriumlieshout.nl',
    gemeente: 'Laarbeek',
    provincie: 'Noord-Brabant',
    plaats: 'Lieshout',
    adres: 'Elsduijn 1',
    postcode: '5737 RV'
  },
  {
    naam: 'Dierencrematorium Midden Brabant',
    url: 'https://www.dierencrematorium-mb.nl',
    gemeente: 'Boxtel',
    provincie: 'Noord-Brabant',
    plaats: 'Boxtel'
  },
  {
    naam: 'Dierencrematorium Natura Nova',
    url: 'https://naturanova.nl',
    gemeente: 'Eersel',
    provincie: 'Noord-Brabant',
    plaats: 'Wintelre'
  },
  {
    naam: 'Dierencrematorium Memoria Tilburg',
    url: 'https://www.dierencrematorium-memoria.nl',
    gemeente: 'Tilburg',
    provincie: 'Noord-Brabant',
    plaats: 'Tilburg'
  },
  {
    naam: 'Dierenbegraafplaats Helmond',
    url: null,
    gemeente: 'Helmond',
    provincie: 'Noord-Brabant',
    plaats: 'Helmond'
  },
  // LIMBURG (12)
  {
    naam: 'Dierennatuurbegraafplaats De Aarde',
    url: null,
    gemeente: 'Peel en Maas',
    provincie: 'Limburg',
    plaats: 'Grashoek',
    adres: 'Marisstraat 26',
    postcode: '5985 PS'
  },
  {
    naam: 'Dierenuitvaartcentrum Venray',
    url: null,
    gemeente: 'Venray',
    provincie: 'Limburg',
    plaats: 'Oostrum'
  },
  {
    naam: 'Algemene Weerter Dierenbegrafplaats',
    url: null,
    gemeente: 'Weert',
    provincie: 'Limburg',
    plaats: 'Weert'
  },
  {
    naam: 'Dierenuitvaartcentrum Maas en Beek',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/maas-en-beek/',
    gemeente: 'Beek',
    provincie: 'Limburg',
    plaats: 'Beek'
  },
  {
    naam: 'Dierenuitvaartcentrum Parkstad Heerlen',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/parkstad-heerlen/',
    gemeente: 'Heerlen',
    provincie: 'Limburg',
    plaats: 'Heerlen'
  },
  {
    naam: 'EQUINA Funeral Services',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/equina-funeral-services/',
    gemeente: 'Heerlen',
    provincie: 'Limburg',
    plaats: 'Heerlen',
    beschrijving: 'Gespecialiseerd in paardenuitvaart'
  },
  {
    naam: 'Dierenuitvaartcentrum Roermond',
    url: 'https://dierenuitvaartzorgnederland.nl/onze-locaties/roermond/',
    gemeente: 'Roermond',
    provincie: 'Limburg',
    plaats: 'Roermond'
  },
  {
    naam: 'Dierenbegraafplaats Buggenum',
    url: null,
    gemeente: 'Leudal',
    provincie: 'Limburg',
    plaats: 'Buggenum',
    adres: 'Dorpsstraat 94',
    postcode: '6082 AR'
  },
  {
    naam: 'Dierenbegraafplaats Schimmert',
    url: null,
    gemeente: 'Beekdaelen',
    provincie: 'Limburg',
    plaats: 'Schimmert'
  },
  {
    naam: 'Dierenbegraafplaats Maastricht',
    url: null,
    gemeente: 'Maastricht',
    provincie: 'Limburg',
    plaats: 'Maastricht'
  },
  {
    naam: 'Dierencrematorium Venlo',
    url: null,
    gemeente: 'Venlo',
    provincie: 'Limburg',
    plaats: 'Venlo'
  }
];

// Rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch met Jina.ai Reader
async function fetchWithJina(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${JINA_READER_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${JINA_API_KEY}`,
          'Accept': 'text/plain'
        }
      });

      if (!response.ok) {
        throw new Error(`Jina fetch failed: ${response.status} ${response.statusText}`);
      }

      return response.text();
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`   ⚠️ Poging ${attempt} mislukt, opnieuw proberen...`);
      await delay(2000 * attempt);
    }
  }
  throw new Error('Max retries exceeded');
}

// Search met Jina.ai
async function searchWithJina(query: string): Promise<string> {
  try {
    const response = await fetch(`${JINA_SEARCH_URL}${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${JINA_API_KEY}`,
        'Accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Jina search failed: ${response.status} ${response.statusText}`);
    }

    return response.text();
  } catch (error) {
    console.error(`Search error: ${error}`);
    return '';
  }
}

// Maak slug van naam
function createSlug(naam: string): string {
  return naam
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Genereer samenvatting
function generateSamenvatting(bp: Dierenbegraafplaats): string {
  let text = `${bp.naam_begraafplaats} is een dierenbegraafplaats gelegen in ${bp.plaats || bp.gemeente}, in de provincie ${bp.provincie}. `;
  text += `Deze begraafplaats biedt een waardige laatste rustplaats voor huisdieren. `;

  if (bp.faciliteiten) {
    text += `De begraafplaats beschikt over diverse voorzieningen. `;
  }

  return text;
}

// Parse informatie van website content
function parseWebsiteContent(content: string, basic: typeof BEKENDE_DIERENBEGRAAFPLAATSEN[0]): Partial<Dierenbegraafplaats> {
  const info: Partial<Dierenbegraafplaats> = {};

  // Telefoon extractie
  const telMatch = content.match(/(\+31[\s\-]?(?:\d[\s\-]?){9}|\b0\d{2}[\s\-]?\d{7}\b|\b0\d{3}[\s\-]?\d{6}\b)/);
  if (telMatch) {
    info.telefoon = telMatch[1].replace(/[\s\-]/g, '');
  }

  // Email extractie
  const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Adres extractie
  const adresMatch = content.match(/([A-Z][a-z]+(?:\s+[a-z]+)*(?:straat|weg|laan|plein|pad|dreef|hof|singel|kade))\s+(\d+[a-zA-Z]?)/i);
  if (adresMatch) {
    info.adres = `${adresMatch[1]} ${adresMatch[2]}`;
  }

  // Postcode extractie
  const postcodeMatch = content.match(/(\d{4}\s?[A-Z]{2})/);
  if (postcodeMatch) {
    info.postcode = postcodeMatch[1].replace(' ', '');
  }

  // Beschrijving extractie (eerste 500 karakters van content die relevant lijkt)
  const descMatch = content.match(/(?:over ons|welkom|dierenbegraafplaats)[^\n]{0,500}/i);
  if (descMatch) {
    info.beschrijving = descMatch[0].substring(0, 300) + '...';
  }

  return info;
}

// Verwerk een enkele dierenbegraafplaats
async function processDierenbegraafplaats(basic: typeof BEKENDE_DIERENBEGRAAFPLAATSEN[0]): Promise<Dierenbegraafplaats> {
  console.log(`   Processing: ${basic.naam}`);

  let extraInfo: Partial<Dierenbegraafplaats> = {};

  // Als er een website is, probeer extra info te halen
  if (basic.url) {
    try {
      const content = await fetchWithJina(basic.url);
      extraInfo = parseWebsiteContent(content, basic);
      await delay(500);
    } catch (error) {
      console.log(`   ⚠️ Kon website niet ophalen: ${basic.url}`);
    }
  }

  const bp: Dierenbegraafplaats = {
    naam_begraafplaats: basic.naam,
    gemeente: basic.gemeente,
    provincie: basic.provincie,
    type: 'dierenbegraafplaats',
    plaats: basic.plaats,
    slug: createSlug(basic.naam + '-' + basic.plaats),
    website: basic.url || undefined,
    adres: (basic as { adres?: string }).adres || extraInfo.adres,
    postcode: (basic as { postcode?: string }).postcode || extraInfo.postcode,
    ...extraInfo,
    generated: {
      samenvatting: '',
      kenmerken: ['Dierenbegraafplaats', 'Huisdieren'],
      toegankelijkheid: 'Neem contact op voor actuele openingstijden en toegankelijkheid.'
    }
  };

  // Genereer samenvatting
  bp.generated!.samenvatting = generateSamenvatting(bp);

  return bp;
}

// Zoek extra dierenbegraafplaatsen via Jina Search
async function zoekExtraDierenbegraafplaatsen(): Promise<typeof BEKENDE_DIERENBEGRAAFPLAATSEN> {
  console.log('\n🔍 Zoeken naar extra dierenbegraafplaatsen...');

  const extraBegraafplaatsen: typeof BEKENDE_DIERENBEGRAAFPLAATSEN = [];

  const zoektermen = [
    'dierenbegraafplaats nederland locaties',
    'huisdierbegraafplaats nederland adressen',
    'dierencrematorium nederland begraafplaats'
  ];

  for (const zoekterm of zoektermen) {
    try {
      console.log(`   Zoeken: ${zoekterm}`);
      const results = await searchWithJina(zoekterm);

      // Parse zoekresultaten voor nieuwe locaties
      // Dit is een vereenvoudigde versie - in de praktijk zou je de resultaten beter moeten parsen
      console.log(`   Gevonden: ${results.substring(0, 200)}...`);

      await delay(1000);
    } catch (error) {
      console.log(`   ⚠️ Zoekfout: ${error}`);
    }
  }

  return extraBegraafplaatsen;
}

// Sla data op
function saveData(data: Dierenbegraafplaats[]): void {
  const outputDir = path.join(__dirname, '../data/scraped-dierenbegraafplaatsen');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'dierenbegraafplaatsen.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ ${data.length} dierenbegraafplaatsen opgeslagen in ${outputPath}`);

  // Maak summary
  const summary = {
    totaal: data.length,
    per_provincie: {} as Record<string, number>,
    met_website: data.filter(bp => bp.website).length,
    met_telefoon: data.filter(bp => bp.telefoon).length,
    met_adres: data.filter(bp => bp.adres).length,
    laatste_update: new Date().toISOString()
  };

  for (const bp of data) {
    summary.per_provincie[bp.provincie] = (summary.per_provincie[bp.provincie] || 0) + 1;
  }

  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log('\n📊 Summary:');
  console.log(`   Totaal: ${summary.totaal}`);
  console.log(`   Met website: ${summary.met_website}`);
  console.log(`   Per provincie:`);
  for (const [prov, count] of Object.entries(summary.per_provincie)) {
    console.log(`      ${prov}: ${count}`);
  }
}

// Hoofdfunctie
async function main() {
  console.log('🐾 Start scraping dierenbegraafplaatsen via Jina.ai\n');

  const alleDierenbegraafplaatsen: Dierenbegraafplaats[] = [];

  // Verwerk bekende dierenbegraafplaatsen
  console.log(`📍 Verwerken van ${BEKENDE_DIERENBEGRAAFPLAATSEN.length} bekende dierenbegraafplaatsen...\n`);

  for (let i = 0; i < BEKENDE_DIERENBEGRAAFPLAATSEN.length; i++) {
    const basic = BEKENDE_DIERENBEGRAAFPLAATSEN[i];
    console.log(`[${i + 1}/${BEKENDE_DIERENBEGRAAFPLAATSEN.length}] ${basic.naam}`);

    try {
      const bp = await processDierenbegraafplaats(basic);
      alleDierenbegraafplaatsen.push(bp);
    } catch (error) {
      console.error(`   ❌ Fout: ${error}`);
      // Voeg basis info toe
      alleDierenbegraafplaatsen.push({
        naam_begraafplaats: basic.naam,
        gemeente: basic.gemeente,
        provincie: basic.provincie,
        type: 'dierenbegraafplaats',
        plaats: basic.plaats,
        slug: createSlug(basic.naam + '-' + basic.plaats),
        website: basic.url || undefined,
        generated: {
          samenvatting: `${basic.naam} is een dierenbegraafplaats in ${basic.plaats}, ${basic.provincie}.`,
          kenmerken: ['Dierenbegraafplaats'],
          toegankelijkheid: 'Neem contact op voor actuele informatie.'
        }
      });
    }

    await delay(300);
  }

  // Sla data op
  saveData(alleDierenbegraafplaatsen);

  console.log('\n🎉 Scraping voltooid!');
}

// Run als direct uitgevoerd
main().catch(console.error);
