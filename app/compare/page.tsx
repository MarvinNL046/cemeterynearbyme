'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, X, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProxiedImage from '@/components/ProxiedImage';
import { Cemetery } from '@/lib/data';

interface CompareItem {
  id: string;
  name: string;
}

export default function ComparePage() {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load compare list from localStorage
    const saved = localStorage.getItem('compareList');
    if (saved) {
      const list = JSON.parse(saved);
      setCompareList(list);
      loadCemeteries(list);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen for storage events
    const handleStorageChange = () => {
      const saved = localStorage.getItem('compareList');
      if (saved) {
        const list = JSON.parse(saved);
        setCompareList(list);
        loadCemeteries(list);
      } else {
        setCompareList([]);
        setCemeteries([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCemeteries = async (items: CompareItem[]) => {
    setLoading(true);
    try {
      const promises = items.map(item =>
        fetch(`/api/cemetery/${item.id}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      setCemeteries(results.filter(Boolean));
    } catch (error) {
      console.error('Error loading cemeteries:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCompare = (id: string) => {
    const newList = compareList.filter(item => item.id !== id);
    localStorage.setItem('compareList', JSON.stringify(newList));
    setCompareList(newList);
    setCemeteries(cemeteries.filter(c => c.slug !== id));
    window.dispatchEvent(new Event('storage'));
  };

  const clearAll = () => {
    localStorage.removeItem('compareList');
    setCompareList([]);
    setCemeteries([]);
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading cemeteries...</p>
        </div>
      </div>
    );
  }

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Compare Cemeteries</h1>
          <p className="text-muted-foreground mb-8">
            You haven&apos;t selected any cemeteries to compare yet.
            Go to a cemetery page and click the &quot;Compare&quot; button.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Compare Cemeteries</h1>
        <Button variant="outline" onClick={clearAll}>
          Clear all
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Property</th>
              {cemeteries.map(cemetery => (
                <th key={cemetery.slug} className="p-4 min-w-[300px]">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={() => removeFromCompare(cemetery.slug)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <h3 className="font-semibold text-lg mb-2">{cemetery.name}</h3>
                    <Link href={`/cemetery/${cemetery.slug}`}>
                      <Button variant="outline" size="sm">
                        View details
                      </Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Photo */}
            <tr className="border-b">
              <td className="p-4 font-medium">Photo</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  {cemetery.photo ? (
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                      <ProxiedImage
                        src={cemetery.photo}
                        alt={cemetery.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">No photo available</span>
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Type */}
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Type</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <span className="inline-block px-3 py-1 bg-background rounded-full text-sm">
                    {cemetery.type}
                  </span>
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr className="border-b">
              <td className="p-4 font-medium">Location</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p>{cemetery.city}{cemetery.county ? `, ${cemetery.county}` : ''}</p>
                      <p className="text-muted-foreground">{cemetery.state}</p>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Address */}
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Address</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <p className="text-sm">
                    {cemetery.address || '-'}<br />
                    {cemetery.city}, {cemetery.state_abbr} {cemetery.zipCode}
                  </p>
                </td>
              ))}
            </tr>

            {/* Opening hours */}
            <tr className="border-b">
              <td className="p-4 font-medium">Opening Hours</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{cemetery.opening_hours || 'Not available'}</p>
                  </div>
                </td>
              ))}
            </tr>

            {/* Phone */}
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Phone</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <p className="text-sm">{cemetery.phone || 'Not available'}</p>
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b">
              <td className="p-4 font-medium">Rating</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  {cemetery.rating && cemetery.rating > 0 ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{cemetery.rating.toFixed(1)}</span>
                        <div className="text-yellow-500">
                          {'★'.repeat(Math.round(cemetery.rating))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cemetery.review_count || 0} reviews
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No ratings yet</p>
                  )}
                </td>
              ))}
            </tr>

            {/* Facilities */}
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Facilities</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <p className="text-sm">
                    {cemetery.facilities?.join(', ') || 'Not specified'}
                  </p>
                </td>
              ))}
            </tr>

            {/* Accessibility */}
            <tr className="border-b">
              <td className="p-4 font-medium">Accessibility</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  {cemetery.description && cemetery.description.includes('Wheelchair') ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Wheelchair accessible</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not specified</p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add more cemeteries */}
      {compareList.length < 3 && (
        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            You can add {3 - compareList.length} more cemeter{3 - compareList.length > 1 ? 'ies' : 'y'} to your comparison
          </p>
          <Link href="/">
            <Button variant="outline">
              Find more cemeteries
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
