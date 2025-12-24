import { NextResponse } from 'next/server';
import { getAllProvinces, getAllMunicipalities, getAllTypes } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'provinces':
        const provinces = await getAllProvinces();
        return NextResponse.json(provinces);
      
      case 'municipalities':
        const municipalities = await getAllMunicipalities();
        return NextResponse.json(municipalities);
      
      case 'types':
        const types = await getAllTypes();
        return NextResponse.json(types);
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}