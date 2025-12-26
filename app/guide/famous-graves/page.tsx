import { Metadata } from 'next';
import Link from 'next/link';
import { Star, MapPin, Users, Camera, BookOpen, Calendar, ArrowRight, Clock, CheckCircle, Crown, Music, Film, Trophy, Pen, FlaskConical, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import InlineAd from '@/components/ads/InlineAd';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import { SITE_STATS } from '@/lib/stats-config';

export const metadata: Metadata = {
  title: 'Famous Graves in America: Notable Burial Sites Guide | Cemetery Near Me',
  description: 'Discover famous graves across America. Find burial sites of presidents, entertainers, musicians, athletes, and historic figures. Complete guide to visiting celebrity cemeteries.',
  keywords: 'famous graves, celebrity burial sites, president graves, famous cemeteries, Arlington Cemetery, Hollywood Forever, notable burial sites, find celebrity graves',
  openGraph: {
    title: 'Famous Graves in America: Complete Guide to Notable Burial Sites',
    description: 'Discover the final resting places of presidents, celebrities, musicians, and historic figures across America.',
    type: 'article',
    siteName: 'Cemetery Near Me',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Famous Graves in America',
    description: 'Find burial sites of celebrities, presidents, and historic figures.',
  },
  alternates: {
    canonical: 'https://www.cemeterynearbyme.com/guide/famous-graves',
  },
};

const famousCategories = [
  {
    icon: <Crown className="w-6 h-6" />,
    title: 'U.S. Presidents',
    description: 'Presidential burial sites from Washington to modern leaders',
    examples: ['John F. Kennedy - Arlington National Cemetery', 'Abraham Lincoln - Oak Ridge Cemetery, IL', 'George Washington - Mount Vernon, VA', 'Franklin D. Roosevelt - Hyde Park, NY'],
    count: '46 presidents',
  },
  {
    icon: <Film className="w-6 h-6" />,
    title: 'Entertainers & Actors',
    description: 'Hollywood legends and entertainment icons',
    examples: ['Marilyn Monroe - Westwood Village Memorial', 'Michael Jackson - Forest Lawn, Glendale', 'Judy Garland - Hollywood Forever Cemetery', 'Dean Martin - Westwood Village Memorial'],
    count: '2,000+ entertainers',
  },
  {
    icon: <Music className="w-6 h-6" />,
    title: 'Musicians & Composers',
    description: 'Music legends from jazz to rock and classical',
    examples: ['Elvis Presley - Graceland, Memphis', 'Johnny Cash - Hendersonville Memory Gardens', 'Louis Armstrong - Flushing Cemetery, Queens', 'Jimi Hendrix - Greenwood Memorial, WA'],
    count: '1,500+ musicians',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Athletes & Sports Heroes',
    description: 'Baseball legends, boxing champions, and Olympic heroes',
    examples: ['Babe Ruth - Gate of Heaven Cemetery, NY', 'Jackie Robinson - Cypress Hills Cemetery', 'Muhammad Ali - Cave Hill Cemetery, KY', 'Joe DiMaggio - Holy Cross Cemetery, CA'],
    count: '1,200+ athletes',
  },
  {
    icon: <Pen className="w-6 h-6" />,
    title: 'Authors & Writers',
    description: 'Literary giants and influential authors',
    examples: ['Edgar Allan Poe - Westminster Hall, Baltimore', 'Mark Twain - Woodlawn Cemetery, NY', 'Ernest Hemingway - Ketchum Cemetery, ID', 'F. Scott Fitzgerald - St. Mary\'s Cemetery, MD'],
    count: '1,800+ authors',
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    title: 'Scientists & Inventors',
    description: 'Pioneers who changed our world',
    examples: ['Thomas Edison - Rosedale Cemetery, NJ', 'Benjamin Franklin - Christ Church Burial Ground', 'Nikola Tesla - Ferncliff Cemetery, NY', 'Albert Einstein - Ashes scattered, Princeton'],
    count: '900+ scientists',
  },
];

const topCemeteries = [
  {
    name: 'Arlington National Cemetery',
    location: 'Arlington, Virginia',
    description: 'America\'s most hallowed ground, the final resting place of over 400,000 service members, veterans, and notable Americans including President John F. Kennedy.',
    notableBurials: ['John F. Kennedy', 'Robert F. Kennedy', 'Audie Murphy', 'Thurgood Marshall', 'Joe Louis'],
    visitors: '4+ million annual visitors',
    established: '1864',
  },
  {
    name: 'Hollywood Forever Cemetery',
    location: 'Hollywood, California',
    description: 'The resting place of Hollywood\'s golden age stars. Features elaborate monuments and hosts movie screenings on the lawn.',
    notableBurials: ['Judy Garland', 'Mickey Rooney', 'Cecil B. DeMille', 'Douglas Fairbanks', 'Johnny Ramone'],
    visitors: '300,000+ annual visitors',
    established: '1899',
  },
  {
    name: 'Forest Lawn Memorial Park',
    location: 'Glendale, California',
    description: 'Known as "The Disneyland of Death," this sprawling memorial park houses numerous celebrities in private, unmarked graves.',
    notableBurials: ['Michael Jackson', 'Elizabeth Taylor', 'Clark Gable', 'Walt Disney', 'Humphrey Bogart'],
    visitors: '1+ million annual visitors',
    established: '1906',
  },
  {
    name: 'Graceland',
    location: 'Memphis, Tennessee',
    description: 'Elvis Presley\'s famous estate and final resting place. The Meditation Garden contains graves of Elvis and his family.',
    notableBurials: ['Elvis Presley', 'Gladys Presley', 'Vernon Presley', 'Minnie Mae Presley'],
    visitors: '600,000+ annual visitors',
    established: '1957 (as estate)',
  },
  {
    name: 'Westwood Village Memorial Park',
    location: 'Los Angeles, California',
    description: 'A small but star-studded cemetery hidden among skyscrapers in Westwood. Final resting place of Marilyn Monroe.',
    notableBurials: ['Marilyn Monroe', 'Dean Martin', 'Jack Lemmon', 'Natalie Wood', 'Roy Orbison'],
    visitors: '150,000+ annual visitors',
    established: '1904',
  },
  {
    name: 'Gate of Heaven Cemetery',
    location: 'Hawthorne, New York',
    description: 'Catholic cemetery north of New York City, final resting place of baseball legend Babe Ruth.',
    notableBurials: ['Babe Ruth', 'Billy Martin', 'James Cagney', 'Sal Mineo', 'Fred Allen'],
    visitors: '50,000+ annual visitors',
    established: '1917',
  },
];

const etiquetteTips = [
  {
    title: 'Maintain Quiet and Respect',
    description: 'Keep conversations low and avoid loud noises. Remember that cemeteries are sacred spaces for many families.',
  },
  {
    title: 'Follow Photography Rules',
    description: 'Many cemeteries allow photography, but be discreet. Never photograph active funerals or grieving families.',
  },
  {
    title: 'Stay on Designated Paths',
    description: 'Avoid walking over graves when possible. Use marked pathways to show respect for burial sites.',
  },
  {
    title: 'Do Not Disturb Grave Items',
    description: 'Never remove flowers, mementos, or decorations left by families. These items have deep personal meaning.',
  },
  {
    title: 'Check Cemetery Hours',
    description: 'Most cemeteries have specific visiting hours. Arrive with enough time to visit before closing.',
  },
  {
    title: 'Dress Appropriately',
    description: 'While there\'s no strict dress code, modest and respectful attire is appreciated.',
  },
];

const faqs = [
  {
    question: 'How do I find where a famous person is buried?',
    answer: 'You can find celebrity grave locations through several resources. Find A Grave (findagrave.com) is the largest online database of cemetery records. BillionGraves is another option with GPS-tagged locations. For U.S. presidents, the National Archives maintains official burial information. Our deaths calendar also tracks notable Americans and their burial locations when available.',
  },
  {
    question: 'Can anyone visit Arlington National Cemetery?',
    answer: 'Yes, Arlington National Cemetery is open to all visitors. The cemetery is open daily from 8 AM to 5 PM (extended hours in summer). The most-visited sites include the Tomb of the Unknown Soldier, JFK\'s eternal flame, and the Memorial Amphitheater. Guided tours are available, and you can take the ANC Explorer app for self-guided tours. Note that some areas may have restricted access during official ceremonies.',
  },
  {
    question: 'Are celebrity graves marked or unmarked?',
    answer: 'It varies significantly. Some celebrities have elaborate monuments designed to attract visitors, while others have simple markers or completely unmarked graves for privacy. Forest Lawn in Glendale is known for keeping many celebrity locations private. Hollywood Forever, in contrast, embraces tourism and even provides maps to famous graves. Always research before visiting to avoid disappointment.',
  },
  {
    question: 'Can I leave flowers or gifts at famous graves?',
    answer: 'Most cemeteries allow visitors to leave fresh flowers and small tokens of respect. However, some have specific rules about what can be left. Elvis\'s grave at Graceland regularly receives thousands of gifts from fans. Some cemeteries periodically remove items left at graves, so permanent displays shouldn\'t be expected. Always check with cemetery management for specific policies.',
  },
  {
    question: 'What is grave tourism or taphophilia?',
    answer: 'Taphophilia refers to an interest in cemeteries, tombstones, and funerary traditions. Grave tourism, or cemetery tourism, has become increasingly popular as people seek to connect with history and pay respects to cultural icons. Historic and celebrity cemeteries like Pere Lachaise in Paris and Hollywood Forever have embraced tourism, offering tours and events. This interest has helped preserve many historic burial grounds.',
  },
  {
    question: 'How do I trace my ancestry through cemetery records?',
    answer: 'Cemeteries are invaluable for genealogical research. Start with family records to identify cemeteries where ancestors might be buried. Use online databases like Find A Grave, BillionGraves, and Ancestry.com\'s cemetery records. Many county and state historical societies maintain cemetery transcriptions. Visit cemeteries in person when possible, as older stones may contain information not recorded elsewhere. Our search tool can help you locate cemeteries in your ancestral areas.',
  },
  {
    question: 'What are the most visited cemeteries in America?',
    answer: 'The most visited cemeteries include Arlington National Cemetery (4+ million visitors annually), Forest Lawn Memorial Parks in California, Hollywood Forever Cemetery, Graceland, and historic sites like Gettysburg National Cemetery. Historic cemeteries in New Orleans, Boston\'s Granary Burying Ground, and Congressional Cemetery in Washington D.C. also attract significant tourism.',
  },
  {
    question: 'Can I take photos at celebrity graves?',
    answer: 'Photography policies vary by cemetery. Most allow personal photography but prohibit commercial use without permission. Be respectful and never photograph active services or grieving visitors. Some high-profile graves like Marilyn Monroe\'s have specific viewing guidelines. Flash photography may be prohibited in mausoleums. When in doubt, ask cemetery staff about their photography policy.',
  },
];

export default function FamousGravesPage() {
  // JSON-LD structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Famous Graves in America: Complete Guide to Notable Burial Sites',
    description: 'Comprehensive guide to finding and visiting famous graves across America, including presidential burial sites, celebrity cemeteries, and historic burial grounds.',
    author: {
      '@type': 'Organization',
      name: 'Cemetery Near Me',
      url: 'https://www.cemeterynearbyme.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cemetery Near Me',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cemeterynearbyme.com/logo.png',
      },
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.cemeterynearbyme.com/guide/famous-graves',
    },
    about: [
      { '@type': 'Thing', name: 'Famous burial sites' },
      { '@type': 'Thing', name: 'Cemetery tourism' },
      { '@type': 'Thing', name: 'Presidential graves' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
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
        name: 'Guide',
        item: 'https://www.cemeterynearbyme.com/guide',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Famous Graves',
        item: 'https://www.cemeterynearbyme.com/guide/famous-graves',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guide</Link></li>
                <li>/</li>
                <li className="text-white">Famous Graves</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <Star className="w-8 h-8 text-gold-400" />
              <span className="text-gold-400 font-medium">Pillar Guide</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
              Famous Graves in America: Notable Burial Sites
            </h1>
            <p className="text-white/80 text-lg max-w-3xl mb-6">
              Discover the final resting places of presidents, celebrities, musicians, athletes,
              and historic figures across America. From Arlington National Cemetery to Hollywood Forever,
              explore the stories and locations of notable burial sites.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                39,000+ notable Americans tracked
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                50 states covered
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Updated regularly
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The United States is home to countless historic cemeteries where American legends rest eternally.
                From the hallowed grounds of Arlington National Cemetery to the star-studded avenues of Hollywood Forever,
                these sacred spaces offer visitors a unique connection to history, culture, and the individuals who shaped our nation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re tracing your genealogy, paying respects to a personal hero, or simply exploring
                America&apos;s rich cultural heritage, visiting famous graves has become an increasingly popular pursuit
                known as cemetery tourism or taphophilia. This comprehensive guide will help you discover, locate,
                and respectfully visit the burial sites of notable Americans.
              </p>
            </div>

            <LeaderboardAd />

            {/* Categories Section */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Categories of Famous Burials</h2>
              <p className="text-muted-foreground mb-8">
                Our database tracks over 39,000 notable Americans across various fields of achievement.
                From political leaders to entertainment icons, here are the major categories of famous graves you can explore:
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {famousCategories.map((category) => (
                  <Card key={category.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <span className="text-xs text-muted-foreground">{category.count}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="space-y-1">
                        {category.examples.slice(0, 3).map((example) => (
                          <p key={example} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-accent">•</span>
                            {example}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <InlineAd />

            {/* Understanding Cemetery Tourism */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Understanding Cemetery Tourism</h2>
              <Card className="p-8 bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground">
                    Cemetery tourism, also known as dark tourism or taphophilia, has grown significantly in recent decades.
                    What was once considered morbid curiosity is now recognized as a meaningful way to connect with history,
                    honor cultural icons, and appreciate the artistry of memorial architecture.
                  </p>
                  <p className="text-muted-foreground">
                    Historic cemeteries are outdoor museums of art, architecture, and social history. The monuments and
                    epitaphs tell stories of love, loss, and legacy. Victorian-era cemeteries like Mount Auburn in
                    Massachusetts pioneered the garden cemetery movement, creating peaceful landscapes that served as
                    public parks before dedicated park systems existed.
                  </p>
                  <p className="text-muted-foreground mb-0">
                    Today, cemeteries like Hollywood Forever embrace tourism by hosting movie screenings, concerts, and
                    guided tours. This shift has helped fund preservation efforts and introduced younger generations to
                    the cultural significance of memorial spaces.
                  </p>
                </div>
              </Card>
            </section>

            {/* Top Cemeteries for Famous Graves */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Top Cemeteries for Famous Graves</h2>
              <p className="text-muted-foreground mb-8">
                While notable Americans are buried in cemeteries across all 50 states, certain locations have become
                pilgrimage destinations for those seeking to pay respects to cultural icons and historical figures.
              </p>

              <div className="space-y-6">
                {topCemeteries.map((cemetery) => (
                  <Card key={cemetery.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold mb-1">{cemetery.name}</h3>
                          <p className="text-sm text-accent font-medium mb-3 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {cemetery.location}
                          </p>
                          <p className="text-muted-foreground mb-4">{cemetery.description}</p>
                          <div>
                            <p className="text-sm font-medium mb-2">Notable Burials:</p>
                            <div className="flex flex-wrap gap-2">
                              {cemetery.notableBurials.map((name) => (
                                <span key={name} className="text-xs bg-secondary px-2 py-1 rounded">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground md:text-right">
                          <div className="flex items-center gap-2 md:justify-end">
                            <Users className="w-4 h-4" />
                            <span>{cemetery.visitors}</span>
                          </div>
                          <div className="flex items-center gap-2 md:justify-end">
                            <Calendar className="w-4 h-4" />
                            <span>Est. {cemetery.established}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <InlineAd />

            {/* How to Find Celebrity Graves */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">How to Find Celebrity Graves</h2>
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-muted-foreground">
                  Locating the grave of a famous person requires research, as not all burial sites are publicly
                  disclosed. Here are the most effective methods for finding celebrity and historical graves:
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold mb-2">Online Databases</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Find A Grave (findagrave.com) is the largest collection of cemetery records with millions of entries.
                        BillionGraves offers GPS-tagged locations. Both are community-maintained and regularly updated.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Many famous graves include photos of headstones, cemetery maps, and directions.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold mb-2">Deaths Calendar</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Our <Link href="/deaths" className="text-accent hover:underline">deaths calendar</Link> tracks
                        notable Americans who passed away on each day of the year, with burial information when available.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Currently tracking 39,000+ notable individuals with cemetery connections.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold mb-2">Cemetery Records</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Contact cemeteries directly for burial records. Many larger cemeteries maintain databases
                        and can provide grave locations, section numbers, and visiting hours.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Use our <Link href="/search" className="text-accent hover:underline">cemetery search</Link> to find contact information.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <Camera className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold mb-2">Photo Documentation</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Volunteers photograph headstones and upload them to online databases. You can contribute
                        by photographing unmarked graves in your local cemeteries.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This community effort helps preserve history and assists genealogical research.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Presidential Burial Sites */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Presidential Burial Sites</h2>
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-muted-foreground">
                  All 39 deceased presidents are buried across 19 states, with many presidential libraries and
                  estates serving as final resting places. Presidential graves often become pilgrimage sites
                  for Americans seeking to connect with history.
                </p>
              </div>

              <Card className="p-6 mb-6">
                <h3 className="font-serif font-semibold text-lg mb-4">Notable Presidential Burial Sites</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Most Visited</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        JFK - Arlington National Cemetery, VA
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Abraham Lincoln - Oak Ridge Cemetery, IL
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        George Washington - Mount Vernon, VA
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Thomas Jefferson - Monticello, VA
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">States with Multiple Presidents</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Virginia - 4 presidents
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        New York - 5 presidents
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Ohio - 7 presidents
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        California - 2 presidents
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <p className="text-muted-foreground">
                Presidential libraries operated by the National Archives and Records Administration often include
                burial sites or memorial gardens. These facilities offer educational exhibits about each president&apos;s
                life and legacy, making them ideal destinations for combining historical learning with respectful visitation.
              </p>
            </section>

            <InlineAd />

            {/* Cemetery Visiting Etiquette */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Cemetery Visiting Etiquette</h2>
              <p className="text-muted-foreground mb-8">
                Visiting famous graves is a meaningful experience, but it&apos;s essential to remember that cemeteries
                are sacred spaces where families gather to grieve and remember loved ones. Following proper etiquette
                ensures a respectful visit for everyone.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {etiquetteTips.map((tip) => (
                  <Card key={tip.title} className="p-5 border-l-4 border-l-accent">
                    <h3 className="font-serif font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-6 mt-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Important Reminder</h3>
                    <p className="text-sm text-muted-foreground">
                      Some celebrity families have requested privacy or limited access to grave sites.
                      Always respect any barriers, signs, or requests from cemetery staff. The goal of
                      cemetery tourism should be to honor the deceased, not to treat graves as tourist attractions.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Genealogy Connection */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Connecting with Your Ancestry</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  Beyond celebrity graves, cemeteries are invaluable resources for genealogical research.
                  Headstones often contain information not found in official records, including birth dates,
                  death dates, family relationships, maiden names, and sometimes entire family histories.
                </p>
                <p className="text-muted-foreground mb-6">
                  Historic cemeteries can reveal patterns of immigration, religious affiliations, causes of death
                  during epidemics, and social structures of communities. Many genealogists consider cemetery
                  visits essential to understanding their family history.
                </p>
                <p className="text-muted-foreground">
                  Our cemetery database includes {SITE_STATS.totalCemeteriesDisplay}+ locations across all 50 states,
                  helping you locate burial grounds where your ancestors may rest. Combined with online records and
                  local historical societies, cemetery research can break through genealogical brick walls.
                </p>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-left font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <InlineAd />

            {/* CTA Section */}
            <section className="text-center">
              <Card className="p-8 bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <h2 className="font-serif text-2xl font-bold mb-4">
                  Explore Notable Deaths Calendar
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Discover which notable Americans passed away on any day of the year.
                  Learn about their lives and find their final resting places.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/deaths"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    Deaths Calendar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    Find Cemeteries
                  </Link>
                </div>
              </Card>
            </section>

            {/* Author Attribution */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>About this guide:</strong> This comprehensive guide to famous graves in America is maintained by the
                Cemetery Near Me editorial team. We strive to provide accurate, respectful, and helpful information
                for those researching burial sites and planning cemetery visits. Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
