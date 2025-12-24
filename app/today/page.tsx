import { Metadata } from 'next';
import Link from 'next/link';
import famousDeathsData from '@/data/famous-deaths.json';
import { Calendar, MapPin, ExternalLink, User, ChevronRight } from 'lucide-react';

// Get today's date
function getToday() {
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1, // JavaScript months are 0-indexed
    monthName: now.toLocaleDateString('nl-NL', { month: 'long' }),
    fullDate: now.toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  };
}

// Get deaths for a specific day/month
function getDeathsForDate(day: number, month: number) {
  return famousDeathsData.deaths.filter(
    person => person.sterfdag === day && person.sterfmaand === month && person.sterfdatum
  ).sort((a, b) => {
    // Sort by death year (most recent first)
    const yearA = a.sterfdatum ? parseInt(a.sterfdatum.split('-')[0]) : 0;
    const yearB = b.sterfdatum ? parseInt(b.sterfdatum.split('-')[0]) : 0;
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

// Format year from date string
function getYear(dateString: string): string {
  return dateString.split('-')[0];
}

export async function generateMetadata(): Promise<Metadata> {
  const today = getToday();
  const deaths = getDeathsForDate(today.day, today.month);

  return {
    title: `Vandaag Overleden - ${today.fullDate} | Begraafplaats in de Buurt`,
    description: deaths.length > 0
      ? `Op ${today.day} ${today.monthName} overleden: ${deaths.slice(0, 3).map(d => d.naam).join(', ')}${deaths.length > 3 ? ' en meer' : ''}.`
      : `Bekijk welke beroemde Nederlanders en Belgen op ${today.day} ${today.monthName} zijn overleden.`,
    openGraph: {
      title: `Vandaag Overleden - ${today.fullDate}`,
      description: `Beroemde Nederlanders en Belgen die op ${today.day} ${today.monthName} zijn overleden.`,
    }
  };
}

export default function VandaagOverledenPage() {
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
            <Link href="/overleden" className="hover:text-white transition-colors">
              Kalender
            </Link>
            <span>/</span>
            <span className="text-gold-300">Vandaag</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-gold-400" />
            <span className="text-gold-400 font-medium">Vandaag in de Geschiedenis</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            {today.fullDate}
          </h1>
          <p className="text-white/80 text-lg">
            {todayDeaths.length > 0
              ? `${todayDeaths.length} beroemde ${todayDeaths.length === 1 ? 'Nederlander of Belg' : 'Nederlanders en Belgen'} overleden op deze dag`
              : 'Geen bekende sterfgevallen op deze dag in onze database'
            }
          </p>
        </div>
      </div>

      {/* Link to permanent date page */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <Link
            href={`/overleden/${monthSlug}/${today.day}`}
            className="flex items-center justify-between py-3 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <span>Bekijk de permanente pagina voor {today.day} {today.monthName}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {todayDeaths.length > 0 ? (
          <div className="grid gap-6">
            {todayDeaths.map((person, index) => (
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
              In onze database zijn geen beroemde Nederlanders of Belgen gevonden die op {today.day} {today.monthName} zijn overleden.
            </p>
            <Link
              href="/overleden"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              ← Bekijk de volledige kalender
            </Link>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-secondary/50 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-3">
            Bekijk de volledige kalender
          </h3>
          <p className="text-muted-foreground mb-4">
            Op deze pagina tonen we dagelijks welke beroemde Nederlanders en Belgen op deze datum zijn overleden.
            Bekijk de volledige kalender om alle dagen van het jaar te verkennen.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/overleden"
              className="text-accent hover:underline"
            >
              → Bekijk kalender
            </Link>
            <Link
              href="/"
              className="text-accent hover:underline"
            >
              → Zoek een begraafplaats
            </Link>
            <Link
              href="/blog"
              className="text-accent hover:underline"
            >
              → Lees onze blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
