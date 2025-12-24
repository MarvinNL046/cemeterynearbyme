import fs from 'fs';
import path from 'path';

interface Cemetery {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  jaar_oprichting?: string;
  beheerder?: string;
  gps_coordinaten?: string;
  openingstijden?: string;
  telefoon?: string;
  website?: string;
  faciliteiten?: string;
  oppervlakte?: string;
  aantal_graven?: string;
  aantal_personen?: string;
  status?: string;
  meest_voorkomende_namen?: Array<{ naam: string; aantal: number }>;
  slug: string;
  [key: string]: unknown;
}

interface GeneratedContent {
  samenvatting: string;
  geschiedenis: string;
  kenmerken: string[];
  toegankelijkheid: string;
  voorzieningen: string[];
  bezoekerstips: string[];
  lokaleContext: string;
  statistieken?: string;
  provincieInfo: string;
  typeInfo: string;
  praktischeInfo: string;
  bereikbaarheid: string;
  monumentStatus: string;
  seoTitle: string;
  seoDescription: string;
}

// Province descriptions for context
const provincieContext: Record<string, string> = {
  'Drenthe': 'in het rustige Drenthe, bekend om zijn hunebedden en uitgestrekte heidevelden',
  'Flevoland': 'in Flevoland, de jongste provincie van Nederland op nieuw land',
  'Friesland': 'in Friesland, de provincie met een rijke eigen cultuur en prachtige meren',
  'Gelderland': 'in Gelderland, de grootste provincie met de Veluwe en rivierenlandschap',
  'Groningen': 'in Groningen, het hoge noorden met wijde vergezichten en historische kerken',
  'Limburg': 'in Limburg, de provincie van heuvels, mergel en Bourgondische gastvrijheid',
  'Noord-Brabant': 'in Noord-Brabant, bekend om zijn gezelligheid en rijke historie',
  'Noord-Holland': 'in Noord-Holland, waar historische steden en polders samenkomen',
  'Overijssel': 'in Overijssel, met Hanzesteden en afwisselende landschappen',
  'Utrecht': 'in Utrecht, centraal gelegen met historische rijkdom',
  'Zeeland': 'in Zeeland, de provincie van zon, zee en Deltawerken',
  'Zuid-Holland': 'in Zuid-Holland, met wereldsteden en de beroemde Bollenstreek',
};

// Extended province descriptions for more content
const provincieUitgebreid: Record<string, string> = {
  'Drenthe': 'Drenthe staat bekend als de stilste provincie van Nederland. Het landschap wordt gekenmerkt door uitgestrekte heidevelden, eeuwenoude bossen en de mysterieuze hunebedden die getuigen van bewoning duizenden jaren geleden. De begraafplaatsen in Drenthe weerspiegelen vaak dit rustieke karakter, met veel groen en een serene sfeer die past bij de natuur van de regio.',
  'Flevoland': 'Flevoland is ontstaan door de inpoldering van de Zuiderzee en is daarmee de jongste provincie van Nederland. De begraafplaatsen hier zijn vaak modern van opzet, met strakke lijnen en hedendaagse architectuur. Het vlakke landschap biedt wijdse vergezichten en de begraafplaatsen zijn doorgaans ruim opgezet met veel aandacht voor groen.',
  'Friesland': 'Friesland kent een rijke geschiedenis die teruggaat tot ver voor onze jaartelling. De Friese cultuur en taal maken deze provincie uniek in Nederland. Veel begraafplaatsen in Friesland liggen bij historische kerken of op terpen, de kunstmatige heuvels die de Friezen beschermden tegen het water. De sfeer is vaak ingetogen en verbonden met de lokale gemeenschap.',
  'Gelderland': 'Als grootste provincie van Nederland biedt Gelderland een grote diversiteit aan landschappen: van de Veluwe tot het rivierengebied en de Achterhoek. De begraafplaatsen variëren van bosrijke locaties op de Veluwe tot landelijke kerkhoven in het buitengebied. Gelderland heeft een rijke adellijke geschiedenis die nog zichtbaar is in sommige historische begraafplaatsen.',
  'Groningen': 'Het Groningse land wordt gekenmerkt door wijde vergezichten, wierden (terpen) en eeuwenoude kerken met karakteristieke zadeldaktorens. Veel begraafplaatsen liggen rondom deze historische kerken en ademen de sfeer van eeuwen geschiedenis. Het open landschap geeft begraafplaatsen vaak een bijzondere uitstraling.',
  'Limburg': 'Limburg is de enige provincie in Nederland met heuvels, wat de begraafplaatsen hier een bijzonder karakter geeft. De Bourgondische levenswijze en katholieke traditie zijn sterk vertegenwoordigd. Veel begraafplaatsen liggen bij kapellen of kloosters en kenmerken zich door gedetailleerde grafmonumenten en religieuze symboliek.',
  'Noord-Brabant': 'Noord-Brabant combineert een rijke katholieke traditie met Brabantse gezelligheid. De begraafplaatsen weerspiegelen vaak de sterke gemeenschapszin van de regio. Van historische kerkhoven in middeleeuwse stadjes tot moderne begraafplaatsen in de groeiende steden: Brabant biedt een diversiteit aan laatste rustplaatsen.',
  'Noord-Holland': 'Noord-Holland verenigt de drukte van Amsterdam met de rust van het platteland. De polderlandschappen en historische vissersplaatsen hebben elk hun eigen type begraafplaats. Veel historische begraafplaatsen getuigen van de welvaart uit de Gouden Eeuw, terwijl moderne begraafplaatsen inspelen op de diverse bevolking.',
  'Overijssel': 'Overijssel kent drie onderscheidende regio\'s: Salland, Twente en de Kop van Overijssel. Elk gebied heeft zijn eigen karakter dat terugkomt in de begraafplaatsen. De Hanzesteden langs de IJssel hebben monumentale begraafplaatsen, terwijl het platteland meer landelijke kerkhoven kent bij dorpskerken.',
  'Utrecht': 'De provincie Utrecht ligt in het hart van Nederland en kent een rijke geschiedenis. De stad Utrecht was eeuwenlang het religieuze centrum van de Nederlanden, wat zichtbaar is in de vele historische begraafplaatsen. Het Utrechtse Heuvelrug biedt daarnaast prachtige natuurbegraafplaatsen in bosrijke omgeving.',
  'Zeeland': 'Zeeland is onlosmakelijk verbonden met de zee en de strijd tegen het water. De Watersnoodramp van 1953 heeft diepe sporen nagelaten, ook op de begraafplaatsen. Het eilandenkarakter van Zeeland zorgt voor een gevoel van verbondenheid per eiland, wat terugkomt in de lokale begraafplaatsen.',
  'Zuid-Holland': 'Zuid-Holland is de dichtstbevolkte provincie van Nederland, met grote steden als Rotterdam en Den Haag. Toch zijn er ook groene oases, zoals de Bollenstreek en het Groene Hart. De begraafplaatsen variëren van monumentale stadsbegraafplaatsen tot landelijke kerkhoven in het polderland.',
};

// Type-specific extended descriptions
const typeUitgebreid: Record<string, string> = {
  'algemene begraafplaats': 'Een algemene begraafplaats, ook wel gemeentelijke begraafplaats genoemd, staat open voor alle inwoners ongeacht hun geloof of achtergrond. Dit type begraafplaats wordt beheerd door de gemeente en biedt verschillende mogelijkheden voor begraven en crematie. De grafrechten en onderhoudskosten worden vastgesteld door de gemeente. Op algemene begraafplaatsen vindt u vaak een mix van grafmonumenten, van eenvoudige grafstenen tot uitgebreide familiegrafzerken. Veel algemene begraafplaatsen beschikken over faciliteiten als een aula voor afscheidsdiensten, een urnenmuur en soms een strooiveld.',
  'joodse begraafplaats': 'Joodse begraafplaatsen hebben een bijzondere status in Nederland. Volgens Joodse traditie zijn graven eeuwigdurend: eenmaal begraven wordt een graf nooit geruimd. Dit maakt Joodse begraafplaatsen tot belangrijke historische monumenten. De graven zijn gericht naar het oosten, richting Jeruzalem. Bezoekers plaatsen steentjes op de graven als teken van herinnering, in plaats van bloemen. Mannen dienen bij een bezoek hun hoofd te bedekken. De eenvoud van de graven weerspiegelt de Joodse overtuiging dat alle mensen gelijk zijn in de dood.',
  'natuurbegraafplaats': 'Een natuurbegraafplaats biedt een alternatief voor de traditionele begraafplaats. Hier worden overledenen begraven in een natuurlijke omgeving, waarbij het lichaam bijdraagt aan de natuurcyclus. Kisten en urnen zijn van biologisch afbreekbaar materiaal. In plaats van grafstenen worden vaak bomen of inheemse planten geplant als marker. Natuurbegraafplaatsen zijn relatief nieuw in Nederland maar groeien snel in populariteit. Ze bieden een rustgevende, groene omgeving voor nabestaanden om te herdenken. Het onderhoud is gericht op natuurbeheer in plaats van traditioneel tuinonderhoud.',
  'islamitische begraafplaats': 'Op een Islamitische begraafplaats worden overledenen begraven volgens Islamitische tradities. Dit betekent dat het lichaam zo snel mogelijk na overlijden wordt begraven, vaak binnen 24 uur. De overledene wordt in een wit gewaad gewikkeld en zonder kist begraven, met het gezicht richting Mekka. Islamitische graven zijn eeuwigdurend en worden niet geruimd. De begraafplaatsen zijn vaak sober ingericht, in lijn met het Islamitische uitgangspunt van gelijkheid na de dood. Grafstenen zijn eenvoudig en uniform van vormgeving.',
  'bijzondere begraafplaats': 'Bijzondere begraafplaatsen onderscheiden zich door hun unieke karakter, geschiedenis of ligging. Dit kunnen historische begraafplaatsen zijn met monumentale waarde, begraafplaatsen op bijzondere locaties, of begraafplaatsen met een specifieke functie. Sommige bijzondere begraafplaatsen zijn alleen bestemd voor bepaalde groepen, zoals oorlogsslachtoffers, geestelijken of leden van specifieke organisaties. Deze begraafplaatsen vormen vaak een belangrijk onderdeel van het culturele erfgoed.',
};

// Practical information templates
const praktischeInfo = {
  algemeen: 'Bij het plannen van een bezoek aan een begraafplaats is het verstandig om rekening te houden met enkele praktische zaken. Controleer vooraf de openingstijden, aangezien deze kunnen variëren per seizoen. Draag gepaste kleding en gedraag u respectvol. Honden zijn op de meeste begraafplaatsen niet toegestaan of alleen aangelijnd. Voor het onderhouden van een graf kunt u vaak materialen ter plaatse krijgen, zoals een gieter en bezem.',
  grafrechten: 'Grafrechten worden voor een bepaalde periode afgesloten, meestal 10, 20 of 30 jaar. Na afloop kunnen de rechten worden verlengd. De kosten voor grafrechten variëren per gemeente en type graf. Een algemeen graf is goedkoper dan een eigen graf, maar bij een algemeen graf bepaalt de gemeente waar het graf komt. Bij een eigen graf kiest u zelf de locatie.',
  onderhoud: 'Het onderhoud van een graf is de verantwoordelijkheid van de rechthebbende. Dit omvat het schoonhouden van de grafsteen, het verwijderen van verwelkte bloemen en het bijhouden van eventuele beplanting. Veel begraafplaatsen bieden tegen betaling een onderhoudsabonnement aan. Wanneer een graf onvoldoende wordt onderhouden, kan de gemeente contact opnemen met de rechthebbende.',
};

// Seasonal content
const seizoensContent: Record<string, string> = {
  voorjaar: 'In het voorjaar komen begraafplaatsen tot leven met bloeiende bomen en planten. Dit is een populaire tijd voor grafbezoek, vooral rond Pasen en de periode van dodenherdenking begin mei.',
  zomer: 'De zomermaanden bieden lange dagen voor bezoek. Let wel op de openingstijden, die in de zomer soms uitgebreider zijn. Zorg voor voldoende water voor bloemen en planten op het graf.',
  herfst: 'In de herfst kleuren de begraafplaatsen door vallende bladeren. Rond Allerzielen en Allerheiligen is het traditioneel druk op begraafplaatsen, vooral in katholieke gebieden.',
  winter: 'In de winter zijn de openingstijden vaak korter vanwege de beperkte daglichturen. Kaarsen en winterharde planten bieden mogelijkheden voor grafversiering in het donkere seizoen.',
};

// Bereikbaarheid templates per provincie
const bereikbaarheidInfo: Record<string, string> = {
  'Drenthe': 'Drenthe is goed bereikbaar via de A28 en A37. Het openbaar vervoer is in landelijke gebieden beperkt, dus eigen vervoer is vaak aan te raden.',
  'Flevoland': 'Flevoland is uitstekend bereikbaar via de A6 en A27. De provincie heeft moderne infrastructuur met goede busverbindingen naar de grotere plaatsen.',
  'Friesland': 'Friesland is bereikbaar via de A7 en A32. Vanuit de Randstad rijdt u in ongeveer anderhalf uur naar Leeuwarden. Treinen rijden naar de grotere steden.',
  'Gelderland': 'Gelderland is centraal gelegen en goed bereikbaar via de A1, A12 en A50. De provincie heeft een uitgebreid netwerk van treinstations.',
  'Groningen': 'Groningen is bereikbaar via de A7 en A28. De stad Groningen heeft een groot treinstation met verbindingen door het hele land.',
  'Limburg': 'Limburg is bereikbaar via de A2 en A79. De provincie grenst aan België en Duitsland, wat alternatieve routes biedt. Maastricht heeft goede treinverbindingen.',
  'Noord-Brabant': 'Noord-Brabant is uitstekend bereikbaar via de A2, A58 en A59. De grote steden hebben treinstations met frequente verbindingen.',
  'Noord-Holland': 'Noord-Holland is zeer goed bereikbaar met uitgebreide snelweg- en treinnetwerken. Amsterdam Centraal is een belangrijk knooppunt.',
  'Overijssel': 'Overijssel is bereikbaar via de A1 en A28. Zwolle is een belangrijk treinknooppunt voor de regio.',
  'Utrecht': 'Utrecht ligt centraal in Nederland met uitstekende bereikbaarheid via de A2, A12 en A27. Utrecht Centraal is het drukste station van Nederland.',
  'Zeeland': 'Zeeland is bereikbaar via de A58 en de Westerscheldetunnel. Het openbaar vervoer is beperkter dan in andere provincies.',
  'Zuid-Holland': 'Zuid-Holland heeft een uitstekende infrastructuur met de A4, A12 en A13. Rotterdam en Den Haag hebben grote stations met intercity-verbindingen.',
};

// Monument status variations
const monumentInfo: Record<string, string> = {
  historisch: 'Historische begraafplaatsen van voor 1900 hebben vaak de status van rijksmonument of gemeentelijk monument. Dit betekent dat de karakteristieke elementen beschermd zijn en onderhouden worden volgens richtlijnen van de Rijksdienst voor het Cultureel Erfgoed. Monumentale grafzerken, hekwerken en poortgebouwen dragen bij aan de cultuurhistorische waarde.',
  modern: 'Moderne begraafplaatsen zijn ontworpen met aandacht voor hedendaagse eisen aan toegankelijkheid, milieu en onderhoud. De inrichting is vaak strak en functioneel, met ruimte voor verschillende grafvormen en herdenkingsmogelijkheden.',
};

// Type-specific content variations
const typeIntros: Record<string, string[]> = {
  'algemene begraafplaats': [
    'Deze gemeentelijke begraafplaats biedt een waardige rustplaats voor overledenen uit de regio.',
    'Als algemene begraafplaats staat deze locatie open voor alle gezindten en achtergronden.',
    'Deze begraafplaats vervult een belangrijke functie voor de lokale gemeenschap.',
  ],
  'joodse begraafplaats': [
    'Deze Joodse begraafplaats getuigt van de rijke Joodse geschiedenis in de regio.',
    'Als Joodse begraafplaats wordt deze locatie met respect onderhouden volgens Joodse tradities.',
    'Deze historische Joodse begraafplaats is een belangrijk cultureel erfgoed.',
  ],
  'natuurbegraafplaats': [
    'Deze natuurbegraafplaats biedt een laatste rustplaats in harmonie met de natuur.',
    'Op deze natuurbegraafplaats kunnen overledenen terugkeren naar de natuur.',
    'Deze ecologische begraafplaats combineert natuurbehoud met een waardige uitvaart.',
  ],
  'islamitische begraafplaats': [
    'Deze Islamitische begraafplaats biedt een rustplaats volgens Islamitische tradities.',
    'Als Islamitische begraafplaats wordt hier begraven volgens de Islamitische gebruiken.',
    'Deze begraafplaats voorziet in de behoefte van de Islamitische gemeenschap.',
  ],
  'bijzondere begraafplaats': [
    'Deze bijzondere begraafplaats heeft een uniek karakter en geschiedenis.',
    'Als bijzondere begraafplaats onderscheidt deze locatie zich door haar unieke kenmerken.',
    'Deze begraafplaats heeft een bijzondere status vanwege haar geschiedenis of ligging.',
  ],
};

// Facility descriptions
const facilityDescriptions: Record<string, string> = {
  'Parkeerplaats': 'Er is een parkeerplaats aanwezig voor bezoekers.',
  'Rolstoeltoegankelijk': 'De begraafplaats is toegankelijk voor rolstoelgebruikers.',
  'Aula': 'Een aula is beschikbaar voor afscheidsdiensten.',
  'Toilet': 'Toiletvoorzieningen zijn aanwezig voor bezoekers.',
  'Watervoorziening': 'Er is watervoorziening voor het onderhoud van graven.',
  'Urnenmuur': 'Er is een urnenmuur voor bijzetting van urnen.',
  'Strooiveld': 'Een strooiveld is beschikbaar voor het uitstrooien van as.',
  'Kindergraven': 'Er is een speciale afdeling voor kindergraven.',
  'Oorlogsgraven': 'Op deze begraafplaats bevinden zich oorlogsgraven.',
};

// Generate visitor tips based on type and facilities
function generateBezoekerstips(cemetery: Cemetery): string[] {
  const tips: string[] = [];

  // General tips
  tips.push('Respecteer de rust en stilte op de begraafplaats.');

  if (cemetery.openingstijden) {
    tips.push(`Controleer de openingstijden voor uw bezoek: ${cemetery.openingstijden.toLowerCase()}.`);
  }

  // Type-specific tips
  if (cemetery.type === 'joodse begraafplaats') {
    tips.push('Mannen dienen hun hoofd te bedekken bij het bezoeken van Joodse graven.');
    tips.push('Plaats steentjes in plaats van bloemen op de graven, volgens Joodse traditie.');
  } else if (cemetery.type === 'islamitische begraafplaats') {
    tips.push('Toon respect voor de Islamitische tradities tijdens uw bezoek.');
    tips.push('Vrouwen dienen gepast gekleed te zijn.');
  } else if (cemetery.type === 'natuurbegraafplaats') {
    tips.push('Draag stevige schoenen geschikt voor natuurpaden.');
    tips.push('Houd rekening met de natuur en blijf op de paden.');
  }

  // Facility-based tips
  const faciliteiten = cemetery.faciliteiten?.toLowerCase() || '';
  if (!faciliteiten.includes('parkeerplaats')) {
    tips.push('Parkeren in de omgeving kan beperkt zijn; plan uw reis vooruit.');
  }

  if (faciliteiten.includes('rolstoeltoegankelijk')) {
    tips.push('De begraafplaats is toegankelijk voor mensen met een beperking.');
  }

  return tips.slice(0, 5);
}

// Generate statistics section
function generateStatistieken(cemetery: Cemetery): string | undefined {
  const parts: string[] = [];

  if (cemetery.oppervlakte) {
    const opp = parseInt(cemetery.oppervlakte);
    if (opp > 0) {
      parts.push(`een oppervlakte van ${opp.toLocaleString('nl-NL')} m²`);
    }
  }

  if (cemetery.aantal_graven) {
    const graven = parseInt(cemetery.aantal_graven);
    if (graven > 0) {
      parts.push(`${graven.toLocaleString('nl-NL')} graven`);
    }
  }

  if (cemetery.aantal_personen) {
    const personen = parseInt(cemetery.aantal_personen);
    if (personen > 0) {
      parts.push(`${personen.toLocaleString('nl-NL')} bijgezette personen`);
    }
  }

  if (parts.length === 0) return undefined;

  let text = `De begraafplaats heeft ${parts.join(', ')}.`;

  // Add common names if available
  if (cemetery.meest_voorkomende_namen && cemetery.meest_voorkomende_namen.length > 0) {
    const namen = cemetery.meest_voorkomende_namen.slice(0, 3).map(n => n.naam);
    text += ` De meest voorkomende familienamen op deze begraafplaats zijn ${namen.join(', ')}.`;
  }

  return text;
}

// Generate local context
function generateLokaleContext(cemetery: Cemetery): string {
  const provincieInfo = provincieContext[cemetery.provincie] || `in de provincie ${cemetery.provincie}`;

  let text = `${cemetery.naam_begraafplaats} is gelegen ${provincieInfo}. `;

  if (cemetery.plaats && cemetery.plaats !== cemetery.gemeente) {
    text += `De begraafplaats bevindt zich in ${cemetery.plaats}, een plaats binnen de gemeente ${cemetery.gemeente}. `;
  } else {
    text += `De begraafplaats maakt deel uit van de gemeente ${cemetery.gemeente}. `;
  }

  // Add address if available
  if (cemetery.adres) {
    text += `U vindt de begraafplaats aan ${cemetery.adres}`;
    if (cemetery.postcode) {
      text += ` (${cemetery.postcode})`;
    }
    text += '. ';
  }

  return text;
}

// Generate history section
function generateGeschiedenis(cemetery: Cemetery): string {
  let text = '';

  if (cemetery.jaar_oprichting) {
    const jaar = parseInt(cemetery.jaar_oprichting);
    const huidigjaar = new Date().getFullYear();
    const leeftijd = huidigjaar - jaar;

    if (jaar < 1900) {
      text = `${cemetery.naam_begraafplaats} is een historische begraafplaats die werd opgericht in ${jaar}. Met een geschiedenis van meer dan ${leeftijd} jaar is deze begraafplaats een belangrijk onderdeel van het lokale erfgoed. `;
    } else if (jaar < 1950) {
      text = `Deze begraafplaats werd in ${jaar} aangelegd en heeft inmiddels een geschiedenis van ${leeftijd} jaar. In de loop der jaren is de begraafplaats uitgegroeid tot een belangrijke locatie voor de gemeenschap. `;
    } else {
      text = `${cemetery.naam_begraafplaats} is opgericht in ${jaar}. Als relatief moderne begraafplaats voldoet deze aan hedendaagse eisen en wensen. `;
    }
  } else {
    // Generic history based on type
    if (cemetery.type === 'joodse begraafplaats') {
      text = 'Joodse begraafplaatsen in Nederland hebben vaak een lange geschiedenis en getuigen van de Joodse aanwezigheid in de regio door de eeuwen heen. ';
    } else if (cemetery.type === 'natuurbegraafplaats') {
      text = 'Natuurbegraafplaatsen zijn een relatief nieuw concept in Nederland, opgekomen sinds de jaren 2000 als duurzaam alternatief. ';
    } else {
      text = 'Deze begraafplaats maakt deel uit van de lokale geschiedenis en biedt al generaties lang een laatste rustplaats aan inwoners van de gemeente. ';
    }
  }

  // Add beheerder info
  if (cemetery.beheerder) {
    text += `De begraafplaats wordt beheerd door ${cemetery.beheerder.toLowerCase() === 'gemeentelijk' ? 'de gemeente' : cemetery.beheerder}. `;
  }

  return text;
}

// Generate features list
function generateKenmerken(cemetery: Cemetery): string[] {
  const kenmerken: string[] = [];

  // Type as feature
  const typeDisplay = cemetery.type.charAt(0).toUpperCase() + cemetery.type.slice(1);
  kenmerken.push(typeDisplay);

  // Add from faciliteiten
  if (cemetery.faciliteiten) {
    const facilities = cemetery.faciliteiten.split(',').map(f => f.trim());
    facilities.forEach(f => {
      if (f && !kenmerken.includes(f)) {
        kenmerken.push(f);
      }
    });
  }

  // Add special features based on data
  if (cemetery.oppervlakte) {
    const opp = parseInt(cemetery.oppervlakte);
    if (opp > 50000) kenmerken.push('Groot terrein');
    else if (opp < 5000) kenmerken.push('Intiem karakter');
  }

  if (cemetery.jaar_oprichting) {
    const jaar = parseInt(cemetery.jaar_oprichting);
    if (jaar < 1900) kenmerken.push('Monumentale begraafplaats');
  }

  return kenmerken.slice(0, 8);
}

// Generate accessibility section
function generateToegankelijkheid(cemetery: Cemetery): string {
  let text = '';

  const faciliteiten = cemetery.faciliteiten?.toLowerCase() || '';

  if (faciliteiten.includes('rolstoeltoegankelijk')) {
    text = `${cemetery.naam_begraafplaats} is toegankelijk voor bezoekers met een beperking. De paden zijn geschikt voor rolstoelen en rollators. `;
  } else {
    text = 'De toegankelijkheid kan variëren afhankelijk van de weersomstandigheden en het terrein. ';
  }

  if (faciliteiten.includes('parkeerplaats')) {
    text += 'Er is een parkeerplaats aanwezig nabij de ingang. ';
  }

  // Add GPS/navigation info
  if (cemetery.gps_coordinaten) {
    text += 'De exacte locatie is eenvoudig te vinden met behulp van navigatie. ';
  }

  return text;
}

// Generate voorzieningen list
function generateVoorzieningen(cemetery: Cemetery): string[] {
  const voorzieningen: string[] = [];

  if (cemetery.faciliteiten) {
    const facilities = cemetery.faciliteiten.split(',').map(f => f.trim());
    facilities.forEach(f => {
      const desc = facilityDescriptions[f];
      if (desc) {
        voorzieningen.push(desc);
      } else if (f) {
        voorzieningen.push(`${f} is beschikbaar.`);
      }
    });
  }

  // Add contact info as voorziening
  if (cemetery.telefoon) {
    voorzieningen.push(`Telefonisch contact is mogelijk via ${cemetery.telefoon}.`);
  }

  if (cemetery.website) {
    voorzieningen.push('Meer informatie is te vinden op de website van de beheerder.');
  }

  return voorzieningen;
}

// Generate practical info section based on type
function generatePraktischeInfo(cemetery: Cemetery): string {
  let info = praktischeInfo.algemeen + ' ';

  // Add type-specific practical info
  if (cemetery.type === 'natuurbegraafplaats') {
    info += 'Op natuurbegraafplaatsen gelden vaak specifieke regels voor grafversiering. Alleen natuurlijke materialen zijn toegestaan. ';
  } else if (cemetery.type === 'joodse begraafplaats') {
    info += 'Joodse begraafplaatsen kunnen beperkte openingstijden hebben en zijn soms alleen toegankelijk op afspraak. ';
  } else {
    info += praktischeInfo.grafrechten + ' ';
  }

  // Add contact info if available
  if (cemetery.telefoon) {
    info += `Voor vragen over deze begraafplaats kunt u telefonisch contact opnemen via ${cemetery.telefoon}. `;
  }

  if (cemetery.website) {
    info += 'Raadpleeg de website voor actuele informatie over tarieven en beschikbaarheid. ';
  }

  return info;
}

// Main content generation function
function generateContent(cemetery: Cemetery): GeneratedContent {
  // Select intro variation based on hash of name (for consistency)
  const intros = typeIntros[cemetery.type] || typeIntros['algemene begraafplaats'];
  const introIndex = cemetery.naam_begraafplaats.length % intros.length;
  const intro = intros[introIndex];

  // Build samenvatting
  const provincieKort = provincieContext[cemetery.provincie] || `in ${cemetery.provincie}`;
  let samenvatting = `${cemetery.naam_begraafplaats} is een ${cemetery.type} gelegen in ${cemetery.gemeente}, ${provincieKort}. ${intro}`;

  if (cemetery.jaar_oprichting) {
    samenvatting += ` De begraafplaats werd opgericht in ${cemetery.jaar_oprichting}.`;
  }

  // Extended province info
  const provincieInfo = provincieUitgebreid[cemetery.provincie] ||
    `De provincie ${cemetery.provincie} biedt een diversiteit aan begraafplaatsen, elk met hun eigen karakter en geschiedenis.`;

  // Extended type info
  const typeInfo = typeUitgebreid[cemetery.type] || typeUitgebreid['algemene begraafplaats'];

  // Generate SEO title and description
  const seoTitle = `${cemetery.naam_begraafplaats} | ${cemetery.type.charAt(0).toUpperCase() + cemetery.type.slice(1)} in ${cemetery.gemeente}`;
  const seoDescription = `Informatie over ${cemetery.naam_begraafplaats} in ${cemetery.gemeente}, ${cemetery.provincie}. ${cemetery.type.charAt(0).toUpperCase() + cemetery.type.slice(1)} met openingstijden, faciliteiten en routebeschrijving.`;

  // Bereikbaarheid info
  const bereikbaarheid = bereikbaarheidInfo[cemetery.provincie] ||
    'De begraafplaats is bereikbaar met eigen vervoer. Raadpleeg een routeplanner voor de beste route.';

  // Monument status based on year
  let monumentStatus = monumentInfo.modern;
  if (cemetery.jaar_oprichting) {
    const jaar = parseInt(cemetery.jaar_oprichting);
    if (jaar < 1900) {
      monumentStatus = monumentInfo.historisch;
    }
  }

  return {
    samenvatting,
    geschiedenis: generateGeschiedenis(cemetery),
    kenmerken: generateKenmerken(cemetery),
    toegankelijkheid: generateToegankelijkheid(cemetery),
    voorzieningen: generateVoorzieningen(cemetery),
    bezoekerstips: generateBezoekerstips(cemetery),
    lokaleContext: generateLokaleContext(cemetery),
    statistieken: generateStatistieken(cemetery),
    provincieInfo,
    typeInfo,
    praktischeInfo: generatePraktischeInfo(cemetery),
    bereikbaarheid,
    monumentStatus,
    seoTitle,
    seoDescription,
  };
}

// Calculate word count
function countWords(content: GeneratedContent): number {
  const allText = [
    content.samenvatting,
    content.geschiedenis,
    content.kenmerken.join(' '),
    content.toegankelijkheid,
    content.voorzieningen.join(' '),
    content.bezoekerstips.join(' '),
    content.lokaleContext,
    content.statistieken || '',
    content.provincieInfo,
    content.typeInfo,
    content.praktischeInfo,
    content.bereikbaarheid,
    content.monumentStatus,
  ].join(' ');

  return allText.split(/\s+/).filter(w => w.length > 0).length;
}

// Main execution
async function main() {
  const dataPath = path.join(process.cwd(), 'public/data/cemeteries.json');
  const data: Cemetery[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`Generating content for ${data.length} cemeteries...`);

  let totalWords = 0;
  let minWords = Infinity;
  let maxWords = 0;

  // Generate content for all cemeteries
  const enrichedData = data.map((cemetery, index) => {
    const generated = generateContent(cemetery);
    const wordCount = countWords(generated);

    totalWords += wordCount;
    minWords = Math.min(minWords, wordCount);
    maxWords = Math.max(maxWords, wordCount);

    if (index < 2) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Voorbeeld ${index + 1}: ${cemetery.naam_begraafplaats}`);
      console.log(`${'='.repeat(60)}`);
      console.log(`Totaal woorden: ${wordCount}`);
      console.log(`\n--- SAMENVATTING ---\n${generated.samenvatting}`);
      console.log(`\n--- GESCHIEDENIS ---\n${generated.geschiedenis}`);
      console.log(`\n--- TYPE INFO (excerpt) ---\n${generated.typeInfo.substring(0, 200)}...`);
      console.log(`\n--- PROVINCIE INFO (excerpt) ---\n${generated.provincieInfo.substring(0, 200)}...`);
      console.log(`\n--- STATISTIEKEN ---\n${generated.statistieken || 'Niet beschikbaar'}`);
      console.log(`\n--- KENMERKEN ---\n${generated.kenmerken.join(', ')}`);
    }

    return {
      ...cemetery,
      generated,
      seoTitle: generated.seoTitle,
      seoDescription: generated.seoDescription,
    };
  });

  // Save enriched data
  fs.writeFileSync(dataPath, JSON.stringify(enrichedData, null, 2));

  console.log(`\n\n========================================`);
  console.log(`Content generatie voltooid!`);
  console.log(`========================================`);
  console.log(`Totaal begraafplaatsen: ${data.length}`);
  console.log(`Gemiddeld aantal woorden: ${Math.round(totalWords / data.length)}`);
  console.log(`Minimum woorden: ${minWords}`);
  console.log(`Maximum woorden: ${maxWords}`);
  console.log(`========================================`);
}

main().catch(console.error);
