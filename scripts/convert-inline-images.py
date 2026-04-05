#!/usr/bin/env python3
"""Bulk convert blog inline PNG images to WebP and update MDX frontmatter."""
import os
import re
import sys
from pathlib import Path
from PIL import Image

ROOT = Path("/home/prime/.openclaw/workspace/arcana-vault")
IMG_DIR = ROOT / "public/images/blog"
MDX_DIR = ROOT / "content/blog"

# ─── Step 1: Find all inline PNG images (not covers) ───────────────────────────
png_files = list(IMG_DIR.glob("*/image-*.png"))
print(f"Found {len(png_files)} inline PNG files")

# ─── Step 2: Convert each PNG → WebP (quality 82, preserve dimensions) ────────
converted = 0
failed = []

for png_path in png_files:
    webp_path = png_path.with_suffix(".webp")
    # Skip if already exists
    if webp_path.exists():
        print(f"  SKIP (exists): {webp_path.name}")
        continue
    try:
        img = Image.open(png_path).convert("RGBA")
        img.save(webp_path, "WEBP", quality=82, method=6)
        original_size = os.path.getsize(png_path)
        new_size = os.path.getsize(webp_path)
        saving = original_size - new_size
        print(f"  OK {webp_path.name}: {original_size//1024}KB → {new_size//1024}KB (saved {saving//1024}KB)")
        converted += 1
    except Exception as e:
        failed.append(str(png_path))
        print(f"  FAIL {png_path.name}: {e}")

print(f"\nConverted: {converted}, Failed: {len(failed)}")
if failed:
    print("FAILED files:", failed)

# ─── Step 3: Update MDX frontmatter image src from .png → .webp ───────────────
mdx_files = list(MDX_DIR.glob("*.mdx"))
updated_mdx = 0

for mdx_path in mdx_files:
    with open(mdx_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the images: YAML block
    # Replace src: "/images/blog/.../image-N.png" → src: "...image-N.webp"
    original = content
    content = re.sub(
        r'(src:\s*"/images/blog/[^"]+/image-\d+)\.png"',
        r'\1.webp"',
        content
    )
    # Also handle single-quoted YAML values
    content = re.sub(
        r"(src:\s*'/images/blog/[^']+/image-\d+)\.png'",
        r"\1.webp'",
        content
    )

    if content != original:
        with open(mdx_path, "w", encoding="utf-8") as f:
            f.write(content)
        updated_mdx += 1
        print(f"Updated MDX: {mdx_path.name}")

print(f"\nUpdated {updated_mdx} MDX files")
print("Done.")
