# r-x.fr — Site vitrine R-X

Site de présentation de R-X, développeur web fullstack indépendant
(Node.js, React, Next.js, TypeScript), accessible sur
[https://www.r-x.fr](https://www.r-x.fr). Construit avec **Next.js 16**
(Node.js), bilingue **français / anglais** (`/` et `/en`, chemins
localisés : `/realisations` ↔ `/en/work`).

## Commandes

- `npm install` — installe les dépendances (à refaire si `package.json` change).
- `npm run dev` — serveur de développement sur http://localhost:3000, rechargement automatique.
- `npm run build` — compile le site optimisé (toutes les pages sont pré-générées).
- `npm run start` — sert le site compilé (ce que lance Infomaniak).

## Travailler depuis un autre poste

Tout le nécessaire est dans le dépôt (code, polices, textes,
`CLAUDE.md` avec le contexte de travail pour Claude Code) :

```bash
git clone git@github.com:ferarriraf/portofolio.git
cd portofolio
npm install
npm run dev
```

Claude Code lit automatiquement `CLAUDE.md` à l'ouverture du dossier :
la méthode de travail, les règles du site et les pièges connus suivent
le dépôt. Penser à `git pull` en arrivant et `git push` en partant,
pour que les deux postes restent synchrones.

## Déploiement

Le site se déploie **par git**, depuis ce dépôt GitHub :

1. En local : commit puis `git push`.
2. Sur le serveur Infomaniak (`~/sites/portofolio`, en SSH) :
   `git pull && npm run build`
3. Redémarrer le site depuis le manager Infomaniak.

En cas de build incohérent sur le serveur : `git status --short` pour
repérer des fichiers parasites, puis au besoin
`git fetch origin && git reset --hard origin/main && rm -rf .next`.

Le domaine de référence est `www.r-x.fr` ; `r-x.fr` redirige en 308
(voir `next.config.ts`).

## Où modifier quoi

| Vous voulez changer…                  | Fichier(s)                                    |
| ------------------------------------- | --------------------------------------------- |
| Les textes français / anglais         | `messages/fr.json` / `messages/en.json`       |
| Les couleurs                          | `app/globals.css` (variables `:root` en tête) |
| Les pages et leur mise en page        | `app/[locale]/…/page.tsx`                     |
| Le titre magnétique du hero           | `components/MagneticTitle.tsx`                |
| Le scrollytelling « méthode »         | `components/ProcessScroll.tsx`                |
| Les trois démos types (écrans)        | `components/CaseMockup.tsx` + `work.mockups` dans `messages/*.json` |
| Le moniteur des démos (bezel, barre)  | `components/DemoWindow.tsx`                   |
| La frise du déroulé (rail au scroll)  | `components/ProjectTimeline.tsx`              |
| Le R-X gravé du pied de page          | `components/FooterMark.tsx`                   |
| Ombres, élévations, boutons keycap    | `app/globals.css` (tokens `--shadow-elev-*`, `--inset-shadow-cisele*`, `.btn`, `.bande-calque*`, `.card-offre`) |
| Le poste rétro beige                  | `components/RetroComputer.tsx`                |
| La fiche « En bref » (horloge, faits) | `components/StudioCard.tsx` + `about.card`    |
| Navigation / pied de page             | `components/Topbar.tsx` / `components/Footer.tsx` |
| Bandeau « aucun cookie »              | `components/CookieNotice.tsx`                 |
| Écran de démarrage                    | `components/BootScreen.tsx`                   |
| Redirections, en-têtes de sécurité    | `next.config.ts`                              |

Tous les textes visibles passent par `messages/*.json` : chaque clé
existe dans les deux langues.

## Modes cachés (volontairement non annoncés sur le site)

- **W** : mode fil de fer — tout le site en structure.
- **I** : mode inspection — grille + dimensions de l'élément survolé.
- **↑↑↓↓←→←→BA** : mode 1988 (vert phosphore).
- **Échap** quitte n'importe quel mode ; un badge indique toujours la sortie.
- Un message d'accueil attend les curieux dans la console du navigateur.

Code : `components/SecretModes.tsx`.

## Choix assumés

- **Aucun cookie, aucun traceur** : rien n'est déposé (le bandeau le dit,
  le clic « Compris » est mémorisé en localStorage, pas en cookie).
- **Email masqué aux robots** : l'adresse est recomposée côté client
  (`components/MailLink.tsx`) ; elle n'apparaît jamais dans le HTML servi.
- **Clic droit désactivé** hors champs de saisie (`components/NoContextMenu.tsx`).
- **Démonstrations assumées** : les trois démos (site vitrine, appli
  métier, API) sont des projets types annoncés comme tels — aucun faux
  client.
- `prefers-reduced-motion` est respecté partout (animations coupées ou
  remplacées par un état statique).
- **Système de profondeur unifié** : une seule lumière (venant du haut),
  échelle d'ombres `shadow-elev-1..4`, arêtes ciselées
  `inset-shadow-cisele(-sombre)` façon boîtier du Mac, bandes pleine
  largeur en creux (`.bande-calque*`), boutons « touche de clavier »
  (tranche dure, soulevés au survol, enfoncés au clic).

## À compléter

- **Mentions légales** : les champs `[À compléter]` dans
  `messages/fr.json` et `messages/en.json`, clé `legal` (raison sociale,
  SIRET, directeur de publication).
