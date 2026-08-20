# AGENTS.md — myggv-website-repo

Site vitrine statique de MyGGV (app communautaire, Philippines), hébergé sur `myggv.com`.

## Ce qui n'est PAS ici

| Quoi | Où |
|---|---|
| Règles de travail générales — vérifier avant d'affirmer, DRY/KISS/YAGNI, périmètre, échelle de doc officielle, outils obligatoires, git, accord explicite | `~/.omp/agent/RULES.md` |
| Le poste, les graphes de code, les workflows | `~/.omp/agent/AGENTS.md` |
| Faits durables du projet — versions, gate mesuré, dettes, points ouverts | `~/.omp/agent/bank/myggv-website-repo.md` |

## Contenu

- `index.html` — page d'accueil (tout le CSS est inline, liens App Store / Google Play).
- `privacy-policy.html`, `child-safety.html` — pages légales de l'app MyGGV.
- `i/index.html` — atterrissage des liens de parrainage (`?ref=CODE`), redirige vers le store
  détecté par user-agent et transmet le code via le paramètre `referrer` (Android).
- `manifest.json` — manifest PWA. `app-ads.txt` — vérification éditeur AdMob/médiation.
- `.well-known/apple-app-site-association` et `assetlinks.json` — vérification des Universal
  Links (iOS) / App Links (Android) pour `com.myggv.app` ; `_headers` force leur
  `Content-Type: application/json` (requis par iOS, sinon Safari s'ouvre au lieu de l'app).
- `icons/`, `images/`, `logo.png`, `title.png`, `background.png` — assets statiques.

Aucun `package.json` : pas de script, pas de gate, et le workflow `story` d'Archon ne peut pas
tourner ici (son nœud `prealable` exige `scripts.gate`). Vérification humaine uniquement :
ouvrir les fichiers HTML dans un navigateur.

## Déploiement

`.github/workflows/deploy.yml` publie sur **Cloudflare Pages** (`wrangler pages deploy .`) à
chaque push sur `main` — **pas GitHub Pages**, malgré le fichier `CNAME` (vestige d'un ancien
hébergement GitHub Pages ; inutile pour Cloudflare, le domaine `myggv.com` y est configuré côté
tableau de bord Cloudflare Pages).

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
