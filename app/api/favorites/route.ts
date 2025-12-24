import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCurrentUser } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Set RLS context for the current user
 * This enables Row Level Security policies to filter data automatically
 */
async function setRLSContext(userId: number | null) {
  if (userId) {
    await sql`SET LOCAL app.current_user_id = ${userId.toString()}`;
  } else {
    await sql`SET LOCAL app.current_user_id = ''`;
  }
}

// GET: Check if a cemetery is favorited or get all favorites
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    // Set RLS context - now queries are automatically filtered by user
    await setRLSContext(user.id);

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Check if specific cemetery is favorited
      // RLS ensures we only see our own favorites, but we still filter by slug
      const favorites = await sql`
        SELECT id FROM user_favorites_by_slug
        WHERE cemetery_slug = ${slug}
        LIMIT 1
      `;

      return NextResponse.json({
        isFavorite: favorites.length > 0
      });
    } else {
      // Get all favorites for user
      // RLS automatically filters to only show current user's favorites
      const favorites = await sql`
        SELECT id, cemetery_slug, cemetery_name, created_at
        FROM user_favorites_by_slug
        ORDER BY created_at DESC
      `;

      return NextResponse.json({ favorites });
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}

// POST: Add a cemetery to favorites
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    // Set RLS context
    await setRLSContext(user.id);

    const { slug, name } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Cemetery slug is required' }, { status: 400 });
    }

    // Check if already favorited (RLS filters automatically)
    const existing = await sql`
      SELECT id FROM user_favorites_by_slug
      WHERE cemetery_slug = ${slug}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Al toegevoegd aan favorieten'
      });
    }

    // Add to favorites
    // RLS INSERT policy ensures user_id matches current user
    await sql`
      INSERT INTO user_favorites_by_slug (user_id, cemetery_slug, cemetery_name)
      VALUES (${user.id}, ${slug}, ${name || null})
    `;

    return NextResponse.json({
      success: true,
      message: 'Toegevoegd aan favorieten'
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}

// DELETE: Remove a cemetery from favorites
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    // Set RLS context
    await setRLSContext(user.id);

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Cemetery slug is required' }, { status: 400 });
    }

    // RLS ensures we can only delete our own favorites
    await sql`
      DELETE FROM user_favorites_by_slug
      WHERE cemetery_slug = ${slug}
    `;

    return NextResponse.json({
      success: true,
      message: 'Verwijderd uit favorieten'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
