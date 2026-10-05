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

| Vous voulez changer…                    | Fichier(s)                                    |
| --------------------------------------- | --------------------------------------------- |
| Les textes français / anglais           | `messages/fr.json` / `messages/en.json`       |
| Les couleurs, l'échelle de titres, les filets, les boutons, la lueur | `app/globals.css` (tokens `:root`, puis `@layer components`) |
| Les pages et leur mise en page          | `app/[locale]/…/page.tsx`                     |
| La barre du haut (menu, FR/EN, bouton)  | `components/Topbar.tsx`, `components/LangSwitcher.tsx` |
| Le pied de page et le bandeau défilant  | `components/Footer.tsx`, `components/Marquee.tsx` ; mots dans `home.marquee` |
| Les deux projets types (aperçus)        | `components/Apercu.tsx` + `work.mockups` dans `messages/*.json` |
| L'appel final de chaque page            | `components/ContactBand.tsx`                  |
| L'en-tête des pages intérieures         | `components/PageHeader.tsx`                   |
| Bandeau « aucun cookie »                | `components/CookieNotice.tsx`                 |
| Le formulaire de contact (apparence)    | `components/ContactForm.tsx`                  |
| Ses règles (validation, anti-robots)    | `lib/contact.ts`                              |
| L'envoi du mail (protocole SMTP)        | `lib/smtp.ts` + `app/[locale]/contact/actions.ts` |
| Ses textes et messages d'erreur         | clé `contact.form` dans `messages/*.json`     |
| L'adresse email (recomposée côté client)| `components/MailLink.tsx`, `components/CopyEmail.tsx` |
| Les reçus (ligne qui s'allume)          | `components/Recu.tsx` + `.recu*` dans `app/globals.css` |
| La carte de partage (réseaux sociaux)   | `app/og/[locale]/route.tsx`                   |
| Les fichiers pour robots et agents IA   | `lib/llms.ts`, `app/sitemap.ts`, `app/robots.txt/route.ts` |
| Redirections, en-têtes de sécurité      | `next.config.ts`                              |

Tous les textes visibles passent par `messages/*.json` : chaque clé
existe dans les deux langues.

## Choix assumés

- **Public** : des commerçants, des restaurateurs et des artisans qui
  cherchent un site. Tout le site est écrit dans leurs mots ; aucun
  objet de métier (fenêtre de code, console, maquette d'éditeur) n'y
  figure.
- **Aucun cookie, aucun traceur** : rien n'est déposé. Le bandeau le dit,
  et seule sa fermeture est mémorisée (localStorage, pas un cookie).
- **Email masqué aux robots** : l'adresse est recomposée côté client
  (`components/MailLink.tsx`) ; elle n'apparaît jamais dans le HTML servi
  ni dans les fichiers machine.
- **Formulaire sans captcha ni service tiers** : le message part par la
  boîte mail du domaine, via un client SMTP écrit à la main
  (`lib/smtp.ts`, aucune dépendance ajoutée). Les robots sont écartés
  par un champ-piège invisible et un délai minimal. Trois envois maximum
  par dix minutes et par adresse IP, comptés en mémoire.
- **Démonstrations assumées** : les deux projets types (site vitrine
  avec réservation, prise de rendez-vous) sont annoncés comme tels sur
  chaque page qui les montre — aucun faux client. L'ancienne démo
  jouable `/demo` a été retirée ; l'adresse redirige vers les
  démonstrations.
- **Pas de prix affiché** : il n'existe pas encore de grille. Le site
  dit comment un projet est chiffré (échange gratuit, devis écrit, ce
  qui est compris) et une FAQ « Combien ça coûte ? » l'explique.
- **Rien ne bouge de soi-même** : une seule animation en boucle, le
  bandeau du pied de page, avec son bouton d'arrêt. L'entrée de page est
  un fondu CSS. `prefers-reduced-motion` est respecté partout.
- **Une seule lueur** : la phrase du hero et les numéros de la méthode,
  sur l'encre. Nulle part ailleurs.
- **Le reçu** : quand une machine a réellement agi (un envoi, une copie),
  elle imprime une ligne courte qui s'allume puis se calme. La règle est
  écrite en tête de `components/Recu.tsx`.
- **Système de matière** : papier sable et bandes d'encre en creux, une
  seule lumière venue du haut, ombres teintées d'encre, arêtes ciselées
  sur papier, filets pour les listes, pas de cartes. Échelle de titres
  en quatre rangs (`.titre-hero`, `.titre-1..3`) et un seul rythme de
  section (`.section`), définis dans `app/globals.css`.

## À compléter

- **Mentions légales** : la page dit que les informations
  d'identification de l'entreprise sont en cours d'enregistrement. Dès
  qu'elles existent (dénomination, forme juridique, SIRET, adresse),
  les écrire dans `messages/fr.json` et `messages/en.json`, clé
  `legal.editor.text`.
- **Variables d'envoi du formulaire** : `SMTP_MOTDEPASSE` (et les
  autres réglages de `.env.example`) à saisir dans le manager
  Infomaniak. Tant que ce n'est pas fait, le formulaire s'affiche mais
  se déclare indisponible à l'envoi.
