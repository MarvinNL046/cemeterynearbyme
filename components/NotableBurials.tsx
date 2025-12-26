'use client';

import { ExternalLink, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  getNotableBurialsAtCemetery,
  calculateAge,
  formatLifespan,
  type FamousDeath
} from '@/lib/deaths-data';

interface NotableBurialsProps {
  cemeterySlug: string;
  cemeteryName?: string;
}

export default function NotableBurials({ cemeterySlug, cemeteryName }: NotableBurialsProps) {
  const burials = getNotableBurialsAtCemetery(cemeterySlug);

  if (burials.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-6 h-6 text-accent" />
        <h2 className="font-serif text-2xl font-bold">Notable People Buried Here</h2>
      </div>

      <p className="text-muted-foreground mb-6">
        {burials.length === 1
          ? `${burials.length} notable person is buried at ${cemeteryName || 'this cemetery'}.`
          : `${burials.length} notable people are buried at ${cemeteryName || 'this cemetery'}.`}
      </p>

      <div className="grid gap-4">
        {burials.map((burial, index) => (
          <BurialCard key={`${burial.wikidata_id}-${index}`} burial={burial} />
        ))}
      </div>
    </Card>
  );
}

function BurialCard({ burial }: { burial: FamousDeath }) {
  const lifespan = formatLifespan(burial);
  const age = calculateAge(burial.birth_date, burial.death_date);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 p-4 bg-secondary/50 rounded-xl border">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground">
          {burial.name}
        </h3>
        <p className="text-muted-foreground">
          {burial.profession}
        </p>
        {lifespan && (
          <p className="text-sm text-muted-foreground mt-1">
            {lifespan}
            {age !== null && (
              <span className="text-muted-foreground/60 ml-1">
                (aged {age})
              </span>
            )}
          </p>
        )}
      </div>
      {burial.wikipedia && (
        <a
          href={burial.wikipedia}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          Wikipedia
        </a>
      )}
    </div>
  );
}
