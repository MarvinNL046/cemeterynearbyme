import Link from 'next/link';
import { BookOpen, Trees, Flag, Leaf, Landmark } from 'lucide-react';

interface GuideLink {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

// All available guides/pillar pages with their metadata
const allGuides: GuideLink[] = [
  {
    href: '/guides/cemetery-types',
    label: 'Types of Cemeteries',
    description: 'Learn about different cemetery types, from traditional to natural burial grounds.',
    icon: BookOpen,
    keywords: ['type', 'types', 'category', 'kind', 'classification']
  },
  {
    href: '/guides/famous-cemeteries',
    label: 'Famous Cemeteries in America',
    description: 'Explore historically significant and notable cemeteries across the United States.',
    icon: Landmark,
    keywords: ['famous', 'historic', 'notable', 'landmark', 'tourist', 'attraction']
  },
  {
    href: '/guides/funeral-planning',
    label: 'Funeral Planning Guide',
    description: 'Comprehensive guide to planning a meaningful funeral service.',
    icon: BookOpen,
    keywords: ['funeral', 'planning', 'service', 'memorial', 'ceremony']
  },
  {
    href: '/guides/veterans-burial',
    label: 'Veterans Burial Benefits',
    description: 'Information about military burial benefits and national cemeteries.',
    icon: Flag,
    keywords: ['veteran', 'veterans', 'military', 'national', 'va', 'armed forces', 'service']
  },
  {
    href: '/guides/green-burial',
    label: 'Green Burial Options',
    description: 'Eco-friendly burial alternatives and natural cemetery options.',
    icon: Leaf,
    keywords: ['green', 'natural', 'eco', 'environment', 'sustainable', 'organic', 'woodland']
  }
];

// Sub-pillar content for specific types
const typeSubGuides: Record<string, GuideLink[]> = {
  'public-cemetery': [
    {
      href: '/guides/cemetery-types#public',
      label: 'Understanding Public Cemeteries',
      description: 'What makes public cemeteries different and how they operate.',
      icon: BookOpen,
      keywords: ['public']
    }
  ],
  'memorial-park': [
    {
      href: '/guides/cemetery-types#memorial-park',
      label: 'Memorial Park vs Cemetery',
      description: 'The differences between memorial parks and traditional cemeteries.',
      icon: Landmark,
      keywords: ['memorial', 'park']
    }
  ],
  'national-cemetery': [
    {
      href: '/guides/veterans-burial',
      label: 'National Cemetery Eligibility',
      description: 'Who qualifies for burial in a national cemetery.',
      icon: Flag,
      keywords: ['national', 'veteran']
    }
  ],
  'veterans-cemetery': [
    {
      href: '/guides/veterans-burial',
      label: 'State Veterans Cemeteries',
      description: 'State-run veteran cemeteries and their benefits.',
      icon: Flag,
      keywords: ['veteran', 'state']
    }
  ],
  'natural-burial': [
    {
      href: '/guides/green-burial',
      label: 'Natural Burial Guide',
      description: 'Everything you need to know about natural burial options.',
      icon: Leaf,
      keywords: ['natural', 'green']
    }
  ],
  'green-cemetery': [
    {
      href: '/guides/green-burial',
      label: 'Green Cemetery Standards',
      description: 'What defines a certified green cemetery.',
      icon: Trees,
      keywords: ['green', 'eco']
    }
  ]
};

interface RelatedGuidesProps {
  currentType?: string;
  currentState?: string;
  maxGuides?: number;
  className?: string;
  showDescription?: boolean;
  variant?: 'default' | 'compact' | 'card';
}

export default function RelatedGuides({
  currentType,
  currentState,
  maxGuides = 3,
  className = '',
  showDescription = true,
  variant = 'default'
}: RelatedGuidesProps) {
  // Calculate relevance score for each guide
  const scoredGuides = allGuides.map(guide => {
    let score = 0;

    // Boost score based on type match
    if (currentType) {
      const typeSlug = currentType.toLowerCase();
      if (guide.keywords.some(kw => typeSlug.includes(kw))) {
        score += 10;
      }

      // Check for specific type sub-guides
      if (typeSubGuides[typeSlug]) {
        score += 5;
      }
    }

    // Boost veterans guide for certain states with high military presence
    const militaryStates = ['virginia', 'texas', 'california', 'florida', 'north-carolina', 'georgia'];
    if (currentState && militaryStates.includes(currentState.toLowerCase())) {
      if (guide.keywords.includes('veteran') || guide.keywords.includes('military')) {
        score += 3;
      }
    }

    // Always include the types guide at minimum score
    if (guide.href === '/guides/cemetery-types') {
      score = Math.max(score, 1);
    }

    return { ...guide, score };
  });

  // Get type-specific sub-guides
  const specificGuides: GuideLink[] = currentType && typeSubGuides[currentType.toLowerCase()]
    ? typeSubGuides[currentType.toLowerCase()]
    : [];

  // Sort by score and take top guides
  const topGuides = scoredGuides
    .sort((a, b) => b.score - a.score)
    .slice(0, maxGuides - specificGuides.length);

  // Combine specific and general guides
  const guidesToShow = [...specificGuides, ...topGuides].slice(0, maxGuides);

  if (guidesToShow.length === 0) return null;

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Helpful Resources
        </h3>
        <ul className="space-y-2">
          {guidesToShow.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="text-sm text-primary hover:underline flex items-center gap-2"
              >
                <guide.icon className="w-4 h-4 flex-shrink-0" />
                {guide.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-muted/50 rounded-lg p-6 ${className}`}>
        <h3 className="font-semibold text-lg mb-4">Related Guides</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guidesToShow.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group bg-background rounded-lg p-4 border hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <guide.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {guide.label}
                </h4>
              </div>
              {showDescription && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {guide.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${className}`}>
      <h3 className="font-semibold text-lg mb-4">Related Guides</h3>
      <div className="space-y-4">
        {guidesToShow.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group flex items-start gap-4 p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-all"
          >
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <guide.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium group-hover:text-primary transition-colors">
                {guide.label}
              </h4>
              {showDescription && (
                <p className="text-sm text-muted-foreground mt-1">
                  {guide.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
