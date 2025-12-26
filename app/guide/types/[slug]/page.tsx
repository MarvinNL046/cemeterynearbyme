import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import {
  MapPin,
  Star,
  ChevronRight,
  ArrowRight,
  BookOpen,
  History,
  CheckCircle,
  Search,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getAllCemeteries, Cemetery } from '@/lib/data';

// Type definitions
interface TypeGuideSection {
  title: string;
  content?: string;
  items?: Array<{
    title: string;
    description: string;
  }>;
}

interface TypeGuideFAQ {
  question: string;
  answer: string;
}

interface TypeGuide {
  slug: string;
  typeSlug: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  sections: {
    introduction: TypeGuideSection;
    history: TypeGuideSection;
    characteristics: TypeGuideSection;
    howToFind: TypeGuideSection;
    visiting: TypeGuideSection;
  };
  faqs: TypeGuideFAQ[];
}

interface TypeGuidesData {
  types: TypeGuide[];
}

// Cache for type guides data
let typeGuidesCache: TypeGuidesData | null = null;

async function getTypeGuides(): Promise<TypeGuidesData> {
  if (typeGuidesCache) return typeGuidesCache;

  const filePath = path.join(process.cwd(), 'data', 'guides', 'type-guides.json');
  const content = await fs.readFile(filePath, 'utf-8');
  typeGuidesCache = JSON.parse(content);
  return typeGuidesCache!;
}

async function getTypeGuide(slug: string): Promise<TypeGuide | null> {
  const data = await getTypeGuides();
  return data.types.find((t) => t.slug === slug) || null;
}

// Generate static params for all type guides
export async function generateStaticParams() {
  const slugs = [
    'national-cemeteries',
    'memorial-parks',
    'jewish-cemeteries',
    'muslim-cemeteries',
    'catholic-cemeteries',
    'historic-cemeteries',
    'crematoriums',
  ];

  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getTypeGuide(slug);

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  const baseUrl = 'https://www.cemeterynearbyme.com';

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `${baseUrl}/guide/types/${guide.slug}`,
      type: 'article',
      images: [
        {
          url: guide.heroImage,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
    alternates: {
      canonical: `${baseUrl}/guide/types/${guide.slug}`,
    },
  };
}

// Get featured cemeteries of this type
async function getFeaturedCemeteriesOfType(
  typeSlug: string,
  limit: number = 6
): Promise<Cemetery[]> {
  const cemeteries = await getAllCemeteries();

  return cemeteries
    .filter((c) => c.type === typeSlug && c.rating && c.review_count)
    .sort((a, b) => {
      const scoreA = (a.rating || 0) * Math.log10((a.review_count || 1) + 1);
      const scoreB = (b.rating || 0) * Math.log10((b.review_count || 1) + 1);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

// Get state distribution for this type
async function getStateDistribution(
  typeSlug: string
): Promise<Array<{ state: string; count: number }>> {
  const cemeteries = await getAllCemeteries();
  const filtered = cemeteries.filter((c) => c.type === typeSlug);

  const stateMap = new Map<string, number>();
  filtered.forEach((c) => {
    const state = c.state || 'Unknown';
    stateMap.set(state, (stateMap.get(state) || 0) + 1);
  });

  return Array.from(stateMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// Get total count for this type
async function getTypeCount(typeSlug: string): Promise<number> {
  const cemeteries = await getAllCemeteries();
  return cemeteries.filter((c) => c.type === typeSlug).length;
}

export default async function TypeGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getTypeGuide(slug);

  if (!guide) {
    notFound();
  }

  const [featuredCemeteries, stateDistribution, totalCount] = await Promise.all([
    getFeaturedCemeteriesOfType(guide.typeSlug),
    getStateDistribution(guide.typeSlug),
    getTypeCount(guide.typeSlug),
  ]);

  const baseUrl = 'https://www.cemeterynearbyme.com';

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${baseUrl}/guide/types/${guide.slug}#article`,
        headline: guide.metaTitle,
        description: guide.metaDescription,
        author: {
          '@type': 'Organization',
          name: 'Cemetery Near Me',
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Cemetery Near Me',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/guide/types/${guide.slug}`,
        },
        datePublished: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/guide/types/${guide.slug}#faq`,
        mainEntity: guide.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/guide/types/${guide.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: `${baseUrl}/guide`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Cemetery Types',
            item: `${baseUrl}/guide/types`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: guide.title,
            item: `${baseUrl}/guide/types/${guide.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/70">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/guide" className="hover:text-white transition-colors">
                    Guides
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/guide/types" className="hover:text-white transition-colors">
                    Cemetery Types
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white">{guide.title}</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                Cemetery Type Guide
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
                {guide.title}
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                {guide.subtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-gold-300">
                    {totalCount.toLocaleString()}
                  </div>
                  <div className="text-primary-foreground/70 text-sm">
                    Locations in Database
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold-300">
                    {stateDistribution.length}
                  </div>
                  <div className="text-primary-foreground/70 text-sm">States Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Table of Contents */}
            <Card className="mb-12 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <BookOpen className="w-5 h-5 text-accent" />
                  In This Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="grid gap-2 sm:grid-cols-2">
                  <a
                    href="#introduction"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-accent" />
                    <span>{guide.sections.introduction.title}</span>
                  </a>
                  <a
                    href="#history"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-accent" />
                    <span>{guide.sections.history.title}</span>
                  </a>
                  <a
                    href="#characteristics"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-accent" />
                    <span>{guide.sections.characteristics.title}</span>
                  </a>
                  <a
                    href="#how-to-find"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-accent" />
                    <span>{guide.sections.howToFind.title}</span>
                  </a>
                  <a
                    href="#visiting"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-accent" />
                    <span>{guide.sections.visiting.title}</span>
                  </a>
                  <a
                    href="#featured"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-accent" />
                    <span>Featured {guide.title}</span>
                  </a>
                  <a
                    href="#faq"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-accent" />
                    <span>Frequently Asked Questions</span>
                  </a>
                </nav>
              </CardContent>
            </Card>

            {/* Introduction Section */}
            <section id="introduction" className="mb-16 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl font-bold">
                  {guide.sections.introduction.title}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                {guide.sections.introduction.content
                  ?.split('\n\n')
                  .map((paragraph, idx) => (
                    <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </section>

            {/* History Section */}
            <section id="history" className="mb-16 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <History className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl font-bold">
                  {guide.sections.history.title}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                {guide.sections.history.content?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Characteristics Section */}
            <section id="characteristics" className="mb-16 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl font-bold">
                  {guide.sections.characteristics.title}
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {guide.sections.characteristics.items?.map((item, idx) => (
                  <Card key={idx} className="shadow-soft">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* How to Find Section */}
            <section id="how-to-find" className="mb-16 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl font-bold">
                  {guide.sections.howToFind.title}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                {guide.sections.howToFind.content?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* State Distribution */}
              {stateDistribution.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4">
                    Top States with {guide.title}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {stateDistribution.slice(0, 6).map((item) => (
                      <Link
                        key={item.state}
                        href={`/state/${item.state
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between p-3 rounded-lg border hover:border-accent/50 hover:bg-muted/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span className="font-medium">{item.state}</span>
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {item.count} locations
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Visiting Section */}
            <section id="visiting" className="mb-16 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl font-bold">
                  {guide.sections.visiting.title}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                {guide.sections.visiting.content?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Featured Cemeteries Section */}
            <section id="featured" className="mb-16 scroll-mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold">
                    Featured {guide.title}
                  </h2>
                </div>
                <Link
                  href={`/type/${guide.typeSlug}`}
                  className="hidden sm:flex items-center gap-2 text-accent hover:underline"
                >
                  View all {totalCount.toLocaleString()}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {featuredCemeteries.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featuredCemeteries.map((cemetery) => (
                    <Link
                      key={cemetery.slug}
                      href={`/cemetery/${cemetery.slug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {cemetery.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {cemetery.city}, {cemetery.state}
                            </span>
                          </div>
                          {cemetery.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{cemetery.rating}</span>
                              {cemetery.review_count && (
                                <span className="text-muted-foreground text-sm">
                                  ({cemetery.review_count} reviews)
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No featured {guide.title.toLowerCase()} found in our database yet.
                  </p>
                </Card>
              )}

              <div className="mt-6 text-center sm:hidden">
                <Link
                  href={`/type/${guide.typeSlug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  View All {totalCount.toLocaleString()} {guide.title}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="mb-16 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl font-bold">
                  Frequently Asked Questions
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {guide.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* CTA Section */}
            <div className="bg-muted/50 rounded-2xl p-8 text-center">
              <h2 className="font-serif text-2xl font-bold mb-4">
                Find {guide.title} Near You
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Use our comprehensive directory to find {guide.title.toLowerCase()} in
                your area. Search by location, view details, and get directions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/type/${guide.typeSlug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Browse All {guide.title}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-accent text-accent rounded-lg font-medium hover:bg-accent/10 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search All Cemeteries
                </Link>
              </div>
            </div>

            {/* Related Guides */}
            <div className="mt-16">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Explore More Cemetery Types
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    slug: 'national-cemeteries',
                    title: 'National Cemeteries',
                    count: 227,
                  },
                  { slug: 'memorial-parks', title: 'Memorial Parks', count: 825 },
                  { slug: 'jewish-cemeteries', title: 'Jewish Cemeteries', count: 302 },
                  { slug: 'muslim-cemeteries', title: 'Muslim Cemeteries', count: 327 },
                  {
                    slug: 'catholic-cemeteries',
                    title: 'Catholic Cemeteries',
                    count: 254,
                  },
                  {
                    slug: 'historic-cemeteries',
                    title: 'Historic Cemeteries',
                    count: 180,
                  },
                  { slug: 'crematoriums', title: 'Crematoriums', count: 732 },
                ]
                  .filter((item) => item.slug !== guide.slug)
                  .slice(0, 3)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/guide/types/${item.slug}`}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-accent/50 hover:bg-muted/50 transition-colors group"
                    >
                      <div>
                        <h3 className="font-semibold group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.count} locations
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </Link>
                  ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/guide/types"
                  className="inline-flex items-center gap-2 text-accent hover:underline"
                >
                  View All Cemetery Type Guides
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
