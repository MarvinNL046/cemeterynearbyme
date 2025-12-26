'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Phone, ChevronRight } from 'lucide-react';
import type { Cemetery } from '@/lib/data';

interface RelatedCemeteriesProps {
  currentSlug: string;
  currentCity?: string;
  currentType?: string;
  currentState?: string;
  currentCounty?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  maxItems?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
  title?: string;
}

interface CemeteryWithDistance extends Cemetery {
  distance?: number;
  matchReason?: string;
}

export default function RelatedCemeteries({
  currentSlug,
  currentCity,
  currentType,
  currentState,
  currentCounty,
  currentLatitude,
  currentLongitude,
  maxItems = 4,
  className = '',
  variant = 'default',
  title = 'Nearby Cemeteries'
}: RelatedCemeteriesProps) {
  const [cemeteries, setCemeteries] = useState<CemeteryWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelatedCemeteries() {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        params.set('exclude', currentSlug);
        params.set('limit', String(maxItems * 3)); // Fetch extra to filter

        if (currentCity) params.set('city', currentCity);
        if (currentType) params.set('type', currentType);
        if (currentState) params.set('state', currentState);
        if (currentCounty) params.set('county', currentCounty);
        if (currentLatitude && currentLongitude) {
          params.set('lat', String(currentLatitude));
          params.set('lng', String(currentLongitude));
        }

        const response = await fetch(`/api/related-cemeteries?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch related cemeteries');
        }

        const data = await response.json();
        setCemeteries(data.cemeteries.slice(0, maxItems));
      } catch (err) {
        console.error('Error fetching related cemeteries:', err);
        setError('Unable to load related cemeteries');
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedCemeteries();
  }, [currentSlug, currentCity, currentType, currentState, currentCounty, currentLatitude, currentLongitude, maxItems]);

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: maxItems }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-32 mb-3"></div>
              <div className="bg-muted h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-muted h-3 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || cemeteries.length === 0) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {title}
        </h3>
        <ul className="space-y-2">
          {cemeteries.map((cemetery) => (
            <li key={cemetery.slug}>
              <Link
                href={`/cemetery/${cemetery.slug}`}
                className="text-sm text-primary hover:underline flex items-center justify-between gap-2 py-1"
              >
                <span className="truncate">{cemetery.name}</span>
                <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${className}`}>
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cemeteries.map((cemetery) => (
            <Link
              key={cemetery.slug}
              href={`/cemetery/${cemetery.slug}`}
              className="group block bg-background rounded-lg border overflow-hidden hover:border-primary transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-32 bg-muted">
                {cemetery.photo_url || cemetery.photo ? (
                  <Image
                    src={cemetery.photo_url || cemetery.photo || ''}
                    alt={cemetery.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
                {cemetery.matchReason && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {cemetery.matchReason}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {cemetery.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {cemetery.city}, {cemetery.state_abbr || cemetery.state}
                </p>
                {cemetery.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {cemetery.rating.toFixed(1)}
                      {cemetery.review_count && ` (${cemetery.review_count})`}
                    </span>
                  </div>
                )}
                {cemetery.distance && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {cemetery.distance.toFixed(1)} miles away
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${className}`}>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="space-y-4">
        {cemeteries.map((cemetery) => (
          <Link
            key={cemetery.slug}
            href={`/cemetery/${cemetery.slug}`}
            className="group flex items-start gap-4 p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-all"
          >
            {/* Image */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {cemetery.photo_url || cemetery.photo ? (
                <Image
                  src={cemetery.photo_url || cemetery.photo || ''}
                  alt={cemetery.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="96px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                  {cemetery.name}
                </h4>
                {cemetery.matchReason && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full flex-shrink-0">
                    {cemetery.matchReason}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {cemetery.city}, {cemetery.state_abbr || cemetery.state}
              </p>

              <div className="flex items-center gap-4 mt-2">
                {cemetery.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {cemetery.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {cemetery.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{cemetery.phone}</span>
                  </div>
                )}
                {cemetery.distance && (
                  <span className="text-sm text-muted-foreground">
                    {cemetery.distance.toFixed(1)} mi
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View more link */}
      {currentCity && (
        <Link
          href={`/city/${currentCity.toLowerCase().replace(/\s+/g, '-')}`}
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all cemeteries in {currentCity}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
