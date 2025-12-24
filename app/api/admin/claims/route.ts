import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db, placeClaims, users } from '@/lib/db';
import { desc, eq, like, or, sql, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - List all claims with pagination and filters
export async function GET(request: NextRequest) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    if (search) {
      whereConditions.push(
        or(
          like(placeClaims.notes, `%${search}%`),
          like(placeClaims.claimantName, `%${search}%`)
        )
      );
    }
    if (status) {
      whereConditions.push(eq(placeClaims.status, status as 'pending' | 'verification_sent' | 'verified' | 'approved' | 'rejected' | 'expired'));
    }

    const whereClause = whereConditions.length > 0
      ? whereConditions.length === 1
        ? whereConditions[0]
        : and(...whereConditions)
      : undefined;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(placeClaims)
      .where(whereClause);
    const total = countResult[0]?.count || 0;

    // Get claims with user info
    const claimsList = await db
      .select({
        id: placeClaims.id,
        placeId: placeClaims.placeId,
        userId: placeClaims.userId,
        status: placeClaims.status,
        verificationMethod: placeClaims.verificationMethod,
        verificationEmail: placeClaims.verificationEmail,
        businessRole: placeClaims.businessRole,
        claimantName: placeClaims.claimantName,
        claimantPhone: placeClaims.claimantPhone,
        notes: placeClaims.notes,
        adminNotes: placeClaims.adminNotes,
        rejectionReason: placeClaims.rejectionReason,
        reviewedAt: placeClaims.reviewedAt,
        createdAt: placeClaims.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(placeClaims)
      .leftJoin(users, eq(placeClaims.userId, users.id))
      .where(whereClause)
      .orderBy(desc(placeClaims.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      claims: claimsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}
