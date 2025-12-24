import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';
import famousDeathsData from '@/data/famous-deaths.json';

export const metadata: Metadata = {
  title: 'Overleden op deze dag - Kalender | Begraafplaats in de Buurt',
  description: 'Ontdek welke beroemde Nederlanders en Belgen op elke dag van het jaar zijn overleden. Blader door de kalender en bezoek hun laatste rustplaats.',
  openGraph: {
    title: 'Overleden op deze dag - Kalender',
    description: 'Ontdek welke beroemde Nederlanders en Belgen op elke dag van het jaar zijn overleden.',
  }
};

const MONTHS = [
  { name: 'Januari', slug: 'januari', days: 31 },
  { name: 'Februari', slug: 'februari', days: 29 },
  { name: 'Maart', slug: 'maart', days: 31 },
  { name: 'April', slug: 'april', days: 30 },
  { name: 'Mei', slug: 'mei', days: 31 },
  { name: 'Juni', slug: 'juni', days: 30 },
  { name: 'Juli', slug: 'juli', days: 31 },
  { name: 'Augustus', slug: 'augustus', days: 31 },
  { name: 'September', slug: 'september', days: 30 },
  { name: 'Oktober', slug: 'oktober', days: 31 },
  { name: 'November', slug: 'november', days: 30 },
  { name: 'December', slug: 'december', days: 31 },
];

function getDeathCountForDay(day: number, month: number): number {
  return famousDeathsData.deaths.filter(
    person => person.sterfdag === day && person.sterfmaand === month
  ).length;
}

function getTotalDeathsForMonth(month: number): number {
  return famousDeathsData.deaths.filter(
    person => person.sterfmaand === month
  ).length;
}

export default function OverledenKalenderPage() {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-gold-400" />
            <span className="text-gold-400 font-medium">Historische Kalender</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Overleden op deze dag
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Ontdek welke beroemde Nederlanders en Belgen op elke dag van het jaar zijn overleden.
            Klik op een dag om meer te lezen over hun leven en laatste rustplaats.
          </p>
          <div className="flex items-center gap-2 mt-4 text-gold-300">
            <Users className="w-5 h-5" />
            <span>{famousDeathsData.deaths.length} personen in de database</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick link to today */}
        <div className="mb-8 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <Link
            href={`/overleden/${MONTHS[currentMonth - 1].slug}/${currentDay}`}
            className="flex items-center justify-between group"
          >
            <div>
              <p className="text-sm text-muted-foreground">Vandaag</p>
              <p className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {currentDay} {MONTHS[currentMonth - 1].name}
              </p>
            </div>
            <div className="text-accent font-medium">
              Bekijk →
            </div>
          </Link>
        </div>

        {/* Calendar Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MONTHS.map((month, monthIndex) => (
            <div key={month.slug} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="bg-forest-800 text-white px-4 py-3 flex justify-between items-center">
                <h2 className="font-serif font-semibold">{month.name}</h2>
                <span className="text-sm text-gold-300">
                  {getTotalDeathsForMonth(monthIndex + 1)} personen
                </span>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(day => (
                    <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for alignment (simplified - not actual calendar) */}
                  {Array.from({ length: month.days }, (_, i) => {
                    const day = i + 1;
                    const count = getDeathCountForDay(day, monthIndex + 1);
                    const isToday = day === currentDay && monthIndex + 1 === currentMonth;

                    return (
                      <Link
                        key={day}
                        href={`/overleden/${month.slug}/${day}`}
                        className={`
                          aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                          transition-all hover:scale-110
                          ${isToday
                            ? 'bg-accent text-white font-bold ring-2 ring-accent ring-offset-2'
                            : count > 0
                              ? 'bg-forest-100 text-forest-800 hover:bg-forest-200 font-medium'
                              : 'text-muted-foreground hover:bg-secondary'
                          }
                        `}
                        title={count > 0 ? `${count} ${count === 1 ? 'persoon' : 'personen'}` : 'Geen bekende sterfgevallen'}
                      >
                        <span>{day}</span>
                        {count > 0 && !isToday && (
                          <span className="text-[10px] text-forest-600">•{count}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-secondary/50 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-3">
            Over deze kalender
          </h3>
          <p className="text-muted-foreground mb-4">
            Deze kalender toont beroemde Nederlanders en Belgen die op elke dag van het jaar zijn overleden.
            Van koningen en kunstenaars tot sporters en schrijvers - ontdek de geschiedenis en bezoek hun laatste rustplaats.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="text-accent hover:underline">
              → Zoek een begraafplaats
            </Link>
            <Link href="/blog" className="text-accent hover:underline">
              → Lees onze blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
