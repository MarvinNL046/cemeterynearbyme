# Complete Setup Guide: BegraafplaatsInDeBuurt.nl Content Pipeline

## 1. Environment Setup

### Create `.env.brightdata` file:
```bash
# Bright Data API Configuration
API_TOKEN=your_brightdata_api_token_here
```

### Create `.env.local` file:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Public Environment Variables
NEXT_PUBLIC_SITE_URL=https://begraafplaatsindebuurt.nl
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google AdSense (wanneer goedgekeurd)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Optional: Supabase voor toekomstige features
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

## 2. Project Structure

```
begraafplaatsindebuurt.nl/
├── app/                          # Next.js 14 app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── begraafplaats/
│   │   └── [slug]/
│   │       └── page.tsx         # Individual cemetery pages
│   ├── gemeente/
│   │   └── [gemeente]/
│   │       └── page.tsx         # Municipality pages
│   ├── provincie/
│   │   └── [provincie]/
│   │       └── page.tsx         # Province pages
│   └── api/
│       ├── search/
│       └── stats/
├── components/
│   ├── ads/                     # AdSense components
│   ├── search/                  # Search functionality
│   └── ui/                      # UI components
├── data/
│   ├── begraafplaatsen.csv      # Source data
│   ├── begraafplaatsen.json     # Processed data
│   ├── scraped-begraafplaatsen/ # Scraped content
│   ├── enrichments-begraafplaatsen/ # AI-generated content
│   └── progress-logs/           # Processing progress
├── lib/
│   ├── data.ts                  # Data loading functions
│   └── utils.ts                 # Utility functions
├── scripts/
│   ├── build-data.ts            # CSV to JSON converter
│   ├── scrape-begraafplaats.ts # Web scraping script
│   ├── enrich-begraafplaats.py # AI content generation
│   └── daily-enrichment.sh     # Automated daily runs
├── .env.local                   # Local environment variables
├── .env.brightdata              # Bright Data API config
└── package.json                 # Dependencies
```

## 3. Dependencies Installation

### Node.js Dependencies
```bash
npm install axios p-limit chalk dotenv csv-parser
npm install @types/node typescript ts-node
npm install next@14 react react-dom
npm install @radix-ui/react-* tailwindcss
```

### Python Dependencies
```bash
pip install openai python-dotenv
```

## 4. Data Processing Pipeline

### Step 1: Convert CSV to JSON
```typescript
// scripts/build-data.ts
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

interface BegraafplaatsCSV {
  naam: string;
  gemeente: string;
  provincie: string;
  type?: string;
  adres?: string;
  postcode?: string;
  telefoon?: string;
  website?: string;
  email?: string;
  gps_lat?: string;
  gps_lon?: string;
  opgericht?: string;
}

const begraafplaatsen: Record<string, any> = {};

fs.createReadStream(path.join(__dirname, '..', 'data', 'begraafplaatsen.csv'))
  .pipe(csv())
  .on('data', (row: BegraafplaatsCSV) => {
    const slug = createSlug(row.naam, row.gemeente);
    begraafplaatsen[slug] = {
      ...row,
      slug,
      gps_coordinaten: row.gps_lat && row.gps_lon ? 
        `${row.gps_lat},${row.gps_lon}` : null,
      type: row.type || 'algemene begraafplaats'
    };
  })
  .on('end', () => {
    fs.writeFileSync(
      path.join(__dirname, '..', 'data', 'begraafplaatsen.json'),
      JSON.stringify(begraafplaatsen, null, 2)
    );
    console.log(`✅ Converted ${Object.keys(begraafplaatsen).length} cemeteries`);
  });

function createSlug(naam: string, gemeente: string): string {
  return `${naam}-${gemeente}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

### Step 2: Web Scraping Script
```typescript
// scripts/scrape-begraafplaats.ts
#!/usr/bin/env node
import fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import axios from 'axios';
import pLimit from 'p-limit';
import chalk from 'chalk';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.brightdata') });

const CONFIG = {
  API_TOKEN: process.env.API_TOKEN,
  CONCURRENCY: 15,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  WEB_UNLOCKER_ZONE: 'mcp_unlocker',
  OUTPUT_DIR: path.join(__dirname, '..', 'data', 'scraped-begraafplaatsen'),
  PROGRESS_FILE: path.join(__dirname, '..', 'data', 'progress-logs', 'scraping-progress.json'),
};

// Ensure output directory exists
if (!fsSync.existsSync(CONFIG.OUTPUT_DIR)) {
  fsSync.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

async function scrapeWebsite(url: string): Promise<any> {
  const response = await axios.post(
    'https://api.brightdata.com/request',
    {
      url,
      zone: CONFIG.WEB_UNLOCKER_ZONE,
      format: 'raw',
      data_format: 'markdown',
    },
    {
      headers: {
        'Authorization': `Bearer ${CONFIG.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );
  
  return response.data;
}

// Run with: npx ts-node scripts/scrape-begraafplaats.ts
```

### Step 3: AI Content Generation
```python
#!/usr/bin/env python3
# scripts/enrich-begraafplaats.py
import json
import os
import sys
import time
from typing import Dict, Any, Optional
from pathlib import Path
import openai
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY not set in .env.local")
    sys.exit(1)

client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
SCRAPED_DIR = DATA_DIR / "scraped-begraafplaatsen"
ENRICHMENTS_DIR = DATA_DIR / "enrichments-begraafplaatsen"
PROGRESS_FILE = DATA_DIR / "progress-logs" / "enrichment-progress.json"

# Ensure directories exist
ENRICHMENTS_DIR.mkdir(parents=True, exist_ok=True)
(DATA_DIR / "progress-logs").mkdir(parents=True, exist_ok=True)

def generate_content(begraafplaats_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Generate ~400 words of unique content using GPT-4o-mini"""
    
    prompt = f"""
Je bent een professionele content writer voor BegraafplaatsInDeBuurt.nl.

Begraafplaats gegevens:
- Naam: {begraafplaats_data.get('naam')}
- Gemeente: {begraafplaats_data.get('gemeente')}
- Provincie: {begraafplaats_data.get('provincie')}
- Type: {begraafplaats_data.get('type', 'algemene begraafplaats')}

Schrijf unieke content voor deze 4 secties (totaal ~400 woorden):

1. "introductie" (100-120 woorden): Welkom, locatie, bereikbaarheid, korte historie
2. "geschiedenis" (80-100 woorden): Oprichting, historische betekenis, bijzonderheden
3. "diensten" (100-120 woorden): Beschikbare diensten, faciliteiten, mogelijkheden
4. "praktisch" (80-100 woorden): Openingstijden, contact, route, parkeren

Output: JSON object met keys "introductie", "geschiedenis", "diensten", "praktisch"
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Genereer alleen de gevraagde JSON output."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        if content.startswith('```json'):
            content = content[7:-3]
            
        return json.loads(content)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

# Run with: python3 scripts/enrich-begraafplaats.py
```

## 5. Next.js Implementation

### Data Loading Functions
```typescript
// lib/data.ts
import fs from 'fs/promises';
import path from 'path';

export async function getBegraafplaatsData(slug: string) {
  const filePath = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
  return data[slug] || null;
}

export async function getEnrichment(slug: string) {
  try {
    const filePath = path.join(
      process.cwd(), 
      'data', 
      'enrichments-begraafplaatsen', 
      `${slug}.json`
    );
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    return data.enrichment;
  } catch {
    return null;
  }
}

export async function getAllBegraafplaatsen() {
  const filePath = path.join(process.cwd(), 'data', 'begraafplaatsen.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
  return Object.values(data);
}
```

### Cemetery Page Component
```typescript
// app/begraafplaats/[slug]/page.tsx
import { getBegraafplaatsData, getEnrichment } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const begraafplaats = await getBegraafplaatsData(params.slug);
  if (!begraafplaats) return {};

  return {
    title: `Begraafplaats ${begraafplaats.naam} in ${begraafplaats.gemeente} | BegraafplaatsInDeBuurt.nl`,
    description: `Alle informatie over ${begraafplaats.naam} in ${begraafplaats.gemeente}, ${begraafplaats.provincie}. Openingstijden, diensten, route en contact.`,
  };
}

export default async function BegraafplaatsPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const begraafplaats = await getBegraafplaatsData(params.slug);
  if (!begraafplaats) notFound();
  
  const enrichment = await getEnrichment(params.slug);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{begraafplaats.naam}</h1>
      
      {/* Introductie */}
      <section className="mb-8">
        <p className="text-lg text-gray-700">
          {enrichment?.introductie || `Welkom op de informatiepagina van ${begraafplaats.naam}...`}
        </p>
      </section>
      
      {/* Meer secties... */}
    </div>
  );
}
```

## 6. Running the Pipeline

### Initial Setup
```bash
# 1. Install dependencies
npm install
pip install -r requirements.txt

# 2. Set up environment variables
cp .env.example .env.local
cp .env.brightdata.example .env.brightdata
# Edit both files with your API keys

# 3. Process CSV data
npx ts-node scripts/build-data.ts

# 4. Run web scraping (optional but recommended)
npx ts-node scripts/scrape-begraafplaats.ts

# 5. Generate AI content
python3 scripts/enrich-begraafplaats.py

# 6. Build Next.js site
npm run build

# 7. Start production server
npm start
```

### Daily Automation
```bash
#!/bin/bash
# scripts/daily-enrichment.sh
cd /path/to/begraafplaatsindebuurt.nl

# Run enrichment for new/missing content
python3 scripts/enrich-begraafplaats.py

# Rebuild site if new content was generated
if [ -f "data/progress-logs/enrichment-progress.json" ]; then
  LAST_COUNT=$(cat data/progress-logs/enrichment-progress.json | jq '.total_processed')
  python3 scripts/enrich-begraafplaats.py
  NEW_COUNT=$(cat data/progress-logs/enrichment-progress.json | jq '.total_processed')
  
  if [ "$NEW_COUNT" -gt "$LAST_COUNT" ]; then
    echo "New content generated, rebuilding site..."
    npm run build
  fi
fi
```

## 7. Cost Estimation

### OpenAI GPT-4o-mini
- Input: ~300 tokens per request
- Output: ~500 tokens per request
- Cost: ~€0.002 per begraafplaats
- 5000 begraafplaatsen: ~€10

### Bright Data Web Unlocker
- Cost per request: ~€0.01-0.02
- 5000 begraafplaatsen: ~€50-100
- Only needed for sites with websites

### Total: €60-110 for complete enrichment

## 8. AdSense Approval Checklist

✅ **Content Requirements**
- [ ] 400+ words unique content per page
- [ ] No duplicate content
- [ ] Valuable, informative content
- [ ] Professional tone

✅ **Technical Requirements**
- [ ] Fast loading (<3s)
- [ ] Mobile responsive
- [ ] SSL certificate
- [ ] XML sitemap
- [ ] Proper error pages

✅ **Legal Pages**
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Cookie Policy
- [ ] About Us page
- [ ] Contact page

✅ **User Experience**
- [ ] Working search
- [ ] Easy navigation
- [ ] No broken links
- [ ] Clear structure

## 9. Monitoring & Maintenance

### Analytics Setup
```javascript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
```

### Performance Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track search usage
- Monitor 404 errors

## 10. Next Steps After Implementation

1. **Week 1-2**: Implement and test pipeline
2. **Week 3-4**: Generate content for all begraafplaatsen
3. **Week 5**: Launch and submit to Google Search Console
4. **Week 6**: Apply for AdSense
5. **Week 7+**: Monitor and optimize based on data

This complete setup will transform begraafplaatsindebuurt.nl into a valuable resource worthy of AdSense approval!