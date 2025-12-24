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
    slug: 'geschiedenis-nederlandse-begraafplaatsen',
    title: 'De Rijke Geschiedenis van Nederlandse Begraafplaatsen',
    excerpt: 'Een reis door de tijd: van middeleeuwse kerkhoven tot moderne gedenkparken. Ontdek hoe Nederlandse begraafplaatsen zijn geëvolueerd.',
    author: 'Marvin Smit',
    date: '2025-01-15',
    readTime: '8 min',
    category: 'Geschiedenis',
    image: '/images/blog/historic-cemetery.jpg',
  },
  {
    id: 2,
    slug: 'kiezen-laatste-rustplaats',
    title: 'Een Laatste Rustplaats Kiezen: Waar Moet Je Op Letten?',
    excerpt: 'Praktische tips en overwegingen bij het kiezen van een begraafplaats. Van locatie tot kosten, we bespreken alle belangrijke aspecten.',
    author: 'Marvin Smit',
    date: '2025-01-10',
    readTime: '6 min',
    category: 'Gids',
    image: '/images/blog/choosing-cemetery-guide.jpg',
  },
  {
    id: 3,
    slug: 'natuurbegraafplaatsen-nederland',
    title: 'Natuurbegraafplaatsen: Een Groene Keuze',
    excerpt: 'Steeds meer mensen kiezen voor een natuurbegraafplaats. Wat zijn de mogelijkheden en hoe werkt het precies?',
    author: 'Marvin Smit',
    date: '2025-01-05',
    readTime: '7 min',
    category: 'Duurzaamheid',
    image: '/images/blog/nature-burial.jpg',
  },
  {
    id: 4,
    slug: 'funeraire-symbolen-betekenis',
    title: 'Symbolen op Grafstenen: Wat Betekenen Ze?',
    excerpt: 'Van engelen tot ankers: ontdek de betekenis achter veelvoorkomende symbolen op grafstenen en monumenten.',
    author: 'Marvin Smit',
    date: '2024-12-28',
    readTime: '10 min',
    category: 'Cultuur',
    image: '/images/blog/symbols-gravestones.jpg',
  },
  {
    id: 5,
    slug: 'begraafplaats-etiquette',
    title: 'Begraafplaats Etiquette: Do\'s en Don\'ts',
    excerpt: 'Respectvol gedrag op een begraafplaats. Praktische richtlijnen voor bezoekers.',
    author: 'Marvin Smit',
    date: '2024-12-20',
    readTime: '5 min',
    category: 'Gids',
    image: '/images/blog/cemetery-etiquette.jpg',
  },
  {
    id: 6,
    slug: 'digitaal-herdenken',
    title: 'Digitaal Herdenken: De Toekomst van Gedenken',
    excerpt: 'QR-codes op grafstenen en online gedenkplaatsen. Hoe technologie het herdenken verandert.',
    author: 'Marvin Smit',
    date: '2024-12-15',
    readTime: '6 min',
    category: 'Innovatie',
    image: '/images/blog/digital-memorial.jpg',
  },
  // Nieuwe artikelen voor Ezoic compliance (9 extra)
  {
    id: 7,
    slug: 'grafmonumenten-onderhoud-complete-gids',
    title: 'Grafmonumenten Onderhoud: Een Complete Gids',
    excerpt: 'Alles wat u moet weten over het onderhouden van grafmonumenten. Van reinigen tot restauratie, met praktische tips voor nabestaanden.',
    author: 'Marvin Smit',
    date: '2025-01-20',
    readTime: '9 min',
    category: 'Gids',
    image: '/images/blog/monument-maintenance.jpg',
  },
  {
    id: 8,
    slug: 'genealogie-onderzoek-begraafplaatsen',
    title: 'Genealogie Onderzoek op Begraafplaatsen: Tips en Technieken',
    excerpt: 'Hoe begraafplaatsen u kunnen helpen bij het onderzoeken van uw familiegeschiedenis. Praktische tips voor stamboomonderzoek.',
    author: 'Marvin Smit',
    date: '2025-01-18',
    readTime: '8 min',
    category: 'Onderzoek',
    image: '/images/blog/genealogy-research.jpg',
  },
  {
    id: 9,
    slug: 'kosten-begraven-nederland-overzicht',
    title: 'De Kosten van Begraven in Nederland: Een Volledig Overzicht',
    excerpt: 'Een transparant overzicht van alle kosten rondom een begrafenis in Nederland. Van grafrechten tot onderhoud.',
    author: 'Marvin Smit',
    date: '2025-01-16',
    readTime: '10 min',
    category: 'Financieel',
    image: '/images/blog/funeral-costs.jpg',
  },
  {
    id: 10,
    slug: 'begraafplaats-fotografie-tips-etiquette',
    title: 'Begraafplaats Fotografie: Tips, Technieken en Etiquette',
    excerpt: 'Respectvol fotograferen op begraafplaatsen. Technische tips en ethische overwegingen voor fotografen.',
    author: 'Marvin Smit',
    date: '2025-01-14',
    readTime: '7 min',
    category: 'Cultuur',
    image: '/images/blog/photography-cemetery.jpg',
  },
  {
    id: 11,
    slug: 'oorlogsgraven-nederland-geschiedenis',
    title: 'Oorlogsgraven in Nederland: Geschiedenis en Locaties',
    excerpt: 'Een overzicht van oorlogsbegraafplaatsen in Nederland. Hun geschiedenis, betekenis en hoe ze worden onderhouden.',
    author: 'Marvin Smit',
    date: '2025-01-12',
    readTime: '11 min',
    category: 'Geschiedenis',
    image: '/images/blog/war-memorial.jpg',
  },
  {
    id: 12,
    slug: 'kinderbegraafplaatsen-gevoelig-onderwerp',
    title: 'Kinderbegraafplaatsen: Omgaan met een Gevoelig Onderwerp',
    excerpt: 'Een respectvolle blik op kinderbegraafplaatsen in Nederland. Geschiedenis, locaties en de bijzondere zorg die hier gegeven wordt.',
    author: 'Marvin Smit',
    date: '2025-01-08',
    readTime: '8 min',
    category: 'Maatschappij',
    image: '/images/blog/child-memorial.jpg',
  },
  {
    id: 13,
    slug: 'beroemde-nederlanders-laatste-rustplaats',
    title: 'Beroemde Nederlanders en Hun Laatste Rustplaats',
    excerpt: 'Ontdek waar bekende Nederlandse persoonlijkheden begraven liggen. Van kunstenaars tot politici, een culturele reis.',
    author: 'Marvin Smit',
    date: '2025-06-09',
    readTime: '9 min',
    category: 'Cultuur',
    image: '/images/blog/famous-graves.jpg',
  },
  {
    id: 14,
    slug: 'seizoenen-begraafplaats-wat-verwachten',
    title: 'De Seizoenen op de Begraafplaats: Wat te Verwachten',
    excerpt: 'Hoe de seizoenen het bezoeken van begraafplaatsen beïnvloeden. Van bloeiende voorjaarsblommen tot winterse stilte.',
    author: 'Marvin Smit',
    date: '2025-06-08',
    readTime: '6 min',
    category: 'Natuur',
    image: '/images/blog/seasons-autumn.jpg',
  },
  {
    id: 15,
    slug: 'crematie-versus-begraven-vergelijking',
    title: 'Crematie vs Begraven: Een Eerlijke Vergelijking',
    excerpt: 'De voor- en nadelen van crematie en begraven op een rij. Kosten, milieu-impact en persoonlijke overwegingen.',
    author: 'Marvin Smit',
    date: '2025-06-07',
    readTime: '10 min',
    category: 'Gids',
    image: '/images/blog/cremation-burial.jpg',
  },
  {
    id: 16,
    slug: 'mooiste-historische-begraafplaatsen-nederland',
    title: 'De 10 Mooiste Historische Begraafplaatsen van Nederland',
    excerpt: 'Ontdek de meest indrukwekkende historische begraafplaatsen van Nederland. Van monumentale graven tot eeuwenoude kerkhoven vol geschiedenis.',
    author: 'Marvin Smit',
    date: '2025-06-05',
    readTime: '12 min',
    category: 'Geschiedenis',
    image: '/images/blog/historic-cemetery.jpg',
  },
  {
    id: 17,
    slug: 'crematie-versus-begraven-wat-past-bij-u',
    title: 'Crematie vs Begraven: Wat Past Bij U?',
    excerpt: 'Een eerlijke vergelijking tussen crematie en begraven. Ontdek de voor- en nadelen, kosten, en emotionele aspecten om de juiste keuze te maken.',
    author: 'Marvin Smit',
    date: '2025-06-07',
    readTime: '15 min',
    category: 'Advies',
    image: '/images/blog/peaceful-garden.jpg',
  },
  {
    id: 18,
    slug: 'wat-kost-begrafenis-crematie-2025',
    title: 'Wat kost een begrafenis of crematie in 2025?',
    excerpt: 'Complete kostenoverzicht van een uitvaart in Nederland. Van basispakket tot uitgebreide ceremonie, inclusief besparingstips.',
    author: 'Marvin Smit',
    date: '2025-06-06',
    readTime: '10 min',
    category: 'Praktisch',
    image: '/images/blog/funeral-costs.jpg',
  },
  {
    id: 19,
    slug: 'dierenbegraafplaatsen-nederland-complete-gids',
    title: 'Dierenbegraafplaatsen in Nederland: Een Complete Gids',
    excerpt: 'Alles over dierenbegraafplaatsen: locaties, kosten, procedures en alternatieven voor een waardig afscheid van uw huisdier.',
    author: 'Marvin Smit',
    date: '2025-11-28',
    readTime: '12 min',
    category: 'Gids',
    image: '/images/blog/pet-cemetery.jpg',
  },
];

export const categories = [
  { name: 'Alle artikelen', count: blogPosts.length },
  { name: 'Geschiedenis', count: blogPosts.filter(p => p.category === 'Geschiedenis').length },
  { name: 'Gids', count: blogPosts.filter(p => p.category === 'Gids').length },
  { name: 'Cultuur', count: blogPosts.filter(p => p.category === 'Cultuur').length },
  { name: 'Duurzaamheid', count: blogPosts.filter(p => p.category === 'Duurzaamheid').length },
  { name: 'Innovatie', count: blogPosts.filter(p => p.category === 'Innovatie').length },
  { name: 'Onderzoek', count: blogPosts.filter(p => p.category === 'Onderzoek').length },
  { name: 'Financieel', count: blogPosts.filter(p => p.category === 'Financieel').length },
  { name: 'Maatschappij', count: blogPosts.filter(p => p.category === 'Maatschappij').length },
  { name: 'Natuur', count: blogPosts.filter(p => p.category === 'Natuur').length },
  { name: 'Advies', count: blogPosts.filter(p => p.category === 'Advies').length },
  { name: 'Praktisch', count: blogPosts.filter(p => p.category === 'Praktisch').length },
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
  return `/begraafplaats/${slug}`;
}

export function getProvinceLink(province: string): string {
  const slug = province.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `/provincie/${slug}`;
}

export function getMunicipalityLink(municipality: string): string {
  // Import createMunicipalitySlug logic
  const slug = municipality
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  return `/gemeente/${slug}`;
}

export function getTypeLink(type: string): string {
  const slug = type.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `/type/${slug}`;
}