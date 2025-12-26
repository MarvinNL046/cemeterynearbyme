import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Flag, Medal, MapPin, Users, FileText, Phone, ArrowRight, CheckCircle, Clock, DollarSign, Home, Star, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import InlineAd from '@/components/ads/InlineAd';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import { SITE_STATS } from '@/lib/stats-config';

export const metadata: Metadata = {
  title: 'Veterans & National Cemeteries: Complete Burial Benefits Guide | Cemetery Near Me',
  description: 'Complete guide to VA burial benefits for veterans and eligible dependents. Learn about national cemeteries, headstone options, eligibility requirements, and how to apply.',
  keywords: 'veterans cemetery, national cemetery, VA burial benefits, veteran headstones, military funeral honors, Arlington Cemetery, veterans burial eligibility, NCA',
  openGraph: {
    title: 'Veterans & National Cemeteries: Complete Burial Benefits Guide',
    description: 'Everything veterans and families need to know about VA burial benefits, national cemeteries, and military funeral honors.',
    type: 'article',
    siteName: 'Cemetery Near Me',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veterans & National Cemeteries Guide',
    description: 'Complete guide to VA burial benefits and national cemeteries.',
  },
  alternates: {
    canonical: 'https://www.cemeterynearbyme.com/guide/veterans',
  },
};

const burialBenefits = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Burial in a National Cemetery',
    description: 'Gravesite in any VA national cemetery with available space, opening and closing of the grave, and perpetual care of the gravesite.',
    eligibility: 'All eligible veterans',
    cost: 'No cost',
  },
  {
    icon: <Medal className="w-6 h-6" />,
    title: 'Government Headstone or Marker',
    description: 'Headstone, marker, or medallion to commemorate the veteran. Available for graves in private cemeteries as well.',
    eligibility: 'All eligible veterans',
    cost: 'No cost',
  },
  {
    icon: <Flag className="w-6 h-6" />,
    title: 'Burial Flag',
    description: 'United States flag to drape the casket or accompany the urn, presented to the next of kin following the funeral.',
    eligibility: 'All eligible veterans',
    cost: 'No cost',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Military Funeral Honors',
    description: 'At minimum, two uniformed service members to fold and present the flag, and play Taps. May include honor guard and rifle salute.',
    eligibility: 'All eligible veterans',
    cost: 'No cost',
  },
  {
    icon: <Home className="w-6 h-6" />,
    title: 'Presidential Memorial Certificate',
    description: 'Engraved paper certificate signed by the current President, honoring the veteran\'s service.',
    eligibility: 'All eligible veterans',
    cost: 'No cost',
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Burial Allowance',
    description: 'Monetary benefit to help offset burial, plot, and transportation costs for service-connected deaths or veterans receiving VA benefits.',
    eligibility: 'Service-connected or VA pension recipients',
    cost: 'Up to $2,000+',
  },
];

const eligibilityGroups = [
  {
    group: 'Veterans',
    requirements: [
      'Discharged or separated under conditions other than dishonorable',
      'Served on active duty',
      'Members of Reserve and National Guard who were entitled to retirement pay, or would have been but for age',
      'Commissioned officers of NOAA and USPHS',
    ],
  },
  {
    group: 'Spouses and Dependents',
    requirements: [
      'Spouse or surviving spouse of an eligible veteran',
      'Minor children of eligible veterans',
      'Unmarried adult children who became permanently disabled before age 21',
      'Surviving spouse who remarried a non-veteran after age 57 (for some benefits)',
    ],
  },
  {
    group: 'Other Eligible Persons',
    requirements: [
      'Members who died while on active duty, training, or inactive duty training',
      'Members who died while hospitalized by VA',
      'U.S. citizens who served in armed forces of U.S. allies during wartime',
      'Certain Filipino veterans who served during World War II',
    ],
  },
];

const headstonesOptions = [
  {
    type: 'Upright Headstone',
    material: 'Marble or Granite',
    dimensions: '42" high x 13" wide x 4" thick',
    inscription: 'Name, branch of service, dates, emblem of belief, personal inscription',
    use: 'Standard option for in-ground burial',
  },
  {
    type: 'Flat Marker (Bronze)',
    material: 'Bronze with granite base',
    dimensions: '24" long x 12" wide',
    inscription: 'Same inscription options as headstone',
    use: 'Required by some private cemeteries',
  },
  {
    type: 'Flat Marker (Granite/Marble)',
    material: 'Granite or Marble',
    dimensions: '24" long x 12" wide x 4" thick',
    inscription: 'Same inscription options as headstone',
    use: 'Alternative to bronze for private cemeteries',
  },
  {
    type: 'Niche Marker',
    material: 'Bronze',
    dimensions: '8.5" long x 5.5" wide',
    inscription: 'Abbreviated inscription for columbarium',
    use: 'For cremated remains in columbarium',
  },
  {
    type: 'Medallion',
    material: 'Bronze',
    dimensions: '6.8" diameter (large)',
    inscription: 'Branch of service emblem',
    use: 'Affixed to existing private headstone',
  },
];

const nationalCemeteryStats = [
  { label: 'National Cemeteries', value: '155', description: 'Operated by VA\'s National Cemetery Administration' },
  { label: 'Veterans Interred', value: '4+ Million', description: 'Resting in national cemeteries nationwide' },
  { label: 'Annual Burials', value: '140,000+', description: 'New interments each year' },
  { label: 'States Covered', value: '42', description: 'Plus Puerto Rico and territories' },
];

const applicationSteps = [
  {
    step: 1,
    title: 'Gather Required Documents',
    description: 'Collect DD214 (discharge papers), death certificate, and veteran\'s service records. Marriage and birth certificates may be needed for dependents.',
  },
  {
    step: 2,
    title: 'Contact a National Cemetery',
    description: 'Call the national cemetery of your choice or contact the National Cemetery Scheduling Office at 1-800-535-1117.',
  },
  {
    step: 3,
    title: 'Complete Required Forms',
    description: 'Submit VA Form 40-10007 (Application for Pre-Need Eligibility Determination) for pre-planning or at time of need.',
  },
  {
    step: 4,
    title: 'Arrange with Funeral Home',
    description: 'Your funeral director can coordinate with the national cemetery for scheduling and military funeral honors.',
  },
  {
    step: 5,
    title: 'Request Headstone/Marker',
    description: 'Submit VA Form 40-1330 to request a government-provided headstone, marker, or medallion.',
  },
];

const faqs = [
  {
    question: 'Who is eligible for burial in a national cemetery?',
    answer: 'Eligibility for burial in a VA national cemetery includes: veterans and service members who died on active duty; retired military personnel; veterans with any discharge other than dishonorable; members of Reserve and National Guard with 20+ years of service; and eligible spouses and dependent children. Some National Guard and Reserve members may qualify based on specific service conditions. Visit va.gov or call 1-800-827-1000 to verify eligibility.',
  },
  {
    question: 'How much do VA burial benefits cover?',
    answer: 'VA provides no-cost burial in national cemeteries, including the gravesite, opening/closing of grave, perpetual care, headstone, grave liner, and setting of the marker. For veterans buried in private cemeteries, VA provides a free headstone or marker. Burial allowances for service-connected deaths are up to $2,000, and for non-service-connected deaths of veterans receiving VA pension, up to $948 for burial and $948 for plot. Transportation allowances may also apply.',
  },
  {
    question: 'What is the difference between national and state veterans cemeteries?',
    answer: 'National cemeteries are operated by the VA\'s National Cemetery Administration (NCA) and follow uniform standards nationwide. State veterans cemeteries are operated by individual states with VA grants but may have different eligibility requirements, often including state residency. Both provide similar benefits including free burial and markers. Some states offer expanded eligibility for spouses and dependents. Check your state\'s veterans affairs office for specific policies.',
  },
  {
    question: 'Can my spouse be buried with me in a national cemetery?',
    answer: 'Yes, eligible spouses and dependent children can be buried in the same gravesite as the veteran. The spouse\'s name and dates will be inscribed on the reverse of the veteran\'s headstone, or on a combined marker. Surviving spouses and dependents may be buried in a national cemetery even after the veteran, space permitting. Eligibility extends to surviving spouses who remarried after age 57.',
  },
  {
    question: 'How do I get a military funeral with honors?',
    answer: 'Military funeral honors are provided at no cost to eligible veterans. The Department of Defense requires at minimum two uniformed service members to fold and present the flag and play Taps. Additional honors like a rifle salute and full honor guard are based on availability. Request honors through your funeral director, who coordinates with local military units or veteran service organizations. Active duty personnel may receive full military honors.',
  },
  {
    question: 'What emblems of belief are available for headstones?',
    answer: 'VA provides over 70 emblems of belief that can be engraved on government headstones and markers. These include major religious symbols (Christian cross, Star of David, Islamic crescent, etc.), symbols for atheists and humanists, and various denominational emblems. If a deceased veteran\'s emblem is not available, families can apply to add a new emblem. The emblem request is made on the headstone application form.',
  },
  {
    question: 'Can veterans be cremated and still receive full benefits?',
    answer: 'Yes, cremated remains are eligible for all the same burial benefits as casketed remains. Cremated remains can be buried in a national cemetery plot, placed in a columbarium niche, or scattered in designated areas at some national cemeteries. VA provides appropriately-sized markers for cremated remains. Families choosing to scatter remains can still receive a memorial marker in a national cemetery.',
  },
  {
    question: 'Is Arlington National Cemetery different from other national cemeteries?',
    answer: 'Arlington National Cemetery is operated by the U.S. Army rather than the VA and has more restrictive eligibility requirements due to limited space. Eligibility includes service members who died on active duty, retired military with 20+ years or disability, recipients of major decorations for valor, and former POWs. Some high-ranking officials may also qualify. Arlington maintains waiting lists and may have different scheduling procedures than VA national cemeteries.',
  },
  {
    question: 'How far in advance can I pre-plan burial in a national cemetery?',
    answer: 'Veterans can submit VA Form 40-10007 (Pre-Need Eligibility Determination) at any time to confirm eligibility for national cemetery burial. This pre-planning step provides a letter confirming eligibility, which speeds the process at time of need. However, specific gravesite assignments cannot be made in advance - gravesites are assigned at time of need based on availability. Pre-need applications are valid until the veteran\'s status changes.',
  },
  {
    question: 'What if I was dishonorably discharged?',
    answer: 'Veterans with dishonorable discharges are generally not eligible for VA burial benefits. However, those with other-than-honorable (OTH) discharges may request a Character of Discharge review from VA. In some cases, courts martial or administrative separations for homosexuality prior to 2011 may be reconsidered. Veterans should contact VA at 1-800-827-1000 to discuss their specific situation and potential upgrade options.',
  },
];

const stateCemeteryProgram = [
  {
    title: 'Federal Grants',
    description: 'VA provides grants to states for establishing, expanding, and improving veterans cemeteries. Grants can cover up to 100% of construction costs.',
  },
  {
    title: 'State Operation',
    description: 'States operate and maintain the cemeteries, following VA standards. Some states offer expanded eligibility including state residency requirements.',
  },
  {
    title: 'Combined Benefits',
    description: 'Veterans buried in state cemeteries can receive the same headstone and burial flag benefits as national cemeteries.',
  },
  {
    title: 'Local Access',
    description: 'State cemeteries provide options in areas without nearby national cemeteries, improving access for rural veterans.',
  },
];

export default function VeteransGuidePage() {
  // JSON-LD structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Veterans & National Cemeteries: Complete Burial Benefits Guide',
    description: 'Comprehensive guide to VA burial benefits, national cemetery eligibility, headstone options, and application procedures for veterans and their families.',
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
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.cemeterynearbyme.com/guide/veterans',
    },
    about: [
      { '@type': 'Thing', name: 'Veterans benefits' },
      { '@type': 'Thing', name: 'National cemeteries' },
      { '@type': 'Thing', name: 'Military burial' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
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
        name: 'Guide',
        item: 'https://www.cemeterynearbyme.com/guide',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Veterans Cemeteries',
        item: 'https://www.cemeterynearbyme.com/guide/veterans',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guide</Link></li>
                <li>/</li>
                <li className="text-white">Veterans Cemeteries</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-gold-400" />
              <span className="text-gold-400 font-medium">Pillar Guide</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
              Veterans &amp; National Cemeteries: Complete Guide
            </h1>
            <p className="text-white/80 text-lg max-w-3xl mb-6">
              A comprehensive resource for understanding VA burial benefits, national and state veterans cemeteries,
              eligibility requirements, and how to honor America&apos;s heroes with the dignity they deserve.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                {SITE_STATS.nationalCemeteriesCount + SITE_STATS.veteransCemeteriesCount}+ military cemeteries
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {SITE_STATS.veteransInterred} veterans honored
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Official VA.gov source
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The United States honors its military veterans with comprehensive burial benefits administered by
                the Department of Veterans Affairs (VA). These benefits recognize the service and sacrifice of
                those who served in our nation&apos;s armed forces, providing dignified final resting places and
                meaningful memorialization at no cost to eligible veterans and their families.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re a veteran planning ahead, a family member making arrangements, or simply want to
                understand the benefits earned through military service, this guide covers everything you need to know
                about national cemeteries, burial benefits, eligibility requirements, and the application process.
              </p>
            </div>

            <LeaderboardAd />

            {/* National Cemetery Statistics */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">National Cemetery Administration</h2>
              <p className="text-muted-foreground mb-8">
                The National Cemetery Administration (NCA) is part of the U.S. Department of Veterans Affairs.
                Established in 1862 under President Lincoln, the national cemetery system has grown to honor
                millions of American veterans.
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {nationalCemeteryStats.map((stat) => (
                  <Card key={stat.label} className="text-center p-6">
                    <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
                    <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <div className="flex items-start gap-4">
                  <Star className="w-8 h-8 text-accent shrink-0" />
                  <div>
                    <h3 className="font-serif font-semibold text-lg mb-2">NCA Mission Statement</h3>
                    <p className="text-muted-foreground italic">
                      &quot;To honor Veterans and their families with final resting places in national shrines and
                      with lasting tributes that commemorate their service and sacrifice to our Nation.&quot;
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Source: <a href="https://www.va.gov/about_va/nca.asp" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">VA.gov National Cemetery Administration</a>
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <InlineAd />

            {/* Burial Benefits */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">VA Burial Benefits for Veterans</h2>
              <p className="text-muted-foreground mb-8">
                Veterans who served honorably are entitled to a range of burial benefits. These benefits are
                designed to honor service while easing the financial and logistical burden on families.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {burialBenefits.map((benefit) => (
                  <Card key={benefit.title} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                            {benefit.cost}
                          </span>
                          <span className="text-xs bg-secondary px-2 py-1 rounded">
                            {benefit.eligibility}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Eligibility Section */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Eligibility Requirements</h2>
              <p className="text-muted-foreground mb-8">
                Not all individuals who served in the military automatically qualify for VA burial benefits.
                Understanding eligibility is the first step in planning. The VA uses the character of discharge
                and length of service to determine eligibility.
              </p>

              <div className="space-y-6">
                {eligibilityGroups.map((group) => (
                  <Card key={group.group} className="p-6">
                    <h3 className="font-serif font-semibold text-lg mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {group.group}
                    </h3>
                    <ul className="space-y-2">
                      {group.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="text-accent mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>

              <Card className="p-6 mt-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Ineligible for Benefits</h3>
                    <p className="text-sm text-muted-foreground">
                      Those with dishonorable discharges, convicted of certain crimes, or discharged for
                      desertion are generally not eligible. However, character of discharge can sometimes
                      be upgraded through VA review. Contact VA at 1-800-827-1000 for guidance.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <InlineAd />

            {/* Headstone and Marker Options */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Headstones, Markers, and Medallions</h2>
              <p className="text-muted-foreground mb-8">
                The VA provides headstones, markers, or medallions at no cost to mark the graves of eligible veterans.
                These memorials are available for graves in national, state, private, or tribal cemeteries anywhere in the world.
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Type</th>
                      <th className="text-left p-4 font-semibold">Material</th>
                      <th className="text-left p-4 font-semibold">Dimensions</th>
                      <th className="text-left p-4 font-semibold">Common Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headstonesOptions.map((option) => (
                      <tr key={option.type} className="border-b">
                        <td className="p-4 font-medium">{option.type}</td>
                        <td className="p-4 text-muted-foreground text-sm">{option.material}</td>
                        <td className="p-4 text-muted-foreground text-sm">{option.dimensions}</td>
                        <td className="p-4 text-muted-foreground text-sm">{option.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Card className="p-6">
                <h3 className="font-serif font-semibold text-lg mb-4">What&apos;s Included on a Veteran Headstone?</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Mandatory Information</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Full legal name</li>
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Branch of service</li>
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Year of birth and death</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Optional Inscriptions</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Full dates of birth/death</li>
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Highest rank attained</li>
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Awards and decorations</li>
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> War service (e.g., WWII, Korea)</li>
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Emblem of belief (70+ options)</li>
                      <li className="flex items-center gap-2"><span className="text-accent">•</span> Personal epitaph</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            {/* State Veterans Cemeteries */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">State Veterans Cemeteries</h2>
              <p className="text-muted-foreground mb-8">
                In addition to national cemeteries, the VA supports state-operated veterans cemeteries through the
                Veterans Cemetery Grants Program (VCGP). These cemeteries extend burial options to areas not served
                by national cemeteries.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {stateCemeteryProgram.map((item) => (
                  <Card key={item.title} className="p-5 border-l-4 border-l-accent">
                    <h3 className="font-serif font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/type/national-cemetery"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Find National Cemeteries
                </Link>
                <Link
                  href="/type/veterans-cemetery"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Find State Veterans Cemeteries
                </Link>
              </div>
            </section>

            <InlineAd />

            {/* How to Apply */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">How to Apply for Burial Benefits</h2>
              <p className="text-muted-foreground mb-8">
                Applying for VA burial benefits can be done before death (pre-need) or at the time of need.
                Pre-planning is encouraged to reduce stress on families during difficult times.
              </p>

              <div className="space-y-4 mb-8">
                {applicationSteps.map((step) => (
                  <Card key={step.step} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center shrink-0 font-bold">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <h3 className="font-serif font-semibold text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-accent" />
                  Key Contact Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-medium text-sm">National Cemetery Scheduling Office</p>
                    <p className="text-accent text-lg font-bold">1-800-535-1117</p>
                    <p className="text-xs text-muted-foreground">Available 24/7 for at-need scheduling</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">VA Benefits Hotline</p>
                    <p className="text-accent text-lg font-bold">1-800-827-1000</p>
                    <p className="text-xs text-muted-foreground">Eligibility and benefits questions</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Online Resources:</strong> Visit{' '}
                    <a href="https://www.va.gov/burials-memorials/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      va.gov/burials-memorials
                    </a>{' '}
                    for forms, cemetery locator, and detailed eligibility information.
                  </p>
                </div>
              </Card>
            </section>

            {/* Military Funeral Honors */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Military Funeral Honors</h2>
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-muted-foreground">
                  Every eligible veteran is entitled to military funeral honors at no cost. The rendering of
                  Military Funeral Honors is a way to show the nation&apos;s deep gratitude to those who, in times
                  of war and peace, have faithfully defended our country.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <Card className="p-6">
                  <h3 className="font-serif font-semibold mb-4">Minimum Honors (Required)</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Two-person uniformed detail
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Ceremonial folding of the flag
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Presentation of flag to next of kin
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Playing of Taps (live or recorded)
                    </li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-serif font-semibold mb-4">Full Honors (When Available)</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gold-600" />
                      Firing party (rifle salute)
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gold-600" />
                      Honor guard/pallbearers
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gold-600" />
                      Bugler playing live Taps
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gold-600" />
                      Color guard with flags
                    </li>
                  </ul>
                </Card>
              </div>

              <p className="text-muted-foreground">
                Requests for military funeral honors are typically coordinated by the funeral home. Families
                should inform the funeral director that they want military honors, providing the veteran&apos;s
                DD214 or other proof of service. Active duty service members generally receive full military honors.
              </p>
            </section>

            <InlineAd />

            {/* FAQ Section */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-left font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Additional Resources */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">Additional Resources</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Official VA Forms</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>VA Form 40-10007 - Pre-Need Eligibility</li>
                        <li>VA Form 40-1330 - Headstone/Marker Request</li>
                        <li>SF-180 - Request Military Records</li>
                      </ul>
                      <a href="https://www.va.gov/vaforms/" target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline mt-2 inline-block">
                        Download forms at VA.gov
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Veteran Service Organizations</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>American Legion</li>
                        <li>Veterans of Foreign Wars (VFW)</li>
                        <li>Disabled American Veterans (DAV)</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        VSOs can assist with claims and paperwork
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Survivor Assistance</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Casualty Assistance Officers can help surviving families navigate benefits and burial arrangements.
                      </p>
                      <p className="text-sm text-accent font-medium">
                        Military OneSource: 1-800-342-9647
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Find a Cemetery</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use our database to find national and state veterans cemeteries near you.
                      </p>
                      <Link href="/search" className="text-accent text-sm hover:underline">
                        Search {SITE_STATS.totalCemeteriesDisplay}+ cemeteries →
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <Card className="p-8 bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                <h2 className="font-serif text-2xl font-bold mb-4">
                  Find Veterans Cemeteries Near You
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Search our database of national and state veterans cemeteries.
                  Honor those who served with a dignified final resting place.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/type/national-cemetery"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Flag className="w-5 h-5" />
                    National Cemeteries
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/type/veterans-cemetery"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    <Medal className="w-5 h-5" />
                    State Veterans Cemeteries
                  </Link>
                </div>
              </Card>
            </section>

            {/* Author Attribution */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>About this guide:</strong> This veterans burial benefits guide is maintained by the
                Cemetery Near Me editorial team using information from official VA sources (va.gov).
                We strive to provide accurate and helpful information for veterans and their families.
                Always verify current eligibility and benefits directly with the VA.
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
