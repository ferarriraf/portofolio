type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede?: string;
};

/** L'en-tête des pages intérieures : étiquette, titre, chapeau. Sur papier. */
export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <header className="container-site pt-12 pb-12 md:pt-20 md:pb-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="titre-1 mt-5 max-w-4xl text-ink">{title}</h1>
      {lede && <p className="lede mt-6">{lede}</p>}
    </header>
  );
}
