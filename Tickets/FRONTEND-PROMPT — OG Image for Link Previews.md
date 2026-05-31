# FRONTEND-PROMPT — OG Image for Link Previews

**Effort:** ~30 min
**Tags:** frontend, seo, opengraph, metadata

---

## What Changed

The OG images at `public/opengraph-image.*` were cleaned:
- AI-generated EXIF metadata stripped from `opengraph-image.png`
- Watermark removed, transparent background
- SVGs verified clean

## What to Do

### 1. Verify OG image is served correctly

The files are already in `public/`:
- `public/opengraph-image.png` (1200×630, primary)
- `public/opengraph-image.webp` (1200×630, WebP fallback)
- `public/opengraph-image.svg` (1200×630, SVG fallback)

Next.js automatically serves `opengraph-image.png` from the root `public/` folder as the default OG image. The existing code in `src/utilities/mergeOpenGraph.ts` already references it via `getSocialImageURL()`.

### 2. Test on platforms

- Share the site URL on Twitter/X — confirm the OG image renders with the cleaned version
- Share on WhatsApp/Telegram — confirm no watermark, no dark halo around the image
- Use the [Open Graph Debugger](https://opengraph.dev/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 3. (Optional) Dynamic per-page OG images

For high-traffic pages, consider dynamic OG images:
- `/minerals/uranio` → an OG image showing the uranium price chart
- `/companies/ypf` → an OG image showing YPF logo + stock price
- `/provincias/neuquen` → an OG image showing province stats

This would use Next.js [ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response) API at a route like `src/app/(frontend)/og/route.tsx`.

## Acceptance Criteria

- [ ] `opengraph-image.png` renders on Twitter/X card preview
- [ ] `opengraph-image.png` renders on WhatsApp link preview
- [ ] No watermark visible in any preview
- [ ] No white/black box around the image (transparent bg handled)
- [ ] No stale cached version of the old image (deploy clears cache)

## What to Skip

- Do not add a custom OG generation API unless the user asks for it
- Do not modify the SVG version unless PNG fails
