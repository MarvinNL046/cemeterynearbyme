import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTypes, getCemeteriesByType } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Building, MapPin, ChevronRight, ArrowRight, Clock, Shield, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: {
    type: string;
  };
}

const typeDisplayNames: Record<string, string> = {
  'algemene begraafplaats': 'Algemene Begraafplaatsen',
  'rooms-katholieke begraafplaats': 'Rooms-Katholieke Begraafplaatsen',
  'protestantse begraafplaats': 'Protestantse Begraafplaatsen',
  'joodse begraafplaats': 'Joodse Begraafplaatsen',
  'bijzondere begraafplaats': 'Bijzondere Begraafplaatsen',
  'natuurbegraafplaats': 'Natuurbegraafplaatsen',
  'islamitische begraafplaats': 'Islamitische Begraafplaatsen',
};

const typeDescriptions: Record<string, string> = {
  'algemene begraafplaats': 'Algemene begraafplaatsen staan open voor iedereen, ongeacht geloof of levensovertuiging. Dit omvat gemeentelijke en particuliere begraafplaatsen met diverse mogelijkheden voor begraven en asbestemming.',
  'rooms-katholieke begraafplaats': 'Rooms-katholieke begraafplaatsen zijn gewijd volgens katholieke tradities en vaak verbonden aan parochies. Ze kenmerken zich door religieuze symbolen, kruisbeelden en een serene, spirituele sfeer.',
  'protestantse begraafplaats': 'Protestantse begraafplaatsen, waaronder Nederlands Hervormde en Gereformeerde kerkhoven, weerspiegelen de protestantse traditie van soberheid en eenvoud. Vaak gelegen bij historische dorpskerken.',
  'joodse begraafplaats': 'Joodse begraafplaatsen volgen de joodse tradities en voorschriften. Deze historische locaties hebben vaak grote culturele waarde. Bezoek is soms alleen mogelijk op afspraak of tijdens speciale openstellingen.',
  'bijzondere begraafplaats': 'Bijzondere begraafplaatsen omvatten oorlogsbegraafplaatsen, erevelden, crematoria en andere unieke locaties met een speciale historische of culturele betekenis.',
  'natuurbegraafplaats': 'Natuurbegraafplaatsen bieden een duurzame laatste rustplaats in een natuurlijke omgeving. Zonder traditionele grafmonumenten staat hier de terugkeer naar de natuur centraal.',
  'islamitische begraafplaats': 'Islamitische begraafplaatsen zijn ingericht volgens islamitische voorschriften, waarbij de graven richting Mekka zijn georiënteerd. Ze bieden moslims een waardige laatste rustplaats volgens hun geloof.',
};

export async function generateStaticParams() {
  const types = await getAllTypes();

  // Generate params for all types
  const typesWithData = types.map(type => ({
    type: type.toLowerCase().replace(/\s+/g, '-'),
  }));

  console.log('Generating type routes:', typesWithData);

  return typesWithData;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const displayName = typeDisplayNames[params.type] || params.type;

  return {
    title: `${displayName} in Nederland | Begraafplaats in de Buurt`,
    description: `Overzicht van alle ${displayName.toLowerCase()} in Nederland. Vind locaties, openingstijden en faciliteiten.`,
    openGraph: {
      title: displayName,
      description: `Alle ${displayName.toLowerCase()} in Nederland`,
      type: 'website',
    },
  };
}

export default async function TypePage({ params }: PageProps) {
  const types = await getAllTypes();
  const matchedType = types.find(
    t => t.toLowerCase().replace(/\s+/g, '-') === params.type
  );

  if (!matchedType) {
    notFound();
  }

  const cemeteries = await getCemeteriesByType(matchedType);
  // Use the matched type directly as key (e.g., "algemene begraafplaats")
  const displayName = typeDisplayNames[matchedType] || matchedType.charAt(0).toUpperCase() + matchedType.slice(1);
  const description = typeDescriptions[matchedType];

  // Group by province
  const cemeteriesByProvince = cemeteries.reduce((acc, cemetery) => {
    if (!acc[cemetery.provincie]) {
      acc[cemetery.provincie] = [];
    }
    acc[cemetery.provincie].push(cemetery);
    return acc;
  }, {} as Record<string, typeof cemeteries>);

  const provinceCount = Object.keys(cemeteriesByProvince).length;

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
              <li className="text-white">{displayName}</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            {displayName}
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
              <div className="text-primary-foreground/70 text-sm">Begraafplaatsen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-300">{provinceCount}</div>
              <div className="text-primary-foreground/70 text-sm">Provincies</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Province sections */}
          <div className="space-y-12">
            {Object.entries(cemeteriesByProvince)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([province, provinceCemeteries]) => (
                <div key={province}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold">{province}</h2>
                      <p className="text-sm text-muted-foreground">{provinceCemeteries.length} begraafplaats{provinceCemeteries.length !== 1 ? 'en' : ''}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {provinceCemeteries.map((cemetery) => (
                      <Link
                        key={cemetery.slug}
                        href={`/begraafplaats/${cemetery.slug}`}
                        className="group"
                      >
                        <Card className="h-full p-4 border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                          <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
                            {cemetery.naam_begraafplaats}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-forest-600" />
                              <span>{cemetery.gemeente}</span>
                            </p>
                            {cemetery.openingstijden && (
                              <p className="text-xs">{cemetery.openingstijden}</p>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            Bekijken
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Info Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card className="p-6 shadow-soft">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Openingstijden</h3>
              <p className="text-sm text-muted-foreground">
                De meeste {displayName.toLowerCase()} zijn dagelijks geopend tijdens daglicht.
                Controleer altijd de specifieke openingstijden voor uw bezoek.
              </p>
            </Card>
            <Card className="p-6 shadow-soft">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-4">
                <Info className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Faciliteiten</h3>
              <p className="text-sm text-muted-foreground">
                Veel begraafplaatsen bieden faciliteiten zoals urnenmuren, columbariums en
                speciale afdelingen voor kindergraven.
              </p>
            </Card>
            <Card className="p-6 shadow-soft">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Bezoek</h3>
              <p className="text-sm text-muted-foreground">
                Respecteer de rust en tradities van de begraafplaats. Sommige begraafplaatsen
                hebben specifieke bezoekregels.
              </p>
            </Card>
          </div>

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
  );
}
