import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Download Gratis Gids | Begraafplaats in de Buurt',
  description: 'Download binnenkort onze gratis gids voor nabestaanden met praktische informatie over uitvaarten, kosten en juridische zaken.',
};

export default function DownloadGidsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">
              De Complete Gids voor Nabestaanden
            </h1>
            
            <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Binnenkort beschikbaar</span>
            </div>
          </div>

          <div className="prose prose-gray max-w-none mb-8">
            <p className="text-lg text-gray-700">
              We werken hard aan onze uitgebreide gids voor nabestaanden. 
              Deze gratis PDF zal u helpen met alle praktische en emotionele 
              aspecten rondom een overlijden.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">
              Wat kunt u verwachten in de gids?
            </h2>
            
            <ul className="space-y-2 text-gray-700">
              <li>✓ Stap-voor-stap uitvaartplanning</li>
              <li>✓ Volledig kostenoverzicht en besparingstips</li>
              <li>✓ Juridische zaken en formaliteiten uitgelegd</li>
              <li>✓ Emotionele ondersteuning en rouwverwerking</li>
              <li>✓ Praktische checklists en formulieren</li>
              <li>✓ Contactgegevens van hulporganisaties</li>
            </ul>
          </div>

          <Card className="bg-primary/5 border-primary/20 p-6 mb-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Wilt u een melding ontvangen?
            </h3>
            <p className="text-gray-700 mb-4">
              Laat uw e-mailadres achter en we sturen u een bericht zodra 
              de gids beschikbaar is voor download.
            </p>
            <Button disabled className="w-full sm:w-auto">
              Notificatie functie komt binnenkort
            </Button>
          </Card>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Ondertussen kunt u onze website verkennen voor informatie over:
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/provincie">
                <Button variant="outline">
                  Begraafplaatsen per provincie
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline">
                  Informatieve artikelen
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  Zoek een begraafplaats
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}