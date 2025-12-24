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
          <p>Begraafplaatsen laden...</p>
        </div>
      </div>
    );
  }

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Vergelijk Begraafplaatsen</h1>
          <p className="text-muted-foreground mb-8">
            Je hebt nog geen begraafplaatsen geselecteerd om te vergelijken.
            Ga naar een begraafplaats pagina en klik op de &quot;Vergelijk&quot; knop.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Vergelijk Begraafplaatsen</h1>
        <Button variant="outline" onClick={clearAll}>
          Wis alles
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Eigenschap</th>
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
                    <h3 className="font-semibold text-lg mb-2">{cemetery.naam_begraafplaats}</h3>
                    <Link href={`/begraafplaats/${cemetery.slug}`}>
                      <Button variant="outline" size="sm">
                        Bekijk details
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
              <td className="p-4 font-medium">Foto</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  {cemetery.photo ? (
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                      <ProxiedImage
                        src={cemetery.photo}
                        alt={cemetery.naam_begraafplaats}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Geen foto beschikbaar</span>
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
              <td className="p-4 font-medium">Locatie</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p>{cemetery.gemeente}</p>
                      <p className="text-muted-foreground">{cemetery.provincie}</p>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Address */}
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Adres</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <p className="text-sm">
                    {cemetery.adres || '-'}<br />
                    {cemetery.postcode && `${cemetery.postcode} ${cemetery.plaats || cemetery.gemeente}`}
                  </p>
                </td>
              ))}
            </tr>

            {/* Opening hours */}
            <tr className="border-b">
              <td className="p-4 font-medium">Openingstijden</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{cemetery.openingstijden || 'Niet bekend'}</p>
                  </div>
                </td>
              ))}
            </tr>

            {/* Phone */}
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Telefoon</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <p className="text-sm">{cemetery.telefoon || 'Niet bekend'}</p>
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b">
              <td className="p-4 font-medium">Beoordeling</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  {cemetery.rating && parseFloat(cemetery.rating) > 0 ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{parseFloat(cemetery.rating).toFixed(1)}</span>
                        <div className="text-yellow-500">
                          {'★'.repeat(Math.round(parseFloat(cemetery.rating)))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cemetery.reviews} reviews
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nog geen beoordelingen</p>
                  )}
                </td>
              ))}
            </tr>

            {/* Facilities */}
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Faciliteiten</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  <p className="text-sm">{cemetery.faciliteiten || 'Niet gespecificeerd'}</p>
                </td>
              ))}
            </tr>

            {/* Accessibility */}
            <tr className="border-b">
              <td className="p-4 font-medium">Toegankelijkheid</td>
              {cemeteries.map(cemetery => (
                <td key={cemetery.slug} className="p-4">
                  {cemetery.beschrijving && cemetery.beschrijving.includes('Rolstoeltoegankelijk') ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Rolstoeltoegankelijk</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Niet gespecificeerd</p>
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
            Je kunt nog {3 - compareList.length} begraafplats{3 - compareList.length > 1 ? 'en' : ''} toevoegen aan je vergelijking
          </p>
          <Link href="/">
            <Button variant="outline">
              Zoek meer begraafplaatsen
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}