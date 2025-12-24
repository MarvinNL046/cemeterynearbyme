import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ExternalLink, User, ChevronLeft, ChevronRight } from 'lucide-react';
import famousDeathsData from '@/data/famous-deaths.json';

const MONTHS = [
  { name: 'januari', month: 1, days: 31, full: 'Januari' },
  { name: 'februari', month: 2, days: 29, full: 'Februari' },
  { name: 'maart', month: 3, days: 31, full: 'Maart' },
  { name: 'april', month: 4, days: 30, full: 'April' },
  { name: 'mei', month: 5, days: 31, full: 'Mei' },
  { name: 'juni', month: 6, days: 30, full: 'Juni' },
  { name: 'juli', month: 7, days: 31, full: 'Juli' },
  { name: 'augustus', month: 8, days: 31, full: 'Augustus' },
  { name: 'september', month: 9, days: 30, full: 'September' },
  { name: 'oktober', month: 10, days: 31, full: 'Oktober' },
  { name: 'november', month: 11, days: 30, full: 'November' },
  { name: 'december', month: 12, days: 31, full: 'December' },
];

function getMonthBySlug(slug: string) {
  return MONTHS.find(m => m.name === slug.toLowerCase());
}

function getDeathsForDate(day: number, month: number) {
  return famousDeathsData.deaths
    .filter(person => person.sterfdag === day && person.sterfmaand === month && person.sterfdatum)
    .sort((a, b) => {
      const yearA = a.sterfdatum ? parseInt(a.sterfdatum.split('-')[0]) : 0;
      const yearB = b.sterfdatum ? parseInt(b.sterfdatum.split('-')[0]) : 0;
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
  params: Promise<{ maand: string; dag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { maand, dag } = await params;
  const monthData = getMonthBySlug(maand);
  const dayNum = parseInt(dag);

  if (!monthData || isNaN(dayNum) || dayNum < 1 || dayNum > monthData.days) {
    return { title: 'Niet gevonden' };
  }

  const deaths = getDeathsForDate(dayNum, monthData.month);
  const dateStr = `${dayNum} ${monthData.full}`;

  return {
    title: `Overleden op ${dateStr} | Begraafplaats in de Buurt`,
    description: deaths.length > 0
      ? `${deaths.length} beroemde ${deaths.length === 1 ? 'Nederlander of Belg' : 'Nederlanders en Belgen'} overleden op ${dateStr}: ${deaths.slice(0, 3).map(d => d.naam).join(', ')}${deaths.length > 3 ? ' en meer' : ''}.`
      : `Bekijk welke beroemde Nederlanders en Belgen op ${dateStr} zijn overleden.`,
    openGraph: {
      title: `Overleden op ${dateStr}`,
      description: `Beroemde Nederlanders en Belgen die op ${dateStr} zijn overleden.`,
    }
  };
}

export async function generateStaticParams() {
  const params: { maand: string; dag: string }[] = [];

  for (const month of MONTHS) {
    for (let day = 1; day <= month.days; day++) {
      params.push({
        maand: month.name,
        dag: day.toString(),
      });
    }
  }

  return params;
}

export default async function OverledenDagPage({ params }: PageProps) {
  const { maand, dag } = await params;
  const monthData = getMonthBySlug(maand);
  const dayNum = parseInt(dag);

  if (!monthData || isNaN(dayNum) || dayNum < 1 || dayNum > monthData.days) {
    notFound();
  }

  const deaths = getDeathsForDate(dayNum, monthData.month);
  const dateStr = `${dayNum} ${monthData.full}`;
  const { prev, next } = getPrevNextDay(dayNum, monthData.month);

  // Check if this is today
  const today = new Date();
  const isToday = today.getDate() === dayNum && today.getMonth() + 1 === monthData.month;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Beroemde personen overleden op ${dateStr}`,
    description: `Overzicht van beroemde Nederlanders en Belgen die op ${dateStr} zijn overleden`,
    numberOfItems: deaths.length,
    itemListElement: deaths.map((person, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: person.naam,
        birthDate: person.geboortedatum || undefined,
        deathDate: person.sterfdatum,
        jobTitle: person.beroep,
        nationality: person.land || 'Nederland',
        ...(person.wikipedia && { sameAs: person.wikipedia }),
        ...(person.begraafplaats && {
          deathPlace: {
            '@type': 'Cemetery',
            name: person.begraafplaats,
            address: person.plaats || undefined,
          }
        })
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
              <Link href="/overleden" className="hover:text-white transition-colors">
                Kalender
              </Link>
              <span>/</span>
              <span className="text-gold-300">{dateStr}</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-gold-400" />
              {isToday && (
                <span className="bg-accent text-white text-sm font-medium px-3 py-1 rounded-full">
                  Vandaag
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              {dateStr}
            </h1>
            <p className="text-white/80 text-lg">
              {deaths.length > 0
                ? `${deaths.length} beroemde ${deaths.length === 1 ? 'Nederlander of Belg' : 'Nederlanders en Belgen'} overleden op deze dag`
                : 'Geen bekende sterfgevallen op deze dag in onze database'
              }
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b bg-white sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              {prev && (
                <Link
                  href={`/overleden/${prev.month}/${prev.day}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{prev.day} {MONTHS.find(m => m.name === prev.month)?.full}</span>
                  <span className="sm:hidden">Vorige</span>
                </Link>
              )}
              <Link
                href="/overleden"
                className="text-sm font-medium text-accent hover:underline"
              >
                Kalender
              </Link>
              {next && (
                <Link
                  href={`/overleden/${next.month}/${next.day}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <span className="hidden sm:inline">{next.day} {MONTHS.find(m => m.name === next.month)?.full}</span>
                  <span className="sm:hidden">Volgende</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {deaths.length > 0 ? (
            <div className="grid gap-6">
              {deaths.map((person, index) => (
                <article
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-slate-100"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Person Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span className="bg-secondary px-2 py-1 rounded">
                            {person.beroep}
                          </span>
                          {person.land && person.land !== 'Nederland' && (
                            <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded">
                              {person.land}
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                          {person.naam}
                        </h2>

                        {person.bekendheid && (
                          <p className="text-muted-foreground mb-4">
                            {person.bekendheid}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>
                              {person.geboortedatum ? getYear(person.geboortedatum) : '?'} - {getYear(person.sterfdatum!)}
                            </span>
                            {person.geboortedatum && person.sterfdatum && (
                              <span className="text-muted-foreground/60">
                                ({calculateAge(person.geboortedatum, person.sterfdatum)} jaar)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cemetery Info */}
                      <div className="md:text-right">
                        {person.begraafplaats && (
                          <div className="bg-secondary/50 rounded-lg p-4 inline-block">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <MapPin className="w-4 h-4" />
                              <span className="font-medium">Laatste rustplaats</span>
                            </div>
                            <p className="font-serif text-lg text-foreground">
                              {person.begraafplaats}
                            </p>
                            {person.plaats && (
                              <p className="text-sm text-muted-foreground">
                                {person.plaats}
                                {person.provincie && `, ${person.provincie}`}
                              </p>
                            )}

                            {person.begraafplaats_slug && (
                              <Link
                                href={`/begraafplaats/${person.begraafplaats_slug}`}
                                className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-2"
                              >
                                Bekijk begraafplaats →
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Wikipedia Link */}
                    {person.wikipedia && (
                      <div className="mt-4 pt-4 border-t">
                        <a
                          href={person.wikipedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Lees meer op Wikipedia
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Geen bekende sterfgevallen gevonden
              </h2>
              <p className="text-muted-foreground mb-6">
                In onze database zijn geen beroemde Nederlanders of Belgen gevonden die op {dateStr} zijn overleden.
              </p>
              <Link
                href="/overleden"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                ← Terug naar kalender
              </Link>
            </div>
          )}

          {/* Related dates */}
          {deaths.length > 0 && (
            <div className="mt-12 bg-secondary/50 rounded-xl p-6">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Bekijk andere dagen
              </h3>
              <div className="flex flex-wrap gap-2">
                {[-3, -2, -1, 1, 2, 3].map(offset => {
                  const date = new Date(2024, monthData.month - 1, dayNum + offset);
                  const d = date.getDate();
                  const m = date.getMonth();
                  const monthSlug = MONTHS[m].name;
                  const count = getDeathsForDate(d, m + 1).length;

                  return (
                    <Link
                      key={offset}
                      href={`/overleden/${monthSlug}/${d}`}
                      className="px-4 py-2 bg-white rounded-lg border hover:border-accent hover:text-accent transition-colors text-sm"
                    >
                      {d} {MONTHS[m].full}
                      {count > 0 && <span className="ml-1 text-muted-foreground">({count})</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
