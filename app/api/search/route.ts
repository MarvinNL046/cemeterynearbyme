import { NextResponse } from 'next/server';
import { getAllCemeteries } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase().trim() || '';
  const typeFilter = searchParams.get('type')?.toLowerCase().trim() || '';
  const provinceFilter = searchParams.get('province')?.toLowerCase().trim() || '';

  try {
    const cemeteries = await getAllCemeteries();
    
    // If empty query and no filters, return all cemeteries (for counting)
    if (query === '' && !typeFilter && !provinceFilter) {
      return NextResponse.json(cemeteries);
    }

    // Filter cemeteries based on search criteria
    const results = cemeteries.filter(cemetery => {
      // Search query filter
      const matchesQuery = !query || 
        cemetery.naam_begraafplaats.toLowerCase().includes(query) ||
        cemetery.gemeente.toLowerCase().includes(query) ||
        cemetery.provincie.toLowerCase().includes(query) ||
        cemetery.type.toLowerCase().includes(query) ||
        (cemetery.plaats && cemetery.plaats.toLowerCase().includes(query)) ||
        (cemetery.postcode && cemetery.postcode.toLowerCase().includes(query));
      
      // Type filter
      const typeSlug = cemetery.type.toLowerCase().replace(/ /g, '-');
      const matchesType = !typeFilter || typeFilter === 'all' || typeSlug === typeFilter;
      
      // Province filter
      const matchesProvince = !provinceFilter || provinceFilter === 'all' || 
        cemetery.provincie.toLowerCase() === provinceFilter.toLowerCase();
      
      return matchesQuery && matchesType && matchesProvince;
    });

    // Sort results by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.naam_begraafplaats.toLowerCase() === query || 
                     a.gemeente.toLowerCase() === query;
      const bExact = b.naam_begraafplaats.toLowerCase() === query || 
                     b.gemeente.toLowerCase() === query;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Secondary sort by rating if available
      const aRating = parseFloat(a.rating || '0');
      const bRating = parseFloat(b.rating || '0');
      return bRating - aRating;
    });

    // Return all results (let the frontend handle pagination)
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}