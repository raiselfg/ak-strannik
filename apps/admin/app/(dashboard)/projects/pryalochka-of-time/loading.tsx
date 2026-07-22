export default function PryalochkaOfTimeLoading() {
  return (
    <div className="space-y-8" role="status">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="h-[42rem] animate-pulse rounded-xl bg-muted" />
      <span className="sr-only">Загрузка раздела «Прялочка времени»…</span>
    </div>
  );
}
