import { Metadata } from 'next';
import Link from 'next/link';
import { Trees, Flag, Building2, Cross, Star, Heart, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import cemeteryTypesData from '@/data/cemetery-types.json';

export const metadata: Metadata = {
  title: 'Cemetery Types - Find by Category | CemeteryNearMe.com',
  description: 'Browse cemeteries by type: national cemeteries, memorial parks, natural burial grounds, religious cemeteries, and more across the United States.',
  openGraph: {
    title: 'Cemetery Types - Find by Category',
    description: 'Find the right type of cemetery for your needs.',
  }
};

const categoryIcons: Record<string, any> = {
  'national-cemetery': Flag,
  'veterans-cemetery': Flag,
  'memorial-park': Building2,
  'natural-burial': Trees,
  'green-cemetery': Trees,
  'historic-cemetery': Star,
  'family-cemetery': Heart,
};

const categories = [
  {
    title: 'Military & National',
    types: ['national-cemetery', 'veterans-cemetery', 'civil-war-cemetery', 'sailors-cemetery']
  },
  {
    title: 'Religious',
    types: ['catholic-cemetery', 'jewish-cemetery', 'muslim-cemetery', 'baptist-cemetery', 
            'methodist-cemetery', 'lutheran-cemetery', 'presbyterian-cemetery', 'episcopal-cemetery', 'orthodox-cemetery']
  },
  {
    title: 'Natural & Green',
    types: ['natural-burial', 'green-cemetery', 'garden-cemetery']
  },
  {
    title: 'Historic & Pioneer',
    types: ['historic-cemetery', 'pioneer-cemetery', 'african-american-cemetery', 'native-american-cemetery', 'chinese-cemetery']
  },
  {
    title: 'Community & Municipal',
    types: ['community-cemetery', 'municipal-cemetery', 'county-cemetery', 'family-cemetery']
  },
  {
    title: 'Cremation & Entombment',
    types: ['crematorium', 'mausoleum', 'columbarium']
  },
  {
    title: 'Fraternal & Other',
    types: ['masonic-cemetery', 'fraternal-cemetery', 'pet-cemetery', 'memorial-park']
  }
];

export default function CemeteryTypesPage() {
  const typesMap = Object.fromEntries(
    cemeteryTypesData.types.map(t => [t.slug, t])
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Cemetery Types
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Find the right cemetery for your needs. We categorize cemeteries by type,
            from national cemeteries to natural burial grounds.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {categories.map((category) => (
          <section key={category.title} className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {category.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.types.map((typeSlug) => {
                const type = typesMap[typeSlug];
                if (!type) return null;
                const Icon = categoryIcons[typeSlug] || Cross;
                
                return (
                  <Link key={typeSlug} href={`/type/${typeSlug}`}>
                    <Card className="p-5 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 h-full">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-forest-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1 truncate">
                            {type.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {type.description.substring(0, 80)}...
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* Full List */}
        <section className="mt-12 bg-secondary/50 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            All Cemetery Types
          </h2>
          <div className="flex flex-wrap gap-2">
            {cemeteryTypesData.types.map((type) => (
              <Link
                key={type.slug}
                href={`/type/${type.slug}`}
                className="px-3 py-1 bg-white rounded-full text-sm hover:bg-accent hover:text-white transition-colors"
              >
                {type.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
