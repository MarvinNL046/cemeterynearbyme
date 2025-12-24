import json
import re

# De volledige lijst van begraafplaatsen uit de tekst
begraafplaatsen_text = """
Algemene Begraafplaats
Maastricht

Algemene Begraafplaats
Maasgouw - Thorn

Algemene Begraafplaats Beesel
Beesel

Algemene Begraafplaats Bunde vh RK St. Agnes
Meerssen - Bunde

Algemene Begraafplaats Linderweg
Vaals

Algemene Begraafplaats Nabij kapel in 't Zand
Roermond

Algemene Begraafplaats Samenwerking
Brunssum

American Military Cemetery
Eijsden-Margraten - Margraten

Begraafplaats
Beekdaelen - Sweikhuizen

Begraafplaats
Horst aan de Maas - Evertsoord

Begraafplaats
Beekdaelen - Schinveld

Begraafplaats
Bergen Li - Nieuw-Bergen

Begraafplaats
Gulpen-Wittem - Nijswiller

Begraafplaats
Nederweert

Begraafplaats
Beesel - Reuver

Begraafplaats
Simpelveld

Begraafplaats
Venlo - Tegelen

Begraafplaats
Beek - Neerbeek

Begraafplaats
Gulpen-Wittem - Slenaken

Begraafplaats
Gulpen-Wittem - Reijmerstok

Begraafplaats
Sittard-Geleen - Holtum

Begraafplaats 't Höltje
Peel en Maas - Helden

Begraafplaats Abdissenbosch
Landgraaf - Abdissenbosch

Begraafplaats bij Slotklooster
Venlo - Steijl

Begraafplaats Bleijerheide
Kerkrade

Begraafplaats Boschhuizen
Venray

Begraafplaats Brummeberg
Roermond - Merum

Begraafplaats Chevremont
Kerkrade

Begraafplaats De Huysbongerd
Roerdalen - Montfort

Begraafplaats De Nieuwe Hof
Beek

Begraafplaats Eikske
Landgraaf

Begraafplaats en crematorium Schifferheide
Kerkrade

Begraafplaats en mausoleum Mgr. Mutsaersoord, Venlo
Venlo

Begraafplaats Franciscanen
Weert

Begraafplaats Gracht was kerkhof
Kerkrade

Begraafplaats Haanrade
Kerkrade

Begraafplaats Heer
Maastricht

Begraafplaats Heiderust met Isl. Deel
Peel en Maas - Koningslust

Begraafplaats Heilig Hart Klooster
Venlo - Steijl

Begraafplaats Heilust Spekholzerheide
Kerkrade

Begraafplaats Heugem
Maastricht

Begraafplaats Holz
Kerkrade

Begraafplaats Hulsberg
Beekdaelen - Hulsberg

Begraafplaats Kaalheide
Kerkrade

Begraafplaats Kakert
Landgraaf

Begraafplaats Klooster St. Benedictusabdij
Vaals - Lemiers

Begraafplaats Kloosterstraat
Horst aan de Maas - Horst

Begraafplaats Krietheuvel
Maasgouw - Wessem

Begraafplaats Lahrhof
Sittard-Geleen - Sittard

Begraafplaats Leeuwen
Roermond

Begraafplaats Lindenheuvel NH
Sittard-Geleen - Geleen

Begraafplaats Lindenheuvel RK
Sittard-Geleen - Geleen

Begraafplaats Lutterade-Krawinkel
Sittard-Geleen - Geleen

Begraafplaats Maasniel
Roermond

Begraafplaats Mariadorp
Eijsden-Margraten - Mariadorp

Begraafplaats Meterik
Horst aan de Maas - Meterik

Begraafplaats Minderbroedersklooster
Weert

Begraafplaats Molendijk
Venlo - Velden

Begraafplaats OLV van de berg Carmel
Landgraaf

Begraafplaats Onze Lieve Vrouw van Smarten Paterspaadje
Mook en Middelaar - Molenhoek

Begraafplaats Oud Geleen
Sittard-Geleen - Geleen

Begraafplaats Oudenbosch
Beekdaelen - Wijnandsrade

Begraafplaats parochie H. Matthias
Roerdalen - Posterholt

Begraafplaats St. Joseph
Heerlen - Hoensbroek

Begraafplaats St. Joseph Broekhem
Valkenburg aan de Geul - Valkenburg

Begraafplaats St. Joseph Heerlerbaan
Heerlen

Begraafplaats St. Ludwig
Roerdalen - Vlodrop

Begraafplaats Terwinselen
Kerkrade

Begraafplaats Vouersveld
Sittard-Geleen - Geleen

Begraafplaats Zuid
Sittard-Geleen - Geleen

Bergerkamp
Maasgouw - Linne

Bijzonder kerkhof H. Theresia
Voerendaal - Ransdaal

Britisch War Cemetery
Brunssum

British War Cemetery
Venray

British War Cemetery
Nederweert

British War Cemetery
Gennep - Milsbeek

British War Cemetery
Mook en Middelaar - Mook

British War Cemetery
Sittard-Geleen - Sittard

Centrale Begraafplaats
Heerlen - Hoensbroek

Crypte Klooster St. Benedictusabdij
Vaals - Lemiers

Crypte Klooster Wittem
Gulpen-Wittem - Wittem

De Blerickse Bergen Blerick
Venlo

Duitse OorlogsBegraafplaats
Venray - Ysselsteyn

Fabianus en Sebastianuskerkhof
Horst aan de Maas - Sevenum

Familiebegraafplaats kasteel Walburg
Maasgouw - Stevensweert

Familiegraf Von Pelser Berensberg
Vaals - Lemiers

Gemeentelijk kerkhof
Maasgouw - Maasbracht

Gemeentelijk Kerkhof met RK deel
Horst aan de Maas - Grubbenvorst

Gemeentelijke Begraafplaats
Voerendaal

Gemeentelijke Begraafplaats
Valkenburg aan de Geul - Valkenburg

Gemeentelijke Begraafplaats
Beekdaelen - Merkelbeek

Gemeentelijke Begraafplaats
Roerdalen - Melick

Gemeentelijke Begraafplaats
Landgraaf

Gemeentelijke Begraafplaats
Venlo - Belfeld

Gemeentelijke Begraafplaats
Weert

Gemeentelijke Begraafplaats
Stein - Urmond

Gemeentelijke Begraafplaats
Stein - Elsloo

Gemeentelijke Begraafplaats
Meerssen

Gemeentelijke Begraafplaats
Eijsden-Margraten - Eijsden

Gemeentelijke Begraafplaats
Valkenburg aan de Geul - Sibbe

Gemeentelijke Begraafplaats
Eijsden-Margraten - Gronsveld

Gemeentelijke Begraafplaats
Gulpen-Wittem - Gulpen

Gemeentelijke Begraafplaats
Valkenburg aan de Geul - Berg en Terblijt

Gemeentelijke Begraafplaats
Eijsden-Margraten - Noorbeek

Gemeentelijke Begraafplaats
Roerdalen - Herkenbosch

Gemeentelijke Begraafplaats achter kerkhof St. Stephanus
Maasgouw - Stevensweert

Gemeentelijke Begraafplaats Annahof
Echt-Susteren - Echt Gebroek

Gemeentelijke Begraafplaats Anxterveld
Roerdalen - Vlodrop

Gemeentelijke Begraafplaats BroekSittard
Sittard-Geleen - Sittard

Gemeentelijke Begraafplaats Daelderveld
Beekdaelen - Nuth

Gemeentelijke Begraafplaats Elsene
Echt-Susteren - Nieuwstadt

Gemeentelijke Begraafplaats Haelen
Leudal - Horn

Gemeentelijke Begraafplaats Hambos
Kerkrade

Gemeentelijke Begraafplaats Heerlen Centrum
Heerlen

Gemeentelijke Begraafplaats Heerlerheide
Heerlen

Gemeentelijke Begraafplaats Het Zittart
Roerdalen - Sint Odiliënberg

Gemeentelijke Begraafplaats Imstenrade
Heerlen

Gemeentelijke Begraafplaats Kerensheide
Stein

Gemeentelijke Begraafplaats Kleikoeleweg
Landgraaf

Gemeentelijke Begraafplaats Merkelbeekerstraat
Brunssum

Gemeentelijke Begraafplaats met RK deel
Gennep

Gemeentelijke Begraafplaats Senserhove
Maasgouw - Beegden

Gemeentelijke Begraafplaats St. Jan
Heerlen - Hoensbroek

Gemeentelijke Begraafplaats Steenenkruisweg
Landgraaf

Gemeentelijke Begraafplaats tegenover de Kerk
Valkenburg aan de Geul - Berg en Terblijt

Gemeentelijke Begraafplaats Ter Borgh
Roerdalen - Posterholt

Gemeentelijke Begraafplaats Venlo
Venlo

Gemeentelijke Begraafplaats voorheen RK
Peel en Maas - Panningen

Grafkapel familie Regout
Meerssen

Grafkapel Maria-Teresa Tauscher
Sittard-Geleen - Sittard

Grafkapel Mgr. Savelberg
Heerlen

Grafkelder familie Van Crugten
Roermond - Herten

Grafkelder Van Scherpenzeel Heusch
Roerdalen - Vlodrop

Grafmonument voor Baron Des Tombe in Waldeckpark
Maastricht

H Joannes de Doperbegraafplaats
Venray - Merselo

H Lambertuskerkhof
Peel en Maas - Helden

H Stephanuskerkhof
Beekdaelen - Wijnandsrade

H. Bavokerkhof
Beekdaelen - Nuth

H. Catharinabegraafplaats
Vaals - Lemiers

H. Hart van Jezusbegraafplaats
Meerssen - Rothem

H. Joannes de Doperkerkhof
Echt-Susteren - Nieuwstadt

H. Margaritakerkhof
Eijsden-Margraten - Margraten

H. Martinus Kerkhof
Vaals - Vijlen

H. Martinusbegraafplaats
Leudal - Neer

H. Martinuskerkhof
Leudal - Neer

H. Mathiasbegraafplaats
Venray - Castenray

H. Michaelkerkhof
Roermond - Herten

H. Nicolaasbegraafplaats
Sittard-Geleen - Guttecoven

H. Stephanuskerkhof
Maasgouw - Heel

Hervormde Begraafplaats
Vaals

HH. Lambertus en Genovevakerkhof
Vaals - Holset

HH. Petrus en Hubertuskerkhof
Gulpen-Wittem - Gulpen

Islamitische Begraafplaats Lindenheuvel
Sittard-Geleen - Geleen

Israëlitische Begraafplaats Rothem
Meerssen

Joodse Begraafplaats
Vaals

Joodse Begraafplaats
Gulpen-Wittem - Gulpen

Joodse Begraafplaats
Stein - Urmond

Joodse Begraafplaats
Gennep

Joodse Begraafplaats
Beek

Joodse Begraafplaats
Eijsden-Margraten - Eijsden

Joodse Begraafplaats
Sittard-Geleen - Grevenbicht

Joodse Begraafplaats op Algemene Begraafplaats
Valkenburg aan de Geul - Valkenburg

Joodse Begraafplaats op Algemene Begraafplaats Lahrhof
Sittard-Geleen - Sittard

Joodse Begraafplaats Schimmert
Beekdaelen - Schimmert

Kerkhof
Nederweert - Nederweert-Eind

Kerkhof
Gulpen-Wittem - Nijswiller

Kerkhof
Meerssen - Moorveld

Kerkhof
Valkenburg aan de Geul - Berg en Terblijt

Kerkhof
Eijsden-Margraten - Cadier en Keer

Kerkhof
Sittard-Geleen - Schipperskerk

Kerkhof
Sittard-Geleen - Holtum

Kerkhof America
Horst aan de Maas - America

Kerkhof Basiliek H. Wiro
Roerdalen - Sint Odiliënberg

Kerkhof bij de grote St. Jan
Heerlen - Hoensbroek

Kerkhof bij de nieuwe kerk
Weert - Swartbroek

Kerkhof Birgittinessen
Weert

Kerkhof Broekhuizen
Horst aan de Maas - Broekhuizen

Kerkhof Broekhuizenvorst
Horst aan de Maas - Broekhuizenvorst

Kerkhof H Martinus
Beek

Kerkhof H. Barbara
Eijsden-Margraten - Scheulder

Kerkhof H. Bartholomeus
Eijsden-Margraten - Eckelrade

Kerkhof H. Brigida
Eijsden-Margraten - Noorbeek

Kerkhof H. Cunibertus
Gulpen-Wittem - Wahlwiller

Kerkhof H. Gertrudis
Venray - Oirlo

Kerkhof H. Hart van Jezus Nieuwenhagerheide
Landgraaf

Kerkhof H. Lambertus
Beekdaelen - Oirsbeek

Kerkhof H. Martinus
Meerssen - Geulle/Aan de Maas

Kerkhof H. Nicolaes
Peel en Maas - Meijel

Kerkhof Heilige Pancratius
Eijsden-Margraten - Mesch

Kerkhof HH Lambertus en Brigida
Mook en Middelaar - Middelaar

Kerkhof Kronenberg
Horst aan de Maas - Kronenberg

Kerkhof Melick
Roerdalen - Melick

Kerkhof Nieuwenhagen
Landgraaf

Kerkhof O.L. Vrouwekapel
Leudal - Neer

Kerkhof OLV Vrouwe Onbevlekt Ontvangen
Eijsden-Margraten - Rijckholt

Kerkhof Onze Lieve Vrouwe geboorte
Venray - Blitterswijck

Kerkhof Onze Lieve Vrouwe geboorte
Peel en Maas - Kessel

Kerkhof Onze Lieve Vrouwe Onbevlekt Ontvangen
Nederweert - Ospel

Kerkhof Onze Lieve Vrouwe Onbevlekt Ontvangen
Echt-Susteren - Echt

Kerkhof Onze Lieve Vrouwe ter Hemelopneming
Sittard-Geleen - Einighausen

Kerkhof Rumpen
Brunssum

Kerkhof St Antonius Abt
Mook en Middelaar - Mook

Kerkhof St. Amalberga
Echt-Susteren - Susteren

Kerkhof St. Gertrudis
Gulpen-Wittem - Wijlre

Kerkhof st. Gertrudis
Horst aan de Maas - Lottum

Kerkhof St. Johannes de Doper
Gennep - Ottersum

Kerkhof St. Joseph
Venlo - Hout-Blerick

Kerkhof St. Lambertus
Nederweert

Kerkhof St. Laurentius
Voerendaal

Kerkhof St. Martinus
Stein - Urmond

Kerkhof St. Martinus
Stein

Kerkhof St. Martinus
Roerdalen - Vlodrop

Kerkhof St. Medardus
Maasgouw - Wessem

Kerkhof St. Paulus bekering
Gulpen-Wittem - Epen

Kerkhof St. Petrus' Banden
Venray

Kerkhof St. Remigius
Gulpen-Wittem - Slenaken

Kerkhof St. Stephanus
Maasgouw - Stevensweert

Kerkhof St. Vitus
Bergen Li - Well

Kerkhof Ubach over Worms
Landgraaf

Kloosterbegraafplaats Agnetenberg
Sittard-Geleen - Sittard

Kloosterbegraafplaats bij Huize St. Joseph Berg
Eijsden-Margraten - Cadier en Keer

Kloosterbegraafplaats bij Missiehuis Berg
Eijsden-Margraten - Cadier en Keer

Kloosterbegraafplaats Damianeum
Simpelveld

Kloosterbegraafplaats de Raay
Peel en Maas - Baarlo

Kloosterbegraafplaats Dochters der Wijsheid Montfortanen
Beekdaelen - Schimmert

Kloosterbegraafplaats Franciscanessen van St. Jozef
Valkenburg aan de Geul - Valkenburg

Kloosterbegraafplaats Fransiscanessen St. Elisabeth
Leudal - Heythuysen

Kloosterbegraafplaats Heilig Hart
Beesel - Reuver

Kloosterbegraafplaats Huize St. Elisabeth
Leudal - Haelen

Kloosterbegraafplaats in Ursulinenpark
Eijsden-Margraten - Eijsden

Kloosterbegraafplaats Jongenspensionaat 'St. Maria Ter Engelen' Bleijerheide
Kerkrade

Kloosterbegraafplaats Karmel
Beekdaelen - Merkelbeek

Kloosterbegraafplaats Karmelitessen
Echt-Susteren - Echt

Kloosterbegraafplaats Kleine Zusters v/d H. Josef
Heerlen

Kloosterbegraafplaats Liefdezusters van het Kostbaar Bloed
Echt-Susteren - Koningsbosch

Kloosterbegraafplaats Loreto
Simpelveld

Kloosterbegraafplaats Mariëndaal Redemptoristen
Gulpen-Wittem - Wittem

Kloosterbegraafplaats Missionarissen van het H. Hart
Stein

Kloosterbegraafplaats Priorij Regina Pacis
Valkenburg aan de Geul - Valkenburg

Kloosterbegraafplaats Roepaan
Gennep - Ottersum

Kloosterbegraafplaats St. Paul
Venlo - Arcen

Kloosterbegraafplaats Ursulinen
Horst aan de Maas - Grubbenvorst

Kloosterbegraafplaats Ursulinen
Echt-Susteren - Echt

Kloosterbegraafplaats van de Broeders van Maastricht
Maastricht

kloosterbegraafplaats Witte Paters van Sint Charles
Leudal - Heythuysen

Kloosterbegraafplaats zusters Karmelitessen
Sittard-Geleen - Sittard

Kloosterbegraafplaats zusters Sacré Coeur, Bloemendal
Vaals

Kloosterbegraafplaats zusters Ursulinen
Kerkrade

Kloosterbegraafplaats Zusters Ursulinen
Sittard-Geleen - Sittard

Kloosterbegraafplaats Zusters van Barmhartigheid, Amby
Maastricht - Amby

Kloosterkerkhof Redemptoristen
Roermond

Kloosterkerkhof Rolduc
Kerkrade

Kloosterkerkhof Zusters onder de Bogen
Eijsden-Margraten - Rijckholt

Kloosterkerkhof zusters Ursulinnen
Venray

Lambertusbegraafplaats
Venlo - Blerick

Mariarade
Heerlen - Hoensbroek

Mausoleum familie Von Clermont Huis Vaalsbroek
Vaals

Missiebegraafplaats St. Michaël
Venlo - Steijl

Natuurbegraafplaats Bergerbos
Roerdalen - Sint Odiliënberg

Natuurbegraafplaats Eygelshof
Kerkrade - Eygelshoven

Natuurbegraafplaats Landgoed Mookerheide
Mook en Middelaar - Molenhoek

Natuurbegraafplaats Venlo-Maasbree
Venlo

Natuurbegraafplaats Weverslo
Venray - Heide

NH Begraafplaats
Sittard-Geleen - Sittard

NH Begraafplaats Eijsden
Eijsden-Margraten - Eijsden

NH Begraafplaats Gennep
Gennep

NH Kerkhof
Venray - Blitterswijck

NH Kerkhof
Beek

NH Kerkhof
Sittard-Geleen - Grevenbicht

Nieuw Lotbroek
Heerlen - Hoensbroek

Nieuwe Begraafplaats
Venlo

Nieuwe Begraafplaats op de Algemene begraafplaats
Heerlen

Nieuwe hervormde Begraafplaats
Meerssen

Nieuwe joodse begraafplaats op Gemeentelijke begraafplaats
Roermond

Nieuwe St. Vitus Begraafplaats
Bergen Li - Well

Onze Lieve Vrouwe Geboortekerkhof
Maasgouw - Ohé

Onze Lieve Vrouwe Onbevlekt ontvangen
Beekdaelen - Amstenrade

Openbare Begraafplaats
Beekdaelen - Schimmert

Oud Hervormd Kerkhof
Meerssen

Oud RK Kerkhof
Venlo - Tegelen

Oud Vroenhoven
Maastricht

Oude algemene Begraafplaats St. Martinus
Beek

Oude Begraafplaats
Venlo

Oude Begraafplaats aan De Dwingel
Valkenburg aan de Geul - Valkenburg

Oude Begraafplaats Klooster St. Benedictusabdij
Vaals - Lemiers

Oude joodse begraafplaats op Gemeentelijke begraafplaats
Roermond

Oude Kerkhof
Beekdaelen - Bingelrade

Oude kerkhof
Kerkrade - Eygelshoven

Oude kerkhof
Echt-Susteren - Dieteren

Oude Kerkhof St. Clemens
Brunssum

Oude kloosterkerkhof Fransiscanessen
Leudal - Heythuysen

Oude kloosterkerkhof Savelberg
Peel en Maas - Koningslust

Oude Petrus en Pauluskerkhof
Landgraaf

Oude RK Begraafplaats
Echt-Susteren - Roosteren

Oude St. Agneskerkhof
Meerssen - Bunde

Particuliere Begraafplaats fam. Stiemens
Gennep

Petrus en Paulusbegraafplaats
Landgraaf

Protestants kerkhof
Valkenburg aan de Geul - Houthem

Protestants kerkhof
Maasgouw - Stevensweert

Protestantse Begraafplaats
Gulpen-Wittem - Gulpen

Protestantse Begraafplaats
Stein - Urmond

Restant kerkhof H. Bartolomeus
Meerssen

RK Begraafplaats
Gulpen-Wittem - Mechelen

RK Begraafplaats
Roermond - Asselt

RK Begraafplaats
Maasgouw - Heel

RK Begraafplaats
Venray - Geijsteren

RK Begraafplaats
Venray - Ysselsteyn

RK Begraafplaats
Simpelveld - Bocholtz

RK Begraafplaats
Horst aan de Maas - Tienray

RK Begraafplaats
Venray - Heide

RK Begraafplaats
Maasgouw - Maasbracht

RK Begraafplaats
Leudal - Heibloem

RK Begraafplaats
Beesel - Reuver

RK Begraafplaats
Gulpen-Wittem - Eys

RK Begraafplaats
Peel en Maas - Baarlo

RK Begraafplaats
Venlo - Boekend Blerick

RK Begraafplaats
Venlo - Belfeld

RK Begraafplaats
Venlo - Lomm

RK Begraafplaats
Venlo - Velden

RK Begraafplaats
Beek - Spaubeek

RK Begraafplaats
Venray - Vredepeel

RK Begraafplaats
Mook en Middelaar - Mook

RK Begraafplaats
Gennep - Heijen

RK Begraafplaats
Bergen Li - Siebengewald

RK Begraafplaats
Roermond - Swalmen

RK Begraafplaats
Roermond - Boukoul

RK Begraafplaats
Leudal - Ell

RK Begraafplaats
Sittard-Geleen - Born

RK Begraafplaats
Weert - Stramproy

RK Begraafplaats Berghof Eygelshoven met algemeen gedeelte
Kerkrade - Eygelshoven

RK Begraafplaats Gods Akker
Stein - Meers

RK Begraafplaats H. Aldegundis
Peel en Maas - Maasbree

RK Begraafplaats H. Bartholomeus
Eijsden-Margraten - Eckelrade

RK Begraafplaats H. Catharina
Meerssen - Ulestraten

RK Begraafplaats H. Catharina
Sittard-Geleen - Papenhoven

RK Begraafplaats H. Gerlachus
Eijsden-Margraten - Banholt

RK Begraafplaats H. Hart van Jezus
Peel en Maas - Grashoek

RK Begraafplaats H. Jodocus
Echt-Susteren - Sint Joost

RK Begraafplaats H. Johannes De Doper
Leudal - Baexem

RK Begraafplaats H. Jozef
Venray - Smakt

RK Begraafplaats H. Jozef
Peel en Maas - Beringe

RK Begraafplaats H. Margarita
Leudal - Ittervoort

RK Begraafplaats H. Michael
Venray - Wanssum

RK Begraafplaats H. Nicolaas
Leudal - Heythuysen

RK Begraafplaats H. Paulus en H. Jozef
Vaals

RK Begraafplaats Hegelsom
Horst aan de Maas - Hegelsom

RK Begraafplaats Heilige Hoop
Echt-Susteren - Mariahoop

RK Begraafplaats HH. Cosmas en Damianus
Bergen Li - Afferden

RK Begraafplaats HH. Hieronymus en Antonius
Weert - Laar

RK Begraafplaats HH. Petrus en Paulus
Venlo - Arcen

RK Begraafplaats Kunrade
Voerendaal

RK Begraafplaats Leuken
Weert

RK Begraafplaats Melderslo
Horst aan de Maas - Melderslo

RK Begraafplaats Nieuwdorp
Stein

RK Begraafplaats Obbicht
Sittard-Geleen - Obbicht

RK Begraafplaats Onze Lieve Vrouw Onbevlekt Ontvangen
Echt-Susteren - Koningsbosch

RK Begraafplaats Onze Lieve Vrouw Tenhemelopneming
Venray - Leunen

RK Begraafplaats Oostermaas
Maastricht

RK Begraafplaats Oud-Caberg
Maastricht

RK Begraafplaats St Barbara
Brunssum

RK Begraafplaats St Lambertus
Horst aan de Maas - Horst

RK Begraafplaats St. Jozeph Keent
Weert

RK Begraafplaats Trans Cedron
Venray - Oostrum

RK Kerkhof
Meerssen - Ulestraten

RK kerkhof
Gennep - Milsbeek

RK Kerkhof
Peel en Maas - Koningslust

RK Kerkhof
Peel en Maas - Egchel

RK Kerkhof
Voerendaal - Ubachsberg

RK Kerkhof
Stein - Berg aan de Maas

RK Kerkhof
Maastricht - Itteren

RK Kerkhof
Valkenburg aan de Geul - Houthem

RK Kerkhof
Eijsden-Margraten - Gronsveld

RK Kerkhof
Maastricht - Amby

RK Kerkhof
Roermond - Asenray

RK Kerkhof
Nederweert - Leveroy

RK Kerkhof H. Agatha
Gulpen-Wittem - Eys

RK Kerkhof H. Antonius Abt
Gennep - Ven-Zelderheide

RK kerkhof H. Antonius van Padua
Venray - Veulen

RK Kerkhof H. Catharina
Bergen Li - Wellerlooi

RK Kerkhof H. Clemens
Beekdaelen - Hulsberg

RK Kerkhof H. Dionysius Rozenkerkje
Roermond - Asselt

RK Kerkhof H. Drievuldigheid
Landgraaf - Rimburg

RK Kerkhof H. Gertrudis
Beekdaelen - Jabeek

RK Kerkhof H. Gertrudis
Eijsden-Margraten - Sint Geertruid

RK Kerkhof H. Hart van Jezus
Weert - Altweerterheide

RK Kerkhof H. Johannes De Doper
Horst aan de Maas - Meerlo

RK Kerkhof H. Jozef
Beekdaelen - Doenrade

RK Kerkhof H. Jozef
Eijsden-Margraten - Oost-Maarland

RK Kerkhof H. Lambertus
Horst aan de Maas - Swolgen

RK Kerkhof H. Martinus
Maasgouw - Beegden

RK Kerkhof Heerlerheide
Heerlen

RK Kerkhof Heilige Michael
Maasgouw - Thorn

RK Kerkhof Johannes de Doper Limmel
Maastricht

RK Kerkhof Maria Onbevlekt Ontvangen
Peel en Maas - Kesseleik

RK Kerkhof Mariaveld
Echt-Susteren - Susteren

RK Kerkhof restant
Leudal - Heythuysen

RK Kerkhof Sint Pieter
Maastricht

RK Kerkhof St. Antonius
Venlo - Blerick

RK Kerkhof St. Christina
Eijsden-Margraten - Eijsden

RK Kerkhof St. Hubertus
Beek - Groot Genhout

RK kerkhof St. Oda Boshoven
Weert

RK Kerkhof St. Pancratius
Sittard-Geleen - Munstergeleen

RK kerkhof Tungelroy
Weert - Tungelroy

RK Kerkhof Wolder
Maastricht

RK kleine St. Janskerkhof
Heerlen - Hoensbroek

RK Martinuskerkhof Breust
Eijsden-Margraten - Eijsden

RK St. Corneliuskerkhof
Maastricht - Borgharen

Sint Annakerkhof
Echt-Susteren - Echt

St Lambertusbegraafplaats
Leudal - Haelen

St Martinusbegraafplaats
Weert

St Petrus Canisiusbegraafplaats
Beekdaelen - Puth

St. Allegundiskerkhof
Leudal - Buggenum

St. Annakerkhof
Beek - Spaubeek

St. Augustinuskerkhof
Stein - Elsloo

St. Barbarakerkhof
Horst aan de Maas - Griendtsveen

St. Catharinakerkhof
Sittard-Geleen - Buchten

St. Dionysiuskerkhof
Beekdaelen - Schinnen

St. Isodoruskerkhof
Leudal - Haler

St. Jacobus de Meerderekerkhof
Leudal - Hunsel

St. Joannes de Doperkerkhof
Gulpen-Wittem - Mechelen

St. Johannes de Doperkerkhof
Valkenburg aan de Geul - Schin op Geul

St. Lambertuskerkhof
Leudal - Neeritter

St. Lambertuskerkhof Kerkrade-Kom
Kerkrade

St. Lambertuskerkhof met grafkapel fam. De Loë
Eijsden-Margraten - Mheer

St. Laurentiuskerkhof
Eijsden-Margraten - Bemelen

St. Laurentiuskerkhof Hoeve
Beek - Spaubeek

St. Liduïnakerkhof
Leudal - Kelpen

St. Martinuskerkhof
Maasgouw - Linne

St. Martinuskerkhof
Leudal - Horn

St. Martinuskerkhof
Gennep

St. Martinuskerkhof van Wijck
Maastricht

St. Martinuskerkhof Welten
Heerlen

St. Mauritiuskerkhof
Valkenburg aan de Geul - Schin op Geul

St. Petrusbegraafplaats
Bergen Li - Bergen

St. Petrusbegraafplaats
Leudal - Roggel

St. Remigiuskerkhof
Voerendaal - Klimmen

St. Salvatiuskerkhof
Sittard-Geleen - Limbricht

St. Servatiusbegraafplaats
Beekdaelen - Vaesrade

St. Servatiuskerkhof
Leudal - Nunhem

St. Severinuskerkhof
Leudal - Grathem

Tussen de Bergen
Roermond

Voormalig NH Kerkhof
Gennep

War Cemetery Swartbroek
Weert - Swartbroek
"""

def create_slug(naam, gemeente, plaats=None):
    """Maak een slug van de naam en gemeente"""
    if plaats:
        full_name = f"{naam} {gemeente} {plaats}"
    else:
        full_name = f"{naam} {gemeente}"
    
    # Vervang speciale karakters
    slug = full_name.lower()
    slug = slug.replace("'", "")
    slug = slug.replace('"', '')
    slug = slug.replace('/', '-')
    slug = slug.replace(' - ', '-')
    slug = re.sub(r'[^a-z0-9-]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    
    return slug

def determine_type(naam):
    """Bepaal het type begraafplaats op basis van de naam"""
    naam_lower = naam.lower()
    
    # Islamitisch
    if 'islamitisch' in naam_lower:
        return 'islamitische-begraafplaats'
    
    # Joods
    if 'joods' in naam_lower or 'joodse' in naam_lower or 'israëlitisch' in naam_lower:
        return 'joodse-begraafplaats'
    
    # Natuurbegraafplaats
    if 'natuur' in naam_lower:
        return 'natuurbegraafplaats'
    
    # Oorlogsbegraafplaats
    if 'war cemetery' in naam_lower or 'military' in naam_lower or 'oorlogs' in naam_lower:
        return 'oorlogsbegraafplaats'
    
    # Standaard is algemene begraafplaats
    return 'algemene-begraafplaats'

# Parse de begraafplaatsen
begraafplaatsen = []
lines = begraafplaatsen_text.strip().split('\n')
i = 0

while i < len(lines):
    line = lines[i].strip()
    
    if line:  # Als er een naam is
        naam = line
        i += 1
        
        if i < len(lines):
            locatie = lines[i].strip()
            
            # Check of er een plaats bij staat
            if ' - ' in locatie:
                gemeente, plaats = locatie.split(' - ', 1)
                gemeente = gemeente.strip()
                plaats = plaats.strip()
            else:
                gemeente = locatie
                plaats = None
            
            # Fix voor Bergen Li -> Bergen (L.)
            if gemeente == "Bergen Li":
                gemeente = "Bergen (L.)"
            
            begraafplaats = {
                "naam": naam,
                "gemeente": gemeente,
                "type": determine_type(naam),
                "slug": create_slug(naam, gemeente, plaats)
            }
            
            if plaats:
                begraafplaats["plaats"] = plaats
            
            begraafplaatsen.append(begraafplaats)
            i += 1
        else:
            i += 1
    else:
        i += 1

# Tel het aantal per gemeente
gemeente_count = {}
for b in begraafplaatsen:
    gemeente = b['gemeente']
    if gemeente not in gemeente_count:
        gemeente_count[gemeente] = 0
    gemeente_count[gemeente] += 1

print(f"Totaal aantal begraafplaatsen: {len(begraafplaatsen)}")
print("\nAantal per gemeente:")
for gemeente, count in sorted(gemeente_count.items()):
    print(f"{gemeente}: {count}")

# Sla op als JSON
output = {
    "provincie": "Limburg",
    "totaal": len(begraafplaatsen),
    "begraafplaatsen": begraafplaatsen
}

with open('/home/marvin/Documenten/begraafplaatsindebuurt.nl/begraafplaatsindebuurt.nl/data/limburg-begraafplaatsen-complete.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\nData opgeslagen in limburg-begraafplaatsen-complete.json")