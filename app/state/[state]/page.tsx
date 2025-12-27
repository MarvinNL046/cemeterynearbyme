import { Metadata } from 'next';
import Link from 'next/link';
import { getAllStates, getStateBySlug, getCemeteriesByState, createCountySlug, createCitySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChevronRight, Building2, ArrowRight, Trees, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: Promise<{
    state: string;
  }>;
}

export async function generateStaticParams() {
  const states = await getAllStates();
  return states.map(state => ({
    state: state.slug,
  }));
}

// Revalidate pages every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);

  if (!state) {
    return { title: 'State Not Found' };
  }

  return {
    title: `Cemeteries in ${state.name} | Cemetery Near Me`,
    description: `Find all cemeteries in ${state.name}. View hours, locations, and facilities of cemeteries near you.`,
    openGraph: {
      title: `Cemeteries in ${state.name}`,
      description: `Directory of all cemeteries in ${state.name}`,
      type: 'website',
    },
  };
}

export default async function StatePage({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);

  if (!state) {
    notFound();
  }

  const cemeteries = await getCemeteriesByState(state.name);

  // Get unique counties with counts
  const countyCounts = cemeteries.reduce((acc, c) => {
    if (c.county) {
      acc[c.county] = (acc[c.county] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const counties = Object.entries(countyCounts)
    .map(([county, count]) => ({ county, count }))
    .sort((a, b) => a.county.localeCompare(b.county));

  // Get unique cities with counts
  const cityCounts = cemeteries.reduce((acc, c) => {
    if (c.city) {
      acc[c.city] = (acc[c.city] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const cities = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => a.city.localeCompare(b.city));

  const stateAbbr = cemeteries[0]?.state_abbr || '';

  // Breadcrumb structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.cemeterynearbyme.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: state.name,
        item: `https://www.cemeterynearbyme.com/state/${stateSlug}`
      }
    ]
  };

  // Group counties by first letter
  const countiesByLetter = counties.reduce((acc, { county, count }) => {
    const firstLetter = county[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({ county, count });
    return acc;
  }, {} as Record<string, Array<{ county: string; count: number }>>);

  // Group cities by first letter (fallback when no county data)
  const citiesByLetter = cities.reduce((acc, { city, count }) => {
    const firstLetter = city[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({ city, count });
    return acc;
  }, {} as Record<string, Array<{ city: string; count: number }>>);

  // Determine if we should show cities instead of counties
  const showCities = counties.length === 0 && cities.length > 0;

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
                <li><Link href="/state" className="hover:text-white transition-colors">States</Link></li>
                <li>/</li>
                <li className="text-white">{state.name}</li>
              </ol>
            </nav>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              Cemeteries in {state.name}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mb-8">
              Discover all cemeteries in {state.name}. Select a county to view the cemeteries in that area.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-gold-300">{cemeteries.length}</div>
                <div className="text-primary-foreground/70 text-sm">Cemeteries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{counties.length}</div>
                <div className="text-primary-foreground/70 text-sm">Counties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{cities.length}</div>
                <div className="text-primary-foreground/70 text-sm">Cities</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-2">
                {showCities ? `Cities in ${state.name}` : `Counties in ${state.name}`}
              </h2>
              <p className="text-muted-foreground">
                {showCities
                  ? 'Click on a city to view all cemeteries in that area.'
                  : 'Click on a county to view all cemeteries in that area.'}
              </p>
            </div>

            {counties.length > 0 ? (
              <div className="space-y-10">
                {Object.entries(countiesByLetter).map(([letter, countiesInLetter]) => (
                  <div key={letter}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-serif font-bold text-xl">
                        {letter}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {countiesInLetter.length} count{countiesInLetter.length !== 1 ? 'ies' : 'y'}
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {countiesInLetter.map(({ county, count }) => (
                        <Link
                          key={county}
                          href={`/county/${createCountySlug(county)}`}
                          className="group"
                        >
                          <Card className="h-full p-4 flex items-center justify-between border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center group-hover:bg-accent transition-colors">
                                <Building2 className="w-5 h-5 text-forest-700 group-hover:text-white transition-colors" />
                              </div>
                              <span className="font-medium group-hover:text-accent transition-colors">
                                {county}
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
            ) : showCities ? (
              <div className="space-y-10">
                {Object.entries(citiesByLetter).map(([letter, citiesInLetter]) => (
                  <div key={letter}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-serif font-bold text-xl">
                        {letter}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {citiesInLetter.length} cit{citiesInLetter.length !== 1 ? 'ies' : 'y'}
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {citiesInLetter.map(({ city, count }) => (
                        <Link
                          key={city}
                          href={`/city/${createCitySlug(city)}`}
                          className="group"
                        >
                          <Card className="h-full p-4 flex items-center justify-between border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center group-hover:bg-accent transition-colors">
                                <MapPin className="w-5 h-5 text-forest-700 group-hover:text-white transition-colors" />
                              </div>
                              <span className="font-medium group-hover:text-accent transition-colors">
                                {city}
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
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No cemeteries found in {state.name} yet. We are continuously adding new locations.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Search All Cemeteries
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            )}

            {/* About Section */}
            <Card className="mt-16 p-8 bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center shrink-0">
                  <Trees className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-3">About cemeteries in {state.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The state of {state.name} has a rich history of cemeteries and memorial parks.
                    From historic churchyards to modern memorial parks, each with their own character
                    and amenities. Many cemeteries today offer facilities such as cremation gardens,
                    columbariums, and specialized sections. {state.capital && `The state capital is ${state.capital}.`}
                  </p>
                </div>
              </div>
            </Card>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                Looking for a specific cemetery?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Use our search feature to find cemeteries by name, city, or ZIP code.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Search Cemeteries
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
