import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, MapPin, Leaf, Euro, Clock, Phone, ExternalLink } from 'lucide-react';
import InlineAd from '@/components/ads/InlineAd';

export const metadata: Metadata = {
  title: 'Dierenbegraafplaatsen in Nederland | Complete Gids 2025',
  description: 'Vind een dierenbegraafplaats in de buurt. Overzicht van alle dierenbegraafplaatsen en dierencrematoria in Nederland met locaties, prijzen en informatie.',
  keywords: 'dierenbegraafplaats, huisdier begraven, dierencrematorium, hond begraven, kat begraven, huisdier cremeren, dierbegraafplaats',
};

const dierenbegraafplaatsen = [
  {
    naam: 'Dierenbegraafplaats De Wildernis',
    locatie: 'Amersfoort, Utrecht',
    beschrijving: 'Natuurlijke dierenbegraafplaats in een bosrijke omgeving.',
    website: 'https://www.dierenbegraafplaatsdewildernis.nl',
  },
  {
    naam: 'Dierenbegraafplaats Houten',
    locatie: 'Houten, Utrecht',
    beschrijving: 'Sfeervolle begraafplaats voor huisdieren nabij Utrecht.',
    website: null,
  },
  {
    naam: 'Dierenbegraafplaats Steenwijk',
    locatie: 'Steenwijk, Overijssel',
    beschrijving: 'Rustgevende locatie voor het afscheid van uw huisdier.',
    website: null,
  },
  {
    naam: 'Dierenbegraafplaats Schimmert',
    locatie: 'Schimmert, Limburg',
    beschrijving: 'Huisdierbegrafenis in het Limburgse heuvelland.',
    website: null,
  },
  {
    naam: 'Dierenbegraafplaats Gerenal',
    locatie: 'Honselersdijk, Zuid-Holland',
    beschrijving: 'Begraafplaats voor huisdieren in het Westland.',
    website: null,
  },
  {
    naam: 'Natuurbegraafplaats voor Dieren',
    locatie: 'Diverse locaties',
    beschrijving: 'Ecologische begrafenis voor huisdieren in de natuur.',
    website: null,
  },
];

export default function DierenbegraafplaatsenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/info" className="hover:text-foreground">Info</Link></li>
            <li>/</li>
            <li className="text-foreground">Dierenbegraafplaatsen</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Dierenbegraafplaatsen in Nederland</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Een waardig afscheid voor uw trouwe viervoeter
        </p>

        {/* Intro Section */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-xl mb-3">Afscheid nemen van uw huisdier</h2>
              <p className="text-muted-foreground mb-4">
                Het verliezen van een huisdier is een emotionele gebeurtenis. Een dierenbegraafplaats
                biedt een waardige en respectvolle manier om afscheid te nemen van uw trouwe metgezel.
                In Nederland zijn er tientallen dierenbegraafplaatsen en dierencrematoria waar u terecht kunt.
              </p>
              <p className="text-muted-foreground">
                Op deze pagina vindt u informatie over dierenbegraafplaatsen, de mogelijkheden,
                kosten en wat u kunt verwachten.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Euro className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold">Kosten</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              De kosten voor een dierenbegrafenis variëren afhankelijk van:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Grootte van het huisdier (klein/groot)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Type graf (individueel of algemeen)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Grafmonument of -steen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Onderhoudskosten per jaar</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Gemiddeld: €150 - €600 voor een begrafenis
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold">Procedure</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Wat u kunt verwachten bij een dierenbegrafenis:
            </p>
            <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
              <li>Contact opnemen met dierenbegraafplaats</li>
              <li>Afspraken maken over datum en tijd</li>
              <li>Vervoer regelen (vaak mogelijk via begraafplaats)</li>
              <li>Eventueel afscheidsplechtigheid</li>
              <li>Begrafenis of crematie</li>
              <li>Plaatsen van gedenkteken (optioneel)</li>
            </ol>
          </Card>
        </div>

        <InlineAd />

        {/* Dierenbegraafplaatsen List */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Bekende Dierenbegraafplaatsen</h2>
          <div className="grid gap-4">
            {dierenbegraafplaatsen.map((plaats, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{plaats.naam}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{plaats.locatie}</span>
                    </div>
                    <p className="text-muted-foreground mt-2">{plaats.beschrijving}</p>
                  </div>
                  {plaats.website && (
                    <a
                      href={plaats.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Crematie vs Begraven */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Crematie of Begraven?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 border-primary/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-primary" />
                Dierenbegrafenis
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Vaste plek om te herdenken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Mogelijkheid voor grafmonument</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Natuurlijke terugkeer naar de aarde</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Hogere kosten (graf + onderhoud)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Gebonden aan locatie</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Dierencrematie
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>As meenemen naar huis mogelijk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Vaak goedkoper dan begraven</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Flexibel in herdenken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Geen fysieke rustplaats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Minder persoonlijk voor sommigen</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Praktische Informatie */}
        <section className="bg-muted/30 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6">Praktische Informatie</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Mag ik mijn huisdier thuis begraven?</h3>
              <p className="text-muted-foreground">
                In Nederland mag u uw huisdier begraven in uw eigen tuin, mits het dier niet aan
                een besmettelijke ziekte is overleden. Het graf moet minimaal 50 cm diep zijn.
                Controleer wel de lokale gemeentelijke regels, want deze kunnen per gemeente verschillen.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Wat te doen als uw huisdier overlijdt?</h3>
              <p className="text-muted-foreground">
                Neem contact op met uw dierenarts of een dierenbegraafplaats/crematorium.
                Zij kunnen u adviseren over de mogelijkheden en het vervoer regelen.
                De meeste dierencrematoria hebben een 24-uurs service voor ophalen.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Welke dieren kunnen begraven worden?</h3>
              <p className="text-muted-foreground">
                Op dierenbegraafplaatsen kunnen vrijwel alle huisdieren worden begraven:
                honden, katten, konijnen, cavia&apos;s, vogels, en soms ook paarden en andere grotere dieren.
                Neem contact op met de begraafplaats voor specifieke mogelijkheden.
              </p>
            </div>
          </div>
        </section>

        <InlineAd />

        {/* Uitgebreide Content voor SEO */}
        <article className="prose prose-lg max-w-none mb-8">
          <h2>De Geschiedenis van Dierenbegraafplaatsen</h2>
          <p>
            Dierenbegraafplaatsen bestaan al eeuwenlang. De oudste bekende dierenbegraafplaats
            ter wereld bevindt zich in Parijs en dateert uit 1899. In Nederland werden de eerste
            officiële dierenbegraafplaatsen in de jaren &apos;70 en &apos;80 van de vorige eeuw opgericht,
            als reactie op de groeiende behoefte om huisdieren een waardige laatste rustplaats te geven.
          </p>
          <p>
            Tegenwoordig zijn er in Nederland tientallen dierenbegraafplaatsen verspreid over het land.
            De populariteit is de laatste jaren sterk toegenomen, mede doordat huisdieren steeds vaker
            als volwaardig gezinslid worden beschouwd.
          </p>

          <h2>Soorten Dierenbegraafplaatsen</h2>
          <p>
            Er zijn verschillende soorten dierenbegraafplaatsen in Nederland:
          </p>
          <ul>
            <li>
              <strong>Traditionele dierenbegraafplaatsen:</strong> Vergelijkbaar met menselijke
              begraafplaatsen, met individuele graven en grafmonumenten.
            </li>
            <li>
              <strong>Natuurbegraafplaatsen voor dieren:</strong> Ecologische begraafplaatsen waar
              dieren in biologisch afbreekbare materialen worden begraven, zonder grafstenen.
            </li>
            <li>
              <strong>Gedenktuinen:</strong> Tuinen waar de as van gecremeerde dieren kan worden
              uitgestrooid of in een urn kan worden bijgezet.
            </li>
          </ul>

          <h2>Kosten van een Dierenbegrafenis in 2025</h2>
          <p>
            De kosten voor een dierenbegrafenis variëren sterk en zijn afhankelijk van verschillende factoren:
          </p>
          <ul>
            <li><strong>Klein huisdier</strong> (hamster, vogel, cavia): €50 - €150</li>
            <li><strong>Middelgroot huisdier</strong> (kat, klein hond): €150 - €350</li>
            <li><strong>Groot huisdier</strong> (grote hond): €300 - €600</li>
            <li><strong>Zeer groot dier</strong> (paard, pony): €500 - €1500</li>
          </ul>
          <p>
            Hierbij komen eventueel kosten voor een grafmonument (€50 - €500), jaarlijks grafonderhoud
            (€25 - €75 per jaar), en eventuele ceremoniële diensten.
          </p>

          <h2>Alternatieven voor de Dierenbegraafplaats</h2>
          <p>
            Naast begraven op een dierenbegraafplaats zijn er andere mogelijkheden:
          </p>
          <ul>
            <li><strong>Thuisbegrafenis:</strong> In uw eigen tuin (indien toegestaan)</li>
            <li><strong>Individuele crematie:</strong> As meenemen in urn of sieraad</li>
            <li><strong>Collectieve crematie:</strong> Goedkoper, as wordt uitgestrooid</li>
            <li><strong>Aquamatie:</strong> Watergebaseerde afbraak, milieuvriendelijk</li>
            <li><strong>Herinneringssieraden:</strong> Kleine hoeveelheid as verwerkt in sieraad</li>
          </ul>

          <h2>Tips voor het Kiezen van een Dierenbegraafplaats</h2>
          <p>
            Bij het kiezen van een dierenbegraafplaats zijn de volgende punten belangrijk:
          </p>
          <ol>
            <li><strong>Locatie:</strong> Kies een begraafplaats die goed bereikbaar is voor regelmatig bezoek</li>
            <li><strong>Sfeer:</strong> Bezoek de begraafplaats vooraf om de sfeer te ervaren</li>
            <li><strong>Kosten:</strong> Vraag een duidelijk overzicht van alle kosten</li>
            <li><strong>Onderhoud:</strong> Informeer naar het onderhoud en de verzorging</li>
            <li><strong>Grafrechten:</strong> Vraag naar de duur van de grafrechten</li>
            <li><strong>Regelgeving:</strong> Controleer welke regels er gelden voor grafmonumenten</li>
          </ol>
        </article>

        {/* CTA Section */}
        <div className="bg-primary/5 border border-primary/20 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Hulp nodig bij het vinden van een begraafplaats?</h2>
          <p className="text-muted-foreground mb-6">
            Neem contact met ons op als u meer informatie wilt over dierenbegraafplaatsen
            in uw regio, of bekijk ons overzicht van reguliere begraafplaatsen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Contact opnemen
              </Button>
            </Link>
            <Link href="/zoeken">
              <Button variant="outline" size="lg">
                <MapPin className="w-4 h-4 mr-2" />
                Zoek begraafplaatsen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
