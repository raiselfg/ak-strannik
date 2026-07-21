export default function EventsLoading() {
  return (
    <div className="space-y-8" role="status">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="h-48 animate-pulse rounded-xl bg-muted" key={item} />
        ))}
      </div>
      <span className="sr-only">Загрузка событий…</span>
    </div>
  );
}
