'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Hoeveel begraafplaatsen zijn er in Nederland?",
    answer: "Nederland telt meer dan 3.800 begraafplaatsen, verspreid over alle 12 provincies. Deze variëren van grote stedelijke begraafplaatsen tot kleine dorpskerkhoven."
  },
  {
    question: "Wat kost een begrafenis in Nederland?",
    answer: "De kosten voor een begrafenis variëren sterk, gemiddeld tussen €5.000 en €10.000. Dit hangt af van de locatie, type graf, grafrechten (10-30 jaar) en uitvaartverzorging. Crematie is meestal goedkoper dan begraven."
  },
  {
    question: "Wat is het verschil tussen een algemene en bijzondere begraafplaats?",
    answer: "Algemene begraafplaatsen worden beheerd door gemeenten en staan open voor iedereen. Bijzondere begraafplaatsen worden beheerd door religieuze gemeenschappen of stichtingen en kunnen specifieke toegangseisen hebben."
  },
  {
    question: "Kan ik zelf een begraafplaats kiezen?",
    answer: "Ja, u kunt in principe elke begraafplaats in Nederland kiezen. Sommige gemeenten hanteren wel hogere tarieven voor niet-inwoners. Bijzondere begraafplaatsen kunnen lidmaatschapseisen hebben."
  },
  {
    question: "Wat zijn natuurbegraafplaatsen?",
    answer: "Natuurbegraafplaatsen zijn begraafplaatsen waar de natuur centraal staat. Er worden alleen biologisch afbreekbare materialen gebruikt en graven worden gemarkeerd met natuurlijke elementen in plaats van traditionele grafstenen."
  },
  {
    question: "Hoe lang gaan grafrechten mee?",
    answer: "Grafrechten worden meestal uitgegeven voor 10, 20 of 30 jaar. Na afloop kunt u de rechten verlengen. De kosten en termijnen verschillen per gemeente en begraafplaats."
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // JSON-LD structured data for FAQ
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

  return (
    <section className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Veelgestelde vragen</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4 pt-0">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}