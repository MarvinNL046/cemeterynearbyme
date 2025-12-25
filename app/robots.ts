import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/cache/', '/admin/'],
    },
    sitemap: 'https://www.cemeterynearbyme.com/sitemap.xml',
  };
}
