# Cemetery Data Filtering Documentation

## Overview
This document explains the filtering process implemented to ensure only actual cemeteries are included in the dataset, removing non-cemetery businesses that appeared in the raw data.

## Problem
The original dataset contained 6,548 entries, but many were not actual cemeteries. These included:
- Auto dealerships (e.g., "WH Auto's", "Autobedrijf Wouda")
- Gas stations (e.g., "BP Kerkhof & Zn")
- Parking lots (e.g., "Parkeren Werelderfgoed Kinderdijk")
- Funeral service providers (uitvaartverzorging, uitvaartcentrum)
- Other businesses with cemetery-related words in their names

## Solution
We implemented a comprehensive filtering system that:
1. Identifies and excludes non-cemetery businesses based on keywords
2. Identifies and excludes funeral service providers
3. Preserves actual cemeteries and crematoriums
4. Uses positive identification for cemetery-related keywords

## Filtering Rules

### Excluded Keywords (Non-Cemetery Businesses)
- **Auto/Vehicle related**: auto, autobedrijf, automobielbedrijf, autokerkhof, autowasserette, tankstation, garage
- **Parking**: parkeren, parking
- **General businesses**: bv, b.v., winkel, shop, hotel, restaurant, cafe, café
- **Suppliers**: natuurkisten, bloemist, steenhouwer

### Excluded Funeral Service Keywords
- uitvaartverzorging, uitvaartzorg, uitvaartcentrum
- uitvaartbegeleiding, uitvaartatelier, uitvaartvereniging
- uitvaartondernemer, monuta, dela (except DELA crematoriums)
- Service providers: akoestisch duo, zangeres uitvaart, afscheid in beeld

### Included Cemetery Keywords
- begraafplaats, kerkhof, cemetery, graf, graven, begraaf
- Specific types: natuurbegraafplaats, oorlogsgraven, erebegraafplaats
- Religious: joodse begraafplaats, islamitische begraafplaats, rooms katholieke kerkhof
- General: algemene begraafplaats, gemeentelijke begraafplaats, ambtsbegraafplaats

### Special Handling
- **Crematoriums**: Included by default (can be configured)
- **DELA Crematoriums**: Specifically allowed even though "dela" is generally excluded
- **Mixed names**: If a business name contains both excluded and cemetery keywords, cemetery keywords take precedence

## Results
- **Original entries**: 6,548
- **Filtered entries**: 3,861 (actual cemeteries)
- **Removed entries**: 2,687 (non-cemetery businesses)

## Implementation

### Standalone Filter Script
`scripts/filter-non-cemeteries.ts` - Can be run independently to filter data

### Integrated Filtering
The filtering logic is integrated into:
- `scripts/process-cemetery-data.ts`
- `scripts/process-all-data.ts`

### Usage
```bash
# Run standalone filter
npx tsx scripts/filter-non-cemeteries.ts

# Process cemetery data with filtering
npx tsx scripts/process-all-data.ts cemetery data/begraafplaats.csv

# Build production data
npm run build-data
```

## Files Created
- `data/begraafplaats-filtered.csv` - Filtered cemetery data
- `data/removed-entries.json` - List of removed entries for review
- `data/cemeteries-processed.json` - Processed cemetery data
- `public/data/cemeteries.json` - Production-ready data

## Maintenance
To update filtering rules:
1. Edit the keyword arrays in the filter functions
2. Test with sample data to ensure no valid cemeteries are excluded
3. Review `removed-entries.json` to verify filtering accuracy
4. Update this documentation with any changes