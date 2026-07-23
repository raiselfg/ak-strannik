export function TeamMemberPageSkeleton() {
  return (
    <div
      className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8"
      aria-hidden="true"
    >
      <div className="container mx-auto grid animate-pulse gap-8 lg:grid-cols-[minmax(18rem,0.75fr)_1.25fr]">
        <div className="aspect-4/5 rounded-4xl border border-border/30 bg-muted/40" />
        <div className="min-h-96 rounded-4xl border border-border/30 bg-muted/30" />
      </div>
    </div>
  );
}
