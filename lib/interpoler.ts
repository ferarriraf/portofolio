/**
 * Interpolation linéaire à bornes bloquées, en JavaScript pur.
 *
 * POURQUOI CE FICHIER EXISTE — piège coûteux, vécu en production :
 *
 * `useTransform(progression, [entrées], [sorties])` est traduit par
 * framer-motion en animation NATIVE du navigateur, calée sur une
 * ViewTimeline. Sur une section épinglée très haute (750 vh pour le
 * scrollytelling de la méthode), cette timeline sort de sa plage — son
 * temps courant a été mesuré à −37 %. Or hors plage, une animation
 * native retombe sur sa PREMIÈRE image-clé : l'étape 01 réapparaissait
 * à pleine opacité par-dessus l'étape 04, les numéros se superposaient,
 * et les valeurs se figeaient d'un bout à l'autre du défilement.
 *
 * Passer la transformation sous forme de FONCTION force le calcul en
 * JavaScript, à chaque changement de la valeur de défilement. Aucune
 * timeline native, donc aucune plage à sortir.
 *
 * Règle pour ce dépôt : dans un composant lié au défilement, ne jamais
 * écrire `useTransform(p, [a, b], [x, y])`. Écrire
 * `useTransform(p, (v) => interpoler(v, [a, b], [x, y]))`.
 */
export function interpoler(
  valeur: number,
  entrees: number[],
  sorties: number[],
): number {
  const dernier = entrees.length - 1;
  if (valeur <= entrees[0]) return sorties[0];
  if (valeur >= entrees[dernier]) return sorties[dernier];

  for (let i = 1; i <= dernier; i++) {
    if (valeur <= entrees[i]) {
      const largeur = entrees[i] - entrees[i - 1];
      // Deux bornes confondues : pas de division, on prend l'arrivée
      if (largeur <= 0) return sorties[i];
      const t = (valeur - entrees[i - 1]) / largeur;
      return sorties[i - 1] + t * (sorties[i] - sorties[i - 1]);
    }
  }
  return sorties[dernier];
}
