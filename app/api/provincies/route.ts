import { NextResponse } from 'next/server';
import provinciesData from '@/data/provincies.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provincie = searchParams.get('provincie');
  
  if (provincie) {
    // Return specific province data
    const provincieData = provinciesData[provincie as keyof typeof provinciesData];
    if (provincieData) {
      return NextResponse.json(provincieData);
    }
    return NextResponse.json({ error: 'Provincie niet gevonden' }, { status: 404 });
  }
  
  // Return all provinces
  return NextResponse.json(provinciesData);
}