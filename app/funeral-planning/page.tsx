'use client';

import Link from 'next/link';
import { Shield, CheckCircle, Phone, Mail, ExternalLink, TrendingUp, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';

interface Verzekeraar {
  naam: string;
  logo: string;
  beschrijving: string;
  url: string;
  voordelen: string[];
  premieVanaf?: string;
  rating?: number;
}

const verzekeraars: Verzekeraar[] = [
  {
    naam: 'Monuta',
    logo: '/images/verzekeraars/monuta-logo.svg',
    beschrijving: "Nederland's grootste uitvaartverzekeraar met meer dan 1 miljoen verzekerden.",
    url: 'https://www.monuta.nl',
    voordelen: [
      'Grootste uitvaartverzekeraar van Nederland',
      'Uitvaartregeling mogelijk vanaf €3.000',
      'Gratis uitvaartwensen vastleggen',
      'Eigen uitvaartcentra door heel Nederland'
    ],
    premieVanaf: '€5,50',
    rating: 4.8
  },
  {
    naam: 'Dela',
    logo: '/images/verzekeraars/dela-logo.svg',
    beschrijving: 'Uitvaartverzekering met persoonlijke begeleiding en flexibele opties.',
    url: 'https://www.dela.nl',
    voordelen: [
      'Persoonlijke uitvaartbegeleiding',
      'Flexibele verzekering aanpasbaar aan wensen',
      'Coöperatie zonder winstoogmerk',
      'Uitvaart in eigen beheer mogelijk'
    ],
    premieVanaf: '€6,00',
    rating: 4.7
  },
  {
    naam: 'ASR',
    logo: '/images/verzekeraars/asr-logo.svg',
    beschrijving: 'Uitvaartverzekering met keuze uit verschillende dekkingen en premies.',
    url: 'https://www.asr.nl',
    voordelen: [
      'Keuze uit verschillende dekkingsbedragen',
      'Geen medische keuring nodig',
      'Premie blijft gelijk gedurende hele looptijd',
      'Online gemakkelijk te regelen'
    ],
    premieVanaf: '€7,00',
    rating: 4.5
  },
  {
    naam: 'Twenthe',
    logo: '/images/verzekeraars/twenthe-logo.svg',
    beschrijving: 'Regionale verzekeraar met persoonlijke service en lokale expertise.',
    url: 'https://www.twenthe.nl',
    voordelen: [
      'Persoonlijke service in de regio',
      'Lokale kennis en expertise',
      'Maatwerk mogelijk',
      'Directe hulp bij overlijden'
    ],
    premieVanaf: '€5,00',
    rating: 4.6
  }
];

const faqs = [
  {
    category: 'Algemene vragen over uitvaartverzekeringen',
    questions: [
      {
        q: 'Wat is een uitvaartverzekering?',
        a: 'Een uitvaartverzekering is een verzekering die de kosten van een uitvaart dekt. Bij overlijden keert de verzekering een vooraf afgesproken bedrag uit, waarmee de nabestaanden de uitvaart kunnen bekostigen. Dit zorgt ervoor dat uw dierbaren niet voor onverwachte kosten komen te staan in een toch al moeilijke tijd.'
      },
      {
        q: 'Hoe werkt een uitvaartverzekering?',
        a: 'U betaalt maandelijks of jaarlijks een premie aan de verzekeraar. Bij overlijden keert de verzekering het afgesproken bedrag uit aan de nabestaanden. Dit bedrag kan gebruikt worden voor alle uitvaartkosten zoals de kist, bloemen, rouwkaarten, catering en de dienst zelf. Sommige verzekeraars bieden ook natura-uitvaartverzekeringen waarbij zij de uitvaart volledig regelen.'
      },
      {
        q: 'Wat kost een uitvaartverzekering?',
        a: 'De kosten van een uitvaartverzekering hangen af van verschillende factoren: uw leeftijd bij afsluiten, het verzekerde bedrag (meestal tussen €5.000 en €15.000), de looptijd van de verzekering en of u kiest voor een kapitaal- of natura-uitvaartverzekering. Gemiddeld betaalt u tussen de €5 en €30 per maand, afhankelijk van deze factoren.'
      }
    ]
  },
  {
    category: 'Praktische vragen',
    questions: [
      {
        q: 'Uitvaartverzekering vergelijken?',
        a: 'Bij het vergelijken van uitvaartverzekeringen let u op: de hoogte van de premie, het verzekerde bedrag, de voorwaarden (zoals wachttijd), of de verzekering meegroeit met inflatie, de reputatie van de verzekeraar, extra services zoals uitvaartbegeleiding, en of het een kapitaal- of natura-verzekering is.'
      },
      {
        q: 'Is een uitvaartverzekering een kapitaalverzekering?',
        a: 'Er zijn twee soorten uitvaartverzekeringen: kapitaalverzekeringen en natura-verzekeringen. Bij een kapitaalverzekering krijgen nabestaanden een geldbedrag uitgekeerd waarmee zij zelf de uitvaart kunnen regelen. Bij een natura-verzekering regelt de verzekeraar de complete uitvaart volgens vooraf gemaakte afspraken.'
      },
      {
        q: 'Wanneer sluit je een uitvaartverzekering af?',
        a: 'Het beste moment om een uitvaartverzekering af te sluiten is op jonge leeftijd, omdat de premie dan het laagst is. De premie wordt namelijk bepaald op basis van uw leeftijd bij afsluiten en blijft daarna meestal gelijk. Hoe ouder u bent bij het afsluiten, hoe hoger de maandelijkse premie.'
      }
    ]
  }
];

const tips = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Vergelijk meerdere verzekeraars',
    description: 'Vraag offertes aan bij verschillende verzekeraars en vergelijk niet alleen de premie maar ook de voorwaarden.'
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Let op de voorwaarden en uitsluitingen',
    description: 'Controleer de kleine lettertjes, zoals wachttijden en uitsluitingen bij bepaalde doodsoorzaken.'
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Controleer of de verzekering meegroeit met inflatie',
    description: 'Een uitvaart wordt elk jaar duurder. Kies een verzekering die meegroeit met de inflatie.'
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Sluit af op jonge leeftijd voor lagere premies',
    description: 'Hoe jonger u bent bij het afsluiten, hoe lager de maandelijkse premie.'
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Lees de polisvoorwaarden goed door',
    description: 'Zorg dat u precies weet wat wel en niet gedekt is voordat u de verzekering afsluit.'
  }
];

export default function UitvaartverzekeringPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Uitvaartverzekering</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Een uitvaartverzekering zorgt ervoor dat uw nabestaanden niet voor de kosten van uw uitvaart hoeven op te draaien. 
          Het is een belangrijke verzekering die rust en zekerheid biedt voor u en uw familie. 
          Op deze pagina vindt u alle informatie over uitvaartverzekeringen en kunt u verschillende verzekeraars vergelijken.
        </p>
      </div>

      <LeaderboardAd />

      {/* Verzekeraars Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Uitvaartverzekeraars vergelijken</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Vergelijk de verschillende uitvaartverzekeraars en vind de verzekering die het beste bij u past. 
            Klik op een verzekeraar voor meer informatie.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verzekeraars.map((verzekeraar) => (
              <Card key={verzekeraar.naam} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{verzekeraar.naam}</CardTitle>
                      <CardDescription>{verzekeraar.beschrijving}</CardDescription>
                    </div>
                    {verzekeraar.rating && (
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary">{verzekeraar.rating}</div>
                        <div className="text-sm text-muted-foreground">★★★★★</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {verzekeraar.voordelen.map((voordeel, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{voordeel}</span>
                      </li>
                    ))}
                  </ul>
                  {verzekeraar.premieVanaf && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Premie vanaf <span className="font-semibold text-foreground">{verzekeraar.premieVanaf}</span> per maand
                    </p>
                  )}
                  <Button asChild className="w-full">
                    <Link href={verzekeraar.url} target="_blank" rel="noopener noreferrer">
                      Bekijk {verzekeraar.naam} <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <InlineAd />

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Veelgestelde vragen over uitvaartverzekeringen</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Hieronder vindt u antwoorden op de meest gestelde vragen over uitvaartverzekeringen. 
            Staat uw vraag er niet tussen? Neem gerust contact met ons op.
          </p>

          <div className="space-y-8">
            {faqs.map((category, categoryIdx) => (
              <div key={categoryIdx}>
                <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, idx) => (
                    <AccordionItem key={idx} value={`${categoryIdx}-${idx}`} className="border rounded-lg px-6">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Hulp nodig bij het kiezen?</CardTitle>
            <CardDescription className="text-lg">
              Onze experts helpen u graag bij het vinden van de juiste uitvaartverzekering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Button asChild variant="outline" size="lg">
                <Link href="mailto:info@begraafplaatsindebuurt.nl">
                  <Mail className="w-5 h-5 mr-2" />
                  Email ons
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact opnemen
                </Link>
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Wij reageren doorgaans binnen 24 uur.
            </p>
          </CardContent>
        </Card>
      </section>

      <InlineAd />

      {/* Tips Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Tips voor het kiezen van een uitvaartverzekering</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, idx) => (
              <Card key={idx} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {tip.icon}
                    </div>
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}