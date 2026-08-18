# r-x.fr — Site vitrine R-X

Site de présentation du studio d'ergonomie web R-X, accessible sur
[https://www.r-x.fr](https://www.r-x.fr). Construit avec **Next.js 16**
(Node.js), bilingue **français / anglais**.

## Comment ça fonctionne

- `npm install` — télécharge les dépendances dans `node_modules/` (à refaire
  seulement si `package.json` change).
- `npm run dev` — serveur de développement local sur http://localhost:3000,
  avec rechargement automatique à chaque modification.
- `npm run build` — compile le site optimisé pour la production dans `.next/`.
- `npm run start` — sert le site compilé (c'est ce que lance Infomaniak).

Sur Infomaniak, l'hébergement Node.js lance `npm run build` puis
`npm run start` automatiquement : il n'y a rien d'autre à faire côté serveur.

## Où modifier quoi

| Vous voulez changer…            | Fichier(s)                                  |
| ------------------------------- | ------------------------------------------- |
| Les textes français             | `messages/fr.json`                          |
| Les textes anglais              | `messages/en.json`                          |
| Les couleurs                    | `app/globals.css` (variables en haut)       |
| Les pages et leur mise en page  | `app/[locale]/…/page.tsx`                   |
| La barre de navigation          | `components/Topbar.tsx`                     |
| Le pied de page                 | `components/Footer.tsx`                     |
| Les anneaux animés de l'accueil | `components/Rings.tsx`                      |
| Les mentions légales (SIRET…)   | `messages/fr.json` et `en.json`, clé `legal`|

Tous les textes visibles passent par `messages/*.json` : modifiez-y une
phrase, relancez `npm run build`, et les deux langues restent synchronisées
(chaque clé existe dans les deux fichiers).

## Points à compléter

- **Mentions légales** : les champs `[À compléter]` dans `messages/fr.json`
  et `messages/en.json` (SIRET, raison sociale, directeur de publication).
- **Réalisations** : les trois études de cas sont illustratives, à remplacer
  par de vrais projets quand vous en aurez.

## Sécurité et vie privée

- En-têtes de sécurité stricts (CSP, X-Frame-Options, HSTS…) dans
  `next.config.ts`.
- Aucun cookie, aucun traceur, polices hébergées localement : pas de bandeau
  RGPD nécessaire.
