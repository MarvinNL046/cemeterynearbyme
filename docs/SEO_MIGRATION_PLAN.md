# SEO Migratie Plan - Veilige Overgang

## 🎯 Doel
Voorkomen van Google penalties en 404 errors tijdens de overgang naar het nieuwe systeem.

## 📋 Stappenplan voor Veilige Migratie

### Fase 1: Voorbereiding (Voor Go-Live)

1. **Inventory van oude URLs**
   - Check Google Search Console voor geïndexeerde pagina's
   - Download lijst van alle huidige URLs
   - Identificeer URL structuur veranderingen

2. **301 Redirects Implementeren**
   - ✅ Oude sitemap URLs → nieuwe sitemap.xml
   - ✅ Oude pagina structuren → nieuwe structuren
   - Via `next.config.js` redirects

3. **Test Redirects Lokaal**
   ```bash
   npm run build
   npm run start
   # Test oude URLs om te zien of ze correct redirecten
   ```

### Fase 2: Deployment Strategie

1. **Behoud Oude Content Tijdelijk**
   - Houd oude sitemap files 30 dagen online
   - Dit geeft Google tijd om de redirects te verwerken
   - Voorkomt immediate 404s

2. **Dual Sitemap Strategie**
   ```xml
   <!-- In robots.txt tijdelijk beide sitemaps -->
   Sitemap: https://www.begraafplaatsindebuurt.nl/sitemap.xml
   Sitemap: https://www.begraafplaatsindebuurt.nl/sitemap-old.xml
   ```

3. **Monitoring Setup**
   - Google Search Console alerts voor 404s
   - Analytics tracking voor redirect performance

### Fase 3: Go-Live Checklist

- [ ] Alle redirects getest
- [ ] Oude sitemaps nog bereikbaar (met redirect)
- [ ] robots.txt updated
- [ ] Google Search Console gemonitord
- [ ] 404 error page vriendelijk en helpvol

### Fase 4: Post-Launch (Eerste 30 dagen)

1. **Dagelijkse Monitoring**
   - Check Search Console voor crawl errors
   - Monitor 404 reports
   - Check rankings voor belangrijke keywords

2. **Quick Fixes**
   - Voeg missende redirects toe zodra 404s gevonden worden
   - Update `middleware.ts` voor edge cases

3. **Communicatie met Google**
   - Submit nieuwe sitemap in Search Console
   - Request re-crawl voor belangrijke pagina's
   - Monitor indexering status

### Fase 5: Cleanup (Na 30-60 dagen)

1. **Verwijder Oude Assets**
   ```bash
   npx tsx scripts/cleanup-old-sitemaps.ts
   ```

2. **Verwijder Tijdelijke Redirects**
   - Houd alleen permanente redirects
   - Cleanup tijdelijke dual-sitemap setup

## 🛡️ Veiligheidsmaatregelen

### 1. 404 Fallback Page
```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>Pagina niet gevonden</h1>
      <p>De pagina is mogelijk verplaatst. Probeer:</p>
      <ul>
        <li><a href="/zoeken">Zoek een begraafplaats</a></li>
        <li><a href="/">Ga naar homepage</a></li>
      </ul>
    </div>
  )
}
```

### 2. Custom Error Tracking
```typescript
// Track 404s voor analyse
if (typeof window !== 'undefined') {
  // Log naar analytics
  gtag('event', '404_error', {
    page_path: window.location.pathname,
    referrer: document.referrer
  });
}
```

### 3. Gradual Rollout
- Start met 10% traffic naar nieuwe versie
- Monitor voor issues
- Verhoog gradually naar 100%

## 📊 Success Metrics

- **404 Error Rate**: < 1% na eerste week
- **Crawl Errors**: Dalende trend in Search Console
- **Rankings**: Geen significante drops
- **Indexering**: Nieuwe pagina's binnen 7 dagen geïndexeerd

## 🚨 Noodplan

Als rankings dramatisch dalen:
1. Rollback naar oude versie mogelijk houden
2. Alle oude URLs immediate restore
3. Communicate met Google via Search Console
4. Tijdelijk dual-site strategy

## 💡 Tips

1. **Timing**: Deploy tijdens lage traffic (weekend avond)
2. **Communication**: Informeer Google via Search Console
3. **Patience**: SEO recovery kan 2-4 weken duren
4. **Documentation**: Log alle changes en issues

## Tools voor Monitoring

- Google Search Console (Crawl errors, Index status)
- Google Analytics (Traffic patterns, 404s)
- Screaming Frog (Crawl test voor broken links)
- Ahrefs/SEMrush (Ranking monitoring)