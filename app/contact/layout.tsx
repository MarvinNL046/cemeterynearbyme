import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Cemetery Near Me',
  description: 'Contact Cemetery Near Me for questions, suggestions or collaborations.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
