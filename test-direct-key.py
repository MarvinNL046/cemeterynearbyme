#!/usr/bin/env python3
"""
Test OpenAI API key directly
"""

from openai import OpenAI

# Direct API key
api_key = "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"

try:
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    
    # Test with a simple completion
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say 'API key works!' in one word"}
        ],
        max_tokens=50
    )
    
    print(f"✅ Success! Response: {response.choices[0].message.content}")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")