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

/* ——— Le fil ———
   La ligne d'état qui commente la démonstration, en bas du moniteur.

   Elle est DÉDUITE de l'état réel, jamais d'un compteur d'étapes. C'est
   ce qui la distingue d'une visite guidée : quelqu'un qui fait tout dans
   le désordre est rattrapé sans jamais reculer d'un cran, « Remettre à
   zéro » rejoue le fil gratuitement, et le fil ne peut pas prétendre
   qu'il reste trois demandes quand il n'en reste qu'une.

   Aucun texte visible ici : ces fonctions ne rendent que des CLÉS, que
   le composant traduit. Rien de React, rien de next-intl — le fichier
   doit rester exécutable par node nu pour ses tests. */

export type EvenementFil =
  | { type: "action"; action: Action }
  | { type: "onglet"; onglet: string }
  | { type: "veille" }
  | { type: "reprise" };

export type EtatFil = {
  ouvert: boolean;
  /** Le geste qui vient d'avoir lieu, effacé dès qu'on change d'onglet */
  derniere: Action["type"] | null;
  /** La date posée par le dernier « planifier », pour pouvoir la citer */
  dateDerniere?: string;
  /** Nature du dernier événement : seules les actions sont annoncées
   *  aux lecteurs d'écran, sinon changer d'onglet les rendrait bavards */
  dernierEvenement: EvenementFil["type"] | null;
  /** Nombre de gestes accomplis : sert à distinguer « rien à faire dès
   *  le départ » de « vous avez tout traité » */
  compteur: number;
  /** Ce que le visiteur a déjà fait ou vu : on ne le lui resuggère pas */
  faits: string[];
};

export const FIL_DEPART: EtatFil = {
  ouvert: true,
  derniere: null,
  dernierEvenement: null,
  compteur: 0,
  faits: [],
};

export function suivreFil(fil: EtatFil, ev: EvenementFil): EtatFil {
  switch (ev.type) {
    case "veille":
      return { ...fil, ouvert: false, dernierEvenement: "veille" };

    case "reprise":
      // On garde `faits` : le fil reprend là où l'application en est,
      // il ne redonne pas des conseils périmés.
      return { ...fil, ouvert: true, dernierEvenement: "reprise" };

    case "onglet": {
      const marque = `onglet:${ev.onglet}`;
      return {
        ...fil,
        dernierEvenement: "onglet",
        // On efface le geste précédent : la ligne doit parler de
        // l'onglet qu'on vient d'ouvrir, pas du clic d'avant.
        derniere: null,
        faits: fil.faits.includes(marque) ? fil.faits : [...fil.faits, marque],
      };
    }

    case "action":
      return {
        ...fil,
        dernierEvenement: "action",
        derniere: ev.action.type,
        dateDerniere:
          ev.action.type === "planifier" ? ev.action.date : fil.dateDerniere,
        compteur: fil.compteur + 1,
        faits: fil.faits.includes(ev.action.type)
          ? fil.faits
          : [...fil.faits, ev.action.type],
      };
  }
}

/** Ce que la ligne doit dire : une clé de traduction, et au plus un
 *  paramètre. `null` = le fil est en veille. */
export function ligneDuFil(
  etat: Etat,
  fil: EtatFil,
  onglet: string,
): { cle: string; n?: number; date?: string } | null {
  if (!fil.ouvert) return null;

  const attente = enAttente(etat).length;
  const aCaler = aPlanifier(etat).length;
  const estManager = etat.role === "manager";

  // 1. Tout est traité. C'est le message le plus fort de la démo, il
  //    passe avant tout le reste.
  if (fil.compteur > 0 && attente + aCaler === 0) return { cle: "fin" };

  // 2. La réaction au geste qui vient d'avoir lieu. Les comptes sont
  //    relus dans l'état COURANT, jamais mémorisés : c'est ce qui rend
  //    la ligne incapable de mentir.
  switch (fil.derniere) {
    case "valider":
      // Plus rien à valider mais des entretiens en attente : on montre
      // la porte suivante plutôt que de féliciter dans le vide.
      if (attente === 0 && aCaler > 0) return { cle: "essayezEntretiens" };
      return { cle: "valider", n: attente };
    case "refuser":
      return { cle: "refuser" };
    case "demander":
      return { cle: "demander" };
    case "planifier":
      return { cle: "planifier", date: fil.dateDerniere };
    case "cloturer":
      return { cle: "cloturer" };
    case "role":
      return { cle: estManager ? "roleManager" : "roleSalarie" };
    case "reinitialiser":
      return { cle: "reinitialise" };
  }

  // 3. Sinon, une suggestion — choisie d'après l'onglet ouvert et ce
  //    qui n'a pas encore été fait.
  if (onglet === "conges") {
    if (!estManager) return { cle: "congesSalarie" };
    const aDecide =
      fil.faits.includes("valider") || fil.faits.includes("refuser");
    return aDecide && !fil.faits.includes("role")
      ? { cle: "essayezSalarie" }
      : { cle: "congesManager" };
  }

  if (onglet === "entretiens") return { cle: "entretiens", n: aCaler };

  // Tableau de bord : la ligne d'ouverture, ou l'orientation vers ce
  // qui n'a pas encore été exploré.
  if (fil.faits.includes("onglet:conges") && !fil.faits.includes("onglet:entretiens")) {
    return { cle: "essayezEntretiens" };
  }
  return { cle: "ouverture", n: attente + aCaler };
}
