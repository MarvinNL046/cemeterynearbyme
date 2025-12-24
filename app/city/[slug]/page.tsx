import { Metadata } from 'next';
import Link from 'next/link';
import { getCemeteriesByPlace, createPlaceSlug, getAllPlaces, getMunicipalityByPlace, getProvinceByPlace, createMunicipalitySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Building, Info } from 'lucide-react';
import CemeteryCard from '@/components/CemeteryCard';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import SidebarAd from '@/components/ads/SidebarAd';
import InlineAd from '@/components/ads/InlineAd';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const places = await getAllPlaces();
  return places.map((place) => ({
    slug: createPlaceSlug(place),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Find the place name from slug
  const places = await getAllPlaces();
  const place = places.find(p => createPlaceSlug(p) === params.slug);
  
  if (!place) {
    return {
      title: 'Plaats niet gevonden',
    };
  }

  const municipality = await getMunicipalityByPlace(place);
  const province = await getProvinceByPlace(place);
  const cemeteries = await getCemeteriesByPlace(place);
  
  return {
    title: `Begraafplaatsen in ${place} | Begraafplaats in de Buurt`,
    description: `Overzicht van alle ${cemeteries.length} begraafplaatsen in ${place}, gemeente ${municipality}, ${province}. Vind informatie over begraafplaatsen, kerkhoven en laatste rustplaatsen.`,
    openGraph: {
      title: `Begraafplaatsen in ${place}`,
      description: `Alle begraafplaatsen in ${place}, ${municipality}`,
      type: 'website',
    },
  };
}

export default async function PlacePage({ params }: PageProps) {
  // Find the place name from slug
  const places = await getAllPlaces();
  const place = places.find(p => createPlaceSlug(p) === params.slug);
  
  if (!place) {
    notFound();
  }

  const cemeteries = await getCemeteriesByPlace(place);
  const municipality = await getMunicipalityByPlace(place);
  const province = await getProvinceByPlace(place);

  if (!municipality || !province) {
    notFound();
  }

  // Count cemetery types
  const typeCount = cemeteries.reduce((acc, cemetery) => {
    acc[cemetery.type] = (acc[cemetery.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Begraafplaatsen in ${place}`,
    description: `Overzicht van alle begraafplaatsen in ${place}, ${municipality}`,
    breadcrumb: {
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
          name: municipality,
          item: `https://www.begraafplaatsindebuurt.nl/gemeente/${createMunicipalitySlug(municipality)}`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: place,
          item: `https://www.begraafplaatsindebuurt.nl/plaats/${params.slug}`
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: cemeteries.length,
      itemListElement: cemeteries.map((cemetery, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.begraafplaatsindebuurt.nl/begraafplaats/${cemetery.slug}`
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
                href={`/provincie/${province.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-foreground"
              >
                {province}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link 
                href={`/gemeente/${createMunicipalitySlug(municipality)}`}
                className="hover:text-foreground"
              >
                {municipality}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{place}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Begraafplaatsen in {place}
          </h1>
          <p className="text-lg text-muted-foreground">
            Er zijn {cemeteries.length} begraafplaatsen in {place}, gemeente {municipality}, provincie {province}.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{cemeteries.length}</p>
                <p className="text-sm text-muted-foreground">Totaal aantal</p>
              </div>
            </div>
          </div>
          {Object.entries(typeCount).map(([type, count]) => (
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
                <h3 className="text-lg font-semibold mb-4">Gerelateerde Pagina&apos;s</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href={`/gemeente/${createMunicipalitySlug(municipality)}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Alle begraafplaatsen in {municipality}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/provincie/${province.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Alle begraafplaatsen in {province}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Info Box */}
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Over {place}</h3>
                <p className="text-sm text-muted-foreground">
                  {place} is een plaats in de gemeente {municipality}, provincie {province}. 
                  Op deze pagina vindt u een overzicht van alle begraafplaatsen in deze plaats.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2>Begraafplaatsen en Kerkhoven in {place}</h2>
          <p>
            In {place} vindt u verschillende typen begraafplaatsen, van historische kerkhoven bij kerken tot 
            moderne algemene begraafplaatsen. Elke begraafplaats heeft zijn eigen karakter en geschiedenis.
          </p>
          
          {typeCount['algemene begraafplaats'] > 0 && (
            <>
              <h3>Algemene Begraafplaatsen</h3>
              <p>
                {place} heeft {typeCount['algemene begraafplaats']} algemene begraafplaats{typeCount['algemene begraafplaats'] > 1 ? 'en' : ''}. 
                Deze zijn toegankelijk voor iedereen, ongeacht geloof of levensovertuiging.
              </p>
            </>
          )}
          
          {typeCount['bijzondere begraafplaats'] > 0 && (
            <>
              <h3>Bijzondere Begraafplaatsen</h3>
              <p>
                Er {typeCount['bijzondere begraafplaats'] > 1 ? 'zijn' : 'is'} {typeCount['bijzondere begraafplaats']} bijzondere 
                begraafplaats{typeCount['bijzondere begraafplaats'] > 1 ? 'en' : ''} in {place}. Dit zijn vaak kerkhoven bij kerken 
                of begraafplaatsen van specifieke geloofsgemeenschappen.
              </p>
            </>
          )}
          
          <h3>Informatie en Contact</h3>
          <p>
            Voor meer informatie over een specifieke begraafplaats in {place}, klik op de gewenste begraafplaats 
            hierboven. Daar vindt u contactgegevens, openingstijden en routebeschrijvingen.
          </p>
        </div>
      </div>
    </>
  );
}