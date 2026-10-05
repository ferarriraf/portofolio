/**
 * Le logotype : R-X, le tiret en terracotta. Il prend la couleur du
 * texte qui l'entoure (papier ou encre) et ne bouge pas au survol.
 */
export default function Logo() {
  return (
    <span className="inline-block font-display text-[1.75rem] leading-none font-[800] tracking-[-0.05em] text-current">
      R<span className="text-terra-hot">-</span>X
    </span>
  );
}
