import { NextRequest, NextResponse } from 'next/server';
import { getAllCemeteries, type Cemetery } from '@/lib/data';

interface CemeteryWithScore extends Cemetery {
  score: number;
  matchReason?: string;
  distance?: number;
}

// Haversine distance formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const excludeSlug = searchParams.get('exclude');
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const state = searchParams.get('state');
    const county = searchParams.get('county');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const allCemeteries = await getAllCemeteries();

    // Filter out current cemetery
    let candidates = allCemeteries.filter(c => c.slug !== excludeSlug);

    // Score and categorize cemeteries
    const scoredCemeteries: CemeteryWithScore[] = candidates.map(cemetery => {
      let score = 0;
      let matchReason = '';
      let distance: number | undefined;

      // Priority 1: Same city (highest priority)
      if (city && cemetery.city?.toLowerCase() === city.toLowerCase()) {
        score += 100;
        matchReason = 'Same City';
      }

      // Priority 2: Same type + same county
      if (type && county) {
        const typeMatch = cemetery.type_slug?.toLowerCase() === type.toLowerCase() ||
                         cemetery.type?.toLowerCase().includes(type.toLowerCase());
        const countyMatch = cemetery.county?.toLowerCase() === county.toLowerCase();

        if (typeMatch && countyMatch) {
          score += 80;
          if (!matchReason) matchReason = 'Same Type & County';
        } else if (typeMatch) {
          score += 40;
          if (!matchReason) matchReason = 'Same Type';
        } else if (countyMatch) {
          score += 30;
          if (!matchReason) matchReason = 'Same County';
        }
      } else if (type) {
        const typeMatch = cemetery.type_slug?.toLowerCase() === type.toLowerCase() ||
                         cemetery.type?.toLowerCase().includes(type.toLowerCase());
        if (typeMatch) {
          score += 40;
          if (!matchReason) matchReason = 'Same Type';
        }
      }

      // Priority 3: Same type + same state
      if (type && state) {
        const typeMatch = cemetery.type_slug?.toLowerCase() === type.toLowerCase() ||
                         cemetery.type?.toLowerCase().includes(type.toLowerCase());
        const stateMatch = cemetery.state?.toLowerCase() === state.toLowerCase() ||
                          cemetery.state_abbr?.toLowerCase() === state.toLowerCase();

        if (typeMatch && stateMatch) {
          score += 50;
          if (!matchReason) matchReason = 'Same Type & State';
        }
      }

      // Priority 4: Same state (base relevance)
      if (state) {
        const stateMatch = cemetery.state?.toLowerCase() === state.toLowerCase() ||
                          cemetery.state_abbr?.toLowerCase() === state.toLowerCase();
        if (stateMatch) {
          score += 20;
          if (!matchReason) matchReason = 'Same State';
        }
      }

      // Distance bonus if coordinates provided
      if (lat && lng && cemetery.latitude && cemetery.longitude) {
        distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          cemetery.latitude,
          cemetery.longitude
        );

        // Closer cemeteries get higher scores (max 50 points for <1 mile)
        if (distance < 1) score += 50;
        else if (distance < 5) score += 40;
        else if (distance < 10) score += 30;
        else if (distance < 25) score += 20;
        else if (distance < 50) score += 10;

        if (!matchReason && distance < 10) {
          matchReason = 'Nearby';
        }
      }

      // Bonus for cemeteries with ratings and photos
      if (cemetery.rating) score += 5;
      if (cemetery.photo || cemetery.photo_url) score += 5;
      if (cemetery.review_count && cemetery.review_count > 10) score += 5;

      return {
        ...cemetery,
        score,
        matchReason: matchReason || undefined,
        distance
      };
    });

    // Sort by score (descending), then by distance if available
    scoredCemeteries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

    // Take top results
    const results = scoredCemeteries
      .filter(c => c.score > 0)
      .slice(0, limit)
      .map(({ score, ...rest }) => rest); // Remove score from response

    return NextResponse.json(
      { cemeteries: results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching related cemeteries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related cemeteries', cemeteries: [] },
      { status: 500 }
    );
  }
}
