import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, FileText, Flower2 } from 'lucide-react';

interface AffiliatePartner {
  name: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  href: string;
  tag?: string;
}

const partners: AffiliatePartner[] = [
  {
    name: 'Uitvaartverzekeringen vergelijken',
    description: 'Vergelijk eenvoudig uitvaartverzekeringen en bespaar op uw premie',
    icon: <FileText className="w-6 h-6" />,
    ctaText: 'Vergelijk verzekeringen',
    href: '#',
    tag: 'Partner'
  },
  {
    name: 'Lokale uitvaartondernemers',
    description: 'Vind betrouwbare uitvaartondernemers in uw regio',
    icon: <Phone className="w-6 h-6" />,
    ctaText: 'Vraag offerte aan',
    href: '#',
    tag: 'Aanbevolen'
  },
  {
    name: 'Online bloemen bestellen',
    description: 'Bestel rouwbloemen en kransen voor de uitvaart',
    icon: <Flower2 className="w-6 h-6" />,
    ctaText: 'Bekijk assortiment',
    href: '#',
  }
];

export default function AffiliateSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Nuttige diensten voor nabestaanden</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Wij werken samen met betrouwbare partners om u te helpen in moeilijke tijden. 
            Ontdek diensten die u kunnen ondersteunen bij het regelen van een uitvaart.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {partner.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{partner.name}</h3>
                  {partner.tag && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {partner.tag}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {partner.description}
              </p>
              
              <Button 
                variant="outline" 
                className="w-full group"
                asChild
              >
                <Link href={partner.href} target="_blank" rel="noopener noreferrer">
                  {partner.ctaText}
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            * Sommige links zijn partnerlinks. Bij aankoop via deze links ontvangen wij mogelijk een kleine vergoeding.
          </p>
        </div>
      </div>
    </section>
  );
}