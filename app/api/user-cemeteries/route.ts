import { NextRequest, NextResponse } from 'next/server';
import { db, userCemeteries } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

// Generate a slug from cemetery name and county
function generateSlug(name: string, county: string): string {
  const combined = `${name}-${county}`;
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
        { error: 'You must be logged in to view your cemeteries' },
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
      { error: 'An error occurred while fetching your cemeteries' },
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
        { error: 'You must be logged in to add a cemetery' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'city', 'county', 'state'];
    for (const field of requiredFields) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    // Generate slug
    const slug = generateSlug(body.name, body.county);

    // Check for duplicate slug
    const existing = await db
      .select({ id: userCemeteries.id })
      .from(userCemeteries)
      .where(eq(userCemeteries.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A cemetery with this name already exists in this municipality' },
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
        name: body.name.trim(),
        slug,
        type: body.type?.trim() || 'general cemetery',
        address: body.address?.trim() || null,
        zipCode: body.zipCode?.trim() || null,
        city: body.city.trim(),
        county: body.county.trim(),
        state: body.state.trim(),
        gpsCoordinates: body.gpsCoordinates?.trim() || null,
        phone: body.phone?.trim() || null,
        email: body.email?.trim() || null,
        website: body.website?.trim() || null,
        description: body.description?.trim() || null,
        openingHours: body.openingHours?.trim() || null,
        facilities: body.facilities?.trim() || null,
        yearEstablished: body.yearEstablished?.trim() || null,
        photos: photos.length > 0 ? JSON.stringify(photos) : null,
        status: 'pending',
      })
      .returning();

    return NextResponse.json({
      message: 'Cemetery successfully submitted for review',
      submission: {
        id: submission.id,
        slug: submission.slug,
        status: submission.status,
      },
    });
  } catch (error) {
    console.error('Error creating user cemetery:', error);
    return NextResponse.json(
      { error: 'An error occurred while adding the cemetery' },
      { status: 500 }
    );
  }
}
