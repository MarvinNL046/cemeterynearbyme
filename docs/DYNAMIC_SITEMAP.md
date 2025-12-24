# Dynamic Sitemap Generation

## Overzicht

Net zoals WordPress automatisch nieuwe pagina's aan de sitemap toevoegt, doet onze Next.js app dit nu ook! 

## Hoe het werkt

### Automatische Sitemap Generatie
- Wanneer je een nieuwe begraafplaats toevoegt aan `/data/begraafplaatsen.json`
- De sitemap wordt automatisch bijgewerkt bij de volgende build
- Geen handmatige stappen nodig!

### Locatie
- Sitemap: `https://www.begraafplaatsindebuurt.nl/sitemap.xml`
- Gegenereerd door: `/app/sitemap.ts`

### Wat wordt er automatisch toegevoegd?

1. **Statische pagina's** (homepage, zoeken, vergelijk, etc.)
2. **Provincie pagina's** - Automatisch voor elke provincie met data
3. **Gemeente pagina's** - Automatisch voor elke gemeente
4. **Begraafplaats pagina's** - Automatisch voor elke begraafplaats
5. **Plaats pagina's** - Automatisch voor elke unieke plaats
6. **Type pagina's** - Voor elk type begraafplaats

### Development vs Production

**Development (npm run dev)**
- Sitemap wordt dynamisch gegenereerd bij elk verzoek
- Perfect voor testen

**Production (npm run build && npm run start)**
- Sitemap wordt gegenereerd tijdens build
- Gecached voor snelle response times
- Wordt vernieuwd bij elke nieuwe deployment

### Oude Statische Sitemaps Verwijderen

Run dit commando om oude statische sitemaps op te ruimen:

```bash
npx tsx scripts/cleanup-old-sitemaps.ts
```

### Voordelen

1. **Zero Maintenance** - Voeg data toe, sitemap update automatisch
2. **Altijd Accuraat** - Geen vergeten pagina's meer
3. **SEO Optimized** - Juiste priorities en change frequencies
4. **Type Safe** - TypeScript zorgt voor correcte URLs

### Google Search Console

Na deployment:
1. Ga naar Google Search Console
2. Verwijder oude sitemap referenties
3. Voeg nieuwe toe: `https://www.begraafplaatsindebuurt.nl/sitemap.xml`
4. Google zal automatisch alle nieuwe pagina's ontdekken!

### Troubleshooting

**Sitemap niet zichtbaar in development?**
- Check: http://localhost:3000/sitemap.xml
- Zorg dat je `npm run dev` draait

**Nieuwe pagina's niet in sitemap?**
- Check of de data in `/data/begraafplaatsen.json` staat
- Check of `/public/data/cemeteries.json` gesynchroniseerd is
- Run `npm run build` om te testen

## Technische Details

De sitemap wordt gegenereerd door Next.js's ingebouwde sitemap functionaliteit:
- Gebruikt de `sitemap()` functie in `app/sitemap.ts`
- Leest data uit onze JSON bestanden
- Genereert automatisch alle URLs
- Voegt metadata toe (lastModified, priority, changeFrequency)