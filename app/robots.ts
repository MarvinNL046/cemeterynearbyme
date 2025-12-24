import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/cache/'],
    },
    sitemap: 'https://www.begraafplaatsindebuurt.nl/sitemap.xml',
  };
}