'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Begraafplaats {
  slug: string;
  naam: string;
  gemeente: string;
  provincie: string;
  type?: string;
}

interface BegraafplaatsSearchProps {
  begraafplaatsen: Begraafplaats[];
}

export function BegraafplaatsSearch({ begraafplaatsen }: BegraafplaatsSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvincie, setSelectedProvincie] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Get unique provinces and types
  const provincies = useMemo(() => {
    const unique = [...new Set(begraafplaatsen.map(b => b.provincie))].filter(Boolean);
    return unique.sort();
  }, [begraafplaatsen]);

  const types = useMemo(() => {
    const unique = [...new Set(begraafplaatsen.map(b => b.type))].filter(Boolean);
    return unique.sort();
  }, [begraafplaatsen]);

  // Filter results
  const filteredResults = useMemo(() => {
    return begraafplaatsen.filter(begraafplaats => {
      const matchesSearch = searchTerm === '' || 
        begraafplaats.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        begraafplaats.gemeente.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvincie = selectedProvincie === '' || 
        begraafplaats.provincie === selectedProvincie;
      
      const matchesType = selectedType === '' || 
        begraafplaats.type === selectedType;
      
      return matchesSearch && matchesProvincie && matchesType;
    }).slice(0, 20); // Limit to 20 results
  }, [searchTerm, selectedProvincie, selectedType, begraafplaatsen]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Zoek een Begraafplaats</h2>
      
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Zoek op naam of gemeente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-6 text-lg"
        />
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <select
          value={selectedProvincie}
          onChange={(e) => setSelectedProvincie(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Alle provincies</option>
          {provincies.map(prov => (
            <option key={prov} value={prov}>{prov}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Alle types</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {searchTerm || selectedProvincie || selectedType ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            {filteredResults.length} resultaten gevonden
          </p>
          {filteredResults.map((begraafplaats) => (
            <Link
              key={begraafplaats.slug}
              href={`/begraafplaats/${begraafplaats.slug}`}
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{begraafplaats.naam}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{begraafplaats.gemeente}, {begraafplaats.provincie}</span>
                  </div>
                  {begraafplaats.type && (
                    <span className="text-sm text-gray-500">{begraafplaats.type}</span>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Bekijk details
                </Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Gebruik de zoekbalk of filters om begraafplaatsen te vinden</p>
        </div>
      )}
    </div>
  );
}