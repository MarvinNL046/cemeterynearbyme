#!/usr/bin/env python3
"""
Extend enriched content to 400+ words per cemetery page
Following VindTandarts.nl success pattern
"""

import json
import os
import time
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv('.env.openai')

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def count_words(text):
    """Count words in text"""
    return len(text.split())

def extend_content(cemetery_data):
    """Extend content to 400+ words using GPT-4o-mini"""
    current_content = cemetery_data.get('content', '')
    current_word_count = count_words(current_content)
    
    # Skip if already long enough
    if current_word_count >= 400:
        print(f"✓ Already {current_word_count} words")
        return cemetery_data
    
    # Create prompt for content extension
    prompt = f"""
Je bent een professionele content schrijver voor BegraafplaatsInDeBuurt.nl.

BESTAANDE CONTENT ({current_word_count} woorden):
{current_content}

BEGRAAFPLAATS INFO:
- Naam: {cemetery_data.get('naam')}
- Gemeente: {cemetery_data.get('gemeente')}
- Provincie: {cemetery_data.get('provincie')}
- Type: {cemetery_data.get('type', 'algemeen')}
- Openingstijden: {cemetery_data.get('praktischeInfo', {}).get('openingstijden', 'Niet bekend')}

OPDRACHT:
Verleng de bestaande content naar MINIMAAL 400 woorden door de volgende secties toe te voegen:

1. **Historische betekenis** - Voeg informatie toe over:
   - De rol van de begraafplaats in de lokale geschiedenis
   - Belangrijke historische gebeurtenissen of periodes
   - Architectonische stijl en kenmerken

2. **Bekende personen en monumenten** - Beschrijf:
   - Eventuele bekende personen die er begraven liggen
   - Bijzondere grafmonumenten of kunstwerken
   - Oorlogsgraven of herdenkingsmonumenten

3. **Natuur en biodiversiteit** - Voeg toe:
   - Oude bomen en bijzondere plantensoorten
   - Dierenleven op de begraafplaats
   - Seizoensgebonden schoonheid

4. **Praktische tips voor bezoekers** - Uitgebreidere info over:
   - Beste tijden om te bezoeken
   - Wandelroutes op en rond de begraafplaats
   - Faciliteiten zoals bankjes, watervoorzieningen
   - Tips voor genealogisch onderzoek

BELANGRIJKE RICHTLIJNEN:
- Behoud de bestaande content volledig
- Voeg NIEUWE informatie toe, herhaal niet wat er al staat
- Schrijf in een warme, respectvolle toon
- Gebruik concrete details en voorbeelden
- Minimaal 400 woorden totaal
- Schrijf vloeiende, natuurlijke tekst zonder bullet points

Output: Geef alleen de volledige uitgebreide content terug (400+ woorden).
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Je bent een professionele content schrijver gespecialiseerd in Nederlandse begraafplaatsen."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        extended_content = response.choices[0].message.content.strip()
        extended_word_count = count_words(extended_content)
        
        if extended_word_count < 400:
            print(f"⚠ Content nog steeds te kort: {extended_word_count} woorden")
            # Try again with explicit instruction
            retry_prompt = f"{prompt}\n\nJe vorige poging had maar {extended_word_count} woorden. Zorg dat het MINIMAAL 400 woorden zijn!"
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Je bent een professionele content schrijver."},
                    {"role": "user", "content": retry_prompt}
                ],
                temperature=0.8,
                max_tokens=1200
            )
            extended_content = response.choices[0].message.content.strip()
            extended_word_count = count_words(extended_content)
        
        # Update cemetery data
        cemetery_data['content'] = extended_content
        cemetery_data['wordCount'] = extended_word_count
        cemetery_data['extendedAt'] = datetime.now().isoformat()
        
        print(f"✓ Extended from {current_word_count} to {extended_word_count} words")
        return cemetery_data
        
    except Exception as e:
        print(f"✗ Error extending content: {str(e)}")
        return cemetery_data

def main():
    """Process all enriched content files"""
    enriched_dir = 'data/enriched-content'
    
    # Get all JSON files
    files = [f for f in os.listdir(enriched_dir) if f.endswith('.json')]
    total_files = len(files)
    
    print(f"Found {total_files} enriched content files")
    print("Starting content extension to 400+ words...\n")
    
    # Process files in batches to avoid rate limits
    batch_size = 10
    extended_count = 0
    already_long_count = 0
    error_count = 0
    
    for i in range(0, total_files, batch_size):
        batch = files[i:i+batch_size]
        print(f"\nProcessing batch {i//batch_size + 1} ({i+1}-{min(i+batch_size, total_files)} of {total_files})")
        
        for filename in batch:
            filepath = os.path.join(enriched_dir, filename)
            print(f"\n{filename}:")
            
            try:
                # Read existing data
                with open(filepath, 'r', encoding='utf-8') as f:
                    cemetery_data = json.load(f)
                
                # Check current word count
                current_word_count = cemetery_data.get('wordCount', count_words(cemetery_data.get('content', '')))
                
                if current_word_count >= 400:
                    print(f"✓ Already has {current_word_count} words")
                    already_long_count += 1
                    continue
                
                # Extend content
                extended_data = extend_content(cemetery_data)
                
                # Save updated data
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(extended_data, f, ensure_ascii=False, indent=2)
                
                extended_count += 1
                
                # Rate limiting
                time.sleep(1)  # GPT-4o-mini has higher rate limits
                
            except Exception as e:
                print(f"✗ Error processing {filename}: {str(e)}")
                error_count += 1
                continue
        
        # Pause between batches
        if i + batch_size < total_files:
            print(f"\nPausing between batches...")
            time.sleep(5)
    
    # Summary
    print(f"\n{'='*50}")
    print(f"CONTENT EXTENSION COMPLETE")
    print(f"{'='*50}")
    print(f"Total files processed: {total_files}")
    print(f"Extended to 400+ words: {extended_count}")
    print(f"Already long enough: {already_long_count}")
    print(f"Errors: {error_count}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()