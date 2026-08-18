import { notFound } from "next/navigation";

/** Toute URL inconnue sous une locale valide affiche la page 404 localisée. */
export default function CatchAllPage() {
  notFound();
}
