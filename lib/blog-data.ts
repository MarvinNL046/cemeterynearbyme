export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'history-of-cemeteries-in-america',
    title: 'The Rich History of Cemeteries in America',
    excerpt: 'A journey through time: from colonial churchyards to the rural cemetery movement and modern memorial parks. Discover how American cemeteries evolved.',
    author: 'Marvin Smit',
    date: '2025-01-15',
    readTime: '8 min',
    category: 'History',
    image: '/images/blog/historic-cemetery.jpg',
  },
  {
    id: 2,
    slug: 'choosing-a-cemetery-what-to-know',
    title: 'Choosing a Cemetery: What You Need to Know',
    excerpt: 'Practical tips and considerations when selecting a final resting place. From location to costs, we cover all the important factors.',
    author: 'Marvin Smit',
    date: '2025-01-10',
    readTime: '6 min',
    category: 'Guide',
    image: '/images/blog/choosing-cemetery-guide.jpg',
  },
  {
    id: 3,
    slug: 'green-burial-natural-cemeteries',
    title: 'Green Burial & Natural Cemeteries: An Eco-Friendly Choice',
    excerpt: 'More and more Americans are choosing natural burial. What are the options, how does it work, and what does it cost?',
    author: 'Marvin Smit',
    date: '2025-01-05',
    readTime: '7 min',
    category: 'Sustainability',
    image: '/images/blog/nature-burial.jpg',
  },
  {
    id: 4,
    slug: 'gravestone-symbols-and-meanings',
    title: 'Gravestone Symbols and Their Hidden Meanings',
    excerpt: 'From angels to anchors: discover the meaning behind common symbols found on headstones and monuments across America.',
    author: 'Marvin Smit',
    date: '2024-12-28',
    readTime: '10 min',
    category: 'Culture',
    image: '/images/blog/symbols-gravestones.jpg',
  },
  {
    id: 5,
    slug: 'cemetery-etiquette-dos-and-donts',
    title: "Cemetery Etiquette: Do's and Don'ts",
    excerpt: 'Respectful behavior at cemeteries. Practical guidelines every visitor should know.',
    author: 'Marvin Smit',
    date: '2024-12-20',
    readTime: '5 min',
    category: 'Guide',
    image: '/images/blog/cemetery-etiquette.jpg',
  },
  {
    id: 6,
    slug: 'digital-memorials-future-of-remembrance',
    title: 'Digital Memorials: The Future of Remembrance',
    excerpt: 'QR codes on headstones and online memorial platforms. How technology is transforming the way we remember.',
    author: 'Marvin Smit',
    date: '2024-12-15',
    readTime: '6 min',
    category: 'Innovation',
    image: '/images/blog/digital-memorial.jpg',
  },
  {
    id: 7,
    slug: 'gravestone-maintenance-complete-guide',
    title: 'Gravestone Maintenance: A Complete Guide',
    excerpt: 'Everything you need to know about maintaining headstones and monuments. From cleaning to restoration, with practical tips for families.',
    author: 'Marvin Smit',
    date: '2025-01-20',
    readTime: '9 min',
    category: 'Guide',
    image: '/images/blog/monument-maintenance.jpg',
  },
  {
    id: 8,
    slug: 'genealogy-research-using-cemeteries',
    title: 'Genealogy Research Using Cemeteries: Tips and Techniques',
    excerpt: 'How cemeteries can help you trace your family history. Practical tips for genealogy research at gravesites.',
    author: 'Marvin Smit',
    date: '2025-01-18',
    readTime: '8 min',
    category: 'Research',
    image: '/images/blog/genealogy-research.jpg',
  },
  {
    id: 9,
    slug: 'burial-costs-overview-guide',
    title: 'Burial Costs in the United States: A Complete Overview',
    excerpt: 'A transparent overview of all costs surrounding a burial in the US. From cemetery plots to maintenance fees.',
    author: 'Marvin Smit',
    date: '2025-01-16',
    readTime: '10 min',
    category: 'Financial',
    image: '/images/blog/funeral-costs.jpg',
  },
  {
    id: 10,
    slug: 'cemetery-photography-tips-etiquette',
    title: 'Cemetery Photography: Tips, Techniques and Etiquette',
    excerpt: 'Respectful photography at cemeteries. Technical tips and ethical considerations for photographers.',
    author: 'Marvin Smit',
    date: '2025-01-14',
    readTime: '7 min',
    category: 'Culture',
    image: '/images/blog/photography-cemetery.jpg',
  },
  {
    id: 11,
    slug: 'war-graves-military-cemeteries-history',
    title: 'War Graves & Military Cemeteries: History and Locations',
    excerpt: 'An overview of military cemeteries across the United States. Their history, significance, and how they are maintained.',
    author: 'Marvin Smit',
    date: '2025-01-12',
    readTime: '11 min',
    category: 'History',
    image: '/images/blog/war-memorial.jpg',
  },
  {
    id: 12,
    slug: 'children-memorial-sections-sensitive-guide',
    title: "Children's Memorial Sections: A Sensitive Guide",
    excerpt: "A respectful look at children's sections in American cemeteries. History, locations, and the special care provided.",
    author: 'Marvin Smit',
    date: '2025-01-08',
    readTime: '8 min',
    category: 'Society',
    image: '/images/blog/child-memorial.jpg',
  },
  {
    id: 13,
    slug: 'famous-graves-notable-resting-places',
    title: 'Famous Graves: Notable Resting Places in America',
    excerpt: 'Discover where famous Americans are buried. From presidents to artists, a cultural journey through notable gravesites.',
    author: 'Marvin Smit',
    date: '2025-06-09',
    readTime: '9 min',
    category: 'Culture',
    image: '/images/blog/famous-graves.jpg',
  },
  {
    id: 14,
    slug: 'cemetery-through-the-seasons',
    title: 'The Cemetery Through the Seasons: What to Expect',
    excerpt: 'How the seasons affect visiting cemeteries. From blooming spring flowers to winter stillness.',
    author: 'Marvin Smit',
    date: '2025-06-08',
    readTime: '6 min',
    category: 'Nature',
    image: '/images/blog/seasons-autumn.jpg',
  },
  {
    id: 15,
    slug: 'cremation-vs-burial-comparison',
    title: 'Cremation vs Burial: An Honest Comparison',
    excerpt: 'The pros and cons of cremation and burial side by side. Costs, environmental impact, and personal considerations.',
    author: 'Marvin Smit',
    date: '2025-06-07',
    readTime: '10 min',
    category: 'Guide',
    image: '/images/blog/cremation-burial.jpg',
  },
  {
    id: 16,
    slug: 'most-beautiful-historic-cemeteries-usa',
    title: 'The 10 Most Beautiful Historic Cemeteries in the USA',
    excerpt: 'Discover the most stunning historic cemeteries across America. From grand monuments to centuries-old churchyards full of history.',
    author: 'Marvin Smit',
    date: '2025-06-05',
    readTime: '12 min',
    category: 'History',
    image: '/images/blog/historic-cemetery.jpg',
  },
  {
    id: 17,
    slug: 'cremation-vs-burial-which-is-right',
    title: 'Cremation vs Burial: Which Is Right for You?',
    excerpt: 'An honest comparison between cremation and burial. Discover the pros and cons, costs, and emotional aspects to make the right choice.',
    author: 'Marvin Smit',
    date: '2025-06-07',
    readTime: '15 min',
    category: 'Advice',
    image: '/images/blog/peaceful-garden.jpg',
  },
  {
    id: 18,
    slug: 'funeral-cremation-costs-2026',
    title: 'What Does a Funeral or Cremation Cost in 2026?',
    excerpt: 'Complete cost overview of end-of-life services in the United States. From basic packages to elaborate ceremonies, including money-saving tips.',
    author: 'Marvin Smit',
    date: '2025-06-06',
    readTime: '10 min',
    category: 'Practical',
    image: '/images/blog/funeral-costs.jpg',
  },
  {
    id: 19,
    slug: 'pet-cemeteries-complete-guide',
    title: 'Pet Cemeteries in the United States: A Complete Guide',
    excerpt: 'Everything about pet cemeteries: locations, costs, procedures, and alternatives for a dignified farewell to your beloved pet.',
    author: 'Marvin Smit',
    date: '2025-11-28',
    readTime: '12 min',
    category: 'Guide',
    image: '/images/blog/pet-cemetery.jpg',
  },
  {
    id: 20,
    slug: 'cremation-cost-guide',
    title: 'How Much Does Cremation Cost in 2026? Complete Price Guide',
    excerpt: 'A comprehensive guide to cremation costs in 2026. Compare direct cremation vs. full-service pricing, state-by-state averages, burial cost comparison, and money-saving tips.',
    author: 'Marvin Smit',
    date: '2026-03-22',
    readTime: '15 min',
    category: 'Guide',
    image: '/images/blog/cremation-cost-guide.jpg',
  },
  {
    id: 21,
    slug: 'how-to-clean-a-gravestone',
    title: 'How to Clean a Gravestone: Safe Methods That Won\'t Cause Damage',
    excerpt: 'Learn how to safely clean a gravestone without causing damage. Step-by-step guide covering D/2 Biological Solution, cleaning by stone type, stain removal, and products to never use.',
    author: 'Marvin Smit',
    date: '2026-03-22',
    readTime: '10 min',
    category: 'Guide',
    image: '/images/blog/gravestone-cleaning.jpg',
  },
  {
    id: 22,
    slug: 'pet-cremation-cost',
    title: 'How Much Does Pet Cremation Cost? (Dogs, Cats & Other Pets)',
    excerpt: 'Complete 2026 price guide for pet cremation in the United States. Compare private vs. communal cremation costs by pet size, urn prices, and money-saving tips for dogs, cats, and horses.',
    author: 'Marvin Smit',
    date: '2026-03-22',
    readTime: '10 min',
    category: 'Guide',
    image: '/images/blog/pet-cremation-cost.jpg',
  },
  {
    id: 23,
    slug: 'gravestone-cost-guide',
    title: 'How Much Does a Gravestone Cost? 2026 Prices by Type & Material',
    excerpt: 'Complete 2026 gravestone pricing guide. Compare costs for flat markers, upright headstones, and custom monuments by material (granite, marble, bronze). Includes engraving, installation fees, and money-saving tips.',
    author: 'Marvin Smit',
    date: '2026-03-22',
    readTime: '12 min',
    category: 'Guide',
    image: '/images/blog/gravestone-cost-guide.jpg',
  },
  {
    id: 24,
    slug: 'what-is-a-funeral-home',
    title: 'What Is a Funeral Home? Services, Costs & How to Choose',
    excerpt: 'Everything you need to know about funeral homes: what they do, the services they offer, how much they cost in 2026, and how to choose the right one. Includes FTC Funeral Rule rights and FAQ.',
    author: 'Marvin Smit',
    date: '2026-03-22',
    readTime: '10 min',
    category: 'Guide',
    image: '/images/blog/funeral-home-guide.jpg',
  },
];

export const categories = [
  { name: 'All articles', count: blogPosts.length },
  { name: 'History', count: blogPosts.filter(p => p.category === 'History').length },
  { name: 'Guide', count: blogPosts.filter(p => p.category === 'Guide').length },
  { name: 'Culture', count: blogPosts.filter(p => p.category === 'Culture').length },
  { name: 'Sustainability', count: blogPosts.filter(p => p.category === 'Sustainability').length },
  { name: 'Innovation', count: blogPosts.filter(p => p.category === 'Innovation').length },
  { name: 'Research', count: blogPosts.filter(p => p.category === 'Research').length },
  { name: 'Financial', count: blogPosts.filter(p => p.category === 'Financial').length },
  { name: 'Society', count: blogPosts.filter(p => p.category === 'Society').length },
  { name: 'Nature', count: blogPosts.filter(p => p.category === 'Nature').length },
  { name: 'Advice', count: blogPosts.filter(p => p.category === 'Advice').length },
  { name: 'Practical', count: blogPosts.filter(p => p.category === 'Practical').length },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}

export function getLatestPosts(limit: number = 6): BlogPost[] {
  return blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Helper functions for internal linking
export function getCemeteryLink(name: string): string {
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `/cemetery/${slug}`;
}

export function getStateLink(state: string): string {
  const slug = state.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `/state/${slug}`;
}

// Keep aliases for backward compatibility with blog-content.ts imports
export const getProvinceLink = getStateLink;

export function getCityLink(city: string): string {
  const slug = city
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `/city/${slug}`;
}

export const getMunicipalityLink = getCityLink;

export function getTypeLink(type: string): string {
  const slug = type.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `/type/${slug}`;
}
