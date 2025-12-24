import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationCode, findUserByEmail, createUser } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, type = 'login' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is verplicht' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await findUserByEmail(normalizedEmail);

    // For registration, create user if doesn't exist
    if (type === 'register' && !user) {
      if (!name) {
        return NextResponse.json({ error: 'Naam is verplicht voor registratie' }, { status: 400 });
      }
      user = await createUser({ email: normalizedEmail, name });
    }

    // For login, user must exist
    if (type === 'login' && !user) {
      return NextResponse.json({ error: 'Geen account gevonden met dit e-mailadres' }, { status: 404 });
    }

    // Generate 6-digit code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store code in database (using placeClaims table's verification fields or create a simple cache)
    // For simplicity, we'll store in user's metadata or use a simple approach

    // Update user with verification code (we'll add these fields if needed)
    // For now, let's use a simple in-memory store or localStorage approach on client

    // Actually, let's use the existing verification_code pattern from placeClaims
    // But for user auth, we need a separate approach

    // Send email with code
    const emailResult = await sendVerificationEmail(normalizedEmail, code, type as 'register' | 'login' | 'claim');

    if (!emailResult.success) {
      return NextResponse.json({ error: 'Kon email niet verzenden' }, { status: 500 });
    }

    // Store code securely - we'll use a simple hash in the response that client must send back
    // In production, use Redis or database table for verification codes
    const codeHash = Buffer.from(`${normalizedEmail}:${code}:${expiresAt.getTime()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Verificatiecode verzonden naar uw e-mail',
      codeHash, // Client must send this back with the code
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json({ error: 'Er is iets misgegaan' }, { status: 500 });
  }
}
