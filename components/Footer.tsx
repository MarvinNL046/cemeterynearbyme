'use client';

import Link from 'next/link';
import { Mail, Facebook, Twitter, Linkedin, ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { FooterState, FooterType, FooterGuide } from '@/lib/footer-data';

// Fallback data for client-side rendering
const fallbackStates = [
  { name: 'California', slug: 'california', count: 0 },
  { name: 'Texas', slug: 'texas', count: 0 },
  { name: 'Florida', slug: 'florida', count: 0 },
  { name: 'New York', slug: 'new-york', count: 0 },
  { name: 'Pennsylvania', slug: 'pennsylvania', count: 0 },
  { name: 'Ohio', slug: 'ohio', count: 0 },
  { name: 'Illinois', slug: 'illinois', count: 0 },
  { name: 'Georgia', slug: 'georgia', count: 0 },
];

const fallbackTypes = [
  { name: 'Public Cemetery', slug: 'public-cemetery', count: 0 },
  { name: 'Memorial Park', slug: 'memorial-park', count: 0 },
  { name: 'National Cemetery', slug: 'national-cemetery', count: 0 },
  { name: 'Veterans Cemetery', slug: 'veterans-cemetery', count: 0 },
  { name: 'Natural Burial', slug: 'natural-burial', count: 0 },
  { name: 'Green Cemetery', slug: 'green-cemetery', count: 0 },
  { name: 'Catholic Cemetery', slug: 'catholic-cemetery', count: 0 },
  { name: 'Jewish Cemetery', slug: 'jewish-cemetery', count: 0 },
];

const guides: FooterGuide[] = [
  { href: '/guide/types', label: 'Types of Cemeteries' },
  { href: '/guide/famous-graves', label: 'Famous Graves' },
  { href: '/guide/funeral-planning', label: 'Funeral Planning' },
  { href: '/guide/veterans', label: 'Veterans Benefits' },
  { href: '/guide/green-burial', label: 'Green Burial' },
];

const information = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  { href: '/deaths', label: 'Deaths Calendar' },
  { href: '/faq', label: 'FAQ' },
];

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

function FooterSection({ title, children, isOpen, onToggle, isMobile }: FooterSectionProps) {
  if (isMobile) {
    return (
      <div className="border-b border-white/10">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between py-4 text-left"
          aria-expanded={isOpen}
        >
          <h4 className="font-semibold text-gold-300">{title}</h4>
          <ChevronDown
            className={`w-5 h-5 text-gold-300 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-semibold mb-4 text-gold-300">{title}</h4>
      {children}
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [topStates, setTopStates] = useState<FooterState[]>(fallbackStates);
  const [topTypes, setTopTypes] = useState<FooterType[]>(fallbackTypes);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Fetch dynamic data on mount
  useEffect(() => {
    async function fetchFooterData() {
      try {
        const response = await fetch('/api/footer-data');
        if (response.ok) {
          const data = await response.json();
          if (data.states?.length > 0) setTopStates(data.states);
          if (data.types?.length > 0) setTopTypes(data.types);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
        // Keep fallback data on error
      }
    }
    fetchFooterData();
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setEmail('');
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderLinks = (items: Array<{ href: string; label: string }>, type: 'state' | 'type' | 'guide' | 'info') => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block py-1.5 text-primary-foreground/70 hover:text-white transition-colors text-sm sm:text-base"
          >
            {item.label}
          </Link>
        </li>
      ))}
      {(type === 'state' || type === 'type') && (
        <li>
          <Link
            href={type === 'state' ? '/states' : '/types'}
            className="block py-1.5 text-gold-300 hover:text-white transition-colors text-sm sm:text-base font-medium"
          >
            View All &rarr;
          </Link>
        </li>
      )}
    </ul>
  );

  const stateLinks = topStates.map(s => ({ href: `/state/${s.slug}`, label: s.name }));
  const typeLinks = topTypes.map(t => ({ href: `/type/${t.slug}`, label: t.name }));

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
        {/* Desktop Layout - 5 columns */}
        <div className="hidden md:grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Logo variant="light" size="md" className="mb-4" />
            <p className="text-primary-foreground/70 mb-6 text-sm">
              Your complete guide to finding cemeteries across the United States.
              Current information, hours, and directions for thousands of locations nationwide.
            </p>
            {/* Social icons */}
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

          {/* Guides Column */}
          <div>
            <h4 className="font-semibold mb-4 text-gold-300">Guides</h4>
            {renderLinks(guides, 'guide')}
          </div>

          {/* Popular States Column */}
          <div>
            <h4 className="font-semibold mb-4 text-gold-300">Popular States</h4>
            {renderLinks(stateLinks, 'state')}
          </div>

          {/* Cemetery Types Column */}
          <div>
            <h4 className="font-semibold mb-4 text-gold-300">Cemetery Types</h4>
            {renderLinks(typeLinks, 'type')}
          </div>

          {/* Information Column */}
          <div>
            <h4 className="font-semibold mb-4 text-gold-300">Information</h4>
            {renderLinks(information, 'info')}
            <h4 className="font-semibold mt-6 mb-3 text-gold-300">Contact</h4>
            <a
              href="mailto:info@cemeterynearbyme.com"
              className="flex items-center gap-2 py-1.5 text-primary-foreground/70 hover:text-white transition-colors text-sm"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="break-all">info@cemeterynearbyme.com</span>
            </a>
          </div>
        </div>

        {/* Mobile Layout - Accordion */}
        <div className="md:hidden">
          {/* Logo & Description - Always visible */}
          <div className="pb-6 mb-6 border-b border-white/10">
            <Logo variant="light" size="md" className="mb-4" />
            <p className="text-primary-foreground/70 mb-6 text-sm">
              Your complete guide to finding cemeteries across the United States.
            </p>
            {/* Social icons */}
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

          {/* Accordion Sections */}
          <FooterSection
            title="Guides"
            isOpen={openSections['guides']}
            onToggle={() => toggleSection('guides')}
            isMobile={true}
          >
            {renderLinks(guides, 'guide')}
          </FooterSection>

          <FooterSection
            title="Popular States"
            isOpen={openSections['states']}
            onToggle={() => toggleSection('states')}
            isMobile={true}
          >
            {renderLinks(stateLinks, 'state')}
          </FooterSection>

          <FooterSection
            title="Cemetery Types"
            isOpen={openSections['types']}
            onToggle={() => toggleSection('types')}
            isMobile={true}
          >
            {renderLinks(typeLinks, 'type')}
          </FooterSection>

          <FooterSection
            title="Information"
            isOpen={openSections['info']}
            onToggle={() => toggleSection('info')}
            isMobile={true}
          >
            {renderLinks(information, 'info')}
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-sm font-medium text-gold-300">Contact:</span>
              <a
                href="mailto:info@cemeterynearbyme.com"
                className="flex items-center gap-2 py-1.5 text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">info@cemeterynearbyme.com</span>
              </a>
            </div>
          </FooterSection>
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
