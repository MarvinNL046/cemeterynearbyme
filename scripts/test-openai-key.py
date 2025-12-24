#!/usr/bin/env python3
"""Test OpenAI API key"""
import os
from dotenv import load_dotenv
import openai

# Load environment
load_dotenv('.env.openai')

# Get API key
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    print("❌ No API key found in .env.openai")
    exit(1)

print(f"🔑 API Key: {api_key[:7]}...{api_key[-4:]}")

# Test the key
try:
    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Say hello"}],
        max_tokens=10
    )
    print("✅ API key is valid!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"❌ API key error: {e}")