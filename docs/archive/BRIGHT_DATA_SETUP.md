# Bright Data Setup voor Begraafplaatsindebuurt.nl

## Overzicht
Dit project gebruikt Bright Data voor het scrapen van begraafplaats websites en het verzamelen van actuele informatie zoals openingstijden, tarieven, en faciliteiten.

## 1. Account Setup

### Gebruik Bestaande API Token
Dit project gebruikt dezelfde Bright Data API token als vindtandarts.nl:
- **API Token**: `90e72bf183dcec69948a69a369dec41d115341fe15991eb195b456364aef4ff0`
- **Zone**: `mcp_unlocker`

### Voordelen
- Geen extra account nodig
- Geen aparte billing setup
- Direct aan de slag met scraping
- Gedeelde kosten met vindtandarts.nl project

## 2. Project Configuration

### Environment Variables
Maak een `.env.brightdata` bestand in de root:

```bash
# Bright Data API Configuration (GEBRUIK BESTAANDE TOKEN)
BRIGHTDATA_API_TOKEN=90e72bf183dcec69948a69a369dec41d115341fe15991eb195b456364aef4ff0
BRIGHTDATA_ZONE=mcp_unlocker

# Scraping Configuration
SCRAPE_CONCURRENCY=10
SCRAPE_RETRY_ATTEMPTS=3
SCRAPE_TIMEOUT=30000

# Environment
NODE_ENV=development
```

### Install Dependencies

```bash
npm install axios p-limit chalk dotenv ora cli-progress
npm install -D @types/node tsx @types/cli-progress
```

## 3. Usage

### Test de connectie:
```bash
npm run brightdata:test
```

### Scrape een enkele begraafplaats:
```bash
npm run brightdata:single -- --slug "begraafplaats-zorgvlied-amsterdam"
```

### Scrape alle begraafplaatsen:
```bash
npm run brightdata:scrape-all
```

### Resume onderbroken scraping:
```bash
npm run brightdata:resume
```

### Bekijk summary:
```bash
npm run brightdata:summary
```

## 4. Data Output

Scraped data wordt opgeslagen in:
- `/data/scraped-brightdata/[slug].json` - Individuele begraafplaats data
- `/data/scraped-brightdata/progress.json` - Voortgang tracking
- `/data/scraped-brightdata/summary.json` - Overzicht van alle scraped data

### Data Structure
Elke begraafplaats bevat:
- **Basis informatie**: naam, gemeente, provincie, type
- **Website data**: 
  - Openingstijden
  - Contact informatie (telefoon, email, adres)
  - Tarieven
  - Geschiedenis
  - Faciliteiten (parkeren, aula, toilet, etc.)
  - Toegankelijkheid
  - Graf soorten
  - Diensten
- **Google data**: 
  - Search results
  - Reviews
  - Foto's
  - Nabijgelegen begraafplaatsen
- **Enrichment hints**: 
  - Wat ontbreekt er nog
  - Kwaliteit van de data

## 5. Cost Management

### Geschatte kosten:
- Web Unlocker: $0.001 - $0.003 per request
- Voor 3,830 begraafplaatsen: ~$4-12 totaal
- Google searches: $0.002 per search

### Tips voor kostenbeheersing:
1. Begin met een kleine test batch (10-50 begraafplaatsen)
2. Monitor usage in real-time via Bright Data dashboard
3. Gebruik de progress tracking om te hervatten bij onderbreking
4. Cache results lokaal om dubbele requests te voorkomen

## 6. Scraping Strategy

De scraper gebruikt een intelligente aanpak:

1. **Directe website scraping** als beschikbaar
2. **Google search fallback** voor extra informatie
3. **Structured data extraction** voor consistente output
4. **Progress tracking** voor betrouwbaarheid

### Wat wordt verzameld:
- ✅ Openingstijden
- ✅ Contact informatie (telefoon, email, adres)
- ✅ Faciliteiten (parkeren, aula, toilet, rolstoeltoegankelijk)
- ✅ Graf soorten (algemeen, particulier, urnen, etc.)
- ✅ Tarieven (indicatie)
- ✅ Historische informatie
- ✅ Toegankelijkheid informatie
- ✅ Monumentenbeleid
- ✅ Diensten

## 7. Troubleshooting

### Common issues:
- **401 Unauthorized**: Check API token in `.env.brightdata`
- **Zone not found**: Verify zone name is exactly `mcp_unlocker`
- **Timeout errors**: Increase timeout or reduce concurrency
- **Rate limits**: Reduce concurrency level (standaard: 10)

### Debug mode:
```bash
DEBUG=brightdata npm run brightdata:scrape-all
```

### Check logs:
```bash
tail -f data/scraped-brightdata/progress.json
```

## 8. Next Steps

Na het scrapen:

1. **Data validatie**: Check `summary.json` voor coverage statistics
2. **AI Enrichment**: Gebruik GPT-4 voor content generatie
3. **Database import**: Importeer verrijkte data in Supabase
4. **Website update**: Deploy nieuwe content

## 9. Monitoring

### Real-time monitoring:
1. Login op [brightdata.com](https://brightdata.com)
2. Ga naar Dashboard → Usage
3. Filter op zone `mcp_unlocker`
4. Bekijk requests, bandwidth, en kosten

### Local monitoring:
```bash
# Check progress
cat data/scraped-brightdata/progress.json | jq .

# Check failed items
cat data/scraped-brightdata/summary.json | jq .failedItems

# Count completed
ls -1 data/scraped-brightdata/*.json | wc -l
```

## 10. Best Practices

1. **Test eerst** met enkele begraafplaatsen
2. **Monitor kosten** tijdens het scrapen
3. **Respecteer rate limits** van websites
4. **Backup progress** regelmatig
5. **Valideer data** na scraping

---

Voor vragen of problemen, check eerst de Bright Data documentatie of neem contact op met support.