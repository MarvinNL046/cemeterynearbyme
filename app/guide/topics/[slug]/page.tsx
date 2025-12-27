import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, AlertCircle, DollarSign, Leaf, Heart, FileText, Users, Camera, Flower2, MapPin, Search, Database, Dna, Scale, Flame, TreeDeciduous, ClipboardList, Phone, Mail, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InlineAd from '@/components/ads/InlineAd';
import SidebarAd from '@/components/ads/SidebarAd';
import FeedbackForm from '@/components/FeedbackForm';
import topicGuidesData from '@/data/guides/topic-guides.json';

interface TopicGuide {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  author: string;
  datePublished: string;
  dateModified: string;
  readTime: string;
  keywords: string[];
  sections: { id: string; title: string; anchor: string }[];
  faqs: { question: string; answer: string }[];
  checklist?: string[];
  howToSteps?: { name: string; text: string }[];
}

const topicGuides: TopicGuide[] = topicGuidesData.topics;

function getTopicGuide(slug: string): TopicGuide | null {
  return topicGuides.find(guide => guide.slug === slug) || null;
}

export async function generateStaticParams() {
  return topicGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

// Revalidate pages every week (static guide content)
export const revalidate = 604800;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getTopicGuide(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  return {
    title: `${guide.title} | Cemetery Near Me`,
    description: guide.description,
    keywords: guide.keywords.join(', '),
    authors: [{ name: guide.author }],
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      authors: [guide.author],
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      siteName: 'Cemetery Near Me',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://www.cemeterynearbyme.com/guide/topics/${slug}`,
    },
  };
}

// Content components for each topic
function CemeteryEtiquetteContent() {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted-foreground">
      <p className="lead text-xl text-muted-foreground mb-8">
        Visiting a cemetery is a meaningful experience that connects us with those who have passed and our own mortality. Whether you're paying respects to a loved one, conducting genealogical research, or simply appreciating the historical significance of these sacred grounds, understanding proper cemetery etiquette ensures your visit is respectful and appropriate.
      </p>

      <h2 id="visiting-hours-and-rules" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Clock className="w-7 h-7 text-accent flex-shrink-0" />
        Visiting Hours and Rules
      </h2>
      <p>
        Most cemeteries maintain specific visiting hours, typically from dawn to dusk. These hours exist for security reasons and to ensure grounds maintenance can be performed. National cemeteries and some private memorial parks may have more structured hours, while rural or church cemeteries might have more flexible access.
      </p>
      <p>
        <strong>Before your visit, consider these guidelines:</strong>
      </p>
      <ul>
        <li><strong>Check posted hours:</strong> Look for signs at the entrance or contact the cemetery office. Many cemeteries close at sunset for safety reasons.</li>
        <li><strong>Respect holiday schedules:</strong> Cemeteries may have extended hours on Memorial Day, Veterans Day, and other significant dates, but offices may be closed.</li>
        <li><strong>Follow vehicle rules:</strong> Drive slowly (typically 10-15 mph), stay on designated roads, and park only in authorized areas. Never drive on the grass.</li>
        <li><strong>Observe quiet hours:</strong> Keep noise to a minimum, especially during early morning or evening hours when others may be visiting.</li>
        <li><strong>Leave gates as you found them:</strong> If you need to open a gate to enter, close it behind you unless directed otherwise.</li>
      </ul>
      <p>
        Some cemeteries require check-in at an office, especially for after-hours visits or access to locked sections. Always call ahead if you're planning a visit outside regular hours or need assistance locating a specific grave.
      </p>

      <h2 id="photography-guidelines" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Camera className="w-7 h-7 text-accent flex-shrink-0" />
        Photography Guidelines
      </h2>
      <p>
        Photography in cemeteries has become increasingly common, whether for genealogical documentation, artistic purposes, or personal memories. While most public cemeteries allow photography, sensitivity and respect must guide your approach.
      </p>
      <p>
        <strong>Acceptable photography practices:</strong>
      </p>
      <ul>
        <li><strong>Document family graves:</strong> Photographing ancestors' headstones for genealogy records is widely accepted and often encouraged.</li>
        <li><strong>Capture historical monuments:</strong> Many cemeteries contain historically significant markers and architecture worth documenting.</li>
        <li><strong>Respect personal moments:</strong> Never photograph mourners, funeral services, or obviously grieving visitors without explicit permission.</li>
        <li><strong>Avoid flash near others:</strong> If photographing near other visitors, use natural lighting to avoid disturbing their experience.</li>
        <li><strong>Commercial restrictions:</strong> Professional photography sessions, especially for commercial purposes, often require advance permission and possibly permits.</li>
      </ul>
      <p>
        When photographing headstones, consider the time of day. Early morning or late afternoon light often produces better results and reveals inscriptions more clearly. If you're documenting graves for FindAGrave or similar databases, take multiple angles and include any military markers or family monuments nearby.
      </p>
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-amber-800 dark:text-amber-200">Important Note:</strong>
            <p className="text-amber-700 dark:text-amber-300 mt-2 mb-0">
              Never photograph children visiting graves without parental permission, and avoid capturing images that could identify mourners at funeral services. When in doubt, ask permission or refrain from taking the photo.
            </p>
          </div>
        </div>
      </div>

      <h2 id="what-to-wear" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Users className="w-7 h-7 text-accent flex-shrink-0" />
        What to Wear
      </h2>
      <p>
        There is no strict dress code for casual cemetery visits, but dressing modestly shows respect for the sacred nature of the space and consideration for other visitors who may be mourning.
      </p>
      <p>
        <strong>General guidelines for cemetery attire:</strong>
      </p>
      <ul>
        <li><strong>Casual visits:</strong> Neat, modest clothing is appropriate. Avoid overly casual items like swimwear, revealing clothing, or shirts with offensive messages.</li>
        <li><strong>Funeral services:</strong> Traditional dark colors (black, navy, dark gray) remain customary, though many modern services welcome subdued colors. Follow family guidance if provided.</li>
        <li><strong>Practical considerations:</strong> Wear comfortable walking shoes suitable for grass and uneven terrain. Heels can sink into soft ground.</li>
        <li><strong>Weather preparedness:</strong> Bring appropriate outerwear for sun protection, rain, or cold. Cemeteries offer little shelter.</li>
        <li><strong>Religious customs:</strong> Some sections of cemeteries, particularly Jewish areas, may require head coverings. Bring a hat or scarf if you're unsure.</li>
      </ul>
      <p>
        When attending a specific service, consider asking the family about dress expectations. "Celebration of life" services may call for bright colors, while traditional funerals typically maintain formal, darker attire.
      </p>

      <h2 id="bringing-flowers-and-items" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Flower2 className="w-7 h-7 text-accent flex-shrink-0" />
        Bringing Flowers and Items
      </h2>
      <p>
        Leaving flowers and mementos at graves is a time-honored tradition across cultures. However, cemetery policies vary significantly regarding what items are permitted and for how long they may remain.
      </p>
      <p>
        <strong>Common policies and considerations:</strong>
      </p>
      <ul>
        <li><strong>Fresh flowers:</strong> Generally welcome but may be removed after wilting, typically within 1-2 weeks.</li>
        <li><strong>Artificial flowers:</strong> Some cemeteries restrict these to certain seasons or holidays; others prohibit them entirely.</li>
        <li><strong>Potted plants:</strong> Often allowed in designated containers or during specific seasons.</li>
        <li><strong>Personal items:</strong> Photos, small toys, flags, and religious items are often permitted but may be removed during grounds maintenance.</li>
        <li><strong>Food and drink:</strong> Some cultures traditionally leave food offerings; check cemetery policies as these may attract wildlife.</li>
        <li><strong>Holiday decorations:</strong> Many cemeteries have specific windows for holiday decorations, after which they're removed.</li>
      </ul>
      <p>
        Veteran graves often have small flags placed by cemetery staff or volunteer organizations, especially around Memorial Day and Veterans Day. It's considered disrespectful to move or remove these flags.
      </p>
      <div className="bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-forest-800 dark:text-forest-200">Best Practice:</strong>
            <p className="text-forest-700 dark:text-forest-300 mt-2 mb-0">
              Before bringing elaborate decorations or permanent items, contact the cemetery office to understand their specific policies. Items placed without permission may be removed and discarded during regular maintenance.
            </p>
          </div>
        </div>
      </div>

      <h2 id="gravestone-rubbing-etiquette" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <FileText className="w-7 h-7 text-accent flex-shrink-0" />
        Gravestone Rubbing Etiquette
      </h2>
      <p>
        Gravestone rubbing—creating an impression of inscriptions on paper—is a popular genealogical and artistic practice. However, it can damage fragile or weathered stones and is increasingly restricted in many cemeteries.
      </p>
      <p>
        <strong>Before attempting a gravestone rubbing:</strong>
      </p>
      <ul>
        <li><strong>Get permission:</strong> Always ask the cemetery office for permission before rubbing any stone. Many historic cemeteries now prohibit the practice entirely.</li>
        <li><strong>Assess the stone:</strong> Never rub stones that are flaking, crumbling, or show signs of deterioration. Even gentle pressure can cause further damage.</li>
        <li><strong>Use proper materials:</strong> If permitted, use only soft materials designed for gravestone rubbing—never wax crayons or hard pencils that can scratch.</li>
        <li><strong>Avoid cleaning solutions:</strong> Don't apply water, chemicals, or cleaning agents to make inscriptions more visible. These can cause long-term damage.</li>
        <li><strong>Consider alternatives:</strong> Digital photography, especially with angled lighting, often captures inscriptions better than rubbings without any risk of damage.</li>
      </ul>
      <p>
        Many genealogical organizations now discourage gravestone rubbing in favor of photography. If you need to enhance visibility of faded inscriptions, try photographing at different times of day when shadows naturally highlight the carving.
      </p>

      <h2 id="children-at-cemeteries" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Heart className="w-7 h-7 text-accent flex-shrink-0" />
        Children at Cemeteries
      </h2>
      <p>
        Bringing children to cemeteries can be a valuable educational experience and help them understand and process concepts of death and remembrance. With proper preparation and supervision, children can visit cemeteries respectfully.
      </p>
      <p>
        <strong>Guidelines for visiting with children:</strong>
      </p>
      <ul>
        <li><strong>Prepare them in advance:</strong> Explain where you're going and why. Discuss what they might see and what behavior is expected.</li>
        <li><strong>Keep close supervision:</strong> Children should not run, climb on monuments, or play among graves. Keep them on pathways when possible.</li>
        <li><strong>Answer questions honestly:</strong> Children often have questions about death and burial. Answer age-appropriately and honestly.</li>
        <li><strong>Involve them appropriately:</strong> Let them help place flowers, clean a family grave, or locate family names on headstones.</li>
        <li><strong>Know when to leave:</strong> If children become restless or disruptive, it's better to leave early and return another time than to disturb other visitors.</li>
        <li><strong>Respect others' grief:</strong> Keep distance from obviously mourning individuals or active funeral services.</li>
      </ul>
      <p>
        Teaching children about cemetery etiquette instills respect for the deceased and for those who are grieving. Many families find that regular visits to family graves help children maintain connections with ancestors and understand their family history.
      </p>

      <h2 className="text-2xl mt-12 mb-6">Additional Etiquette Considerations</h2>
      <p>
        Beyond the major topics covered above, several other etiquette points deserve attention:
      </p>
      <ul>
        <li><strong>Cell phones:</strong> Silence your phone and avoid loud conversations. Step away to take calls if necessary.</li>
        <li><strong>Pets:</strong> Many cemeteries allow leashed pets in common areas but not near active services. Always clean up after your pet.</li>
        <li><strong>Smoking and alcohol:</strong> Generally prohibited in cemeteries. Respect any posted rules.</li>
        <li><strong>Touching monuments:</strong> Avoid leaning on or touching headstones, which can cause damage over time. Never sit on graves or monuments.</li>
        <li><strong>Littering:</strong> Take all trash with you. Don't leave food wrappers, water bottles, or dead flowers scattered.</li>
        <li><strong>Other visitors:</strong> Give other visitors privacy and space. If you need to pass near someone at a grave, do so quietly and at a respectful distance.</li>
      </ul>

      <div className="bg-primary/5 rounded-lg p-8 my-8 text-center">
        <h3 className="font-serif text-xl mb-4">Find Cemeteries Near You</h3>
        <p className="text-muted-foreground mb-6">
          Search our comprehensive database to find cemetery locations, visiting hours, and contact information.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Search Cemeteries
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function GenealogyResearchContent() {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted-foreground">
      <p className="lead text-xl text-muted-foreground mb-8">
        Cemeteries are invaluable resources for genealogists, offering insights that official records sometimes miss. From headstone inscriptions to cemetery records and burial registers, these sacred grounds hold keys to unlocking your family history and connecting with ancestors across generations.
      </p>

      <h2 id="using-cemeteries-for-family-history" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Search className="w-7 h-7 text-accent flex-shrink-0" />
        Using Cemeteries for Family History
      </h2>
      <p>
        Cemeteries provide unique genealogical information that may not appear in other records. While vital records give basic facts, headstones often reveal family relationships, religious affiliations, military service, birthplaces, and even cause of death—details that bring ancestors to life beyond mere dates.
      </p>
      <p>
        <strong>Why cemetery research matters for genealogists:</strong>
      </p>
      <ul>
        <li><strong>Family groupings:</strong> Family plots physically demonstrate relationships, with spouses, children, and extended family often buried together.</li>
        <li><strong>Maiden names:</strong> Women's headstones frequently include maiden names ("Mary Smith, nee Jones"), crucial for tracing maternal lines.</li>
        <li><strong>Immigration clues:</strong> Birthplaces listed on stones may provide the specific town or region your ancestors emigrated from.</li>
        <li><strong>Religious connections:</strong> Cemetery sections, symbols, and inscriptions reveal religious affiliations that guide further research.</li>
        <li><strong>Military service:</strong> Government markers and veteran sections document service that may qualify descendants for records and benefits.</li>
        <li><strong>Fraternal organizations:</strong> Symbols like Masonic emblems, Odd Fellows links, or other organization markers indicate membership records to explore.</li>
      </ul>
      <p>
        Begin your cemetery research by identifying where your ancestors likely lived. Local history resources, county histories, church records, and obituaries often mention burial locations. Our <Link href="/deaths">deaths calendar</Link> can help you identify notable deaths on specific dates that may connect to your family history.
      </p>

      <h2 id="findagrave-and-billiongraves" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Database className="w-7 h-7 text-accent flex-shrink-0" />
        FindAGrave and BillionGraves
      </h2>
      <p>
        Online cemetery databases have revolutionized genealogical research, making millions of burial records accessible from anywhere in the world. The two most comprehensive databases are FindAGrave and BillionGraves.
      </p>
      <p>
        <strong>FindAGrave (findagrave.com):</strong>
      </p>
      <ul>
        <li>Largest database with over 230 million memorials worldwide</li>
        <li>Free to use, with premium features through Ancestry.com integration</li>
        <li>Volunteer-contributed photos and transcriptions</li>
        <li>Family linking feature connects related individuals</li>
        <li>Photo request feature lets you ask volunteers to photograph specific graves</li>
        <li>Virtual flowers and memorial tributes</li>
      </ul>
      <p>
        <strong>BillionGraves (billiongraves.com):</strong>
      </p>
      <ul>
        <li>Over 80 million GPS-tagged headstone photos</li>
        <li>Mobile app allows offline cemetery documentation</li>
        <li>GPS coordinates help locate exact grave positions</li>
        <li>Automatic transcription assistance through crowdsourcing</li>
        <li>Integration with FamilySearch for genealogy linking</li>
        <li>Volunteer program for photographing cemeteries</li>
      </ul>
      <div className="bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-forest-800 dark:text-forest-200">Research Tip:</strong>
            <p className="text-forest-700 dark:text-forest-300 mt-2 mb-0">
              Always verify online database information against official records when possible. User-contributed transcriptions may contain errors. Check multiple sources and visit the cemetery in person when feasible.
            </p>
          </div>
        </div>
      </div>

      <h2 id="reading-headstones" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <BookOpen className="w-7 h-7 text-accent flex-shrink-0" />
        Reading Headstones
      </h2>
      <p>
        Interpreting headstone information requires understanding historical context, symbolism, and common conventions that have evolved over centuries. Learning to "read" a headstone reveals far more than just names and dates.
      </p>
      <p>
        <strong>Key elements found on headstones:</strong>
      </p>
      <ul>
        <li><strong>Full names and nicknames:</strong> Names may include formal names, nicknames in quotes, and married/maiden names.</li>
        <li><strong>Date formatting:</strong> Older stones may use outdated calendar systems. Before 1752, dates in British colonies used the Julian calendar.</li>
        <li><strong>Age calculations:</strong> Many stones list age at death (Years, Months, Days) rather than birth date, requiring calculation.</li>
        <li><strong>Relationship designations:</strong> "Consort of" typically means spouse who died first; "Relict of" means surviving spouse.</li>
        <li><strong>Epitaphs:</strong> These verses often came from popular poetry, hymns, or were specifically composed to describe the deceased.</li>
      </ul>
      <p>
        <strong>Common headstone symbols and their meanings:</strong>
      </p>
      <ul>
        <li><strong>Lamb:</strong> Child or innocence</li>
        <li><strong>Weeping willow:</strong> Mourning and grief</li>
        <li><strong>Broken column:</strong> Life cut short</li>
        <li><strong>Clasped hands:</strong> Marriage or farewell</li>
        <li><strong>Open book:</strong> Bible or Book of Life</li>
        <li><strong>Anchor:</strong> Hope or naval service</li>
        <li><strong>IHS:</strong> Greek abbreviation for Jesus</li>
        <li><strong>Star of David:</strong> Jewish faith</li>
        <li><strong>Crescent and star:</strong> Islamic faith</li>
        <li><strong>Various military emblems:</strong> Branch and era of service</li>
      </ul>

      <h2 id="cemetery-records" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <FileText className="w-7 h-7 text-accent flex-shrink-0" />
        Cemetery Records
      </h2>
      <p>
        Beyond the headstones themselves, cemeteries maintain records that can provide additional genealogical information. These administrative documents often contain details not inscribed on markers.
      </p>
      <p>
        <strong>Types of cemetery records:</strong>
      </p>
      <ul>
        <li><strong>Burial registers:</strong> Chronological listings of burials including date, location, and often funeral home information</li>
        <li><strong>Lot ownership records:</strong> Show who purchased plots and family connections</li>
        <li><strong>Perpetual care agreements:</strong> May include family contact information and relationships</li>
        <li><strong>Sexton's records:</strong> Daily logs that may include grave digger notes and observations</li>
        <li><strong>Maps and plot diagrams:</strong> Essential for locating unmarked or moved graves</li>
        <li><strong>Financial records:</strong> Payment information may reveal family members</li>
      </ul>
      <p>
        <strong>Where to find cemetery records:</strong>
      </p>
      <ul>
        <li>Cemetery offices (active cemeteries)</li>
        <li>Local historical societies</li>
        <li>County clerk or recorder's office</li>
        <li>State archives</li>
        <li>Genealogical societies</li>
        <li>Church archives (for church cemeteries)</li>
        <li>FamilySearch.org (digitized collections)</li>
        <li>Ancestry.com and other genealogy databases</li>
      </ul>

      <h2 id="dna-and-genealogy" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Dna className="w-7 h-7 text-accent flex-shrink-0" />
        DNA and Genealogy
      </h2>
      <p>
        Modern DNA testing has transformed genealogical research, and when combined with cemetery research, can break through seemingly impossible brick walls in your family tree.
      </p>
      <p>
        <strong>How DNA testing supports cemetery research:</strong>
      </p>
      <ul>
        <li><strong>Confirm relationships:</strong> DNA matches can verify that people buried together were actually related as indicated</li>
        <li><strong>Find unknown relatives:</strong> DNA matches often know family burial locations you haven't discovered</li>
        <li><strong>Identify unknown burials:</strong> In some cases, DNA testing has been used to identify unmarked or misidentified graves</li>
        <li><strong>Connect family branches:</strong> Shared DNA matches may lead to family members who can share cemetery information</li>
        <li><strong>Verify oral traditions:</strong> DNA can confirm or refute family stories about relationships and origins</li>
      </ul>
      <p>
        <strong>Combining DNA with traditional research:</strong>
      </p>
      <ul>
        <li>Build your tree as completely as possible before testing</li>
        <li>Test multiple family members to maximize match coverage</li>
        <li>Use DNA matches to identify potential relatives who may know burial locations</li>
        <li>Contact matches who have cemetery photos or records in their trees</li>
        <li>Join surname-specific DNA projects that may have compiled cemetery information</li>
      </ul>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-amber-800 dark:text-amber-200">Important Considerations:</strong>
            <p className="text-amber-700 dark:text-amber-300 mt-2 mb-0">
              DNA testing may reveal unexpected family secrets, including non-paternity events, adoptions, or unknown relatives. Be prepared for surprises and approach research with sensitivity.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl mt-12 mb-6">Practical Research Steps</h2>
      <p>
        <strong>Follow this systematic approach for cemetery genealogy research:</strong>
      </p>
      <ol>
        <li><strong>Start with what you know:</strong> Document all known family burial locations from living relatives</li>
        <li><strong>Search online databases:</strong> Check FindAGrave, BillionGraves, and FamilySearch for existing records</li>
        <li><strong>Identify likely cemeteries:</strong> Research where your ancestors lived to determine local cemeteries</li>
        <li><strong>Contact cemetery offices:</strong> Request records and plot location information</li>
        <li><strong>Plan in-person visits:</strong> Visit cemeteries to photograph and document graves firsthand</li>
        <li><strong>Expand your search:</strong> Look for related families in surrounding plots who may be connected</li>
        <li><strong>Cross-reference records:</strong> Verify cemetery information against vital records, obituaries, and census data</li>
        <li><strong>Contribute to databases:</strong> Share your findings to help other researchers</li>
      </ol>

      <div className="bg-primary/5 rounded-lg p-8 my-8 text-center">
        <h3 className="font-serif text-xl mb-4">Explore Our Deaths Calendar</h3>
        <p className="text-muted-foreground mb-6">
          Discover notable deaths throughout history and find connections to your genealogical research.
        </p>
        <Link
          href="/deaths"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          View Deaths Calendar
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function BurialCostsContent() {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted-foreground">
      <p className="lead text-xl text-muted-foreground mb-8">
        Understanding burial costs helps families make informed decisions during emotional times. The total cost of a traditional burial in the United States typically ranges from $10,000 to $15,000, but costs vary significantly based on location, choices, and options selected. This guide breaks down all expenses to help you plan effectively.
      </p>

      <h2 id="average-costs-breakdown" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <DollarSign className="w-7 h-7 text-accent flex-shrink-0" />
        Average Costs Breakdown
      </h2>
      <p>
        According to the National Funeral Directors Association (NFDA), the median cost of a funeral with viewing and burial was $7,848 in 2023—and that doesn't include the cemetery costs. When you add cemetery expenses, the total easily exceeds $12,000.
      </p>
      <p>
        <strong>Typical funeral home charges (2023 NFDA data):</strong>
      </p>
      <ul>
        <li><strong>Basic services fee:</strong> $2,500 (non-declinable)</li>
        <li><strong>Embalming:</strong> $875</li>
        <li><strong>Other preparation:</strong> $295</li>
        <li><strong>Viewing/visitation:</strong> $450</li>
        <li><strong>Funeral ceremony:</strong> $515</li>
        <li><strong>Transfer of remains:</strong> $375</li>
        <li><strong>Hearse:</strong> $375</li>
        <li><strong>Service car/van:</strong> $175</li>
        <li><strong>Printed materials:</strong> $195</li>
      </ul>
      <p>
        <strong>Cemetery costs (varies widely by region):</strong>
      </p>
      <ul>
        <li><strong>Grave plot:</strong> $1,000 - $5,000 (urban areas much higher)</li>
        <li><strong>Opening/closing grave:</strong> $1,000 - $1,500</li>
        <li><strong>Burial vault/liner:</strong> $1,000 - $10,000</li>
        <li><strong>Grave marker/headstone:</strong> $1,000 - $3,000</li>
        <li><strong>Perpetual care:</strong> Often included in plot price</li>
      </ul>

      <h2 id="casket-costs" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Scale className="w-7 h-7 text-accent flex-shrink-0" />
        Casket Costs
      </h2>
      <p>
        The casket is typically the single largest expense in a traditional funeral, with prices ranging from under $1,000 to over $10,000 depending on materials and craftsmanship.
      </p>
      <p>
        <strong>Casket price ranges by material:</strong>
      </p>
      <ul>
        <li><strong>Cloth-covered wood/fiberboard:</strong> $400 - $1,500</li>
        <li><strong>Steel (20-gauge):</strong> $2,000 - $3,500</li>
        <li><strong>Steel (18-gauge, heavier):</strong> $3,000 - $5,000</li>
        <li><strong>Solid wood (pine, poplar):</strong> $1,500 - $4,000</li>
        <li><strong>Hardwood (oak, mahogany, cherry):</strong> $3,000 - $10,000</li>
        <li><strong>Copper/bronze:</strong> $5,000 - $50,000+</li>
      </ul>
      <div className="bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-forest-800 dark:text-forest-200">Money-Saving Tip:</strong>
            <p className="text-forest-700 dark:text-forest-300 mt-2 mb-0">
              The FTC Funeral Rule requires funeral homes to accept caskets purchased elsewhere without charging handling fees. Online retailers like Costco, Walmart, and specialized casket companies often sell identical caskets for 40-60% less than funeral homes.
            </p>
          </div>
        </div>
      </div>

      <h2 id="plot-costs-by-region" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <MapPin className="w-7 h-7 text-accent flex-shrink-0" />
        Plot Costs by Region
      </h2>
      <p>
        Cemetery plot prices vary dramatically based on location, type of cemetery, and specific placement within the grounds.
      </p>
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-3 text-left font-semibold">Region/Type</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Average Plot Cost</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Premium Locations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border px-4 py-3">Rural/Small Town</td>
              <td className="border border-border px-4 py-3">$500 - $1,500</td>
              <td className="border border-border px-4 py-3">$2,000 - $3,000</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3">Suburban</td>
              <td className="border border-border px-4 py-3">$1,500 - $3,000</td>
              <td className="border border-border px-4 py-3">$4,000 - $6,000</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3">Urban/Major City</td>
              <td className="border border-border px-4 py-3">$3,000 - $7,000</td>
              <td className="border border-border px-4 py-3">$10,000 - $25,000</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3">NYC, LA, San Francisco</td>
              <td className="border border-border px-4 py-3">$10,000 - $25,000</td>
              <td className="border border-border px-4 py-3">$30,000 - $100,000+</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3">Church Cemetery</td>
              <td className="border border-border px-4 py-3">$200 - $1,500</td>
              <td className="border border-border px-4 py-3">$1,500 - $3,000</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3">Veterans (National)</td>
              <td className="border border-border px-4 py-3">Free for eligible veterans</td>
              <td className="border border-border px-4 py-3">N/A</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="vault-requirements" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <FileText className="w-7 h-7 text-accent flex-shrink-0" />
        Vault Requirements
      </h2>
      <p>
        Most cemeteries require an outer burial container (vault or liner) to prevent the ground from settling over time. Understanding the difference can save significant money.
      </p>
      <p>
        <strong>Types of outer burial containers:</strong>
      </p>
      <ul>
        <li><strong>Grave liner:</strong> $500 - $1,500 — Basic concrete container that covers top and sides, allowing water entry at bottom</li>
        <li><strong>Burial vault (concrete):</strong> $1,000 - $3,000 — Fully sealed container protecting casket from elements</li>
        <li><strong>Burial vault (metal-lined):</strong> $3,000 - $7,000 — Enhanced protection with copper or steel lining</li>
        <li><strong>Premium vault (bronze/copper):</strong> $5,000 - $15,000 — Maximum protection and warranty</li>
      </ul>
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-amber-800 dark:text-amber-200">Important Note:</strong>
            <p className="text-amber-700 dark:text-amber-300 mt-2 mb-0">
              No vault is required by law. Cemetery requirements vary—always ask if a simple grave liner satisfies their policy before purchasing an expensive vault. Green burial cemeteries may not require any outer container.
            </p>
          </div>
        </div>
      </div>

      <h2 id="additional-fees" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <DollarSign className="w-7 h-7 text-accent flex-shrink-0" />
        Additional Fees
      </h2>
      <p>
        Beyond the major expenses, various additional fees can add up quickly. Being aware of these helps you budget accurately.
      </p>
      <p>
        <strong>Common additional cemetery fees:</strong>
      </p>
      <ul>
        <li><strong>Weekend/holiday burial:</strong> $200 - $1,000 extra</li>
        <li><strong>Overtime fees:</strong> $150 - $500 for services after regular hours</li>
        <li><strong>Tent/chairs for graveside:</strong> $100 - $300</li>
        <li><strong>Grave marker installation:</strong> $150 - $500</li>
        <li><strong>Foundation for headstone:</strong> $200 - $600</li>
        <li><strong>Recording fee:</strong> $25 - $100</li>
        <li><strong>Transfer/deed processing:</strong> $50 - $200</li>
        <li><strong>Perpetual care (if not included):</strong> $200 - $1,000</li>
      </ul>

      <h2 id="cost-comparison-table" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Scale className="w-7 h-7 text-accent flex-shrink-0" />
        Cost Comparison Table
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-3 text-left font-semibold">Burial Type</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Total Cost Range</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Key Features</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Direct Burial</td>
              <td className="border border-border px-4 py-3">$1,500 - $4,000</td>
              <td className="border border-border px-4 py-3">No embalming, viewing, or ceremony at funeral home</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Basic Burial</td>
              <td className="border border-border px-4 py-3">$5,000 - $8,000</td>
              <td className="border border-border px-4 py-3">Simple service, basic casket, standard plot</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Traditional Burial</td>
              <td className="border border-border px-4 py-3">$10,000 - $15,000</td>
              <td className="border border-border px-4 py-3">Full service, viewing, quality casket, vault</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Premium Burial</td>
              <td className="border border-border px-4 py-3">$20,000 - $50,000+</td>
              <td className="border border-border px-4 py-3">Elaborate service, high-end casket, prime location</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Green Burial</td>
              <td className="border border-border px-4 py-3">$2,000 - $5,000</td>
              <td className="border border-border px-4 py-3">Biodegradable materials, natural cemetery</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="how-to-reduce-costs" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <CheckCircle2 className="w-7 h-7 text-accent flex-shrink-0" />
        How to Reduce Costs
      </h2>
      <p>
        Significant savings are possible without sacrificing dignity or meaning. Consider these strategies:
      </p>
      <p>
        <strong>Immediate cost-saving measures:</strong>
      </p>
      <ul>
        <li><strong>Compare prices:</strong> The FTC requires funeral homes to provide itemized price lists. Get quotes from at least three providers.</li>
        <li><strong>Purchase casket separately:</strong> Buy online or from warehouse retailers and have it delivered to the funeral home.</li>
        <li><strong>Choose direct burial:</strong> Skip embalming and viewing if not required by your beliefs or situation.</li>
        <li><strong>Use a grave liner instead of vault:</strong> If the cemetery allows, this alone can save $1,000-$5,000.</li>
        <li><strong>Consider timing:</strong> Weekday services avoid weekend premium charges.</li>
        <li><strong>Hold services at church or home:</strong> Avoid funeral home facility fees.</li>
      </ul>
      <p>
        <strong>Financial assistance options:</strong>
      </p>
      <ul>
        <li><strong>Social Security death benefit:</strong> $255 lump sum for eligible survivors</li>
        <li><strong>VA burial benefits:</strong> Up to $2,000+ for eligible veterans</li>
        <li><strong>Medicaid burial assistance:</strong> Varies by state</li>
        <li><strong>County indigent burial programs:</strong> For families who cannot afford burial</li>
        <li><strong>Crowdfunding:</strong> GoFundMe and similar platforms for funeral expenses</li>
        <li><strong>Funeral consumer alliances:</strong> Nonprofit organizations offering guidance and discounts</li>
      </ul>

      <div className="bg-primary/5 rounded-lg p-8 my-8 text-center">
        <h3 className="font-serif text-xl mb-4">Plan Ahead and Save</h3>
        <p className="text-muted-foreground mb-6">
          Pre-planning allows you to make informed decisions without time pressure and often locks in current prices.
        </p>
        <Link
          href="/guide/topics/pre-planning"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Learn About Pre-Planning
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function CremationVsBurialContent() {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted-foreground">
      <p className="lead text-xl text-muted-foreground mb-8">
        The choice between cremation and burial is deeply personal, influenced by religious beliefs, environmental concerns, family traditions, and practical considerations like cost. This comprehensive guide compares both options to help you make an informed decision that aligns with your values and circumstances.
      </p>

      <h2 id="pros-and-cons-comparison" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Scale className="w-7 h-7 text-accent flex-shrink-0" />
        Pros and Cons Comparison
      </h2>
      <p>
        Both cremation and burial have distinct advantages and considerations. Understanding these helps clarify which option best suits your situation.
      </p>

      <h3 className="text-xl mt-8 mb-4">Cremation Advantages</h3>
      <ul>
        <li><strong>Lower cost:</strong> Generally 40-60% less expensive than traditional burial</li>
        <li><strong>Flexibility:</strong> Memorial services can be held at any time, anywhere</li>
        <li><strong>Portability:</strong> Remains can be divided, scattered, or transported easily</li>
        <li><strong>Space efficiency:</strong> Requires less cemetery space; urns can be kept at home</li>
        <li><strong>Simpler logistics:</strong> No time pressure for immediate family gathering</li>
        <li><strong>Environmental option:</strong> Natural scattering returns remains to nature</li>
      </ul>

      <h3 className="text-xl mt-8 mb-4">Cremation Considerations</h3>
      <ul>
        <li><strong>Irreversible:</strong> Cannot be undone if family members disagree</li>
        <li><strong>Religious restrictions:</strong> Some faiths discourage or prohibit cremation</li>
        <li><strong>No traditional grave:</strong> Some families prefer a specific location to visit</li>
        <li><strong>Decision burden:</strong> What to do with ashes can become a difficult decision</li>
      </ul>

      <h3 className="text-xl mt-8 mb-4">Burial Advantages</h3>
      <ul>
        <li><strong>Traditional:</strong> Honors cultural and religious traditions for many</li>
        <li><strong>Physical location:</strong> Provides a permanent place to visit and memorialize</li>
        <li><strong>Closure:</strong> The burial ceremony can provide important psychological closure</li>
        <li><strong>Family plots:</strong> Can be buried alongside other family members</li>
        <li><strong>Future options:</strong> Body could theoretically be exhumed if needed</li>
      </ul>

      <h3 className="text-xl mt-8 mb-4">Burial Considerations</h3>
      <ul>
        <li><strong>Higher cost:</strong> Casket, vault, plot, and services add up quickly</li>
        <li><strong>Time pressure:</strong> Must typically occur within days of death</li>
        <li><strong>Land use:</strong> Cemeteries require significant land allocation</li>
        <li><strong>Location permanence:</strong> Grave location is fixed; family may relocate away</li>
        <li><strong>Ongoing costs:</strong> Some plots require ongoing maintenance fees</li>
      </ul>

      <h2 id="environmental-impact" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Leaf className="w-7 h-7 text-accent flex-shrink-0" />
        Environmental Impact
      </h2>
      <p>
        Environmental consciousness increasingly influences end-of-life decisions. Both traditional options have environmental costs, though green alternatives exist for each.
      </p>
      <p>
        <strong>Traditional cremation environmental impact:</strong>
      </p>
      <ul>
        <li>Uses 28 gallons of fuel per cremation on average</li>
        <li>Releases approximately 540 pounds of CO2 per cremation</li>
        <li>Mercury emissions from dental fillings (though filters reduce this)</li>
        <li>No chemicals leach into groundwater</li>
        <li>Minimal land use required</li>
      </ul>
      <p>
        <strong>Traditional burial environmental impact:</strong>
      </p>
      <ul>
        <li>Embalming uses formaldehyde and other chemicals that can leach into soil</li>
        <li>Each burial uses approximately 100 square feet of land permanently</li>
        <li>Caskets require wood, metal, and manufacturing energy</li>
        <li>Vaults use concrete, a carbon-intensive material</li>
        <li>Cemetery maintenance requires mowing, chemicals, and water</li>
      </ul>
      <p>
        <strong>Greener alternatives:</strong>
      </p>
      <ul>
        <li><strong>Green burial:</strong> No embalming, biodegradable container, natural cemetery</li>
        <li><strong>Alkaline hydrolysis (aquamation):</strong> Uses water instead of flame, 90% less energy</li>
        <li><strong>Human composting:</strong> Now legal in several states, creates soil</li>
        <li><strong>Reef balls:</strong> Cremated remains mixed into concrete for artificial reefs</li>
        <li><strong>Tree pod burial:</strong> Body becomes nutrients for a memorial tree</li>
      </ul>

      <h2 id="religious-considerations" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Heart className="w-7 h-7 text-accent flex-shrink-0" />
        Religious Considerations
      </h2>
      <p>
        Religious beliefs often strongly influence cremation vs. burial decisions. Here's how major religions view these options:
      </p>
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-3 text-left font-semibold">Religion</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Cremation</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Burial</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Catholic</td>
              <td className="border border-border px-4 py-3">Permitted since 1963; burial of ashes required</td>
              <td className="border border-border px-4 py-3">Preferred</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Protestant</td>
              <td className="border border-border px-4 py-3">Generally accepted</td>
              <td className="border border-border px-4 py-3">Accepted</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Orthodox Christian</td>
              <td className="border border-border px-4 py-3">Generally prohibited</td>
              <td className="border border-border px-4 py-3">Required</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Judaism (Orthodox)</td>
              <td className="border border-border px-4 py-3">Prohibited</td>
              <td className="border border-border px-4 py-3">Required within 24 hours</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Judaism (Reform/Conservative)</td>
              <td className="border border-border px-4 py-3">Some acceptance</td>
              <td className="border border-border px-4 py-3">Preferred</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Islam</td>
              <td className="border border-border px-4 py-3">Prohibited</td>
              <td className="border border-border px-4 py-3">Required within 24 hours</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Hinduism</td>
              <td className="border border-border px-4 py-3">Required/preferred</td>
              <td className="border border-border px-4 py-3">Rarely practiced</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Buddhism</td>
              <td className="border border-border px-4 py-3">Common and accepted</td>
              <td className="border border-border px-4 py-3">Also accepted</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Sikhism</td>
              <td className="border border-border px-4 py-3">Preferred</td>
              <td className="border border-border px-4 py-3">Permitted in certain circumstances</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cost-comparison" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <DollarSign className="w-7 h-7 text-accent flex-shrink-0" />
        Cost Comparison
      </h2>
      <p>
        Cost differences between cremation and burial can be substantial, though the gap narrows significantly depending on choices made.
      </p>
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-3 text-left font-semibold">Option</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Low End</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Average</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">High End</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Direct Cremation</td>
              <td className="border border-border px-4 py-3">$800</td>
              <td className="border border-border px-4 py-3">$2,500</td>
              <td className="border border-border px-4 py-3">$4,000</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Cremation with Service</td>
              <td className="border border-border px-4 py-3">$3,000</td>
              <td className="border border-border px-4 py-3">$6,000</td>
              <td className="border border-border px-4 py-3">$10,000</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Direct Burial</td>
              <td className="border border-border px-4 py-3">$1,500</td>
              <td className="border border-border px-4 py-3">$3,500</td>
              <td className="border border-border px-4 py-3">$5,000</td>
            </tr>
            <tr className="bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">Traditional Burial</td>
              <td className="border border-border px-4 py-3">$7,000</td>
              <td className="border border-border px-4 py-3">$12,000</td>
              <td className="border border-border px-4 py-3">$25,000+</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-3 font-medium">Green Burial</td>
              <td className="border border-border px-4 py-3">$1,000</td>
              <td className="border border-border px-4 py-3">$3,000</td>
              <td className="border border-border px-4 py-3">$5,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cremation-process" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Flame className="w-7 h-7 text-accent flex-shrink-0" />
        Cremation Process
      </h2>
      <p>
        Understanding the cremation process can help families feel more comfortable with this choice.
      </p>
      <p>
        <strong>Step-by-step cremation process:</strong>
      </p>
      <ol>
        <li><strong>Identification:</strong> Remains are identified and tagged throughout the process</li>
        <li><strong>Authorization:</strong> Legal paperwork and permits are obtained</li>
        <li><strong>Preparation:</strong> Medical devices are removed; body is placed in cremation container</li>
        <li><strong>Cremation:</strong> Takes 2-3 hours at 1400-1800°F in the cremation chamber</li>
        <li><strong>Processing:</strong> Remaining bone fragments are processed into fine particles</li>
        <li><strong>Return:</strong> Cremated remains (3-9 pounds) are placed in chosen container</li>
      </ol>
      <p>
        <strong>Options for cremated remains:</strong>
      </p>
      <ul>
        <li>Kept in an urn at home or in a columbarium</li>
        <li>Buried in a cemetery plot or scattered garden</li>
        <li>Scattered at a meaningful location (check local regulations)</li>
        <li>Divided among family members</li>
        <li>Incorporated into jewelry, art, or memorial items</li>
        <li>Used in reef creation or tree planting</li>
      </ul>

      <h2 id="burial-process" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <TreeDeciduous className="w-7 h-7 text-accent flex-shrink-0" />
        Burial Process
      </h2>
      <p>
        Traditional burial follows a well-established process, though variations exist based on cultural and religious practices.
      </p>
      <p>
        <strong>Typical burial timeline:</strong>
      </p>
      <ol>
        <li><strong>Preparation:</strong> Body is transported to funeral home, embalmed if desired</li>
        <li><strong>Visitation/viewing:</strong> Family and friends pay respects (1-2 days)</li>
        <li><strong>Funeral service:</strong> Religious or secular ceremony at funeral home, church, or graveside</li>
        <li><strong>Procession:</strong> Formal transportation to cemetery</li>
        <li><strong>Committal:</strong> Brief graveside service before burial</li>
        <li><strong>Burial:</strong> Casket lowered into grave and covered</li>
        <li><strong>Marker placement:</strong> Headstone installed weeks or months later</li>
      </ol>

      <h2 id="hybrid-options" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Heart className="w-7 h-7 text-accent flex-shrink-0" />
        Hybrid Options
      </h2>
      <p>
        Many families choose options that combine elements of both cremation and burial, or alternative approaches entirely.
      </p>
      <ul>
        <li><strong>Cremation with burial:</strong> Cremated remains buried in a standard plot or cremation garden</li>
        <li><strong>Partial cremation:</strong> Some remains cremated for family, rest buried</li>
        <li><strong>Memorial service followed by later cremation:</strong> Allows full funeral without immediate burial</li>
        <li><strong>Green burial:</strong> Natural decomposition without embalming or permanent containers</li>
        <li><strong>Aquamation:</strong> Water-based cremation alternative with lower environmental impact</li>
        <li><strong>Natural organic reduction:</strong> Body composted into soil (available in some states)</li>
        <li><strong>Body donation:</strong> Remains used for medical research, then cremated and returned</li>
      </ul>

      <div className="bg-primary/5 rounded-lg p-8 my-8 text-center">
        <h3 className="font-serif text-xl mb-4">Compare Burial Costs</h3>
        <p className="text-muted-foreground mb-6">
          Understanding the full cost breakdown helps you make an informed decision.
        </p>
        <Link
          href="/guide/topics/burial-costs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          View Cost Guide
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function PrePlanningContent({ checklist, howToSteps }: { checklist?: string[]; howToSteps?: { name: string; text: string }[] }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted-foreground">
      <p className="lead text-xl text-muted-foreground mb-8">
        Pre-planning your funeral is one of the most thoughtful gifts you can give your loved ones. By making decisions now, you spare your family from difficult choices during an emotional time, ensure your wishes are honored, and potentially save money by locking in current prices.
      </p>

      <h2 id="why-pre-plan" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Heart className="w-7 h-7 text-accent flex-shrink-0" />
        Why Pre-Plan
      </h2>
      <p>
        Pre-planning isn't about being morbid—it's about being practical and caring. Consider these compelling reasons to plan ahead:
      </p>
      <p>
        <strong>Benefits for you:</strong>
      </p>
      <ul>
        <li><strong>Control:</strong> Ensure your wishes and values are reflected in your final arrangements</li>
        <li><strong>Peace of mind:</strong> Know that everything is taken care of and your family won't struggle with decisions</li>
        <li><strong>Cost savings:</strong> Pre-paying can lock in current prices, protecting against inflation</li>
        <li><strong>Time to decide:</strong> Make thoughtful decisions without emotional pressure or time constraints</li>
        <li><strong>Comparison shopping:</strong> Take time to compare options and prices from multiple providers</li>
      </ul>
      <p>
        <strong>Benefits for your family:</strong>
      </p>
      <ul>
        <li><strong>Reduces stress:</strong> Eliminates difficult decisions during grief</li>
        <li><strong>Prevents conflict:</strong> Clear documentation prevents family disagreements</li>
        <li><strong>Financial clarity:</strong> No surprise costs or financial burden during an already difficult time</li>
        <li><strong>Honors your wishes:</strong> Family knows they're fulfilling what you wanted</li>
        <li><strong>Faster arrangements:</strong> Can proceed quickly without needing to research or decide</li>
      </ul>

      <h2 id="step-by-step-guide" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <ClipboardList className="w-7 h-7 text-accent flex-shrink-0" />
        Step-by-Step Guide
      </h2>
      <p>
        Pre-planning doesn't have to be overwhelming. Break it into manageable steps and work through them at your own pace.
      </p>

      {howToSteps && (
        <div className="space-y-6 my-8">
          {howToSteps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">{step.name}</h4>
                <p className="text-muted-foreground m-0">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 id="pre-need-contracts" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <FileText className="w-7 h-7 text-accent flex-shrink-0" />
        Pre-Need Contracts
      </h2>
      <p>
        Pre-need contracts are agreements with funeral homes or cemeteries to provide services in the future. Understanding these contracts is essential before signing.
      </p>
      <p>
        <strong>Types of pre-need contracts:</strong>
      </p>
      <ul>
        <li><strong>Revocable:</strong> Can be cancelled for a refund (may have fees); funds accessible if you need them</li>
        <li><strong>Irrevocable:</strong> Cannot be cancelled; may help with Medicaid eligibility planning</li>
        <li><strong>Guaranteed price:</strong> Locks in current prices regardless of when services are needed</li>
        <li><strong>Non-guaranteed:</strong> Services specified but prices may increase; difference paid at time of need</li>
      </ul>
      <p>
        <strong>Key questions to ask before signing:</strong>
      </p>
      <ul>
        <li>What happens if the funeral home goes out of business?</li>
        <li>Can I transfer the contract if I move to another area?</li>
        <li>What items are guaranteed at today's prices, and which are not?</li>
        <li>Where exactly are my funds held? In trust? Insurance policy?</li>
        <li>What happens to excess funds if prices decrease?</li>
        <li>Are there cancellation fees or penalties?</li>
        <li>Can I make changes to the contract later?</li>
      </ul>
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-amber-800 dark:text-amber-200">Consumer Protection:</strong>
            <p className="text-amber-700 dark:text-amber-300 mt-2 mb-0">
              State laws governing pre-need contracts vary significantly. Contact your state's attorney general's office or funeral regulatory board to understand your rights and protections before signing any contract.
            </p>
          </div>
        </div>
      </div>

      <h2 id="payment-options" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <DollarSign className="w-7 h-7 text-accent flex-shrink-0" />
        Payment Options
      </h2>
      <p>
        Several methods exist for funding pre-planned funeral arrangements. Each has advantages and considerations.
      </p>
      <p>
        <strong>Payment methods compared:</strong>
      </p>
      <ul>
        <li><strong>Lump sum payment:</strong> Pay in full upfront, often with a discount; price is typically locked in</li>
        <li><strong>Installment plan:</strong> Pay over time through the funeral home; ensure you understand what happens if payments stop</li>
        <li><strong>Funeral insurance:</strong> Whole life policy specifically for funeral expenses; benefits pass to family or funeral home</li>
        <li><strong>Payable-on-death account:</strong> Bank account specifically designated for funeral expenses</li>
        <li><strong>Trust account:</strong> Funds held in trust; may earn interest; various state regulations apply</li>
      </ul>
      <p>
        <strong>Considerations for each option:</strong>
      </p>
      <ul>
        <li><strong>Medicaid planning:</strong> Irrevocable funeral trusts may not count toward Medicaid asset limits</li>
        <li><strong>Interest earnings:</strong> Some options allow your money to grow, others don't</li>
        <li><strong>Flexibility:</strong> Can you access funds in an emergency?</li>
        <li><strong>Inflation protection:</strong> Will your funds keep pace with rising costs?</li>
        <li><strong>Estate considerations:</strong> How do different options affect your overall estate plan?</li>
      </ul>

      <h2 id="what-to-document" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <ClipboardList className="w-7 h-7 text-accent flex-shrink-0" />
        What to Document
      </h2>
      <p>
        Comprehensive documentation ensures your wishes are clearly understood and can be followed. Include these essential details:
      </p>
      <p>
        <strong>Funeral preferences:</strong>
      </p>
      <ul>
        <li>Burial or cremation preference</li>
        <li>Type of service (traditional, memorial, celebration of life, graveside only)</li>
        <li>Preferred funeral home (if selected)</li>
        <li>Cemetery or final resting place</li>
        <li>Casket, urn, or green burial container preference</li>
        <li>Vault or liner preference</li>
        <li>Open or closed casket</li>
        <li>Clothing and personal items for burial</li>
      </ul>
      <p>
        <strong>Service details:</strong>
      </p>
      <ul>
        <li>Specific readings, poems, or scriptures</li>
        <li>Music selections</li>
        <li>Preferred officiant (clergy, celebrant, family member)</li>
        <li>Speakers or eulogists</li>
        <li>Organizations to notify (military, fraternal, professional)</li>
        <li>Charitable donations in lieu of flowers</li>
        <li>Reception or gathering preferences</li>
      </ul>
      <p>
        <strong>Practical information:</strong>
      </p>
      <ul>
        <li>Full legal name and any aliases</li>
        <li>Social Security number</li>
        <li>Birth certificate location</li>
        <li>Military discharge papers (DD-214)</li>
        <li>Marriage certificate(s)</li>
        <li>Insurance policies</li>
        <li>Bank accounts and financial information</li>
        <li>Obituary draft or key points to include</li>
        <li>List of people to notify</li>
        <li>Social media account credentials and wishes</li>
      </ul>

      <h2 id="telling-family" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <Users className="w-7 h-7 text-accent flex-shrink-0" />
        Telling Family
      </h2>
      <p>
        Having conversations about death can be uncomfortable, but open communication prevents misunderstandings and ensures your wishes are followed.
      </p>
      <p>
        <strong>How to approach the conversation:</strong>
      </p>
      <ul>
        <li><strong>Choose the right time:</strong> Find a calm moment, not during crisis or conflict</li>
        <li><strong>Be direct:</strong> Explain that you've made plans and want to share them</li>
        <li><strong>Share your reasoning:</strong> Help them understand why you made specific choices</li>
        <li><strong>Invite questions:</strong> Allow them to express concerns or ask for clarification</li>
        <li><strong>Provide documentation:</strong> Give copies of plans and explain where originals are kept</li>
        <li><strong>Name your executor:</strong> Ensure the person responsible knows and accepts the role</li>
      </ul>
      <p>
        <strong>What to communicate:</strong>
      </p>
      <ul>
        <li>Location of all documents and plans</li>
        <li>Contact information for funeral home, attorney, financial advisor</li>
        <li>Any contracts or policies you've purchased</li>
        <li>Specific wishes that aren't in writing</li>
        <li>Reasons behind any unusual requests</li>
        <li>Financial arrangements and how services will be paid</li>
      </ul>

      <h2 id="pre-planning-checklist" className="flex items-center gap-3 text-2xl mt-12 mb-6">
        <CheckCircle2 className="w-7 h-7 text-accent flex-shrink-0" />
        Pre-Planning Checklist
      </h2>

      {checklist && (
        <div className="bg-muted/50 rounded-lg p-6 my-6">
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 border-2 border-border rounded flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg p-6 my-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-forest-800 dark:text-forest-200">Document Storage Tip:</strong>
            <p className="text-forest-700 dark:text-forest-300 mt-2 mb-0">
              Never store funeral plans only in a safe deposit box—these may be sealed upon death and difficult to access quickly. Keep copies with your executor, attorney, and in an easily accessible home location.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-8 my-8 text-center">
        <h3 className="font-serif text-xl mb-4">Find a Cemetery Near You</h3>
        <p className="text-muted-foreground mb-6">
          Browse our comprehensive database to research cemeteries in your area as part of your pre-planning process.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Search Cemeteries
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Main component to render content based on slug
function TopicContent({ guide }: { guide: TopicGuide }) {
  switch (guide.slug) {
    case 'cemetery-etiquette':
      return <CemeteryEtiquetteContent />;
    case 'genealogy-research':
      return <GenealogyResearchContent />;
    case 'burial-costs':
      return <BurialCostsContent />;
    case 'cremation-vs-burial':
      return <CremationVsBurialContent />;
    case 'pre-planning':
      return <PrePlanningContent checklist={guide.checklist} howToSteps={guide.howToSteps} />;
    default:
      return null;
  }
}

export default async function TopicGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getTopicGuide(slug);

  if (!guide) {
    notFound();
  }

  const otherGuides = topicGuides.filter(g => g.slug !== slug).slice(0, 3);

  // JSON-LD structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    author: {
      '@type': 'Organization',
      name: guide.author,
    },
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'Cemetery Near Me',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cemeterynearbyme.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.cemeterynearbyme.com/guide/topics/${slug}`,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // HowTo schema for pre-planning guide
  const howToJsonLd = guide.howToSteps ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Pre-Plan Your Funeral',
    description: 'A step-by-step guide to pre-planning your funeral arrangements.',
    step: guide.howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  } : null;

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
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-primary-foreground/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guides</Link></li>
                <li>/</li>
                <li className="text-white">{guide.title}</li>
              </ol>
            </nav>

            <Link
              href="/guide"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Guides
            </Link>

            <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium mb-4">
              {guide.category}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl">
              {guide.title}
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-3xl mb-6">
              {guide.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                {guide.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Updated {new Date(guide.dateModified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {guide.readTime} read
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Main Content */}
              <article className="lg:col-span-3">
                {/* Table of Contents */}
                <Card className="p-6 shadow-soft mb-8">
                  <h2 className="font-serif font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    In This Guide
                  </h2>
                  <nav>
                    <ol className="space-y-2">
                      {guide.sections.map((section, index) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.anchor}`}
                            className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                          >
                            <span className="text-accent font-medium">{index + 1}.</span>
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </Card>

                <Card className="p-8 shadow-soft mb-8">
                  <TopicContent guide={guide} />
                </Card>

                <InlineAd />

                {/* FAQ Section */}
                <Card className="p-8 shadow-soft mb-8">
                  <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                    <AlertCircle className="w-7 h-7 text-accent" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {guide.faqs.map((faq, index) => (
                      <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Share buttons */}
                <Card className="p-6 shadow-soft mb-8">
                  <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-accent" />
                    Share this guide
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="hover:border-accent hover:text-accent">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="hover:border-accent hover:text-accent">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="hover:border-accent hover:text-accent">
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="hover:border-accent hover:text-accent">
                      Email
                    </Button>
                  </div>
                </Card>

                {/* Feedback form */}
                <FeedbackForm
                  pageTitle={guide.title}
                  pageUrl={`/guide/topics/${slug}`}
                />
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                <SidebarAd sticky={true} />

                {/* Related Guides */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-4">Related Guides</h3>
                  <div className="space-y-4">
                    {otherGuides.map((relatedGuide) => (
                      <div key={relatedGuide.slug} className="group">
                        <Link
                          href={`/guide/topics/${relatedGuide.slug}`}
                          className="text-sm font-medium hover:text-accent transition-colors block"
                        >
                          {relatedGuide.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">
                          {relatedGuide.readTime} read
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Links */}
                <Card className="p-6 shadow-soft bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif font-semibold mb-3">Find Cemeteries</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search our database of cemeteries across the United States.
                  </p>
                  <Link href="/search">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
                      Search Now
                    </Button>
                  </Link>
                </Card>

                {/* Contact */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-4">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about cemetery services or planning?
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/contact"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Us
                    </Link>
                    <Link
                      href="/funeral-planning"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Planning Resources
                    </Link>
                  </div>
                </Card>
              </aside>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                Looking for a Cemetery?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Search our comprehensive database of cemeteries across the United States to find locations, hours, and contact information.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Search Cemeteries
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/guide"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  More Guides
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
