import Link from 'next/link';
import { Shield, Info, TrendingUp, FileText, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';

export default function UitvaartverzekeringInfoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm mb-8">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
          <li className="text-muted-foreground">/</li>
          <li><Link href="/info" className="text-muted-foreground hover:text-foreground">Informatie</Link></li>
          <li className="text-muted-foreground">/</li>
          <li className="text-foreground">Uitvaartverzekering</li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Alles over uitvaartverzekeringen</h1>
          <p className="text-xl text-muted-foreground">
            Een complete gids over uitvaartverzekeringen in Nederland. Ontdek wat een uitvaartverzekering is, 
            waarom het belangrijk is, en hoe u de beste keuze maakt voor u en uw dierbaren.
          </p>
        </header>

        <LeaderboardAd />

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Wat is een uitvaartverzekering?</h2>
            <p className="text-lg leading-relaxed mb-4">
              Een uitvaartverzekering is een speciale verzekering die de kosten van een uitvaart dekt wanneer de verzekerde 
              komt te overlijden. Het hoofddoel is om nabestaanden financieel te ontlasten in een emotioneel zware periode.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              In Nederland kost een gemiddelde uitvaart tussen de €7.000 en €12.000, afhankelijk van de wensen en keuzes. 
              Een uitvaartverzekering zorgt ervoor dat deze kosten gedekt zijn, zodat nabestaanden zich kunnen focussen 
              op het afscheid nemen zonder financiële zorgen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Soorten uitvaartverzekeringen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Kapitaalverzekering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Bij overlijden wordt een vooraf afgesproken bedrag uitgekeerd aan de nabestaanden. 
                    Zij kunnen dit bedrag vrij besteden aan de uitvaart.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Vrije keuze uitvaartondernemer</li>
                    <li>Flexibiliteit in uitvaartwensen</li>
                    <li>Eventueel overschot voor nabestaanden</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Natura-verzekering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    De verzekeraar regelt en betaalt de complete uitvaart volgens vooraf gemaakte afspraken. 
                    Er wordt geen geld uitgekeerd.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Uitvaart volledig geregeld</li>
                    <li>Geen financiële afhandeling</li>
                    <li>Zekerheid over uitvoering wensen</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <InlineAd />

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Waarom een uitvaartverzekering afsluiten?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Nabestaanden ontlasten</h3>
                  <p>Uw dierbaren hoeven zich geen zorgen te maken over de financiële kant van de uitvaart.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Wensen vastleggen</h3>
                  <p>U kunt vooraf uw uitvaartwensen vastleggen, zodat deze uitgevoerd worden zoals u dat wilt.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Inflatiebescherming</h3>
                  <p>Veel verzekeringen groeien mee met de inflatie, waardoor de dekking actueel blijft.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Financiële zekerheid</h3>
                  <p>U weet zeker dat er geld is voor een waardige uitvaart, ongeacht de financiële situatie.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Kosten van een uitvaart in 2024</h2>
            
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                De gemiddelde uitvaartkosten in Nederland liggen tussen de €7.000 en €12.000. 
                Dit bedrag kan sterk variëren afhankelijk van persoonlijke wensen.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Kostenopbouw uitvaart</CardTitle>
                <CardDescription>Gemiddelde prijzen in 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Uitvaartkist</span>
                    <span className="font-semibold">€800 - €3.000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rouwauto en vervoer</span>
                    <span className="font-semibold">€300 - €600</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Opbaring en verzorging</span>
                    <span className="font-semibold">€450 - €750</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Uitvaartplechtigheid</span>
                    <span className="font-semibold">€500 - €1.500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Bloemen</span>
                    <span className="font-semibold">€200 - €800</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rouwkaarten en advertenties</span>
                    <span className="font-semibold">€300 - €600</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Catering en koffietafel</span>
                    <span className="font-semibold">€400 - €1.200</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Graf of crematie</span>
                    <span className="font-semibold">€1.200 - €3.000</span>
                  </li>
                  <li className="border-t pt-3 flex justify-between font-bold">
                    <span>Totaal</span>
                    <span>€4.150 - €12.450</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <InlineAd />

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Wanneer afsluiten?</h2>
            
            <div className="bg-muted/50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-3">De beste leeftijd</h3>
              <p className="mb-4">
                Het is het voordeligst om een uitvaartverzekering af te sluiten op jonge leeftijd. 
                De premie wordt namelijk bepaald op basis van uw leeftijd bij het afsluiten en blijft daarna meestal gelijk.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary mb-1">25-35 jaar</div>
                    <div className="text-sm">€5-10 per maand</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary mb-1">45-55 jaar</div>
                    <div className="text-sm">€15-25 per maand</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary mb-1">65+ jaar</div>
                    <div className="text-sm">€30-50 per maand</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Tips voor het kiezen</h2>
            
            <div className="space-y-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">1. Bepaal het verzekerde bedrag</h3>
                  <p className="text-muted-foreground">
                    Denk na over het type uitvaart dat u wilt en maak een inschatting van de kosten. 
                    Houd rekening met inflatie.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">2. Vergelijk meerdere aanbieders</h3>
                  <p className="text-muted-foreground">
                    Vraag offertes aan bij verschillende verzekeraars en vergelijk niet alleen de premie, 
                    maar ook de voorwaarden en extra services.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">3. Let op de kleine lettertjes</h3>
                  <p className="text-muted-foreground">
                    Controleer de wachttijd, uitsluitingen en of de verzekering wereldwijde dekking biedt.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">4. Overweeg extra opties</h3>
                  <p className="text-muted-foreground">
                    Sommige verzekeraars bieden extra diensten zoals uitvaartbegeleiding of het vastleggen 
                    van uitvaartwensen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Veelgestelde misverstanden</h2>
            
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>&quot;Ik ben al verzekerd via mijn werkgever&quot;</strong><br />
                Collectieve verzekeringen via werkgevers zijn vaak onvoldoende en vervallen bij pensionering.
              </AlertDescription>
            </Alert>

            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>&quot;Mijn nabestaanden hebben genoeg geld&quot;</strong><br />
                Een uitvaartverzekering gaat niet alleen om geld, maar ook om het vastleggen van wensen 
                en het ontzorgen van nabestaanden.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>&quot;Ik ben te oud voor een uitvaartverzekering&quot;</strong><br />
                De meeste verzekeraars accepteren aanvragen tot 80-85 jaar. Er zijn zelfs speciale 
                seniorenverzekeringen beschikbaar.
              </AlertDescription>
            </Alert>
          </section>
        </div>

        <div className="bg-primary/5 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Klaar om een uitvaartverzekering af te sluiten?</h2>
          <p className="mb-6 text-muted-foreground">
            Vergelijk de beste uitvaartverzekeraars en vind de verzekering die bij u past.
          </p>
          <Button asChild size="lg">
            <Link href="/uitvaartverzekering">
              Vergelijk uitvaartverzekeringen
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}