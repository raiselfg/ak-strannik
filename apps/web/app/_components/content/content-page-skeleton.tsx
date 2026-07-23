export function ContentPageSkeleton() {
  return (
    <div
      className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8"
      aria-hidden="true"
    >
      <div className="container mx-auto animate-pulse">
        <div className="mb-14 max-w-3xl space-y-4">
          <div className="h-4 w-28 rounded-full bg-muted/50" />
          <div className="h-16 w-3/4 rounded-3xl bg-muted/45" />
          <div className="h-20 rounded-3xl bg-muted/30" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 rounded-4xl bg-muted/35" />
          <div className="h-96 rounded-4xl bg-muted/25" />
        </div>
      </div>
    </div>
  );
}
