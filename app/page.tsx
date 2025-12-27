'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Trees, Building2, Flag, Star, ArrowRight, Users, Award, Clock, Search, ChevronRight, Leaf, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FAQSection from '@/components/FAQSection';
import TodayDeathsWidget from '@/components/TodayDeathsWidget';
import { SITE_STATS, getComprehensiveDataText } from '@/lib/stats-config';
import OptimizedAd from '@/components/ads/OptimizedAd';
import MultiplexAd from '@/components/ads/MultiplexAd';
import { AD_SLOTS } from '@/lib/ad-config';

// Verified FREE Unsplash cemetery photos (Unsplash License - free for commercial use)
const heroImages = {
  // Foggy graveyard with tombstones - atmospheric hero image
  main: 'https://images.unsplash.com/photo-1707051772724-d976e49c785b?w=1920&q=80',
  // Rows of graves - good for national cemetery section
  national: 'https://images.unsplash.com/photo-1521993067561-ce35b1ce9a91?w=800&q=80',
  // Cross on green grass field
  cross: 'https://images.unsplash.com/photo-1590239549758-4c4bcc36971c?w=800&q=80',
  // Angel statue
  angel: 'https://images.unsplash.com/photo-1576686680193-8678028d1362?w=800&q=80',
  // Cement tombs
  tombs: 'https://images.unsplash.com/photo-1505009608774-cfa484f461b3?w=800&q=80',
  // Veterans/Arlington Cemetery images
  veterans1: 'https://images.unsplash.com/photo-1673737033448-b13ba42edb9e?w=800&q=80',
  veterans2: 'https://images.unsplash.com/photo-1674160928910-2792634f7cce?w=800&q=80',
  veterans3: 'https://images.unsplash.com/photo-1636648523764-d9c0cdd891b4?w=800&q=80',
  veterans4: 'https://images.unsplash.com/photo-1673737033661-c6282c78e84b?w=800&q=80',
  // Natural/Forest Burial images
  natural1: 'https://images.unsplash.com/photo-1759051919007-ca871613d215?w=800&q=80',
  natural2: 'https://images.unsplash.com/photo-1659647473918-5f050702acab?w=800&q=80',
  natural3: 'https://images.unsplash.com/photo-1585793319267-0f08b0e42c46?w=800&q=80',
  natural4: 'https://images.unsplash.com/photo-1502488214684-62c86de1c247?w=800&q=80',
};

interface Stats {
  totalCemeteries: number;
  totalStates: number;
  totalCities: number;
  totalCounties: number;
}

// Featured states (largest by population)
const featuredStates = [
  {
    name: 'California',
    slug: 'california',
    abbr: 'CA',
    highlight: 'Los Angeles, San Francisco, San Diego'
  },
  {
    name: 'Texas',
    slug: 'texas',
    abbr: 'TX',
    highlight: 'Houston, Dallas, Austin'
  },
  {
    name: 'Florida',
    slug: 'florida',
    abbr: 'FL',
    highlight: 'Miami, Orlando, Tampa'
  },
  {
    name: 'New York',
    slug: 'new-york',
    abbr: 'NY',
    highlight: 'New York City, Buffalo, Rochester'
  },
  {
    name: 'Pennsylvania',
    slug: 'pennsylvania',
    abbr: 'PA',
    highlight: 'Philadelphia, Pittsburgh, Allentown'
  },
  {
    name: 'Ohio',
    slug: 'ohio',
    abbr: 'OH',
    highlight: 'Columbus, Cleveland, Cincinnati'
  }
];

const cemeteryCategories = [
  {
    title: 'National Cemeteries',
    description: 'Veterans cemeteries honoring those who served our nation with dedicated memorials',
    icon: Flag,
    href: '/type/national-cemetery',
    color: 'bg-forest-100 text-forest-700'
  },
  {
    title: 'Natural Burial Grounds',
    description: 'Eco-friendly burial options in serene, natural settings',
    icon: Trees,
    href: '/type/natural-burial',
    color: 'bg-forest-100 text-forest-700'
  },
  {
    title: 'Memorial Parks',
    description: 'Beautiful landscaped grounds for peaceful remembrance',
    icon: Building2,
    href: '/type/memorial-park',
    color: 'bg-gold-100 text-gold-700'
  }
];

const userTestimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'Los Angeles, CA',
    quote: 'This website helped us find the perfect final resting place for my father. The detailed information made a difficult time easier.',
    rating: 5
  },
  {
    name: 'James Thompson',
    location: 'Chicago, IL',
    quote: 'We were looking for a veterans cemetery and found all the information we needed here. Very helpful resource.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    location: 'Houston, TX',
    quote: 'Great resource for comparing different cemeteries. The hours, directions, and reviews were all accurate.',
    rating: 5
  }
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalCemeteries: 0,
    totalStates: 0,
    totalCities: 0,
    totalCounties: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load stats from API
    async function loadStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
    loadStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImages.main}
            alt="Peaceful cemetery with trees"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/80 via-forest-800/70 to-forest-700/80" />
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left side - Search */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Cemeteries
                <span className="block text-gold-300">Across America</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Your comprehensive guide to cemeteries, memorial parks, and burial grounds
                throughout the United States. Find locations, hours, and directions.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto lg:mx-0 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, city, or zip code..."
                      className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <Button variant="gold" size="lg" type="submit" className="px-8">
                    Search
                  </Button>
                </div>
              </form>

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm">
                <Link href="/state" className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  Browse by State
                </Link>
                <Link href="/type" className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  Cemetery Types
                </Link>
                <Link href="/type/national-cemetery" className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  National Cemeteries
                </Link>
              </div>
            </div>

            {/* Right side - Today's Deaths Widget */}
            <div className="lg:col-span-2 hidden lg:block">
              <TodayDeathsWidget />
            </div>
          </div>

          {/* Mobile Widget - shown below on smaller screens */}
          <div className="lg:hidden mt-10">
            <TodayDeathsWidget />
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {stats.totalStates > 0 ? stats.totalStates : '--'}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">States</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {stats.totalCemeteries > 0 ? stats.totalCemeteries.toLocaleString('en-US') : '--'}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">Cemeteries</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {stats.totalCounties > 0 ? stats.totalCounties.toLocaleString('en-US') : '--'}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">Counties</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {SITE_STATS.notableBurialsDisplay}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">Notable Burials</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad after stats - high visibility placement */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <OptimizedAd
            slot={AD_SLOTS.home.heroBelow}
            format="horizontal"
            priority={true}
            minHeight={90}
            className="max-w-[728px] mx-auto"
          />
        </div>
      </div>

      {/* Featured Category - National Cemeteries */}
      <section className="py-16 bg-forest-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-300 text-sm font-medium mb-6">
                <Flag className="w-4 h-4" />
                Featured Category
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                National Cemeteries
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Honoring those who served our nation. National cemeteries are the final resting places
                for veterans, active duty service members, and eligible family members. These sacred
                grounds are maintained by the Department of Veterans Affairs and the National Cemetery Administration.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-gold-300" />
                  </div>
                  155 national cemeteries across the country
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-gold-300" />
                  </div>
                  Free burial benefits for eligible veterans
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-gold-300" />
                  </div>
                  Perpetual care and maintenance guaranteed
                </li>
              </ul>
              <Link href="/type/national-cemetery">
                <Button variant="gold" size="lg" className="group">
                  Explore National Cemeteries
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Right - Image Grid */}
            <div className="order-1 lg:order-2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={heroImages.national}
                      alt="Rows of graves in perspective"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={heroImages.cross}
                      alt="Cemetery cross on green grass"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={heroImages.angel}
                      alt="Angel statue at cemetery"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={heroImages.tombs}
                      alt="Cemetery with cement tombs"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-forest-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured States */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Browse by State
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore cemeteries in the most populous states or use our search to find locations in any state.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {featuredStates.map((state) => (
              <Link key={state.slug} href={`/state/${state.slug}`} className="group">
                <Card className="p-6 h-full hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center group-hover:bg-accent transition-colors">
                      <MapPin className="w-6 h-6 text-forest-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">{state.abbr}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {state.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {state.highlight}
                  </p>
                  <span className="text-sm font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                    View cemeteries
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/state">
              <Button variant="outline" size="lg">
                View All 50 States
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Category - Veterans Cemeteries */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.veterans1}
                      alt="Veterans cemetery with rows of headstones"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.veterans2}
                      alt="Military cemetery headstones with trees"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.veterans3}
                      alt="Cemetery rows in autumn"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.veterans4}
                      alt="Fall foliage at veterans cemetery"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Honor Our Veterans
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Veterans Cemeteries
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Find the final resting places of America&apos;s heroes. Veterans cemeteries honor
                the men and women who served our country with distinction. These hallowed grounds
                include Arlington National Cemetery and over 150 national cemeteries nationwide.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  Over 4 million veterans interred nationwide
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  Headstones provided at no cost for eligible veterans
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  Presidential Memorial Certificates available
                </li>
              </ul>
              <Link href="/type/veterans-cemetery">
                <Button variant="default" size="lg" className="group">
                  Find Veterans Cemeteries
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Category - Natural Burial Grounds */}
      <section className="py-16 bg-forest-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-100 rounded-full text-forest-700 text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Eco-Friendly Options
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Natural Burial Grounds
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Return to nature with green burial options. Natural burial grounds offer an
                environmentally conscious alternative, allowing loved ones to rest in peaceful,
                natural settings that support conservation and ecological preservation.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-forest-700" />
                  </div>
                  No embalming chemicals or concrete vaults
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-forest-700" />
                  </div>
                  Biodegradable caskets and shrouds
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-forest-700" />
                  </div>
                  Often more affordable than traditional burial
                </li>
              </ul>
              <Link href="/type/green-cemetery">
                <Button variant="default" size="lg" className="group bg-forest-700 hover:bg-forest-800">
                  Explore Green Cemeteries
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Right - Image Grid */}
            <div className="order-1 lg:order-2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.natural1}
                      alt="Tree-lined path through natural cemetery"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.natural2}
                      alt="Peaceful cemetery near water"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.natural3}
                      alt="Green cemetery grounds with trees"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroImages.natural4}
                      alt="Natural burial ground with headstones"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-forest-200/50 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-forest-300/30 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Cemetery Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Types of Cemeteries
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From national cemeteries honoring veterans to peaceful natural burial grounds,
              find the type that&apos;s right for you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {cemeteryCategories.map((category) => (
              <Link key={category.href} href={category.href} className="group">
                <Card className="p-8 h-full text-center hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/type">
              <Button variant="outline" size="lg">
                View All Types
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad before testimonials */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <OptimizedAd
            slot={AD_SLOTS.home.afterStats}
            format="horizontal"
            lazy={true}
            minHeight={90}
            className="max-w-[728px] mx-auto"
          />
        </div>
      </div>

      {/* Testimonials */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              What People Are Saying
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from families who used our directory to find the right cemetery.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {userTestimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Why Use CemeteryNearMe.com?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-forest-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-forest-700" />
              </div>
              <h3 className="font-semibold mb-2">Comprehensive Data</h3>
              <p className="text-sm text-muted-foreground">
                {getComprehensiveDataText()}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-gold-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-gold-700" />
              </div>
              <h3 className="font-semibold mb-2">Always Updated</h3>
              <p className="text-sm text-muted-foreground">
                Current information including hours of operation and contact details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-forest-100 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-forest-700" />
              </div>
              <h3 className="font-semibold mb-2">Free to Use</h3>
              <p className="text-sm text-muted-foreground">
                Our entire directory is free with no registration required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Multiplex Ad - Related Content */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <MultiplexAd
            slot={AD_SLOTS.home.beforeFooter}
            title="You May Also Be Interested In"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Find a Cemetery?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Search our comprehensive database of cemeteries across the United States.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button variant="gold" size="lg">
                Search Cemeteries
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/state">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Browse by State
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
