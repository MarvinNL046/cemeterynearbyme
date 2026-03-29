import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCemeteries, getAllStates } from '@/lib/data';
import HomePageClient from '@/components/HomePageClient';

export const revalidate = 604800;

export const metadata: Metadata = {
  title: 'Find a Cemetery Near You - CemeteryNearByMe.com',
  description: 'Discover thousands of cemeteries across all 50 US states. Find locations, directions, and historical information for cemeteries near you.',
  openGraph: {
    title: 'Find a Cemetery Near You - CemeteryNearByMe.com',
    description: 'Discover thousands of cemeteries across all 50 US states.',
    type: 'website',
  },
};

export default async function Home() {
  const allData = await getAllCemeteries();
  const states = await getAllStates();

  const totalCemeteries = allData.length;

  // Group cities by state for SEO links
  const citiesByState: Record<string, { name: string; slug: string; count: number }[]> = {};
  const cityCounts: Record<string, { count: number; state: string }> = {};

  allData.forEach(item => {
    const city = item.city;
    const state = item.state;
    if (!city || !state) return;
    const key = `${city}|${state}`;
    if (!cityCounts[key]) cityCounts[key] = { count: 0, state };
    cityCounts[key].count++;
  });

  Object.entries(cityCounts).forEach(([key, data]) => {
    const [city] = key.split('|');
    const stateKey = data.state;
    if (!citiesByState[stateKey]) citiesByState[stateKey] = [];
    const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    citiesByState[stateKey].push({ name: city, slug, count: data.count });
  });

  // Sort states
  const sortedStates = states
    .filter(s => citiesByState[s.name])
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <HomePageClient />

      {/* Server-rendered SEO links */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Cemeteries in All {sortedStates.length} States
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse {totalCemeteries.toLocaleString()} cemeteries across the United States
            </p>
          </div>

          <div className="space-y-10 max-w-6xl mx-auto">
            {sortedStates.map(state => {
              const cities = citiesByState[state.name];
              if (!cities) return null;
              return (
                <div key={state.name}>
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">
                    <Link href={`/state/${state.slug}`} className="hover:text-primary transition-colors">
                      {state.name}
                    </Link>
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({cities.length} cities)
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {cities
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(c => (
                        <Link
                          key={`${state.slug}-${c.slug}`}
                          href={`/city/${c.slug}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {c.name} <span className="text-xs">({c.count})</span>
                        </Link>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
