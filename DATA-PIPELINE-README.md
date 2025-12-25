# CemeteryNearMe.com - Data Pipeline Documentation

This document describes the complete data pipeline for gathering, enriching, and publishing cemetery data.

## Pipeline Overview

```
+-------------------------------------------------------------------------+
|                           DATA PIPELINE                                  |
+-------------------------------------------------------------------------+
|                                                                          |
|  Stage 1: DISCOVERY (Bright Data SERP API)                              |
|  - Google Maps scraping                                                  |
|  - Base data: name, address, GPS, ratings, phone, hours                 |
|  - Output: /data/discovery/discovered-cemeteries.json                   |
|                                                                          |
|  Stage 2: ENRICHMENT (Jina.ai Reader API)                               |
|  - Scrape additional cemetery websites                                   |
|  - Historical info, descriptions, burial counts                          |
|  - Output: /data/scraped-cemeteries/                                     |
|                                                                          |
|  Stage 3: CONTENT GENERATION (OpenAI GPT-4o-mini)                       |
|  - Generate unique "About" sections (400+ words)                         |
|  - SEO-optimized content                                                 |
|  - Output: /data/enriched-content/                                       |
|                                                                          |
|  Stage 4: BUILD (Next.js)                                               |
|  - Merge all data sources                                                |
|  - Generate static pages                                                 |
|  - Output: /public/data/cemeteries.json                                  |
|                                                                          |
|  BONUS: Famous Deaths (Wikidata)                                         |
|  - Scrape famous American deaths                                         |
|  - Output: /data/famous-deaths.json                                      |
|                                                                          |
+-------------------------------------------------------------------------+
```

## Stage 1: Discovery (Bright Data)

### Purpose
Discover all cemeteries across the United States using Google Maps via Bright Data's SERP API.

### Script
```bash
# Test mode (3 states)
npm run discover:test

# Full discovery
npm run discover:full

# Resume interrupted discovery
npm run discover:resume

# Dry run (no API calls)
npm run discover:dry-run

# Single state
npx tsx scripts/discovery/discover-cemeteries.ts --state TX
```

### Data Collected
- Cemetery name
- Full address (street, city, state, zip)
- GPS coordinates
- Phone number
- Website
- Opening hours
- Google rating
- Photo URLs
- Place ID

### Output Files
- `/data/discovery/discovered-cemeteries.json` - All discovered cemeteries
- `/data/discovery/progress.json` - Progress tracking for resume capability
- `/data/discovery/locations.json` - Location list for discovery

### Environment Variables
```env
BRIGHTDATA_CUSTOMER_ID=your_customer_id
BRIGHTDATA_API_KEY=your_api_key
BRIGHTDATA_ZONE=mcp_unlocker
BRIGHTDATA_SERP_ZONE=your_serp_zone
BRIGHTDATA_SERP_API_KEY=your_serp_api_key
```

---

## Stage 2: Enrichment (Jina.ai)

### Purpose
Scrape additional content from cemetery websites (like interment.net) to gather:
- Historical information
- Cemetery descriptions
- Burial counts
- Year established
- Cemetery type

### Script
```bash
# Test mode (3 states)
npx tsx scripts/scraping/scrape-us-cemeteries.ts --test

# Full scraping
npx tsx scripts/scraping/scrape-us-cemeteries.ts

# Single state
npx tsx scripts/scraping/scrape-us-cemeteries.ts --state CA

# Help
npx tsx scripts/scraping/scrape-us-cemeteries.ts --help
```

### Data Sources
1. **interment.net** - Cemetery records and burial data
2. More sources can be added

### Output Files
- `/data/scraped-cemeteries/{state}-interment-net.json` - Per-state data
- `/data/scraped-cemeteries/all-cemeteries.json` - Combined data
- `/data/scraped-cemeteries/summary.json` - Statistics

### Environment Variables
```env
JINA_API_KEY=your_jina_api_key
```

---

## Stage 3: Content Generation (OpenAI)

### Purpose
Generate unique, SEO-optimized "About" sections for each cemetery using GPT-4o-mini.

### Data Used
- Base cemetery data from Stage 1 (Bright Data)
- Enriched content from Stage 2 (Jina.ai)

### Generated Content
- 400+ words per cemetery
- Unique descriptions
- Historical context
- Location information
- SEO keywords

### Output Files
- `/data/enriched-content/{cemetery-slug}.json` - Per-cemetery content

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
```

---

## Stage 4: Build Process

### Purpose
Merge all data and generate the production website.

### Commands
```bash
# Full build (includes data merge)
npm run build

# Just data build
npm run build-data

# Generate sitemaps
npm run generate-sitemaps
```

### Merge Process
1. Load discovery data
2. Load enriched content
3. Match by slug/name
4. Generate final cemetery objects
5. Write to `/public/data/cemeteries.json`

---

## Bonus: Famous Deaths (Wikidata)

### Purpose
Fetch famous American deaths for the "This Day in History" feature.

### Script
```bash
npm run fetch-deaths
```

### Data Source
Wikidata SPARQL endpoint - queries for:
- Notable Americans
- Death dates
- Professions
- Wikipedia links
- Burial locations

### Output File
- `/data/famous-deaths.json`

### Data Structure
```json
{
  "lastUpdated": "2025-01-15T...",
  "source": "Wikidata",
  "count": 1234,
  "deaths": [
    {
      "name": "John Doe",
      "profession": "Actor",
      "birth_date": "1920-01-15",
      "death_date": "2005-12-24",
      "death_day": 24,
      "death_month": 12,
      "wikipedia": "https://en.wikipedia.org/wiki/John_Doe",
      "cemetery": "Hollywood Forever Cemetery",
      "city": "Los Angeles",
      "state": "CA"
    }
  ]
}
```

---

## Complete Pipeline Execution

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Run full discovery (takes hours)
npm run discover:full

# 4. Run enrichment (takes hours)
npx tsx scripts/scraping/scrape-us-cemeteries.ts

# 5. Generate famous deaths
npm run fetch-deaths

# 6. Build site
npm run build
```

### Regular Updates
```bash
# Resume discovery if interrupted
npm run discover:resume

# Rebuild with new data
npm run build
```

---

## API Rate Limits

| Service | Rate Limit | Delay in Code |
|---------|------------|---------------|
| Bright Data SERP | ~5 req/sec | 500-1000ms |
| Jina.ai Reader | ~10 req/sec | 800ms |
| OpenAI GPT | 500 req/min | 200ms |
| Wikidata | 100 req/min | 1000ms |

---

## Data Flow Diagram

```
                    +---------------+
                    |  Google Maps  |
                    |  (via Bright  |
                    |    Data)      |
                    +-------+-------+
                            |
                            v
                  +-----------------+
                  |   Discovery     |
                  |    Script       |
                  +--------+--------+
                           |
                           v
            +--------------------------+
            | /data/discovery/         |
            | discovered-cemeteries.json|
            +-------------+------------+
                          |
        +-----------------+------------------+
        |                 |                  |
        v                 v                  v
+---------------+  +---------------+  +---------------+
| interment.net |  | Other sources |  |   Wikidata    |
|  (via Jina)   |  |  (via Jina)   |  |   (direct)    |
+-------+-------+  +-------+-------+  +-------+-------+
        |                  |                  |
        v                  v                  v
+---------------------------+        +---------------+
| /data/scraped-cemeteries/ |        | /data/famous- |
| all-cemeteries.json       |        | deaths.json   |
+-------------+-------------+        +-------+-------+
              |                              |
              v                              |
        +---------------+                    |
        |  OpenAI GPT   |                    |
        |  (Enrichment) |                    |
        +-------+-------+                    |
                |                            |
                v                            |
+---------------------------+                |
| /data/enriched-content/   |                |
+-------------+-------------+                |
              |                              |
              +---------------+--------------+
                              |
                              v
                    +------------------+
                    |   Build Script   |
                    |  (merge & gen)   |
                    +--------+---------+
                             |
                             v
                  +----------------------+
                  | /public/data/        |
                  | cemeteries.json      |
                  +----------------------+
                             |
                             v
                  +----------------------+
                  |   Next.js Build      |
                  |  (static pages)      |
                  +----------------------+
```

---

## Troubleshooting

### Discovery Stops
1. Check Bright Data credits
2. Run `npm run discover:resume` to continue
3. Check `/data/discovery/progress.json` for last state

### Jina Errors
1. Check JINA_API_KEY in .env.local
2. Some sites block scraping - these are skipped
3. Check rate limits

### Build Fails
1. Run `npm run typecheck` to find TypeScript errors
2. Check `/data/discovery/discovered-cemeteries.json` exists
3. Ensure all required JSON files exist

---

## File Structure

```
/data/
  discovery/
    discovered-cemeteries.json   # Raw discovery data
    progress.json                # Resume state
    locations.json               # Location list
  scraped-cemeteries/
    {state}-interment-net.json  # Per-state Jina data
    all-cemeteries.json         # Combined data
    summary.json                # Statistics
  enriched-content/
    {cemetery-slug}.json        # GPT-generated content
  famous-deaths.json            # Wikidata deaths
  cemetery-types.json           # Cemetery type definitions

/public/data/
  cemeteries.json               # Final merged data

/scripts/
  discovery/
    discover-cemeteries.ts      # Bright Data discovery
  scraping/
    scrape-us-cemeteries.ts     # Jina.ai scraping
  scrape-wikidata-deaths.ts     # Famous deaths fetcher
  build-data.ts                 # Data build/merge
  generate-sitemaps.ts          # Sitemap generator
```

---

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| discover:test | Test discovery (3 states) |
| discover:full | Full US discovery |
| discover:resume | Resume interrupted discovery |
| discover:dry-run | Test without API calls |
| fetch-deaths | Fetch famous deaths from Wikidata |
| build-data | Build/merge data files |
| generate-sitemaps | Generate XML sitemaps |
| build | Full Next.js build (includes data) |
| typecheck | TypeScript type checking |
