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

  // Also check for gemeente.nl domains (common for Dutch municipalities)
  // gemeente emails often use @gemeente-[name].nl while website is gemeente[name].nl
  const emailClean = emailDomain.replace(/^gemeente-?/, '').replace(/\.nl$/, '');
  const websiteClean = websiteDomain.replace(/^gemeente-?/, '').replace(/\.nl$/, '');
  if (emailClean === websiteClean) return true;

  return false;
}

// GET - Get user's claims
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const claims = await db
      .select()
      .from(placeClaims)
      .where(eq(placeClaims.userId, user.id))
      .orderBy(placeClaims.createdAt);

    return NextResponse.json({ claims });
  } catch (error) {
    console.error('Get claims error:', error);
    return NextResponse.json({ error: 'Er is iets misgegaan' }, { status: 500 });
  }
}

// POST - Create new claim
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
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
      return NextResponse.json({ error: 'Begraafplaats is verplicht' }, { status: 400 });
    }

    if (!verificationEmail) {
      return NextResponse.json({ error: 'Verificatie e-mail is verplicht' }, { status: 400 });
    }

    // Get cemetery data to check website
    const cemetery = await getCemeteryBySlug(cemeterySlug);
    if (!cemetery) {
      return NextResponse.json({ error: 'Begraafplaats niet gevonden' }, { status: 404 });
    }

    // Get website URL from cemetery data
    const websiteUrl = cemetery.website || cemetery.links || cemetery.website_url;

    // Extract domains
    const emailDomain = extractEmailDomain(verificationEmail);
    const websiteDomain = websiteUrl ? extractDomain(websiteUrl) : null;

    if (!emailDomain) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 });
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
        error: 'U heeft al een claim ingediend voor deze begraafplaats'
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
        error: 'Deze begraafplaats is al geclaimd door een andere gebruiker'
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
        notes: `slug:${cemeterySlug}\nwebsite:${websiteUrl || 'geen'}\nauto_verify:${canAutoVerify}${notes ? `\n${notes}` : ''}`,
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
      return NextResponse.json({ error: 'Kon verificatie email niet verzenden' }, { status: 500 });
    }

    // Build response message based on verification method
    let message = 'Claim ingediend. Controleer uw e-mail voor de verificatiecode.';
    if (!canAutoVerify) {
      message += ' Let op: uw e-maildomein komt niet overeen met de website van de begraafplaats. Na verificatie wordt uw claim handmatig beoordeeld.';
    }

    return NextResponse.json({
      success: true,
      message,
      claimId: claim.id,
      canAutoVerify,
    });
  } catch (error) {
    console.error('Create claim error:', error);
    return NextResponse.json({ error: 'Er is iets misgegaan' }, { status: 500 });
  }
}
