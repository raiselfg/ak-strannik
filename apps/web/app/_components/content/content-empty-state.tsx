export function ContentEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-4xl border border-border/45 bg-card/45 px-6 py-14 text-center text-lg text-muted-foreground shadow-xl shadow-background/25 backdrop-blur-sm">
      {message}
    </div>
  );
}
