import { NextRequest, NextResponse } from 'next/server';
import { db, userCemeteries } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

// Generate a slug from cemetery name and gemeente
function generateSlug(naam: string, gemeente: string): string {
  const combined = `${naam}-${gemeente}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET - Get user's submitted cemeteries
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Je moet ingelogd zijn om je begraafplaatsen te bekijken' },
        { status: 401 }
      );
    }

    const submissions = await db
      .select()
      .from(userCemeteries)
      .where(eq(userCemeteries.userId, user.id))
      .orderBy(desc(userCemeteries.createdAt));

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching user cemeteries:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van je begraafplaatsen' },
      { status: 500 }
    );
  }
}

// POST - Submit a new cemetery
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Je moet ingelogd zijn om een begraafplaats toe te voegen' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['naam', 'plaats', 'gemeente', 'provincie'];
    for (const field of requiredFields) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { error: `Veld '${field}' is verplicht` },
          { status: 400 }
        );
      }
    }

    // Generate slug
    const slug = generateSlug(body.naam, body.gemeente);

    // Check for duplicate slug
    const existing = await db
      .select({ id: userCemeteries.id })
      .from(userCemeteries)
      .where(eq(userCemeteries.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Er bestaat al een begraafplaats met deze naam in deze gemeente' },
        { status: 409 }
      );
    }

    // Validate photos array if provided
    let photos: string[] = [];
    if (body.photos && Array.isArray(body.photos)) {
      photos = body.photos.filter((url: string) =>
        typeof url === 'string' && url.startsWith('/uploads/')
      );
    }

    // Create the submission
    const [submission] = await db
      .insert(userCemeteries)
      .values({
        userId: user.id,
        naam: body.naam.trim(),
        slug,
        type: body.type?.trim() || 'algemene begraafplaats',
        adres: body.adres?.trim() || null,
        postcode: body.postcode?.trim() || null,
        plaats: body.plaats.trim(),
        gemeente: body.gemeente.trim(),
        provincie: body.provincie.trim(),
        gpsCoordinaten: body.gpsCoordinaten?.trim() || null,
        telefoon: body.telefoon?.trim() || null,
        email: body.email?.trim() || null,
        website: body.website?.trim() || null,
        beschrijving: body.beschrijving?.trim() || null,
        openingstijden: body.openingstijden?.trim() || null,
        faciliteiten: body.faciliteiten?.trim() || null,
        jaarOprichting: body.jaarOprichting?.trim() || null,
        photos: photos.length > 0 ? JSON.stringify(photos) : null,
        status: 'pending',
      })
      .returning();

    return NextResponse.json({
      message: 'Begraafplaats succesvol ingediend ter beoordeling',
      submission: {
        id: submission.id,
        slug: submission.slug,
        status: submission.status,
      },
    });
  } catch (error) {
    console.error('Error creating user cemetery:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het toevoegen van de begraafplaats' },
      { status: 500 }
    );
  }
}
