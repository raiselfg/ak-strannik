export default function UstaLoading() {
  return (
    <div className="space-y-8" role="status">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="h-[36rem] animate-pulse rounded-xl bg-muted" />
      <span className="sr-only">Загрузка раздела «Уста»…</span>
    </div>
  );
}
