import { Metadata } from 'next';
import Link from 'next/link';
import {
  ClipboardList,
  DollarSign,
  FileText,
  Scale,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  Building2,
  Bookmark,
  Users,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InlineAd from '@/components/ads/InlineAd';
import SidebarAd from '@/components/ads/SidebarAd';

export const metadata: Metadata = {
  title: 'Complete Funeral Pre-Planning Guide 2025 | Cemetery Near Me',
  description: 'Comprehensive funeral planning guide covering costs ($7,000-$12,000 average), step-by-step checklists, burial vs cremation comparison, pre-need arrangements, insurance options, and state requirements.',
  keywords: 'funeral planning, funeral costs, pre-need funeral, burial vs cremation, funeral insurance, funeral checklist, funeral home questions, funeral arrangements, end of life planning',
  authors: [{ name: 'Cemetery Near Me Editorial Team' }],
  openGraph: {
    title: 'Complete Funeral Pre-Planning Guide 2025',
    description: 'Everything you need to know about planning a funeral, from costs and checklists to legal requirements.',
    type: 'article',
    locale: 'en_US',
    siteName: 'Cemetery Near Me',
    url: 'https://www.cemeterynearbyme.com/guide/funeral-planning',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete Funeral Pre-Planning Guide 2025',
    description: 'Comprehensive guide to funeral planning, costs, and arrangements.',
  },
  alternates: {
    canonical: 'https://www.cemeterynearbyme.com/guide/funeral-planning',
  },
};

const costBreakdown = [
  { item: 'Basic Services Fee', lowCost: '$2,000', highCost: '$3,500', description: 'Non-declinable fee covering funeral home overhead' },
  { item: 'Embalming', lowCost: '$500', highCost: '$900', description: 'Optional unless required by law or viewing' },
  { item: 'Body Preparation', lowCost: '$200', highCost: '$400', description: 'Cosmetics, hair styling, dressing' },
  { item: 'Viewing/Visitation', lowCost: '$400', highCost: '$800', description: 'Use of facilities for viewing' },
  { item: 'Funeral Ceremony', lowCost: '$400', highCost: '$700', description: 'Staff and facilities for service' },
  { item: 'Hearse', lowCost: '$300', highCost: '$500', description: 'Transportation to cemetery' },
  { item: 'Casket', lowCost: '$1,000', highCost: '$10,000+', description: 'Wide range from basic to premium' },
  { item: 'Burial Vault/Liner', lowCost: '$1,000', highCost: '$4,000', description: 'Often required by cemeteries' },
  { item: 'Cemetery Plot', lowCost: '$1,000', highCost: '$5,000+', description: 'Varies greatly by location' },
  { item: 'Headstone/Marker', lowCost: '$500', highCost: '$3,000+', description: 'From flat markers to monuments' },
];

const planningChecklist = [
  {
    phase: 'Immediate Planning (Within 48 Hours)',
    items: [
      'Obtain legal pronouncement of death',
      'Contact a funeral home or mortuary',
      'Locate important documents (will, insurance policies)',
      'Notify immediate family members',
      'Decide between burial or cremation',
      'Begin making arrangements with funeral home',
    ]
  },
  {
    phase: 'Service Planning (Days 1-3)',
    items: [
      'Choose type of service (religious, secular, celebration of life)',
      'Select date, time, and location for services',
      'Decide on viewing or visitation',
      'Choose pallbearers if applicable',
      'Select readings, music, and speakers',
      'Order flowers and plan floral arrangements',
      'Prepare obituary and death notices',
    ]
  },
  {
    phase: 'Administrative Tasks (Week 1-2)',
    items: [
      'Obtain certified copies of death certificate (10-15 copies recommended)',
      'Notify Social Security Administration',
      'Contact life insurance companies',
      'Notify employer and HR departments',
      'Contact banks and financial institutions',
      'Cancel or transfer subscriptions and memberships',
      'Update property titles if necessary',
    ]
  },
  {
    phase: 'Long-term Planning (Month 1+)',
    items: [
      'Meet with estate attorney if needed',
      'File for life insurance benefits',
      'Apply for survivor benefits (Social Security, VA)',
      'Handle probate if required',
      'Distribute assets according to will',
      'Close or transfer accounts',
      'Plan memorial for first anniversary if desired',
    ]
  }
];

const burialVsCremation = [
  {
    aspect: 'Average Cost',
    burial: '$7,000 - $12,000',
    cremation: '$1,000 - $5,000',
  },
  {
    aspect: 'Timeline',
    burial: 'Usually within 1 week',
    cremation: 'Flexible timing',
  },
  {
    aspect: 'Environmental Impact',
    burial: 'Land use, embalming chemicals',
    cremation: 'Energy use, emissions',
  },
  {
    aspect: 'Memorialization',
    burial: 'Permanent gravesite for visits',
    cremation: 'Multiple options (urn, scatter, columbarium)',
  },
  {
    aspect: 'Religious Considerations',
    burial: 'Required by some faiths',
    cremation: 'Accepted by most, prohibited by few',
  },
  {
    aspect: 'Space Requirements',
    burial: 'Cemetery plot required',
    cremation: 'Minimal space needed',
  },
  {
    aspect: 'Family Gatherings',
    burial: 'Centralized location',
    cremation: 'Can be divided among family',
  },
];

const faqs = [
  {
    question: 'How much does the average funeral cost in America?',
    answer: 'The average funeral in America costs between $7,000 and $12,000, according to the National Funeral Directors Association (NFDA). This includes the funeral home\'s basic services fee, embalming, viewing, ceremony, hearse, casket, and cemetery expenses. Cremation services typically cost $1,000 to $5,000. These figures can vary significantly based on location, services selected, and merchandise chosen. Urban areas and coastal regions tend to have higher costs than rural or Midwest locations.'
  },
  {
    question: 'What is the difference between pre-need and at-need funeral planning?',
    answer: 'Pre-need planning means arranging and often pre-paying for your funeral before death occurs, allowing you to make decisions without time pressure and lock in current prices. At-need planning happens after death has occurred, requiring quick decisions during an emotionally difficult time, often at higher costs. Pre-need arrangements can save families 20-40% compared to at-need purchases and eliminate the stress of making major financial decisions while grieving.'
  },
  {
    question: 'Is embalming legally required?',
    answer: 'Embalming is not legally required in most states. However, it may be required if: the body will be transported across state lines, there will be a public viewing, the funeral will be delayed beyond a certain timeframe, or the death was caused by certain communicable diseases. Some funeral homes require embalming for viewings. Refrigeration is a legal alternative for preservation in most cases. Always ask about alternatives if you prefer not to have embalming.'
  },
  {
    question: 'Can I purchase a casket from somewhere other than the funeral home?',
    answer: 'Yes, under the FTC Funeral Rule, funeral homes must accept caskets purchased from third-party vendors without charging handling fees. You can buy caskets from big-box retailers like Costco, online retailers like Amazon, or specialized casket companies, often saving 50-70% compared to funeral home prices. The funeral home cannot refuse to handle the body or charge extra fees for using an outside casket.'
  },
  {
    question: 'What documents do I need to gather before meeting with a funeral home?',
    answer: 'Before meeting with a funeral home, gather: the deceased\'s Social Security number, birth certificate, military discharge papers (DD-214) if applicable, marriage certificate if married, life insurance policies, pre-paid funeral plans or burial insurance, cemetery deed if plot was pre-purchased, a recent photo for the obituary, and information about surviving family members. Having these documents ready expedites the process and ensures accurate death certificates.'
  },
  {
    question: 'How does funeral pre-payment protect against price increases?',
    answer: 'Pre-paid funeral plans lock in today\'s prices for future services, protecting against inflation. Funeral costs have historically risen 4-6% annually. A service costing $8,000 today could cost $11,000-$13,000 in 10 years. Pre-payment options include funeral home trusts, insurance-funded plans, and payable-on-death bank accounts. However, carefully review contracts for portability (if you move), refund policies, and what happens if the funeral home closes.'
  },
  {
    question: 'What questions should I ask when comparing funeral homes?',
    answer: 'Key questions include: Can I see an itemized price list (required by law)? What is your basic services fee? Are there package discounts? What are your payment terms? Do you offer price matching? What happens if I move or the funeral home closes? Can I make changes to a pre-paid plan? Do you offer grief support services? What certifications do your staff hold? Can you accommodate specific religious or cultural requirements?'
  },
  {
    question: 'Are there any free or low-cost funeral options?',
    answer: 'Yes, several options exist for families with limited funds: body donation to medical schools (often covers all costs and may return cremated remains), veteran burial benefits through the VA ($2,000+ toward burial), Social Security lump-sum death payment ($255), Medicaid burial assistance in some states, crowdfunding campaigns, direct cremation or immediate burial without services, and county indigent burial programs for those who qualify financially.'
  }
];

const stateRequirements = [
  { state: 'California', waitPeriod: '24 hours before cremation', unique: 'Casket rental allowed by law' },
  { state: 'Texas', waitPeriod: '48 hours before cremation', unique: 'No embalming requirement' },
  { state: 'New York', waitPeriod: '24 hours before cremation', unique: 'Funeral director must be present at arrangement' },
  { state: 'Florida', waitPeriod: '48 hours before cremation', unique: 'Refrigeration required if no embalming' },
  { state: 'Pennsylvania', waitPeriod: '24 hours before cremation', unique: 'Two witnesses required for cremation authorization' },
  { state: 'Illinois', waitPeriod: '24 hours before cremation', unique: 'Medical examiner must sign off on cremation' },
];

export default function FuneralPlanningGuidePage() {
  // JSON-LD structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Complete Funeral Pre-Planning Guide 2025',
    description: 'Comprehensive guide covering funeral costs, planning checklists, burial vs cremation, insurance options, and legal requirements.',
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
      '@id': 'https://www.cemeterynearbyme.com/guide/funeral-planning',
    },
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Plan a Funeral',
    description: 'Step-by-step guide to planning funeral arrangements',
    totalTime: 'P14D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '7000-12000',
    },
    step: planningChecklist.flatMap((phase, phaseIndex) =>
      phase.items.map((item, itemIndex) => ({
        '@type': 'HowToStep',
        position: phaseIndex * 10 + itemIndex + 1,
        name: item,
        text: item,
      }))
    ),
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
        name: 'Funeral Planning',
        item: 'https://www.cemeterynearbyme.com/guide/funeral-planning',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-primary-foreground/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guides</Link></li>
                <li>/</li>
                <li className="text-white">Funeral Planning</li>
              </ol>
            </nav>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm font-medium">Complete Guide</p>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Funeral Pre-Planning Guide
                </h1>
              </div>
            </div>

            <p className="text-primary-foreground/80 text-lg max-w-3xl leading-relaxed">
              Planning ahead for end-of-life arrangements ensures your wishes are honored, reduces stress
              on loved ones, and can save thousands of dollars. This comprehensive guide covers everything
              from understanding costs to navigating legal requirements across all 50 states.
            </p>

            {/* Author Attribution */}
            <div className="mt-8 flex items-center gap-4 text-sm text-primary-foreground/70">
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
              <span>15 min read</span>
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
                      The death of a loved one is one of life&apos;s most challenging experiences. Adding financial
                      stress and difficult decisions during grief only compounds the burden. According to the
                      National Funeral Directors Association (NFDA), the median cost of a funeral with viewing
                      and burial in 2023 was $7,848, while a funeral with cremation averaged $6,971. However,
                      total expenses often reach $10,000-$12,000 or more when including cemetery costs, flowers,
                      obituaries, and other expenses.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Pre-planning your funeral or helping a family member plan ahead can save 20-40% compared
                      to at-need arrangements and ensures that your specific wishes are documented and followed.
                      This guide walks you through every aspect of funeral planning, from understanding costs
                      to asking the right questions at funeral homes.
                    </p>
                  </Card>
                </section>

                {/* Cost Section */}
                <section id="costs">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Average Funeral Costs in America</h2>
                  </div>

                  <Card className="shadow-soft mb-6">
                    <CardHeader>
                      <CardTitle>2024-2025 Funeral Cost Breakdown</CardTitle>
                      <CardDescription>
                        Understanding what you&apos;re paying for helps you make informed decisions and identify
                        areas where you can save money.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2 font-semibold">Service/Item</th>
                              <th className="text-left py-3 px-2 font-semibold">Low Range</th>
                              <th className="text-left py-3 px-2 font-semibold">High Range</th>
                              <th className="text-left py-3 px-2 font-semibold hidden md:table-cell">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {costBreakdown.map((item, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-3 px-2 font-medium">{item.item}</td>
                                <td className="py-3 px-2 text-muted-foreground">{item.lowCost}</td>
                                <td className="py-3 px-2 text-muted-foreground">{item.highCost}</td>
                                <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{item.description}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-muted/50">
                              <td className="py-3 px-2 font-bold">Estimated Total</td>
                              <td className="py-3 px-2 font-bold">$7,000</td>
                              <td className="py-3 px-2 font-bold">$12,000+</td>
                              <td className="py-3 px-2 hidden md:table-cell">Varies by location and choices</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 shadow-soft border-l-4 border-l-blue-500">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        Cost Varies by Location
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Urban areas like New York City and Los Angeles can cost 40-60% more than rural areas.
                        The same funeral that costs $8,000 in Ohio might cost $13,000 in Manhattan.
                      </p>
                    </Card>
                    <Card className="p-6 shadow-soft border-l-4 border-l-green-500">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Ways to Save Money
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Buy caskets from third-party vendors, choose direct cremation, hold services at a
                        church or home instead of funeral home, and compare prices from 3-4 funeral homes.
                      </p>
                    </Card>
                  </div>
                </section>

                <InlineAd />

                {/* Planning Checklist */}
                <section id="checklist">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Step-by-Step Planning Checklist</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Whether planning ahead for yourself or arranging services after a death, this comprehensive
                    checklist ensures nothing is overlooked during an emotionally difficult time.
                  </p>

                  <div className="space-y-6">
                    {planningChecklist.map((phase, index) => (
                      <Card key={index} className="shadow-soft">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            {phase.phase}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {phase.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Burial vs Cremation */}
                <section id="burial-vs-cremation">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Scale className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Burial vs Cremation Comparison</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    The cremation rate in America has risen from 27% in 2000 to over 60% in 2023, driven by
                    lower costs, environmental concerns, and changing religious attitudes. However, both options
                    have their place, and the right choice depends on personal, religious, and family preferences.
                  </p>

                  <Card className="shadow-soft mb-6">
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2 font-semibold">Aspect</th>
                              <th className="text-left py-3 px-2 font-semibold">Traditional Burial</th>
                              <th className="text-left py-3 px-2 font-semibold">Cremation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {burialVsCremation.map((row, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-3 px-2 font-medium">{row.aspect}</td>
                                <td className="py-3 px-2 text-muted-foreground">{row.burial}</td>
                                <td className="py-3 px-2 text-muted-foreground">{row.cremation}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">Consider Burial If:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Your faith requires traditional burial
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Family has existing cemetery plots
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          A permanent memorial location is important
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Traditional funeral with viewing desired
                        </li>
                      </ul>
                    </Card>
                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">Consider Cremation If:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Cost is a significant concern
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Environmental impact matters to you
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Flexibility in timing and location desired
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Family wants to scatter or divide remains
                        </li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <InlineAd />

                {/* Pre-Need vs At-Need */}
                <section id="pre-need">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Pre-Need vs At-Need Arrangements</h2>
                  </div>

                  <Card className="shadow-soft mb-6">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-accent" />
                            Pre-Need (Planning Ahead)
                          </h3>
                          <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              Lock in today&apos;s prices (funeral costs rise 4-6% annually)
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              Make decisions without emotional pressure
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              Ensure your specific wishes are documented
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              Reduce burden on grieving family members
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              May help protect assets from Medicaid spend-down
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            At-Need (After Death)
                          </h3>
                          <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              Decisions made during emotional distress
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              Limited time to compare prices and options
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              Higher likelihood of overspending
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              Family may disagree on wishes
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              Full current prices apply
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-muted-foreground">
                    Studies show that families who pre-plan funerals report significantly less stress and
                    financial strain than those making at-need arrangements. The average savings from
                    pre-planning ranges from $2,000-$4,000, not including the emotional value of reduced
                    decision-making burden during grief.
                  </p>
                </section>

                {/* Insurance and Financing */}
                <section id="financing">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Insurance and Financing Options</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Multiple options exist for funding funeral expenses, each with advantages and considerations.
                    Understanding these options helps you choose the best approach for your situation.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">Final Expense Insurance</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Whole life insurance policies specifically designed for funeral costs, typically
                        $5,000-$25,000 in coverage. Premiums are fixed and benefits are guaranteed.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>+ No medical exam required in most cases</li>
                        <li>+ Benefits paid quickly (24-48 hours)</li>
                        <li>- Higher premiums for older applicants</li>
                      </ul>
                    </Card>

                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">Pre-Need Insurance</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Insurance policies sold through funeral homes that assign benefits directly to
                        pay for pre-arranged services.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>+ Prices locked in at time of purchase</li>
                        <li>+ Benefits assigned to funeral home</li>
                        <li>- May not be transferable if you move</li>
                      </ul>
                    </Card>

                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">Payable-on-Death Account</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Bank account with designated beneficiary who receives funds immediately upon
                        death, bypassing probate.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>+ You maintain control of funds</li>
                        <li>+ Can be used for any purpose</li>
                        <li>- No price protection against inflation</li>
                      </ul>
                    </Card>

                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3">Funeral Home Payment Plan</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Many funeral homes offer payment plans for at-need arrangements, though terms
                        vary significantly.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>+ Available even without advance planning</li>
                        <li>+ Can spread costs over time</li>
                        <li>- May include interest charges</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* State Requirements */}
                <section id="legal">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Legal Requirements by State</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Funeral regulations vary by state. While this is not legal advice, understanding general
                    requirements helps you ask informed questions. Always verify current laws with your state&apos;s
                    regulatory board or a funeral director.
                  </p>

                  <Card className="shadow-soft mb-6">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Sample State Requirements</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2 font-semibold">State</th>
                              <th className="text-left py-3 px-2 font-semibold">Cremation Wait Period</th>
                              <th className="text-left py-3 px-2 font-semibold">Unique Requirement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stateRequirements.map((state, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-3 px-2 font-medium">{state.state}</td>
                                <td className="py-3 px-2 text-muted-foreground">{state.waitPeriod}</td>
                                <td className="py-3 px-2 text-muted-foreground">{state.unique}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 shadow-soft bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      Universal FTC Funeral Rule
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The Federal Trade Commission&apos;s Funeral Rule requires all funeral homes to: provide
                      itemized price lists upon request, allow you to purchase only services you want,
                      accept caskets purchased elsewhere without penalty, and disclose embalming requirements.
                      This rule applies in all 50 states.
                    </p>
                  </Card>
                </section>

                <InlineAd />

                {/* Questions to Ask */}
                <section id="questions">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">Questions to Ask Funeral Homes</h2>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    When comparing funeral homes, asking the right questions helps you make an informed decision
                    and avoid unexpected costs. Reputable funeral homes welcome these questions.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-accent" />
                        Pricing Questions
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Can I get a complete itemized price list?</li>
                        <li>What is your non-declinable basic services fee?</li>
                        <li>Do you offer package pricing discounts?</li>
                        <li>Are there any additional fees not on the price list?</li>
                        <li>Do you accept outside caskets and urns?</li>
                        <li>What payment methods do you accept?</li>
                      </ul>
                    </Card>

                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" />
                        Service Questions
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>What services are included in your packages?</li>
                        <li>Can services be held at alternate locations?</li>
                        <li>Do you offer video streaming for remote family?</li>
                        <li>What are your facility capacity limits?</li>
                        <li>Do you provide grief support resources?</li>
                        <li>Can you accommodate specific religious customs?</li>
                      </ul>
                    </Card>

                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-accent" />
                        Pre-Planning Questions
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Is my pre-paid plan transferable if I move?</li>
                        <li>What happens if prices exceed my pre-paid amount?</li>
                        <li>What is your refund policy?</li>
                        <li>How are my pre-paid funds held and protected?</li>
                        <li>Can I make changes to my plan later?</li>
                        <li>What happens if your business closes?</li>
                      </ul>
                    </Card>

                    <Card className="p-6 shadow-soft">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-accent" />
                        Credentials Questions
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Are you licensed and accredited?</li>
                        <li>How long have you been in business?</li>
                        <li>Can I see recent reviews or testimonials?</li>
                        <li>What professional associations do you belong to?</li>
                        <li>Are your staff licensed funeral directors?</li>
                        <li>Do you have any complaints on file with the state?</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* FAQ Section */}
                <section id="faq">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-accent" />
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
                    <Link href="/guide/green-burial">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          Natural & Green Burial Guide
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Learn about eco-friendly burial options, biodegradable caskets, and green cemeteries.
                        </p>
                      </Card>
                    </Link>
                    <Link href="/type/crematorium">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          Find Crematoriums Near You
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Search our database of crematoriums across the United States.
                        </p>
                      </Card>
                    </Link>
                    <Link href="/search">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Search Cemeteries
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Find cemeteries, memorial parks, and burial grounds in your area.
                        </p>
                      </Card>
                    </Link>
                    <Link href="/type">
                      <Card className="p-6 shadow-soft hover:shadow-md transition-shadow h-full">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          Browse by Cemetery Type
                          <ArrowRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Explore different types of cemeteries including national, veterans, and green cemeteries.
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
                        <a href="#costs" className="text-muted-foreground hover:text-accent transition-colors">
                          Average Funeral Costs
                        </a>
                      </li>
                      <li>
                        <a href="#checklist" className="text-muted-foreground hover:text-accent transition-colors">
                          Planning Checklist
                        </a>
                      </li>
                      <li>
                        <a href="#burial-vs-cremation" className="text-muted-foreground hover:text-accent transition-colors">
                          Burial vs Cremation
                        </a>
                      </li>
                      <li>
                        <a href="#pre-need" className="text-muted-foreground hover:text-accent transition-colors">
                          Pre-Need vs At-Need
                        </a>
                      </li>
                      <li>
                        <a href="#financing" className="text-muted-foreground hover:text-accent transition-colors">
                          Insurance & Financing
                        </a>
                      </li>
                      <li>
                        <a href="#legal" className="text-muted-foreground hover:text-accent transition-colors">
                          Legal Requirements
                        </a>
                      </li>
                      <li>
                        <a href="#questions" className="text-muted-foreground hover:text-accent transition-colors">
                          Questions to Ask
                        </a>
                      </li>
                      <li>
                        <a href="#faq" className="text-muted-foreground hover:text-accent transition-colors">
                          FAQ
                        </a>
                      </li>
                    </ul>
                  </nav>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 shadow-soft bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10">
                  <h3 className="font-serif font-semibold mb-4">Quick Facts</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-accent mt-0.5" />
                      <span><strong>$7,848</strong> median funeral cost (2023)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-accent mt-0.5" />
                      <span><strong>60%+</strong> cremation rate in US</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-accent mt-0.5" />
                      <span><strong>4-6%</strong> annual funeral cost increase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-accent mt-0.5" />
                      <span><strong>20-40%</strong> savings with pre-planning</span>
                    </li>
                  </ul>
                </Card>

                {/* CTA Card */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-3">Find Cemeteries Near You</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search our database of over 6,000 cemeteries across the United States.
                  </p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                  >
                    Search Cemeteries
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Card>

                {/* Contact */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-3">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our team can help answer questions about funeral planning.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
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
