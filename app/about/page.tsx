import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Heart, Target, Shield, Clock, ArrowRight, Sparkles, TreePine, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import InlineAd from '@/components/ads/InlineAd';

export const metadata: Metadata = {
  title: 'Over ons | Begraafplaats in de Buurt',
  description: 'Ontdek het verhaal achter Begraafplaats in de Buurt, de meest complete gids voor begraafplaatsen in Nederland.',
  openGraph: {
    title: 'Over Begraafplaats in de Buurt',
    description: 'Uw betrouwbare gids voor het vinden van begraafplaatsen in Nederland',
  },
};

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Over ons</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Over Begraafplaats in de Buurt
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            De meest complete en betrouwbare gids voor begraafplaatsen in Nederland,
            met zorg samengesteld om u te helpen in moeilijke tijden.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="p-8 shadow-soft mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Begraafplaats in de Buurt is ontstaan uit de behoefte aan een complete,
              betrouwbare en toegankelijke database van alle begraafplaatsen in Nederland.
              Wij geloven dat iedereen eenvoudig informatie moet kunnen vinden over
              begraafplaatsen in hun omgeving.
            </p>
          </Card>

          <InlineAd />

          {/* Mission Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-bold">Onze Missie</h2>
            </div>
            <Card className="p-6 shadow-soft bg-gradient-to-br from-forest-50 to-gold-50/50 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800">
              <p className="text-muted-foreground leading-relaxed">
                Wij streven ernaar om de meest complete en gebruiksvriendelijke bron
                te zijn voor informatie over begraafplaatsen in Nederland. Of u nu
                op zoek bent naar een laatste rustplaats voor een dierbare, historisch
                onderzoek doet, of gewoon meer wilt weten over begraafplaatsen in uw
                omgeving - wij zijn er om u te helpen.
              </p>
            </Card>
          </section>

          {/* What We Offer Section */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Wat Wij Bieden</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 shadow-soft border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-forest-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg mb-2">Complete Database</h3>
                    <p className="text-sm text-muted-foreground">
                      Meer dan 3.800 begraafplaatsen met actuele informatie over
                      openingstijden, faciliteiten en contactgegevens.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-soft border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-forest-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg mb-2">Met Zorg Samengesteld</h3>
                    <p className="text-sm text-muted-foreground">
                      Elke begraafplaats is zorgvuldig gedocumenteerd met respect
                      voor de gevoelige aard van deze informatie.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-soft border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-forest-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg mb-2">Altijd Actueel</h3>
                    <p className="text-sm text-muted-foreground">
                      We werken continu aan het actualiseren van informatie zoals
                      openingstijden en contactgegevens.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-soft border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-forest-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg mb-2">Privacy Eerst</h3>
                    <p className="text-sm text-muted-foreground">
                      We respecteren uw privacy en volgen strikt de AVG-richtlijnen
                      bij het verwerken van gegevens.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Onze Waarden</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 shadow-soft text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif font-semibold mb-2">Respect</h3>
                <p className="text-sm text-muted-foreground">
                  We behandelen dit onderwerp met het respect en de waardigheid die het verdient.
                </p>
              </Card>

              <Card className="p-6 shadow-soft text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif font-semibold mb-2">Toegankelijkheid</h3>
                <p className="text-sm text-muted-foreground">
                  Informatie moet voor iedereen gemakkelijk vindbaar en begrijpelijk zijn.
                </p>
              </Card>

              <Card className="p-6 shadow-soft text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif font-semibold mb-2">Betrouwbaarheid</h3>
                <p className="text-sm text-muted-foreground">
                  We streven naar 100% accurate en up-to-date informatie.
                </p>
              </Card>
            </div>
          </section>

          <InlineAd />

          {/* Founder Section */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Over de Oprichter</h2>
            <Card className="p-8 shadow-soft">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <img
                    src="/images/team/marvin-profiel-foto.webp"
                    alt="Marvin Smit - Oprichter van Begraafplaats in de Buurt"
                    className="aspect-square object-cover rounded-xl shadow-soft"
                    loading="lazy"
                  />
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-serif text-xl font-semibold mb-4">Marvin Smit</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Hallo, ik ben Marvin Smit, 36 jaar oud en woonachtig in het mooie Limburg.
                      Als gepassioneerd webontwikkelaar richt ik mij op het bouwen van informatieve
                      websites die echt waarde toevoegen voor gebruikers.
                    </p>
                    <p>
                      Het idee voor Begraafplaats in de Buurt ontstond in 2023 toen ik mijn geliefde
                      oma verloor. In die emotionele periode merkte ik hoe lastig het was om goede
                      informatie te vinden over begraafplaatsen in onze regio. Versnipperde informatie,
                      verouderde openingstijden, en websites die al jaren niet meer bijgewerkt waren.
                    </p>
                    <p>
                      Als webontwikkelaar dacht ik: &quot;Dit moet beter kunnen.&quot; Wat begon als een
                      persoonlijk project om mijn familie te helpen, groeide uit tot deze landelijke
                      database. Ik besteedde maanden aan het verzamelen, verifiëren en verrijken van
                      informatie over meer dan 3.800 begraafplaatsen.
                    </p>
                    <p>
                      Mijn doel is simpel: niemand zou in moeilijke tijden ook nog eens uren moeten
                      zoeken naar praktische informatie. Met Begraafplaats in de Buurt wil ik een
                      betrouwbare, respectvolle bron bieden die families helpt in hun zoektocht naar
                      een waardige laatste rustplaats.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Quote Section */}
          <Card className="p-8 shadow-soft bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800 mb-16">
            <div className="flex items-start gap-4">
              <Quote className="w-8 h-8 text-accent shrink-0" />
              <div>
                <p className="text-lg font-medium text-foreground mb-4 italic">
                  &quot;Samen maken we informatie over begraafplaatsen toegankelijk voor iedereen&quot;
                </p>
                <p className="text-sm text-muted-foreground">
                  - Marvin Smit, oprichter Begraafplaats in de Buurt
                </p>
              </div>
            </div>
          </Card>

          {/* Future Vision Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-bold">Toekomstvisie</h2>
            </div>
            <Card className="p-6 shadow-soft">
              <p className="text-muted-foreground mb-6">
                We blijven continu werken aan het verbeteren van onze dienstverlening.
                In de toekomst willen we:
              </p>
              <ul className="space-y-3">
                {[
                  'Interactieve kaarten toevoegen voor betere navigatie',
                  'Historische informatie uitbreiden met archiefmateriaal',
                  'Een platform bieden voor het delen van herinneringen',
                  'Samenwerken met genealogische onderzoekers',
                  'Uitbreiden naar België en Duitsland',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
                      <TreePine className="w-3 h-3 text-forest-700" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Collaboration Section */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Samenwerking</h2>
            <Card className="p-6 shadow-soft">
              <p className="text-muted-foreground mb-4">
                Beheert u een begraafplaats of heeft u aanvullende informatie?
                We staan altijd open voor samenwerking om onze database te verbeteren
                en uit te breiden.
              </p>
              <p className="text-muted-foreground mb-6">
                Neem gerust contact met ons op via{' '}
                <Link href="/contact" className="text-accent hover:underline font-medium">
                  ons contactformulier
                </Link>{' '}
                of stuur een e-mail naar{' '}
                <a href="mailto:info@begraafplaatsindebuurt.nl" className="text-accent hover:underline font-medium">
                  info@begraafplaatsindebuurt.nl
                </a>.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Neem contact op
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          </section>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Begin uw zoektocht
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Ontdek de meer dan 3.800 begraafplaatsen in onze database en vind de informatie die u zoekt.
            </p>
            <Link
              href="/zoeken"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Zoek begraafplaatsen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
