import { NextRequest, NextResponse } from 'next/server';
import { db, websiteFeedback } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, page_title, page_url, type = 'rating' } = body;

    // Validate required fields
    if (type === 'rating' && (!rating || rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Invalid rating. Must be between 1 and 5.' },
        { status: 400 }
      );
    }

    if (type === 'comment' && !comment) {
      return NextResponse.json(
        { error: 'Comment is required for feedback type.' },
        { status: 400 }
      );
    }

    // Get user info
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'Unknown';

    // Insert feedback into Neon database
    const [data] = await db.insert(websiteFeedback).values({
      type,
      rating: type === 'rating' ? rating : null,
      feedback: comment || null,
      pageTitle: page_title || null,
      pageUrl: page_url || null,
      userAgent,
      ipAddress: ip,
      status: 'new',
    }).returning();

    // Send email notification for feedback
    try {
      const ratingStars = rating ? '⭐'.repeat(rating) + '☆'.repeat(5 - rating) : 'Geen rating';
      const ratingText = rating ? `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)` : 'Geen rating';

      // Plain text version for better deliverability
      const feedbackEmailText = `
Nieuwe Feedback - Begraafplaats in de Buurt

Type: ${type === 'rating' ? 'Beoordeling' : 'Feedback bericht'}
${rating ? `Rating: ${ratingText}` : ''}
${comment ? `Bericht: ${comment}` : ''}
Pagina: ${page_title || 'Onbekend'}
URL: https://www.begraafplaatsindebuurt.nl${page_url || '/'}

Ontvangen op: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}

---
Dit is een automatische notificatie van begraafplaatsindebuurt.nl
      `.trim();

      await resend.emails.send({
        from: 'Begraafplaats in de Buurt <noreply@begraafplaatsindebuurt.nl>',
        to: ['info@begraafplaatsindebuurt.nl'],
        subject: `[Feedback] ${type === 'rating' ? `Rating: ${rating}/5` : 'Nieuwe feedback'} - ${page_title || 'Website'}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2D4A3E; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">
      <span style="color: white;">Begraafplaats</span><span style="color: #C4A35A;">indebuurt</span>
    </h1>
  </div>

  <div style="background: white; padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #2D4A3E; margin-top: 0;">Nieuwe Feedback Ontvangen</h2>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Type:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${type === 'rating' ? 'Beoordeling' : 'Feedback bericht'}</td>
      </tr>
      ${rating ? `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Rating:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${ratingStars} (${rating}/5)</td>
      </tr>
      ` : ''}
      ${comment ? `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Bericht:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${comment}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Pagina:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${page_title || 'Onbekend'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">URL:</td>
        <td style="padding: 8px 0;">
          <a href="https://www.begraafplaatsindebuurt.nl${page_url}" style="color: #C4A35A;">
            ${page_url || '/'}
          </a>
        </td>
      </tr>
    </table>

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Ontvangen op: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}
    </p>
  </div>
</body>
</html>
        `,
        text: feedbackEmailText,
        headers: {
          'List-Unsubscribe': '<https://www.begraafplaatsindebuurt.nl/afmelden>',
        },
        tags: [
          { name: 'platform', value: 'begraafplaatsindebuurt' },
          { name: 'type', value: 'feedback-notification' },
        ],
      });
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('Failed to send feedback notification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Bedankt voor uw feedback!',
      data
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Feedback API is working'
  });
}
