import { NextResponse } from 'next/server';
import { getAllCemeteries } from '@/lib/data';

export async function GET() {
  try {
    const cemeteries = await getAllCemeteries();
    
    // Count cemeteries by type
    const typeCount: Record<string, number> = {};
    cemeteries.forEach(cemetery => {
      const type = cemetery.type || 'algemeen';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    // Get top provinces by count
    const provinceCount: Record<string, number> = {};
    cemeteries.forEach(cemetery => {
      if (cemetery.provincie && cemetery.provincie !== 'Onbekend') {
        provinceCount[cemetery.provincie] = (provinceCount[cemetery.provincie] || 0) + 1;
      }
    });

    const topProvinces = Object.entries(provinceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([province]) => province);

    return NextResponse.json({
      total: cemeteries.length,
      byType: typeCount,
      topProvinces,
      types: {
        'algemeen': typeCount['algemeen'] || 0,
        'rooms-katholiek': typeCount['rooms-katholiek'] || 0,
        'natuurbegraafplaats': typeCount['natuurbegraafplaats'] || 0,
        'joods': typeCount['joods'] || 0,
        'protestants': typeCount['protestants'] || 0,
        'islamitisch': typeCount['islamitisch'] || 0,
      }
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}