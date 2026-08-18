import { writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Outil de développement uniquement : reçoit une capture de canvas
 * (data URL) et l'écrit sur disque pour inspection visuelle, ou dans
 * public/ pour générer les images de secours de l'anneau.
 * Répond 404 en production.
 */
const TARGETS: Record<string, string> = {
  preview:
    "/tmp/claude-1000/-home-doudou-Documents-Sites-Web-git-r-x/3794c88c-ed39-409d-82b7-18e15a75aa36/scratchpad/ring-shot.jpg",
  "ring-far": path.join(process.cwd(), "public", "ring-far.png"),
  "ring-near": path.join(process.cwd(), "public", "ring-near.png"),
};

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }
  const name = new URL(req.url).searchParams.get("f") ?? "preview";
  const target = TARGETS[name];
  if (!target) return new Response("Bad name", { status: 400 });
  const dataUrl = await req.text();
  const b64 = dataUrl.split(",")[1] ?? "";
  await writeFile(target, Buffer.from(b64, "base64"));
  return new Response("ok");
}
