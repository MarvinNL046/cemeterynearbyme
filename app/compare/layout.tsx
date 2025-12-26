import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Cemeteries | CemeteryNearMe.com',
  description: 'Compare cemeteries side by side. View details, photos, ratings, and facilities to find the right cemetery.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
