import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTypes, getCemeteriesByType } from '@/lib/data';
import React from 'react';
import { Building2, TreePine, Star, ChevronRight, ArrowRight, Info, Cross, Church, Leaf, Moon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Types Begraafplaatsen | Begraafplaats in de Buurt',
  description: 'Bekijk alle types begraafplaatsen in Nederland: algemeen, rooms-katholiek, joods, islamitisch en natuurbegraafplaatsen.',
};

const typeIcons: Record<string, JSX.Element> = {
  'algemene begraafplaats': <Building2 className="w-6 h-6" />,
  'rooms-katholieke begraafplaats': <Cross className="w-6 h-6" />,
  'protestantse begraafplaats': <Church className="w-6 h-6" />,
  'joodse begraafplaats': <Star className="w-6 h-6" />,
  'bijzondere begraafplaats': <TreePine className="w-6 h-6" />,
  'natuurbegraafplaats': <Leaf className="w-6 h-6" />,
  'islamitische begraafplaats': <Moon className="w-6 h-6" />,
};

const typeDescriptions: Record<string, string> = {
  'algemene begraafplaats': 'Open voor iedereen, ongeacht geloof of levensovertuiging. Gemeentelijke en particuliere begraafplaatsen.',
  'rooms-katholieke begraafplaats': 'Begraafplaatsen gewijd volgens rooms-katholieke tradities, vaak verbonden aan parochies en kerken.',
  'protestantse begraafplaats': 'Nederlands Hervormde, Gereformeerde en andere protestantse begraafplaatsen met een sobere, ingetogen sfeer.',
  'joodse begraafplaats': 'Begraafplaatsen ingericht volgens joodse tradities en voorschriften. Vaak historische locaties met grote culturele waarde.',
  'bijzondere begraafplaats': 'Oorlogsbegraafplaatsen, erevelden, crematoria en andere unieke locaties met bijzondere betekenis.',
  'natuurbegraafplaats': 'Duurzame laatste rustplaats in een natuurlijke omgeving, waar de natuur centraal staat.',
  'islamitische begraafplaats': 'Begraafplaatsen ingericht volgens islamitische voorschriften, met graven richting Mekka.',
};

export default async function TypesPage() {
  const types = await getAllTypes();

  // Get cemetery count for each type
  const typesWithCounts = await Promise.all(
    types.map(async (type) => {
      const cemeteries = await getCemeteriesByType(type);
      const provinces = [...new Set(cemeteries.map(c => c.provincie))];
      return {
        name: type,
        count: cemeteries.length,
        provinces: provinces.length,
      };
    })
  );

  // Only show types with cemeteries
  const activeTypes = typesWithCounts.filter(t => t.count > 0);
  const totalCemeteries = activeTypes.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Types</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Types Begraafplaatsen
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Vind begraafplaatsen op basis van type. Van algemene begraafplaatsen tot specifieke
            religieuze en natuurbegraafplaatsen.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-gold-300">{activeTypes.length}</div>
              <div className="text-primary-foreground/70 text-sm">Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-300">{totalCemeteries.toLocaleString('nl-NL')}</div>
              <div className="text-primary-foreground/70 text-sm">Begraafplaatsen</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Type Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {activeTypes
              .sort((a, b) => b.count - a.count)
              .map((type) => (
                <Link
                  key={type.name}
                  href={`/type/${type.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group"
                >
                  <Card className="h-full p-6 border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
                            {React.cloneElement(
                              typeIcons[type.name] || <Building2 className="w-6 h-6" />,
                              { className: "w-6 h-6 text-forest-700 group-hover:text-white transition-colors" }
                            )}
                          </div>
                          <h2 className="font-serif text-xl font-semibold group-hover:text-accent transition-colors capitalize">
                            {type.name}
                          </h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {typeDescriptions[type.name]}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-accent">{type.count} begraafplaats{type.count !== 1 ? 'en' : ''}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{type.provinces} provinci{type.provinces !== 1 ? 'es' : 'e'}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>

          {/* About Section */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-forest-700 dark:text-forest-400" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold mb-3">Over verschillende types begraafplaatsen</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Nederland kent verschillende soorten begraafplaatsen, elk met hun eigen tradities en gebruiken.
                    Algemene begraafplaatsen staan open voor iedereen, terwijl religieuze begraafplaatsen
                    specifieke voorschriften volgen.
                  </p>
                  <p>
                    Natuurbegraafplaatsen bieden een duurzaam alternatief waarbij de natuur centraal staat.
                    Bij het kiezen van een begraafplaats is het belangrijk om rekening te houden met
                    persoonlijke wensen en geloofsovertuiging.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Op zoek naar een specifieke begraafplaats?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Gebruik onze zoekfunctie om begraafplaatsen te vinden op basis van naam, plaats of postcode.
            </p>
            <Link
              href="/zoeken"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Zoek begraafplaatsen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
