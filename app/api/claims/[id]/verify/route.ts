import { NextRequest, NextResponse } from 'next/server';
import { db, placeClaims } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { sendClaimApprovedEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const { id } = await params;
    const claimId = parseInt(id, 10);

    if (isNaN(claimId)) {
      return NextResponse.json({ error: 'Invalid claim ID' }, { status: 400 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    // Get the claim
    const [claim] = await db
      .select()
      .from(placeClaims)
      .where(
        and(
          eq(placeClaims.id, claimId),
          eq(placeClaims.userId, user.id)
        )
      )
      .limit(1);

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    if (claim.status !== 'pending') {
      return NextResponse.json({ error: 'This claim has already been processed' }, { status: 400 });
    }

    // Check if code has expired
    if (claim.verificationCodeExpiresAt) {
      const expiresAt = new Date(claim.verificationCodeExpiresAt);
      if (Date.now() > expiresAt.getTime()) {
        return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
      }
    }

    // Check attempts
    const attempts = (claim.verificationAttempts || 0) + 1;
    if (attempts > 5) {
      return NextResponse.json({ error: 'Too many attempts. Please request a new code.' }, { status: 400 });
    }

    // Update attempt count
    await db
      .update(placeClaims)
      .set({ verificationAttempts: attempts })
      .where(eq(placeClaims.id, claimId));

    // Verify the code
    if (claim.verificationCode !== code) {
      return NextResponse.json({ error: 'Incorrect verification code' }, { status: 400 });
    }

    // Check if this claim can be auto-approved (email domain matches website domain)
    const canAutoApprove = claim.verificationMethod === 'email_domain';

    // Extract cemetery name from notes for email
    let cemeteryName = 'your cemetery';
    if (claim.notes) {
      const slugMatch = claim.notes.match(/slug:([^\n]+)/);
      if (slugMatch) {
        // Convert slug to readable name
        cemeteryName = slugMatch[1]
          .replace(/-/g, ' ')
          .replace(/cemetery /i, '')
          .trim();
        // Capitalize first letter of each word
        cemeteryName = cemeteryName.replace(/\b\w/g, l => l.toUpperCase());
      }
    }

    if (canAutoApprove) {
      // Auto-approve: email domain matches website domain
      await db
        .update(placeClaims)
        .set({
          status: 'approved',
          verifiedAt: new Date().toISOString(),
          reviewedAt: new Date().toISOString(), // Used as approvedAt for auto-approved claims
          updatedAt: new Date().toISOString(),
        })
        .where(eq(placeClaims.id, claimId));

      // Send approval email
      if (claim.verificationEmail) {
        sendClaimApprovedEmail(claim.verificationEmail, cemeteryName).catch(err => {
          console.error('Failed to send claim approved email:', err);
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Claim successfully verified and approved! You can now manage your cemetery information.',
        status: 'approved',
      });
    } else {
      // Manual review required: email domain doesn't match website
      await db
        .update(placeClaims)
        .set({
          status: 'verified',
          verifiedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(placeClaims.id, claimId));

      return NextResponse.json({
        success: true,
        message: 'Your email address has been verified. Since the email domain does not match the cemetery website, your claim will be manually reviewed. You will receive a notification once your claim is approved.',
        status: 'verified',
      });
    }
  } catch (error) {
    console.error('Verify claim error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
