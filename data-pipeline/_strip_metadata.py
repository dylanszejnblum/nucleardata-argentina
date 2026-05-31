#!/usr/bin/env python3
"""Remove AI-generated metadata from opengraph images."""
from PIL import Image
import os

src = "/Users/dylanszejnblum/Documents/minerals/frontend/public"
files = ["opengraph-image.png", "opengraph-image.webp"]

for f in files:
    path = os.path.join(src, f)
    if not os.path.exists(path):
        print(f"  {f}: not found")
        continue
    
    with Image.open(path) as img:
        print(f"  {f}: {img.size} mode={img.mode}")
        print(f"    Metadata before: {list(img.info.keys())}")
        for k, v in img.info.items():
            val = v[:150] if isinstance(v, (str, bytes)) else v
            print(f"      {k}: {val}")
    
    # Re-save without metadata
    with Image.open(path) as img:
        rgb = img.convert("RGB") if img.mode == "RGBA" else img
        rgb.save(path, format=img.format, optimize=True)
    
    with Image.open(path) as img:
        print(f"    Metadata after: {list(img.info.keys())}")
    print()
