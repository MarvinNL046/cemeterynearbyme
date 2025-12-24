import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { googleReviews, cemeteryPhotos } from '@/drizzle/schema-simple';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch recent Google reviews (approved, with content, limit 6)
    const recentReviews = await db
      .select({
        id: googleReviews.id,
        cemeterySlug: googleReviews.cemeterySlug,
        reviewerName: googleReviews.reviewerName,
        reviewerImageUrl: googleReviews.reviewerImageUrl,
        rating: googleReviews.rating,
        content: googleReviews.content,
        reviewDate: googleReviews.reviewDate,
      })
      .from(googleReviews)
      .where(sql`${googleReviews.content} IS NOT NULL AND ${googleReviews.content} != ''`)
      .orderBy(desc(googleReviews.reviewDate))
      .limit(6);

    // Fetch recent approved photos (limit 8)
    const recentPhotos = await db
      .select({
        id: cemeteryPhotos.id,
        cemeterySlug: cemeteryPhotos.cemeterySlug,
        uploaderName: cemeteryPhotos.uploaderName,
        fileUrl: cemeteryPhotos.fileUrl,
        caption: cemeteryPhotos.caption,
        createdAt: cemeteryPhotos.createdAt,
      })
      .from(cemeteryPhotos)
      .where(eq(cemeteryPhotos.status, 'approved'))
      .orderBy(desc(cemeteryPhotos.createdAt))
      .limit(8);

    return NextResponse.json({
      reviews: recentReviews,
      photos: recentPhotos,
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage content', reviews: [], photos: [] },
      { status: 500 }
    );
  }
}
