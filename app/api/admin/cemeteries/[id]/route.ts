import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db, userCemeteries, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Get single user-submitted cemetery details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { id } = await params;
    const cemeteryId = parseInt(id);

    const [cemetery] = await db
      .select({
        id: userCemeteries.id,
        userId: userCemeteries.userId,
        naam: userCemeteries.naam,
        slug: userCemeteries.slug,
        type: userCemeteries.type,
        adres: userCemeteries.adres,
        postcode: userCemeteries.postcode,
        plaats: userCemeteries.plaats,
        gemeente: userCemeteries.gemeente,
        provincie: userCemeteries.provincie,
        gpsCoordinaten: userCemeteries.gpsCoordinaten,
        telefoon: userCemeteries.telefoon,
        email: userCemeteries.email,
        website: userCemeteries.website,
        beschrijving: userCemeteries.beschrijving,
        openingstijden: userCemeteries.openingstijden,
        faciliteiten: userCemeteries.faciliteiten,
        jaarOprichting: userCemeteries.jaarOprichting,
        photos: userCemeteries.photos,
        status: userCemeteries.status,
        rejectionReason: userCemeteries.rejectionReason,
        reviewedAt: userCemeteries.reviewedAt,
        reviewedBy: userCemeteries.reviewedBy,
        createdAt: userCemeteries.createdAt,
        updatedAt: userCemeteries.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(userCemeteries)
      .leftJoin(users, eq(userCemeteries.userId, users.id))
      .where(eq(userCemeteries.id, cemeteryId))
      .limit(1);

    if (!cemetery) {
      return NextResponse.json(
        { error: 'Begraafplaats niet gevonden' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cemetery });
  } catch (error) {
    console.error('Error fetching cemetery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cemetery' },
      { status: 500 }
    );
  }
}

// PATCH - Update user-submitted cemetery (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, response, user: adminUser } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { id } = await params;
    const cemeteryId = parseInt(id);
    const body = await request.json();
    const { status, rejectionReason } = body;

    // Validate status
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Ongeldige status' },
        { status: 400 }
      );
    }

    // If rejecting, require a reason
    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Reden voor afwijzing is verplicht' },
        { status: 400 }
      );
    }

    // Check if cemetery exists
    const [existingCemetery] = await db
      .select()
      .from(userCemeteries)
      .where(eq(userCemeteries.id, cemeteryId))
      .limit(1);

    if (!existingCemetery) {
      return NextResponse.json(
        { error: 'Begraafplaats niet gevonden' },
        { status: 404 }
      );
    }

    // Update cemetery
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = adminUser?.id;
    }

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const [updatedCemetery] = await db
      .update(userCemeteries)
      .set(updateData)
      .where(eq(userCemeteries.id, cemeteryId))
      .returning();

    // TODO: If approved, add to main cemeteries.json file

    return NextResponse.json({ cemetery: updatedCemetery });
  } catch (error) {
    console.error('Error updating cemetery:', error);
    return NextResponse.json(
      { error: 'Failed to update cemetery' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user-submitted cemetery
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { id } = await params;
    const cemeteryId = parseInt(id);

    // Check if cemetery exists
    const [existingCemetery] = await db
      .select()
      .from(userCemeteries)
      .where(eq(userCemeteries.id, cemeteryId))
      .limit(1);

    if (!existingCemetery) {
      return NextResponse.json(
        { error: 'Begraafplaats niet gevonden' },
        { status: 404 }
      );
    }

    await db.delete(userCemeteries).where(eq(userCemeteries.id, cemeteryId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cemetery:', error);
    return NextResponse.json(
      { error: 'Failed to delete cemetery' },
      { status: 500 }
    );
  }
}
