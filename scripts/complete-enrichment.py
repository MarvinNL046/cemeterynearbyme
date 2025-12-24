#!/usr/bin/env python3
"""
Complete Content Enrichment Script for BegraafplaatsInDeBuurt.nl
Optimized for completing remaining 3,128 cemetery pages efficiently
Target: AdSense approval with 100% content coverage
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
load_dotenv(Path(__file__).parent.parent / '.env.local')

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
LOG_FILE = DATA_DIR / "progress-logs" / "enrichment.log"

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

# Content templates for variety
INTRO_TEMPLATES = [
    "welkom_algemeen",
    "historisch_perspectief",
    "gemeenschap_focus",
    "rust_en_bezinning",
    "moderne_faciliteiten"
]

def load_progress() -> Dict[str, Any]:
    """Load progress tracking data"""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {
        "processed": [],
        "failed": [],
        "total_processed": 0,
        "total_words": 0,
        "start_time": datetime.now().isoformat(),
        "last_updated": None
    }

def save_progress(progress: Dict[str, Any]):
    """Save progress tracking data"""
    progress["last_updated"] = datetime.now().isoformat()
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)

def get_enrichment_prompt(begraafplaats_data: Dict[str, Any], template_style: str) -> str:
    """Generate varied prompts for content diversity"""
    
    name = begraafplaats_data.get('naam', 'Onbekende begraafplaats')
    gemeente = begraafplaats_data.get('gemeente', '')
    provincie = begraafplaats_data.get('provincie', '')
    type_begraafplaats = begraafplaats_data.get('type', 'algemene begraafplaats')
    
    # Base prompt with variations
    base_prompt = f"""
Je bent een professionele content writer voor BegraafplaatsInDeBuurt.nl.

Begraafplaats informatie:
- Naam: {name}
- Gemeente: {gemeente}
- Provincie: {provincie}
- Type: {type_begraafplaats}

Schrijf unieke, SEO-geoptimaliseerde content voor deze 4 secties (totaal 400-450 woorden):
"""

    # Add style-specific instructions
    style_instructions = {
        "welkom_algemeen": "Focus op een warme welkom en praktische informatie.",
        "historisch_perspectief": "Benadruk de historische context en erfgoed.",
        "gemeenschap_focus": "Leg nadruk op de rol in de gemeenschap.",
        "rust_en_bezinning": "Beschrijf de serene omgeving en mogelijkheden voor bezinning.",
        "moderne_faciliteiten": "Highlight moderne diensten en faciliteiten."
    }
    
    prompt = base_prompt + f"\nStijl aanwijzing: {style_instructions.get(template_style, style_instructions['welkom_algemeen'])}\n\n"
    
    prompt += """
1. **introductie** (100-120 woorden):
   - Unieke welkomstboodschap
   - Ligging en bereikbaarheid
   - Onderscheidende kenmerken

2. **geschiedenis** (80-100 woorden):
   - Ontstaan en ontwikkeling
   - Culturele of historische betekenis
   - Bijzondere elementen

3. **diensten** (100-120 woorden):
   - Begrafenis en bijzetting mogelijkheden
   - Onderhoud en verzorging
   - Ceremoniele opties
   - Bezoekersvoorzieningen

4. **praktisch** (80-100 woorden):
   - Openingstijden en toegankelijkheid
   - Parkeren en OV-bereikbaarheid
   - Contact en informatie
   - Tips voor bezoekers

Belangrijk:
- Maak de content uniek en specifiek voor deze locatie
- Gebruik natuurlijke, gevarieerde zinnen
- Integreer de gemeente en provincie naam organisch
- Optimaliseer voor zoektermen zoals "begraafplaats {gemeente}"

Output: JSON object met keys "introductie", "geschiedenis", "diensten", "praktisch"
"""
    
    return prompt

def generate_enriched_content(begraafplaats_data: Dict[str, Any], retry_count: int = 0) -> Optional[Dict[str, Any]]:
    """Generate enriched content with retry logic"""
    
    max_retries = 3
    if retry_count >= max_retries:
        return None
    
    # Select template style for variety
    template_style = INTRO_TEMPLATES[hash(begraafplaats_data['naam']) % len(INTRO_TEMPLATES)]
    prompt = get_enrichment_prompt(begraafplaats_data, template_style)
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Je bent een SEO-expert content writer. Genereer alleen de gevraagde JSON output."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,  # Higher for more variety
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
        
        # Validate word count
        total_words = sum(len(text.split()) for text in enriched_data.values() if isinstance(text, str))
        if total_words < 350:
            logger.warning(f"Content too short ({total_words} words), retrying...")
            return generate_enriched_content(begraafplaats_data, retry_count + 1)
        
        # Add metadata
        enriched_data['metadata'] = {
            'generated_at': datetime.now().isoformat(),
            'model': 'gpt-4o-mini',
            'word_count': total_words,
            'template_style': template_style
        }
        
        return enriched_data
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {str(e)}")
        return generate_enriched_content(begraafplaats_data, retry_count + 1)
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        time.sleep(2 ** retry_count)  # Exponential backoff
        return generate_enriched_content(begraafplaats_data, retry_count + 1)

def process_begraafplaats(item: tuple) -> tuple:
    """Process a single cemetery (thread-safe)"""
    slug, begraafplaats_data = item
    
    # Check if already enriched
    enrichment_file = ENRICHMENTS_DIR / f"{slug}.json"
    if enrichment_file.exists():
        return (slug, True, 0, "already_exists")
    
    # Generate content
    enriched_content = generate_enriched_content(begraafplaats_data)
    
    if enriched_content:
        # Save enrichment
        try:
            with open(enrichment_file, 'w') as f:
                json.dump({
                    'slug': slug,
                    'original_data': begraafplaats_data,
                    'enrichment': enriched_content
                }, f, indent=2, ensure_ascii=False)
            
            word_count = enriched_content['metadata']['word_count']
            return (slug, True, word_count, "success")
        except Exception as e:
            return (slug, False, 0, f"save_error: {str(e)}")
    else:
        return (slug, False, 0, "generation_failed")

def main():
    """Main processing function"""
    logger.info("=== Complete Content Enrichment for AdSense Approval ===")
    logger.info(f"Model: GPT-4o-mini | Target: 400+ words per page")
    
    # Load progress
    progress = load_progress()
    logger.info(f"Previously processed: {progress['total_processed']} pages")
    
    # Load cemetery data
    begraafplaatsen_file = DATA_DIR / "begraafplaatsen.json"
    if not begraafplaatsen_file.exists():
        logger.error(f"Error: {begraafplaatsen_file} not found")
        sys.exit(1)
    
    with open(begraafplaatsen_file, 'r') as f:
        all_begraafplaatsen = json.load(f)
    
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
    max_workers = 5  # Balanced for API rate limits
    batch_size = 50
    
    processed_count = 0
    failed_items = []
    total_words_generated = 0
    
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
                    if status == "success":
                        processed_count += 1
                        total_words_generated += word_count
                        progress['processed'].append(slug)
                        progress['total_processed'] += 1
                        progress['total_words'] += word_count
                        logger.info(f"✓ {slug} ({word_count} words)")
                    else:
                        logger.info(f"⏭ {slug} (already enriched)")
                else:
                    failed_items.append((slug, status))
                    progress['failed'].append(slug)
                    logger.error(f"✗ {slug} - {status}")
                
                # Save progress periodically
                if processed_count % 10 == 0:
                    save_progress(progress)
        
        # Batch complete
        logger.info(f"Batch complete. Total new enrichments: {processed_count}")
        save_progress(progress)
        
        # Rate limiting between batches
        if batch_end < total_remaining:
            logger.info("Pausing between batches...")
            time.sleep(5)
    
    # Final report
    logger.info("\n=== FINAL REPORT ===")
    logger.info(f"Total pages enriched: {processed_count}")
    logger.info(f"Total words generated: {total_words_generated:,}")
    logger.info(f"Average words per page: {total_words_generated/processed_count:.0f}" if processed_count > 0 else "N/A")
    logger.info(f"Failed enrichments: {len(failed_items)}")
    logger.info(f"Total cost: €{processed_count * 0.002:.2f}")
    
    if failed_items:
        logger.warning("\nFailed items:")
        for slug, reason in failed_items[:10]:
            logger.warning(f"  - {slug}: {reason}")
    
    # Calculate completion percentage
    total_pages = len(all_begraafplaatsen)
    enriched_pages = len([f for f in ENRICHMENTS_DIR.glob("*.json")])
    completion_pct = (enriched_pages / total_pages) * 100
    
    logger.info(f"\n✅ Content Coverage: {enriched_pages}/{total_pages} ({completion_pct:.1f}%)")
    
    if completion_pct >= 100:
        logger.info("🎉 ALL PAGES ENRICHED! Ready for AdSense application!")
    else:
        logger.info(f"📊 Still need {total_pages - enriched_pages} pages for 100% coverage")

if __name__ == "__main__":
    main()