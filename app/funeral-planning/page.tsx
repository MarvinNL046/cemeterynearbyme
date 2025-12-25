'use client';

import Link from 'next/link';
import { Shield, CheckCircle, Phone, Mail, ExternalLink, TrendingUp, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';

interface FuneralService {
  name: string;
  logo: string;
  description: string;
  url: string;
  benefits: string[];
  priceFrom?: string;
  rating?: number;
}

const funeralServices: FuneralService[] = [
  {
    name: 'National Funeral Directors Association',
    logo: '/images/services/nfda-logo.svg',
    description: "The world's leading funeral service association, helping families find trusted funeral homes.",
    url: 'https://www.nfda.org',
    benefits: [
      'Find vetted funeral homes in your area',
      'Free funeral planning resources',
      'Consumer protection guidelines',
      'Grief support resources'
    ],
    rating: 4.8
  },
  {
    name: 'Dignity Memorial',
    logo: '/images/services/dignity-logo.svg',
    description: 'One of the largest networks of funeral, cremation and cemetery service providers in the USA.',
    url: 'https://www.dignitymemorial.com',
    benefits: [
      'Over 2,000 locations nationwide',
      'Pre-planning services available',
      'Cremation and burial options',
      'Free planning guide available'
    ],
    priceFrom: 'Contact for quote',
    rating: 4.7
  },
  {
    name: 'Neptune Society',
    logo: '/images/services/neptune-logo.svg',
    description: 'Specializing in affordable cremation services with locations across the country.',
    url: 'https://www.neptunesociety.com',
    benefits: [
      'Affordable cremation plans',
      'Nationwide service network',
      'Pre-arranged plans available',
      'Flexible payment options'
    ],
    priceFrom: '$1,295',
    rating: 4.5
  },
  {
    name: 'Funeralocity',
    logo: '/images/services/funeralocity-logo.svg',
    description: 'Compare funeral home prices and services in your area.',
    url: 'https://www.funeralocity.com',
    benefits: [
      'Price comparison tool',
      'Read verified reviews',
      'Find local funeral homes',
      'Free to use service'
    ],
    rating: 4.6
  }
];

const faqs = [
  {
    category: 'General questions about funeral planning',
    questions: [
      {
        q: 'What is funeral pre-planning?',
        a: 'Funeral pre-planning is the process of arranging your funeral services in advance. This includes making decisions about the type of service, burial or cremation preferences, and often pre-paying for these services. Pre-planning ensures your wishes are known and can help reduce the emotional and financial burden on your family during a difficult time.'
      },
      {
        q: 'How does pre-paid funeral insurance work?',
        a: 'Pre-paid funeral insurance (also called final expense insurance or burial insurance) is a policy specifically designed to cover funeral and burial costs. You pay monthly or annual premiums, and upon your passing, the policy pays out a predetermined amount to cover funeral expenses. This money can be used for any funeral-related costs including the service, casket, burial plot, headstone, and more.'
      },
      {
        q: 'How much does a funeral cost in the USA?',
        a: 'The average cost of a funeral in the United States ranges from $7,000 to $12,000 or more, depending on the services chosen. A basic cremation can cost as little as $1,000-$3,000, while traditional burials with viewings and full services typically cost $7,000-$10,000 or more. Costs vary significantly by region and the specific services selected.'
      }
    ]
  },
  {
    category: 'Practical questions',
    questions: [
      {
        q: 'What should I compare when choosing a funeral provider?',
        a: 'When comparing funeral providers, consider: the total cost of services, the reputation and reviews of the provider, available services (burial, cremation, memorial options), flexibility in customizing services, pre-payment and financing options, the location and facilities, and any additional services like grief counseling or online memorials.'
      },
      {
        q: 'What is the difference between cremation and burial?',
        a: 'Burial involves interring the body in a casket in a cemetery plot, mausoleum, or crypt. Cremation reduces the body to ashes, which can then be scattered, kept in an urn, interred in a cemetery, or placed in a columbarium. Cremation is generally less expensive and offers more flexibility for memorialization, while traditional burial provides a permanent physical location for remembrance.'
      },
      {
        q: 'When should I start funeral pre-planning?',
        a: 'It is never too early to start funeral pre-planning. Many people begin in their 50s or 60s, but you can start at any age. The earlier you plan, the more time you have to make thoughtful decisions without time pressure. Pre-planning also often means lower costs if you lock in today\'s prices through a pre-paid plan.'
      }
    ]
  }
];

const tips = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Compare multiple providers',
    description: 'Get quotes from several funeral homes and compare not just prices but also the services included.'
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Read the fine print',
    description: 'Understand exactly what is covered in any pre-paid plan, including any limitations or exclusions.'
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Consider future costs',
    description: 'Funeral costs rise over time. Pre-paying at today\'s prices can offer significant savings.'
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Plan early for peace of mind',
    description: 'The earlier you plan, the less stressful the process will be for you and your family.'
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Document your wishes',
    description: 'Write down your preferences and share them with family members and your funeral provider.'
  }
];

export default function FuneralPlanningPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Funeral Pre-Planning</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Funeral pre-planning ensures that your wishes are known and your loved ones are not burdened
          with difficult decisions during an already challenging time.
          On this page you will find information about funeral planning services and resources to help you make informed decisions.
        </p>
      </div>

      <LeaderboardAd />

      {/* Services Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Compare Funeral Services</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Compare different funeral service providers and find the option that best fits your needs.
            Click on a provider for more information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {funeralServices.map((service) => (
              <Card key={service.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                    {service.rating && (
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary">{service.rating}</div>
                        <div className="text-sm text-muted-foreground">★★★★★</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  {service.priceFrom && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Starting from <span className="font-semibold text-foreground">{service.priceFrom}</span>
                    </p>
                  )}
                  <Button asChild className="w-full">
                    <Link href={service.url} target="_blank" rel="noopener noreferrer">
                      Visit {service.name} <ExternalLink className="w-4 h-4 ml-2" />
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
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Below you will find answers to the most commonly asked questions about funeral planning.
            Don&apos;t see your question? Feel free to contact us.
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
            <CardTitle className="text-2xl">Need help choosing?</CardTitle>
            <CardDescription className="text-lg">
              Our team is happy to help you find the right funeral planning options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Button asChild variant="outline" size="lg">
                <Link href="mailto:info@cemeterynearbyme.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Email us
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact us
                </Link>
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              We typically respond within 24 hours.
            </p>
          </CardContent>
        </Card>
      </section>

      <InlineAd />

      {/* Tips Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Tips for Funeral Pre-Planning</h2>

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
