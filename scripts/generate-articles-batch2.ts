#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { getCemeteryLink, getMunicipalityLink, getTypeLink } from '../lib/blog-data';

// Generate second batch of blog articles
const generateBatch2 = () => {
  // Article 6: digitaal-herdenken
  const artikel6 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        De digitale revolutie heeft ook het herdenken veranderd. Van QR-codes op grafstenen tot uitgebreide online herdenkingspagina's - technologie biedt nieuwe manieren om dierbaren te eren en herinneringen levend te houden. Ontdek hoe digitaal herdenken werkt en wat de mogelijkheden zijn.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="QR-code op moderne grafsteen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">💻 De opkomst van digitaal herdenken</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Digitaal herdenken is de afgelopen jaren explosief gegroeid. Waar vroeger alleen fysieke monumenten en fotoalbums herinneringen bewaarden, bieden digitale platforms nu ongekende mogelijkheden om het leven van overledenen te vieren en herinneringen te delen met mensen over de hele wereld.
            </p>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Waarom kiezen mensen voor digitaal herdenken?</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🌍</span>
                  <span><strong>Wereldwijd bereikbaar:</strong> Familie en vrienden kunnen van overal ter wereld deelnemen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">♾️</span>
                  <span><strong>Onbeperkte ruimte:</strong> Duizenden foto's, video's en verhalen bewaren</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🔄</span>
                  <span><strong>Altijd actueel:</strong> Nieuwe herinneringen blijven toevoegen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">💬</span>
                  <span><strong>Interactief:</strong> Bezoekers kunnen condoleances en herinneringen delen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📱 QR-codes op grafstenen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Een van de meest zichtbare vormen van digitaal herdenken is de QR-code op grafstenen. Deze kleine vierkante codes verbinden het fysieke monument met een digitale wereld van herinneringen.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Hoe werkt het?</h3>
              <ol class="space-y-2 text-gray-700">
                <li>1. QR-code wordt aangebracht op grafsteen</li>
                <li>2. Bezoeker scant code met smartphone</li>
                <li>3. Automatisch doorverwijzing naar herdenkingspagina</li>
                <li>4. Toegang tot foto's, verhalen en informatie</li>
              </ol>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voordelen QR-codes:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>✓ Weerbestendig en duurzaam</li>
                <li>✓ Klein en discreet</li>
                <li>✓ Eenvoudig te gebruiken</li>
                <li>✓ Koppeling aanpasbaar</li>
                <li>✓ Privacy-instellingen mogelijk</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p class="text-gray-700">
              <strong>Let op:</strong> Niet alle begraafplaatsen staan QR-codes toe. Informeer eerst bij de beheerder van uw <a href="${getMunicipalityLink('Amsterdam')}" class="text-blue-600 hover:text-blue-800 underline">lokale begraafplaats</a>.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Online herdenkingspagina op laptop" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌐 Online herdenkingspagina's</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Online herdenkingspagina's zijn uitgebreide digitale monumenten waar het complete levensverhaal van de overledene kan worden gedeeld.
            </p>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Standaard functies:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-gray-700">
                    <li>• Levensverhaal en biografie</li>
                    <li>• Fotogalerij met albums</li>
                    <li>• Video's en audio-opnames</li>
                    <li>• Tijdlijn belangrijke gebeurtenissen</li>
                    <li>• Condoleanceregister</li>
                  </ul>
                  <ul class="space-y-1 text-gray-700">
                    <li>• Kaarsjes ontsteken</li>
                    <li>• Bloemen plaatsen (virtueel)</li>
                    <li>• Gastenboek voor herinneringen</li>
                    <li>• Stamboom koppeling</li>
                    <li>• Sociale media integratie</li>
                  </ul>
                </div>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Geavanceerde mogelijkheden:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• 360° foto's van begraafplaats</li>
                  <li>• Livestream van herdenkingsdiensten</li>
                  <li>• AI-chatbot met herinneringen</li>
                  <li>• Virtuele rondleiding leven overledene</li>
                  <li>• Donatiemogelijkheid voor goed doel</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💸 Kosten digitaal herdenken</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De kosten voor digitaal herdenken variëren sterk, van gratis basisopties tot uitgebreide betaalde diensten.
          </p>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type dienst</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kosten</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kenmerken</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">Gratis platforms</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€0</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Basis functies, advertenties, beperkte opslag</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">QR-code dienst</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€50-200 eenmalig</td>
                  <td class="px-4 py-2 text-sm text-gray-700">QR-code + basis herdenkingspagina</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">Premium pagina</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€5-25/maand</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Uitgebreide functies, geen advertenties</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">Eeuwigdurend</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€500-2000 eenmalig</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Levenslange hosting, alle functies</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Sociale media herdenking" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📲 Sociale media en herdenken</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Sociale media platforms spelen een steeds grotere rol in het moderne rouwproces en herdenken.
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Facebook</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Herdenkingsstatus voor profielen</li>
                  <li>• Contactpersoon kan profiel beheren</li>
                  <li>• Vrienden kunnen herinneringen delen</li>
                  <li>• Jaarlijkse herinneringen</li>
                </ul>
              </div>
              
              <div class="bg-pink-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Instagram</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Herdenkingsaccount mogelijk</li>
                  <li>• Posts blijven zichtbaar</li>
                  <li>• Geen nieuwe volgers</li>
                  <li>• Familie kan verwijdering vragen</li>
                </ul>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">LinkedIn</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Profiel wordt gesloten</li>
                  <li>• Connecties krijgen bericht</li>
                  <li>• Professionele nalatenschap</li>
                  <li>• Artikelen blijven online</li>
                </ul>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Groepen voor nabestaanden</li>
                  <li>• Laatste online zichtbaar</li>
                  <li>• Berichten bewaard</li>
                  <li>• Media delen mogelijk</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🎥 Nieuwe technologieën</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De toekomst van digitaal herdenken wordt gevormd door opkomende technologieën die de grens tussen fysiek en digitaal vervagen.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-purple-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">🥽</div>
              <h3 class="font-semibold text-gray-900 mb-1">Virtual Reality</h3>
              <p class="text-sm text-gray-700">Virtuele begraafplaats bezoeken, 3D herinneringen beleven</p>
            </div>
            
            <div class="bg-indigo-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">🤖</div>
              <h3 class="font-semibold text-gray-900 mb-1">AI Chatbots</h3>
              <p class="text-sm text-gray-700">Gesprekken met digitale versie overledene</p>
            </div>
            
            <div class="bg-pink-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">📹</div>
              <h3 class="font-semibold text-gray-900 mb-1">Hologrammen</h3>
              <p class="text-sm text-gray-700">3D projecties tijdens herdenkingen</p>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">⛓️</div>
              <h3 class="font-semibold text-gray-900 mb-1">Blockchain</h3>
              <p class="text-sm text-gray-700">Eeuwige, onveranderlijke herinneringen</p>
            </div>
            
            <div class="bg-yellow-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">🧬</div>
              <h3 class="font-semibold text-gray-900 mb-1">DNA opslag</h3>
              <p class="text-sm text-gray-700">Digitale data in DNA bewaren</p>
            </div>
            
            <div class="bg-red-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">🎭</div>
              <h3 class="font-semibold text-gray-900 mb-1">Deepfakes</h3>
              <p class="text-sm text-gray-700">Video's met overledene genereren</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🔒 Privacy en ethiek</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Digitaal herdenken roept belangrijke vragen op over privacy, eigendom en ethiek.
          </p>
          
          <div class="space-y-4">
            <div class="bg-red-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">⚠️ Privacy overwegingen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Wie heeft toegang tot de informatie?</li>
                <li>• Wat gebeurt er met persoonlijke data?</li>
                <li>• Kunnen foto's worden gedownload?</li>
                <li>• Wie beheert het account na overlijden?</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📜 Juridische aspecten:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Digitale nalatenschap in testament opnemen</li>
                <li>• Wachtwoorden veilig bewaren</li>
                <li>• Beheerder aanwijzen</li>
                <li>• Auteursrechten foto's en video's</li>
              </ul>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">✅ Best practices:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Bespreek wensen bij leven</li>
                <li>• Maak duidelijke afspraken</li>
                <li>• Respecteer privacy anderen</li>
                <li>• Wees selectief met delen</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">💡 Tips voor digitaal herdenken</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voor nabestaanden:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Begin klein, bouw geleidelijk uit</li>
                <li>✓ Vraag familie om bijdragen</li>
                <li>✓ Maak back-ups van alles</li>
                <li>✓ Kies platform zorgvuldig</li>
                <li>✓ Denk aan lange termijn</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voor bezoekers:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Deel positieve herinneringen</li>
                <li>✓ Respecteer privacy familie</li>
                <li>✓ Vraag toestemming voor foto's</li>
                <li>✓ Wees voorzichtig met delen</li>
                <li>✓ Meld ongepast gedrag</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌍 Digitaal herdenken wereldwijd</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Verschillende culturen omarmen digitaal herdenken op hun eigen manier:
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Azië</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• <strong>China:</strong> Qingming online rituelen</li>
                <li>• <strong>Japan:</strong> Digitale altaren</li>
                <li>• <strong>Korea:</strong> Virtual memorial parks</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Amerika</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• <strong>VS:</strong> Legacy.com grootste platform</li>
                <li>• <strong>Mexico:</strong> Digitale Día de Muertos</li>
                <li>• <strong>Brazilië:</strong> WhatsApp herdenkingen</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">De toekomst van herinneren</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Digitaal herdenken is geen vervanging voor traditionele vormen van rouw en herinnering, maar een waardevolle aanvulling. Het biedt mogelijkheden die fysieke monumenten niet kunnen bieden: onbeperkte ruimte voor herinneringen, wereldwijde toegankelijkheid, en de mogelijkheid om het levensverhaal van dierbaren voor altijd te bewaren.
          </p>
          <p class="text-gray-700">
            Of u nu kiest voor een eenvoudige QR-code op een grafsteen bij een <a href="${getCemeteryLink('Nieuwe Oosterbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">traditionele begraafplaats</a> of een uitgebreide online herdenkingspagina, digitaal herdenken helpt de herinnering aan dierbaren levend te houden voor toekomstige generaties.
          </p>
        </div>
      </section>
    </div>
  `;

  // Article 7: grafmonumenten-onderhoud-complete-gids
  const artikel7 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Een grafmonument is meer dan een markering - het is een blijvende herinnering aan een dierbare. Goed onderhoud zorgt ervoor dat deze herinnering waardig en mooi blijft. Deze complete gids helpt u bij het onderhouden van grafmonumenten, van eenvoudige reiniging tot professionele restauratie.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Onderhoud van historisch grafmonument" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🪦 Waarom onderhoud belangrijk is</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Grafmonumenten staan bloot aan weer en wind, vervuiling en natuurlijke veroudering. Zonder regelmatig onderhoud kunnen ze beschadigd raken, onleesbaar worden of zelfs instorten. Goed onderhoud is niet alleen een teken van respect, maar voorkomt ook dure reparaties.
            </p>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Voordelen van regelmatig onderhoud:</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">✓</span>
                  <span><strong>Behoud waarde:</strong> Monument blijft mooi en waardig</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">✓</span>
                  <span><strong>Preventie:</strong> Kleine problemen worden geen grote schade</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">✓</span>
                  <span><strong>Leesbaarheid:</strong> Inscripties blijven zichtbaar</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">✓</span>
                  <span><strong>Veiligheid:</strong> Voorkomt omvallen of afbrokkelen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">✓</span>
                  <span><strong>Historie:</strong> Bewaren voor toekomstige generaties</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🧽 Basis reiniging per materiaal</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Verschillende materialen vragen om verschillende aanpak. Gebruik altijd de juiste methode voor het materiaal van uw monument.
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🪨 Graniet</h3>
              <p class="text-gray-700 mb-2">Graniet is hard en duurzaam, relatief makkelijk schoon te maken.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Benodigdheden:</strong> Zachte borstel, water, neutrale zeep</li>
                <li><strong>Werkwijze:</strong> Nat maken, zacht borstelen, afspoelen met schoon water</li>
                <li><strong>Frequentie:</strong> 2-4x per jaar</li>
                <li><strong>Vermijd:</strong> Hogedrukreinigers, zure schoonmaakmiddelen</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">⬜ Marmer</h3>
              <p class="text-gray-700 mb-2">Marmer is zachter en gevoeliger voor zuren.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Benodigdheden:</strong> Zachte doek, lauw water, speciale marmerzeep</li>
                <li><strong>Werkwijze:</strong> Voorzichtig deppen, niet schrobben</li>
                <li><strong>Frequentie:</strong> 4-6x per jaar</li>
                <li><strong>Vermijd:</strong> Azijn, citroensap, schuurmiddelen</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🏛️ Natuursteen (zandsteen, kalksteen)</h3>
              <p class="text-gray-700 mb-2">Poreuze stenen die voorzichtige behandeling vragen.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Benodigdheden:</strong> Zachte borstel, water, pH-neutrale zeep</li>
                <li><strong>Werkwijze:</strong> Droog borstelen, licht vochtig reinigen</li>
                <li><strong>Frequentie:</strong> 2-3x per jaar</li>
                <li><strong>Vermijd:</strong> Teveel water, chemische middelen</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🗿 Hardsteen</h3>
              <p class="text-gray-700 mb-2">Belgisch hardsteen is duurzaam maar kan verweren.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Benodigdheden:</strong> Zachte borstel, water, groene zeep</li>
                <li><strong>Werkwijze:</strong> Nat reinigen met ronddraaiende bewegingen</li>
                <li><strong>Frequentie:</strong> 3-4x per jaar</li>
                <li><strong>Vermijd:</strong> IJzeren borstels, zoutzuur</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Schoonmaken van grafsteen met zachte borstel" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🧹 Stap-voor-stap reinigingsplan</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Volg dit systematische plan voor het beste resultaat bij het reinigen van een grafmonument.
            </p>
            
            <ol class="space-y-4">
              <li class="flex items-start">
                <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">1</span>
                <div>
                  <h3 class="font-semibold text-gray-900">Voorbereiding</h3>
                  <ul class="text-gray-700 text-sm mt-1 space-y-1">
                    <li>• Verwijder losse voorwerpen en bloemen</li>
                    <li>• Controleer stabiliteit monument</li>
                    <li>• Verzamel schoonmaakmaterialen</li>
                    <li>• Trek werkhandschoenen aan</li>
                  </ul>
                </div>
              </li>
              
              <li class="flex items-start">
                <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">2</span>
                <div>
                  <h3 class="font-semibold text-gray-900">Droge reiniging</h3>
                  <ul class="text-gray-700 text-sm mt-1 space-y-1">
                    <li>• Verwijder bladeren en vuil</li>
                    <li>• Borstel los vuil weg</li>
                    <li>• Gebruik zachte borstel voor inscripties</li>
                  </ul>
                </div>
              </li>
              
              <li class="flex items-start">
                <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">3</span>
                <div>
                  <h3 class="font-semibold text-gray-900">Natte reiniging</h3>
                  <ul class="text-gray-700 text-sm mt-1 space-y-1">
                    <li>• Maak steen nat met schoon water</li>
                    <li>• Breng milde zeepoplossing aan</li>
                    <li>• Borstel zacht van boven naar beneden</li>
                    <li>• Extra aandacht voor groeven en letters</li>
                  </ul>
                </div>
              </li>
              
              <li class="flex items-start">
                <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">4</span>
                <div>
                  <h3 class="font-semibold text-gray-900">Naspoelen</h3>
                  <ul class="text-gray-700 text-sm mt-1 space-y-1">
                    <li>• Spoel overvloedig met schoon water</li>
                    <li>• Zorg dat alle zeep weg is</li>
                    <li>• Let op achtergebleven vuil</li>
                  </ul>
                </div>
              </li>
              
              <li class="flex items-start">
                <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">5</span>
                <div>
                  <h3 class="font-semibold text-gray-900">Afwerking</h3>
                  <ul class="text-gray-700 text-sm mt-1 space-y-1">
                    <li>• Laat natuurlijk drogen</li>
                    <li>• Plaats bloemen terug</li>
                    <li>• Controleer resultaat</li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🦠 Specifieke vervuiling aanpakken</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Verschillende soorten vervuiling vragen om een specifieke aanpak. Hier zijn de meest voorkomende problemen en oplossingen.
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌿 Algen en mos</h3>
              <p class="text-sm text-gray-700 mb-2">Groenige aanslag, vooral op vochtige plekken</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Aanpak:</strong> Biologische algenverwijderaar</li>
                <li><strong>Alternatief:</strong> Soda-oplossing (1:10)</li>
                <li><strong>Preventie:</strong> Regelmatig reinigen, vegetatie snoeien</li>
              </ul>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🦀 Korstmos</h3>
              <p class="text-sm text-gray-700 mb-2">Hardnekkige oranje/gele vlekken</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Aanpak:</strong> Inweken, voorzichtig schrapen</li>
                <li><strong>Let op:</strong> Kan steen beschadigen</li>
                <li><strong>Advies:</strong> Laat zitten of professional</li>
              </ul>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🏭 Luchtvervuiling</h3>
              <p class="text-sm text-gray-700 mb-2">Zwarte aanslag, roet</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Aanpak:</strong> Milde detergent</li>
                <li><strong>Techniek:</strong> Veel spoelen</li>
                <li><strong>Frequentie:</strong> Vaker in steden</li>
              </ul>
            </div>
            
            <div class="bg-brown-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🍂 Organisch vuil</h3>
              <p class="text-sm text-gray-700 mb-2">Bladeren, vogelpoep, boomhars</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li><strong>Aanpak:</strong> Direct verwijderen</li>
                <li><strong>Hars:</strong> IJsblokje, dan schrapen</li>
                <li><strong>Preventie:</strong> Regelmatig controleren</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-red-50 rounded-lg">
            <p class="text-gray-700">
              <strong>⚠️ Waarschuwing:</strong> Test reinigingsmiddelen altijd eerst op een onopvallende plek. Bij twijfel, raadpleeg een professional.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Herstellen van letters op grafsteen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">✍️ Letters en inscripties onderhouden</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Leesbare inscripties zijn essentieel voor de functie van een grafmonument. Met de tijd kunnen letters vervagen of beschadigd raken.
            </p>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Onderhoud bestaande letters:</h3>
                <ul class="space-y-2 text-gray-700">
                  <li>• <strong>Reinigen:</strong> Gebruik tandenborstel voor fijne groeven</li>
                  <li>• <strong>Vergulde letters:</strong> Alleen droog reinigen met zachte kwast</li>
                  <li>• <strong>Verdiepte letters:</strong> Vuil voorzichtig uitpeuteren met houten stokje</li>
                  <li>• <strong>Verhoogde letters:</strong> Extra voorzichtig, kunnen afbreken</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Letters opnieuw inkleuren:</h3>
                <ol class="space-y-2 text-gray-700">
                  <li>1. Letters grondig reinigen en laten drogen</li>
                  <li>2. Omgeving afplakken met schilderstape</li>
                  <li>3. Speciale letterverf aanbrengen met klein penseel</li>
                  <li>4. Overtollige verf direct wegvegen</li>
                  <li>5. Tape verwijderen voor verf droogt</li>
                  <li>6. 24 uur laten drogen</li>
                </ol>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Kleuren voor letters:</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>• <strong>Goud:</strong> Traditioneel, waardig</div>
                  <div>• <strong>Zwart:</strong> Goed contrast op licht steen</div>
                  <div>• <strong>Wit:</strong> Voor donkere stenen</div>
                  <div>• <strong>Zilver:</strong> Modern, subtiel</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🔧 Kleine reparaties zelf uitvoeren</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Sommige kleine reparaties kunt u zelf uitvoeren, maar wees voorzichtig en ken uw grenzen.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">✅ Zelf te doen:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Losse ornamenten vastlijmen</li>
                <li>• Kleine barsten dichten</li>
                <li>• Letters bijwerken</li>
                <li>• Voegen bijwerken</li>
                <li>• Roest verwijderen van metalen delen</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">❌ Professional inschakelen:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Grote scheuren of breuken</li>
                <li>• Verzakte monumenten</li>
                <li>• Structurele schade</li>
                <li>• Antieke of waardevolle monumenten</li>
                <li>• Complexe restauraties</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🛠️ Basisgereedschap voor onderhoud:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Zachte borstels (verschillende maten)</li>
                <li>• Tandenborstel voor details</li>
                <li>• Houten of plastic schraper</li>
                <li>• Spons en zachte doeken</li>
                <li>• Emmer en gieter</li>
              </ul>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• pH-neutrale zeep</li>
                <li>• Handschoenen</li>
                <li>• Schilderstape</li>
                <li>• Kleine penselen</li>
                <li>• Schone handdoeken</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Seizoensgebonden onderhoud begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📅 Onderhoudsschema door het jaar</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Een goed onderhoudsschema voorkomt grote problemen. Plan uw onderhoud volgens de seizoenen.
            </p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌸 Lente (maart-mei)</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Grote schoonmaak na winter</li>
                  <li>• Winterschade controleren</li>
                  <li>• Algen en mos verwijderen</li>
                  <li>• Nieuwe beplanting plaatsen</li>
                  <li>• Letters bijwerken indien nodig</li>
                </ul>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">☀️ Zomer (juni-augustus)</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Lichte reiniging</li>
                  <li>• Beplanting onderhouden</li>
                  <li>• Droogteschade voorkomen</li>
                  <li>• Onkruid verwijderen</li>
                  <li>• Kleine reparaties uitvoeren</li>
                </ul>
              </div>
              
              <div class="bg-orange-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🍂 Herfst (september-november)</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Bladeren regelmatig verwijderen</li>
                  <li>• Drainage controleren</li>
                  <li>• Wintervoorbereiding</li>
                  <li>• Beplanting snoeien</li>
                  <li>• Laatste grote schoonmaak</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">❄️ Winter (december-februari)</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Minimaal onderhoud</li>
                  <li>• Vorstschade voorkomen</li>
                  <li>• Geen water gebruiken bij vorst</li>
                  <li>• Sneeuw voorzichtig verwijderen</li>
                  <li>• Regelmatig controleren</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💰 Kosten professioneel onderhoud</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Als u het onderhoud liever uitbesteedt, zijn hier de gemiddelde kosten:
          </p>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequentie</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kosten</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Basis onderhoud</td>
                  <td class="px-4 py-2 text-sm text-gray-700">4x per jaar</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€50-100/jaar</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Uitgebreid onderhoud</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Maandelijks</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€150-300/jaar</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Eenmalige grote beurt</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Eenmalig</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€75-200</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Letters vernieuwen</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Per 5-10 jaar</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€50-150</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Restauratie</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Indien nodig</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€500-5000+</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-700">
              💡 <strong>Tip:</strong> Veel <a href="${getMunicipalityLink('Rotterdam')}" class="text-blue-600 hover:text-blue-800 underline">gemeentelijke begraafplaatsen</a> bieden onderhoudscontracten aan tegen gunstige tarieven.
            </p>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">⚠️ Veiligheid bij onderhoud</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Persoonlijke veiligheid:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Draag werkhandschoenen</li>
                <li>• Gebruik kniebescherming</li>
                <li>• Let op gladde oppervlakken</li>
                <li>• Werk niet alleen bij zware klussen</li>
                <li>• Til correct bij zware voorwerpen</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Monument veiligheid:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Test stabiliteit vooraf</li>
                <li>• Ondersteun wankele delen</li>
                <li>• Werk van boven naar beneden</li>
                <li>• Vermijd overmatige druk</li>
                <li>• Stop bij twijfel</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌿 Milieuvriendelijk onderhoud</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Steeds meer mensen kiezen voor milieuvriendelijke onderhoudsmethoden:
          </p>
          
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <span class="text-green-600 mr-2">🌱</span>
              <span><strong>Biologische schoonmaakmiddelen:</strong> Azijn, soda, groene zeep</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">♻️</span>
              <span><strong>Herbruikbare materialen:</strong> Katoenen doeken in plaats van wegwerp</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">💧</span>
              <span><strong>Waterbesparend:</strong> Opgevangen regenwater gebruiken</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">🌸</span>
              <span><strong>Natuurlijke beplanting:</strong> Inheemse planten die weinig onderhoud vragen</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">🦜</span>
              <span><strong>Diervriendelijk:</strong> Geen giftige stoffen voor vogels en insecten</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Een monument van blijvende waarde</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Goed onderhoud van een grafmonument is een daad van liefde en respect. Het bewaart niet alleen de fysieke herinnering, maar ook de waardigheid van de laatste rustplaats. Of u nu zelf het onderhoud doet of het uitbesteedt, regelmatige zorg zorgt ervoor dat het monument generaties lang meegaat.
          </p>
          <p class="text-gray-700">
            Voor specifieke onderhoudsvoorschriften kunt u terecht bij de beheerder van uw <a href="${getCemeteryLink('Algemene Begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">lokale begraafplaats</a>. Zij kennen de lokale omstandigheden en kunnen advies geven over de beste aanpak voor uw monument.
          </p>
        </div>
      </section>
    </div>
  `;

  // Article 8: genealogie-onderzoek-begraafplaatsen
  const artikel8 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Begraafplaatsen zijn goudmijnen voor genealogen en familieonderzoekers. Grafstenen en begraafregisters bevatten waardevolle informatie over voorouders die nergens anders te vinden is. Ontdek hoe u begraafplaatsen effectief kunt gebruiken voor uw stamboomonderzoek.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipNcJx3Q5JBMKWzGXfh0PeIZx98MFKhzC1LoqLn7=s1360-w1360-h1020" 
            alt="Onderzoeker bekijkt oude grafsteen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🔍 Waarom begraafplaatsen voor genealogie?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Begraafplaatsen bieden unieke informatie die essentieel kan zijn voor het completeren van uw familiepuzzel. Van exacte geboorte- en sterfdata tot onbekende familierelaties - grafmonumenten vertellen verhalen die generaties overspannen.
            </p>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Welke informatie kunt u vinden?</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">📅</span>
                  <span><strong>Data:</strong> Geboorte- en sterfdata, soms tot op de dag nauwkeurig</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">👨‍👩‍👧‍👦</span>
                  <span><strong>Relaties:</strong> Echtgenoten, kinderen, ouders vermeld op steen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">💼</span>
                  <span><strong>Beroepen:</strong> Vaak vermeld, vooral bij ambachtslieden</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">📍</span>
                  <span><strong>Herkomst:</strong> Geboorteplaats, "alhier overleden"</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">✝️</span>
                  <span><strong>Geloof:</strong> Religieuze symbolen en teksten</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🎖️</span>
                  <span><strong>Status:</strong> Titels, onderscheidingen, verenigingen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📚 Voorbereiding thuis</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Goede voorbereiding maakt uw bezoek aan de begraafplaats veel effectiever. Begin uw onderzoek thuis.
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">1. Verzamel basisinformatie</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Volledige namen (inclusief meisjesnaam)</li>
                <li>• Geschatte geboorte- en sterfjaren</li>
                <li>• Laatste bekende woonplaats</li>
                <li>• Namen van familieleden</li>
                <li>• Religie of kerkgenootschap</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">2. Online bronnen raadplegen</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• <strong>Online Begraafplaatsen:</strong> Steeds meer begraafplaatsen hebben digitale databases</li>
                <li>• <strong>Genealogische sites:</strong> FamilySearch, MyHeritage, Ancestry</li>
                <li>• <strong>Lokale archieven:</strong> Digitale collecties van gemeentearchieven</li>
                <li>• <strong>Facebook groepen:</strong> Lokale historie- en genealogiegroepen</li>
                <li>• <strong>Google:</strong> Zoek op naam + "grafsteen" of "begraafplaats"</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">3. Bepaal welke begraafplaatsen</h3>
              <p class="text-gray-700 mb-2">Gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> om relevante begraafplaatsen te vinden:</p>
              <ul class="space-y-1 text-gray-700">
                <li>• <a href="${getMunicipalityLink('Den Haag')}" class="text-blue-600 hover:text-blue-800 underline">Gemeentelijke begraafplaatsen</a> in de woonplaats</li>
                <li>• Kerkelijke begraafplaatsen van hun geloof</li>
                <li>• <a href="${getTypeLink('joodse-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Specifieke begraafplaatsen</a> voor hun gemeenschap</li>
                <li>• Historische begraafplaatsen in de regio</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Begraafregister en oude documenten" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 Begraafregisters raadplegen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Begraafregisters zijn de administratieve goudmijn van elke begraafplaats. Ze bevatten vaak meer informatie dan op de grafsteen staat.
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Wat staat in registers?</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Volledige naam overledene</li>
                  <li>• Exacte geboorte- en sterfdatum</li>
                  <li>• Laatste adres</li>
                  <li>• Beroep en burgerlijke staat</li>
                  <li>• Doodsoorzaak (oude registers)</li>
                  <li>• Namen nabestaanden</li>
                  <li>• Grafnummer en -locatie</li>
                  <li>• Datum begraving</li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Toegang tot registers:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• <strong>Beheerder:</strong> Vraag op kantoor begraafplaats</li>
                  <li>• <strong>Gemeentearchief:</strong> Oude registers</li>
                  <li>• <strong>Online:</strong> Steeds meer gedigitaliseerd</li>
                  <li>• <strong>Kerkarchief:</strong> Voor kerkelijke begraafplaatsen</li>
                  <li>• <strong>Privacy:</strong> Recente jaren vaak beperkt</li>
                </ul>
              </div>
            </div>
            
            <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p class="text-gray-700">
                <strong>Tip:</strong> Neem foto's of maak aantekeningen van registergegevens. Thuis kunt u de informatie rustig verwerken.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🗺️ Systematisch zoeken op de begraafplaats</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Een grote begraafplaats kan overweldigend zijn. Een systematische aanpak helpt u efficiënt te zoeken.
          </p>
          
          <div class="space-y-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Stappenplan voor effectief zoeken:</h3>
              <ol class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">1</span>
                  <span><strong>Start bij het kantoor:</strong> Vraag plattegrond en hulp</span>
                </li>
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">2</span>
                  <span><strong>Gebruik registers:</strong> Vind exacte locaties</span>
                </li>
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">3</span>
                  <span><strong>Werk per vak:</strong> Systematisch doorlopen</span>
                </li>
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">4</span>
                  <span><strong>Let op patronen:</strong> Families vaak bij elkaar</span>
                </li>
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">5</span>
                  <span><strong>Documenteer alles:</strong> Ook "bijna-treffers"</span>
                </li>
              </ol>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🗺️ Oriëntatie tips:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Oude deel meestal bij ingang</li>
                  <li>• Rijke families langs hoofdpaden</li>
                  <li>• Armen vaak aan randen</li>
                  <li>• Kindergraven apart gebied</li>
                  <li>• Let op vak-/rijnummers</li>
                </ul>
              </div>
              
              <div class="bg-purple-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">👀 Zoektechnieken:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Loop zigzag door vakken</li>
                  <li>• Bekijk beide zijden monument</li>
                  <li>• Check naastliggende graven</li>
                  <li>• Let op familienamen</li>
                  <li>• Kijk naar grond (liggende stenen)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Fotograferen van grafsteen voor documentatie" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📸 Documenteren van uw vondsten</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Goede documentatie is cruciaal voor genealogisch onderzoek. Zorg dat u alle informatie vastlegt voor later gebruik.
            </p>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Fotografietips voor grafstenen:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Foto hele monument + close-ups tekst</li>
                    <li>• Fotografeer bij zacht licht (bewolkt)</li>
                    <li>• Vermijd schaduwen over tekst</li>
                    <li>• Maak foto's vanuit verschillende hoeken</li>
                    <li>• Gebruik krijt voor onleesbare letters</li>
                  </ul>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Neem schaalaanduiding mee (liniaal)</li>
                    <li>• Fotografeer ook achterkant/zijkanten</li>
                    <li>• Documenteer exacte locatie (vaknummer)</li>
                    <li>• Maak overzichtsfoto met omgeving</li>
                    <li>• Back-up foto's direct</li>
                  </ul>
                </div>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">📝 Wat noteer u?</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Alle tekst op monument (letterlijk)</li>
                  <li>• Symbolen en decoraties</li>
                  <li>• Staat van het monument</li>
                  <li>• Type steen en kleur</li>
                  <li>• Exacte locatie (vak/rij/nummer)</li>
                  <li>• Nabijgelegen familienamen</li>
                  <li>• Datum van uw bezoek</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🔤 Oude inscripties lezen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Het ontcijferen van oude of verweerde inscripties vraagt geduld en techniek.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Technieken voor leesbaar maken:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>Schuinvallend licht:</strong> Wacht op juiste zonnestand</li>
                <li>• <strong>Spiegeltje:</strong> Reflecteer licht onder hoek</li>
                <li>• <strong>Water:</strong> Maak steen nat voor contrast</li>
                <li>• <strong>Krijt:</strong> Wrijf zacht over letters</li>
                <li>• <strong>Papier+potlood:</strong> Maak wrijfafdruk (voorzichtig!)</li>
                <li>• <strong>Zaklamp:</strong> 's Avonds of bewolkt weer</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Veel voorkomende afkortingen:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• <strong>geb.:</strong> geboren</li>
                <li>• <strong>overl.:</strong> overleden</li>
                <li>• <strong>echgt.:</strong> echtgenoot/echtgenote</li>
                <li>• <strong>wed.:</strong> weduwe/weduwnaar</li>
                <li>• <strong>dr.:</strong> dochter</li>
                <li>• <strong>zn.:</strong> zoon</li>
                <li>• <strong>Jdr.:</strong> jongedochter (ongehuwd)</li>
                <li>• <strong>R.I.P.:</strong> Rust in vrede</li>
                <li>• <strong>H.R.I.P.:</strong> Hier rust in vrede</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p class="text-gray-700">
              <strong>Let op:</strong> Wees zeer voorzichtig met oude stenen. Gebruik nooit harde borstels of chemicaliën. Bij twijfel: alleen kijken, niet aanraken.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌐 Online bronnen voor verdieping</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Na uw bezoek kunt u online verder zoeken met de gevonden informatie.
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Nederlandse bronnen:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• <strong>WieWasWie:</strong> Akten burgerlijke stand</li>
                <li>• <strong>OpenArch:</strong> Archieven doorzoeken</li>
                <li>• <strong>Delpher:</strong> Historische kranten</li>
                <li>• <strong>FamilySearch:</strong> Gratis stambomen</li>
                <li>• <strong>AlleFriezen:</strong> Voor Friesland</li>
                <li>• <strong>Graftombe:</strong> Graf foto's</li>
              </ul>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Nuttige websites:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Gemeentearchieven online</li>
                <li>• Historische verenigingen</li>
                <li>• Facebook genealogie groepen</li>
                <li>• Begraafplaats websites</li>
                <li>• Online telefoonboeken (oude)</li>
                <li>• Militaire databases</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Familie grafmonument met meerdere namen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">💡 Tips van ervaren onderzoekers</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Genealogen die regelmatig begraafplaatsen bezoeken hebben waardevolle tips:
            </p>
            
            <div class="space-y-4">
              <div class="bg-purple-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Praktische tips:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>✓ Bezoek bij verschillende weersomstandigheden</li>
                  <li>✓ Neem helper mee voor efficiëntie</li>
                  <li>✓ Begin vroeg op de dag (rust, licht)</li>
                  <li>✓ Draag comfortabele schoenen</li>
                  <li>✓ Neem water en snacks mee</li>
                  <li>✓ Respecteer lopende uitvaarten</li>
                </ul>
              </div>
              
              <div class="bg-pink-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Onderzoekstips:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>✓ Zoek in cirkels vanuit bekend graf</li>
                  <li>✓ Let op beroepsaanduidingen voor sociale klasse</li>
                  <li>✓ Kindersterfte wijst vaak op epidemieën</li>
                  <li>✓ Check oorlogsgraven voor militaire dienst</li>
                  <li>✓ Vergelijk handschrift op verschillende stenen</li>
                  <li>✓ Maak contact met andere bezoekers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">🤝 Samenwerken met anderen</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Deel uw vondsten:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Upload foto's naar genealogie sites</li>
                <li>• Deel in Facebook groepen</li>
                <li>• Voeg toe aan online stambomen</li>
                <li>• Help andere onderzoekers</li>
                <li>• Maak transcripties van teksten</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Vraag hulp bij:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Lokale historische vereniging</li>
                <li>• Heemkundekringen</li>
                <li>• Genealogische vereniging (NGV)</li>
                <li>• Vrijwilligers begraafplaats</li>
                <li>• Online forums</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 Checklist voor begraafplaatsbezoek</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Print deze lijst voor uw volgende onderzoeksbezoek:
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Meenemen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>☐ Camera of smartphone</li>
                <li>☐ Notitieboek en pennen</li>
                <li>☐ Lijst met gezochte namen</li>
                <li>☐ Plattegrond begraafplaats</li>
                <li>☐ Zachte borstel</li>
                <li>☐ Water in spuitfles</li>
                <li>☐ Spiegeltje</li>
                <li>☐ Zaklamp</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Te doen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>☐ Meld u bij beheerder</li>
                <li>☐ Vraag naar registers</li>
                <li>☐ Maak werkplan</li>
                <li>☐ Fotografeer systematisch</li>
                <li>☐ Noteer alle details</li>
                <li>☐ Check omliggende graven</li>
                <li>☐ Bedank beheerder</li>
                <li>☐ Backup foto's thuis</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Ontdek uw familiegeschiedenis</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Begraafplaatsen zijn vensters naar het verleden die u helpen uw familiegeschiedenis te ontrafelen. Met geduld, systematisch onderzoek en respect voor de laatste rustplaats van uw voorouders, kunt u waardevolle informatie vinden die nergens anders bewaard is gebleven.
          </p>
          <p class="text-gray-700">
            Begin uw zoektocht vandaag op een <a href="${getCemeteryLink('Oude Algemene Begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">historische begraafplaats</a> in uw regio. Gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> om begraafplaatsen te vinden waar uw voorouders mogelijk begraven liggen.
          </p>
        </div>
      </section>
    </div>
  `;

  // Create content directory if it doesn't exist
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Save articles
  fs.writeFileSync(
    path.join(contentDir, 'digitaal-herdenken.html'),
    artikel6.trim()
  );
  console.log('✅ Generated content for: digitaal-herdenken');

  fs.writeFileSync(
    path.join(contentDir, 'grafmonumenten-onderhoud-complete-gids.html'),
    artikel7.trim()
  );
  console.log('✅ Generated content for: grafmonumenten-onderhoud-complete-gids');

  fs.writeFileSync(
    path.join(contentDir, 'genealogie-onderzoek-begraafplaatsen.html'),
    artikel8.trim()
  );
  console.log('✅ Generated content for: genealogie-onderzoek-begraafplaatsen');

  console.log('\n✅ Successfully generated 3 more blog articles (batch 2)!');
};

// Run the script
generateBatch2();