> **Document historique** (audit du 19/08/2026) : les chemins et numéros de ligne cités correspondent à une version antérieure du code.

# Audit design R-X — synthèse multi-agents

_8 agents : 3 sur les sites de référence (pxpush, haoqi, michaelgatt), 4 sur les dimensions du site, 1 de synthèse._

# Plan d'action — R-X, refonte visuelle

Base projet : `/home/doudou/dev/r-x.fr/`

---

## ① Rouvrir l'anneau et le décoller du titre — variante PORTAIL

**Fichiers** : `components/Ring3D.tsx`, `app/[locale]/page.tsx`

**On change**
- `Ring3D.tsx` L207 : `BASE_X = -1.42` → **`-1.02`** (58,4°). `scale.z` reste à **1.85** (on garde la masse d'alliance). L'ouverture repasse de −0,031 (bande refermée sur elle-même, lentille pleine) à positive.
- `fit()` (L142-165) : cadrage **horizontal** au lieu de vertical, avec `const DEBORD = 1.15;` → `tanH = tan(fov·π/360)·aspect·DEBORD` ; `dh = |p.x|/tanH + p.z`. Ne cadrer que sur la pose de base + la pose la plus large en Y.
- L361 : `w-[min(228vw,440vh)] aspect-[7/2]` → **`pointer-events-none absolute inset-0`**. Le débordement est géré par la caméra, plus par le DOM : 2,5× moins de pixels, donc `dprMax` L81 `1.25` → **`1.75`**.
- Masque de coupe sur les deux couches : `maskImage: linear-gradient(to bottom, transparent 0, #000 10%, #000 90%, transparent 100%)`.
- `Ring3D` perd son `children` ; dans `page.tsx` on le monte au niveau de la `<section>` (L45), pas dans le flux. Le `<h1>` passe en `relative z-10`, les `Reveal` restent en `z-30`.
- Gouttière : L77 `mt-36 md:mt-52` → **`mt-10 md:mt-14`** ; L63 `pt-32 lg:pt-28` → **`pt-24`**. Marqueur « vous êtes ici » remonté en absolu au centre géométrique de l'ouverture.
- Mobile (<768px) : `BASE_X = -0.95`, couche en `w-[150vw] aspect-square top-[58%]`, `fitAll()` sur changement de `matchMedia`.
- Régénérer `/ring-far.png` et `/ring-near.png` via `app/api/dev-shot/route.ts` après validation de la pose.

**Effet** : deux arcs épais entrent par la gauche et la droite et se perdent hors champ en haut et en bas — anneau à 115 % du viewport, ouverture 1 385 × 513 px. Le titre flotte dedans avec 56 px d'air. Le hero passe de ~974 px à ~700 px : eyebrow, titre, lede et **les deux CTA repassent au-dessus de la ligne de flottaison**. Le métal devient net (DPR 1,75), donc lu comme un objet fin et non comme une masse.

---

## ② Reconstruire l'échelle de valeurs et faire exister les accents en aplat

**Fichiers** : `app/globals.css` (L3-21), `components/CtaBand.tsx`, `components/ApproachList.tsx`, `app/[locale]/page.tsx`, `services/page.tsx`, `a-propos/page.tsx`

**On change**
- Nouveaux tokens (crans ≥ 1,18:1 entre voisins, la palette imposée reste la source) :
  `--sand:#f2ead9` · `--sand-card:#fffdf6` · `--sand-deep:#e2d5ba` · `--sage-wash:#cbdcbc` · `--terra-wash:#f4cdab` · `--line:#c8b995` · `--line-hair:#ddd3bd` · `--ink-soft:#545b4b`
- Écarter les deux accents **en valeur** (aujourd'hui L 0,237 vs 0,224 — identiques en niveaux de gris) :
  `--terra-hot:#d95f2e` (action) · `--terra-deep:#8f3d1c` (fond d'action) · `--sage-deep:#33452c` (structure) · `--sage-strong:#5c7a50`
  **Règle** : terracotta = tout ce qui se clique/s'active. Sauge = tout ce qui porte. Aucun élément ne prend les deux.
- **Zonage par section**, suppression de toute alternance `i % 2` : `offerTones` (services L19-24), `tones` (a-propos L101), tags (page.tsx L187-189), hover (ApproachList L15) → supprimés. Une section = une couleur tenue.
- Aplats pleins obligatoires : `CtaBand` → `bg-terra-deep text-sand-card` + `.btn-light` ; Livrables /services → `bg-sage-deep` ; Convictions /a-propos → `bg-sage-deep text-sand`, cartes en creux `border border-sand/20`. Objectif chiffré : **≥ 18 % de la hauteur scrollée de chaque page en fond saturé non-beige**.
- Différenciation des cartes par le **rang** : numéro en display fin, filet supérieur décroissant `border-t-[3px]/[2px]/[1px]`.

**Effet** : le site sort des deux tons (beige + noir) qui font aujourd'hui toute sa gamme. La bande CTA devient le point rouge de la page, les Livrables et les Convictions deviennent des blocs verts pleins. Les cartes se posent enfin sur le fond au lieu de s'y dissoudre.

---

## ③ Macintosh compact : silhouette, volume, dalle bombée, ombre

**Fichiers** : `components/RetroComputer.tsx`, `components/ProcessScroll.tsx`, `app/globals.css`

**On change**
- **Silhouette d'abord** : `aspect-ratio: 0.72` (vertical), `max-width: 26rem`. Ouverture d'écran : 71 % de W, sommet à 16 % de H, hauteur 38 % de H. **Menton de 54 % à 100 % de H** — c'est lui qui identifie l'objet. Rayons 6 % de W en haut, 3 % en bas.
- **Trois faces, pas une** : facette supérieure (7 % de H, beige +10 %, `clip-path: polygon(0 100%,5% 0,95% 0,100% 100%)`), facette latérale droite seule (3,5 % de W, beige −18 %), face avant avec draft de moulage `polygon(3.5% 0,96.5% 0,100% 100%,0 100%)`. Chanfreins en `inset` box-shadow, jamais en `border-radius`. Zéro `rotate3d`, zéro `preserve-3d`.
- **Dalle bombée** : `clipPath` SVG en `objectBoundingBox` (bords convexes, coins mangés) sur la couche verre + le cerclage noir `inset 0 0 0 6px #0b0d0a`, contenu en retrait de 3 %.
- **Une seule lumière**, haut-gauche 35° : arête haute claire, arête basse et flanc droit sombres. Ombre en deux couches — `.crt-contact` nette et collée (blur 4px, `bottom:-2px`) + `.crt-cast` oblique (`skewX(-34deg) scaleY(.36)`).
- **Matière plastique** : tokens `--case-hi/-case/-case-lo/-case-side/-case-crease`, empilement radial + liserés latéraux + linéaire vertical (plus jamais un seul dégradé à 150°). Hue 40-46°, saturation 12-20 %.
- **Balayage émissif** : lignes SVG **bombées** générées (pitch 3, amplitude signée), grille d'ouverture RVB en `screen`, bloom `backdrop-filter: blur(4px) brightness(1.55)` en `screen`, bande roulante `.scanline` (déjà dans globals.css). `isolation: isolate` sur le conteneur de dalle — sans ça le `multiply` bave sur le fond de section.
- **Détails datants** : fente 3,5" en rapport ~22:1 (noyau noir, lèvre claire, bouton d'éjection, LED), aérations en **une** `repeating-linear-gradient` creusée sur la facette supérieure (supprimer les 30 `<span>` de 1 px), ligne de moulage à 62 % de H, deux empreintes d'éjecteur, badge gravé (`text-shadow: 0 1px 0 rgba(255,255,255,.68)` **sous** le texte).
- **Fond de scène** : `radial-gradient(120% 90% at 50% 8%, #3f6ea8, #24456f 46%, #16283f)` derrière l'objet, + rebond froid `inset 0 -6px 12px -6px rgba(86,132,196,.38)` sur l'arête basse.
- **Contenu des 5 écrans** : rayon max 2 px, zéro `backdrop-blur`/`shadow`/`blur`, aucune opacité sous 40 %, écart ≥12 L* entre surfaces adjacentes, tirets en SVG `stroke-dasharray`. Écran 05 différencié par une chrome de navigateur 1-bit + `translateY(-18%)`.
- **Cotes en `cqw`** sur `[container-type:inline-size]` — ou mieux, coque en **un SVG inline** `viewBox="0 0 440 612"`, couche écran en absolu sur `x=64 y=98 w=312 h=234`.

**Effet** : on passe de « deux feuilles de papier scotchées » à un objet moulé, vertical, posé au sol avec une empreinte, détaché sur un fond bleu froid. C'est la demande client la plus littérale et la plus vérifiable.

---

## ④ Typographie : sortir de la graisse unique

**Fichiers** : `components/HeroTitle.tsx`, `PageHeader.tsx`, `SectionLabel.tsx`, `ApproachList.tsx`, `app/globals.css`

Bricolage est chargé en variable 200→800 et **seul le 700 est affiché** (33 `font-bold`, zéro autre graisse). Une graisse par rôle : hero **820** / h1 **760** / h2 **680** / h3 **560** / chiffres fantômes **240** / libellés **520**. Geste signature dans `HeroTitle.tsx` : ligne A `font-[260] text-ink-soft`, ligne B `font-[820] tracking-[-0.045em] text-ink`. `ApproachList` : `font-[300]` → `font-[720]` au `group-hover` par transition sur `font-variation-settings`.
Échelle sur ratio 1,333 avec le **palier manquant de 40 px** (`--text-lg-d: clamp(1.75rem,3vw,2.5rem)`) ; hero à 9rem, h1 de page **et** h2 de section ramenés au même cran 4,5rem ; corps à 17 px.
Tracking par palier (`.tr-mega -0.045em` → `.tr-base 0.004em`) à la place des 21 `tracking-tight` uniformes ; leading par palier (1.18 / 1.38 / 1.55) à la place des 17 `leading-relaxed`. `.nums { font-variant-numeric: tabular-nums slashed-zero }` sur toutes les numérotations, chiffres fantômes en contour `-webkit-text-stroke:1px var(--line)`.

**Effet** : la fonte retrouve sa voix. Un titre où un mot pèse cinq fois l'autre n'est pas confondable avec un template.

---

## ⑤ Signature formelle : angles vifs, ombres dures, fin des halos pastel

**Fichiers** : `app/globals.css`, `app/[locale]/page.tsx` (L47-62), toutes les cartes

Trois rayons seulement : **0** (structurel : sections, cartes d'offres, convictions), **4 px** (médias), **`rounded-full` réservé au bouton primaire et à la pastille d'état** — contre 64 `rounded-full` aujourd'hui. `.btn-secondary` → `rounded-none border-2 border-ink`. Asymétrie signature sur les cartes projets : `rounded-[0_2rem_0_2rem]`.
Ombres : `.card-hover` → **`box-shadow: 8px 8px 0 0 var(--ink)`**, hover `translate(-3px,-3px)` + `12px 12px`. Bouton primaire : lueur colorée `0 6px 18px -8px rgba(143,61,28,.55)`. Plus une seule ombre grise, ombre du Topbar supprimée.
**Suppression des deux aurora blobs du hero** (L47-62) — le cliché le plus reconnaissable du design généré, et l'exact contraire du concept « radiographie ». Remplacés par : grille technique 88 px masquée en radial, `GrandArc` en trait terra-hot 1,5 px traversant, réglure de mesure 24 px en bas de hero. Bordures : `--line` passe à `#c8b995` (1,62:1) avec hiérarchie d'épaisseurs 2px/1px/hairline. Grain : `opacity .028 → .06`, `mix-blend-mode: multiply`, `baseFrequency .65`, `numOctaves 3`, `z-index 50 → 9`.

**Effet** : le site arrête d'être doux et vague. Trait, angle, ombre décalée : c'est là que se joue le « jeune ».

---

## ⑥ Repère éditorial + cadre-HUD à la place de l'eyebrow SaaS

**Fichiers** : `components/SectionLabel.tsx`, `Topbar.tsx`, `Footer.tsx`, `app/globals.css` (L86-88)

Le combo `uppercase + 0.18em + semibold + 12,5 px` apparaît **12 fois** : c'est la signature littérale des landing pages 2020-2023. Remplacé par un repère bas-de-casse 15 px, `font-[520]`, tracking 0.005em, numéro terracotta tabulaire, et **un filet `flex-1` qui traverse jusqu'au bord de colonne**. Supprimer le `RingGlyph` répété 8 fois par page.
Puis, emprunt haoqi : `Topbar` + `Footer` fusionnés en un cadre `fixed inset-0 pointer-events-none flex flex-col justify-between`, deux lignes seulement, dans une 3e police mono (`--font-hud`, 12-13 px, tabular-nums) : `PARIS · 14:32 · FR` en bas-gauche, avancement `034 %` en bas-centre, `THÈME[T]` en haut. Et **le survol devient un rectangle en pointillés** (`::before border-2 border-dotted`, transparent → `--sage-strong`, 200 ms, ≥lg) : c'est le vocabulaire de la boîte de sélection Figma, et c'est l'argument métier de R-X rendu visible — la zone cliquable se montre au lieu de se deviner. Même signe que le `:focus-visible` existant : plein au clavier, pointillé à la souris.

**Effet** : la page se lit comme un instrument. Un studio d'ergonomie qui dessine ses cibles de clic, c'est une démonstration, pas une décoration.

---

## ⑦ L'anneau piloté par la vélocité de scroll, puis migré dans le Topbar

**Fichiers** : `components/Ring3D.tsx`, `Logo.tsx`, `Topbar.tsx`

Rotation proportionnelle à la **vitesse** de scroll et réversible (scroll inverse = rotation inverse), avec facteur de retard type `scrollSyncFactor: 0.72` — l'anneau traîne, il ne décalque pas. Puis trajet : il quitte le centre du hero, rétrécit vers sa position fixe dans le Topbar et **devient le lien accueil**. `Ring3D` + `RingGlyph` + `Logo` fusionnent en un seul objet continu au lieu de trois éléments qui se ressemblent.
Prérequis d'ingénierie : cycle `prepared → revealed → ready` avec timeout dur, pour que le hero ne montre jamais un trou pendant l'import dynamique de three.js — sinon on affiche le fallback PNG.

**Effet** : le métal brossé rend la vitesse lisible. Le scroll acquiert une contrepartie physique — le geste le plus rentable des trois références, et il ne coûte aucun nouveau composant.

---

## ⑧ Réaligner les pages intérieures sur l'ambition de l'accueil

**Fichiers** : `PageHeader.tsx`, `CtaBand.tsx`, `realisations/page.tsx`, `services/page.tsx`, `contact/page.tsx`, `CaseCover.tsx`

- `PageHeader` : props `n` et `tone` ; halo radial propre à chaque page ; `RingsDecor` **visible en mobile** (retirer `max-md:hidden` — aujourd'hui le header mobile est 582 px de sable vide) ; eyebrow → `SectionLabel n={n}`. Titres intérieurs à `.h-section` (`clamp(2.4rem,5.5vw,4.5rem)`) : ils sont à 36 px face à un CtaBand à 60 px, donc le bloc le plus fort de chaque page est un bloc partagé.
- `CtaBand` : prop `variant="ink"`, décor déplacé, titre descendu à `md:text-5xl`, espacement possédé par le composant (`mt-24 md:mt-32`) au lieu des wrappers bricolés page par page. Sur /services, intercaler le `Marquee` pour amortir la collision `ink-deep` / pastel.
- /realisations : une section pleine largeur par projet, la 2e en `bg-ink-deep` ; projets **cliquables** avec `group-hover:scale-[1.04]` et pastilles colorées (aujourd'hui la page dédiée est plus pauvre que son teaser) ; grille éditoriale décroissante 12 colonnes (`col-span-8 col-start-5`, puis 6, puis 3).
- /services : 2×2 de boîtes identiques → grille 5 colonnes `spans = [3,2,2,3]` + table de peaux avec **une carte sombre**. `TiltCard amount={0.35}` sur les cartes de texte (±8° déforme la typo sur une page qui vend la lisibilité).
- /contact : `CopyEmail` en bloc pleine largeur `bg-ink-deep` + `GrandArc`, FAQ en deux colonnes avec titre collant.
- Bug : `CaseCover.tsx` → ajouter `preserveAspectRatio="xMidYMid slice"` (bandes vides de 11 px en haut/bas des couvertures).

**Effet** : plus de header cloné quatre fois, plus de CTA identique quatre fois. Chaque page a son moment.

---

## ⑨ Rendre les animations réelles et l'exécution fluide

**Fichiers** : `components/Reveal.tsx`, `ProcessScroll.tsx`

`Reveal` en variante `fade` (la valeur par défaut) fait littéralement `return <div className={className}>{children}</div>` : **tous les `delay` échelonnés des pages intérieures sont morts**. L'implémenter (`y: 18` → `0`, 0.5s, ease `[0.22,1,0.36,1]`), passer les cartes d'offres, de convictions et la carte radiographie en `variant="mask"`.
Perfs : retirer `blur-md` des blobs de heatmap (redondant avec le radial-gradient), `visibility:hidden` + `content-visibility:auto` sur les écrans hors segment (le `clip-path` n'arrête pas une animation CSS — ~30 animations tournent en permanence), `will-change: clip-path` sur la seule couche en transition, et remplacer le volet `inset()` par une transition d'époque en pur transform (flash blanc 90 ms + `translateY(-100%)→0` + décrochage horizontal 40 ms).
Anti-saut (Michael Gatt) : `opacity: 0.00001` au lieu de `0` sur l'état initial (le texte est mesuré et rastérisé avant révélation), `will-change` posé uniquement pendant l'animation, `--vh` figé au premier rendu pour que l'écran épinglé ne saute pas quand la barre d'URL mobile se rétracte.

**Effet** : une animation qui saccade est perçue comme du bricolage quelle que soit la qualité graphique. Et les pages intérieures cessent d'avoir un seul élément animé.

---

## ⑩ Lentille papier globale + ancrage matériel de la palette

**Fichiers** : nouveau wrapper de layout, `app/[locale]/not-found.tsx`, `app/layout.tsx`

Un composant unique en `fixed` au-dessus de tout le site — le principe qui donne à PX PUSH son unité — mais en **papier**, pas en cathodique : grain offset 2-3 % en `#24291f` (feTurbulence en data-URI, pas de PNG), vignette radiale très douce, `mix-blend-mode: multiply`, **grain figé** (pas de flicker : on vend la lisibilité), opt-out sous `prefers-reduced-motion`. Aucune scanline hors du CRT.
Ancrage matériel de la palette imposée, montré et jamais expliqué : terracotta = ruban encreur, sauge = papier millimétré, sable = fiche bristol de tri par cartes, encre = mine de crayon. La **404 devient la démonstration** : fiche bristol pleine page, annotation manuscrite terracotta « cette carte n'a pas été triée », prompt de retour.
Nettoyage : trancher sur l'italique d'Instrument Sans (31 Ko chargés pour trois mots) — soit on en fait un système (emphase du manifeste, segment après le tiret cadratin des ledes, légendes d'état), soit on supprime le bloc `layout.tsx` L26-30.

**Effet** : une matière unique tient les quatre pages ensemble, et la marque s'explique en étant utilisée.

---

**Séquencement** : ① → ③ d'abord (les deux demandes littérales du client, visibles en 3 secondes). ② et ④ ensuite, car ⑤ à ⑧ consomment leurs tokens et leurs graisses. ⑨ avant toute mise en ligne. ⑩ en finition.