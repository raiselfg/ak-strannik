export default function MediaLoading() {
  return <div className="space-y-8"><div className="h-24 animate-pulse rounded-xl bg-muted" /><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-xl bg-muted" />)}</div></div>;
}
