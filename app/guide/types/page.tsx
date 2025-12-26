import { Metadata } from 'next';
import Link from 'next/link';
import {
  Flag,
  Trees,
  Building2,
  Cross,
  Star,
  Heart,
  ChevronRight,
  MapPin,
  Users,
  Leaf,
  History,
  Church,
  Shield,
  PawPrint,
  Flame,
  Building,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SITE_STATS } from '@/lib/stats-config';
import cemeteryTypesData from '@/data/cemetery-types.json';

const publishDate = '2025-12-26';

export const metadata: Metadata = {
  title: 'Complete Guide to Cemetery Types in America | CemeteryNearMe.com',
  description: 'Comprehensive guide to 33 types of cemeteries in the United States. Learn about national cemeteries, memorial parks, natural burial grounds, religious cemeteries, and more.',
  keywords: ['cemetery types', 'types of cemeteries', 'burial grounds', 'memorial parks', 'national cemeteries', 'green burial', 'religious cemeteries'],
  openGraph: {
    title: 'Complete Guide to Cemetery Types in America',
    description: 'Discover the different types of cemeteries across the United States - from national veterans cemeteries to eco-friendly green burial grounds.',
    type: 'article',
    publishedTime: publishDate,
    authors: ['Cemetery Near Me Editorial Team'],
  },
  alternates: {
    canonical: 'https://www.cemeterynearbyme.com/guide/types',
  },
};

// Sub-pillar pages for the grid
const subPillarPages = [
  {
    title: 'National & Veterans Cemeteries',
    description: 'Honoring those who served our nation with dedicated burial grounds',
    href: '/type/national-cemetery',
    icon: Flag,
    color: 'bg-forest-100 text-forest-700',
    count: SITE_STATS.nationalCemeteriesCount,
  },
  {
    title: 'Natural Burial Grounds',
    description: 'Eco-friendly burial options in serene natural settings',
    href: '/type/natural-burial',
    icon: Leaf,
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'Memorial Parks',
    description: 'Beautifully landscaped grounds with park-like settings',
    href: '/type/memorial-park',
    icon: Building2,
    color: 'bg-gold-100 text-gold-700',
  },
  {
    title: 'Religious Cemeteries',
    description: 'Catholic, Jewish, Muslim, and other faith-based burial grounds',
    href: '/type/catholic-cemetery',
    icon: Cross,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'Historic Cemeteries',
    description: 'Pioneer and colonial burial grounds preserving American history',
    href: '/type/historic-cemetery',
    icon: History,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Pet Cemeteries',
    description: 'Dedicated resting places for beloved companion animals',
    href: '/type/pet-cemetery',
    icon: PawPrint,
    color: 'bg-rose-100 text-rose-700',
  },
  {
    title: 'Crematoriums & Columbariums',
    description: 'Facilities for cremation services and ash interment',
    href: '/type/crematorium',
    icon: Flame,
    color: 'bg-slate-100 text-slate-700',
  },
];

// FAQ items for this page
const faqItems = [
  {
    question: 'What is the difference between a cemetery and a memorial park?',
    answer: 'A traditional cemetery typically features upright headstones, monuments, and mausoleums of varying sizes and styles. Memorial parks, in contrast, use flat bronze or granite markers at ground level, creating a lawn-like appearance. Memorial parks were popularized in the early 20th century and are designed to look more like peaceful gardens than traditional burial grounds.',
  },
  {
    question: 'Who can be buried in a national cemetery?',
    answer: 'National cemeteries are reserved for veterans who served on active duty and were discharged under conditions other than dishonorable, members of the Armed Forces who die on active duty, spouses and dependent children of eligible veterans, and certain other groups as determined by the Department of Veterans Affairs. Burial benefits include a gravesite, headstone or marker, and perpetual care at no cost.',
  },
  {
    question: 'What is a green or natural burial?',
    answer: 'Green or natural burial is an environmentally conscious approach that allows the body to decompose naturally. It typically involves no embalming (or only non-toxic embalming), biodegradable caskets or shrouds, and no concrete burial vaults. Natural burial grounds often double as conservation areas, helping preserve natural habitats and ecosystems.',
  },
  {
    question: 'Are religious cemeteries only for members of that faith?',
    answer: 'Policies vary by cemetery. Many Catholic, Jewish, and Muslim cemeteries require the deceased to be a member of that faith. However, some religious cemeteries have sections designated for non-members or mixed-faith families. It is best to contact the specific cemetery directly to understand their requirements.',
  },
  {
    question: 'What is a columbarium?',
    answer: 'A columbarium is a structure designed to hold cremated remains (ashes) in individual compartments called niches. These can be indoor or outdoor structures and are often found in cemeteries, churches, and memorial parks. Columbariums offer a permanent, dignified resting place for cremated remains as an alternative to scattering or home storage.',
  },
  {
    question: 'Can I be buried on private property?',
    answer: 'Laws regarding home burial vary significantly by state and local jurisdiction. Some states allow burial on private property with proper permits and documentation, while others have more restrictive regulations. Requirements may include minimum acreage, setbacks from property lines and water sources, and proper recording of the burial site in property records.',
  },
  {
    question: 'What are perpetual care fees at cemeteries?',
    answer: 'Perpetual care (also called endowment care) is a one-time fee paid at the time of plot purchase that funds the ongoing maintenance of the cemetery grounds indefinitely. This includes lawn care, road maintenance, and general upkeep. Not all cemeteries offer perpetual care, so it is important to ask about maintenance policies before purchasing a plot.',
  },
];

export default function CemeteryTypesGuidePage() {
  // JSON-LD structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Complete Guide to Cemetery Types in America',
    description: 'Comprehensive guide to 33 types of cemeteries in the United States, including national cemeteries, memorial parks, natural burial grounds, and religious cemeteries.',
    image: 'https://www.cemeterynearbyme.com/images/cemetery-types-guide.jpg',
    author: {
      '@type': 'Organization',
      name: 'Cemetery Near Me Editorial Team',
      url: 'https://www.cemeterynearbyme.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cemetery Near Me',
      url: 'https://www.cemeterynearbyme.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cemeterynearbyme.com/logo.png',
      },
    },
    datePublished: publishDate,
    dateModified: publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.cemeterynearbyme.com/guide/types',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
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
        name: 'Cemetery Types',
        item: 'https://www.cemeterynearbyme.com/guide/types',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Scripts */}
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/guide" className="hover:text-white transition-colors">Guide</Link></li>
              <li>/</li>
              <li className="text-white">Cemetery Types</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Complete Guide to Cemetery Types in America
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-8">
            Understanding the different types of burial grounds helps families make informed decisions
            during difficult times. This comprehensive guide covers all {cemeteryTypesData.types.length} cemetery
            types found across the United States.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>{SITE_STATS.totalCemeteriesDisplay}+ Cemeteries Listed</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Building className="w-4 h-4" />
              <span>{cemeteryTypesData.types.length} Cemetery Types</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Users className="w-4 h-4" />
              <span>All 50 States + DC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-xl text-muted-foreground leading-relaxed">
              When planning for end-of-life arrangements or researching family history, understanding the
              various types of cemeteries available can be invaluable. The United States is home to an
              estimated 144,000 cemeteries, ranging from sprawling national cemeteries honoring military
              veterans to small family plots on rural farmland. Each type serves different needs,
              traditions, and preferences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This guide explores the major categories of cemeteries you will encounter across America,
              helping you understand what distinguishes each type, who they serve, and what to expect
              when visiting or purchasing burial rights. Whether you are pre-planning your own arrangements,
              helping a loved one, or conducting genealogical research, this information will help you
              navigate the landscape of American burial grounds.
            </p>
          </section>

          {/* Public vs Private Cemeteries */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center">
                <Building className="w-5 h-5 text-forest-700" />
              </div>
              Public vs Private Cemeteries
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The fundamental distinction in cemetery types is between public and private ownership. This
              classification affects everything from pricing and availability to rules and regulations
              governing the burial ground.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Public Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              Public cemeteries are owned and operated by government entities at the federal, state, county,
              or municipal level. <Link href="/type/municipal-cemetery" className="text-accent hover:underline">Municipal cemeteries</Link> are
              managed by city or town governments and typically serve all residents regardless of religious
              affiliation. These cemeteries often offer the most affordable burial options, though residency
              requirements may apply.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/county-cemetery" className="text-accent hover:underline">County cemeteries</Link> serve
              larger geographic areas and may include historical potters fields where indigent individuals
              were buried at public expense. Many county cemeteries date back to the 19th century and
              contain valuable historical records.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Private Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              Private cemeteries are owned by corporations, religious organizations, fraternal groups, or
              families. Corporate-owned cemeteries, often called <Link href="/type/memorial-park" className="text-accent hover:underline">memorial parks</Link>,
              are typically for-profit businesses that offer comprehensive services including burial, cremation,
              memorialization, and sometimes funeral homes on-site.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Religious cemeteries are owned by churches, synagogues, mosques, or dioceses and may have
              specific requirements for burial. <Link href="/type/family-cemetery" className="text-accent hover:underline">Family cemeteries</Link> are
              private burial grounds on personal property, often found in rural areas and containing
              generations of family members.
            </p>
          </section>

          {/* National & Veterans Cemeteries */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center">
                <Flag className="w-5 h-5 text-forest-700" />
              </div>
              National & Veterans Cemeteries
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/national-cemetery" className="text-accent hover:underline">National cemeteries</Link> represent
              the highest honor the nation can bestow upon those who served in the Armed Forces. The
              National Cemetery Administration (NCA), part of the Department of Veterans Affairs,
              maintains 155 national cemeteries across 42 states and Puerto Rico, with more than
              {SITE_STATS.veteransInterred} veterans and their eligible family members interred.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The most famous national cemetery is Arlington National Cemetery in Virginia, which is
              operated by the U.S. Army rather than the VA. Arlington is the final resting place for
              more than 400,000 individuals, including Presidents John F. Kennedy and William Howard Taft,
              as well as service members from every American conflict since the Civil War.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Eligibility for National Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              Eligibility for burial in a national cemetery extends to veterans who served on active duty
              and received honorable or general discharges, members of the Armed Forces who die on active
              duty, spouses and dependent children of eligible veterans, and certain Reserve and National
              Guard members. The VA provides burial benefits at no cost, including a gravesite, opening
              and closing of the grave, perpetual care, a government headstone or marker, and a burial flag.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For more information about eligibility and available benefits, visit the official{' '}
              <a
                href="https://www.va.gov/burials-memorials/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                VA Burials and Memorials
              </a>{' '}
              website.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">State Veterans Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              In addition to national cemeteries, many states operate <Link href="/type/veterans-cemetery" className="text-accent hover:underline">state veterans cemeteries</Link> with
              VA grants. These cemeteries follow similar guidelines and provide comparable benefits to
              national cemeteries. State veterans cemeteries may have additional eligibility requirements,
              such as state residency, but often have more availability than national cemeteries in
              densely populated areas.
            </p>
          </section>

          {/* Religious Cemeteries */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Cross className="w-5 h-5 text-purple-700" />
              </div>
              Religious Cemeteries
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Religious cemeteries serve specific faith communities and follow the burial traditions and
              requirements of their respective religions. These sacred grounds provide a final resting
              place where the deceased can be surrounded by fellow believers and where religious customs
              can be properly observed.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Jewish Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/jewish-cemetery" className="text-accent hover:underline">Jewish cemeteries</Link> follow
              halacha (Jewish law) in burial practices. Traditional Jewish burial requires interment
              as soon as possible after death, simple wooden caskets that allow natural decomposition,
              and no embalming or cremation in Orthodox communities. Jewish cemeteries are considered
              sacred ground (beit olam, meaning house of eternity) and graves are never reused.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Many Jewish cemeteries are operated by individual synagogues or Jewish community organizations.
              Some have sections designated for different denominations (Orthodox, Conservative, Reform)
              with varying levels of adherence to traditional practices.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Muslim Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/muslim-cemetery" className="text-accent hover:underline">Muslim cemeteries</Link> or
              Muslim sections within larger cemeteries follow Islamic burial requirements. Bodies are
              buried facing Mecca (qibla), typically without a casket or in a simple shroud. Islamic
              tradition requires burial as soon as possible, ideally within 24 hours of death, and
              prohibits cremation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Many communities have established dedicated Muslim cemeteries or worked with existing
              cemeteries to create sections that accommodate Islamic burial requirements. These sections
              are oriented so that the deceased face Mecca when lying on their right side.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Catholic Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/catholic-cemetery" className="text-accent hover:underline">Catholic cemeteries</Link> are
              blessed grounds operated by parishes, dioceses, or Catholic organizations. The Catholic
              Church views cemeteries as sacred spaces and traditionally required that only Catholics
              be buried in consecrated ground. While policies have become more flexible in recent
              decades, many Catholic cemeteries still give priority to parishioners.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Catholic Church permits cremation as long as the ashes are interred in a cemetery,
              columbarium, or mausoleum rather than scattered or kept at home. Catholic cemeteries
              often feature religious imagery, crucifixes, and statuary throughout the grounds.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Other Christian Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              Various Protestant denominations operate their own cemeteries, including{' '}
              <Link href="/type/baptist-cemetery" className="text-accent hover:underline">Baptist</Link>,{' '}
              <Link href="/type/methodist-cemetery" className="text-accent hover:underline">Methodist</Link>,{' '}
              <Link href="/type/lutheran-cemetery" className="text-accent hover:underline">Lutheran</Link>,{' '}
              <Link href="/type/presbyterian-cemetery" className="text-accent hover:underline">Presbyterian</Link>, and{' '}
              <Link href="/type/episcopal-cemetery" className="text-accent hover:underline">Episcopal</Link> cemeteries.
              These are typically associated with specific congregations and may be located adjacent to
              or surrounding the church building. <Link href="/type/orthodox-cemetery" className="text-accent hover:underline">Orthodox Christian cemeteries</Link> serve
              Greek Orthodox, Russian Orthodox, and other Eastern Orthodox communities with their
              distinct burial traditions.
            </p>
          </section>

          {/* Memorial Parks vs Traditional Cemeteries */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gold-700" />
              </div>
              Memorial Parks vs Traditional Cemeteries
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/memorial-park" className="text-accent hover:underline">Memorial parks</Link> emerged
              in the early 20th century as an alternative to traditional cemeteries with their upright
              monuments and varied headstones. The memorial park concept was pioneered by Hubert Eaton
              at Forest Lawn Memorial Park in Glendale, California, in 1917. His vision was to create
              a place that celebrated life rather than mourned death.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The defining characteristic of memorial parks is the use of flat bronze or granite markers
              set flush with the ground. This creates a lawn-like appearance and makes maintenance easier,
              as groundskeepers can mow directly over the markers. Memorial parks typically prohibit
              traditional upright headstones, maintaining a uniform aesthetic throughout the grounds.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Traditional cemeteries, by contrast, allow and often encourage upright monuments, elaborate
              headstones, family mausoleums, and other personalized memorials. Many people prefer this
              variety and the ability to create a distinctive marker for their loved ones. Traditional
              cemeteries also tend to have more historical character, with monuments dating back centuries
              in some cases.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/garden-cemetery" className="text-accent hover:underline">Garden cemeteries</Link> represent
              a middle ground, featuring the landscaped beauty of memorial parks while allowing varied
              monument styles. The garden cemetery movement began in the 1830s with Mount Auburn Cemetery
              in Cambridge, Massachusetts, which was designed as a scenic landscape for the living as
              much as a burial ground for the dead.
            </p>
          </section>

          {/* Natural/Green Burial Grounds */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-700" />
              </div>
              Natural and Green Burial Grounds
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/natural-burial" className="text-accent hover:underline">Natural burial grounds</Link> and{' '}
              <Link href="/type/green-cemetery" className="text-accent hover:underline">green cemeteries</Link> represent
              a growing movement toward environmentally conscious burial practices. These sites prioritize
              sustainability and the natural decomposition of the body, returning it to the earth with
              minimal environmental impact.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Green burial typically involves no embalming (or only with non-toxic, biodegradable fluids),
              biodegradable caskets made from materials like willow, bamboo, or untreated wood, or simple
              shrouds. Concrete burial vaults, which are required in many traditional cemeteries to prevent
              ground settling, are not used. Instead, the earth is allowed to settle naturally over time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Many natural burial grounds double as conservation areas, using burial fees to fund land
              preservation and ecological restoration. The Green Burial Council certifies cemeteries
              based on their environmental practices, with three levels of certification: Hybrid (which
              allows some conventional burial options), Natural (which requires fully natural burial),
              and Conservation (which must protect an area in perpetuity).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Grave markers in natural burial grounds are typically natural elements such as native
              plants, trees, or fieldstones rather than traditional headstones. Some sites use GPS
              coordinates to locate graves while maintaining an undisturbed natural appearance. The
              cost of green burial is often lower than conventional burial due to the elimination of
              embalming, caskets, and vaults.
            </p>
          </section>

          {/* Historic & Pioneer Cemeteries */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <History className="w-5 h-5 text-amber-700" />
              </div>
              Historic and Pioneer Cemeteries
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/historic-cemetery" className="text-accent hover:underline">Historic cemeteries</Link> serve
              as windows into America past, preserving not only the remains of previous generations but
              also the artistic, cultural, and social values of their times. Many are listed on the
              National Register of Historic Places and contain the graves of notable historical figures,
              from presidents and pioneers to artists and inventors.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/pioneer-cemetery" className="text-accent hover:underline">Pioneer cemeteries</Link> date
              to the earliest European settlement of various regions and often contain the remains of
              a communitys founding families. These sites are invaluable for genealogical research,
              as they may be the only record of early settlers who lived before comprehensive vital
              records were kept.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/civil-war-cemetery" className="text-accent hover:underline">Civil War cemeteries</Link> hold
              particular significance in American history. Both Union and Confederate cemeteries exist
              throughout the country, particularly in states where major battles were fought. These
              sites memorialize the more than 600,000 soldiers who died in the nations bloodiest conflict.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Preservation of historic cemeteries faces ongoing challenges, including vandalism, neglect,
              and development pressure. Many communities have formed cemetery preservation societies to
              maintain these irreplaceable cultural resources. Volunteers document headstones, restore
              monuments, and research the histories of those buried within.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-4">Cultural and Heritage Cemeteries</h3>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/african-american-cemetery" className="text-accent hover:underline">African American cemeteries</Link> preserve
              the burial traditions and histories of Black communities, from the era of slavery through
              the present day. Many historic African American cemeteries fell into neglect during the
              20th century but are now being restored and recognized for their cultural significance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/native-american-cemetery" className="text-accent hover:underline">Native American burial grounds</Link> are
              protected under federal law, including the Native American Graves Protection and Repatriation
              Act (NAGPRA). These sacred sites reflect diverse tribal traditions and are often maintained
              by tribal governments or cultural preservation organizations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/chinese-cemetery" className="text-accent hover:underline">Chinese cemeteries</Link> emerged
              in the 19th century to serve immigrant communities, particularly in California and other
              Western states. These cemeteries often feature traditional Chinese elements such as altars,
              incense burners, and feng shui-influenced layouts.
            </p>
          </section>

          {/* Pet Cemeteries */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-rose-700" />
              </div>
              Pet Cemeteries
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/pet-cemetery" className="text-accent hover:underline">Pet cemeteries</Link> provide
              dedicated burial grounds for beloved companion animals. The first known pet cemetery in
              the United States, the Hartsdale Pet Cemetery in New York, was established in 1896 and
              now contains over 80,000 interments. Today, there are approximately 600 pet cemeteries
              operating nationwide.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Pet cemeteries offer various memorialization options, including individual graves with
              headstones, cremation with niche interment, and communal burial areas. Many also offer
              services such as grief counseling, memorial ceremonies, and sympathy support for pet
              owners dealing with the loss of a companion animal.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Some states have begun allowing the burial of cremated pet remains with their owners in
              human cemeteries. New York was the first state to legalize this practice in 2016. However,
              policies vary widely, and many traditional cemeteries do not permit pet burials even with
              cremated remains.
            </p>
          </section>

          {/* Crematoriums & Columbariums */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-slate-700" />
              </div>
              Crematoriums and Columbariums
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              With cremation rates in the United States exceeding 57% as of 2023, <Link href="/type/crematorium" className="text-accent hover:underline">crematoriums</Link> and{' '}
              <Link href="/type/columbarium" className="text-accent hover:underline">columbariums</Link> have become
              increasingly important facilities. A crematorium is a facility where cremation takes place,
              while a columbarium is a structure containing niches for the storage of cremated remains.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/mausoleum" className="text-accent hover:underline">Mausoleums</Link> are above-ground
              structures containing crypts for whole-body entombment. While traditionally associated
              with wealthy families who built private mausoleums, community mausoleums now offer this
              option to anyone. Some mausoleums include both crypts for caskets and niches for cremated
              remains, providing multiple memorialization options in one structure.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cremation gardens are outdoor spaces designed specifically for the interment of cremated
              remains. These may include columbarium walls, ground burial sections for urns, scattering
              gardens, and memorial features such as benches, fountains, or statuary. Many cemeteries
              have added cremation gardens to accommodate changing preferences.
            </p>
          </section>

          {/* Fraternal and Community Cemeteries */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              Fraternal and Community Cemeteries
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/fraternal-cemetery" className="text-accent hover:underline">Fraternal cemeteries</Link> were
              established by organizations such as the <Link href="/type/masonic-cemetery" className="text-accent hover:underline">Freemasons</Link>,
              Odd Fellows, Elks, Knights of Columbus, and other fraternal orders. These cemeteries
              served members and their families, often providing burial benefits as part of fraternal
              membership. Many historic fraternal cemeteries feature distinctive symbols and iconography
              associated with their organizations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/community-cemetery" className="text-accent hover:underline">Community cemeteries</Link> serve
              specific neighborhoods or small towns without regard to religious affiliation. These are
              often among the oldest cemeteries in a region, established before municipal governments
              took on cemetery responsibilities. Many are maintained by volunteer cemetery associations
              or have been adopted by local historical societies.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <Link href="/type/sailors-cemetery" className="text-accent hover:underline">Sailors cemeteries</Link> and
              maritime burial grounds are found in coastal communities, honoring those who made their
              living from the sea. These cemeteries often contain monuments to those lost at sea, even
              if their remains were never recovered.
            </p>
          </section>

        </div>
      </article>

      {/* Sub-Pillar Grid */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Explore Cemetery Types
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dive deeper into specific cemetery categories with our detailed guides.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
            {subPillarPages.map((page) => (
              <Link key={page.href} href={page.href} className="group">
                <Card className="h-full hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl ${page.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <page.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="font-serif text-lg group-hover:text-accent transition-colors">
                      {page.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {page.description}
                    </p>
                    <span className="text-sm font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Cemetery Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              All {cemeteryTypesData.types.length} Cemetery Types
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete directory of cemetery types found across America.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-secondary/50 rounded-xl p-6">
            <div className="flex flex-wrap gap-2">
              {cemeteryTypesData.types.map((type) => (
                <Link
                  key={type.slug}
                  href={`/type/${type.slug}`}
                  className="px-3 py-2 bg-white rounded-lg text-sm hover:bg-accent hover:text-white transition-colors shadow-sm"
                >
                  {type.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              Frequently Asked Questions About Cemetery Types
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer px-6 py-4 hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-foreground pr-4">{item.question}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-6 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Find a Cemetery Near You
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Search our comprehensive database of {SITE_STATS.totalCemeteriesDisplay}+ cemeteries across all 50 states.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button variant="gold" size="lg" className="group">
                Search Cemeteries
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/type">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Browse by Type
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Author/Trust Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-forest-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">About This Guide</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  This comprehensive guide was researched and written by the Cemetery Near Me Editorial Team.
                  Our team includes researchers with backgrounds in funeral industry practices, genealogy,
                  and historic preservation. We are committed to providing accurate, helpful information
                  to assist families during their time of need.
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
