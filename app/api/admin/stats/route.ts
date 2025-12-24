import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db, users, placeClaims, userCemeteries } from '@/lib/db';
import { desc, eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    // Total users
    const [{ count: totalUsers }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    // Claims stats
    const [{ count: totalClaims }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(placeClaims);

    const [{ count: pendingClaims }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(placeClaims)
      .where(eq(placeClaims.status, 'pending'));

    const [{ count: approvedClaims }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(placeClaims)
      .where(eq(placeClaims.status, 'approved'));

    const [{ count: rejectedClaims }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(placeClaims)
      .where(eq(placeClaims.status, 'rejected'));

    // User submitted cemeteries
    const [{ count: totalUserCemeteries }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userCemeteries);

    const [{ count: pendingCemeteries }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userCemeteries)
      .where(eq(userCemeteries.status, 'pending'));

    // Recent users
    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5);

    // Recent claims
    const recentClaims = await db
      .select({
        id: placeClaims.id,
        cemeteryName: placeClaims.notes, // notes contains slug info
        status: placeClaims.status,
        createdAt: placeClaims.createdAt,
      })
      .from(placeClaims)
      .orderBy(desc(placeClaims.createdAt))
      .limit(5);

    return NextResponse.json({
      totalUsers,
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      totalUserCemeteries,
      pendingCemeteries,
      recentUsers,
      recentClaims,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
