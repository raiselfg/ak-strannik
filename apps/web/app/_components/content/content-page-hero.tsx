export function ContentPageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="relative mb-14 overflow-hidden rounded-[2.5rem] border border-border/45 bg-card/55 px-7 py-12 shadow-2xl shadow-background/30 backdrop-blur-sm sm:px-10 sm:py-16 lg:px-14">
      <div className="bg-gold/12 absolute -top-32 -right-20 size-80 rounded-full blur-3xl" />
      <div className="absolute right-8 bottom-0 h-28 w-28 rotate-12 rounded-t-full border border-gold/15 sm:right-16 sm:h-40 sm:w-40" />
      <div className="relative max-w-4xl">
        <p className="text-gold text-xs font-semibold tracking-[0.28em] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-hand mt-5 text-5xl leading-[0.92] font-bold tracking-[0.5px] sm:text-7xl lg:text-8xl">
          {title}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  );
}
