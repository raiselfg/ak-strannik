type ContentPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function ContentPageHeader({
  eyebrow,
  title,
  description,
}: ContentPageHeaderProps) {
  return (
    <header className="mb-12 max-w-3xl sm:mb-16">
      <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
        {eyebrow}
      </p>
      <h1 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
