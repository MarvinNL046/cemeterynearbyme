# Database Structuur Begraafplaatsindebuurt.nl

## URL Structuur

### Provincies
- `/provincie/noord-holland`
- `/provincie/zuid-holland` 
- `/provincie/utrecht`
- etc.

### Gemeenten
- `/gemeente/amsterdam`
- `/gemeente/rotterdam`
- `/gemeente/den-haag`
- etc.

### Begraafplaatsen
- `/begraafplaats/[gemeente]/[begraafplaats-naam]`
- Bijvoorbeeld: `/begraafplaats/amsterdam/zorgvlied`
- Bijvoorbeeld: `/begraafplaats/rotterdam/crooswijk`

### Types
- `/type/algemene-begraafplaats`
- `/type/natuurbegraafplaats`
- `/type/joodse-begraafplaats`
- `/type/islamitische-begraafplaats`

## Database Velden

### Verplichte velden:
```json
{
  "id": "unieke-id",
  "naam": "Officiële naam",
  "slug": "url-vriendelijke-naam",
  "type": "algemene begraafplaats | natuurbegraafplaats | joodse begraafplaats | islamitische begraafplaats",
  "gemeente": "Gemeentenaam",
  "provincie": "Provincienaam",
  "adres": {
    "straat": "Straatnaam + nummer",
    "postcode": "1234 AB",
    "plaats": "Plaatsnaam"
  }
}
```

### Optionele velden:
```json
{
  "contact": {
    "telefoon": "",
    "email": "",
    "website": ""
  },
  "openingstijden": {
    "maandag": "",
    "dinsdag": "",
    "woensdag": "",
    "donderdag": "",
    "vrijdag": "",
    "zaterdag": "",
    "zondag": "",
    "opmerkingen": ""
  },
  "voorzieningen": [],
  "toegankelijkheid": {
    "rolstoeltoegankelijk": true/false,
    "parkeren": ""
  },
  "coordinaten": {
    "lat": 52.0000,
    "lng": 5.0000
  }
}
```

## Kwaliteitseisen

1. **Geen dubbele entries** - Elke begraafplaats komt maar 1x voor
2. **Correcte namen** - Officiële namen, geen "Cemetery" of generieke namen
3. **Volledige adressen** - Straat, postcode en plaats
4. **Type verificatie** - Alleen de 4 toegestane types
5. **Gemeente/provincie koppeling** - Moet kloppen met Nederlandse indeling