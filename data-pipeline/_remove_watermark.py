#!/usr/bin/env python3
"""Find and remove watermark from bottom-right of all 12 images."""
from PIL import Image
import os

SRC = "/Users/dylanszejnblum/Documents/minerals/images"

for f in sorted(os.listdir(SRC)):
    if not f.lower().endswith((".jpg", ".jpeg")):
        continue

    in_path = os.path.join(SRC, f)
    name = os.path.splitext(f)[0]
    out_path = os.path.join(SRC, f"{name}.png")

    with Image.open(in_path) as img:
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        pixels = img.load()
        w, h = img.size

        # Scan bottom-right 400x200 area for watermark pixels
        # Watermark is typically lighter text on dark bg
        # We'll replace any non-dark pixel in that region with transparency
        watermark_count = 0
        for y in range(h - 180, h):
            for x in range(w - 400, w):
                r, g, b, a = pixels[x, y]
                brightness = (r + g + b) / 3
                # If pixel is notably brighter than the dark background
                # and isn't pure white (which would be content)
                if 55 < brightness < 220:
                    # Check neighbors — watermarks are usually isolated text
                    # Count dark neighbors to confirm it's a watermark element
                    dark_neighbors = 0
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < w and 0 <= ny < h:
                                nr, ng, nb, _ = pixels[nx, ny]
                                if (nr + ng + nb) / 3 < 55:
                                    dark_neighbors += 1
                    # If surrounded by dark pixels, it's likely watermark text
                    if dark_neighbors >= 4:
                        # Blend into background by making transparent
                        pixels[x, y] = (0, 0, 0, 0)
                        watermark_count += 1

        # Also apply the dark background removal from before
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                if a == 0:
                    continue  # already transparent
                if r < 55 and g < 55 and b < 55:
                    pixels[x, y] = (0, 0, 0, 0)

        img.save(out_path, "PNG")
        old = os.path.getsize(in_path)
        new = os.path.getsize(out_path)
        print(f"  {f:8s} → {name}.png ({old//1024}K → {new//1024}K, watermark pixels removed: {watermark_count})")

print("\nDone — all images cleaned.")
