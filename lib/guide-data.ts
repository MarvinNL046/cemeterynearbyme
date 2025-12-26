// Guide data types and loading functions for SEO pillar pages

// ===== INTERFACES =====

export interface FAQ {
  question: string;
  answer: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export interface PillarGuide {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  introduction: string;
  sections: GuideSection[];
  faqs: FAQ[];
  relatedGuides: string[];
  lastUpdated?: string;
  author?: string;
}

export interface GuideCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// ===== GUIDE CARDS DATA =====

export const pillarGuideCards: GuideCard[] = [
  {
    slug: 'types',
    title: 'Types of Cemeteries',
    description: 'Explore the different types of cemeteries in America, from national cemeteries to private memorial parks.',
    icon: 'building',
    color: 'forest',
  },
  {
    slug: 'famous-graves',
    title: 'Famous Graves in America',
    description: 'Discover the final resting places of presidents, celebrities, and historical figures across the nation.',
    icon: 'star',
    color: 'gold',
  },
  {
    slug: 'funeral-planning',
    title: 'Funeral Planning Guide',
    description: 'A comprehensive guide to planning a funeral, from choosing a cemetery to understanding costs.',
    icon: 'clipboard',
    color: 'slate',
  },
  {
    slug: 'veterans',
    title: 'Veterans Cemetery Benefits',
    description: 'Learn about burial benefits for veterans, including eligibility and how to apply.',
    icon: 'flag',
    color: 'navy',
  },
  {
    slug: 'green-burial',
    title: 'Green & Natural Burial',
    description: 'Explore eco-friendly burial options and natural cemeteries that protect the environment.',
    icon: 'leaf',
    color: 'green',
  },
];

// ===== PILLAR GUIDE CONTENT =====

// Content will be loaded from JSON files or defined here
// This provides the structure for future content expansion

export const pillarGuides: Record<string, PillarGuide> = {
  'types': {
    slug: 'types',
    title: 'Types of Cemeteries in America',
    seoTitle: 'Types of Cemeteries in America: Complete Guide | Cemetery Near Me',
    seoDescription: 'Explore the different types of cemeteries in America including national cemeteries, memorial parks, church cemeteries, and green burial grounds. Find the right type for your needs.',
    introduction: 'Understanding the different types of cemeteries in America can help families make informed decisions during difficult times. From national cemeteries honoring our veterans to peaceful natural burial grounds, each type offers unique features, costs, and eligibility requirements.',
    sections: [],
    faqs: [
      {
        question: 'What is the difference between a cemetery and a graveyard?',
        answer: 'Traditionally, a graveyard is adjacent to a church, while a cemetery is a standalone burial ground not affiliated with a church. Modern usage often treats these terms as interchangeable.',
      },
      {
        question: 'Can anyone be buried in a national cemetery?',
        answer: 'National cemeteries are primarily for veterans, active duty service members, and eligible family members. Eligibility requirements are set by the Department of Veterans Affairs.',
      },
      {
        question: 'What is a memorial park?',
        answer: 'A memorial park is a type of cemetery with flat, lawn-level markers instead of upright headstones. This creates a park-like setting and allows for easier maintenance.',
      },
    ],
    relatedGuides: ['veterans', 'green-burial', 'funeral-planning'],
    lastUpdated: '2024-12-26',
    author: 'Cemetery Near Me Editorial Team',
  },
  'famous-graves': {
    slug: 'famous-graves',
    title: 'Famous Graves in America',
    seoTitle: 'Famous Graves in America: Presidents, Celebrities & Historical Figures | Cemetery Near Me',
    seoDescription: 'Discover where famous Americans are buried. Visit the graves of presidents, celebrities, musicians, and historical figures at cemeteries across the United States.',
    introduction: 'America\'s cemeteries hold the final resting places of presidents, celebrities, heroes, and historical figures who shaped our nation. From Arlington National Cemetery to Hollywood Forever, these sites attract millions of visitors each year seeking to pay respects and connect with history.',
    sections: [],
    faqs: [
      {
        question: 'Which cemetery has the most famous graves?',
        answer: 'Arlington National Cemetery is arguably the most famous, with presidents, Supreme Court justices, and military heroes. Hollywood Forever Cemetery in Los Angeles has many entertainment industry legends.',
      },
      {
        question: 'Can you visit celebrity graves?',
        answer: 'Most cemeteries allow visitors during regular hours. Some high-profile graves may have restricted access or require appointments. Always respect cemetery rules and other mourners.',
      },
      {
        question: 'Where are the most presidents buried?',
        answer: 'Presidents are buried in various locations, often in their home states. Arlington National Cemetery has several, including John F. Kennedy. Some have dedicated presidential libraries and gravesites.',
      },
    ],
    relatedGuides: ['types', 'veterans'],
    lastUpdated: '2024-12-26',
    author: 'Cemetery Near Me Editorial Team',
  },
  'funeral-planning': {
    slug: 'funeral-planning',
    title: 'Funeral Planning Guide',
    seoTitle: 'Complete Funeral Planning Guide: Steps, Costs & Checklist | Cemetery Near Me',
    seoDescription: 'Plan a meaningful funeral with our comprehensive guide. Learn about costs, choosing a cemetery, burial vs cremation, and important decisions to make during this difficult time.',
    introduction: 'Planning a funeral can feel overwhelming, especially during a time of grief. This comprehensive guide walks you through every step of the process, from immediate decisions to long-term considerations. Understanding your options helps ensure your loved one receives a meaningful farewell.',
    sections: [],
    faqs: [
      {
        question: 'How much does a funeral cost on average?',
        answer: 'The average traditional funeral in the US costs between $7,000 and $12,000, including the casket, services, and burial plot. Cremation typically costs $4,000 to $7,000. Costs vary significantly by location and options chosen.',
      },
      {
        question: 'What decisions need to be made immediately after death?',
        answer: 'Immediate decisions include choosing a funeral home, deciding between burial or cremation, and notifying family and friends. Most other decisions can be made in the following days.',
      },
      {
        question: 'Should I pre-plan my own funeral?',
        answer: 'Pre-planning can ease the burden on family members and lock in current prices. It allows you to specify your wishes and compare options without time pressure.',
      },
    ],
    relatedGuides: ['types', 'green-burial', 'veterans'],
    lastUpdated: '2024-12-26',
    author: 'Cemetery Near Me Editorial Team',
  },
  'veterans': {
    slug: 'veterans',
    title: 'Veterans Cemetery Benefits Guide',
    seoTitle: 'Veterans Cemetery Benefits: Eligibility, Burial & Memorial Options | Cemetery Near Me',
    seoDescription: 'Complete guide to veterans burial benefits. Learn about eligibility, national cemetery burial, headstones, and memorial benefits available to veterans and their families.',
    introduction: 'Veterans who served our nation honorably have earned significant burial benefits through the Department of Veterans Affairs. These benefits include burial in national cemeteries, headstones, and memorial certificates at no cost to eligible families.',
    sections: [],
    faqs: [
      {
        question: 'Who is eligible for burial in a national cemetery?',
        answer: 'Veterans discharged under conditions other than dishonorable, service members who died on active duty, and certain eligible family members including spouses and dependent children.',
      },
      {
        question: 'What burial benefits do veterans receive?',
        answer: 'Benefits include a gravesite in a national cemetery, opening and closing of the grave, perpetual care, a government headstone or marker, a burial flag, and a Presidential Memorial Certificate.',
      },
      {
        question: 'How do I apply for veterans burial benefits?',
        answer: 'Contact the National Cemetery Scheduling Office at 1-800-535-1117 or work with a funeral home. Pre-need eligibility can be established in advance by filing VA Form 40-10007.',
      },
    ],
    relatedGuides: ['types', 'famous-graves', 'funeral-planning'],
    lastUpdated: '2024-12-26',
    author: 'Cemetery Near Me Editorial Team',
  },
  'green-burial': {
    slug: 'green-burial',
    title: 'Green & Natural Burial Guide',
    seoTitle: 'Green Burial Guide: Natural, Eco-Friendly Burial Options | Cemetery Near Me',
    seoDescription: 'Explore eco-friendly burial options including natural burial, biodegradable caskets, and conservation cemeteries. Learn how green burial protects the environment.',
    introduction: 'Green burial offers an environmentally conscious alternative to traditional burial practices. By avoiding embalming chemicals, using biodegradable materials, and preserving natural landscapes, green burial allows us to return to the earth while protecting it for future generations.',
    sections: [],
    faqs: [
      {
        question: 'What is green burial?',
        answer: 'Green burial is an environmentally friendly alternative that typically avoids embalming, uses biodegradable caskets or shrouds, and foregoes concrete burial vaults. The goal is to allow natural decomposition and minimize environmental impact.',
      },
      {
        question: 'Is green burial legal in all states?',
        answer: 'Green burial is legal in all 50 states, though regulations vary. Most states do not require embalming unless the body will be transported across state lines or not buried within a certain timeframe.',
      },
      {
        question: 'Is green burial more affordable?',
        answer: 'Green burial is often more affordable than traditional burial. Savings come from simpler caskets, no embalming, and no concrete vault. Costs range from $1,000 to $4,000 compared to $7,000-$12,000 for traditional burial.',
      },
    ],
    relatedGuides: ['types', 'funeral-planning'],
    lastUpdated: '2024-12-26',
    author: 'Cemetery Near Me Editorial Team',
  },
};

// ===== DATA LOADING FUNCTIONS =====

/**
 * Get all pillar guide cards for the index page
 */
export function getAllGuideCards(): GuideCard[] {
  return pillarGuideCards;
}

/**
 * Get a specific pillar guide by slug
 */
export function getGuideBySlug(slug: string): PillarGuide | null {
  return pillarGuides[slug] || null;
}

/**
 * Get all pillar guide slugs for static generation
 */
export function getAllGuideSlugs(): string[] {
  return Object.keys(pillarGuides);
}

/**
 * Get related guides for a specific guide
 */
export function getRelatedGuides(slug: string): GuideCard[] {
  const guide = pillarGuides[slug];
  if (!guide) return [];

  return guide.relatedGuides
    .map(relatedSlug => pillarGuideCards.find(card => card.slug === relatedSlug))
    .filter((card): card is GuideCard => card !== undefined);
}

/**
 * Get guide card by slug
 */
export function getGuideCardBySlug(slug: string): GuideCard | null {
  return pillarGuideCards.find(card => card.slug === slug) || null;
}

// ===== AUTHOR INFO =====

export const GUIDE_AUTHOR = {
  name: 'Cemetery Near Me Editorial Team',
  description: 'Our editorial team consists of researchers and writers dedicated to providing accurate, helpful information about cemeteries and funeral planning across America.',
  expertise: ['Cemetery Research', 'Funeral Planning', 'Veterans Benefits', 'Green Burial Practices'],
};
