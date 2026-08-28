/**
 * Client SMTP minimal, sans aucune dépendance.
 *
 * Envoyer un email revient à tenir une conversation en texte clair
 * avec le serveur de messagerie : on annonce qui parle, on s'identifie,
 * on donne l'expéditeur, le destinataire, puis le message, et on
 * raccroche. Chaque réponse du serveur commence par un code à trois
 * chiffres — 2xx et 3xx veulent dire « continue », le reste est une
 * erreur.
 *
 * Tout est volontairement contenu dans ce seul fichier : le jour où
 * l'on préfère passer par une bibliothèque (nodemailer ou autre), il
 * suffit de réécrire `envoyerCourriel` sans toucher au reste du site.
 */

import { connect, type TLSSocket } from "node:tls";
import { randomUUID } from "node:crypto";

const DELAI_MS = 15_000;
const FIN_DE_LIGNE = "\r\n";

export type Courriel = {
  /** Boîte authentifiée : la plupart des serveurs refusent d'expédier au nom d'une autre */
  de: string;
  a: string;
  /** Adresse du visiteur : « Répondre » dans le client mail tombe directement sur lui */
  repondreA?: string;
  sujet: string;
  texte: string;
};

export type ReglagesSmtp = {
  hote: string;
  port: number;
  utilisateur: string;
  motDePasse: string;
};

/** Une réponse SMTP peut tenir sur plusieurs lignes : « 250-PIPELINING »
 *  puis « 250 HELP ». Seule la dernière n'a pas de tiret après le code. */
type Reponse = { code: number; texte: string };

class Dialogue {
  private tampon = "";
  private enAttente: {
    resoudre: (r: Reponse) => void;
    rejeter: (e: Error) => void;
  } | null = null;
  private rompu: Error | null = null;
  // Champ déclaré explicitement plutôt qu'en « propriété de paramètre » :
  // cette facilité de TypeScript n'existe pas en JavaScript, et Node
  // refuse de la traduire quand il lit le fichier tel quel.
  private socket: TLSSocket;

  constructor(socket: TLSSocket) {
    this.socket = socket;
    socket.setEncoding("utf8");
    socket.on("data", (morceau: string) => this.avaler(morceau));
    socket.on("error", (e) => this.casser(e));
    socket.on("close", () => this.casser(new Error("connexion SMTP fermée")));
  }

  private avaler(morceau: string) {
    this.tampon += morceau;
    if (!this.tampon.endsWith(FIN_DE_LIGNE)) return;

    // Une réponse est complète quand sa DERNIÈRE ligne porte un espace
    // juste après le code : « 250 OK ». Un tiret — « 250-PIPELINING » —
    // annonce que la suite n'est pas encore arrivée.
    const lignes = this.tampon.trimEnd().split(FIN_DE_LIGNE);
    const derniere = lignes[lignes.length - 1] ?? "";
    if (!/^\d{3} /.test(derniere)) return;

    const texte = this.tampon;
    this.tampon = "";
    const code = Number.parseInt(derniere.slice(0, 3), 10);

    const attente = this.enAttente;
    this.enAttente = null;
    attente?.resoudre({ code, texte });
  }

  private casser(erreur: Error) {
    this.rompu = erreur;
    const attente = this.enAttente;
    this.enAttente = null;
    attente?.rejeter(erreur);
  }

  /** Attend la prochaine réponse du serveur et vérifie son code */
  lire(codesAttendus: number[]): Promise<Reponse> {
    if (this.rompu) return Promise.reject(this.rompu);
    return new Promise<Reponse>((resoudre, rejeter) => {
      this.enAttente = { resoudre, rejeter };
    }).then((reponse) => {
      if (!codesAttendus.includes(reponse.code)) {
        throw new Error(
          `SMTP : réponse ${reponse.code} inattendue (${reponse.texte.trim()})`,
        );
      }
      return reponse;
    });
  }

  ecrire(ligne: string) {
    if (this.rompu) throw this.rompu;
    this.socket.write(ligne + FIN_DE_LIGNE);
  }

  /** Envoie une commande et attend la réponse d'un coup */
  async echanger(ligne: string, codesAttendus: number[]) {
    this.ecrire(ligne);
    return this.lire(codesAttendus);
  }
}

/** Rien de ce qui vient du visiteur ne doit pouvoir créer une en-tête :
 *  un retour à la ligne glissé dans un nom ajouterait un destinataire. */
function assainirEnTete(valeur: string) {
  return valeur.replace(/[\r\n]+/g, " ").trim();
}

/** Les en-têtes ne transportent que de l'ASCII : les accents passent
 *  encodés en base64, dans la forme prévue par la RFC 2047. */
function encoderEnTete(valeur: string) {
  const propre = assainirEnTete(valeur);
  if (!/[^\x20-\x7e]/.test(propre)) return propre;
  return `=?UTF-8?B?${Buffer.from(propre, "utf8").toString("base64")}?=`;
}

function encoderCorps(texte: string) {
  const base64 = Buffer.from(texte, "utf8").toString("base64");
  return (base64.match(/.{1,76}/g) ?? []).join(FIN_DE_LIGNE);
}

/**
 * Une adresse de la forme « Élodie Müller <elodie@exemple.fr> » : le
 * nom affiché passe encodé, l'adresse reste lisible telle quelle —
 * elle doit rester interprétable par les serveurs qui la relaient.
 */
function encoderAdresse(valeur: string) {
  const propre = assainirEnTete(valeur);
  const decoupe = propre.match(/^(.*)<([^<>]+)>\s*$/);
  if (!decoupe) return propre;

  const nom = decoupe[1].trim().replace(/^"|"$/g, "");
  const adresse = decoupe[2].trim();
  return nom ? `${encoderEnTete(nom)} <${adresse}>` : `<${adresse}>`;
}

function composer(courriel: Courriel) {
  const enTetes = [
    `From: ${encoderAdresse(courriel.de)}`,
    `To: ${encoderAdresse(courriel.a)}`,
    ...(courriel.repondreA
      ? [`Reply-To: ${encoderAdresse(courriel.repondreA)}`]
      : []),
    `Subject: ${encoderEnTete(courriel.sujet)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${randomUUID()}@${assainirEnTete(courriel.de).split("@")[1] ?? "localhost"}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
  ];
  return enTetes.join(FIN_DE_LIGNE) + FIN_DE_LIGNE + FIN_DE_LIGNE + encoderCorps(courriel.texte);
}

function ouvrir(reglages: ReglagesSmtp): Promise<TLSSocket> {
  return new Promise((resoudre, rejeter) => {
    const socket = connect(
      { host: reglages.hote, port: reglages.port, servername: reglages.hote },
      () => resoudre(socket),
    );
    socket.setTimeout(DELAI_MS, () =>
      socket.destroy(new Error("SMTP : délai dépassé")),
    );
    socket.once("error", rejeter);
  });
}

/**
 * Envoie un message. Lève une erreur si le serveur refuse à
 * n'importe quelle étape — l'appelant décide quoi en dire au visiteur.
 */
export async function envoyerCourriel(
  courriel: Courriel,
  reglages: ReglagesSmtp,
): Promise<void> {
  const socket = await ouvrir(reglages);
  const dialogue = new Dialogue(socket);

  try {
    await dialogue.lire([220]); // bannière d'accueil
    await dialogue.echanger(`EHLO ${reglages.hote}`, [250]);

    // AUTH LOGIN : le serveur réclame l'identifiant puis le mot de
    // passe, chacun encodé en base64, chacun sur sa propre ligne.
    await dialogue.echanger("AUTH LOGIN", [334]);
    await dialogue.echanger(
      Buffer.from(reglages.utilisateur, "utf8").toString("base64"),
      [334],
    );
    await dialogue.echanger(
      Buffer.from(reglages.motDePasse, "utf8").toString("base64"),
      [235],
    );

    await dialogue.echanger(`MAIL FROM:<${assainirEnTete(courriel.de)}>`, [250]);
    await dialogue.echanger(`RCPT TO:<${assainirEnTete(courriel.a)}>`, [250, 251]);
    await dialogue.echanger("DATA", [354]);

    // Un point seul en début de ligne signalerait la fin du message :
    // on le double, c'est la convention (« dot stuffing »).
    const corps = composer(courriel)
      .split(FIN_DE_LIGNE)
      .map((ligne) => (ligne.startsWith(".") ? "." + ligne : ligne))
      .join(FIN_DE_LIGNE);

    dialogue.ecrire(corps);
    await dialogue.echanger(".", [250]);
    await dialogue.echanger("QUIT", [221]).catch(() => {
      // Certains serveurs coupent avant de répondre au QUIT : sans
      // importance, le message est déjà accepté.
    });
  } finally {
    socket.destroy();
  }
}
