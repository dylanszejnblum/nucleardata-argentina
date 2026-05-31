# FRONTEND-PROMPT — Move Images to /public, Replace SVGs with PNGs

**Effort:** ~30 min
**Tags:** frontend, images, assets, logos

---

## What Changed

12 images in `/Users/dylanszejnblum/Documents/minerals/images/` were processed:
- Background removed (color-key: near-black pixels → transparent, works on dark AND light mode)
- Watermark removed from bottom-right

## What to Do

### 1. Move PNGs to public folder

Copy the 12 `.png` files from `/Users/dylanszejnblum/Documents/minerals/images/` to `/Users/dylanszejnblum/Documents/minerals/frontend/public/images/` (create the directory if it doesn't exist).

| File | New Path |
|------|----------|
| 1.png → 12.png | `public/images/{n}.png` |

Only copy the `.png` files, not the originals (`.jpeg`/`.jpg`).

### 2. Replace SVG references with PNGs

Two SVGs in `public/logos/` that have PNG counterparts that now support dark+light mode:

| Current SVG | Replace With |
|-------------|-------------|
| `public/logos/totalenergies.svg` | `public/logos/totalenergies.png` (already exists but needs PNG) |
| `public/logos/equinor.svg` | `public/logos/equinor.png` (already exists but needs PNG) |

These PNGs already exist in `public/logos/` but may need re-exporting from the originals if the SVGs rendered poorly.

Also check `public/favicon.svg` and `public/opengraph-image.svg` — if these have dark backgrounds, replace with the corresponding `.png` versions that are already in `public/`.

### 3. Verify

- Navigate to each page that uses these images
- Confirm they render on **both** dark and light backgrounds without halos or artifacts
- No white boxes around logos
- No watermark visible in bottom-right

## Acceptance Criteria

- [ ] All 12 PNGs in `public/images/`
- [ ] `totalenergies.svg` → `.png` in `public/logos/` (dark/light compatible)
- [ ] `equinor.svg` → `.png` in `public/logos/` (dark/light compatible)
- [ ] `favicon.svg` handled (keep as SVG or switch to PNG)
- [ ] All images render correctly on both dark and light themes
- [ ] No watermarks visible
