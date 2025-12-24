# Sitemap Improvements Documentation

## Problem
Google Search Console showed only 24 indexed URLs while the site has 5,546 pages.

## Issues Found & Fixed

### 1. Duplicate Slugs (FIXED)
- **Problem**: 252 duplicate slugs causing multiple cemeteries to have the same URL
- **Impact**: Search engines would only index one URL per duplicate set
- **Solution**: Created unique slugs by adding province and index numbers
- **Result**: All 3,861 cemeteries now have unique URLs

### 2. Invalid Sitemap References (FIXED)
- **Problem**: Sitemap index referenced 3 municipality sitemaps but only 2 exist
- **Impact**: Google encountered 404 error on sitemap-municipalities-3.xml
- **Solution**: Made municipality sitemap count dynamic based on actual data
- **Result**: Sitemap index now correctly references only existing sitemaps

### 3. Data Quality (FIXED)
- **Problem**: 189 cemeteries had unknown provinces
- **Impact**: Poor user experience and SEO
- **Solution**: Enhanced province mapping with 170+ additional municipality mappings
- **Result**: Only 2 entries remain without province (both have invalid "NL" as city)

## Current Sitemap Structure

### Sitemap Index
- `/sitemap.xml` - Main index referencing all sub-sitemaps

### Sub-sitemaps
- `/sitemap-static.xml` - 5 static pages (home, privacy, terms, etc.)
- `/sitemap-provinces.xml` - 13 province pages + 6 type pages
- `/sitemap-municipalities-1.xml` - First 1000 municipalities
- `/sitemap-municipalities-2.xml` - Remaining 661 municipalities
- `/sitemap-cemeteries-1.xml` - First 1000 cemeteries
- `/sitemap-cemeteries-2.xml` - Cemeteries 1001-2000
- `/sitemap-cemeteries-3.xml` - Cemeteries 2001-3000
- `/sitemap-cemeteries-4.xml` - Remaining 861 cemeteries

### Total URLs
- Static pages: 5
- Province pages: 13
- Type pages: 6
- Municipality pages: 1,661
- Cemetery pages: 3,861
- **Total: 5,546 URLs**

## Next Steps for Google Indexing

1. **Submit Updated Sitemap**
   - Go to Google Search Console
   - Navigate to Sitemaps section
   - Resubmit: https://begraafplaatsindebuurt.nl/sitemap.xml

2. **Monitor Indexing**
   - Check "Pages" report in Search Console
   - Monitor for crawl errors
   - Verify all sitemaps are discovered

3. **Request Indexing**
   - Use URL Inspection tool for key pages
   - Request indexing for updated pages

4. **Check for Issues**
   - Look for "Discovered - currently not indexed"
   - Check for "Crawled - currently not indexed"
   - Address any quality issues

## Technical Details

### URL Format Examples
- Cemetery: `/begraafplaats/algemene-begraafplaats-zelhem-zelhem`
- Municipality: `/gemeente/zelhem`
- Province: `/provincie/gelderland`
- Type: `/type/algemeen`

### Special Characters Handled
- Apostrophes in municipality names (e.g., 's-Gravenhage)
- Spaces converted to hyphens
- Special characters removed from slugs

### Performance Optimizations
- Sitemaps split at 1000 URLs each
- 24-hour cache on all sitemaps
- Dynamic generation based on current data