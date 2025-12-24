#!/usr/bin/env python3
"""Simple enrichment script with hardcoded API key"""
import json
import os
import sys
import time
from pathlib import Path
import openai
from datetime import datetime

# HARDCODED API KEY
OPENAI_API_KEY = "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"

print(f"Using API key: {OPENAI_API_KEY[:20]}...{OPENAI_API_KEY[-20:]}")

client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Test the API
try:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Say hello"}],
        max_tokens=10
    )
    print("✅ API key is working!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"❌ API error: {e}")
    sys.exit(1)

print("\nReady to start enrichment? Press Ctrl+C to cancel, or wait 3 seconds...")
time.sleep(3)

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
ENRICHMENTS_DIR = DATA_DIR / "enrichments-begraafplaatsen"
ENRICHMENTS_DIR.mkdir(parents=True, exist_ok=True)

# Load cemetery data
begraafplaatsen_file = DATA_DIR / "begraafplaatsen.json"
with open(begraafplaatsen_file, 'r') as f:
    all_begraafplaatsen = json.load(f)

# Process first 10 as test
test_items = list(all_begraafplaatsen.items())[:10]
print(f"\nProcessing {len(test_items)} test items...")

for slug, data in test_items:
    print(f"\nProcessing: {data['naam']} ({data['gemeente']})")
    
    # Check if already exists
    enrichment_file = ENRICHMENTS_DIR / f"{slug}.json"
    if enrichment_file.exists():
        print("  ⏭ Already enriched, skipping")
        continue
    
    # Generate content
    prompt = f"""
Schrijf 400 woorden unieke content voor begraafplaats {data['naam']} in {data['gemeente']}, {data['provincie']}.

Genereer deze 4 secties:
1. introductie (100-120 woorden)
2. geschiedenis (80-100 woorden)  
3. diensten (100-120 woorden)
4. praktisch (80-100 woorden)

Output: JSON met keys "introductie", "geschiedenis", "diensten", "praktisch"
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Je bent een content writer. Output alleen JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1200
        )
        
        content = response.choices[0].message.content.strip()
        if content.startswith('```json'):
            content = content[7:-3]
        
        enriched_data = json.loads(content)
        
        # Save
        with open(enrichment_file, 'w') as f:
            json.dump({
                'slug': slug,
                'original_data': data,
                'enrichment': enriched_data,
                'metadata': {
                    'generated_at': datetime.now().isoformat(),
                    'model': 'gpt-4o-mini'
                }
            }, f, indent=2, ensure_ascii=False)
        
        print("  ✅ Enriched successfully!")
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    time.sleep(1)  # Rate limiting

print("\n✅ Test complete! If everything worked, you can modify this script to process all items.")