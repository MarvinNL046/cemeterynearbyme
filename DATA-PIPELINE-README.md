# Data Pipeline - BegraafplaatsInDeBuurt.nl

Complete workflow voor het verzamelen en verrijken van begraafplaatsdata.

---

## Overzicht Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. DISCOVERY   │ → │    2. MERGE     │ → │  3. OSM ENRICH  │ → │   4. PHOTOS     │ → │  5. CONTENT     │ → │   6. DEPLOY     │
│  (SERP API)     │    │  (Match & Add)  │    │  (Oppervlakte)  │    │  (SERP Photos)  │    │  (GPT-4o-mini)  │    │  (Sync & Push)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Stap 1: Discovery (Bright Data SERP API)

### Wat het doet
Zoekt naar begraafplaatsen in alle Nederlandse gemeenten via Google Maps.

### Wat het SCRAPED (per begraafplaats):
| Veld | Beschrijving | Voorbeeld |
|------|--------------|-----------|
| `google_cid` | Unieke Google ID | `0x47c6...` |
| `google_place_id` | Google Place ID | `ChIJ...` |
| `name` | Naam begraafplaats | `Algemene Begraafplaats` |
| `address` | Volledig adres | `Kerkstraat 1, 1234 AB` |
| `latitude/longitude` | GPS coördinaten | `52.123, 4.567` |
| `phone` | Telefoonnummer | `+31 20 123 4567` |
| `website` | Website URL | `https://...` |
| `rating` | Google rating | `4.5` |
| `review_count` | Aantal reviews | `23` |
| `opening_hours` | Openingstijden | `Ma-Vr 9:00-17:00` |
| `photo_url` | Hoofdfoto URL | `https://lh3...` |
| `facilities` | Faciliteiten | `["Rolstoel", "Parking"]` |
| `business_type` | Type locatie | `cemetery` |

### Wat het NIET scraped:
- ❌ Oppervlakte (komt van OSM)
- ❌ Aantal graven (komt van Jina search)
- ❌ Aantal personen begraven (komt van Jina search)
- ❌ Beschrijvingen/teksten (komt van GPT enrichment)
- ❌ Historische informatie
- ❌ Wikipedia links (komt van OSM)

### Commands
```bash
# 1. Genereer locatielijst (eenmalig)
npx tsx scripts/discovery/seed-locations.ts

# 2. Start discovery (kan hervatten)
npx tsx scripts/discovery/discover-cemeteries.ts

# Met opties:
npx tsx scripts/discovery/discover-cemeteries.ts --provincie "Utrecht"
npx tsx scripts/discovery/discover-cemeteries.ts --batch 50
npx tsx scripts/discovery/discover-cemeteries.ts --dry-run
```

### Output bestanden
```
data/discovery/
├── locations.json              # Alle locaties + status
├── progress.json               # Voortgang statistieken
├── discovered-cemeteries.json  # Gevonden data (RAW)
└── rate-limits.json            # API rate limiting
```

---

## Stap 2: Merge Discovery Data

### Wat het doet
Matched gevonden begraafplaatsen met bestaande data en voegt nieuwe info toe.

### Matching strategieën (in volgorde):
1. **Exact slug match** - Zelfde slug
2. **CID match** - Zelfde Google CID
3. **GPS proximity** - Binnen 100m van elkaar
4. **Postcode + naam** - Zelfde postcode, vergelijkbare naam
5. **Gemeente + fuzzy** - Zelfde gemeente, fuzzy naam match

### Wat wordt GEMERGED:
| Veld | Actie |
|------|-------|
| `google_rating` | Altijd updaten |
| `google_review_count` | Altijd updaten |
| `google_place_id` | Toevoegen indien leeg |
| `google_cid` | Toevoegen indien leeg |
| `openingstijden` | Toevoegen indien leeg |
| `telefoon` | Toevoegen indien leeg |
| `gps_coordinaten` | Toevoegen indien leeg |
| `foto_url` | Toevoegen indien leeg |
| `website` | Toevoegen indien leeg |
| `faciliteiten` | Toevoegen indien leeg |

### Command
```bash
npx tsx scripts/merge-discovery-data.ts
```

### Output
- Updates `data/begraafplaatsen.json`
- Log in `data/merge-log.json`

---

## Stap 3: OSM Enrichment

### Wat het doet
Haalt extra data op van OpenStreetMap + Jina AI search.

### Wat het TOEVOEGT:
| Veld | Bron | Beschrijving |
|------|------|--------------|
| `oppervlakte` | OSM | Oppervlakte in m² |
| `osm_id` | OSM | Link naar OSM |
| `wikipedia_url` | OSM | Wikipedia artikel |
| `wikidata_id` | OSM | Wikidata ID |
| `aantal_graven` | Jina Search | Geschat aantal graven |
| `aantal_personen` | Jina Search | Aantal begraven personen |

### Command
```bash
npx tsx scripts/enrich-osm-data.ts
```

### Features
- ✅ Auto-resume (skipt entries met oppervlakte)
- ✅ Rate limiting (1 req/sec OSM, 0.5 sec Jina)
- ✅ Saves elke 50 entries

---

## Stap 4: Photo Fetching (Bright Data SERP API)

### Wat het doet
Haalt Google Photos op voor begraafplaatsen die een `google_place_id` hebben maar nog geen foto.

### Hoe het werkt
1. Zoekt locaties zonder foto maar mét `google_place_id`
2. Maakt batch requests naar Bright Data SERP API
3. Vraagt Google Photos op via Place ID
4. Slaat eerste bruikbare foto op in `foto_url`

### Wat het TOEVOEGT:
| Veld | Bron | Beschrijving |
|------|------|--------------|
| `foto_url` | Google Photos | Hoofdfoto van de begraafplaats |

### Command
```bash
# Start photo fetching (hervat automatisch)
npx tsx scripts/fetch-missing-photos.ts

# Dry run (alleen tellen)
npx tsx scripts/fetch-missing-photos.ts --dry-run
```

### Features
- ✅ Auto-resume via `data/missing-photos-progress.json`
- ✅ Batch processing (5 locaties per batch)
- ✅ Rate limiting (15s - 60s tussen batches)
- ✅ Retry logic bij timeouts
- ✅ Saves progress regelmatig

### Output bestanden
```
data/
├── missing-photos-progress.json  # Voortgang tracking
└── begraafplaatsen.json          # Foto URLs toegevoegd
```

### Kosten
- Bright Data SERP API: ~$5 per 1000 requests
- ~2000 locaties = ~$10

---

## Stap 5: Content Enrichment (GPT-4o-mini)

### Wat het doet
Genereert unieke, kwalitatieve beschrijvingen voor elke begraafplaats.
**Essentieel voor Google AdSense goedkeuring** - voorkomt "thin content" afwijzingen.

### Waarom dit nodig is
- Google AdSense wijst sites af met "thin content" (<100 woorden)
- Template-achtige content wordt ook afgewezen
- Dit script genereert **400+ woorden unieke content** per pagina

### Wat het GENEREERT:
| Veld | Beschrijving |
|------|--------------|
| `generated.samenvatting` | Uitgebreide beschrijving (400+ woorden) |
| `generated.geschiedenis` | Historische context |
| `generated.sfeer_en_omgeving` | Sfeer beschrijving |
| `generated.praktische_informatie` | Praktische info |
| `generated.bijzonderheden` | Unieke kenmerken |
| `generated.bezoekerstips` | Tips voor bezoekers |

### Features
- ✅ **Type-specifieke prompts** - Unieke prompts voor:
  - Joodse begraafplaatsen (tradities, Hebreeuwse inscripties)
  - Natuurbegraafplaatsen (ecologie, duurzaamheid)
  - Islamitische begraafplaatsen (rituelen, Qibla)
  - Rooms-katholieke begraafplaatsen (sacramenten)
  - Protestantse begraafplaatsen (soberheid)
  - Oorlogsbegraafplaatsen (WOII, herdenking)
- ✅ **Variatie in openingen** - 10+ verschillende openingszinnen
- ✅ **Quality checks** - Retry als content te kort of te template-achtig
- ✅ **Auto-resume** - Hervat waar gestopt
- ✅ **Progress tracking** - Realtime statistieken

### Commands
```bash
# Volledige run (6883 entries, ~2-3 uur)
npx tsx scripts/enrich-content-quality.ts

# Dry run (preview zonder API calls)
npx tsx scripts/enrich-content-quality.ts --dry-run

# Eerste X entries
npx tsx scripts/enrich-content-quality.ts --batch 100

# Reset progress en start opnieuw
npx tsx scripts/enrich-content-quality.ts --reset

# Achtergrond draaien
npx tsx scripts/enrich-content-quality.ts &
```

### Kosten
- Model: GPT-4o-mini
- ~500 tokens output per entry
- 6883 entries × 500 tokens = ~3.4M tokens
- **Geschatte kosten: ~$2.50-3.00**

### Tijd
- ~5-8 seconden per entry
- 5 concurrent requests
- **Totale tijd: ~2-3 uur**

### Environment
```env
# .env.openai
OPENAI_API_KEY=sk-...
```

### Output bestanden
```
data/
├── begraafplaatsen.json                    # Content toegevoegd aan 'generated'
├── enrichment-quality-progress.json        # Voortgang tracking
└── begraafplaatsen-pre-enrichment.json     # Backup voor enrichment
```

### Voorbeeld gegenereerde content
```
Een waardig monument in Drenthe is de Algemene Begraafplaats gelegen
aan de Oude Groningerweg 19 in Gieten. Deze begraafplaats, opgericht
in 1830, dient als een eerbetoon aan de overledenen en speelt een
belangrijke rol in de lokale gemeenschap...

[400+ woorden unieke content]
```

### Troubleshooting
```bash
# Check voortgang
cat data/enrichment-quality-progress.json

# Check gemiddelde woordenaantal
node -e "const d=require('./data/begraafplaatsen.json'); const g=d.filter(c=>c.generated?.samenvatting); console.log('Verrijkt:', g.length); console.log('Gem. woorden:', Math.round(g.reduce((a,c)=>a+c.generated.samenvatting.split(' ').length,0)/g.length));"
```

---

## Stap 6: Deploy

### Sync data naar public folder
```bash
cp data/begraafplaatsen.json public/data/cemeteries.json
```

### Herstart dev server
```bash
pkill -f "next dev" && npm run dev
```

### Deploy naar productie
```bash
git add data/ public/data/
git commit -m "Update cemetery data"
git push
```

---

## Complete Workflow (Copy-Paste Ready)

```bash
# === STAP 1: Discovery (alleen als je nieuwe data wilt) ===
npx tsx scripts/discovery/seed-locations.ts
npx tsx scripts/discovery/discover-cemeteries.ts

# === STAP 2: Merge naar bestaande data ===
npx tsx scripts/merge-discovery-data.ts

# === STAP 3: OSM verrijking (oppervlakte + graven) ===
npx tsx scripts/enrich-osm-data.ts

# === STAP 4: Photo fetching (Google Photos via SERP) ===
npx tsx scripts/fetch-missing-photos.ts

# === STAP 5: Content enrichment (400+ woorden per pagina) ===
npx tsx scripts/enrich-content-quality.ts

# === STAP 6: Sync naar public ===
cp data/begraafplaatsen.json public/data/cemeteries.json

# === STAP 7: Herstart server ===
pkill -f "next dev" && npm run dev
```

### Parallel uitvoeren (voor snelheid)
Stap 3, 4, en 5 kunnen parallel draaien omdat ze verschillende APIs gebruiken:
```bash
# In aparte terminals of met &:
npx tsx scripts/enrich-osm-data.ts &           # OSM API
npx tsx scripts/fetch-missing-photos.ts &       # Bright Data SERP
npx tsx scripts/enrich-content-quality.ts &     # OpenAI API
```

---

## Data Statistieken Checken

```bash
# Hoeveel data hebben we?
node -e "
const data = require('./public/data/cemeteries.json');
console.log('Totaal:', data.length);
console.log('Met foto:', data.filter(b => b.foto_url).length);
console.log('Met GPS:', data.filter(b => b.gps_coordinaten).length);
console.log('Met oppervlakte:', data.filter(b => b.oppervlakte).length);
console.log('Met graven:', data.filter(b => b.aantal_graven).length);
console.log('Met faciliteiten:', data.filter(b => b.faciliteiten).length);
console.log('Met beschrijving:', data.filter(b => b.generated?.samenvatting).length);
"
```

---

## Environment Variables

```env
# .env.local
BRIGHTDATA_API_KEY=xxx        # Voor discovery
DATABASE_URL=xxx              # Voor user photos/reviews
```

---

## Troubleshooting

### Discovery script stopt
```bash
# Gewoon opnieuw starten - hervat automatisch
npx tsx scripts/discovery/discover-cemeteries.ts
```

### OSM script stopt
```bash
# Gewoon opnieuw starten - skipt entries met oppervlakte
npx tsx scripts/enrich-osm-data.ts
```

### Data niet zichtbaar op website
```bash
# Sync naar public folder
cp data/begraafplaatsen.json public/data/cemeteries.json

# Herstart server om cache te clearen
pkill -f "next dev" && npm run dev
```

---

## Optioneel: Google Reviews Ophalen

### Wat het doet
Haalt volledige Google reviews op via **Bright Data Google Maps Dataset API**.

### Flow
```
┌─────────────────────┐    ┌─────────────────────┐
│  fetch-reviews-     │ → │   embed-reviews.ts  │
│  by-cid.ts          │    │   (embed in JSON)   │
│  (ophalen via API)  │    │                     │
└─────────────────────┘    └─────────────────────┘
```

### Stap 1: Reviews ophalen (`fetch-reviews-by-cid.ts`)

Gebruikt de **Google CID** (uit discovery) om reviews op te halen.

**API Details:**
```typescript
const DATASET_ID = 'gd_m8ebnr0q2qlklc02fz'; // Google Maps Full Info
```

**Wat het ophaalt per review:**
| Veld | Beschrijving |
|------|--------------|
| `reviewer_name` | Naam van reviewer |
| `rating` | 1-5 sterren |
| `review_text` | Volledige review tekst |
| `review_date` | Datum van review |
| `reviewer_image` | Profielfoto URL |

**Commands:**
```bash
# Alle begraafplaatsen met CID
npx tsx scripts/fetch-reviews-by-cid.ts

# Alleen bepaalde provincie
npx tsx scripts/fetch-reviews-by-cid.ts --provincie "Utrecht"

# Eerste 100
npx tsx scripts/fetch-reviews-by-cid.ts --batch 100

# Test run (1 locatie)
npx tsx scripts/fetch-reviews-by-cid.ts --dry-run
```

**Output:**
```
data/reviews/
├── algemene-begraafplaats-amsterdam.json
├── begraafplaats-zorgvlied.json
└── ... (per begraafplaats een JSON bestand)
```

### Stap 2: Reviews embedden (`embed-reviews.ts`)

Embed de opgehaalde reviews in `begraafplaatsen.json` zodat ze direct beschikbaar zijn.

**Command:**
```bash
npx tsx scripts/embed-reviews.ts
```

**Resultaat:**
Reviews worden toegevoegd als `embeddedReviews` array in elk cemetery object.

### Complete Reviews Workflow
```bash
# 1. Reviews ophalen (vereist google_cid uit discovery)
npx tsx scripts/fetch-reviews-by-cid.ts

# 2. Embedden in main data
npx tsx scripts/embed-reviews.ts

# 3. Sync naar public
cp data/begraafplaatsen.json public/data/cemeteries.json
```

---

## Optionele Extra Scripts

| Script | Doel |
|--------|------|
| `enrich-with-gpt.ts` | Oude AI beschrijvingen (vervangen door `enrich-content-quality.ts`) |
| `fetch-google-photos-serp.ts` | Extra foto's ophalen (alternatief) |
| `translate-reviews.ts` | Reviews vertalen |
| `check-404s.ts` | Controleer dode links |

---

## Monitoring Lopende Processen

Als je processen op de achtergrond draait, kun je ze monitoren:

```bash
# Check alle lopende processes
ps aux | grep "tsx scripts"

# Tail output van content enrichment
tail -f /tmp/claude/tasks/*.output

# Check enrichment progress
watch -n 10 'node -e "const d=require(\"./data/begraafplaatsen.json\"); const g=d.filter(c=>c.generated?.samenvatting?.length>200); console.log(\"Verrijkt:\", g.length, \"/\", d.length);"'

# Check photo progress
watch -n 10 'cat data/missing-photos-progress.json | jq .stats'
```

---

---

## 🇧🇪 België Uitbreiding

De data pipeline ondersteunt nu ook België met ondersteuning voor drie gewesten:
- **Vlaanderen**: 5 provincies, Nederlandse zoektermen
- **Wallonië**: 5 provincies, Franse zoektermen ("cimetière", "crématorium")
- **Brussel-Hoofdstad**: Tweetalig (NL/FR)

### België Workflow

```bash
# === STAP 1: Seed Belgische locaties ===
npx tsx scripts/discovery/seed-locations-belgium.ts

# Check: ~641 locaties over 11 provincies
npx tsx scripts/discovery/seed-locations-belgium.ts --dry-run

# === STAP 2: Discovery België ===
npx tsx scripts/discovery/discover-cemeteries-belgium.ts

# Per regio:
npx tsx scripts/discovery/discover-cemeteries-belgium.ts --regio Vlaanderen
npx tsx scripts/discovery/discover-cemeteries-belgium.ts --regio Wallonië
npx tsx scripts/discovery/discover-cemeteries-belgium.ts --regio Brussel

# === STAP 3: Merge België data ===
npx tsx scripts/merge-discovery-data-belgium.ts

# === STAP 4: Enrich België ===
# TODO: Add --land België support to enrichment scripts
```

### België Bestanden

```
data/
├── discovery/
│   ├── locations-belgium.json           # Belgische locaties + status
│   ├── progress-belgium.json            # Voortgang België
│   ├── discovered-cemeteries-belgium.json  # Gevonden data België
│   └── rate-limits-belgium.json         # Rate limiting België
├── begraafplaatsen-belgie.json          # Belgische begraafplaatsen
└── merge-log-belgium.json               # Merge log België

public/data/
└── cemeteries-belgium.json              # Public België data
```

### Zoektermen per Taal

| Taal | Zoektermen |
|------|------------|
| NL (Vlaanderen) | begraafplaats, kerkhof, natuurbegraafplaats, joodse/islamitische begraafplaats |
| FR (Wallonië) | cimetière, cimetière naturel, cimetière juif/islamique/catholique/militaire |
| NL/FR (Brussel) | Beide sets gecombineerd |

### België Data Structuur

Extra velden voor België:
- `regio`: Vlaanderen \| Wallonië \| Brussel
- `land`: België
- `taal`: nl \| fr \| nl/fr
- `naam_fr`: Franse naam (voor Wallonië/Brussel)

---

*Laatst bijgewerkt: December 2024*
