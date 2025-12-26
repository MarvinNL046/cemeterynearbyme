import Link from 'next/link';
import { MapPin, Clock, Building, Star } from 'lucide-react';
import ProxiedImage from './ProxiedImage';
import { Cemetery } from '@/lib/data';

interface CemeteryCardProps {
  cemetery: Cemetery;
}

export default function CemeteryCard({ cemetery }: CemeteryCardProps) {
  return (
    <Link
      href={`/cemetery/${cemetery.slug}`}
      className="block bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-6 p-6">
        {/* Image */}
        {(cemetery.photo_url || cemetery.photo) && (
          <div className="flex-shrink-0 w-48 h-32 bg-muted rounded-md overflow-hidden relative">
            <ProxiedImage
              src={cemetery.photo_url || cemetery.photo}
              alt={cemetery.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-2 truncate">
            {cemetery.name}
          </h2>

          <div className="space-y-1 text-sm text-muted-foreground">
            {/* Type */}
            {cemetery.type && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span className="capitalize">{cemetery.type}</span>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {cemetery.address && `${cemetery.address}, `}
                {cemetery.city}
                {cemetery.state_abbr && `, ${cemetery.state_abbr}`}
                {cemetery.zipCode && ` ${cemetery.zipCode}`}
              </span>
            </div>

            {/* Opening hours */}
            {cemetery.opening_hours && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{cemetery.opening_hours}</span>
              </div>
            )}

            {/* Rating */}
            {cemetery.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {cemetery.rating} stars ({cemetery.review_count || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Description preview */}
          {cemetery.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {cemetery.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
