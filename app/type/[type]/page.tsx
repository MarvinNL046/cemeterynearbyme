import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTypes, getCemeteriesByType, getTypeBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Building, MapPin, ChevronRight, ArrowRight, Clock, Shield, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

const typeDescriptions: Record<string, string> = {
  'cemetery': 'Public cemeteries are open to all residents regardless of religious affiliation. These include municipal and county-operated cemeteries with diverse burial options.',
  'memorial-park': 'Memorial parks feature flat bronze or granite markers in a landscaped lawn setting. They offer a peaceful, park-like atmosphere with uniform aesthetics.',
  'national-cemetery': 'National cemeteries honor those who served in the armed forces. These sacred grounds provide free burial for eligible veterans and their spouses.',
  'natural-burial': 'Natural burial grounds offer an eco-friendly burial option in a natural setting. Without traditional monuments, the focus is on returning to nature.',
  'catholic-cemetery': 'Catholic cemeteries are operated by the Catholic Church. They follow specific religious traditions and burial practices.',
  'jewish-cemetery': 'Jewish cemeteries follow Jewish burial traditions and practices. They are often operated by synagogues or Jewish community organizations.',
  'muslim-cemetery': 'Muslim cemeteries follow Islamic burial traditions. Bodies are buried facing Mecca according to Islamic law.',
  'historic-cemetery': 'Historic cemeteries are significant sites preserving local history and heritage. Many feature notable monuments, architecture, and the graves of prominent figures.',
  'pet-cemetery': 'Pet cemeteries provide a final resting place for beloved pets and companion animals.',
  'crematorium': 'Crematoria provide cremation services and may include columbariums for storing cremated remains.',
  'mausoleum': 'Mausoleums are above-ground structures containing crypts for entombment of the deceased.',
  'church-cemetery': 'Church cemeteries are located on church grounds and are typically maintained by the congregation.',
};

export async function generateStaticParams() {
  const types = await getAllTypes();
  return types.map(type => ({
    type: type.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type: typeSlug } = await params;
  const type = await getTypeBySlug(typeSlug);

  if (!type) {
    return { title: 'Cemetery Type Not Found' };
  }

  return {
    title: `${type.name}s in the USA | Cemetery Near Me`,
    description: `Find all ${type.name.toLowerCase()}s across the United States. View locations, hours, and facilities.`,
    openGraph: {
      title: `${type.name}s`,
      description: `All ${type.name.toLowerCase()}s in the USA`,
      type: 'website',
    },
  };
}

export default async function TypePage({ params }: PageProps) {
  const { type: typeSlug } = await params;
  const type = await getTypeBySlug(typeSlug);

  if (!type) {
    notFound();
  }

  const cemeteries = await getCemeteriesByType(type.slug);
  const description = typeDescriptions[typeSlug] || type.description;

  // Group by state
  const cemeteriesByState = cemeteries.reduce((acc, cemetery) => {
    const state = cemetery.state || 'Unknown';
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(cemetery);
    return acc;
  }, {} as Record<string, typeof cemeteries>);

  const stateCount = Object.keys(cemeteriesByState).length;

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
              <li><Link href="/type" className="hover:text-white transition-colors">Types</Link></li>
              <li>/</li>
              <li className="text-white">{type.name}</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            {type.name}s
          </h1>

          {description && (
            <p className="text-primary-foreground/80 text-lg max-w-3xl mb-8">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div>
              <div className="text-3xl font-bold text-gold-300">{cemeteries.length}</div>
              <div className="text-primary-foreground/70 text-sm">Cemeteries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-300">{stateCount}</div>
              <div className="text-primary-foreground/70 text-sm">States</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {cemeteries.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(cemeteriesByState)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([state, stateCemeteries]) => (
                  <div key={state}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl font-bold">{state}</h2>
                        <p className="text-sm text-muted-foreground">
                          {stateCemeteries.length} {stateCemeteries.length !== 1 ? 'cemeteries' : 'cemetery'}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {stateCemeteries.map((cemetery) => (
                        <Link
                          key={cemetery.slug}
                          href={`/cemetery/${cemetery.slug}`}
                          className="group"
                        >
                          <Card className="h-full p-4 border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                            <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
                              {cemetery.name}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-forest-600" />
                                <span>{cemetery.city}{cemetery.county ? `, ${cemetery.county}` : ''}</span>
                              </p>
                              {cemetery.opening_hours && (
                                <p className="text-xs">{cemetery.opening_hours}</p>
                              )}
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                              View
                              <ChevronRight className="w-4 h-4" />
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
                No {type.name.toLowerCase()}s found yet. We are continuously adding new locations.
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

          {/* Info Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card className="p-6 shadow-soft">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Visiting Hours</h3>
              <p className="text-sm text-muted-foreground">
                Most cemeteries are open daily during daylight hours.
                Always check specific hours before your visit.
              </p>
            </Card>
            <Card className="p-6 shadow-soft">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-4">
                <Info className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Facilities</h3>
              <p className="text-sm text-muted-foreground">
                Many cemeteries offer facilities such as columbariums, mausoleums, and
                special sections for different needs.
              </p>
            </Card>
            <Card className="p-6 shadow-soft">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Visiting</h3>
              <p className="text-sm text-muted-foreground">
                Respect the peace and traditions of the cemetery. Some cemeteries
                have specific visitor guidelines.
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Looking for a specific cemetery?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Use our search feature to find cemeteries by name, city, or zip code.
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
