export type MockupTextes = {
  ceramique: {
    marque: string;
    menu: string[];
    titre: string;
    sousTitre: string;
    action: string;
  };
  salon: {
    marque: string;
    titre: string;
    jour: string;
    creneaux: string[];
    pris: string;
    action: string;
  };
};

/**
 * L'aperçu d'un projet type : la première page d'un site, dessinée en
 * aplat de papier. Pas de fenêtre de navigateur, pas de pastilles : le
 * visiteur voit ce qu'un client verrait. Tous les corps de texte se
 * mesurent en largeur de conteneur avec un plancher en pixels (voir
 * `.apercu-*` dans globals.css) : lisible sur un téléphone, à tout âge.
 */
export default function Apercu({ variant, textes }: { variant: keyof MockupTextes; textes: MockupTextes }) {
  if (variant === "salon") {
    const s = textes.salon;
    // Deuxième créneau pris, quatrième choisi : un agenda qui vit.
    const etat = (i: number) => (i === 1 ? "pris" : i === 3 ? "choisi" : "libre");
    return (
      <div className="apercu" role="img" aria-label={`${s.marque} — ${s.titre}`}>
        <div className="apercu-marque">{s.marque}</div>
        <div>
          <div className="apercu-titre">{s.titre}</div>
          <div className="apercu-sous">{s.jour}</div>
        </div>
        <ul className="apercu-creneaux" aria-hidden="true">
          {s.creneaux.map((c, i) => (
            <li
              key={c}
              className="apercu-creneau"
              data-pris={etat(i) === "pris" ? "" : undefined}
              data-choisi={etat(i) === "choisi" ? "" : undefined}
            >
              {etat(i) === "pris" ? s.pris : c}
            </li>
          ))}
        </ul>
        <span className="apercu-bouton">{s.action}</span>
      </div>
    );
  }

  const c = textes.ceramique;
  return (
    <div className="apercu" role="img" aria-label={`${c.marque} — ${c.titre}`}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="apercu-marque">{c.marque}</div>
        <ul className="apercu-menu" aria-hidden="true">
          {c.menu.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="apercu-titre">{c.titre}</div>
        <div className="apercu-sous">{c.sousTitre}</div>
      </div>
      <span className="apercu-bouton">{c.action}</span>
    </div>
  );
}
