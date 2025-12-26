import { Metadata } from 'next';
import Link from 'next/link';
import {
  Leaf,
  TreePine,
  Recycle,
  Award,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  Users,
  Clock,
  Shield,
  Globe,
  Heart,
  Sprout,
  HelpCircle,
  DollarSign,
  Mountain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InlineAd from '@/components/ads/InlineAd';
import SidebarAd from '@/components/ads/SidebarAd';

export const metadata: Metadata = {
  title: 'Natural & Eco-Friendly Green Burial Guide 2025 | Cemetery Near Me',
  description: 'Complete guide to green burial and natural burial options. Learn about environmental benefits, certifications, biodegradable caskets, conservation burial grounds, and find 519+ green cemeteries near you.',
  keywords: 'green burial, natural burial, eco-friendly burial, biodegradable casket, conservation cemetery, green cemetery, sustainable burial, natural burial ground, eco burial, woodland burial',
  authors: [{ name: 'Cemetery Near Me Editorial Team' }],
  openGraph: {
    title: 'Natural & Eco-Friendly Green Burial Guide 2025',
    description: 'Everything you need to know about eco-friendly burial options, from biodegradable caskets to conservation cemeteries.',
    type: 'article',
    locale: 'en_US',
    siteName: 'Cemetery Near Me',
    url: 'https://www.cemeterynearbyme.com/guide/green-burial',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natural & Eco-Friendly Green Burial Guide 2025',
    description: 'Complete guide to sustainable and eco-friendly burial options.',
  },
  alternates: {
    canonical: 'https://www.cemeterynearbyme.com/guide/green-burial',
  },
};

const environmentalBenefits = [
  {
    icon: TreePine,
    title: 'Land Conservation',
    description: 'Green cemeteries preserve natural habitats and often establish permanent conservation easements, protecting land from future development.',
    stat: '100+ acres',
    statLabel: 'average conservation cemetery size'
  },
  {
    icon: Recycle,
    title: 'No Toxic Chemicals',
    description: 'Traditional embalming uses formaldehyde, a known carcinogen. Green burial eliminates these chemicals from entering the soil and groundwater.',
    stat: '4.3M gallons',
    statLabel: 'embalming fluid used annually in US'
  },
  {
    icon: Globe,
    title: 'Reduced Carbon Footprint',
    description: 'Manufacturing a steel casket produces approximately 250 kg of CO2. Natural burial with biodegradable materials significantly reduces emissions.',
    stat: '10x less',
    statLabel: 'carbon vs traditional burial'
  },
  {
    icon: Sprout,
    title: 'Natural Decomposition',
    description: 'Bodies return nutrients to the earth naturally, supporting plant growth and completing the natural cycle of life.',
    stat: '2-12 months',
    statLabel: 'natural decomposition timeline'
  },
];

const certificationLevels = [
  {
    level: 'Hybrid',
    description: 'Traditional cemeteries with a designated green burial section',
    features: [
      'May allow concrete vaults',
      'Some embalming restrictions',
      'Grave markers allowed',
      'Mixed burial methods on site'
    ],
    icon: '🌱'
  },
  {
    level: 'Natural Burial Ground',
    description: 'Dedicated green cemeteries with stricter environmental standards',
    features: [
      'No embalming chemicals allowed',
      'Biodegradable containers only',
      'Natural grave markers',
      'Sustainable landscaping practices'
    ],
    icon: '🌿'
  },
  {
    level: 'Conservation Cemetery',
    description: 'Highest standard combining burial with land conservation',
    features: [
      'Permanent land protection easement',
      'Active habitat restoration',
      'Partnership with land trusts',
      'Ecological burial practices only'
    ],
    icon: '🌲'
  },
];

const casketOptions = [
  {
    type: 'Wicker/Willow Caskets',
    material: 'Woven willow, seagrass, or bamboo',
    cost: '$400 - $2,000',
    benefits: 'Fully biodegradable, handcrafted, elegant appearance',
    timeline: 'Decomposes in 1-2 years'
  },
  {
    type: 'Pine or Softwood Caskets',
    material: 'Untreated pine, poplar, or other softwoods',
    cost: '$300 - $1,500',
    benefits: 'Traditional appearance, readily available, affordable',
    timeline: 'Decomposes in 2-5 years'
  },
  {
    type: 'Cardboard Caskets',
    material: 'Recycled or sustainable cardboard',
    cost: '$50 - $500',
    benefits: 'Most affordable, can be decorated, very lightweight',
    timeline: 'Decomposes in 6-12 months'
  },
  {
    type: 'Shrouds',
    material: 'Organic cotton, linen, wool, or silk',
    cost: '$100 - $800',
    benefits: 'Most natural option, minimal material, simple elegance',
    timeline: 'Decomposes in 1-6 months'
  },
  {
    type: 'Mushroom/Mycelium Suits',
    material: 'Organic cotton infused with mushroom spores',
    cost: '$1,500 - $2,000',
    benefits: 'Accelerates decomposition, neutralizes toxins',
    timeline: 'Enhanced decomposition in weeks'
  },
  {
    type: 'Wool Coffins',
    material: 'Sustainable wool and recycled cardboard',
    cost: '$800 - $1,500',
    benefits: 'Naturally biodegradable, warm appearance',
    timeline: 'Decomposes in 1-2 years'
  },
];

const greenVsTraditional = [
  {
    aspect: 'Embalming',
    green: 'Not permitted or natural alternatives',
    traditional: 'Formaldehyde-based chemicals'
  },
  {
    aspect: 'Casket',
    green: 'Biodegradable materials only',
    traditional: 'Metal, hardwood, fiberglass'
  },
  {
    aspect: 'Vault/Liner',
    green: 'Not used',
    traditional: 'Concrete or metal vault required'
  },
  {
    aspect: 'Grave Marker',
    green: 'Native plants, flat stones, GPS coordinates',
    traditional: 'Upright granite headstones'
  },
  {
    aspect: 'Landscaping',
    green: 'Native plants, natural meadow or woodland',
    traditional: 'Manicured lawn, non-native plants'
  },
  {
    aspect: 'Average Cost',
    green: '$1,000 - $4,000',
    traditional: '$7,000 - $12,000+'
  },
  {
    aspect: 'Land Use',
    green: 'Conservation-focused, habitat restoration',
    traditional: 'Permanent cemetery maintenance'
  },
];

const faqs = [
  {
    question: 'What exactly is green burial?',
    answer: 'Green burial, also called natural burial, is an environmentally friendly approach to interment that aims to have minimal environmental impact. The body is not embalmed with chemical preservatives and is placed in a biodegradable container (or shroud) without a burial vault. The goal is to allow the body to decompose naturally and return nutrients to the earth. Green burial grounds often feature native landscaping, natural grave markers, and may be part of conservation efforts to protect wildlife habitats.'
  },
  {
    question: 'Is green burial legal in all states?',
    answer: 'Yes, green burial is legal in all 50 US states. No state requires embalming by law (though some require it for certain circumstances like delayed burial or interstate transport). No state requires a burial vault or liner, though individual cemeteries may have their own requirements. Home burial is legal in most states with proper permits and property considerations. However, regulations vary by state regarding depth of burial, distance from water sources, and other requirements. Always check local ordinances.'
  },
  {
    question: 'How much does green burial cost compared to traditional burial?',
    answer: 'Green burial typically costs significantly less than traditional burial. A complete green burial including plot, burial services, and biodegradable container ranges from $1,000 to $4,000 at most green cemeteries. Compare this to traditional burial averaging $7,000-$12,000 or more. Savings come from eliminating embalming ($500-$900), expensive caskets ($1,000-$10,000), concrete vaults ($1,000-$4,000), and elaborate headstones ($1,000-$3,000). However, conservation cemetery plots in desirable locations may cost more due to land conservation fees.'
  },
  {
    question: 'What certifications should I look for in a green cemetery?',
    answer: 'The Green Burial Council (GBC) provides the most recognized certification standards. Look for these levels: Hybrid cemeteries offer some green options within traditional cemeteries. Natural Burial Grounds follow strict environmental practices. Conservation Cemeteries (highest standard) combine burial with permanent land protection and habitat restoration. Additionally, some cemeteries partner with local land trusts or have conservation easements. Always ask about their specific practices, as certification standards and enforcement can vary.'
  },
  {
    question: 'Can I have a viewing or funeral service with green burial?',
    answer: 'Yes, absolutely. Green burial allows for all traditional elements of a funeral service. For viewings without embalming, the body can be refrigerated or kept cool with dry ice. Services can be held at funeral homes, churches, or outdoors at the burial site. Many families find graveside services particularly meaningful at green cemeteries surrounded by nature. The main differences are using natural preservation methods and biodegradable containers. Some families even participate in filling the grave, creating a more personal and meaningful experience.'
  },
  {
    question: 'How do I find a green cemetery near me?',
    answer: 'Start by searching our database of over 519 green cemeteries and natural burial grounds across the United States. The Green Burial Council website maintains a directory of certified green cemeteries. You can also search for \"natural burial\" or \"conservation cemetery\" plus your state. Even if there\'s no dedicated green cemetery nearby, many traditional cemeteries now offer green burial sections. Contact local cemeteries to ask about their green burial options and what practices they allow.'
  },
  {
    question: 'What happens to the body over time with green burial?',
    answer: 'With green burial, the body undergoes natural decomposition as nature intended. Without chemical preservation and sealed containers, aerobic decomposition begins within days. Soft tissues typically decompose within 2-12 months depending on soil conditions, temperature, and moisture. Skeletal remains take longer, potentially decades. Throughout this process, nutrients return to the soil, supporting plant growth. In conservation cemeteries, this creates a meaningful ecological contribution as the burial site becomes part of a thriving natural habitat.'
  },
  {
    question: 'Are there alternatives to green burial for eco-conscious people?',
    answer: 'Yes, several other eco-friendly options exist. Aquamation (alkaline hydrolysis) uses water instead of flame and produces fewer emissions than cremation. Human composting (now legal in several states) transforms the body into nutrient-rich soil over about 30 days. Reef burials incorporate cremated remains into artificial reef structures. Memorial trees and \"living urns\" allow cremated remains to nourish a growing tree. Each option has different availability, costs, and environmental impacts to consider based on your priorities and location.'
  },
];

const topGreenCemeteries = [
  {
    name: 'Ramsey Creek Preserve',
    location: 'Westminster, SC',
    type: 'Conservation Cemetery',
    acres: 33,
    established: 1998,
    features: 'First certified conservation cemetery in US'
  },
  {
    name: 'Foxfield Preserve',
    location: 'Wilmot, OH',
    type: 'Conservation Cemetery',
    acres: 150,
    established: 2008,
    features: 'Partnered with Western Reserve Land Conservancy'
  },
  {
    name: 'Prairie Creek Conservation Cemetery',
    location: 'Gainesville, FL',
    type: 'Conservation Cemetery',
    acres: 78,
    established: 2010,
    features: 'Managed by Alachua Conservation Trust'
  },
  {
    name: 'Honey Creek Woodlands',
    location: 'Conyers, GA',
    type: 'Conservation Cemetery',
    acres: 130,
    established: 2007,
    features: 'Part of Monastery of the Holy Spirit'
  },
];

export default function GreenBurialGuidePage() {
  // JSON-LD structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Natural & Eco-Friendly Green Burial Guide 2025',
    description: 'Comprehensive guide to green burial options, environmental benefits, certifications, and finding natural burial grounds.',
    author: {
      '@type': 'Organization',
      name: 'Cemetery Near Me',
      url: 'https://www.cemeterynearbyme.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cemetery Near Me',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cemeterynearbyme.com/logo.png',
      },
    },
    datePublished: '2025-01-15',
    dateModified: '2025-01-15',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.cemeterynearbyme.com/guide/green-burial',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.cemeterynearbyme.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: 'https://www.cemeterynearbyme.com/guide',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Green Burial',
        item: 'https://www.cemeterynearbyme.com/guide/green-burial',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-950 text-white py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guides</Link></li>
                <li>/</li>
                <li className="text-white">Green Burial</li>
              </ol>
            </nav>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Leaf className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Eco-Friendly Guide</p>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Natural & Green Burial Guide
                </h1>
              </div>
            </div>

            <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
              Green burial offers an environmentally conscious alternative to traditional burial practices.
              By returning to natural burial methods, you can reduce your environmental footprint, protect
              wildlife habitats, and create a meaningful legacy that nurtures the earth.
            </p>

            {/* Author Attribution */}
            <div className="mt-8 flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                By Cemetery Near Me Editorial Team
              </span>
              <span>|</span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Updated January 2025
              </span>
              <span>|</span>
              <span>12 min read</span>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">519+</div>
                <div className="text-xs text-white/70">Green Cemeteries in US</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">60%</div>
                <div className="text-xs text-white/70">Less Cost vs Traditional</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-white/70">Biodegradable</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">50</div>
                <div className="text-xs text-white/70">States Where Legal</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Main Content */}
              <article className="lg:col-span-3 space-y-12">

                {/* Introduction */}
                <section>
                  <Card className="p-8 shadow-soft">
                    <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                      The American funeral industry has changed dramatically over the past century. What was once
                      a simple, natural process has become an elaborate, chemical-intensive practice with significant
                      environmental costs. Traditional burial in the United States annually uses approximately 30 million
                      board feet of hardwood, 90,000 tons of steel, 1.6 million tons of concrete, and 4.3 million gallons
                      of embalming fluid, according to the Green Burial Council.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                      Green burial, also known as natural burial, represents a return to the way humans have been
                      buried for thousands of years. Without chemical preservatives, concrete vaults, or metal caskets,
                      the body is allowed to decompose naturally and return nutrients to the earth. This approach not
                      only reduces environmental impact but often provides a more meaningful, personalized experience
                      for families while costing significantly less than traditional burial.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Whether you&apos;re motivated by environmental concerns, spiritual beliefs, cost savings, or simply
                      a desire for simplicity, this guide covers everything you need to know about green burial options
                      in the United States.
                    </p>
                  </Card>
                </section>

                {/* What is Green Burial */}
                <section id="what-is-green-burial">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">What is Green Burial?</h2>
                  </div>

                  <Card className="shadow-soft mb-6">
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground mb-6">
                        Green burial is an approach to death care that prioritizes environmental sustainability.
                        At its core, green burial involves three main principles:
                      </p>

                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-forest-50 dark:bg-forest-950/30 rounded-xl">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Recycle className="w-5 h-5 text-forest-600" />
                            No Toxic Chemicals
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Bodies are not embalmed with formaldehyde or other preservatives that can leach
                            into soil and groundwater.
                          </p>
                        </div>
                        <div className="p-4 bg-forest-50 dark:bg-forest-950/30 rounded-xl">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-forest-600" />
                            Biodegradable Materials
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Containers are made from natural materials like wicker, bamboo, untreated wood,
                            cardboard, or simple shrouds.
                          </p>
                        </div>
                        <div className="p-4 bg-forest-50 dark:bg-forest-950/30 rounded-xl">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <TreePine className="w-5 h-5 text-forest-600" />
                            Natural Landscape
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Burial grounds feature native plants, minimal maintenance, and often serve as
                            protected wildlife habitats.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                          Important Distinction
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          &quot;Green burial&quot; and &quot;natural burial&quot; are often used interchangeably, but
                          &quot;conservation burial&quot; specifically refers to burial in protected natural areas with
                          permanent land conservation easements. Conservation cemeteries represent the highest
                          environmental standard.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Environmental Benefits */}
                <section id="environmental-benefits">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Environmental Benefits</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    The environmental impact of traditional burial is substantial. Green burial offers
                    a meaningful way to reduce your final environmental footprint while contributing
                    to habitat preservation.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {environmentalBenefits.map((benefit, index) => (
                      <Card key={index} className="shadow-soft">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                              <benefit.icon className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-forest-700 dark:text-forest-400">
                                {benefit.stat}
                              </div>
                              <div className="text-xs text-muted-foreground">{benefit.statLabel}</div>
                            </div>
                          </div>
                          <CardTitle className="mt-4">{benefit.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <InlineAd />

                {/* Certifications */}
                <section id="certifications">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Green Burial Certifications</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    The Green Burial Council (GBC) is the leading certification body for green burial
                    in North America. Understanding certification levels helps you choose a cemetery
                    that matches your environmental values.
                  </p>

                  <div className="space-y-4">
                    {certificationLevels.map((cert, index) => (
                      <Card key={index} className="shadow-soft">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <span className="text-4xl">{cert.icon}</span>
                            <div>
                              <CardTitle>{cert.level}</CardTitle>
                              <CardDescription>{cert.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {cert.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="mt-6 p-6 shadow-soft border-l-4 border-l-forest-600">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-forest-600" />
                      Verifying Certification
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Always verify a cemetery&apos;s certification status directly with the Green Burial Council.
                      Some cemeteries claim to be &quot;green&quot; without meeting official standards. Ask for
                      documentation of certification and specific practices they follow. True green cemeteries
                      will be transparent about their methods and happy to provide details.
                    </p>
                  </Card>
                </section>

                {/* Green vs Traditional */}
                <section id="comparison">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <Mountain className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Natural vs Traditional Burial</h2>
                  </div>

                  <Card className="shadow-soft mb-6">
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2 font-semibold">Aspect</th>
                              <th className="text-left py-3 px-2 font-semibold text-forest-700 dark:text-forest-400">
                                Green/Natural Burial
                              </th>
                              <th className="text-left py-3 px-2 font-semibold">Traditional Burial</th>
                            </tr>
                          </thead>
                          <tbody>
                            {greenVsTraditional.map((row, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-3 px-2 font-medium">{row.aspect}</td>
                                <td className="py-3 px-2 text-muted-foreground">{row.green}</td>
                                <td className="py-3 px-2 text-muted-foreground">{row.traditional}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <InlineAd />

                {/* Biodegradable Casket Options */}
                <section id="caskets">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Biodegradable Casket Options</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    One of the beautiful aspects of green burial is the variety of natural container
                    options available. From elegant woven caskets to simple shrouds, these choices
                    reflect personal values while supporting environmental goals.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    {casketOptions.map((option, index) => (
                      <Card key={index} className="shadow-soft">
                        <CardHeader>
                          <CardTitle className="text-lg">{option.type}</CardTitle>
                          <CardDescription>{option.material}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cost Range:</span>
                              <span className="font-medium">{option.cost}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Decomposition:</span>
                              <span className="font-medium">{option.timeline}</span>
                            </div>
                            <p className="text-muted-foreground pt-2 border-t">
                              {option.benefits}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="mt-6 p-6 shadow-soft bg-forest-50 dark:bg-forest-950/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-forest-600" />
                      DIY and Family-Made Options
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Many families choose to build or decorate their own caskets, creating a meaningful
                      project that honors the deceased. Simple pine boxes, decorated shrouds, or personalized
                      cardboard caskets can be created at home. Some green cemeteries offer workshops to help
                      families create containers. This personal involvement often provides comfort and closure
                      during the grieving process.
                    </p>
                  </Card>
                </section>

                {/* Conservation Burial Grounds */}
                <section id="conservation">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <TreePine className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Conservation Burial Grounds</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Conservation cemeteries represent the highest environmental standard in green burial.
                    These properties are protected by legal conservation easements, ensuring the land will
                    remain natural habitat in perpetuity. Burial fees directly fund land acquisition and
                    habitat restoration.
                  </p>

                  <Card className="shadow-soft mb-6">
                    <CardHeader>
                      <CardTitle>Notable Conservation Cemeteries</CardTitle>
                      <CardDescription>
                        These pioneering conservation cemeteries set the standard for ecological burial
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topGreenCemeteries.map((cemetery, index) => (
                          <div key={index} className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{cemetery.name}</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {cemetery.location}
                                </p>
                              </div>
                              <span className="text-xs bg-forest-100 dark:bg-forest-900 text-forest-700 dark:text-forest-400 px-2 py-1 rounded">
                                {cemetery.type}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                              <div>
                                <span className="text-muted-foreground">Size:</span>
                                <span className="font-medium ml-1">{cemetery.acres} acres</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Est:</span>
                                <span className="font-medium ml-1">{cemetery.established}</span>
                              </div>
                              <div className="col-span-3 md:col-span-1">
                                <span className="text-muted-foreground text-xs">{cemetery.features}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">Benefits of Conservation Cemeteries</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          Permanent land protection through legal easements
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          Active habitat restoration and wildlife support
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          Partnership with established land trusts
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          Creates lasting ecological legacy
                        </li>
                      </ul>
                    </Card>
                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">What to Expect</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          Natural setting among native plants and wildlife
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          GPS coordinates rather than traditional markers
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          Walking trails through burial grounds
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                          Seasonal changes in landscape appearance
                        </li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* How to Find Green Cemeteries */}
                <section id="find">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">How to Find Green Cemeteries</h2>
                  </div>

                  <Card className="shadow-soft mb-6">
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground mb-6">
                        The availability of green burial options has grown significantly in recent years.
                        Our database includes <strong>519+ green cemeteries and natural burial grounds</strong> across
                        the United States. Here&apos;s how to find options near you:
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-forest-50 dark:bg-forest-950/30 rounded-xl">
                          <h3 className="font-semibold mb-2">Search Our Database</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Use our cemetery search to find green cemeteries, natural burial grounds,
                            and conservation cemeteries in your area.
                          </p>
                          <Link
                            href="/type/green-cemetery"
                            className="inline-flex items-center gap-2 text-sm text-forest-700 dark:text-forest-400 hover:underline"
                          >
                            Browse Green Cemeteries
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="p-4 bg-forest-50 dark:bg-forest-950/30 rounded-xl">
                          <h3 className="font-semibold mb-2">Natural Burial Grounds</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Find dedicated natural burial sites that follow strict environmental
                            practices.
                          </p>
                          <Link
                            href="/type/natural-burial"
                            className="inline-flex items-center gap-2 text-sm text-forest-700 dark:text-forest-400 hover:underline"
                          >
                            Browse Natural Burial Sites
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 shadow-soft">
                    <h3 className="font-semibold mb-4">Questions to Ask Green Cemeteries</h3>
                    <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        Are you certified by the Green Burial Council?
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        Is embalming prohibited or just discouraged?
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        What container materials are acceptable?
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        How are graves marked and located?
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        Is there a conservation easement on the land?
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        What happens to the land long-term?
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        Can family participate in the burial?
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                        What are the total costs including opening/closing?
                      </li>
                    </ul>
                  </Card>
                </section>

                <InlineAd />

                {/* FAQ Section */}
                <section id="faq">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-forest-700 dark:text-forest-400" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index} className="shadow-soft">
                        <CardHeader>
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Related Resources */}
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-6">Related Resources</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/guide/funeral-planning">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          Complete Funeral Planning Guide
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive guide to funeral costs, checklists, and planning ahead.
                        </p>
                      </Card>
                    </Link>
                    <Link href="/type/green-cemetery">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Leaf className="w-4 h-4" />
                          Green Cemeteries Directory
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Browse 519+ green cemeteries across the United States.
                        </p>
                      </Card>
                    </Link>
                    <Link href="/type/natural-burial">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <TreePine className="w-4 h-4" />
                          Natural Burial Grounds
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Find dedicated natural burial sites near you.
                        </p>
                      </Card>
                    </Link>
                    <Link href="/search">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Search All Cemeteries
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Search our complete database of 6,000+ cemeteries.
                        </p>
                      </Card>
                    </Link>
                  </div>
                </section>

              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                <SidebarAd sticky={true} />

                {/* Table of Contents */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-4">In This Guide</h3>
                  <nav>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#what-is-green-burial" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          What is Green Burial?
                        </a>
                      </li>
                      <li>
                        <a href="#environmental-benefits" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          Environmental Benefits
                        </a>
                      </li>
                      <li>
                        <a href="#certifications" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          Certifications
                        </a>
                      </li>
                      <li>
                        <a href="#comparison" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          Natural vs Traditional
                        </a>
                      </li>
                      <li>
                        <a href="#caskets" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          Biodegradable Caskets
                        </a>
                      </li>
                      <li>
                        <a href="#conservation" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          Conservation Cemeteries
                        </a>
                      </li>
                      <li>
                        <a href="#find" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          Find Green Cemeteries
                        </a>
                      </li>
                      <li>
                        <a href="#faq" className="text-muted-foreground hover:text-forest-600 transition-colors">
                          FAQ
                        </a>
                      </li>
                    </ul>
                  </nav>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 shadow-soft bg-gradient-to-br from-forest-50 to-emerald-50/50 dark:from-forest-900/20 dark:to-emerald-900/10">
                  <h3 className="font-serif font-semibold mb-4">Quick Facts</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Leaf className="w-4 h-4 text-forest-600 mt-0.5" />
                      <span><strong>519+</strong> green cemeteries in US</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-forest-600 mt-0.5" />
                      <span><strong>$1,000-$4,000</strong> average green burial cost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-forest-600 mt-0.5" />
                      <span><strong>10x less</strong> carbon than traditional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5" />
                      <span><strong>50 states</strong> where legal</span>
                    </li>
                  </ul>
                </Card>

                {/* CTA Card */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-3">Find Green Cemeteries</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search our database of green cemeteries and natural burial grounds.
                  </p>
                  <Link
                    href="/type/green-cemetery"
                    className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-forest-700 text-white rounded-lg font-medium hover:bg-forest-800 transition-colors text-sm"
                  >
                    <Leaf className="w-4 h-4" />
                    Browse Green Cemeteries
                  </Link>
                </Card>

                {/* Contact */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-3">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about green burial options? We&apos;re here to help.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm text-forest-700 dark:text-forest-400 hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </Link>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
