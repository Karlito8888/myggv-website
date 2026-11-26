# myggv-website-repo rules

Hard requirements of this repository, carried on every request and by every subagent.
The layout and the reasons are in the root `AGENTS.md`, which subagents do not receive:
read it by path.

- **`public/` is the site root**: every file in it is published, nothing outside it is. A new
  served file goes in `public/` at the path it must answer on; `AGENTS.md`, `.github/`,
  `.omp/`, `.archon/` stay at the repository root.
- **Never deploy the repository root.** Keep the upload directory `public/`
  (`pages deploy public`): deploying `.` published dotfiles, `.md` files and the
  `package.json` that `wrangler-action` writes.
- **Store-declared URLs never move.** `privacy-policy.html`, `child-safety.html`,
  `gps-privacy-policy.html` and `gps-support.html` are declared in App Store Connect and
  Google Play: check both consoles before renaming or moving one.
- **`public/.well-known/` identifiers** (`55KGMQ6P8Z.com.myggv.app`, the Android SHA-256
  fingerprint) must match the app's real signing certificates; both files keep
  `Content-Type: application/json` through `public/_headers`.
- **`_headers` HSTS** stays `max-age=15552000`, no `includeSubDomains`, no `preload`.
- **One stylesheet**: `public/styles.css`, no inline `<style>` block. Motion and falling
  leaves stay off under `prefers-reduced-motion: reduce`.
- **PNG icons stay PNG** (manifest, `apple-touch-icon`, `og:image` need them).
- **No `package.json`**: no script, no gate, nothing to install. Preview with
  `vpx wrangler@4.166.0 pages dev public`.
