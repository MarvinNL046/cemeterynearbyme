import { NextRequest, NextResponse } from 'next/server';
import { db, websiteFeedback } from '@/lib/db';
import { Resend } from 'resend';

// Lazy initialization to avoid build errors when API key is not set
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

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

    // Send email notification for feedback (only if Resend is configured)
    const resendClient = getResend();
    if (resendClient) {
      try {
        const ratingStars = rating ? '⭐'.repeat(rating) + '☆'.repeat(5 - rating) : 'No rating';
        const ratingText = rating ? `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)` : 'No rating';

        // Plain text version for better deliverability
        const feedbackEmailText = `
New Feedback - Cemetery Near Me

Type: ${type === 'rating' ? 'Rating' : 'Feedback message'}
${rating ? `Rating: ${ratingText}` : ''}
${comment ? `Message: ${comment}` : ''}
Page: ${page_title || 'Unknown'}
URL: https://www.cemeterynearbyme.com${page_url || '/'}

Received on: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}

---
This is an automatic notification from cemeterynearbyme.com
        `.trim();

        await resendClient.emails.send({
        from: 'Cemetery Near Me <noreply@cemeterynearbyme.com>',
        to: ['info@begraafplaatsindebuurt.nl'],
        subject: `[Feedback] ${type === 'rating' ? `Rating: ${rating}/5` : 'New feedback'} - ${page_title || 'Website'}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2D4A3E; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">
      <span style="color: white;">Cemetery</span><span style="color: #C4A35A;">NearMe</span>
    </h1>
  </div>

  <div style="background: white; padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #2D4A3E; margin-top: 0;">New Feedback Received</h2>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Type:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${type === 'rating' ? 'Rating' : 'Feedback message'}</td>
      </tr>
      ${rating ? `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Rating:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${ratingStars} (${rating}/5)</td>
      </tr>
      ` : ''}
      ${comment ? `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${comment}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Page:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${page_title || 'Unknown'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">URL:</td>
        <td style="padding: 8px 0;">
          <a href="https://www.cemeterynearbyme.com${page_url}" style="color: #C4A35A;">
            ${page_url || '/'}
          </a>
        </td>
      </tr>
    </table>

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Received on: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
    </p>
  </div>
</body>
</html>
        `,
        text: feedbackEmailText,
        headers: {
          'List-Unsubscribe': '<https://www.cemeterynearbyme.com/unsubscribe>',
        },
        tags: [
          { name: 'platform', value: 'cemeterynearbyme' },
          { name: 'type', value: 'feedback-notification' },
        ],
        });
      } catch (emailError) {
        // Don't fail the request if email fails
        console.error('Failed to send feedback notification email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
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
