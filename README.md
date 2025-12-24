# Begraafplaatsindebuurt.nl

Een complete online directory voor het vinden van begraafplaatsen in Nederland.

## Project Status

🚧 **Database Rebuild in Progress** 🚧

We zijn bezig met het opnieuw opbouwen van onze database met geverifieerde, accurate informatie.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: JSON files (nieuwe structuur in ontwikkeling)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Project Structuur

```
├── app/                    # Next.js app directory
│   ├── begraafplaats/     # Begraafplaats detail pagina's
│   ├── gemeente/          # Gemeente overzicht pagina's
│   ├── provincie/         # Provincie overzicht pagina's
│   ├── type/              # Type begraafplaats pagina's
│   └── uitvaartverzekering/ # Uitvaartverzekering sectie
├── components/            # React components
├── data/                  # Database files
├── public/               # Static assets
└── docs/                 # Documentatie
    └── archive/          # Gearchiveerde documentatie
```

## Contact

- Website: https://begraafplaatsindebuurt.nl
- Email: info@begraafplaatsindebuurt.nl
