#!/usr/bin/env python3
"""Debug API response"""

import urllib.request
import json

api_key = open('/home/prime/.env.prime_paths').read().split('OPENROUTER_API_KEY=')[1].split('\n')[0]

payload = {
    "model": "google/gemini-3.1-flash-image-preview",
    "messages": [{"role": "user", "content": [{"type": "text", "text": "Dark cosmic void, ethereal translucent figure standing at center within a swirling vortex of luminous geometric light, sacred geometry mandala, deep blacks, cyan and gold volumetric light rays, high detail, cinematic lighting, 1:1 square"}]}],
    "max_tokens": 2048
}

req = urllib.request.Request(
    'https://openrouter.ai/api/v1/chat/completions',
    data=json.dumps(payload).encode(),
    headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
    method='POST'
)

print("Sending request...")
try:
    with urllib.request.urlopen(req, timeout=120) as response:
        result = json.loads(response.read().decode())
        print("\n=== FULL RESPONSE ===")
        print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
