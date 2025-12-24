// Nederlandse postcode ranges per provincie
// Bron: https://nl.wikipedia.org/wiki/Postcodes_in_Nederland

import { additionalCityMappings } from './update-provinces';

export interface PostcodeRange {
  min: number;
  max: number;
  province: string;
}

// Postcode ranges voor Nederlandse provincies
const postcodeRanges: PostcodeRange[] = [
  // Groningen
  { min: 9700, max: 9999, province: 'Groningen' },
  
  // Friesland
  { min: 8000, max: 8999, province: 'Friesland' },
  { min: 9000, max: 9299, province: 'Friesland' },
  
  // Drenthe
  { min: 7700, max: 7999, province: 'Drenthe' },
  { min: 9300, max: 9499, province: 'Drenthe' },
  
  // Overijssel
  { min: 7000, max: 7699, province: 'Overijssel' },
  { min: 8000, max: 8199, province: 'Overijssel' },
  
  // Flevoland
  { min: 1300, max: 1379, province: 'Flevoland' },
  { min: 8200, max: 8399, province: 'Flevoland' },
  
  // Gelderland
  { min: 3770, max: 3794, province: 'Gelderland' },
  { min: 3900, max: 4116, province: 'Gelderland' },
  { min: 4180, max: 4199, province: 'Gelderland' },
  { min: 4200, max: 4299, province: 'Gelderland' }, // Tiel region
  { min: 5300, max: 5399, province: 'Gelderland' }, // Zaltbommel region
  { min: 6500, max: 6999, province: 'Gelderland' },
  { min: 7000, max: 7399, province: 'Gelderland' },
  { min: 8050, max: 8199, province: 'Gelderland' },
  
  // Utrecht
  { min: 1380, max: 1399, province: 'Utrecht' },
  { min: 3400, max: 3769, province: 'Utrecht' },
  { min: 3795, max: 3836, province: 'Utrecht' },
  { min: 3940, max: 3999, province: 'Utrecht' },
  { min: 4120, max: 4125, province: 'Utrecht' },
  { min: 4130, max: 4139, province: 'Utrecht' },
  
  // Noord-Holland
  { min: 1000, max: 1299, province: 'Noord-Holland' },
  { min: 1400, max: 1999, province: 'Noord-Holland' },
  { min: 2000, max: 2099, province: 'Noord-Holland' },
  
  // Zuid-Holland
  { min: 2100, max: 2799, province: 'Zuid-Holland' },
  { min: 2900, max: 3399, province: 'Zuid-Holland' },
  { min: 3840, max: 3899, province: 'Zuid-Holland' },
  { min: 4126, max: 4129, province: 'Zuid-Holland' },
  { min: 4140, max: 4179, province: 'Zuid-Holland' },
  { min: 4230, max: 4239, province: 'Zuid-Holland' },
  
  // Zeeland
  { min: 4300, max: 4599, province: 'Zeeland' },
  
  // Noord-Brabant
  { min: 4600, max: 5299, province: 'Noord-Brabant' },
  { min: 5400, max: 5799, province: 'Noord-Brabant' },
  
  // Limburg
  { min: 5800, max: 6499, province: 'Limburg' },
];

/**
 * Bepaal provincie op basis van postcode
 * @param postalCode - Nederlandse postcode (bijv. "1012 AB" of "1012AB")
 * @returns De provincie naam of 'Onbekend' als postcode niet gevonden
 */
export function getProvinceByPostalCode(postalCode: string): string {
  if (!postalCode) return 'Onbekend';
  
  // Extract numeric part of postal code
  const numericPart = postalCode.replace(/\s/g, '').substring(0, 4);
  const postalNumber = parseInt(numericPart);
  
  if (isNaN(postalNumber)) return 'Onbekend';
  
  // Find matching range
  for (const range of postcodeRanges) {
    if (postalNumber >= range.min && postalNumber <= range.max) {
      return range.province;
    }
  }
  
  return 'Onbekend';
}

/**
 * Fallback: probeer provincie te bepalen op basis van bekende grote steden
 */
const majorCities: Record<string, string> = {
  // Hoofdsteden
  'Amsterdam': 'Noord-Holland',
  'Haarlem': 'Noord-Holland',
  'Den Haag': 'Zuid-Holland',
  "'s-Gravenhage": 'Zuid-Holland',
  'Rotterdam': 'Zuid-Holland',
  'Utrecht': 'Utrecht',
  'Eindhoven': 'Noord-Brabant',
  'Tilburg': 'Noord-Brabant',
  'Groningen': 'Groningen',
  'Leeuwarden': 'Friesland',
  'Assen': 'Drenthe',
  'Zwolle': 'Overijssel',
  'Lelystad': 'Flevoland',
  'Arnhem': 'Gelderland',
  'Nijmegen': 'Gelderland',
  'Middelburg': 'Zeeland',
  'Maastricht': 'Limburg',
  "'s-Hertogenbosch": 'Noord-Brabant',
  'Den Bosch': 'Noord-Brabant',
  
  // Extra gemeenten voor onbekende postcodes
  'Zeddam': 'Gelderland',
  'Wezep': 'Overijssel',
  'Hoogkarspel': 'Noord-Holland',
  'Haastrecht': 'Utrecht',
  'Stolwijk': 'Zuid-Holland',
  'Schoonhoven': 'Utrecht',
  'Ammerstol': 'Zuid-Holland',
  'Hoogvliet': 'Zuid-Holland',
  'Kloosterzande': 'Zeeland',
  'Ruurlo': 'Gelderland',
  'Aalten': 'Gelderland',
  'Zelhem': 'Gelderland',
  'Halle': 'Gelderland',
  'Marienvelde': 'Gelderland',
  'Doetinchem': 'Gelderland',
  'Zieuwent': 'Gelderland',
  'Vorden': 'Gelderland',
  'Hall': 'Gelderland',
  'Lichtenvoorde': 'Gelderland',
  'Vragender': 'Gelderland',
  'Harreveld': 'Gelderland',
  'Gaanderen': 'Gelderland',
  'Varsseveld': 'Gelderland',
  'Wehl': 'Gelderland',
  'Kilder': 'Gelderland',
  'Braamt': 'Gelderland',
  'Dinxperlo': 'Gelderland',
  'Winterswijk': 'Gelderland',
  "'s-Heerenberg": 'Gelderland',
  'Didam': 'Gelderland',
  'Beek Gem Montferland': 'Gelderland',
  'Azewijn': 'Gelderland',
  'Netterden': 'Gelderland',
  'Megchelen': 'Gelderland',
  
  // Overijssel gemeenten
  'Hengelo': 'Overijssel',
  'Lettele': 'Overijssel',
  'Losser': 'Overijssel',
  'Raalte': 'Overijssel',
  'Lemelerveld': 'Overijssel',
  'Diepenveen': 'Overijssel',
  'Bathmen': 'Overijssel',
  'Deventer': 'Overijssel',
  'Wesepe': 'Overijssel',
  'Dalmsholte': 'Overijssel',
  'Vroomshoop': 'Overijssel',
  
  // Noord-Holland gemeenten
  'Dirkshorn': 'Noord-Holland',
  'Schagerbrug': 'Noord-Holland',
  'Warmenhuizen': 'Noord-Holland',
  'Petten': 'Noord-Holland',
  'Wieringerwaard': 'Noord-Holland',
  'Slootdorp': 'Noord-Holland',
  'Wieringermeer': 'Noord-Holland',
  'Julianadorp': 'Noord-Holland',
  'Texel': 'Noord-Holland',
  'De Koog': 'Noord-Holland',
  'Kortenhoef': 'Noord-Holland',
  'Ankeveen': 'Noord-Holland',
  "'s-Graveland": 'Noord-Holland',
  'Loosdrecht': 'Noord-Holland',
  'Nederhorst Den Berg': 'Noord-Holland',
  
  // Utrecht gemeenten
  'Polsbroek': 'Utrecht',
  'Tienhoven': 'Utrecht',
  'Vlist': 'Utrecht',
  
  // Zuid-Holland gemeenten
  'Moordrecht': 'Zuid-Holland',
  'Zevenhuizen': 'Zuid-Holland',
  'Gouda': 'Zuid-Holland',
  "'s-Gravendeel": 'Zuid-Holland',
  'Krimpen aan de Lek': 'Zuid-Holland',
  'Krimpen aan den IJssel': 'Zuid-Holland',
  'Capelle aan den IJssel': 'Zuid-Holland',
  'Nieuwerkerk aan den IJssel': 'Zuid-Holland',
  'Ouderkerk aan den IJssel': 'Zuid-Holland',
  
  // Flevoland gemeenten
  'Almere': 'Flevoland',
  'Dronten': 'Flevoland',
  'Emmeloord': 'Flevoland',
  'Urk': 'Flevoland',
  'Zeewolde': 'Flevoland',
  'Bant': 'Flevoland',
  'Rutten': 'Flevoland',
  'Tollebeek': 'Flevoland',
  
  // Friesland gemeenten
  'Elspeet': 'Friesland',
  'Nunspeet': 'Friesland',
  'Hulshorst': 'Friesland',
  'Doornspijk': 'Friesland',
  'Vaassen': 'Friesland',
  'Heerde': 'Friesland',
  'Vorchten': 'Friesland',
  'Veessen': 'Friesland',
};

/**
 * Bepaal provincie met fallback opties
 * @param city - Stad/gemeente naam
 * @param postalCode - Postcode
 * @returns Provincie naam
 */
export function getProvince(city: string, postalCode: string): string {
  // Eerst proberen via postcode
  const provinceByPostcode = getProvinceByPostalCode(postalCode);
  if (provinceByPostcode !== 'Onbekend') {
    return provinceByPostcode;
  }
  
  // Dan proberen via grote steden
  if (majorCities[city]) {
    return majorCities[city];
  }
  
  // Check additional city mappings
  if (additionalCityMappings[city]) {
    return additionalCityMappings[city];
  }
  
  // Partial match voor grote steden
  for (const [knownCity, province] of Object.entries(majorCities)) {
    if (city.includes(knownCity) || knownCity.includes(city)) {
      return province;
    }
  }
  
  // Partial match voor additional mappings
  for (const [knownCity, province] of Object.entries(additionalCityMappings)) {
    if (city.includes(knownCity) || knownCity.includes(city)) {
      return province;
    }
  }
  
  // Special case for "NL" or empty city
  if (!city || city === 'NL' || city === 'None') {
    return 'Onbekend';
  }
  
  return 'Onbekend';
}