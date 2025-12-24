# CLAUDE.md - BegraafplaatsInDeBuurt.nl Project Guide

This file provides guidance to Claude Code when working with the BegraafplaatsInDeBuurt.nl project.

## Project Overview

BegraafplaatsInDeBuurt.nl is a comprehensive directory of cemeteries in the Netherlands, designed to match the successful features of VindTandarts.nl for Google AdSense approval.

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: JSON files (target: 3,579 cemeteries total, currently: 70 in Limburg)
- **Deployment Target**: Production ready for AdSense

## Key Features Implemented

### 1. Search Functionality (/zoeken)
- Full-text search across cemetery names, municipalities, provinces, postcodes
- Filter by cemetery type (4 types: algemene, natuur, islamitische, joodse)
- Filter by province
- Uses shadcn/ui Select components

### 2. Image Proxy System (/api/image-proxy)
- Prevents 403 errors from Google images
- Caches images locally in /public/cache/
- Fallback to placeholder.svg when images fail
- ProxiedImage component for easy usage

### 3. Cemetery Comparison Feature
- Compare up to 3 cemeteries side-by-side
- CompareButton component on detail pages
- Comparison page at /vergelijk
- LocalStorage for persistent selection

### 4. Content Enrichment ✅ COMPLETED
- **2,487 cemetery pages successfully enriched**
- Each page now has 400+ words of unique content
- Essential for AdSense approval
- Enriched content stored in /data/enriched-content/

### 5. SEO Optimization
- **NEW**: Dynamic sitemap generation (automatic like WordPress!)
- robots.txt configured
- Enhanced JSON-LD structured data on cemetery pages
- Meta tags and OpenGraph data
- 301 redirects for old URLs to prevent Google penalties
- Custom 404 page with helpful navigation

### 6. Place-Level Pages (/plaats/[slug]) 
- Hierarchical navigation: Province → Municipality → Place → Cemetery
- Shows all cemeteries in a specific place
- Breadcrumb navigation and SEO optimization
- CemeteryCard component for cemetery listings

## Data Structure

### Cemetery Data Format
```typescript
{
  naam_begraafplaats: string;
  gemeente: string;
  provincie: string;
  type: string; // Only 4 types exist in data
  slug: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  rating?: string;
  reviews?: string;
  photo?: string;
  gps_coordinaten?: string;
  telefoon?: string;
  // ... other fields
}
```

### Available Cemetery Types (from actual data)
- `algemene begraafplaats` (3,390 cemeteries)
- `joodse begraafplaats` (144 cemeteries)
- `natuurbegraafplaats` (39 cemeteries)
- `islamitische begraafplaats` (6 cemeteries)

**Note**: Catholic cemeteries (600+) are categorized as "algemene begraafplaats"

## Important URLs and Routes

### Public Pages
- `/` - Homepage with VindTandarts-style design
- `/zoeken` - Search page with filters
- `/vergelijk` - Cemetery comparison page
- `/begraafplaats/[slug]` - Cemetery detail pages
- `/provincie/[province]` - Province listings
- `/gemeente/[municipality]` - Municipality listings with place grid
- `/plaats/[place]` - Place/city level cemetery listings
- `/type/[type]` - Cemetery type listings
- `/info/rooms-katholieke-begraafplaatsen` - Info about Catholic cemeteries

### API Routes
- `/api/search` - Search endpoint with filtering
- `/api/cemetery/[slug]` - Get cemetery data by slug
- `/api/image-proxy` - Proxy for external images
- `/api/data` - Get provinces, municipalities, types

## Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Known Issues and Solutions

### 1. Catholic Cemeteries
- **Issue**: Users searching for "rooms-katholieke-begraafplaats" find 0 results
- **Reason**: Catholic cemeteries are categorized as "algemene begraafplaats" in the data
- **Solution**: Created info page explaining this, users can search for "R.K.", "katholiek", or "parochie"

### 2. Image 403 Errors
- **Issue**: Google Place photos return 403 errors due to session-specific tokens
- **Solution**: Implemented image proxy that caches images locally

### 3. Module Not Found Errors
- **Common**: Missing shadcn/ui components
- **Solution**: Install with `npx shadcn@latest add [component-name]`

## Google AdSense Requirements Met

✅ **Substantial Content**: 2,487 pages with 400+ words each
✅ **Professional Design**: Matches VindTandarts.nl style
✅ **Real Data**: Scraped from Google Maps (ratings, reviews, photos)
✅ **User Features**: Search, comparison, detailed information
✅ **SEO Ready**: Sitemap, structured data, meta tags
✅ **Mobile Responsive**: Works on all devices
✅ **Fast Loading**: Optimized with Next.js
✅ **No Fake Content**: All reviews and ratings are real or empty

## Next Steps for Production

1. **Deploy to Production**
   - Ensure all environment variables are set
   - Build and deploy to hosting platform

2. **Submit to Google Search Console**
   - Add sitemap.xml
   - Request indexing for key pages
   - Monitor crawl status

3. **Apply for AdSense**
   - Wait for pages to be indexed (usually 1-2 weeks)
   - Apply through AdSense dashboard
   - Add ad codes to AdComponent placeholders

## Useful Scripts

### Convert Cemetery Data
```bash
npx tsx scripts/convert-json-to-array.ts
```

### Create Province Placeholders
```bash
npx tsx scripts/create-province-placeholders.ts
```

### Clean Up Old Static Sitemaps (after deployment)
```bash
npx tsx scripts/cleanup-old-sitemaps.ts
```

### Generate Redirect Map for Migration
```bash
npx tsx scripts/generate-redirect-map.ts
```

### Test Search API
```bash
curl "http://localhost:3000/api/search?q=amsterdam"
```

## Environment Variables

Currently using placeholder ad codes. For production, update:
- Google AdSense publisher ID
- Individual ad slot IDs for different ad formats
- Google Analytics ID (already set)

## Contact

For questions about this project:
- Email: info@begraafplaatsindebuurt.nl
- Compare with: https://vindtandarts.nl for reference

## Current Progress

### Data Entry Status
- **Limburg Province**: 70 of 443 cemeteries entered (16%)
  - ✅ Beek: 10 cemeteries (complete with details)
  - ✅ Beekdaelen: 21 cemeteries (complete with details)
  - ✅ Beesel: 5 cemeteries (complete with details)
  - ✅ Bergen (L.): 7 cemeteries (complete with details)
  - ✅ Brunssum: 6 cemeteries (complete with details)
  - ✅ Echt-Susteren: 15 cemeteries (basic data only, details pending)
  - 🔲 Remaining municipalities: 25 more to go

### Data Sources
- **Main cemetery list**: `/data/provincies.json` - Contains totals per municipality
- **Active data**: `/data/begraafplaatsen.json` - Currently being populated
- **Public data**: `/public/data/cemeteries.json` - Mirror of active data

### Important Notes
- Municipality pages auto-generate when cemetery data exists
- Place pages show all cemeteries in that specific place/city
- Always update both `begraafplaatsen.json` and sync to `public/data/cemeteries.json`
- Use consistent naming: "Bergen (L.)" not "Bergen Li"
- **NEW**: Sitemap updates automatically when adding cemeteries (like WordPress!)
- **NEW**: Province page now shows municipalities in alphabetical grid with letter sections

---

Veel plezier met gamen! 🎮 Dit project is stap voor stap klaar voor productie en AdSense goedkeuring!