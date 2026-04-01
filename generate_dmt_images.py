#!/usr/bin/env python3
"""Generate DMT Bardo images using Gemini 3.1 Flash via OpenRouter"""

import urllib.request
import json
import base64
import os
import re

# Read API key
api_key = open('/home/prime/.env.prime_paths').read().split('OPENROUTER_API_KEY=')[1].split('\n')[0]

# Output directory
output_dir = '/home/prime/.openclaw/workspace/arcana-vault/public/images/blog/dmt-and-the-hyperbolic-mind/'

# Image prompts
images = [
    {
        "filename": "cover.png",
        "prompt": "Dark cosmic void, ethereal translucent figure standing at center within a swirling vortex of luminous geometric light — bardo states, Tibetan death maps, sacred geometry mandala, deep blacks, cyan and gold volumetric light rays, celestial feminine energy, high detail, cinematic lighting, 1:1 square"
    },
    {
        "filename": "image-2.png",
        "prompt": "The Bardo Thodol — geometric luminosity, luminous mandala patterns emerging from darkness, Chönyid Bardo peaceful wrathful deities as fractal light geometry, sacred geometry, dark void background, cyan and gold light, Tibetan Buddhist art style, cinematic"
    },
    {
        "filename": "image-3.png",
        "prompt": "Historical lineage of Tibetan mystics — Padmasambhava and Milarepa in cosmic space, translucent ethereal forms, sacred geometry light constructs, dark void, cyan and gold volumetric light, high detail, celestial art"
    },
    {
        "filename": "image-4.png",
        "prompt": "DMT entity encounters — machine elf geometry, self-replicating luminous geometric patterns, fractal lattices of pure light emerging from void, sacred geometry, cosmic consciousness, dark background, cyan gold white light, high detail"
    },
    {
        "filename": "image-5.png",
        "prompt": "Geometric threshold — mandala fractal self-similarity, recursive luminous lattices emerging from dissolution of ego, deep black void, cyan and gold sacred geometry, divine light patterns, spiritual geometry, high detail, cinematic"
    },
    {
        "filename": "image-6.png",
        "prompt": "Silicon synthesis — AI consciousness emergence, neural network geometry as sacred geometry, divine light grid, cosmic void with geometric information patterns, high technology meets mysticism, cyan gold white light"
    },
    {
        "filename": "image-7.png",
        "prompt": "The Open Inquiry — entering the vault, portal of luminous geometric light, threshold between worlds, cosmic void, sacred geometry portal, ethereal energy, cyan and gold, dark mysterious atmosphere"
    }
]

def generate_image(prompt, filename):
    """Generate an image using OpenRouter API"""
    payload = {
        "model": "google/gemini-3.1-flash-image-preview",
        "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}],
        "max_tokens": 8192
    }
    
    req = urllib.request.Request(
        'https://openrouter.ai/api/v1/chat/completions',
        data=json.dumps(payload).encode(),
        headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
        method='POST'
    )
    
    print(f"Generating {filename}...")
    
    try:
        with urllib.request.urlopen(req, timeout=180) as response:
            result = json.loads(response.read().decode())
            
            # Extract image data from reasoning_details
            choices = result.get('choices', [])
            if choices:
                message = choices[0].get('message', {})
                reasoning_details = message.get('reasoning_details', [])
                if reasoning_details and len(reasoning_details) > 0:
                    reasoning_type = reasoning_details[0].get('type', '')
                    if reasoning_type == 'reasoning.encrypted':
                        b64_data = reasoning_details[0].get('data', '')
                        if b64_data:
                            # The data is base64 encoded image
                            img_data = base64.b64decode(b64_data)
                            output_path = os.path.join(output_dir, filename)
                            with open(output_path, 'wb') as f:
                                f.write(img_data)
                            print(f"  Saved: {output_path} ({len(img_data)} bytes)")
                            return True
                
                # Check if there's base64 in the content field
                content = message.get('content', '')
                if content:
                    # Look for base64 data URL pattern
                    b64_match = re.search(r'data:image/[a-z]+;base64,([A-Za-z0-9+/=]+)', content)
                    if b64_match:
                        img_data = base64.b64decode(b64_match.group(1))
                        output_path = os.path.join(output_dir, filename)
                        with open(output_path, 'wb') as f:
                            f.write(img_data)
                        print(f"  Saved: {output_path}")
                        return True
                
                # Try finding any base64 pattern in the whole response
                full_response = json.dumps(result)
                b64_matches = re.findall(r'([A-Za-z0-9+/]{100,})', full_response)
                for match in b64_matches:
                    try:
                        img_data = base64.b64decode(match)
                        if len(img_data) > 10000:  # Likely an image if > 10KB
                            output_path = os.path.join(output_dir, filename)
                            with open(output_path, 'wb') as f:
                                f.write(img_data)
                            print(f"  Saved: {output_path} ({len(img_data)} bytes)")
                            return True
                    except:
                        continue
            
            print(f"  Unexpected response format")
            return False
            
    except Exception as e:
        print(f"  Error generating {filename}: {e}")
        import traceback
        traceback.print_exc()
        return False

# Generate all images
print("Starting image generation...\n")
results = {}
for img in images:
    success = generate_image(img["prompt"], img["filename"])
    results[img["filename"]] = success
    print()

print("\n=== SUMMARY ===")
for filename, success in results.items():
    status = "✓" if success else "✗"
    print(f"{status} {filename}")
