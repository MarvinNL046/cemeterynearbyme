import json

# Lees het complete bestand
with open('../data/limburg-begraafplaatsen-complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Nieuwe Beek begraafplaatsen data met adressen en plaatsen
beek_updates = {
    "Begraafplaats De Nieuwe Hof": {
        "categorie": "Gemeentelijke begraafplaats"
    },
    "Oude algemene Begraafplaats St. Martinus": {
        "adres": "Pastoor Weltersstraat 22",
        "categorie": "Gemeentelijke begraafplaats"
    },
    "Joodse Begraafplaats": {
        "adres": "Jodenkerkhof",
        "categorie": "Joodse begraafplaats"
    },
    "Begraafplaats": {
        "plaats": "Neerbeek",
        "categorie": "Bijzondere begraafplaats",
        "naam_volledig": "Begraafplaats Neerbeek"
    },
    "Kerkhof H Martinus": {
        "adres": "Burgemeester Janssenstraat 11",
        "categorie": "Bijzondere begraafplaats"
    },
    "NH Kerkhof": {
        "categorie": "Bijzondere begraafplaats"
    },
    "RK Begraafplaats": {
        "plaats": "Spaubeek",
        "categorie": "Bijzondere begraafplaats",
        "naam_volledig": "RK Begraafplaats Spaubeek"
    },
    "RK Kerkhof St. Hubertus": {
        "adres": "Pastoor Weltersstraat 22",
        "plaats": "Groot Genhout",
        "categorie": "Bijzondere begraafplaats"
    },
    "St. Annakerkhof": {
        "adres": "Oude Kerk 8",
        "plaats": "Spaubeek",
        "categorie": "Bijzondere begraafplaats"
    },
    "St. Laurentiuskerkhof Hoeve": {
        "adres": "Rubensstraat 4",
        "plaats": "Spaubeek",
        "categorie": "Bijzondere begraafplaats"
    }
}

# Update begraafplaatsen voor Beek
updated_count = 0
for begraafplaats in data['begraafplaatsen']:
    if begraafplaats['gemeente'] == 'Beek':
        naam = begraafplaats['naam']
        if naam in beek_updates:
            updates = beek_updates[naam]
            if 'adres' in updates:
                begraafplaats['adres'] = updates['adres']
            if 'plaats' in updates:
                begraafplaats['plaats'] = updates['plaats']
            if 'categorie' in updates:
                begraafplaats['categorie'] = updates['categorie']
            if 'naam_volledig' in updates:
                begraafplaats['naam_volledig'] = updates['naam_volledig']
            updated_count += 1

print(f"Updated {updated_count} begraafplaatsen voor Beek")

# Sla het bijgewerkte bestand op
with open('../data/limburg-begraafplaatsen-complete.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Data bijgewerkt!")

# Print een samenvatting
beek_begraafplaatsen = [b for b in data['begraafplaatsen'] if b['gemeente'] == 'Beek']
print(f"\nBeek heeft {len(beek_begraafplaatsen)} begraafplaatsen:")
for b in beek_begraafplaatsen:
    plaats = f" ({b.get('plaats', '')})" if b.get('plaats') else ""
    adres = f" - {b.get('adres', '')}" if b.get('adres') else ""
    print(f"- {b['naam']}{plaats}{adres}")