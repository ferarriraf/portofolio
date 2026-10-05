import fr from "@/messages/fr.json";
import en from "@/messages/en.json";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

const BASE = "https://www.r-x.fr";

/* Les fichiers llms.txt sont composés depuis les traductions : ils ne
   peuvent pas mentir ni vieillir séparément du site. L'adresse email
   n'y figure volontairement pas (elle est masquée aux robots) : les
   agents sont dirigés vers la page contact. Les chemins viennent du
   routage, jamais recopiés à la main. */

type Messages = typeof fr;
type Locale = "fr" | "en";

const PAGES: { href: AppPathname; ns: keyof Messages["meta"] & string }[] = [
  { href: "/", ns: "home" },
  { href: "/services", ns: "services" },
  { href: "/realisations", ns: "work" },
  { href: "/a-propos", ns: "about" },
  { href: "/contact", ns: "contact" },
  { href: "/mentions-legales", ns: "legal" },
];

function messages(locale: Locale): Messages {
  return (locale === "fr" ? fr : en) as Messages;
}

function pages(locale: Locale) {
  const m = messages(locale);
  return PAGES.filter((p) => p.ns !== "siteName").map((p) => {
    const meta = m.meta[p.ns as Exclude<keyof Messages["meta"], "siteName">];
    return { url: BASE + getPathname({ locale, href: p.href }), titre: meta.title, desc: meta.description };
  });
}

export function llmsIndex(): string {
  const l = [
    `# ${fr.meta.home.title}`,
    ``,
    `> ${fr.meta.home.description}`,
    `> (English) ${en.meta.home.description}`,
    ``,
    `Faits vérifiables : Raf, développeur web indépendant installé dans le Gers (France), travaille à distance avec des clients partout en France ; activité fondée en 2026 ; langues de travail FR et EN ; réponse sous deux jours ouvrés ; aucun cookie ni traceur sur le site. Domaine canonique : ${BASE} (le site existe en français et en anglais).`,
    ``,
    `Important : les deux démonstrations présentées (un site vitrine avec réservation, une prise de rendez-vous en ligne) sont des PROJETS TYPES construits par R-X pour montrer la méthode — ce ne sont pas de vrais clients, et le site le dit explicitement.`,
    ``,
    `Tarifs : pas de grille publique. Un premier échange gratuit d'une demi-heure, puis un devis écrit qui précise ce qui est compris.`,
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
    `- Via la page contact : ${BASE}/contact — un formulaire (nom, email, message) y envoie directement le message, et l'adresse email est affichée juste en dessous pour qui préfère sa propre messagerie. Réponse sous deux jours ouvrés.`,
  ];
  return l.join("\n") + "\n";
}

function section(locale: Locale): string {
  const m = messages(locale);
  const t: string[] = [];
  const T = (s: string) => t.push(s);
  const est = locale === "fr";

  T(`# ${m.meta.home.title}`);
  T("");
  T(`${m.home.titleA} ${m.home.titleB} — ${m.home.lede}`);
  T("");
  T(`## ${m.home.problems.title}`);
  for (const p of m.home.problems.items) T(`- **${p.q}** ${p.r}`);
  T("");
  T(`## ${m.meta.services.title}`);
  T(m.services.lede);
  for (const o of m.services.offers) {
    T(`- **${o.verb} — ${o.title}** : ${o.text} ${m.services.includedLabel} : ${o.included.join(" ; ")}.`);
  }
  T(`${m.services.pricing.title} :`);
  for (const i of m.services.pricing.items) T(`- ${i}`);
  T(`**${m.services.pricing.faqQ}** ${m.services.pricing.faqA}`);
  T("");
  T(`## ${m.home.process.eyebrow} — ${m.home.process.title}`);
  m.home.process.steps.forEach((s, i) => T(`${i + 1}. **${s.title}** : ${s.text}`));
  T("");
  T(`## ${m.meta.work.title}`);
  T(m.work.lede);
  T(`(${m.work.note})`);
  for (const p of m.work.projects) {
    T(`### ${p.name} — ${p.sector}`);
    T(`- ${m.work.needLabel} : ${p.need}`);
    T(`- ${m.work.deliveredLabel} : ${p.delivered}`);
  }
  T("");
  T(`## ${m.meta.about.title} — ${m.about.title}`);
  T(m.about.lede);
  T(m.about.who.p1);
  T(m.about.who.p2);
  T(`${m.about.facts.title} : ${m.about.facts.items.map((f) => `${f.label} — ${f.value}`).join(" ; ")}.`);
  T(`${m.about.how.title} :`);
  for (const e of m.about.how.steps) T(`- ${e.quand} — ${e.moi} (${est ? "côté client" : "client side"} : ${e.client})`);
  T(`${m.about.principles.title} :`);
  for (const v of m.about.principles.items) T(`- **${v.title}** : ${v.text}`);
  T("");
  T(`## ${m.meta.contact.title}`);
  T(`${m.contact.lede} ${m.contact.reply}`);
  for (const f of m.contact.faq) T(`- **${f.q}** ${f.a}`);
  T("");
  T(`## ${m.legal.title}`);
  T(`${m.legal.editor.title} : ${m.legal.editor.text.replace(/\n/g, " ")}`);
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
  ].join("\n") + "\n";
}
