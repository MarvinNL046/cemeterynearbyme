# CemeteryNearby.com - Migration Plan

## Overview
US English version of BegraafplaatsInDeBuurt.nl targeting the American market.

---

## Phase 1: URL Structure Mapping

| Dutch (Current) | English (New) | Notes |
|-----------------|---------------|-------|
| `/provincie/[naam]` | `/state/[name]` | 50 US states |
| `/gemeente/[naam]` | `/county/[name]` | 3,000+ US counties |
| `/plaats/[slug]` | `/city/[slug]` | Cities/towns |
| `/begraafplaats/[slug]` | `/cemetery/[slug]` | Cemetery detail pages |
| `/zoeken` | `/search` | Search page |
| `/type/[type]` | `/type/[type]` | Cemetery types |
| `/overleden` | `/deaths-calendar` | Calendar overview |
| `/overleden/[maand]/[dag]` | `/deaths/[month]/[day]` | Daily deaths |
| `/vandaag` | `/today` | Today's deaths |
| `/over-ons` | `/about` | About page |
| `/contact` | `/contact` | Same |
| `/privacy` | `/privacy` | Same |
| `/voorwaarden` | `/terms` | Terms of service |
| `/blog` | `/blog` | Same |
| `/vergelijk` | `/compare` | Compare cemeteries |
| `/uitvaartverzekering` | `/funeral-planning` | Adapt for US market |

---

## Phase 2: Data Structure Changes

### Geographic Hierarchy
```
Netherlands:          USA:
- Provincie (12)      - State (50)
- Gemeente (350)      - County (3,000+)
- Plaats              - City/Town
- Begraafplaats       - Cemetery
```

### Cemetery Types (US Market)
- Public Cemetery
- Private Cemetery
- National Cemetery (Veterans)
- Veterans Cemetery
- Memorial Park
- Church Cemetery
- Jewish Cemetery
- Catholic Cemetery
- Muslim Cemetery
- Natural/Green Cemetery
- Pet Cemetery
- Historic Cemetery

### Data Files to Create
- `data/states.json` - 50 US states with metadata
- `data/counties.json` - Counties per state
- `data/cemeteries.json` - Cemetery data
- `data/famous-deaths.json` - American celebrities

---

## Phase 3: Files to Translate/Adapt

### Core Components
- [ ] `components/Header.tsx` - Navigation labels
- [ ] `components/Footer.tsx` - Links & contact
- [ ] `components/SearchBar.tsx` - Placeholders
- [ ] `components/Logo.tsx` - New branding
- [ ] `components/TodayDeathsWidget.tsx` - English text
- [ ] `components/FAQSection.tsx` - US-specific FAQs
- [ ] `components/CemeteryCard.tsx` - Labels

### Pages to Translate
- [ ] `app/page.tsx` - Homepage
- [ ] `app/zoeken/page.tsx` → `app/search/page.tsx`
- [ ] `app/over-ons/page.tsx` → `app/about/page.tsx`
- [ ] `app/contact/page.tsx`
- [ ] `app/privacy/page.tsx`
- [ ] `app/voorwaarden/page.tsx` → `app/terms/page.tsx`

### Pages to Restructure
- [ ] `app/provincie/` → `app/state/`
- [ ] `app/gemeente/` → `app/county/`
- [ ] `app/plaats/` → `app/city/`
- [ ] `app/begraafplaats/` → `app/cemetery/`
- [ ] `app/overleden/` → `app/deaths/`
- [ ] `app/vandaag/` → `app/today/`
- [ ] `app/vergelijk/` → `app/compare/`

---

## Phase 4: Configuration Updates

### package.json
- Name: `cemeterynearbyme`
- Description: English

### next.config.js
- Domain settings
- Locale: en-US

### tailwind.config.ts
- Keep same design system (forest/gold)

### Environment Variables
- New Supabase project
- New Google Analytics
- New AdSense (later)

---

## Phase 5: Content Creation

### Famous Deaths Data
- Source: Wikidata (English Wikipedia)
- Focus: American celebrities, politicians, athletes
- Same structure as Dutch version

### Blog Content (Later)
- US funeral traditions
- Cemetery etiquette
- Famous cemeteries (Arlington, Hollywood Forever, etc.)
- State-specific guides

### SEO
- US-focused meta descriptions
- Schema.org markup (same structure)
- Sitemap for US geography

---

## Phase 6: Data Collection

### Cemetery Data Sources
- Google Places API (same approach)
- OpenStreetMap
- FindAGrave.com references
- USGS Geographic Names

### Initial Target
1. Start with top 10 states by population
2. Major cities first
3. Expand to full coverage

---

## Execution Order

1. **Setup** (Now)
   - Clean project
   - Update configs
   - Initialize git

2. **Structure** (Step 2)
   - Rename route folders
   - Update data models
   - Create state/county structure

3. **Translation** (Step 3)
   - Translate all components
   - Update all text content
   - Adapt for US terminology

4. **Data** (Step 4)
   - Create US states data
   - Scrape initial cemetery data
   - Generate famous deaths (Wikidata)

5. **Launch** (Step 5)
   - Deploy to Vercel
   - Setup domain
   - Submit to Google Search Console

---

## Notes

- Keep same visual design (proven to work)
- Same component architecture
- Same SEO patterns
- Different content and data only
