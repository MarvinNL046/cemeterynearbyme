const fs = require('fs');
const data = require('../public/data/cemeteries.json');

// Province descriptions
const provinceDescriptions = {
  'Drenthe': 'Hunebedden, heidevelden en uitgestrekte bossen. Drenthe is de provincie van rust, ruimte en prehistorische historie.',
  'Flevoland': 'Nieuw land uit de zee, modern en jong. Flevoland combineert innovatie met nieuwe natuur en moderne architectuur.',
  'Friesland': 'Elfstedentocht, meren en een eigen taal. Friesland is trots op haar unieke cultuur en prachtige waterrijke landschap.',
  'Gelderland': 'Rivieren, bossen en landgoederen. Gelderland is de grootste provincie met de Veluwe en fruitboomgaarden.',
  'Groningen': 'Het hoge noorden met wijde vergezichten. Groningen heeft eeuwenoude kerken, wierde-dorpen en het Wad.',
  'Limburg': 'Heuvels, bourgondische sfeer en vakwerkhuizen. Limburg voelt buitenlands aan in eigen land.',
  'Noord-Brabant': 'Gezelligheid, carnaval en design. Noord-Brabant heeft historische steden en uitgestrekte natuurgebieden.',
  'Noord-Holland': 'Amsterdam, tulpen en molens. Noord-Holland combineert wereldstad met pittoreske vissersdorpen en polders.',
  'Overijssel': 'Salland, Twente en de kop. Overijssel heeft coulissenlandschappen, Hanzesteden en veengebieden.',
  'Utrecht': 'Centraal gelegen met historische rijkdom. Utrecht heeft de Domtoren, landgoederen en het Utrechtse Heuvelrug.',
  'Zeeland': 'Deltawerken, stranden en schorren. Zeeland is de provincie van zon, zee en Zeeuwse mosselen.',
  'Zuid-Holland': 'Den Haag, Rotterdam en de Bollenstreek. Zuid-Holland is dichtbevolkt maar met veel groen en water.'
};

// Province capitals
const capitals = {
  'Drenthe': 'Assen',
  'Flevoland': 'Lelystad',
  'Friesland': 'Leeuwarden',
  'Gelderland': 'Arnhem',
  'Groningen': 'Groningen',
  'Limburg': 'Maastricht',
  'Noord-Brabant': "'s-Hertogenbosch",
  'Noord-Holland': 'Haarlem',
  'Overijssel': 'Zwolle',
  'Utrecht': 'Utrecht',
  'Zeeland': 'Middelburg',
  'Zuid-Holland': 'Den Haag'
};

// Generate province data
const provincies = {};

const allProvinces = [...new Set(data.map(c => c.provincie))].sort();

allProvinces.forEach(province => {
  if (!province || province === 'Onbekend') return;

  const cemeteries = data.filter(c => c.provincie === province);
  const gemeenten = {};
  const plaatsen = new Set();

  cemeteries.forEach(c => {
    if (c.gemeente) {
      gemeenten[c.gemeente] = (gemeenten[c.gemeente] || 0) + 1;
    }
    if (c.plaats) {
      plaatsen.add(c.plaats);
    }
  });

  const slug = province.toLowerCase().replace(/\s+/g, '-');

  provincies[slug] = {
    naam: province,
    slug: slug,
    beschrijving: provinceDescriptions[province] || 'Een mooie provincie in Nederland.',
    statistieken: {
      totaal_begraafplaatsen: cemeteries.length,
      totaal_gemeenten: Object.keys(gemeenten).length,
      totaal_plaatsen: plaatsen.size
    },
    hoofdstad: capitals[province] || '',
    gemeenten: Object.fromEntries(
      Object.entries(gemeenten).sort(([a], [b]) => a.localeCompare(b))
    )
  };
});

fs.writeFileSync('data/provincies.json', JSON.stringify(provincies, null, 2));
console.log('Generated provincies.json with', Object.keys(provincies).length, 'provinces');
Object.keys(provincies).forEach(p => {
  console.log(' -', p, ':', provincies[p].statistieken.totaal_begraafplaatsen, 'begraafplaatsen');
});
