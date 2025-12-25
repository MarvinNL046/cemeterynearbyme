import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// Disable caching for auth endpoint
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
