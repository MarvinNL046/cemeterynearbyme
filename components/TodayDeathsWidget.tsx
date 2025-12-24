'use client';

import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import famousDeathsData from '@/data/famous-deaths.json';

// Get today's date
function getToday() {
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
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
    const yearA = a.sterfdatum ? parseInt(a.sterfdatum.split('-')[0]) : 0;
    const yearB = b.sterfdatum ? parseInt(b.sterfdatum.split('-')[0]) : 0;
    return yearB - yearA;
  });
}

function getYear(dateString: string): string {
  return dateString.split('-')[0];
}

export default function TodayDeathsWidget() {
  const today = getToday();
  const deaths = getDeathsForDate(today.day, today.month);

  // Show max 3 people
  const displayDeaths = deaths.slice(0, 3);

  if (deaths.length === 0) {
    return null; // Don't show widget if no deaths today
  }

  return (
    <section className="bg-gradient-to-br from-forest-700/90 to-forest-800/90 backdrop-blur-sm rounded-xl p-6 text-white border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif text-lg font-bold">Vandaag Overleden</h3>
        </div>
        <span className="text-sm text-gold-300">{today.day} {today.monthName}</span>
      </div>

      <div className="space-y-3">
        {displayDeaths.map((person, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-white">{person.naam}</p>
                <p className="text-sm text-white/70">{person.beroep}</p>
              </div>
              <span className="text-xs text-gold-300 bg-forest-700/50 px-2 py-1 rounded">
                † {getYear(person.sterfdatum!)}
              </span>
            </div>

            {person.begraafplaats && (
              <div className="flex items-center gap-1 mt-2 text-xs text-white/60">
                <MapPin className="w-3 h-3" />
                <span>{person.begraafplaats}, {person.plaats}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {deaths.length > 3 && (
        <p className="text-sm text-white/60 mt-3">
          +{deaths.length - 3} meer op deze dag
        </p>
      )}

      <div className="flex gap-2 mt-4">
        <Link
          href="/vandaag"
          className="flex-1 flex items-center justify-center gap-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2 rounded-lg transition-colors"
        >
          Bekijk vandaag
          <ChevronRight className="w-4 h-4" />
        </Link>
        <Link
          href="/overleden"
          className="flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Kalender
        </Link>
      </div>
    </section>
  );
}
