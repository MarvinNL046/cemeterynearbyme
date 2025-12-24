# Implementatie Gids: Twee-Fase Content Pipeline voor BegraafplaatsInDeBuurt.nl

## Overzicht: Van "Content van Weinig Waarde" naar AdSense Goedkeuring

Deze gids beschrijft exact hoe je de succesvolle vindtandarts.nl strategie kunt toepassen op begraafplaatsindebuurt.nl.

## Fase 1: Data Verzameling & Web Scraping

### Stap 1: Basis Data Structuur
```bash
# Maak de benodigde directories
mkdir -p data/scraped-begraafplaatsen
mkdir -p data/enrichments-begraafplaatsen
mkdir -p scripts
```

### Stap 2: CSV naar JSON Conversie
```javascript
// scripts/build-begraafplaats-data.js
const csv = require('csv-parser');
const fs = require('fs');

const begraafplaatsen = {};

fs.createReadStream('data/begraafplaatsen.csv')
  .pipe(csv())
  .on('data', (row) => {
    const slug = createSlug(row.naam, row.gemeente);
    begraafplaatsen[slug] = {
      naam: row.naam,
      gemeente: row.gemeente,
      provincie: row.provincie,
      type: row.type || 'algemene begraafplaats',
      adres: row.adres,
      postcode: row.postcode,
      telefoon: row.telefoon,
      website: row.website,
      email: row.email,
      gps_coordinaten: row.gps_coordinaten,
      opgericht: row.opgericht,
      oppervlakte: row.oppervlakte,
      aantal_graven: row.aantal_graven,
      slug: slug
    };
  })
  .on('end', () => {
    fs.writeFileSync(
      'data/begraafplaatsen.json',
      JSON.stringify(begraafplaatsen, null, 2)
    );
    console.log(`Converted ${Object.keys(begraafplaatsen).length} cemeteries`);
  });

function createSlug(naam, gemeente) {
  return `${naam}-${gemeente}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

### Stap 3: Web Scraping Setup
```bash
# Installeer dependencies
npm install node-fetch p-limit csv-parser

# Set environment variables
export BRIGHT_DATA_USERNAME="your_username"
export BRIGHT_DATA_PASSWORD="your_password"

# Run scraping
node scripts/scrape-begraafplaats-template.ts
```

## Fase 2: AI Content Generatie

### Stap 1: OpenAI Setup
```bash
# Set OpenAI API key
export OPENAI_API_KEY="your-openai-api-key"

# Install Python dependencies
pip install openai python-dotenv
```

### Stap 2: Content Generatie
```bash
# Run enrichment script
python3 scripts/enrich-begraafplaats-template.py

# Monitor progress
watch -n 5 'cat data/begraafplaats-enrichment-progress.json | grep total_processed'
```

### Stap 3: Verificatie
```bash
# Check enriched files
ls -la data/enrichments-begraafplaatsen/*.json | wc -l

# Verify content quality (sample check)
cat data/enrichments-begraafplaatsen/sample-slug.json | jq '.enrichment.metadata.word_count'
```

## Fase 3: Next.js Implementatie

### Component Structuur
```typescript
// app/begraafplaats/[slug]/page.tsx
import { getBegraafplaatsData, getEnrichment } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function BegraafplaatsPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const begraafplaats = await getBegraafplaatsData(params.slug);
  if (!begraafplaats) notFound();
  
  const enrichment = await getEnrichment(params.slug);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: begraafplaats.provincie, href: `/provincie/${begraafplaats.provincie}` },
        { label: begraafplaats.gemeente, href: `/gemeente/${begraafplaats.gemeente}` },
        { label: begraafplaats.naam }
      ]} />
      
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {begraafplaats.naam}
        </h1>
        <div className="text-gray-600 mb-6">
          <p>{begraafplaats.adres}, {begraafplaats.postcode} {begraafplaats.gemeente}</p>
        </div>
        
        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard icon="clock" title="Openingstijden" value="Dagelijks van zonsopgang tot zonsondergang" />
          <InfoCard icon="phone" title="Telefoon" value={begraafplaats.telefoon} />
          <InfoCard icon="parking" title="Parkeren" value="Gratis parkeren beschikbaar" />
        </div>
      </div>
      
      {/* AdSense Leaderboard */}
      <LeaderboardAd />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Introductie */}
          <ContentSection title="Over deze begraafplaats">
            <p className="text-gray-700 leading-relaxed">
              {enrichment?.introductie || generateFallbackIntro(begraafplaats)}
            </p>
          </ContentSection>
          
          {/* AdSense Inline 1 */}
          <InlineAd />
          
          {/* Geschiedenis */}
          <ContentSection title="Geschiedenis">
            <p className="text-gray-700 leading-relaxed">
              {enrichment?.geschiedenis || generateFallbackHistory(begraafplaats)}
            </p>
          </ContentSection>
          
          {/* Diensten */}
          <ContentSection title="Diensten & Faciliteiten">
            <p className="text-gray-700 leading-relaxed">
              {enrichment?.diensten || generateFallbackServices(begraafplaats)}
            </p>
          </ContentSection>
          
          {/* AdSense Inline 2 */}
          <InlineAd />
          
          {/* Praktische Info */}
          <ContentSection title="Praktische Informatie">
            <p className="text-gray-700 leading-relaxed">
              {enrichment?.praktisch || generateFallbackPractical(begraafplaats)}
            </p>
          </ContentSection>
          
          {/* Route & Contact */}
          <ContactSection begraafplaats={begraafplaats} />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* AdSense Sidebar */}
          <div className="sticky top-4">
            <SidebarAd />
            
            {/* Quick Links */}
            <QuickLinks gemeente={begraafplaats.gemeente} provincie={begraafplaats.provincie} />
            
            {/* Related */}
            <RelatedBegraafplaatsen current={begraafplaats.slug} gemeente={begraafplaats.gemeente} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params
export async function generateStaticParams() {
  const begraafplaatsen = await getAllBegraafplaatsen();
  return begraafplaatsen.map((b) => ({
    slug: b.slug
  }));
}
```

## Fase 4: Quality Checklist voor AdSense Goedkeuring

### ✅ Content Kwaliteit
- [ ] Minimaal 400 woorden unieke content per begraafplaats
- [ ] Professionele, respectvolle toon
- [ ] Praktische, bruikbare informatie
- [ ] Geen duplicatie tussen pagina's

### ✅ Technische Vereisten
- [ ] Mobile-responsive design
- [ ] Snelle laadtijden (<3s)
- [ ] SSL certificaat actief
- [ ] XML sitemap gegenereerd
- [ ] Robots.txt correct geconfigureerd

### ✅ Trust & Autoriteit
- [ ] Over Ons pagina met persoonlijk verhaal
- [ ] Contact pagina met echte gegevens
- [ ] Privacy Policy
- [ ] Algemene Voorwaarden
- [ ] Cookie Policy

### ✅ Gebruikerservaring
- [ ] Intuïtieve navigatie
- [ ] Werkende zoekfunctie
- [ ] Breadcrumbs op alle pagina's
- [ ] Geen broken links
- [ ] Correcte 404 pagina

### ✅ AdSense Compliance
- [ ] Maximaal 3 ads per pagina
- [ ] Ads duidelijk gelabeld
- [ ] Voldoende content tussen ads
- [ ] Geen misleidende plaatsing
- [ ] Content boven de fold

## Fase 5: Monitoring & Optimalisatie

### Performance Metrics
```javascript
// Implementeer tracking
const trackMetrics = {
  pageviews: 'Google Analytics',
  userEngagement: 'Time on page > 30s',
  bounceRate: 'Target < 60%',
  searchUsage: 'Track search queries',
  conversionRate: 'Contact form submissions'
};
```

### Content Updates
```bash
# Daily enrichment batch
0 2 * * * cd /path/to/project && python3 scripts/enrich-begraafplaats-template.py

# Weekly stats update
0 3 * * 0 cd /path/to/project && npm run build-data && npm run build
```

## Verwachte Timeline

1. **Week 1**: Data verzameling en structurering
2. **Week 2-3**: Web scraping (afhankelijk van aantal begraafplaatsen)
3. **Week 3-4**: AI content generatie (500-600 per dag)
4. **Week 5-6**: Next.js implementatie en testing
5. **Week 7**: Launch en AdSense aanvraag
6. **Week 8+**: Monitoring en iteratieve verbeteringen

## Kosten Schatting

- **OpenAI API**: ~€0.002 per begraafplaats (GPT-4o-mini)
- **Bright Data**: ~€50-100 voor complete scraping
- **Hosting**: Vercel free tier waarschijnlijk voldoende
- **Totaal**: €100-200 voor 5000+ begraafplaatsen

## Conclusie

Door deze twee-fase pipeline te implementeren, transformeer je begraafplaatsindebuurt.nl van een "content van weinig waarde" site naar een waardevolle, informatieve directory die voldoet aan alle AdSense vereisten. De sleutel is het combineren van gestructureerde data met AI-gegenereerde, unieke content die echte waarde biedt aan bezoekers.