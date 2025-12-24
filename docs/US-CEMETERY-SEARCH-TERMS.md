# US Cemetery Search Terms & Types

## Complete Search Queries for US Market

### Primary Cemetery Terms
```javascript
const SEARCH_QUERIES = [
  // Generic terms
  'cemetery',
  'graveyard',
  'burial ground',
  'memorial park',
  'memorial garden',

  // Religious cemeteries
  'catholic cemetery',
  'jewish cemetery',
  'muslim cemetery',
  'islamic cemetery',
  'christian cemetery',
  'protestant cemetery',
  'baptist cemetery',
  'methodist cemetery',
  'lutheran cemetery',
  'episcopal cemetery',
  'presbyterian cemetery',
  'mormon cemetery',
  'lds cemetery',
  'greek orthodox cemetery',
  'russian orthodox cemetery',

  // Special types
  'national cemetery',           // Arlington, etc.
  'veterans cemetery',
  'military cemetery',
  'war memorial cemetery',
  'green cemetery',
  'natural burial ground',
  'eco cemetery',
  'pet cemetery',
  'historic cemetery',
  'pioneer cemetery',
  'colonial cemetery',
  'african american cemetery',
  'chinese cemetery',

  // Facilities
  'crematorium',
  'crematory',
  'funeral home with cemetery',
  'mausoleum',
  'columbarium',

  // City-specific
  'cemetery near me',
  'burial plots',
  'grave sites',
];
```

## Data Fields We Can Scrape (Same as NL)

| Field | Description | Example |
|-------|-------------|---------|
| `google_cid` | Unique Google ID | `0x47c6...` |
| `google_place_id` | Google Place ID | `ChIJ...` |
| `name` | Cemetery name | `Arlington National Cemetery` |
| `address` | Full address | `1 Memorial Ave, Arlington, VA 22211` |
| `latitude` | GPS lat | `38.8789` |
| `longitude` | GPS lng | `-77.0694` |
| `phone` | Phone number | `+1 877-907-8585` |
| `website` | Website URL | `https://...` |
| `rating` | Google rating | `4.8` |
| `review_count` | Number of reviews | `12,456` |
| `opening_hours` | Hours | `Mon-Sun 8:00 AM - 5:00 PM` |
| `photo_url` | Main photo URL | `https://lh3...` |
| `facilities` | Amenities | `["Wheelchair", "Parking", "Restroom"]` |
| `business_type` | Google type | `cemetery` |
| `categories` | All categories | `["Cemetery", "Memorial park"]` |
| `reviews` | Top reviews | `[{name, rating, text, date}]` |

## US Geographic Structure

### 50 States + DC
```javascript
const US_STATES = [
  { name: 'Alabama', abbr: 'AL', counties: 67 },
  { name: 'Alaska', abbr: 'AK', counties: 30 },
  { name: 'Arizona', abbr: 'AZ', counties: 15 },
  { name: 'Arkansas', abbr: 'AR', counties: 75 },
  { name: 'California', abbr: 'CA', counties: 58 },
  { name: 'Colorado', abbr: 'CO', counties: 64 },
  { name: 'Connecticut', abbr: 'CT', counties: 8 },
  { name: 'Delaware', abbr: 'DE', counties: 3 },
  { name: 'Florida', abbr: 'FL', counties: 67 },
  { name: 'Georgia', abbr: 'GA', counties: 159 },
  { name: 'Hawaii', abbr: 'HI', counties: 5 },
  { name: 'Idaho', abbr: 'ID', counties: 44 },
  { name: 'Illinois', abbr: 'IL', counties: 102 },
  { name: 'Indiana', abbr: 'IN', counties: 92 },
  { name: 'Iowa', abbr: 'IA', counties: 99 },
  { name: 'Kansas', abbr: 'KS', counties: 105 },
  { name: 'Kentucky', abbr: 'KY', counties: 120 },
  { name: 'Louisiana', abbr: 'LA', parishes: 64 },
  { name: 'Maine', abbr: 'ME', counties: 16 },
  { name: 'Maryland', abbr: 'MD', counties: 24 },
  { name: 'Massachusetts', abbr: 'MA', counties: 14 },
  { name: 'Michigan', abbr: 'MI', counties: 83 },
  { name: 'Minnesota', abbr: 'MN', counties: 87 },
  { name: 'Mississippi', abbr: 'MS', counties: 82 },
  { name: 'Missouri', abbr: 'MO', counties: 115 },
  { name: 'Montana', abbr: 'MT', counties: 56 },
  { name: 'Nebraska', abbr: 'NE', counties: 93 },
  { name: 'Nevada', abbr: 'NV', counties: 17 },
  { name: 'New Hampshire', abbr: 'NH', counties: 10 },
  { name: 'New Jersey', abbr: 'NJ', counties: 21 },
  { name: 'New Mexico', abbr: 'NM', counties: 33 },
  { name: 'New York', abbr: 'NY', counties: 62 },
  { name: 'North Carolina', abbr: 'NC', counties: 100 },
  { name: 'North Dakota', abbr: 'ND', counties: 53 },
  { name: 'Ohio', abbr: 'OH', counties: 88 },
  { name: 'Oklahoma', abbr: 'OK', counties: 77 },
  { name: 'Oregon', abbr: 'OR', counties: 36 },
  { name: 'Pennsylvania', abbr: 'PA', counties: 67 },
  { name: 'Rhode Island', abbr: 'RI', counties: 5 },
  { name: 'South Carolina', abbr: 'SC', counties: 46 },
  { name: 'South Dakota', abbr: 'SD', counties: 66 },
  { name: 'Tennessee', abbr: 'TN', counties: 95 },
  { name: 'Texas', abbr: 'TX', counties: 254 },
  { name: 'Utah', abbr: 'UT', counties: 29 },
  { name: 'Vermont', abbr: 'VT', counties: 14 },
  { name: 'Virginia', abbr: 'VA', counties: 133 },
  { name: 'Washington', abbr: 'WA', counties: 39 },
  { name: 'West Virginia', abbr: 'WV', counties: 55 },
  { name: 'Wisconsin', abbr: 'WI', counties: 72 },
  { name: 'Wyoming', abbr: 'WY', counties: 23 },
  { name: 'District of Columbia', abbr: 'DC', counties: 1 },
];
// Total: 3,143 counties
```

## Estimated Cemetery Count

| Type | Estimated Count |
|------|-----------------|
| Public/Municipal Cemeteries | ~50,000+ |
| Church Cemeteries | ~100,000+ |
| Private/Family Cemeteries | ~150,000+ |
| National Cemeteries | 155 |
| State Veterans Cemeteries | 119 |
| Jewish Cemeteries | ~2,000+ |
| Muslim Cemeteries | ~500+ |
| Historic Cemeteries | ~20,000+ |
| Pet Cemeteries | ~600+ |
| Green/Natural Burial | ~300+ |
| **Total Estimated** | **300,000+** |

## Scraping Strategy

### Phase 1: Major Cities (Quick wins)
Top 100 US cities by population
- ~5,000 cemeteries expected
- High traffic potential

### Phase 2: State Capitals + Large Cities
All state capitals + cities > 100k population
- ~15,000 cemeteries expected

### Phase 3: County-by-County
All 3,143 counties systematically
- Full coverage
- ~50,000+ cemeteries

### Phase 4: Specialized Searches
- National cemeteries (official list)
- Veterans cemeteries (VA database)
- Historic cemeteries (National Register)

## Search Query Format

```javascript
// For each city:
`${searchTerm} ${cityName}, ${stateAbbr}`

// Examples:
'cemetery Los Angeles, CA'
'memorial park Chicago, IL'
'national cemetery Arlington, VA'
'jewish cemetery New York, NY'
```

## API Considerations

### Bright Data SERP API
- Same API as NL version
- Cost: ~$0.003 per request
- ~40 queries per city × 100 cities = 4,000 requests = ~$12

### Rate Limiting
- 1 second between queries
- 5 seconds between cities
- Same as NL version

## Famous Deaths Data Source

### Wikidata SPARQL (English)
Same approach as NL version but filter for:
- `country of citizenship: United States`
- `place of death: in USA`
- Wikipedia article in English

Expected: 5,000+ notable Americans
