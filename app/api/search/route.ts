import { NextResponse } from 'next/server';
import { getAllCemeteries } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase().trim() || '';
  const typeFilter = searchParams.get('type')?.toLowerCase().trim() || '';
  const stateFilter = searchParams.get('state')?.toLowerCase().trim() || '';

  try {
    const cemeteries = await getAllCemeteries();

    // If empty query and no filters, return all cemeteries (for counting)
    if (query === '' && !typeFilter && !stateFilter) {
      return NextResponse.json(cemeteries);
    }

    // Filter cemeteries based on search criteria
    const results = cemeteries.filter(cemetery => {
      // Search query filter
      const matchesQuery = !query ||
        cemetery.name.toLowerCase().includes(query) ||
        cemetery.city.toLowerCase().includes(query) ||
        cemetery.state.toLowerCase().includes(query) ||
        cemetery.type.toLowerCase().includes(query) ||
        (cemetery.county && cemetery.county.toLowerCase().includes(query)) ||
        (cemetery.zipCode && cemetery.zipCode.toLowerCase().includes(query)) ||
        (cemetery.address && cemetery.address.toLowerCase().includes(query));

      // Type filter
      const typeSlug = cemetery.type_slug || cemetery.type.toLowerCase().replace(/ /g, '-');
      const matchesType = !typeFilter || typeFilter === 'all' || typeSlug === typeFilter;

      // State filter
      const matchesState = !stateFilter || stateFilter === 'all' ||
        cemetery.state.toLowerCase() === stateFilter.toLowerCase() ||
        cemetery.state_abbr.toLowerCase() === stateFilter.toLowerCase();

      return matchesQuery && matchesType && matchesState;
    });

    // Sort results by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query ||
                     a.city.toLowerCase() === query;
      const bExact = b.name.toLowerCase() === query ||
                     b.city.toLowerCase() === query;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Secondary sort by rating if available
      const aRating = a.rating || 0;
      const bRating = b.rating || 0;
      return bRating - aRating;
    });

    // Return all results (let the frontend handle pagination)
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
