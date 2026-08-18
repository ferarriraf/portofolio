import { writeFile } from "node:fs/promises";

/**
 * Outil de développement uniquement : reçoit une capture du canvas
 * WebGL (data URL) et l'écrit sur disque pour inspection visuelle.
 * Répond 404 en production. À supprimer avant mise en ligne.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }
  const dataUrl = await req.text();
  const b64 = dataUrl.split(",")[1] ?? "";
  const path = "/tmp/claude-1000/-home-doudou-Documents-Sites-Web-git-r-x/3794c88c-ed39-409d-82b7-18e15a75aa36/scratchpad/ring-shot.jpg";
  await writeFile(path, Buffer.from(b64, "base64"));
  return new Response("ok");
}
