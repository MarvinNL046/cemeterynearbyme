import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db, placeClaims, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Get single claim details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { id } = await params;
    const claimId = parseInt(id);

    const [claim] = await db
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
        reviewedBy: placeClaims.reviewedBy,
        createdAt: placeClaims.createdAt,
        updatedAt: placeClaims.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(placeClaims)
      .leftJoin(users, eq(placeClaims.userId, users.id))
      .where(eq(placeClaims.id, claimId))
      .limit(1);

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim niet gevonden' },
        { status: 404 }
      );
    }

    return NextResponse.json({ claim });
  } catch (error) {
    console.error('Error fetching claim:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claim' },
      { status: 500 }
    );
  }
}

// PATCH - Update claim (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, response, user: adminUser } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { id } = await params;
    const claimId = parseInt(id);
    const body = await request.json();
    const { status, rejectionReason, adminNotes } = body;

    // Validate status
    const validStatuses = ['pending', 'verification_sent', 'verified', 'approved', 'rejected', 'expired'];
    if (status && !validStatuses.includes(status)) {
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

    // Check if claim exists
    const [existingClaim] = await db
      .select()
      .from(placeClaims)
      .where(eq(placeClaims.id, claimId))
      .limit(1);

    if (!existingClaim) {
      return NextResponse.json(
        { error: 'Claim niet gevonden' },
        { status: 404 }
      );
    }

    // Update claim
    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
      updateData.reviewedAt = new Date().toISOString();
      updateData.reviewedBy = adminUser?.id;
    }

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const [updatedClaim] = await db
      .update(placeClaims)
      .set(updateData)
      .where(eq(placeClaims.id, claimId))
      .returning();

    return NextResponse.json({ claim: updatedClaim });
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { error: 'Failed to update claim' },
      { status: 500 }
    );
  }
}

// DELETE - Delete claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { id } = await params;
    const claimId = parseInt(id);

    // Check if claim exists
    const [existingClaim] = await db
      .select()
      .from(placeClaims)
      .where(eq(placeClaims.id, claimId))
      .limit(1);

    if (!existingClaim) {
      return NextResponse.json(
        { error: 'Claim niet gevonden' },
        { status: 404 }
      );
    }

    await db.delete(placeClaims).where(eq(placeClaims.id, claimId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting claim:', error);
    return NextResponse.json(
      { error: 'Failed to delete claim' },
      { status: 500 }
    );
  }
}
