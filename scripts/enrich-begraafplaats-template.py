#!/usr/bin/env python3
"""
AI Content Enrichment Script voor Begraafplaatsen
Gebaseerd op het succesvolle vindtandarts.nl model
Genereert ~400 woorden unieke content per begraafplaats
"""

import json
import os
import sys
import time
from typing import Dict, Any, Optional
from pathlib import Path
import openai
from datetime import datetime

# Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY environment variable not set")
    sys.exit(1)

client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Paths - aan te passen voor begraafplaatsindebuurt.nl
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
SCRAPED_DIR = DATA_DIR / "scraped-begraafplaatsen"
ENRICHMENTS_DIR = DATA_DIR / "enrichments-begraafplaatsen"
PROGRESS_FILE = DATA_DIR / "begraafplaats-enrichment-progress.json"

# Ensure directories exist
ENRICHMENTS_DIR.mkdir(parents=True, exist_ok=True)

def load_progress() -> Dict[str, Any]:
    """Load progress tracking data"""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {
        "processed": [],
        "failed": [],
        "total_processed": 0,
        "last_updated": None
    }

def save_progress(progress: Dict[str, Any]):
    """Save progress tracking data"""
    progress["last_updated"] = datetime.now().isoformat()
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)

def generate_begraafplaats_content(begraafplaats_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Generate enriched content for a cemetery using GPT-4o-mini
    Returns ~400 words of content across 4 sections
    """
    
    name = begraafplaats_data.get('naam', 'Onbekende begraafplaats')
    gemeente = begraafplaats_data.get('gemeente', '')
    provincie = begraafplaats_data.get('provincie', '')
    type_begraafplaats = begraafplaats_data.get('type', 'algemene begraafplaats')
    
    # Extract any scraped content if available
    scraped_content = begraafplaats_data.get('scraped_content', {})
    geschiedenis = scraped_content.get('geschiedenis', '')
    faciliteiten = scraped_content.get('faciliteiten', '')
    
    prompt = f"""
Je bent een professionele content writer voor BegraafplaatsInDeBuurt.nl, een informatieve website over begraafplaatsen in Nederland.

Schrijf unieke, informatieve content voor de volgende begraafplaats:
- Naam: {name}
- Gemeente: {gemeente}
- Provincie: {provincie}
- Type: {type_begraafplaats}
{f"- Geschiedenis info: {geschiedenis[:200]}..." if geschiedenis else ""}
{f"- Faciliteiten: {faciliteiten[:200]}..." if faciliteiten else ""}

Genereer content voor deze 4 secties (totaal ~400 woorden):

1. **introductie** (100-120 woorden):
   - Welkom en algemene introductie van de begraafplaats
   - Locatie en bereikbaarheid
   - Korte historie of betekenis voor de gemeenschap

2. **geschiedenis** (80-100 woorden):
   - Wanneer opgericht (schat indien onbekend, bijv. "meer dan 100 jaar")
   - Historische betekenis
   - Bijzondere monumenten of graven (indien van toepassing)

3. **diensten** (100-120 woorden):
   - Beschikbare diensten (begrafenis, crematie, urnenmuur, etc.)
   - Onderhoud en verzorging
   - Mogelijkheden voor nabestaanden
   - Openingstijden indicatie

4. **praktisch** (80-100 woorden):
   - Bereikbaarheid en parkeren
   - Contact mogelijkheden
   - Toegankelijkheid
   - Tips voor bezoekers

Schrijfstijl:
- Respectvol en informatief
- Gebruik Nederlandse spelling
- Vermijd clichés
- Focus op praktische informatie
- Maak het locatie-specifiek

Output format: JSON object met keys "introductie", "geschiedenis", "diensten", "praktisch"
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Je bent een professionele content writer. Genereer alleen de gevraagde JSON output zonder extra uitleg."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Parse JSON response
        if content.startswith('```json'):
            content = content[7:]
        if content.endswith('```'):
            content = content[:-3]
            
        enriched_data = json.loads(content)
        
        # Add metadata
        enriched_data['metadata'] = {
            'generated_at': datetime.now().isoformat(),
            'model': 'gpt-4o-mini',
            'word_count': sum(len(text.split()) for text in enriched_data.values() if isinstance(text, str))
        }
        
        return enriched_data
        
    except Exception as e:
        print(f"Error generating content for {name}: {str(e)}")
        return None

def process_begraafplaats(slug: str, begraafplaats_data: Dict[str, Any], progress: Dict[str, Any]) -> bool:
    """Process a single cemetery"""
    
    # Skip if already processed
    if slug in progress['processed']:
        return True
        
    # Check if enrichment already exists
    enrichment_file = ENRICHMENTS_DIR / f"{slug}.json"
    if enrichment_file.exists():
        print(f"Skipping {slug} - already enriched")
        progress['processed'].append(slug)
        return True
    
    print(f"Processing {slug}...")
    
    # Generate content
    enriched_content = generate_begraafplaats_content(begraafplaats_data)
    
    if enriched_content:
        # Save enrichment
        with open(enrichment_file, 'w') as f:
            json.dump({
                'slug': slug,
                'original_data': begraafplaats_data,
                'enrichment': enriched_content
            }, f, indent=2, ensure_ascii=False)
        
        progress['processed'].append(slug)
        progress['total_processed'] += 1
        print(f"✓ Successfully enriched {slug} ({enriched_content['metadata']['word_count']} words)")
        return True
    else:
        progress['failed'].append(slug)
        print(f"✗ Failed to enrich {slug}")
        return False

def main():
    """Main processing function"""
    print("=== Begraafplaats Content Enrichment Script ===")
    print(f"Using model: gpt-4o-mini")
    print(f"Target: ~400 words per begraafplaats")
    print()
    
    # Load progress
    progress = load_progress()
    print(f"Previously processed: {progress['total_processed']} begraafplaatsen")
    
    # Voor dit template: verwacht een begraafplaatsen.json bestand
    # Dit zou gegenereerd moeten worden uit je CSV/database
    begraafplaatsen_file = DATA_DIR / "begraafplaatsen.json"
    
    if not begraafplaatsen_file.exists():
        print(f"Error: {begraafplaatsen_file} not found")
        print("First, create a JSON file with cemetery data")
        sys.exit(1)
    
    with open(begraafplaatsen_file, 'r') as f:
        begraafplaatsen = json.load(f)
    
    total = len(begraafplaatsen)
    print(f"Found {total} begraafplaatsen to process")
    print()
    
    # Process in batches
    batch_size = 10
    batch_count = 0
    
    for i in range(0, total, batch_size):
        batch = list(begraafplaatsen.items())[i:i+batch_size]
        batch_count += 1
        
        print(f"\n--- Batch {batch_count} ({i+1}-{min(i+batch_size, total)} of {total}) ---")
        
        for slug, data in batch:
            success = process_begraafplaats(slug, data, progress)
            
            # Save progress after each item
            save_progress(progress)
            
            # Rate limiting
            if success:
                time.sleep(1)  # Respect API rate limits
        
        print(f"\nBatch {batch_count} complete. Total processed: {progress['total_processed']}")
        
        # Longer pause between batches
        if i + batch_size < total:
            print("Pausing between batches...")
            time.sleep(5)
    
    # Final report
    print("\n=== Final Report ===")
    print(f"Total processed: {progress['total_processed']}")
    print(f"Failed: {len(progress['failed'])}")
    if progress['failed']:
        print(f"Failed slugs: {', '.join(progress['failed'][:10])}...")
    
    print("\nEnrichment complete!")

if __name__ == "__main__":
    main()