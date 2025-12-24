import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Info, Church, Search, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rooms-Katholieke Begraafplaatsen | Begraafplaats in de Buurt',
  description: 'Informatie over Rooms-Katholieke begraafplaatsen in Nederland en hoe u deze kunt vinden op onze website.',
};

export default function RoomsKatholiekeBegraafplaatsenInfo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Rooms-Katholieke Begraafplaatsen</h1>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-lg mb-2">Hoe vind ik Rooms-Katholieke begraafplaatsen?</h2>
              <p className="text-muted-foreground mb-4">
                Rooms-Katholieke begraafplaatsen zijn in onze database opgenomen onder de categorie 
                &quot;Algemene begraafplaats&quot;. Dit komt omdat veel katholieke begraafplaatsen tegenwoordig 
                ook open staan voor mensen van andere gezindten.
              </p>
              <p className="text-muted-foreground">
                U kunt katholieke begraafplaatsen vinden door te zoeken op namen zoals:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>&quot;R.K. Begraafplaats&quot;</li>
                <li>&quot;Rooms-Katholieke Begraafplaats&quot;</li>
                <li>&quot;Katholiek Kerkhof&quot;</li>
                <li>&quot;Parochie&quot; begraafplaats</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Church className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold">Over Katholieke Begraafplaatsen</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Nederland kent honderden rooms-katholieke begraafplaatsen, vaak gelegen bij parochiekerken. 
              Deze begraafplaatsen hebben een rijke geschiedenis en zijn vaak fraai aangelegd met 
              karakteristieke grafmonumenten.
            </p>
            <p className="text-muted-foreground">
              Traditioneel worden katholieke begraafplaatsen beheerd door de plaatselijke parochie 
              of door een stichting namens de parochie.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold">Locaties</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Katholieke begraafplaatsen zijn door heel Nederland te vinden, met name in:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Noord-Brabant (traditioneel katholiek gebied)</li>
              <li>Limburg</li>
              <li>Delen van Gelderland</li>
              <li>Twente en de Achterhoek</li>
              <li>West-Friesland</li>
            </ul>
          </Card>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg text-center mb-8">
          <h3 className="text-2xl font-semibold mb-4">Zoek naar Katholieke Begraafplaatsen</h3>
          <p className="text-muted-foreground mb-6">
            Gebruik onze zoekfunctie om katholieke begraafplaatsen in uw omgeving te vinden
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/zoeken?q=r.k.">
              <Button size="lg">
                <Search className="w-4 h-4 mr-2" />
                Zoek &quot;R.K.&quot;
              </Button>
            </Link>
            <Link href="/zoeken?q=katholiek">
              <Button variant="outline" size="lg">
                <Search className="w-4 h-4 mr-2" />
                Zoek &quot;Katholiek&quot;
              </Button>
            </Link>
            <Link href="/zoeken?q=parochie">
              <Button variant="outline" size="lg">
                <Search className="w-4 h-4 mr-2" />
                Zoek &quot;Parochie&quot;
              </Button>
            </Link>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Geschiedenis van Katholieke Begraafplaatsen</h2>
          <p>
            De geschiedenis van katholieke begraafplaatsen in Nederland gaat terug tot de 
            middeleeuwen. Na de Reformatie werden katholieken vaak uitgesloten van protestantse 
            kerkhoven, waardoor eigen katholieke begraafplaatsen noodzakelijk werden.
          </p>
          <p>
            In de 19e eeuw, na het herstel van de bisschoppelijke hiërarchie in 1853, ontstonden 
            veel van de huidige katholieke begraafplaatsen. Deze werden vaak aangelegd volgens 
            strikte religieuze voorschriften, met gewijde grond en aparte secties voor 
            ongedoopte kinderen.
          </p>
          
          <h2>Kenmerken van Katholieke Begraafplaatsen</h2>
          <ul>
            <li>Vaak een centraal kruis of calvarie</li>
            <li>Gewijde grond</li>
            <li>Traditionele grafmonumenten met religieuze symboliek</li>
            <li>Aparte priestergrafvelden</li>
            <li>Vaak gelegen bij of nabij de parochiekerk</li>
          </ul>
          
          <h2>Moderne Ontwikkelingen</h2>
          <p>
            Tegenwoordig staan veel katholieke begraafplaatsen ook open voor niet-katholieken. 
            De strikte scheiding tussen verschillende gezindten is grotendeels verdwenen, 
            hoewel de katholieke identiteit vaak zichtbaar blijft in de aanleg en het beheer.
          </p>
        </div>
      </div>
    </div>
  );
}