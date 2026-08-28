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
llms.txt). L'application métier est **jouable** sur `/demo`
(« effectif », `components/EffectifApp.tsx` + `lib/effectif.ts`) : elle
doit tenir mot pour mot la promesse écrite dans `work.projects[1]`
— « un tableau de bord qui montre ce qui attend une décision, et rien
d'autre », « les demandes se valident en un clic ». Personnes fictives,
état reconstruit à chaque chargement depuis la date du jour, tout dans
le navigateur : **jamais** de base, d'appel réseau ni de persistance,
et le bandeau bac à sable reste affiché. Seuls des faits vérifiables sont affichés (réponse sous
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
- Le bandeau **ne s'arrête plus au survol** : le geste n'était pas
  intentionnel et donnait l'impression d'une page plantée. Il s'arrête
  par son bouton, qui existe aussi pour couvrir le critère WCAG 2.2.2 —
  une animation infinie doit avoir une commande d'arrêt, et le survol
  n'en est pas une au doigt ni au clavier. Ne pas retirer le bouton sans
  retirer aussi l'animation.
- Système de matière : une seule lumière, tokens `shadow-elev-1..4`,
  arêtes `inset-shadow-cisele(-sombre)`, bandes en creux
  `.bande-calque*` (sans liseré clair) — voir `app/globals.css`.
- **Le reçu** (`components/Recu.tsx`) : trois règles écrites en tête du
  fichier, à ne pas contourner. Un reçu ne s'affiche QUE si une machine
  a réellement agi (pas au défilement, pas à l'apparition d'un bloc) ;
  il ne porte JAMAIS une information qui ne soit pas déjà écrite en
  clair juste à côté ; il énonce un fait vérifiable, si possible
  chiffré. La lueur est en `--terra-hot`, le TEXTE jamais (3,3:1, sous
  le seuil) — une ombre ne porte aucune information. Trois reçus
  aujourd'hui : envoi du formulaire, copie de l'adresse, 404. Une ligne
  mono posée sous un titre « parce que ça fait joli » et le terminal
  redevient un costume.
- **Le fil de la démo** (`suivreFil` / `ligneDuFil` dans
  `lib/effectif.ts`, textes en `demo.fil`) : la ligne est DÉDUITE de
  l'état à chaque rendu, jamais d'un compteur d'étapes — c'est ce qui
  l'empêche de mentir sur un compte et ce qui rattrape un visiteur qui
  agit dans le désordre. Aucun `useEffect`. Toute nouvelle action du
  réducteur doit recevoir sa branche dans `ligneDuFil`, sinon le fil
  devient muet après ce geste. Ne JAMAIS y ajouter : bulle numérotée,
  fond assombri, flèche qui pointe, « étape 2/5 », minuteur qui relance,
  ni horloge fictive — c'est le template qu'on contourne.
- **Une seule blague explicite par site** : `exit 0` au pied de page,
  `exit 1` sur la 404. Rien d'autre, nulle part.
- **RIEN NE BOUGE DE SOI-MÊME.** Règle structurante depuis le grand
  silence (23 boucles `infinite` ramenées à 4). Une animation en boucle
  doit se justifier en une phrase, sinon elle n'existe pas. Les quatre
  survivantes : le bandeau du pied de page (voulu), le curseur de
  `exit 0` (une machine qui attend qu'on tape), et les deux témoins du
  poste rétro (à brancher sur le défilement réel). Avant d'ajouter une
  `@keyframes ... infinite`, se demander ce qu'elle **dit** ; si la
  réponse est « ça fait vivant », elle est refusée. Corollaire :
  `CountUp` a été supprimé — un chiffre qui monte alors qu'il n'a
  jamais changé de valeur est une fausse mesure.

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
- **LE PIÈGE LE PLUS COÛTEUX DU DÉPÔT.** Dans un composant lié au
  défilement, ne JAMAIS écrire `useTransform(p, [entrées], [sorties])` :
  framer-motion le traduit en animation NATIVE calée sur une
  ViewTimeline. Sur une section épinglée haute (750 vh), cette timeline
  sort de sa plage — mesurée à −37 % — et hors plage chaque animation
  retombe sur sa PREMIÈRE image-clé : l'étape 01 réapparaissait à pleine
  opacité par-dessus l'étape 04, les numéros se superposaient et tout
  semblait bloqué. Écrire la forme fonction :
  `useTransform(p, (v) => interpoler(v, [entrées], [sorties]))`, avec
  l'outil de `lib/interpoler.ts`.
- **Le panneau de prévisualisation gèle `requestAnimationFrame` quand
  il est masqué.** Toute animation pilotée par JavaScript y reste
  bloquée sur sa valeur de départ, alors que les animations natives
  continuent de tourner. Conséquence : on ne peut pas valider un effet
  lié au défilement depuis ce panneau, et une mesure « figée » n'y
  prouve rien. Vérifier la logique en Node et la structure dans le DOM,
  puis faire confirmer le rendu par l'utilisateur.
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
- Un `<label>` qui **enveloppe** un `<select>` avale le texte des
  `<option>` dans le nom accessible (« MotifCongés payésRTT… »).
  Toujours relier par `htmlFor`/`id` autour d'une liste déroulante.
- **React joue chaque effet DEUX fois en développement.** Un effet qui
  écrit dans `sessionStorage` au montage puis lit cette valeur pour
  décider quoi afficher se sabote lui-même au second passage (vécu sur
  `BootScreen` : l'ouverture ne se jouait jamais en local, mais aurait
  marché en production — le pire des cas). Écrire le marqueur à la FIN
  de la séquence, jamais au montage.
- L'écran d'ouverture (`.ecran-boot` dans `globals.css`) est en CSS pur,
  **disparition comprise** : sans ça un visiteur sans JavaScript reste
  sur un aplat de sable. Les durées `--boot-*` du CSS et `SEQUENCE_MS`
  du composant sont un miroir l'une de l'autre — changer l'une sans
  l'autre laisse le nœud en place ou le retire en pleine ouverture.
- Toute donnée datée affichée côté client doit attendre le montage
  (drapeau `monte` + `setTimeout(0)`), sinon le rendu serveur et celui
  du navigateur divergent. Et caler les dates de démo sur des jours
  ouvrés : un créneau tombé un samedi affiche « 0 jour » et fait croire
  à un bug.
- `pkill -f "next-server"` se tue lui-même (la commande contient le
  motif) : écrire `pkill -f "next[-]server"`.
- Les lettres du titre magnétique ont une largeur figée par lettre
  (sinon la graisse variable élargit les glyphes et fait trembler la
  ligne par reflow) et l'onde du clic est attachée au `<h1>` seul,
  pas à `window` — ne pas retirer ces mécanismes.

## Mentions légales

Les champs `[À compléter]` de la clé `legal` (raison sociale, SIRET,
directeur de publication) attendent les informations de l'utilisateur.
