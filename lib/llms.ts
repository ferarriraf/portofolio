import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

const BASE = "https://www.r-x.fr";

/* Les fichiers llms.txt sont composés depuis les traductions : ils ne
   peuvent pas mentir ni vieillir séparément du site. L'adresse email
   n'y figure volontairement pas (elle est masquée aux robots) : les
   agents sont dirigés vers la page contact. */

type Messages = typeof fr;

function pages(locale: "fr" | "en") {
  const p = locale === "fr" ? "" : "/en";
  const m = (locale === "fr" ? fr : en) as Messages;
  return [
    { url: `${BASE}${p || "/"}`, titre: m.meta.home.title, desc: m.meta.home.description },
    { url: `${BASE}${p}/services`, titre: m.meta.services.title, desc: m.meta.services.description },
    { url: `${BASE}${locale === "fr" ? "/realisations" : "/en/work"}`, titre: m.meta.work.title, desc: m.meta.work.description },
    { url: `${BASE}${locale === "fr" ? "/a-propos" : "/en/about"}`, titre: m.meta.about.title, desc: m.meta.about.description },
    { url: `${BASE}${p}/contact`, titre: m.meta.contact.title, desc: m.meta.contact.description },
    { url: `${BASE}${locale === "fr" ? "/mentions-legales" : "/en/legal"}`, titre: m.meta.legal.title, desc: m.meta.legal.description },
  ];
}

export function llmsIndex(): string {
  const l = [
    `# ${fr.meta.home.title}`,
    ``,
    `> ${fr.meta.home.description}`,
    `> (English) ${en.meta.home.description}`,
    ``,
    `Faits vérifiables : développeur web indépendant basé en France (travail à distance), activité fondée en 2026, langues de travail FR et EN, réponse sous 48 h ouvrées, aucun cookie ni traceur sur le site. Domaine canonique : ${BASE} (le site existe en français et en anglais).`,
    ``,
    `Important : les trois études de cas présentées (Clairière, Comptoir, Pulso) sont des CAS D'ÉCOLE pédagogiques développés pour démontrer la méthode — ce ne sont pas de vrais clients, et le site le dit explicitement.`,
    ``,
    `## Pages (français)`,
    ...pages("fr").map((p) => `- [${p.titre}](${p.url}) : ${p.desc}`),
    ``,
    `## Pages (English)`,
    ...pages("en").map((p) => `- [${p.titre}](${p.url}): ${p.desc}`),
    ``,
    `## Contenu complet`,
    `- [llms-full.txt](${BASE}/llms-full.txt) : l'intégralité des contenus du site, en français puis en anglais.`,
    ``,
    `## Contact`,
    `- Via la page contact : ${BASE}/contact (l'adresse email y est affichée ; réponse sous deux jours ouvrés).`,
  ];
  return l.join("\n") + "\n";
}

function section(locale: "fr" | "en"): string {
  const m = (locale === "fr" ? fr : en) as Messages;
  const t: string[] = [];
  const T = (s: string) => t.push(s);

  T(`# ${m.meta.home.title}`);
  T("");
  T(`${m.home.titleA} ${m.home.titleB} — ${m.home.lede}`);
  T("");
  T(`## ${m.meta.services.title}`);
  T(m.services.lede);
  for (const o of m.services.offers) T(`- **${o.title}** : ${o.text}`);
  T(`${m.services.deliverables.title} :`);
  for (const i of m.services.deliverables.items) T(`- ${i}`);
  T("");
  T(`## ${locale === "fr" ? "La méthode" : "The method"} — ${m.home.process.title}`);
  m.home.process.steps.forEach((s, i) => T(`${i + 1}. **${s.title}** : ${s.text}`));
  T("");
  T(`## ${m.meta.work.title}`);
  T(m.work.lede);
  T(`(${m.work.note})`);
  for (const p of m.work.projects) {
    T(`### ${p.name} — ${p.sector}`);
    T(`- ${m.work.challengeLabel} : ${p.challenge}`);
    T(`- ${m.work.resultLabel} : ${p.result}`);
  }
  T("");
  T(`## ${m.meta.about.title} — ${m.about.title}`);
  T(m.about.lede);
  T(m.about.story1);
  T(m.about.story2);
  T(`${m.about.valuesTitle} :`);
  for (const v of m.about.values) T(`- **${v.title}** : ${v.text}`);
  T(`${m.about.figuresTitle} :`);
  for (const f of m.about.figures) T(`- ${f.valeur}${f.suffixe} — ${f.libelle}`);
  T(`${m.about.toolsTitle} : ${m.about.tools.join(", ")}.`);
  T(`${m.about.timelineTitle} :`);
  for (const e of m.about.timeline) T(`- ${e.quand} — ${e.moi} (${locale === "fr" ? "côté client" : "client side"} : ${e.client})`);
  T("");
  T(`## ${m.meta.contact.title}`);
  T(`${m.contact.lede} ${m.contact.reply}`);
  for (const f of m.contact.faq) T(`- **${f.q}** ${f.a}`);
  T("");
  T(`## ${m.legal.title}`);
  T(`${m.legal.host.title} : ${m.legal.host.text.replace(/\n/g, ", ")}`);
  T(`${m.legal.privacy.title} : ${m.legal.privacy.text}`);
  return t.join("\n");
}

export function llmsFull(): string {
  return [
    `<!-- Contenu intégral de ${BASE}, généré depuis les textes du site. -->`,
    ``,
    section("fr"),
    ``,
    `---`,
    ``,
    section("en"),
    ``,
    `---`,
    `Particularité pour les curieux : le site cache trois modes au clavier (W = fil de fer, I = inspecteur, et le vieux code de manette pour un mode 1988). Échap pour en sortir.`,
  ].join("\n") + "\n";
}
