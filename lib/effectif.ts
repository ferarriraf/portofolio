/**
 * « effectif » — les règles de la démonstration RH.
 *
 * Tout est ici : les personnes, les demandes, les entretiens et les
 * transitions autorisées. L'affichage n'en sait rien, et rien ne sort
 * du navigateur du visiteur — aucune base, aucun appel réseau, aucune
 * donnée conservée d'une visite à l'autre.
 *
 * Les libellés visibles vivent, comme partout sur le site, dans
 * `messages/*.json` : on ne manipule ici que des clés.
 */

export type Role = "salarie" | "manager";

export type StatutDemande = "attente" | "validee" | "refusee";
export type StatutEntretien = "aPlanifier" | "planifie" | "fait";
export type MotifConge = "payes" | "rtt" | "sansSolde" | "familial";
export type TypeEntretien = "annuel" | "professionnel" | "arrivee";

export type Personne = {
  id: string;
  nom: string;
  /** Clé de service, traduite à l'affichage */
  service: "atelier" | "commercial" | "comptabilite";
};

export type Demande = {
  id: string;
  personne: string;
  /** Dates ISO (AAAA-MM-JJ), toujours calculées à partir d'aujourd'hui */
  debut: string;
  fin: string;
  motif: MotifConge;
  statut: StatutDemande;
};

export type Entretien = {
  id: string;
  personne: string;
  type: TypeEntretien;
  statut: StatutEntretien;
  /** Date ISO, absente tant que l'entretien n'est pas planifié */
  date?: string;
};

export type Etat = {
  role: Role;
  demandes: Demande[];
  entretiens: Entretien[];
  /** Compteur local : suffit à donner un identifiant unique par session */
  suivant: number;
};

/** Le visiteur incarne cette personne quand il passe côté salarié */
export const MOI = "moi";

export const DROIT_ANNUEL = 25;

export const PERSONNES: Personne[] = [
  { id: MOI, nom: "Sacha D.", service: "atelier" },
  { id: "camille", nom: "Camille R.", service: "atelier" },
  { id: "yanis", nom: "Yanis B.", service: "commercial" },
  { id: "lea", nom: "Léa M.", service: "comptabilite" },
];

export function personne(id: string): Personne {
  return PERSONNES.find((p) => p.id === id) ?? PERSONNES[0];
}

/* ——— Dates ——— */

/** Décale une date d'un nombre de jours, sans toucher à l'original */
export function decaler(depuis: Date, jours: number): Date {
  const d = new Date(depuis);
  d.setDate(d.getDate() + jours);
  return d;
}

export function enIso(d: Date): string {
  // Découpage manuel plutôt que toISOString() : ce dernier bascule en
  // UTC et peut reculer d'un jour selon le fuseau du visiteur.
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
}

/** Nombre de jours ouvrés entre deux dates, bornes comprises */
export function joursOuvres(debut: string, fin: string): number {
  const d = new Date(debut + "T12:00:00");
  const f = new Date(fin + "T12:00:00");
  if (Number.isNaN(d.getTime()) || Number.isNaN(f.getTime()) || f < d) return 0;

  let total = 0;
  for (const jour = new Date(d); jour <= f; jour.setDate(jour.getDate() + 1)) {
    const semaine = jour.getDay();
    if (semaine !== 0 && semaine !== 6) total += 1;
  }
  return total;
}

/** Solde restant : le droit annuel moins les congés payés validés */
export function solde(demandes: Demande[]): number {
  const pris = demandes
    .filter((d) => d.personne === MOI && d.statut === "validee" && d.motif !== "sansSolde")
    .reduce((somme, d) => somme + joursOuvres(d.debut, d.fin), 0);
  return DROIT_ANNUEL - pris;
}

/** Le lundi de la semaine en cours, quel que soit le jour d'arrivée */
export function lundiDeLaSemaine(d: Date): Date {
  const jour = d.getDay(); // 0 = dimanche
  return decaler(d, jour === 0 ? -6 : 1 - jour);
}

/* ——— État de départ ———
   Tout est calé sur le lundi de la semaine en cours : la démo ne
   vieillit jamais, et surtout aucune absence ne tombe un samedi — une
   demande affichant « 0 jour ouvré » aurait l'air cassée. Trois
   demandes attendent toujours une décision, comme l'annonce la page
   Démonstrations. */

export function etatInitial(aujourdHui: Date): Etat {
  const lundi = lundiDeLaSemaine(aujourdHui);
  /** Jour ouvré, compté en semaines et en jours depuis ce lundi */
  const j = (semaines: number, jourDeSemaine = 0) =>
    enIso(decaler(lundi, semaines * 7 + jourDeSemaine));

  return {
    role: "manager",
    demandes: [
      { id: "d1", personne: "camille", debut: j(2), fin: j(2, 4), motif: "payes", statut: "attente" },
      { id: "d2", personne: "yanis", debut: j(4), fin: j(4, 4), motif: "rtt", statut: "attente" },
      { id: "d3", personne: "lea", debut: j(6, 2), fin: j(6, 2), motif: "familial", statut: "attente" },
      // Déjà partie cette semaine : le tableau de bord a quelqu'un à montrer
      { id: "d4", personne: "lea", debut: j(0), fin: j(0, 4), motif: "payes", statut: "validee" },
      { id: "d5", personne: MOI, debut: j(-3), fin: j(-3, 4), motif: "payes", statut: "validee" },
      { id: "d6", personne: "camille", debut: j(-1, 3), fin: j(-1, 3), motif: "rtt", statut: "validee" },
      { id: "d7", personne: "yanis", debut: j(-2), fin: j(-2, 2), motif: "sansSolde", statut: "refusee" },
    ],
    entretiens: [
      { id: "e1", personne: "camille", type: "annuel", statut: "aPlanifier" },
      { id: "e2", personne: "yanis", type: "professionnel", statut: "planifie", date: j(1, 3) },
      { id: "e3", personne: "lea", type: "annuel", statut: "fait", date: j(-4, 1) },
      { id: "e4", personne: MOI, type: "arrivee", statut: "aPlanifier" },
    ],
    suivant: 1,
  };
}

/* ——— Transitions ——— */

export type Action =
  | { type: "role"; role: Role }
  | { type: "valider"; id: string }
  | { type: "refuser"; id: string }
  | { type: "demander"; debut: string; fin: string; motif: MotifConge }
  | { type: "planifier"; id: string; date: string }
  | { type: "cloturer"; id: string }
  | { type: "reinitialiser"; aujourdHui: Date };

export function reduire(etat: Etat, action: Action): Etat {
  switch (action.type) {
    case "role":
      return { ...etat, role: action.role };

    // Valider ou refuser ne touche QUE les demandes encore en attente :
    // un double clic ne peut pas ressusciter une décision déjà prise.
    case "valider":
    case "refuser": {
      const cible: StatutDemande = action.type === "valider" ? "validee" : "refusee";
      return {
        ...etat,
        demandes: etat.demandes.map((d) =>
          d.id === action.id && d.statut === "attente" ? { ...d, statut: cible } : d,
        ),
      };
    }

    case "demander":
      return {
        ...etat,
        suivant: etat.suivant + 1,
        demandes: [
          {
            id: `n${etat.suivant}`,
            personne: MOI,
            debut: action.debut,
            fin: action.fin,
            motif: action.motif,
            statut: "attente",
          },
          ...etat.demandes,
        ],
      };

    case "planifier":
      return {
        ...etat,
        entretiens: etat.entretiens.map((e) =>
          e.id === action.id ? { ...e, statut: "planifie", date: action.date } : e,
        ),
      };

    case "cloturer":
      return {
        ...etat,
        entretiens: etat.entretiens.map((e) =>
          e.id === action.id && e.statut === "planifie" ? { ...e, statut: "fait" } : e,
        ),
      };

    case "reinitialiser":
      return etatInitial(action.aujourdHui);
  }
}

/* ——— Lectures utiles au tableau de bord ——— */

export const enAttente = (etat: Etat) => etat.demandes.filter((d) => d.statut === "attente");

export const aPlanifier = (etat: Etat) =>
  etat.entretiens.filter((e) => e.statut === "aPlanifier");

/** Qui est absent aujourd'hui, d'après les seules demandes validées */
export function absentsAujourdHui(etat: Etat, aujourdHui: string): Demande[] {
  return etat.demandes.filter(
    (d) => d.statut === "validee" && d.debut <= aujourdHui && aujourdHui <= d.fin,
  );
}

/** Ce qui attend une décision, tous objets confondus */
export const attendUneDecision = (etat: Etat) =>
  enAttente(etat).length + aPlanifier(etat).length;
