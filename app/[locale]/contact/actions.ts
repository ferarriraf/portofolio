"use server";

/**
 * Réception d'un message du formulaire de contact.
 *
 * Tout se passe sur le serveur : le navigateur n'apprend rien de
 * l'adresse d'arrivée ni des réglages d'envoi. En cas d'échec on le dit
 * — un formulaire qui affiche « merci » sans avoir rien envoyé est la
 * pire des politesses.
 */

import { headers } from "next/headers";
import { envoyerCourriel } from "@/lib/smtp";
import {
  CHAMP_DEPART,
  CHAMP_PIEGE,
  lireReglages,
  ressembleAUnRobot,
  tropDeMessages,
  valider,
  type EtatFormulaire,
  type Valeurs,
} from "@/lib/contact";

function lire(donnees: FormData, nom: string): string {
  const brut = donnees.get(nom);
  return typeof brut === "string" ? brut.trim() : "";
}

/** De quoi distinguer deux visiteurs pour la limite de fréquence,
 *  sans rien conserver : l'IP n'est ni stockée ni journalisée. */
async function empreinteVisiteur(): Promise<string> {
  const entetes = await headers();
  const transmise = entetes.get("x-forwarded-for");
  return transmise?.split(",")[0]?.trim() || entetes.get("x-real-ip") || "inconnu";
}

export async function envoyerMessage(
  _precedent: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const valeurs: Valeurs = {
    nom: lire(donnees, "nom"),
    email: lire(donnees, "email"),
    message: lire(donnees, "message"),
  };

  // Un robot repart avec un « merci » : inutile de lui apprendre
  // ce qui l'a trahi.
  if (ressembleAUnRobot(lire(donnees, CHAMP_PIEGE), lire(donnees, CHAMP_DEPART))) {
    return { statut: "succes" };
  }

  const erreurs = valider(valeurs);
  if (Object.keys(erreurs).length > 0) {
    return { statut: "erreur", erreurs, valeurs };
  }

  if (tropDeMessages(await empreinteVisiteur())) {
    return { statut: "erreur", erreurs: { global: "trop" }, valeurs };
  }

  const reglages = lireReglages();
  if (!reglages) {
    console.error(
      "Formulaire de contact : réglages SMTP absents (SMTP_HOTE, SMTP_UTILISATEUR, SMTP_MOTDEPASSE).",
    );
    return { statut: "erreur", erreurs: { global: "indisponible" }, valeurs };
  }

  const corps = [
    `Nom     : ${valeurs.nom}`,
    `Email   : ${valeurs.email}`,
    "",
    valeurs.message,
    "",
    "—",
    "Envoyé depuis le formulaire de www.r-x.fr",
  ].join("\n");

  // La durée est mesurée, jamais estimée : c'est elle que le visiteur
  // lira sur son reçu. Un serveur lent affichera un chiffre peu
  // flatteur — ne pas le maquiller, ne pas le plafonner.
  const depart = Date.now();

  try {
    await envoyerCourriel(
      {
        de: reglages.smtp.utilisateur,
        a: reglages.destinataire,
        // « Répondre » dans le client mail tombe droit sur le visiteur
        repondreA: `${valeurs.nom} <${valeurs.email}>`,
        sujet: `Site r-x.fr — message de ${valeurs.nom}`,
        texte: corps,
      },
      reglages.smtp,
    );
  } catch (erreur) {
    console.error("Formulaire de contact : envoi impossible.", erreur);
    return { statut: "erreur", erreurs: { global: "envoi" }, valeurs };
  }

  return { statut: "succes", ms: Math.round((Date.now() - depart) / 10) * 10 };
}
