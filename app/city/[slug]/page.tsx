import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCities, getCemeteriesByCity, createCitySlug, createCountySlug, createStateSlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Building, Info } from 'lucide-react';
import CemeteryCard from '@/components/CemeteryCard';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import SidebarAd from '@/components/ads/SidebarAd';
import InlineAd from '@/components/ads/InlineAd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Limit static generation to top 200 cities to stay under Vercel's 75MB limit
export async function generateStaticParams() {
  const cities = await getAllCities();
  // Take first 200 cities (sorted by cemetery count would be better but this is simpler)
  return cities.slice(0, 200).map((city) => ({
    slug: createCitySlug(city),
  }));
}

// Allow dynamic params for cities not in static params
export const dynamicParams = true;

// Revalidate pages every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cities = await getAllCities();
  const city = cities.find(c => createCitySlug(c) === slug);

  if (!city) {
    return {
      title: 'City not found',
    };
  }

  const cemeteries = await getCemeteriesByCity(city);
  const county = cemeteries[0]?.county || '';
  const state = cemeteries[0]?.state || '';

  return {
    title: `Cemeteries in ${city} | Cemetery Near Me`,
    description: `Find all ${cemeteries.length} cemeteries in ${city}, ${county ? `${county} County, ` : ''}${state}. View locations, hours, and directions for local cemeteries.`,
    openGraph: {
      title: `Cemeteries in ${city}`,
      description: `All cemeteries in ${city}${county ? `, ${county} County` : ''}`,
      type: 'website',
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const cities = await getAllCities();
  const city = cities.find(c => createCitySlug(c) === slug);

  if (!city) {
    notFound();
  }

  const cemeteries = await getCemeteriesByCity(city);

  if (cemeteries.length === 0) {
    notFound();
  }

  const county = cemeteries[0]?.county || '';
  const state = cemeteries[0]?.state || '';
  const stateAbbr = cemeteries[0]?.state_abbr || '';

  // Count cemetery types
  const typeCount = cemeteries.reduce((acc, cemetery) => {
    const typeName = cemetery.type || 'Cemetery';
    acc[typeName] = (acc[typeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Cemeteries in ${city}`,
    description: `Directory of all cemeteries in ${city}${county ? `, ${county} County` : ''}`,
    breadcrumb: {
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
        ...(county ? [{
          '@type': 'ListItem',
          position: 3,
          name: `${county} County`,
          item: `https://www.cemeterynearbyme.com/county/${createCountySlug(county)}`
        }] : []),
        {
          '@type': 'ListItem',
          position: county ? 4 : 3,
          name: city,
          item: `https://www.cemeterynearbyme.com/city/${slug}`
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: cemeteries.length,
      itemListElement: cemeteries.map((cemetery, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.cemeterynearbyme.com/cemetery/${cemetery.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Leaderboard Ad at top */}
      <LeaderboardAd />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li>
              <Link
                href={`/state/${createStateSlug(state)}`}
                className="hover:text-foreground"
              >
                {state}
              </Link>
            </li>
            {county && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/county/${createCountySlug(county)}`}
                    className="hover:text-foreground"
                  >
                    {county} County
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-foreground">{city}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Cemeteries in {city}
          </h1>
          <p className="text-lg text-muted-foreground">
            There {cemeteries.length === 1 ? 'is' : 'are'} {cemeteries.length} {cemeteries.length === 1 ? 'cemetery' : 'cemeteries'} in {city}{county ? `, ${county} County` : ''}, {state}.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{cemeteries.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          {Object.entries(typeCount).slice(0, 3).map(([type, count]) => (
            <div key={type} className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Inline Ad */}
        <InlineAd />

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {/* Cemetery List */}
            <div className="space-y-6">
              {cemeteries.map((cemetery, index) => (
                <div key={cemetery.slug}>
                  <CemeteryCard cemetery={cemetery} />
                  {/* Add inline ad after every 3rd cemetery */}
                  {(index + 1) % 3 === 0 && index !== cemeteries.length - 1 && (
                    <div className="mt-6">
                      <InlineAd />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <SidebarAd sticky={false} />

              {/* Related Links */}
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Related Pages</h3>
                <ul className="space-y-2">
                  {county && (
                    <li>
                      <Link
                        href={`/county/${createCountySlug(county)}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        All cemeteries in {county} County
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href={`/state/${createStateSlug(state)}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      All cemeteries in {state}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Info Box */}
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">About {city}</h3>
                <p className="text-sm text-muted-foreground">
                  {city} is located in {county ? `${county} County, ` : ''}{state}.
                  This page provides an overview of all cemeteries in this area.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2>Cemeteries and Memorial Parks in {city}</h2>
          <p>
            In {city} you&apos;ll find various types of cemeteries, from historic churchyards to
            modern memorial parks. Each cemetery has its own character and history.
          </p>

          {typeCount['Public Cemetery'] > 0 && (
            <>
              <h3>Public Cemeteries</h3>
              <p>
                {city} has {typeCount['Public Cemetery']} public {typeCount['Public Cemetery'] > 1 ? 'cemeteries' : 'cemetery'}.
                These are open to everyone, regardless of religious affiliation.
              </p>
            </>
          )}

          {typeCount['National Cemetery'] > 0 && (
            <>
              <h3>National Cemeteries</h3>
              <p>
                There {typeCount['National Cemetery'] > 1 ? 'are' : 'is'} {typeCount['National Cemetery']} national
                {typeCount['National Cemetery'] > 1 ? ' cemeteries' : ' cemetery'} in {city}, honoring those who served our country.
              </p>
            </>
          )}

          <h3>Visiting Information</h3>
          <p>
            For more information about a specific cemetery in {city}, click on the cemetery
            above. There you will find contact details, visiting hours, and directions.
          </p>
        </div>
      </div>
    </>
  );
}
