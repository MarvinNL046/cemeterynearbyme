import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Deaths Calendar - Notable People Who Died Today | Cemetery Near Me',
  description: 'Discover notable Americans who passed away on each day of the year. Browse the calendar and learn about their lives and final resting places.',
  openGraph: {
    title: 'Deaths Calendar - Notable People Who Died Today',
    description: 'Discover notable Americans who passed away on each day of the year.',
  }
};

const MONTHS = [
  { name: 'January', slug: 'january', days: 31 },
  { name: 'February', slug: 'february', days: 29 },
  { name: 'March', slug: 'march', days: 31 },
  { name: 'April', slug: 'april', days: 30 },
  { name: 'May', slug: 'may', days: 31 },
  { name: 'June', slug: 'june', days: 30 },
  { name: 'July', slug: 'july', days: 31 },
  { name: 'August', slug: 'august', days: 31 },
  { name: 'September', slug: 'september', days: 30 },
  { name: 'October', slug: 'october', days: 31 },
  { name: 'November', slug: 'november', days: 30 },
  { name: 'December', slug: 'december', days: 31 },
];

export default function DeathsCalendarPage() {
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
            <span className="text-gold-400 font-medium">Historical Calendar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Deaths on This Day
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Discover notable Americans who passed away on each day of the year.
            Click on a date to learn about their lives and final resting places.
          </p>
          <div className="flex items-center gap-2 mt-4 text-gold-300">
            <Users className="w-5 h-5" />
            <span>Coming soon - Notable Americans database</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick link to today */}
        <div className="mb-8 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <Link
            href={`/deaths/${MONTHS[currentMonth - 1].slug}/${currentDay}`}
            className="flex items-center justify-between group"
          >
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {MONTHS[currentMonth - 1].name} {currentDay}
              </p>
            </div>
            <div className="text-accent font-medium">
              View →
            </div>
          </Link>
        </div>

        {/* Calendar Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MONTHS.map((month, monthIndex) => (
            <div key={month.slug} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="bg-forest-800 text-white px-4 py-3 flex justify-between items-center">
                <h2 className="font-serif font-semibold">{month.name}</h2>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                      {day}
                    </div>
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: month.days }, (_, i) => {
                    const day = i + 1;
                    const isToday = day === currentDay && monthIndex + 1 === currentMonth;

                    return (
                      <Link
                        key={day}
                        href={`/deaths/${month.slug}/${day}`}
                        className={`
                          aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                          transition-all hover:scale-110
                          ${isToday
                            ? 'bg-accent text-white font-bold ring-2 ring-accent ring-offset-2'
                            : 'text-muted-foreground hover:bg-secondary'
                          }
                        `}
                      >
                        <span>{day}</span>
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
            About This Calendar
          </h3>
          <p className="text-muted-foreground mb-4">
            This calendar will feature notable Americans who passed away on each day of the year.
            From presidents and artists to athletes and authors - discover history and visit their final resting places.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/search" className="text-accent hover:underline">
              → Find a cemetery
            </Link>
            <Link href="/blog" className="text-accent hover:underline">
              → Read our blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
