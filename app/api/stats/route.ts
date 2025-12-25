import { NextResponse } from 'next/server';
import { getAllCemeteries } from '@/lib/data';

export async function GET() {
  try {
    const cemeteries = await getAllCemeteries();

    // Count cemeteries by type
    const typeCount: Record<string, number> = {};
    cemeteries.forEach(cemetery => {
      const type = cemetery.type || 'public-cemetery';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    // Get top states by count
    const stateCount: Record<string, number> = {};
    cemeteries.forEach(cemetery => {
      if (cemetery.state) {
        stateCount[cemetery.state] = (stateCount[cemetery.state] || 0) + 1;
      }
    });

    const topStates = Object.entries(stateCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([state]) => state);

    return NextResponse.json({
      total: cemeteries.length,
      byType: typeCount,
      topStates,
      types: {
        'public-cemetery': typeCount['public-cemetery'] || typeCount['Public Cemetery'] || 0,
        'private-cemetery': typeCount['private-cemetery'] || typeCount['Private Cemetery'] || 0,
        'national-cemetery': typeCount['national-cemetery'] || typeCount['National Cemetery'] || 0,
        'veterans-cemetery': typeCount['veterans-cemetery'] || typeCount['Veterans Cemetery'] || 0,
        'memorial-park': typeCount['memorial-park'] || typeCount['Memorial Park'] || 0,
        'church-cemetery': typeCount['church-cemetery'] || typeCount['Church Cemetery'] || 0,
        'family-cemetery': typeCount['family-cemetery'] || typeCount['Family Cemetery'] || 0,
        'green-cemetery': typeCount['green-cemetery'] || typeCount['Green Cemetery'] || 0,
        'historic-cemetery': typeCount['historic-cemetery'] || typeCount['Historic Cemetery'] || 0,
        'pet-cemetery': typeCount['pet-cemetery'] || typeCount['Pet Cemetery'] || 0,
      }
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
