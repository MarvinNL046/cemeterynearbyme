// Site configuration for multi-tenant setup
export const getSiteConfig = () => {
  // Determine site based on environment variable or domain
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || 
                 (typeof window !== 'undefined' ? window.location.hostname : 'begraafplaatsindebuurt.nl');
  
  const configs: Record<string, {
    id: string;
    domain: string;
    name: string;
    description: string;
  }> = {
    'begraafplaatsindebuurt.nl': {
      id: 'begraafplaats',
      domain: 'begraafplaatsindebuurt.nl',
      name: 'Begraafplaats in de Buurt',
      description: 'Vind begraafplaatsen bij u in de buurt'
    },
    'localhost:3000': {
      // Voor development
      id: 'begraafplaats',
      domain: 'begraafplaatsindebuurt.nl',
      name: 'Begraafplaats in de Buurt',
      description: 'Vind begraafplaatsen bij u in de buurt'
    },
    'localhost:3001': {
      // Alternatieve development port
      id: 'begraafplaats',
      domain: 'begraafplaatsindebuurt.nl',
      name: 'Begraafplaats in de Buurt',
      description: 'Vind begraafplaatsen bij u in de buurt'
    }
  };

  return configs[domain] || configs['begraafplaatsindebuurt.nl'];
};