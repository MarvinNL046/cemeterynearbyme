import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Cemeteries | CemeteryNearMe.com',
  description: 'Search our database of cemeteries and memorial parks across the United States. Find cemeteries by name, city, state, or zip code.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
