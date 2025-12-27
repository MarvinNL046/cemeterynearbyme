import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCounties, getCemeteriesByCounty, createCountySlug, createCitySlug, createStateSlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { MapPin, Building2, Trees, Users, Calendar, ChevronRight, ArrowRight, Lightbulb } from 'lucide-react';
import CemeteryCard from '@/components/CemeteryCard';
import SidebarAd from '@/components/ads/SidebarAd';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: Promise<{
    county: string;
  }>;
}

// Limit static generation to top 200 counties to stay under Vercel's 75MB limit
export async function generateStaticParams() {
  const counties = await getAllCounties();
  return counties.slice(0, 200).map(county => ({
    county: createCountySlug(county),
  }));
}

// Allow dynamic params for counties not in static params
export const dynamicParams = true;

// Revalidate pages every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: countySlug } = await params;
  const counties = await getAllCounties();
  const matchedCounty = counties.find(
    c => createCountySlug(c) === countySlug
  );

  if (!matchedCounty) {
    return {
      title: 'County not found',
      description: 'The requested county could not be found.',
    };
  }

  return {
    title: `Cemeteries in ${matchedCounty} County | Cemetery Near Me`,
    description: `Find all cemeteries in ${matchedCounty} County. View visiting hours, locations, facilities, and directions.`,
    openGraph: {
      title: `Cemeteries in ${matchedCounty} County`,
      description: `Directory of all cemeteries in ${matchedCounty} County`,
      type: 'website',
    },
  };
}

export default async function CountyPage({ params }: PageProps) {
  const { county: countySlug } = await params;
  const counties = await getAllCounties();
  const matchedCounty = counties.find(
    c => createCountySlug(c) === countySlug
  );

  if (!matchedCounty) {
    notFound();
  }

  const cemeteries = await getCemeteriesByCounty(matchedCounty);

  if (cemeteries.length === 0) {
    notFound();
  }

  const state = cemeteries[0]?.state || '';
  const stateAbbr = cemeteries[0]?.state_abbr || '';

  // Get unique cities
  const cities = [...new Set(cemeteries.map(c => c.city).filter(Boolean))].sort();

  // Calculate statistics
  const stats = {
    total: cemeteries.length,
    public: cemeteries.filter(c => c.type?.toLowerCase().includes('public') || c.type?.toLowerCase().includes('cemetery')).length,
    memorial: cemeteries.filter(c => c.type?.toLowerCase().includes('memorial')).length,
    veterans: cemeteries.filter(c => c.type?.toLowerCase().includes('veteran') || c.type?.toLowerCase().includes('national')).length,
    religious: cemeteries.filter(c => c.type?.toLowerCase().includes('church') || c.type?.toLowerCase().includes('religious') || c.type?.toLowerCase().includes('catholic') || c.type?.toLowerCase().includes('jewish')).length,
    natural: cemeteries.filter(c => c.type?.toLowerCase().includes('natural') || c.type?.toLowerCase().includes('green')).length,
  };

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
        name: state,
        item: `https://www.cemeterynearbyme.com/state/${createStateSlug(state)}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${matchedCounty} County`,
        item: `https://www.cemeterynearbyme.com/county/${countySlug}`
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
                    href={`/state/${createStateSlug(state)}`}
                    className="hover:text-white transition-colors"
                  >
                    {state}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white">{matchedCounty} County</li>
              </ol>
            </nav>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              Cemeteries in {matchedCounty} County
            </h1>

            {/* Author byline */}
            <div className="flex items-center gap-4 text-sm text-primary-foreground/70 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs font-semibold">CM</span>
                </div>
                <span>By Cemetery Near Me</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-gold-300">{stats.total}</div>
                <div className="text-primary-foreground/70 text-sm">Cemeteries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{cities.length}</div>
                <div className="text-primary-foreground/70 text-sm">Cities</div>
              </div>
              {stats.veterans > 0 && (
                <div>
                  <div className="text-3xl font-bold text-gold-300">{stats.veterans}</div>
                  <div className="text-primary-foreground/70 text-sm">Veterans</div>
                </div>
              )}
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
                  Tips for Finding a Cemetery
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Visit multiple cemeteries to compare atmosphere and surroundings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Check visiting hours - most cemeteries are open during daylight hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Ask about green burial options if environmental sustainability is important</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Inquire with the office about plot costs and maintenance fees</span>
                  </li>
                </ul>
              </Card>

              {/* Cemetery Type Cards */}
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-6">Types of Cemeteries</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-5 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-3">
                      <Building2 className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Public Cemetery</h3>
                    <p className="text-sm text-muted-foreground">
                      Open to all residents regardless of religious affiliation. Often municipally managed with various burial options.
                    </p>
                  </Card>
                  <Card className="p-5 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-3">
                      <Trees className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Green Cemetery</h3>
                    <p className="text-sm text-muted-foreground">
                      Eco-friendly burial in natural surroundings. Biodegradable materials and minimal headstones.
                    </p>
                  </Card>
                  <Card className="p-5 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Memorial Park</h3>
                    <p className="text-sm text-muted-foreground">
                      Modern cemetery with flat markers. Landscaped grounds with designated sections and memorials.
                    </p>
                  </Card>
                </div>
              </div>

              {/* All Cemeteries */}
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  All {cemeteries.length} {cemeteries.length !== 1 ? 'Cemeteries' : 'Cemetery'}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {cemeteries.map((cemetery) => (
                    <CemeteryCard key={cemetery.slug} cemetery={cemetery} />
                  ))}
                </div>
              </div>

              {/* Cities Grid */}
              {cities.length > 1 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Cemeteries by City</h2>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                    {cities.map((city) => {
                      const cityCemeteries = cemeteries.filter(c => c.city === city);
                      return (
                        <Link
                          key={city}
                          href={`/city/${createCitySlug(city)}`}
                          className="group"
                        >
                          <Card className="h-full p-4 border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
                                <MapPin className="w-5 h-5 text-forest-700 group-hover:text-white transition-colors" />
                              </div>
                              <div>
                                <h3 className="font-semibold group-hover:text-accent transition-colors">
                                  {city}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {cityCemeteries.length} {cityCemeteries.length !== 1 ? 'cemeteries' : 'cemetery'}
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
                <h2 className="font-serif text-2xl font-semibold mb-4">Choosing a Cemetery in {matchedCounty} County</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    In {matchedCounty} County, {state} you&apos;ll find {stats.total} {stats.total !== 1 ? 'cemeteries' : 'cemetery'},
                    ranging from {stats.public > 0 ? 'public municipal cemeteries' : ''}
                    {stats.memorial > 0 ? ' to memorial parks' : ''}.
                    Each cemetery has its own character and options.
                  </p>

                  <h3 className="font-serif text-xl font-semibold text-foreground mt-6 mb-3">Practical Information</h3>
                  <p>
                    When choosing a cemetery, several factors are important:
                    location and accessibility, atmosphere and appearance, available burial options,
                    and of course the costs for plots and maintenance. Many cemeteries in {matchedCounty} County offer
                    options for both traditional burial and cremation urn interment.
                  </p>

                  <h3 className="font-serif text-xl font-semibold text-foreground mt-6 mb-3">Visitor Guidelines</h3>
                  <p>
                    When visiting a cemetery, it&apos;s important to respect the peace and serenity of the space.
                    Keep dogs on leash, and be considerate of other visitors
                    paying their respects. Most cemeteries are open daily during daylight hours.
                  </p>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Links */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">Related Pages</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={`/state/${createStateSlug(state)}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      All cemeteries in {state}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/type/natural-burial"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Natural Burial Grounds
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/type/memorial-park"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Memorial Parks
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Search for a Cemetery
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/funeral-planning"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Funeral Planning Guide
                    </Link>
                  </li>
                </ul>
              </Card>

              {/* Contact Info */}
              <Card className="p-6 shadow-soft bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-200 dark:border-forest-800">
                <h3 className="font-serif text-lg font-semibold mb-3">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We&apos;re happy to help you find the right cemetery in {matchedCounty} County.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Sidebar Ad */}
              <SidebarAd />

              {/* State Stats */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">About {state}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {matchedCounty} County is located in {state}. View all cemeteries
                  in this state for more options.
                </p>
                <Link
                  href={`/state/${createStateSlug(state)}`}
                  className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1"
                >
                  View {state}
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
