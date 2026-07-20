/** @type {import('next').NextConfig} */
//
// SINGLE SOURCE OF TRUTH. There used to be a next.config.mjs alongside this
// file; Next loads next.config.js first and never looked at the .mjs, so its
// security headers, images.remotePatterns and modularizeImports were silently
// dead. Everything from both files is merged here and the .mjs is gone. Do not
// reintroduce a second config file.
//
const nextConfig = {
  // Exclude large data files from serverless function bundles.
  //
  // NOTE ON data/static/** — deliberately NOT excluded, and it must stay that
  // way. lib/data.ts opens `data/static/cemeteries/{ABBR}.json` through a
  // computed path, so Next's tracer cannot see which shard a route needs and
  // conservatively pulls in all 51 (51.2 MB of the 89.9 MB trace on
  // /cemetery/[slug]). Narrowing that per route is not possible either:
  // /cemetery/[slug], /city/[slug], /county/[county] and /search can each
  // resolve to ANY state, so any Excludes rule on the shards would turn a
  // cache miss into a runtime ENOENT on some slugs. A fat bundle is cheaper
  // than a lazy-load that 500s, so this stays as is.
  //
  // What IS safe to drop: the two big JSON blobs in data/ that no runtime code
  // fs-reads. They are only traced because lib/data.ts does
  // path.join(process.cwd(), 'data'), which makes the tracer include the whole
  // directory. famous-deaths.json reaches the pages that need it as a bundled
  // ESM import (the inlined chunk), never from disk; cemeteries.json is the
  // legacy 6,038-row file that no longer has an importer at all.
  outputFileTracingExcludes: {
    '*': [
      './data/discovery/**',
      './data/*-backup-*.json',
      './data/*-progress.json',
      './data/famous-deaths.json',
      './data/cemeteries.json',
      './data/cemeteries-processed.json',
      './scripts/**',
      './public/cache/**',
      './public/images/google/**',
      './public/data/**',
    ],
  },

  // Union of the hostnames both old configs allowed. Expressed as
  // remotePatterns (from the .mjs) rather than the deprecated `images.domains`
  // the .js used -- `domains` is gone in Next 16.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
    ],
  },

  // Optimize bundle splitting (carried over from the dead next.config.mjs).
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Sitemaps are fully static: `npm run generate-sitemaps` writes the index to
  // public/sitemap.xml and the 65 children to public/sitemaps/sitemap-*.xml.
  // Both are served straight off the filesystem. The old app/sitemap.ts route
  // handler (which published a second, drifting set at /sitemap/N.xml) has been
  // deleted -- while it existed it shadowed public/sitemap.xml. Nothing here
  // may reintroduce a route that shadows those files.
  async redirects() {
    return [
      // The deleted app/sitemap.ts published /sitemap/0.xml .. /sitemap/6.xml.
      // Those cannot be mapped 1:1 onto the static children (which are named by
      // section -- sitemap-cemeteries-N.xml, sitemap-cities-N.xml, ... -- not by
      // a flat index), so send them to the real index instead of 404ing.
      {
        source: '/sitemap/:id(\\d{1,3}).xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      // Legacy Dutch sitemap URLs from the begraafplaatsindebuurt.nl era.
      {
        source: '/sitemap-main.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/sitemap-gemeenten-:num.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/sitemap-begraafplaatsen-:num.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      // Security headers (carried over from the dead next.config.mjs).
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/sitemaps/:file*.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
