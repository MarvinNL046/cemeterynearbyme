import { NextResponse } from 'next/server';
import { getCemeteryBySlug } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const cemetery = await getCemeteryBySlug(params.slug);
    
    if (!cemetery) {
      return NextResponse.json({ error: 'Cemetery not found' }, { status: 404 });
    }

    return NextResponse.json(cemetery);
  } catch (error) {
    console.error('Cemetery API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}