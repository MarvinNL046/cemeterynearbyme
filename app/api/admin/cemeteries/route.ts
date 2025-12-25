import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db, userCemeteries, users } from '@/lib/db';
import { desc, eq, like, or, sql, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - List all user-submitted cemeteries
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
          like(userCemeteries.name, `%${search}%`),
          like(userCemeteries.county, `%${search}%`),
          like(userCemeteries.city, `%${search}%`)
        )
      );
    }
    if (status) {
      whereConditions.push(eq(userCemeteries.status, status));
    }

    const whereClause = whereConditions.length > 0
      ? whereConditions.length === 1
        ? whereConditions[0]
        : and(...whereConditions)
      : undefined;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userCemeteries)
      .where(whereClause);
    const total = countResult[0]?.count || 0;

    // Get cemeteries with user info
    const cemeteriesList = await db
      .select({
        id: userCemeteries.id,
        userId: userCemeteries.userId,
        name: userCemeteries.name,
        slug: userCemeteries.slug,
        type: userCemeteries.type,
        address: userCemeteries.address,
        zipCode: userCemeteries.zipCode,
        city: userCemeteries.city,
        county: userCemeteries.county,
        state: userCemeteries.state,
        status: userCemeteries.status,
        rejectionReason: userCemeteries.rejectionReason,
        createdAt: userCemeteries.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(userCemeteries)
      .leftJoin(users, eq(userCemeteries.userId, users.id))
      .where(whereClause)
      .orderBy(desc(userCemeteries.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      cemeteries: cemeteriesList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cemeteries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cemeteries' },
      { status: 500 }
    );
  }
}
