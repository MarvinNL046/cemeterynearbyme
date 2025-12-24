import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Begraafplaats in de Buurt',
  description: 'Neem contact op met Begraafplaats in de Buurt voor vragen, suggesties of samenwerkingen.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
