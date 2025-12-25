'use client';

import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import famousDeathsData from '@/data/famous-deaths.json';

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

function getDeathsForDate(day: number, month: number) {
  return famousDeathsData.deaths.filter(
    (person: any) => person.death_day === day && person.death_month === month && person.death_date
  ).sort((a: any, b: any) => {
    const yearA = a.death_date ? parseInt(a.death_date.split('-')[0]) : 0;
    const yearB = b.death_date ? parseInt(b.death_date.split('-')[0]) : 0;
    return yearB - yearA;
  });
}

function getYear(dateString: string): string {
  return dateString.split('-')[0];
}

export default function TodayDeathsWidget() {
  const today = getToday();
  const deaths = getDeathsForDate(today.day, today.month);

  const displayDeaths = deaths.slice(0, 3);

  // Always show widget - even with empty state for SEO
  const hasDeaths = deaths.length > 0;

  return (
    <section className="bg-gradient-to-br from-forest-700/90 to-forest-800/90 backdrop-blur-sm rounded-xl p-6 text-white border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif text-lg font-bold">This Day in History</h3>
        </div>
        <span className="text-sm text-gold-300">{today.monthName} {today.day}</span>
      </div>

      <div className="space-y-3">
        {hasDeaths ? (
          displayDeaths.map((person: any, index: number) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-white">{person.name}</p>
                  <p className="text-sm text-white/70">{person.profession}</p>
                </div>
                <span className="text-xs text-gold-300 bg-forest-700/50 px-2 py-1 rounded">
                  † {getYear(person.death_date!)}
                </span>
              </div>

              {person.cemetery && (
                <div className="flex items-center gap-1 mt-2 text-xs text-white/60">
                  <MapPin className="w-3 h-3" />
                  <span>{person.cemetery}{person.city ? `, ${person.city}` : ''}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-white/80 text-sm">
              Discover notable Americans who passed away on this date throughout history.
            </p>
            <p className="text-white/60 text-xs mt-2">
              Data is being collected from historical records.
            </p>
          </div>
        )}
      </div>

      {deaths.length > 3 && (
        <p className="text-sm text-white/60 mt-3">
          +{deaths.length - 3} more on this day
        </p>
      )}

      <div className="flex gap-2 mt-4">
        <Link
          href="/today"
          className="flex-1 flex items-center justify-center gap-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2 rounded-lg transition-colors"
        >
          View Today
          <ChevronRight className="w-4 h-4" />
        </Link>
        <Link
          href="/calendar"
          className="flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Calendar
        </Link>
      </div>
    </section>
  );
}
