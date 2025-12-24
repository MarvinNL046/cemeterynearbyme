#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { getCemeteryLink, getProvinceLink, getMunicipalityLink, getTypeLink } from '../lib/blog-data';

// Generate content for missing blog articles
const generateBlogContent = () => {
  const contentDir = path.join(process.cwd(), 'content');
  
  // Create content directory if it doesn't exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Article 1: geschiedenis-nederlandse-begraafplaatsen
  const artikel1 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        De geschiedenis van Nederlandse begraafplaatsen is een fascinerende reis door eeuwen van tradities, geloof en maatschappelijke veranderingen. Van middeleeuwse kerkhoven tot moderne gedenkparken - ontdek hoe onze laatste rustplaatsen zijn geëvolueerd en wat ze ons vertellen over de Nederlandse cultuur en samenleving.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Historisch kerkhof bij middeleeuwse kerk" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">De Middeleeuwen: Begraven bij de kerk</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              In de middeleeuwen was het gebruikelijk om overledenen te begraven op het kerkhof rondom de dorps- of stadskerk. Deze traditie stamde uit de christelijke overtuiging dat de doden zo dicht mogelijk bij het heilige moesten rusten. De meest welgestelde families kochten zelfs graven binnen de kerk zelf.
            </p>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Kenmerken van middeleeuwse begraafplaatsen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Direct rondom de kerk gelegen</li>
                <li>• Hiërarchische indeling (rijken dichter bij de kerk)</li>
                <li>• Hergebruik van graven was gebruikelijk</li>
                <li>• Weinig tot geen grafstenen voor gewone burgers</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">De 16e-18e eeuw: Religieuze scheiding</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Met de Reformatie in de 16e eeuw ontstond een scheiding tussen katholieke en protestantse begraafplaatsen. Deze religieuze verdeling heeft tot op de dag van vandaag invloed op de inrichting van Nederlandse begraafplaatsen.
          </p>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Protestantse begraafplaatsen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Sobere grafstenen</li>
                <li>• Weinig versiering</li>
                <li>• Focus op tekst en Bijbelcitaten</li>
                <li>• Vaak bij gereformeerde kerken</li>
              </ul>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Katholieke begraafplaatsen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Rijkere symboliek</li>
                <li>• Kruisen en religieuze beelden</li>
                <li>• Aparte gedeelten voor priesters</li>
                <li>• Processiewegen</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="19e-eeuwse parkbegraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">De 19e eeuw: Revolutionaire veranderingen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De 19e eeuw bracht fundamentele veranderingen in het Nederlandse begrafeniswezen. Twee belangrijke ontwikkelingen markeerden deze periode:
            </p>
            
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">1. Het Koninklijk Besluit van 1827</h3>
                <p class="text-gray-700">
                  Napoleon Bonaparte had al in 1804 bepaald dat begraafplaatsen buiten de bebouwde kom moesten liggen vanwege hygiënische redenen. In Nederland werd dit pas in 1827 bij Koninklijk Besluit verplicht. Dit leidde tot de aanleg van algemene begraafplaatsen buiten de steden.
                </p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">2. De Wet op de Lijkbezorging van 1869</h3>
                <p class="text-gray-700">
                  Deze wet bepaalde dat gemeenten verantwoordelijk werden voor de aanleg en het beheer van begraafplaatsen. Dit leidde tot de oprichting van vele gemeentelijke begraafplaatsen, zoals de beroemde <a href="${getCemeteryLink('Nieuwe Oosterbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Oosterbegraafplaats</a> in Amsterdam (1894).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Parkbegraafplaatsen: Een nieuwe stijl</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Geïnspireerd door de Engelse landschapsstijl ontstonden in de 19e eeuw de eerste parkbegraafplaatsen. Deze begraafplaatsen waren niet alleen rustplaatsen voor de doden, maar ook groene oases voor de levenden.
          </p>
          
          <div class="bg-yellow-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">Bekende vroege parkbegraafplaatsen:</h3>
            <ul class="space-y-2 text-gray-700">
              <li>• <a href="${getCemeteryLink('Zorgvlied')}" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied</a> in Amsterdam (1870)</li>
              <li>• <a href="${getCemeteryLink('Begraafplaats & Crematorium Westerveld')}" class="text-blue-600 hover:text-blue-800 underline">Westerveld</a> in Driehuis (1888)</li>
              <li>• Oud Eik en Duinen in Den Haag (1891)</li>
              <li>• <a href="${getCemeteryLink('Begraafplaats Crooswijk')}" class="text-blue-600 hover:text-blue-800 underline">Crooswijk</a> in Rotterdam (1829)</li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Eerste crematorium van Nederland op Westerveld" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">De 20e eeuw: Crematie en modernisering</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Een mijlpaal in de Nederlandse funeraire geschiedenis was de opening van het eerste crematorium op <a href="${getCemeteryLink('Begraafplaats & Crematorium Westerveld')}" class="text-blue-600 hover:text-blue-800 underline">Westerveld</a> in 1914. Aanvankelijk stuitte crematie op veel weerstand, vooral vanuit religieuze hoek.
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Groei van crematie:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• 1914: Eerste crematorium</li>
                  <li>• 1955: Katholieke Kerk staat crematie toe</li>
                  <li>• 1970: 10% kiest voor crematie</li>
                  <li>• 2024: 65% kiest voor crematie</li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Nieuwe begraafvormen:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Urnengraven</li>
                  <li>• Columbaria (urnenmuren)</li>
                  <li>• Strooivelden</li>
                  <li>• Gedenkparken</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Multiculturele invloeden</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Met de komst van gastarbeiders en immigranten kreeg Nederland te maken met nieuwe begrafenistradities. Dit leidde tot de inrichting van speciale delen op begraafplaatsen:
          </p>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">☪️ Islamitische begraafplaatsen</h3>
              <p class="text-sm text-gray-700">
                Vanaf de jaren '70 ontstonden <a href="${getTypeLink('islamitische-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">islamitische begraafplaatsen</a> met graven richting Mekka.
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">✡️ Joodse begraafplaatsen</h3>
              <p class="text-sm text-gray-700">
                Historische <a href="${getTypeLink('joodse-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">joodse begraafplaatsen</a> bestonden al eeuwen, vaak met eigen rituele voorzieningen.
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🕉️ Hindoestaanse tradities</h3>
              <p class="text-sm text-gray-700">
                Speciale voorzieningen voor rituele wassingen en crematieceremonies volgens hindoeïstische tradities.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPiQ2UQzFQq6W_k5V3Z4YmcNqKbqW7xK9tOXfU=s1360-w1360-h1020" 
            alt="Moderne natuurbegraafplaats in Nederland" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">De 21e eeuw: Duurzaamheid en personalisering</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De moderne tijd brengt nieuwe trends in het Nederlandse begrafeniswezen:
            </p>
            
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">🌿 Natuurbegraafplaatsen</h3>
                <p class="text-gray-700">
                  Sinds 1993 zijn er <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">natuurbegraafplaatsen</a> waar mensen in een natuurlijke omgeving begraven kunnen worden zonder traditionele grafmonumenten.
                </p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">💻 Digitalisering</h3>
                <p class="text-gray-700">
                  QR-codes op grafstenen, online herdenkingspagina's en digitale condoleanceregisters zijn steeds gebruikelijker.
                </p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">♻️ Duurzame innovaties</h3>
                <p class="text-gray-700">
                  Nieuwe technieken zoals resomatie (alkalische hydrolyse) en compostering van lichamen worden onderzocht als milieuvriendelijke alternatieven.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Begraafplaatsen als cultureel erfgoed</h2>
          <p class="text-gray-700 mb-4">
            Veel historische begraafplaatsen zijn tegenwoordig beschermd als cultureel erfgoed. Ze vertellen niet alleen persoonlijke verhalen, maar ook de geschiedenis van Nederland:
          </p>
          
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Monumentale graven van beroemde Nederlanders</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Funeraire kunst en symboliek door de eeuwen heen</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Oorlogsgraven en herinneringsmonumenten</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Architectonisch waardevolle grafkapellen en poortgebouwen</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">De toekomst van Nederlandse begraafplaatsen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Nederlandse begraafplaatsen blijven evolueren met de tijd. Van middeleeuwse kerkhoven tot moderne gedenkparken - ze weerspiegelen onze veranderende opvattingen over dood, herinnering en gemeenschap. 
          </p>
          <p class="text-gray-700">
            Of u nu geïnteresseerd bent in de historie van <a href="${getProvinceLink('Noord-Holland')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaatsen in Noord-Holland</a> of zoekt naar een moderne <a href="${getTypeLink('crematorium')}" class="text-blue-600 hover:text-blue-800 underline">crematorium</a>, de rijke geschiedenis van Nederlandse begraafplaatsen biedt voor ieder wat wils.
          </p>
        </div>
      </section>
    </div>
  `;

  // Save article 1
  fs.writeFileSync(
    path.join(contentDir, 'geschiedenis-nederlandse-begraafplaatsen.html'),
    artikel1.trim()
  );

  console.log('✅ Generated content for: geschiedenis-nederlandse-begraafplaatsen');

  // Article 5: begraafplaats-etiquette
  const artikel5 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Een begraafplaats bezoeken vraagt om respectvol gedrag. Of u nu een dierbare bezoekt, historisch onderzoek doet of gewoon een wandeling maakt, het is belangrijk om de juiste etiquette te volgen. Deze gids helpt u om op een respectvolle manier een begraafplaats te bezoeken.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🤝 Algemene gedragsregels</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Begraafplaatsen zijn plaatsen van rust en bezinning. De basis van begraafplaats etiquette is respect tonen voor de overledenen, nabestaanden en andere bezoekers.
          </p>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">Belangrijkste regels:</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">✓</span>
                <span>Spreek zacht en vermijd luide gesprekken</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">✓</span>
                <span>Loop alleen op de paden, niet over graven</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">✓</span>
                <span>Raak grafmonumenten niet aan zonder toestemming</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">✓</span>
                <span>Houd kinderen onder toezicht</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">✓</span>
                <span>Zet uw telefoon op stil</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipNcJx3Q5JBMKWzGXfh0PeIZx98MFKhzC1LoqLn7=s1360-w1360-h1020" 
            alt="Bezoeker bij graf met bloemen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌹 Bloemen en decoraties plaatsen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Het plaatsen van bloemen is een mooie manier om respect te tonen, maar er zijn enkele richtlijnen:
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">✅ Wel doen:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Verse bloemen in water plaatsen</li>
                  <li>• Verwelkte bloemen verwijderen</li>
                  <li>• Kleine persoonlijke items met betekenis</li>
                  <li>• Seizoensgebonden decoratie</li>
                </ul>
              </div>
              <div class="bg-red-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">❌ Niet doen:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Plastic bloemen (vaak niet toegestaan)</li>
                  <li>• Grote voorwerpen zonder toestemming</li>
                  <li>• Items van andere graven verplaatsen</li>
                  <li>• Glazen vazen (breekbaar)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📸 Fotograferen op begraafplaatsen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Fotograferen op begraafplaatsen kan voor verschillende doeleinden, maar vraagt om extra voorzichtigheid:
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Voor persoonlijk gebruik:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Foto's van familiegraf zijn meestal toegestaan</li>
                <li>• Vraag toestemming aan beheerder voor professionele fotografie</li>
                <li>• Vermijd het fotograferen van rouwenden</li>
                <li>• Respecteer "geen foto's" borden</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Voor onderzoek/documentatie:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Meld u bij de beheerder</li>
                <li>• Vraag naar specifieke regels</li>
                <li>• Deel uw onderzoeksresultaten met de begraafplaats</li>
                <li>• Wees extra voorzichtig bij <a href="${getCemeteryLink('Oude Joodse Begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">religieuze begraafplaatsen</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">⏰ Bezoektijden en toegang</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De meeste begraafplaatsen hebben vaste openingstijden die per seizoen kunnen verschillen:
          </p>
          
          <div class="bg-yellow-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">Typische openingstijden:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <p class="font-medium text-gray-900">Zomer (apr-sep):</p>
                <p class="text-gray-700">8:00 - 20:00 uur</p>
              </div>
              <div>
                <p class="font-medium text-gray-900">Winter (okt-mrt):</p>
                <p class="text-gray-700">8:00 - 17:00 uur</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              Controleer altijd de specifieke tijden op de website van de <a href="${getMunicipalityLink('Utrecht')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaats in uw gemeente</a>.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPLxVZGv0XaHGBp7lcdnQa50d0tqMuqF4rWBfSs=s1360-w1360-h1020" 
            alt="Begraafplaats tijdens ceremonie" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">⚱️ Tijdens uitvaarten en ceremonies</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Als u tijdens een uitvaart op de begraafplaats bent, gelden extra gedragsregels:
            </p>
            
            <ul class="space-y-3 text-gray-700">
              <li class="flex items-start">
                <span class="text-gray-400 mr-2">1.</span>
                <span><strong>Houd afstand:</strong> Blijf op respectvolle afstand van lopende ceremonies</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-400 mr-2">2.</span>
                <span><strong>Wacht geduldig:</strong> Als paden geblokkeerd zijn, wacht tot de stoet is gepasseerd</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-400 mr-2">3.</span>
                <span><strong>Toon respect:</strong> Mannen kunnen hun hoofddeksel afnemen als teken van respect</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-400 mr-2">4.</span>
                <span><strong>Vermijd verstoring:</strong> Geen foto's, video's of harde geluiden</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌿 Verschillende types begraafplaatsen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Verschillende soorten begraafplaatsen kunnen specifieke regels hebben:
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">☪️ Islamitische begraafplaatsen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Schoenen uit bij betreden gebedruimte</li>
                <li>• Vrouwen: hoofdbedekking gewenst</li>
                <li>• Niet over graven lopen</li>
                <li>• Geen honden toegestaan</li>
              </ul>
              <p class="text-xs text-gray-600 mt-2">
                Meer info: <a href="${getTypeLink('islamitische-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Islamitische begraafplaatsen</a>
              </p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">✡️ Joodse begraafplaatsen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Mannen: hoofddeksel verplicht</li>
                <li>• Sabbat: geen bezoek vrijdagavond/zaterdag</li>
                <li>• Steentje leggen i.p.v. bloemen</li>
                <li>• Niet eten of drinken</li>
              </ul>
              <p class="text-xs text-gray-600 mt-2">
                Meer info: <a href="${getTypeLink('joodse-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Joodse begraafplaatsen</a>
              </p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌳 Natuurbegraafplaatsen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Blijf op de paden</li>
                <li>• Geen bloemen of decoraties</li>
                <li>• Respecteer flora en fauna</li>
                <li>• Honden vaak niet toegestaan</li>
              </ul>
              <p class="text-xs text-gray-600 mt-2">
                Meer info: <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a>
              </p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">⛪ Katholieke begraafplaatsen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Kruisteken maken is gebruikelijk</li>
                <li>• Stille gebeden worden gewaardeerd</li>
                <li>• Kaarsen aansteken vaak mogelijk</li>
                <li>• Respecteer religieuze symbolen</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🚶 Wandelen en recreatie</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Veel historische begraafplaatsen zoals <a href="${getCemeteryLink('Zorgvlied')}" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied</a> zijn ook parkachtige wandelgebieden. Hiervoor gelden aanvullende regels:
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">✅ Toegestaan:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Rustig wandelen</li>
                <li>• Natuurfotografie</li>
                <li>• Historisch onderzoek</li>
                <li>• Stille bezinning</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">❌ Niet toegestaan:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Joggen of hardlopen</li>
                <li>• Fietsen (tenzij aangegeven)</li>
                <li>• Picnicken</li>
                <li>• Luide muziek</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">👶 Met kinderen naar de begraafplaats</h2>
          <p class="text-gray-700 mb-4">
            Het is belangrijk om kinderen voor te bereiden op een begraafplaatsbezoek:
          </p>
          
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Leg uit wat een begraafplaats is en waarom we stil zijn</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Kinderen mogen vragen stellen, maar zachtjes</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Houd ze bij de hand op smalle paden</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Maak het bezoek niet te lang</span>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🐕 Huisdieren op de begraafplaats</h2>
          <p class="text-gray-700 leading-relaxed">
            De regels voor huisdieren verschillen per begraafplaats:
          </p>
          
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <ul class="space-y-2 text-gray-700">
              <li>• Veel begraafplaatsen verbieden honden</li>
              <li>• Als toegestaan: altijd aangelijnd</li>
              <li>• Ruim uitwerpselen direct op</li>
              <li>• Voorkom dat dieren over graven lopen</li>
              <li>• Bij twijfel: laat uw huisdier thuis</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Samenvatting</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Begraafplaats etiquette draait om respect, rust en begrip. Door deze eenvoudige richtlijnen te volgen, draagt u bij aan de serene sfeer die begraafplaatsen kenmerkt. Of u nu een dierbare bezoekt op een <a href="${getProvinceLink('Gelderland')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaats in Gelderland</a> of historisch onderzoek doet, uw respectvolle gedrag wordt gewaardeerd door iedereen.
          </p>
          <p class="text-gray-700">
            Voor specifieke regels kunt u altijd contact opnemen met de beheerder van de begraafplaats of kijken op de website van de betreffende <a href="/" class="text-blue-600 hover:text-blue-800 underline">begraafplaats in uw buurt</a>.
          </p>
        </div>
      </section>
    </div>
  `;

  // Save article 5
  fs.writeFileSync(
    path.join(contentDir, 'begraafplaats-etiquette.html'),
    artikel5.trim()
  );

  console.log('✅ Generated content for: begraafplaats-etiquette');

  // Article 9: kosten-begraven-nederland-overzicht
  const artikel9 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Het regelen van een begrafenis brengt veel kosten met zich mee. In dit complete overzicht vindt u alle informatie over de kosten van begraven in Nederland, van grafrechten tot onderhoud. We helpen u inzicht te krijgen in wat u kunt verwachten en hoe u mogelijk kunt besparen.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💰 Totale kosten begrafenis 2025</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De gemiddelde kosten voor een begrafenis in Nederland liggen tussen de €5.000 en €15.000. Dit bedrag is sterk afhankelijk van persoonlijke wensen, locatie en type graf.
          </p>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-3">Kostenoverzicht op hoofdlijnen:</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex justify-between">
                <span>• Uitvaartondernemer</span>
                <span class="font-medium">€1.500 - €3.500</span>
              </li>
              <li class="flex justify-between">
                <span>• Kist</span>
                <span class="font-medium">€400 - €5.000</span>
              </li>
              <li class="flex justify-between">
                <span>• Grafrechten</span>
                <span class="font-medium">€500 - €5.000</span>
              </li>
              <li class="flex justify-between">
                <span>• Begraafkosten</span>
                <span class="font-medium">€600 - €1.200</span>
              </li>
              <li class="flex justify-between">
                <span>• Grafmonument</span>
                <span class="font-medium">€1.000 - €10.000</span>
              </li>
              <li class="flex justify-between">
                <span>• Overige kosten</span>
                <span class="font-medium">€1.000 - €3.000</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Nederlandse begraafplaats met verschillende grafmonumenten" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📍 Grafrechten uitgelegd</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Grafrechten zijn de kosten voor het gebruik van een grafruimte voor een bepaalde periode. Deze kosten verschillen sterk per gemeente en type graf.
            </p>
            
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Types graven en kosten:</h3>
                
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Algemeen graf</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Kosten: €500 - €1.500</li>
                      <li>• Periode: 10-20 jaar</li>
                      <li>• Geen exclusief recht</li>
                      <li>• Beperkte monumentkeuze</li>
                    </ul>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Particulier graf</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Kosten: €1.500 - €5.000</li>
                      <li>• Periode: 20-30 jaar</li>
                      <li>• Exclusief gebruiksrecht</li>
                      <li>• Vrije monumentkeuze</li>
                    </ul>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Kindergraf</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Kosten: €250 - €1.000</li>
                      <li>• Periode: vaak onbeperkt</li>
                      <li>• Speciale kindergedeelten</li>
                      <li>• Vaak gratis onderhoud</li>
                    </ul>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Familiegraf</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Kosten: €3.000 - €10.000</li>
                      <li>• Periode: 30-50 jaar</li>
                      <li>• Meerdere overledenen</li>
                      <li>• Grote monumenten mogelijk</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🏛️ Regionale prijsverschillen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De kosten voor begraven verschillen aanzienlijk per regio. In de Randstad zijn de prijzen gemiddeld 30-50% hoger dan in andere delen van Nederland.
          </p>
          
          <div class="bg-yellow-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-3">Gemiddelde grafrechten per regio (20 jaar):</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Duurste regio's:</h4>
                <ul class="space-y-1 text-gray-700">
                  <li>• Amsterdam: €3.000 - €5.000</li>
                  <li>• Utrecht: €2.500 - €4.000</li>
                  <li>• Den Haag: €2.500 - €4.000</li>
                  <li>• Haarlem: €2.000 - €3.500</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Goedkopere regio's:</h4>
                <ul class="space-y-1 text-gray-700">
                  <li>• <a href="${getProvinceLink('Groningen')}" class="text-blue-600 hover:text-blue-800 underline">Groningen</a>: €1.000 - €2.000</li>
                  <li>• <a href="${getProvinceLink('Friesland')}" class="text-blue-600 hover:text-blue-800 underline">Friesland</a>: €1.000 - €2.000</li>
                  <li>• <a href="${getProvinceLink('Zeeland')}" class="text-blue-600 hover:text-blue-800 underline">Zeeland</a>: €1.200 - €2.200</li>
                  <li>• <a href="${getProvinceLink('Limburg')}" class="text-blue-600 hover:text-blue-800 underline">Limburg</a>: €1.200 - €2.500</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPLxVZGv0XaHGBp7lcdnQa50d0tqMuqF4rWBfSs=s1360-w1360-h1020" 
            alt="Grafdelvers aan het werk op begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">⚒️ Begraafkosten en bijkomende diensten</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Naast de grafrechten zijn er diverse kosten voor het daadwerkelijke begraven en aanvullende diensten:
            </p>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Basis begraafkosten:</h3>
                <ul class="space-y-2 text-gray-700">
                  <li class="flex justify-between">
                    <span>• Delven van het graf</span>
                    <span class="font-medium">€400 - €700</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Dichten van het graf</span>
                    <span class="font-medium">€200 - €400</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Gebruik graflift</span>
                    <span class="font-medium">€150 - €300</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Schudden (extra diepte)</span>
                    <span class="font-medium">€200 - €400</span>
                  </li>
                </ul>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Extra diensten:</h3>
                <ul class="space-y-2 text-gray-700">
                  <li class="flex justify-between">
                    <span>• Gebruik aula</span>
                    <span class="font-medium">€300 - €800</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Condoleanceruimte</span>
                    <span class="font-medium">€150 - €400</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Klokluiden</span>
                    <span class="font-medium">€75 - €150</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Grafbedekking (tijdelijk)</span>
                    <span class="font-medium">€50 - €150</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🪦 Grafmonumenten en gedenktekens</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Een grafmonument is vaak een van de grootste kostenposten bij een begrafenis. De prijzen variëren sterk afhankelijk van materiaal, grootte en uitvoering.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Eenvoudig</h3>
              <p class="text-2xl font-bold text-blue-600 mb-2">€1.000 - €2.000</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Staande steen</li>
                <li>• Standaard lettertype</li>
                <li>• Basis materialen</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Standaard</h3>
              <p class="text-2xl font-bold text-blue-600 mb-2">€2.000 - €5.000</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Keuze uit modellen</li>
                <li>• Gravures/foto</li>
                <li>• Kwaliteitsmateriaal</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Luxe/Maatwerk</h3>
              <p class="text-2xl font-bold text-blue-600 mb-2">€5.000 - €20.000+</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Uniek ontwerp</li>
                <li>• Premium materialen</li>
                <li>• Kunstwerken</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              <strong>Let op:</strong> Veel begraafplaatsen hebben regels voor grafmonumenten. Controleer altijd eerst wat toegestaan is op de <a href="${getMunicipalityLink('Rotterdam')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaats in uw gemeente</a>.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Grafonderhoud op begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌿 Onderhoudskosten</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Na de begrafenis komen er jaarlijkse kosten voor het onderhoud van het graf. Deze kunnen op verschillende manieren worden geregeld:
            </p>
            
            <div class="space-y-4">
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Algemeen onderhoud begraafplaats:</h3>
                <p class="text-gray-700 mb-2">Dit is inbegrepen in de grafrechten en omvat:</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Onderhoud paden en groen</li>
                  <li>• Algemene schoonmaak</li>
                  <li>• Beheer begraafplaats</li>
                </ul>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Grafonderhoud (optioneel):</h3>
                <ul class="space-y-2 text-gray-700">
                  <li class="flex justify-between">
                    <span>• Basis (4x per jaar)</span>
                    <span class="font-medium">€50 - €100/jaar</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Standaard (maandelijks)</span>
                    <span class="font-medium">€100 - €200/jaar</span>
                  </li>
                  <li class="flex justify-between">
                    <span>• Uitgebreid (wekelijks)</span>
                    <span class="font-medium">€200 - €500/jaar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🔄 Verlenging grafrechten</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Na afloop van de grafrechten moet u beslissen over verlenging. Dit is een belangrijk moment met financiële consequenties:
          </p>
          
          <div class="bg-red-50 rounded-lg p-4 mb-4">
            <p class="text-gray-700">
              <strong>⚠️ Let op:</strong> Als grafrechten niet worden verlengd, kan het graf worden geruimd. U krijgt hierover altijd bericht, maar reageer tijdig!
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Verlengingsopties:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• 5 jaar verlenging</li>
                <li>• 10 jaar verlenging</li>
                <li>• 20 jaar verlenging</li>
                <li>• Afgekocht onderhoud</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Kosten verlenging:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Vaak 50-70% van nieuwe rechten</li>
                <li>• Prijzen stijgen met inflatie</li>
                <li>• Kortingen bij lange termijn</li>
                <li>• Soms familietarieven</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">💡 Besparingstips voor een begrafenis</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">1. Kies een goedkopere gemeente</h3>
              <p class="text-sm text-gray-700">
                Overweeg een begraafplaats in een aangrenzende gemeente. Bekijk opties in <a href="${getProvinceLink('Gelderland')}" class="text-blue-600 hover:text-blue-800 underline">Gelderland</a> of <a href="${getProvinceLink('Overijssel')}" class="text-blue-600 hover:text-blue-800 underline">Overijssel</a>.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">2. Overweeg een algemeen graf</h3>
              <p class="text-sm text-gray-700">
                Een algemeen graf is veel goedkoper dan een particulier graf, vooral voor een eerste periode.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">3. Kies voor een natuurbegraafplaats</h3>
              <p class="text-sm text-gray-700">
                <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a> hebben vaak lagere kosten en geen monumentkosten.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">4. Doe zelf het onderhoud</h3>
              <p class="text-sm text-gray-700">
                Zelf het graf onderhouden scheelt €100-500 per jaar aan onderhoudskosten.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">5. Vergelijk uitvaartondernemers</h3>
              <p class="text-sm text-gray-700">
                Vraag meerdere offertes. Prijsverschillen kunnen oplopen tot duizenden euro's.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">6. Wacht met het monument</h3>
              <p class="text-sm text-gray-700">
                Een tijdelijk houten kruis of plaat is toegestaan. Het definitieve monument kan later.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📊 Kostenvergelijking: Begraven vs Cremeren</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Voor een volledig beeld is het nuttig om de kosten van begraven te vergelijken met cremeren:
          </p>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kostenpost</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Begraven</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cremeren</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700">Uitvaartondernemer</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€1.500 - €3.500</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€1.500 - €3.500</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700">Kist/Wade</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€800 - €5.000</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€400 - €2.000</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700">Graf/Crematie</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€2.000 - €6.000</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€500 - €700</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700">Monument/Urn</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€1.000 - €10.000</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€75 - €1.000</td>
                </tr>
                <tr class="bg-gray-50 font-semibold">
                  <td class="px-4 py-2 text-sm text-gray-900">Totaal gemiddeld</td>
                  <td class="px-4 py-2 text-sm text-gray-900">€8.000 - €12.000</td>
                  <td class="px-4 py-2 text-sm text-gray-900">€5.000 - €8.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">🛡️ Financiële planning en verzekeringen</h2>
          <p class="text-gray-700 mb-4">
            Het is verstandig om vooraf na te denken over de financiering van een begrafenis:
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Uitvaartverzekering:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Natura of kapitaal</li>
                <li>• Premie: €5-30 per maand</li>
                <li>• Dekt €7.000-15.000</li>
                <li>• Vaak familiedekking mogelijk</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Andere opties:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Spaarrekening oormerken</li>
                <li>• Uitvaartdeposito</li>
                <li>• Levensverzekering</li>
                <li>• Testament regeling</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Conclusie</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De kosten van begraven in Nederland variëren sterk, maar met goede voorbereiding en het maken van bewuste keuzes kunt u de kosten beheersbaar houden. Het belangrijkste is dat de uitvaart past bij de wensen van de overledene en de financiële mogelijkheden van de nabestaanden.
          </p>
          <p class="text-gray-700">
            Voor actuele prijsinformatie van specifieke begraafplaatsen kunt u onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> gebruiken of contact opnemen met de <a href="${getCemeteryLink('Algemene Begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaats</a> van uw keuze.
          </p>
        </div>
      </section>
    </div>
  `;

  // Save article 9
  fs.writeFileSync(
    path.join(contentDir, 'kosten-begraven-nederland-overzicht.html'),
    artikel9.trim()
  );

  console.log('✅ Generated content for: kosten-begraven-nederland-overzicht');

  // Generate remaining articles list
  const remainingArticles = [
    { id: 2, slug: 'kiezen-laatste-rustplaats' },
    { id: 3, slug: 'natuurbegraafplaatsen-nederland' },
    { id: 4, slug: 'funeraire-symbolen-betekenis' },
    { id: 6, slug: 'digitaal-herdenken' },
    { id: 7, slug: 'grafmonumenten-onderhoud-complete-gids' },
    { id: 8, slug: 'genealogie-onderzoek-begraafplaatsen' },
    { id: 10, slug: 'begraafplaats-fotografie-tips-etiquette' },
    { id: 11, slug: 'oorlogsgraven-nederland-geschiedenis' },
    { id: 12, slug: 'kinderbegraafplaatsen-gevoelig-onderwerp' },
    { id: 13, slug: 'beroemde-nederlanders-laatste-rustplaats' },
    { id: 14, slug: 'seizoenen-begraafplaats-wat-verwachten' },
    { id: 15, slug: 'crematie-versus-begraven-vergelijking' }
  ];

  console.log('\n📝 Remaining articles to generate:');
  remainingArticles.forEach(article => {
    console.log(`   - ${article.slug} (ID: ${article.id})`);
  });

  console.log('\n✅ Content generation script created successfully!');
  console.log('📁 Generated content saved in: ./content/');
};

// Run the script
generateBlogContent();