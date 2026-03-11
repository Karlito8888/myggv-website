# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyGGV is a static landing page for a community app (Garden Grove Village, Philippines). The site is hosted on **GitHub Pages** at `myggv.com` (configured via `CNAME`).

There is no build system, no bundler, no package manager — just plain HTML/CSS files served directly.

## Deployment

Push to `main` branch → GitHub Pages auto-deploys. No build step needed.

## Site Structure

- `index.html` — Main landing page with app store download links (all CSS is inline in `<style>`)
- `privacy-policy.html` — Privacy policy page
- `child-safety.html` — Child safety standards (Google Play compliance requirement)
- `manifest.json` — PWA manifest
- `app-ads.txt` — Google AdSense publisher verification
- `images/` — Responsive background images in WebP + PNG fallback (6 breakpoints)
- `icons/` — PWA icons (16px to 512px)

## Key Design Decisions

- **All CSS is inline** within each HTML file (no external stylesheets)
- **Responsive background images** use media queries with WebP primary + PNG fallback via `@supports`
- **Font**: Madimi One from Google Fonts
- **Theme color**: `#5bc46d` (green)
- **LCP optimization**: Background images are preloaded with `fetchpriority="high"` per breakpoint
- **No JavaScript** — the site is pure HTML/CSS

## App Store Links

- **App Store (iOS)**: Live — links to Philippines store (`apps.apple.com/ph/...`)
- **Google Play**: Currently "Coming Soon" (button disabled with `coming-soon` class + `pointer-events: none`)

## Testing

No automated tests. To verify changes locally, open `index.html` in a browser. For responsive testing, use browser DevTools or a Lighthouse audit.
