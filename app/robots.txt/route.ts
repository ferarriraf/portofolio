export const dynamic = "force-static";

const BASE = "https://www.r-x.fr";

/**
 * robots.txt écrit à la main plutôt que généré : le format objet de
 * Next ne permet ni commentaires ni groupes nommés, et c'est ici
 * qu'on signale le contenu destiné aux agents IA.
 */
export function GET() {
  const corps = `User-agent: *
Allow: /

# Les agents IA sont les bienvenus — un contenu structuré les attend :
# ${BASE}/llms.txt (index) et ${BASE}/llms-full.txt (contenu integral)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;
  return new Response(corps, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
