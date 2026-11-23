# AGENTS.md: myggv-website-repo

Static showcase site of MyGGV (community app, Philippines), hosted on `myggv.com`.

## What is NOT here

| What | Where |
|---|---|
| General working rules: verify before claiming, DRY/KISS/YAGNI, scope, official doc ladder, mandatory tools, git, explicit agreement | `~/.omp/agent/RULES.md` |
| The workstation, code graphs, workflows | `~/.omp/agent/AGENTS.md` |
| Project identity and structural decisions | `~/.omp/agent/bank/myggv-website-repo.md` |

## Layout

`public/` is the site root: every file in it is published, nothing outside it is. The repository
root holds only what must stay off the site (`AGENTS.md`, `.github/`, `.omp/`, `.archon/`, git
files). A new served file goes in `public/`, at the path it must answer on.

- `public/index.html`: home page (App Store / Google Play links).
- `public/privacy-policy.html`, `child-safety.html`, `delete-account.html`: legal pages of the
  MyGGV app.
- `public/gps-privacy-policy.html`, `gps-support.html`: privacy policy and support pages of the
  separate MyGGV GPS app (`com.myggv.gps`, repo `new-ggv-gps`), declared as its privacy and
  support URLs in App Store Connect and Google Play. Same rule as below: check both consoles
  before moving them.
- `public/404.html`: answer for unknown paths (stops Pages' single-page fallback).
- `public/styles.css`: the only stylesheet, shared by every page (no inline `<style>` blocks).
- `public/animations.js`: entrance, scroll-reveal, logo float and button press animations, built
  on Motion. `public/vendor/motion.js` is the self-hosted UMD build of the `motion` npm package
  (global `Motion`, version 14.1.1, MIT, licence in `public/vendor/motion.LICENSE.md`); to update
  it, copy `dist/motion.js` from the package tarball. Every page's `<head>` adds the `motion`
  class to `<html>` unless `prefers-reduced-motion: reduce`; while it is set, `[data-reveal]`
  elements are hidden until animated, and `animations.js` removes it if Motion failed to load.
- `public/leaves.js`: falling leaves on a `<canvas>` it inserts behind the content of every page,
  no library, skipped under `prefers-reduced-motion`.
- `public/i/index.html`: landing page of referral links (`?ref=CODE`), redirects to the store
  detected from the user agent and passes the code through the `referrer` parameter (Android).
- `public/manifest.json`: PWA manifest. `public/app-ads.txt`: AdMob / mediation publisher
  verification. `public/robots.txt`, `public/sitemap.xml`: crawler files.
- `public/.well-known/apple-app-site-association` and `assetlinks.json`: Universal Links (iOS) /
  App Links (Android) verification for `com.myggv.app`.
- `public/_headers`: Cloudflare Pages response headers. `/*` sets HSTS
  (`max-age=15552000`, 6 months, no `includeSubDomains`, no `preload`); the two `.well-known`
  rules force `Content-Type: application/json` (required by iOS, otherwise Safari opens instead
  of the app).
- `public/icons/`, `public/images/`, `public/logo.webp`, `public/title.webp`: static assets. The
  PNG icons stay PNG: the manifest, `apple-touch-icon` and `og:image` need them.

No `package.json`: no script, no gate, and Archon's `story` workflow cannot run here (its
`prealable` node requires `scripts.gate`). Local preview: `vpx wrangler@4.166.0 pages dev public`
serves the site with its `_headers`, as Pages does.

## Deployment

`.github/workflows/deploy.yml` publishes `public/` to **Cloudflare Pages** with
`cloudflare/wrangler-action@v4` (Wrangler pinned by `wranglerVersion`,
`pages deploy public`) on every push to `main`. The custom domains `myggv.com`,
`www.myggv.com` and `links.myggv.com` are attached to the Pages project `myggv` in the
Cloudflare dashboard; GitHub Pages is disabled on this repository.

## Traps specific to this repository

- **`privacy-policy.html` and `child-safety.html` are claimed by App Store Connect and the Google
  Play Data safety declaration.** Renaming or moving their URL breaks a store compliance already
  declared: check both consoles before touching it.
- **Never deploy the repository root.** `wrangler pages deploy <dir>` serves every file under
  `<dir>`, dotfiles and `.md` included, and `wrangler-action` writes a `package.json` and
  `package-lock.json` in the working directory when it installs Wrangler: deploying `.` published
  them all. Keep the upload directory `public/`.
- The identifiers frozen in `public/.well-known/` (`55KGMQ6P8Z.com.myggv.app`, Android SHA-256
  fingerprint) must stay in sync with the app's real signing certificates: a signing certificate
  change on the app side silently breaks Universal/App Links, with no build error to flag it.
