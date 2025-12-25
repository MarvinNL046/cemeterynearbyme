import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ChevronRight, Building2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import statesData from '@/data/states.json';
import cemeteriesData from '@/data/cemeteries.json';
import { getStatesComingSoonText } from '@/lib/stats-config';

export const metadata: Metadata = {
  title: 'All States | Cemetery Near Me',
  description: 'Find cemeteries in all 50 US states. Browse cemeteries by state to find burial grounds, memorial parks, and graveyards near you.',
  openGraph: {
    title: 'All States | Cemetery Near Me',
    description: 'Find cemeteries in all 50 US states.',
    url: 'https://cemeterynearbyme.com/state',
  }
};

interface Cemetery {
  state: string;
  county?: string;
  city?: string;
}

export default function StatesPage() {
  const cemeteries = cemeteriesData as Cemetery[];

  // Get cemetery count for each state
  const statesWithCounts = statesData.states.map((state) => {
    const stateCemeteries = cemeteries.filter(c =>
      c.state === state.abbr || c.state === state.name
    );
    const uniqueCounties = [...new Set(stateCemeteries.map(c => c.county).filter(Boolean))];
    const uniqueCities = [...new Set(stateCemeteries.map(c => c.city).filter(Boolean))];

    return {
      ...state,
      cemeteryCount: stateCemeteries.length,
      countyCount: uniqueCounties.length,
      cityCount: uniqueCities.length,
    };
  });

  // Sort by cemetery count (states with data first) then alphabetically
  const sortedStates = statesWithCounts.sort((a, b) => {
    if (b.cemeteryCount !== a.cemeteryCount) {
      return b.cemeteryCount - a.cemeteryCount;
    }
    return a.name.localeCompare(b.name);
  });

  const activeStates = sortedStates.filter(s => s.cemeteryCount > 0);
  const pendingStates = sortedStates.filter(s => s.cemeteryCount === 0);
  const totalCemeteries = activeStates.reduce((sum, s) => sum + s.cemeteryCount, 0);
  const totalCounties = activeStates.reduce((sum, s) => sum + s.countyCount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">States</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Cemeteries by State
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Explore cemeteries across all 50 US states. Select a state to discover
            local cemeteries, memorial parks, and burial grounds in your area.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-gold-300">{statesData.states.length}</div>
              <div className="text-primary-foreground/70 text-sm">States</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-300">{totalCemeteries.toLocaleString('en-US')}</div>
              <div className="text-primary-foreground/70 text-sm">Cemeteries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-300">{totalCounties.toLocaleString('en-US')}</div>
              <div className="text-primary-foreground/70 text-sm">Counties</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Active States Grid */}
          {activeStates.length > 0 && (
            <>
              <h2 className="font-serif text-2xl font-semibold mb-6">
                States with Cemetery Data
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {activeStates.map((state) => (
                  <Link
                    key={state.abbr}
                    href={`/state/${state.slug}`}
                    className="group"
                  >
                    <Card className="h-full p-6 border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center group-hover:bg-accent transition-colors">
                          <MapPin className="w-6 h-6 text-forest-700 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">{state.abbr}</span>
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                          </div>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                        {state.name}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cemeteries</span>
                          <span className="font-semibold text-accent">{state.cemeteryCount.toLocaleString('en-US')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Counties</span>
                          <span className="font-medium">{state.countyCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cities</span>
                          <span className="font-medium">{state.cityCount}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <span className="text-sm font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                          View cemeteries
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* All States Grid */}
          <h2 className="font-serif text-2xl font-semibold mb-6">
            {activeStates.length > 0 ? 'All States' : 'Browse by State'}
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sortedStates.map((state) => (
              <Link
                key={state.abbr}
                href={`/state/${state.slug}`}
                className={`group p-4 rounded-lg border transition-all ${
                  state.cemeteryCount > 0
                    ? 'hover:border-accent/50 hover:bg-accent/5'
                    : 'border-dashed opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium group-hover:text-accent transition-colors">
                      {state.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {state.cemeteryCount > 0
                        ? `${state.cemeteryCount} cemeteries`
                        : 'Coming soon'
                      }
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{state.abbr}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming Soon Section */}
          {pendingStates.length > 0 && activeStates.length > 0 && (
            <div className="mt-16">
              <Card className="p-8 bg-secondary/30 border-dashed">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold mb-2">More States Coming Soon</h2>
                    <p className="text-muted-foreground mb-3">
                      {getStatesComingSoonText()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Currently adding data for {pendingStates.length} more states including {pendingStates.slice(0, 3).map(s => s.name).join(', ')}, and more.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Not sure where to look?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Use our search feature to find cemeteries by name, city, zip code, or cemetery type.
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
  );
}
