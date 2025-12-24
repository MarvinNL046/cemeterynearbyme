#!/usr/bin/env python3
"""
Test content extension on a few files first
"""

import json
import os
import sys
import time
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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
    """Test on 3 files"""
    enriched_dir = 'data/enriched-content'
    
    # Test files
    test_files = [
        'a-a-kerkhof-deil.json',
        'abdij-begraafplaats-kerkrade.json',
        'algemene-begraafplaats-aagtdorp.json'
    ]
    
    print("Testing content extension on 3 files...\n")
    
    for filename in test_files:
        filepath = os.path.join(enriched_dir, filename)
        print(f"\nProcessing {filename}:")
        
        try:
            # Read existing data
            with open(filepath, 'r', encoding='utf-8') as f:
                cemetery_data = json.load(f)
            
            # Backup original
            backup_path = filepath.replace('.json', '_backup.json')
            with open(backup_path, 'w', encoding='utf-8') as f:
                json.dump(cemetery_data, f, ensure_ascii=False, indent=2)
            
            # Check current word count
            current_word_count = cemetery_data.get('wordCount', count_words(cemetery_data.get('content', '')))
            print(f"Current: {current_word_count} words")
            
            # Extend content
            extended_data = extend_content(cemetery_data)
            
            # Save updated data
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(extended_data, f, ensure_ascii=False, indent=2)
            
            # Show preview
            new_content = extended_data.get('content', '')
            print(f"Preview: {new_content[:200]}...")
            
            # Rate limiting
            time.sleep(2)
            
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            continue
    
    print("\n✓ Test complete! Check the files to verify quality.")

if __name__ == "__main__":
    main()