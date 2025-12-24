#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { getCemeteryLink, getMunicipalityLink, getTypeLink } from '../lib/blog-data';

// Generate fifth batch of blog articles
const generateBatch5 = () => {
  // Article 16: kinderbegraafplaatsen-gevoelig-onderwerp
  const artikel16 = `
<div class="blog-content space-y-6">
  <p class="text-lg leading-relaxed text-gray-700">
    Het verlies van een kind is een van de diepste verdrietige ervaringen die ouders kunnen meemaken. Kinderbegraafplaatsen bieden een speciale, liefdevolle omgeving waar kleine engeltjes kunnen rusten en waar ouders troost kunnen vinden. Deze gevoelige plekken verdienen onze zorgvuldige aandacht en respect.
  </p>

  <section class="mt-8 space-y-8">
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
        alt="Kinderbegraafplaats met witte engel en zachte kleuren" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">👶 Kinderbegraafplaatsen: een bijzondere zorg</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Kinderbegraafplaatsen zijn speciaal ingerichte delen van begraafplaatsen die ontworpen zijn voor baby's, kinderen en jongeren. Deze plekken onderscheiden zich door hun zachte vormgeving, lieflijke decoraties en de bijzondere aandacht voor het verdriet van ouders en families.
        </p>
        
        <div class="bg-pink-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">Wat maakt kinderbegraafplaatsen bijzonder?</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">🌸</span>
              <span><strong>Zachte sfeer:</strong> Pastelkleuren, speelse elementen en natuurlijke materialen</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">🧸</span>
              <span><strong>Speelgoed en knuffels:</strong> Toegestaan op graven voor emotionele verbinding</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">👼</span>
              <span><strong>Engelfiguren:</strong> Symbolen van bescherming en hemel</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">🌈</span>
              <span><strong>Kleurrijke bloemen:</strong> Speciaal gekozen kindvriendelijke planten</span>
            </li>
            <li class="flex items-start">
              <span class="text-pink-600 mr-2">💕</span>
              <span><strong>Nabijheid:</strong> Ouders en siblings kunnen dichtbij begraven worden</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">👼 Verschillende soorten kindergraven</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Er zijn verschillende opties voor de laatste rustplaats van kinderen, afhankelijk van leeftijd, wensen van de familie en lokale mogelijkheden.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🍼 Baby's en pasgeborenen:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Baby-urngraf:</strong> Voor crematie van zeer jonge kinderen</li>
            <li>• <strong>Kindergraafveld:</strong> Speciale sectie met kleine grafjes</li>
            <li>• <strong>Gemeenschappelijk kindergraf:</strong> Bij meerlingen of premature geboorte</li>
            <li>• <strong>Gedenkplaats:</strong> Voor vroeg verloren zwangerschappen</li>
          </ul>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🧒 Kinderen en tieners:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Individuele kindergraven:</strong> Volwaardige kindergraven</li>
            <li>• <strong>Familiegraf:</strong> Samen met familie</li>
            <li>• <strong>Themegraven:</strong> Met persoonlijke hobby's/interesses</li>
            <li>• <strong>Natuurkindgraf:</strong> In groene, natuurlijke omgeving</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
        alt="Kleurrijke kindergraven met speelgoed en bloemen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🎨 Vormgeving en decoratie</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Kindergraven worden vaak uniek vormgegeven om de persoonlijkheid van het kind te weerspiegelen en troost te bieden aan de familie.
        </p>
        
        <div class="space-y-4">
          <div class="bg-yellow-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🌟 Populaire elementen:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="space-y-1 text-gray-700">
                <li>• <strong>Engelfiguren:</strong> Beschermende symbolen</li>
                <li>• <strong>Dierenfiguren:</strong> Teddyberen, konijntjes, lammetjes</li>
                <li>• <strong>Sterren en manen:</strong> Hemel-thema</li>
                <li>• <strong>Hartjes:</strong> Liefde en verbondenheid</li>
              </ul>
              <ul class="space-y-1 text-gray-700">
                <li>• <strong>Regenbogen:</strong> Hoop en overgang</li>
                <li>• <strong>Vlinders:</strong> Transformatie en vrijheid</li>
                <li>• <strong>Bloemen:</strong> Vergeet-mij-nietjes, roze rozen</li>
                <li>• <strong>Persoonlijke items:</strong> Speelgoed, boeken</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🎈 Seizoensversiering:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• <strong>Lente:</strong> Pastelkleurige bloemen, kuikentjes, paasversiering</li>
              <li>• <strong>Zomer:</strong> Felle kleuren, zonnebloemen, windmolentjes</li>
              <li>• <strong>Herfst:</strong> Herfstkleuren, pompoentjes, bladversiering</li>
              <li>• <strong>Winter:</strong> Kerstversiering, engelen, witte decoraties</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💔 Rouw en verwerking</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Het verlies van een kind brengt een uniek soort verdriet met zich mee. Kinderbegraafplaatsen spelen een belangrijke rol in het rouwproces.
      </p>
      
      <div class="space-y-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">💭 Aspecten van kinderrouw:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Onnatuurlijk gevoel:</strong> Kinderen horen hun ouders niet voor te gaan</li>
            <li>• <strong>Gevoelens van schuld:</strong> "Had ik iets kunnen doen?"</li>
            <li>• <strong>Gemiste toekomst:</strong> Rouw om wat nooit zal zijn</li>
            <li>• <strong>Impact op relaties:</strong> Partners rouwen verschillend</li>
            <li>• <strong>Fysieke reacties:</strong> Intense lichamelijke rouwreacties</li>
          </ul>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🤗 Hoe kinderbegraafplaatsen helpen:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Vaste plek:</strong> Ergens naartoe om het kind te "bezoeken"</li>
            <li>• <strong>Rituelen:</strong> Bloemen brengen, kaarsen aansteken</li>
            <li>• <strong>Verbinding:</strong> Contact met andere rouwende ouders</li>
            <li>• <strong>Herinnering:</strong> Tastbare plek van herinneringen</li>
            <li>• <strong>Seizoensmarkering:</strong> Verjaardagen en gedenkdagen</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
        alt="Ouders bij kindergraf met kaarsen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🌺 Speciale tradities en rituelen</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Rond kindergraven zijn vaak bijzondere tradities ontstaan die troost bieden en herinneringen levend houden.
        </p>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-pink-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🎂 Bijzondere dagen:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• <strong>Verjaardag:</strong> Taart en ballonnen</li>
              <li>• <strong>Sinterklaas:</strong> Cadeautjes voor andere kinderen</li>
              <li>• <strong>Kerst:</strong> Kerstversiering en lichtjes</li>
              <li>• <strong>Moederdag/Vaderdag:</strong> Speciale herdenking</li>
              <li>• <strong>Kinderdagje:</strong> Extra aandacht voor alle kindergraven</li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">💫 Herdenkingsrituelen:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• <strong>Ballonnen oplaten:</strong> Bericht naar de hemel</li>
              <li>• <strong>Brieven schrijven:</strong> Aan het overleden kind</li>
              <li>• <strong>Steentjes bemalen:</strong> Gezamenlijke activiteit</li>
              <li>• <strong>Vlinders vrijlaten:</strong> Symbol van transformatie</li>
              <li>• <strong>Muziek spelen:</strong> Favoriete liedjes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🏥 Perinataal verlies</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Perinataal verlies (rond de geboorte) is een bijzonder gevoelig onderwerp dat speciale aandacht verdient op begraafplaatsen.
      </p>
      
      <div class="space-y-4">
        <div class="bg-purple-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🤱 Soorten perinataal verlies:</h3>
          <ul class="space-y-1 text-gray-700">
            <li>• <strong>Miskraam:</strong> Voor 20-24 weken zwangerschap</li>
            <li>• <strong>Intra-uteriene vruchtdood:</strong> Na 20-24 weken</li>
            <li>• <strong>Neonatale sterfte:</strong> Eerste 28 dagen na geboorte</li>
            <li>• <strong>Zuigelingensterfte:</strong> Eerste levensjaar</li>
          </ul>
        </div>
        
        <div class="bg-orange-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">💐 Bijzondere voorzieningen:</h3>
          <ul class="space-y-1 text-gray-700">
            <li>• <strong>Sterrentuin:</strong> Speciale plek voor vroeg verlies</li>
            <li>• <strong>Gemeenschappelijke urnen:</strong> Voor hele kleine baby's</li>
            <li>• <strong>Gedenkplaatsen:</strong> Ook zonder fysieke resten</li>
            <li>• <strong>Jaarlijkse herdenking:</strong> Gezamenlijke momenten</li>
            <li>• <strong>Counseling:</strong> Professionele ondersteuning</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">👨‍👩‍👧‍👦 Ondersteuning voor families</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Begraafplaatsen en organisaties bieden vaak speciale ondersteuning voor families die een kind hebben verloren.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🤝 Praktische ondersteuning:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Uitvaartbegeleiding voor kinderen</li>
            <li>• Financiële regelingen en fondsen</li>
            <li>• Hulp bij grafkeuze en vormgeving</li>
            <li>• Informatie over rechten en plichten</li>
            <li>• Onderhoud van kindergraven</li>
          </ul>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">💚 Emotionele ondersteuning:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Rouwbegeleiding en therapie</li>
            <li>• Steungroepen voor ouders</li>
            <li>• Broertjes en zusjes programma's</li>
            <li>• Herdenkingsbijeenkomsten</li>
            <li>• Online communities en forums</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
        alt="Begraafplaats medewerker verzorgt kindergraven" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">⚰️ Praktische aspecten</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Er zijn specifieke praktische overwegingen bij kindergraven die verschillen van reguliere begrafenissen.
        </p>
        
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">💰 Kosten en financiering:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• Vaak lagere kosten dan volwassen begrafenissen</li>
              <li>• Speciale fondsen en regelingen beschikbaar</li>
              <li>• Ziekenkostenverzekering dekt soms kosten</li>
              <li>• Gemeente-ondersteuning mogelijk</li>
              <li>• Crowdfunding voor bijzondere wensen</li>
            </ul>
          </div>
          
          <div class="bg-teal-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">📋 Regelgeving:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• Speciale regels voor baby's onder 500 gram</li>
              <li>• Aangifteplicht varieert per gemeente</li>
              <li>• Crematie pas na 36 uur toegestaan</li>
              <li>• Begraven meestal eerder mogelijk</li>
              <li>• Specifieke hygiëne-voorschriften</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🌍 Internationale perspectieven</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Verschillende culturen hebben eigen tradities rondom kindergraven en kinderrouw.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-indigo-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🌏 Culturele verschillen:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• <strong>Japan:</strong> Jizo-standbeelden voor bescherming</li>
            <li>• <strong>Mexico:</strong> Día de los Muertos met extra aandacht voor kinderen</li>
            <li>• <strong>Ierland:</strong> Cillíní - ongewijde grond voor ongedoopte kinderen</li>
            <li>• <strong>China:</strong> Speciale rituelen voor vroeg overleden kinderen</li>
          </ul>
        </div>
        
        <div class="bg-red-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🕊️ Gemeenschappelijke elementen:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Universele behoefte aan rituelen</li>
            <li>• Beschermingssymbolen (engelen, dieren)</li>
            <li>• Speelse en zachte vormgeving</li>
            <li>• Gemeenschapsondersteuning</li>
            <li>• Seizoensgebonden tradities</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-3">🤱 Voor zorgverleners en counselors</h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">Ondersteuning bieden:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Luister zonder oordeel</li>
            <li>• Respecteer alle gevoelens</li>
            <li>• Bied praktische informatie</li>
            <li>• Verwijs door naar specialisten</li>
            <li>• Volg op lange termijn</li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">Wat niet te zeggen:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• "Het was Gods bedoeling"</li>
            <li>• "Je bent nog jong, je krijgt wel andere kinderen"</li>
            <li>• "Het kind had toch problemen gehad"</li>
            <li>• "Je moet nu sterk zijn"</li>
            <li>• "Het leven gaat door"</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">📍 Bekende kinderbegraafplaatsen in Nederland</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Enkele Nederlandse begraafplaatsen zijn bijzonder bekend om hun zorgvuldige omgang met kindergraven.
      </p>
      
      <div class="space-y-3">
        <div class="bg-pink-50 rounded-lg p-3">
          <h4 class="font-medium text-gray-900"><strong>Westerveld Driehuis</strong></h4>
          <p class="text-sm text-gray-700">
            Uitgebreide kinderafdeling met themagraven en jaarlijkse herdenkingen. Speciale voorzieningen voor perinataal verlies.
          </p>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-3">
          <h4 class="font-medium text-gray-900"><strong><a href="${getCemeteryLink('Nieuwe Ooster Amsterdam')}" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a></strong></h4>
          <p class="text-sm text-gray-700">
            Historische kinderafdeling met prachtige monumenten en seizoensversiering door vrijwilligers.
          </p>
        </div>
        
        <div class="bg-green-50 rounded-lg p-3">
          <h4 class="font-medium text-gray-900"><strong>Zorgvlied Amsterdam</strong></h4>
          <p class="text-sm text-gray-700">
            Exclusieve kinderbegraafplaats met hoogwaardige vormgeving en persoonlijke benadering.
          </p>
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-3">
          <h4 class="font-medium text-gray-900"><strong><a href="${getTypeLink('natuurbegraafplaats')}" class="text-blue-600 hover:text-blue-800 underline">Natuurbegraafplaatsen</a></strong></h4>
          <p class="text-sm text-gray-700">
            Verschillende natuurbegraafplaatsen hebben speciale kinderafdelingen in groene, troostvolle omgevingen.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 p-6 bg-gray-100 rounded-lg">
      <h2 class="text-xl font-bold text-gray-900 mb-3">Kleine engeltjes, grote liefde</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Kinderbegraafplaatsen herinneren ons aan de kostbare, breekbare aard van het leven. Ze zijn plekken waar liefde, verdriet en hoop samenkomen. Voor ouders die een kind hebben verloren, bieden deze bijzondere plekken troost, verbinding en een tastbare plek om herinneringen te koesteren.
      </p>
      <p class="text-gray-700">
        Als u ondersteuning zoekt of meer informatie wilt over kinderbegraafplaatsen in uw buurt, gebruik dan onze <a href="/" class="text-blue-600 hover:text-blue-800 underline">zoekfunctie</a> of neem contact op met een lokale uitvaartondernemer. U bent niet alleen in uw verdriet.
      </p>
    </div>
  </section>
</div>
`;

  // Article 17: oorlogsgraven-nederland-geschiedenis
  const artikel17 = `
<div class="blog-content space-y-6">
  <p class="text-lg leading-relaxed text-gray-700">
    Nederland herbergt duizenden oorlogsgraven die getuigen van donkere perioden in onze geschiedenis. Van de Eerste Wereldoorlog tot hedendaagse conflicten - deze graven vertellen verhalen van moed, opoffering en de hoge prijs van vrijheid. Een respectvolle blik op oorlogsgraven en hun betekenis.
  </p>

  <section class="mt-8 space-y-8">
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
        alt="Rijen witte oorlogsgraven met kruisen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">⚔️ Oorlogsgraven in Nederland: een overzicht</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Nederland telt meer dan 100.000 oorlogsgraven, verspreid over honderden begraafplaatsen. Deze graven herbergen Nederlandse militairen, geallieerde bevrijders, burgerslachtoffers en soms ook Duitse soldaten. Elk graf vertelt een verhaal van een leven dat te vroeg eindigde.
        </p>
        
        <div class="bg-red-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">Soorten oorlogsgraven in Nederland:</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-red-600 mr-2">🇳🇱</span>
              <span><strong>Nederlandse militairen:</strong> Van 1940-1945 en Indië</span>
            </li>
            <li class="flex items-start">
              <span class="text-red-600 mr-2">🇬🇧</span>
              <span><strong>Geallieerde soldaten:</strong> Britse, Canadese, Amerikaanse bevrijders</span>
            </li>
            <li class="flex items-start">
              <span class="text-red-600 mr-2">👥</span>
              <span><strong>Burgerslachtoffers:</strong> Verzetsstrijders, bombardementsslachtoffers</span>
            </li>
            <li class="flex items-start">
              <span class="text-red-600 mr-2">🕊️</span>
              <span><strong>Holocaust-slachtoffers:</strong> Joodse slachtoffers en andere vervolgden</span>
            </li>
            <li class="flex items-start">
              <span class="text-red-600 mr-2">🇩🇪</span>
              <span><strong>Duitse soldaten:</strong> Ook zij krijgen eerbiedige rust</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🏛️ Belangrijke oorlogsbegraafplaatsen</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Enkele begraafplaatsen in Nederland zijn bijzonder bekend om hun oorlogsgraven en hebben nationale betekenis gekregen.
      </p>
      
      <div class="space-y-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🌹 Loenen (Apeldoorn) - Nationale Begraafplaats</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-700 mb-2">De enige officiële nationale begraafplaats van Nederland.</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• 3.900 graven van WOII-slachtoffers</li>
                <li>• Nederlandse militairen en burgers</li>
                <li>• Verzetsstrijders en oorlogsslachtoffers</li>
                <li>• Jaarlijkse nationale herdenking</li>
              </ul>
            </div>
            <div>
              <p class="text-gray-700 mb-2">Bijzondere kenmerken:</p>
              <ul class="space-y-1 text-sm text-gray-700">
                <li>• Symmetrische aanleg</li>
                <li>• Witte kruisen en Davidsterren</li>
                <li>• Eeuwige vlam</li>
                <li>• Gedenkzuil met namen</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🇬🇧 Oosterbeek - Airborne Cemetery</h3>
          <p class="text-gray-700 mb-2">Herdenkt de Slag om Arnhem (Operation Market Garden).</p>
          <ul class="space-y-1 text-gray-700">
            <li>• 1.759 geallieerde graven</li>
            <li>• Vooral Britse en Poolse parachutisten</li>
            <li>• "Their name liveth for evermore"</li>
            <li>• Jaarlijkse Airborne herdenking</li>
          </ul>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🇨🇦 Groesbeek - Canadian War Cemetery</h3>
          <p class="text-gray-700 mb-2">Grootste geallieerde oorlogsbegraafplaats in Nederland.</p>
          <ul class="space-y-1 text-gray-700">
            <li>• 2.619 graven van Canadese soldaten</li>
            <li>• Ook Britse en andere geallieerden</li>
            <li>• Slachtoffers van Reichswald-offensief</li>
            <li>• Prachtige heuveltoplocatie</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
        alt="Monument met naam van gevallenen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">📅 Tijdlijn van oorlogsgraven</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          De oorlogsgraven in Nederland weerspiegelen verschillende conflicten uit de 19e en 20e eeuw.
        </p>
        
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">⚔️ Chronologisch overzicht:</h3>
            <div class="space-y-3">
              <div class="border-l-4 border-red-500 pl-3">
                <h4 class="font-medium text-gray-900">1914-1918: Eerste Wereldoorlog</h4>
                <p class="text-sm text-gray-700">Nederland neutraal, maar wel slachtoffers aan grenzen en op zee. Vliegtuigcrashes en verdwaalde granaten.</p>
              </div>
              
              <div class="border-l-4 border-blue-500 pl-3">
                <h4 class="font-medium text-gray-900">1940-1945: Tweede Wereldoorlog</h4>
                <p class="text-sm text-gray-700">Grootste periode: mei 1940 (Duitse inval), Hongerwinter, bevrijding 1944-1945. Duizenden militaire en civiele slachtoffers.</p>
              </div>
              
              <div class="border-l-4 border-orange-500 pl-3">
                <h4 class="font-medium text-gray-900">1945-1949: Politionele Acties</h4>
                <p class="text-sm text-gray-700">Nederlandse soldaten in voormalig Nederlands-Indië. Veel graven in Indonesië, herbegravingen in Nederland.</p>
              </div>
              
              <div class="border-l-4 border-green-500 pl-3">
                <h4 class="font-medium text-gray-900">1950-heden: VN-missies</h4>
                <p class="text-sm text-gray-700">Korea, Libanon, Bosnië, Afghanistan. Nederlandse vredessoldaten wereldwijd omgekomen.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">✝️ Symboliek en vormgeving</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Oorlogsgraven hebben vaak specifieke symbolen en vormgeving die hun bijzondere status weerspiegelen.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white border rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🏅 Nederlandse militaire graven:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Kruis:</strong> Christelijke Nederlandse soldaten</li>
            <li>• <strong>Davidster:</strong> Joodse Nederlandse soldaten</li>
            <li>• <strong>Militaire insignes:</strong> Rang en eenheid</li>
            <li>• <strong>Nederlandse leeuw:</strong> Nationale symbolen</li>
            <li>• <strong>Rode papaver:</strong> Herinnering aan oorlogsslachtoffers</li>
          </ul>
        </div>
        
        <div class="bg-white border rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🌍 Geallieerde graven:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Portland steen:</strong> Britse Commonwealth graven</li>
            <li>• <strong>Esdoornblad:</strong> Canadese soldaten</li>
            <li>• <strong>Regimental badges:</strong> Militaire eenheden</li>
            <li>• <strong>"Known unto God":</strong> Onbekende soldaten</li>
            <li>• <strong>Persoonlijke inscripties:</strong> Familie-boodschappen</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 class="font-semibold text-gray-900 mb-2">📜 Veelvoorkomende inscripties:</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• "Hier rust een Nederlandse soldaat"</li>
            <li>• "Voor Vaderland en Vrijheid"</li>
            <li>• "In de strijd voor Nederland gevallen"</li>
            <li>• "Their name liveth for evermore"</li>
          </ul>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• "Greater love hath no man"</li>
            <li>• "At the going down of the sun"</li>
            <li>• "Lest we forget"</li>
            <li>• "Pro Patria" (Voor het Vaderland)</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
        alt="Herdenking bij oorlogsgraven met klaprozen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🌺 Herdenking en tradities</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Oorlogsgraven zijn plaatsen van nationale herdenking met vaste tradities en ceremonies.
        </p>
        
        <div class="space-y-4">
          <div class="bg-red-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🕯️ Belangrijke herdenkingen:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="space-y-1 text-gray-700">
                <li>• <strong>4 mei:</strong> Nationale Dodenherdenking</li>
                <li>• <strong>5 mei:</strong> Bevrijdingsdag</li>
                <li>• <strong>Laatste zaterdag september:</strong> Airborne herdenking</li>
                <li>• <strong>11 november:</strong> Armistice Day (WOI)</li>
              </ul>
              <ul class="space-y-1 text-gray-700">
                <li>• <strong>15 augustus:</strong> Indië-herdenking</li>
                <li>• <strong>29 juni:</strong> Veteranendag</li>
                <li>• <strong>27 januari:</strong> Holocaust Remembrance Day</li>
                <li>• <strong>Diverse data:</strong> Lokale bevrijdingsdagen</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🎖️ Traditonele elementen:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• <strong>Taptoe:</strong> Last Post trompetsignaal</li>
              <li>• <strong>Twee minuten stilte:</strong> Om 20:00 op 4 mei</li>
              <li>• <strong>Kransen leggen:</strong> Door officials en families</li>
              <li>• <strong>Militaire erewacht:</strong> Bij belangrijke ceremonies</li>
              <li>• <strong>Vlaggen halfstok:</strong> Teken van rouw</li>
              <li>• <strong>Klaprozen:</strong> Symbool van herinnering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">👨‍👩‍👧‍👦 Persoonlijke verhalen</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Achter elk oorlogsgraf schuilt een persoonlijk verhaal van moed, opoffering en gemis.
      </p>
      
      <div class="space-y-4">
        <div class="bg-purple-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">💔 Soorten verhalen:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Jonge soldaten:</strong> Vaak 18-25 jaar, net begonnen aan hun leven</li>
            <li>• <strong>Familievaders:</strong> Achtergelaten weduwen en wezen</li>
            <li>• <strong>Vrijwilligers:</strong> Die zich aansloten bij het verzet</li>
            <li>• <strong>Bevrijders:</strong> Uit verre landen die voor onze vrijheid kwamen</li>
            <li>• <strong>Burgers:</strong> Willekeurige slachtoffers van oorlogsgeweld</li>
          </ul>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">📖 Documentatie en onderzoek:</h3>
          <ul class="space-y-1 text-gray-700">
            <li>• War Graves Commission databases</li>
            <li>• Nederlandse Oorlogsgravenstichting</li>
            <li>• NIOD Instituut voor Oorlogs-, Holocaust- en Genocidestudies</li>
            <li>• Lokale historische verenigingen</li>
            <li>• Adoptie-programma's voor graven</li>
            <li>• DNA-onderzoek voor identificatie</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🏫 Educatieve betekenis</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Oorlogsgraven hebben grote educatieve waarde voor het onderwijzen van jongeren over oorlog en vrede.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-orange-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">📚 Educatieve programma's:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Schoolbezoeken aan oorlogsbegraafplaatsen</li>
            <li>• Adopt-a-grave projecten</li>
            <li>• Historisch onderzoek door scholieren</li>
            <li>• Interviews met veteranen</li>
            <li>• Creatieve projecten (gedichten, kunst)</li>
            <li>• Internationale uitwisselingen</li>
          </ul>
        </div>
        
        <div class="bg-teal-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🎯 Leerdoelen:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Geschiedenis concret maken</li>
            <li>• Empathie ontwikkelen</li>
            <li>• Waarden van vrijheid beseffen</li>
            <li>• Gevolgen van oorlog tonen</li>
            <li>• Tolerantie en vrede bevorderen</li>
            <li>• Kritisch denken stimuleren</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
        alt="Onderhoud van oorlogsgraven door vrijwilligers" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🔧 Onderhoud en beheer</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Het onderhoud van oorlogsgraven wordt uitgevoerd door verschillende organisaties met grote toewijding.
        </p>
        
        <div class="space-y-4">
          <div class="bg-indigo-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🏛️ Verantwoordelijke organisaties:</h3>
            <ul class="space-y-2 text-gray-700">
              <li>• <strong>Nederlandse Oorlogsgravenstichting:</strong> Nederlandse oorlogsgraven</li>
              <li>• <strong>Commonwealth War Graves Commission:</strong> Britse en Commonwealth graven</li>
              <li>• <strong>American Battle Monuments Commission:</strong> Amerikaanse graven</li>
              <li>• <strong>Volksbund Deutsche Kriegsgräberfürsorge:</strong> Duitse graven</li>
              <li>• <strong>Lokale gemeenten:</strong> Lokaal beheer en coördinatie</li>
            </ul>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🌱 Onderhoudswerkzaamheden:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Grasstenen schoonmaken</li>
                <li>• Tuinonderhoud en beeplanting</li>
                <li>• Herstellen van beschadigingen</li>
                <li>• Vervanging van vervallen delen</li>
              </ul>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li>• Seizoensgebonden decoratie</li>
                <li>• Informatiebordje onderhoud</li>
                <li>• Pad- en toegankelijkheidsverbetering</li>
                <li>• Documentatie bijhouden</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🌐 Internationale context</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Nederlandse oorlogsgraven maken deel uit van een wereldwijd netwerk van oorlogsbegraafplaatsen.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-red-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🌍 Nederlandse graven wereldwijd:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• <strong>Indonesië:</strong> Duizenden graven uit de Politionele Acties</li>
            <li>• <strong>Duitsland:</strong> Nederlandse krijgsgevangenen</li>
            <li>• <strong>Frankrijk:</strong> Verzetsstrijders en dwangarbeiders</li>
            <li>• <strong>Polen:</strong> Holocaust-slachtoffers</li>
            <li>• <strong>Japan:</strong> Krijgsgevangenen uit Azië</li>
          </ul>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🤝 Internationale samenwerking:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Verdragen over oorlogsgravenverzorging</li>
            <li>• Uitwisseling van informatie</li>
            <li>• Gezamenlijke herdenkingen</li>
            <li>• Historisch onderzoek</li>
            <li>• Onderhoud van graven in het buitenland</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-3">🚶‍♂️ Bezoekerstips</h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">Respectvol bezoek:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Wees stil en respectvol</li>
            <li>• Geen picknicks of luidruchtige activiteiten</li>
            <li>• Respecteer ceremoniëen en herdenkingen</li>
            <li>• Laat geen afval achter</li>
            <li>• Vraag toestemming voor groepsfoto's</li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">Praktische informatie:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Check openingstijden vooraf</li>
            <li>• Draag geschikt schoeisel</li>
            <li>• Breng eventueel bloemen mee</li>
            <li>• Gebruik apps voor informatie</li>
            <li>• Overweeg een rondleiding</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">📍 Belangrijke locaties per provincie</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Een overzicht van de belangrijkste oorlogsbegraafplaatsen per Nederlandse provincie.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <div class="bg-orange-50 rounded-lg p-3">
            <h4 class="font-medium text-gray-900"><strong>Noord-Holland:</strong></h4>
            <p class="text-sm text-gray-700"><a href="${getCemeteryLink('Nieuwe Ooster Amsterdam')}" class="text-blue-600 hover:text-blue-800 underline">Nieuwe Ooster Amsterdam</a> - Verzetsstrijders en oorlogsslachtoffers</p>
          </div>
          
          <div class="bg-green-50 rounded-lg p-3">
            <h4 class="font-medium text-gray-900"><strong>Gelderland:</strong></h4>
            <p class="text-sm text-gray-700">Loenen (Nationale Begraafplaats), Oosterbeek (Airborne Cemetery)</p>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-3">
            <h4 class="font-medium text-gray-900"><strong>Limburg:</strong></h4>
            <p class="text-sm text-gray-700">Groesbeek (Canadian War Cemetery), Margraten (American Cemetery)</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="bg-purple-50 rounded-lg p-3">
            <h4 class="font-medium text-gray-900"><strong>Zuid-Holland:</strong></h4>
            <p class="text-sm text-gray-700">Westduin (Canadees), Ysselsteyn (Duits), diverse lokale begraafplaatsen</p>
          </div>
          
          <div class="bg-pink-50 rounded-lg p-3">
            <h4 class="font-medium text-gray-900"><strong>Noord-Brabant:</strong></h4>
            <p class="text-sm text-gray-700">Uden (Pools), <a href="${getMunicipalityLink('Bergen op Zoom')}" class="text-blue-600 hover:text-blue-800 underline">Bergen op Zoom</a> (Geallieerd)</p>
          </div>
          
          <div class="bg-yellow-50 rounded-lg p-3">
            <h4 class="font-medium text-gray-900"><strong>Overige provincies:</strong></h4>
            <p class="text-sm text-gray-700">Elke provincie heeft lokale oorlogsgraven van historische betekenis</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 p-6 bg-gray-100 rounded-lg">
      <h2 class="text-xl font-bold text-gray-900 mb-3">"Lest we forget"</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Oorlogsgraven herinneren ons aan de ultieme prijs van vrijheid en vrede. Ze zijn stille getuigen van moed, opoffering en menselijk leed. Door deze graven te bezoeken, onderhouden en te herdenken, houden we de herinnering levend aan hen die hun leven gaven voor een betere wereld.
      </p>
      <p class="text-gray-700">
        Bezoek een <a href="/" class="text-blue-600 hover:text-blue-800 underline">oorlogsbegraafplaats in uw buurt</a> en sta stil bij de verhalen van moed en opoffering. Voor meer informatie over oorlogsgraven en herdenkingen, raadpleeg de Nederlandse Oorlogsgravenstichting of lokale historische verenigingen.
      </p>
    </div>
  </section>
</div>
`;

  // Article 18: digitaal-herdenken
  const artikel18 = `
<div class="blog-content space-y-6">
  <p class="text-lg leading-relaxed text-gray-700">
    De digitale revolutie heeft ook de manier waarop we overledenen herdenken fundamenteel veranderd. Van online condoleanceregisters tot virtuele begraafplaatsen - digitaal herdenken biedt nieuwe mogelijkheden om herinneringen levend te houden en afscheid te nemen. Een verkenning van deze moderne vorm van rouw en herinnering.
  </p>

  <section class="mt-8 space-y-8">
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
        alt="Smartphone met digitale herdenking app en kaarsen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">💻 Digitaal herdenken: een nieuwe realiteit</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Digitaal herdenken omvat alle digitale manieren waarop we overledenen gedenken en eren. Dit kan variëren van eenvoudige online rouwregisters tot geavanceerde VR-memorialen. Deze vorm van herdenken wordt steeds populairder, vooral sinds de COVID-19 pandemie veel fysieke bijeenkomsten beperkte.
        </p>
        
        <div class="bg-blue-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">Waarom digitaal herdenken groeit:</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">🌍</span>
              <span><strong>Wereldwijde bereikbaarheid:</strong> Familie en vrienden overal ter wereld kunnen deelnemen</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">⏰</span>
              <span><strong>24/7 toegankelijk:</strong> Geen beperking van openingstijden of locatie</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">💰</span>
              <span><strong>Kosteneffectief:</strong> Vaak goedkoper dan traditionele methoden</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">📱</span>
              <span><strong>Interactief:</strong> Foto's, video's, berichten delen</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-600 mr-2">♻️</span>
              <span><strong>Duurzaam:</strong> Milieuvriendelijk alternatief</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">📱 Soorten digitaal herdenken</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Er zijn vele vormen van digitaal herdenken, elk met eigen kenmerken en mogelijkheden.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🌐 Online memorialen:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Herdenkingswebsites:</strong> Persoonlijke pagina's met levensverhaal</li>
            <li>• <strong>Virtuele begraafplaatsen:</strong> 3D-omgevingen voor herdenking</li>
            <li>• <strong>QR-codes op grafstenen:</strong> Link naar digitale content</li>
            <li>• <strong>Online condoleanceregisters:</strong> Digitale rouwboeken</li>
            <li>• <strong>Memorial apps:</strong> Mobiele herdenkingsapplicaties</li>
          </ul>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">📺 Multimedia memorialen:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Video-tributes:</strong> Filmische herdenkingen</li>
            <li>• <strong>Photo slideshow:</strong> Digitale fotoboeken</li>
            <li>• <strong>Audio-memorialen:</strong> Gesproken herinneringen</li>
            <li>• <strong>360° tours:</strong> Virtuele bezoeken aan speciale plekken</li>
            <li>• <strong>Hologrammen:</strong> 3D-projecties van overledenen</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 class="font-semibold text-gray-900 mb-2">🤖 Geavanceerde technologieën:</h3>
        <ul class="space-y-1 text-gray-700">
          <li>• <strong>AI-chatbots:</strong> "Conversaties" met digitale versies van overledenen</li>
          <li>• <strong>Virtual Reality:</strong> Immersieve herdenkingservaringen</li>
          <li>• <strong>Blockchain:</strong> Permanente, onveranderlijke herinneringen</li>
          <li>• <strong>DNA-art:</strong> Kunstwerken gebaseerd op genetisch materiaal</li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020" 
        alt="Familie kijkt naar online herdenking op laptop" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🎭 Sociale media en herdenking</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Sociale media platforms spelen een steeds belangrijkere rol in hoe we omgaan met verlies en herdenking.
        </p>
        
        <div class="space-y-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">📘 Facebook Memorial:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <p class="text-gray-700 mb-2">Facebook biedt speciale memorial accounts:</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Account wordt "memorialized"</li>
                  <li>• Familie kan herinneringen toevoegen</li>
                  <li>• Verjaardagsherinneringen</li>
                  <li>• Legacy contact functie</li>
                </ul>
              </div>
              <div>
                <p class="text-gray-700 mb-2">Functies:</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Vrienden kunnen berichten plaatsen</li>
                  <li>• Foto's en video's delen</li>
                  <li>• Speciale "Remembering" label</li>
                  <li>• Privacy instellingen beheren</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-pink-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">📱 Andere platforms:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• <strong>Instagram:</strong> Memorial posts en verhalen</li>
              <li>• <strong>Twitter:</strong> Hashtag-campagnes ter herdenking</li>
              <li>• <strong>YouTube:</strong> Memorial video's en playlists</li>
              <li>• <strong>LinkedIn:</strong> Professionele herdenkingen</li>
              <li>• <strong>TikTok:</strong> Creatieve memorial content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💐 Online uitvaarten en diensten</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        De COVID-19 pandemie heeft online uitvaarten en herdenkingsdiensten een enorme boost gegeven.
      </p>
      
      <div class="space-y-4">
        <div class="bg-red-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">📹 Live streaming uitvaarten:</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <ul class="space-y-1 text-gray-700">
              <li>• HD video-uitzendingen van diensten</li>
              <li>• Meerdere camera-hoeken</li>
              <li>• Professionele audio-kwaliteit</li>
              <li>• Opnames voor later bekijken</li>
            </ul>
            <ul class="space-y-1 text-gray-700">
              <li>• Chat functie voor condoleances</li>
              <li>• Privé toegangscodes</li>
              <li>• Mobiele app ondersteuning</li>
              <li>• Internationale toegankelijkheid</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-orange-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🌐 Volledig virtuele diensten:</h3>
          <ul class="space-y-1 text-gray-700">
            <li>• VR-kapellen en ceremoniële ruimtes</li>
            <li>• Avatars van deelnemers</li>
            <li>• Digitale bloemencorso's</li>
            <li>• Interactieve condoleances</li>
            <li>• Mondiale deelname mogelijk</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipO7IKBfJiP_vH2sRXZQa7N0SJ7lGqBfHlrZsE8w=s1360-w1360-h1020" 
        alt="QR code op moderne grafsteen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🏛️ Traditionele begraafplaatsen gaan digitaal</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Zelfs traditionele begraafplaatsen omarmen digitale technologieën om bezoekerservaringen te verbeteren.
        </p>
        
        <div class="space-y-4">
          <div class="bg-teal-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">📱 QR-codes op grafstenen:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <p class="text-gray-700 mb-2">Mogelijkheden:</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Link naar levensverhaal</li>
                  <li>• Foto- en videogalerijen</li>
                  <li>• Audio-boodschappen</li>
                  <li>• Familiegeschiedenis</li>
                </ul>
              </div>
              <div>
                <p class="text-gray-700 mb-2">Voordelen:</p>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Onbeperkte ruimte voor informatie</li>
                  <li>• Regelmatig bij te werken</li>
                  <li>• Meertalige content</li>
                  <li>• Interactieve elementen</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-indigo-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🗺️ Digitale begraafplaats apps:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• GPS-navigatie naar graven</li>
              <li>• Zoekfunctie voor overledenen</li>
              <li>• Historische informatie</li>
              <li>• Audio-tours en rondleidingen</li>
              <li>• Digitale gastenboeken</li>
              <li>• Onderhoudsmeldingen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💭 Psychologische aspecten</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Digitaal herdenken heeft unieke psychologische effecten op het rouwproces en de verwerking van verlies.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">✅ Positieve effecten:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Toegankelijkheid:</strong> Altijd en overal beschikbaar</li>
            <li>• <strong>Gemeenschap:</strong> Verbinding met andere rouwenden</li>
            <li>• <strong>Expressie:</strong> Creatieve uitingen van verdriet</li>
            <li>• <strong>Continuïteit:</strong> Herinneringen blijven levend</li>
            <li>• <strong>Controle:</strong> Zelf bepalen hoe te herdenken</li>
          </ul>
        </div>
        
        <div class="bg-red-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">⚠️ Mogelijke risico's:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>Vastzitten in rouw:</strong> Moeilijk loslaten</li>
            <li>• <strong>Privacyzorgen:</strong> Gevoelige informatie online</li>
            <li>• <strong>Technische problemen:</strong> Verlies van data</li>
            <li>• <strong>Oppervlakkigheid:</strong> Minder diepgaande verwerking</li>
            <li>• <strong>Sociale druk:</strong> Verwachtingen over online rouw</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🔐 Privacy en beveiliging</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Digitaal herdenken brengt belangrijke privacy- en beveiligingsoverwegingen met zich mee.
      </p>
      
      <div class="space-y-4">
        <div class="bg-yellow-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🛡️ Beveiligingsaspecten:</h3>
          <ul class="space-y-1 text-gray-700">
            <li>• <strong>Data-eigendom:</strong> Wie beheert de accounts na overlijden?</li>
            <li>• <strong>Wachtwoordbeheer:</strong> Toegang voor nabestaanden</li>
            <li>• <strong>Back-ups:</strong> Voorkomen van dataverlies</li>
            <li>• <strong>Hackerig:</strong> Bescherming tegen misbruik</li>
            <li>• <strong>Platformstabiliteit:</strong> Wat als de service stopt?</li>
          </ul>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">👁️ Privacy-overwegingen:</h3>
          <ul class="space-y-1 text-gray-700">
            <li>• Wie mag toegang tot herdenkingscontent?</li>
            <li>• Hoe persoonlijke informatie beschermen?</li>
            <li>• Kinderen en toestemming voor online aanwezigheid</li>
            <li>• Recht om vergeten te worden vs. eeuwige herinnering</li>
            <li>• Commercieel gebruik van rouwdata</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src="https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020" 
        alt="Generaties samen bekijken digitale herinneringen" 
        class="w-full h-64 object-cover"
        loading="lazy"
      />
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">👨‍👩‍👧‍👦 Generatieverschillen</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Verschillende generaties hebben verschillende relaties met digitaal herdenken.
        </p>
        
        <div class="space-y-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">📱 Digitale generaties:</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium text-gray-900 mb-1">Jongeren (Gen Z, Millennials):</h4>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Natuurlijke adoptie van digitale tools</li>
                  <li>• Sociale media als eerste reactie</li>
                  <li>• Creatieve en visuele uitingen</li>
                  <li>• Globale gemeenschappen</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-1">Ouderen (Gen X, Boomers):</h4>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li>• Voorkeur voor traditionele methoden</li>
                  <li>• Geleidelijke adoptie tijdens pandemie</li>
                  <li>• Waardering voor permanentie</li>
                  <li>• Familiegerichte benaderingen</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">🤝 Bruggen slaan:</h3>
            <ul class="space-y-1 text-gray-700">
              <li>• Hybrid benaderingen (digitaal + traditioneel)</li>
              <li>• Intergenerationele digitale geletterdheid</li>
              <li>• Respecteren van verschillende voorkeuren</li>
              <li>• Familie-platforms die alle leeftijden bedienen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💼 Commerciële aspecten</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Digitaal herdenken heeft een groeiende markt gecreëerd met verschillende businessmodellen.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-green-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">💰 Businessmodellen:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• <strong>Freemium:</strong> Basis gratis, premium betaald</li>
            <li>• <strong>Abonnement:</strong> Maandelijkse/jaarlijkse fees</li>
            <li>• <strong>Eenmalige betaling:</strong> Voor permanente memorialen</li>
            <li>• <strong>Advertenties:</strong> Gesponsorde content</li>
            <li>• <strong>Partnerships:</strong> Met uitvaartondernemers</li>
          </ul>
        </div>
        
        <div class="bg-teal-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🏢 Marktspelers:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Grote techbedrijven (Facebook, Google)</li>
            <li>• Gespecialiseerde memorial platforms</li>
            <li>• Uitvaartverzorgers met digitale diensten</li>
            <li>• VR/AR technologiebedrijven</li>
            <li>• Blockchain/crypto memorial services</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🔮 Toekomst van digitaal herdenken</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Technologische ontwikkelingen zullen digitaal herdenken de komende jaren verder transformeren.
      </p>
      
      <div class="space-y-4">
        <div class="bg-purple-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">🚀 Opkomende technologieën:</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• <strong>AI-avatars:</strong> Realistische digitale versies van overledenen</li>
            <li>• <strong>Metaverse memorialen:</strong> Virtuele werelden voor herdenking</li>
            <li>• <strong>Biometrische bewaring:</strong> DNA, vingerafdrukken, stemmen</li>
            <li>• <strong>Neuro-interfaces:</strong> Directe hersensignaal-opnames</li>
            <li>• <strong>Quantum storage:</strong> Ultralange termijn dataopslag</li>
          </ul>
        </div>
        
        <div class="bg-cyan-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">📈 Verwachte trends:</h3>
          <ul class="space-y-1 text-gray-700">
            <li>• Meer integratie met fysieke begraafplaatsen</li>
            <li>• AI-gedreven personalisatie</li>
            <li>• Cross-platform synchronisatie</li>
            <li>• Verbeterde privacy-controles</li>
            <li>• Immersievere VR/AR ervaringen</li>
            <li>• Blockchain-gebaseerde eeuwige opslag</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-3">💡 Praktische tips voor digitaal herdenken</h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">Aan de slag:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Start eenvoudig met een online memorial</li>
            <li>• Verzamel foto's en video's</li>
            <li>• Vraag familie om bijdragen</li>
            <li>• Kies een betrouwbaar platform</li>
            <li>• Stel privacy-instellingen goed in</li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">Voor de toekomst:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Maak regelmatig back-ups</li>
            <li>• Documenteer wachtwoorden veilig</li>
            <li>• Betrek meerdere generaties</li>
            <li>• Overweeg juridische aspecten</li>
            <li>• Blijf geïnformeerd over nieuwe opties</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 Juridische aspecten</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Digitaal herdenken brengt nieuwe juridische vragen met zich mee die nog in ontwikkeling zijn.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-red-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">⚖️ Juridische vraagstukken:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Eigendomsrechten van digitale nalatenschap</li>
            <li>• Toestemming voor postume representatie</li>
            <li>• Internationale jurisdictie-verschillen</li>
            <li>• Minderjarigen en digitale aanwezigheid</li>
            <li>• Commercieel gebruik van memorial content</li>
          </ul>
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">📝 Voorzorgsmaatregelen:</h3>
          <ul class="space-y-1 text-gray-700 text-sm">
            <li>• Digitale testament opstellen</li>
            <li>• Legacy contact aanwijzen</li>
            <li>• Privacy-voorkeuren documenteren</li>
            <li>• Terms of service begrijpen</li>
            <li>• Lokale wetgeving raadplegen</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="mt-8 p-6 bg-gray-100 rounded-lg">
      <h2 class="text-xl font-bold text-gray-900 mb-3">Digitale eeuwigheid</h2>
      <p class="text-gray-700 leading-relaxed mb-4">
        Digitaal herdenken opent nieuwe dimensies in hoe we omgaan met dood, rouw en herinnering. Het biedt ongekende mogelijkheden voor verbinding, creativiteit en het levend houden van herinneringen. Tegelijkertijd brengt het nieuwe uitdagingen met zich mee op het gebied van privacy, authenticiteit en psychologische gezondheid.
      </p>
      <p class="text-gray-700">
        Of u nu kiest voor traditionele methoden of digitale innovaties - het belangrijkste is dat de vorm van herdenken past bij uw waarden en die van uw dierbaren. Voor meer informatie over <a href="/" class="text-blue-600 hover:text-blue-800 underline">traditionele begraafplaatsen</a> en moderne herdenkingsopties, verken onze database van begraafplaatsen in Nederland.
      </p>
    </div>
  </section>
</div>
`;

  // Write files
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  fs.writeFileSync(path.join(contentDir, 'kinderbegraafplaatsen-gevoelig-onderwerp.html'), artikel16.trim());
  fs.writeFileSync(path.join(contentDir, 'oorlogsgraven-nederland-geschiedenis.html'), artikel17.trim());
  fs.writeFileSync(path.join(contentDir, 'digitaal-herdenken.html'), artikel18.trim());

  console.log('✅ Generated content for: kinderbegraafplaatsen-gevoelig-onderwerp');
  console.log('✅ Generated content for: oorlogsgraven-nederland-geschiedenis');
  console.log('✅ Generated content for: digitaal-herdenken');
  console.log('\n✅ Successfully generated 3 final blog articles (batch 5)!');
};

// Run the generation
generateBatch5();