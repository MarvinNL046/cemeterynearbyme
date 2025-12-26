import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { ArrowRight, MapPin, Building2, Trees, Scale, Star, History, Flag, DollarSign, BookOpen, ChevronRight, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCemeteriesByState } from '@/lib/data';

interface StateGuide {
  slug: string;
  name: string;
  abbr: string;
  totalCemeteries: number;
  title: string;
  metaDescription: string;
  heroSubtitle: string;
  overview: string;
  burialLaws: {
    title: string;
    content: string;
    keyPoints: string[];
  };
  typeDistribution: Array<{ type: string; count: number }>;
  topCities: string[];
  notableCemeteries: Array<{ name: string; city: string; description: string }>;
  historicCemeteries: Array<{ name: string; city: string; description: string }>;
  nationalCemeteries: Array<{ name: string; city: string }>;
  burialCosts: {
    average: string;
    cremation: string;
    notes: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

interface StateGuidesData {
  stateGuides: StateGuide[];
}

// Top 10 states to generate static pages for
const TOP_STATES = [
  'california',
  'texas',
  'florida',
  'north-carolina',
  'ohio',
  'arizona',
  'virginia',
  'new-york',
  'pennsylvania',
  'nevada',
];

async function getStateGuidesData(): Promise<StateGuidesData> {
  const filePath = path.join(process.cwd(), 'data', 'guides', 'state-guides.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function getStateGuide(slug: string): Promise<StateGuide | null> {
  const data = await getStateGuidesData();
  return data.stateGuides.find(guide => guide.slug === slug) || null;
}

interface PageProps {
  params: Promise<{
    state: string;
  }>;
}

export async function generateStaticParams() {
  return TOP_STATES.map(state => ({
    state: state,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const guide = await getStateGuide(stateSlug);

  if (!guide) {
    return { title: 'State Guide Not Found' };
  }

  return {
    title: `${guide.title} | Cemetery Near Me`,
    description: guide.metaDescription,
    keywords: `${guide.name} cemeteries, burial options ${guide.name}, ${guide.name} burial laws, cemeteries in ${guide.name}, memorial parks ${guide.name}, ${guide.name} funeral planning`,
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      type: 'article',
      url: `https://www.cemeterynearbyme.com/guide/state/${guide.slug}`,
    },
    alternates: {
      canonical: `https://www.cemeterynearbyme.com/guide/state/${guide.slug}`,
    },
  };
}

export default async function StateGuidePage({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const guide = await getStateGuide(stateSlug);

  if (!guide) {
    notFound();
  }

  // Get real-time statistics from data
  const cemeteries = await getCemeteriesByState(guide.name);
  const actualTotalCemeteries = cemeteries.length || guide.totalCemeteries;

  // Calculate type distribution from actual data
  const typeCounts: Record<string, number> = {};
  cemeteries.forEach(c => {
    const type = c.type || 'public-cemetery';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Get top-rated cemeteries
  const topRatedCemeteries = cemeteries
    .filter(c => c.rating && c.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Get unique cities
  const uniqueCities = [...new Set(cemeteries.map(c => c.city).filter(Boolean))];

  // Breadcrumb structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.cemeterynearbyme.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: 'https://www.cemeterynearbyme.com/guide',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'State Guides',
        item: 'https://www.cemeterynearbyme.com/guide/state',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: guide.name,
        item: `https://www.cemeterynearbyme.com/guide/state/${guide.slug}`,
      },
    ],
  };

  // Article structured data
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'Cemetery Near Me Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cemetery Near Me',
      url: 'https://www.cemeterynearbyme.com',
    },
    datePublished: '2024-12-26',
    dateModified: '2024-12-26',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.cemeterynearbyme.com/guide/state/${guide.slug}`,
    },
  };

  // FAQ structured data
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-forest-900 to-forest-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center flex-wrap gap-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guides</Link></li>
                <li>/</li>
                <li><Link href="/guide/state" className="hover:text-white transition-colors">State Guides</Link></li>
                <li>/</li>
                <li className="text-white">{guide.name}</li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              State Cemetery Guide
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {guide.title}
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl">
              {guide.heroSubtitle}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-gold-300">{actualTotalCemeteries.toLocaleString()}</div>
                <div className="text-white/70 text-sm">Cemeteries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{uniqueCities.length}</div>
                <div className="text-white/70 text-sm">Cities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-300">{guide.nationalCemeteries.length}</div>
                <div className="text-white/70 text-sm">National Cemeteries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative mt-8">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" className="fill-secondary/20"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <Card className="p-6 mb-12 bg-white">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-forest-600" />
              In This Guide
            </h2>
            <nav>
              <ul className="grid md:grid-cols-2 gap-2">
                <li>
                  <a href="#overview" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    Overview of {guide.name}
                  </a>
                </li>
                <li>
                  <a href="#burial-laws" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    Burial Laws & Regulations
                  </a>
                </li>
                <li>
                  <a href="#cemetery-types" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    Types of Cemeteries
                  </a>
                </li>
                <li>
                  <a href="#notable-cemeteries" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    Notable Cemeteries
                  </a>
                </li>
                <li>
                  <a href="#historic-cemeteries" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    Historic Cemeteries
                  </a>
                </li>
                <li>
                  <a href="#national-cemeteries" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    National Cemeteries
                  </a>
                </li>
                <li>
                  <a href="#burial-costs" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    Burial Costs
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-1">
                    <ChevronRight className="w-4 h-4" />
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </nav>
          </Card>

          {/* Overview Section */}
          <section id="overview" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-forest-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Overview of Burial Options in {guide.name}</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">{guide.overview}</p>
            </div>
          </section>

          {/* Burial Laws Section */}
          <section id="burial-laws" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                <Scale className="w-6 h-6 text-gold-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">{guide.burialLaws.title}</h2>
            </div>
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-muted-foreground leading-relaxed">{guide.burialLaws.content}</p>
            </div>
            <Card className="p-6 bg-forest-50 border-forest-100">
              <h3 className="font-semibold text-lg mb-4 text-forest-800">Key Points</h3>
              <ul className="space-y-3">
                {guide.burialLaws.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-forest-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-forest-700 text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="text-forest-800">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Cemetery Types Section */}
          <section id="cemetery-types" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-slate-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Types of Cemeteries in {guide.name}</h2>
            </div>
            <p className="text-muted-foreground mb-8 text-lg">
              {guide.name} offers a diverse range of cemetery types to meet different needs, preferences, and religious requirements.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guide.typeDistribution.map((item) => (
                <Card key={item.type} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-accent font-bold">{item.count}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Top Rated Cemeteries from Data */}
          {topRatedCemeteries.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-gold-700" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold">Top Rated Cemeteries in {guide.name}</h2>
              </div>
              <div className="space-y-4">
                {topRatedCemeteries.map((cemetery) => (
                  <Link key={cemetery.slug} href={`/cemetery/${cemetery.slug}`} className="block group">
                    <Card className="p-5 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">{cemetery.name}</h3>
                          <p className="text-muted-foreground text-sm">{cemetery.city}, {guide.abbr}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cemetery.rating && (
                            <div className="flex items-center gap-1 bg-gold-100 px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 text-gold-600 fill-gold-600" />
                              <span className="font-medium text-gold-700">{cemetery.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Notable Cemeteries Section */}
          <section id="notable-cemeteries" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-gold-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Notable Cemeteries in {guide.name}</h2>
            </div>
            <p className="text-muted-foreground mb-8 text-lg">
              These cemeteries are renowned for their historical significance, notable burials, or exceptional grounds.
            </p>
            <div className="space-y-6">
              {guide.notableCemeteries.map((cemetery, index) => (
                <Card key={index} className="p-6 bg-white">
                  <h3 className="font-serif text-xl font-semibold mb-2">{cemetery.name}</h3>
                  <p className="text-accent text-sm mb-3">{cemetery.city}, {guide.abbr}</p>
                  <p className="text-muted-foreground">{cemetery.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Historic Cemeteries Section */}
          <section id="historic-cemeteries" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <History className="w-6 h-6 text-amber-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Historic Cemeteries Worth Visiting</h2>
            </div>
            <p className="text-muted-foreground mb-8 text-lg">
              These historic burial grounds offer a window into {guide.name}&apos;s past and are popular with genealogists and history enthusiasts.
            </p>
            <div className="space-y-6">
              {guide.historicCemeteries.map((cemetery, index) => (
                <Card key={index} className="p-6 bg-white border-l-4 border-l-amber-500">
                  <h3 className="font-serif text-xl font-semibold mb-2">{cemetery.name}</h3>
                  <p className="text-amber-700 text-sm mb-3">{cemetery.city}</p>
                  <p className="text-muted-foreground">{cemetery.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* National Cemeteries Section */}
          <section id="national-cemeteries" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Flag className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">National Cemeteries in {guide.name}</h2>
            </div>
            <p className="text-muted-foreground mb-8 text-lg">
              {guide.name} has {guide.nationalCemeteries.length} national cemeter{guide.nationalCemeteries.length === 1 ? 'y' : 'ies'} honoring veterans who served our nation.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {guide.nationalCemeteries.map((cemetery, index) => (
                <Card key={index} className="p-4 bg-blue-50 border-blue-100">
                  <div className="flex items-center gap-3">
                    <Flag className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{cemetery.name}</h3>
                      <p className="text-blue-700 text-sm">{cemetery.city}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Burial Costs Section */}
          <section id="burial-costs" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Burial Costs in {guide.name}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold mb-2">Traditional Burial</h3>
                <p className="text-3xl font-bold text-accent mb-2">{guide.burialCosts.average}</p>
                <p className="text-muted-foreground text-sm">Average cost including plot, casket, and services</p>
              </Card>
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold mb-2">Cremation</h3>
                <p className="text-3xl font-bold text-accent mb-2">{guide.burialCosts.cremation}</p>
                <p className="text-muted-foreground text-sm">Including cremation service and basic urn</p>
              </Card>
            </div>
            <Card className="p-6 bg-emerald-50 border-emerald-100">
              <p className="text-emerald-800">{guide.burialCosts.notes}</p>
            </Card>
          </section>

          {/* Top Cities Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-forest-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Major Cities with Cemeteries</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {guide.topCities.map((city) => (
                <Link
                  key={city}
                  href={`/city/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-secondary hover:bg-accent hover:text-white rounded-full text-sm font-medium transition-colors"
                >
                  {city}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faqs" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-700" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {guide.faqs.map((faq, index) => (
                <Card key={index} className="p-6 bg-white">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-forest-100 to-gold-50 border-forest-200">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold mb-4">
                Browse All Cemeteries in {guide.name}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Explore our complete directory of {actualTotalCemeteries.toLocaleString()} cemeteries in {guide.name} with detailed information, photos, and reviews.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={`/state/${guide.slug}`}>
                  <Button variant="default" size="lg">
                    View All {guide.name} Cemeteries
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" size="lg">
                    Search Cemeteries
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Related State Guides */}
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Other State Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOP_STATES.filter(s => s !== guide.slug).slice(0, 6).map((stateSlug) => {
                const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                return (
                  <Link key={stateSlug} href={`/guide/state/${stateSlug}`} className="group">
                    <Card className="p-4 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-forest-600" />
                          <span className="font-medium group-hover:text-accent transition-colors">{stateName}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
