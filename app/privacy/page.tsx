import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Begraafplaats in de Buurt',
  description: 'Privacy policy van Begraafplaats in de Buurt. Lees hoe wij omgaan met uw gegevens.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li className="text-foreground">Privacy Policy</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introductie</h2>
          <p className="mb-4">
            Begraafplaats in de Buurt respecteert uw privacy en is toegewijd aan het beschermen van uw persoonlijke gegevens. 
            Deze privacy policy informeert u over hoe wij omgaan met uw persoonlijke gegevens wanneer u onze website bezoekt.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Welke gegevens verzamelen wij?</h2>
          <p className="mb-4">Wij verzamelen minimale gegevens om onze dienst te kunnen aanbieden:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Technische gegevens zoals IP-adres, browsertype en apparaatinformatie</li>
            <li>Gebruiksgegevens zoals bezochte pagina&apos;s en zoektermen</li>
            <li>Cookies voor het verbeteren van de gebruikerservaring</li>
          </ul>
          <p className="mb-4">
            Wij verzamelen geen persoonlijk identificeerbare informatie tenzij u deze vrijwillig aan ons verstrekt 
            (bijvoorbeeld bij het versturen van een e-mail).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Hoe gebruiken wij deze gegevens?</h2>
          <p className="mb-4">De verzamelde gegevens worden gebruikt voor:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Het verbeteren van onze website en dienstverlening</li>
            <li>Het analyseren van websiteverkeer en gebruikersgedrag</li>
            <li>Het waarborgen van de veiligheid van onze website</li>
            <li>Het voldoen aan wettelijke verplichtingen</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
          <p className="mb-4">
            Onze website gebruikt cookies om uw gebruikerservaring te verbeteren. Dit zijn kleine tekstbestanden die op 
            uw apparaat worden opgeslagen. U kunt cookies weigeren of verwijderen via uw browserinstellingen, maar dit 
            kan de functionaliteit van de website beïnvloeden.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Gegevensbeveiliging</h2>
          <p className="mb-4">
            Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen 
            ongeautoriseerde toegang, verlies of misbruik. Onze website gebruikt HTTPS-encryptie voor veilige 
            gegevensoverdracht.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Delen van gegevens</h2>
          <p className="mb-4">
            Wij verkopen, verhuren of delen uw persoonlijke gegevens niet met derden voor marketingdoeleinden. 
            Gegevens worden alleen gedeeld wanneer dit wettelijk verplicht is of noodzakelijk voor de werking van onze dienst.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Uw rechten</h2>
          <p className="mb-4">Onder de AVG heeft u de volgende rechten:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Recht op inzage van uw gegevens</li>
            <li>Recht op correctie van onjuiste gegevens</li>
            <li>Recht op verwijdering van gegevens</li>
            <li>Recht op beperking van de verwerking</li>
            <li>Recht op gegevensoverdraagbaarheid</li>
            <li>Recht van bezwaar</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
          <p className="mb-4">
            Voor vragen over deze privacy policy of het uitoefenen van uw rechten kunt u contact met ons opnemen via:
          </p>
          <p className="mb-4">
            E-mail: <a href="mailto:info@begraafplaatsindebuurt.nl" className="text-primary hover:underline">info@begraafplaatsindebuurt.nl</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Wijzigingen</h2>
          <p className="mb-4">
            Wij behouden ons het recht voor om deze privacy policy te wijzigen. Significante wijzigingen worden op 
            onze website gecommuniceerd. Wij adviseren u om deze pagina regelmatig te controleren.
          </p>
        </section>
      </div>
    </div>
  );
}