import { Metadata } from 'next';
import Link from 'next/link';
import { getAllMunicipalities, getCemeteriesByMunicipality, createMunicipalitySlug, getPlacesByMunicipality, createPlaceSlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { MapPin, Building2, Trees, Users, Calendar, ChevronRight, ArrowRight, Lightbulb } from 'lucide-react';
import CemeteryCard from '@/components/CemeteryCard';
import SidebarAd from '@/components/ads/SidebarAd';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: {
    gemeentenaam: string;
  };
}

export async function generateStaticParams() {
  const municipalities = await getAllMunicipalities();

  // Only generate params for municipalities that have cemeteries
  const municipalitiesWithData = [];
  for (const municipality of municipalities) {
    if (!municipality) continue; // Skip null/undefined values
    const cemeteries = await getCemeteriesByMunicipality(municipality);
    if (cemeteries.length > 0) {
      municipalitiesWithData.push({
        gemeentenaam: createMunicipalitySlug(municipality),
      });
    }
  }

  return municipalitiesWithData;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const municipalities = await getAllMunicipalities();

  // Find the actual municipality name by comparing slugs
  const matchedMunicipality = municipalities.find(
    m => createMunicipalitySlug(m) === params.gemeentenaam
  );

  if (!matchedMunicipality) {
    return {
      title: 'Gemeente niet gevonden',
      description: 'De opgevraagde gemeente kon niet worden gevonden.',
    };
  }

  return {
    title: `Begraafplaatsen in ${matchedMunicipality} | Begraafplaats in de Buurt`,
    description: `Alle begraafplaatsen in ${matchedMunicipality}. Vind informatie over openingstijden, locaties, faciliteiten en routebeschrijvingen.`,
    openGraph: {
      title: `Begraafplaatsen in ${matchedMunicipality}`,
      description: `Overzicht van alle begraafplaatsen in de gemeente ${matchedMunicipality}`,
      type: 'website',
    },
  };
}

export default async function MunicipalityPage({ params }: PageProps) {
  const municipalities = await getAllMunicipalities();

  // Find the municipality by comparing slugs
  const matchedMunicipality = municipalities.find(
    m => createMunicipalitySlug(m) === params.gemeentenaam
  );

  if (!matchedMunicipality) {
    notFound();
  }

  const cemeteries = await getCemeteriesByMunicipality(matchedMunicipality);
  const province = cemeteries[0]?.provincie || '';
  const places = await getPlacesByMunicipality(matchedMunicipality);

  // Calculate statistics
  const stats = {
    total: cemeteries.length,
    algemeen: cemeteries.filter(c => c.type?.toLowerCase().includes('algemene')).length,
    natuur: cemeteries.filter(c => c.type?.toLowerCase().includes('natuur')).length,
    joods: cemeteries.filter(c => c.type?.toLowerCase().includes('jood')).length,
    islamitisch: cemeteries.filter(c => c.type?.toLowerCase().includes('islam')).length,
    bijzonder: cemeteries.filter(c => c.type?.toLowerCase().includes('bijzonder')).length,
  };

  // Breadcrumb structured data for SEO
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.begraafplaatsindebuurt.nl'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: province,
        item: `https://www.begraafplaatsindebuurt.nl/provincie/${province.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: matchedMunicipality,
        item: `https://www.begraafplaatsindebuurt.nl/gemeente/${params.gemeentenaam}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-primary-foreground/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li>
                  <Link
                    href={`/provincie/${province.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-white transition-colors"
                  >
                    {province}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white">{matchedMunicipality}</li>
              </ol>
            </nav>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              Begraafplaatsen in {matchedMunicipality}
            </h1>

            {/* Author byline */}
            <div className="flex items-center gap-4 text-sm text-primary-foreground/70 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs font-semibold">M</span>
                </div>
                <span>Door Marvin</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-gold-300">{stats.total}</div>
                <div className="text-primary-foreground/70 text-sm">Begraafplaatsen</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{stats.algemeen}</div>
                <div className="text-primary-foreground/70 text-sm">Algemene</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{stats.natuur}</div>
                <div className="text-primary-foreground/70 text-sm">Natuur</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{stats.joods + stats.islamitisch + stats.bijzonder}</div>
                <div className="text-primary-foreground/70 text-sm">Bijzondere</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tips Section */}
              <Card className="p-6 bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Tips voor het vinden van een begraafplaats
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Bezoek meerdere begraafplaatsen om sfeer en omgeving te vergelijken</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Let op openingstijden - de meeste begraafplaatsen zijn overdag geopend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Vraag naar mogelijkheden voor natuurbegraven als duurzaamheid belangrijk is</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Informeer bij de beheerder over grafrechten en onderhoudskosten</span>
                  </li>
                </ul>
              </Card>

              {/* Cemetery Type Cards */}
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-6">Soorten begraafplaatsen</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-5 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-3">
                      <Building2 className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Algemene begraafplaats</h3>
                    <p className="text-sm text-muted-foreground">
                      Openbaar toegankelijk voor alle gezindten. Vaak gemeentelijk beheerd met diverse grafvormen.
                    </p>
                  </Card>
                  <Card className="p-5 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-3">
                      <Trees className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Natuurbegraafplaats</h3>
                    <p className="text-sm text-muted-foreground">
                      Ecologisch begraven in natuurlijke omgeving. Afbreekbare materialen en minimale grafsteen.
                    </p>
                  </Card>
                  <Card className="p-5 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Bijzondere begraafplaats</h3>
                    <p className="text-sm text-muted-foreground">
                      Religieuze of historische begraafplaatsen met specifieke tradities en rituelen.
                    </p>
                  </Card>
                </div>
              </div>

              {/* All Cemeteries */}
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Alle {cemeteries.length} begraafplaats{cemeteries.length !== 1 ? 'en' : ''}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {cemeteries.map((cemetery) => (
                    <CemeteryCard key={cemetery.slug} cemetery={cemetery} />
                  ))}
                </div>
              </div>

              {/* Places Grid */}
              {places.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Begraafplaatsen per plaats</h2>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                    {places.map((place) => {
                      const placeCemeteries = cemeteries.filter(c => c.plaats === place);
                      return (
                        <Link
                          key={place}
                          href={`/plaats/${createPlaceSlug(place)}`}
                          className="group"
                        >
                          <Card className="h-full p-4 border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
                                <MapPin className="w-5 h-5 text-forest-700 group-hover:text-white transition-colors" />
                              </div>
                              <div>
                                <h3 className="font-semibold group-hover:text-accent transition-colors">
                                  {place}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {placeCemeteries.length} begraafplaats{placeCemeteries.length !== 1 ? 'en' : ''}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Informational Content */}
              <Card className="p-6">
                <h2 className="font-serif text-2xl font-semibold mb-4">Begraafplaatsen kiezen in {matchedMunicipality}</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    In de gemeente {matchedMunicipality} vindt u {stats.total} begraafplaats{stats.total !== 1 ? 'en' : ''},
                    variërend van {stats.algemeen > 0 ? 'algemene gemeentelijke begraafplaatsen' : ''}
                    {stats.natuur > 0 ? ' tot natuurbegraafplaatsen' : ''}.
                    Elke begraafplaats heeft zijn eigen karakter en mogelijkheden.
                  </p>

                  <h3 className="font-serif text-xl font-semibold text-foreground mt-6 mb-3">Praktische informatie</h3>
                  <p>
                    Bij het kiezen van een begraafplaats zijn verschillende factoren belangrijk:
                    de locatie en bereikbaarheid, de sfeer en uitstraling, de beschikbare grafvormen,
                    en uiteraard de kosten voor grafrechten en onderhoud. Veel begraafplaatsen in {matchedMunicipality} bieden
                    mogelijkheden voor zowel begraven als crematie-urnen bijzettingen.
                  </p>

                  <h3 className="font-serif text-xl font-semibold text-foreground mt-6 mb-3">Bezoekersregels</h3>
                  <p>
                    Bij het bezoeken van een begraafplaats is het belangrijk om rekening te houden met
                    de rust en sereniteit van de plek. Houd honden aangelijnd, parkeer fietsen bij de ingang,
                    en respecteer andere bezoekers die een graf bezoeken. De meeste begraafplaatsen zijn
                    dagelijks geopend tijdens daglichturen.
                  </p>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Links */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">Gerelateerde pagina&apos;s</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={`/provincie/${province.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Alle begraafplaatsen in {province}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/type/natuurbegraafplaats"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Natuurbegraafplaatsen
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/type/algemene-begraafplaats"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Algemene begraafplaatsen
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/zoeken"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Zoek een begraafplaats
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/uitvaartverzekering"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Uitvaartverzekering vergelijken
                    </Link>
                  </li>
                </ul>
              </Card>

              {/* Contact Info */}
              <Card className="p-6 shadow-soft bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-200 dark:border-forest-800">
                <h3 className="font-serif text-lg font-semibold mb-3">Hulp nodig?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wij helpen u graag bij het vinden van de juiste begraafplaats in {matchedMunicipality}.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                >
                  Neem contact op
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Province Stats */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">Over {province}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {matchedMunicipality} ligt in de provincie {province}. Bekijk alle begraafplaatsen
                  in deze regio voor meer opties.
                </p>
                <Link
                  href={`/provincie/${province.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1"
                >
                  Bekijk {province}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
