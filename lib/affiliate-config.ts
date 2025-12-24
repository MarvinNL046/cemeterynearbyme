/**
 * Affiliate Partner Configuratie
 *
 * Voeg hier affiliate partners toe. Zet 'active: true' wanneer je een partner hebt.
 * De ads worden alleen getoond als er minstens één actieve partner is.
 */

export interface AffiliatePartner {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  buttonText: string;
  active: boolean;
  // Optionele tracking parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export const affiliatePartners: AffiliatePartner[] = [
  {
    id: 'uitvaartverzekering',
    name: 'Uitvaartverzekering Vergelijken',
    description: 'Vergelijk uitvaartverzekeringen en bespaar tot 30% op uw premie.',
    url: 'https://example.com/uitvaartverzekering',
    imageUrl: '/images/affiliates/uitvaartverzekering.png',
    buttonText: 'Vergelijk nu',
    active: false, // Zet op true wanneer je een partner hebt
    utmSource: 'begraafplaatsindebuurt',
    utmMedium: 'sidebar',
    utmCampaign: 'uitvaartverzekering',
  },
  {
    id: 'bloemen',
    name: 'Rouwbloemen Bestellen',
    description: 'Bestel prachtige rouwboeketten en kransen voor een laatste groet.',
    url: 'https://example.com/bloemen',
    imageUrl: '/images/affiliates/bloemen.png',
    buttonText: 'Bekijk aanbod',
    active: false,
    utmSource: 'begraafplaatsindebuurt',
    utmMedium: 'sidebar',
    utmCampaign: 'rouwbloemen',
  },
  {
    id: 'grafmonument',
    name: 'Grafmonumenten',
    description: 'Ontwerp een persoonlijk grafmonument. Vrijblijvend advies aan huis.',
    url: 'https://example.com/grafmonumenten',
    imageUrl: '/images/affiliates/grafmonument.png',
    buttonText: 'Vraag offerte aan',
    active: false,
    utmSource: 'begraafplaatsindebuurt',
    utmMedium: 'sidebar',
    utmCampaign: 'grafmonument',
  },
  {
    id: 'uitvaartondernemer',
    name: 'Uitvaartondernemers',
    description: 'Vind een betrouwbare uitvaartondernemer in uw regio.',
    url: 'https://example.com/uitvaart',
    imageUrl: '/images/affiliates/uitvaart.png',
    buttonText: 'Vind ondernemer',
    active: false,
    utmSource: 'begraafplaatsindebuurt',
    utmMedium: 'sidebar',
    utmCampaign: 'uitvaartondernemer',
  },
];

/**
 * Helper functie om actieve partners op te halen
 */
export function getActivePartners(): AffiliatePartner[] {
  return affiliatePartners.filter(partner => partner.active);
}

/**
 * Helper functie om te checken of er actieve partners zijn
 */
export function hasActivePartners(): boolean {
  return affiliatePartners.some(partner => partner.active);
}

/**
 * Helper functie om affiliate URL te bouwen met UTM parameters
 */
export function buildAffiliateUrl(partner: AffiliatePartner): string {
  const url = new URL(partner.url);

  if (partner.utmSource) {
    url.searchParams.set('utm_source', partner.utmSource);
  }
  if (partner.utmMedium) {
    url.searchParams.set('utm_medium', partner.utmMedium);
  }
  if (partner.utmCampaign) {
    url.searchParams.set('utm_campaign', partner.utmCampaign);
  }

  return url.toString();
}
