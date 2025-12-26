import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, ExternalLink, User, ChevronRight } from 'lucide-react';

// Placeholder data - will be populated by wikidata script
const famousDeathsData = { deaths: [] as any[] };

// Get today's date
function getToday() {
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    monthName: now.toLocaleDateString('en-US', { month: 'long' }),
    fullDate: now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  };
}

// Get deaths for a specific day/month
function getDeathsForDate(day: number, month: number) {
  return famousDeathsData.deaths.filter(
    (person: any) => person.death_day === day && person.death_month === month && person.death_date
  ).sort((a: any, b: any) => {
    const yearA = a.death_date ? parseInt(a.death_date.split('-')[0]) : 0;
    const yearB = b.death_date ? parseInt(b.death_date.split('-')[0]) : 0;
    return yearB - yearA;
  });
}

// Calculate age at death
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

export async function generateMetadata(): Promise<Metadata> {
  const today = getToday();
  const deaths = getDeathsForDate(today.day, today.month);

  return {
    title: `This Day in History - ${today.fullDate} | CemeteryNearMe.com`,
    description: deaths.length > 0
      ? `On ${today.monthName} ${today.day}: ${deaths.slice(0, 3).map((d: any) => d.name).join(', ')}${deaths.length > 3 ? ' and more' : ''} passed away.`
      : `Discover famous Americans who passed away on ${today.monthName} ${today.day} throughout history.`,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `This Day in History - ${today.fullDate}`,
      description: `Famous Americans who passed away on ${today.monthName} ${today.day}.`,
    }
  };
}

export default function TodayPage() {
  const today = getToday();
  const todayDeaths = getDeathsForDate(today.day, today.month);

  const monthSlug = today.monthName.toLowerCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/calendar" className="hover:text-white transition-colors">
              Calendar
            </Link>
            <span>/</span>
            <span className="text-gold-300">Today</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-gold-400" />
            <span className="text-gold-400 font-medium">This Day in History</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            {today.fullDate}
          </h1>
          <p className="text-white/80 text-lg">
            {todayDeaths.length > 0
              ? `${todayDeaths.length} famous ${todayDeaths.length === 1 ? 'American' : 'Americans'} passed away on this day`
              : 'No notable deaths found for this day in our database'
            }
          </p>
        </div>
      </div>

      {/* Link to permanent date page */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <Link
            href={`/calendar/${monthSlug}/${today.day}`}
            className="flex items-center justify-between py-3 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <span>View the permanent page for {today.monthName} {today.day}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {todayDeaths.length > 0 ? (
          <div className="grid gap-6">
            {todayDeaths.map((person: any, index: number) => (
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
                          {person.profession}
                        </span>
                        {person.state && (
                          <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded">
                            {person.state}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                        {person.name}
                      </h2>

                      {person.description && (
                        <p className="text-muted-foreground mb-4">
                          {person.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>
                            {person.birth_date ? getYear(person.birth_date) : '?'} - {getYear(person.death_date!)}
                          </span>
                          {person.birth_date && person.death_date && (
                            <span className="text-muted-foreground/60">
                              ({calculateAge(person.birth_date, person.death_date)} years old)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cemetery Info */}
                    <div className="md:text-right">
                      {person.cemetery && (
                        <div className="bg-secondary/50 rounded-lg p-4 inline-block">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">Final Resting Place</span>
                          </div>
                          <p className="font-serif text-lg text-foreground">
                            {person.cemetery}
                          </p>
                          {person.city && (
                            <p className="text-sm text-muted-foreground">
                              {person.city}
                              {person.state && `, ${person.state}`}
                            </p>
                          )}

                          {person.cemetery_slug && (
                            <Link
                              href={`/cemetery/${person.cemetery_slug}`}
                              className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-2"
                            >
                              View cemetery →
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
                        Read more on Wikipedia
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
              No Notable Deaths Found
            </h2>
            <p className="text-muted-foreground mb-6">
              No famous Americans in our database passed away on {today.monthName} {today.day}.
            </p>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              ← View the full calendar
            </Link>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-secondary/50 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-3">
            Explore the Death Calendar
          </h3>
          <p className="text-muted-foreground mb-4">
            This page shows which famous Americans passed away on this date throughout history.
            Browse the full calendar to discover notable deaths on any day of the year.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/calendar"
              className="text-accent hover:underline"
            >
              → View calendar
            </Link>
            <Link
              href="/"
              className="text-accent hover:underline"
            >
              → Find a cemetery
            </Link>
            <Link
              href="/state"
              className="text-accent hover:underline"
            >
              → Browse by state
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
