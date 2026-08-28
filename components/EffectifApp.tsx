"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, CalendarPlus, RotateCcw, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DROIT_ANNUEL,
  FIL_DEPART,
  MOI,
  aPlanifier,
  absentsAujourdHui,
  enAttente,
  enIso,
  etatInitial,
  joursOuvres,
  ligneDuFil,
  personne,
  reduire,
  solde,
  suivreFil,
  type Demande,
  type Entretien,
  type MotifConge,
  type Role,
  type Action,
  PERSONNES,
} from "@/lib/effectif";

type Onglet = "tableau" | "conges" | "entretiens";

const MOTIFS: MotifConge[] = ["payes", "rtt", "sansSolde", "familial"];

/** Cible de repli du focus quand la file se vide */
const TITRE_FILE = "effectif-file-attente";

/* ——— Habillage commun, pour que l'application reste dans la matière
   du site : surfaces claires posées, creux plus sombres, une seule
   lumière venant du haut. ——— */

const CARTE = "rounded-xl bg-sand-card p-4 inset-shadow-cisele";
const CREUX = "rounded-xl bg-sand-deep p-4";
const BOUTON =
  "press inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 motion-reduce:transition-none";
const BOUTON_PLEIN = `${BOUTON} bg-sage-deep text-sand-card hover:bg-ink`;
const BOUTON_CONTOUR = `${BOUTON} border border-line bg-sand-card text-ink-soft hover:border-sage hover:text-ink`;
const CHAMP =
  "w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm text-ink transition-colors duration-200 hover:border-sage focus:border-sage-strong motion-reduce:transition-none";

const TONS: Record<string, string> = {
  attente: "bg-terra-wash text-terra-deep",
  aPlanifier: "bg-terra-wash text-terra-deep",
  validee: "bg-sage-wash text-sage-deep",
  planifie: "bg-sage-wash text-sage-deep",
  refusee: "bg-sand-deep text-ink-soft",
  fait: "bg-sand-deep text-ink-soft",
};

/**
 * « effectif » — la démonstration jouable de l'application métier.
 *
 * Tout vit dans le navigateur du visiteur : aucun appel réseau, aucune
 * base, rien de conservé. L'état de départ est reconstruit à chaque
 * chargement à partir de la date du jour, pour que la démo ne
 * vieillisse jamais.
 */
export default function EffectifApp() {
  const t = useTranslations("demo");
  const locale = useLocale();

  // Une seule lecture de l'horloge, gardée pour toute la session :
  // deux appels à new Date() pourraient tomber de part et d'autre de
  // minuit et faire diverger les calculs.
  const [ancre] = useState(() => new Date());
  const [etat, envoyer] = useReducer(reduire, ancre, etatInitial);
  const [onglet, setOnglet] = useState<Onglet>("tableau");

  /* Le fil : la ligne d'état qui commente ce qui vient de se passer.
     Aucun useEffect — la ligne est DÉRIVÉE au rendu à partir de l'état
     réel, ce qui la rend incapable d'annoncer un compte périmé, et
     évite le double appel des effets en développement. */
  const [fil, majFil] = useReducer(suivreFil, FIL_DEPART);

  const agir = (action: Action) => {
    envoyer(action);
    majFil({ type: "action", action });
  };
  const ouvrirOnglet = (o: Onglet) => {
    setOnglet(o);
    majFil({ type: "onglet", onglet: o });
  };

  // L'application n'apparaît qu'après le montage : ses dates dépendent
  // de l'horloge du visiteur, et un rendu serveur les afficherait
  // différemment. Même différé que BootScreen pour ne pas déclencher
  // un rendu en cascade.
  const [monte, setMonte] = useState(false);
  useEffect(() => {
    const minuteur = setTimeout(() => setMonte(true), 0);
    return () => clearTimeout(minuteur);
  }, []);

  const dateCourte = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }),
    [locale],
  );

  const formaterJour = (iso: string) => dateCourte.format(new Date(iso + "T12:00:00"));

  const formaterPeriode = (d: Demande) =>
    d.debut === d.fin
      ? formaterJour(d.debut)
      : `${formaterJour(d.debut)} → ${formaterJour(d.fin)}`;

  const aujourdHui = enIso(ancre);
  const absents = absentsAujourdHui(etat, aujourdHui);
  const estManager = etat.role === "manager";

  // « Ce qui attend une décision » n'a de sens que pour qui décide.
  // Un salarié ne tranche rien — sa propre demande attend son manager,
  // pas lui. Sans ce filtre il lisait « 3 demandes de congés — Traiter »
  // et arrivait sur un écran où aucune action n'existe.
  // Effet de bord voulu : côté salarié le tableau est vide et le dit,
  // puis la bascule en manager l'allume d'un coup. C'est la
  // démonstration la plus courte de ce que fait un rôle.
  const attente = estManager ? enAttente(etat) : [];
  const aCaler = estManager ? aPlanifier(etat) : [];

  if (!monte) {
    return (
      <Fenetre titre={t("fenetre")}>
        <div className="flex min-h-[26rem] items-center justify-center">
          <p className="font-mono text-xs text-ink-soft">{t("chargement")}</p>
          <noscript>
            <p className="max-w-sm px-6 text-center text-sm text-ink-soft">
              {t("sansJs")}
            </p>
          </noscript>
        </div>
      </Fenetre>
    );
  }

  /* ——— Le fil ———
     La ligne est déduite de l'état à CHAQUE rendu : elle ne peut donc
     pas annoncer un compte périmé. Les libellés de boutons qu'elle cite
     sont injectés depuis leurs propres clés — un guide qui nomme un
     bouton disparu est pire que pas de guide. */
  const ligne = ligneDuFil(etat, fil, onglet);

  const texteFil = ligne
    ? t(`fil.${ligne.cle}`, {
        n: ligne.n ?? 0,
        date: ligne.date ? formaterJour(ligne.date) : "",
        conges: t("onglets.conges"),
        entretiens: t("onglets.entretiens"),
        valider: t("conges.valider"),
        refuser: t("conges.refuser"),
        envoyer: t("conges.envoyer"),
        planifier: t("entretiens.planifier"),
        salarie: t("roles.salarie"),
        manager: t("roles.manager"),
      })
    : t("fil.neutre");

  const pied = (
    <div className="recu recu-sombre flex items-start gap-2.5 px-2 pt-2.5 pb-1">
      <span aria-hidden="true" className="recu-carre mt-[0.5em]" />

      {/* La ligne visible est masquée aux lecteurs d'écran : son jumeau
          plus bas ne parle QUE sur une action réelle, sinon changer
          d'onglet au clavier rendrait la démonstration bavarde. */}
      <p
        aria-hidden="true"
        className="min-w-0 flex-1 text-[0.72rem] leading-snug text-sand/85"
      >
        <span key={`${ligne?.cle ?? "veille"}-${fil.compteur}`} className="fil-vif">
          {texteFil}
        </span>
        {ligne?.cle === "fin" && (
          <>
            {" "}
            <Link
              href="/contact"
              className="font-semibold text-sand underline underline-offset-2 hover:text-terra"
            >
              {t("fil.finLien")}
            </Link>
          </>
        )}
      </p>

      <p className="sr-only" role="status" aria-atomic="true">
        {fil.dernierEvenement === "action" ? texteFil : ""}
      </p>

      <button
        type="button"
        onClick={() => majFil({ type: fil.ouvert ? "veille" : "reprise" })}
        aria-label={fil.ouvert ? t("fil.masquerLong") : t("fil.afficherLong")}
        className="press shrink-0 rounded-md border border-sand/20 px-2 py-1 text-[0.62rem] font-semibold text-sand/60 transition-colors duration-200 hover:border-sand/40 hover:text-sand motion-reduce:transition-none"
      >
        {fil.ouvert ? t("fil.masquer") : t("fil.afficher")}
      </button>
    </div>
  );

  /* ——— Briques réutilisées par les trois vues ——— */

  const Etiquette = ({ statut }: { statut: string }) => (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${TONS[statut]}`}
    >
      {t(`statuts.${statut}`)}
    </span>
  );

  /**
   * Décider, puis rattraper le curseur.
   *
   * Le bouton qu'on vient d'actionner est démonté dans l'instant : au
   * clavier, le focus retombe sur <body> et l'on se retrouve éjecté en
   * haut du document au moment exact où l'on décide. On l'envoie donc
   * sur la décision suivante, ou sur le titre de la file quand il n'y
   * en a plus. Différé d'un tour de boucle : le temps que React ait
   * remplacé la liste.
   */
  const decider = (
    type: "valider" | "refuser",
    id: string,
    evenement: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const liste = evenement.currentTarget.closest("ul");
    agir({ type, id });
    setTimeout(() => {
      const suivant = liste?.querySelector<HTMLButtonElement>("li button");
      // isConnected est indispensable : quand la dernière ligne part,
      // React démonte la liste entière et le nœud capturé plus haut se
      // retrouve détaché — il contient encore ses anciens boutons, et
      // focus() sur un élément détaché ne fait rien du tout.
      if (suivant?.isConnected) suivant.focus();
      else document.getElementById(TITRE_FILE)?.focus();
    }, 0);
  };

  const LigneDemande = ({
    demande,
    actions,
  }: {
    demande: Demande;
    actions?: boolean;
  }) => (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line py-3 last:border-0">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">
          {personne(demande.personne).nom}
        </span>
        <span className="block text-xs text-ink-soft">
          {formaterPeriode(demande)} · {t(`motifs.${demande.motif}`)} ·{" "}
          {t("conges.jours", { n: joursOuvres(demande.debut, demande.fin) })}
        </span>
      </span>
      {actions && demande.statut === "attente" ? (
        <span className="flex gap-2">
          <button
            type="button"
            className={BOUTON_PLEIN}
            onClick={(e) => decider("valider", demande.id, e)}
          >
            <Check className="size-3.5" aria-hidden="true" />
            {t("conges.valider")}
          </button>
          <button
            type="button"
            className={BOUTON_CONTOUR}
            onClick={(e) => decider("refuser", demande.id, e)}
          >
            <X className="size-3.5" aria-hidden="true" />
            {t("conges.refuser")}
          </button>
        </span>
      ) : (
        <Etiquette statut={demande.statut} />
      )}
    </li>
  );

  return (
    <Fenetre titre={t("fenetre")} pied={pied}>
      {/* ——— Barre de l'application : identité, rôle, remise à zéro ——— */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-sand-card px-4 py-3">
        <span className="font-display text-base font-bold tracking-tight text-ink">
          effectif
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">{t("roleLabel")}</legend>
            <span aria-hidden="true" className="text-xs text-ink-soft">
              {t("roleLabel")}
            </span>
            <div className="flex rounded-lg border border-line bg-sand p-0.5">
              {(["salarie", "manager"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={etat.role === r}
                  onClick={() => agir({ type: "role", role: r })}
                  className={`rounded-[0.4rem] px-2.5 py-1 text-xs font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                    etat.role === r
                      ? "bg-ink text-sand-card"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t(`roles.${r}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            className={BOUTON_CONTOUR}
            onClick={() => agir({ type: "reinitialiser", aujourdHui: ancre })}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t("reinitialiser")}
          </button>
        </div>
      </div>

      {/* ——— Navigation ——— */}
      <div className="flex gap-1 border-b border-line bg-sand px-2 pt-2">
        {(["tableau", "conges", "entretiens"] as Onglet[]).map((o) => {
          const actif = onglet === o;
          const compte =
            o === "conges" ? attente.length : o === "entretiens" ? aCaler.length : 0;
          return (
            <button
              key={o}
              type="button"
              aria-current={actif ? "page" : undefined}
              onClick={() => ouvrirOnglet(o)}
              className={`flex items-center gap-2 rounded-t-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                actif
                  ? "bg-sand-card text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {t(`onglets.${o}`)}
              {compte > 0 && (
                <span className="rounded-full bg-terra-hot px-1.5 py-0.5 text-[0.62rem] font-bold text-sand-card">
                  {compte}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-[26rem] bg-sand-card p-4 md:p-5">
        {onglet === "tableau" && (
          <div className="space-y-5">
            <section>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                {t("tableau.titre")}
              </h3>
              {attente.length + aCaler.length === 0 ? (
                <p className={`mt-3 text-sm text-ink-soft ${CREUX}`}>
                  {t("tableau.rien")}
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {attente.length > 0 && (
                    <CarteDecision
                      texte={t("tableau.demandes", { n: attente.length })}
                      bouton={t("tableau.traiter")}
                      onClick={() => ouvrirOnglet("conges")}
                    />
                  )}
                  {aCaler.length > 0 && (
                    <CarteDecision
                      texte={t("tableau.entretiens", { n: aCaler.length })}
                      bouton={t("tableau.traiter")}
                      onClick={() => ouvrirOnglet("entretiens")}
                    />
                  )}
                </div>
              )}
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <section className={CREUX}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                  {t("tableau.absentsTitre")}
                </h3>
                {absents.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-soft">{t("tableau.absentsVide")}</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {absents.map((d) => (
                      <li key={d.id} className="text-sm text-ink">
                        <span className="font-semibold">{personne(d.personne).nom}</span>
                        <span className="text-ink-soft"> — {formaterPeriode(d)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className={CREUX}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                  {t("tableau.equipeTitre")}
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {PERSONNES.map((p) => (
                    <li key={p.id} className="flex justify-between gap-3 text-sm">
                      <span className="text-ink">{p.nom}</span>
                      <span className="text-ink-soft">{t(`services.${p.service}`)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {onglet === "conges" && (
          <VueConges
            etat={etat}
            envoyer={agir}
            ancre={ancre}
            estManager={estManager}
            LigneDemande={LigneDemande}
          />
        )}

        {onglet === "entretiens" && (
          <ul className="space-y-0">
            {etat.entretiens.length === 0 && (
              <li className="text-sm text-ink-soft">{t("entretiens.vide")}</li>
            )}
            {etat.entretiens.map((e) => (
              <LigneEntretien
                key={e.id}
                entretien={e}
                estManager={estManager}
                ancre={ancre}
                envoyer={agir}
                formaterJour={formaterJour}
              />
            ))}
          </ul>
        )}
      </div>
    </Fenetre>
  );
}

/* ——— Le moniteur, repris des démos de la page Démonstrations ——— */

function Fenetre({
  titre,
  pied,
  children,
}: {
  titre: string;
  /** La ligne d'état, posée dans le bâti sous l'écran */
  pied?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.4rem] bg-ink-deep p-2 pt-0 inset-shadow-cisele-sombre shadow-elev-3">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-terra/70" />
          <span className="size-2 rounded-full bg-sand/40" />
          <span className="size-2 rounded-full bg-sage/70" />
        </span>
        <span className="font-mono text-[0.6rem] tracking-wide text-sand/60">{titre}</span>
      </div>
      <div className="overflow-hidden rounded-[0.9rem]">{children}</div>
      {pied}
    </div>
  );
}

function CarteDecision({
  texte,
  bouton,
  onClick,
}: {
  texte: string;
  bouton: string;
  onClick: () => void;
}) {
  return (
    <div className={`${CARTE} flex items-center justify-between gap-3 shadow-elev-1`}>
      <span className="text-sm font-semibold text-ink">{texte}</span>
      {/* Deux cartes portent ce bouton : sans aria-label, un lecteur
          d'écran annonce deux fois « Traiter » sans dire quoi. */}
      <button
        type="button"
        aria-label={`${bouton} : ${texte}`}
        className={BOUTON_PLEIN}
        onClick={onClick}
      >
        {bouton}
      </button>
    </div>
  );
}

/* ——— Congés ——— */

function VueConges({
  etat,
  envoyer,
  ancre,
  estManager,
  LigneDemande,
}: {
  etat: ReturnType<typeof etatInitial>;
  envoyer: (a: Parameters<typeof reduire>[1]) => void;
  ancre: Date;
  estManager: boolean;
  LigneDemande: (p: { demande: Demande; actions?: boolean }) => React.ReactElement;
}) {
  const t = useTranslations("demo");
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [motif, setMotif] = useState<MotifConge>("payes");
  const [erreur, setErreur] = useState<string | null>(null);

  const attente = enAttente(etat);
  const restant = solde(etat.demandes);
  const miennes = etat.demandes.filter((d) => d.personne === MOI);
  const equipe = etat.demandes.filter((d) => d.personne !== MOI && d.statut !== "attente");

  function soumettre(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (!debut || !fin) return setErreur("erreurVide");
    if (fin < debut) return setErreur("erreurOrdre");
    const jours = joursOuvres(debut, fin);
    if (jours === 0) return setErreur("erreurOuvres");
    if (motif !== "sansSolde" && jours > restant) return setErreur("erreurSolde");

    setErreur(null);
    envoyer({ type: "demander", debut, fin, motif });
    setDebut("");
    setFin("");
  }

  if (estManager) {
    return (
      <div className="space-y-6">
        <section>
          <h3
            id={TITRE_FILE}
            tabIndex={-1}
            className="font-display text-lg font-bold tracking-tight text-ink outline-none"
          >
            {t("conges.fileTitre")}
          </h3>
          {attente.length === 0 ? (
            <p className={`mt-3 text-sm text-ink-soft ${CREUX}`}>{t("conges.fileVide")}</p>
          ) : (
            <ul className="mt-1">
              {attente.map((d) => (
                <LigneDemande key={d.id} demande={d} actions />
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
            {t("conges.historiqueTitre")}
          </h3>
          <ul className="mt-1">
            {equipe.map((d) => (
              <LigneDemande key={d.id} demande={d} />
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,14rem)_1fr]">
        <section className={CREUX}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
            {t("conges.soldeTitre")}
          </h3>
          <p className="mt-1 font-display text-4xl font-bold tracking-tight text-ink">
            {restant}
          </p>
          <p className="text-xs text-ink-soft">
            {t("conges.soldeSur", { total: DROIT_ANNUEL })}
          </p>
        </section>

        <section className={CARTE}>
          <h3 className="font-display text-base font-bold tracking-tight text-ink">
            {t("conges.demanderTitre")}
          </h3>
          <form onSubmit={soumettre} className="mt-3 space-y-3">
            {/* Étiquettes reliées par htmlFor, et non en enveloppant le
                champ : autour d'un <select>, le texte des options entre
                dans le nom accessible et donne « MotifCongés payésRTT… ». */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="conge-debut"
                  className="block text-xs font-semibold text-ink-soft"
                >
                  {t("conges.debut")}
                </label>
                <input
                  id="conge-debut"
                  type="date"
                  value={debut}
                  min={enIso(ancre)}
                  onChange={(e) => setDebut(e.target.value)}
                  className={`mt-1 ${CHAMP}`}
                />
              </div>
              <div>
                <label
                  htmlFor="conge-fin"
                  className="block text-xs font-semibold text-ink-soft"
                >
                  {t("conges.fin")}
                </label>
                <input
                  id="conge-fin"
                  type="date"
                  value={fin}
                  min={debut || enIso(ancre)}
                  onChange={(e) => setFin(e.target.value)}
                  className={`mt-1 ${CHAMP}`}
                />
              </div>
              <div>
                <label
                  htmlFor="conge-motif"
                  className="block text-xs font-semibold text-ink-soft"
                >
                  {t("conges.motif")}
                </label>
                <select
                  id="conge-motif"
                  value={motif}
                  onChange={(e) => setMotif(e.target.value as MotifConge)}
                  className={`mt-1 ${CHAMP}`}
                >
                  {MOTIFS.map((m) => (
                    <option key={m} value={m}>
                      {t(`motifs.${m}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div aria-live="polite">
              {erreur && (
                <p className="text-xs font-semibold text-terra-deep">
                  {t(`conges.${erreur}`)}
                </p>
              )}
            </div>

            <button type="submit" className={BOUTON_PLEIN}>
              <CalendarPlus className="size-3.5" aria-hidden="true" />
              {t("conges.envoyer")}
            </button>
          </form>
        </section>
      </div>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
          {t("conges.mesTitre")}
        </h3>
        {miennes.length === 0 ? (
          <p className={`mt-3 text-sm text-ink-soft ${CREUX}`}>{t("conges.mesVide")}</p>
        ) : (
          <ul className="mt-1">
            {miennes.map((d) => (
              <LigneDemande key={d.id} demande={d} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ——— Entretiens ——— */

function LigneEntretien({
  entretien,
  estManager,
  ancre,
  envoyer,
  formaterJour,
}: {
  entretien: Entretien;
  estManager: boolean;
  ancre: Date;
  envoyer: (a: Parameters<typeof reduire>[1]) => void;
  formaterJour: (iso: string) => string;
}) {
  const t = useTranslations("demo");
  const [date, setDate] = useState("");

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line py-3 last:border-0">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">
          {personne(entretien.personne).nom}
        </span>
        <span className="block text-xs text-ink-soft">
          {t(`typesEntretien.${entretien.type}`)}
          {entretien.date ? ` · ${formaterJour(entretien.date)}` : ""}
        </span>
      </span>

      {estManager && entretien.statut === "aPlanifier" && (
        <span className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`date-${entretien.id}`}>
            {t("entretiens.choisirDate")}
          </label>
          <input
            id={`date-${entretien.id}`}
            type="date"
            value={date}
            min={enIso(ancre)}
            onChange={(e) => setDate(e.target.value)}
            className={`${CHAMP} w-auto py-1 text-xs`}
          />
          <button
            type="button"
            disabled={!date}
            className={`${BOUTON_PLEIN} disabled:opacity-45`}
            onClick={() => envoyer({ type: "planifier", id: entretien.id, date })}
          >
            {t("entretiens.planifier")}
          </button>
        </span>
      )}

      {estManager && entretien.statut === "planifie" && (
        <button
          type="button"
          className={BOUTON_CONTOUR}
          onClick={() => envoyer({ type: "cloturer", id: entretien.id })}
        >
          <Check className="size-3.5" aria-hidden="true" />
          {t("entretiens.cloturer")}
        </button>
      )}

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${TONS[entretien.statut]}`}
      >
        {t(`statuts.${entretien.statut}`)}
      </span>
    </li>
  );
}
