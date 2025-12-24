import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Begraafplaats in de Buurt <noreply@begraafplaatsindebuurt.nl>';

// Brand colors
const colors = {
  primary: '#2D4A3E',
  primaryLight: '#394C44',
  accent: '#C4A35A',
  accentLight: '#DFA94A',
  background: '#F8F6F1',
  foreground: '#2A3B32',
  muted: '#6B7B6E',
  border: '#DDD8CC',
  white: '#FFFFFF',
};

export async function sendVerificationEmail(
  to: string,
  code: string,
  type: 'register' | 'login' | 'claim'
): Promise<{ success: boolean; error?: string }> {
  const subjects = {
    register: 'Bevestig uw e-mailadres - Begraafplaats in de Buurt',
    login: 'Uw inlogcode - Begraafplaats in de Buurt',
    claim: 'Verificatiecode voor uw claim - Begraafplaats in de Buurt',
  };

  const titles = {
    register: 'Welkom bij Begraafplaats in de Buurt',
    login: 'Uw inlogcode',
    claim: 'Verifieer uw claim',
  };

  const descriptions = {
    register: 'Bedankt voor uw registratie. Gebruik onderstaande code om uw e-mailadres te bevestigen.',
    login: 'Gebruik onderstaande code om in te loggen op uw account.',
    claim: 'Gebruik onderstaande code om uw claim te verifiëren.',
  };

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: subjects[type],
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${colors.foreground}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
  <div style="background-color: ${colors.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(45, 74, 62, 0.08);">
    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, 'Times New Roman', serif;">
        <span style="color: ${colors.white};">Begraafplaats</span><span style="color: ${colors.accent};">indebuurt</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: ${colors.foreground}; margin-top: 0; font-family: Georgia, 'Times New Roman', serif;">${titles[type]}</h2>
      <p style="color: ${colors.muted};">${descriptions[type]}</p>

      <div style="background: ${colors.background}; border: 2px dashed ${colors.accent}; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
        <p style="margin: 0 0 10px 0; color: ${colors.muted}; font-size: 14px;">Uw verificatiecode:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: ${colors.primary};">
          ${code}
        </div>
      </div>

      <p style="color: ${colors.muted}; font-size: 14px;">
        Deze code is 15 minuten geldig. Deel deze code met niemand.
      </p>

      <hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;">

      <p style="color: ${colors.muted}; font-size: 12px; text-align: center;">
        Als u deze e-mail niet heeft aangevraagd, kunt u deze veilig negeren.
      </p>
    </div>

    <div style="text-align: center; padding: 24px; color: ${colors.muted}; font-size: 12px; background-color: ${colors.background}; border-top: 1px solid ${colors.border};">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Begraafplaats in de Buurt</p>
      <p style="margin: 5px 0 0 0;">
        <a href="https://www.begraafplaatsindebuurt.nl" style="color: ${colors.accent};">begraafplaatsindebuurt.nl</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Welkom bij Begraafplaats in de Buurt!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${colors.foreground}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
  <div style="background-color: ${colors.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(45, 74, 62, 0.08);">
    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, 'Times New Roman', serif;">
        <span style="color: ${colors.white};">Begraafplaats</span><span style="color: ${colors.accent};">indebuurt</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: ${colors.foreground}; margin-top: 0; font-family: Georgia, 'Times New Roman', serif;">Welkom, ${name}!</h2>

      <p style="color: ${colors.muted}; font-size: 16px;">
        Bedankt voor het aanmaken van een account bij Begraafplaats in de Buurt.
        We zijn blij dat u deel uitmaakt van onze community!
      </p>

      <div style="background: ${colors.background}; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid ${colors.border};">
        <h3 style="color: ${colors.primary}; margin-top: 0; font-size: 16px;">Wat kunt u doen met uw account?</h3>
        <ul style="color: ${colors.muted}; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;">Begraafplaats vermeldingen claimen en beheren</li>
          <li style="margin-bottom: 8px;">Uw contactgegevens en openingstijden updaten</li>
          <li style="margin-bottom: 8px;">Foto's toevoegen aan uw vermelding</li>
          <li style="margin-bottom: 8px;">Berichten van bezoekers ontvangen</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.begraafplaatsindebuurt.nl/dashboard"
           style="background: ${colors.accent}; color: ${colors.foreground}; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
          Ga naar uw Dashboard
        </a>
      </div>

      <p style="color: ${colors.muted}; font-size: 14px;">
        Heeft u een begraafplaats? Zoek uw locatie op en klik op "Claim deze vermelding"
        om de gegevens te beheren.
      </p>

      <hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;">

      <p style="color: ${colors.muted}; font-size: 14px;">
        Vragen? Neem gerust contact met ons op via
        <a href="https://www.begraafplaatsindebuurt.nl/contact" style="color: ${colors.accent};">ons contactformulier</a>.
      </p>
    </div>

    <div style="text-align: center; padding: 24px; color: ${colors.muted}; font-size: 12px; background-color: ${colors.background}; border-top: 1px solid ${colors.border};">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Begraafplaats in de Buurt</p>
      <p style="margin: 5px 0 0 0;">
        <a href="https://www.begraafplaatsindebuurt.nl" style="color: ${colors.accent};">begraafplaatsindebuurt.nl</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendClaimApprovedEmail(
  to: string,
  cemeteryName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Uw claim is goedgekeurd - ${cemeteryName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${colors.foreground}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
  <div style="background-color: ${colors.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(45, 74, 62, 0.08);">
    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, 'Times New Roman', serif;">
        <span style="color: ${colors.white};">Begraafplaats</span><span style="color: ${colors.accent};">indebuurt</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: ${colors.foreground}; margin-top: 0; font-family: Georgia, 'Times New Roman', serif;">Uw claim is goedgekeurd!</h2>
      <p style="color: ${colors.muted};">
        Goed nieuws! Uw claim voor <strong style="color: ${colors.foreground};">${cemeteryName}</strong> is goedgekeurd.
      </p>

      <p style="color: ${colors.muted};">
        U kunt nu inloggen op uw dashboard om de gegevens van uw begraafplaats te beheren.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.begraafplaatsindebuurt.nl/dashboard"
           style="background: ${colors.accent}; color: ${colors.foreground}; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
          Ga naar Dashboard
        </a>
      </div>
    </div>

    <div style="text-align: center; padding: 24px; color: ${colors.muted}; font-size: 12px; background-color: ${colors.background}; border-top: 1px solid ${colors.border};">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Begraafplaats in de Buurt</p>
      <p style="margin: 5px 0 0 0;">
        <a href="https://www.begraafplaatsindebuurt.nl" style="color: ${colors.accent};">begraafplaatsindebuurt.nl</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
