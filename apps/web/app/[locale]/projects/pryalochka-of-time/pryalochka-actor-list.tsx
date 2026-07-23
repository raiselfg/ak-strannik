import type { PublicPryalochkaActor } from '@/features/pryalochka-of-time/queries';

export function PryalochkaActorList({
  actors,
  title,
}: {
  actors: PublicPryalochkaActor[];
  title: string;
}) {
  if (actors.length === 0) return null;

  return (
    <section>
      <h2 className="font-hand text-4xl font-bold sm:text-5xl">{title}</h2>
      <ol className="mt-7 grid gap-5 md:grid-cols-2">
        {actors.map((actor) => (
          <li
            key={actor.id}
            className="rounded-4xl border border-border/45 bg-card/45 p-6 shadow-xl shadow-background/25"
          >
            <h3 className="text-xl font-semibold">{actor.name}</h3>
            <p className="mt-4 leading-8 whitespace-pre-line text-muted-foreground">
              {actor.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
