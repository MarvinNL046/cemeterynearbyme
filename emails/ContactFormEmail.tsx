import {
  Heading,
  Hr,
  Link,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { BaseTemplate } from './BaseTemplate';

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  subjectLabel: string;
  message: string;
}

// Brand colors
const colors = {
  primary: '#2D4A3E',
  accent: '#C4A35A',
  background: '#F8F6F1',
  foreground: '#2A3B32',
  muted: '#6B7B6E',
  border: '#DDD8CC',
};

export const ContactFormEmail = ({
  name,
  email,
  subject,
  subjectLabel,
  message,
}: ContactFormEmailProps) => {
  return (
    <BaseTemplate preview={`Nieuw contactbericht van ${name}`}>
      <Heading style={heading}>Nieuw contactformulier bericht</Heading>

      <Text style={paragraph}>
        Er is een nieuw bericht binnengekomen via het contactformulier op de website.
      </Text>

      <Section style={infoBox}>
        <Row style={infoRow}>
          <Column style={labelColumn}>
            <Text style={label}>Naam</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={value}>{name}</Text>
          </Column>
        </Row>

        <Hr style={divider} />

        <Row style={infoRow}>
          <Column style={labelColumn}>
            <Text style={label}>E-mail</Text>
          </Column>
          <Column style={valueColumn}>
            <Link href={`mailto:${email}`} style={emailLink}>
              {email}
            </Link>
          </Column>
        </Row>

        <Hr style={divider} />

        <Row style={infoRow}>
          <Column style={labelColumn}>
            <Text style={label}>Onderwerp</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={value}>{subjectLabel}</Text>
          </Column>
        </Row>
      </Section>

      <Section style={messageBox}>
        <Text style={messageLabel}>Bericht:</Text>
        <Text style={messageText}>{message}</Text>
      </Section>

      <Hr style={hr} />

      <Text style={hint}>
        U kunt direct antwoorden op deze email om te reageren naar {name}.
      </Text>
    </BaseTemplate>
  );
};

// Styles
const heading = {
  color: colors.foreground,
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px',
  fontFamily: 'Georgia, "Times New Roman", serif',
};

const paragraph = {
  color: colors.muted,
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 24px',
};

const infoBox = {
  backgroundColor: colors.background,
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '0 0 24px',
  border: `1px solid ${colors.border}`,
};

const infoRow = {
  width: '100%',
};

const labelColumn = {
  width: '100px',
  verticalAlign: 'top' as const,
};

const valueColumn = {
  verticalAlign: 'top' as const,
};

const label = {
  color: colors.muted,
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '8px 0',
};

const value = {
  color: colors.foreground,
  fontSize: '14px',
  margin: '8px 0',
};

const emailLink = {
  color: colors.accent,
  fontSize: '14px',
  textDecoration: 'none',
};

const divider = {
  borderColor: colors.border,
  margin: '0',
};

const messageBox = {
  backgroundColor: '#FFFFFF',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px',
};

const messageLabel = {
  color: colors.foreground,
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const messageText = {
  color: colors.muted,
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  borderColor: colors.border,
  margin: '24px 0',
};

const hint = {
  color: colors.muted,
  fontSize: '12px',
  fontStyle: 'italic' as const,
  margin: '0',
};

export default ContactFormEmail;
