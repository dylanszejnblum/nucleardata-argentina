#!/usr/bin/env python3
"""Remove dark backgrounds from images — keeps all text/graphics intact.

Color-key approach: makes near-black pixels transparent so images work on
both dark and light backgrounds without cutting content.
"""
from PIL import Image
import os

SRC = "/Users/dylanszejnblum/Documents/minerals/images"
THRESHOLD = 55  # pixels darker than this become transparent

files = sorted([f for f in os.listdir(SRC) if f.lower().endswith((".jpg", ".jpeg"))])

for f in files:
    in_path = os.path.join(SRC, f)
    name = os.path.splitext(f)[0]
    out_path = os.path.join(SRC, f"{name}.png")

    with Image.open(in_path) as img:
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        pixels = img.load()
        w, h = img.size

        # Smart threshold: only pure/near-black pixels become transparent
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                if r < THRESHOLD and g < THRESHOLD and b < THRESHOLD:
                    pixels[x, y] = (0, 0, 0, 0)
                elif r < THRESHOLD and g < THRESHOLD:  # bluish blacks
                    if b < THRESHOLD + 10:
                        pixels[x, y] = (0, 0, 0, 0)
                elif r < THRESHOLD and b < THRESHOLD:  # greenish blacks
                    if g < THRESHOLD + 10:
                        pixels[x, y] = (0, 0, 0, 0)

        img.save(out_path, "PNG")
        old = os.path.getsize(in_path)
        new = os.path.getsize(out_path)
        print(f"  {f:8s} → {name}.png ({old//1024}K → {new//1024}K)")

print(f"\nDone — {len(files)} images with transparent backgrounds.")
