/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude large data files from serverless function bundles
  outputFileTracingExcludes: {
    '*': [
      './data/discovery/**',
      './data/*-backup-*.json',
      './data/*-progress.json',
      './scripts/**',
      './public/cache/**',
      './public/images/google/**',
    ],
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com', 'images.unsplash.com'],
  },
  async redirects() {
    return [
      // Only redirect legacy Dutch sitemap URLs to the main sitemap
      // The /sitemaps/*.xml files are served from /public/sitemaps/ folder
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
      {
        // Voeg cache headers toe voor sitemap
        source: '/sitemap.xml',
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