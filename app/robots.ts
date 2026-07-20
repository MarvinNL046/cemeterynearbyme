import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://cemeterynearbyme.com';

  // Common disallowed paths. /admin, /dashboard, /login and /register are gone
  // (the account features they belonged to were removed with the database), so
  // they are no longer listed -- there is nothing left to disallow.
  const commonDisallow = [
    '/api/',
    '/cache/',
    '/_next/',
    '/search',
    '/compare',
    '/deaths/',
    '/calendar',
    '/today',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...commonDisallow, '/*.json$'],
      },
      {
        // Google bot specific rules
        userAgent: 'Googlebot',
        allow: '/',
        disallow: commonDisallow,
      },
      {
        // Bing bot specific rules
        userAgent: 'Bingbot',
        allow: '/',
        disallow: commonDisallow,
      },
    ],
    // Points at the STATIC index in public/sitemap.xml (written by
    // `npm run generate-sitemaps`). There is no app/sitemap.ts route handler
    // anymore -- while it existed it shadowed this file.
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
