import { Metadata } from 'next';
import Link from 'next/link';
import { getCemeteryBySlug, getAllCemeteries, createMunicipalitySlug, getCemeteriesByMunicipality } from '@/lib/data';
import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Navigation, ExternalLink, Phone, Star, ChevronDown, Heart, Users, Calendar, CheckCircle2, Sparkles, Car, Accessibility, Building2, TreePine, Flower2, Info, ChevronRight, ArrowRight } from 'lucide-react';
import ProxiedImage from '@/components/ProxiedImage';
import CompareButton from '@/components/CompareButton';
import AffiliateAd from '@/components/ads/AffiliateAd';
import InlineAd from '@/components/ads/InlineAd';
import FeedbackForm from '@/components/FeedbackForm';
import ReviewSection from '@/components/ReviewSection';
import PhotoGallery from '@/components/PhotoGallery';
import FavoriteButton from '@/components/FavoriteButton';
import ReadMore from '@/components/ReadMore';
import { Card } from '@/components/ui/card';
// import ClaimButton from '@/components/ClaimButton'; // Temporarily disabled

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const cemeteries = await getAllCemeteries();
  return cemeteries.map((cemetery) => ({
    slug: cemetery.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cemetery = await getCemeteryBySlug(params.slug);

  if (!cemetery) {
    return {
      title: 'Begraafplaats niet gevonden',
    };
  }

  return {
    title: cemetery.seoTitle || `${cemetery.naam_begraafplaats} in ${cemetery.gemeente} | Begraafplaats in de Buurt`,
    description: cemetery.seoDescription || cemetery.generated?.samenvatting ||
      `Informatie over ${cemetery.naam_begraafplaats} in ${cemetery.gemeente}, ${cemetery.provincie}. Bekijk openingstijden, faciliteiten en routebeschrijving.`,
    openGraph: {
      title: cemetery.seoTitle || cemetery.naam_begraafplaats,
      description: cemetery.seoDescription || cemetery.generated?.samenvatting || `${cemetery.type} begraafplaats in ${cemetery.gemeente}`,
      type: 'website',
    },
  };
}

// Helper function to get type-specific placeholder
function getTypePlaceholder(type: string): string {
  const typeSlug = type?.toLowerCase().replace(/\s+/g, '-') || 'algemene-begraafplaats';
  const validTypes = ['algemene-begraafplaats', 'natuurbegraafplaats', 'joodse-begraafplaats', 'islamitische-begraafplaats', 'bijzondere-begraafplaats', 'dierenbegraafplaats'];

  if (validTypes.includes(typeSlug)) {
    return `/images/placeholders/${typeSlug}.svg`;
  }
  return '/images/placeholders/algemene-begraafplaats.svg';
}

// Helper function to get type icon
function getTypeIcon(type: string): string {
  const typeMap: Record<string, string> = {
    'algemene begraafplaats': '🪦',
    'natuurbegraafplaats': '🌳',
    'joodse begraafplaats': '✡️',
    'islamitische begraafplaats': '☪️',
    'rooms-katholieke begraafplaats': '✝️',
    'dierenbegraafplaats': '🐾',
  };
  return typeMap[type?.toLowerCase()] || '🪦';
}

// Helper function to get facility icon component
function getFacilityIcon(facility: string): React.ReactNode {
  const facilityLower = facility.toLowerCase();
  if (facilityLower.includes('parkeer')) return <Car className="w-4 h-4" />;
  if (facilityLower.includes('rolstoel') || facilityLower.includes('toegankelijk')) return <Accessibility className="w-4 h-4" />;
  if (facilityLower.includes('aula') || facilityLower.includes('kapel')) return <Building2 className="w-4 h-4" />;
  if (facilityLower.includes('natuur') || facilityLower.includes('bos')) return <TreePine className="w-4 h-4" />;
  if (facilityLower.includes('bloem') || facilityLower.includes('tuin')) return <Flower2 className="w-4 h-4" />;
  return <CheckCircle2 className="w-4 h-4" />;
}
// FAQ data for cemeteries
function generateFAQs(cemetery: any) {
  return [
    {
      question: `Wat zijn de openingstijden van ${cemetery.naam_begraafplaats}?`,
      answer: cemetery.openingstijden || 'De openingstijden kunnen variëren. Neem contact op met de begraafplaats voor actuele tijden.'
    },
    {
      question: `Hoe kom ik bij ${cemetery.naam_begraafplaats}?`,
      answer: cemetery.generated?.bereikbaarheid || `${cemetery.naam_begraafplaats} is gelegen in ${cemetery.gemeente}, ${cemetery.provincie}. ${cemetery.google_address || cemetery.adres ? `Het adres is ${cemetery.google_address || cemetery.adres}.` : 'Gebruik de routeplanner voor een beschrijving.'}`
    },
    {
      question: `Welke faciliteiten heeft ${cemetery.naam_begraafplaats}?`,
      answer: cemetery.faciliteiten || cemetery.generated?.voorzieningen?.join(', ') || 'Neem contact op met de begraafplaats voor informatie over beschikbare faciliteiten.'
    },
    {
      question: `Kan ik een rondleiding krijgen op ${cemetery.naam_begraafplaats}?`,
      answer: 'Veel begraafplaatsen bieden rondleidingen aan, vooral als er historische of bijzondere graven aanwezig zijn. Neem contact op om de mogelijkheden te bespreken.'
    }
  ];
}

export default async function CemeteryPage({ params }: PageProps) {
  const cemetery = await getCemeteryBySlug(params.slug);

  if (!cemetery) {
    notFound();
  }

  // Get similar cemeteries in same municipality
  const allCemeteries = await getCemeteriesByMunicipality(cemetery.gemeente);
  const similarCemeteries = allCemeteries
    .filter(c => c.slug !== cemetery.slug)
    .slice(0, 4);

  let lat = null;
  let lon = null;
  let googleMapsUrl = null;

  if (cemetery.gps_coordinaten) {
    const coords = cemetery.gps_coordinaten.split(',').map(coord => coord.trim());
    lat = coords[0];
    lon = coords[1];
    googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
  }

  const rating = cemetery.google_rating || cemetery.rating || null;
  const reviewCount = cemetery.google_review_count || cemetery.reviews || '0';
  const phone = cemetery.google_phone || cemetery.telefoon;
  const faqs = generateFAQs(cemetery);

  // Get first user-uploaded photo as fallback for header image
  let userPhoto: string | null = null;
  if (!cemetery.photo && !cemetery.foto_url && !cemetery.wikimedia_image) {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const photos = await sql`
        SELECT file_url FROM cemetery_photos
        WHERE cemetery_slug = ${params.slug} AND status = 'approved'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      if (photos.length > 0) {
        userPhoto = photos[0].file_url;
      }
    } catch (error) {
      console.error('Error fetching user photo:', error);
    }
  }

  // Breadcrumb structured data
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
        name: cemetery.provincie,
        item: `https://www.begraafplaatsindebuurt.nl/provincie/${cemetery.provincie.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cemetery.gemeente,
        item: `https://www.begraafplaatsindebuurt.nl/gemeente/${createMunicipalitySlug(cemetery.gemeente)}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: cemetery.naam_begraafplaats,
        item: `https://www.begraafplaatsindebuurt.nl/begraafplaats/${cemetery.slug}`
      }
    ]
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Cemetery',
    name: cemetery.naam_begraafplaats,
    description: cemetery.generated?.samenvatting || cemetery.enrichedContent || `${cemetery.type} in ${cemetery.gemeente}, ${cemetery.provincie}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: cemetery.adres || '',
      addressLocality: cemetery.gemeente,
      addressRegion: cemetery.provincie,
      addressCountry: 'NL',
      postalCode: cemetery.postcode || '',
    },
    ...(lat && lon && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: lat,
        longitude: lon,
      }
    }),
    openingHours: cemetery.openingstijden,
    telephone: phone || '',
    url: `https://www.begraafplaatsindebuurt.nl/begraafplaats/${cemetery.slug}`,
    ...((cemetery.photo || cemetery.wikimedia_image) && {
      image: cemetery.photo || `https://www.begraafplaatsindebuurt.nl${cemetery.wikimedia_image}`
    }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: parseFloat(String(rating)),
        reviewCount: parseInt(String(reviewCount)),
        bestRating: 5,
        worstRating: 1,
      }
    }),
  };

  // FAQ structured data
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero Section with Forest Green Background */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-forest-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8 relative">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex items-center flex-wrap gap-2 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li>
                <Link
                  href={`/provincie/${cemetery.provincie.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-white transition-colors"
                >
                  {cemetery.provincie}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/gemeente/${createMunicipalitySlug(cemetery.gemeente)}`}
                  className="hover:text-white transition-colors"
                >
                  {cemetery.gemeente}
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium truncate max-w-[200px]">{cemetery.naam_begraafplaats}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left: Title and info */}
            <div className="flex-1">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4">
                <span>{getTypeIcon(cemetery.type)}</span>
                <span className="capitalize">{cemetery.type}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {cemetery.naam_begraafplaats}
              </h1>

              {/* Rating and Location */}
              <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
                {rating && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(parseFloat(String(rating)))
                              ? 'fill-gold-400 text-gold-400'
                              : 'fill-gray-400/30 text-gray-400/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gold-300">{rating}</span>
                    <span className="text-primary-foreground/60">({reviewCount} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>{cemetery.gemeente}, {cemetery.provincie}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {cemetery.jaar_oprichting && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                    <Calendar className="w-4 h-4 text-gold-400" />
                    <span>Sinds {cemetery.jaar_oprichting}</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Geverifieerd</span>
                </div>
                {cemetery.faciliteiten && cemetery.faciliteiten.includes('Rolstoel') && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                    <Accessibility className="w-4 h-4 text-gold-400" />
                    <span>Toegankelijk</span>
                  </div>
                )}
                {cemetery.oppervlakte && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>{parseInt(cemetery.oppervlakte).toLocaleString('nl-NL')} m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span>Bellen</span>
                </a>
              )}
              <FavoriteButton
                cemeterySlug={params.slug}
                cemeteryName={cemetery.naam_begraafplaats}
                variant="hero"
              />
{/* ClaimButton temporarily disabled
              <ClaimButton
                cemeteryName={cemetery.naam_begraafplaats}
                cemeterySlug={cemetery.slug}
                variant="secondary"
              />
*/}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Main Column */}
            <div className="flex-1 min-w-0 space-y-6 sm:space-y-8 lg:max-w-2xl xl:max-w-3xl">
              {/* Image */}
              <Card className="aspect-video overflow-hidden relative shadow-soft">
              {(cemetery.photo || cemetery.foto_url) ? (
                <ProxiedImage
                  src={cemetery.photo || cemetery.foto_url}
                  alt={cemetery.naam_begraafplaats}
                  fill
                  className="object-cover"
                  priority
                />
              ) : cemetery.wikimedia_image ? (
                <>
                  <img
                    src={cemetery.wikimedia_image}
                    alt={cemetery.naam_begraafplaats}
                    className="w-full h-full object-cover"
                  />
                  {cemetery.wikimedia_attribution && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-3 py-1.5">
                      Foto: {cemetery.wikimedia_attribution} - via Wikimedia Commons
                    </div>
                  )}
                </>
              ) : cemetery.google_photo ? (
                <>
                  <img
                    src={cemetery.google_photo}
                    alt={cemetery.naam_begraafplaats}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-3 py-1.5">
                    Foto: Google Maps
                  </div>
                </>
              ) : userPhoto ? (
                <>
                  <img
                    src={userPhoto}
                    alt={cemetery.naam_begraafplaats}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-3 py-1.5">
                    Foto door bezoeker
                  </div>
                </>
              ) : (
                <img
                  src={getTypePlaceholder(cemetery.type)}
                  alt={`${cemetery.type || 'Begraafplaats'} - ${cemetery.naam_begraafplaats}`}
                  className="w-full h-full object-cover"
                />
              )}
            </Card>

            {/* About Section */}
            <Card className="p-4 sm:p-6 shadow-soft">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4 text-foreground">Over {cemetery.naam_begraafplaats}</h2>
              {cemetery.enrichedContent ? (
                <ReadMore text={cemetery.enrichedContent} maxLength={600} />
              ) : cemetery.beschrijving ? (
                <p className="text-muted-foreground">{cemetery.beschrijving}</p>
              ) : cemetery.generated?.samenvatting ? (
                <ReadMore text={cemetery.generated.samenvatting} maxLength={600} />
              ) : (
                <p className="text-muted-foreground">
                  {cemetery.naam_begraafplaats} is een {cemetery.type || 'begraafplaats'} gelegen in {cemetery.gemeente}, {cemetery.provincie}.
                  {cemetery.oppervlakte && ` De begraafplaats heeft een oppervlakte van ${parseInt(cemetery.oppervlakte).toLocaleString('nl-NL')} m².`}
                  {cemetery.faciliteiten && ` Beschikbare voorzieningen zijn onder andere ${cemetery.faciliteiten.toLowerCase()}.`}
                  {cemetery.jaar_oprichting && ` De begraafplaats werd opgericht in ${cemetery.jaar_oprichting}.`}
                  {` Voor meer informatie over ${cemetery.naam_begraafplaats} kunt u contact opnemen via de contactgegevens op deze pagina.`}
                </p>
              )}
            </Card>

            {/* Highlights / Key Features */}
            {(cemetery.generated?.kenmerken || cemetery.faciliteiten) && (
              <Card className="p-6 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                  <h2 className="font-serif text-2xl font-bold">Highlights</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cemetery.faciliteiten?.split(',').map((faciliteit: string, index: number) => (
                    <div key={`f-${index}`} className="flex items-center gap-3 p-4 bg-forest-50 dark:bg-forest-900/20 rounded-xl border border-forest-100 dark:border-forest-800 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 text-forest-700 dark:text-forest-400">
                        {getFacilityIcon(faciliteit)}
                      </div>
                      <span className="font-medium text-sm leading-tight break-words min-w-0">{faciliteit.trim()}</span>
                    </div>
                  ))}
                  {cemetery.generated?.kenmerken?.map((kenmerk: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-forest-50 dark:bg-forest-900/20 rounded-xl border border-forest-100 dark:border-forest-800 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 text-forest-700 dark:text-forest-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm leading-tight break-words min-w-0">{kenmerk}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Statistics Section */}
            {(cemetery.oppervlakte || cemetery.aantal_graven || cemetery.aantal_personen) && (
              <Card className="p-6 shadow-soft bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-6 h-6 text-accent" />
                  <h2 className="font-serif text-2xl font-bold">Statistieken</h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {cemetery.oppervlakte && (
                    <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                      <p className="text-3xl font-bold text-accent">{parseInt(cemetery.oppervlakte).toLocaleString('nl-NL')}</p>
                      <p className="text-sm text-muted-foreground">m² oppervlakte</p>
                    </div>
                  )}
                  {cemetery.aantal_graven && (
                    <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                      <p className="text-3xl font-bold text-accent">{parseInt(cemetery.aantal_graven).toLocaleString('nl-NL')}</p>
                      <p className="text-sm text-muted-foreground">graven</p>
                    </div>
                  )}
                  {cemetery.aantal_personen && (
                    <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                      <p className="text-3xl font-bold text-accent">{parseInt(cemetery.aantal_personen).toLocaleString('nl-NL')}</p>
                      <p className="text-sm text-muted-foreground">bijgezette personen</p>
                    </div>
                  )}
                </div>
                {cemetery.meest_voorkomende_namen && cemetery.meest_voorkomende_namen.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-forest-100 dark:border-forest-800">
                    <p className="text-sm text-muted-foreground mb-2">Meest voorkomende familienamen:</p>
                    <div className="flex flex-wrap gap-2">
                      {cemetery.meest_voorkomende_namen.slice(0, 5).map((naam: { naam: string; aantal: number }, index: number) => (
                        <span key={index} className="px-3 py-1 bg-white dark:bg-gray-900 rounded-full text-sm">
                          {naam.naam} ({naam.aantal})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* History Section */}
            {cemetery.generated?.geschiedenis && (
              <Card className="p-6 shadow-soft">
                <h2 className="font-serif text-2xl font-bold mb-4">Geschiedenis</h2>
                <p className="text-muted-foreground">{cemetery.generated.geschiedenis}</p>
              </Card>
            )}

            {/* Inline Ad */}
            <InlineAd />

            {/* Photo Gallery */}
            <PhotoGallery
              cemeterySlug={params.slug}
              cemeteryName={cemetery.naam_begraafplaats}
            />

            {/* Reviews Section */}
            <ReviewSection
              cemeterySlug={params.slug}
              cemeteryName={cemetery.naam_begraafplaats}
              initialRating={rating ? parseFloat(String(rating)) : 0}
              initialReviewCount={parseInt(String(reviewCount))}
              embeddedReviews={cemetery.embeddedReviews}
            />

            {/* FAQ Section */}
            <Card className="p-6 shadow-soft">
              <h2 className="font-serif text-2xl font-bold mb-6">Veelgestelde vragen</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                      <span className="font-medium pr-4">{faq.question}</span>
                      <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-4 py-3 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </Card>

            {/* Additional Content Sections */}
            {cemetery.generated?.natuurEnOmgeving && (
              <Card className="p-6 shadow-soft">
                <h2 className="font-serif text-2xl font-bold mb-4">Natuur en Omgeving</h2>
                <p className="text-muted-foreground">{cemetery.generated.natuurEnOmgeving}</p>
              </Card>
            )}

            {/* Between Content Ad */}
            <InlineAd />

            {cemetery.generated?.bezoekerstips && cemetery.generated.bezoekerstips.length > 0 && (
              <Card className="p-6 shadow-soft">
                <h2 className="font-serif text-2xl font-bold mb-4">Bezoekerstips</h2>
                <ul className="space-y-3">
                  {cemetery.generated.bezoekerstips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl border border-gold-100 dark:border-gold-800">
                      <span className="text-gold-500 text-xl">💡</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Contact Form */}
            <Card id="contact-form" className="p-6 shadow-soft scroll-mt-24">
              <h2 className="font-serif text-2xl font-bold mb-4">Neem contact op</h2>
              <p className="text-muted-foreground mb-6">
                Heeft u vragen over {cemetery.naam_begraafplaats}? Vul het formulier in en wij helpen u graag verder.
              </p>
              <FeedbackForm
                pageTitle={cemetery.naam_begraafplaats}
                pageUrl={`/begraafplaats/${params.slug}`}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-4 space-y-6">
            {/* Business Info Card */}
            <Card className="p-4 sm:p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                  <span className="text-2xl">{getTypeIcon(cemetery.type)}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {cemetery.jaar_oprichting ? `Sinds ${cemetery.jaar_oprichting}` : cemetery.type}
                  </p>
                  <p className="font-medium">{cemetery.gemeente}</p>
                </div>
              </div>

              <div className="space-y-4">
                {phone && (
                  <a href={`tel:${phone}`} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                    <Phone className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">{phone}</span>
                  </a>
                )}

                {(cemetery.website || cemetery.website_url || cemetery.links) && (
                  <a
                    href={cemetery.website || cemetery.website_url || cemetery.links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium truncate">Website bezoeken</span>
                  </a>
                )}

                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Navigation className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">Route plannen</span>
                  </a>
                )}

                {(cemetery.google_address || cemetery.adres) && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm">{cemetery.google_address || cemetery.adres}</p>
                      {cemetery.postcode && (
                        <p className="text-sm text-muted-foreground">
                          {cemetery.postcode} {cemetery.plaats || cemetery.gemeente}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {cemetery.openingstijden && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Clock className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Openingstijden</p>
                      <p className="text-sm text-muted-foreground">{cemetery.openingstijden}</p>
                    </div>
                  </div>
                )}

                {cemetery.wikipedia_url && (
                  <a
                    href={cemetery.wikipedia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801-.378-.86l-.31-.024c-.121-.012-.182-.06-.182-.166v-.463l.095-.037h3.873l.037.045v.468c0 .106-.055.15-.16.163l-.49.025c-.267.02-.464.073-.59.166-.127.095-.282.345-.463.745l-2.468 4.458.479 1.117s1.627 3.426 2.099 4.371c.47.915.946 1.013 1.329 1.013.271 0 .443-.023.52-.068l.114-.132.096-.175V21h-5.82v-.389l.063-.178.094-.16.123-.139.102-.041.406-.021c.263-.042.439-.129.526-.26.084-.135.056-.311-.084-.531-.281-.438-.907-1.685-1.656-3.21l-.017-.019-2.205 4.459-.106.144-.106.104-.106.074-.088.036-.051.018h-5.64v-.396l.082-.18.102-.163.122-.138.102-.042c.483-.015.722-.062 1.036-.29.312-.227.495-.464.616-.794.164-.445.388-.938.722-1.628l2.314-4.792-.479-1.12z"/>
                    </svg>
                    <span className="text-sm font-medium">Wikipedia artikel</span>
                  </a>
                )}

                {cemetery.osm_id && (
                  <a
                    href={`https://www.openstreetmap.org/${cemetery.osm_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm5.894 14.666c-.046.186-.124.364-.233.52-.109.156-.244.284-.401.383-.157.099-.332.166-.52.2-.188.034-.383.034-.572 0l-4.168-.87-4.168.87c-.189.034-.384.034-.572 0-.188-.034-.363-.101-.52-.2-.157-.099-.292-.227-.401-.383-.109-.156-.187-.334-.233-.52L5.294 9.5c-.046-.186-.058-.38-.035-.572.023-.191.08-.376.168-.544.088-.168.207-.314.35-.432.143-.118.307-.205.484-.255l3.739-.879V5.5c0-.2.04-.398.118-.581.078-.183.192-.348.336-.485.144-.137.315-.244.502-.315.187-.071.387-.105.588-.1l.916.046.916-.046c.201-.005.401.029.588.1.187.071.358.178.502.315.144.137.258.302.336.485.078.183.118.381.118.581v1.318l3.739.879c.177.05.341.137.484.255.143.118.262.264.35.432.088.168.145.353.168.544.023.192.011.386-.035.572l-1.812 5.166z"/>
                    </svg>
                    <span className="text-sm font-medium">OpenStreetMap</span>
                  </a>
                )}
              </div>

              {/* Compare Button */}
              <div className="mt-6 pt-6 border-t">
                <CompareButton
                  cemeteryId={cemetery.slug}
                  cemeteryName={cemetery.naam_begraafplaats}
                />
              </div>
            </Card>

            {/* Affiliate Block: Uitvaartverzekering */}
            <Card className="p-4 sm:p-6 shadow-soft bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-200 dark:border-forest-800">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-accent" />
                <span className="font-semibold">Uitvaartverzekering</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Vergelijk uitvaartverzekeringen en bespaar tot 40% op uw premie.
              </p>
              <a
                href="https://www.independer.nl/uitvaartverzekering/vergelijken"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Vergelijk nu
                <ArrowRight className="w-4 h-4" />
              </a>
            </Card>

            {/* Affiliate Block: Zorgverzekering */}
            <Card className="p-4 sm:p-6 shadow-soft bg-gradient-to-br from-gold-50 to-forest-50/50 dark:from-gold-900/10 dark:to-forest-900/20 border-gold-200 dark:border-gold-800">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">Zorgverzekering 2025</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Overstappen kan tot 31 december. Vergelijk en bespaar op uw zorgpremie.
              </p>
              <a
                href="https://www.independer.nl/zorgverzekering/vergelijken"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Vergelijk nu
                <ArrowRight className="w-4 h-4" />
              </a>
            </Card>

            {/* Extra Affiliate Ads - alleen getoond wanneer er actieve partners zijn */}
            <AffiliateAd sticky={false} maxPartners={2} />
            </div>
          </div>
        </div>

        {/* Similar Cemeteries */}
        {similarCemeteries.length > 0 && (
          <section className="mt-12 max-w-6xl mx-auto">
            <h2 className="font-serif text-xl sm:text-2xl font-bold mb-6">Begraafplaatsen in {cemetery.gemeente}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {similarCemeteries.map((similar) => (
                <Link
                  key={similar.slug}
                  href={`/begraafplaats/${similar.slug}`}
                  className="group"
                >
                  <Card className="h-full p-3 sm:p-4 border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-base">{getTypeIcon(similar.type)}</span>
                      </div>
                      {similar.rating && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-gold-400 text-gold-400" />
                          <span>{similar.rating}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base group-hover:text-accent transition-colors line-clamp-2">
                      {similar.naam_begraafplaats}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize line-clamp-1">{similar.type}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Discover More Links */}
        <section className="mt-12 max-w-6xl mx-auto">
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-6">Ontdek meer</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href={`/provincie/${cemetery.provincie.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
            >
              <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">
                  {cemetery.provincie}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Alle begraafplaatsen in deze provincie
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                  Bekijken
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </Card>
            </Link>

            <Link
              href={`/gemeente/${createMunicipalitySlug(cemetery.gemeente)}`}
              className="group"
            >
              <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">
                  {cemetery.gemeente}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Alle begraafplaatsen in deze gemeente
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                  Bekijken
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </Card>
            </Link>

            <Link
              href={`/type/${cemetery.type.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
            >
              <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors capitalize line-clamp-2">
                  {cemetery.type}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Vergelijkbare begraafplaatsen
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                  Bekijken
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </Card>
            </Link>

            <Link
              href="/vergelijk"
              className="group"
            >
              <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">
                  Vergelijken
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Vergelijk tot 3 begraafplaatsen
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                  Bekijken
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <Card className="mt-12 p-4 sm:p-6 bg-secondary/50 max-w-6xl mx-auto">
          <h3 className="font-serif text-lg font-semibold mb-2">Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            We hebben getracht alle gegevens zo zorgvuldig mogelijk te verzamelen.
            Mocht u onjuiste of verouderde informatie aantreffen (zoals adres, omschrijving,
            status van de begraafplaats), dan kunt u een wijzigingsverzoek indienen via het contactformulier.
          </p>
        </Card>
        </div>
      </div>
    </>
  );
}
