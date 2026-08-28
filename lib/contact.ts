/**
 * Règles du formulaire de contact : validation, garde-fous anti-robots
 * et lecture des réglages d'envoi.
 *
 * Aucun texte visible ici — la validation renvoie des *clés*, que le
 * composant traduit. Les messages d'erreur vivent, comme le reste du
 * site, dans `messages/fr.json` et `messages/en.json`.
 */

import type { ReglagesSmtp } from "./smtp";

export type CleErreur =
  | "nomVide"
  | "nomLong"
  | "emailVide"
  | "emailInvalide"
  | "messageCourt"
  | "messageLong"
  | "trop"
  | "envoi"
  | "indisponible";

export type Champ = "nom" | "email" | "message";

export type Valeurs = Record<Champ, string>;

export type EtatFormulaire = {
  statut: "repos" | "succes" | "erreur";
  /** Erreurs par champ, plus une éventuelle erreur générale */
  erreurs?: Partial<Record<Champ | "global", CleErreur>>;
  /** Ce que le visiteur avait saisi : on ne lui fait pas tout retaper */
  valeurs?: Valeurs;
};

export const ETAT_INITIAL: EtatFormulaire = { statut: "repos" };

export const LIMITES = {
  nom: 80,
  email: 160,
  messageMin: 20,
  messageMax: 4000,
} as const;

/** Nom du champ-piège : invisible pour un humain, irrésistible pour un robot */
export const CHAMP_PIEGE = "site-web";
/** Horodatage posé à l'affichage : un robot remplit et envoie en moins d'une seconde */
export const CHAMP_DEPART = "depart";
const DELAI_HUMAIN_MS = 3_000;

/**
 * Volontairement permissif : le seul juge fiable de la validité d'une
 * adresse, c'est le serveur qui la reçoit. On écarte les fautes de
 * frappe évidentes, pas les adresses exotiques mais légitimes.
 */
const FORME_EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function valider(valeurs: Valeurs): Partial<Record<Champ, CleErreur>> {
  const erreurs: Partial<Record<Champ, CleErreur>> = {};

  if (valeurs.nom.length === 0) erreurs.nom = "nomVide";
  else if (valeurs.nom.length > LIMITES.nom) erreurs.nom = "nomLong";

  if (valeurs.email.length === 0) erreurs.email = "emailVide";
  else if (valeurs.email.length > LIMITES.email || !FORME_EMAIL.test(valeurs.email))
    erreurs.email = "emailInvalide";

  if (valeurs.message.length < LIMITES.messageMin) erreurs.message = "messageCourt";
  else if (valeurs.message.length > LIMITES.messageMax) erreurs.message = "messageLong";

  return erreurs;
}

/**
 * Deux pièges qui ne demandent rien au visiteur : un champ caché qui
 * doit rester vide, et un délai minimal entre l'affichage et l'envoi.
 * Pas de captcha — on ne fait pas déchiffrer des images pour écrire
 * trois lignes.
 */
export function ressembleAUnRobot(piege: string, depart: string): boolean {
  if (piege.trim().length > 0) return true;

  // Absent = visiteur sans JavaScript : on ne le punit pas.
  if (depart.length === 0) return false;
  const debut = Number.parseInt(depart, 10);
  if (!Number.isFinite(debut)) return false;
  return Date.now() - debut < DELAI_HUMAIN_MS;
}

/* ——— Limite de fréquence, en mémoire ———
   Le site tourne en un seul processus Node : un simple registre suffit,
   et il s'oublie tout seul au redémarrage. Aucun stockage, aucun cookie. */

const REGISTRE = new Map<string, number[]>();
const FENETRE_MS = 10 * 60 * 1000;
const MAX_PAR_FENETRE = 3;

export function tropDeMessages(empreinte: string): boolean {
  const maintenant = Date.now();
  const recents = (REGISTRE.get(empreinte) ?? []).filter(
    (t) => maintenant - t < FENETRE_MS,
  );

  if (recents.length >= MAX_PAR_FENETRE) {
    REGISTRE.set(empreinte, recents);
    return true;
  }

  recents.push(maintenant);
  REGISTRE.set(empreinte, recents);

  // Ménage : sans ça le registre grossirait indéfiniment
  if (REGISTRE.size > 5_000) {
    for (const [cle, dates] of REGISTRE) {
      if (dates.every((t) => maintenant - t >= FENETRE_MS)) REGISTRE.delete(cle);
    }
  }

  return false;
}

/**
 * Réglages d'envoi, lus dans l'environnement. Rien n'est écrit en dur :
 * le mot de passe de la boîte mail ne doit exister que sur le serveur.
 * Renvoie `null` si la configuration est incomplète — le formulaire le
 * dit alors honnêtement au lieu de faire semblant d'avoir envoyé.
 */
export function lireReglages(): { smtp: ReglagesSmtp; destinataire: string } | null {
  const hote = process.env.SMTP_HOTE;
  const utilisateur = process.env.SMTP_UTILISATEUR;
  const motDePasse = process.env.SMTP_MOTDEPASSE;
  const destinataire = process.env.CONTACT_DESTINATAIRE ?? utilisateur;

  if (!hote || !utilisateur || !motDePasse || !destinataire) return null;

  return {
    smtp: {
      hote,
      port: Number.parseInt(process.env.SMTP_PORT ?? "465", 10),
      utilisateur,
      motDePasse,
    },
    destinataire,
  };
}
