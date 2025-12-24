#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { getCemeteryLink, getProvinceLink, getMunicipalityLink, getTypeLink } from '../lib/blog-data';

// Generate third batch of blog articles
const generateBatch3 = () => {
  // Article 10: begraafplaats-fotografie-tips-etiquette
  const artikel10 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Begraafplaatsen bieden unieke fotografische mogelijkheden, van historische monumenten tot sfeervolle landschappen. Maar fotograferen op deze bijzondere plaatsen vraagt om respect en kennis van de juiste etiquette. Deze gids helpt u om respectvol en succesvol te fotograferen op begraafplaatsen.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Fotograaf respectvol aan het werk op begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📸 Waarom fotograferen op begraafplaatsen?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Begraafplaatsen zijn rijke bronnen van geschiedenis, kunst en natuurschoon. Fotografen vinden er inspiratie voor verschillende soorten fotografie, van architectuur tot natuurfotografie. Maar bovenal zijn het plaatsen van rouw en herinnering die respect verdienen.
            </p>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Populaire fotografische onderwerpen:</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🏛️</span>
                  <span><strong>Funeraire kunst:</strong> Beeldhouwwerken, engelen, symboliek</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🌳</span>
                  <span><strong>Natuur:</strong> Oude bomen, seizoenen, flora en fauna</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">📜</span>
                  <span><strong>Historie:</strong> Oude grafstenen, inscripties, verhalen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🏗️</span>
                  <span><strong>Architectuur:</strong> Grafkapellen, poortgebouwen, hekken</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🎨</span>
                  <span><strong>Abstract:</strong> Patronen, texturen, licht en schaduw</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🙏 Etiquette: De belangrijkste regels</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Respectvol fotograferen begint met het begrijpen en naleven van de juiste etiquette. Deze regels zorgen ervoor dat u niemand stoort en de waardigheid van de plek behoudt.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">✅ Altijd doen:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Vraag toestemming aan de beheerder</li>
                <li>• Respecteer lopende ceremonies</li>
                <li>• Blijf op de paden</li>
                <li>• Wees stil en discreet</li>
                <li>• Fotografeer zonder flits</li>
                <li>• Respecteer "geen foto's" borden</li>
                <li>• Vraag toestemming aan rouwenden</li>
              </ul>
            </div>
            <div class="bg-red-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">❌ Nooit doen:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Tijdens uitvaarten fotograferen</li>
                <li>• Op graven staan of leunen</li>
                <li>• Voorwerpen verplaatsen</li>
                <li>• Rouwenden fotograferen</li>
                <li>• Commercieel gebruik zonder toestemming</li>
                <li>• Statief op graven plaatsen</li>
                <li>• Namen publiceren zonder toestemming</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Gouden uur licht op historische grafmonumenten" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">⏰ Het beste moment om te fotograferen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Timing is cruciaal voor zowel respectvol gedrag als fotografisch succes. Kies uw moment zorgvuldig.
            </p>
            
            <div class="space-y-4">
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌅 Gouden uurtjes:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Vroege ochtend</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Zacht, warm licht</li>
                      <li>• Weinig bezoekers</li>
                      <li>• Dauw op spinnenwebben</li>
                      <li>• Mistige sfeer mogelijk</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Late namiddag</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Gouden licht</li>
                      <li>• Lange schaduwen</li>
                      <li>• Warme kleuren</li>
                      <li>• Dramatische luchten</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">📅 Seizoenen:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-gray-700">
                    <li><strong>Lente:</strong> Bloesem, fris groen</li>
                    <li><strong>Zomer:</strong> Vol gebladerte, contrast</li>
                  </ul>
                  <ul class="space-y-1 text-gray-700">
                    <li><strong>Herfst:</strong> Warme kleuren, bladeren</li>
                    <li><strong>Winter:</strong> Grafische lijnen, sneeuw</li>
                  </ul>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">☁️ Weersomstandigheden:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• <strong>Bewolkt:</strong> Ideaal voor details, geen harde schaduwen</li>
                  <li>• <strong>Mist:</strong> Mysterieuze sfeer, isolatie onderwerp</li>
                  <li>• <strong>Na regen:</strong> Verzadigde kleuren, reflecties</li>
                  <li>• <strong>Sneeuw:</strong> Sereen, grafisch, monochroom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📷 Technische tips voor begraafplaatsfotografie</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Specifieke technieken helpen u om respectvol de beste resultaten te behalen.
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Camera-instellingen:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Voor details/monumenten:</h4>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Kleine diafragma (f/8-f/11)</li>
                    <li>• Lage ISO (100-400)</li>
                    <li>• Statief gebruiken</li>
                    <li>• Spiegelvoorslag</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Voor sfeer/portretten:</h4>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Grote diafragma (f/1.4-f/2.8)</li>
                    <li>• Bokeh voor achtergrond</li>
                    <li>• Natuurlijk licht</li>
                    <li>• Reflector meenemen</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🎒 Aanbevolen uitrusting:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <ul class="space-y-1 text-gray-700">
                  <li>• Groothoek voor overzichten</li>
                  <li>• Macro voor details</li>
                  <li>• Telelens voor afstand</li>
                  <li>• Polarisatiefilter</li>
                </ul>
                <ul class="space-y-1 text-gray-700">
                  <li>• Licht statief</li>
                  <li>• Lens doekjes</li>
                  <li>• Plastic zak (knielen)</li>
                  <li>• Discrete cameratas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Detail van engelenbeeld op graf" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🎨 Compositie en onderwerpen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Begraafplaatsen bieden eindeloze mogelijkheden voor creatieve fotografie. Hier zijn enkele benaderingen:
            </p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-purple-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Monumenten en beelden:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Isoleer met ondiepe scherptediepte</li>
                  <li>• Gebruik natuurlijke kaders</li>
                  <li>• Let op symmetrie/patronen</li>
                  <li>• Speel met schaduwen</li>
                  <li>• Zoek unieke hoeken</li>
                </ul>
              </div>
              
              <div class="bg-pink-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Details en texturen:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Verweerde inscripties</li>
                  <li>• Mos en korstmos patronen</li>
                  <li>• Gebarsten steen textuur</li>
                  <li>• Symboliek close-ups</li>
                  <li>• IJzerwerk details</li>
                </ul>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Natuur elementen:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Oude bomen als onderwerp</li>
                  <li>• Seizoensveranderingen</li>
                  <li>• Wilde bloemen</li>
                  <li>• Vogels en vlinders</li>
                  <li>• Licht door bladeren</li>
                </ul>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Sfeer en emotie:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Mistige ochtenden</li>
                  <li>• Silhouetten</li>
                  <li>• Eenzame bankjes</li>
                  <li>• Paden en lanen</li>
                  <li>• Contrast oud/nieuw</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">⚖️ Juridische aspecten</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Fotograferen op begraafplaatsen heeft juridische aspecten waar u rekening mee moet houden.
          </p>
          
          <div class="space-y-4">
            <div class="bg-red-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🚫 Privacy en portretrecht:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Namen op recente graven zijn privacygevoelig</li>
                <li>• Herkenbare personen vragen toestemming</li>
                <li>• Rouwenden hebben recht op privacy</li>
                <li>• Publicatie kan kwetsend zijn voor nabestaanden</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📝 Toestemming en gebruik:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Persoonlijk gebruik:</h4>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Meestal toegestaan</li>
                    <li>• Respecteer huisregels</li>
                    <li>• Geen toestemming nodig</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Commercieel gebruik:</h4>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Schriftelijke toestemming vereist</li>
                    <li>• Mogelijk vergoeding</li>
                    <li>• Model release voor personen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Verschillende religies symbolen op begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🕊️ Culturele en religieuze gevoeligheid</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Verschillende culturen en religies hebben specifieke regels en gevoeligheden rond fotografie op begraafplaatsen.
            </p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">☪️ Islamitische begraafplaatsen:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Vraag altijd expliciet toestemming</li>
                  <li>• Respecteer gebedsruimtes</li>
                  <li>• Vermijd vrijdag namiddag</li>
                  <li>• Discrete kleding dragen</li>
                </ul>
                <p class="text-xs text-gray-600 mt-2">
                  Meer info: <a href="${getTypeLink('islamitische-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Islamitische begraafplaatsen</a>
                </p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">✡️ Joodse begraafplaatsen:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Mannen: hoofddeksel verplicht</li>
                  <li>• Geen fotografie op sabbat</li>
                  <li>• Terughoudend met publicatie</li>
                  <li>• Respecteer steentjes op graven</li>
                </ul>
                <p class="text-xs text-gray-600 mt-2">
                  Meer info: <a href="${getTypeLink('joodse-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Joodse begraafplaatsen</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💻 Delen en publiceren</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Het delen van begraafplaatsfoto's vraagt om zorgvuldige overweging.
          </p>
          
          <div class="space-y-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">✅ Verantwoord delen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Vermijd identificeerbare recente graven</li>
                <li>• Focus op historische of artistieke waarde</li>
                <li>• Geef context bij publicatie</li>
                <li>• Vermeld locatie voorzichtig</li>
                <li>• Respecteer reacties van nabestaanden</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📱 Social media tips:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Gebruik respectvolle hashtags</li>
                  <li>• Vermijd sensationeel taalgebruik</li>
                  <li>• Wees voorbereid op reacties</li>
                </ul>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Tag locatie voorzichtig</li>
                  <li>• Deel educatieve context</li>
                  <li>• Modereer commentaren</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">📋 Checklist voor fotografen</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voor vertrek:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>☐ Check openingstijden</li>
                <li>☐ Lees huisregels online</li>
                <li>☐ Controleer weer</li>
                <li>☐ Laad batterijen op</li>
                <li>☐ Discrete kleding kiezen</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Ter plaatse:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>☐ Meld u bij beheerder</li>
                <li>☐ Vraag naar restricties</li>
                <li>☐ Respecteer ceremonies</li>
                <li>☐ Blijf op paden</li>
                <li>☐ Wees discreet</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌟 Inspirerende begraafplaatsen voor fotografen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Nederland kent vele fotogenieke begraafplaatsen, elk met hun eigen karakter:
          </p>
          
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <span class="text-green-600 mr-2">📍</span>
              <span><strong><a href="${getCemeteryLink('Zorgvlied')}" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a>:</strong> Monumentale graven, beroemdheden</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">📍</span>
              <span><strong><a href="${getCemeteryLink('Nieuwe Oosterbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a>:</strong> Parkachtig, diverse culturen</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">📍</span>
              <span><strong><a href="${getCemeteryLink('Begraafplaats Crooswijk')}" class="text-blue-600 hover:text-blue-800 underline">Crooswijk Rotterdam</a>:</strong> Historisch, monumentaal</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">📍</span>
              <span><strong>Oude Begraafplaats Roermond:</strong> Beroemd grafmonument</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">📍</span>
              <span><strong><a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a>:</strong> Voor natuurfotografie</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Fotograferen met hart en respect</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Begraafplaatsfotografie kan resulteren in prachtige, betekenisvolle beelden die geschiedenis, kunst en emotie vastleggen. Door respect te tonen voor de plek, de overledenen en de nabestaanden, kunt u op een waardige manier de schoonheid en betekenis van deze bijzondere plaatsen delen.
          </p>
          <p class="text-gray-700">
            Vergeet niet: een begraafplaats is primair een plek van rouw en herinnering. Laat uw fotografie dit respecteren en eren. Voor meer informatie over etiquette op begraafplaatsen, lees ons artikel over <a href="/blog/begraafplaats-etiquette" class="text-blue-600 hover:text-blue-800 underline">begraafplaats etiquette</a>.
          </p>
        </div>
      </section>
    </div>
  `;

  // Article 11: oorlogsgraven-nederland-geschiedenis
  const artikel11 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Nederland telt duizenden oorlogsgraven die de stille getuigen zijn van de verschrikkingen van oorlog. Deze graven vertellen het verhaal van militairen en burgers die hun leven gaven voor onze vrijheid. Ontdek de geschiedenis, locaties en het belang van oorlogsgraven in Nederland.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Rijen witte kruizen op militaire begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🎖️ Wat zijn oorlogsgraven?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Oorlogsgraven zijn de laatste rustplaatsen van militairen en burgers die omkwamen tijdens oorlogshandelingen. In Nederland vinden we graven uit verschillende conflicten, maar de meeste dateren uit de Tweede Wereldoorlog. Deze graven worden eeuwigdurend onderhouden als eerbetoon aan hun offer.
            </p>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Categorieën oorlogsgraven in Nederland:</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🇳🇱</span>
                  <span><strong>Nederlandse militairen:</strong> Gesneuveld in mei 1940 of in verzet</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🇬🇧</span>
                  <span><strong>Geallieerde militairen:</strong> Vooral Britse, Canadese en Poolse bevrijders</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🇩🇪</span>
                  <span><strong>Duitse militairen:</strong> Op speciale begraafplaatsen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">👥</span>
                  <span><strong>Burgerslachtoffers:</strong> Bombardementen, razzia's, hongerwinter</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">✈️</span>
                  <span><strong>Vliegeniers:</strong> Neergestorte bemanningen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📜 Geschiedenis van oorlogsgraven</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De traditie van het eren van oorlogsslachtoffers heeft een lange geschiedenis, maar de systematische aanleg en het onderhoud van oorlogsgraven zoals we dat nu kennen, begon pas in de 20e eeuw.
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Voor 1940: Sporadische oorlogsgraven</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Napoleontische oorlogen: enkele graven bewaard</li>
                <li>• Eerste Wereldoorlog: vooral vluchtelingen en geïnterneerden</li>
                <li>• Belgische militairen (1914-1918) in Limburg</li>
                <li>• Individuele monumenten, geen systematisch beheer</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Tweede Wereldoorlog (1940-1945)</h3>
              <p class="text-gray-700 mb-2">De grootste categorie oorlogsgraven ontstond tijdens WOII:</p>
              <ul class="space-y-1 text-gray-700">
                <li>• <strong>Mei 1940:</strong> Nederlandse militairen tijdens de Duitse inval</li>
                <li>• <strong>1940-1944:</strong> Verzetsstrijders, onderduikers, represailleslachtoffers</li>
                <li>• <strong>1944-1945:</strong> Bevrijdingsslachtoffers, hongerwinter</li>
                <li>• <strong>Luchtoorlog:</strong> Duizenden geallieerde vliegeniers</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Na 1945: Systematisch beheer</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Oprichting Oorlogsgravenstichting (1946)</li>
                <li>• Herbegraving verspreide graven</li>
                <li>• Aanleg erebegraafplaatsen</li>
                <li>• Internationale samenwerking voor onderhoud</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Canadese militaire begraafplaats in Nederland" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🗺️ Belangrijke oorlogsbegraafplaatsen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Nederland kent verschillende types oorlogsbegraafplaatsen, van grote militaire erebegraafplaatsen tot kleine plaatselijke gedenkplekken.
            </p>
            
            <div class="space-y-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🇬🇧 Commonwealth begraafplaatsen:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Oosterbeek (Arnhem)</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• 1.764 graven</li>
                      <li>• Vooral Market Garden</li>
                      <li>• Britse en Poolse militairen</li>
                      <li>• Jaarlijkse herdenking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Bergen op Zoom</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• 1.266 graven</li>
                      <li>• Canadese militairen</li>
                      <li>• Bevrijding Zeeland</li>
                      <li>• Bezoekerscentrum</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🇳🇱 Nederlandse erebegraafplaatsen:</h3>
                <ul class="space-y-2 text-gray-700">
                  <li>• <strong>Grebbeberg (Rhenen):</strong> Nederlandse militairen mei 1940</li>
                  <li>• <strong>Loenen:</strong> Nationale erebegraafplaats, 4.000 graven</li>
                  <li>• <strong>Bloemendaal:</strong> Verzetsslachtoffers en gefusilleerden</li>
                  <li>• <strong>Westduin (Den Haag):</strong> Burgerslachtoffers bombardement</li>
                </ul>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🇺🇸 Amerikaanse begraafplaats:</h3>
                <div class="p-3 bg-white rounded">
                  <h4 class="font-medium text-gray-900">Margraten (Limburg)</h4>
                  <p class="text-sm text-gray-700 mt-1">
                    De enige Amerikaanse militaire begraafplaats in Nederland met 8.301 graven. Bekend om het adoptieprogramma waarbij Nederlanders graven onderhouden.
                  </p>
                </div>
              </div>
              
              <div class="bg-red-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🇩🇪 Duitse militaire begraafplaats:</h3>
                <div class="p-3 bg-white rounded">
                  <h4 class="font-medium text-gray-900">Ysselsteyn (Limburg)</h4>
                  <p class="text-sm text-gray-700 mt-1">
                    Grootste Duitse militaire begraafplaats in Nederland met 31.700 graven. Sobere inrichting, educatief centrum voor vredeseducatie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🕊️ Onderhoud en beheer</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Oorlogsgraven krijgen bijzondere aandacht en worden eeuwigdurend onderhouden volgens internationale verdragen.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Verantwoordelijke organisaties:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>Oorlogsgravenstichting:</strong> Nederlandse graven</li>
                <li>• <strong>CWGC:</strong> Commonwealth graven</li>
                <li>• <strong>ABMC:</strong> Amerikaanse graven</li>
                <li>• <strong>Volksbund:</strong> Duitse graven</li>
                <li>• <strong>Gemeenten:</strong> Lokale oorlogsgraven</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Onderhoudsprincipes:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Uniforme grafstenen per nationaliteit</li>
                <li>• Permanent onderhoud gegarandeerd</li>
                <li>• Geen onderscheid rang of afkomst</li>
                <li>• Respectvolle, sobere inrichting</li>
                <li>• Regelmatige renovatie monumenten</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p class="text-gray-700">
              <strong>Adoptie programma's:</strong> Veel oorlogsgraven worden "geadopteerd" door scholen of particulieren die bloemen leggen en het graf bezoeken.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Herdenking bij oorlogsgraven met kranslegging" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌺 Herdenkingen en ceremonies</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Bij oorlogsgraven vinden regelmatig herdenkingen plaats om de gevallenen te eren en de herinnering levend te houden.
            </p>
            
            <div class="space-y-4">
              <div class="bg-purple-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">📅 Jaarlijkse herdenkingen:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-gray-700">
                    <li>• <strong>4 mei:</strong> Nationale Dodenherdenking</li>
                    <li>• <strong>5 mei:</strong> Bevrijdingsdag ceremonies</li>
                    <li>• <strong>September:</strong> Market Garden herdenking</li>
                  </ul>
                  <ul class="space-y-1 text-gray-700">
                    <li>• <strong>November:</strong> Remembrance Day</li>
                    <li>• <strong>December:</strong> Hongerwinter herdenking</li>
                    <li>• <strong>Lokaal:</strong> Bevrijdingsdagen per regio</li>
                  </ul>
                </div>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🎺 Ceremoniële elementen:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Kransleggingen door autoriteiten</li>
                  <li>• Taptoe signaal en twee minuten stilte</li>
                  <li>• Voordracht namen gevallenen</li>
                  <li>• Veteranen en nabestaanden aanwezig</li>
                  <li>• Schoolkinderen leggen bloemen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🔍 Onderzoek naar oorlogsslachtoffers</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Voor nabestaanden en onderzoekers zijn er verschillende manieren om informatie over oorlogsslachtoffers te vinden.
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Online databases:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Oorlogsgravenstichting.nl</li>
                <li>• CWGC.org (Commonwealth)</li>
                <li>• ABMC.gov (Amerikaanse)</li>
                <li>• Volksbund.de (Duitse)</li>
                <li>• Nationaal Archief</li>
                <li>• NIOD oorlogsgetroffenen</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Informatie per graf:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Naam en rang</li>
                <li>• Geboortedatum en -plaats</li>
                <li>• Datum overlijden</li>
                <li>• Omstandigheden (soms)</li>
                <li>• Regiment/eenheid</li>
                <li>• Graflocatie exact</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🎓 Educatieve waarde</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Oorlogsgraven spelen een belangrijke rol in vredeseducatie en geschiedenisonderwijs.
          </p>
          
          <div class="space-y-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Educatieve programma's:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Rondleidingen voor scholen</li>
                <li>• Adoptieprogramma's voor klassen</li>
                <li>• Workshops vredeseducatie</li>
                <li>• Gesprekken met veteranen</li>
                <li>• Onderzoeksprojecten leerlingen</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Lessen uit oorlogsgraven:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Kosten van oorlog</li>
                  <li>• Waarde van vrede</li>
                  <li>• Internationale samenwerking</li>
                </ul>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Persoonlijke verhalen</li>
                  <li>• Historisch bewustzijn</li>
                  <li>• Democratische waarden</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">🌹 Een oorlogsgraf bezoeken</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voorbereiding:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Zoek informatie over de gevallene</li>
                <li>✓ Check openingstijden begraafplaats</li>
                <li>✓ Neem eventueel bloemen mee</li>
                <li>✓ Bereid kinderen voor</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Ter plaatse:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Respecteer de stilte</li>
                <li>✓ Loop niet over graven</li>
                <li>✓ Lees informatieborden</li>
                <li>✓ Teken gastenboek</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🗺️ Oorlogsgraven per provincie</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            In elke Nederlandse provincie bevinden zich oorlogsgraven, vaak verspreid over verschillende begraafplaatsen.
          </p>
          
          <div class="grid md:grid-cols-3 gap-3">
            <div class="bg-gray-50 rounded p-3">
              <h4 class="font-medium text-gray-900 text-sm"><a href="${getProvinceLink('Noord-Holland')}" class="text-blue-600 hover:text-blue-800 underline">Noord-Holland</a></h4>
              <p class="text-xs text-gray-600">Bloemendaal, Westerveld</p>
            </div>
            <div class="bg-gray-50 rounded p-3">
              <h4 class="font-medium text-gray-900 text-sm"><a href="${getProvinceLink('Zuid-Holland')}" class="text-blue-600 hover:text-blue-800 underline">Zuid-Holland</a></h4>
              <p class="text-xs text-gray-600">Westduin, Crooswijk</p>
            </div>
            <div class="bg-gray-50 rounded p-3">
              <h4 class="font-medium text-gray-900 text-sm"><a href="${getProvinceLink('Gelderland')}" class="text-blue-600 hover:text-blue-800 underline">Gelderland</a></h4>
              <p class="text-xs text-gray-600">Oosterbeek, Jonkerbos</p>
            </div>
            <div class="bg-gray-50 rounded p-3">
              <h4 class="font-medium text-gray-900 text-sm"><a href="${getProvinceLink('Noord-Brabant')}" class="text-blue-600 hover:text-blue-800 underline">Noord-Brabant</a></h4>
              <p class="text-xs text-gray-600">Bergen op Zoom, Mierlo</p>
            </div>
            <div class="bg-gray-50 rounded p-3">
              <h4 class="font-medium text-gray-900 text-sm"><a href="${getProvinceLink('Limburg')}" class="text-blue-600 hover:text-blue-800 underline">Limburg</a></h4>
              <p class="text-xs text-gray-600">Margraten, Ysselsteyn</p>
            </div>
            <div class="bg-gray-50 rounded p-3">
              <h4 class="font-medium text-gray-900 text-sm"><a href="${getProvinceLink('Utrecht')}" class="text-blue-600 hover:text-blue-800 underline">Utrecht</a></h4>
              <p class="text-xs text-gray-600">Loenen, Grebbeberg</p>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Lest we forget</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Oorlogsgraven zijn meer dan stenen monumenten - ze zijn tastbare herinneringen aan de prijs van vrijheid. Elk graf vertegenwoordigt een leven dat werd opgeofferd, een familie die rouwde, een toekomst die nooit werd vervuld. Door deze graven te bezoeken, te onderhouden en de verhalen door te vertellen, eren we niet alleen de gevallenen maar investeren we ook in vrede voor de toekomst.
          </p>
          <p class="text-gray-700">
            Bezoek een oorlogsbegraafplaats in uw regio en ervaar zelf de impact van deze bijzondere plekken. Gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> om oorlogsgraven bij u in de buurt te vinden, of bezoek een van de grote <a href="${getCemeteryLink('Erebegraafplaats Bloemendaal')}" class="text-blue-600 hover:text-blue-800 underline">erebegraafplaatsen</a> voor een indrukwekkende ervaring.
          </p>
        </div>
      </section>
    </div>
  `;

  // Article 12: kinderbegraafplaatsen-gevoelig-onderwerp
  const artikel12 = `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Kinderbegraafplaatsen zijn bijzondere plekken van troost en herinnering. Deze liefdevolle rustplaatsen voor de allerkleinsten vragen om extra zorg en aandacht. Dit artikel behandelt respectvol de geschiedenis, inrichting en betekenis van kinderbegraafplaatsen in Nederland.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Kleurrijke kindergraven met speelgoed en windmolentjes" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">💝 Een plek voor de kleinsten</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Kinderbegraafplaatsen zijn speciaal ingerichte gedeelten van begraafplaatsen waar baby's, kinderen en jongeren hun laatste rustplaats vinden. Deze plekken hebben vaak een heel eigen sfeer - minder somber, meer kleurrijk, met ruimte voor persoonlijke uitingen van verdriet en liefde.
            </p>
            
            <div class="bg-pink-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Waarom aparte kindergedeelten?</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-pink-600 mr-2">🌈</span>
                  <span><strong>Eigen sfeer:</strong> Speelse, lichte inrichting passend bij kinderen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-pink-600 mr-2">🤝</span>
                  <span><strong>Lotgenotencontact:</strong> Ouders vinden troost bij elkaar</span>
                </li>
                <li class="flex items-start">
                  <span class="text-pink-600 mr-2">🧸</span>
                  <span><strong>Vrijere expressie:</strong> Ruimte voor speelgoed, kleur, persoonlijke items</span>
                </li>
                <li class="flex items-start">
                  <span class="text-pink-600 mr-2">🕊️</span>
                  <span><strong>Aangepaste regels:</strong> Soepeler beleid voor decoratie</span>
                </li>
                <li class="flex items-start">
                  <span class="text-pink-600 mr-2">♾️</span>
                  <span><strong>Eeuwigdurend:</strong> Kindergraven worden vaak niet geruimd</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📜 Geschiedenis van kindergraven</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De manier waarop we omgaan met overleden kinderen is door de eeuwen heen sterk veranderd, beïnvloed door religie, cultuur en kindersterftecijfers.
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Vroeger: Hoge kindersterfte</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Tot 1900: 20-30% stierf voor 5e jaar</li>
                <li>• Ongedoopte kinderen vaak apart begraven</li>
                <li>• Arme gezinnen: algemene kindergraven</li>
                <li>• Weinig aandacht voor individuele graven</li>
                <li>• "Engeltjes" direct naar de hemel</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">20e eeuw: Veranderende opvattingen</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Dalende kindersterfte door betere zorg</li>
                <li>• Meer aandacht voor rouwverwerking</li>
                <li>• Eerste speciale kindergedeelten (jaren '60)</li>
                <li>• Persoonlijkere uitingen toegestaan</li>
                <li>• Erkenning rouw om doodgeboren kinderen</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Nu: Liefdevolle herdenkingsplekken</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Speciaal ontworpen kindergedeelten</li>
                <li>• Sterrenkinderen erkend en herdacht</li>
                <li>• Thematische inrichting (sprookjes, dieren)</li>
                <li>• Gedenkplekken voor vroeg overleden kinderen</li>
                <li>• Jaarlijkse herdenkingen (Wereldlichtjesdag)</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Ouders bij kindergraf met bloemen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌟 Verschillende categorieën</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Binnen kinderbegraafplaatsen worden vaak verschillende categorieën onderscheiden, elk met eigen kenmerken en regelgeving.
            </p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">⭐ Sterrenkinderen</h3>
                <p class="text-sm text-gray-700 mb-2">Baby's geboren voor 24 weken zwangerschap</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Sinds 2010 wettelijk erkend</li>
                  <li>• Speciale gedenkplekken</li>
                  <li>• Collectieve monumenten mogelijk</li>
                  <li>• Geen aangifte plicht</li>
                </ul>
              </div>
              
              <div class="bg-pink-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">👶 Baby's (0-1 jaar)</h3>
                <p class="text-sm text-gray-700 mb-2">Levend geboren, jong overleden</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Kleine grafjes/urnennisjes</li>
                  <li>• Vaak gratis grafrechten</li>
                  <li>• Speciale babyvelden</li>
                  <li>• Teddyberen en fopspenen</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🧒 Kinderen (1-12 jaar)</h3>
                <p class="text-sm text-gray-700 mb-2">Peuters tot prepubers</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Normale kindergraven</li>
                  <li>• Speelgoed toegestaan</li>
                  <li>• Kleurrijke monumenten</li>
                  <li>• Persoonlijke decoratie</li>
                </ul>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">👦 Jongeren (12-18 jaar)</h3>
                <p class="text-sm text-gray-700 mb-2">Tieners en adolescenten</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Reguliere of kinderveld</li>
                  <li>• Moderne uitingen</li>
                  <li>• Muziek/hobby referenties</li>
                  <li>• Vrienden betrokken</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🎨 Inrichting kindergedeelten</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Kinderbegraafplaatsen worden bewust anders ingericht dan reguliere begraafplaatsen, met oog voor troost en herkenning voor ouders en bezoekers.
          </p>
          
          <div class="space-y-4">
            <div class="bg-purple-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Landschappelijke elementen:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Speelse paden (kronkelend)</li>
                  <li>• Kleurrijke beplanting</li>
                  <li>• Beschutte hoekjes</li>
                  <li>• Waterpartijen/fonteinen</li>
                </ul>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Vlindertuin</li>
                  <li>• Sprookjesachtige elementen</li>
                  <li>• Zitplekken voor ouders</li>
                  <li>• Speeltoestellen nabij</li>
                </ul>
              </div>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Gemeenschappelijke voorzieningen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Centraal monument voor alle kinderen</li>
                <li>• Gedenkboom waar namen in gegraveerd worden</li>
                <li>• Vlinderweide voor asverstrooiing</li>
                <li>• Stilteruimte/kapel voor bezinning</li>
                <li>• Herdenkingsmuur met foto's</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
            alt="Wereldlichtjesdag kaarsjes op kindergraven" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🕯️ Rituelen en herdenkingen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Op kinderbegraafplaatsen vinden speciale rituelen en herdenkingen plaats die troost bieden aan ouders en families.
            </p>
            
            <div class="space-y-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Wereldlichtjesdag (2e zondag december)</h3>
                <p class="text-gray-700 mb-2">Wereldwijd aansteken van kaarsjes om 19:00 uur</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Gezamenlijke bijeenkomst op begraafplaats</li>
                  <li>• Lichtjes op alle kindergraven</li>
                  <li>• Muziek en gedichten</li>
                  <li>• Lichtjesgolf rond de wereld</li>
                  <li>• Troost in saamhorigheid</li>
                </ul>
              </div>
              
              <div class="bg-pink-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Andere herdenkingsmomenten:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Moederdag/Vaderdag</li>
                    <li>• Geboortedag kind</li>
                    <li>• Sterfdag</li>
                    <li>• Sinterklaas</li>
                  </ul>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Kerstmis</li>
                    <li>• Pasen</li>
                    <li>• Allerzielen</li>
                    <li>• Zomerpicknick</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💰 Kosten en regelingen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Veel gemeenten en begraafplaatsen hebben speciale regelingen voor kindergraven, erkennend dat het verlies van een kind extra zwaar is.
          </p>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kosten</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bijzonderheden</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Sterrenkinderen</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Vaak gratis</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Collectieve plek mogelijk</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Baby's < 1 jaar</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€0 - €500</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Vaak gratis grafrechten</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Kinderen 1-12</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€250 - €1000</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Gereduceerd tarief</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Jongeren 12-18</td>
                  <td class="px-4 py-2 text-sm text-gray-700">€500 - €1500</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Soms kindertarief</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-900">Onderhoud</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Vaak inbegrepen</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Gemeente verzorgt basis</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-700">
              💚 <strong>Tip:</strong> Veel <a href="${getMunicipalityLink('Amsterdam')}" class="text-blue-600 hover:text-blue-800 underline">gemeenten</a> hebben coulanceregeling voor kindergraven. Informeer naar de mogelijkheden.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🤝 Steun en lotgenotencontact</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Kinderbegraafplaatsen zijn vaak plekken waar ouders elkaar ontmoeten en steun vinden bij lotgenoten.
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-purple-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Ondersteuning op begraafplaats:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Ontmoetingsruimte voor ouders</li>
                <li>• Koffie-ochtenden</li>
                <li>• Gezamenlijke herdenkingen</li>
                <li>• Vrijwilligers voor gesprek</li>
                <li>• Doorverwijzing hulpverlening</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Landelijke organisaties:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Vereniging Ouders van een Overleden Kind</li>
                <li>• Stichting Lieve Engeltjes</li>
                <li>• In Ons Verlies Verenigd</li>
                <li>• Stichting Achter de Regenboog</li>
                <li>• Lokale rouwgroepen</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">🌈 Een kindergraf bezoeken</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voor ouders/familie:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Neem de tijd, geen haast</li>
                <li>✓ Breng persoonlijke items mee</li>
                <li>✓ Praat tegen uw kind</li>
                <li>✓ Vier speciale dagen</li>
                <li>✓ Zoek steun als nodig</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voor andere bezoekers:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Wees extra respectvol</li>
                <li>✓ Raak niets aan</li>
                <li>✓ Geef ouders ruimte</li>
                <li>✓ Staar niet</li>
                <li>✓ Houd kinderen dicht bij u</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌍 Bekende kinderbegraafplaatsen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Enkele Nederlandse begraafplaatsen staan bekend om hun bijzondere kindergedeelten:
          </p>
          
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">📍</span>
              <span><strong><a href="${getCemeteryLink('Nieuwe Oosterbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a>:</strong> Groot kindergedeelte met vijver</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">📍</span>
              <span><strong>Sint Barbara Utrecht:</strong> Kleurrijk ingericht kinderperk</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">📍</span>
              <span><strong>Westerveld Driehuis:</strong> Natuurlijk kindergedeelte</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">📍</span>
              <span><strong>Vredehof Rotterdam:</strong> Moderne kinderbegraafplaats</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">📍</span>
              <span><strong><a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a>:</strong> Speciale kindervelden in natuur</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Liefde kent geen grenzen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Kinderbegraafplaatsen zijn plekken waar liefde tastbaar wordt - in elk speelgoedje, elke windmolen, elk gekleurd steentje. Ze laten zien dat hoewel een kinderleven kort kan zijn, de liefde en herinnering eeuwig voortleven. Deze bijzondere plekken bieden troost aan ouders en laten zien dat hun kinderen niet vergeten worden.
          </p>
          <p class="text-gray-700">
            Voor ouders die een kind verloren hebben: weet dat er plekken zijn waar uw verdriet erkend wordt en waar de herinnering aan uw kind met respect en liefde wordt gekoesterd. Voor meer informatie over begraafplaatsen met kindergedeelten in uw regio, gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a>.
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
    path.join(contentDir, 'begraafplaats-fotografie-tips-etiquette.html'),
    artikel10.trim()
  );
  console.log('✅ Generated content for: begraafplaats-fotografie-tips-etiquette');

  fs.writeFileSync(
    path.join(contentDir, 'oorlogsgraven-nederland-geschiedenis.html'),
    artikel11.trim()
  );
  console.log('✅ Generated content for: oorlogsgraven-nederland-geschiedenis');

  fs.writeFileSync(
    path.join(contentDir, 'kinderbegraafplaatsen-gevoelig-onderwerp.html'),
    artikel12.trim()
  );
  console.log('✅ Generated content for: kinderbegraafplaatsen-gevoelig-onderwerp');

  console.log('\n✅ Successfully generated 3 more blog articles (batch 3)!');
};

// Run the script
generateBatch3();