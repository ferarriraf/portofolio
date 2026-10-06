@AGENTS.md

# Contexte pour Claude — site r-x.fr

Site vitrine bilingue (FR sans préfixe, EN sous `/en`) de **Raf,
développeur web indépendant installé dans le Gers**, qui signe **R-X**.
Voix « je ». Public : **des commerçants, des restaurateurs et des
artisans qui cherchent un site — pas des développeurs.** Domaine
canonique **www.r-x.fr** (r-x.fr redirige en 308). Stack : Next.js 16
(App Router, Turbopack, `proxy.ts`), next-intl (chemins localisés),
Tailwind v4, polices locales woff2. Voir le README pour les commandes,
le déploiement et la table « où modifier quoi ».

## La refonte d'octobre 2026 (direction « L'atelier »)

Le site a été **refait d'un bloc** le 5 octobre 2026, après un audit
(8 lecteurs) qui concluait : socle technique sain, dessin fait par
couches successives, et un site qui parlait aux développeurs alors que
le public est l'artisan. Le propriétaire a tranché sur maquettes
statiques (trois directions regardées côte à côte) et choisi la C.

Ce qui définit le site maintenant — c'est le brief positif, à relire
avant toute modification :

- **La phrase du brief** : un restaurateur ou un plombier doit ressentir
  en dix secondes *un artisan sérieux et calme*. Papier, une seule
  lumière, peu de mots ; le site rassure avant de séduire.
- **La matière, seule** : palette sable / sauge (structure) / terracotta
  (action) / encre verte ; bandes d'encre en creux ; ombres teintées ;
  arêtes ciselées sur papier ; letterpress au pied de page ; **une seule
  lueur phosphore**, sur l'encre : la phrase du hero et les numéros de la
  méthode. Nulle part ailleurs.
- **Aucun objet de métier.** Retirés et à ne pas réintroduire : le cadre
  de sélection « calque », les lettres magnétiques, le Mac rétro et ses
  écrans, les fenêtres à pastilles, les modes cachés au clavier, le
  message console, le clic droit bloqué, l'écran d'ouverture, le verre
  liquide, la brique 3D, l'application RH jouable. three.js est
  désinstallé.
- **L'ordre du client** sur l'accueil : promesse → ce qui lui arrive →
  preuve (deux projets types) → méthode → contact. Pas de section
  épinglée, pas de molette morte. Mesuré au lancement : 4,7 écrans à
  1400×900, 6,5 sur téléphone.
- **Une personne** : Raf, dans le Gers. Pas de photo ni de téléphone.
- **L'argent** : pas de chiffre (il n'en existe pas encore). Le site dit
  comment on chiffre et une FAQ « Combien ça coûte ? » l'explique. Dès
  que Raf fixe des « à partir de », ils entrent dans `services.pricing`.
  Jamais inventés.
- **Les engagements écrits** (`services.offers[].included`,
  `services.pricing.items`, FAQ) sont des propositions que Raf doit
  confirmer ou retirer ; ne pas en ajouter sans lui.
- **Les textes** sont en registre professionnel, sobre et direct. Raf a
  dit qu'il les réécrira lui-même plus tard ; d'ici là : pas de
  formules, pas de listes de trois à effet, pas de « pas X, mais Y »,
  pas d'apartés. Il a trouvé la première version « bot de ouf » — c'est
  le critère.
- **Barre du haut** : dans le flux (plus fixe), un bouton d'action à
  droite et FR / EN **avec leurs petits drapeaux** (`components/Flags.tsx`,
  redemandés par le propriétaire le 5 octobre : « c'était pas mal »).
  Elle prend la couleur de l'encre sur l'accueil via
  `body:has(main [data-hero-encre]) .entete`.
- **Pas de fondu au premier chargement.** Le fondu d'entrée ne joue
  qu'entre deux pages : `app/[locale]/template.tsx` pose la classe
  `entree-anime` dans un `useLayoutEffect` (avant le premier dessin)
  seulement si `<html data-navigue>` est déjà là, et pose ce marqueur
  sinon. Au rechargement, fondre toute la page depuis le papier faisait
  un éclair clair avant le hero sombre : « le flash blanc du reload ».
  Piège vécu : poser le marqueur depuis un composant à part après le
  premier rendu relance l'animation sur la page déjà affichée — c'est
  pire que le flash.
- **Page À propos** : du texte et une liste de faits, c'est tout. Les
  « Trois engagements » en colonnes numérotées et le « Déroulé d'un
  projet » (tableau semaines / moi / vous) ont été jugés « trop IA » le
  6 octobre et retirés ; les engagements vivent en un paragraphe
  (`about.who.p3`). Ne pas réintroduire de colonnes numérotées ni de
  frise.
- **Le bandeau défilant** reste : ses mots sont des liens vers les offres
  (`/services#id`), il a son bouton d'arrêt, il ne s'arrête pas au
  survol.
- **La démo** `/demo` et le projet « application métier » sont retirés ;
  `/demo` et `/en/demo` redirigent (308) vers les démonstrations. Le
  second projet type est une prise de rendez-vous (salon de coiffure).

## Méthode de travail (règles de l'utilisateur)

- **Poser des questions avant** tout gros travail ou choix structurant
  (AskUserQuestion) — règle permanente, demandée explicitement.
- **Demander avant d'interpréter** : si un retour désigne un élément de
  façon ambiguë (« la barre », « le bandeau »), demander lequel.
- L'utilisateur est novice en Node/Next : expliquer pédagogiquement les
  choix techniques, en français.
- **Regarder avant de pousser.** Leçon de la brique 3D (« regarde après
  avoir fait quand même ») : toute livraison visuelle est capturée et
  REGARDÉE, bureau et téléphone. Recette qui marche sur ce poste : servir
  le build (`npx next start -p 3100`) puis
  `msedge --headless=new --disable-gpu --user-data-dir=<dossier neuf>
  --hide-scrollbars --timeout=8000 --window-size=1400,4000
  --screenshot=<png> <url>`. Utiliser `--timeout`, PAS
  `--virtual-time-budget` (le bandeau en boucle l'empêche de finir).
  Les captures sortent avec le contenu de `main` à mi-opacité : c'est le
  fondu d'entrée figé par le mode sans fenêtre, pas un défaut du site
  (vérifié : opacité 1 dans un vrai navigateur). Le mode sans fenêtre
  n'émule pas un téléphone : pour le mobile, mesurer dans le panneau de
  prévisualisation (préréglage mobile + JavaScript), ses captures y sont
  capricieuses mais ses mesures sont justes.
- **Maquettes avant code** pour tout changement de direction : des
  pages statiques à taille réelle, pas des descriptions.
- À chaque modification : vérifier que robots.txt, sitemap.xml et
  llms*.txt reflètent le changement (générés au build depuis
  `messages/*.json`, `app/sitemap.ts`, `app/robots.txt/route.ts`,
  `lib/llms.ts` — les chemins y viennent du routage) et tenir les
  fichiers .md à la main.
- Flux : je committe et pousse ; l'utilisateur fait `git pull &&
  npm run build` sur le serveur Infomaniak (`~/sites/portofolio`, SSH)
  puis redémarre via le manager. Récupération serveur :
  `git fetch origin && git reset --hard origin/main && rm -rf .next`.
- Ce poste : Node 24 LTS (installé le 5 octobre 2026), `npm run build`
  et `npx eslint .` passent.

## Honnêteté (non négociable)

Aucun vrai client à ce jour : les deux démonstrations sont des
**projets types** construits pour montrer la méthode, et chaque page
qui les montre le dit (`home.proof.note`, `work.lede`, `work.note`,
llms.txt). Seuls des faits vérifiables sont affichés (réponse sous deux
jours ouvrés, FR/EN, 0 cookie, fondé en 2026, Gers). Ne jamais inventer
de chiffres, clients, années d'expérience ou promesses invérifiables.
« Tests automatisés » a été retiré (le dépôt n'en a pas) ; « sécurisé »
aussi. Un mot que le public n'emploie pas est un mot de trop : le
vocabulaire de console est banni du site.

## Goûts visuels de l'utilisateur (durement acquis)

- **Adoré** : la lueur phosphore terracotta sur l'encre (gardée, en un
  seul endroit), les détails d'artisanat précis, la direction C
  « L'atelier » (papier qui alterne avec des bandes d'encre).
- **Détesté** : tout ce qui « fait IA » ou template (cartes 2×2, cartes
  qui se soulèvent, keycaps à étages d'ombre, halos qui respirent,
  chiffres qui montent, tilts à la souris, curseurs custom), les polices
  outline, les liserés clairs 1 px sur fond sombre, les rotations 3D qui
  aplatissent l'objet, plusieurs écrans côte à côte, les textes qui
  sonnent machine.
- Interactions discrètes : enfoncement 1 px au clic, changement de
  couleur — pas de levée au survol. Un bloc qui réagit au survol sans
  être cliquable est une promesse qu'on ne tient pas.
- **RIEN NE BOUGE DE SOI-MÊME.** Une seule boucle infinie : le bandeau
  du pied de page, voulu, avec son bouton d'arrêt (WCAG 2.2.2). Avant
  d'ajouter une `@keyframes … infinite`, se demander ce qu'elle dit ; si
  la réponse est « ça fait vivant », elle est refusée.
- **Le reçu** (`components/Recu.tsx`) : ne s'affiche QUE si une machine
  a réellement agi ; ne porte jamais une information absente en clair à
  côté ; énonce un fait vérifiable. La lueur est en `--terra-hot`, le
  texte jamais.
- **Aucune molette morte** : c'est la vraie règle derrière « page
  courte ». Chaque pixel de défilement doit faire changer quelque chose.
  Avant toute section en `vh`, mesurer ce qu'elle coûte en écrans.
- Pour mémoire, les cinq versions rejetées de l'ancienne section
  « méthode » (scrollytelling épinglé, cinq postes côte à côte, poste
  piloté au clic, touches de clavier, liste épinglée avec 55 % de
  molette morte) et la brique 3D (« horriblement moche ») : tout ça est
  parti avec la refonte. Ne pas y revenir.

## Contraintes techniques du site

- **Zéro cookie, littéral** : `localeCookie: false` ET
  `localeDetection: false` dans `i18n/routing.ts` — la langue est
  portée par l'URL seule. Le seul stockage navigateur est la fermeture
  du bandeau cookie (localStorage), et le bandeau le dit.
- **Email jamais dans le HTML** ni dans les fichiers machine :
  recomposé côté client (`components/MailLink.tsx`, morceaux inversés).
- `prefers-reduced-motion` respecté pour CHAQUE effet, sans exception.
- Pas de nouvelle dépendance npm sans accord ; CSP stricte (aucune
  ressource externe : pas de CDN, pas de Google Fonts, pas d'image
  distante). framer-motion ne sert plus qu'au bandeau cookie et au
  formulaire ; l'entrée de page est en CSS.
- Français : espace insécable U+00A0 avant `: ; ? !` dans
  `messages/fr.json`. Les deux fichiers de langue sont générés par un
  script qui vérifie la parité des clés (275 clés par langue au
  lancement) ; en cas de gros changement de texte, refaire pareil
  plutôt qu'éditer à la main.
- **Formulaire de contact** : envoi par SMTP écrit à la main
  (`lib/smtp.ts`, zéro dépendance). Réglages **uniquement** en
  variables d'environnement (`.env.example`) : ne jamais écrire
  l'adresse d'arrivée ni le mot de passe dans le code. Anti-robots =
  champ-piège invisible + délai minimal + 3 envois / 10 min par IP,
  jamais de captcha. Sans réglages, le formulaire annonce honnêtement
  qu'il est indisponible.
- La carte de partage (`app/og/[locale]/route.tsx`) est dessinée au
  build en sans-serif système : le moteur d'image ne lit pas les woff2.

## Pièges connus (ne pas retomber dedans)

- Ne JAMAIS filtrer `npm run build` avec grep : TypeScript tourne
  APRÈS « Compiled successfully » — toujours lire la fin et vérifier
  le code de sortie.
- `git rm` avec une liste de fichiers avorte ENTIÈREMENT si un seul
  chemin n'existe pas, sans rien supprimer : vérifier la sortie.
- `perl -pe 's/ /\x{00a0}/'` écrit un octet 0xA0 nu (UTF-8 invalide,
  Turbopack refuse le JSON) : passer par Python (`json.dump`,
  `ensure_ascii=False`).
- eslint `react-hooks/set-state-in-effect` : différer avec
  `setTimeout(0)` (pattern CopyEmail / MailLink).
- eslint `react-hooks/refs` : regrouper des `useRef` dans un objet puis
  lire `objet.champ` dans le JSX est refusé. Une variable par ref.
- **React joue chaque effet DEUX fois en développement.** Un effet qui
  écrit un marqueur au montage puis le lit pour décider quoi afficher se
  sabote au second passage. Écrire le marqueur à la FIN de la séquence.
- next-intl ICU : `{` s'échappe avec des quotes ; **`<` aussi** — un
  message contenant une balise lève `INVALID_TAG` à chaque rendu.
- Node lit les `.ts` sans les compiler : pas de « propriétés de
  paramètre » (`constructor(private x: X)`) dans `lib/`, sinon les
  fichiers ne sont plus testables hors du site.
- Un `<label>` qui **enveloppe** un `<select>` avale le texte des
  `<option>` dans le nom accessible. Toujours `htmlFor`/`id`.
- Toute donnée datée affichée côté client doit attendre le montage,
  sinon le rendu serveur et celui du navigateur divergent.
- `pkill -f "next-server"` se tue lui-même : écrire `pkill -f "next[-]server"`.
- **JAMAIS de `y` / `translate` dans `app/[locale]/template.tsx`.** Ce
  bloc enveloppe TOUT le contenu de chaque page, et son état de départ
  est servi dans le HTML. Un décalage de départ est additionné par le
  navigateur à chaque restauration de position (loi vérifiée en
  production : nouvelle position = ancienne + décalage − décalage
  courant ; sept F5 et le texte lu est passé derrière le haut de
  l'écran). L'opacité seule est sans danger. Ce bug a coûté un audit.
- **Le panneau de prévisualisation gèle `requestAnimationFrame`, les
  transitions CSS et les styles calculés des pseudo-éléments quand il
  est masqué**, et rapporte `innerHeight: 0` : une mesure de géométrie
  faite dans cet état est nulle et trompeuse. Ses captures expirent
  souvent (« did not finish rendering ») : le JavaScript, lui, répond.
  Pour regarder, passer par Edge sans fenêtre (recette plus haut).
- Ne jamais écrire `-webkit-backdrop-filter` à la main à côté de
  `backdrop-filter` : le compilateur CSS supprime la version standard.
- Un titre posé à côté d'un bloc rembourré se cale sur le BORD du bloc,
  pas sur son TEXTE : comparer les lignes de texte
  (`Range.getClientRects()`), pas les boîtes.
- Dans un fichier HTML servi sans l'enveloppe de l'artefact, `[hidden]`
  est battu par un `display: grid` d'auteur : toujours poser
  `[hidden]{display:none!important}` dans le CSS des maquettes.

## Mentions légales

La page dit honnêtement que les informations d'identification de
l'entreprise (dénomination, forme juridique, SIRET, adresse) sont en
cours d'enregistrement. Dès que Raf les fournit, les écrire dans
`legal.editor.text` des deux langues. Tant qu'elles manquent, le site
n'est pas conforme à la LCEN : le rappeler sans harceler.
