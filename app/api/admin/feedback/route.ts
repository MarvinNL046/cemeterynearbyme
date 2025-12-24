import { NextResponse } from 'next/server';
import { db, websiteFeedback } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    // Check admin auth
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all feedback ordered by newest first
    const feedback = await db
      .select()
      .from(websiteFeedback)
      .orderBy(desc(websiteFeedback.createdAt));

    // Transform to match expected format
    const transformedFeedback = feedback.map(f => ({
      id: f.id.toString(),
      type: f.type,
      rating: f.rating,
      feedback: f.feedback,
      page_title: f.pageTitle,
      page_url: f.pageUrl,
      timestamp: f.createdAt,
      status: f.status,
    }));

    return NextResponse.json({ feedback: transformedFeedback });
  } catch (error) {
    console.error('Admin feedback GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
