import { Metadata } from 'next';
import Link from 'next/link';
import { getCemeteryBySlug, getAllCemeteries, createCountySlug, createStateSlug, getCemeteriesByCity } from '@/lib/data';
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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Limit static generation to top 500 cemeteries to stay under Vercel's 75MB limit
// Other pages will be generated on-demand with ISR
export async function generateStaticParams() {
  const cemeteries = await getAllCemeteries();
  // Sort by rating (highest first) and take top 500
  const topCemeteries = cemeteries
    .sort((a, b) => (parseFloat(b.rating || '0') - parseFloat(a.rating || '0')))
    .slice(0, 500);
  return topCemeteries.map((cemetery) => ({
    slug: cemetery.slug,
  }));
}

// Allow dynamic params for cemeteries not in static params
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cemetery = await getCemeteryBySlug(slug);

  if (!cemetery) {
    return {
      title: 'Cemetery Not Found',
    };
  }

  return {
    title: cemetery.seoTitle || `${cemetery.name} in ${cemetery.city}, ${cemetery.state} | Cemetery Near Me`,
    description: cemetery.seoDescription || cemetery.generated?.summary ||
      `Information about ${cemetery.name} in ${cemetery.city}, ${cemetery.state}. View hours, facilities, and directions.`,
    openGraph: {
      title: cemetery.seoTitle || cemetery.name,
      description: cemetery.seoDescription || cemetery.generated?.summary || `${cemetery.type} in ${cemetery.city}`,
      type: 'website',
    },
  };
}

function getTypePlaceholder(type: string): string {
  const typeSlug = type?.toLowerCase().replace(/\s+/g, '-') || 'public-cemetery';
  const validTypes = ['public-cemetery', 'memorial-park', 'veterans-cemetery', 'historic-cemetery', 'natural-burial', 'pet-cemetery'];
  if (validTypes.includes(typeSlug)) {
    return `/images/placeholders/${typeSlug}.svg`;
  }
  return '/images/placeholders/public-cemetery.svg';
}

function getTypeIcon(type: string): string {
  const typeMap: Record<string, string> = {
    'cemetery': '🪦',
    'memorial park': '🌳',
    'national cemetery': '🎖️',
    'veterans cemetery': '🎖️',
    'historic cemetery': '🏛️',
    'natural burial': '🌿',
    'green cemetery': '🌿',
    'pet cemetery': '🐾',
    'catholic cemetery': '✝️',
    'jewish cemetery': '✡️',
    'muslim cemetery': '☪️',
  };
  return typeMap[type?.toLowerCase()] || '🪦';
}

function getFacilityIcon(facility: string): React.ReactNode {
  const facilityLower = facility.toLowerCase();
  if (facilityLower.includes('parking')) return <Car className="w-4 h-4" />;
  if (facilityLower.includes('wheelchair') || facilityLower.includes('accessible')) return <Accessibility className="w-4 h-4" />;
  if (facilityLower.includes('chapel') || facilityLower.includes('building')) return <Building2 className="w-4 h-4" />;
  if (facilityLower.includes('nature') || facilityLower.includes('garden')) return <TreePine className="w-4 h-4" />;
  if (facilityLower.includes('flower') || facilityLower.includes('memorial')) return <Flower2 className="w-4 h-4" />;
  return <CheckCircle2 className="w-4 h-4" />;
}

function generateFAQs(cemetery: any) {
  return [
    {
      question: `What are the visiting hours at ${cemetery.name}?`,
      answer: cemetery.opening_hours || 'Visiting hours may vary. Please contact the cemetery for current hours.'
    },
    {
      question: `How do I get to ${cemetery.name}?`,
      answer: cemetery.generated?.directions || `${cemetery.name} is located in ${cemetery.city}, ${cemetery.state}. ${cemetery.address ? `The address is ${cemetery.address}.` : 'Use the directions feature for navigation.'}`
    },
    {
      question: `What facilities does ${cemetery.name} have?`,
      answer: cemetery.facilities?.join(', ') || cemetery.generated?.amenities?.join(', ') || 'Please contact the cemetery for information about available facilities.'
    },
    {
      question: `Can I get a tour at ${cemetery.name}?`,
      answer: 'Many cemeteries offer tours, especially if there are historical or notable graves. Contact the cemetery to discuss available options.'
    }
  ];
}

export default async function CemeteryPage({ params }: PageProps) {
  const { slug } = await params;
  const cemetery = await getCemeteryBySlug(slug);

  if (!cemetery) {
    notFound();
  }

  // Get similar cemeteries in same city
  const allCemeteries = await getCemeteriesByCity(cemetery.city);
  const similarCemeteries = allCemeteries
    .filter(c => c.slug !== cemetery.slug)
    .slice(0, 4);

  let lat = cemetery.latitude || null;
  let lon = cemetery.longitude || null;
  let googleMapsUrl = null;

  if (!lat && !lon && cemetery.gps_coordinates) {
    const coords = cemetery.gps_coordinates.split(',').map(coord => coord.trim());
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
  }

  if (lat && lon) {
    googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
  }

  const rating = cemetery.rating || null;
  const reviewCount = cemetery.review_count || 0;
  const phone = cemetery.phone;
  const faqs = generateFAQs(cemetery);

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
        name: cemetery.state,
        item: `https://www.cemeterynearbyme.com/state/${createStateSlug(cemetery.state)}`
      },
      ...(cemetery.county ? [{
        '@type': 'ListItem',
        position: 3,
        name: `${cemetery.county} County`,
        item: `https://www.cemeterynearbyme.com/county/${createCountySlug(cemetery.county)}`
      }] : []),
      {
        '@type': 'ListItem',
        position: cemetery.county ? 4 : 3,
        name: cemetery.name,
        item: `https://www.cemeterynearbyme.com/cemetery/${cemetery.slug}`
      }
    ]
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Cemetery',
    name: cemetery.name,
    description: cemetery.generated?.summary || cemetery.description || `${cemetery.type} in ${cemetery.city}, ${cemetery.state}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: cemetery.address || '',
      addressLocality: cemetery.city,
      addressRegion: cemetery.state,
      addressCountry: 'US',
      postalCode: cemetery.zipCode || '',
    },
    ...(lat && lon && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: lat,
        longitude: lon,
      }
    }),
    openingHours: cemetery.opening_hours,
    telephone: phone || '',
    url: `https://www.cemeterynearbyme.com/cemetery/${cemetery.slug}`,
    ...((cemetery.photo_url || cemetery.photo) && { image: cemetery.photo_url || cemetery.photo }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1,
      }
    }),
  };

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

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
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
                  href={`/state/${createStateSlug(cemetery.state)}`}
                  className="hover:text-white transition-colors"
                >
                  {cemetery.state}
                </Link>
              </li>
              {cemetery.county && (
                <>
                  <li>/</li>
                  <li>
                    <Link
                      href={`/county/${createCountySlug(cemetery.county)}`}
                      className="hover:text-white transition-colors"
                    >
                      {cemetery.county} County
                    </Link>
                  </li>
                </>
              )}
              <li>/</li>
              <li className="text-white font-medium truncate max-w-[200px]">{cemetery.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4">
                <span>{getTypeIcon(cemetery.type)}</span>
                <span className="capitalize">{cemetery.type}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {cemetery.name}
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
                            star <= Math.round(rating)
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
                  <span>{cemetery.city}, {cemetery.state_abbr || cemetery.state}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {cemetery.year_established && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                    <Calendar className="w-4 h-4 text-gold-400" />
                    <span>Since {cemetery.year_established}</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call</span>
                </a>
              )}
              <FavoriteButton
                cemeterySlug={slug}
                cemeteryName={cemetery.name}
                variant="hero"
              />
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
                {(cemetery.photo_url || cemetery.photo) ? (
                  <ProxiedImage
                    src={cemetery.photo_url || cemetery.photo}
                    alt={cemetery.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <img
                    src={getTypePlaceholder(cemetery.type)}
                    alt={`${cemetery.type || 'Cemetery'} - ${cemetery.name}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </Card>

              {/* About Section */}
              <Card className="p-4 sm:p-6 shadow-soft">
                <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4 text-foreground">About {cemetery.name}</h2>
                {cemetery.enrichedContent ? (
                  <ReadMore text={cemetery.enrichedContent} maxLength={600} />
                ) : cemetery.description ? (
                  <ReadMore text={cemetery.description} maxLength={600} />
                ) : cemetery.generated?.summary ? (
                  <ReadMore text={cemetery.generated.summary} maxLength={600} />
                ) : (
                  <p className="text-muted-foreground">
                    {cemetery.name} is a {cemetery.type || 'cemetery'} located in {cemetery.city}, {cemetery.state}.
                    {cemetery.facilities && cemetery.facilities.length > 0 && ` Available facilities include ${cemetery.facilities.join(', ').toLowerCase()}.`}
                    {cemetery.year_established && ` The cemetery was established in ${cemetery.year_established}.`}
                    {` For more information about ${cemetery.name}, please contact using the details on this page.`}
                  </p>
                )}
              </Card>

              {/* Facilities */}
              {cemetery.facilities && cemetery.facilities.length > 0 && (
                <Card className="p-6 shadow-soft">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <h2 className="font-serif text-2xl font-bold">Facilities</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cemetery.facilities.map((facility: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-forest-50 dark:bg-forest-900/20 rounded-xl border border-forest-100 dark:border-forest-800">
                        <div className="w-10 h-10 rounded-full bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 text-forest-700 dark:text-forest-400">
                          {getFacilityIcon(facility)}
                        </div>
                        <span className="font-medium text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* History Section */}
              {cemetery.generated?.history && (
                <Card className="p-6 shadow-soft">
                  <h2 className="font-serif text-2xl font-bold mb-4">History</h2>
                  <p className="text-muted-foreground">{cemetery.generated.history}</p>
                </Card>
              )}

              {/* Inline Ad */}
              <InlineAd />

              {/* Photo Gallery */}
              <PhotoGallery
                cemeterySlug={slug}
                cemeteryName={cemetery.name}
              />

              {/* Reviews Section */}
              <ReviewSection
                cemeterySlug={slug}
                cemeteryName={cemetery.name}
                initialRating={rating || 0}
                initialReviewCount={reviewCount}
                embeddedReviews={cemetery.reviews}
              />

              {/* FAQ Section */}
              <Card className="p-6 shadow-soft">
                <h2 className="font-serif text-2xl font-bold mb-6">Frequently Asked Questions</h2>
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

              {/* Visitor Tips */}
              {cemetery.generated?.visitor_tips && cemetery.generated.visitor_tips.length > 0 && (
                <Card className="p-6 shadow-soft">
                  <h2 className="font-serif text-2xl font-bold mb-4">Visitor Tips</h2>
                  <ul className="space-y-3">
                    {cemetery.generated.visitor_tips.map((tip: string, index: number) => (
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
                <h2 className="font-serif text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground mb-6">
                  Have questions about {cemetery.name}? Fill out the form and we&apos;ll be happy to help.
                </p>
                <FeedbackForm
                  pageTitle={cemetery.name}
                  pageUrl={`/cemetery/${slug}`}
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
                        {cemetery.year_established ? `Since ${cemetery.year_established}` : cemetery.type}
                      </p>
                      <p className="font-medium">{cemetery.city}, {cemetery.state_abbr}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {phone && (
                      <a href={`tel:${phone}`} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                        <Phone className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium">{phone}</span>
                      </a>
                    )}

                    {cemetery.website && (
                      <a
                        href={cemetery.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium truncate">Visit Website</span>
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
                        <span className="text-sm font-medium">Get Directions</span>
                      </a>
                    )}

                    {cemetery.address && (
                      <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                        <MapPin className="w-5 h-5 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm">{cemetery.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {cemetery.city}, {cemetery.state_abbr} {cemetery.zipCode}
                          </p>
                        </div>
                      </div>
                    )}

                    {cemetery.opening_hours && (
                      <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                        <Clock className="w-5 h-5 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Hours</p>
                          <p className="text-sm text-muted-foreground">{cemetery.opening_hours}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compare Button */}
                  <div className="mt-6 pt-6 border-t">
                    <CompareButton
                      cemeteryId={cemetery.slug}
                      cemeteryName={cemetery.name}
                    />
                  </div>
                </Card>

                {/* Affiliate Blocks */}
                <Card className="p-4 sm:p-6 shadow-soft bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-200 dark:border-forest-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-accent" />
                    <span className="font-semibold">Funeral Planning</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compare funeral homes and plan ahead to save up to 40%.
                  </p>
                  <a
                    href="https://www.funeralwise.com"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Compare Now
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Card>

                <AffiliateAd sticky={false} maxPartners={2} />
              </div>
            </div>
          </div>

          {/* Similar Cemeteries */}
          {similarCemeteries.length > 0 && (
            <section className="mt-12 max-w-6xl mx-auto">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-6">Cemeteries in {cemetery.city}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {similarCemeteries.map((similar) => (
                  <Link
                    key={similar.slug}
                    href={`/cemetery/${similar.slug}`}
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
                        {similar.name}
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
            <h2 className="font-serif text-xl sm:text-2xl font-bold mb-6">Discover More</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link
                href={`/state/${createStateSlug(cemetery.state)}`}
                className="group"
              >
                <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                  <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">
                    {cemetery.state}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    All cemeteries in this state
                  </p>
                  <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                    View
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </Card>
              </Link>

              {cemetery.county && (
                <Link
                  href={`/county/${createCountySlug(cemetery.county)}`}
                  className="group"
                >
                  <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">
                      {cemetery.county} County
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      All cemeteries in this county
                    </p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                      View
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </Card>
                </Link>
              )}

              {cemetery.type && (
                <Link
                  href={`/type/${cemetery.type_slug || cemetery.type.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group"
                >
                  <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                    <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors capitalize line-clamp-2">
                      {cemetery.type}s
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Similar cemeteries
                    </p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                      View
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </Card>
                </Link>
              )}

              <Link
                href="/compare"
                className="group"
              >
                <Card className="h-full p-4 sm:p-6 hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-accent/30">
                  <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">
                    Compare
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Compare up to 3 cemeteries
                  </p>
                  <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-accent">
                    View
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
              We have tried to collect all information as carefully as possible.
              If you find incorrect or outdated information (such as address, description,
              cemetery status), you can submit a correction request via the contact form.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
