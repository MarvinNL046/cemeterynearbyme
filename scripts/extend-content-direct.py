#!/usr/bin/env python3
"""
Extend enriched content to 400+ words per cemetery page
Direct API key version
"""

import json
import os
import time
from datetime import datetime
from openai import OpenAI

# Direct API key
API_KEY = "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"

# Initialize OpenAI client
client = OpenAI(api_key=API_KEY)

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

OPDRACHT:
Schrijf een VOLLEDIG NIEUWE versie van de content die MINIMAAL 400 woorden bevat.
Behoud de essentie van de originele content maar breid uit met:

1. Meer details over de geschiedenis en ontstaan
2. Beschrijving van architectuur en monumenten
3. Informatie over de natuur en omgeving
4. Praktische bezoekersinformatie
5. Culturele en maatschappelijke betekenis

BELANGRIJKE RICHTLIJNEN:
- Schrijf een vloeiende, samenhangende tekst
- Gebruik concrete details en voorbeelden
- Respectvolle, warme toon
- MINIMAAL 400 woorden (liever 450-500)
- Geen bullet points, alleen doorlopende tekst

Output: Geef alleen de nieuwe content terug (400+ woorden).
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Je bent een professionele content schrijver gespecialiseerd in Nederlandse begraafplaatsen. Schrijf altijd uitgebreide, informatieve content van minimaal 400 woorden."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
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
    
    # Start from where we left off - you can adjust this number
    start_index = 0  # Change this if you want to resume from a specific point
    
    for i in range(start_index, total_files, batch_size):
        batch = files[i:i+batch_size]
        print(f"\nProcessing batch {(i-start_index)//batch_size + 1} ({i+1}-{min(i+batch_size, total_files)} of {total_files})")
        
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
                
                # Rate limiting - GPT-4o-mini has 500 RPM limit
                time.sleep(0.2)  # ~300 requests per minute to be safe
                
            except Exception as e:
                print(f"✗ Error processing {filename}: {str(e)}")
                error_count += 1
                continue
        
        # Pause between batches
        if i + batch_size < total_files:
            print(f"\nPausing 5 seconds between batches...")
            time.sleep(5)
    
    # Summary
    print(f"\n{'='*50}")
    print(f"CONTENT EXTENSION COMPLETE")
    print(f"{'='*50}")
    print(f"Total files processed: {total_files - start_index}")
    print(f"Extended to 400+ words: {extended_count}")
    print(f"Already long enough: {already_long_count}")
    print(f"Errors: {error_count}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()