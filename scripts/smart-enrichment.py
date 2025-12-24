#!/usr/bin/env python3
"""
Smart Enrichment Script - Gebruikt scraped data waar beschikbaar
Voor begraafplaatsen zonder scraped data genereert het toch content
"""

import json
import os
import sys
import time
import logging
from typing import Dict, Any, Optional, List
from pathlib import Path
import openai
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / '.env.openai')

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
PROGRESS_FILE = DATA_DIR / "progress-logs" / "smart-enrichment-progress.json"
LOG_FILE = DATA_DIR / "progress-logs" / "smart-enrichment.log"

# Ensure directories exist
ENRICHMENTS_DIR.mkdir(parents=True, exist_ok=True)
(DATA_DIR / "progress-logs").mkdir(parents=True, exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_scraped_data(slug: str) -> Optional[Dict[str, Any]]:
    """Load scraped data if available"""
    scraped_file = SCRAPED_DIR / f"{slug}.json"
    if scraped_file.exists():
        try:
            with open(scraped_file, 'r') as f:
                data = json.load(f)
                if data.get('scraped', {}).get('hasWebsite'):
                    return data
        except Exception as e:
            logger.warning(f"Error loading scraped data for {slug}: {e}")
    return None

def generate_enriched_content(begraafplaats_data: Dict[str, Any], scraped_data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    """Generate content with or without scraped data"""
    
    name = begraafplaats_data.get('naam', 'Onbekende begraafplaats')
    gemeente = begraafplaats_data.get('gemeente', '')
    provincie = begraafplaats_data.get('provincie', '')
    type_begraafplaats = begraafplaats_data.get('type', 'algemene begraafplaats')
    
    # Extract scraped content if available
    scraped_content = ""
    if scraped_data and scraped_data.get('scraped', {}).get('content'):
        content = scraped_data['scraped']['content']
        scraped_parts = []
        
        if content.get('openingstijden'):
            scraped_parts.append(f"Openingstijden: {content['openingstijden'][:200]}")
        if content.get('diensten'):
            scraped_parts.append(f"Diensten: {content['diensten'][:200]}")
        if content.get('geschiedenis'):
            scraped_parts.append(f"Geschiedenis: {content['geschiedenis'][:200]}")
        if content.get('faciliteiten'):
            scraped_parts.append(f"Faciliteiten: {content['faciliteiten'][:200]}")
        if content.get('contact'):
            scraped_parts.append(f"Contact: {content['contact'][:200]}")
            
        scraped_content = "\n".join(scraped_parts)
    
    # Create prompt
    prompt = f"""
Je bent een professionele content writer voor BegraafplaatsInDeBuurt.nl.

Begraafplaats informatie:
- Naam: {name}
- Gemeente: {gemeente}
- Provincie: {provincie}
- Type: {type_begraafplaats}

{f"Actuele informatie van de website:\n{scraped_content}\n" if scraped_content else ""}

Schrijf unieke, SEO-geoptimaliseerde content voor deze 4 secties (totaal 400-450 woorden):

1. **introductie** (100-120 woorden):
   - Warme welkomstboodschap specifiek voor {name}
   - Ligging in {gemeente}, {provincie}
   - Unieke kenmerken of sfeer
   - Waarom mensen deze begraafplaats kiezen

2. **geschiedenis** (80-100 woorden):
   - Ontstaan en historische ontwikkeling
   - Culturele of religieuze betekenis
   - Bijzondere monumenten of historische graven
   - Rol in de lokale gemeenschap

3. **diensten** (100-120 woorden):
   - Begrafenis en bijzettingsmogelijkheden
   - Onderhoud van graven
   - Ceremoniele voorzieningen
   - Begeleiding voor nabestaanden
   - {f"Gebruik deze actuele info: {scraped_data.get('scraped', {}).get('content', {}).get('diensten', '')[:100]}" if scraped_data and scraped_data.get('scraped', {}).get('content', {}).get('diensten') else "Algemene diensten"}

4. **praktisch** (80-100 woorden):
   - {f"Actuele openingstijden: {scraped_data.get('scraped', {}).get('content', {}).get('openingstijden', 'Dagelijks toegankelijk')}" if scraped_data and scraped_data.get('scraped', {}).get('content', {}).get('openingstijden') else "Openingstijden (meestal dagelijks van zonsopgang tot zonsondergang)"}
   - Bereikbaarheid en parkeren
   - Contact mogelijkheden
   - Tips voor bezoekers

Belangrijk:
- Maak de content uniek en specifiek voor {gemeente}
- Gebruik natuurlijke, empathische taal
- Integreer de gemeente naam minimaal 3x natuurlijk
- Wees respectvol en professioneel

Output: JSON object met keys "introductie", "geschiedenis", "diensten", "praktisch"
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Je bent een empathische content writer gespecialiseerd in begraafplaatsen. Genereer alleen JSON."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1200,
            top_p=0.95
        )
        
        content = response.choices[0].message.content.strip()
        
        # Clean JSON response
        if content.startswith('```json'):
            content = content[7:]
        if content.endswith('```'):
            content = content[:-3]
        
        enriched_data = json.loads(content)
        
        # Calculate word count
        total_words = sum(len(text.split()) for text in enriched_data.values() if isinstance(text, str))
        
        # Add metadata
        enriched_data['metadata'] = {
            'generated_at': datetime.now().isoformat(),
            'model': 'gpt-4o-mini',
            'word_count': total_words,
            'has_scraped_data': bool(scraped_data),
            'data_source': 'scraped + AI' if scraped_data else 'AI only'
        }
        
        return enriched_data
        
    except Exception as e:
        logger.error(f"Error generating content for {name}: {str(e)}")
        return None

def process_begraafplaats(item: tuple) -> tuple:
    """Process a single cemetery"""
    slug, begraafplaats_data = item
    
    # Check if already enriched
    enrichment_file = ENRICHMENTS_DIR / f"{slug}.json"
    if enrichment_file.exists():
        return (slug, True, 0, "already_exists")
    
    # Load scraped data if available
    scraped_data = load_scraped_data(slug)
    
    # Generate content
    enriched_content = generate_enriched_content(begraafplaats_data, scraped_data)
    
    if enriched_content:
        try:
            with open(enrichment_file, 'w') as f:
                json.dump({
                    'slug': slug,
                    'original_data': begraafplaats_data,
                    'scraped_data_used': bool(scraped_data),
                    'enrichment': enriched_content
                }, f, indent=2, ensure_ascii=False)
            
            word_count = enriched_content['metadata']['word_count']
            status = "success_with_scrape" if scraped_data else "success_no_scrape"
            return (slug, True, word_count, status)
        except Exception as e:
            return (slug, False, 0, f"save_error: {str(e)}")
    else:
        return (slug, False, 0, "generation_failed")

def main():
    """Main processing function"""
    logger.info("=== Smart Enrichment Script ===")
    logger.info("Uses scraped data where available, generates content for all")
    
    # Load cemetery data
    begraafplaatsen_file = DATA_DIR / "begraafplaatsen.json"
    if not begraafplaatsen_file.exists():
        logger.error(f"Error: {begraafplaatsen_file} not found")
        sys.exit(1)
    
    with open(begraafplaatsen_file, 'r') as f:
        all_begraafplaatsen = json.load(f)
    
    # Check scraped data availability
    scraped_files = list(SCRAPED_DIR.glob("*.json")) if SCRAPED_DIR.exists() else []
    logger.info(f"Found {len(scraped_files)} scraped files")
    
    # Filter out already processed
    remaining = [(slug, data) for slug, data in all_begraafplaatsen.items() 
                 if not (ENRICHMENTS_DIR / f"{slug}.json").exists()]
    
    total_remaining = len(remaining)
    logger.info(f"Remaining to process: {total_remaining} pages")
    logger.info(f"Estimated cost: €{total_remaining * 0.002:.2f}")
    
    if total_remaining == 0:
        logger.info("All pages already enriched!")
        return
    
    # Process with concurrent workers
    max_workers = 5
    batch_size = 50
    
    stats = {
        'processed': 0,
        'with_scrape': 0,
        'without_scrape': 0,
        'failed': 0,
        'total_words': 0
    }
    
    # Process in batches
    for batch_start in range(0, total_remaining, batch_size):
        batch_end = min(batch_start + batch_size, total_remaining)
        batch = remaining[batch_start:batch_end]
        
        logger.info(f"\nProcessing batch {batch_start//batch_size + 1} ({batch_start+1}-{batch_end} of {total_remaining})")
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(process_begraafplaats, item): item for item in batch}
            
            for future in as_completed(futures):
                slug, success, word_count, status = future.result()
                
                if success:
                    if status == "success_with_scrape":
                        stats['with_scrape'] += 1
                        logger.info(f"✓ {slug} ({word_count} words) - WITH scraped data")
                    elif status == "success_no_scrape":
                        stats['without_scrape'] += 1
                        logger.info(f"✓ {slug} ({word_count} words) - AI only")
                    else:
                        logger.info(f"⏭ {slug} - already exists")
                    
                    if word_count > 0:
                        stats['processed'] += 1
                        stats['total_words'] += word_count
                else:
                    stats['failed'] += 1
                    logger.error(f"✗ {slug} - {status}")
        
        logger.info(f"Batch complete. Progress: {stats['processed']} new enrichments")
        
        # Rate limiting between batches
        if batch_end < total_remaining:
            time.sleep(3)
    
    # Final report
    logger.info("\n=== FINAL REPORT ===")
    logger.info(f"Total enriched: {stats['processed']}")
    logger.info(f"  - With scraped data: {stats['with_scrape']}")
    logger.info(f"  - AI only: {stats['without_scrape']}")
    logger.info(f"Failed: {stats['failed']}")
    logger.info(f"Total words generated: {stats['total_words']:,}")
    if stats['processed'] > 0:
        logger.info(f"Average words per page: {stats['total_words']/stats['processed']:.0f}")
    logger.info(f"Total cost: €{stats['processed'] * 0.002:.2f}")
    
    # Check final coverage
    total_enriched = len(list(ENRICHMENTS_DIR.glob("*.json")))
    total_cemeteries = len(all_begraafplaatsen)
    coverage = (total_enriched / total_cemeteries) * 100
    
    logger.info(f"\n✅ Content Coverage: {total_enriched}/{total_cemeteries} ({coverage:.1f}%)")
    if coverage >= 100:
        logger.info("🎉 100% COVERAGE ACHIEVED! Ready for AdSense!")

if __name__ == "__main__":
    main()