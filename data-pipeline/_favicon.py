#!/usr/bin/env python3
"""Process logo-favicon: remove dark bg, watermark, save as favicon SVG+PNG."""
from PIL import Image
import os

SRC = "/Users/dylanszejnblum/Documents/minerals/images"
FRONTEND_PUBLIC = "/Users/dylanszejnblum/Documents/minerals/frontend/public"

in_path = os.path.join(SRC, "logo-favicon.png")

with Image.open(in_path) as img:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    print(f"logo-favicon.png: {w}x{h}")

    # Remove dark background (threshold 55)
    dark_count = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r < 55 and g < 55 and b < 55:
                pixels[x, y] = (0, 0, 0, 0)
                dark_count += 1
    
    print(f"  Dark bg pixels removed: {dark_count}")

    # Remove watermark from bottom-right
    wm_count = 0
    for y in range(h - 180, h):
        for x in range(w - 400, w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            brightness = (r + g + b) / 3
            if 55 < brightness < 220:
                dark_neighbors = 0
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h:
                            nr, ng, nb, na = pixels[nx, ny]
                            if (nr + ng + nb) / 3 < 55:
                                dark_neighbors += 1
                if dark_neighbors >= 4:
                    pixels[x, y] = (0, 0, 0, 0)
                    wm_count += 1
    
    print(f"  Watermark pixels removed: {wm_count}")

    # Save cleaned PNG to public
    out_png = os.path.join(FRONTEND_PUBLIC, "favicon.png")
    img.save(out_png, "PNG")
    print(f"\n  → {out_png}")

    # Generate favicon.ico (32x32)
    ico = img.resize((32, 32), Image.LANCZOS)
    out_ico = os.path.join(FRONTEND_PUBLIC, "favicon.ico")
    ico.save(out_ico, "ICO", sizes=[(32, 32)])
    print(f"  → {out_ico}")

    # Generate apple-touch-icon (180x180)
    apple = img.resize((180, 180), Image.LANCZOS)
    out_apple = os.path.join(FRONTEND_PUBLIC, "apple-touch-icon.png")
    apple.save(out_apple, "PNG")
    print(f"  → {out_apple}")

print("\nDone. Update layout.tsx to use the new favicon files.")
