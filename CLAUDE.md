@AGENTS.md

# Contexte pour Claude — site r-x.fr

Site vitrine bilingue (FR sans préfixe, EN sous `/en`) de **R-X,
développeur web fullstack indépendant** (Node.js, React, Next.js,
TypeScript), voix « je ». Domaine canonique **www.r-x.fr** (r-x.fr
redirige en 308). Stack : Next.js 16 (App Router, Turbopack,
`proxy.ts`), next-intl (chemins localisés), Tailwind v4, framer-motion,
polices locales woff2. Voir le README pour les commandes, le
déploiement et la table « où modifier quoi ».

## Méthode de travail (règles de l'utilisateur)

- **Poser des questions avant** tout gros travail ou choix structurant
  (AskUserQuestion) — règle permanente, demandée explicitement.
- **Demander avant d'interpréter** : si un retour désigne un élément de
  façon ambiguë (« la barre », « le bandeau »), demander lequel avant
  d'agir. Leçon apprise à mes dépens.
- L'utilisateur est novice en Node/Next : expliquer pédagogiquement les
  choix techniques, en français.
- À chaque modification : vérifier que robots.txt, sitemap.xml et
  llms*.txt reflètent le changement (générés au build depuis
  `messages/*.json`, `app/sitemap.ts`, `app/robots.txt/route.ts`,
  `lib/llms.ts`) et tenir les fichiers .md à la main.
- Flux : je committe et pousse ; l'utilisateur fait `git pull &&
  npm run build` sur le serveur Infomaniak (`~/sites/portofolio`, SSH)
  puis redémarre via le manager. Récupération serveur :
  `git fetch origin && git reset --hard origin/main && rm -rf .next`.

## Honnêteté (non négociable)

Aucun vrai client à ce jour : les trois démos (Site vitrine /
Application métier / API) sont des **projets types** construits pour
montrer la méthode, et le site le dit explicitement (`work.note`,
llms.txt). Seuls des faits vérifiables sont affichés (réponse sous
48 h, FR/EN, 0 cookie, fondé en 2026). Ne jamais inventer de chiffres,
clients, années d'expérience ou promesses invérifiables
(« sécurisé » a été retiré pour ça).

## Goûts visuels de l'utilisateur (durement acquis)

- **Adoré** : glow phosphore terracotta (manifeste), effet vieille
  TV/CRT, fenêtres terminal (démos API, écran tests), détails
  d'artisanat précis, humour dev discret (« exit 0 » du footer).
- **Détesté** : tout ce qui « fait IA » ou template, boutons keycap à
  étages d'ombre, liserés/lignes claires 1px sur fonds sombres, tilts
  de cartes à la souris, curseurs custom, polices outline, mouvements
  répétitifs ou « respiration », rotations 3D qui aplatissent l'objet.
- Interactions discrètes : enfoncement 1px au clic, couleurs — pas de
  levée au survol. Le bandeau défilant du footer est **voulu** ; le Mac
  rétro est posé de trois quarts **immobile** ; la FAQ est éditoriale
  sobre (l'habillage terminal a été essayé puis rejeté).
- Système de matière : une seule lumière, tokens `shadow-elev-1..4`,
  arêtes `inset-shadow-cisele(-sombre)`, bandes en creux
  `.bande-calque*` (sans liseré clair) — voir `app/globals.css`.

## Contraintes techniques du site

- **Zéro cookie, littéral** : `localeCookie: false` ET
  `localeDetection: false` dans `i18n/routing.ts` — la langue est
  portée par l'URL seule (sinon les navigateurs anglophones sont
  renvoyés vers /en à chaque clic sur FR).
- **Email jamais dans le HTML** ni dans les fichiers machine :
  recomposé côté client (`components/MailLink.tsx`, morceaux
  inversés). Ne jamais l'écrire en dur.
- Clic droit désactivé hors champs de saisie ; modes cachés W/I/Konami
  avec sortie visible et bouton de désactivation (WCAG 2.1.4).
- `prefers-reduced-motion` respecté pour CHAQUE effet, sans exception.
- Pas de nouvelle dépendance npm sans accord (three.js a été retiré
  exprès) ; CSP stricte (aucune ressource externe).
- Français : espace insécable U+00A0 avant `: ; ? !` dans
  `messages/fr.json`.
- **Formulaire de contact** : envoi par SMTP écrit à la main
  (`lib/smtp.ts`, zéro dépendance — le choix nodemailer reste ouvert,
  il suffirait de réécrire `envoyerCourriel`). Réglages **uniquement**
  en variables d'environnement (`.env.example`) : ne jamais écrire
  l'adresse d'arrivée ni le mot de passe dans le code. Anti-robots =
  champ-piège invisible + délai minimal + 3 envois / 10 min par IP,
  jamais de captcha. Sans réglages, le formulaire annonce
  honnêtement qu'il est indisponible — il ne dit jamais « merci » à
  vide.

## Pièges connus (ne pas retomber dedans)

- Ne JAMAIS filtrer `npm run build` avec grep : TypeScript tourne
  APRÈS « Compiled successfully » — toujours lire la fin et vérifier
  le code de sortie.
- `perl -pe 's/ /\x{00a0}/'` écrit un octet 0xA0 nu (UTF-8 invalide,
  Turbopack refuse le JSON) : passer par Python et des octets
  `\xc2\xa0`, en évitant les « à » (0xC3 0xA0).
- eslint `react-hooks/set-state-in-effect` : différer avec
  `setTimeout(0)` (pattern BootScreen/CopyEmail).
- framer-motion scroll-linked → WAAPI : plages d'entrée dans [0,1].
- next-intl ICU : `{` s'échappe avec des quotes autour de `{param}`.
  **`<` aussi** : un message contenant `<h1 class="…">` est lu comme
  une balise et lève `INVALID_TAG` à chaque rendu (le texte s'affiche
  quand même, mais le serveur logue une erreur). Entourer d'apostrophes
  simples : `'<h1 class=\"accroche\">'` — cas vécu sur `home.layerLabel`.
- eslint `react-hooks/refs` : regrouper des `useRef` dans un objet puis
  lire `objet.champ` dans le JSX est refusé (« Cannot access refs
  during render »). Une variable par ref.
- Node lit les `.ts` sans les compiler : les « propriétés de
  paramètre » (`constructor(private socket: X)`) le font échouer, alors
  que Turbopack les accepte. Déclarer le champ explicitement, sinon les
  fichiers de `lib/` ne sont plus testables hors du site.
- `pkill -f "next-server"` se tue lui-même (la commande contient le
  motif) : écrire `pkill -f "next[-]server"`.
- Les lettres du titre magnétique ont une largeur figée par lettre
  (sinon la graisse variable élargit les glyphes et fait trembler la
  ligne par reflow) et l'onde du clic est attachée au `<h1>` seul,
  pas à `window` — ne pas retirer ces mécanismes.

## Mentions légales

Les champs `[À compléter]` de la clé `legal` (raison sociale, SIRET,
directeur de publication) attendent les informations de l'utilisateur.
