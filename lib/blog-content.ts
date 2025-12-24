import { getCemeteryLink, getProvinceLink, getMunicipalityLink, getTypeLink } from './blog-data';

interface BlogContent {
  [key: string]: string;
}

export const blogContent: BlogContent = {
  'mooiste-historische-begraafplaatsen-nederland': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Nederland herbergt talloze historische begraafplaatsen die niet alleen rustplaatsen zijn, maar ook belangrijke cultuurhistorische monumenten. Deze bijzondere plekken vertellen het verhaal van ons land, van beroemde Nederlanders tot vergeten helden. Ontdek de 10 mooiste historische begraafplaatsen die elke geschiedenisliefhebber gezien moet hebben.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npOmUScTyyCoKO6eW3IJvktSM3lFUuz2ss6Jx2UgULGY0H-JaXjWmMSR8Jb-0I2ldKROe77xAKiRUofd-IeXkq5tRZZDEl9IDkTHoNhglsm_ITDJ8vV7t9inO9t-HlBhfHCoRGI=w800-h500-k-no" 
            alt="Begraafplaats Sint Jozef Geldrop - historische graven" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">1. Zorgvlied - Amsterdam</h2>
            <p class="text-gray-700 leading-relaxed">
              De begraafplaats <a href="${getCemeteryLink('Zorgvlied')}" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied in Amsterdam</a> is zonder twijfel een van de meest prestigieuze begraafplaatsen van Nederland. Geopend in 1870, ligt deze monumentale begraafplaats aan de Amsteldijk en is de laatste rustplaats van vele prominente Nederlanders.
            </p>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <strong>Bijzondere graven:</strong> Simon Carmiggelt, Theo Thijssen, Gerard Reve
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Nieuwe Oosterbegraafplaats Amsterdam" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">2. Nieuwe Oosterbegraafplaats - Amsterdam</h2>
            <p class="text-gray-700 leading-relaxed">
              Aangelegd in 1894, is de <a href="${getCemeteryLink('Nieuwe Oosterbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Oosterbegraafplaats</a> een parkachtige begraafplaats met prachtige lanen, monumentale bomen en imposante grafmonumenten. Deze begraafplaats is een groen oase in de stad en een belangrijk cultuurhistorisch monument.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Begraafplaats & Crematorium Westerveld" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">3. Westerveld - Driehuis</h2>
            <p class="text-gray-700 leading-relaxed">
              <a href="${getCemeteryLink('Begraafplaats & Crematorium Westerveld')}" class="text-blue-600 hover:text-blue-800 underline">Westerveld</a> (1888) is niet alleen een van de oudste begraafplaatsen, maar ook de locatie van het eerste crematorium van Nederland (1914). Deze begraafplaats in de duinen combineert natuurlijke schoonheid met historische betekenis.
            </p>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <strong>Rating:</strong> ⭐ 4.4/5 (63 reviews) • <strong>Type:</strong> Crematorium & Begraafplaats
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPLxVZGv0XaHGBp7lcdnQa50d0tqMuqF4rWBfSs=s1360-w1360-h1020" 
            alt="Begraafplaats Crooswijk Rotterdam" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">4. Crooswijk - Rotterdam</h2>
            <p class="text-gray-700 leading-relaxed">
              De algemene begraafplaats <a href="${getCemeteryLink('Begraafplaats Crooswijk')}" class="text-blue-600 hover:text-blue-800 underline">Crooswijk</a> uit 1829 is de oudste nog in gebruik zijnde begraafplaats van Rotterdam. Met zijn monumentale graven en rijke geschiedenis is het een belangrijk onderdeel van het Rotterdamse erfgoed.
            </p>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <strong>Rating:</strong> ⭐ 4.4/5 (55 reviews) • <strong>Provincie:</strong> <a href="${getProvinceLink('Zuid-Holland')}" class="text-blue-600 hover:text-blue-800">Zuid-Holland</a>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=Gl6jP-lngA0SpmDDAjlBZg&cb_client=search.gws-prod.gps&w=800&h=500&yaw=343.81036&pitch=0&thumbfov=100" 
            alt="Oude Begraafplaats Deventer - historische begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">5. Oude Begraafplaats - Deventer</h2>
            <p class="text-gray-700 leading-relaxed">
              De <a href="${getCemeteryLink('Stichting Oude Begraafplaatsen Deventer')}" class="text-blue-600 hover:text-blue-800 underline">Oude Begraafplaats in Deventer</a> beheert meerdere historische begraafplaatsen in de stad. Deze eeuwenoude rustplaatsen zijn rijk aan geschiedenis en bevatten vele monumentale graven.
            </p>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <strong>Provincie:</strong> <a href="${getProvinceLink('Overijssel')}" class="text-blue-600 hover:text-blue-800">Overijssel</a> • <strong>Type:</strong> Historische begraafplaats
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipNcJx3Q5JBMKWzGXfh0PeIZx98MFKhzC1LoqLn7=s1360-w1360-h1020" 
            alt="St. Bavo kerkhof Haarlem" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">6. St. Bavo Kerkhof - Haarlem</h2>
            <p class="text-gray-700 leading-relaxed">
              Het historische <a href="${getCemeteryLink('St. Bavo kerkhof')}" class="text-blue-600 hover:text-blue-800 underline">St. Bavo kerkhof</a> in Haarlem is een van de best bewaarde middeleeuwse kerkhoven van Nederland. Met zijn eeuwenoude grafstenen en serene sfeer is het een uniek stukje geschiedenis.
            </p>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <strong>Rating:</strong> ⭐ 5.0/5 • <strong>Type:</strong> Historisch kerkhof
              </p>
            </div>
          </div>
        </div>

        <div class="prose prose-lg max-w-none mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-3">7. Oude Begraafplaats - Roermond</h2>
          <p class="text-gray-700 leading-relaxed">
            De <a href="${getMunicipalityLink('Roermond')}" class="text-blue-600 hover:text-blue-800 underline">Oude Begraafplaats in Roermond</a> is beroemd om zijn rijke geschiedenis en prachtige funeraire kunst. De begraafplaats herbergt vele monumentale graven uit de 19e eeuw.
          </p>

          <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-8">8. Begraafplaats Oud Eik en Duinen - Den Haag</h2>
          <p class="text-gray-700 leading-relaxed">
            Deze monumentale begraafplaats in <a href="${getMunicipalityLink('Den Haag')}" class="text-blue-600 hover:text-blue-800 underline">Den Haag</a> is de laatste rustplaats van vele bekende Hagenaars en nationale figuren. De parkachtige aanleg maakt het tot een oase van rust in de stad.
          </p>

          <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-8">9. Noorderbegraafplaats - Groningen</h2>
          <p class="text-gray-700 leading-relaxed">
            De <a href="${getMunicipalityLink('Groningen')}" class="text-blue-600 hover:text-blue-800 underline">Noorderbegraafplaats in Groningen</a> uit 1823 is een van de oudste algemene begraafplaatsen van Nederland. Het is een groene long in de stad met veel monumentale graven.
          </p>

          <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-8">10. Begraafplaats Soestbergen - Utrecht</h2>
          <p class="text-gray-700 leading-relaxed">
            Gelegen op de Utrechtse Heuvelrug biedt <a href="${getProvinceLink('Utrecht')}" class="text-blue-600 hover:text-blue-800 underline">Begraafplaats Soestbergen</a> een unieke combinatie van natuurlijke schoonheid en historische waarde. De begraafplaats is bekend om zijn landschappelijke aanleg.
          </p>

          <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-8">11. Oude Begraafplaats - Naarden</h2>
          <p class="text-gray-700 leading-relaxed">
            In de vestingstad Naarden ligt deze sfeervolle oude begraafplaats met graven die teruggaan tot de 17e eeuw. De locatie binnen de vestingwallen maakt het extra bijzonder.
          </p>
        </div>

        <div class="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Tips voor het bezoeken van historische begraafplaatsen</h2>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Respecteer de rust en sereniteit van de plek</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Neem de tijd om de grafmonumenten te bewonderen</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Veel begraafplaatsen bieden rondleidingen aan</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">•</span>
              <span>Fotografeer respectvol, zonder nabestaanden te storen</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <p class="text-gray-700 italic">
            Deze historische begraafplaatsen zijn niet alleen rustplaatsen, maar ook waardevolle cultuurhistorische monumenten. Ze vertellen het verhaal van Nederland, van beroemde landgenoten tot vergeten helden. Een bezoek aan deze bijzondere plekken is een reis door de tijd die elke geschiedenisliefhebber gemaakt moet hebben.
          </p>
        </div>
      </section>
    </div>
  `,
  
  'crematie-versus-begraven-wat-past-bij-u': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        De keuze tussen crematie en begraven is zeer persoonlijk en wordt beïnvloed door religieuze overtuigingen, culturele tradities, financiële overwegingen en milieuaspecten. In deze uitgebreide gids vergelijken we beide opties om u te helpen de juiste keuze te maken.
      </p>
      
      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Wat is het verschil tussen crematie en begraven?</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Bij een begrafenis wordt het lichaam van de overledene in een kist in de grond begraven, meestal op een <a href="${getProvinceLink('Noord-Holland')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaats in uw provincie</a>. Crematie daarentegen is het proces waarbij het lichaam door verbranding wordt gereduceerd tot as, die vervolgens kan worden bewaard, verstrooid of bijgezet.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6 mt-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Begraven</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Fysieke rustplaats</li>
                <li>• Traditionele keuze</li>
                <li>• Graf als herinneringsplek</li>
                <li>• Hogere kosten</li>
              </ul>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Crematie</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Flexibele asbestemming</li>
                <li>• Moderne optie</li>
                <li>• Diverse herinneringsmogelijkheden</li>
                <li>• Lagere kosten</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4novOyfkEOfDs9EL4cXINxbtUUSCJUcSyEzXSFLqNLZu014MVdIyez1iTL8H3-Cf1Tj8ob6YAuXlRcqthCkTnqmbMBKMA6Vlz19cMCWe27ru7CoVoe6k7CZ3GWC4zmnO8_ZxVhR5=w800-h500-k-no" 
            alt="Algemene Begraafplaats Sint Maartensbrug - traditionele begraafoptie" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Kosten: Crematie vs Begraven</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Over het algemeen is crematie goedkoper dan begraven. De gemiddelde kosten in 2025:
            </p>
            
            <div class="bg-blue-50 rounded-lg p-6 mb-4">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">💰 Crematie</h3>
                  <ul class="space-y-1 text-gray-700">
                    <li><strong>Basis:</strong> €3.500 - €6.000</li>
                    <li><strong>Uitgebreid:</strong> €6.000 - €10.000</li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">💰 Begrafenis</h3>
                  <ul class="space-y-1 text-gray-700">
                    <li><strong>Basis:</strong> €5.000 - €8.000</li>
                    <li><strong>Uitgebreid:</strong> €8.000 - €15.000+</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 class="font-bold text-gray-900 mb-2">Extra kosten bij een begrafenis:</h3>
            <ul class="space-y-2 text-gray-700 mb-4">
              <li>📍 <strong>Grafrechten (20-30 jaar):</strong> €1.500 - €5.000</li>
              <li>🪦 <strong>Grafsteen:</strong> €1.000 - €5.000</li>
              <li>🌿 <strong>Jaarlijks onderhoud:</strong> €50 - €200</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Emotionele en culturele aspecten</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">✓ Voordelen van begraven:</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Fysieke plek om te bezoeken en te rouwen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Traditioneel en vertrouwd voor veel families</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Mogelijkheid voor persoonlijk grafmonument</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Verbinding met voorouders op <a href="${getCemeteryLink('Oude Algemene Begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">historische begraafplaatsen</a></span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">✓ Voordelen van crematie:</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Flexibiliteit in het bewaren of verstrooien van as</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Geen zorgen over grafonderhoud</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Mogelijkheid om as te verdelen onder familieleden</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">•</span>
                  <span>Milieuvriendelijker in sommige opzichten</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Religieuze overwegingen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Verschillende religies hebben specifieke voorschriften:
            </p>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">✝️ Christendom</h3>
                <p class="text-sm text-gray-700">Beide opties algemeen geaccepteerd</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">☪️ Islam</h3>
                <p class="text-sm text-gray-700">Alleen begraven toegestaan</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">✡️ Jodendom</h3>
                <p class="text-sm text-gray-700">Traditioneel alleen begraven</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🕉️ Hindoeïsme</h3>
                <p class="text-sm text-gray-700">Crematie is de norm</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">☸️ Boeddhisme</h3>
                <p class="text-sm text-gray-700">Beide opties mogelijk</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPiQ2UQzFQq6W_k5V3Z4YmcNqKbqW7xK9tOXfU=s1360-w1360-h1020" 
            alt="Natuurbegraafplaats in Nederland" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Milieuaspecten</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De milieu-impact van beide opties:
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">🔥 Crematie:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• CO2-uitstoot door verbranding</li>
                  <li>• Energieverbruik (gas/elektriciteit)</li>
                  <li>• Geen langdurig ruimtegebruik</li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">⚱️ Begraven:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Langdurig landgebruik</li>
                  <li>• Mogelijke bodemverontreiniging</li>
                  <li>• Onderhoud begraafplaats</li>
                </ul>
              </div>
            </div>
            
            <div class="mt-4 p-4 bg-green-50 rounded-lg">
              <p class="text-gray-700">
                🌿 Voor de meest milieuvriendelijke optie kunt u kiezen voor een <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">natuurbegraafplaats</a> of bio-crematie.
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Praktische overwegingen</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">⏰ Tijdsdruk</h3>
              <p class="text-gray-700">
                Bij een begrafenis moet de uitvaart meestal binnen 6 dagen plaatsvinden. Bij crematie is er vaak meer flexibiliteit, hoewel dit afhangt van de beschikbaarheid van het crematorium.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">📍 Locatie</h3>
              <p class="text-gray-700">
                Controleer de beschikbaarheid van <a href="${getMunicipalityLink('Amsterdam')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaatsen in uw gemeente</a>. Sommige begraafplaatsen hebben wachtlijsten of specifieke voorwaarden.
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Nieuwe trends en alternatieven</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Naast traditionele opties zijn er nieuwe mogelijkheden:
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">💧 Resomatie</h3>
              <p class="text-sm text-gray-700">Alkalische hydrolyse als milieuvriendelijk alternatief</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">❄️ Cryomatie</h3>
              <p class="text-sm text-gray-700">Vriesdrogen van het lichaam</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌳 Natuurbegraven</h3>
              <p class="text-sm text-gray-700">Zonder kist in natuurgebied</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌊 Zeebegrafenis</h3>
              <p class="text-sm text-gray-700">Asverstrooiing op zee</p>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Hoe maak je de juiste keuze?</h2>
          <p class="text-gray-700 mb-4">Overweeg de volgende vragen:</p>
          
          <ol class="space-y-2 text-gray-700">
            <li>1️⃣ Wat zijn mijn religieuze of spirituele overtuigingen?</li>
            <li>2️⃣ Wat kan ik financieel dragen?</li>
            <li>3️⃣ Wil ik een vaste plek voor nabestaanden?</li>
            <li>4️⃣ Wat zijn mijn wensen voor het milieu?</li>
            <li>5️⃣ Wat voelt goed voor mij en mijn familie?</li>
          </ol>
        </div>
        
        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Conclusie</h2>
          <p class="text-gray-700 leading-relaxed">
            Er is geen 'juiste' keuze tussen crematie en begraven - het is een zeer persoonlijke beslissing. Neem de tijd om alle aspecten te overwegen en bespreek uw wensen met uw dierbaren. Of u nu kiest voor een traditionele begrafenis op een <a href="${getCemeteryLink('Nieuwe Oosterbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">historische begraafplaats</a> of voor crematie, het belangrijkste is dat de keuze aansluit bij uw waarden en wensen.
          </p>
          
          <p class="text-gray-700 mt-4">
            Voor meer informatie over specifieke begraafplaatsen in uw regio, bekijk onze <a href="/provincie" class="text-blue-600 hover:text-blue-800 underline">overzicht per provincie</a> of zoek naar <a href="/" class="text-blue-600 hover:text-blue-800 underline">begraafplaatsen in uw buurt</a>.
          </p>
        </div>
      </section>
    </div>
  `,
  
  'wat-kost-begrafenis-crematie-2025': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        De kosten van een uitvaart kunnen sterk variëren. In dit artikel geven we een volledig overzicht van alle kosten die komen kijken bij een begrafenis of crematie in 2025, inclusief praktische tips om kosten te besparen zonder in te leveren op een waardig afscheid.
      </p>
      
      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💰 Gemiddelde kosten uitvaart in Nederland</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De gemiddelde kosten voor een uitvaart in Nederland liggen tussen de €5.000 en €12.000. Dit verschilt sterk per regio en persoonlijke wensen:
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🔥 Crematie</h3>
              <ul class="space-y-1 text-gray-700">
                <li><strong>Basis:</strong> €3.500 - €6.000</li>
                <li><strong>Uitgebreid:</strong> €6.000 - €10.000</li>
              </ul>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">⚱️ Begrafenis</h3>
              <ul class="space-y-1 text-gray-700">
                <li><strong>Basis:</strong> €5.000 - €8.000</li>
                <li><strong>Uitgebreid:</strong> €8.000 - €15.000+</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPBMcPNkN8uMjhrkKWyq45jmXOjW4hYAJ5VRKmE=s1360-w1360-h1020" 
            alt="Protestantse begraafplaats Vredehof Lichtenvoorde - verschillende begraafplaatstypen beïnvloeden kosten" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 Kosten uitvaartondernemer</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De uitvaartondernemer regelt veel zaken en de kosten variëren van €1.500 tot €3.500. Dit omvat:
            </p>
            
            <ul class="space-y-2 text-gray-700">
              <li>✓ Begeleiding en coördinatie</li>
              <li>✓ Verzorging van de overledene</li>
              <li>✓ Regelen van documenten</li>
              <li>✓ 24/7 bereikbaarheid</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💸 Kosten per onderdeel</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">⚰️ Kist of wade</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <ul class="space-y-1 text-gray-700">
                  <li>• Eenvoudige kist: €400 - €800</li>
                  <li>• Standaard kist: €800 - €1.500</li>
                  <li>• Luxe kist: €1.500 - €5.000+</li>
                  <li>• Eco-kist: €600 - €1.200</li>
                  <li>• Wade (voor crematie): €200 - €500</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">🚗 Vervoer</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <ul class="space-y-1 text-gray-700">
                  <li>• Rouwauto: €275 - €450</li>
                  <li>• Volgauto's: €150 - €250 per auto</li>
                  <li>• Laatste rit verzorging: €200 - €400</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">🏛️ Locatiekosten</h3>
              <p class="text-gray-700 mb-2">
                Voor een uitvaart op een <a href="${getMunicipalityLink('Den Haag')}" class="text-blue-600 hover:text-blue-800 underline">begraafplaats in uw gemeente</a>:
              </p>
              <div class="bg-gray-50 rounded-lg p-4">
                <ul class="space-y-1 text-gray-700">
                  <li>• Aula gebruik: €300 - €800</li>
                  <li>• Condoleanceruimte: €150 - €400</li>
                  <li>• Koffiekamer: €200 - €500</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">⚱️ Specifieke kosten begrafenis</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">📍 Grafrechten</h3>
              <p class="text-gray-700 mb-2">
                De kosten voor een graf verschillen per <a href="${getProvinceLink('Zuid-Holland')}" class="text-blue-600 hover:text-blue-800 underline">provincie</a> en gemeente:
              </p>
              <div class="bg-yellow-50 rounded-lg p-4">
                <ul class="space-y-1 text-gray-700">
                  <li>• Algemeen graf: €500 - €1.500 (10 jaar)</li>
                  <li>• Particulier graf: €1.500 - €5.000 (20-30 jaar)</li>
                  <li>• Kindergraf: €250 - €1.000</li>
                  <li>• Urnengraf: €750 - €2.500</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">🪦 Grafmonument</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <ul class="space-y-1 text-gray-700">
                  <li>• Eenvoudige grafsteen: €1.000 - €2.000</li>
                  <li>• Standaard monument: €2.000 - €4.000</li>
                  <li>• Luxe monument: €4.000 - €10.000+</li>
                  <li>• Plaatsingskosten: €200 - €500</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">⚒️ Begraafkosten</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <ul class="space-y-1 text-gray-700">
                  <li>• Delven en dichten graf: €600 - €1.200</li>
                  <li>• Gebruik graflift: €150 - €300</li>
                  <li>• Extra diep graf: €200 - €400 extra</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPQYLO3Y_XZBwQKoUjXKqHb0ENk1sVxZJvQqH8=s1360-w1360-h1020" 
            alt="Verschillende soorten urnen voor crematie" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🔥 Specifieke kosten crematie</h2>
            
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Crematiekosten</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <ul class="space-y-1 text-gray-700">
                    <li>• Crematie zelf: €500 - €700</li>
                    <li>• Gebruik aula crematorium: €400 - €800</li>
                    <li>• Extra tijd aula: €150 - €300 per 30 min</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Asbestemming</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <ul class="space-y-1 text-gray-700">
                    <li>• Standaard urn: €75 - €200</li>
                    <li>• Design urn: €200 - €1.000+</li>
                    <li>• Asverstrooiing op <a href="${getCemeteryLink('Westerveld')}" class="text-blue-600 hover:text-blue-800 underline">gedenkpark</a>: €150 - €400</li>
                    <li>• Columbarium plaats: €500 - €2.000 (10 jaar)</li>
                    <li>• Assieraad: €100 - €500</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-green-50 rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💡 Besparingstips zonder concessies</h2>
          
          <div class="space-y-4">
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">1. Vergelijk uitvaartondernemers</h3>
              <p class="text-gray-700">
                Vraag meerdere offertes aan. De prijsverschillen kunnen oplopen tot €2.000 voor dezelfde diensten.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">2. Kies voor doordeweekse dagen</h3>
              <p class="text-gray-700">
                Uitvaarten op zaterdag zijn vaak €500-€1.000 duurder. Een <a href="${getTypeLink('islamitische-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">islamitische begraafplaats</a> hanteert vaak vaste tarieven.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">3. Overweeg een natuurbegraafplaats</h3>
              <p class="text-gray-700">
                <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a> zijn vaak goedkoper en milieuvriendelijker.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">4. Beperk de plechtigheden</h3>
              <p class="text-gray-700">
                Een intieme ceremonie met alleen naaste familie kan duizenden euro's schelen.
              </p>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">5. Doe zelf wat mogelijk is</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Zelf rouwkaarten ontwerpen en printen</li>
                <li>• Familie als dragers</li>
                <li>• Eigen catering verzorgen</li>
                <li>• Zelf bloemen schikken</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🛡️ Uitvaartverzekering</h2>
          <p class="text-gray-700 mb-4">Een uitvaartverzekering kan helpen de kosten te dekken:</p>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Natura verzekering</h3>
              <p class="text-sm text-gray-700">Dekt specifieke diensten</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Kapitaalverzekering</h3>
              <p class="text-sm text-gray-700">Keert bedrag uit (€3.000 - €15.000)</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Premie</h3>
              <p class="text-sm text-gray-700">€5 - €25 per maand</p>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">📍 Regionale verschillen</h2>
          <p class="text-gray-700">
            De kosten verschillen sterk per regio. In de Randstad zijn uitvaarten gemiddeld 20-30% duurder dan in andere delen van het land. Bekijk de <a href="/provincie/noord-brabant" class="text-blue-600 hover:text-blue-800 underline">begraafplaatsen in Noord-Brabant</a> voor meer betaalbare opties.
          </p>
        </div>
        
        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Conclusie</h2>
          <p class="text-gray-700 leading-relaxed">
            Een waardig afscheid hoeft niet onbetaalbaar te zijn. Door goed te vergelijken, bewuste keuzes te maken en creatief te zijn, kunt u aanzienlijk besparen. Het belangrijkste is dat de uitvaart past bij de wensen van de overledene en troost biedt aan nabestaanden.
          </p>
          
          <p class="text-gray-700 mt-4">
            Voor actuele tarieven van specifieke begraafplaatsen, bezoek onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie voor begraafplaatsen</a> en filter op uw gemeente.
          </p>
        </div>
      </section>
    </div>
  `,
  
  'geschiedenis-nederlandse-begraafplaatsen': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        De geschiedenis van Nederlandse begraafplaatsen is een fascinerende reis door eeuwen van tradities, geloof en maatschappelijke veranderingen. Van middeleeuwse kerkhoven tot moderne gedenkparken - ontdek hoe onze laatste rustplaatsen zijn geëvolueerd en wat ze ons vertellen over de Nederlandse cultuur en samenleving.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrp0_hpvN4MzQ4OUHV2nPORpcvXHFV0tW8019VsO4gvI_-LVdhk-kf1iLX-eBWxzHF_-X9EBzYCSZMOTAowdd3zDRJXz-8Ii4QgIlJk801JFFpPV94fDyK3eLLwXllSjYguL3w0gcFTpTyf=w800-h500-k-no" 
            alt="Stichting Roomsch-Katholieke Begraafplaats Sint Jozef Den Helder - historisch kerkhof" 
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
  `,
  
  'begraafplaats-etiquette': `
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
            src="https://lh3.googleusercontent.com/p/AF1QipOhqBu3MwGhsXgN7sLYIJ4VdcUnVGJKJL5VmBhW=s1360-w1360-h1020" 
            alt="Islamitische begraafplaats Raza Ul Mawa Almere - etiquette varieert per religieuze traditie" 
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
  `,
  
  'kosten-begraven-nederland-overzicht': `
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
            src="https://lh3.googleusercontent.com/p/AF1QipP8l_e7u6TH4Dp8TRFgJJAiJKbvQD06gOE4jhY=s1360-w1360-h1020" 
            alt="Katholieke begraafplaats duistervoorde Twello - traditionele begraafplaats" 
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
  `,

  'kiezen-laatste-rustplaats': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Het kiezen van een laatste rustplaats is een van de meest persoonlijke en belangrijke beslissingen die u kunt maken. Of u nu vooruit plant of in een moeilijke tijd een keuze moet maken, deze gids helpt u bij alle praktische overwegingen en emotionele aspecten van het kiezen van de juiste begraafplaats.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🤔 Waar moet u beginnen?</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Het kiezen van een begraafplaats begint met het beantwoorden van enkele fundamentele vragen. Deze vragen helpen u om uw zoektocht te verfijnen en de juiste keuze te maken.
          </p>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">Belangrijke eerste vragen:</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">1.</span>
                <span>Wilt u begraven worden of gecremeerd?</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">2.</span>
                <span>Heeft u een voorkeur voor een bepaalde locatie of gemeente?</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">3.</span>
                <span>Zijn er religieuze of culturele voorkeuren?</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">4.</span>
                <span>Wat is uw budget voor grafrechten en onderhoud?</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-600 mr-2">5.</span>
                <span>Wilt u bij familie begraven worden?</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqEs3pDLH5wIRLJIbcdOQWVfqQ7wM9WcHqyrIZeaF9BtrX2-Edd0dsmAxTxLt7gIzegHF9RSB_IscmEqwNU5nDL43Om3iezqfjgfamljY_5RzxhDojscgn4y7L5PZ48qrn6oCkB=w800-h500-k-no" 
            alt="Begraafplaats Protestantse Gemeente Hummelo - verschillende types begraafplaatsen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📍 Locatie: De belangrijkste factor</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Voor de meeste mensen is de locatie van de begraafplaats de belangrijkste overweging. Denk hierbij aan:
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Nabijheid voor nabestaanden</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Bereikbaarheid met auto en openbaar vervoer</li>
                  <li>• Afstand voor regelmatige bezoeken</li>
                  <li>• Parkeermogelijkheden</li>
                  <li>• Toegankelijkheid voor ouderen/mindervaliden</li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Verbinding met de omgeving</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• Geboorteplaats of woonplaats</li>
                  <li>• Plaats met speciale herinneringen</li>
                  <li>• Nabij familie of partner</li>
                  <li>• Mooie, rustige omgeving</li>
                </ul>
              </div>
            </div>
            
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-700">
                💡 <strong>Tip:</strong> Gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> om begraafplaatsen in uw gewenste <a href="${getMunicipalityLink('utrecht')}" class="text-blue-600 hover:text-blue-800 underline">gemeente</a> of <a href="${getProvinceLink('noord-brabant')}" class="text-blue-600 hover:text-blue-800 underline">provincie</a> te vinden.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">⛪ Types begraafplaatsen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Nederland kent verschillende soorten begraafplaatsen, elk met eigen kenmerken en mogelijkheden:
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">1. Gemeentelijke begraafplaatsen</h3>
              <p class="text-gray-700 mb-2">De meest voorkomende vorm, beheerd door de gemeente.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>✓ Voor iedereen toegankelijk</li>
                <li>✓ Verschillende grafsoorten beschikbaar</li>
                <li>✓ Vaak goedkoper dan particuliere begraafplaatsen</li>
                <li>✓ Goed onderhouden</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">2. Kerkelijke begraafplaatsen</h3>
              <p class="text-gray-700 mb-2">Verbonden aan een kerkgenootschap, soms met restricties.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>✓ Vaak historische locaties</li>
                <li>✓ Mogelijk alleen voor leden</li>
                <li>✓ Specifieke tradities en gebruiken</li>
                <li>✓ Kleinschaliger en intiemer</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">3. <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a></h3>
              <p class="text-gray-700 mb-2">Voor wie kiest voor een natuurlijke omgeving.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>✓ Geen traditionele grafmonumenten</li>
                <li>✓ Biologisch afbreekbare materialen</li>
                <li>✓ Eeuwigdurende grafrust</li>
                <li>✓ Natuurbeheer gecombineerd met begraven</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">4. Particuliere begraafplaatsen</h3>
              <p class="text-gray-700 mb-2">Commercieel beheerde begraafplaatsen.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>✓ Vaak uitgebreide dienstverlening</li>
                <li>✓ Luxere faciliteiten</li>
                <li>✓ Flexibele mogelijkheden</li>
                <li>✓ Meestal duurder</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Begraafplaats met verschillende grafsoorten" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🪦 Soorten graven</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De keuze voor het type graf heeft grote invloed op de kosten en mogelijkheden:
            </p>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type graf</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kenmerken</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kosten indicatie</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-4 py-2 text-sm font-medium text-gray-900">Algemeen graf</td>
                    <td class="px-4 py-2 text-sm text-gray-700">Geen exclusieve rechten, beperkte keuze monument</td>
                    <td class="px-4 py-2 text-sm text-gray-700">€500 - €1.500</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 text-sm font-medium text-gray-900">Particulier graf</td>
                    <td class="px-4 py-2 text-sm text-gray-700">Exclusieve rechten, vrije monumentkeuze</td>
                    <td class="px-4 py-2 text-sm text-gray-700">€1.500 - €5.000</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 text-sm font-medium text-gray-900">Familiegraf</td>
                    <td class="px-4 py-2 text-sm text-gray-700">Meerdere personen, vaak dubbel diep</td>
                    <td class="px-4 py-2 text-sm text-gray-700">€3.000 - €10.000</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 text-sm font-medium text-gray-900">Urnengraf</td>
                    <td class="px-4 py-2 text-sm text-gray-700">Voor urnen, kleiner formaat</td>
                    <td class="px-4 py-2 text-sm text-gray-700">€750 - €2.500</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 text-sm font-medium text-gray-900">Kindergraf</td>
                    <td class="px-4 py-2 text-sm text-gray-700">Speciaal kindergedeelte, vaak gratis onderhoud</td>
                    <td class="px-4 py-2 text-sm text-gray-700">€250 - €1.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💰 Financiële overwegingen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            De kosten van een graf gaan verder dan alleen de aanschaf. Houd rekening met:
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-yellow-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Eenmalige kosten:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Grafrechten (10-30 jaar)</li>
                <li>• Begraafkosten</li>
                <li>• Grafmonument</li>
                <li>• Eerste aanleg beplanting</li>
              </ul>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Terugkerende kosten:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Verlenging grafrechten</li>
                <li>• Jaarlijks onderhoud</li>
                <li>• Herstel monument</li>
                <li>• Vervanging beplanting</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <p class="text-gray-700">
              💡 Voor een gedetailleerd kostenoverzicht, lees ons artikel over <a href="/blog/kosten-begraven-nederland-overzicht" class="text-blue-600 hover:text-blue-800 underline">de kosten van begraven in Nederland</a>.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipPiQ2UQzFQq6W_k5V3Z4YmcNqKbqW7xK9tOXfU=s1360-w1360-h1020" 
            alt="Religieuze symbolen op begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🙏 Religieuze en culturele aspecten</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Verschillende geloofsovertuigingen hebben specifieke wensen en eisen voor de laatste rustplaats:
            </p>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">☪️ <a href="${getTypeLink('islamitische-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Islamitisch</a></h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Richting Mekka</li>
                  <li>• Eeuwigdurende grafrust</li>
                  <li>• Geen crematie</li>
                  <li>• Binnen 24 uur begraven</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">✡️ <a href="${getTypeLink('joodse-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Joods</a></h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Eeuwigdurende grafrust</li>
                  <li>• Geen crematie (orthodox)</li>
                  <li>• Aparte begraafplaatsen</li>
                  <li>• Specifieke rituelen</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">✝️ Christelijk</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Kerkelijke begraafplaatsen</li>
                  <li>• Rooms-katholiek/Protestant</li>
                  <li>• Crematie toegestaan</li>
                  <li>• Kruissymbolen gebruikelijk</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🕉️ Hindoeïstisch</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Voorkeur crematie</li>
                  <li>• Asverstrooiing in water</li>
                  <li>• Rituele voorzieningen</li>
                  <li>• Open vuur ceremonie</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">☸️ Boeddhistisch</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Crematie of begraven</li>
                  <li>• Meditatie ruimtes</li>
                  <li>• Natuurlijke omgeving</li>
                  <li>• Eenvoudige monumenten</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌿 Humanistisch</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Geen religieuze symbolen</li>
                  <li>• Natuurbegraafplaatsen populair</li>
                  <li>• Persoonlijke invulling</li>
                  <li>• Milieubewust</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌳 Praktische kenmerken om te overwegen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Bij het bezoeken van begraafplaatsen zijn er praktische aspecten die het verschil kunnen maken:
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Faciliteiten:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>✓ Aula voor diensten</li>
                <li>✓ Condoleanceruimte</li>
                <li>✓ Toiletten</li>
                <li>✓ Parkeerplaatsen</li>
                <li>✓ Toegankelijkheid rolstoelen</li>
                <li>✓ Watervoorziening voor bloemen</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Omgeving en sfeer:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>✓ Rust en privacy</li>
                <li>✓ Natuurlijke omgeving</li>
                <li>✓ Onderhoudsstaat</li>
                <li>✓ Historische waarde</li>
                <li>✓ Beschutting tegen weer</li>
                <li>✓ Zitgelegenheden</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 Stappenplan voor het kiezen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Volg deze stappen voor een weloverwogen keuze:
          </p>
          
          <ol class="space-y-4">
            <li class="flex items-start">
              <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">1</span>
              <div>
                <h3 class="font-semibold text-gray-900">Bepaal uw wensen en budget</h3>
                <p class="text-gray-700 text-sm mt-1">Maak een lijst van must-haves en nice-to-haves. Stel een realistisch budget vast.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">2</span>
              <div>
                <h3 class="font-semibold text-gray-900">Onderzoek online</h3>
                <p class="text-gray-700 text-sm mt-1">Gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> om begraafplaatsen in uw regio te vinden.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">3</span>
              <div>
                <h3 class="font-semibold text-gray-900">Bezoek meerdere locaties</h3>
                <p class="text-gray-700 text-sm mt-1">Plan bezoeken aan 3-5 begraafplaatsen. Neem tijd voor de sfeer en omgeving.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">4</span>
              <div>
                <h3 class="font-semibold text-gray-900">Vraag informatie op</h3>
                <p class="text-gray-700 text-sm mt-1">Vraag naar tarieven, beschikbaarheid, reglementen en toekomstige plannen.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">5</span>
              <div>
                <h3 class="font-semibold text-gray-900">Betrek familie</h3>
                <p class="text-gray-700 text-sm mt-1">Bespreek uw voorkeuren met naasten. Hun mening is waardevol.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">6</span>
              <div>
                <h3 class="font-semibold text-gray-900">Neem een beslissing</h3>
                <p class="text-gray-700 text-sm mt-1">Laat uw gevoel spreken. De juiste plek voelt goed voor u en uw naasten.</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">❓ Veelgestelde vragen</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900">Kan ik van gedachten veranderen?</h3>
              <p class="text-gray-700 text-sm mt-1">
                Ja, tot het moment van overlijden kunt u uw keuze wijzigen. Grafrechten kunnen vaak worden overgedragen of (deels) terugbetaald.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900">Moet ik in mijn woonplaats begraven worden?</h3>
              <p class="text-gray-700 text-sm mt-1">
                Nee, u kunt kiezen voor elke begraafplaats in Nederland. Sommige gemeenten hanteren wel hogere tarieven voor niet-inwoners.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900">Kan ik nu al een graf reserveren?</h3>
              <p class="text-gray-700 text-sm mt-1">
                Veel begraafplaatsen bieden deze mogelijkheid. U betaalt dan de grafrechten vooruit en kunt vaak zelf de locatie kiezen.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900">Wat gebeurt er na afloop van de grafrechten?</h3>
              <p class="text-gray-700 text-sm mt-1">
                U krijgt de optie om te verlengen. Bij niet-verlenging wordt het graf geruimd en kunnen stoffelijke resten worden herbegraven.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Een persoonlijke keuze</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Het kiezen van een laatste rustplaats is een zeer persoonlijke beslissing. Neem de tijd om verschillende opties te verkennen en laat u niet haasten. Of u nu kiest voor een historische begraafplaats zoals <a href="${getCemeteryLink('Zorgvlied')}" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied</a>, een <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">natuurbegraafplaats</a>, of een moderne begraafplaats in uw <a href="${getMunicipalityLink('amsterdam')}" class="text-blue-600 hover:text-blue-800 underline">gemeente</a> - het belangrijkste is dat de plek goed voelt voor u en uw naasten.
          </p>
          <p class="text-gray-700">
            Begin uw zoektocht vandaag nog met onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">handige zoekfunctie</a> en vind begraafplaatsen die aan uw wensen voldoen.
          </p>
        </div>
      </section>
    </div>
  `,

  'natuurbegraafplaatsen-nederland': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Natuurbegraafplaatsen winnen snel aan populariteit in Nederland. Deze groene, duurzame vorm van begraven biedt een alternatief voor traditionele begraafplaatsen. Ontdek wat natuurbegraven inhoudt, waar het mogelijk is, en of deze keuze bij u past.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npMBDZiQZevgX03tI3LFee8qeIUDLulbpFKdH17kwn-dGtO9XNMmjY3XbGLdNuSpSCYQ4HTVQTyV1RRfixqOjbelfcyH-NdDyLEthatDFH3ehu9THrQe3mpZ7BPtVo3ZeUjYB8N0A=w800-h500-k-no" 
            alt="Natuurbegraafplaats Slangenburg in bosrijke omgeving Doetinchem" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌿 Wat is een natuurbegraafplaats?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Een natuurbegraafplaats is een begraafplaats waar de natuur centraal staat. In plaats van traditionele grafmonumenten worden graven gemarkeerd met natuurlijke elementen zoals bomen, struiken of natuurstenen. Het doel is om de begraafplaats onderdeel te laten zijn van het natuurlijke landschap.
            </p>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Kernprincipes van natuurbegraven:</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">🌱</span>
                  <span>Natuurlijke materialen: alleen biologisch afbreekbare kisten en kleding</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">🌳</span>
                  <span>Geen traditionele grafmonumenten: natuurlijke markering met GPS-coördinaten</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">♻️</span>
                  <span>Duurzaamheid: bijdrage aan natuurbehoud en CO2-compensatie</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">∞</span>
                  <span>Eeuwigdurende grafrust: graven worden niet geruimd</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📍 Natuurbegraafplaatsen in Nederland</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Nederland telt momenteel ruim 20 natuurbegraafplaatsen, verspreid over het hele land. De eerste Nederlandse natuurbegraafplaats werd in 1993 geopend in Bergerbos bij Alkmaar.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Noord Nederland:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Natuurbegraafplaats Hillig Meer (<a href="${getProvinceLink('groningen')}" class="text-blue-600 hover:text-blue-800 underline">Groningen</a>)</li>
                <li>• Natuurbegraafplaats De Hoevens (<a href="${getProvinceLink('drenthe')}" class="text-blue-600 hover:text-blue-800 underline">Drenthe</a>)</li>
                <li>• Natuurbegraafplaats Schoorsveld (<a href="${getProvinceLink('friesland')}" class="text-blue-600 hover:text-blue-800 underline">Friesland</a>)</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Midden Nederland:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Natuurbegraafplaats Bergerbos (<a href="${getProvinceLink('noord-holland')}" class="text-blue-600 hover:text-blue-800 underline">Noord-Holland</a>)</li>
                <li>• Natuurbegraafplaats Den en Rust (<a href="${getProvinceLink('utrecht')}" class="text-blue-600 hover:text-blue-800 underline">Utrecht</a>)</li>
                <li>• Natuurbegraafplaats Maashorst (<a href="${getProvinceLink('noord-brabant')}" class="text-blue-600 hover:text-blue-800 underline">Noord-Brabant</a>)</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Oost Nederland:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Natuurbegraafplaats De Utrecht (<a href="${getProvinceLink('gelderland')}" class="text-blue-600 hover:text-blue-800 underline">Gelderland</a>)</li>
                <li>• Natuurbegraafplaats Winterswijk (<a href="${getProvinceLink('gelderland')}" class="text-blue-600 hover:text-blue-800 underline">Gelderland</a>)</li>
                <li>• Natuurbegraafplaats Weverslo (<a href="${getProvinceLink('overijssel')}" class="text-blue-600 hover:text-blue-800 underline">Overijssel</a>)</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Zuid Nederland:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Natuurbegraafplaats Weversbergen (<a href="${getProvinceLink('limburg')}" class="text-blue-600 hover:text-blue-800 underline">Limburg</a>)</li>
                <li>• Natuurbegraafplaats Heidepol (<a href="${getProvinceLink('noord-brabant')}" class="text-blue-600 hover:text-blue-800 underline">Noord-Brabant</a>)</li>
                <li>• Natuurbegraafplaats Slangenburg (<a href="${getProvinceLink('zeeland')}" class="text-blue-600 hover:text-blue-800 underline">Zeeland</a>)</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              🔍 Zoek alle <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">natuurbegraafplaatsen</a> in onze database voor actuele informatie en contactgegevens.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npMBDZiQZevgX03tI3LFee8qeIUDLulbpFKdH17kwn-dGtO9XNMmjY3XbGLdNuSpSCYQ4HTVQTyV1RRfixqOjbelfcyH-NdDyLEthatDFH3ehu9THrQe3mpZ7BPtVo3ZeUjYB8N0A=w800-h500-k-no" 
            alt="Natuurbegraafplaats Slangenburg Doetinchem - natuurlijk graf in bosomgeving" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">⚰️ Het natuurbegrafenisproces</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Een natuurbegrafenis verloopt anders dan een traditionele begrafenis. Hier zijn de belangrijkste verschillen:
            </p>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">1. De kist</h3>
                <p class="text-gray-700 mb-2">Alleen biologisch afbreekbare materialen zijn toegestaan:</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Onbehandeld hout (geen lak, verf of metalen onderdelen)</li>
                  <li>• Karton of papier-maché</li>
                  <li>• Rieten of wilgentenen manden</li>
                  <li>• Wollen of katoenen wade</li>
                </ul>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">2. Kleding en sieraden</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Alleen natuurlijke stoffen (katoen, wol, linnen, zijde)</li>
                  <li>• Geen synthetische materialen</li>
                  <li>• Geen metalen of plastic voorwerpen</li>
                  <li>• Houten of natuurstenen sieraden zijn wel toegestaan</li>
                </ul>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">3. Het graf</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Handmatig gegraven (vaak geen machines)</li>
                  <li>• Ondieper dan traditionele graven (120-150 cm)</li>
                  <li>• Geen grafkelder of betonnen elementen</li>
                  <li>• Natuurlijke ligging in het landschap</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🗺️ Grafmarkering en terugvinden</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Op natuurbegraafplaatsen zijn geen traditionele grafstenen toegestaan. Toch zijn er mogelijkheden om het graf terug te vinden:
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Natuurlijke markering:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Inheemse boom of struik planten</li>
                <li>• Natuursteen zonder bewerking</li>
                <li>• Houten paaltje (tijdelijk)</li>
                <li>• Natuurlijke verhoging (grafheuvel)</li>
              </ul>
            </div>
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Moderne hulpmiddelen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• GPS-coördinaten registratie</li>
                <li>• Digitale plattegrond</li>
                <li>• QR-code op centrale plek</li>
                <li>• Smartphone apps</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p class="text-gray-700">
              <strong>Let op:</strong> Sommige natuurbegraafplaatsen bieden helemaal geen individuele markering. Het idee is dat de overledene volledig opgaat in de natuur. Bespreek dit vooraf met uw naasten.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Familie bij natuurgraf" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">💰 Kosten van natuurbegraven</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De kosten van een natuurbegrafenis zijn vaak vergelijkbaar met of iets lager dan een traditionele begrafenis:
            </p>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Kostenoverzicht natuurbegrafenis:</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-700">Grafrecht (eeuwigdurend)</span>
                  <span class="font-medium">€2.500 - €5.000</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-700">Begraafkosten</span>
                  <span class="font-medium">€600 - €1.200</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-700">Natuurlijke kist</span>
                  <span class="font-medium">€300 - €1.500</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-700">Natuurlijke markering</span>
                  <span class="font-medium">€0 - €500</span>
                </div>
                <div class="border-t pt-2 flex justify-between font-semibold">
                  <span>Totaal indicatie</span>
                  <span>€3.400 - €8.200</span>
                </div>
              </div>
            </div>
            
            <div class="mt-4 grid md:grid-cols-2 gap-4">
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">✅ Voordelen:</h4>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Geen kosten grafonderhoud</li>
                  <li>• Geen grafmonument nodig</li>
                  <li>• Eeuwigdurende grafrust inbegrepen</li>
                  <li>• Geen verlengingskosten</li>
                </ul>
              </div>
              <div class="bg-yellow-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">⚠️ Aandachtspunten:</h4>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Speciale kist vaak duurder</li>
                  <li>• Mogelijk langere reisafstand</li>
                  <li>• Beperkte keuze uitvaartondernemers</li>
                  <li>• Geen latere bijzetting mogelijk</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌍 Milieu-impact</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Natuurbegraven wordt vaak gekozen vanwege de lagere milieu-impact:
          </p>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">🌳</div>
              <h3 class="font-semibold text-gray-900 mb-1">CO2-compensatie</h3>
              <p class="text-sm text-gray-700">Bomen en planten nemen CO2 op</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">🦋</div>
              <h3 class="font-semibold text-gray-900 mb-1">Biodiversiteit</h3>
              <p class="text-sm text-gray-700">Behoud en ontwikkeling natuur</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">♻️</div>
              <h3 class="font-semibold text-gray-900 mb-1">Geen vervuiling</h3>
              <p class="text-sm text-gray-700">Alleen natuurlijke materialen</p>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <p class="text-gray-700">
              <strong>Vergelijking:</strong> Een natuurbegrafenis heeft ongeveer 10x minder milieu-impact dan een traditionele begrafenis en 3x minder dan crematie.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">👥 Voor wie is natuurbegraven geschikt?</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Natuurbegraven past niet bij iedereen. Overweeg deze vorm van begraven als u:
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2 text-green-600">✓ Wel geschikt als u:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Verbonden bent met de natuur</li>
                <li>• Duurzaamheid belangrijk vindt</li>
                <li>• Geen behoefte heeft aan monument</li>
                <li>• Rust zoekt in natuurlijke omgeving</li>
                <li>• Open staat voor nieuwe tradities</li>
                <li>• Minimalistische uitvaart wenst</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2 text-red-600">✗ Minder geschikt als u:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• Specifieke religieuze eisen heeft</li>
                <li>• Een herkenbaar graf belangrijk vindt</li>
                <li>• Bloemen wilt plaatsen</li>
                <li>• Familiegraf wenst</li>
                <li>• Slecht ter been bent (terrein)</li>
                <li>• Traditionele rituelen wilt</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">🤔 Veelgestelde vragen</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900">Mag ik bloemen plaatsen op een natuurgraf?</h3>
              <p class="text-gray-700 text-sm mt-1">
                Meestal niet. Losse bloemen zonder plastic zijn soms kort toegestaan, maar worden na enkele dagen verwijderd. Het idee is dat de natuur zelf voor 'versiering' zorgt.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900">Kan ik later alsnog een steen plaatsen?</h3>
              <p class="text-gray-700 text-sm mt-1">
                Nee, dit gaat tegen het principe van natuurbegraven in. De keuze voor natuurbegraven is definitief.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900">Wat gebeurt er met de natuurbegraafplaats in de toekomst?</h3>
              <p class="text-gray-700 text-sm mt-1">
                Natuurbegraafplaatsen hebben meestal een natuurbestemming voor eeuwig. Ze worden beheerd door stichtingen die het natuurlijke karakter waarborgen.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900">Kunnen kinderen ook natuurbegraven worden?</h3>
              <p class="text-gray-700 text-sm mt-1">
                Ja, de meeste natuurbegraafplaatsen hebben speciale kindergedeelten met aangepaste tarieven en mogelijkheden.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 Tips voor het bezoeken</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Wilt u een natuurbegraafplaats bezoeken? Houd rekening met het volgende:
          </p>
          
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <span class="text-green-600 mr-2">🥾</span>
              <span><strong>Kleding:</strong> Draag stevige schoenen en weerbestendige kleding. Paden kunnen onverhard zijn.</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">🗺️</span>
              <span><strong>Oriëntatie:</strong> Vraag een plattegrond of download de app van de begraafplaats.</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">🦌</span>
              <span><strong>Natuur:</strong> Respecteer flora en fauna. Blijf op de paden.</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">🚶</span>
              <span><strong>Rust:</strong> Natuurbegraafplaatsen zijn extra stil. Praat zacht.</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-600 mr-2">📵</span>
              <span><strong>Regels:</strong> Vaak geen honden, fietsen of auto's toegestaan.</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Een natuurlijke keuze?</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Natuurbegraven is een mooie optie voor wie één wil worden met de natuur en een minimale ecologische voetafdruk wil achterlaten. Het biedt rust, natuurschoon en de zekerheid dat uw laatste rustplaats bijdraagt aan het behoud van de Nederlandse natuur.
          </p>
          <p class="text-gray-700">
            Bent u geïnteresseerd? Bezoek een <a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">natuurbegraafplaats</a> in uw regio om de sfeer te proeven. Veel natuurbegraafplaatsen organiseren ook informatiedagen en rondleidingen.
          </p>
        </div>
      </section>
    </div>
  `,

  'funeraire-symbolen-betekenis': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Grafstenen en monumenten vertellen vaak meer dan alleen namen en data. De symbolen die erop staan hebben diepe betekenissen en vertellen verhalen over het leven, geloof en de persoonlijkheid van de overledene. Ontdek wat de meest voorkomende funeraire symbolen betekenen.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipMx3t6H0QNj0ufKPhk7gUhAJ2kZ1yxz37gJV9M=s1360-w1360-h1020" 
            alt="Joodse Begraafplaats Aalten - distinctieve Joodse symbolen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">📜 Een taal in steen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Funeraire symboliek is een eeuwenoude traditie die teruggaat tot de oudheid. Deze symbolen dienden niet alleen als decoratie, maar communiceerden belangrijke boodschappen over de overledene aan toekomstige generaties. In een tijd waarin veel mensen niet konden lezen, waren deze symbolen een universele taal.
            </p>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Waarom symbolen op grafstenen?</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>Identificatie:</strong> Beroep, status of karakter van de overledene</li>
                <li>• <strong>Troost:</strong> Boodschap van hoop voor nabestaanden</li>
                <li>• <strong>Geloof:</strong> Religieuze overtuiging en het hiernamaals</li>
                <li>• <strong>Herinnering:</strong> Belangrijke aspecten uit het leven</li>
                <li>• <strong>Waarschuwing:</strong> Memento mori - herinnering aan sterfelijkheid</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">👼 Religieuze symbolen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Religieuze symbolen zijn de meest voorkomende op begraafplaatsen. Ze drukken het geloof uit en bieden troost aan nabestaanden.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">✝️ Christelijke symbolen</h3>
              
              <div class="space-y-3">
                <div>
                  <h4 class="font-medium text-gray-900">Kruis</h4>
                  <p class="text-sm text-gray-700">Het ultieme christelijke symbool. Staat voor verlossing en wederopstanding.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">Engel</h4>
                  <p class="text-sm text-gray-700">Goddelijke boodschapper, begeleider naar het hiernamaals. Wijzende engel betekent hemelvaart.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">Duif</h4>
                  <p class="text-sm text-gray-700">De Heilige Geest, vrede, of de ziel die naar de hemel vliegt.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">Anker</h4>
                  <p class="text-sm text-gray-700">Hoop en standvastigheid in het geloof. Populair bij zeelieden.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">IHS / INRI</h4>
                  <p class="text-sm text-gray-700">IHS: Jezus (Iesus Hominum Salvator). INRI: Jezus van Nazareth, Koning der Joden.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">🕎 Andere religies</h3>
              
              <div class="space-y-3">
                <div>
                  <h4 class="font-medium text-gray-900">Davidster</h4>
                  <p class="text-sm text-gray-700">Joods symbool, ook wel Zegel van Salomo. Verbinding hemel en aarde.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">Halve maan en ster</h4>
                  <p class="text-sm text-gray-700">Islamitisch symbool. Groei en vooruitgang van het geloof.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">Dharmawiel</h4>
                  <p class="text-sm text-gray-700">Boeddhistisch symbool. De achtdelige weg naar verlichting.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">Om-teken</h4>
                  <p class="text-sm text-gray-700">Hindoeïstisch symbool. Het heilige geluid van het universum.</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900">Vlammend hart</h4>
                  <p class="text-sm text-gray-700">Katholiek symbool. Heilig Hart van Jezus, goddelijke liefde.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Grafsteen met bloemsymbolen" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌺 Bloemen en planten</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Bloemen zijn tijdloze symbolen op grafmonumenten. Elke bloem heeft zijn eigen betekenis en boodschap.
            </p>
            
            <div class="grid md:grid-cols-3 gap-4">
              <div class="bg-rose-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">🌹 Roos</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Rode roos:</strong> Liefde, passie</li>
                  <li>• <strong>Witte roos:</strong> Zuiverheid</li>
                  <li>• <strong>Gebroken roos:</strong> Te vroeg gestorven</li>
                  <li>• <strong>Rozenkrans:</strong> Katholiek gebed</li>
                </ul>
              </div>
              
              <div class="bg-purple-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">🌷 Lelie</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Zuiverheid van de ziel</li>
                  <li>• Wedergeboorte</li>
                  <li>• Vooral bij vrouwen/kinderen</li>
                  <li>• Maagd Maria symbool</li>
                </ul>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">🌻 Overige bloemen</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Papaver:</strong> Eeuwige slaap</li>
                  <li>• <strong>Vergeet-mij-niet:</strong> Herinnering</li>
                  <li>• <strong>Klimop:</strong> Eeuwig leven</li>
                  <li>• <strong>Viooltje:</strong> Bescheidenheid</li>
                </ul>
              </div>
            </div>
            
            <div class="mt-4 bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌳 Bomen en takken</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Eik:</strong> Kracht, uithoudingsvermogen</li>
                  <li>• <strong>Wilg:</strong> Rouw, verdriet</li>
                  <li>• <strong>Palmboom:</strong> Overwinning over de dood</li>
                  <li>• <strong>Olijftak:</strong> Vrede</li>
                </ul>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Lauwerkrans:</strong> Eer, overwinning</li>
                  <li>• <strong>Afgebroken tak:</strong> Leven te vroeg beëindigd</li>
                  <li>• <strong>Boomstronk:</strong> Afgesneden leven</li>
                  <li>• <strong>Acanthus:</strong> Eeuwig leven</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">✋ Handen en lichaamsdelen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Afbeeldingen van handen en andere lichaamsdelen hebben vaak een diepere symbolische betekenis.
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Handposities en hun betekenis:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Gevouwen handen</h4>
                  <p class="text-sm text-gray-700">Gebed, devotie, laatste groet</p>
                  
                  <h4 class="font-medium text-gray-900 mb-2 mt-3">Wijzende vinger omhoog</h4>
                  <p class="text-sm text-gray-700">De weg naar de hemel, "zie daarboven"</p>
                  
                  <h4 class="font-medium text-gray-900 mb-2 mt-3">Handdruk</h4>
                  <p class="text-sm text-gray-700">Afscheid, hereniging in hiernamaals</p>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Hand met gebroken ketting</h4>
                  <p class="text-sm text-gray-700">Verbroken aardse banden</p>
                  
                  <h4 class="font-medium text-gray-900 mb-2 mt-3">Hand uit wolk</h4>
                  <p class="text-sm text-gray-700">God die de ziel ontvangt</p>
                  
                  <h4 class="font-medium text-gray-900 mb-2 mt-3">Open hand</h4>
                  <p class="text-sm text-gray-700">Vrijgevigheid, goedheid</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Andere lichaamsdelen:</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>Oog:</strong> Alziend oog van God, waakzaamheid</li>
                <li>• <strong>Hart:</strong> Liefde, moed, devotie</li>
                <li>• <strong>Vleugels:</strong> Spirituele reis, engelachtige natuur</li>
                <li>• <strong>Voeten:</strong> De levensreis, pelgrimage</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrmW9M_Iu2P2xd753E-pQ9pG3XI67ys3ieO9sC3Q7kSFNsKSjVmXHMMEPvbG81o27eXlpjW58AJDLuxXz9zklNIMeDwH2SIny5WsN87SChRnfwrjKaOeoDpm_RocSjGOguNCRfNDg=w800-h500-k-no" 
            alt="Protestant cemetery Oosterhout - kindergraf met engelenbeeldje" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">👶 Symbolen voor kinderen</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Kindergraven hebben vaak specifieke symbolen die de onschuld en het te vroeg beëindigde leven symboliseren.
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-pink-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Veelvoorkomende kindersymbolen:</h3>
                <ul class="space-y-2 text-gray-700">
                  <li>• <strong>Lam:</strong> Onschuld, Jezus als Lam Gods</li>
                  <li>• <strong>Cherubijn:</strong> Engelenkopje met vleugels</li>
                  <li>• <strong>Gebroken bloem:</strong> Te vroeg geplukt</li>
                  <li>• <strong>Vlinder:</strong> Korte levensduur, transformatie</li>
                  <li>• <strong>Ster:</strong> Hemels kind</li>
                  <li>• <strong>Vogel:</strong> Vrije ziel</li>
                  <li>• <strong>Slapend kind:</strong> Eeuwige rust</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Speelgoed en voorwerpen:</h3>
                <ul class="space-y-2 text-gray-700">
                  <li>• <strong>Teddybeer:</strong> Troost, jeugd</li>
                  <li>• <strong>Blokken:</strong> Onderbroken spel</li>
                  <li>• <strong>Rammelaar:</strong> Baby of peuter</li>
                  <li>• <strong>Boek:</strong> Onvoltooide levensverhaal</li>
                  <li>• <strong>Schoentjes:</strong> Kleine voetafdrukken</li>
                  <li>• <strong>Wieg:</strong> Eeuwige slaap</li>
                </ul>
              </div>
            </div>
            
            <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p class="text-sm text-gray-700">
                <strong>💡 Wist u dat:</strong> Op <a href="${getCemeteryLink('begraafplaats-zorgvlied')}" class="text-blue-600 hover:text-blue-800 underline">historische begraafplaatsen</a> vindt u vaak prachtige voorbeelden van kindersymboliek uit de 19e eeuw.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">⚱️ Dood en vergankelijkheid</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Symbolen die de vergankelijkheid van het leven en de onvermijdelijkheid van de dood benadrukken.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-gray-100 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">💀 Memento Mori</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• <strong>Schedel:</strong> Sterfelijkheid</li>
                <li>• <strong>Gekruiste botten:</strong> Dood</li>
                <li>• <strong>Zandloper:</strong> Tijd die verstrijkt</li>
                <li>• <strong>Zeis:</strong> Dood als maaier</li>
              </ul>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🕐 Tijd symbolen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• <strong>Klok:</strong> Levenstijd</li>
                <li>• <strong>Gebroken klok:</strong> Tijd gestopt</li>
                <li>• <strong>Zonsondergang:</strong> Levenseinde</li>
                <li>• <strong>Gevleugelde zandloper:</strong> Vluchtige tijd</li>
              </ul>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🔗 Overgang symbolen</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• <strong>Poort:</strong> Doorgang hiernamaals</li>
                <li>• <strong>Brug:</strong> Overgang naar andere wereld</li>
                <li>• <strong>Deur:</strong> Mysterie van de dood</li>
                <li>• <strong>Sluier:</strong> Scheiding leven/dood</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">💼 Beroepen en verenigingen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Veel grafstenen tonen symbolen die verwijzen naar het beroep of de vereniging van de overledene.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Beroepssymbolen:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• <strong>Hamer en aambeeld:</strong> Smid</li>
                <li>• <strong>Schaar en kam:</strong> Kapper</li>
                <li>• <strong>Passer en winkelhaak:</strong> Architect/metselaar</li>
                <li>• <strong>Boek en pen:</strong> Schrijver/leraar</li>
                <li>• <strong>Stethoscoop:</strong> Arts</li>
                <li>• <strong>Weegschaal:</strong> Jurist/rechter</li>
                <li>• <strong>Anker:</strong> Zeeman</li>
                <li>• <strong>Korenaar:</strong> Boer/bakker</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Verenigingssymbolen:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• <strong>Vrijmetselaars:</strong> Passer en winkelhaak</li>
                <li>• <strong>Odd Fellows:</strong> Drie schakels ketting</li>
                <li>• <strong>Militair:</strong> Zwaard, helm, medailles</li>
                <li>• <strong>Brandweer:</strong> Helm en bijl</li>
                <li>• <strong>Muziek:</strong> Lier, noten</li>
                <li>• <strong>Sport:</strong> Bal, trofee</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Modern grafmonument met abstract symbool" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🎨 Moderne symboliek</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              In de 20e en 21e eeuw zien we nieuwe symbolen verschijnen op grafmonumenten, vaak persoonlijker en minder traditioneel.
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-purple-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Persoonlijke symbolen:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• <strong>Hobby's:</strong> Muziekinstrument, penseel, camera</li>
                  <li>• <strong>Sport:</strong> Voetbal, fiets, golfclub</li>
                  <li>• <strong>Natuur:</strong> Favoriete dier of plant</li>
                  <li>• <strong>Reizen:</strong> Wereldbol, vliegtuig</li>
                  <li>• <strong>Technologie:</strong> Computer, telefoon</li>
                </ul>
              </div>
              
              <div class="bg-indigo-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Abstracte symbolen:</h3>
                <ul class="space-y-1 text-gray-700 text-sm">
                  <li>• <strong>Oneindigheid:</strong> Eeuwige liefde</li>
                  <li>• <strong>Spiraal:</strong> Levenscyclus</li>
                  <li>• <strong>Yin-yang:</strong> Balans, harmonie</li>
                  <li>• <strong>Hartslag:</strong> Leven dat doorleeft</li>
                  <li>• <strong>QR-code:</strong> Link naar online herdenking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">🔍 Symbolen herkennen: tips</h2>
          
          <ol class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">1</span>
              <div>
                <strong>Kijk naar de context:</strong> Combinaties van symbolen vertellen vaak een completer verhaal.
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">2</span>
              <div>
                <strong>Let op details:</strong> De positie en richting van symbolen kan de betekenis veranderen.
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">3</span>
              <div>
                <strong>Periode is belangrijk:</strong> Symboliek verandert door de tijd. Check de datum op de steen.
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">4</span>
              <div>
                <strong>Culturele achtergrond:</strong> Symbolen kunnen per cultuur andere betekenissen hebben.
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">5</span>
              <div>
                <strong>Vraag de beheerder:</strong> Begraafplaatsbeheerders weten vaak veel over lokale symboliek.
              </div>
            </li>
          </ol>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📸 Symboliek fotograferen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Voor wie geïnteresseerd is in funeraire symboliek, enkele tips voor het fotograferen:
          </p>
          
          <ul class="space-y-2 text-gray-700">
            <li>• Fotografeer op bewolkte dagen voor gelijkmatig licht</li>
            <li>• Maak detailfoto's van interessante symbolen</li>
            <li>• Noteer de locatie en periode van het monument</li>
            <li>• Respecteer privacy en lopende ceremonies</li>
            <li>• Vraag toestemming aan de beheerder voor uitgebreid fotograferen</li>
          </ul>
          
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-700">
              Voor meer over fotograferen op begraafplaatsen, lees ons artikel over <a href="/blog/begraafplaats-fotografie-tips-etiquette" class="text-blue-600 hover:text-blue-800 underline">begraafplaats fotografie</a>.
            </p>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Een rijke beeldtaal</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Funeraire symboliek is een fascinerende beeldtaal die verhalen vertelt over leven, dood, hoop en herinnering. Of u nu een <a href="${getCemeteryLink('oude-algemene-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">historische begraafplaats</a> bezoekt of een modern kerkhof, de symbolen op grafstenen blijven communiceren over generaties heen.
          </p>
          <p class="text-gray-700">
            De volgende keer dat u over een begraafplaats wandelt, kijk dan eens met andere ogen naar de symbolen om u heen. Elk symbool vertelt een verhaal, biedt troost of deelt een boodschap die de tand des tijds doorstaat.
          </p>
        </div>
      </section>
    </div>
  `,

  'digitaal-herdenken': `
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
              <strong>Let op:</strong> Niet alle begraafplaatsen staan QR-codes toe. Informeer eerst bij de beheerder van uw <a href="${getMunicipalityLink('amsterdam')}" class="text-blue-600 hover:text-blue-800 underline">lokale begraafplaats</a>.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npojPJpR72f8rUVTvKb0IKcQ2yYMnJXhImWv4LMDNz_8nj25p3auDfGhUdQJ_o__7_BziDdulVoyXstH1pd9MX2m0qesvt2G_4UmrT0sPM_uFIkv1wkDRhs7vKTnsuX05LGUvCY=w800-h500-k-no" 
            alt="R.K begraafplaats Vorden - online herdenking" 
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
            Of u nu kiest voor een eenvoudige QR-code op een grafsteen bij een <a href="${getCemeteryLink('nieuwe-oosterbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">traditionele begraafplaats</a> of een uitgebreide online herdenkingspagina, digitaal herdenken helpt de herinnering aan dierbaren levend te houden voor toekomstige generaties.
          </p>
        </div>
      </section>
    </div>
  `,

  'grafmonumenten-onderhoud-complete-gids': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Een grafmonument is meer dan een markering - het is een blijvende herinnering aan een dierbare. Goed onderhoud zorgt ervoor dat deze herinnering waardig en mooi blijft. Deze complete gids helpt u bij het onderhouden van grafmonumenten, van eenvoudige reiniging tot professionele restauratie.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4no7EmK-ebftASWzgB0kisZIUN7jTuBzWqK6iPGCxroUQ5_ygxPOikQfOv7Z68WXS3R0DeU4XBvE9pf0ZVVaotND7kdrTCLkftpRH5Vgh8OSeBAzuNG5wvw-kws-CEPqVzclTKY=w800-h500-k-no" 
            alt="Begraafplaats van de tachtigjarige oorlog Breda - onderhoud historisch grafmonument" 
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
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqd9fOK5gmdzRIf4pP_dRBkK2ZxU1Oh4NwsiyiQ5DcC4TCgs9IN1o55AsbWHd9bRxdPUKe8MlpYxzzZkHC-8XoFkIXNC_f9oHX0hq59lNOJY7tKWdnD8safJgKZP9Kd6JD6VZW1=w800-h500-k-no" 
            alt="Nederlandse oorlogsgraven Heino - herstellen van letters op grafsteen" 
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
              💡 <strong>Tip:</strong> Veel <a href="${getMunicipalityLink('rotterdam')}" class="text-blue-600 hover:text-blue-800 underline">gemeentelijke begraafplaatsen</a> bieden onderhoudscontracten aan tegen gunstige tarieven.
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
            Voor specifieke onderhoudsvoorschriften kunt u terecht bij de beheerder van uw <a href="${getCemeteryLink('algemene-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">lokale begraafplaats</a>. Zij kennen de lokale omstandigheden en kunnen advies geven over de beste aanpak voor uw monument.
          </p>
        </div>
      </section>
    </div>
  `,

  'genealogie-onderzoek-begraafplaatsen': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Begraafplaatsen zijn goudmijnen voor genealogen en familieonderzoekers. Grafstenen en begraafregisters bevatten waardevolle informatie over voorouders die nergens anders te vinden is. Ontdek hoe u begraafplaatsen effectief kunt gebruiken voor uw stamboomonderzoek.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npX0Epm1V8CukrahZWNqmqrb1pceZgwZzBAv28bvUsLkz3-7uCMg0saOGxSgoXTKp8zm0_ED4vbefTjRn2BJugB25cZpSDgQGhD7HO727n37DiJ_RDy5cxtpsW4kpowD3ijWap04A=w800-h500-k-no" 
            alt="Joodse begraafplaats 's-Heerenberg - historische grafsteen voor genealogie onderzoek" 
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
                <li>• <a href="${getMunicipalityLink('den-haag')}" class="text-blue-600 hover:text-blue-800 underline">Gemeentelijke begraafplaatsen</a> in de woonplaats</li>
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
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npKn2j34rg-SsGXZHB8nBnB1XhCl6rA9WHlnkZZyFQiV5fy41P2WU1m8-5ie7-89DMgeLh0fxxJQsOsLynsV6By8F2RLbkG8Q-4uFxd59jOkK5LuIgElcRaM6K_0EXw0rjCJR-BVg=w800-h500-k-no" 
            alt="Natuurbegraafplaats Venlo - Maasbree - fotograferen voor documentatie" 
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
            Begin uw zoektocht vandaag op een <a href="${getCemeteryLink('oude-algemene-begraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">historische begraafplaats</a> in uw regio. Gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> om begraafplaatsen te vinden waar uw voorouders mogelijk begraven liggen.
          </p>
        </div>
      </section>
    </div>
  `,
  'begraafplaats-fotografie-tips-etiquette': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Begraafplaatsen bieden unieke fotografische mogelijkheden, van historische monumenten tot sfeervolle landschappen. Maar fotograferen op deze bijzondere plaatsen vraagt om respect en kennis van de juiste etiquette. Deze gids helpt u om respectvol en succesvol te fotograferen op begraafplaatsen.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrXHlRP98SfU-wpaqBbV6I8eXL6lXxhTBrSU20GegUUbp_bMulyl9n0bNpJWZgYZOQErdFtMpwefDPp_7EGyxF0MAIyVglDzfCBc-VfppxSxHgIyQBkucFTMTq3dwIO8VtUxO9q=w800-h500-k-no" 
            alt="Natuurbegraafplaats Hoeve Ruth Vlierden - fotograaf respectvol aan het werk" 
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
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npOmUScTyyCoKO6eW3IJvktSM3lFUuz2ss6Jx2UgULGY0H-JaXjWmMSR8Jb-0I2ldKROe77xAKiRUofd-IeXkq5tRZZDEl9IDkTHoNhglsm_ITDJ8vV7t9inO9t-HlBhfHCoRGI=w800-h500-k-no" 
            alt="Begraafplaats Sint Jozef Geldrop - verschillende religies symbolen" 
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
  `,
  'oorlogsgraven-nederland-geschiedenis': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Nederland telt duizenden oorlogsgraven die de stille getuigen zijn van de verschrikkingen van oorlog. Deze graven vertellen het verhaal van militairen en burgers die hun leven gaven voor onze vrijheid. Ontdek de geschiedenis, locaties en het belang van oorlogsgraven in Nederland.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrjYx-2qg3Gly-NU8zAtnYkmbJMJsrD4zAKyEDbW20pCtu6FN2gYGAQm-C2s1PzhFXgHR9W9AsZ-yOTk-uJb-mjOEkqJsjBepRjY99F7PdiTMBt0Lng4ct6VPRDvctGG2xRWhFt=w800-h500-k-no" 
            alt="Oorlogsgraven van het Gemenebest Arnhem Oosterbeek" 
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
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nplKDNdoP-9Z1AZSBjkS7wy5lrg084D3xbJe2tqWd5sIt7Z2diDte-NBeBdNYfCRjFiD4vmh7yLS6qQxTFK8Dtga_cafbg6MVAPJ_Dd2LY_o2_vy0CIYFw4Cd_Y99QmNeLIiV7oCA=w800-h500-k-no" 
            alt="War Cemetery Texel - Commonwealth oorlogsgraven" 
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
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npzrHgJSFAx5pENJJn6nspIAuxjaiVVGD_kcfbwBVfKKATZmckw23JBEIisMAbjePuzVp2BNpKKVwg9z45TZ-BnJSsdW-IdUhIkv3ifuZdP_5hWDFCkQ4MHTVP3ExAgtZfw1JoyFw=w800-h500-k-no" 
            alt="Militaire Begraafplaats van het Gemenebest Venray - herdenking oorlogsgraven" 
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
  `,
  'kinderbegraafplaatsen-gevoelig-onderwerp': `
    <div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Kinderbegraafplaatsen zijn bijzondere plekken van troost en herinnering. Deze liefdevolle rustplaatsen voor de allerkleinsten vragen om extra zorg en aandacht. Dit artikel behandelt respectvol de geschiedenis, inrichting en betekenis van kinderbegraafplaatsen in Nederland.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4novOyfkEOfDs9EL4cXINxbtUUSCJUcSyEzXSFLqNLZu014MVdIyez1iTL8H3-Cf1Tj8ob6YAuXlRcqthCkTnqmbMBKMA6Vlz19cMCWe27ru7CoVoe6k7CZ3GWC4zmnO8_ZxVhR5=w800-h500-k-no" 
            alt="Algemene Begraafplaats Sint Maartensbrug - kleurrijke kindergraven" 
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
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrp0_hpvN4MzQ4OUHV2nPORpcvXHFV0tW8019VsO4gvI_-LVdhk-kf1iLX-eBWxzHF_-X9EBzYCSZMOTAowdd3zDRJXz-8Ii4QgIlJk801JFFpPV94fDyK3eLLwXllSjYguL3w0gcFTpTyf=w800-h500-k-no" 
            alt="Stichting Roomsch-Katholieke Begraafplaats Sint Jozef Den Helder - wereldlichtjesdag" 
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
  `,
  'beroemde-personen-nederlandse-begraafplaatsen': `<div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Nederlandse begraafplaatsen herbergen de laatste rustplaatsen van vele beroemde personen die ons land hebben gevormd. Van schrijvers en kunstenaars tot politici en wetenschappers - hun graven vertellen fascinerende verhalen over Nederland's rijke geschiedenis en cultuur.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqEs3pDLH5wIRLJIbcdOQWVfqQ7wM9WcHqyrIZeaF9BtrX2-Edd0dsmAxTxLt7gIzegHF9RSB_IscmEqwNU5nDL43Om3iezqfjgfamljY_5RzxhDojscgn4y7L5PZ48qrn6oCkB=w800-h500-k-no" 
            alt="Begraafplaats Protestantse Gemeente Hummelo - monumentaal graf" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">⭐ Waarom beroemde graven bezoeken?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Het bezoeken van graven van beroemde personen biedt een unieke kijk op de Nederlandse geschiedenis. Deze plekken zijn niet alleen rustplaatsen, maar ook bedevaartsoorden voor bewonderaars en inspiratiebronnen voor nieuwe generaties.
            </p>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Wat maakt deze graven bijzonder?</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">📚</span>
                  <span><strong>Historische waarde:</strong> Directe verbinding met Nederlandse geschiedenis</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🎨</span>
                  <span><strong>Artistieke monumenten:</strong> Vaak prachtig vormgegeven grafmonumenten</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">💭</span>
                  <span><strong>Reflectie:</strong> Nadenken over leven, dood en nalatenschap</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🎓</span>
                  <span><strong>Educatief:</strong> Leren over personen en hun bijdragen</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-2">🌹</span>
                  <span><strong>Eerbetoon:</strong> Respect tonen voor hun nalatenschap</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📖 Schrijvers en dichters</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Nederlandse literatuur heeft veel wereldberoemde auteurs voortgebracht. Hun graven zijn vaak bedevaartsoorden voor literatuurliefhebbers.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-purple-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📝 Beroemde schrijvers:</h3>
              <ul class="space-y-2 text-gray-700">
                <li><strong>Multatuli (Eduard Douwes Dekker):</strong> Ingelheim, Duitsland</li>
                <li><strong>Louis Couperus:</strong> Begraafplaats Zorgvlied, Hilversum</li>
                <li><strong>Willem Frederik Hermans:</strong> Begraafplaats Zorgvlied, Hilversum</li>
                <li><strong>Gerard Reve:</strong> <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a></li>
                <li><strong>Jan Wolkers:</strong> Begraafplaats Oegstgeest</li>
              </ul>
            </div>
            
            <div class="bg-pink-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🎭 Dichters en toneelschrijvers:</h3>
              <ul class="space-y-2 text-gray-700">
                <li><strong>Joost van den Vondel:</strong> <a href="/begraafplaats/nieuwe-kerk-amsterdam" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Kerk Amsterdam</a></li>
                <li><strong>P.C. Hooft:</strong> Muiderslot (herbegraven)</li>
                <li><strong>Lucebert:</strong> <a href="/begraafplaats/nieuwe-oosterbegraafplaats" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a></li>
                <li><strong>Gerrit Achterberg:</strong> Begraafplaats Utrecht</li>
                <li><strong>Martinus Nijhoff:</strong> Den Haag</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Kunstzinnig grafmonument van Nederlandse kunstenaar" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🎨 Kunstenaars en schilders</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Nederlandse kunstenaars hebben wereldwijd naam gemaakt. Hun graven weerspiegelen vaak hun artistieke visie.
            </p>
            
            <div class="space-y-4">
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🖼️ Beroemde schilders:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-gray-700">
                    <li><strong>Rembrandt van Rijn:</strong> Westerkerk Amsterdam</li>
                    <li><strong>Johannes Vermeer:</strong> Oude Kerk Delft</li>
                    <li><strong>Vincent van Gogh:</strong> Auvers-sur-Oise, Frankrijk</li>
                    <li><strong>Piet Mondriaan:</strong> New York, VS</li>
                  </ul>
                  <ul class="space-y-1 text-gray-700">
                    <li><strong>Karel Appel:</strong> <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a></li>
                    <li><strong>Kees van Dongen:</strong> Monaco</li>
                    <li><strong>Jan Steen:</strong> Leiden</li>
                    <li><strong>Jacob van Ruisdael:</strong> Haarlem</li>
                  </ul>
                </div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🎵 Musici en componisten:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li><strong>Jan Pieterszoon Sweelinck:</strong> Oude Kerk Amsterdam</li>
                  <li><strong>Herman van Veen:</strong> Nog in leven</li>
                  <li><strong>André Hazes:</strong> <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a></li>
                  <li><strong>Ramses Shaffy:</strong> <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">👑 Koninklijke familie en staatshoofden</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Leden van het Nederlandse koningshuis rusten in speciale grafkelders en mausoleums.
          </p>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🏰 Koninklijke graven:</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 mb-1">Nieuwe Kerk Delft - Koninklijke grafkelder</h4>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Willem van Oranje (Willem de Zwijger)</li>
                  <li>• Koningin Wilhelmina</li>
                  <li>• Koningin Juliana</li>
                  <li>• Prins Bernhard</li>
                  <li>• Prins Claus</li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-900 mb-1">Andere koninklijke graven:</h4>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Prins Hendrik (echtgenoot Wilhelmina): Nieuwe Kerk Delft</li>
                  <li>• Prinses Beatrix: Toekomstige rustplaats</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Politiek monument op begraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🏛️ Politici en staatslieden</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Nederlandse politiek heeft vele invloedrijke figuren gekend die het land hebben gevormd.
            </p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-red-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🎩 Ministers-presidenten:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li><strong>Johan Thorbeckeplein:</strong> Den Haag</li>
                  <li><strong>Abraham Kuyper:</strong> Den Haag</li>
                  <li><strong>Joop den Uyl:</strong> <a href="/begraafplaats/nieuwe-oosterbegraafplaats" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a></li>
                  <li><strong>Dries van Agt:</strong> Nog in leven</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">⚖️ Andere staatslieden:</h3>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li><strong>Hugo de Groot:</strong> Nieuwe Kerk Delft</li>
                  <li><strong>Johan van Oldenbarnevelt:</strong> Nieuwe Kerk Den Haag</li>
                  <li><strong>Pim Fortuyn:</strong> <a href="/gemeente/rotterdam" class="text-blue-600 hover:text-blue-800 underline">Driehuis-Westerveld</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🔬 Wetenschappers en ontdekkers</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Nederland heeft vele belangrijke wetenschappers voortgebracht die de wereld hebben veranderd.
          </p>
          
          <div class="space-y-4">
            <div class="bg-teal-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🧪 Beroemde wetenschappers:</h3>
              <ul class="space-y-2 text-gray-700">
                <li><strong>Christiaan Huygens:</strong> Grote Kerk Den Haag</li>
                <li><strong>Antoni van Leeuwenhoek:</strong> Oude Kerk Delft</li>
                <li><strong>Hugo de Vries:</strong> Amsterdam</li>
                <li><strong>Heike Kamerlingh Onnes:</strong> Leiden</li>
                <li><strong>Johannes Diderik van der Waals:</strong> Amsterdam</li>
              </ul>
            </div>
            
            <div class="bg-indigo-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌍 Ontdekkers en reizigers:</h3>
              <ul class="space-y-2 text-gray-700">
                <li><strong>Abel Tasman:</strong> Batavia (nu Jakarta)</li>
                <li><strong>Willem Barentsz:</strong> Novaja Zemlja (verdwenen)</li>
                <li><strong>Michiel de Ruyter:</strong> Nieuwe Kerk Amsterdam</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrmW9M_Iu2P2xd753E-pQ9pG3XI67ys3ieO9sC3Q7kSFNsKSjVmXHMMEPvbG81o27eXlpjW58AJDLuxXz9zklNIMeDwH2SIny5WsN87SChRnfwrjKaOeoDpm_RocSjGOguNCRfNDg=w800-h500-k-no" 
            alt="Protestant cemetery Oosterhout - entertainment sterren graf" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🎬 Entertainment en sport</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Ook uit de wereld van entertainment en sport rusten er bekende Nederlanders op onze begraafplaatsen.
            </p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-purple-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🎭 Acteurs en entertainers:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li><strong>Johnny Kraaijkamp Sr.:</strong> <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a></li>
                  <li><strong>Wim Sonneveld:</strong> Begraafplaats Driehuis</li>
                  <li><strong>Toon Hermans:</strong> <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a></li>
                  <li><strong>Sylvia Millecam:</strong> Begraafplaats Bloemendaal</li>
                </ul>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">⚽ Sporters:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li><strong>Johan Cruijff:</strong> <a href="/begraafplaats/begraafplaats-driehuis-westerveld" class="text-blue-600 hover:text-blue-800 underline">Driehuis-Westerveld</a></li>
                  <li><strong>Abe Lenstra:</strong> Friesland</li>
                  <li><strong>Fanny Blankers-Koen:</strong> Hoofddorp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🗺️ Begraafplaatsen met veel beroemdheden</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Sommige begraafplaatsen herbergen opvallend veel beroemde Nederlanders.
          </p>
          
          <div class="space-y-4">
            <div class="bg-gold-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌟 Top beroemde begraafplaatsen:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-1"><a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied Amsterdam</a></h4>
                  <p class="text-xs text-gray-600 mb-1">Meeste beroemdheden, exclusieve begraafplaats</p>
                  <ul class="text-xs text-gray-700">
                    <li>• André Hazes, Gerard Reve, Karel Appel</li>
                    <li>• Johnny Kraaijkamp, Toon Hermans</li>
                  </ul>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Nieuwe Kerk Delft</h4>
                  <p class="text-xs text-gray-600 mb-1">Koninklijke familie en staatshoofden</p>
                  <ul class="text-xs text-gray-700">
                    <li>• Willem van Oranje, Hugo de Groot</li>
                    <li>• Koninginnen Wilhelmina en Juliana</li>
                  </ul>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-1"><a href="/begraafplaats/nieuwe-oosterbegraafplaats" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a></h4>
                  <p class="text-xs text-gray-600 mb-1">Diverse culturen en beroepen</p>
                  <ul class="text-xs text-gray-700">
                    <li>• Joop den Uyl, Lucebert</li>
                    <li>• Vele kunstenaars en schrijvers</li>
                  </ul>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Westerkerk Amsterdam</h4>
                  <p class="text-xs text-gray-600 mb-1">Historische persoonlijkheden</p>
                  <ul class="text-xs text-gray-700">
                    <li>• Rembrandt van Rijn</li>
                    <li>• Verschillende historische figuren</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">📋 Tips voor het bezoeken van beroemde graven</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Voorbereiding:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Zoek van tevoren de locatie op</li>
                <li>✓ Check openingstijden begraafplaats</li>
                <li>✓ Lees over de persoon</li>
                <li>✓ Breng eventueel bloemen mee</li>
                <li>✓ Neem camera mee (indien toegestaan)</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Respect tonen:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>✓ Wees stil en respectvol</li>
                <li>✓ Stoor andere bezoekers niet</li>
                <li>✓ Loop niet over andere graven</li>
                <li>✓ Laat geen afval achter</li>
                <li>✓ Respecteer eventuele restricties</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🏛️ Virtuele bezoeken en online bronnen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Niet alle beroemde graven zijn gemakkelijk te bezoeken. Gelukkig zijn er online bronnen beschikbaar.
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Online bronnen:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Find A Grave - wereldwijde database</li>
                <li>• Graftombe.nl - Nederlandse graven</li>
                <li>• Wikipedia - biografieën en graflocaties</li>
                <li>• Begraafplaats websites</li>
                <li>• Virtual cemetery tours</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Apps en tools:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• GPS coördinaten</li>
                <li>• Begraafplaats plattegronden</li>
                <li>• Audio tours</li>
                <li>• QR codes op graven</li>
                <li>• Sociale media groepen</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">In het spoor van grootheden</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Het bezoeken van graven van beroemde Nederlanders is een bijzondere manier om connectie te maken met onze geschiedenis en cultuur. Deze plekken herinneren ons eraan dat ook de grootste persoonlijkheden sterfelijk zijn, maar dat hun nalatenschap eeuwig voortleeft.
          </p>
          <p class="text-gray-700">
            Plan uw volgende bezoek aan een <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">beroemde begraafplaats</a> en laat u inspireren door de verhalen van degenen die ons land hebben gevormd. Gebruik onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> om begraafplaatsen met beroemde graven in uw buurt te vinden.
          </p>
        </div>
      </section>
    </div>`,
  'seizoenen-begraafplaats-natuur': `<div class="blog-content space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Begraafplaatsen zijn levendige ecosystemen die het hele jaar door veranderen. Elke seizoen brengt zijn eigen schoonheid, sfeer en natuurlijke cycli. Ontdek hoe de natuur op begraafplaatsen door het jaar heen een troostende en hoopgevende rol speelt.
      </p>

      <section class="mt-8 space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Vier seizoenen op begraafplaats collage" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌿 Begraafplaatsen als groene oases</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Begraafplaatsen zijn vaak de groenste plekken in steden en dorpen. Deze rustige oases herbergen een rijke biodiversiteit en bieden door alle seizoenen heen een plek van bezinning, troost en natuurlijke schoonheid.
            </p>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Waarom zijn begraafplaatsen zo groen?</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">🌳</span>
                  <span><strong>Oude bomen:</strong> Vaak eeuwenoude bomen die beschermd worden</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">🚫</span>
                  <span><strong>Geen bebouwing:</strong> Permanente groene ruimte</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">🌱</span>
                  <span><strong>Zorgvuldig onderhoud:</strong> Professioneel groenbeheer</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">🦋</span>
                  <span><strong>Biodiversiteit:</strong> Rust trekt veel diersoorten aan</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-600 mr-2">💐</span>
                  <span><strong>Bloemenrijkdom:</strong> Veel geplante en wilde bloemen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npojPJpR72f8rUVTvKb0IKcQ2yYMnJXhImWv4LMDNz_8nj25p3auDfGhUdQJ_o__7_BziDdulVoyXstH1pd9MX2m0qesvt2G_4UmrT0sPM_uFIkv1wkDRhs7vKTnsuX05LGUvCY=w800-h500-k-no" 
            alt="R.K begraafplaats Vorden - lentebloesem" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🌸 Lente: Hergeboorte en hoop</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De lente brengt hernieuwde hoop en leven op begraafplaatsen. Na de winterrust ontwaakt de natuur in al haar pracht.
            </p>
            
            <div class="space-y-4">
              <div class="bg-pink-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌺 Lentebloei (maart-mei):</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Vroege voorjaarsbloemen:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Sneeuwklokjes (februari)</li>
                      <li>• Krokussen (maart)</li>
                      <li>• Narcissen (april)</li>
                      <li>• Tulpen (april-mei)</li>
                      <li>• Hyacinten (april)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Bloeiende bomen:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Magnolia (maart-april)</li>
                      <li>• Kersenbloesem (april)</li>
                      <li>• Appelbloesem (mei)</li>
                      <li>• Paardenkastanje (mei)</li>
                      <li>• Linde knopbloei (mei)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🐦 Lentedieren:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Zangvogels keren terug en beginnen te broeden</li>
                  <li>• Eerste vlinders verschijnen (citroenvlinder, dagpauwoog)</li>
                  <li>• Bijen worden actief voor nectar</li>
                  <li>• Eekhoorns krijgen jongen</li>
                  <li>• Kikkers en padden in vijvers</li>
                </ul>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌱 Symboliek van de lente:</h3>
                <p class="text-gray-700 mb-2">De lente op begraafplaatsen symboliseert:</p>
                <ul class="space-y-1 text-gray-700">
                  <li>• Hergeboorte en eeuwig leven</li>
                  <li>• Hoop na verdriet</li>
                  <li>• De cyclus van leven en dood</li>
                  <li>• Vrede en troost voor nabestaanden</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
            alt="Weelderig groen op zomerbegraafplaats" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">☀️ Zomer: Volheid van leven</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De zomer toont begraafplaatsen op hun mooist: weelderig groen, een overvloed aan bloemen en bruisend dierenleven.
            </p>
            
            <div class="space-y-4">
              <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌻 Zomerbloemen (juni-augustus):</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Vaste planten:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Rozen (juni-oktober)</li>
                      <li>• Lavendel (juli-augustus)</li>
                      <li>• Hortensia's (juli-september)</li>
                      <li>• Dahlia's (juli-oktober)</li>
                      <li>• Phlox (juli-september)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Eenjarigen:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Begonia's</li>
                      <li>• Impatiens</li>
                      <li>• Petunia's</li>
                      <li>• Marigolds</li>
                      <li>• Zinnia's</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌳 Zomergroen:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Volle bladerdossen bieden koelte en schaduw</li>
                  <li>• Taxus en andere coniferen op hun mooist</li>
                  <li>• Gras vereist regelmatig maaien</li>
                  <li>• Heggen worden bijgehouden</li>
                  <li>• Klimop groeit weelderig over oude monumenten</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🦋 Zomerfauna:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Vlinders: koninginnenpage, atalanta</li>
                    <li>• Bijen en hommels op bloemen</li>
                    <li>• Vogels voeden jongen</li>
                    <li>• Libellen bij waterpartijen</li>
                  </ul>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Eekhoorns actief zichtbaar</li>
                    <li>• Hazen in vroege ochtend</li>
                    <li>• Vleermuizen 's avonds</li>
                    <li>• Lieveheersbeestjes overal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4no7EmK-ebftASWzgB0kisZIUN7jTuBzWqK6iPGCxroUQ5_ygxPOikQfOv7Z68WXS3R0DeU4XBvE9pf0ZVVaotND7kdrTCLkftpRH5Vgh8OSeBAzuNG5wvw-kws-CEPqVzclTKY=w800-h500-k-no" 
            alt="Begraafplaats van de tachtigjarige oorlog Breda - herfstkleuren" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">🍂 Herfst: Kleuren van reflectie</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De herfst brengt warme kleuren en een contemplatieve sfeer. Het is een tijd van bezinning en voorbereiding op de rust van de winter.
            </p>
            
            <div class="space-y-4">
              <div class="bg-orange-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🍁 Herfstkleuren (september-november):</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Geel/goud:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Berk (helder geel)</li>
                      <li>• Linde (warm geel)</li>
                      <li>• Ginkgo (goudgeel)</li>
                      <li>• Esdoorn (variërend)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Rood/oranje:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Japanse esdoorn (knalrood)</li>
                      <li>• Eik (roestbruin)</li>
                      <li>• Beuk (koperkleurig)</li>
                      <li>• Kersenboom (oranje-rood)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="bg-red-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌰 Herfstvruchten en zaden:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• Kastanjes van paardenkastanje</li>
                  <li>• Eikels van eiken</li>
                  <li>• Beukenootjes</li>
                  <li>• Lindebloesem zaadjes</li>
                  <li>• Rozenbottels (oranje/rood)</li>
                  <li>• Bessen van lijsterbes</li>
                </ul>
              </div>
              
              <div class="bg-brown-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🦔 Herfstvoorbereiding:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Eekhoorns verzamelen noten</li>
                    <li>• Vogels trekken weg</li>
                    <li>• Insecten zoeken winterschuilplaats</li>
                    <li>• Vleermuizen bereiden winterslaap voor</li>
                  </ul>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Bomen trekken sappen terug</li>
                    <li>• Bladval begint</li>
                    <li>• Laatste bloemen bloeien</li>
                    <li>• Dauw en mist 's ochtends</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
            alt="Sneeuw op grafstenen in winterlandschap" 
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">❄️ Winter: Rust en bezinning</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              De winter transformeert begraafplaatsen tot stille, serene landschappen. Het is een tijd van innerlijke inkeer en vredige rust.
            </p>
            
            <div class="space-y-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">❅ Winterschoonheid (december-februari):</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Met sneeuw:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Mystieke stilte</li>
                      <li>• Witte deken over graven</li>
                      <li>• Grafische silhouetten</li>
                      <li>• Sporen in de sneeuw</li>
                      <li>• Kristallen op takken</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">Zonder sneeuw:</h4>
                    <ul class="space-y-1 text-sm text-gray-700">
                      <li>• Kale boomtakken</li>
                      <li>• Wintergroen coniferen</li>
                      <li>• Rijp op gras</li>
                      <li>• Lage, gouden zon</li>
                      <li>• Mist en dampende adem</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">🌲 Wintergroen:</h3>
                <ul class="space-y-1 text-gray-700">
                  <li>• <strong>Taxus:</strong> Donkergroen, vaak als hagen</li>
                  <li>• <strong>Hulst:</strong> Glanzend groen met rode bessen</li>
                  <li>• <strong>Klimop:</strong> Bedekt muren en monumenten</li>
                  <li>• <strong>Dennenbomen:</strong> Houden naalden</li>
                  <li>• <strong>Rhododendron:</strong> Blijft groen in winter</li>
                </ul>
              </div>
              
              <div class="bg-white rounded-lg p-4 border">
                <h3 class="font-semibold text-gray-900 mb-2">🦅 Winterdieren:</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Wintervogels: merel, roodborstje</li>
                    <li>• Kraaien en eksters</li>
                    <li>• Eekhoorns minder actief</li>
                    <li>• Konijnen zoeken beschutting</li>
                  </ul>
                  <ul class="space-y-1 text-sm text-gray-700">
                    <li>• Vossen soms zichtbaar</li>
                    <li>• Wintervlinders (zeldzaam)</li>
                    <li>• Egels in winterslaap</li>
                    <li>• Vleermuizen slapen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌱 Planten bij graven door de seizoenen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Veel mensen planten seizoensgebonden bloemen bij graven om de hele jaarcyclus kleur en leven te brengen.
          </p>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seizoen</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Populaire planten</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Onderhoud</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Symboliek</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">Lente</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Primula, viooltjes, tulpen</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Water geven, onkruid wieden</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Hergeboorte, hoop</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">Zomer</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Begonia, impatiens, geraniums</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Regelmatig water, uitgebloeide bloemen wegknippen</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Volheid van leven</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">Herfst</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Chrysanten, heideplanten</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Minder water, beschermen tegen vorst</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Reflectie, herinnering</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">Winter</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Kerststukjes, coniferen</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Minimaal, vorstbescherming</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Eeuwig leven, hoop</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🦋 Biodiversiteit op begraafplaatsen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Begraafplaatsen zijn vaak belangrijke refuges voor wilde planten en dieren in verder verstedelijkte gebieden.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌸 Flora:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Wilde orchideeën</li>
                <li>• Korstmossen op stenen</li>
                <li>• Varens in schaduw</li>
                <li>• Mossen op graven</li>
                <li>• Klimop en wilde wingerd</li>
                <li>• Spontane boomopslag</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🐦 Vogels:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Roodborstje</li>
                <li>• Merel</li>
                <li>• Winterkoning</li>
                <li>• Roodborst</li>
                <li>• Specht (in oude bomen)</li>
                <li>• Uilen (bij torens)</li>
              </ul>
            </div>
            
            <div class="bg-yellow-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🦔 Zoogdieren:</h3>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Eekhoorns</li>
                <li>• Egels</li>
                <li>• Vleermuizen</li>
                <li>• Konijnen/hazen</li>
                <li>• Vossen (grote begraafplaatsen)</li>
                <li>• Muizen en spitsmuizen</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3">📷 Fotograferen door de seizoenen</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Beste tijdstippen:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>🌅 <strong>Lente:</strong> Ochtendlicht op bloesem</li>
                <li>☀️ <strong>Zomer:</strong> Gouden uur voor warmte</li>
                <li>🍂 <strong>Herfst:</strong> Bewolkt weer voor kleuren</li>
                <li>❄️ <strong>Winter:</strong> Na sneeuwval voor sereniteit</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Tips per seizoen:</h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>📸 Gebruik natuurlijk licht</li>
                <li>🎨 Focus op kleurcontrasten</li>
                <li>🦋 Inclusief wilde dieren</li>
                <li>🌿 Details van planten en texturen</li>
              </ul>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 mt-3">
            💡 Tip: Lees ons artikel over <a href="/blog/begraafplaats-fotografie-tips-etiquette" class="text-blue-600 hover:text-blue-800 underline">respectvolle begraafplaatsfotografie</a> voor meer tips.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌿 Ecologisch beheer</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Moderne begraafplaatsen kiezen steeds vaker voor duurzaam en ecologisch beheer dat de natuur ten goede komt.
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🌱 Duurzame praktijken:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Inheemse planten verkiezen</li>
                <li>• Wilde hoekjes laten bestaan</li>
                <li>• Geen pesticiden gebruiken</li>
                <li>• Regenwater opvangen</li>
                <li>• Composteren van plantenafval</li>
                <li>• Nestkastjes ophangen</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">🦋 Biodiversiteit bevorderen:</h3>
              <ul class="space-y-1 text-gray-700">
                <li>• Bloemenweiden aanleggen</li>
                <li>• Holle wegen behouden</li>
                <li>• Variatie in grashoogte</li>
                <li>• Takkenrillen voor insecten</li>
                <li>• Vogelvoer in winter</li>
                <li>• Vlindervriendelijke planten</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🌳 Bijzondere begraafplaatsen per seizoen</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Sommige Nederlandse begraafplaatsen zijn extra mooi in bepaalde seizoenen:
          </p>
          
          <div class="space-y-3">
            <div class="bg-pink-50 rounded-lg p-3">
              <h4 class="font-medium text-gray-900">🌸 <strong>Lente:</strong></h4>
              <p class="text-sm text-gray-700">
                <a href="/begraafplaats/nieuwe-oosterbegraafplaats" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a> - prachtige kersenbloesem | 
                <a href="/begraafplaats/westerveld" class="text-blue-600 hover:text-blue-800 underline">Westerveld</a> - magnolia's en rhododendrons
              </p>
            </div>
            
            <div class="bg-green-50 rounded-lg p-3">
              <h4 class="font-medium text-gray-900">☀️ <strong>Zomer:</strong></h4>
              <p class="text-sm text-gray-700">
                <a href="/type/natuurbegraafplaats" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a> - weelderig groen | 
                <a href="/begraafplaats/zorgvlied" class="text-blue-600 hover:text-blue-800 underline">Zorgvlied</a> - rozentuinen in bloei
              </p>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-3">
              <h4 class="font-medium text-gray-900">🍂 <strong>Herfst:</strong></h4>
              <p class="text-sm text-gray-700">
                Begraafplaatsen met veel loofbomen - spectaculaire herfstkleuren in oktober/november
              </p>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-3">
              <h4 class="font-medium text-gray-900">❄️ <strong>Winter:</strong></h4>
              <p class="text-sm text-gray-700">
                Oude begraafplaatsen met grote bomen - mystieke wintersfeer met coniferen en klimop
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-100 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900 mb-3">De eeuwige cyclus van de natuur</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Begraafplaatsen laten ons zien dat leven en dood onderdeel zijn van een groter natuurlijk geheel. Door de seizoenen heen bieden ze troost, schoonheid en de belofte dat het leven altijd terugkeert - in nieuwe vormen, nieuwe kleuren, nieuwe hoop.
          </p>
          <p class="text-gray-700">
            Bezoek een <a href="/" class="text-blue-600 hover:text-blue-800 underline">begraafplaats in uw buurt</a> in verschillende seizoenen en ervaar zelf hoe de natuur door het jaar heen troost en vreugde kan brengen. Voor informatie over natuurvriendelijke begrafenissen, lees ons artikel over <a href="/blog/natuurbegraafplaatsen-nederland" class="text-blue-600 hover:text-blue-800 underline">natuurbegraafplaatsen</a>.
          </p>
        </div>
      </section>
    </div>`
,
  'beroemde-nederlanders-laatste-rustplaats': `
    <div class="blog-content space-y-6">
  <p class="text-lg leading-relaxed text-gray-700">Nederland kent een rijke geschiedenis met vele beroemde persoonlijkheden die hun stempel hebben gedrukt op onze cultuur, kunst, wetenschap en maatschappij. Hun laatste rustplaatsen vertellen niet alleen hun verhaal, maar ook dat van Nederland zelf. In dit artikel nemen we u mee langs de graven van enkele van de meest invloedrijke Nederlanders.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Kunstenaars die Nederland op de kaart zetten</h2>
  
  <h3 class="text-xl font-semibold text-gray-900 mb-3">Rembrandt van Rijn (1606-1669)</h3>
  <p class="text-gray-700 leading-relaxed mb-4">De meester van licht en schaduw ligt begraven in de <strong class="font-semibold">Westerkerk</strong> in Amsterdam. Op 8 oktober 1669 werd Rembrandt ter aarde besteld in een huurgraf dat destijds 15 gulden kostte. Bijzonder is dat de exacte locatie van zijn graf onbekend is gebleven. Ook zijn geliefde Hendrickje Stoffels en zoon Titus rusten in dezelfde kerk. Zijn vrouw Saskia van Uylenburgh ligt echter in de Oude Kerk begraven.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Vincent van Gogh (1853-1890)</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Hoewel Van Gogh een Nederlandse kunstenaar was, ligt hij begraven in het Franse <strong class="font-semibold">Auvers-sur-Oise</strong>. Zijn graf, bereikbaar via een pad door korenvelden, heeft een eenvoudige grafsteen met het opschrift "Ici repose Vincent van Gogh". Zijn broer Theo, die in 1891 overleed, werd in 1914 herbegraven naast Vincent. Beide graven zijn bedekt met klimop en hebben identieke grafstenen.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">George Breitner (1857-1923)</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Deze beroemde fotograaf en schilder van het Amsterdamse stadsleven ligt begraven op begraafplaats <strong class="font-semibold">De Nieuwe Ooster</strong> in Amsterdam. Breitner stond bekend om zijn impressionistische schilderijen van het bruisende stadsleven rond 1900.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Schrijvers en dichters</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Eduard Douwes Dekker - Multatuli (1820-1887)</h3>
  <p class="text-gray-700 leading-relaxed mb-4">De schrijver van Max Havelaar was de eerste bekende Nederlander die gecremeerd werd. Dit gebeurde in 1887 in het Duitse Gotha. Op begraafplaats <strong class="font-semibold">Westerveld</strong> staat sinds 1948 een monument met urnen die zijn as en die van zijn vrouw bevatten. Dit monument markeert een belangrijke verandering in de Nederlandse uitvaartcultuur.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Jacques Perk (1859-1881)</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Deze dichter, bekend van zijn sonnettencyclus Mathilde, rust op <strong class="font-semibold">De Nieuwe Ooster</strong>. Ondanks zijn korte leven van slechts 22 jaar, had hij grote invloed op de Tachtigers-beweging. Zijn graf staat op de nationale monumentenlijst.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Maatschappelijke iconen</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Majoor Bosshardt (1913-2007)</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Het bekendste gezicht van het Leger des Heils in Nederland ligt begraven op <strong class="font-semibold">De Nieuwe Ooster</strong>. Majoor Bosshardt stond bekend om haar onvermoeibare inzet voor daklozen en verslaafden in Amsterdam. Haar begrafenis trok duizenden mensen die afscheid kwamen nemen.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Anne Frank (1929-1945)</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Anne Frank heeft geen bekend graf. Zij overleed in het concentratiekamp Bergen-Belsen en werd, zoals de meeste slachtoffers van de Holocaust, in een massagraf begraven. Wel is Janny Brandes-Brilleslijper, die Anne in het kamp bijstond, begraven op <strong class="font-semibold">Zorgvlied</strong> in Amsterdam.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Bekende begraafplaatsen voor beroemdheden</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Westerveld - Een cultureel erfgoed</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Gelegen in de duinen van Driehuis bij Velsen, is Westerveld een van de oudste particuliere begraafplaatsen van Nederland. Opgericht 125 jaar geleden, herbergt het de graven van vele kunstenaars, ondernemers en maatschappelijke figuren. Naast het Multatuli-monument vind je er ook het graf met twee vleugels van architect Karel de Bazel.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">De Nieuwe Ooster - Monument van geschiedenis</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Deze 33 hectare grote begraafplaats in Amsterdam-Oost opende haar poorten op 1 mei 1894. Vele graven hebben monumentstatus gekregen. Naast de eerder genoemde personen rusten hier ook:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Willem Breuker (1944-2010) - componist en muzikant</li>
    <li class="mb-1">Jos Brink - televisie- en theatermaker</li>
    <li class="mb-1">Feike Asma - organist en dirigent</li>
    <li class="mb-1">Wally Tax - rocklegende</li>
    <li class="mb-1">Thérèse Schwartze - portrettiste</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Zorgvlied - Stille getuige van Amsterdam</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Begraafplaats Zorgvlied staat bekend als een van de beroemdste begraafplaatsen van Nederland, mede door het grote aantal bekende Nederlanders dat er begraven ligt. De begraafplaats ademt geschiedenis en cultuur.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Een bezoek plannen</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">Het bezoeken van de graven van beroemde Nederlanders kan een bijzondere ervaring zijn. Het brengt geschiedenis tot leven en biedt een moment van bezinning. Enkele tips voor uw bezoek:</p>

  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Respectvol gedrag:</strong> Denk eraan dat begraafplaatsen plekken van rouw en herdenking zijn</li>
    <li class="mb-1"><strong class="font-semibold">Openingstijden:</strong> Controleer vooraf de openingstijden van de begraafplaats</li>
    <li class="mb-1"><strong class="font-semibold">Rondleidingen:</strong> Veel begraafplaatsen bieden speciale rondleidingen langs beroemde graven</li>
    <li class="mb-1"><strong class="font-semibold">Fotografie:</strong> Vraag toestemming voor het maken van foto's, vooral bij recente graven</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Cultureel erfgoed</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">De graven van beroemde Nederlanders vormen een belangrijk onderdeel van ons cultureel erfgoed. Ze vertellen niet alleen het verhaal van individuele levens, maar ook van de ontwikkeling van Nederland als natie. Van kunstenaars die wereldfaam verwierven tot maatschappelijke hervormers die het leven van gewone mensen verbeterden - hun laatste rustplaatsen blijven plaatsen van herinnering en inspiratie.</p>

  <p class="text-gray-700 leading-relaxed mb-4">Of u nu geïnteresseerd bent in kunst, geschiedenis of gewoon nieuwsgierig bent naar de verhalen achter bekende namen, een bezoek aan deze historische begraafplaatsen biedt een unieke kijk op het Nederlandse verleden. Het zijn plekken waar het verleden tastbaar wordt en waar we kunnen reflecteren op de bijdragen die deze mensen hebben geleverd aan onze samenleving.</p>
</div>
  `,
  'seizoenen-begraafplaats-wat-verwachten': `
    <div class="blog-content space-y-6">
  <p class="text-lg leading-relaxed text-gray-700">Begraafplaatsen ondergaan gedurende het jaar een fascinerende transformatie. Elk seizoen brengt zijn eigen sfeer, uitdagingen en schoonheid met zich mee. Of u nu een graf bezoekt of gewoon geniet van de serene omgeving, het is goed om te weten wat u in elk jaargetijde kunt verwachten.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Lente: Ontwaken en vernieuwing</h2>
  
  <h3 class="text-xl font-semibold text-gray-900 mb-3">Maart - Mei: De natuur komt tot leven</h3>
  <p class="text-gray-700 leading-relaxed mb-4">De lente is misschien wel het mooiste seizoen op begraafplaatsen. Na de winterse rust ontluikt de natuur in al haar pracht. Narcissen, krokussen en tulpen kleuren de perken, terwijl bloesems de bomen sieren. Deze periode symboliseert hoop en vernieuwing, wat troostrijk kan zijn voor nabestaanden.</p>

  <p class="text-gray-700 leading-relaxed mb-4"><strong class="font-semibold">Wat u kunt verwachten:</strong></p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Bloeiende voorjaarsbloemen tussen de graven</li>
    <li class="mb-1">Onderhoudswerk na de winter: oprumen van bladeren en snoeien</li>
    <li class="mb-1">Drukkere bezoektijden rond Pasen</li>
    <li class="mb-1">Vogels die terugkeren en nesten bouwen</li>
    <li class="mb-1">Soms modderige paden door smeltende sneeuw en voorjaarsregen</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Tips voor lentebezoek</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Draag waterdicht schoeisel, vooral in maart en april wanneer paden nog nat kunnen zijn. Neem eventueel een klein schepje mee om voorjaarsbloemen te planten op het graf. Let op: vraag eerst toestemming aan het beheer voor het planten van nieuwe gewassen.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Zomer: Volheid en bezinning</h2>
  
  <h3 class="text-xl font-semibold text-gray-900 mb-3">Juni - Augustus: Groene oase van rust</h3>
  <p class="text-gray-700 leading-relaxed mb-4">In de zomer transformeren begraafplaatsen tot groene oases. Het dichte bladerdak biedt schaduw en verkoeling, terwijl de zomerbloemen voor kleurrijke accenten zorgen. Deze periode nodigt uit tot rustige contemplatie en langere bezoeken.</p>

  <p class="text-gray-700 leading-relaxed mb-4"><strong class="font-semibold">Wat u kunt verwachten:</strong></p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Weelderige begroeiing en bloeiende rozen</li>
    <li class="mb-1">Intensief maaiwerk om het gras netjes te houden</li>
    <li class="mb-1">Langere openingstijden op veel begraafplaatsen</li>
    <li class="mb-1">Vlinders en bijen rond bloeiende planten</li>
    <li class="mb-1">Mogelijk watertekort: sommige planten kunnen dorstig zijn</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Praktische zomertips</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Bezoek bij voorkeur in de ochtend of late namiddag om de hitte te vermijden. Neem water mee, zowel voor uzelf als voor bloemen op het graf. Een gieter is vaak beschikbaar bij de watervoorziening op de begraafplaats.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Herfst: Reflectie en herdenking</h2>
  
  <h3 class="text-xl font-semibold text-gray-900 mb-3">September - November: Een tapijt van kleuren</h3>
  <p class="text-gray-700 leading-relaxed mb-4">De herfst brengt een spectaculaire kleurenpracht naar begraafplaatsen. Gouden, rode en oranje bladeren creëren een schilderachtig decor. Dit seizoen van vergankelijkheid past natuurlijk bij de functie van begraafplaatsen en nodigt uit tot diepere reflectie.</p>

  <p class="text-gray-700 leading-relaxed mb-4"><strong class="font-semibold">Wat u kunt verwachten:</strong></p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Prachtige herfstkleuren in bomen en struiken</li>
    <li class="mb-1">Vallende bladeren die graven kunnen bedekken</li>
    <li class="mb-1">Extra drukte rond Allerzielen (2 november)</li>
    <li class="mb-1">Chrysanten als typische herfstbloemen op graven</li>
    <li class="mb-1">Kortere dagen: let op sluitingstijden</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Allerzielen-traditie</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Rond Allerzielen organiseren veel begraafplaatsen speciale herdenkingsbijeenkomsten. Graven worden extra verzorgd en vaak sfeervol verlicht met kaarsen. Dit is een bijzonder moment om overledenen te gedenken in gemeenschap met anderen.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Winter: Verstilling en sereniteit</h2>
  
  <h3 class="text-xl font-semibold text-gray-900 mb-3">December - Februari: Ingetogen schoonheid</h3>
  <p class="text-gray-700 leading-relaxed mb-4">De winter brengt een serene rust over begraafplaatsen. Kale bomen onthullen de architectuur van monumenten en de structuur van de begraafplaats wordt zichtbaar. Sneeuw kan het landschap transformeren tot een verstild winterwonderland.</p>

  <p class="text-gray-700 leading-relaxed mb-4"><strong class="font-semibold">Wat u kunt verwachten:</strong></p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Minimale begroeiing, focus op grafmonumenten</li>
    <li class="mb-1">Mogelijk beperkte toegankelijkheid bij sneeuw of ijzel</li>
    <li class="mb-1">Kortere openingstijden en vroege schemering</li>
    <li class="mb-1">Kerststukken en wintergroen op graven</li>
    <li class="mb-1">Extra aandacht voor grafonderhoud tegen vorst</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Winterbezoek voorbereiden</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Kleed u warm aan en draag stevige schoenen met grip. Controleer vooraf de openingstijden, die in winter vaak beperkt zijn. Overweeg kunstbloemen of winterharde planten zoals heide voor grafversiering.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Seizoensgebonden onderhoud</h2>
  
  <h3 class="text-xl font-semibold text-gray-900 mb-3">Wat doet het begraafplaatsbeheer?</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Het onderhoud van begraafplaatsen volgt een seizoensgebonden cyclus:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Lente:</strong> Grote schoonmaak, snoeien, nieuwe aanplant</li>
    <li class="mb-1"><strong class="font-semibold">Zomer:</strong> Intensief maaien, water geven, onkruid wieden</li>
    <li class="mb-1"><strong class="font-semibold">Herfst:</strong> Blad ruimen, winterklaar maken</li>
    <li class="mb-1"><strong class="font-semibold">Winter:</strong> Sneeuwruimen, veiligheid waarborgen</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Uw bijdrage als bezoeker</h3>
  <p class="text-gray-700 leading-relaxed mb-4">U kunt helpen door:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Verwelkte bloemen tijdig te verwijderen</li>
    <li class="mb-1">Geen losse voorwerpen achter te laten die kunnen omwaaien</li>
    <li class="mb-1">Seizoensgebonden decoratie te kiezen</li>
    <li class="mb-1">Schade door weer direct te melden aan beheer</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Flora en fauna door de seizoenen</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">Begraafplaatsen zijn vaak onverwachte natuurparadijzen. Door het jaar heen kunt u verschillende dieren en planten tegenkomen:</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Voorjaarsgasten</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Roodborstjes, merels en koolmezen bouwen nesten. Eekhoorns worden actiever. Wilde hyacinten en bosanemonen bloeien tussen oude graven.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Zomerleven</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Vlinders zoals het koolwitje en de atalanta bezoeken bloemen. Libellen zweven boven waterpartijen. Wilde orchideeën kunnen op oude begraafplaatsen groeien.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Herfstbewoners</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Paddenstoelen verschijnen rond oude bomen. Egels zoeken een winterverblijf. Lijsterbessen en hulst bieden voedsel voor vogels.</p>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Wintergasten</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Winterkoninkjes en roodborstjes blijven actief. Sporen in de sneeuw verraden vossen of konijnen. Mossoorten blijven groen en sieren oude stenen.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Planning van uw bezoek</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">Elk seizoen heeft zijn charme op de begraafplaats. Voor een optimale ervaring:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Controleer openingstijden:</strong> Deze variëren per seizoen</li>
    <li class="mb-1"><strong class="font-semibold">Weer-app raadplegen:</strong> Vermijd bezoek bij storm of onweer</li>
    <li class="mb-1"><strong class="font-semibold">Seizoensgebonden items:</strong> Paraplu, zonnebrand, handschoenen</li>
    <li class="mb-1"><strong class="font-semibold">Respecteer de natuur:</strong> Blijf op de paden, vooral bij nat weer</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Conclusie</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">Begraafplaatsen zijn levende landschappen die meebewegen met de seizoenen. Elk jaargetijde brengt zijn eigen schoonheid, uitdagingen en mogelijkheden voor bezinning. Door te weten wat u kunt verwachten, kunt u uw bezoek beter plannen en meer waardering krijgen voor deze bijzondere plekken.</p>

  <p class="text-gray-700 leading-relaxed mb-4">Of u nu komt voor een stille herdenking, historisch onderzoek of gewoon om te genieten van de natuurlijke omgeving - begraafplaatsen bieden in elk seizoen een unieke ervaring. Ze herinneren ons aan de cyclus van het leven en bieden troost in de continuïteit van de natuur.</p>
</div>
  `,
  'crematie-versus-begraven-vergelijking': `
    <div class="blog-content space-y-6">
  <p class="text-lg leading-relaxed text-gray-700">De keuze tussen crematie en begraven is een van de meest persoonlijke beslissingen die we kunnen maken. Het gaat niet alleen om praktische overwegingen zoals kosten, maar ook om diepgewortelde overtuigingen, familietradities en persoonlijke voorkeuren. In dit artikel zetten we alle aspecten op een rij om u te helpen bij deze belangrijke keuze.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Kostenvergelijking 2025</h2>
  
  <h3 class="text-xl font-semibold text-gray-900 mb-3">Crematie: De financiële feiten</h3>
  <p class="text-gray-700 leading-relaxed mb-4">In 2025 kost een crematie in Nederland gemiddeld <strong class="font-semibold">€7.000</strong>, waarbij de prijzen variëren tussen €5.500 en €11.000. Deze verschillen worden bepaald door de gekozen diensten en locatie:</p>
  
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Basis crematie:</strong> €5.000 - €6.500</li>
    <li class="mb-1"><strong class="font-semibold">Complete afscheidsdienst:</strong> vanaf €4.650</li>
    <li class="mb-1"><strong class="font-semibold">Technische/stille crematie:</strong> €500 - €1.000</li>
    <li class="mb-1"><strong class="font-semibold">Crematie zonder afscheidsdienst:</strong> vanaf €2.150</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Begraven: De prijsopbouw</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Een begrafenis kost in 2025 gemiddeld <strong class="font-semibold">€10.000</strong>, met een prijsvork tussen €8.500 en €11.500. De hogere kosten komen door:</p>
  
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Grafkosten:</strong> gemiddeld €2.500 (variërend van €800 tot €7.000)</li>
    <li class="mb-1"><strong class="font-semibold">Grafrechten (20 jaar):</strong> gemiddeld €3.600</li>
    <li class="mb-1"><strong class="font-semibold">Dragers:</strong> extra kosten voor 6-8 dragers</li>
    <li class="mb-1"><strong class="font-semibold">Duurdere kist:</strong> vaak eiken of andere luxe uitvoering</li>
  </ul>

  <p class="bg-blue-50 p-4 rounded-lg mb-4"><strong class="font-semibold">Let op:</strong> Weekenduitvaarten kosten €430 extra vanwege toeslagen. De kosten zijn de afgelopen jaren gestegen door inflatie en hogere personeels- en energiekosten.</p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Praktische verschillen</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Tijdsdruk en planning</h3>
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th class="text-left">Aspect</th>
        <th class="text-left">Crematie</th>
        <th class="text-left">Begraven</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong class="font-semibold">Tijdsdruk</strong></td>
        <td>Flexibeler, binnen 5-7 dagen</td>
        <td>Meestal binnen 3-5 dagen</td>
      </tr>
      <tr>
        <td><strong class="font-semibold">Locatiekeuze</strong></td>
        <td>Keuze uit verschillende crematoria</td>
        <td>Gebonden aan begraafplaats</td>
      </tr>
      <tr>
        <td><strong class="font-semibold">Ceremonie</strong></td>
        <td>Vaak in aula crematorium</td>
        <td>Kerk of aula + graveside</td>
      </tr>
    </tbody>
  </table>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Nazorg en bezoek</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Crematie:</strong> As kan mee naar huis, verstrooiing op speciale plek, of bijzetting in urnenmuur/graf</li>
    <li class="mb-1"><strong class="font-semibold">Begraven:</strong> Vaste bezoekplek op begraafplaats, grafonderhoud nodig</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Emotionele en culturele overwegingen</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Voor crematie spreekt:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Geen zorgen over grafonderhoud</li>
    <li class="mb-1">Flexibiliteit in bestemming van de as</li>
    <li class="mb-1">Mogelijkheid tot verdeling as onder nabestaanden</li>
    <li class="mb-1">Vaak als minder belastend ervaren voor nabestaanden</li>
    <li class="mb-1">Past bij moderne, mobiele levensstijl</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Voor begraven spreekt:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Fysieke plek om te bezoeken en te rouwen</li>
    <li class="mb-1">Traditie en familiegeschiedenis</li>
    <li class="mb-1">Religieuze overwegingen</li>
    <li class="mb-1">Gevoel van permanentie</li>
    <li class="mb-1">Natuurlijker proces voor sommigen</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Milieuaspecten</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Crematie en het milieu</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Moderne crematoria werken steeds milieuvriendelijker:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Energieverbruik: circa 180 kWh per crematie</li>
    <li class="mb-1">CO2-uitstoot: ongeveer 400 kg</li>
    <li class="mb-1">Geavanceerde filters voor rookgassen</li>
    <li class="mb-1">Warmteterugwinning wordt steeds vaker toegepast</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Begraven en duurzaamheid</h3>
  <p class="text-gray-700 leading-relaxed mb-4">Natuurlijk afbraakproces, maar niet zonder impact:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Ruimtegebruik op lange termijn</li>
    <li class="mb-1">Onderhoud begraafplaats (maaiwerk, bestrijdingsmiddelen)</li>
    <li class="mb-1">Materiaalgebruik voor grafmonumenten</li>
    <li class="mb-1">Trend: natuurbegraafplaatsen zonder steen, met biologisch afbreekbare kist</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Religieuze en culturele perspectieven</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Christendom</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Katholiek:</strong> Crematie toegestaan sinds 1963, mits niet uit geloofsverloochening</li>
    <li class="mb-1"><strong class="font-semibold">Protestant:</strong> Beide opties algemeen geaccepteerd</li>
    <li class="mb-1"><strong class="font-semibold">Orthodox:</strong> Sterke voorkeur voor begraven</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Andere religies</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Islam:</strong> Alleen begraven, zo snel mogelijk</li>
    <li class="mb-1"><strong class="font-semibold">Jodendom:</strong> Traditioneel alleen begraven</li>
    <li class="mb-1"><strong class="font-semibold">Hindoeïsme:</strong> Sterke voorkeur voor crematie</li>
    <li class="mb-1"><strong class="font-semibold">Boeddhisme:</strong> Beide opties mogelijk</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Trends in Nederland</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">De Nederlandse uitvaartcultuur is sterk in beweging:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Circa 65% kiest voor crematie, 35% voor begraven</li>
    <li class="mb-1">Toename natuurbegraafplaatsen en eco-vriendelijke opties</li>
    <li class="mb-1">Groeiende interesse in alternatieve asbestemmingen</li>
    <li class="mb-1">Personalisering van uitvaarten neemt toe</li>
    <li class="mb-1">Budgetuitvaarten winnen aan populariteit</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Alternatieven en nieuwe ontwikkelingen</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Innovatieve opties</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Resomeren:</strong> Alkalische hydrolyse, milieuvriendelijker alternatief</li>
    <li class="mb-1"><strong class="font-semibold">Cryomeren:</strong> Vriesdrogen, nog niet beschikbaar in Nederland</li>
    <li class="mb-1"><strong class="font-semibold">Boomgraven:</strong> As als voeding voor een boom</li>
    <li class="mb-1"><strong class="font-semibold">Zee-uitvaart:</strong> Verstrooiing of biologisch afbreekbare urn</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Besluitvorming: belangrijke vragen</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">Bij het maken van uw keuze, overweeg:</p>
  <ol class="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong class="font-semibold">Financiën:</strong> Wat past binnen het budget?</li>
    <li class="mb-1"><strong class="font-semibold">Familie:</strong> Wat zijn de tradities en wensen?</li>
    <li class="mb-1"><strong class="font-semibold">Geloof:</strong> Zijn er religieuze voorschriften?</li>
    <li class="mb-1"><strong class="font-semibold">Locatie:</strong> Wil ik een vaste bezoekplek?</li>
    <li class="mb-1"><strong class="font-semibold">Milieu:</strong> Hoe belangrijk is duurzaamheid?</li>
    <li class="mb-1"><strong class="font-semibold">Nazorg:</strong> Wie zorgt voor eventueel grafonderhoud?</li>
  </ol>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Praktische tips</h2>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Vooraf regelen</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Leg uw wensen schriftelijk vast</li>
    <li class="mb-1">Bespreek met familie om verrassingen te voorkomen</li>
    <li class="mb-1">Overweeg een uitvaartverzekering of deposito</li>
    <li class="mb-1">Bezoek informatiebijeenkomsten van uitvaartorganisaties</li>
  </ul>

  <h3 class="text-xl font-semibold text-gray-900 mb-3">Budgettips</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Vergelijk prijzen van verschillende aanbieders</li>
    <li class="mb-1">Overweeg doordeweekse diensten (geen weekendtoeslag)</li>
    <li class="mb-1">Vraag naar pakketprijzen</li>
    <li class="mb-1">Technische crematie als meest budgetvriendelijke optie</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Conclusie</h2>
  
  <p class="text-gray-700 leading-relaxed mb-4">De keuze tussen crematie en begraven is zeer persoonlijk. Crematie biedt financiële voordelen en flexibiliteit, terwijl begraven een traditionele, fysieke gedenkplek biedt. Er is geen 'juiste' keuze - alleen wat voor u en uw naasten het beste voelt.</p>

  <p class="text-gray-700 leading-relaxed mb-4">Neem de tijd om alle aspecten te overwegen. Praat met familie, bezoek eventueel een begraafplaats en crematorium, en laat u goed informeren. Uiteindelijk gaat het om een waardige afscheid dat past bij de overledene en troost biedt aan nabestaanden.</p>

  <p class="text-gray-700 leading-relaxed mb-4">Ongeacht uw keuze, het belangrijkste is dat het afscheid recht doet aan het geleefde leven en ruimte biedt voor rouw en herinnering.</p>
</div>
  `,

  'dierenbegraafplaatsen-nederland-complete-gids': `
<div class="blog-content space-y-6">
  <p class="text-lg leading-relaxed text-gray-700">
    Het verlies van een huisdier is voor veel mensen een ingrijpende gebeurtenis. Steeds meer baasjes kiezen ervoor om hun trouwe metgezel een waardig afscheid te geven op een dierenbegraafplaats. In deze complete gids vertellen we alles over dierenbegraafplaatsen in Nederland: waar u ze kunt vinden, wat de kosten zijn, en welke alternatieven er bestaan.
  </p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Wat is een dierenbegraafplaats?</h2>

  <p class="text-gray-700 leading-relaxed mb-4">
    Een dierenbegraafplaats is een speciaal aangelegde rustplaats waar huisdieren kunnen worden begraven. Net als bij menselijke begraafplaatsen zijn er individuele graven, grafmonumenten en vaak ook de mogelijkheid voor een afscheidsplechtigheid. Dierenbegraafplaatsen bieden een serene omgeving waar baasjes hun overleden huisdier kunnen herdenken en een plek hebben om terug te keren.
  </p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Bekende dierenbegraafplaatsen in Nederland</h2>

  <p class="text-gray-700 leading-relaxed mb-4">Nederland telt tientallen dierenbegraafplaatsen, verspreid over het hele land. Hier zijn enkele bekende locaties:</p>

  <div class="bg-gray-50 rounded-lg p-6 mb-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-3">Dierenbegraafplaats De Wildernis - Amersfoort</h3>
    <p class="text-gray-700 mb-2">Een van de bekendste dierenbegraafplaatsen van Nederland, gelegen in een natuurlijke, bosrijke omgeving bij Amersfoort. De Wildernis biedt zowel traditionele graven als natuurlijke begravingen.</p>
  </div>

  <div class="bg-gray-50 rounded-lg p-6 mb-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-3">Dierenbegraafplaats Houten</h3>
    <p class="text-gray-700 mb-2">Centraal gelegen in de provincie Utrecht, biedt deze begraafplaats een sfeervolle omgeving voor het afscheid van uw huisdier.</p>
  </div>

  <div class="bg-gray-50 rounded-lg p-6 mb-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-3">Dierenbegraafplaats Steenwijk</h3>
    <p class="text-gray-700 mb-2">In het noorden van Overijssel vindt u deze rustgevende dierenbegraafplaats, ideaal voor baasjes uit de regio.</p>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Kosten van een dierenbegrafenis</h2>

  <p class="text-gray-700 leading-relaxed mb-4">De kosten voor het begraven van een huisdier variëren afhankelijk van meerdere factoren:</p>

  <table class="w-full border-collapse border border-gray-200 mb-6">
    <thead>
      <tr class="bg-gray-100">
        <th class="border border-gray-200 p-3 text-left">Type huisdier</th>
        <th class="border border-gray-200 p-3 text-left">Indicatieve kosten</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-gray-200 p-3">Klein huisdier (hamster, vogel, cavia)</td>
        <td class="border border-gray-200 p-3">€50 - €150</td>
      </tr>
      <tr>
        <td class="border border-gray-200 p-3">Middelgroot huisdier (kat, kleine hond)</td>
        <td class="border border-gray-200 p-3">€150 - €350</td>
      </tr>
      <tr>
        <td class="border border-gray-200 p-3">Groot huisdier (grote hond)</td>
        <td class="border border-gray-200 p-3">€300 - €600</td>
      </tr>
      <tr>
        <td class="border border-gray-200 p-3">Zeer groot dier (paard, pony)</td>
        <td class="border border-gray-200 p-3">€500 - €1.500</td>
      </tr>
    </tbody>
  </table>

  <p class="text-gray-700 leading-relaxed mb-4">Hierbij kunnen extra kosten komen voor:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong>Grafmonument of gedenksteen:</strong> €50 - €500</li>
    <li class="mb-1"><strong>Jaarlijks grafonderhoud:</strong> €25 - €75 per jaar</li>
    <li class="mb-1"><strong>Vervoer van het dier:</strong> €50 - €150</li>
    <li class="mb-1"><strong>Afscheidsplechtigheid:</strong> €50 - €200</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Crematie versus begraven</h2>

  <p class="text-gray-700 leading-relaxed mb-4">Naast begraven is crematie een populaire optie. Beide hebben voor- en nadelen:</p>

  <div class="grid md:grid-cols-2 gap-6 mb-6">
    <div class="bg-green-50 rounded-lg p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-3">Voordelen begraven</h3>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>Vaste plek om te herdenken</li>
        <li>Mogelijkheid voor grafmonument</li>
        <li>Natuurlijke terugkeer naar de aarde</li>
        <li>Ritueel en afsluiting voor kinderen</li>
      </ul>
    </div>
    <div class="bg-blue-50 rounded-lg p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-3">Voordelen crematie</h3>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>As meenemen naar huis</li>
        <li>Vaak goedkoper</li>
        <li>Flexibel in herdenken</li>
        <li>Geen lopende kosten</li>
      </ul>
    </div>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Mag ik mijn huisdier thuis begraven?</h2>

  <p class="text-gray-700 leading-relaxed mb-4">
    In Nederland mag u uw huisdier onder bepaalde voorwaarden in uw eigen tuin begraven:
  </p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Het dier mag niet overleden zijn aan een besmettelijke ziekte</li>
    <li class="mb-1">Het graf moet minimaal 50 cm diep zijn</li>
    <li class="mb-1">Controleer altijd de lokale gemeentelijke regels</li>
    <li class="mb-1">Huurders moeten toestemming vragen aan de verhuurder</li>
  </ul>

  <p class="text-gray-700 leading-relaxed mb-4">
    Let op: als u verhuist, kunt u het graf niet meenemen. Een dierenbegraafplaats biedt in dat opzicht meer zekerheid.
  </p>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Welke dieren kunnen begraven worden?</h2>

  <p class="text-gray-700 leading-relaxed mb-4">Op de meeste dierenbegraafplaatsen kunnen vrijwel alle huisdieren worden begraven:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1">Honden en katten</li>
    <li class="mb-1">Konijnen en cavia's</li>
    <li class="mb-1">Vogels (parkieten, papegaaien, kippen)</li>
    <li class="mb-1">Hamsters, muizen en ratten</li>
    <li class="mb-1">Reptielen en amfibieën</li>
    <li class="mb-1">Vissen (met speciale regelingen)</li>
    <li class="mb-1">Paarden en pony's (op sommige locaties)</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Wat te doen als uw huisdier overlijdt?</h2>

  <p class="text-gray-700 leading-relaxed mb-4">Het overlijden van een huisdier komt soms onverwacht. Dit zijn de stappen die u kunt volgen:</p>
  <ol class="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong>Neem contact op met uw dierenarts</strong> - Zij kunnen adviseren en eventueel helpen met euthanasie indien nodig</li>
    <li class="mb-1"><strong>Bewaar het lichaam koel</strong> - In een koele ruimte of gebruik koelelementen</li>
    <li class="mb-1"><strong>Neem contact op met een dierenbegraafplaats of crematorium</strong> - Veel bieden 24-uurs service</li>
    <li class="mb-1"><strong>Maak afspraken over datum en tijd</strong> - Plan de begrafenis of crematie</li>
    <li class="mb-1"><strong>Overweeg een afscheidsplechtigheid</strong> - Vooral fijn voor kinderen</li>
  </ol>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Alternatieven voor de dierenbegraafplaats</h2>

  <p class="text-gray-700 leading-relaxed mb-4">Er zijn verschillende alternatieven als een dierenbegraafplaats niet geschikt is:</p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong>Individuele crematie:</strong> U krijgt de as terug in een urn</li>
    <li class="mb-1"><strong>Collectieve crematie:</strong> Goedkoper, as wordt uitgestrooid</li>
    <li class="mb-1"><strong>Herinneringssieraden:</strong> Kleine hoeveelheid as verwerkt in een sieraad</li>
    <li class="mb-1"><strong>Aquamatie:</strong> Watergebaseerde afbraak, zeer milieuvriendelijk</li>
    <li class="mb-1"><strong>Thuisbegrafenis:</strong> In uw eigen tuin (zie regels hierboven)</li>
  </ul>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Tips voor het kiezen van een dierenbegraafplaats</h2>

  <p class="text-gray-700 leading-relaxed mb-4">Bij het kiezen van een dierenbegraafplaats zijn deze punten belangrijk:</p>
  <ol class="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
    <li class="mb-1"><strong>Locatie:</strong> Kies een plek die goed bereikbaar is voor regelmatig bezoek</li>
    <li class="mb-1"><strong>Sfeer:</strong> Bezoek de begraafplaats vooraf om de sfeer te ervaren</li>
    <li class="mb-1"><strong>Kosten:</strong> Vraag een duidelijk overzicht van alle kosten</li>
    <li class="mb-1"><strong>Onderhoud:</strong> Informeer naar het onderhoud van de graven</li>
    <li class="mb-1"><strong>Grafrechten:</strong> Vraag naar de duur (vaak 10-20 jaar, verlengbaar)</li>
    <li class="mb-1"><strong>Regelgeving:</strong> Welke regels gelden er voor grafmonumenten?</li>
  </ol>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Rouwverwerking na het verlies van een huisdier</h2>

  <p class="text-gray-700 leading-relaxed mb-4">
    Het verlies van een huisdier kan even zwaar zijn als het verlies van een dierbare. Geef uzelf de tijd en ruimte om te rouwen. Een begraafplaats of gedenkplek kan helpen bij dit proces. Praat met anderen die hetzelfde hebben meegemaakt, en schroom niet om professionele hulp te zoeken als u daar behoefte aan heeft.
  </p>

  <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-3">Meer informatie nodig?</h3>
    <p class="text-gray-700">
      Bekijk onze <a href="/info/dierenbegraafplaatsen" class="text-blue-600 hover:text-blue-800 underline">uitgebreide informatiepagina over dierenbegraafplaatsen</a> voor een compleet overzicht van locaties in Nederland, of neem <a href="/contact" class="text-blue-600 hover:text-blue-800 underline">contact met ons op</a> voor persoonlijk advies.
    </p>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Conclusie</h2>

  <p class="text-gray-700 leading-relaxed mb-4">
    Een dierenbegraafplaats biedt een waardige en respectvolle manier om afscheid te nemen van uw huisdier. Of u nu kiest voor begraven of crematie, het belangrijkste is dat u een afscheid kiest dat bij u en uw gezin past. Neem de tijd om verschillende opties te verkennen en kies wat het beste voelt voor u en uw trouwe metgezel.
  </p>
</div>
  `
};

export function getBlogContent(slug: string): string | undefined {
  return blogContent[slug];
}
