#!/usr/bin/env python3
"""Check remaining SIACAM and other export sources for destination data."""
import json, csv, urllib.request
from io import StringIO

# 1. Check if there's a more detailed export dataset in SIACAM
for name, url in [
    ("Exportaciones por sector", "https://www.mecon.gob.ar/dataset/Comercio/expo-mineria-por-sector.csv"),
    ("Balance comercial", "https://www.mecon.gob.ar/dataset/Comercio/balanza-comercial-mineria.csv"),
]:
    try:
        resp = urllib.request.urlopen(url, timeout=10)
        content = resp.read().decode("utf-8")
        first_lines = content.split("\n")[:3]
        print(f"=== {name} ===")
        for l in first_lines:
            print(f"  {l}")
        print()
    except Exception as e:
        print(f"{name}: {e}")

print()

# 2. Check INDEC Foreign Trade Statistics - try the main page
try:
    req = urllib.request.Request(
        "https://www.indec.gob.ar/indec/web/Institucional-Indec-BasesDeDatos-2",
        headers={"User-Agent": "Mozilla/5.0"}
    )
    resp = urllib.request.urlopen(req, timeout=15)
    html = resp.read().decode("utf-8")
    import re
    # Find links to comercio exterior datasets
    links = re.findall(r'href="([^"]*(?:comercio|intercambio)[^"]*\.(?:xls|xlsx|csv)[^"]*)"', html, re.IGNORECASE)
    for l in links[:5]:
        print(f"  INDEC: {l}")
except Exception as e:
    print(f"INDEC page: {e}")

print()

# 3. Try World Bank API for Argentina exports by commodity group
try:
    # Get Argentina's top exports by HS section
    url = "https://api.worldbank.org/v2/country/AR/indicator/TX.VAL.TECH.MF.ZS?format=json"
    resp = urllib.request.urlopen(url, timeout=10)
    data = json.loads(resp.read())
    if len(data) > 1 and data[1]:
        print(f"World Bank Argentina trade data available: {len(data[1])} years")
except Exception as e:
    print(f"World Bank: {e}")
