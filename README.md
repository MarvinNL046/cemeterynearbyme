# CemeteryNearbyMe.com

A directory of 53,428 cemeteries across the United States.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data**: static JSON in `data/static/` — there is no database

## Data layer

Everything the site renders at runtime comes from `data/static/`, read by
`lib/data.ts`:

```
data/static/cemeteries/{ABBR}.json   full records per state, name-sorted
data/static/slug-index.json          { slug: ABBR } -> single-shard detail lookup
data/static/stats.json               precomputed getStats() aggregates
data/static/geo.json                 [{ slug, lat, lng, state }] for nearby
data/static/facets.json              distinct states / counties / cities / types
data/static/featured.json            top 200 by rating * LOG(review_count + 1)
data/static/state-alias-index.json   state-column value -> records in a foreign shard
```

The site previously ran on Neon Postgres (Drizzle ORM) with accounts, reviews,
photos, favorites and place claims. All of that is gone: the tables were empty
and unwritten since 30 December. There is no `DATABASE_URL`, no auth, no admin
panel. The build succeeds with an empty environment.

The server-side features that remain are the feedback form
(`app/api/feedback/route.ts`) and the contact form (`app/api/contact/route.ts`).
Both deliver by email through Resend and persist nothing. They need
`RESEND_API_KEY`; without it they no-op rather than fail.

## Development

```bash
npm install
npm run dev          # development server
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
```

## Data and sitemap regeneration

**The build does not regenerate anything.** `npm run build` is exactly
`next build`; it only reads what is already committed. `scripts/` is excluded
from the Vercel upload via `.vercelignore`, so a build step that shells into it
could never work there. Both generators are run locally, by hand, and their
output is committed.

Regenerate the static data layer from a database export:

```bash
EXPORT_DIR=/path/to/export npm run build-static-data
# or: npm run build-static-data -- /path/to/export
npm run verify-static-data
npm run verify-state-parity
```

Regenerate the sitemaps — **always run this after changing `data/static/`**,
otherwise the committed sitemaps drift from the data:

```bash
npm run generate-sitemaps
```

That writes the index to `public/sitemap.xml` and 65 children to
`public/sitemaps/sitemap-*.xml` (62,313 URLs, of which 53,428 cemeteries).
These files are served straight off the filesystem. There is deliberately no
`app/sitemap.ts` route handler — while one existed it shadowed
`public/sitemap.xml` and published a second, drifting set of URLs.
`app/robots.ts` points at `/sitemap.xml`.

## Project structure

```
├── app/               # Next.js app directory
│   ├── cemetery/      # cemetery detail pages
│   ├── city/          # city listing pages
│   ├── county/        # county listing pages
│   ├── state/         # state listing pages
│   ├── type/          # cemetery-type pages
│   ├── guide/         # editorial guides
│   ├── blog/          # blog posts
│   └── api/           # search, contact, feedback, image proxy
├── components/        # React components
├── data/static/       # the data layer (see above)
├── lib/               # data access, config, helpers
├── public/sitemaps/   # generated sitemaps (committed)
├── scripts/           # local-only generators; not uploaded to Vercel
└── docs/              # documentation
```

## Contact

- Website: https://cemeterynearbyme.com
