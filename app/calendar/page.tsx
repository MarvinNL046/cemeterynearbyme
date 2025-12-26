import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Death Calendar - Famous Americans by Date | CemeteryNearMe.com',
  description: 'Discover which famous Americans passed away on any day of the year. Browse our complete death calendar to explore history.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Death Calendar - Famous Americans by Date',
    description: 'Explore which notable Americans died on each day of the year.',
  }
};

const months = [
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

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-gold-400" />
            <span className="text-gold-400 font-medium">This Day in History</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Death Calendar
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Explore which famous Americans passed away on each day of the year.
            Click on a month to see all the notable deaths.
          </p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <Link
            href="/today"
            className="flex items-center justify-between py-3 text-sm text-accent hover:underline"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View who passed away today →
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Month Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {months.map((month) => (
            <Link key={month.slug} href={`/calendar/${month.slug}`}>
              <Card className="p-6 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 h-full">
                <h2 className="font-serif text-xl font-bold text-foreground mb-2">
                  {month.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {month.days} days
                </p>
                <div className="flex items-center text-sm text-accent font-medium">
                  View deaths
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-secondary/50 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-3">
            About the Death Calendar
          </h3>
          <p className="text-muted-foreground mb-4">
            Our death calendar features notable Americans who have passed away throughout history.
            For each person, we show their profession, lifespan, and if known, their final resting place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/today" className="text-accent hover:underline">
              → View today's deaths
            </Link>
            <Link href="/" className="text-accent hover:underline">
              → Find a cemetery
            </Link>
            <Link href="/type/national-cemetery" className="text-accent hover:underline">
              → National Cemeteries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
