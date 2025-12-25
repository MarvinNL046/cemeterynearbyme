import { NextRequest, NextResponse } from 'next/server';
import { db, placeClaims } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getCurrentUser, generateVerificationCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { getCemeteryBySlug } from '@/lib/data';

// Helper function to extract domain from URL
function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

// Helper function to extract domain from email
function extractEmailDomain(email: string): string | null {
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  return parts[1].toLowerCase();
}

// Check if email domain matches website domain
function domainsMatch(emailDomain: string, websiteDomain: string): boolean {
  // Exact match
  if (emailDomain === websiteDomain) return true;

  // Check if email domain is subdomain of website or vice versa
  if (emailDomain.endsWith(`.${websiteDomain}`)) return true;
  if (websiteDomain.endsWith(`.${emailDomain}`)) return true;

  // Check for common US government domains
  // e.g., email@county.gov and www.county.gov
  const emailClean = emailDomain.replace(/\.(gov|org|com)$/, '');
  const websiteClean = websiteDomain.replace(/\.(gov|org|com)$/, '');
  if (emailClean === websiteClean) return true;

  return false;
}

// GET - Get user's claims
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const claims = await db
      .select()
      .from(placeClaims)
      .where(eq(placeClaims.userId, user.id))
      .orderBy(placeClaims.createdAt);

    return NextResponse.json({ claims });
  } catch (error) {
    console.error('Get claims error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST - Create new claim
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const body = await request.json();
    const {
      cemeterySlug,
      businessRole,
      claimantName,
      claimantPhone,
      verificationEmail,
      notes
    } = body;

    if (!cemeterySlug) {
      return NextResponse.json({ error: 'Cemetery is required' }, { status: 400 });
    }

    if (!verificationEmail) {
      return NextResponse.json({ error: 'Verification email is required' }, { status: 400 });
    }

    // Get cemetery data to check website
    const cemetery = await getCemeteryBySlug(cemeterySlug);
    if (!cemetery) {
      return NextResponse.json({ error: 'Cemetery not found' }, { status: 404 });
    }

    // Get website URL from cemetery data
    const websiteUrl = cemetery.website;

    // Extract domains
    const emailDomain = extractEmailDomain(verificationEmail);
    const websiteDomain = websiteUrl ? extractDomain(websiteUrl) : null;

    if (!emailDomain) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check domain matching
    let canAutoVerify = false;
    let verificationMethod: 'email_domain' | 'manual' = 'manual';

    if (websiteDomain && emailDomain) {
      canAutoVerify = domainsMatch(emailDomain, websiteDomain);
      if (canAutoVerify) {
        verificationMethod = 'email_domain';
      }
    }

    // Check for existing claims (pending or verified) for this cemetery
    const existingClaims = await db
      .select()
      .from(placeClaims)
      .where(eq(placeClaims.userId, user.id));

    const hasExistingClaim = existingClaims.some(
      claim => claim.notes?.includes(`slug:${cemeterySlug}`) &&
               (claim.status === 'pending' || claim.status === 'verified' || claim.status === 'approved')
    );

    if (hasExistingClaim) {
      return NextResponse.json({
        error: 'You have already submitted a claim for this cemetery'
      }, { status: 400 });
    }

    // Check if cemetery is already claimed by someone else
    const allClaimsForCemetery = await db
      .select()
      .from(placeClaims)
      .where(eq(placeClaims.status, 'approved'));

    const alreadyClaimed = allClaimsForCemetery.some(
      claim => claim.notes?.includes(`slug:${cemeterySlug}`)
    );

    if (alreadyClaimed) {
      return NextResponse.json({
        error: 'This cemetery has already been claimed by another user'
      }, { status: 400 });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create claim
    const [claim] = await db
      .insert(placeClaims)
      .values({
        placeId: 0, // Placeholder - we'll use notes to store slug
        userId: user.id,
        status: 'pending',
        verificationMethod,
        verificationEmail,
        verificationEmailDomain: emailDomain,
        verificationCode,
        verificationCodeSentAt: new Date().toISOString(),
        verificationCodeExpiresAt: expiresAt.toISOString(),
        verificationAttempts: 0,
        businessRole,
        claimantName: claimantName || user.name,
        claimantPhone,
        notes: `slug:${cemeterySlug}\nwebsite:${websiteUrl || 'none'}\nauto_verify:${canAutoVerify}${notes ? `\n${notes}` : ''}`,
      })
      .returning();

    // Send verification email
    const emailResult = await sendVerificationEmail(
      verificationEmail,
      verificationCode,
      'claim'
    );

    if (!emailResult.success) {
      // Delete the claim if email fails
      await db.delete(placeClaims).where(eq(placeClaims.id, claim.id));
      return NextResponse.json({ error: 'Could not send verification email' }, { status: 500 });
    }

    // Build response message based on verification method
    let message = 'Claim submitted. Check your email for the verification code.';
    if (!canAutoVerify) {
      message += ' Note: your email domain does not match the cemetery website. After verification, your claim will be manually reviewed.';
    }

    return NextResponse.json({
      success: true,
      message,
      claimId: claim.id,
      canAutoVerify,
    });
  } catch (error) {
    console.error('Create claim error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
