import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { ContactFormEmail } from '@/emails/ContactFormEmail';
import { ContactConfirmationEmail } from '@/emails/ContactConfirmationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Subject label mapping
const subjectLabels: Record<string, string> = {
  algemeen: 'Algemene vraag',
  informatie: 'Informatie toevoegen/wijzigen',
  samenwerking: 'Samenwerking',
  technisch: 'Technisch probleem',
  anders: 'Anders',
};

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 }
      );
    }

    const subjectLabel = subjectLabels[subject] || subject;

    // Render email templates
    const adminEmailHtml = await render(
      ContactFormEmail({
        name,
        email,
        subject,
        subjectLabel,
        message,
      })
    );

    const confirmationEmailHtml = await render(
      ContactConfirmationEmail({
        name,
        subjectLabel,
        message,
      })
    );

    // Plain text version for better deliverability
    const adminEmailText = `
Nieuw contactbericht via Begraafplaats in de Buurt

Van: ${name}
E-mail: ${email}
Onderwerp: ${subjectLabel}

Bericht:
${message}

---
Dit bericht is verzonden via het contactformulier op begraafplaatsindebuurt.nl
    `.trim();

    // Send email to site owner with tags
    const { error } = await resend.emails.send({
      from: 'Begraafplaats in de Buurt <noreply@begraafplaatsindebuurt.nl>',
      to: ['info@begraafplaatsindebuurt.nl'],
      replyTo: email,
      subject: `[Contact] ${subjectLabel} - ${name}`,
      html: adminEmailHtml,
      text: adminEmailText,
      headers: {
        'List-Unsubscribe': '<https://www.begraafplaatsindebuurt.nl/afmelden>',
      },
      tags: [
        { name: 'platform', value: 'begraafplaatsindebuurt' },
        { name: 'type', value: 'contact-form' },
        { name: 'category', value: subject },
      ],
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Er ging iets mis bij het verzenden van uw bericht' },
        { status: 500 }
      );
    }

    // Plain text confirmation
    const confirmationEmailText = `
Beste ${name},

Bedankt voor uw bericht. Wij hebben uw bericht goed ontvangen en zullen zo spoedig mogelijk reageren.

Onderwerp: ${subjectLabel}

Uw bericht:
${message}

Met vriendelijke groet,
Begraafplaats in de Buurt

---
Dit is een automatische bevestiging. Antwoord niet op deze email.
https://www.begraafplaatsindebuurt.nl
    `.trim();

    // Send confirmation email to the sender with tags
    await resend.emails.send({
      from: 'Begraafplaats in de Buurt <noreply@begraafplaatsindebuurt.nl>',
      to: [email],
      subject: 'Bevestiging: Uw bericht is ontvangen',
      html: confirmationEmailHtml,
      text: confirmationEmailText,
      headers: {
        'List-Unsubscribe': '<https://www.begraafplaatsindebuurt.nl/afmelden>',
      },
      tags: [
        { name: 'platform', value: 'begraafplaatsindebuurt' },
        { name: 'type', value: 'contact-confirmation' },
        { name: 'category', value: subject },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van uw bericht' },
      { status: 500 }
    );
  }
}
