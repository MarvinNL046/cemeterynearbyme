'use client';

import Link from 'next/link';
import { Mail, Facebook, Twitter, Linkedin } from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const popularStates = [
  { href: '/state/california', label: 'California' },
  { href: '/state/texas', label: 'Texas' },
  { href: '/state/florida', label: 'Florida' },
  { href: '/state/new-york', label: 'New York' },
  { href: '/state/pennsylvania', label: 'Pennsylvania' },
  { href: '/state/ohio', label: 'Ohio' },
];

const cemeteryTypes = [
  { href: '/type/cemetery', label: 'Public Cemeteries' },
  { href: '/type/memorial-park', label: 'Memorial Parks' },
  { href: '/type/national-cemetery', label: 'National Cemeteries' },
  { href: '/type/natural-burial', label: 'Natural Burial Grounds' },
  { href: '/type/jewish-cemetery', label: 'Jewish Cemeteries' },
  { href: '/type/catholic-cemetery', label: 'Catholic Cemeteries' },
];

const information = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  { href: '/deaths', label: 'Deaths Calendar' },
  { href: '/funeral-planning', label: 'Funeral Planning' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl font-semibold mb-3">
              Stay Updated
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Receive updates about new cemeteries, funeral planning resources, and more.
            </p>
            {subscribed ? (
              <p className="text-gold-300 font-medium">
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button variant="gold" type="submit" size="lg">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Logo variant="light" size="md" className="mb-4" />
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Your complete guide to finding cemeteries across the United States.
              Current information, hours, and directions for thousands of locations nationwide.
            </p>
            {/* Social icons - min 44x44px touch targets */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Popular States */}
          <div>
            <h4 className="font-semibold mb-4 text-gold-300">Popular States</h4>
            <ul className="space-y-1">
              {popularStates.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-primary-foreground/70 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cemetery Types */}
          <div>
            <h4 className="font-semibold mb-4 text-gold-300">Cemetery Types</h4>
            <ul className="space-y-1">
              {cemeteryTypes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-primary-foreground/70 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information & Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-gold-300">Information</h4>
            <ul className="space-y-1 mb-6">
              {information.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-primary-foreground/70 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold mb-3 text-gold-300">Contact</h4>
            <ul className="space-y-1">
              <li>
                <a
                  href="mailto:info@cemeterynearbyme.com"
                  className="flex items-center gap-2 py-1.5 text-primary-foreground/70 hover:text-white transition-colors text-sm sm:text-base"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">info@cemeterynearbyme.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} CemeteryNearMe.com. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
