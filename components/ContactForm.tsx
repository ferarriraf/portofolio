"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Send } from "lucide-react";
import { envoyerMessage } from "@/app/[locale]/contact/actions";
import {
  CHAMP_DEPART,
  CHAMP_PIEGE,
  ETAT_INITIAL,
  LIMITES,
  type Champ,
} from "@/lib/contact";

const CHAMPS: Champ[] = ["nom", "email", "message"];

/**
 * Le formulaire de contact.
 *
 * Il fonctionne sans JavaScript : `action` reçoit directement la
 * fonction serveur, et Next se charge d'envoyer le formulaire à
 * l'ancienne si le script n'a pas chargé. Les deux garde-fous
 * anti-robots (champ-piège, délai minimal) ne demandent rien au
 * visiteur — pas de captcha sur un site qui vend la lisibilité.
 */
export default function ContactForm() {
  const t = useTranslations("contact.form");
  const reduire = useReducedMotion();
  const [etat, action, enCours] = useActionState(envoyerMessage, ETAT_INITIAL);

  // Une référence par champ, et non un objet qui les regroupe : la
  // règle react-hooks/refs voit toute lecture de propriété pendant le
  // rendu comme un accès à la ref, et refuse le raccourci.
  const depart = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLParagraphElement>(null);
  const refNom = useRef<HTMLInputElement>(null);
  const refEmail = useRef<HTMLInputElement>(null);
  const refMessage = useRef<HTMLTextAreaElement>(null);

  // Horodatage d'affichage : posé après le rendu, jamais dans le HTML
  // servi (il varierait d'un visiteur à l'autre et casserait le cache).
  useEffect(() => {
    const t = setTimeout(() => {
      if (depart.current) depart.current.value = String(Date.now());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Après une réponse du serveur, on emmène le curseur là où il faut :
  // sur le premier champ fautif, ou sur la confirmation.
  useEffect(() => {
    if (etat.statut === "succes") {
      confirmation.current?.focus();
      return;
    }
    if (etat.statut !== "erreur") return;
    const premier = CHAMPS.find((c) => etat.erreurs?.[c]);
    if (premier === "nom") refNom.current?.focus();
    else if (premier === "email") refEmail.current?.focus();
    else if (premier === "message") refMessage.current?.focus();
  }, [etat]);

  if (etat.statut === "succes") {
    return (
      <motion.div
        initial={reduire ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-sage bg-sage-wash px-8 py-14 text-center inset-shadow-cisele md:py-16"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-sage-deep">
          <Check className="size-6 text-sand-card" aria-hidden="true" />
        </span>
        <p
          ref={confirmation}
          tabIndex={-1}
          className="mt-6 font-display text-2xl font-bold tracking-tight text-ink outline-none md:text-3xl"
        >
          {t("merciTitre")}
        </p>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
          {t("merciTexte")}
        </p>
      </motion.div>
    );
  }

  const erreurGlobale = etat.erreurs?.global;

  const etiquetteErreur = (champ: Champ) => {
    const cle = etat.erreurs?.[champ];
    if (!cle) return null;
    return (
      <p
        id={`erreur-${champ}`}
        className="mt-2 text-sm font-semibold text-terra-deep"
      >
        {t(`erreurs.${cle}`)}
      </p>
    );
  };

  const classeChamp = (champ: Champ) =>
    [
      "w-full rounded-xl border bg-sand px-4 py-3 text-ink transition-colors",
      "placeholder:text-ink-soft/55",
      etat.erreurs?.[champ]
        ? "border-terra-strong"
        : "border-line hover:border-sage focus:border-sage-strong",
    ].join(" ");

  return (
    <form
      action={action}
      noValidate
      className="rounded-3xl border border-line bg-sand-card px-6 py-8 shadow-elev-1 inset-shadow-cisele md:px-10 md:py-10"
    >
      {/* Champ-piège : hors de l'écran, hors du parcours clavier, hors
          de l'arbre d'accessibilité. Un humain ne le voit jamais ;
          un robot le remplit et se dénonce. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={CHAMP_PIEGE}>{t("piege")}</label>
        <input
          id={CHAMP_PIEGE}
          name={CHAMP_PIEGE}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input ref={depart} type="hidden" name={CHAMP_DEPART} defaultValue="" />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="nom" className="block text-sm font-semibold text-ink">
            {t("nom")}
          </label>
          <input
            ref={refNom}
            id="nom"
            name="nom"
            type="text"
            required
            maxLength={LIMITES.nom}
            autoComplete="name"
            defaultValue={etat.valeurs?.nom ?? ""}
            aria-invalid={etat.erreurs?.nom ? true : undefined}
            aria-describedby={etat.erreurs?.nom ? "erreur-nom" : undefined}
            className={`mt-2 ${classeChamp("nom")}`}
          />
          {etiquetteErreur("nom")}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-ink">
            {t("email")}
          </label>
          <input
            ref={refEmail}
            id="email"
            name="email"
            type="email"
            required
            maxLength={LIMITES.email}
            autoComplete="email"
            defaultValue={etat.valeurs?.email ?? ""}
            aria-invalid={etat.erreurs?.email ? true : undefined}
            aria-describedby={etat.erreurs?.email ? "erreur-email" : undefined}
            className={`mt-2 ${classeChamp("email")}`}
          />
          {etiquetteErreur("email")}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="block text-sm font-semibold text-ink">
          {t("message")}
        </label>
        <textarea
          ref={refMessage}
          id="message"
          name="message"
          required
          rows={7}
          maxLength={LIMITES.messageMax}
          placeholder={t("messageIndice")}
          defaultValue={etat.valeurs?.message ?? ""}
          aria-invalid={etat.erreurs?.message ? true : undefined}
          aria-describedby={etat.erreurs?.message ? "erreur-message" : undefined}
          className={`mt-2 resize-y ${classeChamp("message")}`}
        />
        {etiquetteErreur("message")}
      </div>

      {/* Les erreurs générales (trop de messages, panne d'envoi) sont
          annoncées aux lecteurs d'écran sans voler le focus. */}
      <div aria-live="polite" className="mt-6 empty:mt-0">
        {erreurGlobale && (
          <p className="rounded-xl border border-terra-strong bg-terra-wash px-4 py-3 text-sm font-semibold text-terra-deep">
            {t(`erreurs.${erreurGlobale}`)}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={enCours} className="btn btn-primary btn-lg disabled:opacity-70">
          <Send className="size-4" aria-hidden="true" />
          {enCours ? t("envoiEnCours") : t("envoyer")}
        </button>
        <p className="text-sm italic text-ink-soft">{t("promesse")}</p>
      </div>
    </form>
  );
}
