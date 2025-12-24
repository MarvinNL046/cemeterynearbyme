import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import CookieConsent from "@/components/CookieConsent";
import GoogleConsent from "@/components/GoogleConsent";
import GoogleTagManagerNoscript from "@/components/GoogleTagManagerNoscript";
import FeedbackRibbon from "@/components/FeedbackRibbon";
import AffiliateBottomBar from "@/components/AffiliateBottomBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImpersonationBanner from "@/components/ImpersonationBanner";
import LeaderboardAd from "@/components/ads/LeaderboardAd";
import PWARegister from "@/components/PWARegister";

// AdSense Publisher ID - vervang met je eigen ID na goedkeuring
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-XXXXXXXXXXXXXXXX";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// PWA Viewport configuration
export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Begraafplaats in de Buurt - Vind een Begraafplaats bij u in de Buurt",
  description: "Zoek eenvoudig naar begraafplaatsen in uw omgeving. Vind contactgegevens, openingstijden en routebeschrijvingen van begraafplaatsen in heel Nederland.",
  keywords: "begraafplaats, begraafplaatsen, Nederland, kerkhof, uitvaart, laatste rustplaats, graf, crematorium",
  authors: [{ name: "Begraafplaats in de Buurt" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Begraafplaats",
  },
  formatDetection: {
    telephone: true,
  },
  verification: {
    google: "6gIM1Pu7N2Z1xioNHH17jYaaTPE-5Cx9SWWi-I02YKI",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://www.begraafplaatsindebuurt.nl",
    title: "Begraafplaats in de Buurt",
    description: "Vind eenvoudig een begraafplaats bij u in de buurt",
    siteName: "Begraafplaats in de Buurt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Begraafplaats in de Buurt",
    description: "Vind eenvoudig een begraafplaats bij u in de buurt",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.begraafplaatsindebuurt.nl",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        {/* PWA Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />

        {/* Google AdSense - Automatische advertenties */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ImpersonationBanner />
        <GoogleConsent />
        <GoogleTagManagerNoscript />
        <Header />
        
        <main className="min-h-screen">
          {children}
        </main>

        {/* Pre-footer ad */}
        <LeaderboardAd className="mt-12" />

        <Footer />
        <CookieConsent />
        <AffiliateBottomBar />
        <FeedbackRibbon />
        <Analytics />
        <PWARegister />
      </body>
    </html>
  );
}
