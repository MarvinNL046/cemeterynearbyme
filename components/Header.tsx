'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/state', label: 'States' },
  { href: '/type', label: 'Types' },
  { href: '/deaths', label: 'Calendar' },
  { href: '/funeral-planning', label: 'Funeral Planning', highlight: true },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-soft' : ''
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    link.highlight
                      ? 'text-accent hover:text-accent/80 hover:bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/search">
              <Button variant="gold" size="sm">
                Find a Cemetery
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button - min 44x44px touch target */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 -m-1 rounded-lg hover:bg-secondary/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      link.highlight
                        ? 'text-accent font-medium hover:bg-accent/10'
                        : 'text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Search CTA */}
            <div className="mt-4 pt-4 border-t">
              <Link href="/search" onClick={() => setIsMenuOpen(false)}>
                <Button variant="gold" className="w-full" size="lg">
                  Find a Cemetery
                </Button>
              </Link>
            </div>

          </div>
        )}
      </nav>
    </header>
  );
}
