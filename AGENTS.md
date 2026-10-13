# AGENTS.md — myggv-website-repo

Site vitrine statique de MyGGV (app communautaire, Philippines), hébergé sur `myggv.com`.

## Ce qui n'est PAS ici

| Quoi | Où |
|---|---|
| Règles de travail générales — vérifier avant d'affirmer, DRY/KISS/YAGNI, périmètre, échelle de doc officielle, outils obligatoires, git, accord explicite | `~/.omp/agent/RULES.md` |
| Le poste, les graphes de code, les workflows | `~/.omp/agent/AGENTS.md` |
| Faits durables du projet — versions, gate mesuré, dettes, points ouverts | `~/.omp/agent/bank/myggv-website-repo.md` |

## Contenu

- `index.html` — page d'accueil (liens App Store / Google Play).
- `privacy-policy.html`, `child-safety.html`, `delete-account.html` — pages légales de l'app MyGGV.
- `styles.css` — the only stylesheet, shared by every page (no inline `<style>` blocks).
- `animations.js` — entrance, scroll-reveal, logo float and button press animations, built on
  Motion. `vendor/motion.js` is the self-hosted UMD build of the `motion` npm package
  (global `Motion`, version 14.1.1, MIT, licence in `vendor/motion.LICENSE.md`); to update it,
  copy `dist/motion.js` from the package tarball. Every page's `<head>` adds the `motion`
  class to `<html>` unless `prefers-reduced-motion: reduce`; while it is set, `[data-reveal]`
  elements are hidden until animated, and `animations.js` removes it if Motion failed to load.
- `leaves.js` — falling leaves on a `<canvas>` it inserts behind the content of every page,
  no library, skipped under `prefers-reduced-motion`.
- `i/index.html` — atterrissage des liens de parrainage (`?ref=CODE`), redirige vers le store
  détecté par user-agent et transmet le code via le paramètre `referrer` (Android).
- `manifest.json` — manifest PWA. `app-ads.txt` — vérification éditeur AdMob/médiation.
- `.well-known/apple-app-site-association` et `assetlinks.json` — vérification des Universal
  Links (iOS) / App Links (Android) pour `com.myggv.app` ; `_headers` force leur
  `Content-Type: application/json` (requis par iOS, sinon Safari s'ouvre au lieu de l'app).
- `icons/`, `images/`, `logo.webp`, `title.webp` — assets statiques. The PNG icons stay PNG:
  the manifest, `apple-touch-icon` and `og:image` need them.

Aucun `package.json` : pas de script, pas de gate, et le workflow `story` d'Archon ne peut pas
tourner ici (son nœud `prealable` exige `scripts.gate`). Vérification humaine uniquement :
ouvrir les fichiers HTML dans un navigateur.

## Déploiement

`.github/workflows/deploy.yml` publishes to **Cloudflare Pages** (`wrangler pages deploy .`) on
every push to `main`. The custom domains `myggv.com`, `www.myggv.com` and `links.myggv.com` are
attached to the Pages project `myggv` in the Cloudflare dashboard; GitHub Pages is disabled on
this repository.

## Pièges propres à ce dépôt

- **`privacy-policy.html` et `child-safety.html` sont réclamées par App Store Connect et la
  déclaration Data safety de Google Play.** Les renommer ou déplacer casse une conformité de
  boutique déjà déclarée — vérifier ces deux consoles avant de toucher leur URL.
- **`wrangler pages deploy .` prend le répertoire entier comme racine du site, mais ne sert pas
  tout.** Mesuré en HTTP après déploiement : `privacy-policy.html` et `delete-account.html` → 200 ;
  `AGENTS.md`, `.mcp.json` et `graphify-out/graph.json` → **404**, y compris pour un `.md` commité.
  Aucun `.assetsignore` ni `wrangler.toml` n'impose cette exclusion : elle vient du comportement de
  Cloudflare Pages. Avant de committer un fichier sensible à la racine, vérifier son URL publique.
- Les identifiants figés dans `.well-known/` (`55KGMQ6P8Z.com.myggv.app`, empreinte SHA-256
  Android) doivent rester synchronisés avec les certificats de signature réels de l'app — un
  changement de certificat de signature côté app casse silencieusement les Universal/App Links,
  sans erreur de build pour le signaler.
