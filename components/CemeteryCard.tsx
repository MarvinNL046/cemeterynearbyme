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
      href={`/begraafplaats/${cemetery.slug}`}
      className="block bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-6 p-6">
        {/* Image */}
        {cemetery.photo && (
          <div className="flex-shrink-0 w-48 h-32 bg-muted rounded-md overflow-hidden relative">
            <ProxiedImage
              src={cemetery.photo}
              alt={cemetery.naam_begraafplaats}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-2 truncate">
            {cemetery.naam_begraafplaats}
          </h2>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            {/* Type */}
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span className="capitalize">{cemetery.type}</span>
            </div>
            
            {/* Location */}
            {(cemetery.adres || cemetery.plaats) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {cemetery.adres && `${cemetery.adres}, `}
                  {cemetery.plaats}
                  {cemetery.postcode && ` ${cemetery.postcode}`}
                </span>
              </div>
            )}
            
            {/* Opening hours */}
            {cemetery.openingstijden && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{cemetery.openingstijden}</span>
              </div>
            )}
            
            {/* Rating */}
            {cemetery.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {cemetery.rating} sterren ({cemetery.reviews} reviews)
                </span>
              </div>
            )}
          </div>
          
          {/* Description preview */}
          {(cemetery.beschrijving || cemetery.bijzondere_kenmerken) && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {cemetery.beschrijving || cemetery.bijzondere_kenmerken}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}