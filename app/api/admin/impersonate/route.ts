import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { requireAdmin } from '@/lib/admin';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST - Start impersonating a user
export async function POST(request: NextRequest) {
  const { authorized, response, user: adminUser } = await requireAdmin();
  if (!authorized) return response;

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Can't impersonate yourself
    if (adminUser && adminUser.id === userId) {
      return NextResponse.json(
        { error: 'Je kunt jezelf niet impersoneren' },
        { status: 400 }
      );
    }

    // Get target user
    const [targetUser] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 404 }
      );
    }

    // Generate token for target user
    const token = generateToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
    });

    const cookieStore = await cookies();

    // Save original admin token so we can return later
    const currentToken = cookieStore.get('auth_token')?.value;
    if (currentToken) {
      cookieStore.set('admin_original_token', currentToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2, // 2 hours max impersonation
        path: '/',
      });
    }

    // Set impersonation flag
    cookieStore.set('is_impersonating', 'true', {
      httpOnly: false, // Allow client-side access to show banner
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2,
      path: '/',
    });

    // Set new auth token as impersonated user
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: `Je bent nu ingelogd als ${targetUser.email}`,
    });
  } catch (error) {
    console.error('Error impersonating user:', error);
    return NextResponse.json(
      { error: 'Failed to impersonate user' },
      { status: 500 }
    );
  }
}

// DELETE - Stop impersonating and return to admin
export async function DELETE() {
  try {
    const cookieStore = await cookies();

    const originalToken = cookieStore.get('admin_original_token')?.value;

    if (!originalToken) {
      return NextResponse.json(
        { error: 'Geen originele sessie gevonden' },
        { status: 400 }
      );
    }

    // Restore original admin token
    cookieStore.set('auth_token', originalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Clear impersonation cookies
    cookieStore.delete('admin_original_token');
    cookieStore.delete('is_impersonating');

    return NextResponse.json({
      success: true,
      message: 'Terug naar admin account',
    });
  } catch (error) {
    console.error('Error stopping impersonation:', error);
    return NextResponse.json(
      { error: 'Failed to stop impersonation' },
      { status: 500 }
    );
  }
}
