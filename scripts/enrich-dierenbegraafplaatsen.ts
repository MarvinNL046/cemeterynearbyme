import * as fs from 'fs';
import * as path from 'path';

/**
 * Content enrichment for dierenbegraafplaatsen (pet cemeteries)
 * Generates rich, SEO-friendly content for pet cemetery detail pages
 */

interface Dierenbegraafplaats {
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string;
  plaats: string;
  slug: string;
  website?: string;
  adres?: string;
  postcode?: string;
  telefoon?: string;
  email?: string;
  beschrijving?: string;
  rating?: string;
  reviews?: string;
  openingstijden?: string;
  faciliteiten?: string;
  generated?: GeneratedContent;
}

interface GeneratedContent {
  samenvatting: string;
  geschiedenis: string;
  kenmerken: string[];
  toegankelijkheid: string;
  voorzieningen: string[];
  bezoekerstips: string[];
  diensten: string;
  rouwbegeleiding: string;
  typeInfo: string;
  provincieInfo: string;
  praktischeInfo: string;
  diersoorten: string;
  herdenkingsmogelijkheden: string;
}

// Province-specific information
const PROVINCIE_INFO: Record<string, string> = {
  'Groningen': 'In de provincie Groningen zijn meerdere dierenbegraafplaatsen te vinden die huisdieren een waardige laatste rustplaats bieden. De Groningse locaties kenmerken zich door hun ruime opzet en de kenmerkende noordelijke landschappen.',
  'Friesland': 'Friesland biedt verschillende mogelijkheden voor het begraven of cremeren van huisdieren. De Friese dierenbegraafplaatsen liggen vaak in natuurrijke omgevingen en zijn bekend om hun warme, persoonlijke benadering.',
  'Drenthe': 'De provincie Drenthe kent een relatief groot aantal dierenbegraafplaatsen, mede door de uitgestrekte natuur en rust die de regio kenmerkt. Veel locaties liggen in bosrijke omgevingen die een serene sfeer bieden.',
  'Overijssel': 'In Overijssel vinden huisdiereigenaren diverse mogelijkheden voor een waardig afscheid. De dierenbegraafplaatsen in deze provincie zijn vaak gelegen in landelijke gebieden met veel groen.',
  'Flevoland': 'Als jongste provincie van Nederland biedt Flevoland moderne faciliteiten voor huisdierencrematie en -begraving. De locaties zijn goed bereikbaar en hebben vaak uitgebreide herdenkingsmogelijkheden.',
  'Gelderland': 'Gelderland is de provincie met het grootste aantal dierenbegraafplaatsen in Nederland. Van de Veluwe tot de Betuwe zijn er diverse locaties die variëren van intieme begraafplaatsen tot grotere complexen met uitgebreide faciliteiten.',
  'Utrecht': 'In de provincie Utrecht zijn meerdere dierenbegraafplaatsen te vinden die gemakkelijk bereikbaar zijn vanuit het hele land. De centrale ligging maakt deze locaties populair bij huisdiereigenaren uit de Randstad.',
  'Noord-Holland': 'Noord-Holland biedt diverse mogelijkheden voor het afscheid van huisdieren. Van rustige locaties in het Gooi tot faciliteiten in de buurt van Amsterdam, er is voor elke wens een passende plek.',
  'Zuid-Holland': 'In de dichtstbevolkte provincie van Nederland zijn verschillende dierenbegraafplaatsen te vinden. Ondanks de stedelijke omgeving bieden deze locaties een rustgevende en groene omgeving voor het afscheid.',
  'Zeeland': 'Zeeland heeft enkele dierenbegraafplaatsen die zich kenmerken door hun ligging in het Zeeuwse landschap. De rust en ruimte maken deze locaties bijzonder voor een laatste afscheid.',
  'Noord-Brabant': 'Noord-Brabant beschikt over een uitgebreid netwerk van dierenbegraafplaatsen en crematoria. De Brabantse gastvrijheid komt tot uiting in de persoonlijke begeleiding die deze locaties bieden.',
  'Limburg': 'In Limburg zijn diverse dierenbegraafplaatsen te vinden, vaak gelegen in de karakteristieke heuvels en bosrijke omgevingen van de provincie. De zuidelijke locaties staan bekend om hun warme en persoonlijke aanpak.',
};

// Facility variations based on location characteristics
const DIENSTEN_TEMPLATES = [
  'Bij {naam} kunnen huisdiereigenaren kiezen uit verschillende afscheidsmogelijkheden. Zowel individuele crematie als gezamenlijke crematie behoren tot de mogelijkheden. Ook begraving in een eigen graf of op de algemene begraafplaats is mogelijk. De medewerkers begeleiden families door het gehele proces en helpen bij het maken van keuzes die passen bij de wensen van de eigenaar en het karakter van het huisdier.',
  '{naam} biedt een breed scala aan diensten voor het afscheid van huisdieren. Van huisophaling tot het verzorgen van een complete uitvaart, alles wordt met zorg en aandacht geregeld. Eigenaren kunnen aanwezig zijn bij de crematie en hebben de mogelijkheid om de as mee naar huis te nemen in een urn naar keuze.',
  'De dienstverlening bij {naam} omvat alle aspecten van het afscheid van een huisdier. Er worden persoonlijke ceremonies verzorgd, waarbij ruimte is voor eigen invulling. De locatie beschikt over een rouwkamer waar eigenaren in alle rust afscheid kunnen nemen. Ook worden diverse urnen en herdenkingsartikelen aangeboden.',
];

const HERDENKINGS_TEMPLATES = [
  'Op {naam} zijn diverse herdenkingsmogelijkheden beschikbaar. Eigenaren kunnen kiezen voor een persoonlijk grafmonument, een gedenkplaat, of een plek in de herinneringstuin. Sommige huisdiereigenaren kiezen ervoor om de as te verstrooien in het speciale verstrooiveld. Ook zijn er mogelijkheden voor het plaatsen van een gedenkboom of -struik.',
  'De herdenkingsmogelijkheden bij {naam} zijn divers en kunnen worden aangepast aan persoonlijke wensen. Van klassieke grafstenen tot moderne gedenkobjecten, er is voor elke smaak en elk budget een passende optie. De herinneringstuin biedt een serene plek om terug te komen en het huisdier te herdenken.',
  'Bij {naam} staan verschillende herdenkingsopties ter beschikking. Populaire keuzes zijn onder meer gepersonaliseerde urnen, gedenkstenen met foto, en herdenkingssieraden waarin een klein deel van de as kan worden bewaard. De locatie organiseert jaarlijks een herdenkingsbijeenkomst voor alle huisdiereigenaren.',
];

const ROUW_TEMPLATES = [
  'Het team van {naam} begrijpt dat het verlies van een huisdier diep ingrijpt. Daarom bieden zij niet alleen praktische hulp, maar ook emotionele ondersteuning. Er is ruimte voor gesprekken en het delen van herinneringen. Indien gewenst kunnen eigenaren worden doorverwezen naar gespecialiseerde rouwbegeleiding voor huisdierverlies.',
  'Bij {naam} staat de menselijke maat centraal. De medewerkers nemen de tijd voor eigenaren die net hun huisdier hebben verloren en bieden een luisterend oor. Er worden tips en adviezen gegeven over het omgaan met verlies, en er is informatie beschikbaar over rouwverwerking na het overlijden van een huisdier.',
  'De begeleiding bij {naam} gaat verder dan alleen de praktische zaken. Het personeel is getraind in het omgaan met rouw en verdriet. Zij begrijpen de speciale band tussen mens en huisdier en behandelen elke situatie met respect en empathie. Na het afscheid blijft de locatie beschikbaar voor bezoek en herdenking.',
];

const DIERSOORTEN_TEMPLATES = [
  '{naam} verwelkomt alle soorten huisdieren voor een laatste afscheid. Van honden en katten tot konijnen, vogels, hamsters en reptielen - elk dier wordt met evenveel zorg en respect behandeld. Ook voor grotere dieren zoals paarden en pony\'s zijn er passende oplossingen. De faciliteiten zijn aangepast aan dieren van verschillende groottes.',
  'Op {naam} kunnen alle huisdieren terecht, ongeacht grootte of soort. De meest voorkomende gasten zijn honden en katten, maar ook kleinere dieren zoals cavia\'s, konijnen, vogels en vissen krijgen hier een waardige laatste rustplaats. Voor bijzondere of exotische dieren wordt altijd een maatwerkoplossing gezocht.',
  'De dienstverlening bij {naam} staat open voor alle huisdieren. Het maakt niet uit of het gaat om een trouwe hond, een aanhankelijke kat, een speels konijn of een kleurrijke parkiet - elk dier verdient een respectvol afscheid. De medewerkers hebben ervaring met een grote diversiteit aan diersoorten en weten precies hoe ze elk individueel dier moeten behandelen.',
];

const PRAKTISCHE_TEMPLATES = [
  'Voor een bezoek aan {naam} is het raadzaam vooraf contact op te nemen. Zo kunnen de medewerkers zich voorbereiden en voldoende tijd inruimen. In geval van een acuut overlijden is de locatie vaak 24 uur per dag bereikbaar voor ophaalservice. De kosten variëren afhankelijk van de gekozen diensten en het gewicht van het dier. Op verzoek wordt een vrijblijvende offerte opgesteld.',
  'Praktische informatie: {naam} is zowel op afspraak als voor directe bezoeken bereikbaar. Bij overlijden in het weekend of \'s avonds kan vaak dezelfde dag nog worden opgehaald. Betaling kan contant of per pin, sommige locaties bieden ook de mogelijkheid tot gespreide betaling. Het is verstandig om na te gaan of de huisdierenverzekering een deel van de kosten vergoedt.',
  'Bezoekers van {naam} kunnen rekenen op een gastvrije ontvangst. Er is meestal voldoende parkeergelegenheid aanwezig. De locatie is rolstoeltoegankelijk en ook kinderen zijn welkom. Het wordt aangeraden om bij een eerste bezoek de mogelijkheden rustig te bespreken, eventueel al voordat het huisdier is overleden. Dit voorkomt dat moeilijke beslissingen onder tijdsdruk moeten worden genomen.',
];

function generateRandomVariation<T>(templates: T[]): T {
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateKenmerken(bp: Dierenbegraafplaats): string[] {
  const baseKenmerken = [
    'Waardige laatste rustplaats voor huisdieren',
    'Persoonlijke begeleiding bij het afscheid',
    'Diverse keuzemogelijkheden voor crematie en begraving',
  ];

  const extraKenmerken = [
    'Herinneringstuin voor rust en bezinning',
    'Mogelijkheid tot individuele crematie',
    'Ruim aanbod aan urnen en gedenkartikelen',
    'Professionele en empathische medewerkers',
    'Rustige en groene omgeving',
    '24-uurs ophaalservice beschikbaar',
    'Mogelijkheid voor persoonlijke ceremonie',
    'Verstrooiveld voor as aanwezig',
    'Gedenkplaats voor gezamenlijke herdenking',
  ];

  // Shuffle and pick 3-4 extra kenmerken
  const shuffled = extraKenmerken.sort(() => Math.random() - 0.5);
  return [...baseKenmerken, ...shuffled.slice(0, Math.floor(Math.random() * 2) + 3)];
}

function generateVoorzieningen(bp: Dierenbegraafplaats): string[] {
  const voorzieningen = [
    'Parkeerplaats',
    'Rouwkamer',
    'Ontvangstruimte',
    'Herinneringstuin',
    'Toiletvoorzieningen',
  ];

  const extraVoorzieningen = [
    'Koffie- en thee faciliteiten',
    'Rolstoeltoegankelijk',
    'Crematieoven',
    'Verstrooiveld',
    'Afscheidsruimte',
    'Winkel met urnen en gedenkartikelen',
    'Kinderhoek',
    'Buitenterras',
  ];

  const shuffled = extraVoorzieningen.sort(() => Math.random() - 0.5);
  return [...voorzieningen, ...shuffled.slice(0, Math.floor(Math.random() * 3) + 2)];
}

function generateBezoekerstips(bp: Dierenbegraafplaats): string[] {
  const tips = [
    'Maak indien mogelijk vooraf een afspraak, zodat er voldoende tijd voor u wordt gereserveerd',
    'Neem een foto van uw huisdier mee als u een gepersonaliseerd gedenkteken wilt laten maken',
    'Het is toegestaan om bloemen of een klein gedenkteken bij het graf te plaatsen',
    'Kinderen zijn welkom en mogen mee bij het afscheid nemen',
    'Vraag naar de verschillende mogelijkheden en bijbehorende kosten',
    'Bewaar de crematie-as eventueel in een luchtdichte urn tot u een beslissing hebt genomen',
    'Neem de tijd voor uw bezoek, er wordt geen haast gemaakt',
    'Informeer naar de mogelijkheid om aanwezig te zijn bij de crematie',
  ];

  const shuffled = tips.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

function generateContent(bp: Dierenbegraafplaats): GeneratedContent {
  const naam = bp.naam_begraafplaats;
  const gemeente = bp.gemeente;
  const provincie = bp.provincie;
  const plaats = bp.plaats || gemeente;

  // Determine if it's primarily a crematorium or cemetery based on name
  const isCrematorium = naam.toLowerCase().includes('cremator') || naam.toLowerCase().includes('crematie');
  const typeText = isCrematorium ? 'dierencrematorium' : 'dierenbegraafplaats';

  const samenvatting = `${naam} is een ${typeText} gelegen in ${plaats}, gemeente ${gemeente}, in de provincie ${provincie}. Deze locatie biedt huisdiereigenaren de mogelijkheid om op een waardige en respectvolle manier afscheid te nemen van hun trouwe metgezel. Met aandacht voor zowel het dier als de eigenaar wordt hier gezorgd voor een passend en persoonlijk afscheid.`;

  const geschiedenis = `${naam} maakt deel uit van het groeiende netwerk van dierenbegraafplaatsen en crematoria in Nederland. De afgelopen decennia is het bewustzijn over de emotionele band tussen mens en huisdier sterk toegenomen, wat heeft geleid tot meer professionele mogelijkheden voor het afscheid van huisdieren. ${typeText === 'dierencrematorium' ? 'Als dierencrematorium biedt deze locatie moderne faciliteiten voor het cremeren van huisdieren.' : 'Als dierenbegraafplaats biedt deze locatie een groene en rustgevende omgeving voor de laatste rustplaats van huisdieren.'} De medewerkers hebben jarenlange ervaring in het begeleiden van families bij dit moeilijke proces.`;

  const toegankelijkheid = bp.adres
    ? `${naam} is gevestigd aan ${bp.adres}${bp.postcode ? `, ${bp.postcode}` : ''} in ${plaats}. De locatie is goed bereikbaar met de auto en beschikt over parkeergelegenheid. Voor bezoekers die met het openbaar vervoer komen, zijn er bushaltes in de nabije omgeving. Neem bij twijfel over de bereikbaarheid contact op met de locatie.`
    : `${naam} is gelegen in ${plaats} in de gemeente ${gemeente}. Neem contact op met de locatie voor exacte adresgegevens en routebeschrijving. De medewerkers kunnen u informeren over de beste manier om de locatie te bereiken.`;

  const diensten = generateRandomVariation(DIENSTEN_TEMPLATES).replace(/{naam}/g, naam);
  const herdenkingsmogelijkheden = generateRandomVariation(HERDENKINGS_TEMPLATES).replace(/{naam}/g, naam);
  const rouwbegeleiding = generateRandomVariation(ROUW_TEMPLATES).replace(/{naam}/g, naam);
  const diersoorten = generateRandomVariation(DIERSOORTEN_TEMPLATES).replace(/{naam}/g, naam);
  const praktischeInfo = generateRandomVariation(PRAKTISCHE_TEMPLATES).replace(/{naam}/g, naam);

  const provincieInfo = PROVINCIE_INFO[provincie] ||
    `In de provincie ${provincie} zijn meerdere mogelijkheden voor het afscheid van huisdieren. De dierenbegraafplaatsen en crematoria in deze regio staan bekend om hun professionele en persoonlijke benadering.`;

  const typeInfo = isCrematorium
    ? 'Een dierencrematorium biedt de mogelijkheid om huisdieren te cremeren. Bij individuele crematie ontvangt de eigenaar de as van het eigen huisdier terug, die bewaard kan worden in een urn of verstrooid kan worden op een betekenisvolle plek. Gezamenlijke crematie is een alternatief waarbij de as niet wordt teruggegeven maar op een respectvolle wijze wordt verwerkt. Veel eigenaren ervaren troost bij het kunnen bewaren van een fysieke herinnering aan hun huisdier.'
    : 'Een dierenbegraafplaats is een speciaal aangelegde begraafplaats waar huisdieren kunnen worden begraven. In tegenstelling tot het begraven in de eigen tuin, wat in Nederland onder bepaalde voorwaarden is toegestaan, biedt een officiële dierenbegraafplaats een permanente rustplaats. Het graf kan worden bezocht en onderhouden, en er zijn mogelijkheden voor het plaatsen van een gedenkteken. Veel eigenaren vinden troost in het hebben van een vaste plek om hun huisdier te herdenken.';

  return {
    samenvatting,
    geschiedenis,
    kenmerken: generateKenmerken(bp),
    toegankelijkheid,
    voorzieningen: generateVoorzieningen(bp),
    bezoekerstips: generateBezoekerstips(bp),
    diensten,
    rouwbegeleiding,
    typeInfo,
    provincieInfo,
    praktischeInfo,
    diersoorten,
    herdenkingsmogelijkheden,
  };
}

async function main() {
  console.log('🐾 DIERENBEGRAAFPLAATSEN CONTENT ENRICHMENT');
  console.log('='.repeat(50) + '\n');

  const projectDir = process.cwd();
  const dierenDataPath = path.join(projectDir, 'data/scraped-dierenbegraafplaatsen/dierenbegraafplaatsen.json');
  const cemeteriesPath = path.join(projectDir, 'public/data/cemeteries.json');

  // Read dierenbegraafplaatsen data
  console.log('📖 Reading dierenbegraafplaatsen data...');
  const dierenData: Dierenbegraafplaats[] = JSON.parse(fs.readFileSync(dierenDataPath, 'utf-8'));
  console.log(`   Found ${dierenData.length} pet cemeteries\n`);

  // Enrich each entry
  console.log('✨ Generating rich content...\n');
  let enrichedCount = 0;

  for (const bp of dierenData) {
    console.log(`   Processing: ${bp.naam_begraafplaats} (${bp.gemeente})`);
    bp.generated = generateContent(bp);
    enrichedCount++;
  }

  // Save enriched dierenbegraafplaatsen
  fs.writeFileSync(dierenDataPath, JSON.stringify(dierenData, null, 2));
  console.log(`\n✅ Saved enriched data to ${dierenDataPath}`);

  // Update cemeteries.json
  console.log('\n📝 Updating cemeteries.json...');
  const cemeteries = JSON.parse(fs.readFileSync(cemeteriesPath, 'utf-8'));

  // Create a map of enriched data by slug
  const enrichedMap = new Map<string, Dierenbegraafplaats>();
  for (const bp of dierenData) {
    enrichedMap.set(bp.slug, bp);
  }

  // Create a set of existing slugs
  const existingSlugs = new Set(cemeteries.map((c: any) => c.slug));

  // Update matching entries in cemeteries
  let updatedCount = 0;
  let addedCount = 0;

  for (const cemetery of cemeteries) {
    if (enrichedMap.has(cemetery.slug)) {
      const enriched = enrichedMap.get(cemetery.slug)!;
      cemetery.generated = enriched.generated;
      cemetery.enrichedContent = enriched.generated.samenvatting + '\n\n' +
        enriched.generated.geschiedenis + '\n\n' +
        enriched.generated.diensten + '\n\n' +
        enriched.generated.herdenkingsmogelijkheden + '\n\n' +
        enriched.generated.rouwbegeleiding + '\n\n' +
        enriched.generated.diersoorten + '\n\n' +
        enriched.generated.praktischeInfo;
      cemetery.enriched_at = new Date().toISOString();
      updatedCount++;
    }
  }

  // Add new pet cemeteries that don't exist in cemeteries.json
  for (const bp of dierenData) {
    if (!existingSlugs.has(bp.slug)) {
      const newEntry = {
        naam_begraafplaats: bp.naam_begraafplaats,
        gemeente: bp.gemeente,
        provincie: bp.provincie,
        type: 'dierenbegraafplaats',
        plaats: bp.plaats,
        slug: bp.slug,
        adres: bp.adres || '',
        postcode: bp.postcode || '',
        telefoon: bp.telefoon || '',
        website: bp.website || '',
        email: bp.email || '',
        generated: bp.generated,
        enrichedContent: bp.generated!.samenvatting + '\n\n' +
          bp.generated!.geschiedenis + '\n\n' +
          bp.generated!.diensten + '\n\n' +
          bp.generated!.herdenkingsmogelijkheden + '\n\n' +
          bp.generated!.rouwbegeleiding + '\n\n' +
          bp.generated!.diersoorten + '\n\n' +
          bp.generated!.praktischeInfo,
        enriched_at: new Date().toISOString()
      };
      cemeteries.push(newEntry);
      addedCount++;
    }
  }

  // Save updated cemeteries
  fs.writeFileSync(cemeteriesPath, JSON.stringify(cemeteries, null, 2));
  console.log(`   Added ${addedCount} new pet cemeteries`);

  console.log(`\n✅ ENRICHMENT COMPLETE!`);
  console.log('='.repeat(50));
  console.log(`📊 Statistics:`);
  console.log(`   Pet cemeteries enriched: ${enrichedCount}`);
  console.log(`   Cemeteries.json updated: ${updatedCount}`);
  console.log(`   New entries added: ${addedCount}`);
  console.log(`   Total pet cemeteries: ${updatedCount + addedCount}`);
  console.log(`\n💡 Next steps:`);
  console.log('   1. Run: npm run build');
  console.log('   2. Review the generated content');
  console.log('   3. Deploy to production');
}

main().catch(console.error);
