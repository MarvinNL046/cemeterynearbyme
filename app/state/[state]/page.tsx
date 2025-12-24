import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProvinces, getCemeteriesByProvince, createMunicipalitySlug, getProvincieData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChevronRight, Building2, ArrowRight, Trees } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: {
    provincienaam: string;
  };
}

export async function generateStaticParams() {
  const provinces = await getAllProvinces();

  // Generate params for all provinces
  const provincesWithData = provinces
    .filter(province => province !== 'Onbekend') // Skip unknown province
    .map(province => ({
      provincienaam: province.toLowerCase().replace(/\s+/g, '-'),
    }));

  console.log('Generating province routes:', provincesWithData);

  return provincesWithData;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const provinces = await getAllProvinces();

  // Find the actual province name
  const matchedProvince = provinces.find(
    p => p.toLowerCase().replace(/\s+/g, '-') === params.provincienaam
  );

  const properName = matchedProvince || params.provincienaam;

  return {
    title: `Begraafplaatsen in ${properName} | Begraafplaats in de Buurt`,
    description: `Vind alle begraafplaatsen in de provincie ${properName}. Bekijk openingstijden, locaties en faciliteiten van begraafplaatsen bij u in de buurt.`,
    openGraph: {
      title: `Begraafplaatsen in ${properName}`,
      description: `Overzicht van alle begraafplaatsen in ${properName}`,
      type: 'website',
    },
  };
}

export default async function ProvincePage({ params }: PageProps) {
  // Try to get province data from new structure first
  const provincieData = await getProvincieData(params.provincienaam);

  if (provincieData) {
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
          name: provincieData.naam,
          item: `https://www.begraafplaatsindebuurt.nl/provincie/${params.provincienaam}`
        }
      ]
    };

    // New structure with verified data
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
                  <li><Link href="/provincie" className="hover:text-white transition-colors">Provincies</Link></li>
                  <li>/</li>
                  <li className="text-white">{provincieData.naam}</li>
                </ol>
              </nav>

              <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
                Begraafplaatsen in {provincieData.naam}
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mb-8">
                {provincieData.beschrijving}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-gold-300">{provincieData.statistieken.totaal_begraafplaatsen}</div>
                  <div className="text-primary-foreground/70 text-sm">Begraafplaatsen</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold-300">{provincieData.statistieken.totaal_gemeenten}</div>
                  <div className="text-primary-foreground/70 text-sm">Gemeenten</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold-300">{provincieData.statistieken.totaal_plaatsen}</div>
                  <div className="text-primary-foreground/70 text-sm">Plaatsen</div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-bold mb-2">Gemeenten in {provincieData.naam}</h2>
                <p className="text-muted-foreground">
                  Klik op een gemeente om alle begraafplaatsen in die gemeente te bekijken.
                </p>
              </div>

              {(() => {
                // Group municipalities by first letter
                const municipalitiesByLetter = Object.entries(provincieData.gemeenten as Record<string, number>)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .reduce((acc, [gemeente, count]) => {
                    const firstLetter = gemeente[0].toUpperCase();
                    if (!acc[firstLetter]) {
                      acc[firstLetter] = [];
                    }
                    acc[firstLetter].push({ gemeente, count });
                    return acc;
                  }, {} as Record<string, Array<{ gemeente: string; count: number }>>);

                return (
                  <div className="space-y-10">
                    {Object.entries(municipalitiesByLetter).map(([letter, municipalities]) => (
                      <div key={letter}>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-serif font-bold text-xl">
                            {letter}
                          </span>
                          <span className="text-sm text-muted-foreground">{municipalities.length} gemeente{municipalities.length !== 1 ? 'n' : ''}</span>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {municipalities.map(({ gemeente, count }) => (
                            <Link
                              key={gemeente}
                              href={`/gemeente/${createMunicipalitySlug(gemeente)}`}
                              className="group"
                            >
                              <Card className="h-full p-4 flex items-center justify-between border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center group-hover:bg-accent transition-colors">
                                    <Building2 className="w-5 h-5 text-forest-700 group-hover:text-white transition-colors" />
                                  </div>
                                  <span className="font-medium group-hover:text-accent transition-colors">
                                    {gemeente}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-accent">
                                    {count}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                                </div>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* About Section */}
              <Card className="mt-16 p-8 bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center shrink-0">
                    <Trees className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold mb-3">Over begraafplaatsen in {provincieData.naam}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      De provincie {provincieData.naam} kent een rijke geschiedenis wat betreft begraafplaatsen.
                      Van historische kerkhoven tot moderne natuurbegraafplaatsen, elk met hun eigen karakter
                      en voorzieningen. Veel begraafplaatsen bieden tegenwoordig faciliteiten zoals urnenmuren,
                      columbariums en speciale kindergraven.
                    </p>
                  </div>
                </div>
              </Card>

              {/* CTA Section */}
              <div className="mt-16 text-center">
                <h2 className="font-serif text-2xl font-semibold mb-4">
                  Op zoek naar een specifieke begraafplaats?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Gebruik onze zoekfunctie om begraafplaatsen te vinden op basis van naam, plaats of postcode.
                </p>
                <Link
                  href="/zoeken"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Zoek begraafplaatsen
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Fallback to old structure
  const provinces = await getAllProvinces();

  // Find the province by comparing slugified versions
  const matchedProvince = provinces.find(
    p => p.toLowerCase().replace(/\s+/g, '-') === params.provincienaam
  );

  if (!matchedProvince) {
    notFound();
  }

  const cemeteries = await getCemeteriesByProvince(matchedProvince);
  const municipalities = [...new Set(cemeteries.map(c => c.gemeente))].sort();

  // Breadcrumb structured data for SEO (fallback path)
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
        name: matchedProvince,
        item: `https://www.begraafplaatsindebuurt.nl/provincie/${params.provincienaam}`
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
                <li><Link href="/provincie" className="hover:text-white transition-colors">Provincies</Link></li>
                <li>/</li>
                <li className="text-white">{matchedProvince}</li>
              </ol>
            </nav>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              Begraafplaatsen in {matchedProvince}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mb-8">
              Ontdek alle begraafplaatsen in de provincie {matchedProvince}. Selecteer een gemeente om de begraafplaatsen te bekijken.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-gold-300">{cemeteries.length}</div>
                <div className="text-primary-foreground/70 text-sm">Begraafplaatsen</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{municipalities.length}</div>
                <div className="text-primary-foreground/70 text-sm">Gemeenten</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{[...new Set(cemeteries.map(c => c.plaats).filter(Boolean))].length}</div>
                <div className="text-primary-foreground/70 text-sm">Plaatsen</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-2">Gemeenten in {matchedProvince}</h2>
              <p className="text-muted-foreground">
                Klik op een gemeente om alle begraafplaatsen in die gemeente te bekijken.
              </p>
            </div>

            {(() => {
              // Group municipalities by first letter with cemetery counts
              const municipalitiesByLetter = municipalities.reduce((acc, municipality) => {
                const municipalityCemeteries = cemeteries.filter(c => c.gemeente === municipality);
                const firstLetter = municipality[0].toUpperCase();
                if (!acc[firstLetter]) {
                  acc[firstLetter] = [];
                }
                acc[firstLetter].push({
                  gemeente: municipality,
                  count: municipalityCemeteries.length
                });
                return acc;
              }, {} as Record<string, Array<{ gemeente: string; count: number }>>);

              return (
                <div className="space-y-10">
                  {Object.entries(municipalitiesByLetter).map(([letter, municipalities]) => (
                    <div key={letter}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-serif font-bold text-xl">
                          {letter}
                        </span>
                        <span className="text-sm text-muted-foreground">{municipalities.length} gemeente{municipalities.length !== 1 ? 'n' : ''}</span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {municipalities.map(({ gemeente, count }) => (
                          <Link
                            key={gemeente}
                            href={`/gemeente/${createMunicipalitySlug(gemeente)}`}
                            className="group"
                          >
                            <Card className="h-full p-4 flex items-center justify-between border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center group-hover:bg-accent transition-colors">
                                  <Building2 className="w-5 h-5 text-forest-700 group-hover:text-white transition-colors" />
                                </div>
                                <span className="font-medium group-hover:text-accent transition-colors">
                                  {gemeente}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-accent">
                                  {count}
                                </span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* About Section */}
            <Card className="mt-16 p-8 bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center shrink-0">
                  <Trees className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-3">Over begraafplaatsen in {matchedProvince}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    De provincie {matchedProvince} kent een rijke geschiedenis wat betreft begraafplaatsen.
                    Van historische kerkhoven tot moderne natuurbegraafplaatsen, elk met hun eigen karakter
                    en voorzieningen. Veel begraafplaatsen bieden tegenwoordig faciliteiten zoals urnenmuren,
                    columbariums en speciale kindergraven.
                  </p>
                </div>
              </div>
            </Card>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                Op zoek naar een specifieke begraafplaats?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Gebruik onze zoekfunctie om begraafplaatsen te vinden op basis van naam, plaats of postcode.
              </p>
              <Link
                href="/zoeken"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Zoek begraafplaatsen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
