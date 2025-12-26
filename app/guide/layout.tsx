import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Cemetery Near Me Guides',
    default: 'Cemetery Guides & Resources | Cemetery Near Me',
  },
  description: 'Expert guides on cemetery types, funeral planning, veterans benefits, green burial, and famous graves across America.',
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary/20 min-h-screen">
      {children}
    </div>
  );
}
