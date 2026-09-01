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

## Réglages du formulaire de contact

Le formulaire envoie les messages par la boîte mail du domaine. Ses
réglages ne sont **jamais** dans le dépôt : ils vivent dans des
variables d'environnement. Le modèle commenté est dans `.env.example`.

- **En local** : copier `.env.example` en `.env.local` (ignoré par git)
  et compléter `SMTP_MOTDEPASSE`.
- **Sur le serveur** : saisir les mêmes variables dans le manager
  Infomaniak, section « variables d'environnement » du site Node, puis
  redémarrer.

Sans ces variables, le formulaire ne fait pas semblant : il affiche
qu'il est momentanément indisponible et renvoie vers l'adresse email,
qui reste affichée juste en dessous.

## Où modifier quoi

| Vous voulez changer…                  | Fichier(s)                                    |
| ------------------------------------- | --------------------------------------------- |
| Les textes français / anglais         | `messages/fr.json` / `messages/en.json`       |
| Les couleurs                          | `app/globals.css` (variables `:root` en tête) |
| Les pages et leur mise en page        | `app/[locale]/…/page.tsx`                     |
| Le titre magnétique du hero           | `components/MagneticTitle.tsx`                |
| Les cinq étapes de la méthode         | `components/ProcessScroll.tsx`                |
| Les deux démos types (écrans)         | `components/CaseMockup.tsx` + `work.mockups` dans `messages/*.json` |
| Le moniteur des démos (bezel, barre)  | `components/DemoWindow.tsx`                   |
| La frise du déroulé (rail au scroll)  | `components/ProjectTimeline.tsx`              |
| Le R-X gravé du pied de page          | `components/FooterMark.tsx`                   |
| Ombres, élévations, boutons keycap    | `app/globals.css` (tokens `--shadow-elev-*`, `--inset-shadow-cisele*`, `.btn`, `.bande-calque*`, `.bordereau-*`) |
| La brique 3D du hero                  | `components/Brique3D.tsx` (via `BriqueHero.tsx`) |
| Le poste rétro beige                  | `components/RetroComputer.tsx`                |
| La fiche « En bref » (horloge, faits) | `components/StudioCard.tsx` + `about.card`    |
| Navigation / pied de page             | `components/Topbar.tsx` / `components/Footer.tsx` |
| Bandeau « aucun cookie »              | `components/CookieNotice.tsx`                 |
| La démo jouable « effectif » (écran)  | `components/EffectifApp.tsx`                  |
| Ses règles (congés, entretiens)       | `lib/effectif.ts`                             |
| Ses textes                            | clé `demo` dans `messages/*.json`             |
| Le fil qui guide la démo              | `suivreFil` / `ligneDuFil` dans `lib/effectif.ts`, textes en `demo.fil` |
| Le formulaire de contact (apparence)  | `components/ContactForm.tsx`                  |
| Ses règles (validation, anti-robots)  | `lib/contact.ts`                              |
| L'envoi du mail (protocole SMTP)      | `lib/smtp.ts` + `app/[locale]/contact/actions.ts` |
| Ses textes et messages d'erreur       | clé `contact.form` dans `messages/*.json`     |
| Les reçus (ligne mono + lueur)        | `components/Recu.tsx` + `.recu*` dans `app/globals.css` |
| Écran d'ouverture (logo puis cercle)   | `components/BootScreen.tsx` + `.ecran-boot` dans `app/globals.css` |
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
- **Formulaire sans captcha ni service tiers** : le message part par la
  boîte mail du domaine, via un client SMTP écrit à la main
  (`lib/smtp.ts`, aucune dépendance ajoutée). Les robots sont écartés
  par un champ-piège invisible et un délai minimal, pas en faisant
  déchiffrer des images au visiteur. Trois envois maximum par
  dix minutes et par adresse IP, comptés en mémoire — rien n'est stocké.
- **Démonstrations assumées** : les deux démos (site vitrine, appli
  métier) sont des projets types annoncés comme tels — aucun faux
  client. La démo d'API a été retirée : une console, pour un artisan
  qui cherche un site, est un mur.
- **Une démo qui se manipule** (`/demo`) : « effectif », l'application
  métier en état de marche — validation de congés, solde qui bouge,
  entretiens à planifier, bascule salarié/manager. Tout tourne dans le
  navigateur du visiteur : aucun appel réseau, aucune base, rien de
  conservé, et un bandeau le dit avant qu'on y touche.
- **Un fil qui guide, pas une visite guidée** : une ligne d'état dans le
  bâti du moniteur commente ce qui vient de se passer et suggère la
  suite. Elle est *déduite de l'état réel*, jamais d'un compteur
  d'étapes — donc elle ne peut pas annoncer un compte périmé, celui qui
  fait les choses dans le désordre est rattrapé sans reculer d'un cran,
  et « Remettre à zéro » la rejoue gratuitement. Pas de bulle numérotée,
  pas de fond assombri, rien à fermer pour continuer.
- `prefers-reduced-motion` est respecté partout (animations coupées ou
  remplacées par un état statique).
- **Le reçu** : quand une machine a réellement agi, elle imprime une
  ligne courte en chasse fixe qui s'allume en phosphore terracotta puis
  se calme — la durée mesurée d'un envoi, l'adresse recomposée dans le
  navigateur. La règle est écrite en tête de
  `components/Recu.tsx` : un reçu ne s'affiche que si une machine a agi,
  et il ne porte jamais une information qui ne soit pas déjà écrite en
  clair juste à côté. On les supprime tous, le site reste entier.
- **Rien ne bouge de soi-même** : le site est passé de 23 animations en
  boucle à **une seule**, le bandeau du pied de page — et il a son
  bouton d'arrêt. Les halos du hero ne dérivent plus, les maquettes ne
  font plus semblant de travailler, les chiffres sont écrits plutôt que
  comptés, et chaque poste rétro s'allume quand il entre à l'écran. Tout
  ce qui bouge sur ce site répond à un geste du visiteur.
- **Une page d'accueil courte** : 6,9 écrans, contre 13,1 avant que les
  deux sections épinglées ne soient raccourcies. Aucune section ne
  confisque le défilement.
- **Système de profondeur unifié** : une seule lumière (venant du haut),
  échelle d'ombres `shadow-elev-1..4`, arêtes ciselées
  `inset-shadow-cisele(-sombre)` façon boîtier du Mac, bandes pleine
  largeur en creux (`.bande-calque*`), boutons « touche de clavier »
  (tranche dure, soulevés au survol, enfoncés au clic).

## À compléter

- **Mentions légales** : les champs `[À compléter]` dans
  `messages/fr.json` et `messages/en.json`, clé `legal` (raison sociale,
  SIRET, directeur de publication).
- **Variables d'envoi du formulaire** : `SMTP_MOTDEPASSE` (et les
  autres réglages de `.env.example`) à saisir dans le manager
  Infomaniak. Tant que ce n'est pas fait, le formulaire s'affiche mais
  se déclare indisponible à l'envoi.
