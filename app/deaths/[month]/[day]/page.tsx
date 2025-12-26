import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import famousDeathsData from '@/data/famous-deaths.json';

const MONTHS = [
  { name: 'january', month: 1, days: 31, full: 'January' },
  { name: 'february', month: 2, days: 29, full: 'February' },
  { name: 'march', month: 3, days: 31, full: 'March' },
  { name: 'april', month: 4, days: 30, full: 'April' },
  { name: 'may', month: 5, days: 31, full: 'May' },
  { name: 'june', month: 6, days: 30, full: 'June' },
  { name: 'july', month: 7, days: 31, full: 'July' },
  { name: 'august', month: 8, days: 31, full: 'August' },
  { name: 'september', month: 9, days: 30, full: 'September' },
  { name: 'october', month: 10, days: 31, full: 'October' },
  { name: 'november', month: 11, days: 30, full: 'November' },
  { name: 'december', month: 12, days: 31, full: 'December' },
];

function getMonthBySlug(slug: string) {
  return MONTHS.find(m => m.name === slug.toLowerCase());
}

function getDeathsForDate(day: number, month: number) {
  return famousDeathsData.deaths
    .filter(person => person.death_day === day && person.death_month === month && person.death_date)
    .sort((a, b) => {
      const yearA = a.death_date ? parseInt(a.death_date.split('-')[0]) : 0;
      const yearB = b.death_date ? parseInt(b.death_date.split('-')[0]) : 0;
      return yearB - yearA;
    });
}

function calculateAge(birthDate: string, deathDate: string): number {
  const birth = new Date(birthDate);
  const death = new Date(deathDate);
  let age = death.getFullYear() - birth.getFullYear();
  const monthDiff = death.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getYear(dateString: string): string {
  return dateString.split('-')[0];
}

function getPrevNextDay(day: number, month: number): { prev: { day: number; month: string } | null; next: { day: number; month: string } | null } {
  const monthData = MONTHS[month - 1];
  const prevMonthData = MONTHS[month === 1 ? 11 : month - 2];
  const nextMonthData = MONTHS[month === 12 ? 0 : month];

  let prev = null;
  let next = null;

  if (day > 1) {
    prev = { day: day - 1, month: monthData.name };
  } else {
    prev = { day: prevMonthData.days, month: prevMonthData.name };
  }

  if (day < monthData.days) {
    next = { day: day + 1, month: monthData.name };
  } else {
    next = { day: 1, month: nextMonthData.name };
  }

  return { prev, next };
}

interface PageProps {
  params: Promise<{ month: string; day: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, day } = await params;
  const monthData = getMonthBySlug(month);
  const dayNum = parseInt(day);

  if (!monthData || isNaN(dayNum) || dayNum < 1 || dayNum > monthData.days) {
    return { title: 'Not Found' };
  }

  const deaths = getDeathsForDate(dayNum, monthData.month);
  const dateStr = `${monthData.full} ${dayNum}`;

  return {
    title: `Deaths on ${dateStr} | Cemetery Near Me`,
    description: deaths.length > 0
      ? `${deaths.length} notable Americans passed away on ${dateStr}: ${deaths.slice(0, 3).map(d => d.name).join(', ')}${deaths.length > 3 ? ' and more' : ''}.`
      : `Discover notable Americans who passed away on ${dateStr}.`,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `Deaths on ${dateStr}`,
      description: `Notable Americans who passed away on ${dateStr}.`,
    }
  };
}

export async function generateStaticParams() {
  const params: { month: string; day: string }[] = [];

  for (const month of MONTHS) {
    for (let day = 1; day <= month.days; day++) {
      params.push({
        month: month.name,
        day: day.toString(),
      });
    }
  }

  return params;
}

export default async function DeathsDayPage({ params }: PageProps) {
  const { month, day } = await params;
  const monthData = getMonthBySlug(month);
  const dayNum = parseInt(day);

  if (!monthData || isNaN(dayNum) || dayNum < 1 || dayNum > monthData.days) {
    notFound();
  }

  const deaths = getDeathsForDate(dayNum, monthData.month);
  const dateStr = `${monthData.full} ${dayNum}`;
  const { prev, next } = getPrevNextDay(dayNum, monthData.month);

  // Check if this is today
  const today = new Date();
  const isToday = today.getDate() === dayNum && today.getMonth() + 1 === monthData.month;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Notable Americans who died on ${dateStr}`,
    description: `Overview of notable Americans who passed away on ${dateStr}`,
    numberOfItems: deaths.length,
    itemListElement: deaths.map((person, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: person.name,
        birthDate: person.birth_date || undefined,
        deathDate: person.death_date,
        jobTitle: person.profession,
        nationality: 'American',
        sameAs: person.wikipedia || undefined,
        deathPlace: person.cemetery ? {
          '@type': 'Cemetery',
          name: person.cemetery,
          address: person.city && person.state ? `${person.city}, ${person.state}` : undefined,
        } : undefined
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link href="/deaths" className="hover:text-white transition-colors">
                Calendar
              </Link>
              <span>/</span>
              <span className="text-gold-300">{dateStr}</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-gold-400" />
              {isToday && (
                <span className="bg-accent text-white text-sm font-medium px-3 py-1 rounded-full">
                  Today
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              {dateStr}
            </h1>
            <p className="text-white/80 text-lg">
              {deaths.length > 0
                ? `${deaths.length} notable Americans passed away on this day`
                : 'Notable Americans who passed away on this day'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b bg-white sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              {prev && (
                <Link
                  href={`/deaths/${prev.month}/${prev.day}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{MONTHS.find(m => m.name === prev.month)?.full} {prev.day}</span>
                  <span className="sm:hidden">Previous</span>
                </Link>
              )}
              <Link
                href="/deaths"
                className="text-sm font-medium text-accent hover:underline"
              >
                Calendar
              </Link>
              {next && (
                <Link
                  href={`/deaths/${next.month}/${next.day}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <span className="hidden sm:inline">{MONTHS.find(m => m.name === next.month)?.full} {next.day}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {deaths.length > 0 ? (
            <>
              {/* Stats bar */}
              <div className="flex gap-4 mb-6 text-sm text-muted-foreground">
                <span>{deaths.length} people</span>
                <span>•</span>
                <span>{deaths.filter(d => d.cemetery).length} with known burial location</span>
              </div>

              {/* Deaths list */}
              <div className="grid gap-4">
                {deaths.map((person, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-foreground">
                          {person.name}
                        </h2>
                        <p className="text-muted-foreground">
                          {person.profession}
                        </p>
                        {person.birth_date && person.death_date && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {getYear(person.birth_date)} – {getYear(person.death_date)}
                            <span className="text-muted-foreground/60 ml-1">
                              (aged {calculateAge(person.birth_date, person.death_date)})
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-secondary px-3 py-1 rounded-full">
                          † {getYear(person.death_date)}
                        </span>
                      </div>
                    </div>

                    {person.cemetery && (
                      <div className="flex items-start gap-2 mt-3 pt-3 border-t text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          {person.cemetery_slug ? (
                            <Link
                              href={`/cemetery/${person.cemetery_slug}`}
                              className="font-medium text-accent hover:underline"
                            >
                              {person.cemetery}
                            </Link>
                          ) : (
                            <p className="font-medium text-foreground">{person.cemetery}</p>
                          )}
                          {person.city && person.state && (
                            <p>{person.city}, {person.state}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {person.wikipedia && (
                      <div className="mt-3 pt-3 border-t">
                        <a
                          href={person.wikipedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Wikipedia
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No records for this date
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We don&apos;t have any notable American deaths recorded for {dateStr} yet.
              </p>
              <Link
                href="/deaths"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                ← Back to calendar
              </Link>
            </div>
          )}

          {/* Related dates */}
          <div className="mt-12 bg-secondary/50 rounded-xl p-6">
            <h3 className="font-serif text-xl font-bold text-foreground mb-4">
              Browse other dates
            </h3>
            <div className="flex flex-wrap gap-2">
              {[-3, -2, -1, 1, 2, 3].map(offset => {
                const date = new Date(2024, monthData.month - 1, dayNum + offset);
                const d = date.getDate();
                const m = date.getMonth();
                const monthSlug = MONTHS[m].name;

                return (
                  <Link
                    key={offset}
                    href={`/deaths/${monthSlug}/${d}`}
                    className="px-4 py-2 bg-white rounded-lg border hover:border-accent hover:text-accent transition-colors text-sm"
                  >
                    {MONTHS[m].full} {d}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
