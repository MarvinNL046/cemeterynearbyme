import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { generateToken, findUserByEmail } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, codeHash } = body;

    if (!email || !code || !codeHash) {
      return NextResponse.json({ error: 'Email, code en codeHash zijn verplicht' }, { status: 400 });
    }

    // Decode and verify the code hash
    try {
      const decoded = Buffer.from(codeHash, 'base64').toString('utf-8');
      const [storedEmail, storedCode, expiresAtStr] = decoded.split(':');

      // Verify email matches
      if (storedEmail.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ error: 'Ongeldige verificatie' }, { status: 400 });
      }

      // Verify code matches
      if (storedCode !== code) {
        return NextResponse.json({ error: 'Onjuiste code' }, { status: 400 });
      }

      // Verify not expired
      const expiresAt = parseInt(expiresAtStr, 10);
      if (Date.now() > expiresAt) {
        return NextResponse.json({ error: 'Code is verlopen' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Ongeldige verificatie' }, { status: 400 });
    }

    // Get or create user
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 });
    }

    // Check if this is first time verification (for welcome email)
    const isFirstVerification = !user.emailVerified;

    // Mark email as verified
    await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date().toISOString() })
      .where(eq(users.id, user.id));

    // Send welcome email for new registrations
    if (isFirstVerification && user.name) {
      sendWelcomeEmail(user.email, user.name).catch(err => {
        console.error('Failed to send welcome email:', err);
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Succesvol ingelogd',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set auth cookie via response header
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: 'Er is iets misgegaan' }, { status: 500 });
  }
}
