# Cemetery Discovery System

Automatisch begraafplaatsen ontdekken via Bright Data SERP API.

## Overzicht

Dit systeem zoekt automatisch naar begraafplaatsen in alle Nederlandse gemeenten en plaatsen via Google Maps, haalt CIDs/place_ids op, en verzamelt reviews, ratings en openingstijden.

## Scripts

### 1. `seed-locations.ts` - Genereer zoeklocaties

Maakt een lijst van alle Nederlandse gemeenten en plaatsen.

```bash
# Genereer alle locaties
npx tsx scripts/discovery/seed-locations.ts

# Alleen één provincie
npx tsx scripts/discovery/seed-locations.ts --provincie "Noord-Holland"

# Dry run (preview)
npx tsx scripts/discovery/seed-locations.ts --dry-run

# Reset en opnieuw beginnen
npx tsx scripts/discovery/seed-locations.ts --reset
```

### 2. `discover-cemeteries.ts` - Zoek begraafplaatsen

Zoekt via Bright Data SERP API naar begraafplaatsen in elke locatie.

```bash
# Verwerk alle pending locaties
npx tsx scripts/discovery/discover-cemeteries.ts

# Alleen één provincie
npx tsx scripts/discovery/discover-cemeteries.ts --provincie "Utrecht"

# Limiteer aantal locaties
npx tsx scripts/discovery/discover-cemeteries.ts --batch 50

# Dry run (preview, geen API calls)
npx tsx scripts/discovery/discover-cemeteries.ts --dry-run

# Hervat na onderbreking
npx tsx scripts/discovery/discover-cemeteries.ts --resume
```

### 3. `export-to-main-data.ts` - Exporteer naar main data

Merged gevonden begraafplaatsen met de bestaande `begraafplaatsen.json`.

```bash
# Export alles
npx tsx scripts/discovery/export-to-main-data.ts

# Preview zonder wijzigingen
npx tsx scripts/discovery/export-to-main-data.ts --dry-run

# Alleen nieuwe (skip updates)
npx tsx scripts/discovery/export-to-main-data.ts --skip-existing
```

## Data Bestanden

```
data/discovery/
├── locations.json           # Alle Nederlandse locaties met status
├── progress.json            # Voortgang statistieken
├── discovered-cemeteries.json  # Gevonden begraafplaatsen (raw)
└── rate-limits.json         # API rate limiting state
```

## Workflow

1. **Seed locaties** (eenmalig of na gemeente herindeling)
   ```bash
   npx tsx scripts/discovery/seed-locations.ts
   ```

2. **Run discovery** (kan meerdere keren, hervat automatisch)
   ```bash
   npx tsx scripts/discovery/discover-cemeteries.ts
   ```

3. **Export naar main data**
   ```bash
   npx tsx scripts/discovery/export-to-main-data.ts
   ```

4. **Commit & deploy**
   ```bash
   git add data/
   git commit -m "Add discovered cemeteries"
   ```

## Rate Limiting

Het discovery script heeft ingebouwde rate limiting:

| Limiet | Waarde |
|--------|--------|
| Per minuut | 10 requests |
| Per uur | 300 requests |
| Per dag | 3000 requests |
| Retry attempts | 3 (exponential backoff) |
| Batch delay | 3 seconden |

De staat wordt opgeslagen in `rate-limits.json` en blijft behouden tussen runs.

## Retry Logic

- **Automatische retries**: 3 pogingen met exponential backoff
- **Failed locations**: Worden gemarkeerd en kunnen opnieuw geprobeerd worden
- **Resume support**: Hervat waar je gebleven was met `--resume`

## Wat wordt opgehaald?

Per begraafplaats:
- ✅ Google CID (voor reviews fetching)
- ✅ Google Place ID
- ✅ Naam en adres
- ✅ GPS coördinaten
- ✅ Telefoon en website
- ✅ Rating en review count
- ✅ Openingstijden
- ✅ Top reviews (max 10)
- ✅ Business type

## Environment Variables

Zorg dat deze in `.env.local` staan:

```env
BRIGHTDATA_API_KEY=your_api_key_here
# of
BRIGHTDATA_API_TOKEN=your_api_key_here
```

## Tips

1. **Start klein**: Test eerst met één provincie (`--provincie "Flevoland"`)
2. **Monitor progress**: Check `progress.json` voor statistieken
3. **Batch runs**: Gebruik `--batch 100` voor gecontroleerde runs
4. **Dry run eerst**: Gebruik `--dry-run` om te zien wat er gebeurt

## Voorbeeld Output

```
🔍 Cemetery Discovery Script

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Status:
   Totaal locaties: 456
   Te verwerken: 456
   Al gevonden: 0 begraafplaatsen
   Unieke CIDs: 0

🚀 Start verwerking van 456 locaties...

📍 Amsterdam (Amsterdam, Noord-Holland)
   🔎 Zoeken: "begraafplaats Amsterdam"...
   ✓ 12 gevonden (12 nieuw)
   🔎 Zoeken: "kerkhof Amsterdam"...
   ✓ 5 gevonden (3 nieuw)
   💾 Opgeslagen (1/456)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SAMENVATTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Verwerkt: 456/456 locaties
🆕 Nieuw gevonden: 2847 begraafplaatsen
📦 Totaal in database: 2847
🔢 Unieke CIDs: 2847
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
