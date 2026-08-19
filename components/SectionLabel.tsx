type SectionLabelProps = {
  /** Numéro de section, affiché en Nº00X */
  n?: number;
  children: React.ReactNode;
  /** Sur fond sombre */
  invert?: boolean;
};

/**
 * L'étiquette de section : un anneau, un numéro, le libellé.
 * La numérotation donne au site son rythme de sommaire.
 */
export default function SectionLabel({
  n,
  children,
  invert = false,
}: SectionLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-[0.78rem] font-semibold tracking-[0.18em] uppercase ${
        invert ? "text-sage" : "text-sage-deep"
      }`}
    >
      {typeof n === "number" && (
        <>
          <span className={invert ? "text-sand/60" : "text-ink/45"}>
            Nº{String(n).padStart(3, "0")}
          </span>
          <span
            aria-hidden="true"
            className={`size-1 rounded-full ${
              invert ? "bg-terra" : "bg-terra-strong"
            }`}
          />
        </>
      )}
      {children}
    </span>
  );
}
