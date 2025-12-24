import fs from 'fs';
import path from 'path';

// Script om een redirect map te genereren voor Vercel/Netlify
// Dit voorkomt 404s en Google penalties tijdens de migratie

const generateRedirectMap = () => {
  const redirects = [];
  
  // Oude sitemap redirects
  const oldSitemaps = [
    '/sitemaps/sitemap-static.xml',
    '/sitemaps/sitemap-municipalities.xml',
    '/sitemaps/sitemap-municipalities-1.xml',
    '/sitemaps/sitemap-municipalities-2.xml',
    '/sitemaps/sitemap-cemeteries-1.xml',
    '/sitemaps/sitemap-cemeteries-2.xml',
    '/sitemaps/sitemap-cemeteries-3.xml',
    '/sitemaps/sitemap-cemeteries-4.xml',
    '/sitemap-main.xml',
    '/sitemap-gemeenten-1.xml',
    '/sitemap-gemeenten-2.xml',
    '/sitemap-begraafplaatsen-1.xml',
    '/sitemap-begraafplaatsen-2.xml',
    '/sitemap-begraafplaatsen-3.xml',
    '/sitemap-begraafplaatsen-4.xml',
  ];
  
  oldSitemaps.forEach(oldPath => {
    redirects.push({
      source: oldPath,
      destination: '/sitemap.xml',
      permanent: true,
    });
  });
  
  // Vercel format
  const vercelRedirects = redirects.map(r => ({
    source: r.source,
    destination: r.destination,
    permanent: r.permanent,
  }));
  
  // Netlify format
  const netlifyRedirects = redirects
    .map(r => `${r.source} ${r.destination} 301!`)
    .join('\n');
  
  // Write Vercel redirects
  fs.writeFileSync(
    path.join(process.cwd(), 'vercel-redirects.json'),
    JSON.stringify(vercelRedirects, null, 2)
  );
  
  // Write Netlify redirects
  fs.writeFileSync(
    path.join(process.cwd(), 'public', '_redirects'),
    netlifyRedirects
  );
  
  console.log('✅ Redirect maps generated!');
  console.log(`📝 Total redirects: ${redirects.length}`);
};

generateRedirectMap();