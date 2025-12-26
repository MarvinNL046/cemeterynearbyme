'use client';

import { useState } from 'react';
import { ExternalLink, User, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getNotableBurialsAtCemetery,
  calculateAge,
  formatLifespan,
  type FamousDeath
} from '@/lib/deaths-data';

const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 6;

interface NotableBurialsProps {
  cemeterySlug: string;
  cemeteryName?: string;
}

export default function NotableBurials({ cemeterySlug, cemeteryName }: NotableBurialsProps) {
  const burials = getNotableBurialsAtCemetery(cemeterySlug);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  if (burials.length === 0) {
    return null;
  }

  const visibleBurials = burials.slice(0, visibleCount);
  const hasMore = visibleCount < burials.length;
  const remainingCount = burials.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, burials.length));
  };

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
        {visibleBurials.map((burial, index) => (
          <BurialCard key={`${burial.wikidata_id}-${index}`} burial={burial} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="gap-2"
          >
            <ChevronDown className="w-4 h-4" />
            Load More ({remainingCount} remaining)
          </Button>
        </div>
      )}
    </Card>
  );
}

function BurialCard({ burial }: { burial: FamousDeath }) {
  const lifespan = formatLifespan(burial);
  const age = calculateAge(burial.birth_date, burial.death_date);

  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-secondary/50 rounded-lg border">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-semibold text-foreground truncate">
            {burial.name}
          </h3>
          {lifespan && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {lifespan}
              {age !== null && ` (${age})`}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {burial.profession}
        </p>
      </div>
      {burial.wikipedia && (
        <a
          href={burial.wikipedia}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline shrink-0 p-1"
          aria-label={`Wikipedia article about ${burial.name}`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
